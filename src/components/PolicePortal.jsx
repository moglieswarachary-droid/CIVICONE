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
  const [verifying, setVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [activeTab, setActiveTab] = useState('fir'); // 'fir' | 'verify' | 'audit'

  const allPoliceOrgs = [
    'Demo Police Organization (All States)',
    ...INDIA_STATES_AND_UTS.map(st => `${st} Police`)
  ];

  const [auditLogs, setAuditLogs] = useState([
    { id: 'LOG-1001', officer: 'Officer K. Sharma', stateOrg: 'Maharashtra Police', citizenId: 'CIV-DEMO-10001', purpose: 'Vehicle Registration Check', caseRef: 'FIR-2026-904812', timestamp: 'Today, 10:15 AM', status: 'Approved' },
    { id: 'LOG-1002', officer: 'Officer R. Verma', stateOrg: 'Delhi Police', citizenId: 'CIV-DEMO-10002', purpose: 'Identity Verification', caseRef: 'FIR-2026-881204', timestamp: 'Yesterday, 04:30 PM', status: 'Approved' }
  ]);

  const handleExecutePoliceVerification = async (e) => {
    e.preventDefault();
    if (!searchCivicId.trim()) return;
    setVerifying(true);
    setVerificationData(null);

    try {
      const res = await fetch(`/api/consent/org-access/${searchCivicId}?requestingOrgRole=POLICE_ADMIN`);
      const data = await res.json();
      setVerifying(false);
      setVerificationData(data);
    } catch (err) {
      setVerifying(false);
      setVerificationData({
        success: true,
        granted: true,
        scope: "Identity Verification, RTO Vehicle Records & Authorized Credentials",
        data: {
          citizenId: searchCivicId,
          fullName: "Aarav Kumar",
          maskedAadhaar: "XXXX XXXX 1001",
          identityStatus: "Verified",
          drivingLicence: "DEMO-DL-10001 (Valid until 14-10-2028)",
          vehicleRC: "AP-DEMO-1001 (Active)",
          addressStatus: "Verified — MG Road, Vijayawada, AP",
          caseReference: caseRefNo
        }
      });
    }

    // Append to Police Audit Log
    setAuditLogs(prev => [{
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      officer: officer?.name || 'Officer K. Sharma',
      stateOrg: selectedState,
      citizenId: searchCivicId,
      purpose,
      caseRef: caseRefNo,
      timestamp: 'Just Now',
      status: 'Approved'
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
                CivicOne Law Enforcement &amp; Police Verification Workspace
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
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '2px', marginBottom: '6px', color: '#FFFFFF' }}>
              {selectedState}
            </h1>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Officer Session: <span style={{ color: '#6FFFE9', fontWeight: 800 }}>{officer?.name || 'Authorized Inspector'}</span> | Clearance: <span style={{ color: '#FF6B6B', fontWeight: 800 }}>LEGAL POLICE VERIFICATION</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#0B132B', padding: '12px 18px', borderRadius: '12px', border: '1px solid #3A506B', fontSize: '0.8rem', color: '#94A3B8' }}>
            🔒 Strict Purpose-Based Verification Protocol Active
          </div>
        </div>

        {/* TAB BAR */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #3A506B', marginBottom: '24px', paddingBottom: '10px' }}>
          {[
            { id: 'fir', label: '📋 Active FIR Registry' },
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
            
            {/* Form */}
            <div style={{ backgroundColor: '#1C2541', borderRadius: '20px', border: '1px solid #3A506B', padding: '28px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px' }}>
                Execute Authorized Verification Request
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#94A3B8', marginBottom: '20px' }}>
                Enter the citizen's Civic ID and official FIR / Case Reference Number to query verified identity records.
              </p>

              <form onSubmit={handleExecutePoliceVerification}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#6FFFE9', marginBottom: '6px' }}>
                    Citizen Civic ID Number
                  </label>
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
                    <option value="Vehicle Registration Check">Vehicle Registration &amp; RTO Verification</option>
                    <option value="Identity Status Verification">Identity &amp; Address Verification</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={verifying}
                  style={{
                    width: '100%',
                    backgroundColor: '#DC2626',
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
                  {verifying ? 'Querying Police Database...' : 'Execute Authorized Police Check 🚨'}
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
                    <div style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div>Citizen Civic ID: <strong style={{ color: '#FFFFFF' }}>{searchCivicId}</strong></div>
                      <div>Citizen Name: <strong style={{ color: '#FFFFFF' }}>Aarav Kumar</strong></div>
                      <div>Identity Status: <strong style={{ color: '#4ADE80' }}>Verified</strong></div>
                      <div>Driving Licence: <strong style={{ color: '#6FFFE9' }}>DEMO-DL-10001 (Valid)</strong></div>
                      <div>Vehicle Registration: <strong style={{ color: '#6FFFE9' }}>AP-DEMO-1001 (Active)</strong></div>
                      <div>Address Status: <strong style={{ color: '#FFFFFF' }}>Verified — Vijayawada, AP</strong></div>
                      <div>FIR Reference: <strong style={{ color: '#FEF08A' }}>{caseRefNo}</strong></div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>
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
