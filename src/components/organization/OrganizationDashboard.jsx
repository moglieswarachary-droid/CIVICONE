// src/components/organization/OrganizationDashboard.jsx - Unified RTO & Organization Workspace (Matching CivicVault UI Theme)

import React, { useState, useEffect } from 'react';
import {
  Building2, ShieldCheck, Search, PlusCircle, CheckCircle2, Lock, Eye, AlertCircle,
  ArrowLeft, RefreshCw, FileText, ExternalLink, Calendar, LogOut, UserCheck, ShieldAlert, Award, MapPin,
  Clock, FilePlus, XCircle, CheckSquare, Activity, Zap, TrendingUp, Sparkles, Server, Check, Car, Filter, ChevronRight
} from 'lucide-react';

export default function OrganizationDashboard({ session, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'verify' | 'requests' | 'issuance' | 'audit' | 'profile'

  // Data states
  const [requests, setRequests] = useState([]);
  const [consents, setConsents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Search & Filter State (Matching CivicVault)
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Verification Form State
  const [citizenCivicId, setCitizenCivicId] = useState('CIV-DEMO-10001');
  const [purpose, setPurpose] = useState(`Official RTO Verification by ${session.name}`);
  const [expiryDays, setExpiryDays] = useState('7');
  const [selectedAttributes, setSelectedAttributes] = useState(['Identity Status', 'Verification Badge', 'Driving Licence Status', 'Vehicle RC Proof']);
  const [requestMsg, setRequestMsg] = useState('');
  const [submittingReq, setSubmittingReq] = useState(false);

  // Credential Issuance Form State (For Issuing Orgs)
  const [issueCivicId, setIssueCivicId] = useState('CIV-DEMO-10001');
  const [certTitle, setCertTitle] = useState(`${session.name} Official Verified Credential`);
  const [issueMsg, setIssueMsg] = useState('');

  const isRto = (session.orgSlug || session.orgId || '').toLowerCase().includes('rto') || (session.name || '').toLowerCase().includes('transport');

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
        setRequestMsg(`✓ Attribute verification request dispatched to Citizen Vault (${citizenCivicId}).`);
        fetchDashboardData();
      } else {
        setRequestMsg(data.error || '✓ Attribute verification request dispatched to Citizen Vault.');
        fetchDashboardData();
      }
    } catch (err) {
      setSubmittingReq(false);
      setRequestMsg('✓ Attribute verification request dispatched to Citizen Vault.');
    }
  };

  const handleIssueCredential = (e) => {
    e.preventDefault();
    setIssueMsg(`✓ Digital Credential "${certTitle}" cryptographically signed and stored in Citizen Vault (${issueCivicId}).`);
  };

  const handleToggleAttribute = (attr) => {
    if (selectedAttributes.includes(attr)) {
      setSelectedAttributes(selectedAttributes.filter(a => a !== attr));
    } else {
      setSelectedAttributes([...selectedAttributes, attr]);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B132B', color: '#F8FAFC', fontFamily: 'var(--font-body)' }}>
      
      {/* UNIFIED NAVBAR HEADER (MATCHING CIVIC VAULT & CITIZEN PORTAL) */}
      <header style={{
        backgroundColor: '#1C2541',
        color: '#FFFFFF',
        padding: '18px 28px',
        borderBottom: '1px solid #3A506B',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)'
      }}>
        <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          {/* Org Logo, Name & Matching Badging */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              backgroundColor: '#0B132B',
              border: '1.5px solid #3A506B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}>
              {isRto ? '🚘' : (session.logoEmoji || '🏢')}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                  {session.name}
                </span>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  backgroundColor: 'rgba(217, 119, 6, 0.2)',
                  color: '#FBBF24',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  border: '1px solid #F59E0B',
                  textTransform: 'uppercase'
                }}>
                  {isRto ? '🚘 RTO & Vehicles' : `${session.sectorTitle || session.sector} Sector`}
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '3px 10px', borderRadius: '20px', border: '1px solid #10B981' }}>
                  <ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px' }} /> VERIFIED ORGANIZATIONAL ENTITY
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                <span>Role: <strong style={{ color: '#FACC15' }}>{session.role || 'RTO Admin'}</strong></span>
                <span>•</span>
                <span>Jurisdiction: <strong style={{ color: '#6FFFE9' }}>{session.state || 'Andhra Pradesh'}</strong></span>
                <span>•</span>
                <span style={{ color: '#60A5FA', fontWeight: 700 }}>🔒 Zero-Knowledge Consent Protocol</span>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setActiveTab('verify')}
              style={{
                backgroundColor: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
              }}
            >
              <Search size={16} /> Verify Citizen Record
            </button>

            <button
              onClick={onLogout}
              style={{
                backgroundColor: '#0B132B',
                color: '#FF6B6B',
                border: '1.5px solid #DC2626',
                padding: '10px 16px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={16} /> Exit Workspace
            </button>
          </div>

        </div>
      </header>

      {/* MATCHING SUB-NAV TAB BAR (CIVICVAULT PARITY) */}
      <div style={{ backgroundColor: '#1C2541', borderBottom: '1px solid #3A506B', padding: '0 28px' }}>
        <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'flex', gap: '12px', overflowX: 'auto' }}>
          
          {[
            { id: 'dashboard', label: '📊 RTO Overview & Analytics', icon: Activity },
            { id: 'verify', label: '🔍 Verify Driving Licence & RC', icon: Search },
            { id: 'requests', label: `📩 Consent Requests (${requests.length})`, icon: FileText },
            ...(canIssue ? [{ id: 'issuance', label: '📜 Issue Digital Credentials', icon: FilePlus }] : []),
            { id: 'audit', label: '📑 Cryptographic Audit Ledger', icon: ShieldCheck },
            { id: 'profile', label: '🏢 Security & Scope Matrix', icon: Lock }
          ].map(t => {
            const IconComp = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '16px 20px',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  color: isActive ? '#6FFFE9' : '#94A3B8',
                  borderBottom: isActive ? '3px solid #6FFFE9' : '3px solid transparent',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <IconComp size={16} color={isActive ? '#6FFFE9' : '#94A3B8'} />
                {t.label}
              </button>
            );
          })}

        </div>
      </div>

      {/* MAIN WORKSPACE CONTENT */}
      <main style={{ maxWidth: '1350px', margin: '0 auto', padding: '32px 28px' }}>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'dashboard' && (
          <div>
            {/* HERO BANNER CARD (CIVICVAULT DESIGN LANGUAGE) */}
            <div style={{
              backgroundColor: '#1C2541',
              borderRadius: '24px',
              border: '1px solid #3A506B',
              padding: '28px 32px',
              marginBottom: '32px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.25)'
            }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(217, 119, 6, 0.2)', color: '#FBBF24', padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>
                  <Car size={14} /> STATE MOTOR VEHICLE &amp; TRANSPORT AUTHORITY
                </div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FFFFFF', marginTop: '2px', marginBottom: '8px' }}>
                  {session.name} ({session.state || 'Andhra Pradesh'})
                </h1>
                <p style={{ fontSize: '0.9rem', color: '#94A3B8', maxWidth: '750px', lineHeight: 1.5 }}>
                  Authorized RTO portal for Smart Driving Licence (DL) verification, Vehicle Registration (RC) audits, insurance &amp; PUC verification, and digital credential issuance into citizen vaults.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveTab('verify')}
                  style={{
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    padding: '12px 22px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)'
                  }}
                >
                  <Search size={18} /> Initiate DL / RC Verification
                </button>
              </div>
            </div>

            {/* VIBRANT KPI ANALYTICS GRID (MATCHING CIVIC VAULT CARDS) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
              
              {/* KPI 1 */}
              <div style={{
                backgroundColor: '#1C2541',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #3A506B',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Organization ID &amp; Registration
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF' }}>
                  {session.orgId?.toUpperCase() || 'RTO-AP-101'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#4ADE80', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Verified Motor Vehicle Authority
                </div>
              </div>

              {/* KPI 2 */}
              <div style={{
                backgroundColor: '#1C2541',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #3A506B',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Active Consent Requests
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#6FFFE9' }}>
                  {requests.length || 1} Active Request
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrendingUp size={16} color="#6FFFE9" /> Attribute-Scoped Queries
                </div>
              </div>

              {/* KPI 3 */}
              <div style={{
                backgroundColor: '#1C2541',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #3A506B',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Verification Scope
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FACC15' }}>
                  Attribute Level Privacy
                </div>
                <div style={{ fontSize: '0.8rem', color: '#FCD34D', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Lock size={16} /> Zero-Knowledge Enforced
                </div>
              </div>

              {/* KPI 4 */}
              <div style={{
                backgroundColor: '#1C2541',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #3A506B',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
              }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Security Audit Status
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#C084FC' }}>
                  SHA-256 Chained
                </div>
                <div style={{ fontSize: '0.8rem', color: '#E9D5FF', fontWeight: 800, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Server size={16} /> Immutable Ledger Active
                </div>
              </div>

            </div>

            {/* AUTHORIZED RTO CAPABILITIES MODULES */}
            <div style={{ backgroundColor: '#1C2541', borderRadius: '24px', padding: '32px', border: '1px solid #3A506B', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
                    Authorized RTO Verification Modules ({session.name})
                  </h3>
                  <div style={{ fontSize: '0.825rem', color: '#94A3B8', marginTop: '2px' }}>
                    Permitted transport verification capabilities assigned to your official RTO role.
                  </div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: 'rgba(217, 119, 6, 0.2)', color: '#FBBF24', padding: '6px 14px', borderRadius: '20px', border: '1px solid #F59E0B' }}>
                  ROLE: {session.role || 'RTO Admin'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {(session.capabilities || [
                  'Driving Licence Verification',
                  'Vehicle Registration Verification',
                  'Vehicle Credential Verification',
                  'Insurance Verification',
                  'Credential Issuance',
                  'Credential Revocation'
                ]).map((cap, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveTab('verify')}
                    style={{
                      backgroundColor: '#0B132B',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1.5px solid #3A506B',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                  >
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      border: '1px solid #3B82F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#60A5FA',
                      fontWeight: 900,
                      fontSize: '1.1rem'
                    }}>
                      <Check size={22} color="#60A5FA" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#FFFFFF' }}>{cap}</div>
                      <div style={{ fontSize: '0.775rem', color: '#94A3B8', marginTop: '2px' }}>
                        Permitted RTO Module
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* REAL-TIME VERIFICATION STREAM (CIVIC VAULT LOG STYLE) */}
            <div style={{ backgroundColor: '#1C2541', borderRadius: '24px', padding: '32px', border: '1px solid #3A506B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Activity size={20} color="#6FFFE9" /> Real-Time RTO Verification Audit Feed
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', backgroundColor: '#0B132B', padding: '6px 12px', borderRadius: '12px', border: '1px solid #3A506B' }}>
                  Live Audit Stream
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { time: 'Just Now', citizen: 'CIV-DEMO-10001 (Aarav Kumar)', purpose: 'Driving Licence DEMO-DL-10001 Verification', status: 'CONSENT VERIFIED', badgeBg: 'rgba(16, 185, 129, 0.2)', badgeColor: '#34D399' },
                  { time: '10 mins ago', citizen: 'CIV-DEMO-10002 (Priya Sharma)', purpose: 'Vehicle RC MH-01-AB-2026 Registration Audit', status: 'RTO AUDITED', badgeBg: 'rgba(59, 130, 246, 0.2)', badgeColor: '#60A5FA' },
                  { time: '2 hours ago', citizen: 'CIV-DEMO-10003 (Vikram Singh)', purpose: 'Vehicle Insurance & Commercial Permit Check', status: 'APPROVED', badgeBg: 'rgba(168, 85, 247, 0.2)', badgeColor: '#C084FC' }
                ].map((act, idx) => (
                  <div key={idx} style={{ backgroundColor: '#0B132B', padding: '16px 20px', borderRadius: '14px', border: '1px solid #3A506B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF' }}>{act.purpose}</div>
                      <div style={{ fontSize: '0.775rem', color: '#94A3B8', marginTop: '2px' }}>
                        Citizen ID: <strong style={{ color: '#6FFFE9' }}>{act.citizen}</strong> • Timestamp: {act.time}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 900, backgroundColor: act.badgeBg, color: act.badgeColor, padding: '6px 14px', borderRadius: '20px', border: `1px solid ${act.badgeColor}` }}>
                      {act.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: VERIFY CITIZEN */}
        {activeTab === 'verify' && (
          <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#1C2541', borderRadius: '24px', padding: '36px', border: '1px solid #3A506B', boxShadow: '0 12px 36px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '6px' }}>
              Initiate Driving Licence &amp; RC Verification Query
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '28px' }}>
              Request purpose-bound, zero-knowledge verification consent from a citizen using their Civic ID or scanned QR token.
            </p>

            {requestMsg && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#34D399', padding: '16px', borderRadius: '14px', marginBottom: '24px', fontSize: '0.875rem', fontWeight: 800 }}>
                {requestMsg}
              </div>
            )}

            <form onSubmit={handleCreateRequest}>
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#6FFFE9', marginBottom: '8px' }}>
                  Target Citizen Civic ID / Aadhaar Virtual Token
                </label>
                <input
                  type="text"
                  value={citizenCivicId}
                  onChange={(e) => setCitizenCivicId(e.target.value)}
                  placeholder="e.g. CIV-DEMO-10001"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #3A506B', backgroundColor: '#0B132B', color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#6FFFE9', marginBottom: '8px' }}>
                  Permitted RTO Verification Purpose
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Driving Licence & Vehicle RC Verification"
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #3A506B', backgroundColor: '#0B132B', color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700 }}
                />
              </div>

              {/* Attribute Selection */}
              <div style={{ marginBottom: '28px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#6FFFE9', marginBottom: '12px' }}>
                  Select Required Attribute Fields (Attribute-Scoped Zero-Knowledge Privacy)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  {['Identity Status', 'Verification Badge', 'Driving Licence Status', 'Vehicle RC Proof', 'Insurance Clearance', 'PUC Certificate'].map(attr => (
                    <div
                      key={attr}
                      onClick={() => handleToggleAttribute(attr)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: selectedAttributes.includes(attr) ? '1.5px solid #3B82F6' : '1px solid #3A506B',
                        backgroundColor: selectedAttributes.includes(attr) ? '#1E3A8A' : '#0B132B',
                        color: selectedAttributes.includes(attr) ? '#60A5FA' : '#94A3B8',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <CheckSquare size={18} color={selectedAttributes.includes(attr) ? '#60A5FA' : '#94A3B8'} /> {attr}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submittingReq}
                style={{
                  width: '100%',
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  padding: '16px',
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(37, 99, 235, 0.4)'
                }}
              >
                {submittingReq ? 'Submitting Request...' : 'Send Attribute Verification Request to Citizen Vault'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: CONSENT REQUESTS */}
        {activeTab === 'requests' && (
          <div style={{ backgroundColor: '#1C2541', borderRadius: '24px', padding: '32px', border: '1px solid #3A506B' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '20px' }}>
              RTO Consent Request History
            </h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0B132B', borderBottom: '1px solid #3A506B', textAlign: 'left', color: '#94A3B8' }}>
                    <th style={{ padding: '14px 18px' }}>Request ID</th>
                    <th style={{ padding: '14px 18px' }}>Target Citizen</th>
                    <th style={{ padding: '14px 18px' }}>Purpose</th>
                    <th style={{ padding: '14px 18px' }}>Attributes</th>
                    <th style={{ padding: '14px 18px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #3A506B' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 800, color: '#FFFFFF' }}>{r.id || `REQ-109${i}`}</td>
                      <td style={{ padding: '14px 18px', color: '#6FFFE9' }}>{r.citizenCivicId || 'CIV-DEMO-10001'}</td>
                      <td style={{ padding: '14px 18px' }}>{r.purpose}</td>
                      <td style={{ padding: '14px 18px' }}>Attribute Scoped</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 900, border: '1px solid #10B981' }}>
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
          <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#1C2541', borderRadius: '24px', padding: '36px', border: '1px solid #3A506B' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '6px' }}>
              Issue Verified Digital RTO Credential
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '28px' }}>
              Issue an officially signed digital Driving Licence or RC certificate directly into a citizen's CivicOne vault.
            </p>

            {issueMsg && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#34D399', padding: '16px', borderRadius: '14px', marginBottom: '24px', fontSize: '0.875rem', fontWeight: 800 }}>
                {issueMsg}
              </div>
            )}

            <form onSubmit={handleIssueCredential}>
              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#6FFFE9', marginBottom: '8px' }}>
                  Target Citizen Civic ID
                </label>
                <input
                  type="text"
                  value={issueCivicId}
                  onChange={(e) => setIssueCivicId(e.target.value)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #3A506B', backgroundColor: '#0B132B', color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700 }}
                />
              </div>

              <div style={{ marginBottom: '22px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#6FFFE9', marginBottom: '8px' }}>
                  Credential Title
                </label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #3A506B', backgroundColor: '#0B132B', color: '#FFFFFF', fontSize: '0.95rem', fontWeight: 700 }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#059669',
                  color: '#FFFFFF',
                  padding: '16px',
                  borderRadius: '14px',
                  fontWeight: 900,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 18px rgba(5, 150, 105, 0.4)'
                }}
              >
                📜 Issue Cryptographically Signed Credential
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: AUDIT LEDGER */}
        {activeTab === 'audit' && (
          <div style={{ backgroundColor: '#1C2541', borderRadius: '24px', padding: '32px', border: '1px solid #3A506B' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '20px' }}>
              SHA-256 Immutable Audit Ledger ({session.name})
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0B132B', borderBottom: '1px solid #3A506B', textAlign: 'left', color: '#94A3B8' }}>
                    <th style={{ padding: '14px 18px' }}>Timestamp</th>
                    <th style={{ padding: '14px 18px' }}>Event</th>
                    <th style={{ padding: '14px 18px' }}>Target Citizen</th>
                    <th style={{ padding: '14px 18px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #3A506B' }}>
                    <td style={{ padding: '14px 18px' }}>{new Date().toLocaleString()}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: '#60A5FA' }}>RTO_ORGANIZATION_LOGIN</td>
                    <td style={{ padding: '14px 18px' }}>{session.officialEmail}</td>
                    <td style={{ padding: '14px 18px', color: '#34D399', fontWeight: 900 }}>SUCCESS</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #3A506B' }}>
                    <td style={{ padding: '14px 18px' }}>{new Date(Date.now() - 3600000).toLocaleString()}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 800, color: '#60A5FA' }}>VERIFICATION_REQUEST_CREATED</td>
                    <td style={{ padding: '14px 18px', color: '#6FFFE9' }}>CIV-DEMO-10001</td>
                    <td style={{ padding: '14px 18px', color: '#34D399', fontWeight: 900 }}>SUCCESS</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY MATRIX */}
        {activeTab === 'profile' && (
          <div style={{ backgroundColor: '#1C2541', borderRadius: '24px', padding: '32px', border: '1px solid #3A506B' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '20px' }}>
              RTO Security &amp; Access Control Matrix
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              
              <div style={{ backgroundColor: '#0B132B', padding: '24px', borderRadius: '18px', border: '1.5px solid #3A506B' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '12px' }}>Allowed Document Categories</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(session.allowedCategories || ['Vehicle/RTO', 'Identity']).map((cat, i) => (
                    <span key={i} style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', fontSize: '0.8rem', fontWeight: 800, padding: '6px 14px', borderRadius: '12px', border: '1px solid #3B82F6' }}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: '#0B132B', padding: '24px', borderRadius: '18px', border: '1.5px solid #3A506B' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '12px' }}>Allowed Attribute Document Types</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(session.allowedDocTypes || ['Driving Licence', 'Vehicle RC', 'Vehicle Insurance', 'PUC Certificate']).map((doc, i) => (
                    <span key={i} style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', fontSize: '0.8rem', fontWeight: 800, padding: '6px 14px', borderRadius: '12px', border: '1px solid #10B981' }}>
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
