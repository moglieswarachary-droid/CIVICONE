// src/components/AdminPortal.jsx - Comprehensive Super Admin Supervision Console (Private Platform Control)

import React, { useState, useEffect } from 'react';
import { Crown, ShieldCheck, Users, Landmark, AlertTriangle, Lock, Unlock, Activity, RefreshCw, LogOut, CheckCircle2, Search, Sliders, Database, Key, Building2, Eye, ShieldAlert, FileText } from 'lucide-react';
import { DEMO_GOVERNMENT_OFFICERS, DEMO_GLOBAL_ACCESS_LOGS, ROLE_PERMISSION_MATRIX, PRIVATE_ORG_TYPES, GOVERNMENT_DEPARTMENTS } from '../data/mockData.js';

export default function AdminPortal({ admin, onReturnHome }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'organizations' | 'officers' | 'global_access' | 'citizens' | 'matrix' | 'security'
  const [stats, setStats] = useState({
    totalCitizens: '14,892,104',
    totalOrganizations: '1,240',
    totalGovtOfficers: '4,890',
    activeSessions: '28,910',
    pendingVerifications: '142',
    activeConsents: '48,910',
    expiredConsents: '12,400',
    securityAlerts: '0'
  });

  const [govtOfficers, setGovtOfficers] = useState(DEMO_GOVERNMENT_OFFICERS);
  const [globalAccessLogs, setGlobalAccessLogs] = useState(DEMO_GLOBAL_ACCESS_LOGS);
  const [citizens, setCitizens] = useState([
    { id: 'cit-1', name: 'Aarav Kumar', civicId: 'CIV-DEMO-10001', maskedAadhaar: 'XXXX XXXX 1001', tier: 'STANDARD', status: 'ACTIVE' },
    { id: 'cit-2', name: 'Priya Sharma', civicId: 'CIV-DEMO-10002', maskedAadhaar: 'XXXX XXXX 1002', tier: 'GOLD', status: 'ACTIVE' },
    { id: 'cit-3', name: 'Rajesh Patel', civicId: 'CIV-DEMO-10003', maskedAadhaar: 'XXXX XXXX 1003', tier: 'STANDARD', status: 'ACTIVE' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const handleToggleOfficerStatus = (id, name) => {
    setGovtOfficers(prev => prev.map(o => {
      if (o.id === id) {
        const newStatus = o.status === 'APPROVED' ? 'DISABLED' : 'APPROVED';
        setActionMsg(`Officer ${name} status updated to ${newStatus}`);
        return { ...o, status: newStatus };
      }
      return o;
    }));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: '#F8FAFC', fontFamily: 'var(--font-body)' }}>

      {/* SUPER ADMIN HEADER BAR */}
      <header style={{
        backgroundColor: '#1E1B4B',
        borderBottom: '1px solid #312E81',
        padding: '16px 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              backgroundColor: '#4F46E5', color: '#FEF08A',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)'
            }}>
              <Crown size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                CivicOne Super Admin Supervision Console
                <span style={{ fontSize: '0.65rem', backgroundColor: '#312E81', color: '#818CF8', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase', fontWeight: 800 }}>
                  Master Root Clearance
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Authenticated Master Administrator: {admin?.username || 'superadmin@civicone.gov.in'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onReturnHome}
              style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={14} /> Exit Admin Console
            </button>
          </div>

        </div>
      </header>

      {/* SYSTEM ACTION TOAST */}
      {actionMsg && (
        <div style={{
          backgroundColor: '#312E81',
          borderBottom: '1px solid #4F46E5',
          padding: '10px 24px',
          textAlign: 'center',
          color: '#FEF08A',
          fontSize: '0.85rem',
          fontWeight: 800,
          display: 'flex',
          justify: 'center',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} /> {actionMsg}
        </div>
      )}

      {/* MAIN ADMIN WORKSPACE */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ADMIN TAB NAVIGATION BAR */}
        <div style={{
          display: 'flex',
          gap: '8px',
          backgroundColor: '#1E293B',
          padding: '6px',
          borderRadius: '14px',
          marginBottom: '28px',
          border: '1px solid #334155',
          overflowX: 'auto'
        }}>
          {[
            { id: 'overview', label: '📊 System Overview' },
            { id: 'organizations', label: '🏢 Organization Supervision' },
            { id: 'officers', label: '🏛️ Government Officer Supervision' },
            { id: 'global_access', label: '🌐 Global Access Monitor' },
            { id: 'citizens', label: '👥 Citizen Accounts' },
            { id: 'matrix', label: '🛡️ Role Permission Matrix' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#4F46E5' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : '#94A3B8',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: SYSTEM OVERVIEW & METRICS (Requirement 26) */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.775rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Total Citizens</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38BDF8', marginTop: '6px' }}>{stats.totalCitizens}</div>
                <div style={{ fontSize: '0.75rem', color: '#22C55E', marginTop: '4px' }}>Verified Digital Identities</div>
              </div>

              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.775rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Registered Organizations</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#818CF8', marginTop: '6px' }}>{stats.totalOrganizations}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>Across 36 States &amp; UTs</div>
              </div>

              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.775rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Government Officers</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FACC15', marginTop: '6px' }}>{stats.totalGovtOfficers}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>Levels 1 to 4 Authorized</div>
              </div>

              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.775rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Active Consents</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#4ADE80', marginTop: '6px' }}>{stats.activeConsents}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>Purpose-Bound Active Locks</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '12px' }}>
                Master Root Platform Supervision Notice
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.6 }}>
                CivicOne Super Admin maintains platform-level infrastructure oversight, organization permissions, and government officer role assignments. Personal citizen vault data remains cryptographically protected and is not exposed in plaintext.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: SUPER ADMIN ORGANIZATION SUPERVISION (Requirement 27) */}
        {activeTab === 'organizations' && (
          <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '28px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>
              Platform Registered Organizations Supervision
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                  <th style={{ padding: '12px' }}>Organization</th>
                  <th style={{ padding: '12px' }}>Type</th>
                  <th style={{ padding: '12px' }}>State / Jurisdiction</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Verified</th>
                  <th style={{ padding: '12px' }}>Access Level</th>
                </tr>
              </thead>
              <tbody>
                {[...PRIVATE_ORG_TYPES, ...GOVERNMENT_DEPARTMENTS].map(org => (
                  <tr key={org.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 800, color: '#FFFFFF' }}>CivicOne Demo {org.name}</td>
                    <td style={{ padding: '14px 12px', color: org.color, fontWeight: 700 }}>{org.name}</td>
                    <td style={{ padding: '14px 12px', color: '#94A3B8' }}>All 36 States &amp; UTs</td>
                    <td style={{ padding: '14px 12px', color: '#4ADE80', fontWeight: 800 }}>● ACTIVE</td>
                    <td style={{ padding: '14px 12px', color: '#38BDF8', fontWeight: 700 }}>✓ Verified Org</td>
                    <td style={{ padding: '14px 12px', color: '#FEF08A', fontWeight: 700 }}>{org.roleCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: GOVERNMENT OFFICER SUPERVISION (Requirement 28) */}
        {activeTab === 'officers' && (
          <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '28px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>
              Government Officer Administration &amp; Supervision
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                  <th style={{ padding: '12px' }}>Officer Name &amp; ID</th>
                  <th style={{ padding: '12px' }}>Department</th>
                  <th style={{ padding: '12px' }}>State &amp; Office</th>
                  <th style={{ padding: '12px' }}>Hierarchy Role Level</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Admin Actions</th>
                </tr>
              </thead>
              <tbody>
                {govtOfficers.map(off => (
                  <tr key={off.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '14px 12px' }}>
                      <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{off.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontFamily: 'monospace' }}>{off.officerId}</div>
                    </td>
                    <td style={{ padding: '14px 12px', color: '#FEF08A', fontWeight: 700 }}>{off.department}</td>
                    <td style={{ padding: '14px 12px', color: '#94A3B8' }}>{off.state} ({off.office})</td>
                    <td style={{ padding: '14px 12px', color: '#818CF8', fontWeight: 800 }}>{off.roleTitle}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ backgroundColor: off.status === 'APPROVED' ? '#14532D' : '#7F1D1D', color: off.status === 'APPROVED' ? '#4ADE80' : '#EF4444', padding: '2px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem' }}>
                        {off.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleOfficerStatus(off.id, off.name)}
                        style={{
                          backgroundColor: off.status === 'APPROVED' ? '#991B1B' : '#166534',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        {off.status === 'APPROVED' ? 'Disable Account' : 'Enable Account'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: GLOBAL ACCESS MONITOR (Requirement 29) */}
        {activeTab === 'global_access' && (
          <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '28px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>
              GLOBAL ACCESS MONITOR — Platform-Wide Event Stream
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {globalAccessLogs.map(log => (
                <div key={log.id} style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '14px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#38BDF8', fontSize: '0.9rem' }}>
                      {log.timestamp} — {log.organization} ({log.state})
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#FFFFFF', marginTop: '4px' }}>
                      Requested: <strong>{log.requestedData}</strong> | Purpose: {log.purpose}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
                      Citizen ID: <code style={{ color: '#FEF08A' }}>{log.citizenId}</code>
                    </div>
                  </div>

                  <span style={{ backgroundColor: '#064E3B', color: '#34D399', padding: '4px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem' }}>
                    {log.accessType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CITIZEN ACCOUNTS */}
        {activeTab === 'citizens' && (
          <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '28px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>
              Registered Citizen Accounts Overview
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                  <th style={{ padding: '12px' }}>Citizen Name</th>
                  <th style={{ padding: '12px' }}>Civic ID</th>
                  <th style={{ padding: '12px' }}>Tokenized Aadhaar</th>
                  <th style={{ padding: '12px' }}>Tier</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {citizens.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 800, color: '#FFFFFF' }}>{c.name}</td>
                    <td style={{ padding: '14px 12px', color: '#38BDF8', fontFamily: 'monospace' }}>{c.civicId}</td>
                    <td style={{ padding: '14px 12px', color: '#94A3B8' }}>{c.maskedAadhaar}</td>
                    <td style={{ padding: '14px 12px', color: c.tier === 'GOLD' ? '#FEF08A' : '#FFFFFF', fontWeight: 800 }}>{c.tier}</td>
                    <td style={{ padding: '14px 12px', color: '#4ADE80', fontWeight: 800 }}>● {c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: ROLE PERMISSION MATRIX (Requirement 31) */}
        {activeTab === 'matrix' && (
          <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '28px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px' }}>
              Backend Enforced Role Permission Matrix
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '20px' }}>
              Strict RBAC authorization rules enforced at backend REST API layer.
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                  <th style={{ padding: '12px' }}>Role</th>
                  <th style={{ padding: '12px' }}>Citizen Data Scope</th>
                  <th style={{ padding: '12px' }}>Organization Mgmt</th>
                  <th style={{ padding: '12px' }}>Officer Mgmt</th>
                  <th style={{ padding: '12px' }}>Platform Mgmt</th>
                </tr>
              </thead>
              <tbody>
                {ROLE_PERMISSION_MATRIX.map((m, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '14px 12px', fontWeight: 900, color: '#FFFFFF' }}>{m.role}</td>
                    <td style={{ padding: '14px 12px', color: '#38BDF8', fontWeight: 700 }}>{m.citizenData}</td>
                    <td style={{ padding: '14px 12px', color: '#FEF08A' }}>{m.orgMgmt}</td>
                    <td style={{ padding: '14px 12px', color: '#94A3B8' }}>{m.officerMgmt}</td>
                    <td style={{ padding: '14px 12px', color: m.platformMgmt === 'Full Control' ? '#4ADE80' : '#94A3B8', fontWeight: 800 }}>{m.platformMgmt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
