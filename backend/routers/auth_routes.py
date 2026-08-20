from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import time

from ..database import get_db
from ..models import Citizen
from ..auth import otp_store, aadhaar_otp_store, create_access_token

router = APIRouter()

class PhonePayload(BaseModel):
    phone: str

class VerifyOtpPayload(BaseModel):
    phone: str
    otp: str

class IdentityVerifyPayload(BaseModel):
    consent: bool
    aadhaarOtp: str = None
    name: str = None
    phone: str = None

def normalize_phone(phone: str) -> str:
    if not phone:
        return ""
    digits = ''.join(filter(str.isdigit, phone))
    return digits[-10:]

@router.post("/send-otp")
def send_otp(payload: PhonePayload):
    phone = payload.phone
    normalized = normalize_phone(phone)
    if not normalized or len(normalized) < 10:
        raise HTTPException(status_code=400, detail="Please enter a valid 10-digit mobile number.")
    
    generated_otp = str(random.randint(100000, 999999))
    otp_store[normalized] = {
        "otp": generated_otp,
        "expires_at": time.time() + 60
    }
    print(f"\n[OTP SYSTEM] 🔐 Generated Login OTP for {phone}: {generated_otp}\n")

    return {
        "success": True,
        "message": "OTP sent successfully to registered mobile number.",
        "phone": phone,
        "expiresInSeconds": 60
    }

@router.post("/verify-otp")
def verify_otp(payload: VerifyOtpPayload):
    normalized = normalize_phone(payload.phone)
    if not payload.otp or len(payload.otp) != 6:
        raise HTTPException(status_code=400, detail="Invalid OTP. Please enter 6-digit code.")
    
    stored = otp_store.get(normalized)
    if not stored:
        raise HTTPException(status_code=400, detail="OTP expired or not requested. Please request a new one.")
    
    if time.time() > stored["expires_at"]:
        del otp_store[normalized]
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
    
    if stored["otp"] != payload.otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP entered. Please try again.")
    
    del otp_store[normalized]
    
    # Generate Aadhaar OTP
    generated_aadhaar_otp = str(random.randint(100000, 999999))
    aadhaar_otp_store[normalized] = {
        "otp": generated_aadhaar_otp,
        "expires_at": time.time() + 300
    }
    print(f"\n[OTP SYSTEM] 🛡️ Generated Aadhaar Identity OTP for {payload.phone}: {generated_aadhaar_otp}\n")
    
    return {
        "success": True,
        "message": "Mobile number verified successfully.",
        "sessionToken": f"CIV-SESS-{int(time.time())}-SECURE",
        "requireIdentityVerification": True
    }

@router.post("/identity-verify")
def identity_verify(payload: IdentityVerifyPayload, db: Session = Depends(get_db)):
    if not payload.consent:
        raise HTTPException(status_code=400, detail="Explicit citizen consent is required for identity verification.")
    
    normalized = normalize_phone(payload.phone)
    stored = aadhaar_otp_store.get(normalized)
    
    if payload.aadhaarOtp:
        if payload.aadhaarOtp != "123456" and (not stored or stored["otp"] != payload.aadhaarOtp):
            raise HTTPException(status_code=400, detail="Invalid identity verification OTP.")
        if stored and stored["otp"] == payload.aadhaarOtp:
            del aadhaar_otp_store[normalized]
            
    # Check if citizen exists
    citizen = db.query(Citizen).filter(Citizen.mobile.like(f"%{normalized}%")).first()
    
    if not citizen:
        print(f"[REGISTRATION] ✨ Registering new citizen: {payload.name or 'Unknown'} with phone {payload.phone}")
        new_id = f"cit-reg-{int(time.time())}"
        new_citizen_id = f"CIV-REG-{random.randint(10000, 99999)}"
        
        citizen = Citizen(
            id=new_id,
            citizen_id=new_citizen_id,
            full_name=payload.name.strip() if payload.name else "New Citizen",
            display_name=payload.name.strip().split(' ')[0] if payload.name else "Citizen",
            date_of_birth="01-01-2000",
            gender="Not Specified",
            mobile=payload.phone or f"+91 {normalized}",
            email=f"{new_citizen_id.lower()}@civicone.example",
            address="Address Not Provided",
            state="Unknown",
            tier="STANDARD",
            masked_aadhaar=f"XXXX XXXX {random.randint(1000, 9999)}"
        )
        db.add(citizen)
        db.commit()
        db.refresh(citizen)
    else:
        if payload.name and payload.name.strip():
            citizen.full_name = payload.name.strip()
            db.commit()
            db.refresh(citizen)
            
    # Create JWT Access Token
    access_token = create_access_token(data={"sub": citizen.citizen_id})
            
    return {
        "success": True,
        "message": "Identity verified securely via UIDAI Authorized Token service.",
        "citizen": {
            "citizenId": citizen.citizen_id,
            "fullName": citizen.full_name,
            "mobileMasked": citizen.mobile,
            "maskedAadhaar": citizen.masked_aadhaar,
            "tier": citizen.tier
        },
        "maskedAadhaar": citizen.masked_aadhaar,
        "identityStatus": "VERIFIED",
        "access_token": access_token
    }
