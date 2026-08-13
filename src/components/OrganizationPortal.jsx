// src/components/OrganizationPortal.jsx - Independent Organization Portal Workspace

import React, { useState, useEffect } from 'react';
import { Building2, ShieldCheck, Search, PlusCircle, CheckCircle2, Lock, Eye, AlertCircle, ArrowLeft, RefreshCw, FileText, ExternalLink, Calendar, LogOut } from 'lucide-react';
import DocumentViewerModal from './DocumentViewerModal.jsx';

export default function OrganizationPortal({ onReturnHome }) {
  const [selectedOrg, setSelectedOrg] = useState({ id: 'org-1', name: 'ABC University', category: 'Education', regNo: 'EDU-REG-9048' });
  const [organizations, setOrganizations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [consents, setConsents] = useState([]);
  const [activeTab, setActiveTab] = useState('locker'); // 'locker' | 'request' | 'history'
  
  // Request Form State
  const [citizenCivicId, setCitizenCivicId] = useState('CIV-9048-1029-4821');
  const [docId, setDocId] = useState('doc-7');
  const [purpose, setPurpose] = useState('M.Tech Admission Verification');
  const [expiryDays, setExpiryDays] = useState('7');
  const [requestMsg, setRequestMsg] = useState('');

  // Document Viewer Modal State
  const [viewingDoc, setViewingDoc] = useState(null);
  const [viewingConsent, setViewingConsent] = useState(null);
  const [accessError, setAccessError] = useState('');

  // Fetch Data
  const fetchOrgData = async () => {
    try {
      const [resOrgs, resReqs, resCons] = await Promise.all([
        fetch('/api/organizations').then(r => r.json()),
        fetch('/api/consent/citizen-requests').then(r => r.json()),
        fetch('/api/consent/active').then(r => r.json())
      ]);

      if (resOrgs.organizations) setOrganizations(resOrgs.organizations);
      if (resReqs.requests) setRequests(resReqs.requests);
      if (resCons.consents) setConsents(resCons.consents);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrgData();
  }, []);

  // Submit Document Access Request to Citizen
  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setRequestMsg('');

    try {
      const res = await fetch('/api/consent/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: selectedOrg.id,
          citizenCivicId,
          docId,
          purpose,
          expiryDays
        })
      });
      const data = await res.json();
      if (data.success) {
        setRequestMsg(`Document access request sent to citizen ${citizenCivicId} for ${purpose}.`);
        fetchOrgData();
      } else {
        setRequestMsg(data.error || 'Failed to send request.');
      }
    } catch (err) {
      setRequestMsg('Network error sending request.');
    }
  };

  // Attempt to view authorized document with BACKEND RECIPIENT-BOUND ACCESS CHECK
  const handleViewAuthorizedDoc = async (shareId) => {
    setAccessError('');
    try {
      const res = await fetch(`/api/consent/org-access/${shareId}?requestingOrgId=${selectedOrg.id}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setViewingDoc(data.document);
        setViewingConsent(data.consentRecord);
      } else {
        setAccessError(data.message || 'Access Denied by Backend Authorization Engine.');
      }
    } catch (err) {
      setAccessError('Backend verification check failed.');
    }
  };

  // Filtered Authorized Consents for THIS selected organization
  const authorizedConsents = consents.filter(c => c.orgId === selectedOrg.id);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'var(--font-body)' }}>

      {/* HEADER BAR */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#073B8C', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0B1F3A', letterSpacing: '-0.02em' }}>
                CivicOne Organization Portal
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Recipient-Bound Verification & Authorized Credential Workspace
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Organization Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Active Org:</span>
              <select
                value={selectedOrg.id}
                onChange={(e) => {
                  const org = organizations.find(o => o.id === e.target.value);
                  if (org) setSelectedOrg(org);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  color: '#0B1F3A',
                  backgroundColor: '#FFFFFF'
                }}
              >
                {organizations.map(o => (
                  <option key={o.id} value={o.id}>{o.name} ({o.category})</option>
                ))}
              </select>
            </div>

            <button
              onClick={onReturnHome}
              style={{
                backgroundColor: '#F1F5F9',
                color: '#64748B',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={14} /> Exit Portal
            </button>
          </div>

        </div>
      </header>

      {/* ACCESS DENIED ALERT TOAST */}
      {accessError && (
        <div style={{ backgroundColor: '#FEF2F2', borderBottom: '1px solid #FCA5A5', padding: '12px 24px', textAlign: 'center', color: '#991B1B', fontWeight: 800, fontSize: '0.875rem' }}>
          ⚠️ {accessError}
        </div>
      )}

      {/* WORKSPACE CONTENT */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ORG HERO SUMMARY CARD */}
        <div style={{ backgroundColor: '#0B1F3A', borderRadius: '20px', color: '#FFFFFF', padding: '28px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Verified Partner Organization
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '2px', marginBottom: '6px' }}>
              {selectedOrg.name}
            </h1>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Registration Ref: <span style={{ fontFamily: 'monospace', color: '#FEF08A' }}>{selectedOrg.regNo}</span> | Status: 🟢 Verified Partner
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setActiveTab('request')}
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
                gap: '8px'
              }}
            >
              <PlusCircle size={16} /> Request Document Access
            </button>
          </div>
        </div>

        {/* TAB BAR */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #E2E8F0', marginBottom: '24px', paddingBottom: '10px' }}>
          {[
            { id: 'locker', label: '📂 Authorized Credentials Locker', count: authorizedConsents.length },
            { id: 'request', label: '➕ Request Document Access', count: 0 },
            { id: 'history', label: '📜 Verification History Logs', count: requests.length }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === t.id ? '#0B5ED7' : '#FFFFFF',
                color: activeTab === t.id ? '#FFFFFF' : '#64748B',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: activeTab === t.id ? '0 4px 14px rgba(11, 94, 215, 0.25)' : 'none'
              }}
            >
              {t.label} {t.count > 0 && `(${t.count})`}
            </button>
          ))}
        </div>

        {/* TAB 1: AUTHORIZED CREDENTIALS LOCKER */}
        {activeTab === 'locker' && (
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '16px' }}>
              Citizen Documents Authorized for {selectedOrg.name}
            </h3>

            {authorizedConsents.length === 0 ? (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '40px', textAlign: 'center', color: '#64748B' }}>
                No active document authorizations found for {selectedOrg.name}. Click "Request Document Access" to request credentials from a citizen.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                {authorizedConsents.map((c) => (
                  <div key={c.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0B5ED7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        AUTHORIZED CREDENTIAL
                      </span>
                      <span style={{
                        backgroundColor: c.status === 'ACTIVE' ? '#ECFDF5' : '#FEF2F2',
                        color: c.status === 'ACTIVE' ? '#047857' : '#991B1B',
                        padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem'
                      }}>
                        {c.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '6px' }}>
                      {c.docName}
                    </h4>

                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>Citizen Civic ID: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0B5ED7' }}>{c.citizenCivicId}</span></div>
                      <div>Authorized Purpose: <strong>{c.purpose}</strong></div>
                      <div>Expiry Date: <strong>{c.expiryDate}</strong></div>
                    </div>

                    <button
                      onClick={() => handleViewAuthorizedDoc(c.id)}
                      disabled={c.status !== 'ACTIVE'}
                      style={{
                        width: '100%',
                        backgroundColor: c.status === 'ACTIVE' ? '#0B5ED7' : '#94A3B8',
                        color: '#FFFFFF',
                        padding: '12px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '0.875rem',
                        border: 'none',
                        cursor: c.status === 'ACTIVE' ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Eye size={16} /> View Authorized Watermarked Credential
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REQUEST DOCUMENT ACCESS */}
        {activeTab === 'request' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '32px', maxWidth: '640px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px' }}>
              Request Document Access from Citizen
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '24px' }}>
              Specify the citizen's Civic ID, target document type, purpose, and requested access duration.
            </p>

            {requestMsg && (
              <div style={{ backgroundColor: '#EAF3FF', border: '1px solid #BFDBFE', padding: '12px 16px', borderRadius: '10px', color: '#073B8C', fontSize: '0.85rem', fontWeight: 700, marginBottom: '20px' }}>
                {requestMsg}
              </div>
            )}

            <form onSubmit={handleCreateRequest}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>
                  Citizen Civic ID Number
                </label>
                <input
                  type="text"
                  value={citizenCivicId}
                  onChange={(e) => setCitizenCivicId(e.target.value)}
                  placeholder="e.g. CIV-9048-1029-4821"
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>
                  Required Document Type
                </label>
                <select
                  value={docId}
                  onChange={(e) => setDocId(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  <option value="doc-7">B.Tech Computer Science Degree (Education)</option>
                  <option value="doc-8">Class XII Senior School Marksheet (Education)</option>
                  <option value="doc-1">Aadhaar Card Reference (Identity)</option>
                  <option value="doc-2">Permanent Account Number PAN (Finance)</option>
                  <option value="doc-9">TCS Systems Engineer Experience Certificate (Professional)</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>
                  Specific Purpose for Authorization
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. M.Tech Admission / Home Loan Verification"
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>
                  Requested Authorization Duration
                </label>
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  <option value="1">1 Day</option>
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>

              <button
                type="submit"
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
                Submit Request to Citizen 🚀
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: VERIFICATION HISTORY LOGS */}
        {activeTab === 'history' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '16px' }}>
              Verification & Request History Logs
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {requests.map(r => (
                <div key={r.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0B1F3A' }}>{r.docName} ({r.orgName})</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>Purpose: {r.purpose} | Citizen: {r.citizenCivicId}</div>
                  </div>
                  <span style={{ backgroundColor: r.status === 'APPROVED' ? '#ECFDF5' : '#FFFBEB', color: r.status === 'APPROVED' ? '#047857' : '#D97706', padding: '4px 12px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem' }}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* DOCUMENT VIEWER MODAL */}
      {viewingDoc && (
        <DocumentViewerModal
          document={viewingDoc}
          consentRecord={viewingConsent}
          onClose={() => setViewingDoc(null)}
        />
      )}

    </div>
  );
}
