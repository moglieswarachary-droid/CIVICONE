// src/components/PrivacyCenter.jsx - Citizen Privacy & Access Control Center

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, AlertOctagon, CheckCircle2, XCircle, Clock, Key, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { privacyService, auditService } from '../services/api.js';

export default function PrivacyCenter({ citizen }) {
  const [activeConsents, setActiveConsents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

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

  const handleRevoke = async (shareId, orgName) => {
    try {
      const res = await privacyService.revokeConsent(shareId);
      if (res.success) {
        setMsg(`Access authorization for ${orgName} has been REVOKED instantly.`);
        loadPrivacyData();
      }
    } catch (err) {
      setMsg('Failed to revoke consent.');
    }
  };

  const handleApprove = async (requestId, orgName) => {
    try {
      const res = await privacyService.approveRequest(requestId);
      if (res.success) {
        setMsg(`Consent granted for ${orgName}. Secure tokenized access generated.`);
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
            <ShieldCheck size={16} /> Privacy & Data Access Control
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0B1F3A', letterSpacing: '-0.02em' }}>
            Citizen Privacy Center
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
            You maintain full sovereignty over your identity and documents. Organizations only receive what you authorize and access can be revoked instantly.
          </p>
        </div>

        <button
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

      {/* SECTION 1: PENDING CONSENT REQUESTS */}
      {pendingRequests.length > 0 && (
        <div style={{ marginBottom: '36px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle color="#D97706" size={20} /> Pending Access Requests ({pendingRequests.length})
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
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
                  Scope: <strong>{r.accessType}</strong>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
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
                    Approve Access
                  </button>
                  <button
                    style={{
                      flex: 1,
                      backgroundColor: '#EF4444',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Deny
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '18px' }}>
            {activeConsents.map((c) => (
              <div
                key={c.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #E2E8F0',
                  padding: '22px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{
                    backgroundColor: c.status === 'ACTIVE' ? '#ECFDF5' : '#FEF2F2',
                    color: c.status === 'ACTIVE' ? '#047857' : '#991B1B',
                    padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem'
                  }}>
                    {c.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontFamily: 'monospace' }}>
                    Token: {c.id}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '6px' }}>
                  {c.orgName}
                </h4>

                <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' }}>
                  <div>Authorized Document: <strong style={{ color: '#0B1F3A' }}>{c.docName}</strong></div>
                  <div>Purpose: <strong>{c.purpose}</strong></div>
                  <div>Access Scope: <strong>{c.accessType || 'View Only'}</strong></div>
                  <div>Granted On: <strong>{c.createdAt}</strong></div>
                  <div>Access Valid Until: <strong>{c.expiryDate}</strong></div>
                </div>

                {c.status === 'ACTIVE' ? (
                  <button
                    onClick={() => handleRevoke(c.id, c.orgName)}
                    style={{
                      width: '100%',
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '11px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <XCircle size={16} /> Revoke Access Instantly
                  </button>
                ) : (
                  <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#991B1B', fontWeight: 700, padding: '8px', borderRadius: '8px', backgroundColor: '#FEF2F2' }}>
                    Access Authorization Terminated
                  </div>
                )}
              </div>
            ))}
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
    </div>
  );
}
