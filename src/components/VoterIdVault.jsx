// src/components/VoterIdVault.jsx - Dedicated Voter ID Module in CivicVault

import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, Eye, Share2, Ban, History, CheckCircle2, Lock, Landmark, MapPin, Calendar, User, FileText, ExternalLink } from 'lucide-react';

export default function VoterIdVault({ citizen, onOpenShareModal }) {
  const [voter, setVoter] = useState({
    name: citizen?.name || "Ananya Sharma",
    epicNo: "EPIC-MH-904812",
    dob: "14-08-1994",
    gender: "Female",
    fatherName: "Rajendra Sharma",
    constituency: "168 - Chandivali Assembly Constituency",
    parliamentaryConstituency: "Mumbai North East",
    state: "Maharashtra",
    pollingStation: "St. Anthony High School, Room No. 4, Sakinaka",
    verificationStatus: "OFFICIALLY VERIFIED (ECI REFERENCE)",
    issuingAuthority: "Election Commission of India",
    verificationDate: "15-01-2024",
    civiqoneVerificationId: "CIV-VOTER-ECI-2026-904812",
    accessHistory: [
      { id: "vlog-1", accessor: "Self Access via CivicVault", date: "Today, 10:15 AM", purpose: "Identity Verification" },
      { id: "vlog-2", accessor: "Passport Seva Verification Portal", date: "12 May 2026", purpose: "Address Proof Check" }
    ]
  });

  const [activeSubTab, setActiveSubTab] = useState('card'); // 'card' | 'history' | 'verify'
  const [copiedToken, setCopiedToken] = useState(false);

  useEffect(() => {
    fetch('/api/voter-id/me')
      .then(res => res.json())
      .then(data => {
        if (data.voter) setVoter(data.voter);
      })
      .catch(err => console.error(err));
  }, []);

  const handleCopyVerificationId = () => {
    navigator.clipboard.writeText(voter.civiqoneVerificationId);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>

      {/* HEADER STRIP */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#EAF3FF', color: '#0B5ED7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Landmark size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0B1F3A', letterSpacing: '-0.02em' }}>
                National Voter Identity Vault
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                Election Commission of India Reference Credential
              </span>
            </div>
          </div>
        </div>

        {/* Verification Status Pill */}
        <div style={{
          backgroundColor: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#047857',
          padding: '8px 16px',
          borderRadius: '30px',
          fontSize: '0.8rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <CheckCircle2 size={16} /> {voter.verificationStatus}
        </div>
      </div>

      {/* TAB SUB-BAR */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', marginBottom: '24px', paddingBottom: '8px' }}>
        {[
          { id: 'card', label: '📇 Voter ID Card' },
          { id: 'history', label: '📜 Access History Logs' },
          { id: 'verify', label: '🛡️ Audit & ECI Verification' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: activeSubTab === t.id ? '#0B5ED7' : 'transparent',
              color: activeSubTab === t.id ? '#FFFFFF' : '#64748B',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SUB-TAB 1: PREMIUM VOTER ID CARD INTERFACE */}
      {activeSubTab === 'card' && (
        <div>
          <div style={{
            maxWidth: '540px',
            margin: '0 auto 28px auto',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #072B61 0%, #0B5ED7 60%, #0284C7 100%)',
            color: '#FFFFFF',
            padding: '24px',
            boxShadow: '0 20px 40px -10px rgba(11, 94, 215, 0.4)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Watermark Crest */}
            <div style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.1, pointerEvents: 'none' }}>
              <Landmark size={180} />
            </div>

            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#BFDBFE' }}>
                  ELECTION COMMISSION OF INDIA
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>
                  ELECTOR PHOTO IDENTITY CARD
                </div>
              </div>
              <div style={{ backgroundColor: '#FFFFFF', color: '#0B5ED7', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 900, fontFamily: 'monospace' }}>
                ECI VERIFIED
              </div>
            </div>

            {/* Card Body Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '16px', alignItems: 'center' }}>
              {/* Photo Avatar */}
              <div style={{ width: '90px', height: '105px', borderRadius: '12px', backgroundColor: '#FFFFFF', color: '#0B1F3A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.8)' }}>
                <User size={48} color="#0B5ED7" />
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', marginTop: '4px' }}>Elector Photo</span>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>EPIC Number</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '0.05em', color: '#FEF08A' }}>{voter.epicNo}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Elector Name</span>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{voter.name}</span>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Gender</span>
                    <span style={{ fontWeight: 700 }}>{voter.gender}</span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.65rem', color: '#93C5FD', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Date of Birth</span>
                    <span style={{ fontWeight: 700 }}>{voter.dob}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Constituency Footer */}
            <div style={{ marginTop: '18px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.15)', fontSize: '0.775rem' }}>
              <div style={{ color: '#93C5FD', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}>Assembly Constituency</div>
              <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{voter.constituency}</div>
            </div>
          </div>

          {/* Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenShareModal && onOpenShareModal({ id: 'voter-01', name: 'Voter Identity Card', category: 'Government' })}
              style={{
                backgroundColor: '#0B5ED7',
                color: '#FFFFFF',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(11, 94, 215, 0.3)'
              }}
            >
              <Share2 size={16} /> Share for Organization Verification
            </button>

            <button
              onClick={handleCopyVerificationId}
              style={{
                backgroundColor: '#F1F5F9',
                color: '#0F172A',
                border: '1px solid #CBD5E1',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ExternalLink size={16} /> {copiedToken ? '✓ Verification ID Copied' : 'Copy Verification ID'}
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ACCESS HISTORY LOGS */}
      {activeSubTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {voter.accessHistory.map((log) => (
            <div key={log.id} style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '14px 18px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A' }}>{log.accessor}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>Purpose: {log.purpose}</div>
              </div>
              <div style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: 700 }}>
                {log.date}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: ECI VERIFICATION DETAILS */}
      {activeSubTab === 'verify' && (
        <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', fontSize: '0.875rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
            Official Verification Metadata
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Issuing Authority</span>
              <div style={{ fontWeight: 800, color: '#0B1F3A' }}>{voter.issuingAuthority}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Polling Station</span>
              <div style={{ fontWeight: 800, color: '#0B1F3A' }}>{voter.pollingStation}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Verification Date</span>
              <div style={{ fontWeight: 800, color: '#0B1F3A' }}>{voter.verificationDate}</div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>CIVIQONE Token</span>
              <div style={{ fontWeight: 800, fontFamily: 'monospace', color: '#0B5ED7' }}>{voter.civiqoneVerificationId}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
