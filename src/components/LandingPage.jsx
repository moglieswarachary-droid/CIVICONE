// src/components/LandingPage.jsx - Premium Public Gateway & Marketing Page

import React from 'react';
import { ShieldCheck, Lock, ArrowRight, Award, FileCheck, Landmark, HeartPulse, Car, GraduationCap, Building2, CheckCircle2, ChevronRight } from 'lucide-react';

export default function LandingPage({ onAccessCivicOne, onOpenAuthorityPortal, onOpenOwnerAdmin }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F9FC', color: '#0F172A', fontFamily: 'var(--font-body)' }}>

      {/* HEADER NAVBAR */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
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
                National Digital Vault
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }} className="hidden-mobile">
            <a href="#home" style={{ textDecoration: 'none', color: '#0B1F3A', fontWeight: 600, fontSize: '0.9rem' }}>Home</a>
            <a href="#services" style={{ textDecoration: 'none', color: '#475569', fontWeight: 600, fontSize: '0.9rem' }}>Services</a>
            <a href="#security" style={{ textDecoration: 'none', color: '#475569', fontWeight: 600, fontSize: '0.9rem' }}>Security</a>
          </nav>

          {/* Portal Login Gate CTA Buttons (Public Only: Citizen & Govt Officer) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={onOpenAuthorityPortal}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#073B8C',
                border: '1px solid #BFDBFE',
                padding: '8px 14px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              🏛️ Govt Officer Login
            </button>

            <button
              onClick={onAccessCivicOne}
              style={{
                backgroundColor: '#0B5ED7',
                color: '#FFFFFF',
                padding: '9px 18px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(11, 94, 215, 0.3)'
              }}
            >
              Citizen Login <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section id="home" style={{
        padding: '80px 24px 100px 24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F6F9FC 100%)'
      }}>
        {/* Abstract Background Shapes */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(11, 94, 215, 0.08) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* Hero Content Column */}
          <div>
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
              marginBottom: '24px',
              border: '1px solid #BFDBFE'
            }}>
              <ShieldCheck size={16} /> Government-Grade Digital Vault Architecture
            </div>

            <h1 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '3.6rem',
              fontWeight: 800,
              color: '#0B1F3A',
              lineHeight: 1.15,
              marginBottom: '24px',
              letterSpacing: '-0.03em'
            }}>
              Your Digital Identity. <br />
              <span style={{ color: '#0B5ED7' }}>Your Documents.</span> <br />
              Your Services.
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: '#475569',
              lineHeight: 1.6,
              marginBottom: '36px',
              maxWidth: '640px',
              margin: '0 auto 36px auto'
            }}>
              Securely access your verified digital credentials, official documents and government services from one trusted platform.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={onAccessCivicOne}
                style={{
                  backgroundColor: '#0B5ED7',
                  color: '#FFFFFF',
                  padding: '14px 32px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 24px rgba(11, 94, 215, 0.35)'
                }}
              >
                Get Started Securely <ArrowRight size={18} />
              </button>

              <a
                href="#services"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#0B1F3A',
                  padding: '14px 28px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  border: '1px solid #CBD5E1',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                Explore Services
              </a>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '56px', paddingTop: '32px', borderTop: '1px solid #E2E8F0' }}>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B1F3A' }}>14M+</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Verified Citizens</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0B5ED7' }}>48M+</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Issued Credentials</div>
              </div>
              <div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#198754' }}>100%</div>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>Encryption & Consent</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED VAULT CATEGORIES SECTION */}
      <section id="services" style={{ padding: '80px 24px', backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '12px' }}>
              Structured Digital Document Vault
            </h2>
            <p style={{ fontSize: '1rem', color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
              All your official credentials organized cleanly into verified government categories.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            
            {[
              { title: 'Government IDs', desc: 'Aadhaar, PAN Card, Voter ID & Official Credentials', icon: Landmark, color: '#0B5ED7' },
              { title: 'Healthcare Records', desc: 'ABHA Health Card, Lab Reports & Vaccination Tokens', icon: HeartPulse, color: '#198754' },
              { title: 'RTO & Vehicle Docs', desc: 'Driving Licence, RC, Vehicle Insurance & PUC', icon: Car, color: '#F59E0B' },
              { title: 'Education & Academic', desc: 'Degrees, CBSE Marksheets & Skill Certifications', icon: GraduationCap, color: '#6366F1' },
              { title: 'Professional Records', desc: 'Employment Proof, Tax Forms & Industry Credentials', icon: Building2, color: '#073B8C' },
              { title: 'Organization Membership', desc: 'Institutional Authorizations & Club Credentials', icon: Award, color: '#8B5CF6' }
            ].map((cat, idx) => (
              <div key={idx} style={{
                backgroundColor: '#F6F9FC',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #E2E8F0',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }} className="hover-card">
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: `${cat.color}15`,
                  color: cat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <cat.icon size={24} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '8px' }}>
                  {cat.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  {cat.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* SECURITY HIGHLIGHT SECTION */}
      <section id="security" style={{ padding: '80px 24px', backgroundColor: '#F6F9FC' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          
          <div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '16px' }}>
              Built for Maximum Trust & Protection
            </h2>
            <p style={{ fontSize: '1rem', color: '#475569', marginBottom: '32px', lineHeight: 1.6 }}>
              CivicOne enforces strict server-side authorization boundaries, explicit citizen consent controls, and cryptographic reference masking.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                "Tokenized Aadhaar & UIDAI-compatible authorization layer",
                "256-Bit TLS End-to-End Cryptographic Encryption",
                "Explicit Citizen Consent required for document sharing",
                "Complete audit trails & active session control"
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={20} style={{ color: '#198754', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0B1F3A' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            backgroundColor: '#0B1F3A',
            borderRadius: '24px',
            padding: '40px',
            color: '#FFFFFF',
            boxShadow: '0 12px 32px rgba(11, 31, 58, 0.2)'
          }}>
            <Lock size={40} style={{ color: '#60A5FA', marginBottom: '20px' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px' }}>
              Citizen Data Privacy Promise
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#94A3B8', lineHeight: 1.6, marginBottom: '24px' }}>
              Your sensitive personal identity numbers are never exposed in plaintext. Every document transaction generates a cryptographically signed verification receipt.
            </p>
            <button
              onClick={onAccessCivicOne}
              style={{
                backgroundColor: '#0B5ED7',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Verify Your Identity Now <ChevronRight size={16} />
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER - ISOLATED AUTHORITY ROUTE ACCESSIBLE ONLY VIA DIRECT INTENT */}
      <footer style={{ backgroundColor: '#0B1F3A', color: '#FFFFFF', padding: '48px 24px 24px 24px', borderTop: '1px solid #1E293B' }}>
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
              <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '12px' }}>Citizen Vault</h4>
              <ul style={{ listStyle: 'none', fontSize: '0.825rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>My Civic Card</li>
                <li>Government IDs</li>
                <li>RTO Credentials</li>
                <li>Health Records</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '12px' }}>Authorized Portal Logins</h4>
              <ul style={{ listStyle: 'none', fontSize: '0.825rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>
                  <button
                    onClick={onOpenAuthorityPortal}
                    style={{ background: 'none', border: 'none', color: '#60A5FA', fontSize: '0.825rem', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                  >
                    🏛️ Government Officer Portal Login
                  </button>
                </li>
                <li style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                  (For authorized issuing agencies only)
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div style={{ maxWidth: '1200px', margin: '16px auto 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748B' }}>
          <div>© 2026 CivicOne National Identity Platform. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span>Strict Security Boundary &amp; Authorized Encryption Enabled</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
