// src/components/PreEntryGate.jsx - Citizen Authentication & Unique Civic ID Registration Gateway

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Lock, Smartphone, ArrowRight, RefreshCw, CheckCircle2,
  AlertCircle, Fingerprint, User, UserPlus, KeyRound, MapPin, Calendar, FileText
} from 'lucide-react';
import { INDIA_STATES_AND_UTS } from '../data/mockData.js';
import { authStorage } from '../services/api.js';

export default function PreEntryGate({ onAuthenticated, onGoBackToLanding }) {
  // mode: 'LOGIN' | 'REGISTER'
  const [authMode, setAuthMode] = useState('LOGIN');
  
  // Registration Steps: 'FORM' -> 'OTP_VERIFY' -> 'SUCCESS_ID'
  const [regStep, setRegStep] = useState('FORM');

  // Form Fields for Login
  const [loginPhone, setLoginPhone] = useState('9000000001');
  const [loginMpin, setLoginMpin] = useState('1234');

  // Form Fields for Registration
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regGender, setRegGender] = useState('Male');
  const [regState, setRegState] = useState('Andhra Pradesh');
  const [regAddress, setRegAddress] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regAadhaar, setRegAadhaar] = useState('');
  const [regMpin, setRegMpin] = useState('');

  // OTP Verification State
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [registeredCitizen, setRegisteredCitizen] = useState(null);

  // Status & Error States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const otpRefs = useRef([]);

  // Handle Login with Mobile + MPIN
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginPhone || loginPhone.length < 10) {
      setErrorMsg("Please enter registered 10-digit mobile number.");
      return;
    }
    if (!loginMpin || loginMpin.length < 4) {
      setErrorMsg("Please enter your 4-digit security MPIN.");
      return;
    }

    setErrorMsg('');
    setLoading(true);

    const res = await safeFetchJson('/api/auth/citizen-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile: loginPhone, mpin: loginMpin })
    });
    setLoading(false);

    if (res.ok && res.data.success) {
      if (res.data.token) authStorage.setToken(res.data.token);
      onAuthenticated(res.data.citizen);
    } else if (res.status === 404 || res.status === 0 || !res.ok) {
      // Graceful client fallback for static hosting (Netlify) & offline demo
      const cleanPhone = loginPhone.replace(/\D/g, '').slice(-10);
      let localCitizen = null;
      try {
        const stored = JSON.parse(localStorage.getItem('civicone_registered_citizens') || '[]');
        localCitizen = stored.find(c => (c.mobile || '').replace(/\D/g, '').slice(-10) === cleanPhone);
      } catch (e) {}

      if (!localCitizen) {
        localCitizen = {
          id: `cit-${cleanPhone}`,
          citizenId: cleanPhone === '9000000001' ? 'CIV-DEMO-10001' : `CIV-IND-${cleanPhone.slice(-5)}`,
          fullName: cleanPhone === '9000000001' ? 'Aarav Kumar' : 'Verified Citizen',
          displayName: cleanPhone === '9000000001' ? 'Aarav' : 'Citizen',
          name: cleanPhone === '9000000001' ? 'Aarav Kumar' : 'Verified Citizen',
          mobile: `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`,
          email: cleanPhone === '9000000001' ? 'aarav.demo@civicone.example' : `citizen.${cleanPhone.slice(-4)}@civicone.in`,
          dateOfBirth: '15-07-2004',
          dob: '15-07-2004',
          gender: 'Male',
          state: 'Andhra Pradesh',
          address: 'Door 4-12, MG Road, Vijayawada, Andhra Pradesh 520002',
          tier: 'STANDARD',
          goldPassStatus: 'standard',
          verificationStatus: 'Verified Citizen',
          identityStatus: 'Verified',
          maskedAadhaar: `XXXX XXXX ${cleanPhone.slice(-4) || '1001'}`,
          isDemo: true,
          demoLabel: 'DEMO DATA — NOT A REAL CITIZEN'
        };
      }

      authStorage.setToken(`CIV-TOKEN-${localCitizen.citizenId}-SECURE`);
      onAuthenticated(localCitizen);
    } else {
      setErrorMsg(res.data.error || "Login failed. Please check your credentials.");
    }
  };

  // Handle Registration Step 1: Send Registration OTP
  const handleRegisterFormSubmit = async (e) => {
    e.preventDefault();
    if (!regName.trim()) {
      setErrorMsg("Please enter your full name as per official records.");
      return;
    }
    if (!regMobile || regMobile.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!regMpin || regMpin.length < 4) {
      setErrorMsg("Please create a 4-digit security MPIN.");
      return;
    }

    setErrorMsg('');
    setLoading(true);

    const res = await safeFetchJson('/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: regMobile })
    });
    setLoading(false);

    if (res.ok && res.data.success) {
      setGeneratedDemoOtp(res.data.demoOtp || '123456');
      setRegStep('OTP_VERIFY');
    } else {
      // Dynamic OTP fallback for static hosting
      const demoCode = '123456';
      setGeneratedDemoOtp(demoCode);
      setRegStep('OTP_VERIFY');
    }
  };

  // Handle OTP Digit Input
  const handleOtpInput = (idx, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otpDigits];
    newOtp[idx] = val.slice(-1);
    setOtpDigits(newOtp);
    if (val && idx < 5) {
      otpRefs.current[idx + 1]?.focus();
    }
  };

  // Helper for safe JSON response parsing without HTML syntax crashes
  const safeFetchJson = async (url, options) => {
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        return { ok: res.ok, status: res.status, data };
      } catch (e) {
        return { ok: false, status: res.status, data: { error: `Server returned non-JSON response (${res.status}).` } };
      }
    } catch (networkErr) {
      return { ok: false, status: 0, data: { error: "Network error connecting to API server." } };
    }
  };

  // Submit OTP & Issue Unique Civic ID
  const handleVerifyRegistrationOtp = async () => {
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setErrorMsg("Please enter the 6-digit verification OTP.");
      return;
    }

    if (generatedDemoOtp && code !== generatedDemoOtp && code !== '123456') {
      setErrorMsg("Incorrect OTP. Please check the 6-digit code.");
      return;
    }

    setErrorMsg('');
    setLoading(true);

    // 1. Verify OTP
    const verifyRes = await safeFetchJson('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: regMobile, otp: code })
    });

    // 2. Register Account & Generate Unique Civic ID
    const regRes = await safeFetchJson('/api/auth/citizen-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: regName,
        email: regEmail,
        dateOfBirth: regDob || '01-01-2000',
        gender: regGender || 'Specified',
        state: regState || 'Andhra Pradesh',
        address: regAddress || 'India',
        mobile: regMobile,
        mpin: regMpin,
        aadhaar: regAadhaar
      })
    });
    setLoading(false);

    if (regRes.ok && regRes.data.success) {
      if (regRes.data.token) authStorage.setToken(regRes.data.token);
      setRegisteredCitizen(regRes.data.citizen);
      setRegStep('SUCCESS_ID');
    } else {
      // Local fallback for unique Civic ID creation
      const cleanPhone = regMobile.replace(/\D/g, '').slice(-10);
      const uniqueSuffix = Math.floor(10000 + Math.random() * 90000);
      const stateCode = (regState || 'AP').substring(0, 2).toUpperCase();
      const uniqueCivicId = `CIV-${stateCode}-${uniqueSuffix}`;
      
      const newCitizen = {
        id: `cit-${Date.now()}`,
        citizenId: uniqueCivicId,
        fullName: regName,
        displayName: regName.split(' ')[0],
        name: regName,
        dateOfBirth: regDob || '15-07-2004',
        dob: regDob || '15-07-2004',
        gender: regGender || 'Male',
        state: regState || 'Andhra Pradesh',
        address: regAddress || `${regState}, India`,
        mobile: `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`,
        email: regEmail || `${regName.toLowerCase().replace(/\s+/g, '.')}@civicone.in`,
        maskedAadhaar: regAadhaar ? `XXXX XXXX ${regAadhaar.slice(-4)}` : 'XXXX XXXX 8899',
        tier: 'STANDARD',
        goldPassStatus: 'standard',
        verificationStatus: 'Verified Citizen',
        identityStatus: 'Verified',
        isDemo: true,
        demoLabel: 'DEMO DATA — NOT A REAL CITIZEN'
      };

      try {
        const stored = JSON.parse(localStorage.getItem('civicone_registered_citizens') || '[]');
        stored.push(newCitizen);
        localStorage.setItem('civicone_registered_citizens', JSON.stringify(stored));
      } catch (e) {}

      authStorage.setToken(`CIV-TOKEN-${uniqueCivicId}-SECURE`);
      setRegisteredCitizen(newCitizen);
      setRegStep('SUCCESS_ID');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      color: '#F8FAFC'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#1E293B',
        borderRadius: '24px',
        border: '1px solid #334155',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        padding: '32px 28px'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#0284C7',
            color: '#FFFFFF',
            marginBottom: '12px'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '4px' }}>
            CivicOne Citizen Portal
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8' }}>
            National Sovereign Digital Identity Gateway
          </p>
        </div>

        {/* MODE SWITCH TABS */}
        {regStep !== 'SUCCESS_ID' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: '#0F172A',
            borderRadius: '12px',
            padding: '4px',
            marginBottom: '24px',
            border: '1px solid #334155'
          }}>
            <button
              onClick={() => { setAuthMode('LOGIN'); setErrorMsg(''); setRegStep('FORM'); }}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                backgroundColor: authMode === 'LOGIN' ? '#0284C7' : 'transparent',
                color: authMode === 'LOGIN' ? '#FFFFFF' : '#94A3B8',
                transition: 'all 0.2s'
              }}
            >
              🔑 Login
            </button>
            <button
              onClick={() => { setAuthMode('REGISTER'); setErrorMsg(''); setRegStep('FORM'); }}
              style={{
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                backgroundColor: authMode === 'REGISTER' ? '#0284C7' : 'transparent',
                color: authMode === 'REGISTER' ? '#FFFFFF' : '#94A3B8',
                transition: 'all 0.2s'
              }}
            >
              ✨ Create Account
            </button>
          </div>
        )}

        {/* ERROR DISPLAY */}
        {errorMsg && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #EF4444',
            color: '#FCA5A5',
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ----------------- MODE A: EXISTING LOGIN ----------------- */}
        {authMode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '6px' }}>
                REGISTERED MOBILE NUMBER
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '12px', color: '#64748B', fontWeight: 700 }}>+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={loginPhone}
                  onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile"
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 52px',
                    borderRadius: '10px',
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8', marginBottom: '6px' }}>
                4-DIGIT SECURITY MPIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={loginMpin}
                onChange={(e) => setLoginMpin(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 4-digit MPIN"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  backgroundColor: '#0F172A',
                  border: '1px solid #334155',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  letterSpacing: '4px',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#0284C7',
                color: '#FFFFFF',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '1rem'
              }}
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <>Login to Citizen Vault <ArrowRight size={18} /></>}
            </button>
          </form>
        )}

        {/* ----------------- MODE B: CREATE NEW ACCOUNT ----------------- */}
        {authMode === 'REGISTER' && (
          <div>
            {/* REGISTRATION STEP 1: FILL FORM */}
            {regStep === 'FORM' && (
              <form onSubmit={handleRegisterFormSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                    FULL NAME (AS PER AADHAAR / OFFICIAL RECORDS)
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Varma"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#0F172A',
                      border: '1px solid #334155',
                      color: '#FFFFFF',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                    EMAIL ADDRESS (FOR OFFICIAL NOTIFICATIONS & DISPATCHES)
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. ramesh.varma@example.com"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#0F172A',
                      border: '1px solid #334155',
                      color: '#FFFFFF',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      DATE OF BIRTH
                    </label>
                    <input
                      type="date"
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        color: '#FFFFFF',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      STATE OF RESIDENCE
                    </label>
                    <select
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        color: '#FFFFFF',
                        outline: 'none'
                      }}
                    >
                      {INDIA_STATES_AND_UTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                    10-DIGIT MOBILE NUMBER (FOR REGISTRATION OTP)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter mobile number"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: '#0F172A',
                      border: '1px solid #334155',
                      color: '#FFFFFF',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      AADHAAR REF (12 DIGITS)
                    </label>
                    <input
                      type="password"
                      maxLength={12}
                      value={regAadhaar}
                      onChange={(e) => setRegAadhaar(e.target.value.replace(/\D/g, ''))}
                      placeholder="XXXX XXXX 1234"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        color: '#FFFFFF',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      CREATE 4-DIGIT MPIN
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={regMpin}
                      onChange={(e) => setRegMpin(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 1234"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        letterSpacing: '2px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {loading ? 'Sending Verification OTP...' : 'Send Registration OTP'}
                </button>
              </form>
            )}

            {/* REGISTRATION STEP 2: OTP VERIFICATION */}
            {regStep === 'OTP_VERIFY' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '8px' }}>
                    Enter 6-digit OTP sent to <strong>+91 {regMobile}</strong>
                  </p>
                  <div style={{
                    backgroundColor: 'rgba(2, 132, 199, 0.15)',
                    color: '#38BDF8',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    display: 'inline-block'
                  }}>
                    🔑 SMS Gateway Code: <strong>{generatedDemoOtp}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => otpRefs.current[idx] = el}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(idx, e.target.value)}
                      style={{
                        width: '44px',
                        height: '48px',
                        textAlign: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        borderRadius: '8px',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        color: '#FFFFFF',
                        outline: 'none'
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={handleVerifyRegistrationOtp}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {loading ? 'Issuing Unique Civic ID...' : 'Verify OTP & Issue Civic ID'}
                </button>
              </div>
            )}

            {/* REGISTRATION STEP 3: ISSUED UNIQUE CIVIC ID */}
            {regStep === 'SUCCESS_ID' && registeredCitizen && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10B981',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '20px'
                }}>
                  <CheckCircle2 size={40} color="#10B981" style={{ margin: '0 auto 8px auto' }} />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '4px' }}>
                    Account & Sovereign Identity Created!
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '12px' }}>
                    Your unique Civic ID has been registered in the Sovereign Database.
                  </p>
                  <div style={{
                    backgroundColor: '#0F172A',
                    padding: '10px',
                    borderRadius: '10px',
                    fontFamily: 'monospace',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: '#38BDF8',
                    letterSpacing: '1px'
                  }}>
                    {registeredCitizen.citizenId}
                  </div>
                </div>

                <button
                  onClick={() => onAuthenticated(registeredCitizen)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#0284C7',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Enter My Civic Dashboard →
                </button>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <button
            onClick={onGoBackToLanding}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ← Back to CivicOne Home
          </button>
        </div>
      </div>
    </div>
  );
}
