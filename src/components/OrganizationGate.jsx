// src/components/OrganizationGate.jsx - Organization Gateway with 5 Top-Level Sectors

import React, { useState } from 'react';
import OrganizationSectors from './organization/OrganizationSectors.jsx';
import OrganizationSelector from './organization/OrganizationSelector.jsx';
import OrganizationLogin from './organization/OrganizationLogin.jsx';
import DepartmentPortals from './organization/DepartmentPortals.jsx';
import EducationPortals from './organization/EducationPortals.jsx';
import HealthcarePortals from './organization/HealthcarePortals.jsx';
import BankingPortals from './organization/BankingPortals.jsx';
import PrivateSectorPortals from './organization/PrivateSectorPortals.jsx';
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

  const isGovSector = selectedSector?.id === 'government' || selectedOrg?.sector === 'government';
  const isEduSector = selectedSector?.id === 'education' || selectedOrg?.sector === 'education';
  const isHealthSector = selectedSector?.id === 'healthcare' || selectedOrg?.sector === 'healthcare';
  const isBankSector = selectedSector?.id === 'banking_finance' || selectedOrg?.sector === 'banking_finance';
  const isPrivateSector = selectedSector?.id === 'private_sector' || selectedOrg?.sector === 'private_sector';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
      
      {/* HEADER BAR */}
      <header style={{
        backgroundColor: '#0B1F3A',
        color: '#FFFFFF',
        padding: '16px 24px',
        borderBottom: '1px solid #1E293B',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              🏛️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                  CivicOne Organization Network
                </h1>
                <span style={{
                  fontSize: '0.65rem',
                  backgroundColor: '#1E293B',
                  border: '1px solid #334155',
                  color: '#93C5FD',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px'
                }}>
                  🔒 Authorized Gateway
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0 }}>
                State-Wide Institutional Verification Gateway • Government, Banking, Education, Healthcare &amp; Employers
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {onOpenSuperAdmin && (
              <button
                onClick={onOpenSuperAdmin}
                style={{
                  backgroundColor: '#1E293B',
                  color: '#F59E0B',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.775rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Crown size={15} /> Super Admin Portal
              </button>
            )}

            <button
              onClick={onGoBackToLanding}
              style={{
                backgroundColor: 'transparent',
                color: '#CBD5E1',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '0.775rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <ArrowLeft size={15} /> Exit to Main Hub
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

      {/* STEP 3: DYNAMIC LOGIN & DASHBOARD */}
      {step === 'login' && selectedOrg && (
        isGovSector ? (
          <DepartmentPortals
            deptId={selectedOrg.id}
            onReturnHome={() => setStep('selector')}
          />
        ) : isEduSector ? (
          <EducationPortals
            eduId={selectedOrg.id}
            onReturnHome={() => setStep('selector')}
          />
        ) : isHealthSector ? (
          <HealthcarePortals
            healthId={selectedOrg.id}
            onReturnHome={() => setStep('selector')}
          />
        ) : isBankSector ? (
          <BankingPortals
            bankId={selectedOrg.id}
            onReturnHome={() => setStep('selector')}
          />
        ) : isPrivateSector ? (
          <PrivateSectorPortals
            companyId={selectedOrg.id}
            onReturnHome={() => setStep('selector')}
          />
        ) : (
          <OrganizationLogin
            orgConfig={selectedOrg}
            onLoginSuccess={handleLoginSuccess}
            onGoBack={() => setStep('selector')}
          />
        )
      )}

    </div>
  );
}
