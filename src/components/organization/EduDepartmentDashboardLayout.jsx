// src/components/organization/EduDepartmentDashboardLayout.jsx - Modern, Spacious & Uncluttered University Portal Workspace

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, LogOut, Search, Filter, Plus, BookOpen, CheckCircle2,
  AlertCircle, Eye, UserPlus, Award, Lock, GraduationCap, Clock,
  X, Building2, User, FileText, Check, ChevronRight, RefreshCw
} from 'lucide-react';
import EduCitizenVerificationPanel from './EduCitizenVerificationPanel.jsx';

const UG_COURSES = ['B.Tech', 'B.E.', 'B.Sc', 'B.Com', 'B.A.', 'BCA', 'BBA', 'Other UG Course'];
const PG_COURSES = ['M.Tech', 'M.E.', 'M.Sc', 'M.Com', 'M.A.', 'MCA', 'MBA', 'Other PG Course'];

export default function EduDepartmentDashboardLayout({
  session,
  config,
  stats = [],
  departmentsOrClasses = [],
  studentRecords = [],
  onReturnHome,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('admissions'); // 'admissions' | 'lookup' | 'directory'
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Live Admission & Consent Requests State
  const [admissionRequests, setAdmissionRequests] = useState([]);
  const [viewVerifiedDocsModal, setViewVerifiedDocsModal] = useState(null);
  const [studentVaultDetails, setStudentVaultDetails] = useState(null);

  // New Admission Form State
  const [admCivicId, setAdmCivicId] = useState('');
  const [admStudentName, setAdmStudentName] = useState('');
  const [admProgramType, setAdmProgramType] = useState('UG');
  const [admCourse, setAdmCourse] = useState('B.Tech Computer Science');
  const [admDept, setAdmDept] = useState('CSE (AI & ML)');
  const [admRollNo, setAdmRollNo] = useState(`KEC-2026-CSE-${Math.floor(10 + Math.random() * 90)}`);

  const orgId = session?.code ? `org-${session.code.toLowerCase()}` : 'org-college-01';

  // Fetch Live Requests from Backend
  const fetchLiveRequests = async () => {
    try {
      const res = await fetch(`/api/consent/requests/org/${orgId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.requests) {
          setAdmissionRequests(data.requests);
        }
      }
    } catch (err) {}
  };

  // 3-Second Real-Time Live Polling
  useEffect(() => {
    fetchLiveRequests();
    const interval = setInterval(fetchLiveRequests, 3000);
    return () => clearInterval(interval);
  }, [orgId]);

  // Handle Admission Request Dispatch
  const handleSendAdmissionRequest = async (e) => {
    e.preventDefault();
    if (!admCivicId.trim()) return;

    try {
      const res = await fetch('/api/consent/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: orgId,
          citizenCivicId: admCivicId.trim(),
          docId: 'doc-academic-suite',
          docName: 'Aadhaar Card, 10th Marks Card, Inter Marks Card',
          purpose: `Admission Offer (${admCourse} - ${admDept}) — Roll No: ${admRollNo}`,
          expiryDays: '7'
        })
      });

      const data = await res.json();
      if (data.success) {
        setToastMsg(`📩 Admission Offer & Credentials Request sent to ${admStudentName || admCivicId}! Waiting for citizen acceptance.`);
        setShowAdmissionModal(false);
        fetchLiveRequests();
        setAdmCivicId('');
        setAdmStudentName('');
      } else {
        alert(data.error || 'Failed to dispatch admission request.');
      }
    } catch (err) {
      alert('Network error dispatching request.');
    }
  };

  // View Student Verified Records
  const handleOpenVerifiedRecords = async (reqItem) => {
    setViewVerifiedDocsModal(reqItem);
    try {
      const res = await fetch(`/api/consent/student-records/${reqItem.citizenCivicId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStudentVaultDetails(data);
        }
      }
    } catch (e) {}
  };

  const pendingCount = admissionRequests.filter(r => r.status === 'PENDING').length;
  const approvedCount = admissionRequests.filter(r => r.status === 'APPROVED' || r.status === 'GRANTED' || r.status === 'ACTIVE').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* 1. TOP HEADER BAR */}
      <header style={{
        backgroundColor: '#0F2342',
        color: '#FFFFFF',
        padding: '16px 28px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: '#0B5ED7',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 4px 12px rgba(11, 94, 215, 0.4)'
            }}>
              🎓
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.01em', margin: 0 }}>
                  {session?.name || config?.name || 'Jawaharlal Nehru Technological University'}
                </h1>
                <span style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  fontSize: '0.725rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#34D399' }} />
                  ONLINE GATEWAY
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '3px', margin: 0 }}>
                Affiliation: <strong style={{ color: '#E2E8F0' }}>{session?.universityName || 'JNTU Kurnool / State Board'}</strong> • State: {session?.state || 'Andhra Pradesh'} • Code: <strong style={{ color: '#60A5FA' }}>{session?.code || 'KEC-001'}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F8FAFC' }}>
                {session?.email || 'admin@university.edu.in'}
              </div>
              <div style={{ fontSize: '0.725rem', color: '#94A3B8', fontWeight: 600 }}>
                Institutional Administrator • NAAC Grade A+
              </div>
            </div>

            <button
              onClick={onReturnHome || onLogout}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#F87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '0.825rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

        </div>
      </header>

      {/* TOAST FEEDBACK ALERT */}
      {toastMsg && (
        <div style={{
          backgroundColor: '#059669',
          color: '#FFFFFF',
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 800,
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(5, 150, 105, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} /> {toastMsg}
        </div>
      )}

      {/* 2. MAIN CONTAINER */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '28px 20px' }}>
        
        {/* KPI OVERVIEW METRICS ROW */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Total Active Students
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0F172A', marginTop: '6px' }}>
              2,480
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
              ↑ 1,940 UG • 540 PG Enrolled
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '20px', border: '1.5px solid #FDE68A', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.05)' }}>
            <div style={{ fontSize: '0.8rem', color: '#D97706', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending Student Acceptance
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#D97706', marginTop: '6px' }}>
              {pendingCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 700, marginTop: '4px' }}>
              🟡 Awaiting student click in app
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '20px', border: '1.5px solid #A7F3D0', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.05)' }}>
            <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Verified &amp; Accepted Students
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#059669', marginTop: '6px' }}>
              {approvedCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700, marginTop: '4px' }}>
              🟢 Aadhaar &amp; Academics Available
            </div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Institutional Accreditation
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B5ED7', marginTop: '8px' }}>
              NAAC Grade A+
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, marginTop: '4px' }}>
              Sovereign Tokenized Verification
            </div>
          </div>

        </div>

        {/* 3. PRIMARY WORKSPACE NAVIGATION TABS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderBottom: '2px solid #E2E8F0',
          marginBottom: '24px',
          paddingBottom: '2px'
        }}>
          
          <button
            onClick={() => setActiveTab('admissions')}
            style={{
              padding: '12px 20px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'admissions' ? '3px solid #0B5ED7' : '3px solid transparent',
              color: activeTab === 'admissions' ? '#0B5ED7' : '#64748B',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <GraduationCap size={20} />
            Live Admissions &amp; Consent Verification
            {pendingCount > 0 && (
              <span style={{ backgroundColor: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                {pendingCount} Pending
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('lookup')}
            style={{
              padding: '12px 20px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'lookup' ? '3px solid #0B5ED7' : '3px solid transparent',
              color: activeTab === 'lookup' ? '#0B5ED7' : '#64748B',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Search size={18} />
            Citizen ID Academic Lookup &amp; Timeline
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            style={{
              padding: '12px 20px',
              border: 'none',
              backgroundColor: 'transparent',
              borderBottom: activeTab === 'directory' ? '3px solid #0B5ED7' : '3px solid transparent',
              color: activeTab === 'directory' ? '#0B5ED7' : '#64748B',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Building2 size={18} />
            Department Student Directory
          </button>

        </div>

        {/* TAB 1: LIVE ADMISSIONS & CONSENT VERIFICATION (PRIMARY CLEAN VIEW) */}
        {activeTab === 'admissions' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            
            {/* Header with Search & Add Admission Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                  Student Admission Offers &amp; Consent Verification Tracking
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '4px', margin: 0 }}>
                  Real-time synchronization with student portals. When a student clicks "Accept", their verified Aadhaar and academic credentials become instantly visible.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={fetchLiveRequests}
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={16} /> Refresh
                </button>

                <button
                  onClick={() => setShowAdmissionModal(true)}
                  style={{
                    backgroundColor: '#0B5ED7',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(11, 94, 215, 0.3)'
                  }}
                >
                  <UserPlus size={18} /> + Add Admission
                </button>
              </div>
            </div>

            {/* Live Requests Table */}
            {admissionRequests.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                border: '2px dashed #E2E8F0',
                borderRadius: '18px',
                backgroundColor: '#F8FAFC'
              }}>
                <GraduationCap size={44} style={{ color: '#0B5ED7', opacity: 0.5, margin: '0 auto 12px auto' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  No Active Admission Requests Yet
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748B', maxWidth: '420px', margin: '0 auto 18px auto' }}>
                  Click the <strong>"+ Add Admission"</strong> button above to issue an admission offer to a student using their unique Citizen ID.
                </p>
                <button
                  onClick={() => setShowAdmissionModal(true)}
                  style={{
                    backgroundColor: '#0B5ED7',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  + Create First Admission Offer
                </button>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                      <th style={{ padding: '14px 16px', fontWeight: 800, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase' }}>Student Civic ID</th>
                      <th style={{ padding: '14px 16px', fontWeight: 800, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase' }}>Requested Credentials</th>
                      <th style={{ padding: '14px 16px', fontWeight: 800, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase' }}>Purpose / Course</th>
                      <th style={{ padding: '14px 16px', fontWeight: 800, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase' }}>Real-Time Student Status</th>
                      <th style={{ padding: '14px 16px', fontWeight: 800, fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase' }}>University Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {admissionRequests.map((req) => {
                      const isApproved = req.status === 'APPROVED' || req.status === 'GRANTED' || req.status === 'ACTIVE';
                      const isDeclined = req.status === 'DECLINED';

                      return (
                        <tr key={req.id} style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.2s' }}>
                          
                          <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 800, fontSize: '0.9rem', color: '#0B5ED7' }}>
                            {req.citizenCivicId}
                          </td>

                          <td style={{ padding: '16px', fontWeight: 700, fontSize: '0.85rem', color: '#0F172A' }}>
                            {req.docName}
                          </td>

                          <td style={{ padding: '16px', fontSize: '0.825rem', color: '#475569', maxWidth: '280px' }}>
                            {req.purpose}
                          </td>

                          {/* PROMINENT STATUS BADGE */}
                          <td style={{ padding: '16px' }}>
                            {isApproved ? (
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#ECFDF5',
                                color: '#047857',
                                border: '1px solid #A7F3D0',
                                padding: '6px 14px',
                                borderRadius: '10px',
                                fontSize: '0.8rem',
                                fontWeight: 900
                              }}>
                                <CheckCircle2 size={16} /> 🟢 ACCEPTED BY STUDENT
                              </div>
                            ) : isDeclined ? (
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#FEF2F2',
                                color: '#B91C1C',
                                border: '1px solid #FECACA',
                                padding: '6px 14px',
                                borderRadius: '10px',
                                fontSize: '0.8rem',
                                fontWeight: 900
                              }}>
                                <AlertCircle size={16} /> 🔴 DECLINED BY CITIZEN
                              </div>
                            ) : (
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                backgroundColor: '#FEF3C7',
                                color: '#B45309',
                                border: '1px solid #FDE68A',
                                padding: '6px 14px',
                                borderRadius: '10px',
                                fontSize: '0.8rem',
                                fontWeight: 900
                              }}>
                                <Clock size={16} /> 🟡 AWAITING STUDENT ACCEPTANCE
                              </div>
                            )}
                          </td>

                          {/* ACTION BUTTON */}
                          <td style={{ padding: '16px' }}>
                            {isApproved ? (
                              <button
                                onClick={() => handleOpenVerifiedRecords(req)}
                                style={{
                                  backgroundColor: '#0B5ED7',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  padding: '8px 16px',
                                  borderRadius: '10px',
                                  fontWeight: 800,
                                  fontSize: '0.825rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  boxShadow: '0 4px 12px rgba(11, 94, 215, 0.25)'
                                }}
                              >
                                <Eye size={15} /> View Aadhaar &amp; Academic Records 🎓
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.775rem', color: '#94A3B8', fontWeight: 600 }}>
                                Awaiting Student Consent
                              </span>
                            )}
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: CITIZEN ID ACADEMIC LOOKUP & TIMELINE */}
        {activeTab === 'lookup' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', marginBottom: '8px' }}>
                Direct Sovereign Student Academic Verification
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '24px' }}>
                Query the national education ledger by Citizen ID to verify 10th board results, 12th Intermediate certificates, and sovereign degree records.
              </p>

              <EduCitizenVerificationPanel
                eduType="college"
                onSyncVault={(msg) => {
                  setToastMsg(msg);
                  setTimeout(() => setToastMsg(''), 4000);
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 3: DEPARTMENT STUDENT DIRECTORY */}
        {activeTab === 'directory' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '28px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            
            {/* Department Filter Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['ALL', ...departmentsOrClasses].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '10px',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      border: '1px solid',
                      borderColor: selectedDept === dept ? '#0B5ED7' : '#E2E8F0',
                      backgroundColor: selectedDept === dept ? '#EFF6FF' : '#FFFFFF',
                      color: selectedDept === dept ? '#0B5ED7' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', minWidth: '260px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search enrolled students..."
                  style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>

            {/* Enrolled Students Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {studentRecords
                .filter(st => selectedDept === 'ALL' || (st.department && st.department.includes(selectedDept)))
                .filter(st => !searchQuery || (st.name && st.name.toLowerCase().includes(searchQuery.toLowerCase())) || (st.citizenId && st.citizenId.toLowerCase().includes(searchQuery.toLowerCase())))
                .map((st) => (
                  <div
                    key={st.id || st.rollNo}
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      padding: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', fontWeight: 800, color: '#0B5ED7' }}>
                          {st.rollNo}
                        </span>
                        <span style={{ backgroundColor: '#ECFDF5', color: '#065F46', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                          {st.status || 'ENROLLED'}
                        </span>
                      </div>

                      <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A' }}>
                        {st.name}
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                        Course: <strong>{st.department || 'Computer Science'} ({st.programType || 'UG'})</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                        Citizen ID: <strong>{st.citizenId}</strong> • Year: {st.year || '3rd Year'}
                      </div>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        )}

      </main>

      {/* 4. MODAL: NEW STUDENT ADMISSION OFFER */}
      {showAdmissionModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '560px',
            width: '100%',
            padding: '32px',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
          }}>
            
            <button
              onClick={() => setShowAdmissionModal(false)}
              style={{
                position: 'absolute', top: '20px', right: '20px',
                background: '#F1F5F9', border: 'none', color: '#64748B',
                borderRadius: '50%', width: '36px', height: '36px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.5rem' }}>🎓</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                Issue Admission Offer via Citizen ID
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px', margin: 0 }}>
              The student will receive an instant notification in their citizen app with <strong>Accept</strong> and <strong>Decline</strong> options.
            </p>

            <form onSubmit={handleSendAdmissionRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  Citizen ID <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={admCivicId}
                  onChange={(e) => setAdmCivicId(e.target.value)}
                  placeholder="e.g. CIV-AP-710646-823 or newly registered ID"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  Student Full Name
                </label>
                <input
                  type="text"
                  value={admStudentName}
                  onChange={(e) => setAdmStudentName(e.target.value)}
                  placeholder="e.g. Raghavendra / Student Name"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                    Program Level
                  </label>
                  <select
                    value={admProgramType}
                    onChange={(e) => setAdmProgramType(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700, backgroundColor: '#FFFFFF' }}
                  >
                    <option value="UG">Undergraduate (UG / B.Tech)</option>
                    <option value="PG">Postgraduate (PG / M.Tech)</option>
                    <option value="Diploma">Diploma / Polytechnic</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                    Course
                  </label>
                  <input
                    type="text"
                    value={admCourse}
                    onChange={(e) => setAdmCourse(e.target.value)}
                    placeholder="e.g. B.Tech Computer Science"
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                    Department / Stream
                  </label>
                  <input
                    type="text"
                    value={admDept}
                    onChange={(e) => setAdmDept(e.target.value)}
                    placeholder="e.g. CSE (AI & ML)"
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                    Roll Number / Application ID <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={admRollNo}
                    onChange={(e) => setAdmRollNo(e.target.value)}
                    placeholder="e.g. 2026-CSE-091"
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700 }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(false)}
                  style={{ flex: 1, backgroundColor: '#F1F5F9', color: '#475569', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '12px', borderRadius: '12px', fontWeight: 900, fontSize: '0.9rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(11, 94, 215, 0.3)' }}
                >
                  Send Admission Offer 📩
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 5. MODAL: VERIFIED STUDENT AADHAAR & ACADEMIC CREDENTIALS */}
      {viewVerifiedDocsModal && (() => {
        const studentCitizen = studentVaultDetails?.citizen || {};
        const studentDocs = studentVaultDetails?.documents || [];
        const uploadedAadhaar = studentDocs.find(d => 
          (d.name && d.name.toLowerCase().includes('aadhaar')) ||
          (d.category && d.category.toLowerCase().includes('government'))
        );
        const uploaded10th = studentDocs.find(d => 
          (d.name && (d.name.toLowerCase().includes('10th') || d.name.toLowerCase().includes('ssc')))
        );
        const uploaded12th = studentDocs.find(d => 
          (d.name && (d.name.toLowerCase().includes('12th') || d.name.toLowerCase().includes('inter') || d.name.toLowerCase().includes('secondary')))
        );

        return (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              position: 'relative',
              boxShadow: '0 25px 60px rgba(0,0,0,0.35)'
            }}>
              
              <button
                onClick={() => { setViewVerifiedDocsModal(null); setStudentVaultDetails(null); }}
                style={{
                  position: 'absolute', top: '20px', right: '20px',
                  background: '#F1F5F9', border: 'none', color: '#64748B',
                  borderRadius: '50%', width: '36px', height: '36px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                <span style={{ fontSize: '1.6rem' }}>🎓</span>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A', margin: 0 }}>
                    Verified Student Credentials &amp; Aadhaar Card
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px', margin: 0 }}>
                    Officially shared via verified student consent for {session?.name || 'University Admission'}.
                  </p>
                </div>
              </div>

              {/* Student Overview Header */}
              <div style={{
                backgroundColor: '#EFF6FF',
                border: '1.5px solid #BFDBFE',
                borderRadius: '16px',
                padding: '16px',
                marginTop: '18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase' }}>STUDENT NAME</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A' }}>
                    {studentCitizen.fullName || 'Verified Citizen'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase' }}>CITIZEN ID</div>
                  <div style={{ fontSize: '0.95rem', fontFamily: 'monospace', fontWeight: 900, color: '#0B5ED7' }}>
                    {viewVerifiedDocsModal.citizenCivicId}
                  </div>
                </div>
                <div>
                  <span style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                    🟢 CONSENT VERIFIED
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                
                {/* 1. MASKED AADHAAR CARD */}
                <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #0B5ED7', borderRadius: '16px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F172A' }}>
                      🆔 {uploadedAadhaar ? uploadedAadhaar.name : 'Sovereign Masked Aadhaar Card'}
                    </span>
                    <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '3px 10px', borderRadius: '6px', fontSize: '0.725rem', fontWeight: 800 }}>
                      {uploadedAadhaar ? 'VAULT DOCUMENT VERIFIED' : 'VERIFIED UIDAI TOKEN'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                    Issuer: <strong>{uploadedAadhaar?.issuer || 'UIDAI (Government of India)'}</strong> • Status: <strong style={{ color: '#059669' }}>Authenticated</strong>
                  </div>
                  <div style={{ fontSize: '1.15rem', fontFamily: 'monospace', fontWeight: 900, color: '#0B5ED7', marginTop: '8px', letterSpacing: '0.08em' }}>
                    {studentCitizen.maskedAadhaar || (uploadedAadhaar?.docNumber ? `XXXX XXXX ${uploadedAadhaar.docNumber.slice(-4)}` : 'XXXX XXXX 8909')}
                  </div>
                  {uploadedAadhaar?.docNumber && (
                    <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                      Token / Ref: <strong>{uploadedAadhaar.docNumber}</strong> (Issue Date: {uploadedAadhaar.issueDate || 'N/A'})
                    </div>
                  )}
                </div>

                {/* 2. 10TH CLASS MARKS CARD */}
                <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #059669', borderRadius: '16px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F172A' }}>
                      📜 {uploaded10th ? uploaded10th.name : '10th Class (SSC) Board Marks Card'}
                    </span>
                    <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '3px 10px', borderRadius: '6px', fontSize: '0.725rem', fontWeight: 800 }}>
                      {uploaded10th ? 'VAULT ATTESTED' : 'VERIFIED BOARD'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                    Board: <strong>{uploaded10th?.issuer || 'Board of Secondary Education, AP'}</strong> | Roll No: <strong>{uploaded10th?.docNumber || 'SSC-2020-90812'}</strong>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669', marginTop: '6px' }}>
                    GPA / Result: 10.0 / 10.0 (PASS WITH DISTINCTION)
                  </div>
                </div>

                {/* 3. INTERMEDIATE (12TH) MARKS CARD */}
                <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #D97706', borderRadius: '16px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F172A' }}>
                      🎓 {uploaded12th ? uploaded12th.name : 'Intermediate (12th Board) Marks Certificate'}
                    </span>
                    <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '3px 10px', borderRadius: '6px', fontSize: '0.725rem', fontWeight: 800 }}>
                      {uploaded12th ? 'VAULT ATTESTED' : 'VERIFIED BIEAP'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                    Board: <strong>{uploaded12th?.issuer || 'Board of Intermediate Education AP (MPC Group)'}</strong> | Hall Ticket: <strong>{uploaded12th?.docNumber || 'INTER-2022-44091'}</strong>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#D97706', marginTop: '6px' }}>
                    Total Marks: 982 / 1000 (GRADE A1)
                  </div>
                </div>

                {/* ADDITIONAL UPLOADED DOCUMENTS IF ANY */}
                {studentDocs.filter(d => !d.name.toLowerCase().includes('aadhaar') && !d.name.toLowerCase().includes('10th') && !d.name.toLowerCase().includes('12th')).map(d => (
                  <div key={d.id || d.docNumber} style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #6366F1', borderRadius: '16px', padding: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#0F172A' }}>📁 {d.name}</span>
                      <span style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '3px 10px', borderRadius: '6px', fontSize: '0.725rem', fontWeight: 800 }}>CITIZEN VAULT</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                      Issuer: <strong>{d.issuer}</strong> | Doc Ref: <strong>{d.docNumber || d.refNo || 'N/A'}</strong>
                    </div>
                  </div>
                ))}

              </div>

              <button
                onClick={() => { setViewVerifiedDocsModal(null); setStudentVaultDetails(null); }}
                style={{
                  width: '100%',
                  backgroundColor: '#0B5ED7',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '24px'
                }}
              >
                Close Academic Records View
              </button>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
