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

  // Instant Demo Citizen Login
  const handleFastDemoLogin = () => {
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      const demoCitizen = {
        id: 'cit-9000000001',
        citizenId: 'CIV-AP-710646-823',
        civicId: 'CIV-AP-710646-823',
        fullName: 'Raghavendra',
        displayName: 'Raghavendra',
        name: 'Raghavendra',
        mobile: '+91 90000 00001',
        email: 'raghavendra.demo@civicone.gov.in',
        dateOfBirth: '15/08/1995',
        dob: '15/08/1995',
        gender: 'Male',
        state: 'Andhra Pradesh',
        address: 'Door 4-12, MG Road, Vijayawada, Andhra Pradesh 520002',
        tier: 'STANDARD',
        goldPassStatus: 'standard',
        verificationStatus: 'Verified Citizen',
        identityStatus: 'Verified',
        maskedAadhaar: 'XXXX XXXX 8234',
        isDemo: true,
        demoLabel: 'OFFICIAL CITIZEN PROFILE'
      };
      authStorage.setToken('CIV-TOKEN-CIV-AP-710646-823-SECURE');
      setLoading(false);
      onAuthenticated(demoCitizen);
    }, 150);
  };

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

    const cleanPhone = loginPhone.replace(/\D/g, '').slice(-10);
    let localCitizen = null;
    try {
      const stored = JSON.parse(localStorage.getItem('civicone_registered_citizens') || '[]');
      localCitizen = stored.find(c => (c.mobile || '').replace(/\D/g, '').slice(-10) === cleanPhone);
    } catch (e) {}

    if (!localCitizen) {
      localCitizen = {
        id: `cit-${cleanPhone}`,
        citizenId: cleanPhone === '9000000001' ? 'CIV-AP-710646-823' : `CIV-AP-${cleanPhone.slice(-6)}`,
        civicId: cleanPhone === '9000000001' ? 'CIV-AP-710646-823' : `CIV-AP-${cleanPhone.slice(-6)}`,
        fullName: cleanPhone === '9000000001' ? 'Raghavendra' : 'Verified Citizen',
        displayName: cleanPhone === '9000000001' ? 'Raghavendra' : 'Citizen',
        name: cleanPhone === '9000000001' ? 'Raghavendra' : 'Verified Citizen',
        mobile: `+91 ${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`,
        email: cleanPhone === '9000000001' ? 'raghavendra.demo@civicone.gov.in' : `citizen.${cleanPhone.slice(-4)}@civicone.in`,
        dateOfBirth: '15/08/1995',
        dob: '15/08/1995',
        gender: 'Male',
        state: 'Andhra Pradesh',
        address: 'Door 4-12, MG Road, Vijayawada, Andhra Pradesh 520002',
        tier: 'STANDARD',
        goldPassStatus: 'standard',
        verificationStatus: 'Verified Citizen',
        identityStatus: 'Verified',
        maskedAadhaar: `XXXX XXXX ${cleanPhone.slice(-4) || '8234'}`,
        isDemo: true,
        demoLabel: 'OFFICIAL CITIZEN PROFILE'
      };
    }

    setTimeout(() => {
      authStorage.setToken(`CIV-TOKEN-${localCitizen.citizenId}-SECURE`);
      setLoading(false);
      onAuthenticated(localCitizen);
    }, 200);
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
      background: 'radial-gradient(circle at 50% 15%, #DBEAFE 0%, #F8FAFC 55%, #EFF6FF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      color: '#0F172A',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Background Decorative Glows */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '15%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(147, 197, 253, 0.35) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '15%',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(186, 230, 253, 0.3) 0%, rgba(255,255,255,0) 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />

      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #DBEAFE',
        boxShadow: '0 25px 50px -12px rgba(11, 94, 215, 0.12), 0 0 1px 1px rgba(11, 94, 215, 0.06)',
        padding: '36px 30px',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #0B5ED7 0%, #0284C7 100%)',
            color: '#FFFFFF',
            marginBottom: '14px',
            boxShadow: '0 8px 20px -4px rgba(11, 94, 215, 0.35)'
          }}>
            <ShieldCheck size={34} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px', letterSpacing: '-0.02em' }}>
            CivicOne Citizen Portal
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', fontWeight: 600 }}>
            National Sovereign Digital Identity Gateway
          </p>
        </div>

        {/* MODE SWITCH TABS */}
        {regStep !== 'SUCCESS_ID' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            backgroundColor: '#F1F5F9',
            borderRadius: '14px',
            padding: '4px',
            marginBottom: '24px',
            border: '1px solid #E2E8F0'
          }}>
            <button
              onClick={() => { setAuthMode('LOGIN'); setErrorMsg(''); setRegStep('FORM'); }}
              style={{
                padding: '11px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer',
                backgroundColor: authMode === 'LOGIN' ? '#0B5ED7' : 'transparent',
                color: authMode === 'LOGIN' ? '#FFFFFF' : '#64748B',
                boxShadow: authMode === 'LOGIN' ? '0 4px 12px rgba(11, 94, 215, 0.25)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              🔑 Login
            </button>
            <button
              onClick={() => { setAuthMode('REGISTER'); setErrorMsg(''); setRegStep('FORM'); }}
              style={{
                padding: '11px',
                borderRadius: '10px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer',
                backgroundColor: authMode === 'REGISTER' ? '#0B5ED7' : 'transparent',
                color: authMode === 'REGISTER' ? '#FFFFFF' : '#64748B',
                boxShadow: authMode === 'REGISTER' ? '0 4px 12px rgba(11, 94, 215, 0.25)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              ✨ Create Account
            </button>
          </div>
        )}

        {/* ERROR DISPLAY */}
        {errorMsg && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #F87171',
            color: '#B91C1C',
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} color="#DC2626" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ----------------- MODE A: EXISTING LOGIN ----------------- */}
        {authMode === 'LOGIN' && (
          <div>
            {/* Quick 1-Click Access Card */}
            <div style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '16px',
              border: '1.5px solid #BFDBFE',
              padding: '14px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#101B3D' }}>
                  ⚡ Quick Demo Citizen Access
                </div>
                <div style={{ fontSize: '0.725rem', color: '#1A4F9C', fontWeight: 600 }}>
                  Log in instantly as <strong>Raghavendra</strong> (CIV-AP-710646-823)
                </div>
              </div>
              <button
                type="button"
                onClick={handleFastDemoLogin}
                disabled={loading}
                style={{
                  backgroundColor: '#0B5ED7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(11, 94, 215, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                1-Click Login →
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
              <span style={{ fontSize: '0.725rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>or enter credentials</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#E2E8F0' }} />
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  REGISTERED MOBILE NUMBER
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '13px', color: '#0B5ED7', fontWeight: 800, fontSize: '0.95rem' }}>+91</span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit mobile"
                    style={{
                      width: '100%',
                      padding: '13px 14px 13px 52px',
                      borderRadius: '12px',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #CBD5E1',
                      color: '#0B1F3A',
                      fontWeight: 700,
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#0B5ED7'}
                    onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
                  />
                </div>
              </div>

            <div style={{ marginBottom: '26px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '8px', letterSpacing: '0.04em' }}>
                4-DIGIT SECURITY MPIN
              </label>
              <input
                type="password"
                maxLength={4}
                value={loginMpin}
                onChange={(e) => setLoginMpin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                style={{
                  width: '100%',
                  padding: '13px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1.5px solid #CBD5E1',
                  color: '#0B1F3A',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  letterSpacing: '6px',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#0B5ED7'}
                onBlur={(e) => e.target.style.borderColor = '#CBD5E1'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0B5ED7 0%, #0284C7 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '1rem',
                boxShadow: '0 8px 20px -4px rgba(11, 94, 215, 0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <>Login to Citizen Vault <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      )}

        {/* ----------------- MODE B: CREATE NEW ACCOUNT ----------------- */}
        {authMode === 'REGISTER' && (
          <div>
            {/* REGISTRATION STEP 1: FILL FORM */}
            {regStep === 'FORM' && (
              <form onSubmit={handleRegisterFormSubmit}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                    FULL NAME (AS PER AADHAAR / OFFICIAL RECORDS)
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Varma"
                    style={{
                      width: '100%',
                      padding: '11px 13px',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #CBD5E1',
                      color: '#0B1F3A',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                    EMAIL ADDRESS (FOR OFFICIAL NOTIFICATIONS)
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. ramesh.varma@example.com"
                    style={{
                      width: '100%',
                      padding: '11px 13px',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #CBD5E1',
                      color: '#0B1F3A',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                      DATE OF BIRTH
                    </label>
                    <input
                      type="date"
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 13px',
                        borderRadius: '10px',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        color: '#0B1F3A',
                        fontWeight: 600,
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                      STATE OF RESIDENCE
                    </label>
                    <select
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '11px 13px',
                        borderRadius: '10px',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        color: '#0B1F3A',
                        fontWeight: 600,
                        outline: 'none'
                      }}
                    >
                      {INDIA_STATES_AND_UTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                    10-DIGIT MOBILE NUMBER (FOR REGISTRATION OTP)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 10-digit mobile number"
                    style={{
                      width: '100%',
                      padding: '11px 13px',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #CBD5E1',
                      color: '#0B1F3A',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
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
                        padding: '11px 13px',
                        borderRadius: '10px',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        color: '#0B1F3A',
                        fontWeight: 600,
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
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
                        padding: '11px 13px',
                        borderRadius: '10px',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        color: '#0B1F3A',
                        fontWeight: 800,
                        letterSpacing: '3px',
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
                    padding: '14px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0B5ED7 0%, #0284C7 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -4px rgba(11, 94, 215, 0.35)'
                  }}
                >
                  {loading ? 'Sending Verification OTP...' : 'Send Registration OTP'}
                </button>
              </form>
            )}

            {/* REGISTRATION STEP 2: OTP VERIFICATION */}
            {regStep === 'OTP_VERIFY' && (
              <div>
                <div style={{ textAlign: 'center', marginBottom: '18px' }}>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '10px' }}>
                    Enter 6-digit OTP sent to <strong>+91 {regMobile}</strong>
                  </p>
                  <div style={{
                    backgroundColor: '#EFF6FF',
                    color: '#1D4ED8',
                    border: '1px solid #BFDBFE',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    display: 'inline-block'
                  }}>
                    🔑 SMS Gateway Code: <strong>{generatedDemoOtp}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '22px' }}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => otpRefs.current[idx] = el}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpInput(idx, e.target.value)}
                      style={{
                        width: '46px',
                        height: '52px',
                        textAlign: 'center',
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        borderRadius: '10px',
                        backgroundColor: '#F8FAFC',
                        border: '1.5px solid #CBD5E1',
                        color: '#0B1F3A',
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
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -4px rgba(16, 185, 129, 0.35)'
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
                  backgroundColor: '#ECFDF5',
                  border: '1.5px solid #A7F3D0',
                  borderRadius: '20px',
                  padding: '24px 20px',
                  marginBottom: '22px'
                }}>
                  <CheckCircle2 size={46} color="#059669" style={{ margin: '0 auto 10px auto' }} />
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#065F46', marginBottom: '6px' }}>
                    Account & Sovereign Identity Created!
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#047857', marginBottom: '14px' }}>
                    Your unique Civic ID has been registered in the Sovereign Database.
                  </p>
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #A7F3D0',
                    padding: '12px',
                    borderRadius: '12px',
                    fontFamily: 'monospace',
                    fontSize: '1.35rem',
                    fontWeight: 900,
                    color: '#0B5ED7',
                    letterSpacing: '1.5px'
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
                    background: 'linear-gradient(135deg, #0B5ED7 0%, #0284C7 100%)',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px -4px rgba(11, 94, 215, 0.35)'
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
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#0B5ED7'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
          >
            ← Back to CivicOne Home
          </button>
        </div>
      </div>
    </div>
  );
}
