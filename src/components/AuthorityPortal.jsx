// src/components/AuthorityPortal.jsx - Isolated Government Officer Administration & Supervision Portal

import React, { useState, useEffect } from 'react';
import {
  Landmark, ShieldCheck, Building2, Eye, CheckCircle2, ArrowLeft, RefreshCw,
  AlertTriangle, Lock, Users, FileText, Search, ShieldAlert, Award, Clock, MapPin
} from 'lucide-react';
import { GOVERNMENT_OFFICER_LEVELS, DEMO_POLICE_FIRS } from '../data/mockData.js';

export default function AuthorityPortal({ officer, onReturnHome }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'overview' | 'organizations' | 'requests' | 'issue' | 'audit'
  const [officerData, setOfficerData] = useState(officer || {
    officerId: 'GOVT-OFFICER-8942',
    name: 'Officer K. Sharma',
    email: 'officer.sharma@parivahan.gov.in',
    department: 'Transport (RTO)',
    state: 'Andhra Pradesh',
    office: 'Demo RTO Regional Headquarters — Vijayawada',
    roleLevel: 1,
    roleTitle: 'LEVEL 1 — GOVERNMENT OFFICER',
    clearanceStatus: 'LEVEL-3 VERIFIED',
    securityStatus: 'LOCK-PROTECTED LEVEL-3'
  });

  const [supervisedOrgs, setSupervisedOrgs] = useState([
    { id: 'org-pol-ap', name: 'CivicOne Demo Police (AP)', type: 'Police', state: 'Andhra Pradesh', jurisdiction: 'Vijayawada Urban', verificationStatus: 'VERIFIED', accessStatus: 'ACTIVE', lastActivity: '10:15 AM Today' },
    { id: 'org-col-ap', name: 'CivicOne Demo College (AP)', type: 'College', state: 'Andhra Pradesh', jurisdiction: 'Krishna District', verificationStatus: 'VERIFIED', accessStatus: 'ACTIVE', lastActivity: '08:30 AM Today' },
    { id: 'org-sch-ap', name: 'CivicOne Model School (AP)', type: 'School', state: 'Andhra Pradesh', jurisdiction: 'Vijayawada Rural', verificationStatus: 'VERIFIED', accessStatus: 'ACTIVE', lastActivity: 'Yesterday' },
    { id: 'org-hot-ap', name: 'CivicOne Grand Hotel (AP)', type: 'Hotel', state: 'Andhra Pradesh', jurisdiction: 'MG Road Sector', verificationStatus: 'VERIFIED', accessStatus: 'ACTIVE', lastActivity: '09:30 AM Today' },
    { id: 'org-elec-ap', name: 'CivicOne Gadget Store (AP)', type: 'Electronics', state: 'Andhra Pradesh', jurisdiction: 'Eluru Road', verificationStatus: 'VERIFIED', accessStatus: 'ACTIVE', lastActivity: '09:55 AM Today' },
    { id: 'org-mob-ap', name: 'CivicOne Mobile Store (AP)', type: 'Mobile Shop', state: 'Andhra Pradesh', jurisdiction: 'Bunder Road', verificationStatus: 'VERIFIED', accessStatus: 'ACTIVE', lastActivity: '09:10 AM Today' }
  ]);

  const [accessRequests, setAccessRequests] = useState([
    { id: 'REQ-GOVT-101', orgName: 'CivicOne Demo College', orgType: 'College', dataRequested: 'Student Identity + Education Certificate', purpose: 'Admission verification', authorization: 'CITIZEN CONSENT APPROVED', dateTime: '14 Aug 2026, 08:30 AM', status: 'Approved', accessLevel: 'VIEW ONLY' },
    { id: 'REQ-GOVT-102', orgName: 'CivicOne Mobile Store', orgType: 'Mobile Shop', dataRequested: 'Minimum Identity & Address Verification', purpose: 'SIM activation KYC', authorization: 'CITIZEN CONSENT APPROVED', dateTime: '14 Aug 2026, 09:10 AM', status: 'Approved', accessLevel: 'MINIMUM KYC VIEW ONLY' },
    { id: 'REQ-GOVT-103', orgName: 'CivicOne Grand Hotel', orgType: 'Hotel', dataRequested: 'Guest Name & ID Verification Badge', purpose: 'Guest check-in', authorization: 'PENDING CITIZEN CONSENT', dateTime: '14 Aug 2026, 09:30 AM', status: 'Pending', accessLevel: 'LIMITED HOTEL VIEW' }
  ]);

  const [issueForm, setIssueForm] = useState({
    citizenCivicId: 'CIV-DEMO-10001',
    docName: '',
    category: officerData.department || 'Transport (RTO)',
    refNo: ''
  });
  const [issueSuccess, setIssueSuccess] = useState(null);

  const handleIssueCredential = async (e) => {
    e.preventDefault();
    if (!issueForm.docName || !issueForm.citizenCivicId) return;

    setIssueSuccess({
      name: issueForm.docName,
      category: issueForm.category,
      refNo: issueForm.refNo || `GOVT-AUTH-${Math.floor(10000 + Math.random() * 90000)}`,
      status: "Verified",
      issuedAt: new Date().toLocaleTimeString()
    });
    setIssueForm({ citizenCivicId: 'CIV-DEMO-10001', docName: '', category: officerData.department, refNo: '' });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B1F3A', color: '#FFFFFF', fontFamily: 'var(--font-body)' }}>

      {/* OFFICER TOP HEADER BAR */}
      <header style={{
        backgroundColor: '#07152B',
        borderBottom: '1px solid #1E293B',
        padding: '16px 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1350px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#0B5ED7', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(11, 94, 215, 0.4)' }}>
              <Landmark size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                CivicOne Government Officer Portal
                <span style={{ fontSize: '0.65rem', backgroundColor: '#1E3A8A', color: '#60A5FA', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                  {officerData.roleTitle || 'LEVEL 1 OFFICER'}
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Authorized Supervision &amp; Department Administration
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onReturnHome}
              style={{
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowLeft size={14} /> Exit Officer Portal
            </button>
          </div>

        </div>
      </header>

      {/* WORKSPACE CONTENT */}
      <div style={{ maxWidth: '1350px', margin: '0 auto', padding: '32px 24px' }}>

        {/* OFFICER INFO & SECURITY BANNER (Requirements 8, 11) */}
        <div style={{ backgroundColor: '#162C4D', borderRadius: '20px', border: '1px solid #1E3A8A', padding: '28px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(96, 165, 250, 0.2)', color: '#60A5FA', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              <ShieldCheck size={14} /> AUTHORIZED GOVERNMENT OFFICER SESSION
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '2px', marginBottom: '6px', color: '#FFFFFF' }}>
              {officerData.name} ({officerData.officerId})
            </h1>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div>Department: <strong style={{ color: '#FEF08A' }}>{officerData.department}</strong></div>
              <div>State: <strong style={{ color: '#60A5FA' }}>{officerData.state}</strong></div>
              <div>Office: <strong style={{ color: '#FFFFFF' }}>{officerData.office}</strong></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ backgroundColor: '#0B192E', padding: '12px 18px', borderRadius: '12px', border: '1px solid #1E3A8A', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>Verification Status</div>
              <div style={{ fontSize: '0.85rem', color: '#4ADE80', fontWeight: 800, marginTop: '2px' }}>🟢 Verified Officer</div>
            </div>
            <div style={{ backgroundColor: '#0B192E', padding: '12px 18px', borderRadius: '12px', border: '1px solid #1E3A8A', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>Security Clearance</div>
              <div style={{ fontSize: '0.85rem', color: '#60A5FA', fontWeight: 800, marginTop: '2px' }}>🔒 Level-3 Security</div>
            </div>
          </div>
        </div>

        {/* STRICT LEAST-PRIVILEGE NOTICE (Requirements 11, 12) */}
        <div style={{ backgroundColor: '#1E1B4B', borderRadius: '16px', border: '1px solid #312E81', padding: '16px 20px', marginBottom: '28px', color: '#C7D2FE', fontSize: '0.825rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={20} color="#818CF8" style={{ flexShrink: 0 }} />
          <div>
            <strong>Strict Jurisdiction &amp; Purpose-Based Access Enforcement:</strong> Government Officers do NOT have unlimited access to personal citizen data. Viewing is strictly constrained by assigned Role, Department Jurisdiction, Purpose, and Authorization.
          </div>
        </div>

        {/* TAB BAR */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #1E3A8A', marginBottom: '24px', paddingBottom: '10px' }}>
          {[
            { id: 'dashboard', label: '📊 Department Dashboard' },
            { id: 'overview', label: '📈 Supervision Overview' },
            { id: 'organizations', label: '🏢 Organization Supervision' },
            { id: 'requests', label: '📋 Access Requests & Purpose Review' },
            { id: 'issue', label: '📜 Issue Official Digital Credential' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === t.id ? '#0B5ED7' : '#162C4D',
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

        {/* TAB 0: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>
              {officerData.department} Dashboard
            </h3>
            {officerData.department === 'Police' ? (
              <div style={{ backgroundColor: '#162C4D', borderRadius: '20px', padding: '24px', border: '1px solid #1E3A8A' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#60A5FA', marginBottom: '16px' }}>Active FIR Registry</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #1E3A8A', color: '#94A3B8', textAlign: 'left' }}>
                        <th style={{ padding: '12px', fontWeight: 800 }}>FIR ID</th>
                        <th style={{ padding: '12px', fontWeight: 800 }}>Date</th>
                        <th style={{ padding: '12px', fontWeight: 800 }}>Subject</th>
                        <th style={{ padding: '12px', fontWeight: 800 }}>Location</th>
                        <th style={{ padding: '12px', fontWeight: 800 }}>Status</th>
                        <th style={{ padding: '12px', fontWeight: 800 }}>Officer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEMO_POLICE_FIRS.map((fir, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #1E3A8A' }}>
                          <td style={{ padding: '12px', fontFamily: 'monospace', color: '#FEF08A', fontWeight: 700 }}>{fir.id}</td>
                          <td style={{ padding: '12px', color: '#94A3B8' }}>{fir.date}</td>
                          <td style={{ padding: '12px', color: '#FFFFFF', fontWeight: 700 }}>{fir.subject}</td>
                          <td style={{ padding: '12px', color: '#94A3B8' }}>{fir.location}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ 
                              backgroundColor: fir.status.includes('Pending') ? '#78350F' : '#064E3B', 
                              color: fir.status.includes('Pending') ? '#FEF08A' : '#34D399', 
                              padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 
                            }}>
                              {fir.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: '#60A5FA' }}>{fir.assignedOfficer}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div style={{ backgroundColor: '#162C4D', borderRadius: '20px', padding: '40px', border: '1px solid #1E3A8A', textAlign: 'center', color: '#94A3B8' }}>
                Dashboard data not available for this department type. Please select another tab.
              </div>
            )}
          </div>
        )}

        {/* TAB 1: OVERVIEW METRICS (Requirement 9) */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              <div style={{ backgroundColor: '#162C4D', padding: '20px', borderRadius: '16px', border: '1px solid #1E3A8A' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>Total Authorized Orgs</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#60A5FA', marginTop: '4px' }}>14</div>
                <div style={{ fontSize: '0.7rem', color: '#4ADE80', marginTop: '2px' }}>Under Jurisdiction</div>
              </div>

              <div style={{ backgroundColor: '#162C4D', padding: '20px', borderRadius: '16px', border: '1px solid #1E3A8A' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>Active Verification Requests</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FEF08A', marginTop: '4px' }}>8</div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>Live Processing</div>
              </div>

              <div style={{ backgroundColor: '#162C4D', padding: '20px', borderRadius: '16px', border: '1px solid #1E3A8A' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>Pending Requests</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F97316', marginTop: '4px' }}>3</div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>Awaiting Citizen Consent</div>
              </div>

              <div style={{ backgroundColor: '#162C4D', padding: '20px', borderRadius: '16px', border: '1px solid #1E3A8A' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>Completed Verifications</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#4ADE80', marginTop: '4px' }}>142</div>
                <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>Fully Audited</div>
              </div>

              <div style={{ backgroundColor: '#162C4D', padding: '20px', borderRadius: '16px', border: '1px solid #1E3A8A' }}>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>Suspicious Alerts</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#F87171', marginTop: '4px' }}>0</div>
                <div style={{ fontSize: '0.7rem', color: '#4ADE80', marginTop: '2px' }}>All Systems Nominal</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#162C4D', borderRadius: '20px', padding: '24px', border: '1px solid #1E3A8A' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>
                Recent Jurisdiction Supervision Log
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {accessRequests.map(r => (
                  <div key={r.id} style={{ backgroundColor: '#0B192E', padding: '14px', borderRadius: '12px', border: '1px solid #1E3A8A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#60A5FA' }}>{r.orgName} ({r.orgType})</div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                        Requested: {r.dataRequested} | Purpose: {r.purpose}
                      </div>
                    </div>
                    <span style={{ backgroundColor: '#064E3B', color: '#34D399', padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem' }}>
                      {r.accessLevel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORGANIZATION SUPERVISION (Requirement 10) */}
        {activeTab === 'organizations' && (
          <div style={{ backgroundColor: '#162C4D', borderRadius: '20px', padding: '28px', border: '1px solid #1E3A8A' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>
              Supervised Organizations under {officerData.department} ({officerData.state})
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1E3A8A', color: '#94A3B8' }}>
                  <th style={{ padding: '12px' }}>Organization Name</th>
                  <th style={{ padding: '12px' }}>Type</th>
                  <th style={{ padding: '12px' }}>State / Jurisdiction</th>
                  <th style={{ padding: '12px' }}>Verification Status</th>
                  <th style={{ padding: '12px' }}>Access Status</th>
                  <th style={{ padding: '12px' }}>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {supervisedOrgs.map(org => (
                  <tr key={org.id} style={{ borderBottom: '1px solid #1E3A8A' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 800, color: '#FFFFFF' }}>{org.name}</td>
                    <td style={{ padding: '14px 12px', color: '#60A5FA', fontWeight: 700 }}>{org.type}</td>
                    <td style={{ padding: '14px 12px', color: '#94A3B8' }}>{org.state} ({org.jurisdiction})</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ backgroundColor: '#064E3B', color: '#34D399', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem' }}>
                        {org.verificationStatus}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#4ADE80', fontWeight: 800 }}>● {org.accessStatus}</td>
                    <td style={{ padding: '14px 12px', color: '#94A3B8' }}>{org.lastActivity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: ACCESS REQUESTS SUPERVISION */}
        {activeTab === 'requests' && (
          <div style={{ backgroundColor: '#162C4D', borderRadius: '20px', padding: '28px', border: '1px solid #1E3A8A' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>
              Organization Access Request Audit Logs
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {accessRequests.map(r => (
                <div key={r.id} style={{ backgroundColor: '#0B192E', padding: '18px', borderRadius: '14px', border: '1px solid #1E3A8A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#FFFFFF' }}>{r.orgName} ({r.orgType})</div>
                    <div style={{ fontSize: '0.825rem', color: '#94A3B8', marginTop: '4px' }}>
                      Data Requested: <strong style={{ color: '#60A5FA' }}>{r.dataRequested}</strong>
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#94A3B8', marginTop: '2px' }}>
                      Purpose: <strong style={{ color: '#FEF08A' }}>{r.purpose}</strong> | Date: {r.dateTime}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ backgroundColor: r.status === 'Approved' ? '#064E3B' : '#78350F', color: r.status === 'Approved' ? '#34D399' : '#FEF08A', padding: '4px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', display: 'inline-block', marginBottom: '4px' }}>
                      {r.authorization}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: '#60A5FA', fontWeight: 700 }}>Scope: {r.accessLevel}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: ISSUE OFFICIAL DIGITAL CREDENTIAL */}
        {activeTab === 'issue' && (
          <div style={{ backgroundColor: '#162C4D', borderRadius: '20px', padding: '28px', border: '1px solid #1E3A8A', maxWidth: '640px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px' }}>
              Issue Official Signed Credential
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#94A3B8', marginBottom: '24px' }}>
              Directly inject cryptographically signed certificate from {officerData.department} into citizen's vault.
            </p>

            {issueSuccess && (
              <div style={{ backgroundColor: '#064E3B', color: '#A7F3D0', padding: '14px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, marginBottom: '20px' }}>
                ✓ Successfully issued <strong>{issueSuccess.name}</strong> (Ref: {issueSuccess.refNo}) to citizen vault!
              </div>
            )}

            <form onSubmit={handleIssueCredential}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  Citizen Civic ID
                </label>
                <input
                  type="text"
                  value={issueForm.citizenCivicId}
                  onChange={(e) => setIssueForm({ ...issueForm, citizenCivicId: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1E3A8A', backgroundColor: '#0B192E', color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700 }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  Certificate / Document Title
                </label>
                <input
                  type="text"
                  value={issueForm.docName}
                  onChange={(e) => setIssueForm({ ...issueForm, docName: e.target.value })}
                  placeholder="e.g. Commercial Fitness Clearance / Land Registration Record"
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1E3A8A', backgroundColor: '#0B192E', color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700 }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#60A5FA', marginBottom: '6px' }}>
                  Official Reference Number
                </label>
                <input
                  type="text"
                  value={issueForm.refNo}
                  onChange={(e) => setIssueForm({ ...issueForm, refNo: e.target.value })}
                  placeholder="e.g. RTO-FIT-904812"
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #1E3A8A', backgroundColor: '#0B192E', color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 700 }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#0B5ED7',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Sign &amp; Inject Digital Certificate to Vault 📜
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
