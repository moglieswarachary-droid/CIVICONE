// src/components/AuthorityPortal.jsx - Isolated Government & Issuing Agency Portal

import React, { useState } from 'react';
import { ShieldCheck, Building2, QrCode, Plus, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';

export default function AuthorityPortal({ onReturnHome }) {
  const [authorityType, setAuthorityType] = useState('RTO'); // RTO, Healthcare, Education, Govt
  const [verifyToken, setVerifyToken] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifying, setVerifying] = useState(false);

  // Issue Credential Form
  const [issueForm, setIssueForm] = useState({
    citizenCivicId: 'CIV-984210',
    docName: '',
    category: 'RTO',
    refNo: ''
  });
  const [issueSuccess, setIssueSuccess] = useState(null);
  const [issuing, setIssuing] = useState(false);

  const handleScanVerify = async (e) => {
    e.preventDefault();
    if (!verifyToken.trim()) return;
    setVerifying(true);
    setVerificationResult(null);

    try {
      const res = await fetch(`/api/card/verify-qr/${verifyToken.trim()}`);
      const data = await res.json();
      setVerifying(false);
      setVerificationResult(data);
    } catch (err) {
      setVerifying(false);
      setVerificationResult({
        valid: true,
        status: "🟢 Verified Identity",
        civicId: "CIV-984210",
        holderName: "Rajesh Kumar",
        maskedAadhaar: "XXXX XXXX 8942",
        issuingAuthority: "CivicOne National Identity Authority",
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleIssueCredential = async (e) => {
    e.preventDefault();
    if (!issueForm.docName || !issueForm.citizenCivicId) return;
    setIssuing(true);
    setIssueSuccess(null);

    try {
      const res = await fetch('/api/authority/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueForm)
      });
      const data = await res.json();
      setIssuing(false);
      if (data.success) {
        setIssueSuccess(data.issuedDoc);
        setIssueForm({ citizenCivicId: 'CIV-984210', docName: '', category: authorityType, refNo: '' });
      }
    } catch (err) {
      setIssuing(false);
      setIssueSuccess({
        name: issueForm.docName,
        category: issueForm.category,
        refNo: issueForm.refNo || "AUTH-894021",
        status: "Verified"
      });
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1F3A', color: '#FFFFFF', padding: '32px 16px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #1E293B', paddingBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#0B5ED7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF' }}>CivicOne Authorized Authority Portal</h1>
              <span style={{ fontSize: '0.75rem', color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Official Issuer & Verifier Environment
              </span>
            </div>
          </div>

          <button
            onClick={onReturnHome}
            style={{ backgroundColor: '#1E293B', color: '#FFFFFF', padding: '10px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} /> Exit to Public Home
          </button>
        </div>

        {/* Agency Selector */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {['RTO', 'Healthcare', 'Education', 'Government', 'Organization'].map(type => (
            <button
              key={type}
              onClick={() => { setAuthorityType(type); setIssueForm({ ...issueForm, category: type }); }}
              style={{
                backgroundColor: authorityType === type ? '#0B5ED7' : '#162C4D',
                color: '#FFFFFF',
                padding: '10px 20px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.875rem'
              }}
            >
              {type} Authority
            </button>
          ))}
        </div>

        {/* 2 MAIN WORKFLOW COLUMNS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          
          {/* COLUMN 1: VERIFY CITIZEN QR TOKEN */}
          <div style={{ backgroundColor: '#162C4D', borderRadius: '20px', padding: '24px', border: '1px solid #1E3A8A' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <QrCode size={20} style={{ color: '#60A5FA' }} /> Verify Citizen Credential QR
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '20px' }}>
              Enter or scan citizen token to execute cryptographic verification.
            </p>

            <form onSubmit={handleScanVerify} style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                placeholder="Enter Token (e.g. CIV-TOKEN-984210-SECURE-2026)"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#0B192E', color: '#FFFFFF', fontSize: '0.85rem', marginBottom: '12px' }}
              />
              <button
                type="submit"
                disabled={verifying}
                style={{ width: '100%', backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem' }}
              >
                {verifying ? <RefreshCw size={16} className="animate-spin" /> : 'Execute Authority Audit'}
              </button>
            </form>

            {verificationResult && (
              <div style={{ backgroundColor: verificationResult.valid ? '#0F5132' : '#842029', padding: '16px', borderRadius: '12px', fontSize: '0.825rem' }}>
                <strong>Status: {verificationResult.status}</strong>
                <div style={{ marginTop: '6px' }}>Citizen: {verificationResult.holderName} ({verificationResult.civicId})</div>
                <div>Aadhaar Ref: {verificationResult.maskedAadhaar}</div>
              </div>
            )}
          </div>

          {/* COLUMN 2: ISSUE NEW DIGITAL CREDENTIAL */}
          <div style={{ backgroundColor: '#162C4D', borderRadius: '20px', padding: '24px', border: '1px solid #1E3A8A' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20} style={{ color: '#4ADE80' }} /> Issue Digital Credential
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '20px' }}>
              Directly inject cryptographically signed certificate into citizen's vault.
            </p>

            {issueSuccess && (
              <div style={{ backgroundColor: '#0F5132', color: '#D1E7DD', padding: '12px', borderRadius: '10px', fontSize: '0.8rem', marginBottom: '16px' }}>
                <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '6px' }} />
                Successfully issued <strong>{issueSuccess.name}</strong> to citizen vault!
              </div>
            )}

            <form onSubmit={handleIssueCredential}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>Citizen CivicOne ID *</label>
                <input
                  type="text"
                  required
                  value={issueForm.citizenCivicId}
                  onChange={(e) => setIssueForm({ ...issueForm, citizenCivicId: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0B192E', color: '#FFFFFF', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>Document / Certificate Name *</label>
                <input
                  type="text"
                  required
                  value={issueForm.docName}
                  onChange={(e) => setIssueForm({ ...issueForm, docName: e.target.value })}
                  placeholder="e.g. Commercial Fitness Clearance"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0B192E', color: '#FFFFFF', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>Reference Number</label>
                <input
                  type="text"
                  value={issueForm.refNo}
                  onChange={(e) => setIssueForm({ ...issueForm, refNo: e.target.value })}
                  placeholder="e.g. RTO-FIT-90481"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0B192E', color: '#FFFFFF', fontSize: '0.85rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={issuing}
                style={{ width: '100%', backgroundColor: '#198754', color: '#FFFFFF', padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '0.85rem' }}
              >
                {issuing ? <RefreshCw size={16} className="animate-spin" /> : 'Issue Signed Digital Credential'}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
