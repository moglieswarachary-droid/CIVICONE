// src/components/PrivacyCenter.jsx - Citizen Privacy & Data Access Viewer
// Displays authorized organizations with read-only access to citizen data (View Only)

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, CheckCircle2, Clock, Key, RefreshCw, AlertCircle, Building2, FileText, Calendar, Shield, X, Info } from 'lucide-react';
import { privacyService, auditService } from '../services/api.js';

export default function PrivacyCenter({ citizen }) {
  const [activeConsents, setActiveConsents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [selectedConsent, setSelectedConsent] = useState(null);

  const loadPrivacyData = async () => {
    setLoading(true);
    try {
      const [resCons, resReqs, resLogs] = await Promise.all([
        privacyService.getActiveConsents(),
        privacyService.getPendingRequests(),
        auditService.getAuditLogs()
      ]);

      if (resCons.consents) setActiveConsents(resCons.consents);
      if (resReqs.requests) setPendingRequests(resReqs.requests);
      if (resLogs.logs) setAuditLogs(resLogs.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrivacyData();
  }, [citizen]);

  const handleApprove = async (requestId, orgName) => {
    try {
      const res = await privacyService.approveRequest(requestId);
      if (res.success) {
        setMsg(`Consent granted for ${orgName}. Secure tokenized view-only access generated.`);
        loadPrivacyData();
      }
    } catch (err) {
      setMsg('Failed to approve request.');
    }
  };

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
            <ShieldCheck size={16} /> Privacy & Data Access View
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0B1F3A', letterSpacing: '-0.02em' }}>
            Who Has Access To My Data?
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
            View all verified organizations holding authorized view-only permissions to your citizen data and credentials.
          </p>
        </div>

        <button
          type="button"
          onClick={loadPrivacyData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#F1F5F9',
            color: '#334155',
            border: 'none',
            padding: '10px 16px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Status
        </button>
      </div>

      {msg && (
        <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #6EE7B7', padding: '14px 20px', borderRadius: '12px', color: '#065F46', fontWeight: 700, fontSize: '0.875rem', marginBottom: '24px' }}>
          ✅ {msg}
        </div>
      )}

      {/* SECTION 1: PENDING CONSENT REQUESTS (IF ANY) */}
      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: '36px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle color="#D97706" size={20} /> Pending Access Requests ({pendingRequests.length})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '16px' }}>
            {pendingRequests.map((r) => (
              <div key={r.id} style={{ backgroundColor: '#FFFBEB', borderRadius: '18px', border: '1.5px solid #FCD34D', padding: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', marginBottom: '6px' }}>
                  NEW ACCESS REQUEST
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#78350F', marginBottom: '4px' }}>
                  {r.orgName}
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#92400E', marginBottom: '12px' }}>
                  Requested Document: <strong>{r.docName}</strong><br />
                  Purpose: <strong>{r.purpose}</strong><br />
                  Scope: <strong>{r.accessType || 'View Only'}</strong>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => handleApprove(r.id, r.orgName)}
                    style={{
                      flex: 1,
                      backgroundColor: '#059669',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Approve View Access
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingRequests(prev => prev.filter(req => req.id !== r.id))}
                    style={{
                      flex: 1,
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      border: '1px solid #CBD5E1',
                      padding: '10px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: ACTIVE AUTHORIZED CONSENTS ("WHO HAS ACCESS?") */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key color="#0B5ED7" size={20} /> Who Has Access To My Data?
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>
            {activeConsents.filter(c => c.status === 'ACTIVE').length} Active Authorizations
          </span>
        </div>

        {activeConsents.length === 0 ? (
          <div style={{ padding: '32px', borderRadius: '16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', textAlign: 'center', color: '#64748B', fontSize: '0.9rem' }}>
            No third-party organization currently holds active access consent to your records.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: '18px' }}>
            {activeConsents.map((c) => {
              const docTitle = c.docName || (c.orgName?.includes('Bank') ? 'Aadhaar & PAN Card Credentials' : 'ABHA Health Profile & Health Records');
              const grantedDate = c.createdAt || '14 Aug 2026';
              const validUntil = c.expiryDate || '13 Sep 2026 (30 Days)';
              const purposeText = c.purpose || 'Identity KYC & Verification';
              const scopeText = c.accessType || 'View Only';

              return (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '18px',
                    border: '1.5px solid #E2E8F0',
                    padding: '22px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    {/* Top Row: Active Status Badge & Token */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          backgroundColor: '#ECFDF5',
                          color: '#047857',
                          border: '1px solid #A7F3D0',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle2 size={12} /> ACTIVE
                        </span>
                        <span style={{
                          backgroundColor: '#EFF6FF',
                          color: '#1D4ED8',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.7rem'
                        }}>
                          {scopeText}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace' }}>
                        Token: {c.id}
                      </span>
                    </div>

                    {/* Organization Title */}
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building2 size={18} style={{ color: '#0B5ED7' }} />
                      {c.orgName}
                    </h4>

                    {/* Details List */}
                    <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
                      <div>
                        <span style={{ color: '#64748B' }}>Authorized Document:</span>{' '}
                        <strong style={{ color: '#0B1F3A' }}>{docTitle}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B' }}>Purpose:</span>{' '}
                        <strong style={{ color: '#0B1F3A' }}>{purposeText}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B' }}>Access Scope:</span>{' '}
                        <strong style={{ color: '#0B5ED7' }}>{scopeText}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B' }}>Granted On:</span>{' '}
                        <strong style={{ color: '#0B1F3A' }}>{grantedDate}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B' }}>Access Valid Until:</span>{' '}
                        <strong style={{ color: '#0B1F3A' }}>{validUntil}</strong>
                      </div>
                    </div>
                  </div>

                  {/* ONLY VIEW OPTION ENABLED */}
                  <button
                    type="button"
                    onClick={() => setSelectedConsent({ ...c, docName: docTitle, createdAt: grantedDate, expiryDate: validUntil, purpose: purposeText, accessType: scopeText })}
                    style={{
                      width: '100%',
                      backgroundColor: '#EFF6FF',
                      color: '#1A4F9C',
                      border: '1.5px solid #BFDBFE',
                      padding: '11px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                    className="hover-card"
                  >
                    <Eye size={16} /> View Access Details
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 3: ACCESS TIMELINE & SECURITY AUDIT LOGS */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock color="#059669" size={20} /> Access Timeline & Security Audit Trail
        </h3>

        <div style={{ borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          {auditLogs.slice(0, 6).map((log, idx) => (
            <div
              key={log.id || idx}
              style={{
                padding: '16px 20px',
                backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC',
                borderBottom: idx === 5 ? 'none' : '1px solid #F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0B1F3A' }}>
                  {log.event}
                </div>
                <div style={{ fontSize: '0.775rem', color: '#64748B', marginTop: '2px' }}>
                  Device: {log.device} | Location: {log.location} | IP: {log.ip}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: log.status === 'SUCCESS' ? '#047857' : '#D97706' }}>
                  {log.status}
                </span>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{log.timestamp}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VIEW ACCESS DETAILS MODAL */}
      {selectedConsent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 250,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '480px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
            border: '1.5px solid #DBEAFE'
          }}>
            <button
              type="button"
              onClick={() => setSelectedConsent(null)}
              aria-label="Close modal"
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: '#64748B', cursor: 'pointer', border: 'none' }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '12px' }}>
              <ShieldCheck size={14} /> AUTHORIZED DATA ACCESS RECORD
            </div>

            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>
              {selectedConsent.orgName}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '20px', fontFamily: 'monospace' }}>
              Consent Token ID: {selectedConsent.id}
            </div>

            {/* Structured Info Box */}
            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Authorized Document:</span>
                <strong style={{ color: '#0B1F3A', textAlign: 'right' }}>{selectedConsent.docName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Access Scope:</span>
                <strong style={{ color: '#0B5ED7' }}>{selectedConsent.accessType || 'View Only'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Purpose:</span>
                <strong style={{ color: '#0B1F3A', textAlign: 'right' }}>{selectedConsent.purpose}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Granted Date:</span>
                <strong style={{ color: '#0B1F3A' }}>{selectedConsent.createdAt}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Valid Until:</span>
                <strong style={{ color: '#0B1F3A' }}>{selectedConsent.expiryDate}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Access Mode:</span>
                <strong style={{ color: '#047857' }}>Encrypted Read-Only Stream</strong>
              </div>
            </div>

            {/* Authorized Fields */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
                Disclosed Data Fields (View Only):
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(selectedConsent.authorizedFields || ['Full Name', 'Date of Birth', 'Masked Aadhaar', 'Address / ID Token']).map((f, i) => (
                  <span key={i} style={{ backgroundColor: '#F1F5F9', color: '#1E293B', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700 }}>
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedConsent(null)}
              style={{
                width: '100%',
                backgroundColor: '#1A4F9C',
                color: '#FFFFFF',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.9rem',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
