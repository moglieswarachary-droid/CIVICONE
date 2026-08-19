// src/components/organization/EduDepartmentLogin.jsx - Centered Login Component for Education Institutions

import React, { useState } from 'react';
import { ShieldCheck, Lock, GraduationCap, ChevronLeft, AlertCircle, ArrowRight } from 'lucide-react';
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

const SCHOOL_BOARDS = [
  "State Board of Secondary Education",
  "CBSE (Central Board of Secondary Education)",
  "ICSE / CISCE (Council for the Indian School Certificate Examinations)",
  "International Baccalaureate (IB)",
  "National Institute of Open Schooling (NIOS)",
  "Other Recognized Education Board"
];

export default function EduDepartmentLogin({ orgConfig, onLoginSuccess, onGoBack }) {
  const eduId = orgConfig?.id || 'college';
  const config = ORGANIZATION_CONFIGS[eduId] || orgConfig || ORGANIZATION_CONFIGS['college'];

  // Form States
  const [state, setState] = useState('Andhra Pradesh');
  const [universityName, setUniversityName] = useState('Jawaharlal Nehru Technological University');
  const [boardName, setBoardName] = useState('CBSE (Central Board of Secondary Education)');
  const [institutionName, setInstitutionName] = useState(() => {
    if (eduId === 'college') return 'Kuppam Engineering College';
    if (eduId === 'intermediate') return 'Sri Chaitanya Junior College';
    if (eduId === 'school') return 'Delhi Public School (DPS)';
    if (eduId === 'technology') return 'National Skill Development & Tech Center';
    return 'Example Educational Institution';
  });
  const [code, setCode] = useState(() => {
    if (eduId === 'college') return 'KEC-001';
    if (eduId === 'intermediate') return 'INT-AP-201';
    if (eduId === 'school') return 'SCH-CBSE-401';
    if (eduId === 'technology') return 'TECH-SKILL-801';
    return 'EDU-101';
  });
  const [email, setEmail] = useState(() => {
    if (eduId === 'college') return 'admin@examplecollege.edu.in';
    if (eduId === 'intermediate') return 'principal@jrcollege.edu.in';
    if (eduId === 'school') return 'admin@dpsschool.edu.in';
    if (eduId === 'technology') return 'director@techinstitute.org.in';
    return 'admin@edu.in';
  });
  const [password, setPassword] = useState('edu123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !code) {
      setError('Please provide institution code, official email, and access password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      const eduSession = {
        institutionId: code,
        name: institutionName,
        universityName: eduId === 'college' ? universityName : null,
        boardName: eduId === 'school' || eduId === 'intermediate' ? boardName : null,
        email,
        eduId,
        state,
        code,
        roleTitle: config.roles?.[0] || 'Institution Admin',
        clearanceStatus: 'VERIFIED ACADEMIC ENTITY',
        sessionToken: `EDU-AUTH-${Date.now()}-SECURE`
      };

      if (onLoginSuccess) {
        onLoginSuccess(eduSession);
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
        <ChevronLeft size={18} /> Back to Education Organizations
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
        {/* Card Header */}
        <div style={{
          backgroundColor: '#064E3B',
          padding: '32px 28px 24px',
          color: '#FFFFFF',
          position: 'relative',
          textAlign: 'center'
        }}>
          {/* Institution Logo */}
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
            {config.logoEmoji || '🎓'}
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            color: '#A7F3D0',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
            border: '1px solid rgba(167, 243, 208, 0.3)'
          }}>
            <ShieldCheck size={14} /> Education Sector Portal
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
            Authorized Academic Institution &amp; Student Verification Portal
          </p>
        </div>

        {/* Security Alert Banner */}
        <div style={{
          backgroundColor: '#ECFDF5',
          borderBottom: '1px solid #A7F3D0',
          padding: '10px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#065F46',
          fontSize: '0.775rem',
          fontWeight: 600
        }}>
          <Lock size={14} style={{ flexShrink: 0 }} />
          <span>Restricted to Authorized Educational Personnel (Simulated Integration)</span>
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

          {/* 2. College / University Specific: University Name */}
          {eduId === 'college' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Affiliated University Name <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <input
                type="text"
                value={universityName}
                onChange={(e) => setUniversityName(e.target.value)}
                placeholder="e.g. Jawaharlal Nehru Technological University"
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

          {/* 3. School / Intermediate Specific: Education Board */}
          {(eduId === 'school' || eduId === 'intermediate') && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Education Board <span style={{ color: '#EF4444' }}>*</span>
              </label>
              <select
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
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
                {SCHOOL_BOARDS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          )}

          {/* 4. College / School / Institution Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              {eduId === 'college' ? 'College Name' : eduId === 'intermediate' ? 'Junior College / PUC Name' : eduId === 'school' ? 'School Name' : 'Institution Name'} <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              placeholder="e.g. Kuppam Engineering College"
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

          {/* 5. Institution Code */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Institution Code <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. KEC-001 / SCH-401"
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

          {/* 6. Official Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Official Institutional Email <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@examplecollege.edu.in"
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

          {/* 7. Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Password / Access Code <span style={{ color: '#EF4444' }}>*</span>
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
              Use demo password: <code style={{ backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>edu123</code>
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: '#059669',
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
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
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
