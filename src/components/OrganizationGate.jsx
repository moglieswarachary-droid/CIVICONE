// src/components/OrganizationGate.jsx - Clean Streamlined Private Organization Login Gate

import React, { useState } from 'react';
import { Building2, AlertCircle, ArrowLeft, Lock, Mail } from 'lucide-react';
import { INDIA_STATES_AND_UTS, PRIVATE_ORG_TYPES } from '../data/mockData.js';

export default function OrganizationGate({ onAuthenticated, onGoBackToLanding }) {
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedOrgType, setSelectedOrgType] = useState('hotel');
  const [organizationName, setOrganizationName] = useState('Demo CivicOne Hotel — Maharashtra');
  const [accessCode, setAccessCode] = useState('org123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Submit Organization Authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!organizationName || !accessCode) {
      setErrorMsg('Please enter valid Organization Name and Access Code.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    // Simulate Network Request
    setTimeout(() => {
      setLoading(false);
      const orgTypeObj = PRIVATE_ORG_TYPES.find(o => o.id === selectedOrgType) || PRIVATE_ORG_TYPES[0];
      
      onAuthenticated({
        orgType: orgTypeObj.id,
        roleCode: orgTypeObj.roleCode,
        state: selectedState,
        name: organizationName,
        badgeText: `${orgTypeObj.name.toUpperCase()} VERIFICATION (${selectedState.toUpperCase()})`
      });
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)',
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
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.1)',
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
          backgroundColor: '#FEF3C7', color: '#D97706',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '20px', boxShadow: '0 4px 14px rgba(217, 119, 6, 0.2)'
        }}>
          <Building2 size={32} />
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0B1F3A', letterSpacing: '-0.02em', marginBottom: '4px' }}>
          Organization Access Gateway
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '28px' }}>
          Private organization portal for guest check-in, academic & CKYC verification.
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
                width: '100%', padding: '12px 14px', borderRadius: '12px',
                border: '1.5px solid #CBD5E1', fontSize: '0.875rem',
                fontWeight: 700, color: '#0F172A', backgroundColor: '#FFFFFF'
              }}
            >
              {INDIA_STATES_AND_UTS.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* 2. ORGANIZATION TYPE */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              Select Organization Type
            </label>
            <select
              value={selectedOrgType}
              onChange={(e) => {
                const orgId = e.target.value;
                setSelectedOrgType(orgId);
                const orgObj = PRIVATE_ORG_TYPES.find(o => o.id === orgId) || PRIVATE_ORG_TYPES[0];
                setOrganizationName(`Demo CivicOne ${orgObj.name.replace(/s$/, '')} — ${selectedState}`);
              }}
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px',
                border: '1.5px solid #CBD5E1', fontSize: '0.875rem',
                fontWeight: 700, color: '#0F172A', backgroundColor: '#FFFFFF'
              }}
            >
              {PRIVATE_ORG_TYPES.map(o => (
                <option key={o.id} value={o.id}>{o.name}</option>
              ))}
            </select>
          </div>

          {/* 3. ORGANIZATION NAME / EMAIL */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              Organization Name / Branch ID
            </label>
            <input
              type="text"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              placeholder="e.g. CivicOne Grand Hotel — Maharashtra"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px',
                border: '1.5px solid #CBD5E1', fontSize: '0.875rem',
                fontWeight: 600, color: '#0F172A'
              }}
              required
            />
          </div>

          {/* 4. ACCESS PASSCODE */}
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              Access Passcode
            </label>
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="org123"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: '12px',
                border: '1.5px solid #CBD5E1', fontSize: '0.875rem',
                fontWeight: 700, color: '#0F172A'
              }}
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', backgroundColor: '#073B8C', color: '#FFFFFF',
              padding: '14px', borderRadius: '14px', fontWeight: 800,
              fontSize: '0.95rem', border: 'none', cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(7, 59, 140, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginTop: '10px'
            }}
          >
            {loading ? 'Authenticating...' : 'Authenticate Organization Portal 🏢'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.75rem', color: '#64748B' }}>
          🔒 Protected Commercial Information Gateway | DPDP Consent Compliant
        </div>
      </div>

    </div>
  );
}
