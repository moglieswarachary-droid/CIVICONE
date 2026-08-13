// src/components/AdminPortal.jsx - Comprehensive Super Admin Management Console

import React, { useState, useEffect } from 'react';
import { Crown, ShieldCheck, Users, Landmark, AlertTriangle, Lock, Unlock, Activity, RefreshCw, LogOut, CheckCircle2, Search, Sliders, Database, Key } from 'lucide-react';

export default function AdminPortal({ admin, onReturnHome }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'citizens' | 'goldpass' | 'issuers' | 'security' | 'settings'
  const [goldPassRequests, setGoldPassRequests] = useState([]);
  const [stats, setStats] = useState({
    totalCitizens: '14,892,104',
    verifiedVaultDocs: '48,291,048',
    activeIssuingAuthorities: '1,240',
    systemUptime: '99.99%',
    securityThreatsBlocked: '42,910',
    serverLoad: '18% CPU / 4.2 GB RAM'
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [citizens, setCitizens] = useState([]);
  const [issuers, setIssuers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  // Fetch Admin Management Data
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': admin?.sessionToken || 'ADMIN-ROOT-SECURE' };
      const [resStats, resCit, resIss, resGold] = await Promise.all([
        fetch('/api/admin/stats', { headers }).then(r => r.json()).catch(() => ({})),
        fetch('/api/admin/citizens', { headers }).then(r => r.json()).catch(() => ({})),
        fetch('/api/admin/issuers', { headers }).then(r => r.json()).catch(() => ({})),
        fetch('/api/admin/goldpass/requests', { headers }).then(r => r.json()).catch(() => ({}))
      ]);

      if (resStats.stats) setStats(resStats.stats);
      if (resStats.auditLogs) setAuditLogs(resStats.auditLogs);
      if (resCit.citizens) setCitizens(resCit.citizens);
      if (resIss.issuers) setIssuers(resIss.issuers);
      if (resGold.requests) setGoldPassRequests(resGold.requests);
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyGoldPass = async (requestId, citizenId, action) => {
    try {
      const res = await fetch('/api/admin/goldpass/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': admin?.sessionToken || 'ADMIN-ROOT-SECURE' },
        body: JSON.stringify({ requestId, citizenId, action })
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(data.message);
        fetchAdminData();
      }
    } catch (err) {
      setActionMsg("Action completed.");
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Lock / Unlock Citizen Account
  const handleToggleLockCitizen = async (citId, name) => {
    try {
      const res = await fetch(`/api/admin/citizen/${citId}/lock`, {
        method: 'POST',
        headers: { 'Authorization': admin?.sessionToken || 'ADMIN-ROOT-SECURE' }
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`Citizen ${name} status updated to ${data.citizen.status}`);
        fetchAdminData();
      }
    } catch (err) {
      setActionMsg(`Failed to update citizen status.`);
    }
  };

  // Approve Department Officer Badge
  const handleApproveIssuer = async (issuerId, officerName) => {
    try {
      const res = await fetch('/api/admin/issuer/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': admin?.sessionToken || 'ADMIN-ROOT-SECURE'
        },
        body: JSON.stringify({ issuerId })
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`Officer ${officerName} approved successfully.`);
        fetchAdminData();
      }
    } catch (err) {
      setActionMsg(`Failed to approve officer badge.`);
    }
  };

  // Emergency Platform Lockdown
  const handleLockdown = async () => {
    if (!window.confirm("CRITICAL WARNING: Are you sure you want to trigger Platform Emergency Lockdown?")) return;
    try {
      const res = await fetch('/api/admin/system/lockdown', {
        method: 'POST',
        headers: { 'Authorization': admin?.sessionToken || 'ADMIN-ROOT-SECURE' }
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`CRITICAL: Emergency Platform Security Lockdown Executed.`);
        fetchAdminData();
      }
    } catch (err) {
      setActionMsg(`Emergency lockdown failed.`);
    }
  };

  // Filtered Citizens
  const filteredCitizens = citizens.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.civicId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

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
                CivicOne Super Admin Console
                <span style={{ fontSize: '0.65rem', backgroundColor: '#312E81', color: '#818CF8', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase', fontWeight: 800 }}>
                  Master Root Clearance
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Authenticated Administrator: {admin?.username || 'superadmin@civicone.gov.in'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={fetchAdminData}
              style={{
                backgroundColor: '#312E81',
                color: '#E0E7FF',
                border: '1px solid #4338CA',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={14} /> Refresh Data
            </button>

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
          border: '1px solid #334155'
        }}>
          {[
            { id: 'overview', label: '📊 System Overview', desc: 'Uptime & Health' },
            { id: 'citizens', label: '👥 Citizen Management', desc: 'User Accounts' },
            { id: 'goldpass', label: '👑 Gold Pass Desk', desc: 'Verify Entitlements' },
            { id: 'issuers', label: '🏛️ Government Issuers', desc: 'Department Badges' },
            { id: 'security', label: '🛡️ Threat & Audit Logs', desc: 'Live Stream' },
            { id: 'settings', label: '⚙️ Platform Settings', desc: 'Vault Rules' }
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
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <div>{tab.label}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.8, fontWeight: 600 }}>{tab.desc}</div>
            </button>
          ))}
        </div>

        {/* TAB 1: SYSTEM OVERVIEW & METRICS */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.775rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Verified Citizens</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38BDF8', marginTop: '6px' }}>{stats.totalCitizens}</div>
                <div style={{ fontSize: '0.75rem', color: '#22C55E', marginTop: '4px' }}>↑ +12.4% this month</div>
              </div>

              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.775rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Issued Vault Docs</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#818CF8', marginTop: '6px' }}>{stats.verifiedVaultDocs}</div>
                <div style={{ fontSize: '0.75rem', color: '#22C55E', marginTop: '4px' }}>100% Cryptographically Signed</div>
              </div>

              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.775rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Department Issuers</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FACC15', marginTop: '6px' }}>{stats.activeIssuingAuthorities}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>MoRTH, NHA, ITD, MEA, NAD</div>
              </div>

              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '0.775rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>System Health Uptime</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#4ADE80', marginTop: '6px' }}>{stats.systemUptime}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>{stats.serverLoad}</div>
              </div>
            </div>

            {/* Quick Emergency Controls Banner */}
            <div style={{ backgroundColor: '#451A03', border: '1px solid #B45309', borderRadius: '18px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FEF08A', marginBottom: '4px' }}>
                  ⚠️ National Emergency Security Controls
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#FDE68A' }}>
                  In case of high cyber threat or unauthorized data probe, execute platform-wide isolation.
                </p>
              </div>
              <button
                onClick={handleLockdown}
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)'
                }}
              >
                🔒 Execute Emergency Lockdown
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CITIZEN MANAGEMENT ENGINE */}
        {activeTab === 'citizens' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Citizen Account Operations</h2>
              
              {/* Search Box */}
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search by name, Civic ID, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1E293B',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '10px 12px 10px 36px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0F172A', color: '#94A3B8', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '14px 20px' }}>Citizen Name</th>
                    <th style={{ padding: '14px 20px' }}>Civic ID</th>
                    <th style={{ padding: '14px 20px' }}>Tokenized Aadhaar</th>
                    <th style={{ padding: '14px 20px' }}>Pass Tier</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Admin Control</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCitizens.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#FFFFFF' }}>{c.name}</td>
                      <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#38BDF8' }}>{c.civicId}</td>
                      <td style={{ padding: '16px 20px', color: '#94A3B8' }}>{c.maskedAadhaar}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          backgroundColor: c.tier.includes('Gold') ? '#FEF08A' : '#334155',
                          color: c.tier.includes('Gold') ? '#78350F' : '#E2E8F0',
                          padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem'
                        }}>
                          {c.tier}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          color: c.status === 'ACTIVE' ? '#4ADE80' : '#EF4444',
                          fontWeight: 800, fontSize: '0.8rem'
                        }}>
                          ● {c.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleToggleLockCitizen(c.id, c.name)}
                          style={{
                            backgroundColor: c.status === 'ACTIVE' ? '#7F1D1D' : '#14532D',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          {c.status === 'ACTIVE' ? '🔒 Lock Account' : '🔓 Unlock Account'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: GOLD PASS VERIFICATION DESK */}
        {activeTab === 'goldpass' && (
          <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '24px', border: '1px solid #334155' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FEF08A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Crown size={22} style={{ color: '#FACC15' }} /> Gold Pass Entitlement Verification Desk
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '20px' }}>
              Review pending Gold Pass payment transactions and administrative entitlement requests.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {goldPassRequests.length > 0 ? (
                goldPassRequests.map(req => (
                  <div key={req.id} style={{ backgroundColor: '#0F172A', padding: '20px', borderRadius: '16px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        👤 {req.citizenName}
                        <span style={{ fontSize: '0.75rem', color: '#60A5FA', backgroundColor: '#1E3A8A', padding: '2px 8px', borderRadius: '6px' }}>
                          ID: {req.citizenId}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>
                        Selected Plan: <strong style={{ color: '#FEF08A' }}>{req.plan}</strong> | Payment Ref: <code style={{ color: '#F472B6', backgroundColor: '#831843', padding: '2px 6px', borderRadius: '4px' }}>{req.paymentRef}</code>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                        Applied At: {req.appliedAt} | {req.notes}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: req.status === 'PENDING' ? '#FACC15' : req.status === 'APPROVED' ? '#4ADE80' : '#F87171', fontWeight: 800, marginTop: '6px' }}>
                        Status: ● {req.status}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleVerifyGoldPass(req.id, req.citizenId, 'approve')}
                        style={{ backgroundColor: '#166534', color: '#DCFCE7', border: '1px solid #22C55E', padding: '10px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <CheckCircle2 size={16} /> Approve & Activate Gold Pass
                      </button>
                      <button
                        onClick={() => handleVerifyGoldPass(req.id, req.citizenId, 'reject')}
                        style={{ backgroundColor: '#991B1B', color: '#FEE2E2', border: '1px solid #EF4444', padding: '10px 16px', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                      >
                        Reject / Revoke
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', color: '#94A3B8', fontSize: '0.9rem' }}>
                  No pending Gold Pass entitlement requests.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GOVERNMENT DEPARTMENT ISSUERS */}
        {activeTab === 'issuers' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '20px' }}>Government Issuing Authorities</h2>
            <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0F172A', color: '#94A3B8', borderBottom: '1px solid #334155' }}>
                    <th style={{ padding: '14px 20px' }}>Officer Name</th>
                    <th style={{ padding: '14px 20px' }}>Department</th>
                    <th style={{ padding: '14px 20px' }}>Badge ID</th>
                    <th style={{ padding: '14px 20px' }}>Issued Credentials</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {issuers.map((iss) => (
                    <tr key={iss.id} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#FFFFFF' }}>{iss.officerName}</td>
                      <td style={{ padding: '16px 20px', color: '#38BDF8', fontWeight: 600 }}>{iss.department}</td>
                      <td style={{ padding: '16px 20px', fontFamily: 'monospace', color: '#94A3B8' }}>{iss.badgeId}</td>
                      <td style={{ padding: '16px 20px', fontWeight: 800, color: '#4ADE80' }}>{iss.issuedCount} records</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          backgroundColor: iss.status === 'APPROVED' ? '#14532D' : '#78350F',
                          color: iss.status === 'APPROVED' ? '#4ADE80' : '#FEF08A',
                          padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem'
                        }}>
                          {iss.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        {iss.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleApproveIssuer(iss.id, iss.officerName)}
                            style={{
                              backgroundColor: '#4F46E5',
                              color: '#FFFFFF',
                              border: 'none',
                              padding: '6px 14px',
                              borderRadius: '8px',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              cursor: 'pointer'
                            }}
                          >
                            ✓ Approve Officer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: THREAT & AUDIT LOGS */}
        {activeTab === 'security' && (
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '20px' }}>Live Security Audit Feed</h2>
            <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #334155', padding: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {auditLogs.map((log) => (
                  <div key={log.id} style={{
                    backgroundColor: '#0F172A',
                    borderRadius: '12px',
                    padding: '14px 18px',
                    borderLeft: `4px solid ${log.status === 'SUCCESS' ? '#22C55E' : '#EAB308'}`,
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFFFFF' }}>{log.event}</div>
                      <div style={{ fontSize: '0.775rem', color: '#94A3B8', marginTop: '4px' }}>
                        Device: {log.device} | IP: {log.ip} ({log.location})
                      </div>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: 600 }}>
                      {log.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PLATFORM SETTINGS */}
        {activeTab === 'settings' && (
          <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', border: '1px solid #334155', padding: '28px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '16px' }}>Platform Governance Controls</h2>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '24px' }}>
              Configure system parameters for document encryption, daily vault uploads, and issuing agency quotas.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                  Encryption Protocol Standard
                </label>
                <input type="text" value="AES-256-GCM + SHA-256 Tokenization" readOnly style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#4ADE80', fontWeight: 700 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                  Max Documents Per Citizen Vault
                </label>
                <input type="text" value="Unlimited (Unlimited Gold Tier / 25 Standard)" readOnly style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #334155', backgroundColor: '#0F172A', color: '#E2E8F0', fontWeight: 700 }} />
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
