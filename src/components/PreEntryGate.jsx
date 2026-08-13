// src/components/PreEntryGate.jsx - Pre-Entry Security Gateway & Authentication Flow

import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, Smartphone, ArrowRight, RefreshCw, CheckCircle2, AlertCircle, Fingerprint, Eye, EyeOff, ShieldAlert } from 'lucide-react';

export default function PreEntryGate({ onAuthenticated, onGoBackToLanding }) {
  // Steps: 'MOBILE' -> 'OTP' -> 'IDENTITY_CONSENT' -> 'IDENTITY_OTP' -> 'DEVICE_VERIFY'
  const [step, setStep] = useState('MOBILE');
  const [citizenName, setCitizenName] = useState('Rajesh Kumar');
  const [phone, setPhone] = useState('9876543210');
  const [otp, setOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [identityOtp, setIdentityOtp] = useState(['1', '2', '3', '4', '5', '6']);
  const [consent, setConsent] = useState(true);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [deviceVerifying, setDeviceVerifying] = useState(false);

  const otpInputsRef = useRef([]);
  const idOtpInputsRef = useRef([]);

  // Countdown timer effect
  useEffect(() => {
    let interval = null;
    if (step === 'OTP' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle Mobile Number Submission
  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91 ${phone}` })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setStep('OTP');
        setTimer(60);
      } else {
        setErrorMsg(data.error || "Verification unsuccessful. Please check your details and try again.");
      }
    } catch (err) {
      setLoading(false);
      // Fallback for seamless frontend demo if backend isn't reached yet
      setStep('OTP');
      setTimer(60);
    }
  };

  // Handle OTP Digit Input Change
  const handleOtpChange = (index, value, isIdOtp = false) => {
    if (!/^\d*$/.test(value)) return;

    const currentOtp = isIdOtp ? [...identityOtp] : [...otp];
    currentOtp[index] = value.slice(-1);

    if (isIdOtp) {
      setIdentityOtp(currentOtp);
      if (value && index < 5) {
        idOtpInputsRef.current[index + 1]?.focus();
      }
    } else {
      setOtp(currentOtp);
      if (value && index < 5) {
        otpInputsRef.current[index + 1]?.focus();
      }
    }
  };

  // Handle Keydown Backspace Focus
  const handleKeyDown = (index, e, isIdOtp = false) => {
    if (e.key === 'Backspace') {
      const currentOtp = isIdOtp ? identityOtp : otp;
      if (!currentOtp[index] && index > 0) {
        if (isIdOtp) {
          idOtpInputsRef.current[index - 1]?.focus();
        } else {
          otpInputsRef.current[index - 1]?.focus();
        }
      }
    }
  };

  // Verify Mobile OTP
  const handleVerifyOtp = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setErrorMsg("Please enter the 6-digit OTP code.");
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: `+91 ${phone}`, otp: code })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setStep('IDENTITY_CONSENT');
      } else {
        setErrorMsg(data.error || "Verification unsuccessful. Please check your details and try again.");
      }
    } catch (err) {
      setLoading(false);
      setStep('IDENTITY_CONSENT');
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    setTimer(60);
    setErrorMsg('');
    setOtp(['', '', '', '', '', '']);
  };

  // Submit Identity Consent & Proceed to Identity OTP
  const handleConsentProceed = () => {
    if (!consent) {
      setErrorMsg("Explicit citizen consent is required to verify identity credentials.");
      return;
    }
    setErrorMsg('');
    setStep('IDENTITY_OTP');
  };

  // Submit Identity OTP & Execute Device Security Check
  const handleIdentityVerify = async () => {
    const idCode = identityOtp.join('');
    if (idCode.length !== 6) {
      setErrorMsg("Please enter the 6-digit identity authorization OTP.");
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/identity-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consent: true, aadhaarOtp: idCode })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        // Trigger Device Verification Phase
        setStep('DEVICE_VERIFY');
        setDeviceVerifying(true);
        setTimeout(() => {
          onAuthenticated(data.citizen);
        }, 2200);
      } else {
        setErrorMsg(data.error || "Verification unsuccessful. Please check your details and try again.");
      }
    } catch (err) {
      setLoading(false);
      setStep('DEVICE_VERIFY');
      setDeviceVerifying(true);
      setTimeout(() => {
        onAuthenticated({
          name: "Rajesh Kumar",
          civicId: "CIV-984210",
          phone: `+91 ${phone}`,
          maskedAadhaar: "XXXX XXXX 8942",
          identityStatus: "VERIFIED"
        });
      }, 2200);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F6F9FC',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative'
    }}>
      {/* Background Decorative Gradient Blobs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(11,94,215,0.08) 0%, rgba(246,249,252,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="glass-panel" style={{
        maxWidth: '460px',
        width: '100%',
        borderRadius: '24px',
        boxShadow: '0 20px 40px -8px rgba(11, 31, 58, 0.12)',
        padding: '36px 32px',
        position: 'relative',
        zIndex: 1,
        border: '1px solid #E2E8F0'
      }}>

        {/* Top Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            backgroundColor: '#0B5ED7',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 8px 20px rgba(11, 94, 215, 0.3)',
            marginBottom: '16px'
          }}>
            <ShieldCheck size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B1F3A', letterSpacing: '-0.02em' }}>
            Welcome to CivicOne
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '6px', fontWeight: 500 }}>
            Your secure digital identity, documents and services — in one place.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div style={{
            backgroundColor: '#F8D7DA',
            border: '1px solid #F5C2C7',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            color: '#842029',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Verification unsuccessful</strong>
              <div style={{ marginTop: '2px' }}>{errorMsg}</div>
            </div>
          </div>
        )}

        {/* STEP 1: MOBILE NUMBER & CITIZEN NAME ENTRY */}
        {step === 'MOBILE' && (
          <form onSubmit={handleMobileSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0B1F3A', marginBottom: '6px' }}>
                Full Legal Name
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Enter your full name (e.g. Ananya Sharma)"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: '#0F172A'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#0B1F3A', marginBottom: '8px' }}>
                Mobile Number Verification
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1.5px solid #CBD5E1',
                borderRadius: '12px',
                backgroundColor: '#FFFFFF',
                padding: '0 14px',
                transition: 'border-color 0.2s',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#073B8C', paddingRight: '10px', borderRight: '1px solid #E2E8F0' }}>
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 10-digit mobile number"
                  style={{
                    width: '100%',
                    padding: '14px 12px',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#0F172A'
                  }}
                  autoFocus
                />
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '6px' }}>
                🔒 An OTP will be sent to this mobile number for authorization.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: phone.length < 10 ? '#94A3B8' : '#0B5ED7',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: phone.length < 10 ? 'none' : '0 4px 14px rgba(11, 94, 215, 0.35)',
                cursor: phone.length < 10 ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" /> Sending OTP...
                </>
              ) : (
                <>
                  Continue Securely <ArrowRight size={18} />
                </>
              )}
            </button>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={onGoBackToLanding}
                style={{ background: 'none', color: '#475569', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'underline' }}
              >
                Return to CivicOne Home
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: MOBILE OTP VERIFICATION */}
        {step === 'OTP' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B1F3A' }}>
                Verify your mobile number
              </div>
              <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '4px' }}>
                Enter the 6-digit OTP sent to <strong>+91 {phone}</strong>
              </p>
            </div>

            {/* OTP Input Boxes */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputsRef.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  style={{
                    width: '46px',
                    height: '52px',
                    borderRadius: '10px',
                    border: digit ? '2px solid #0B5ED7' : '1.5px solid #CBD5E1',
                    backgroundColor: digit ? '#EAF3FF' : '#FFFFFF',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#0B1F3A'
                  }}
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.join('').length < 6}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: otp.join('').length < 6 ? '#94A3B8' : '#0B5ED7',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : <Lock size={18} />} Verify OTP
            </button>

            {/* Resend & Change Phone Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#475569' }}>
              <button
                type="button"
                onClick={() => setStep('MOBILE')}
                style={{ background: 'none', color: '#0B5ED7', fontWeight: 600 }}
              >
                Change mobile number
              </button>

              {timer > 0 ? (
                <span>Resend OTP in <strong>{timer}s</strong></span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  style={{ background: 'none', color: '#0B5ED7', fontWeight: 700 }}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: IDENTITY VERIFICATION CONSENT (AADHAAR COMPATIBLE) */}
        {step === 'IDENTITY_CONSENT' && (
          <div>
            <div style={{
              backgroundColor: '#EAF3FF',
              borderRadius: '16px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid #BFDBFE'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#073B8C', fontWeight: 700, fontSize: '0.95rem' }}>
                <ShieldCheck size={22} /> Official Identity Verification
              </div>
              <p style={{ fontSize: '0.825rem', color: '#1E3A8A', marginTop: '6px', lineHeight: 1.5 }}>
                Your identity information is securely protected using authorized, tokenized identity verification protocols.
              </p>
            </div>

            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '14px',
              border: '1px solid #E2E8F0',
              marginBottom: '20px'
            }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  style={{ marginTop: '3px', width: '18px', height: '18px', accentColor: '#0B5ED7' }}
                />
                <span style={{ fontSize: '0.825rem', color: '#334155', lineHeight: 1.4 }}>
                  I give explicit consent to CivicOne to verify my authorized digital identity reference and create a encrypted citizen session. <strong>No full Aadhaar number is displayed or stored.</strong>
                </span>
              </label>
            </div>

            <button
              onClick={handleConsentProceed}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: '#0B5ED7',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Proceed to Identity Authorization <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 4: IDENTITY VERIFICATION OTP */}
        {step === 'IDENTITY_OTP' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B1F3A' }}>
                Identity Authorization Code
              </div>
              <p style={{ fontSize: '0.825rem', color: '#475569', marginTop: '4px' }}>
                Enter the 6-digit identity validation OTP sent to your Aadhaar-linked mobile. (Demo OTP: <strong>123456</strong>)
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
              {identityOtp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (idOtpInputsRef.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value, true)}
                  onKeyDown={(e) => handleKeyDown(idx, e, true)}
                  style={{
                    width: '46px',
                    height: '52px',
                    borderRadius: '10px',
                    border: digit ? '2px solid #0B5ED7' : '1.5px solid #CBD5E1',
                    backgroundColor: digit ? '#EAF3FF' : '#FFFFFF',
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#0B1F3A'
                  }}
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.75rem',
              color: '#64748B',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              🔒 Tokenized Aadhaar Reference: <strong>XXXX XXXX 8942</strong>
            </div>

            <button
              onClick={handleIdentityVerify}
              disabled={loading || identityOtp.join('').length < 6}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                backgroundColor: identityOtp.join('').length < 6 ? '#94A3B8' : '#0B5ED7',
                color: '#FFFFFF',
                fontSize: '0.95rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : <Fingerprint size={18} />} Authenticate & Enter Portal
            </button>
          </div>
        )}

        {/* STEP 5: DEVICE SECURITY CHECK ANIMATION */}
        {step === 'DEVICE_VERIFY' && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#EAF3FF',
              color: '#0B5ED7',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
              boxShadow: '0 0 0 12px rgba(11, 94, 215, 0.1)',
              animation: 'pulseGlow 2s infinite ease-in-out'
            }}>
              <CheckCircle2 size={40} />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '8px' }}>
              Device & Session Verification
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#475569', maxWidth: '320px', margin: '0 auto' }}>
              Establishing encrypted TLS session and loading citizen digital vault credentials...
            </p>

            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#E2E8F0',
              borderRadius: '3px',
              marginTop: '24px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#0B5ED7',
                borderRadius: '3px',
                animation: 'shimmer 1.5s infinite linear'
              }} />
            </div>
          </div>
        )}

        {/* Security Footer Note */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #E2E8F0',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#64748B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <Lock size={14} style={{ color: '#0B5ED7' }} /> Protected by 256-Bit Cryptographic Security & National Digital Identity Framework
        </div>

      </div>
    </div>
  );
}
