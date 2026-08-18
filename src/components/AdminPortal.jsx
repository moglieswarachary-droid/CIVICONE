// src/components/AdminPortal.jsx - Comprehensive Super Admin Supervision Console (Private Platform Control)

import React, { useState, useEffect } from 'react';
import { 
  Crown, ShieldCheck, Users, Landmark, AlertTriangle, Lock, Unlock, 
  Activity, RefreshCw, LogOut, CheckCircle2, Search, Sliders, Database, 
  Key, Building2, Eye, ShieldAlert, FileText, Server, HardDrive, Cpu, 
  Clock, ArrowUpRight, Filter, ChevronRight, CheckCircle, AlertCircle, XCircle, FileCode, ExternalLink
} from 'lucide-react';
import { 
  DEMO_GOVERNMENT_OFFICERS, 
  DEMO_GLOBAL_ACCESS_LOGS, 
  ROLE_PERMISSION_MATRIX, 
  PRIVATE_ORG_TYPES, 
  GOVERNMENT_DEPARTMENTS,
  DEMO_ALL_DEPARTMENT_PROCESSES,
  DEMO_WEBSITE_USAGE_STATS
} from '../data/mockData.js';

export default function AdminPortal({ admin, onReturnHome }) {
  // Tabs: 'overview' | 'usage_analytics' | 'department_processes' | 'organizations' | 'officers' | 'global_access' | 'citizens' | 'matrix'
  const [activeTab, setActiveTab] = useState('usage_analytics');
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

  const [usageTelemetry, setUsageTelemetry] = useState(DEMO_WEBSITE_USAGE_STATS);
  const [departmentProcesses, setDepartmentProcesses] = useState(DEMO_ALL_DEPARTMENT_PROCESSES);
  const [govtOfficers, setGovtOfficers] = useState(DEMO_GOVERNMENT_OFFICERS);
  const [globalAccessLogs, setGlobalAccessLogs] = useState(DEMO_GLOBAL_ACCESS_LOGS);
  const [citizens, setCitizens] = useState([
    { id: 'cit-1', name: 'Aarav Kumar', civicId: 'CIV-DEMO-10001', maskedAadhaar: 'XXXX XXXX 1001', tier: 'STANDARD', status: 'ACTIVE' },
    { id: 'cit-2', name: 'Priya Sharma', civicId: 'CIV-DEMO-10002', maskedAadhaar: 'XXXX XXXX 1002', tier: 'GOLD', status: 'ACTIVE' },
    { id: 'cit-3', name: 'Rajesh Patel', civicId: 'CIV-DEMO-10003', maskedAadhaar: 'XXXX XXXX 1003', tier: 'STANDARD', status: 'ACTIVE' }
  ]);

  // Filtering states for Cross-Department Process Pipeline
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [selectedSectorFilter, setSelectedSectorFilter] = useState('ALL');
  const [processSearchQuery, setProcessSearchQuery] = useState('');

  // Audit Trace Inspection Modal
  const [selectedAuditProcess, setSelectedAuditProcess] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  // Fetch telemetry & process pipeline from REST API if available
  useEffect(() => {
    fetch('/api/admin/usage-stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setUsageTelemetry(data.stats);
        }
      })
      .catch(() => console.log('Using local fallback telemetry metrics.'));

    fetch('/api/admin/department-processes')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.processes) {
          setDepartmentProcesses(data.processes);
        }
      })
      .catch(() => console.log('Using local fallback department processes.'));
  }, []);

  // Filter processes based on department, status, sector, and search query
  const filteredProcesses = departmentProcesses.filter(proc => {
    if (selectedDeptFilter !== 'ALL' && proc.deptCode !== selectedDeptFilter && !proc.department.toLowerCase().includes(selectedDeptFilter.toLowerCase())) {
      return false;
    }
    if (selectedStatusFilter !== 'ALL' && proc.status !== selectedStatusFilter) {
      return false;
    }
    if (selectedSectorFilter !== 'ALL' && proc.sector.toLowerCase() !== selectedSectorFilter.toLowerCase()) {
      return false;
    }
    if (processSearchQuery.trim()) {
      const q = processSearchQuery.toLowerCase();
      const match = (
        proc.id.toLowerCase().includes(q) ||
        proc.title.toLowerCase().includes(q) ||
        proc.citizenName.toLowerCase().includes(q) ||
        proc.civicId.toLowerCase().includes(q) ||
        proc.department.toLowerCase().includes(q) ||
        proc.requestedDoc.toLowerCase().includes(q)
      );
      if (!match) return false;
    }
    return true;
  });

  // Handle Admin Process Actions (Approve, Flag, Override)
  const handleProcessAction = (processId, action) => {
    // Try calling backend REST API
    fetch('/api/admin/process/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ processId, action, notes: 'Super Admin Supervision Action' })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.process) {
        setDepartmentProcesses(prev => prev.map(p => p.id === processId ? data.process : p));
        setActionMsg(`Process ${processId} status updated: ${action}`);
      }
    })
    .catch(() => {
      // Local Fallback State Update
      setDepartmentProcesses(prev => prev.map(p => {
        if (p.id === processId) {
          const newStatus = action === 'APPROVE' ? 'VERIFIED_SUCCESS' : action === 'FLAG' ? 'FLAGGED_REVIEW' : 'DOCUMENT_ISSUED';
          return {
            ...p,
            status: newStatus,
            slaDeadline: action === 'APPROVE' ? 'Completed (Admin Approved)' : action === 'FLAG' ? 'Flagged for Audit' : 'Completed (Override)',
            verificationTrace: [
              { step: `Super Admin Master Action: ${action}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), actor: "National Super Admin" },
              ...p.verificationTrace
            ]
          };
        }
        return p;
      }));
      setActionMsg(`Process ${processId} status updated: ${action}`);
    });
  };

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
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
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
                CivicOne Super Admin &amp; National Authority Portal
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
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} /> {actionMsg}
        </div>
      )}

      {/* MAIN ADMIN WORKSPACE */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '32px 24px' }}>

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
            { id: 'usage_analytics', label: '📈 Website Usage & Telemetry' },
            { id: 'department_processes', label: '🏛️ Cross-Department Processes' },
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

        {/* TAB 1: WEBSITE USAGE & INFRASTRUCTURE TELEMETRY */}
        {activeTab === 'usage_analytics' && (
          <div>
            {/* Top Telemetry KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              
              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Active Users Now</div>
                  <Activity size={18} color="#38BDF8" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#38BDF8', marginTop: '6px' }}>{usageTelemetry.activeUsersNow}</div>
                <div style={{ fontSize: '0.75rem', color: '#22C55E', marginTop: '4px' }}>● Live Sessions Active</div>
              </div>

              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Requests Today</div>
                  <Server size={18} color="#818CF8" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#818CF8', marginTop: '6px' }}>{usageTelemetry.totalRequestsToday}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>{usageTelemetry.requestsPerMinute}</div>
              </div>

              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Avg API Latency</div>
                  <Clock size={18} color="#4ADE80" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#4ADE80', marginTop: '6px' }}>{usageTelemetry.averageLatencyMs}</div>
                <div style={{ fontSize: '0.75rem', color: '#22C55E', marginTop: '4px' }}>System Uptime: {usageTelemetry.uptimePercentage}</div>
              </div>

              <div style={{ backgroundColor: '#1E293B', padding: '20px', borderRadius: '16px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>Vault Storage</div>
                  <HardDrive size={18} color="#FACC15" />
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#FACC15', marginTop: '6px' }}>{usageTelemetry.vaultStorageUsage}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>Encrypted Vault Storage</div>
              </div>

            </div>

            {/* Infrastructure Microservice Health Grid */}
            <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '24px', border: '1px solid #334155', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={20} color="#38BDF8" /> Core System Microservice Health
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '14px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF' }}>Express Platform API Gateway</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>{usageTelemetry.expressGatewayStatus}</div>
                  </div>
                  <span style={{ backgroundColor: '#064E3B', color: '#34D399', padding: '4px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem' }}>HEALTHY</span>
                </div>

                <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '14px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF' }}>Python Security &amp; Auth Engine</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>{usageTelemetry.pythonAuthEngineStatus}</div>
                  </div>
                  <span style={{ backgroundColor: '#064E3B', color: '#34D399', padding: '4px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem' }}>HEALTHY</span>
                </div>

                <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '14px', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FFFFFF' }}>UIDAI Tokenized ADV Engine</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>{usageTelemetry.uidaiTokenizerStatus}</div>
                  </div>
                  <span style={{ backgroundColor: '#064E3B', color: '#34D399', padding: '4px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem' }}>ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Department Traffic Distribution & Device Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '28px' }}>
              
              {/* Department Traffic Breakdown */}
              <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '24px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>
                  Sector &amp; Department Website Usage Distribution
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {usageTelemetry.sectorTrafficDistribution?.map((sec, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 800, color: '#FFFFFF' }}>{sec.sector}</span>
                        <span style={{ color: '#94A3B8' }}>{sec.count} reqs ({sec.percentage}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '10px', backgroundColor: '#0F172A', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ width: `${sec.percentage}%`, height: '100%', backgroundColor: sec.color, borderRadius: '6px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* State-by-State Usage Table */}
              <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '24px', border: '1px solid #334155' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '16px' }}>
                  Top Indian States &amp; UTs Traffic Ranking
                </h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                      <th style={{ padding: '8px' }}>State / UT</th>
                      <th style={{ padding: '8px' }}>Active Users</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Total Requests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageTelemetry.topStatesByUsage?.map((st, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #334155' }}>
                        <td style={{ padding: '10px 8px', fontWeight: 800, color: '#FFFFFF' }}>{st.state}</td>
                        <td style={{ padding: '10px 8px', color: '#38BDF8', fontWeight: 700 }}>{st.activeUsers}</td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', color: '#FEF08A', fontWeight: 700 }}>{st.requests}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: CROSS-DEPARTMENT PROCESS PIPELINE MONITOR */}
        {activeTab === 'department_processes' && (
          <div style={{ backgroundColor: '#1E293B', borderRadius: '20px', padding: '28px', border: '1px solid #334155' }}>
            
            {/* Header & Controls Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
                  🏛️ Cross-Department Process Supervision Pipeline
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
                  Monitor and manage real-time active processes from ALL government departments, education boards, health portals, banks, and telecom vendors across 36 States &amp; UTs.
                </p>
              </div>

              {/* Filters Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                
                {/* Search Bar */}
                <div style={{ position: 'relative' }}>
                  <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={processSearchQuery}
                    onChange={(e) => setProcessSearchQuery(e.target.value)}
                    placeholder="Search Process ID, Title, Citizen, Dept..."
                    style={{
                      width: '100%',
                      backgroundColor: '#0F172A',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      padding: '10px 12px 10px 36px',
                      color: '#FFFFFF',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Department Dropdown Filter */}
                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  style={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="ALL">All Departments (10+)</option>
                  <option value="DEPT-RTO">Parivahan Sewa (RTO)</option>
                  <option value="DEPT-PASS">Passport Seva (MEA)</option>
                  <option value="DEPT-POLICE">Police Department (Home)</option>
                  <option value="DEPT-HEDU">Higher Education &amp; UGC</option>
                  <option value="DEPT-HLTH">Health &amp; ABHA (MoHFW)</option>
                  <option value="DEPT-REV">Revenue &amp; Tax Dept</option>
                  <option value="BANK-01">Banking &amp; Financial (RBI)</option>
                  <option value="MOBILE-01">Telecom &amp; SIM (DoT)</option>
                </select>

                {/* Status Filter */}
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  style={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="ALL">All Process Statuses</option>
                  <option value="PENDING_APPROVAL">Pending Officer Seal</option>
                  <option value="IN_VERIFICATION">In Verification</option>
                  <option value="VERIFIED_SUCCESS">Verified &amp; Cleared</option>
                  <option value="FLAGGED_REVIEW">Flagged for Audit</option>
                  <option value="DOCUMENT_ISSUED">Document Issued</option>
                </select>

                {/* Sector Filter */}
                <select
                  value={selectedSectorFilter}
                  onChange={(e) => setSelectedSectorFilter(e.target.value)}
                  style={{
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    color: '#FFFFFF',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                >
                  <option value="ALL">All Sectors</option>
                  <option value="Government">Government &amp; Civic</option>
                  <option value="Education">Education &amp; Boards</option>
                  <option value="Healthcare">Healthcare &amp; ABHA</option>
                  <option value="Banking & Finance">Banking &amp; Finance</option>
                  <option value="Private Sector">Private &amp; Enterprise</option>
                </select>

              </div>
            </div>

            {/* Department Processes Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155', color: '#94A3B8' }}>
                    <th style={{ padding: '12px' }}>Process ID &amp; Title</th>
                    <th style={{ padding: '12px' }}>Department &amp; State</th>
                    <th style={{ padding: '12px' }}>Citizen &amp; Civic ID</th>
                    <th style={{ padding: '12px' }}>Status &amp; SLA</th>
                    <th style={{ padding: '12px' }}>Requested Credential</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Super Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProcesses.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
                        No department processes match your selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredProcesses.map(proc => (
                      <tr key={proc.id} style={{ borderBottom: '1px solid #334155' }}>
                        
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ fontWeight: 900, color: '#FFFFFF' }}>{proc.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#38BDF8', fontFamily: 'monospace', marginTop: '2px' }}>
                            {proc.id}
                          </div>
                        </td>

                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ fontWeight: 700, color: '#FEF08A' }}>{proc.department}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{proc.state}</div>
                        </td>

                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{proc.citizenName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#818CF8', fontFamily: 'monospace' }}>{proc.civicId}</div>
                        </td>

                        <td style={{ padding: '14px 12px' }}>
                          <span style={{
                            backgroundColor: proc.status === 'VERIFIED_SUCCESS' || proc.status === 'DOCUMENT_ISSUED' ? '#064E3B' : proc.status === 'FLAGGED_REVIEW' ? '#7F1D1D' : '#1E1B4B',
                            color: proc.status === 'VERIFIED_SUCCESS' || proc.status === 'DOCUMENT_ISSUED' ? '#34D399' : proc.status === 'FLAGGED_REVIEW' ? '#EF4444' : '#818CF8',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            display: 'inline-block'
                          }}>
                            {proc.status}
                          </span>
                          <div style={{ fontSize: '0.725rem', color: '#94A3B8', marginTop: '4px' }}>
                            SLA: {proc.slaDeadline}
                          </div>
                        </td>

                        <td style={{ padding: '14px 12px', color: '#CBD5E1' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{proc.requestedDoc}</div>
                          <div style={{ fontSize: '0.725rem', color: '#64748B' }}>{proc.purpose}</div>
                        </td>

                        <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                            
                            <button
                              onClick={() => setSelectedAuditProcess(proc)}
                              style={{
                                backgroundColor: '#334155',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '6px 10px',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Eye size={12} /> Audit Trace
                            </button>

                            {proc.status !== 'VERIFIED_SUCCESS' && (
                              <button
                                onClick={() => handleProcessAction(proc.id, 'APPROVE')}
                                style={{
                                  backgroundColor: '#166534',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                Approve
                              </button>
                            )}

                            {proc.status !== 'FLAGGED_REVIEW' && (
                              <button
                                onClick={() => handleProcessAction(proc.id, 'FLAG')}
                                style={{
                                  backgroundColor: '#991B1B',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  cursor: 'pointer'
                                }}
                              >
                                Flag
                              </button>
                            )}

                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: SYSTEM OVERVIEW & METRICS */}
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

        {/* TAB 4: SUPER ADMIN ORGANIZATION SUPERVISION */}
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
                    <td style={{ padding: '14px 12px', color: org.color || '#38BDF8', fontWeight: 700 }}>{org.name}</td>
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

        {/* TAB 5: GOVERNMENT OFFICER SUPERVISION */}
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

        {/* TAB 6: GLOBAL ACCESS MONITOR */}
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

        {/* TAB 7: CITIZEN ACCOUNTS */}
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

        {/* TAB 8: ROLE PERMISSION MATRIX */}
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

      {/* AUDIT TRACE INSPECTION MODAL */}
      {selectedAuditProcess && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          zIndex: 100,
          padding: '24px'
        }}>
          <div style={{
            backgroundColor: '#1E293B',
            borderRadius: '24px',
            border: '1px solid #4F46E5',
            width: '100%',
            maxWidth: '640px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.725rem', backgroundColor: '#312E81', color: '#818CF8', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>
                  CRYPTOGRAPHIC AUDIT TRACE
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', marginTop: '6px' }}>
                  {selectedAuditProcess.title}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#38BDF8', fontFamily: 'monospace' }}>
                  Process Token: {selectedAuditProcess.securityToken}
                </div>
              </div>
              
              <button
                onClick={() => setSelectedAuditProcess(null)}
                style={{ backgroundColor: '#334155', color: '#FFFFFF', border: 'none', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontWeight: 900 }}
              >
                ✕
              </button>
            </div>

            {/* Audit Details */}
            <div style={{ backgroundColor: '#0F172A', padding: '16px', borderRadius: '14px', border: '1px solid #334155', marginBottom: '20px', fontSize: '0.85rem' }}>
              <div style={{ color: '#94A3B8', marginBottom: '4px' }}>
                Department: <strong style={{ color: '#FEF08A' }}>{selectedAuditProcess.department}</strong> ({selectedAuditProcess.state})
              </div>
              <div style={{ color: '#94A3B8', marginBottom: '4px' }}>
                Citizen: <strong style={{ color: '#FFFFFF' }}>{selectedAuditProcess.citizenName}</strong> ({selectedAuditProcess.civicId})
              </div>
              <div style={{ color: '#94A3B8' }}>
                Purpose: <span style={{ color: '#CBD5E1' }}>{selectedAuditProcess.purpose}</span>
              </div>
            </div>

            {/* Verification Steps Timeline */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#94A3B8', marginBottom: '12px' }}>
                Verification Timeline &amp; Actor Chain:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedAuditProcess.verificationTrace?.map((tr, idx) => (
                  <div key={idx} style={{ backgroundColor: '#0F172A', padding: '12px', borderRadius: '10px', borderLeft: '3px solid #4F46E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{tr.step}</div>
                      <div style={{ fontSize: '0.725rem', color: '#94A3B8', marginTop: '2px' }}>Actor: {tr.actor}</div>
                    </div>
                    <span style={{ color: '#38BDF8', fontFamily: 'monospace', fontSize: '0.75rem' }}>{tr.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedAuditProcess(null)}
              style={{
                width: '100%',
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Close Audit Inspector
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
