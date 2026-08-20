from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class Citizen(Base):
    __tablename__ = "citizens"

    id = Column(String, primary_key=True, index=True)
    citizen_id = Column(String, unique=True, index=True)
    full_name = Column(String)
    display_name = Column(String)
    date_of_birth = Column(String)
    gender = Column(String)
    mobile = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    address = Column(String)
    state = Column(String)
    tier = Column(String, default="STANDARD")
    masked_aadhaar = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    documents = relationship("Document", back_populates="owner")
    consents = relationship("ConsentRecord", back_populates="citizen")

class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    citizen_id = Column(String, ForeignKey("citizens.citizen_id"))
    name = Column(String)
    category = Column(String)
    type = Column(String)
    issuer = Column(String)
    status = Column(String, default="Verified")
    issue_date = Column(String)
    ref_no = Column(String)
    
    owner = relationship("Citizen", back_populates="documents")

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, index=True)
    role_code = Column(String, unique=True, index=True)
    name = Column(String)
    category = Column(String)
    access_level = Column(String)

class ConsentRecord(Base):
    __tablename__ = "consent_records"

    id = Column(String, primary_key=True, index=True)
    citizen_id = Column(String, ForeignKey("citizens.citizen_id"))
    doc_id = Column(String, ForeignKey("documents.id"))
    org_id = Column(String, ForeignKey("organizations.id"))
    purpose = Column(String)
    status = Column(String, default="ACTIVE")
    expiry_date = Column(DateTime)
    
    citizen = relationship("Citizen", back_populates="consents")
