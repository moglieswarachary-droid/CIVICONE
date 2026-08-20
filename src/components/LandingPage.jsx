import React, { useState } from 'react';
import {
  ShieldCheck, Lock, ArrowRight, Award, FileCheck, Landmark, HeartPulse, Car,
  GraduationCap, Building2, CheckCircle2, ChevronRight, ShieldAlert,
  BookOpen, Briefcase, Search, MapPin, UserCheck, AlertTriangle, Key,
  Sun, Moon
} from 'lucide-react';
import { INDIA_STATES_AND_UTS } from '../data/mockData.js';

export default function LandingPage({ onAccessCIVIQONE, onOpenAuthorityPortal, onOpenOwnerAdmin, onOpenOrganizationGate, theme = 'light', onToggleTheme }) {
  const [selectedState, setSelectedState] = useState('Andhra Pradesh');
  const [stateSearch, setStateSearch] = useState('');

  // Filter states based on search
  const filteredStates = INDIA_STATES_AND_UTS.filter(state =>
    state.toLowerCase().includes(stateSearch.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', fontFamily: 'var(--font-body)' }}>

      {/* HEADER NAVBAR */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-card)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-light)',
        padding: '14px 20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-blue)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-blue)',
              flexShrink: 0
            }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                CIVIQONE
              </span>
              <span style={{ display: 'block', fontSize: '0.625rem', fontWeight: 700, color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '-3px' }}>
                National Digital Identity &amp; Vault
              </span>
            </div>
          </div>

          {/* Header Navigation: Theme Switcher, Citizen & Organization Portal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
                className="theme-toggle-btn"
              >
                {theme === 'dark' ? <Sun size={18} style={{ color: '#F59E0B' }} /> : <Moon size={18} style={{ color: '#0B5ED7' }} />}
              </button>
            )}

            <button
              onClick={onAccessCIVIQONE}
              style={{
                backgroundColor: 'var(--primary-blue)',
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
                boxShadow: 'var(--shadow-blue)'
              }}
            >
              Citizen Portal
            </button>

            <button
              onClick={onOpenOrganizationGate}
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--primary-blue)',
                border: '1.5px solid var(--border-blue)',
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
              <Building2 size={16} /> Organization Portal
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" style={{
        padding: '50px 20px 60px 20px',
        position: 'relative',
        overflow: 'hidden',
        background: theme === 'dark' ? 'radial-gradient(circle at 50% 10%, #0F2342 0%, #070F1E 100%)' : 'linear-gradient(180deg, #FFFFFF 0%, #F6F9FC 100%)'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.1rem, 5vw, 3.1rem)',
            fontWeight: 900,
            color: 'var(--text-main)',
            lineHeight: 1.15,
            marginBottom: '32px',
            letterSpacing: '-0.02em'
          }}>
            Your Digital Identity.<br />
            <span style={{ color: 'var(--primary-blue)' }}>Your Secure Credentials.</span>
          </h1>

          {/* HERO CITIZEN ACCESS CARD */}
          <div id="access-gateway" className="hover-card-lift" style={{
            backgroundColor: 'var(--bg-card)',
            borderRadius: '28px',
            padding: '36px 28px',
            border: '1.5px solid var(--border-light)',
            boxShadow: 'var(--shadow-lg)',
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
              background: 'radial-gradient(circle, rgba(11, 94, 215, 0.12) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'var(--light-blue)',
              color: 'var(--primary-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: 'var(--shadow-blue)'
            }}>
              <ShieldCheck size={32} />
            </div>

            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 900,
              color: 'var(--text-main)',
              marginBottom: '8px',
              letterSpacing: '-0.01em'
            }}>
              National Citizen Access Gateway
            </h3>

            <p style={{
              fontSize: '0.925rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '480px',
              margin: '0 auto 26px auto'
            }}>
              Authenticate securely via registered Mobile / Aadhaar number to access your verified digital identity card, encrypted document vault, and consent control matrix.
            </p>

            {/* High-Impact Citizen Login CTA */}
            <button
              onClick={onAccessCIVIQONE}
              style={{
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
                backgroundColor: 'var(--primary-blue)',
                backgroundImage: 'linear-gradient(135deg, var(--primary-blue) 0%, var(--deep-blue) 100%)',
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
                boxShadow: 'var(--shadow-blue)',
                transition: 'transform 0.2s ease, boxShadow 0.2s ease'
              }}
            >
              Citizen Login <ArrowRight size={20} />
            </button>

            <div style={{ marginTop: '16px', fontSize: '0.775rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
              🔒 Protected by 2-Phase OTP &amp; Aadhaar Cryptographic Vault.
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#07152B', color: '#FFFFFF', padding: '44px 20px 24px 20px', borderTop: '1px solid #1E293B' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', paddingBottom: '28px', borderBottom: '1px solid #1E293B' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <ShieldCheck size={28} style={{ color: '#0B5ED7' }} />
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#FFFFFF' }}>CIVIQONE</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', maxWidth: '320px', lineHeight: 1.5 }}>
              Official National Digital Identity, Sovereign Personal Vault &amp; Consent Control Architecture.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            {/* Citizen Access */}
            <div>
              <h4 style={{ fontSize: '0.875rem', color: '#FFFFFF', marginBottom: '12px', fontWeight: 800 }}>
                Authorized Portals
              </h4>
              <ul style={{ listStyle: 'none', fontSize: '0.825rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <li>
                  <button
                    onClick={onAccessCIVIQONE}
                    style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '0.825rem', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                  >
                    Citizen Login
                  </button>
                </li>
                <li>
                  <button
                    onClick={onOpenOrganizationGate}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '0.825rem', fontWeight: 600, textDecoration: 'none', cursor: 'pointer', padding: 0 }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#60A5FA'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#94A3B8'}
                  >
                    Organization Login
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '16px auto 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748B', flexWrap: 'wrap', gap: '8px' }}>
          <div>© 2026 CIVIQONE National Identity Platform. All rights reserved.</div>
          <div>End-to-End Cryptographic Security &amp; Authorized Encryption Enabled</div>
        </div>
      </footer>

    </div>
  );
}


