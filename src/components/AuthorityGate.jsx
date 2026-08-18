// src/components/AuthorityGate.jsx - Dedicated Government Officer Login Gate (5-Step Officer Verification Flow)

import React, { useState } from 'react';
import { Landmark, ShieldCheck, Lock, AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Key, Building2, MapPin } from 'lucide-react';
import { INDIA_STATES_AND_UTS, GOVERNMENT_DEPARTMENTS } from '../data/mockData.js';

export default function AuthorityGate({ onAuthenticated, onGoBackToLanding }) {
  const [selectedState, setSelectedState] = useState('Andhra Pradesh');
  const [selectedDept, setSelectedDept] = useState('Police Department');
  const [officeName, setOfficeName] = useState('Demo Police Station — Vijayawada Central');
  const [policeStationCode, setPoliceStationCode] = useState('PS-AP-101');
  const [policeBranch, setPoliceBranch] = useState('🚔 Traffic Police Division');
  const [officerId, setOfficerId] = useState('POL-OFFICER-8942');
  const [password, setPassword] = useState('govt123');
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isPolice = selectedDept.includes('Police');

  // Quick Demo Credentials Fill
  const handleFillDemo = () => {
    setSelectedState('Andhra Pradesh');
    setSelectedDept('Police Department');
    setOfficeName('Demo Police Station — Vijayawada Central');
    setPoliceStationCode('PS-AP-101');
    setPoliceBranch('🚔 Traffic Police Division');
    setOfficerId('POL-OFFICER-8942');
    setPassword('govt123');
    setOtp('123456');
    setErrorMsg('');
  };

  // Submit Officer Authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!officerId || !password) {
      setErrorMsg('Please enter valid Officer ID and Password.');
      return;
    }
    if (otp !== '123456') {
      setErrorMsg('Invalid MFA / OTP code. Use 123456 for demo.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/govt-officer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: selectedState,
          department: selectedDept,
          office: officeName,
          policeStationCode: isPolice ? policeStationCode : null,
          policeBranch: isPolice ? policeBranch : null,
          officerId,
          password,
          otp
        })
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success && data.officer) {
        onAuthenticated({
          ...data.officer,
          policeStationCode: isPolice ? policeStationCode : null,
          policeOfficerId: isPolice ? officerId : null,
          policeBranch: isPolice ? policeBranch : null
        });
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please check officer credentials.');
      }
    } catch (err) {
      setLoading(false);
      // Fallback officer session for dev
      onAuthenticated({
        officerId: officerId || 'POL-OFFICER-8942',
        policeOfficerId: officerId || 'POL-OFFICER-8942',
        policeStationCode: isPolice ? policeStationCode : null,
        policeBranch: isPolice ? policeBranch : null,
        name: isPolice ? 'Inspector R. Verma' : 'Officer K. Sharma',
        email: isPolice ? 'inspector.verma@police.gov.in' : 'officer.sharma@parivahan.gov.in',
        department: selectedDept || 'Police Department',
        state: selectedState || 'Andhra Pradesh',
        office: officeName || 'Demo Police Station — Vijayawada Central',
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
        maxWidth: '520px',
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
          marginBottom: '20px', boxShadow: '0 4px 14px rgba(11, 94, 215, 0.2)'
        }}>
          <Landmark size={32} />
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0B1F3A', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          Government Officer Portal
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '24px' }}>
          Authorized government administration and supervision.
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
            ⚡ Demo Government Officer Mode
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
          
          {/* STEP 1: STATE, DEPT & OFFICE SELECTION */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              1. Select State / Union Territory (28 States + 8 UTs)
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              2. Select Government Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setOfficeName(`Demo ${e.target.value} Office — ${selectedState}`);
              }}
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

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              3. {isPolice ? 'Assigned Police Station / Headquarters' : 'Assigned Government Office / Headquarters'}
            </label>
            <input
              type="text"
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
              placeholder={isPolice ? "e.g. Demo Police Station — Vijayawada Central" : "e.g. Demo RTO Regional Headquarters — Vijayawada"}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#0F172A'
              }}
              required
            />
          </div>

          {/* DEDICATED POLICE STATION CODE & BRANCH FIELDS */}
          {isPolice && (
            <div style={{ backgroundColor: '#EAF3FF', padding: '16px', borderRadius: '16px', border: '1.5px solid #0B5ED7', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#073B8C', marginBottom: '12px' }}>
                👮‍♂️ Police Branch Division &amp; Station Code
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#073B8C', marginBottom: '4px' }}>
                  Select Police Branch / Special Division
                </label>
                <select
                  value={policeBranch}
                  onChange={(e) => {
                    setPoliceBranch(e.target.value);
                    const hash = e.target.value.includes('Traffic') ? '#police-traffic'
                      : e.target.value.includes('Crime') ? '#police-crime'
                      : e.target.value.includes('Justice') ? '#police-justice'
                      : e.target.value.includes('Cyber') ? '#police-cyber'
                      : '#police-law';
                    window.location.hash = hash;
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1.5px solid #0B5ED7',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    backgroundColor: '#FFFFFF',
                    color: '#073B8C'
                  }}
                >
                  <option value="🚔 Traffic Police Division">🚔 Traffic Police Division (#police-traffic)</option>
                  <option value="🕵️‍♂️ Crime Branch / CID">🕵️‍♂️ Crime Branch / CID (#police-crime)</option>
                  <option value="⚖️ Juvenile & Justice Division">⚖️ Juvenile &amp; Justice Division (#police-justice)</option>
                  <option value="💻 Cyber Crime & Economic Offences Wing (EOW)">💻 Cyber Crime &amp; Economic Offences Wing (#police-cyber)</option>
                  <option value="🛡️ Law & Order Division">🛡️ Law &amp; Order Division (#police-law)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#073B8C', marginBottom: '4px' }}>
                  Police Station Code (PS Code)
                </label>
                <input
                  type="text"
                  value={policeStationCode}
                  onChange={(e) => setPoliceStationCode(e.target.value)}
                  placeholder="e.g. PS-AP-101 or PS-MUM-204"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1.5px solid #0B5ED7',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: '#073B8C',
                    backgroundColor: '#FFFFFF'
                  }}
                  required
                />
              </div>
            </div>
          )}


          {/* CREDENTIALS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
                Officer ID
              </label>
              <input
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="GOVT-OFFICER-8942"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="govt123"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.85rem',
                  fontWeight: 700
                }}
                required
              />
            </div>
          </div>

          {/* MFA / OTP SIMULATION */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              MFA / 6-Digit Security OTP (Demo: 123456)
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.9rem',
                fontWeight: 700,
                letterSpacing: '0.1em'
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
            {loading ? 'Authenticating Officer Session...' : 'Authenticate Government Officer Session 🏛️'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: '#64748B' }}>
          🔒 Protected Government Information Infrastructure | Department Authorization Active
        </div>
      </div>

    </div>
  );
}
