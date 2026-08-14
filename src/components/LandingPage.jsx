// src/components/LandingPage.jsx - Premium Public Gateway, Marketing Page, 3-Level Access Hub & State-Wise Organization Access

import React, { useState } from 'react';
import {
  ShieldCheck, Lock, ArrowRight, Award, FileCheck, Landmark, HeartPulse, Car,
  GraduationCap, Building2, CheckCircle2, ChevronRight, ShieldAlert, Smartphone,
  BookOpen, Briefcase, Search, MapPin, UserCheck, AlertTriangle, Key
} from 'lucide-react';
import { INDIA_STATES_AND_UTS, ORGANIZATION_TYPES } from '../data/mockData.js';

export default function LandingPage({ onAccessCivicOne, onOpenAuthorityPortal, onOpenOwnerAdmin, onOpenOrgPortal }) {
  const [selectedOrgTypeId, setSelectedOrgTypeId] = useState('police');
  const [selectedState, setSelectedState] = useState('Andhra Pradesh');
  const [stateSearch, setStateSearch] = useState('');

  // Filtered States/UTs search
  const filteredStates = INDIA_STATES_AND_UTS.filter(st =>
    st.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const currentOrgType = ORGANIZATION_TYPES.find(o => o.id === selectedOrgTypeId) || ORGANIZATION_TYPES[0];

  const handleLaunchOrgPortal = (orgType, stateName) => {
    const org = ORGANIZATION_TYPES.find(o => o.id === orgType) || ORGANIZATION_TYPES[0];
    const demoName = `CivicOne Demo ${org.name.replace(/s$/, '')} — ${stateName}`;
    if (onOpenOrgPortal) {
      onOpenOrgPortal({
        orgType: org.id,
        roleCode: org.roleCode,
        state: stateName,
        name: demoName,
        badgeText: `${org.name.toUpperCase()} VERIFICATION (${stateName.toUpperCase()})`
      });
    } else {
      onOpenAuthorityPortal();
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F9FC', color: '#0F172A', fontFamily: 'var(--font-body)' }}>

      {/* HEADER NAVBAR */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#0B5ED7',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(11, 94, 215, 0.3)'
            }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0B1F3A', letterSpacing: '-0.02em' }}>
                CivicOne
              </span>
              <span style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: '#0B5ED7', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '-4px' }}>
                National Digital Identity &amp; Vault
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="hidden-mobile">
            <a href="#home" style={{ textDecoration: 'none', color: '#0B1F3A', fontWeight: 600, fontSize: '0.875rem' }}>Home</a>
            <a href="#access-gateway" style={{ textDecoration: 'none', color: '#0B5ED7', fontWeight: 800, fontSize: '0.875rem' }}>Portal Access Gateway</a>
            <a href="#organization-access" style={{ textDecoration: 'none', color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>Organization Access</a>
            <a href="#govt-officer-access" style={{ textDecoration: 'none', color: '#475569', fontWeight: 600, fontSize: '0.875rem' }}>Government Officers</a>
          </nav>

          {/* Quick Header Access CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                const orgSec = document.getElementById('organization-access');
                if (orgSec) orgSec.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#073B8C',
                border: '1px solid #BFDBFE',
                padding: '8px 12px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              🏢 Organization
            </button>

            <button
              onClick={onOpenAuthorityPortal}
              style={{
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              🏛️ Govt Officer
            </button>

            <button
              onClick={onAccessCivicOne}
              style={{
                backgroundColor: '#0B5ED7',
                color: '#FFFFFF',
                padding: '9px 16px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Citizen Login
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" style={{
        padding: '60px 24px 70px 24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F9FC 100%)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#EAF3FF',
            color: '#073B8C',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.825rem',
            fontWeight: 700,
            marginBottom: '20px',
            border: '1px solid #BFDBFE'
          }}>
            <ShieldCheck size={16} /> Unified Identity + Document Vault + Purpose Verification + Government Supervision
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '3.2rem',
            fontWeight: 900,
            color: '#0B1F3A',
            lineHeight: 1.15,
            marginBottom: '20px',
            letterSpacing: '-0.03em'
          }}>
            Your Digital Identity. <br />
            <span style={{ color: '#0B5ED7' }}>Your Documents.</span> <br />
            Your State-Wise Services.
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: '#475569',
            lineHeight: 1.6,
            marginBottom: '36px',
            maxWidth: '680px',
            margin: '0 auto 36px auto'
          }}>
            Securely manage verified digital credentials, access document vault records, execute purpose-bound organization verifications, and empower authorized government supervision.
          </p>

          {/* REQUIREMENT 2 & 35: THREE-LEVEL ACCESS GATEWAY ON LANDING PAGE */}
          <div id="access-gateway" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
            marginBottom: '40px'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px' }}>
              CivicOne Three-Level Portal Access Gateway
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '28px' }}>
              Select your authorized portal role to continue.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'left' }}>
              
              {/* CARD 1: CITIZEN PORTAL */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '18px',
                padding: '24px',
                border: '1.5px solid #CBD5E1',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}>
                <div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#EAF3FF', color: '#0B5ED7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <ShieldCheck size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '6px' }}>
                    Citizen Portal
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                    For citizens to manage their CivicOne identity, documents, services and consent.
                  </p>
                </div>

                <button
                  onClick={onAccessCivicOne}
                  style={{
                    width: '100%',
                    backgroundColor: '#0B5ED7',
                    color: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  Citizen Login <ArrowRight size={16} />
                </button>
              </div>

              {/* CARD 2: ORGANIZATION PORTAL */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '18px',
                padding: '24px',
                border: '1.5px solid #CBD5E1',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}>
                <div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <Building2 size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '6px' }}>
                    Organization Portal
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                    For authorized organizations to verify information according to their permitted purpose.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const orgSec = document.getElementById('organization-access');
                    if (orgSec) orgSec.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    width: '100%',
                    backgroundColor: '#073B8C',
                    color: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  Organization Login 🏢
                </button>
              </div>

              {/* CARD 3: GOVERNMENT OFFICER PORTAL */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '18px',
                padding: '24px',
                border: '1.5px solid #CBD5E1',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
              }}>
                <div>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#E2E8F0', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                    <Landmark size={24} />
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '6px' }}>
                    Government Officer Portal
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                    For authorized government officers to supervise, verify and manage government-level CivicOne services.
                  </p>
                </div>

                <button
                  onClick={onOpenAuthorityPortal}
                  style={{
                    width: '100%',
                    backgroundColor: '#1E293B',
                    color: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  Government Officer Login 🏛️
                </button>
              </div>

            </div>

            <div style={{ marginTop: '20px', fontSize: '0.75rem', color: '#64748B', fontStyle: 'italic', textAlign: 'center' }}>
              🔒 Protected by role-based authorization matrix. Super Admin access remains private and protected.
            </div>
          </div>

        </div>
      </section>

      {/* REQUIREMENT 36: ORGANIZATION ACCESS SECTION */}
      <section id="organization-access" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#EAF3FF', color: '#073B8C', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px' }}>
              <Building2 size={16} /> Reusable State-Wise Access Gateway
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '10px', letterSpacing: '-0.02em' }}>
              ORGANIZATION ACCESS
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#475569', maxWidth: '640px', margin: '0 auto' }}>
              Secure, purpose-based access to verified citizen information across all 28 States &amp; 8 Union Territories.
            </p>
          </div>

          {/* 3-STEP SELECTION SYSTEM */}
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '24px', padding: '32px', border: '1px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', marginBottom: '48px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '20px', textAlign: 'center' }}>
              Interactive Organization Access Gateway:
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* Step 1: Select Organization Type */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1.5px solid #CBD5E1' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0B5ED7', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  1. Choose Organization Type
                </label>
                <select
                  value={selectedOrgTypeId}
                  onChange={(e) => setSelectedOrgTypeId(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 800, color: '#0B1F3A' }}
                >
                  {ORGANIZATION_TYPES.map(o => (
                    <option key={o.id} value={o.id}>{o.name}</option>
                  ))}
                </select>
                <div style={{ fontSize: '0.775rem', color: '#64748B', marginTop: '10px' }}>
                  Role Code: <span style={{ fontWeight: 800, color: '#0B5ED7' }}>{currentOrgType.roleCode}</span>
                </div>
              </div>

              {/* Step 2: Select State / UT (Searchable 28 States + 8 UTs) */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1.5px solid #CBD5E1' }}>
                <label style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0B5ED7', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  2. Choose State / Union Territory (28 States + 8 UTs)
                </label>
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                  <input
                    type="text"
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    placeholder="Search state or UT..."
                    style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }}
                  />
                </div>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 800, color: '#0B1F3A' }}
                >
                  {filteredStates.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Step 3: Select Organization & Launch Login */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1.5px solid #CBD5E1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <label style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0B5ED7', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                    3. Target Organization
                  </label>
                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>
                    CivicOne Demo {currentOrgType.name.replace(/s$/, '')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#0B5ED7" /> Location: <strong>{selectedState}</strong>
                  </div>
                </div>

                <button
                  onClick={() => handleLaunchOrgPortal(selectedOrgTypeId, selectedState)}
                  style={{
                    marginTop: '16px',
                    width: '100%',
                    backgroundColor: currentOrgType.color || '#0B5ED7',
                    color: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
                  }}
                >
                  Continue to {currentOrgType.name} Login 🚀
                </button>
              </div>

            </div>
          </div>

          {/* 10 ORGANIZATION CARDS GRID WITH DETAILS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {ORGANIZATION_TYPES.map((org) => (
              <div
                key={org.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      backgroundColor: `${org.color}15`, color: org.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <ShieldCheck size={26} />
                    </div>
                    <span style={{ fontSize: '0.725rem', fontWeight: 800, color: org.color, backgroundColor: `${org.color}15`, padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                      {org.roleCode}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '6px' }}>
                    {org.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                    {org.description}
                  </p>

                  <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.775rem', marginBottom: '20px' }}>
                    <div style={{ color: '#0F5132', fontWeight: 700, marginBottom: '4px' }}>
                      ✓ Allowed Access: {org.allowed.slice(0, 2).join(', ')}
                    </div>
                    <div style={{ color: '#991B1B', fontWeight: 700 }}>
                      ✕ Restricted: {org.disallowed.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setSelectedOrgTypeId(org.id);
                      handleLaunchOrgPortal(org.id, selectedState);
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: org.color,
                      color: '#FFFFFF',
                      padding: '10px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.825rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Login Portal
                  </button>
                </div>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* REQUIREMENT 37: DEDICATED GOVERNMENT OFFICER ACCESS SECTION */}
      <section id="govt-officer-access" style={{ padding: '80px 24px', backgroundColor: '#0B1F3A', color: '#FFFFFF' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '32px' }}>
          
          <div style={{ maxWidth: '680px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#60A5FA', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>
              <Landmark size={16} /> ELEVATED AUTHORIZED GOVERNMENT ACCESS
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '12px', color: '#FFFFFF' }}>
              GOVERNMENT OFFICER ACCESS
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
              Dedicated access for authorized government officers and supervisors across all 28 States &amp; 8 Union Territories.
            </p>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px', borderRadius: '14px', fontSize: '0.85rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={20} color="#60A5FA" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ color: '#FFFFFF', display: 'block', marginBottom: '2px' }}>Security Statement:</strong>
                Access is restricted to authorized government personnel and protected by role-based authentication.
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#1E293B', borderRadius: '24px', padding: '36px', border: '1px solid #334155', minWidth: '320px', boxShadow: '0 12px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '0.8rem', color: '#60A5FA', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              OFFICIAL GOVERNMENT GATEWAY
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '12px' }}>
              Authenticate Officer Portal
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#94A3B8', marginBottom: '24px' }}>
              State $\rightarrow$ Department $\rightarrow$ Office $\rightarrow$ Officer ID $\rightarrow$ MFA
            </p>

            <button
              onClick={onOpenAuthorityPortal}
              style={{
                width: '100%',
                backgroundColor: '#0B5ED7',
                color: '#FFFFFF',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '0.95rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Government Officer Login 🏛️
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#07152B', color: '#FFFFFF', padding: '48px 24px 24px 24px', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', paddingBottom: '32px', borderBottom: '1px solid #1E293B' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <ShieldCheck size={28} style={{ color: '#0B5ED7' }} />
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>CivicOne</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', maxWidth: '300px' }}>
              Official National Digital Identity and Personal Vault Platform.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '12px' }}>Authorized Logins</h4>
              <ul style={{ listStyle: 'none', fontSize: '0.825rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <button
                    onClick={onAccessCivicOne}
                    style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '0.825rem', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                  >
                    📱 Citizen Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenAuthorityPortal}
                    style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '0.825rem', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                  >
                    🏛️ Government Officer Login
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '16px auto 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748B' }}>
          <div>© 2026 CivicOne National Identity Platform. All rights reserved.</div>
          <div>Strict Security Boundary &amp; Authorized Encryption Enabled</div>
        </div>
      </footer>

    </div>
  );
}
