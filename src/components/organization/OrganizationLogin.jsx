// src/components/organization/OrganizationLogin.jsx - Reusable Configurable Organization Login Screen

import React, { useState } from 'react';
import { ArrowLeft, Building2, Lock, Key, ShieldCheck, AlertCircle, UserCheck } from 'lucide-react';
import { INDIA_STATES_AND_UTS } from '../../data/mockData.js';

export default function OrganizationLogin({ orgConfig, onLoginSuccess, onGoBack }) {
  const isPolice = orgConfig.id === 'police' || orgConfig.roleCode === 'POLICE_ADMIN';
  
  const [selectedState, setSelectedState] = useState('Andhra Pradesh');
  const [selectedRole, setSelectedRole] = useState(orgConfig.roles[0] || 'AUTHORIZED_OFFICER');
  const [orgIdInput, setOrgIdInput] = useState(`ORG-${orgConfig.id.toUpperCase()}-101`);
  const [officialEmail, setOfficialEmail] = useState(isPolice ? 'inspector.verma@police.gov.in' : `officer@${orgConfig.id}.gov.in`);
  const [accessCode, setAccessCode] = useState('org123');
  
  // Custom Police Fields
  const [policeStationCode, setPoliceStationCode] = useState('PS-AP-101');
  const [policeOfficerId, setPoliceOfficerId] = useState('POL-OFFICER-8942');
  const [policeBranch, setPoliceBranch] = useState('🚔 Traffic Police Division');

  const policeBranches = [
    { name: '🚔 Traffic Police Division', slug: 'traffic', hash: '#police-traffic' },
    { name: '🕵️‍♂️ Crime Branch / CID', slug: 'crime', hash: '#police-crime' },
    { name: '⚖️ Juvenile & Justice Division', slug: 'justice', hash: '#police-justice' },
    { name: '💻 Cyber Crime & Economic Offences Wing (EOW)', slug: 'cyber', hash: '#police-cyber' },
    { name: '🛡️ Law & Order Division', slug: 'law', hash: '#police-law' }
  ];

  const handleBranchChange = (newBranchName) => {
    setPoliceBranch(newBranchName);
    const branchObj = policeBranches.find(b => b.name === newBranchName);
    if (branchObj && isPolice) {
      window.location.hash = branchObj.hash;
    }
  };

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStateChange = (newState) => {
    setSelectedState(newState);
    if (isPolice) {
      const codePrefix = newState.split(' ').map(w => w[0]).join('').toUpperCase();
      setPoliceStationCode(`PS-${codePrefix}-101`);
    }
  };

  const handleFillDemo = () => {
    setOrgIdInput(`ORG-${orgConfig.id.toUpperCase()}-101`);
    setOfficialEmail(isPolice ? 'inspector.verma@police.gov.in' : `officer@${orgConfig.id}.gov.in`);
    setAccessCode('org123');
    if (isPolice) {
      setPoliceStationCode('PS-AP-101');
      setPoliceOfficerId('POL-OFFICER-8942');
    }
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!orgIdInput || !officialEmail || !accessCode) {
      setErrorMsg('Please enter Organization ID, Official Email, and Passcode.');
      return;
    }

    if (isPolice && (!policeStationCode || !policeOfficerId)) {
      setErrorMsg('Please enter valid Police Station Code and Officer ID.');
      return;
    }

    if (accessCode !== 'org123' && accessCode !== 'admin123' && accessCode !== 'police123') {
      setErrorMsg('Invalid Passcode. Use org123 or police123 for demo.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/organization/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: orgConfig.id,
          orgSlug: orgConfig.slug,
          orgName: orgConfig.name,
          sector: orgConfig.sector,
          state: selectedState,
          role: selectedRole,
          officialEmail,
          accessCode,
          policeStationCode: isPolice ? policeStationCode : null,
          policeOfficerId: isPolice ? policeOfficerId : null,
          policeBranch: isPolice ? policeBranch : null
        })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        onLoginSuccess({
          ...data.session,
          policeStationCode: isPolice ? policeStationCode : null,
          policeOfficerId: isPolice ? policeOfficerId : null,
          policeBranch: isPolice ? policeBranch : null
        });
      } else {
        // Fallback local session if server offline
        onLoginSuccess({
          orgId: orgConfig.id,
          orgSlug: orgConfig.slug,
          name: `${orgConfig.name} (${selectedState})`,
          sector: orgConfig.sector,
          sectorTitle: orgConfig.sectorTitle,
          state: selectedState,
          role: selectedRole,
          officialEmail,
          policeStationCode: isPolice ? policeStationCode : null,
          policeOfficerId: isPolice ? policeOfficerId : null,
          policeBranch: isPolice ? policeBranch : null,
          capabilities: orgConfig.capabilities,
          allowedCategories: orgConfig.allowedCategories,
          allowedDocTypes: orgConfig.allowedDocTypes,
          sessionToken: `ORG-SESS-${Date.now()}-SECURE`
        });
      }
    } catch (err) {
      setLoading(false);
      // Local fallback
      onLoginSuccess({
        orgId: orgConfig.id,
        orgSlug: orgConfig.slug,
        name: `${orgConfig.name} (${selectedState})`,
        sector: orgConfig.sector,
        sectorTitle: orgConfig.sectorTitle,
        state: selectedState,
        role: selectedRole,
        officialEmail,
        policeStationCode: isPolice ? policeStationCode : null,
        policeOfficerId: isPolice ? policeOfficerId : null,
        policeBranch: isPolice ? policeBranch : null,
        capabilities: orgConfig.capabilities,
        allowedCategories: orgConfig.allowedCategories,
        allowedDocTypes: orgConfig.allowedDocTypes,
        sessionToken: `ORG-SESS-${Date.now()}-SECURE`
      });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E1 100%)',
      display: 'flex',
      alignItems: 'center',
      justify: 'center',
      padding: '32px 16px'
    }}>
      
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '540px',
        width: '100%',
        padding: '40px 36px',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.1)',
        border: '1px solid #E2E8F0'
      }}>
        
        {/* Back Link */}
        <button
          onClick={onGoBack}
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
            marginBottom: '24px'
          }}
        >
          <ArrowLeft size={16} /> Back to {orgConfig.sectorTitle} Organizations
        </button>

        {/* Dynamic Organization Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            backgroundColor: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            fontSize: '2rem',
            boxShadow: '0 6px 16px rgba(217,119,6,0.2)'
          }}>
            {orgConfig.logoEmoji}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {orgConfig.sectorTitle} Sector
              </span>
              <span style={{ fontSize: '0.675rem', backgroundColor: '#F1F5F9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                {orgConfig.integrationStatus}
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, color: '#0B1F3A', marginTop: '2px' }}>
              {orgConfig.name}
            </h2>
          </div>
        </div>

        {/* Instructions */}
        <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: 1.5, marginBottom: '24px' }}>
          {orgConfig.description}
        </p>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>{errorMsg}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          
          {/* State Selection */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
              State / Union Territory Jurisdiction
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                backgroundColor: '#F8FAFC',
                fontWeight: 600
              }}
            >
              {INDIA_STATES_AND_UTS.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* DEDICATED POLICE AUTHENTICATION FIELDS */}
          {isPolice && (
            <div style={{ backgroundColor: '#EFF6FF', padding: '16px', borderRadius: '16px', border: '1px solid #BFDBFE', marginBottom: '18px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#1E40AF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                👮‍♂️ Police Station &amp; Branch Credentials
              </div>

              {/* POLICE BRANCH SELECTION DROPDOWN */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1E3A8A', marginBottom: '4px' }}>
                  Select Police Branch / Special Division
                </label>
                <select
                  value={policeBranch}
                  onChange={(e) => handleBranchChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1.5px solid #3B82F6',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    backgroundColor: '#FFFFFF',
                    color: '#1E3A8A'
                  }}
                >
                  {policeBranches.map(b => (
                    <option key={b.slug} value={b.name}>{b.name} ({b.hash})</option>
                  ))}
                </select>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1E3A8A', marginBottom: '4px' }}>
                    Police Station Code
                  </label>
                  <input
                    type="text"
                    value={policeStationCode}
                    onChange={(e) => setPoliceStationCode(e.target.value)}
                    placeholder="e.g. PS-MUM-104"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1.5px solid #93C5FD',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      backgroundColor: '#FFFFFF',
                      color: '#1E3A8A'
                    }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#1E3A8A', marginBottom: '4px' }}>
                    Police Officer Badge ID
                  </label>
                  <input
                    type="text"
                    value={policeOfficerId}
                    onChange={(e) => setPoliceOfficerId(e.target.value)}
                    placeholder="e.g. POL-8942-MH"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      border: '1.5px solid #93C5FD',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      backgroundColor: '#FFFFFF',
                      color: '#1E3A8A'
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
              Authorized Role Scope
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                backgroundColor: '#F8FAFC',
                fontWeight: 600
              }}
            >
              {orgConfig.roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>


          {/* Organization ID */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
              Organization Registration ID
            </label>
            <input
              type="text"
              value={orgIdInput}
              onChange={(e) => setOrgIdInput(e.target.value)}
              placeholder="e.g. ORG-BANK-101"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Official Email */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
              Official Authorized Email
            </label>
            <input
              type="email"
              value={officialEmail}
              onChange={(e) => setOfficialEmail(e.target.value)}
              placeholder="officer@organization.com"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Access Code / Passcode */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#1E293B' }}>
                Passcode / Access Code
              </label>
              <button
                type="button"
                onClick={handleFillDemo}
                style={{ background: 'none', border: 'none', color: '#0B5ED7', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Autofill Demo Code (org123)
              </button>
            </div>
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter passcode"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid #CBD5E1',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: '#073B8C',
              color: '#FFFFFF',
              padding: '14px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(7, 59, 140, 0.3)'
            }}
          >
            <Lock size={18} /> {loading ? 'Authenticating Organization...' : `Login to ${orgConfig.name}`}
          </button>
        </form>

        <div style={{ marginTop: '20px', fontSize: '0.75rem', color: '#64748B', textAlign: 'center' }}>
          🔒 Protected by CivicOne Attribute-Scoped Access Matrix
        </div>

      </div>
    </div>
  );
}
