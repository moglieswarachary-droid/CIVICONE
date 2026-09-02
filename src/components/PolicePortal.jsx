// src/components/PolicePortal.jsx - Dedicated Police & Law Enforcement Portal with All States/UTs Selection

import React, { useState } from 'react';
import {
  ShieldAlert, Search, FileCheck, CheckCircle2, AlertCircle, Clock, FileText,
  UserCheck, ArrowLeft, Building2, Lock, History, FileSearch, ShieldCheck, Filter
} from 'lucide-react';
import { INDIA_STATES_AND_UTS, DEMO_POLICE_FIRS } from '../data/mockData.js';

export default function PolicePortal({ officer, initialState, onReturnHome }) {
  const [selectedState, setSelectedState] = useState(
    initialState ? `${initialState} Police` : 'Demo Police Organization (All States)'
  );
  const [searchCivicId, setSearchCivicId] = useState('CIV-DEMO-10001');
  const [caseRefNo, setCaseRefNo] = useState('FIR-2026-904812');
  const [purpose, setPurpose] = useState('Official Law Enforcement Verification');
  const [accessDuration, setAccessDuration] = useState('24 hours');
  
  // High-Rank Officer Clearance
  const [rankMode, setRankMode] = useState('HIGH_RANK'); // 'STANDARD' | 'HIGH_RANK'
  const [officerRankRole, setOfficerRankRole] = useState('Senior SP / Police Commissioner (Level 3 High-Rank Access)');
  const [courtWarrantRef, setCourtWarrantRef] = useState('WARRANT-2026-HC-8812');

  const [verifying, setVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [activeTab, setActiveTab] = useState(
    window.location.hash.includes('passport') || window.location.hash.includes('pcc') ? 'passport' : 'verify'
  ); // 'fir' | 'passport' | 'verify' | 'audit'

  // Passport Verification Waiting List Queue
  const [passportApplications, setPassportApplications] = useState([
    {
      appNo: 'P-AP-2026-1001',
      citizenId: 'CIV-DEMO-10001',
      applicantName: 'Aarav Kumar',
      address: 'MG Road, Vijayawada, AP',
      type: 'Fresh Passport (Normal)',
      submittedDate: '14-08-2026',
      status: '⏳ WAITING LIST (Police Verification Pending)',
      pccToken: null
    },
    {
      appNo: 'P-MH-2026-1002',
      citizenId: 'CIV-DEMO-10002',
      applicantName: 'Priya Sharma',
      address: 'Bandra West, Mumbai, MH',
      type: 'Re-issue Passport (Tatkaal Expedited)',
      submittedDate: '16-08-2026',
      status: '⏳ WAITING LIST (Address Verification)',
      pccToken: null
    },
    {
      appNo: 'P-DL-2026-1003',
      citizenId: 'CIV-DEMO-10003',
      applicantName: 'Vikram Singh',
      address: 'Connaught Place, New Delhi',
      type: 'Fresh Passport (Tatkaal Expedited)',
      submittedDate: '17-08-2026',
      status: '⏳ WAITING LIST (PCC Clearance)',
      pccToken: null
    }
  ]);

  const [selectedPassportApp, setSelectedPassportApp] = useState(null);
  const [passportMsg, setPassportMsg] = useState('');

  const allPoliceOrgs = [
    'Demo Police Organization (All States)',
    ...INDIA_STATES_AND_UTS.map(st => `${st} Police`)
  ];

  const [auditLogs, setAuditLogs] = useState([
    { id: 'LOG-1001', officer: 'Senior SP R. Verma (Badge #POL-8942-MH)', stateOrg: 'Maharashtra Police', citizenId: 'CIV-DEMO-10001', purpose: 'Economic Crime & Bank Audit', caseRef: 'WARRANT-2026-HC-8812', timestamp: 'Today, 10:15 AM', status: 'WARRANT AUTHORIZED (Bank & Health Access)' },
    { id: 'LOG-1002', officer: 'Officer K. Sharma', stateOrg: 'Delhi Police', citizenId: 'CIV-DEMO-10002', purpose: 'Identity Verification', caseRef: 'FIR-2026-881204', timestamp: 'Yesterday, 04:30 PM', status: 'Approved' }
  ]);

  const demoCitizensMap = {
    'CIV-DEMO-10001': {
      citizenId: 'CIV-DEMO-10001',
      fullName: 'Aarav Kumar',
      maskedAadhaar: 'XXXX XXXX 1001',
      identityStatus: 'Verified (UIDAI ADV Token Active)',
      drivingLicence: 'DEMO-DL-10001 (Valid until 14-10-2028)',
      vehicleRC: 'AP-DEMO-1001 (Active — Honda City)',
      addressStatus: 'Verified — MG Road, Vijayawada, AP',
      pccStatus: 'Clean Record — No Pending Non-Bailable Warrants',
      bankAccountStatus: 'Verified — State Bank of India (Acc: XXXX-8841-AP)',
      panTaxStatus: 'ABCDE1234F (Active Taxpayer — Clean Compliance)',
      financialRiskScore: 'LOW RISK (CIBIL 790)',
      abhaHealthCard: 'ABHA-2026-9901-88 (Ayushman Bharat Active)',
      medicalCasualtyReport: 'Vijayawada General Hospital — Medico-Legal Clearance Verified'
    },
    'CIV-DEMO-10002': {
      citizenId: 'CIV-DEMO-10002',
      fullName: 'Priya Sharma',
      maskedAadhaar: 'XXXX XXXX 1002',
      identityStatus: 'Verified (UIDAI ADV Token Active)',
      drivingLicence: 'MH-DL-2026-881 (Valid until 08-05-2030)',
      vehicleRC: 'MH-01-AB-2026 (Active — Hyundai i20)',
      addressStatus: 'Verified — Bandra West, Mumbai, MH',
      pccStatus: 'Clean Record — Verified Resident Clearance',
      bankAccountStatus: 'Verified — HDFC Bank (Acc: XXXX-4412-MH)',
      panTaxStatus: 'BPQPS9921K (Active Taxpayer)',
      financialRiskScore: 'VERY LOW RISK (CIBIL 810)',
      abhaHealthCard: 'ABHA-2026-4412-02 (Ayushman Bharat Active)',
      medicalCasualtyReport: 'Lilavati Hospital Mumbai — Medico-Legal Clearance Verified'
    },
    'CIV-DEMO-10003': {
      citizenId: 'CIV-DEMO-10003',
      fullName: 'Vikram Singh',
      maskedAadhaar: 'XXXX XXXX 1003',
      identityStatus: 'Verified (UIDAI ADV Token Active)',
      drivingLicence: 'DL-01-2026-554 (Valid until 19-11-2027)',
      vehicleRC: 'DL-03-CC-9901 (Active — Royal Enfield Bullet)',
      addressStatus: 'Verified — Connaught Place, New Delhi',
      pccStatus: 'Clean Record — Passport Clearance Issued',
      bankAccountStatus: 'Verified — ICICI Bank (Acc: XXXX-9012-DL)',
      panTaxStatus: 'CVVPS4410M (Active Taxpayer)',
      financialRiskScore: 'LOW RISK (CIBIL 775)',
      abhaHealthCard: 'ABHA-2026-5541-03 (Ayushman Bharat Active)',
      medicalCasualtyReport: 'AIIMS New Delhi — Medico-Legal Clearance Verified'
    }
  };

  const handleExecutePoliceVerification = async (e, targetIdOverride = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const queryId = targetIdOverride || searchCivicId;
    if (!queryId || !queryId.trim()) return;

    setVerifying(true);
    setVerificationData(null);

    const isHighRankAuthorized = rankMode === 'HIGH_RANK' && courtWarrantRef.trim().length > 0;
    const lookupCitizen = demoCitizensMap[queryId.trim().toUpperCase()] || {
      citizenId: queryId,
      fullName: `Verified Citizen (${queryId})`,
      maskedAadhaar: "XXXX XXXX " + queryId.slice(-4),
      identityStatus: "Verified",
      drivingLicence: `DL-${queryId}-VALID`,
      vehicleRC: `RC-${queryId}-ACTIVE`,
      addressStatus: `Verified Address (${selectedState})`,
      pccStatus: "Police Verification Pending Verification",
      bankAccountStatus: "Verified — Public Sector Bank",
      panTaxStatus: "Active Taxpayer Status",
      financialRiskScore: "LOW RISK (CIBIL 760)",
      abhaHealthCard: "ABHA Health Account Active",
      medicalCasualtyReport: "Government District Hospital Clearance Verified"
    };

    try {
      const res = await fetch(`/api/consent/org-access/${queryId}?requestingOrgRole=${isHighRankAuthorized ? 'POLICE_HIGH_RANK' : 'POLICE_ADMIN'}`);
      const data = await res.json();
      setVerifying(false);
      setVerificationData({
        ...data,
        isHighRank: isHighRankAuthorized,
        courtWarrantRef: isHighRankAuthorized ? courtWarrantRef : null,
        data: {
          ...lookupCitizen,
          bankAccountStatus: isHighRankAuthorized ? lookupCitizen.bankAccountStatus : "🔒 RESTRICTED (Requires Senior SP Court Warrant)",
          panTaxStatus: isHighRankAuthorized ? lookupCitizen.panTaxStatus : "🔒 RESTRICTED",
          financialRiskScore: isHighRankAuthorized ? lookupCitizen.financialRiskScore : "🔒 RESTRICTED",
          abhaHealthCard: isHighRankAuthorized ? lookupCitizen.abhaHealthCard : "🔒 RESTRICTED",
          medicalCasualtyReport: isHighRankAuthorized ? lookupCitizen.medicalCasualtyReport : "🔒 RESTRICTED"
        }
      });
    } catch (err) {
      setVerifying(false);
      setVerificationData({
        success: true,
        granted: true,
        isHighRank: isHighRankAuthorized,
        courtWarrantRef: isHighRankAuthorized ? courtWarrantRef : null,
        scope: isHighRankAuthorized 
          ? "HIGH-RANK JUDICIAL WARRANT CLEARANCE: Identity, RTO, Bank Account, PAN Status, ABHA Health & Medico-Legal Records"
          : "Identity Verification, RTO Vehicle Records & Authorized Credentials",
        data: {
          ...lookupCitizen,
          caseReference: caseRefNo,
          bankAccountStatus: isHighRankAuthorized ? lookupCitizen.bankAccountStatus : "🔒 RESTRICTED (Requires Senior SP Court Warrant)",
          panTaxStatus: isHighRankAuthorized ? lookupCitizen.panTaxStatus : "🔒 RESTRICTED",
          financialRiskScore: isHighRankAuthorized ? lookupCitizen.financialRiskScore : "🔒 RESTRICTED",
          abhaHealthCard: isHighRankAuthorized ? lookupCitizen.abhaHealthCard : "🔒 RESTRICTED",
          medicalCasualtyReport: isHighRankAuthorized ? lookupCitizen.medicalCasualtyReport : "🔒 RESTRICTED"
        }
      });
    }

    // Append to Police Audit Log
    setAuditLogs(prev => [{
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      officer: isHighRankAuthorized ? `${officerRankRole} (${officer?.policeOfficerId || 'POL-8942-MH'})` : (officer?.name || 'Officer K. Sharma'),
      stateOrg: selectedState,
      citizenId: queryId,
      purpose: isHighRankAuthorized ? `${purpose} [High-Rank Judicial Order: ${courtWarrantRef}]` : purpose,
      caseRef: isHighRankAuthorized ? courtWarrantRef : caseRefNo,
      timestamp: 'Just Now',
      status: isHighRankAuthorized ? 'WARRANT AUTHORIZED (Bank & Health Access)' : 'Approved'
    }, ...prev]);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B132B', color: '#FFFFFF', fontFamily: 'var(--font-body)' }}>

      {/* POLICE TOP HEADER */}
      <header style={{
        backgroundColor: '#1C2541',
        borderBottom: '1px solid #3A506B',
        padding: '16px 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#DC2626', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)' }}>
              <ShieldAlert size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                CIVIQONE Law Enforcement &amp; Police Verification Workspace
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6FFFE9' }}>
                Authorized Police Portal — All 28 States &amp; 8 Union Territories
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* State Police Organization Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94A3B8' }}>State Police Dept:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #3A506B',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  color: '#FFFFFF',
                  backgroundColor: '#0B132B'
                }}
              >
                {allPoliceOrgs.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <button
              onClick={onReturnHome}
              style={{
                backgroundColor: '#3A506B',
                color: '#FFFFFF',
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
              <ArrowLeft size={14} /> Exit Police Portal
            </button>
          </div>

        </div>
      </header>

      {/* POLICE WORKSPACE MAIN CONTENT */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>

        {/* HERO BADGE & DISCLOSURE */}
        <div style={{ backgroundColor: '#1C2541', borderRadius: '20px', border: '1px solid #3A506B', padding: '28px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(220, 38, 38, 0.2)', color: '#FF6B6B', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              <ShieldAlert size={14} /> AUTHORIZED LAW ENFORCEMENT PORTAL
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '2px', marginBottom: '6px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {selectedState} — {officer?.policeBranch || (window.location.hash.includes('traffic') ? '🚔 Traffic Police Division' : window.location.hash.includes('crime') ? '🕵️‍♂️ Crime Branch / CID' : window.location.hash.includes('justice') ? '⚖️ Juvenile & Justice Division' : window.location.hash.includes('cyber') ? '💻 Cyber Crime Wing (EOW)' : '🛡️ Law & Order Division')}
            </h1>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span>Officer: <strong style={{ color: '#6FFFE9' }}>{officer?.name || 'Inspector R. Verma'}</strong></span>
              <span>Badge ID: <strong style={{ color: '#FEF08A' }}>{officer?.policeOfficerId || officer?.officerId || 'POL-OFFICER-8942'}</strong></span>
              <span>PS Code: <strong style={{ color: '#60A5FA' }}>{officer?.policeStationCode || 'PS-AP-101'}</strong></span>
              <span>URL Address: <strong style={{ color: '#FACC15', fontFamily: 'monospace' }}>http://localhost:3000/{window.location.hash || '#police-law'}</strong></span>
            </div>
          </div>

          <div style={{ backgroundColor: '#0B132B', padding: '12px 18px', borderRadius: '12px', border: '1px solid #3A506B', fontSize: '0.8rem', color: '#94A3B8', textAlign: 'right' }}>
            <div style={{ color: '#4ADE80', fontWeight: 800 }}>🔒 Station Code &amp; Branch URL Authenticated</div>
            <div style={{ fontSize: '0.725rem', color: '#94A3B8', marginTop: '2px' }}>Branch Hash: {window.location.hash || '#police-law'}</div>
          </div>
        </div>


        {/* TAB BAR */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #3A506B', marginBottom: '24px', paddingBottom: '10px', flexWrap: 'wrap' }}>
          {[
            { id: 'fir', label: '📋 Active FIR Registry' },
            { id: 'passport', label: `✈️ Passport Verification Queue (${passportApplications.filter(p => p.status.includes('WAITING')).length})` },
            { id: 'verify', label: '🔍 Citizen Verification' },
            { id: 'audit', label: '📜 Police Audit Trail' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === t.id ? '#DC2626' : '#1C2541',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 0.5: PASSPORT VERIFICATION WAITING LIST QUEUE */}
        {activeTab === 'passport' && (
          <div>
            {/* HERO PASSPORT QUEUE HEADER */}
            <div style={{ backgroundColor: '#1C2541', borderRadius: '20px', border: '1px solid #3A506B', padding: '24px 28px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                  ✈️ PASSPORT SEVA (MEA) &amp; POLICE CLEARANCE CERTIFICATE (PCC) QUEUE
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', marginTop: '2px', marginBottom: '4px' }}>
                  Passport Police Verification Waiting List
                </h2>
                <div style={{ fontSize: '0.825rem', color: '#94A3B8' }}>
                  Verify applicant identity via Citizen ID, validate physical residence address, audit CCTNS criminal background, and grant Police Clearance Certificates (PCC).
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#FACC15', padding: '8px 14px', borderRadius: '10px', border: '1px solid #EAB308', fontWeight: 800, fontSize: '0.8rem' }}>
                  ⏳ {passportApplications.filter(p => p.status.includes('WAITING')).length} Pending in Waiting List
                </span>
                <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '8px 14px', borderRadius: '10px', border: '1px solid #10B981', fontWeight: 800, fontSize: '0.8rem' }}>
                  ✅ {passportApplications.filter(p => p.status.includes('APPROVED')).length} PCC Cleared
                </span>
              </div>
            </div>

            {passportMsg && (
              <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981', color: '#34D399', padding: '16px', borderRadius: '14px', marginBottom: '24px', fontSize: '0.875rem', fontWeight: 900 }}>
                {passportMsg}
              </div>
            )}

            {/* 2-COLUMN SIDE-BY-SIDE SPLIT VIEW LAYOUT */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
              
              {/* LEFT COLUMN: PASSPORT APPLICATIONS QUEUE */}
              <div style={{ flex: '1 1 54%', backgroundColor: '#1C2541', borderRadius: '24px', border: '1px solid #3A506B', padding: '24px', minWidth: 'min(340px, 100%)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📋 Passport Applications Queue (Select Row)
                </h3>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#0B132B', borderBottom: '1px solid #3A506B', textAlign: 'left', color: '#94A3B8' }}>
                        <th style={{ padding: '12px 10px' }}>File No</th>
                        <th style={{ padding: '12px 10px' }}>Citizen ID</th>
                        <th style={{ padding: '12px 10px' }}>Applicant</th>
                        <th style={{ padding: '12px 10px' }}>Status</th>
                        <th style={{ padding: '12px 10px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passportApplications.map((app, idx) => {
                        const isSelected = selectedPassportApp?.appNo === app.appNo;
                        return (
                          <tr
                            key={idx}
                            style={{
                              borderBottom: '1px solid #3A506B',
                              backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.2)' : 'transparent',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <td style={{ padding: '12px 10px', fontWeight: 800, color: '#FACC15' }}>{app.appNo}</td>
                            <td style={{ padding: '12px 10px', fontWeight: 800, color: '#6FFFE9' }}>{app.citizenId}</td>
                            <td style={{ padding: '12px 10px', fontWeight: 700, color: '#FFFFFF' }}>{app.applicantName}</td>
                            <td style={{ padding: '12px 10px' }}>
                              <span style={{
                                backgroundColor: app.status.includes('APPROVED') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                                color: app.status.includes('APPROVED') ? '#34D399' : '#FACC15',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: 900,
                                border: app.status.includes('APPROVED') ? '1px solid #10B981' : '1px solid #EAB308'
                              }}>
                                {app.status.includes('APPROVED') ? '✅ APPROVED' : '⏳ WAITING'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 10px' }}>
                              <button
                                onClick={(e) => {
                                  setSelectedPassportApp(app);
                                  setSearchCivicId(app.citizenId);
                                  handleExecutePoliceVerification(e, app.citizenId);
                                }}
                                style={{
                                  backgroundColor: isSelected ? '#10B981' : '#2563EB',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontWeight: 800,
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                {isSelected ? '✓ Selected' : '🔍 Verify ID'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RIGHT COLUMN: ACTIVE PASSPORT APPLICANT VERIFICATION & APPROVAL WORKSPACE */}
              <div style={{ flex: '1 1 42%', minWidth: 'min(320px, 100%)', sticky: 'top', top: '90px' }}>
                {selectedPassportApp ? (
                  <div id="passport-workspace-panel" style={{ backgroundColor: '#1C2541', borderRadius: '24px', border: '2px solid #2563EB', padding: '24px', boxShadow: '0 12px 36px rgba(0,0,0,0.3)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#60A5FA', textTransform: 'uppercase' }}>
                          RIGHT PANEL — CITIZEN VERIFICATION &amp; APPROVAL
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>
                          {selectedPassportApp.applicantName}
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: '#6FFFE9', fontWeight: 800 }}>
                          Citizen ID: {selectedPassportApp.citizenId}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
                          File: <strong style={{ color: '#FACC15' }}>{selectedPassportApp.appNo}</strong> • {selectedPassportApp.type}
                        </div>
                      </div>

                      <span style={{ fontSize: '0.725rem', fontWeight: 900, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '5px 12px', borderRadius: '20px', border: '1px solid #10B981' }}>
                        UIDAI ADV VERIFIED
                      </span>
                    </div>

                    {/* VERIFICATION ATTRIBUTE CARDS GRID IN RIGHT PANEL */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                      <div style={{ backgroundColor: '#0B132B', padding: '14px', borderRadius: '12px', border: '1px solid #3A506B' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', marginBottom: '2px' }}>👤 Applicant Identity</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#FFFFFF' }}>{verificationData?.data?.fullName || selectedPassportApp.applicantName}</div>
                        <div style={{ fontSize: '0.7rem', color: '#4ADE80', fontWeight: 800, marginTop: '2px' }}>✓ Masked Aadhaar: {verificationData?.data?.maskedAadhaar || 'XXXX XXXX 1001'}</div>
                      </div>

                      <div style={{ backgroundColor: '#0B132B', padding: '14px', borderRadius: '12px', border: '1px solid #3A506B' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', marginBottom: '2px' }}>🏠 Physical Address</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#FFFFFF' }}>{verificationData?.data?.addressStatus || selectedPassportApp.address}</div>
                        <div style={{ fontSize: '0.7rem', color: '#4ADE80', fontWeight: 800, marginTop: '2px' }}>✓ Residence Verified</div>
                      </div>

                      <div style={{ backgroundColor: '#0B132B', padding: '14px', borderRadius: '12px', border: '1px solid #3A506B' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', marginBottom: '2px' }}>📋 Criminal Background</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#4ADE80' }}>{verificationData?.data?.pccStatus || 'Clean CCTNS Record'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>Zero Active FIRs</div>
                      </div>

                      <div style={{ backgroundColor: '#0B132B', padding: '14px', borderRadius: '12px', border: '1px solid #3A506B' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', marginBottom: '2px' }}>🚘 RTO Transport Audit</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#60A5FA' }}>{verificationData?.data?.drivingLicence || 'DEMO-DL-10001 Valid'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#4ADE80', fontWeight: 800, marginTop: '2px' }}>✓ Motor Vehicle Validated</div>
                      </div>
                    </div>

                    {/* APPROVAL ACTIONS DIRECTLY IN RIGHT PANEL */}
                    <div style={{ borderTop: '1px solid #3A506B', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button
                        onClick={() => {
                          const pccCode = `PCC-2026-AP-${Math.floor(1000 + Math.random() * 9000)}`;
                          setPassportApplications(prev => prev.map(p => p.appNo === selectedPassportApp.appNo ? {
                            ...p,
                            status: `✅ APPROVED — PASSPORT CLEARANCE ISSUED (${pccCode})`,
                            pccToken: pccCode
                          } : p));
                          setPassportMsg(`✓ Passport Police Clearance Certificate (${pccCode}) issued for ${selectedPassportApp.applicantName} (${selectedPassportApp.citizenId}). Application approved!`);
                          setSelectedPassportApp(prev => ({
                            ...prev,
                            status: `✅ APPROVED — PASSPORT CLEARANCE ISSUED (${pccCode})`,
                            pccToken: pccCode
                          }));
                        }}
                        style={{
                          width: '100%',
                          backgroundColor: '#059669',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '12px',
                          borderRadius: '12px',
                          fontWeight: 900,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 16px rgba(5, 150, 105, 0.4)'
                        }}
                      >
                        ⚡ Grant Passport Clearance (Issue PCC Token)
                      </button>

                      <button
                        onClick={() => {
                          setPassportApplications(prev => prev.map(p => p.appNo === selectedPassportApp.appNo ? {
                            ...p,
                            status: '🚩 QUERY RAISED — PHYSICAL RE-INSPECTION REQUESTED'
                          } : p));
                          setPassportMsg(`⚠️ Physical verification query raised for ${selectedPassportApp.applicantName} (${selectedPassportApp.citizenId}).`);
                        }}
                        style={{
                          width: '100%',
                          backgroundColor: '#DC2626',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '10px',
                          borderRadius: '12px',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        🚩 Flag for Physical Inspection
                      </button>
                    </div>

                  </div>
                ) : (
                  <div style={{ backgroundColor: '#1C2541', borderRadius: '24px', border: '1px dashed #3A506B', padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>👈</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
                      Select Applicant to Verify
                    </div>
                    <div style={{ fontSize: '0.8rem' }}>
                      Click <strong>"🔍 Verify Citizen ID"</strong> on any applicant row in the left waiting list to display their verification profile &amp; grant approval in this right panel.
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 0: FIR REGISTRY */}
        {activeTab === 'fir' && (
          <div style={{ backgroundColor: '#1C2541', borderRadius: '20px', border: '1px solid #3A506B', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '4px' }}>Active FIR Registry</h3>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{selectedState} — {DEMO_POLICE_FIRS.length} active cases</div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ backgroundColor: 'rgba(220,38,38,0.2)', color: '#FF6B6B', padding: '6px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem' }}>
                  {DEMO_POLICE_FIRS.filter(f => f.status.includes('Pending')).length} Pending
                </span>
                <span style={{ backgroundColor: 'rgba(74,222,128,0.15)', color: '#4ADE80', padding: '6px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem' }}>
                  {DEMO_POLICE_FIRS.filter(f => f.status === 'Resolved').length} Resolved
                </span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #3A506B', textAlign: 'left' }}>
                    <th style={{ padding: '12px', fontWeight: 800, color: '#6FFFE9', whiteSpace: 'nowrap' }}>FIR ID</th>
                    <th style={{ padding: '12px', fontWeight: 800, color: '#94A3B8' }}>Date</th>
                    <th style={{ padding: '12px', fontWeight: 800, color: '#94A3B8' }}>Subject</th>
                    <th style={{ padding: '12px', fontWeight: 800, color: '#94A3B8' }}>Location</th>
                    <th style={{ padding: '12px', fontWeight: 800, color: '#94A3B8' }}>Complainant</th>
                    <th style={{ padding: '12px', fontWeight: 800, color: '#94A3B8' }}>Status</th>
                    <th style={{ padding: '12px', fontWeight: 800, color: '#94A3B8' }}>Assigned Officer</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_POLICE_FIRS.map((fir, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #1E2D45', transition: 'background 0.2s' }}>
                      <td style={{ padding: '14px 12px', fontFamily: 'monospace', color: '#FEF08A', fontWeight: 700, whiteSpace: 'nowrap' }}>{fir.id}</td>
                      <td style={{ padding: '14px 12px', color: '#94A3B8', whiteSpace: 'nowrap' }}>{fir.date}</td>
                      <td style={{ padding: '14px 12px', color: '#FFFFFF', fontWeight: 700 }}>{fir.subject}</td>
                      <td style={{ padding: '14px 12px', color: '#94A3B8' }}>{fir.location}</td>
                      <td style={{ padding: '14px 12px', color: '#6FFFE9', fontFamily: 'monospace', fontSize: '0.8rem' }}>{fir.complainantId}</td>
                      <td style={{ padding: '14px 12px' }}>
                        <span style={{
                          backgroundColor: fir.status.includes('Pending') ? 'rgba(239,68,68,0.2)' : 'rgba(74,222,128,0.15)',
                          color: fir.status.includes('Pending') ? '#F87171' : '#4ADE80',
                          padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, whiteSpace: 'nowrap'
                        }}>
                          {fir.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 12px', color: '#60A5FA', whiteSpace: 'nowrap' }}>{fir.assignedOfficer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 1: PURPOSE-BASED CITIZEN VERIFICATION */}
        {activeTab === 'verify' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: '28px' }}>
            
            {/* Form */}
            <div style={{ backgroundColor: '#1C2541', borderRadius: '20px', border: '1px solid #3A506B', padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px' }}>
                Execute Authorized Verification Request
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#94A3B8', marginBottom: '20px' }}>
                Enter the citizen's Civic ID and official FIR / Case Reference Number to query verified identity records.
              </p>

              <form onSubmit={handleExecutePoliceVerification}>
                
                {/* OFFICER RANK & CLEARANCE TOGGLE */}
                <div style={{ backgroundColor: '#0B132B', padding: '16px', borderRadius: '14px', border: '1.5px solid #3A506B', marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#FACC15', marginBottom: '8px' }}>
                    👑 Officer Rank Level &amp; Judicial Clearance Mode
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setRankMode('STANDARD')}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: rankMode === 'STANDARD' ? '2px solid #3B82F6' : '1px solid #3A506B',
                        backgroundColor: rankMode === 'STANDARD' ? '#1E3A8A' : '#1C2541',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      👮 Inspector (Standard RTO/ID Scope)
                    </button>
                    <button
                      type="button"
                      onClick={() => setRankMode('HIGH_RANK')}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: rankMode === 'HIGH_RANK' ? '2px solid #F59E0B' : '1px solid #3A506B',
                        backgroundColor: rankMode === 'HIGH_RANK' ? 'rgba(217,119,6,0.25)' : '#1C2541',
                        color: rankMode === 'HIGH_RANK' ? '#FDE68A' : '#94A3B8',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      ⭐ Senior SP / Commissioner (High-Rank Access)
                    </button>
                  </div>

                  {rankMode === 'HIGH_RANK' && (
                    <div style={{ backgroundColor: 'rgba(217, 119, 6, 0.1)', padding: '10px 12px', borderRadius: '8px', border: '1px solid #F59E0B' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#FDE68A', marginBottom: '4px' }}>
                        ⚖️ High-Rank Judicial Warrant / Court Order Reference
                      </label>
                      <input
                        type="text"
                        value={courtWarrantRef}
                        onChange={(e) => setCourtWarrantRef(e.target.value)}
                        placeholder="e.g. WARRANT-2026-HC-8812"
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #F59E0B', backgroundColor: '#0B132B', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 800 }}
                        required
                      />
                      <div style={{ fontSize: '0.675rem', color: '#FCD34D', marginTop: '4px' }}>
                        Unlocks Bank Account eKYC, PAN Status, and Medico-Legal Health Records under High-Rank Warrant.
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6FFFE9' }}>
                      Citizen Civic ID Number
                    </label>
                    <div style={{ fontSize: '0.725rem', color: '#94A3B8' }}>
                      Quick Select Citizen:
                    </div>
                  </div>
                  
                  {/* QUICK DEMO CITIZEN SELECTOR */}
                  <select
                    onChange={(e) => setSearchCivicId(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #3A506B', backgroundColor: '#0B132B', color: '#6FFFE9', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px' }}
                  >
                    <option value="CIV-DEMO-10001">CIV-DEMO-10001 — Aarav Kumar (Vijayawada, AP)</option>
                    <option value="CIV-DEMO-10002">CIV-DEMO-10002 — Priya Sharma (Mumbai, MH)</option>
                    <option value="CIV-DEMO-10003">CIV-DEMO-10003 — Vikram Singh (New Delhi)</option>
                  </select>

                  <input
                    type="text"
                    value={searchCivicId}
                    onChange={(e) => setSearchCivicId(e.target.value)}
                    placeholder="e.g. CIV-DEMO-10001"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #3A506B', backgroundColor: '#0B132B', color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700 }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6FFFE9', marginBottom: '6px' }}>
                    FIR / Case Reference Number
                  </label>
                  <input
                    type="text"
                    value={caseRefNo}
                    onChange={(e) => setCaseRefNo(e.target.value)}
                    placeholder="e.g. FIR-2026-904812"
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #3A506B', backgroundColor: '#0B132B', color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700 }}
                    required
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6FFFE9', marginBottom: '6px' }}>
                    Legal Purpose for Verification
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #3A506B', backgroundColor: '#0B132B', color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700 }}
                  >
                    <option value="Official Law Enforcement Verification">Official Law Enforcement Verification</option>
                    <option value="Economic Crime & Bank Record Audit">Economic Crime &amp; Bank Account Audit (High-Rank)</option>
                    <option value="Medico-Legal & Forensic Health Audit">Medico-Legal &amp; Forensic Health Audit (High-Rank)</option>
                    <option value="Vehicle Registration Check">Vehicle Registration &amp; RTO Verification</option>
                    <option value="Identity Status Verification">Identity &amp; Address Verification</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={verifying}
                  style={{
                    width: '100%',
                    backgroundColor: rankMode === 'HIGH_RANK' ? '#D97706' : '#DC2626',
                    color: '#FFFFFF',
                    padding: '14px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {verifying ? 'Querying Police Database...' : rankMode === 'HIGH_RANK' ? 'Execute High-Rank Warrant Police Check 🚨' : 'Execute Standard Police Check 🚨'}
                </button>
              </form>
            </div>

            {/* Results Display Panel */}
            <div style={{ backgroundColor: '#1C2541', borderRadius: '20px', border: '1px solid #3A506B', padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>
                Verification Output &amp; Audit Status
              </h3>

              {!verificationData ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8' }}>
                  Enter Civic ID and FIR Reference to fetch verified law enforcement record.
                </div>
              ) : (
                <div>
                  <div style={{ backgroundColor: '#0B132B', borderRadius: '14px', padding: '16px', border: '1px solid #3A506B', marginBottom: '16px' }}>
                    <div style={{ color: '#4ADE80', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px' }}>
                      ✓ VERIFICATION AUTHORIZED &amp; LOGGED
                    </div>

                    {/* Standard Scope Data */}
                    <div style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                      <div>Citizen Civic ID: <strong style={{ color: '#FFFFFF' }}>{searchCivicId}</strong></div>
                      <div>Citizen Name: <strong style={{ color: '#FFFFFF' }}>Aarav Kumar</strong></div>
                      <div>Identity Status: <strong style={{ color: '#4ADE80' }}>Verified</strong></div>
                      <div>Driving Licence: <strong style={{ color: '#6FFFE9' }}>DEMO-DL-10001 (Valid)</strong></div>
                      <div>Vehicle Registration: <strong style={{ color: '#6FFFE9' }}>AP-DEMO-1001 (Active)</strong></div>
                      <div>Address Status: <strong style={{ color: '#FFFFFF' }}>Verified — Vijayawada, AP</strong></div>
                      <div>FIR Reference: <strong style={{ color: '#FEF08A' }}>{caseRefNo}</strong></div>
                    </div>

                    {/* High-Rank Unlocked Data (Bank & Healthcare) */}
                    <div style={{ backgroundColor: 'rgba(217,119,6,0.15)', border: '1px solid #D97706', padding: '14px', borderRadius: '10px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#FBBF24', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        ⭐ HIGH-RANK JUDICIAL WARRANT UNLOCKED DATA
                      </div>

                      <div style={{ fontSize: '0.825rem', color: '#E2E8F0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div>🏦 Bank Account Status: <strong style={{ color: verificationData.isHighRank ? '#4ADE80' : '#F87171' }}>{verificationData.data.bankAccountStatus}</strong></div>
                        <div>📄 PAN Tax Verification: <strong style={{ color: verificationData.isHighRank ? '#6FFFE9' : '#F87171' }}>{verificationData.data.panTaxStatus}</strong></div>
                        <div>📈 CIBIL Risk Score: <strong style={{ color: verificationData.isHighRank ? '#4ADE80' : '#F87171' }}>{verificationData.data.financialRiskScore}</strong></div>
                        <div>🏥 ABHA Health Card: <strong style={{ color: verificationData.isHighRank ? '#6FFFE9' : '#F87171' }}>{verificationData.data.abhaHealthCard}</strong></div>
                        <div>🩺 Medico-Legal Forensic Report: <strong style={{ color: verificationData.isHighRank ? '#4ADE80' : '#F87171' }}>{verificationData.data.medicalCasualtyReport}</strong></div>
                      </div>

                      {verificationData.isHighRank && (
                        <div style={{ fontSize: '0.725rem', color: '#FCD34D', marginTop: '8px', fontStyle: 'italic' }}>
                          ⚖️ Access Authorized under Judicial Order Ref: {courtWarrantRef}
                        </div>
                      )}
                    </div>

                  </div>

                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/consent/request', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            orgId: 'org-police-01',
                            orgName: selectedState || 'State Police Department',
                            citizenCivicId: searchCivicId,
                            docId: 'doc-police-verification',
                            docName: 'Identity & Address Verification Records',
                            purpose: `Police Case / FIR Investigation Clearance (Ref: ${caseRefNo})`,
                            expiryDays: '7'
                          })
                        });
                        const data = await res.json();
                        if (data.success) {
                          alert(`📩 Case Investigation Request sent to citizen (${searchCivicId})! Notification sent to their app to Accept or Decline.`);
                        }
                      } catch (e) {
                        alert('Error sending consent request.');
                      }
                    }}
                    style={{
                      width: '100%',
                      marginTop: '16px',
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '12px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(220,38,38,0.3)'
                    }}
                  >
                    📢 Register Case / FIR & Request Record Access Consent
                  </button>

                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic', marginTop: '8px' }}>
                    🔒 Logged in Police National Audit Log for state department: {selectedState}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: POLICE AUDIT TRAIL LOGS */}
        {activeTab === 'audit' && (
          <div style={{ backgroundColor: '#1C2541', borderRadius: '20px', border: '1px solid #3A506B', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>
              Police Verification Audit Log History
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {auditLogs.map(log => (
                <div key={log.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#0B132B', border: '1px solid #3A506B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#6FFFE9' }}>{log.stateOrg} — {log.purpose}</div>
                    <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                      Officer: {log.officer} | Citizen: {log.citizenId} | FIR Ref: {log.caseRef}
                    </div>
                  </div>
                  <span style={{ backgroundColor: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem' }}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
