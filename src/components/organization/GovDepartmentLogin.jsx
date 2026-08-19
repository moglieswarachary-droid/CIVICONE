// src/components/organization/GovDepartmentLogin.jsx - Centered Login Component for Government Departments

import React, { useState } from 'react';
import { ShieldCheck, Lock, Building2, ChevronLeft, AlertCircle, ArrowRight } from 'lucide-react';
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
  "Delhi NCR",
  "Jammu & Kashmir",
  "Ladakh",
  "Puducherry"
];

const POLICE_BRANCHES = [
  "Traffic Police",
  "Crime Branch",
  "Law & Order",
  "Cyber Crime",
  "Women & Child Protection",
  "CID (Crime Investigation Department)",
  "Intelligence Branch",
  "Special Branch",
  "Economic Offences Wing (EOW)",
  "Anti-Corruption Bureau (ACB)",
  "Railway Police (GRP)"
];

export default function GovDepartmentLogin({ orgConfig, onLoginSuccess, onGoBack }) {
  const deptId = orgConfig?.id || 'police';
  const config = ORGANIZATION_CONFIGS[deptId] || orgConfig || ORGANIZATION_CONFIGS['police'];

  // Form State
  const [state, setState] = useState('Andhra Pradesh');
  const [policeBranch, setPoliceBranch] = useState('Traffic Police');
  const [officeCode, setOfficeCode] = useState(() => {
    if (deptId === 'police') return 'PS-AP-101';
    if (deptId === 'rto') return 'AP-16';
    if (deptId === 'passport') return 'PO-AP-04';
    if (deptId === 'revenue') return 'REV-AP-102';
    if (deptId === 'election') return 'ECI-AP-88';
    if (deptId === 'identity_authority') return 'UIDAI-RO-VJA';
    if (deptId === 'municipal') return 'VMC-WARD-14';
    return 'GOVT-AP-101';
  });
  const [officeName, setOfficeName] = useState(() => {
    if (deptId === 'rto') return 'RTO Vijayawada';
    if (deptId === 'municipal') return 'Vijayawada Municipal Corporation';
    return '';
  });
  const [email, setEmail] = useState(() => {
    if (deptId === 'police') return 'inspector.verma@police.gov.in';
    if (deptId === 'rto') return 'rto.vijayawada@gov.in';
    if (deptId === 'passport') return 'passport.vja@gov.in';
    if (deptId === 'revenue') return 'tehsildar.vja@gov.in';
    if (deptId === 'election') return 'electoral.vja@eci.gov.in';
    if (deptId === 'identity_authority') return 'officer.vja@uidai.gov.in';
    if (deptId === 'municipal') return 'commissioner@vmc.ap.gov.in';
    return 'officer@gov.in';
  });
  const [password, setPassword] = useState('govt123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide officer email and access passcode.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      const officerSession = {
        officerId: `GOVT-${Math.floor(1000 + Math.random() * 9000)}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email,
        department: config.name,
        deptId: config.id,
        state,
        policeBranch: deptId === 'police' ? policeBranch : null,
        policeStationCode: deptId === 'police' ? officeCode : null,
        officeCode,
        officeName: officeName || `${config.name} (${state})`,
        roleTitle: config.roles?.[0] || 'Government Officer',
        clearanceStatus: 'LEVEL-3 VERIFIED',
        sessionToken: `GOVT-AUTH-${Date.now()}-SECURE`
      };

      if (onLoginSuccess) {
        onLoginSuccess(officerSession);
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
        <ChevronLeft size={18} /> Back to Organizations
      </button>

      {/* Centered Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.12)',
        overflow: 'hidden',
        animation: 'fadeInUp 0.3s ease-out'
      }}>
        {/* Card Header */}
        <div style={{
          backgroundColor: '#0B1F3A',
          padding: '32px 28px 24px',
          color: '#FFFFFF',
          position: 'relative',
          textAlign: 'center'
        }}>
          {/* Dept Badge Icon */}
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            margin: '0 auto 16px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            {config.logoEmoji || '🏛️'}
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            color: '#93C5FD',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
            border: '1px solid rgba(147, 197, 253, 0.3)'
          }}>
            <ShieldCheck size={14} /> Government Sector Portal
          </div>

          <h1 style={{
            fontSize: '1.45rem',
            fontWeight: 800,
            marginBottom: '6px',
            letterSpacing: '-0.01em'
          }}>
            {config.name} Login
          </h1>

          <p style={{
            fontSize: '0.85rem',
            color: '#94A3B8',
            maxWidth: '380px',
            margin: '0 auto',
            lineHeight: 1.45
          }}>
            State Level Authorized Officer & Department Verification Gateway
          </p>
        </div>

        {/* Security Alert Banner */}
        <div style={{
          backgroundColor: '#EFF6FF',
          borderBottom: '1px solid #DBEAFE',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#1E40AF',
          fontSize: '0.775rem',
          fontWeight: 600
        }}>
          <Lock size={14} style={{ flexShrink: 0 }} />
          <span>Restricted to Authorized Government Personnel. All logins are audited.</span>
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

          {/* 1. State / Union Territory Selection */}
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

          {/* 2. Police Specific Branch Dropdown */}
          {deptId === 'police' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Police Branch / Special Division <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                value={policeBranch}
                onChange={(e) => setPoliceBranch(e.target.value)}
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
                {POLICE_BRANCHES.map((branch) => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
          )}

          {/* 3. Office Code / Station Code Field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              {deptId === 'police' ? 'Police Station Code' : deptId === 'rto' ? 'RTO Office Code' : deptId === 'passport' ? 'Passport Office Code' : 'Department Office Code'} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={officeCode}
              onChange={(e) => setOfficeCode(e.target.value)}
              placeholder="e.g. PS-AP-101 / AP-16"
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

          {/* 4. RTO or Municipal Name Input (Where Applicable) */}
          {(deptId === 'rto' || deptId === 'municipal') && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                {deptId === 'rto' ? 'RTO Name' : 'Municipal Office Name'} <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={officeName}
                onChange={(e) => setOfficeName(e.target.value)}
                placeholder={deptId === 'rto' ? 'RTO Vijayawada' : 'Vijayawada Municipal Corporation'}
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
          )}

          {/* 5. Official Government Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Authorized Official Email <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer.name@gov.in"
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

          {/* 6. Security Passcode */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Password / Access Passcode <span style={{ color: '#EF4444' }}>*</span>
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
              Use demo code: <code style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>govt123</code>
            </span>
          </div>

          {/* Login Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: '#0B5ED7',
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
              boxShadow: '0 4px 14px rgba(11, 94, 215, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            {loading ? 'Authenticating...' : `Login to ${config.name}`}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}
