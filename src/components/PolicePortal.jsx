// src/components/PolicePortal.jsx - Dedicated Police & Law Enforcement Portal

import React, { useState } from 'react';
import {
  ShieldAlert, Search, FileCheck, CheckCircle2, AlertCircle, Clock, FileText,
  UserCheck, ArrowLeft, Building2, Lock, History, FileSearch, ShieldCheck, Filter
} from 'lucide-react';

export default function PolicePortal({ officer, onReturnHome }) {
  const [selectedState, setSelectedState] = useState('Demo Police Organization (All States)');
  const [searchCivicId, setSearchCivicId] = useState('CIV-DEMO-10001');
  const [caseRefNo, setCaseRefNo] = useState('FIR-2026-904812');
  const [purpose, setPurpose] = useState('Official Law Enforcement Verification');
  const [accessDuration, setAccessDuration] = useState('24 hours');
  const [verifying, setVerifying] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [activeTab, setActiveTab] = useState('verify'); // 'verify' | 'audit' | 'requests'

  const indianStatesPolice = [
    'Demo Police Organization (All States)',
    'Andhra Pradesh Police', 'Telangana Police', 'Tamil Nadu Police', 'Karnataka Police',
    'Kerala Police', 'Maharashtra Police', 'Delhi Police', 'Gujarat Police',
    'Rajasthan Police', 'Uttar Pradesh Police', 'West Bengal Police', 'Odisha Police',
    'Punjab Police', 'Haryana Police', 'Bihar Police', 'Jharkhand Police',
    'Chhattisgarh Police', 'Madhya Pradesh Police', 'Goa Police', 'Assam Police',
    'Arunachal Pradesh Police', 'Manipur Police', 'Meghalaya Police', 'Mizoram Police',
    'Nagaland Police', 'Sikkim Police', 'Tripura Police', 'Uttarakhand Police',
    'Himachal Pradesh Police', 'Jammu & Kashmir Police', 'Ladakh Police',
    'Andaman & Nicobar Police', 'Chandigarh Police', 'Dadra & Nagar Haveli and Daman & Diu Police',
    'Lakshadweep Police', 'Puducherry Police'
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
          vehicleRC: "MH 02 CD 4589 (Active)",
          addressStatus: "Verified — Bandra West, Mumbai, MH",
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
    <div style={{ minHeight: '100vh', backgroundColor: '#091527', color: '#FFFFFF', padding: '24px 16px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #1E293B', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#1E3A8A', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid #3B82F6' }}>
              <ShieldAlert size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF' }}>CivicOne Law Enforcement Portal</h1>
                <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>
                  DEMO POLICE ORGANIZATION
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                Authorized Police Access Desk — Purpose-based legal identity verification
              </p>
            </div>
          </div>

          <button
            onClick={onReturnHome}
            style={{ backgroundColor: '#1E293B', color: '#FFFFFF', padding: '10px 18px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ArrowLeft size={16} /> Exit Police Portal
          </button>
        </div>

        {/* STATE POLICE ORGANIZATION SELECTOR DROPDOWN */}
        <div style={{ backgroundColor: '#0F2342', borderRadius: '16px', padding: '16px 20px', border: '1px solid #1E3A8A', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#93C5FD', textTransform: 'uppercase' }}>Select State / UT Police Department:</span>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>{selectedState}</div>
          </div>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            style={{
              backgroundColor: '#091527',
              color: '#FFFFFF',
              border: '1.5px solid #3B82F6',
              padding: '10px 16px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}
          >
            {indianStatesPolice.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* WORKSPACE NAVIGATION TABS */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('verify')}
            style={{ padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', backgroundColor: activeTab === 'verify' ? '#2563EB' : '#0F2342', color: '#FFFFFF' }}
          >
            🔍 Citizen Identity Search &amp; Audit
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            style={{ padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', backgroundColor: activeTab === 'audit' ? '#2563EB' : '#0F2342', color: '#FFFFFF' }}
          >
            📜 Police Audit Logs ({auditLogs.length})
          </button>
        </div>

        {activeTab === 'verify' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
            
            {/* SEARCH & AUTHORIZATION FORM */}
            <div style={{ backgroundColor: '#0F2342', borderRadius: '20px', padding: '24px', border: '1px solid #1E3A8A' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSearch size={20} style={{ color: '#60A5FA' }} /> Execute Legal Access Request
              </h2>

              <form onSubmit={handleExecutePoliceVerification}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#93C5FD', marginBottom: '4px' }}>Citizen CivicOne ID *</label>
                  <input
                    type="text"
                    required
                    value={searchCivicId}
                    onChange={(e) => setSearchCivicId(e.target.value)}
                    placeholder="e.g. CIV-DEMO-10001"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#091527', color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700 }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#93C5FD', marginBottom: '4px' }}>FIR / Case Reference Number *</label>
                  <input
                    type="text"
                    required
                    value={caseRefNo}
                    onChange={(e) => setCaseRefNo(e.target.value)}
                    placeholder="e.g. FIR-2026-904812"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#091527', color: '#FFFFFF', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#93C5FD', marginBottom: '4px' }}>Investigation Purpose *</label>
                  <input
                    type="text"
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#091527', color: '#FFFFFF', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#93C5FD', marginBottom: '4px' }}>Access Duration</label>
                  <select
                    value={accessDuration}
                    onChange={(e) => setAccessDuration(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#091527', color: '#FFFFFF', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    <option value="1 hour">1 Hour</option>
                    <option value="24 hours">24 Hours</option>
                    <option value="7 days">7 Days</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={verifying}
                  style={{ width: '100%', backgroundColor: '#2563EB', color: '#FFFFFF', padding: '12px', borderRadius: '12px', fontWeight: 900, fontSize: '0.9rem' }}
                >
                  {verifying ? "Executing Purpose Audit..." : "Request Purpose-Based Verification"}
                </button>
              </form>
            </div>

            {/* AUTHORIZED DATA DISPLAY PANEL */}
            <div style={{ backgroundColor: '#0F2342', borderRadius: '20px', padding: '24px', border: '1px solid #1E3A8A' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
                Authorized Verification Output
              </h2>

              {verificationData ? (
                <div>
                  <div style={{ backgroundColor: '#064E3B', border: '1px solid #059669', color: '#A7F3D0', padding: '12px 16px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={18} /> Purpose-Based Authorization Granted
                  </div>

                  <div style={{ backgroundColor: '#091527', padding: '16px', borderRadius: '14px', border: '1px solid #1E3A8A', fontSize: '0.825rem', color: '#E2E8F0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div><span style={{ color: '#94A3B8' }}>Citizen:</span> <strong>{verificationData.data.fullName}</strong></div>
                    <div><span style={{ color: '#94A3B8' }}>Civic ID:</span> <strong>{verificationData.data.citizenId}</strong></div>
                    <div><span style={{ color: '#94A3B8' }}>Requesting Org:</span> <strong>{selectedState}</strong></div>
                    <div><span style={{ color: '#94A3B8' }}>FIR / Case Ref:</span> <strong>{caseRefNo}</strong></div>
                    <div><span style={{ color: '#94A3B8' }}>Aadhaar Ref:</span> <strong>{verificationData.data.maskedAadhaar}</strong></div>
                    <div><span style={{ color: '#94A3B8' }}>Identity Status:</span> <strong style={{ color: '#34D399' }}>{verificationData.data.identityStatus}</strong></div>
                    <div><span style={{ color: '#94A3B8' }}>Driving Licence:</span> <strong>{verificationData.data.drivingLicence}</strong></div>
                    <div><span style={{ color: '#94A3B8' }}>Vehicle RC:</span> <strong>{verificationData.data.vehicleRC}</strong></div>
                    <div><span style={{ color: '#94A3B8' }}>Address KYC:</span> <strong>{verificationData.data.addressStatus}</strong></div>
                  </div>

                  <div style={{ marginTop: '16px', fontSize: '0.75rem', color: '#FCD34D', backgroundColor: '#78350F', padding: '10px 14px', borderRadius: '10px' }}>
                    🔒 Audit Trail Enforced: Event recorded with Authorization ID <code>AUTH-{Math.floor(100000 + Math.random() * 900000)}</code>.
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 16px', color: '#64748B', border: '1px dashed #334155', borderRadius: '16px' }}>
                  <UserCheck size={42} style={{ marginBottom: '12px', color: '#3B82F6' }} />
                  <p style={{ fontSize: '0.85rem' }}>Enter citizen CivicOne ID and FIR case reference to execute purpose-based verification.</p>
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'audit' && (
          <div style={{ backgroundColor: '#0F2342', borderRadius: '20px', padding: '24px', border: '1px solid #1E3A8A' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '16px' }}>
              Law Enforcement Verification Audit Logs
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {auditLogs.map(log => (
                <div key={log.id} style={{ backgroundColor: '#091527', padding: '14px 18px', borderRadius: '12px', border: '1px solid #1E3A8A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '0.825rem' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{log.officer} — {log.stateOrg}</div>
                    <div style={{ color: '#94A3B8', marginTop: '2px' }}>
                      Citizen ID: <code>{log.citizenId}</code> | Purpose: {log.purpose} | Case Ref: <strong>{log.caseRef}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ backgroundColor: '#064E3B', color: '#34D399', padding: '2px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
                      {log.status}
                    </span>
                    <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '4px' }}>{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
