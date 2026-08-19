// src/components/organization/CompanyLogin.jsx - Centered Login Page for Private Sector Company & Employer Verification

import React, { useState } from 'react';
import { Building2, ShieldCheck, ArrowLeft, AlertCircle, Briefcase, CheckCircle2 } from 'lucide-react';

export default function CompanyLogin({ orgConfig, onLoginSuccess, onGoBack }) {
  const companyTypes = [
    'IT / Software',
    'Manufacturing',
    'Banking / Finance',
    'Healthcare',
    'Education',
    'Retail',
    'E-Commerce',
    'Telecommunications',
    'Construction',
    'Automotive',
    'Logistics',
    'Consulting',
    'Media & Entertainment',
    'Research & Technology',
    'Startup',
    'Other'
  ];

  const [state, setState] = useState('Andhra Pradesh');
  const [companyType, setCompanyType] = useState('IT / Software');
  const [companyName, setCompanyName] = useState('CivicOne Technologies Pvt. Ltd.');
  const [employerCode, setEmployerCode] = useState('EMP-CIVIC-001');
  const [email, setEmail] = useState('hr@company.example');
  const [password, setPassword] = useState('emp123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!state || !companyType || !companyName || !employerCode || !email || !password) {
      setErrorMsg('Please fill in all company login details.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const sessionData = {
        orgId: 'company_employer',
        companyName,
        companyType,
        state,
        employerCode,
        email,
        city: 'Vijayawada',
        industry: companyType,
        roleTitle: 'HR / Talent Acquisition Lead',
        clearanceStatus: 'VERIFIED CORPORATE EMPLOYER',
        sessionToken: `EMP-AUTH-${Date.now()}-SECURE`
      };

      if (onLoginSuccess) {
        onLoginSuccess(sessionData);
      }
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF5FF',
      backgroundImage: 'radial-gradient(#C084FC 0.5px, transparent 0.5px), radial-gradient(#C084FC 0.5px, #FAF5FF 0.5px)',
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 10px 10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justify: 'center',
      padding: '24px 16px'
    }}>
      {/* Top Bar with Go Back */}
      <div style={{ width: '100%', maxWidth: '480px', marginBottom: '16px' }}>
        <button
          onClick={onGoBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#6B21A8',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '4px 0'
          }}
        >
          <ArrowLeft size={18} /> Back to Sector Organizations
        </button>
      </div>

      {/* Main Centered Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #E9D5FF',
        boxShadow: '0 20px 40px rgba(124,58,237,0.08)',
        padding: '32px 28px',
        boxSizing: 'border-box'
      }}>

        {/* Card Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '20px',
            backgroundColor: '#F3E8FF',
            border: '2px solid #DDD6FE',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center',
            fontSize: '1.8rem',
            marginBottom: '12px'
          }}>
            🏢
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#F3E8FF', border: '1px solid #E9D5FF', borderRadius: '12px', padding: '4px 12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              PRIVATE SECTOR • COMPANY &amp; EMPLOYER
            </span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: '4px 0 6px 0' }}>
            Company / Employer Portal
          </h2>

          <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0 }}>
            CivicOne Pre-Employment Background &amp; Credential Verification
          </p>
        </div>

        {/* Prototype Notice */}
        <div style={{
          backgroundColor: '#FAF5FF',
          border: '1px solid #E9D5FF',
          borderRadius: '14px',
          padding: '10px 14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.775rem',
          color: '#6B21A8'
        }}>
          <ShieldCheck size={18} style={{ flexShrink: 0, color: '#7C3AED' }} />
          <div>
            <strong>Simulated Employer Gateway:</strong> Verified candidate education, resume, and experience checks.
          </div>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '0.8rem',
            color: '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* State */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
              State / Jurisdiction
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi NCT">Delhi NCT</option>
            </select>
          </div>

          {/* Company Type Dropdown (Section 2 & 3) */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
              Company Type
            </label>
            <select
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none',
                backgroundColor: '#FFFFFF',
                fontWeight: 700
              }}
            >
              {companyTypes.map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

          {/* Company Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. CivicOne Technologies Pvt. Ltd."
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Employer Code */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
              Company / Employer Code
            </label>
            <input
              type="text"
              value={employerCode}
              onChange={(e) => setEmployerCode(e.target.value)}
              placeholder="e.g. EMP-CIVIC-001"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'monospace',
                fontWeight: 700
              }}
            />
          </div>

          {/* Official Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
              Official Company Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hr@company.example"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '0.925rem',
              fontWeight: 800,
              cursor: isLoading ? 'wait' : 'pointer',
              marginTop: '6px',
              boxShadow: '0 4px 12px rgba(124,58,237,0.25)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? 'Authenticating Employer...' : 'Login to Employer Portal'}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.725rem', color: '#94A3B8' }}>
          CivicOne Corporate Identity Network • Attribute-Scoped Employment Verification
        </div>
      </div>
    </div>
  );
}
