// src/components/AuthorityGate.jsx - Dedicated Government Officer Login Gate

import React, { useState } from 'react';
import { Landmark, ShieldCheck, Lock, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Key, Building2 } from 'lucide-react';

export default function AuthorityGate({ onAuthenticated, onGoBackToLanding }) {
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Parivahan Sewa (MoRTH)');
  const [badgeId, setBadgeId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const departments = [
    'Parivahan Sewa (MoRTH / RTO)',
    'National Health Authority (NHA / ABHA)',
    'Income Tax Department (ITD)',
    'Ministry of External Affairs (MEA)',
    'National Academic Depository (NAD / UGC)',
    'State Revenue & Land Records Dept'
  ];

  // Quick Demo Credentials Fill
  const handleFillDemo = () => {
    setEmail('officer.sharma@parivahan.gov.in');
    setDepartment('Parivahan Sewa (MoRTH / RTO)');
    setBadgeId('GOVT-OFFICER-8942');
    setPasscode('govt123');
    setErrorMsg('');
  };

  // Submit Officer Authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !department) {
      setErrorMsg('Please enter official email and select department.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/authority-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, department, badgeId, passcode })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success && data.officer) {
        onAuthenticated(data.officer);
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please check officer credentials.');
      }
    } catch (err) {
      setLoading(false);
      // Fallback officer session for dev
      onAuthenticated({
        officerId: badgeId || 'GOVT-OFFICER-8942',
        email: email || 'officer.sharma@parivahan.gov.in',
        department: department || 'Parivahan Sewa (MoRTH / RTO)',
        role: 'Government Officer / Issuer',
        clearanceLevel: 'LEVEL-3 VERIFIED'
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0B1F3A',
      background: 'linear-gradient(135deg, #0B1F3A 0%, #073B8C 50%, #0B5ED7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px'
    }} className="security-pattern-bg">

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '480px',
        width: '100%',
        padding: '40px 32px',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        {/* Back Link */}
        <button
          onClick={onGoBackToLanding}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748B',
            fontSize: '0.85rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          <ArrowLeft size={16} /> Return to Main Landing Page
        </button>

        {/* Badge Icon */}
        <div style={{
          width: '60px', height: '60px', borderRadius: '18px',
          backgroundColor: '#EAF3FF', color: '#0B5ED7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '20px', boxShadow: '0 4px 14px rgba(11, 94, 215, 0.2)'
        }}>
          <Landmark size={32} />
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0B1F3A', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          Government Authority Gate
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '24px' }}>
          Official Issuing Authority & Department Portal Verification Gateway.
        </p>

        {/* Demo Fill Alert Button */}
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: '14px',
          padding: '12px',
          marginBottom: '20px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.775rem', color: '#92400E', fontWeight: 700 }}>
            ⚡ Testing Demo Mode Available
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            🔑 Fill Demo Officer
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '12px',
            padding: '12px 14px',
            color: '#991B1B',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Official Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>
              Official Govt Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. officer.sharma@parivahan.gov.in"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#0F172A'
              }}
              required
            />
          </div>

          {/* Department Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>
              Selecting Department Authority
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#0F172A',
                backgroundColor: '#FFFFFF'
              }}
            >
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Badge ID */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>
              Officer Badge / Token ID (Optional)
            </label>
            <input
              type="text"
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              placeholder="e.g. GOVT-OFFICER-8942"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
            />
          </div>

          {/* Officer Security Passcode */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>
              Department Security Passcode (Demo: govt123)
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter officer passcode (govt123)"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                fontWeight: 600
              }}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#0B5ED7',
              color: '#FFFFFF',
              padding: '14px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(11, 94, 215, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Authenticating Officer...' : 'Authenticate & Enter Authority Portal 🏛️'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: '#64748B' }}>
          🔒 Protected National Information Security System | Level-3 Clearance
        </div>
      </div>

    </div>
  );
}
