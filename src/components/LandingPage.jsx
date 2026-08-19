// src/components/LandingPage.jsx - Premium Public Gateway, Marketing Page, 3-Level Access Hub & State-Wise Organization Access

import React, { useState } from 'react';
import {
  ShieldCheck, Lock, ArrowRight, Award, FileCheck, Landmark, HeartPulse, Car,
  GraduationCap, Building2, CheckCircle2, ChevronRight, ShieldAlert, Smartphone,
  BookOpen, Briefcase, Search, MapPin, UserCheck, AlertTriangle, Key
} from 'lucide-react';
import { INDIA_STATES_AND_UTS } from '../data/mockData.js';

export default function LandingPage({ onAccessCivicOne, onOpenAuthorityPortal, onOpenOwnerAdmin, onOpenOrganizationGate }) {
  const [selectedState, setSelectedState] = useState('Andhra Pradesh');
  const [stateSearch, setStateSearch] = useState('');

  // Filter states based on search
  const filteredStates = INDIA_STATES_AND_UTS.filter(state =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const handleLaunchOrgPortal = (orgType, stateName) => {
    // Kept here for internal links if needed, but not used by main cards anymore
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

          {/* Header Navigation: Only Citizen and Organization */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onAccessCivicOne}
              style={{
                backgroundColor: '#0B5ED7',
                color: '#FFFFFF',
                padding: '9px 18px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(11, 94, 215, 0.25)'
              }}
            >
              📱 Citizen Portal
            </button>

            <button
              onClick={onOpenOrganizationGate}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#073B8C',
                border: '1.5px solid #BFDBFE',
                padding: '8px 16px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🏢 Organization Portal
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" style={{
        padding: '50px 24px 60px 24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F9FC 100%)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '3rem',
            fontWeight: 900,
            color: '#0B1F3A',
            lineHeight: 1.15,
            marginBottom: '32px',
            letterSpacing: '-0.02em'
          }}>
            Your Digital Identity.<br />
            <span style={{ color: '#0B5ED7' }}>Your Secure Credentials.</span>
          </h1>

          {/* HERO CITIZEN ACCESS CARD */}
          <div id="access-gateway" style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '28px',
            padding: '36px 32px',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 20px 50px rgba(11, 94, 215, 0.08)',
            maxWidth: '620px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Decorative Accent */}
            <div style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(11, 94, 215, 0.08) 0%, rgba(255,255,255,0) 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#EAF3FF',
              color: '#0B5ED7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 18px auto',
              boxShadow: '0 8px 20px rgba(11, 94, 215, 0.15)'
            }}>
              <ShieldCheck size={32} />
            </div>

            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: '#0B1F3A',
              marginBottom: '8px',
              letterSpacing: '-0.01em'
            }}>
              National Citizen Access Gateway
            </h3>

            <p style={{
              fontSize: '0.925rem',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '480px',
              margin: '0 auto 28px auto'
            }}>
              Authenticate securely via registered Mobile / Aadhaar number to access your verified digital identity card, encrypted document vault, and consent control matrix.
            </p>

            {/* High-Impact Citizen Login CTA */}
            <button
              onClick={onAccessCivicOne}
              style={{
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
                backgroundColor: '#0B5ED7',
                backgroundImage: 'linear-gradient(135deg, #0B5ED7 0%, #073B8C 100%)',
                color: '#FFFFFF',
                padding: '16px 28px',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '1.05rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(11, 94, 215, 0.35)',
                transition: 'transform 0.2s ease, boxShadow 0.2s ease'
              }}
            >
              Citizen Login <ArrowRight size={20} />
            </button>

            <div style={{ marginTop: '16px', fontSize: '0.775rem', color: '#64748B', fontStyle: 'italic' }}>
              🔒 Protected by 2-Phase OTP &amp; Aadhaar Cryptographic Vault.
            </div>
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
                    onClick={onOpenOrganizationGate}
                    style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '0.825rem', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                  >
                    🏢 Organization Login
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
