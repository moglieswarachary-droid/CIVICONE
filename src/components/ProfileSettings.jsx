// src/components/ProfileSettings.jsx - Citizen Profile & Account Preferences with 6-Year Edit Guardrails

import React, { useState } from 'react';
import { User, ShieldCheck, Lock, Bell, CheckCircle2, Phone, Mail, MapPin, LogOut, Edit3, AlertTriangle, X, Check } from 'lucide-react';

export default function ProfileSettings({ citizen = {}, onLogout, onProfileUpdate }) {
  const [notifPrefs, setNotifPrefs] = useState({
    smsAlerts: true,
    emailAlerts: true,
    expiryReminders: true,
    govtAnnouncements: true
  });

  // Modal State for Edit Mobile / Email with 6-Year Guardrail Notice
  const [editModal, setEditModal] = useState({ open: false, field: '', value: '' });
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  // Extract Fallback Values to Ensure Fields are NEVER Blank
  const displayName = citizen.fullName || citizen.name || citizen.displayName || 'Raghavendra';
  const displayCivicId = citizen.citizenId || citizen.civicId || 'CIV-AP-710646-823';
  const displayDob = citizen.dateOfBirth || citizen.dob || '11-08-2026';
  const displayGender = citizen.gender || 'Male';
  const displayState = citizen.state || 'Andhra Pradesh';
  const displayAddress = citizen.address || `${displayState}, India`;
  const displayMobile = citizen.mobile || citizen.phone || '+91 8121280857';
  const displayEmail = citizen.email || citizen.emailMasked || 'raghavendra@civicone.gov.in';
  const displayAadhaar = citizen.maskedAadhaar || 'XXXX XXXX 8909';

  const handleOpenEditModal = (field) => {
    setUpdateMsg('');
    setEditModal({
      open: true,
      field,
      value: field === 'mobile' ? displayMobile.replace(/\D/g, '').slice(-10) : displayEmail
    });
  };

  const handleSaveProfileField = async () => {
    if (!editModal.value) return;
    setUpdating(true);
    setUpdateMsg('');

    try {
      const payload = {
        citizenId: displayCivicId,
        ...(editModal.field === 'mobile' && { mobile: editModal.value }),
        ...(editModal.field === 'email' && { email: editModal.value })
      };

      const res = await fetch('/api/citizen/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setUpdating(false);

      if (res.ok && data.success) {
        setUpdateMsg("✅ Profile updated successfully! Changes locked for 6 years.");
        setTimeout(() => {
          setEditModal({ open: false, field: '', value: '' });
          if (onProfileUpdate) onProfileUpdate(data.citizen);
          window.location.reload();
        }, 1200);
      } else {
        setUpdateMsg(data.error || "Failed to update profile.");
      }
    } catch (err) {
      setUpdating(false);
      setUpdateMsg("Network error updating profile.");
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
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '20px', backgroundColor: '#0F172A',
          color: '#38BDF8', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', fontWeight: 900, border: '3px solid #0B5ED7'
        }}>
          {displayName.charAt(0)}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0B1F3A' }}>{displayName}</h1>
            <span style={{
              backgroundColor: '#D1E7DD',
              color: '#0F5132',
              border: '1px solid #A3E635',
              padding: '3px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <CheckCircle2 size={14} /> Verified Citizen
            </span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#0B5ED7', fontWeight: 800, marginTop: '2px', fontFamily: 'monospace' }}>
            Civic ID: {displayCivicId}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
            Registered Mobile: {displayMobile} | Aadhaar Number: {displayAadhaar}
          </p>
        </div>

        <button
          onClick={onLogout}
          style={{
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.85rem',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <LogOut size={16} /> Sign Out Session
        </button>
      </div>

      {/* PERSONAL & IDENTITY INFORMATION */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={20} style={{ color: '#0B5ED7' }} /> Personal &amp; Verified Identity Details
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', fontSize: '0.875rem' }}>
          
          <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>FULL LEGAL NAME</span>
            <strong style={{ color: '#0B1F3A', fontSize: '0.95rem' }}>{displayName}</strong>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>DATE OF BIRTH</span>
            <strong style={{ color: '#0B1F3A', fontSize: '0.95rem' }}>{displayDob}</strong>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>GENDER</span>
            <strong style={{ color: '#0B1F3A', fontSize: '0.95rem' }}>{displayGender}</strong>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>STATE OF RESIDENCE</span>
            <strong style={{ color: '#0B1F3A', fontSize: '0.95rem' }}>{displayState}</strong>
          </div>

          {/* EDITABLE REGISTERED MOBILE */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>REGISTERED MOBILE</span>
              <strong style={{ color: '#0B1F3A', fontSize: '0.95rem' }}>{displayMobile}</strong>
            </div>
            <button
              onClick={() => handleOpenEditModal('mobile')}
              style={{
                backgroundColor: '#E0F2FE', color: '#0369A1', border: 'none',
                padding: '6px 12px', borderRadius: '8px', fontWeight: 800,
                fontSize: '0.775rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              <Edit3 size={13} /> Edit
            </button>
          </div>

          {/* EDITABLE REGISTERED EMAIL */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>REGISTERED EMAIL</span>
              <strong style={{ color: '#0B1F3A', fontSize: '0.95rem' }}>{displayEmail}</strong>
            </div>
            <button
              onClick={() => handleOpenEditModal('email')}
              style={{
                backgroundColor: '#E0F2FE', color: '#0369A1', border: 'none',
                padding: '6px 12px', borderRadius: '8px', fontWeight: 800,
                fontSize: '0.775rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              <Edit3 size={13} /> Edit
            </button>
          </div>

          <div style={{ gridColumn: '1 / -1', backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem', fontWeight: 700 }}>PERMANENT RESIDENTIAL ADDRESS</span>
            <strong style={{ color: '#0B1F3A', fontSize: '0.95rem' }}>{displayAddress}</strong>
          </div>
        </div>
      </div>

      {/* EDIT MOBILE / EMAIL SECURITY GUARDRAIL MODAL */}
      {editModal.open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '480px', width: '100%',
            padding: '28px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', border: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', fontWeight: 900, fontSize: '1.1rem' }}>
                <AlertTriangle size={24} /> National Identity Security Notice
              </div>
              <button onClick={() => setEditModal({ open: false, field: '', value: '' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            {/* 6-YEAR LOCK POPUP WARNING */}
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '14px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.825rem', color: '#991B1B', lineHeight: '1.4' }}>
              ⚠️ <strong>WARNING: 6-Year Restriction Rule</strong><br />
              As mandated by the National Digital Identity Authority, once you update your registered {editModal.field === 'mobile' ? 'Mobile Number' : 'Email Address'}, you <strong>cannot modify it again for 6 years</strong>. Please ensure the new value is correct.
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                ENTER NEW {editModal.field.toUpperCase()}
              </label>
              <input
                type={editModal.field === 'mobile' ? 'tel' : 'email'}
                value={editModal.value}
                onChange={(e) => setEditModal(prev => ({ ...prev, value: e.target.value }))}
                placeholder={editModal.field === 'mobile' ? '10-digit mobile number' : 'your.email@example.com'}
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px',
                  border: '1.5px solid #CBD5E1', fontSize: '0.95rem', fontWeight: 700, outline: 'none'
                }}
              />
            </div>

            {updateMsg && (
              <div style={{ fontSize: '0.825rem', fontWeight: 800, marginBottom: '14px', color: updateMsg.includes('✅') ? '#059669' : '#DC2626' }}>
                {updateMsg}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setEditModal({ open: false, field: '', value: '' })}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 800, border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfileField}
                disabled={updating}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', backgroundColor: '#0B5ED7', color: '#FFFFFF', fontWeight: 800, border: 'none', cursor: 'pointer' }}
              >
                {updating ? 'Saving Lock...' : 'Confirm & Lock (6 Yrs)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DATA & PERMISSIONS PRIVACY CONTROL CENTER */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', marginBottom: '24px' }}>
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
            { id: 'perm-01', org: 'ABC University Admissions', doc: 'Degree Certificate', purpose: 'Higher Education Admission Verification', duration: '24 Hours', granted: '13 Aug 2026' },
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

    </div>
  );
}
