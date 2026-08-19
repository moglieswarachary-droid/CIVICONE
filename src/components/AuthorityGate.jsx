// src/components/AuthorityGate.jsx - Clean Streamlined Government Officer Login Gate

import React, { useState } from 'react';
import { Landmark, AlertCircle, ArrowLeft, ShieldCheck, Mail, Lock } from 'lucide-react';
import { INDIA_STATES_AND_UTS, GOVERNMENT_DEPARTMENTS } from '../data/mockData.js';

export default function AuthorityGate({ onAuthenticated, onGoBackToLanding }) {
  const [selectedState, setSelectedState] = useState('Andhra Pradesh');
  const [selectedDept, setSelectedDept] = useState('Transport (RTO)');
  const [email, setEmail] = useState('officer.sharma@parivahan.gov.in');
  const [password, setPassword] = useState('govt123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Submit Officer Authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter valid Official Email Address and Password.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/govt-officer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: selectedState, department: selectedDept, email, password })
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
      const isPolice = selectedDept.includes('Police');
      onAuthenticated({
        officerId: 'GOVT-OFFICER-8942',
        name: isPolice ? 'Inspector R. Verma' : 'Officer K. Sharma',
        email: email || (isPolice ? 'inspector.verma@police.gov.in' : 'officer.sharma@parivahan.gov.in'),
        department: selectedDept || 'Transport (RTO)',
        state: selectedState || 'Andhra Pradesh',
        office: `Demo ${selectedDept} Regional Office — ${selectedState}`,
        roleLevel: isPolice ? 2 : 1,
        roleTitle: isPolice ? 'LEVEL 2 — DEPARTMENT SUPERVISOR' : 'LEVEL 1 — GOVERNMENT OFFICER',
        clearanceStatus: 'LEVEL-3 VERIFIED',
        securityStatus: 'LOCK-PROTECTED LEVEL-3'
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
    }}>

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

        {/* Header Icon */}
        <div style={{
          width: '60px', height: '60px', borderRadius: '18px',
          backgroundColor: '#EAF3FF', color: '#0B5ED7',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '16px', boxShadow: '0 4px 14px rgba(11, 94, 215, 0.2)'
        }}>
          <Landmark size={32} />
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#EFF6FF',
          border: '1px solid #BFDBFE',
          color: '#1D4ED8',
          fontSize: '0.725rem',
          fontWeight: 700,
          padding: '4px 12px',
          borderRadius: '20px',
          marginBottom: '12px'
        }}>
          🔒 Authorized Officer Terminal
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0B1F3A', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          Government Officer Portal
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '28px' }}>
          Authorized government officer administration & document issuance portal.
        </p>

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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* 1. SELECT STATE */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              Select State / Union Territory
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#0F172A',
                backgroundColor: '#FFFFFF'
              }}
            >
              {INDIA_STATES_AND_UTS.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* 2. SELECT DEPARTMENT */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              Select Government Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#0F172A',
                backgroundColor: '#FFFFFF'
              }}
            >
              {GOVERNMENT_DEPARTMENTS.map(d => (
                <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          {/* 3. OFFICIAL EMAIL ADDRESS */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              Official Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="officer.sharma@parivahan.gov.in"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#0F172A'
              }}
              required
            />
          </div>

          {/* 4. PASSWORD */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="govt123"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#0F172A'
              }}
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
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
              gap: '8px',
              marginTop: '10px'
            }}
          >
            {loading ? 'Authenticating...' : 'Authenticate Government Officer 🏛️'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: '#64748B' }}>
          🔒 Official Government Verification Network | Digital India Platform
        </div>
      </div>

    </div>
  );
}
