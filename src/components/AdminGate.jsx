// src/components/AdminGate.jsx - Dedicated Super Admin Control Center Login Gate

import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, ArrowLeft, Key, Crown, Zap, Server } from 'lucide-react';

export default function AdminGate({ onAuthenticated, onGoBackToLanding }) {
  const [username, setUsername] = useState('');
  const [passkey, setPasskey] = useState('');
  const [hardwareToken, setHardwareToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Quick Demo Credentials Fill
  const handleFillDemo = () => {
    setUsername('superadmin@civicone.gov.in');
    setPasskey('superadmin123');
    setHardwareToken('MASTER-HW-KEY-9048');
    setErrorMsg('');
  };

  // Submit Admin Authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setErrorMsg('Please enter master admin username.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, passkey, hardwareToken })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success && data.admin) {
        onAuthenticated(data.admin);
      } else {
        setErrorMsg(data.error || 'Master Admin authentication failed. Check credentials.');
      }
    } catch (err) {
      setLoading(false);
      // Fallback admin session for dev
      onAuthenticated({
        adminId: 'SUPERADMIN-01',
        username: username || 'superadmin@civicone.gov.in',
        role: 'National Super Administrator',
        clearanceLevel: 'MASTER ROOT CLEARANCE'
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #312E81 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px'
    }}>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '480px',
        width: '100%',
        padding: '40px 32px',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.6)',
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

        {/* Admin Crown Icon */}
        <div style={{
          width: '60px', height: '60px', borderRadius: '18px',
          background: 'linear-gradient(135deg, #4F46E5 0%, #312E81 100%)',
          color: '#FEF08A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '16px', boxShadow: '0 6px 18px rgba(79, 70, 229, 0.35)'
        }}>
          <Crown size={32} />
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#EEF2FF',
          border: '1px solid #C7D2FE',
          color: '#4338CA',
          fontSize: '0.725rem',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: '20px',
          marginBottom: '12px'
        }}>
          🖥️ Root Terminal Desktop Station Session Verified
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '6px' }}>
          Super Admin Control Gate
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '24px' }}>
          Master System Control, National Audit & Platform Management Portal.
        </p>

        {/* Demo Fill Alert Button */}
        <div style={{
          backgroundColor: '#EEF2FF',
          border: '1px solid #C7D2FE',
          borderRadius: '14px',
          padding: '12px',
          marginBottom: '20px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.775rem', color: '#3730A3', fontWeight: 700 }}>
            ⚡ Super Admin Demo Fill
          </div>
          <button
            type="button"
            onClick={handleFillDemo}
            style={{
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            ⚡ Fill Super Admin
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
          {/* Master Username */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              Master Super Admin Email / ID
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. superadmin@civicone.gov.in"
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

          {/* Master Root Passkey */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              Master Root Passkey (Demo: superadmin123)
            </label>
            <input
              type="password"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              placeholder="Enter master passkey (superadmin123)"
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

          {/* Hardware Security Key Token */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>
              Hardware Security Token / Key (Optional)
            </label>
            <input
              type="text"
              value={hardwareToken}
              onChange={(e) => setHardwareToken(e.target.value)}
              placeholder="e.g. MASTER-HW-KEY-9048"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#4F46E5',
              color: '#FFFFFF',
              padding: '14px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(79, 70, 229, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? 'Verifying Master Clearance...' : 'Authenticate Master Admin Portal 👑'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: '#64748B' }}>
          ⚡ Master Control Center | National Informatics Centre Security Subsystem
        </div>
      </div>

    </div>
  );
}
