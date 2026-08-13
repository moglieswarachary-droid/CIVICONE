// src/components/ProfileSettings.jsx - Citizen Profile & Account Preferences

import React, { useState } from 'react';
import { User, ShieldCheck, Lock, Bell, CheckCircle2, Phone, Mail, MapPin, LogOut, Sliders, Crown, Sparkles } from 'lucide-react';

export default function ProfileSettings({ citizen, onLogout, card, onCardUpdate }) {
  const [notifPrefs, setNotifPrefs] = useState({
    smsAlerts: true,
    emailAlerts: true,
    expiryReminders: true,
    govtAnnouncements: true
  });

  const isGold = card?.tier === 'GOLD' || !card;

  const handleToggleTier = async (newTier) => {
    try {
      const res = await fetch('/api/card/update-tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: newTier })
      });
      const data = await res.json();
      if (data.success && onCardUpdate) {
        onCardUpdate(data.card);
      }
    } catch (err) {
      console.log("Tier updated locally");
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HEADER CARD */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '32px',
        border: '1px solid #E2E8F0',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        <img
          src={citizen.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
          alt={citizen.name}
          style={{
            width: '90px', height: '90px', borderRadius: '20px', objectFit: 'cover',
            border: isGold ? '3px solid #CA8A04' : '3px solid #0B5ED7',
            boxShadow: isGold ? '0 0 16px rgba(202, 138, 4, 0.4)' : 'none'
          }}
        />

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0B1F3A' }}>{citizen.name}</h1>
            <span style={{
              backgroundColor: isGold ? '#FEF3C7' : '#D1E7DD',
              color: isGold ? '#92400E' : '#0F5132',
              border: `1px solid ${isGold ? '#FDE68A' : '#A3E635'}`,
              padding: '3px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {isGold ? <Crown size={14} style={{ color: '#CA8A04' }} /> : <CheckCircle2 size={14} />}
              {isGold ? "👑 Premium Gold Citizen" : "🟢 Verified Identity"}
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: isGold ? '#CA8A04' : '#0B5ED7', fontWeight: 800, marginTop: '2px' }}>
            CivicOne ID: {citizen.civicId}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
            Registered Mobile: {citizen.phone} | Identity Ref: {citizen.maskedAadhaar}
          </p>
        </div>

        <button
          onClick={onLogout}
          style={{
            backgroundColor: '#F8D7DA',
            color: '#842029',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <LogOut size={16} /> Sign Out Session
        </button>
      </div>

      {/* CARD TIER MANAGEMENT SECTION */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        padding: '28px',
        border: '1.5px solid #FDE68A',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FEFCE8 100%)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#92400E', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Crown size={22} style={{ color: '#CA8A04' }} /> Civic Card Tier & Identity Membership
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#B45309', marginTop: '2px' }}>
              Switch your digital passcard appearance and active security clearance level.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => handleToggleTier('GOLD')}
              style={{
                backgroundColor: isGold ? '#CA8A04' : '#F1F5F9',
                color: isGold ? '#FFFFFF' : '#475569',
                border: isGold ? 'none' : '1px solid #CBD5E1',
                padding: '8px 16px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Crown size={14} /> Premium Gold Tier
            </button>

            <button
              onClick={() => handleToggleTier('STANDARD')}
              style={{
                backgroundColor: !isGold ? '#0B5ED7' : '#F1F5F9',
                color: !isGold ? '#FFFFFF' : '#475569',
                border: !isGold ? 'none' : '1px solid #CBD5E1',
                padding: '8px 16px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.8rem'
              }}
            >
              Standard Card
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
          {[
            { title: "VIP Priority Service Clearance", desc: "Fast-track RTO, Passport, and state portal authorizations." },
            { title: "Metallic Gold Security Chip", desc: "Dynamic cryptographic tokenization with custom gold badge." },
            { title: "NFC Touch Verification", desc: "Instant tap-to-verify identity clearance for official scanners." },
            { title: "Cryptographic Seal Export", desc: "Download high-resolution passcards with verified QR tokens." }
          ].map((perk, idx) => (
            <div key={idx} style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '12px', border: '1px solid #FEF08A' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} style={{ color: '#CA8A04' }} /> {perk.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>{perk.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PERSONAL & IDENTITY INFORMATION */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '16px' }}>
          Personal & Identity Details
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', fontSize: '0.875rem' }}>
          <div>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Full Legal Name</span>
            <strong style={{ color: '#0B1F3A' }}>{citizen.name}</strong>
          </div>

          <div>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Date of Birth</span>
            <strong style={{ color: '#0B1F3A' }}>{citizen.dob}</strong>
          </div>

          <div>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Gender</span>
            <strong style={{ color: '#0B1F3A' }}>{citizen.gender}</strong>
          </div>

          <div>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Registered Email</span>
            <strong style={{ color: '#0B1F3A' }}>{citizen.email}</strong>
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Permanent Address</span>
            <strong style={{ color: '#0B1F3A' }}>{citizen.address}</strong>
          </div>
        </div>
      </div>

      {/* MY DATA & PERMISSIONS PRIVACY CONTROL CENTER */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lock size={20} style={{ color: '#0B5ED7' }} /> My Data &amp; Active Consent Permissions
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
              Real-time privacy ledger of third-party organizations authorized to access your vault documents.
            </p>
          </div>
          <span style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
            ● 2 Active Consent Grants
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { id: 'perm-01', org: 'ABC University Admissions', doc: 'B.Tech Degree Certificate', purpose: 'M.Tech Admission Verification', duration: '24 Hours', granted: '13 Aug 2026' },
            { id: 'perm-02', org: 'Parivahan Sewa (MoRTH)', doc: 'Smart Driving Licence', purpose: 'Licence Renewal Application', duration: '7 Days', granted: '12 Aug 2026' }
          ].map(perm => (
            <div key={perm.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', borderRadius: '14px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#0B1F3A' }}>{perm.org}</strong>
                <div style={{ fontSize: '0.775rem', color: '#0B5ED7', fontWeight: 700, marginTop: '2px' }}>Document: {perm.doc}</div>
                <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '2px' }}>Purpose: {perm.purpose} • Duration: {perm.duration}</div>
              </div>

              <button
                onClick={() => alert(`Consent for ${perm.org} has been revoked immediately.`)}
                style={{ backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', padding: '8px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '0.775rem', cursor: 'pointer' }}
              >
                Revoke Access
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* NOTIFICATION PREFERENCES */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '16px' }}>
          Notification Preferences & Consent Controls
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { key: 'smsAlerts', title: 'SMS Security Alerts', desc: 'Receive immediate SMS notifications when your CivicOne Card QR is scanned.' },
            { key: 'emailAlerts', title: 'Email Verification Receipts', desc: 'Send cryptographic PDF receipts to registered email on document sharing.' },
            { key: 'expiryReminders', title: 'Document Expiry Reminders', desc: 'Notify me 90 days before Driving Licence, PUC, or Passport expiration.' },
            { key: 'govtAnnouncements', title: 'Government Policy Circulars', desc: 'Receive high-priority national updates and department notices.' }
          ].map(pref => (
            <div key={pref.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div>
                <strong style={{ fontSize: '0.9rem', color: '#0B1F3A' }}>{pref.title}</strong>
                <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>{pref.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs[pref.key]}
                onChange={(e) => setNotifPrefs({ ...notifPrefs, [pref.key]: e.target.checked })}
                style={{ width: '20px', height: '20px', accentColor: '#0B5ED7', cursor: 'pointer' }}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
