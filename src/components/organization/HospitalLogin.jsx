// src/components/organization/HospitalLogin.jsx - Centered Login Component for Government & Private Hospitals

import React, { useState } from 'react';
import { HeartPulse, ShieldCheck, Lock, ChevronLeft, AlertCircle, ArrowRight, Activity } from 'lucide-react';
import { ORGANIZATION_CONFIGS } from '../../config/organizationConfig.js';

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi NCR"
];

export default function HospitalLogin({ orgConfig, onLoginSuccess, onGoBack }) {
  const hospId = orgConfig?.id || 'gov_hospital';
  const config = ORGANIZATION_CONFIGS[hospId] || orgConfig || ORGANIZATION_CONFIGS['gov_hospital'];
  const isGov = hospId === 'gov_hospital' || config?.slug?.includes('gov');

  // Form States (Sections 3 & 4)
  const [state, setState] = useState('Andhra Pradesh');
  const [hospitalName, setHospitalName] = useState(() => {
    if (isGov) return 'Government General Hospital, Vijayawada';
    return 'Apollo Specialty Hospital';
  });
  const [code, setCode] = useState(() => {
    if (isGov) return 'GH-AP-VJA-001';
    return 'PH-TN-CHE-402';
  });
  const [email, setEmail] = useState(() => {
    if (isGov) return 'admin@hospital.gov.in';
    return 'admin@apollohospital.com';
  });
  const [password, setPassword] = useState('hosp123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !code || !hospitalName) {
      setError('Please fill in all hospital login parameters.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      const hospitalSession = {
        hospitalId: code,
        name: hospitalName,
        hospId,
        hospitalType: isGov ? 'government' : 'private',
        hospitalTypeTitle: isGov ? 'Government Hospital' : 'Private Hospital',
        state,
        code,
        email,
        roleTitle: isGov ? 'Chief Medical Officer' : 'Medical Director',
        clearanceStatus: 'VERIFIED HEALTHCARE ENTITY',
        sessionToken: `HOSP-AUTH-${Date.now()}-SECURE`
      };

      if (onLoginSuccess) {
        onLoginSuccess(hospitalSession);
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      backgroundColor: '#F8FAFC',
      backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)',
      backgroundSize: '24px 24px',
      position: 'relative'
    }}>
      {/* Top Back Navigation */}
      <button
        onClick={onGoBack}
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#FFFFFF',
          color: '#334155',
          border: '1px solid #CBD5E1',
          padding: '8px 16px',
          borderRadius: '12px',
          fontWeight: 600,
          fontSize: '0.875rem',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'all 0.2s ease'
        }}
      >
        <ChevronLeft size={18} /> Back to Healthcare Organizations
      </button>

      {/* Centered Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '490px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.12)',
        overflow: 'hidden',
        animation: 'fadeInUp 0.3s ease-out'
      }}>
        {/* Card Header with Distinct Visual Accent */}
        <div style={{
          backgroundColor: isGov ? '#065F46' : '#1E1B4B',
          padding: '32px 28px 24px',
          color: '#FFFFFF',
          position: 'relative',
          textAlign: 'center'
        }}>
          {/* Hospital Logo Emoji */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 16px',
            border: '1px solid rgba(255,255,255,0.25)'
          }}>
            {config.logoEmoji || (isGov ? '🏥' : '🏨')}
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: isGov ? 'rgba(16, 185, 129, 0.2)' : 'rgba(168, 85, 247, 0.2)',
            color: isGov ? '#A7F3D0' : '#E9D5FF',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
            border: isGov ? '1px solid rgba(167, 243, 208, 0.3)' : '1px solid rgba(233, 213, 255, 0.3)'
          }}>
            <HeartPulse size={14} /> Healthcare Sector • {isGov ? 'Government Facility' : 'Private Network'}
          </div>

          <h1 style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            marginBottom: '6px',
            letterSpacing: '-0.01em'
          }}>
            {config.name} Login
          </h1>

          <p style={{
            fontSize: '0.85rem',
            color: '#D1D5DB',
            maxWidth: '380px',
            margin: '0 auto',
            lineHeight: 1.45
          }}>
            Authorized Emergency Healthcare &amp; Medical Verification Gateway
          </p>
        </div>

        {/* Security Alert Banner */}
        <div style={{
          backgroundColor: '#FEF2F2',
          borderBottom: '1px solid #FCA5A5',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#991B1B',
          fontSize: '0.775rem',
          fontWeight: 600
        }}>
          <Lock size={14} style={{ flexShrink: 0 }} />
          <span>Restricted to Authorized Hospital Personnel (Simulated Integration)</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '28px' }}>
          {error && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* 1. State Selection */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              State / Union Territory <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                outline: 'none'
              }}
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* 2. Hospital Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Hospital Name <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={hospitalName}
              onChange={(e) => setHospitalName(e.target.value)}
              placeholder="Government General Hospital / Apollo Specialty"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                color: '#0F172A',
                outline: 'none'
              }}
              required
            />
          </div>

          {/* 3. Hospital Code */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Hospital Code <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="GH-AP-VJA-001"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                color: '#0F172A',
                outline: 'none'
              }}
              required
            />
          </div>

          {/* 4. Official Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Official Hospital Email <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hospital.gov.in"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                color: '#0F172A',
                outline: 'none'
              }}
              required
            />
          </div>

          {/* 5. Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Password / Security Code <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                color: '#0F172A',
                outline: 'none'
              }}
              required
            />
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginTop: '4px' }}>
              Use demo password: <code style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>hosp123</code>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: isGov ? '#059669' : '#4F46E5',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              fontWeight: 700,
              fontSize: '0.975rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: isGov ? '0 4px 14px rgba(5, 150, 105, 0.3)' : '0 4px 14px rgba(79, 70, 229, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'Authenticating...' : `Login to Hospital Portal`}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}
