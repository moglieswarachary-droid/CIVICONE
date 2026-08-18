// src/components/OrganizationGate.jsx - Organization Gateway with 5 Top-Level Sectors

import React, { useState } from 'react';
import OrganizationSectors from './organization/OrganizationSectors.jsx';
import OrganizationSelector from './organization/OrganizationSelector.jsx';
import OrganizationLogin from './organization/OrganizationLogin.jsx';
import { ArrowLeft, ShieldCheck, Crown } from 'lucide-react';

export default function OrganizationGate({ onAuthenticated, onGoBackToLanding, onOpenSuperAdmin }) {
  // Steps: 'sectors' | 'selector' | 'login'
  const [step, setStep] = useState('sectors');
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const handleSelectSector = (sector) => {
    setSelectedSector(sector);
    setStep('selector');
  };

  const handleSelectOrganization = (orgConfig) => {
    setSelectedOrg(orgConfig);
    setStep('login');
  };

  const handleLoginSuccess = (session) => {
    onAuthenticated(session);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
      
      {/* HEADER BAR */}
      <header style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#0B5ED7',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A' }}>
                CivicOne Organization Verification Network
              </span>
              <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: '#0B5ED7', textTransform: 'uppercase' }}>
                State &amp; National Enterprise Gateway
              </span>
            </div>
          </div>

          {/* Dynamic Step-Aware Back Button & Admin Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            {onOpenSuperAdmin && (
              <button
                onClick={onOpenSuperAdmin}
                style={{
                  backgroundColor: '#1E1B4B',
                  color: '#FEF08A',
                  border: '1px solid #4F46E5',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
                }}
              >
                <Crown size={15} color="#FEF08A" /> Super Admin Supervision
              </button>
            )}

            {step !== 'sectors' && (
              <button
                onClick={() => {
                  if (step === 'login') setStep('selector');
                  else if (step === 'selector') setStep('sectors');
                }}
                style={{
                  backgroundColor: '#E2E8F0',
                  color: '#0F172A',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft size={16} /> {step === 'login' ? `Back to ${selectedSector?.title || 'Sector'}` : 'Back to All Sectors'}
              </button>
            )}

            <button
              onClick={onGoBackToLanding}
              style={{
                backgroundColor: '#F1F5F9',
                color: '#475569',
                border: '1px solid #CBD5E1',
                padding: '8px 14px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Main Landing Page
            </button>
          </div>

        </div>
      </header>


      {/* STEP 1: SECTORS SELECTION */}
      {step === 'sectors' && (
        <OrganizationSectors
          onSelectSector={handleSelectSector}
          onGoBack={onGoBackToLanding}
        />
      )}

      {/* STEP 2: ORGANIZATIONS IN SECTOR */}
      {step === 'selector' && selectedSector && (
        <OrganizationSelector
          sector={selectedSector}
          onSelectOrganization={handleSelectOrganization}
          onGoBackToSectors={() => setStep('sectors')}
        />
      )}

      {/* STEP 3: REUSABLE DYNAMIC LOGIN */}
      {step === 'login' && selectedOrg && (
        <OrganizationLogin
          orgConfig={selectedOrg}
          onLoginSuccess={handleLoginSuccess}
          onGoBack={() => setStep('selector')}
        />
      )}

    </div>
  );
}
