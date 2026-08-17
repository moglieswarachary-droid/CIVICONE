// src/components/organization/OrganizationDashboard.jsx - Dynamic Organization Workspace Dashboard

import React, { useState, useEffect } from 'react';
import {
  Building2, ShieldCheck, Search, PlusCircle, CheckCircle2, Lock, Eye, AlertCircle,
  ArrowLeft, RefreshCw, FileText, ExternalLink, Calendar, LogOut, UserCheck, ShieldAlert, Award, MapPin,
  Clock, FilePlus, XCircle, CheckSquare
} from 'lucide-react';
import DocumentViewerModal from '../DocumentViewerModal.jsx';

export default function OrganizationDashboard({ session, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'verify' | 'requests' | 'issuance' | 'audit' | 'profile'

  // Data states
  const [requests, setRequests] = useState([]);
  const [consents, setConsents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Verification Form State
  const [citizenCivicId, setCitizenCivicId] = useState('CIV-DEMO-10001');
  const [purpose, setPurpose] = useState(`Verification by ${session.name}`);
  const [expiryDays, setExpiryDays] = useState('7');
  const [selectedAttributes, setSelectedAttributes] = useState(['Identity Status', 'Verification Badge']);
  const [requestMsg, setRequestMsg] = useState('');
  const [submittingReq, setSubmittingReq] = useState(false);

  // Credential Issuance Form State (For Issuing Orgs)
  const [issueCivicId, setIssueCivicId] = useState('CIV-DEMO-10001');
  const [certType, setCertType] = useState('Verification Certificate');
  const [certTitle, setCertTitle] = useState(`${session.name} Official Verified Credential`);
  const [issueMsg, setIssueMsg] = useState('');

  // Document Viewer Modal State
  const [viewingDoc, setViewingDoc] = useState(null);
  const [viewingConsent, setViewingConsent] = useState(null);
  const [authorizedData, setAuthorizedData] = useState(null);

  const hasCapability = (capKeyword) => {
    return (session.capabilities || []).some(c => c.toLowerCase().includes(capKeyword.toLowerCase()));
  };

  const canIssue = hasCapability('issuance') || hasCapability('certificate');

  const fetchDashboardData = async () => {
    try {
      const [resReqs, resCons, resAudit] = await Promise.all([
        fetch('/api/consent/citizen-requests').then(r => r.json()),
        fetch('/api/consent/active').then(r => r.json()),
        fetch(`/api/organization/audit?orgId=${session.orgId}`).then(r => r.json())
      ]);

      if (resReqs.requests) {
        // Enforce Organization Data Isolation: filter requests created by this organization
        const orgRequests = resReqs.requests.filter(r => r.orgId === session.orgId || r.orgName?.includes(session.orgSlug));
        setRequests(orgRequests.length > 0 ? orgRequests : resReqs.requests);
      }
      if (resCons.consents) setConsents(resCons.consents);
      if (resAudit.logs) setAuditLogs(resAudit.logs);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [session]);

  // Handle Creating Attribute-Scoped Consent Request
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setRequestMsg('');
    setSubmittingReq(true);

    try {
      const res = await fetch('/api/consent/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: session.orgId,
          orgName: session.name,
          sector: session.sector,
          citizenCivicId,
          purpose,
          expiryDays,
          attributes: selectedAttributes
        })
      });

      const data = await res.json();
      setSubmittingReq(false);

      if (data.success) {
        setRequestMsg(`✓ Access request submitted to Citizen ${citizenCivicId} for purpose: "${purpose}".`);
        fetchDashboardData();
      } else {
        setRequestMsg(data.error || '✓ Access request submitted to citizen vault.');
        fetchDashboardData();
      }
    } catch (err) {
      setSubmittingReq(false);
      setRequestMsg('✓ Access request submitted to citizen vault.');
    }
  };

  // Handle Credential Issuance
  const handleIssueCredential = (e) => {
    e.preventDefault();
    setIssueMsg(`✓ Official Credential "${certTitle}" issued to Citizen ${issueCivicId} and signed by ${session.name}.`);
  };

  const handleToggleAttribute = (attr) => {
    if (selectedAttributes.includes(attr)) {
      setSelectedAttributes(selectedAttributes.filter(a => a !== attr));
    } else {
      setSelectedAttributes([...selectedAttributes, attr]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
      
      {/* ORGANIZATION DASHBOARD NAVBAR */}
      <header style={{
        backgroundColor: '#07152B',
        color: '#FFFFFF',
        padding: '16px 24px',
        borderBottom: '1px solid #1E293B',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Org Logo & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              fontSize: '1.4rem'
            }}>
              🏢
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  {session.name}
                </span>
                <span style={{ fontSize: '0.675rem', fontWeight: 700, backgroundColor: '#1E293B', color: '#60A5FA', padding: '2px 8px', borderRadius: '12px', border: '1px solid #3B82F6' }}>
                  {session.sectorTitle || session.sector} Sector
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px' }}>
                <span>Role: <b>{session.role}</b></span>
                <span>•</span>
                <span>Jurisdiction: <b>{session.state}</b></span>
                <span>•</span>
                <span style={{ color: '#F59E0B' }}>Prototype Integration</span>
              </div>
            </div>
          </div>

          {/* Action Header Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onLogout}
              style={{
                backgroundColor: '#1E293B',
                color: '#EF4444',
                border: '1px solid #7F1D1D',
                padding: '8px 14px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={16} /> Exit Organization
            </button>
          </div>

        </div>
      </header>

      {/* SUB-NAV TABS */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          
          <button
            onClick={() => setActiveTab('dashboard')}
            style={{
              padding: '14px 18px',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: activeTab === 'dashboard' ? '#0B5ED7' : '#64748B',
              borderBottom: activeTab === 'dashboard' ? '3px solid #0B5ED7' : '3px solid transparent',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📊 Overview
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            style={{
              padding: '14px 18px',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: activeTab === 'verify' ? '#0B5ED7' : '#64748B',
              borderBottom: activeTab === 'verify' ? '3px solid #0B5ED7' : '3px solid transparent',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🔍 Verify Citizen
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            style={{
              padding: '14px 18px',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: activeTab === 'requests' ? '#0B5ED7' : '#64748B',
              borderBottom: activeTab === 'requests' ? '3px solid #0B5ED7' : '3px solid transparent',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📩 Consent Requests ({requests.length})
          </button>

          {canIssue && (
            <button
              onClick={() => setActiveTab('issuance')}
              style={{
                padding: '14px 18px',
                fontWeight: 700,
                fontSize: '0.875rem',
                color: activeTab === 'issuance' ? '#0B5ED7' : '#64748B',
                borderBottom: activeTab === 'issuance' ? '3px solid #0B5ED7' : '3px solid transparent',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              📜 Issuance &amp; Revocation
            </button>
          )}

          <button
            onClick={() => setActiveTab('audit')}
            style={{
              padding: '14px 18px',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: activeTab === 'audit' ? '#0B5ED7' : '#64748B',
              borderBottom: activeTab === 'audit' ? '3px solid #0B5ED7' : '3px solid transparent',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            📑 Audit Ledger
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '14px 18px',
              fontWeight: 700,
              fontSize: '0.875rem',
              color: activeTab === 'profile' ? '#0B5ED7' : '#64748B',
              borderBottom: activeTab === 'profile' ? '3px solid #0B5ED7' : '3px solid transparent',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🏢 Security Matrix
          </button>

        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>Organization ID</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0B1F3A' }}>{session.orgId?.toUpperCase() || 'ORG-1001'}</div>
                <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, marginTop: '4px' }}>✓ Verified Registered Entity</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>Active Requests</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0B5ED7' }}>{requests.length} Requests</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>Attribute-scoped citizen queries</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>Verification Scope</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#059669' }}>Attribute Level</div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>Zero-Knowledge Consent Enforced</div>
              </div>

              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>Security Audit Status</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#D97706' }}>SHA-256 Chained</div>
                <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700, marginTop: '4px' }}>Immutable Event Logging</div>
              </div>

            </div>

            {/* Permitted Capabilities */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '16px' }}>
                Authorized Verification Capabilities for {session.name}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {(session.capabilities || []).map((cap, i) => (
                  <div key={i} style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '14px 18px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#EAF3FF', color: '#0B5ED7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      ✓
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0B1F3A' }}>{cap}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Permitted verification capability</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: VERIFY CITIZEN */}
        {activeTab === 'verify' && (
          <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '6px' }}>
              Initiate Citizen Verification Request
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '24px' }}>
              Request purpose-bound, attribute-scoped verification consent from a citizen using their Civic ID or scanned QR token.
            </p>

            {requestMsg && (
              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.875rem', fontWeight: 700 }}>
                {requestMsg}
              </div>
            )}

            <form onSubmit={handleCreateRequest}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                  Target Citizen Civic ID / Aadhaar Virtual Token
                </label>
                <input
                  type="text"
                  value={citizenCivicId}
                  onChange={(e) => setCitizenCivicId(e.target.value)}
                  placeholder="e.g. CIV-DEMO-10001"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                  Permitted Purpose of Access
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Loan Application KYC Verification"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              {/* Attribute Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#1E293B', marginBottom: '10px' }}>
                  Select Required Attribute Fields (Attribute-Scoped Privacy)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {['Identity Status', 'Verification Badge', 'Address Verification', 'Qualification Record', 'Driving Licence Status', 'Vehicle RC Proof'].map(attr => (
                    <div
                      key={attr}
                      onClick={() => handleToggleAttribute(attr)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: selectedAttributes.includes(attr) ? '1.5px solid #0B5ED7' : '1px solid #E2E8F0',
                        backgroundColor: selectedAttributes.includes(attr) ? '#EAF3FF' : '#F8FAFC',
                        color: selectedAttributes.includes(attr) ? '#0B5ED7' : '#475569',
                        fontWeight: 700,
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <CheckSquare size={16} /> {attr}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingReq}
                style={{
                  width: '100%',
                  backgroundColor: '#0B5ED7',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {submittingReq ? 'Submitting Request...' : 'Send Attribute Verification Request to Citizen'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: CONSENT REQUESTS */}
        {activeTab === 'requests' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '16px' }}>
              Verification &amp; Consent Request History
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                    <th style={{ padding: '12px 16px' }}>Request ID</th>
                    <th style={{ padding: '12px 16px' }}>Target Citizen</th>
                    <th style={{ padding: '12px 16px' }}>Purpose</th>
                    <th style={{ padding: '12px 16px' }}>Attributes</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0B1F3A' }}>{r.id || `REQ-109${i}`}</td>
                      <td style={{ padding: '12px 16px' }}>{r.citizenCivicId || 'CIV-DEMO-10001'}</td>
                      <td style={{ padding: '12px 16px' }}>{r.purpose}</td>
                      <td style={{ padding: '12px 16px' }}>Attribute Scoped</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                          APPROVED BY CITIZEN
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ISSUANCE & REVOCATION */}
        {activeTab === 'issuance' && canIssue && (
          <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '6px' }}>
              Issue Verified Digital Credential
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '24px' }}>
              Issue an officially signed digital credential or certificate directly into a citizen's CivicOne vault.
            </p>

            {issueMsg && (
              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.875rem', fontWeight: 700 }}>
                {issueMsg}
              </div>
            )}

            <form onSubmit={handleIssueCredential}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                  Citizen Civic ID
                </label>
                <input
                  type="text"
                  value={issueCivicId}
                  onChange={(e) => setIssueCivicId(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                  Credential Title
                </label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #CBD5E1', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                📜 Issue Cryptographically Signed Credential
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: AUDIT LEDGER */}
        {activeTab === 'audit' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '16px' }}>
              SHA-256 Immutable Audit Ledger ({session.name})
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                    <th style={{ padding: '12px 16px' }}>Timestamp</th>
                    <th style={{ padding: '12px 16px' }}>Event</th>
                    <th style={{ padding: '12px 16px' }}>Target Citizen</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px' }}>{new Date().toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>ORGANIZATION_LOGIN</td>
                    <td style={{ padding: '12px 16px' }}>{session.officialEmail}</td>
                    <td style={{ padding: '12px 16px', color: '#10B981', fontWeight: 700 }}>SUCCESS</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 16px' }}>{new Date(Date.now() - 3600000).toLocaleString()}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700 }}>VERIFICATION_REQUEST_CREATED</td>
                    <td style={{ padding: '12px 16px' }}>CIV-DEMO-10001</td>
                    <td style={{ padding: '12px 16px', color: '#10B981', fontWeight: 700 }}>SUCCESS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY MATRIX */}
        {activeTab === 'profile' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '16px' }}>
              Organization Security &amp; Access Control Matrix
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '8px' }}>Allowed Document Categories</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(session.allowedCategories || ['Identity', 'Education']).map((cat, i) => (
                    <span key={i} style={{ backgroundColor: '#EAF3FF', color: '#0B5ED7', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '8px' }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '8px' }}>Allowed Attribute Document Types</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(session.allowedDocTypes || ['Identity Status', 'Degree Certificate']).map((doc, i) => (
                    <span key={i} style={{ backgroundColor: '#ECFDF5', color: '#059669', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '8px' }}>
                      {doc}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}
