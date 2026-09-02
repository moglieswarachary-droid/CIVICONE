// src/components/organization/EduDepartmentDashboardLayout.jsx - Unified 3-Column Workspace for Education Institutions

import React, { useState } from 'react';
import { ShieldCheck, LogOut, Search, Filter, Plus, BookOpen, CheckCircle, AlertCircle, Eye, UserPlus, Check, Award, Lock, GraduationCap, Clock } from 'lucide-react';
import EduCitizenVerificationPanel from './EduCitizenVerificationPanel.jsx';
import AcademicTimeline from './AcademicTimeline.jsx';

const UG_COURSES = ['B.Tech', 'B.E.', 'B.Sc', 'B.Com', 'B.A.', 'BCA', 'BBA', 'Other UG Course'];
const PG_COURSES = ['M.Tech', 'M.E.', 'M.Sc', 'M.Com', 'M.A.', 'MCA', 'MBA', 'Other PG Course'];

// Known Citizen Registry Mapping for Instant Lookup
const KNOWN_CITIZEN_REGISTRY = {
  'CIV-DEMO-10001': 'Rajesh Kumar Sharma',
  'CIV-DEMO-10002': 'Priya Sundaram',
  'CIV-DEMO-10003': 'Aarav Sharma',
  'CIV-DEMO-10004': 'Kavya Reddy',
  'CIV-DEMO-10005': 'Vikram Malhotra',
  'CIV-DEMO-10006': 'Ananya Deshmukh'
};

export default function EduDepartmentDashboardLayout({
  session,
  config,
  stats = [],
  departmentsOrClasses = [],
  studentRecords = [],
  onReturnHome,
  onLogout
}) {
  const [localStudents, setLocalStudents] = useState(studentRecords || []);
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedYear, setSelectedYear] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [vaultSyncMsg, setVaultSyncMsg] = useState('');

  // Admission Form State
  const [admCivicId, setAdmCivicId] = useState('');
  const [admStudentName, setAdmStudentName] = useState('');
  const [lookupStatus, setLookupStatus] = useState(''); // 'FOUND' | 'CUSTOM' | ''
  const [admProgramType, setAdmProgramType] = useState('UG'); // UG | PG
  const [admCourse, setAdmCourse] = useState('B.Tech');
  const [admDept, setAdmDept] = useState('CSE (AI & ML)');
  const [admRollNo, setAdmRollNo] = useState('KEC-2026-CSE-09');
  const [admYear, setAdmYear] = useState('1st Year');

  // OTP Passkey Verification Modal for Profile Modal Timeline Clicks
  const [profileOtpModal, setProfileOtpModal] = useState(null); // { action, certKey, certName, demoOtp, citizenId, citizenName }
  const [profileInputOtp, setProfileInputOtp] = useState('');
  const [profileOtpError, setProfileOtpError] = useState('');

  const eduType = config?.id || 'college';

  // Trigger Citizen OTP Passkey Modal when institution clicks Lock/Unlock in Timeline
  const handleTriggerTimelineLockOtp = (certKey, certName) => {
    if (!selectedStudent) return;
    const targetKey = certKey === '10TH' ? 'school' : certKey === '12TH' ? 'intermediate' : 'college';
    const isCurrentlyLocked = selectedStudent.academicHistory?.[targetKey]?.locked === true;
    const action = isCurrentlyLocked ? 'UNLOCK' : 'LOCK';
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    setProfileOtpModal({
      action,
      certKey,
      certName,
      demoOtp: generatedOtp,
      citizenId: selectedStudent.citizenId,
      citizenName: selectedStudent.name
    });
    setProfileInputOtp(generatedOtp); // Pre-fill with 6-digit generated OTP for demo speed
    setProfileOtpError('');
  };

  // Verify Citizen OTP Passkey and update certificate lock status
  const handleVerifyProfileOtpPasskey = (e) => {
    e.preventDefault();
    if (!profileOtpModal || !selectedStudent) return;

    if (profileInputOtp !== '123456' && profileInputOtp !== profileOtpModal.demoOtp) {
      setProfileOtpError('Invalid 6-digit OTP Passkey. Use demo OTP shown on screen or 123456.');
      return;
    }

    const { action, certKey, certName } = profileOtpModal;
    const newLockState = action === 'LOCK';
    const targetKey = certKey === '10TH' ? 'school' : certKey === '12TH' ? 'intermediate' : 'college';

    const currentHistory = selectedStudent.academicHistory || {};
    const updatedHistory = { ...currentHistory };
    if (updatedHistory[targetKey]) {
      updatedHistory[targetKey] = { ...updatedHistory[targetKey], locked: newLockState };
    } else {
      updatedHistory[targetKey] = {
        schoolName: 'School Board',
        institutionName: 'Junior College',
        collegeName: session?.name || 'College',
        certName,
        status: 'VERIFIED',
        locked: newLockState
      };
    }

    const updatedStudent = { ...selectedStudent, academicHistory: updatedHistory };
    setSelectedStudent(updatedStudent);
    setLocalStudents(prev => prev.map(s => s.id === selectedStudent.id ? updatedStudent : s));

    setVaultSyncMsg(`✓ ${certName} custody status updated to ${newLockState ? '🔒 LOCKED' : '🔓 UNLOCKED'} for ${selectedStudent.name} via Authorized Passkey OTP!`);
    setProfileOtpModal(null);

    setTimeout(() => setVaultSyncMsg(''), 5000);
  };

  // Handle Citizen ID Lookup in Admission Modal
  const handleLookupCivicId = (id) => {
    setAdmCivicId(id);
    const cleanId = (id || '').trim().toUpperCase();

    if (KNOWN_CITIZEN_REGISTRY[cleanId]) {
      setAdmStudentName(KNOWN_CITIZEN_REGISTRY[cleanId]);
      setLookupStatus('FOUND');
    } else if (cleanId.length >= 4) {
      // Dynamic clean name generation or keep custom typed name
      const formattedName = cleanId.replace('CIV-', '').replace(/[-_]/g, ' ').toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());
      if (!admStudentName || admStudentName === 'Rajesh Kumar Sharma' || admStudentName === 'Priya Sundaram') {
        setAdmStudentName(formattedName.length > 2 ? `${formattedName}` : 'Verified Citizen Student');
      }
      setLookupStatus('CUSTOM');
    } else {
      setLookupStatus('');
    }
  };

  // Filter Student Worklist dynamically from local state
  const filteredStudents = localStudents.filter((st) => {
    if (selectedDept !== 'ALL' && st.department && !st.department.toUpperCase().includes(selectedDept.toUpperCase())) {
      return false;
    }
    if (selectedYear !== 'ALL' && st.year && !st.year.includes(selectedYear)) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (st.name || st.studentName || '').toLowerCase().includes(q);
      const matchId = (st.citizenId || st.rollNo || '').toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }
    return true;
  });

  const handleCreateAdmission = (e) => {
    e.preventDefault();
    if (!admCivicId || !admStudentName) return;

    const formattedCivicId = admCivicId.trim().toUpperCase();
    const generatedRollNo = admRollNo || `KEC-2026-${(admDept || 'CSE').substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const newStudent = {
      id: `STU-ADM-${Date.now()}`,
      citizenId: formattedCivicId,
      rollNo: generatedRollNo,
      name: admStudentName,
      programType: admProgramType || 'UG',
      department: admDept || 'CSE',
      year: admYear || '1st Year',
      status: 'CURRENTLY STUDYING',
      academicHistory: {
        school: {
          schoolName: 'Delhi Public School (DPS Vijayawada)',
          board: 'CBSE (Central Board)',
          completedClass: 'Class 10 (SSC)',
          passingYear: '2020',
          certName: '10th Secondary Board Marksheet',
          status: 'VERIFIED',
          locked: false // Starts UNLOCKED as requested - Institution locks via OTP Passkey after registration!
        },
        intermediate: {
          institutionName: 'Sri Chaitanya Junior College',
          board: 'AP Board of Intermediate Education',
          stream: 'MPC (Maths, Physics, Chemistry)',
          passingYear: '2022',
          certName: '12th Intermediate Marksheet',
          status: 'VERIFIED',
          locked: false // Starts UNLOCKED as requested
        },
        college: {
          university: session?.universityName || 'Jawaharlal Nehru Technological University (JNTU)',
          collegeName: session?.name || 'Kuppam Engineering College',
          course: `${admProgramType} - ${admCourse} (${admDept})`,
          department: admDept,
          year: admYear || '1st Year',
          academicPeriod: '2026 - 2030',
          status: 'CURRENTLY STUDYING',
          locked: false // Starts UNLOCKED as requested
        }
      }
    };

    // Dynamically update student list in portal
    setLocalStudents((prevStudents) => [newStudent, ...prevStudents]);

    // Set active toast message
    setVaultSyncMsg(`✓ New Admission Registered: ${admStudentName} (${formattedCivicId}) admitted to ${admCourse} - ${admDept}. Verified identity & academic records synced & added to Student Worklist!`);
    
    // Reset modal & select new student
    setShowAdmissionModal(false);
    setSelectedStudent(newStudent);

    setTimeout(() => setVaultSyncMsg(''), 6000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
      
      {/* Top Header Bar */}
      <header style={{
        backgroundColor: '#064E3B',
        color: '#FFFFFF',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              fontSize: '1.5rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              {config?.logoEmoji || '🎓'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {session?.name || config?.name || 'Educational Institution'}
                </h1>
                <span style={{
                  backgroundColor: '#22C55E20',
                  color: '#4ADE80',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  border: '1px solid #22C55E40'
                }}>
                  ACTIVE SESSION
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#A7F3D0', margin: 0 }}>
                {session?.universityName || session?.boardName || 'Recognized Academic Body'} • State: {session?.state || 'Andhra Pradesh'} • Code: <strong style={{ color: '#FFFFFF' }}>{session?.code || 'KEC-001'}</strong>
              </p>
            </div>
          </div>

          {/* User Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#F8FAFC' }}>
                {session?.email?.split('@')[0].toUpperCase() || 'Academic Administrator'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#A7F3D0' }}>
                {session?.roleTitle || 'Institution Admin'}
              </div>
            </div>

            <button
              onClick={onReturnHome || onLogout}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#FCA5A5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.825rem',
                fontWeight: 700,
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

      {/* Sync Toast Notification */}
      {vaultSyncMsg && (
        <div style={{
          backgroundColor: '#059669',
          color: '#FFFFFF',
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 700,
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={18} /> {vaultSyncMsg}
        </div>
      )}

      {/* Main Content Area */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px' }}>
        
        {/* KPI Statistics Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {stats.map((st, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '18px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
                {st.label}
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: st.color || '#0F172A' }}>
                {st.value}
              </div>
            </div>
          ))}
        </div>

        {/* 3-Column Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px'
        }}>
          
          {/* LEFT SIDE PANEL: Institution Details & Departments (3 Columns) */}
          <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                Institution Details
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                <strong>Name:</strong> {session?.name}<br />
                <strong>Affiliation:</strong> {session?.universityName || session?.boardName || 'State Board'}<br />
                <strong>Code:</strong> {session?.code || 'KEC-001'}<br />
                <strong>Accreditation:</strong> NAAC Grade A+ / Approved<br />
                <strong>Clearance:</strong> Verified Academic Entity
              </div>

              {/* Department / Stream Quick Selector */}
              <h4 style={{ fontSize: '0.825rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                Departments / Streams:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['ALL', ...departmentsOrClasses].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: '1px solid',
                      borderColor: selectedDept === dept ? '#059669' : '#E2E8F0',
                      backgroundColor: selectedDept === dept ? '#ECFDF5' : '#F8FAFC',
                      color: selectedDept === dept ? '#065F46' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER PANEL: Student Records & Filters (6 Columns) */}
          <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
            }}>
              {/* Center Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                    Student Worklist ({filteredStudents.length})
                  </h3>
                  <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                    Cross-Institution Academic Records
                  </span>
                </div>

                {/* Quick Admission Trigger */}
                <button
                  onClick={() => setShowAdmissionModal(true)}
                  style={{
                    backgroundColor: '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <UserPlus size={16} /> New Admission
                </button>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student name, roll number, or Citizen ID..."
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Student List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredStudents.map((st) => (
                  <div
                    key={st.id || st.rollNo}
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '14px',
                      border: '1px solid #E2E8F0',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669' }}>
                          {st.rollNo}
                        </span>
                        {st.programType && (
                          <span style={{ backgroundColor: '#ECFDF5', color: '#065F46', fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px' }}>
                            {st.programType}
                          </span>
                        )}
                        <span style={{ backgroundColor: '#E2E8F0', color: '#334155', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                          {st.department || 'General'}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                        {st.name}
                      </div>
                      
                      <div style={{ fontSize: '0.775rem', color: '#64748B', marginTop: '2px' }}>
                        Citizen ID: <strong>{st.citizenId}</strong> • Year: {st.year}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        backgroundColor: st.status === 'VERIFIED' || st.status === 'CURRENTLY STUDYING' ? '#DCFCE7' : '#FEF3C7',
                        color: st.status === 'VERIFIED' || st.status === 'CURRENTLY STUDYING' ? '#166534' : '#92400E',
                        fontSize: '0.725rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '10px'
                      }}>
                        {st.status}
                      </span>

                      <button
                        onClick={() => setSelectedStudent(st)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '10px',
                          padding: '6px 12px',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          color: '#0F172A',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Eye size={14} /> View History
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* RIGHT SIDE PANEL: Student & Certificate Verification (3 Columns) */}
          <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <EduCitizenVerificationPanel
              eduType={eduType}
              externalStudent={selectedStudent}
              onSyncVault={(msg) => {
                setVaultSyncMsg(msg);
                setTimeout(() => setVaultSyncMsg(''), 4000);
              }}
            />
          </div>

        </div>
      </main>

      {/* NEW STUDENT ADMISSION MODAL (SECTIONS 5 & 20) */}
      {showAdmissionModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '520px', width: '100%', padding: '28px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
              New Student Admission via CIVIQONE Citizen ID
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '18px' }}>
              Verified identity &amp; previous academic records will be retrieved automatically.
            </p>

            <form onSubmit={handleCreateAdmission} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Citizen ID Input with Live Registry Search */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  <span>Citizen ID <span style={{ color: '#EF4444' }}>*</span></span>
                  {lookupStatus === 'FOUND' && (
                    <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 800, backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '6px' }}>
                      ✓ Verified Registry Record
                    </span>
                  )}
                  {lookupStatus === 'CUSTOM' && (
                    <span style={{ fontSize: '0.7rem', color: '#0284C7', fontWeight: 800, backgroundColor: '#E0F2FE', border: '1px solid #7DD3FC', padding: '2px 8px', borderRadius: '6px' }}>
                      ⚡ Custom Citizen ID
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={admCivicId}
                  onChange={(e) => handleLookupCivicId(e.target.value)}
                  placeholder="e.g. CIV-DEMO-10003 or CIV-2026-9081"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #059669', fontSize: '0.9rem', fontWeight: 700, outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Student Full Name <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>(Auto-retrieved from Vault / Editable)</span>
                </label>
                <input
                  type="text"
                  value={admStudentName}
                  onChange={(e) => setAdmStudentName(e.target.value)}
                  placeholder="Enter student full name"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 700, backgroundColor: '#FFFFFF' }}
                  required
                />
              </div>

              {/* College Specific: UG vs PG Selection (Section 5) */}
              {eduType === 'college' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Program Level <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <select
                      value={admProgramType}
                      onChange={(e) => {
                        const level = e.target.value;
                        setAdmProgramType(level);
                        setAdmCourse(level === 'UG' ? 'B.Tech' : 'M.Tech');
                      }}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.85rem' }}
                    >
                      <option value="UG">UG (Undergraduate)</option>
                      <option value="PG">PG (Postgraduate)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Degree / Course <span style={{ color: '#EF4444' }}>*</span>
                    </label>
                    <select
                      value={admCourse}
                      onChange={(e) => setAdmCourse(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.85rem' }}
                    >
                      {(admProgramType === 'UG' ? UG_COURSES : PG_COURSES).map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Department / Stream
                  </label>
                  <input
                    type="text" value={admDept} onChange={(e) => setAdmDept(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Roll Number
                  </label>
                  <input
                    type="text" value={admRollNo} onChange={(e) => setAdmRollNo(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button" onClick={() => setShowAdmissionModal(false)}
                  style={{ backgroundColor: '#E2E8F0', border: 'none', padding: '9px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#059669', color: '#FFFFFF', border: 'none', padding: '9px 18px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Admit &amp; Sync Academic Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW STUDENT PROFILE & TIMELINE MODAL */}
      {selectedStudent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '620px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  {selectedStudent.name}
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Roll No: <strong>{selectedStudent.rollNo}</strong> • Citizen ID: <strong>{selectedStudent.citizenId}</strong>
                </span>
              </div>
              <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px' }}>
                {selectedStudent.status}
              </span>
            </div>

            {/* Visual Timeline Component with Dynamic Lock Toggles */}
            <div style={{ marginBottom: '16px' }}>
              <AcademicTimeline
                academicHistory={selectedStudent.academicHistory || {
                  school: {
                    schoolName: 'Delhi Public School (DPS Vijayawada)',
                    board: 'CBSE Board',
                    completedClass: 'Class 10 (SSC)',
                    passingYear: '2020',
                    certName: '10th Secondary Board Marksheet',
                    status: 'VERIFIED',
                    locked: false
                  },
                  intermediate: {
                    institutionName: 'Sri Chaitanya Junior College',
                    board: 'AP Board of Intermediate Education',
                    stream: 'MPC Stream',
                    passingYear: '2022',
                    certName: '12th Intermediate Marksheet',
                    status: 'VERIFIED',
                    locked: false
                  },
                  college: {
                    university: session?.universityName || 'JNTU University',
                    collegeName: session?.name || 'Kuppam Engineering College',
                    course: selectedStudent.department || 'B.Tech CSE',
                    department: selectedStudent.department || 'CSE',
                    year: selectedStudent.year || '1st Year',
                    academicPeriod: '2026 - 2030',
                    status: selectedStudent.status || 'CURRENTLY STUDYING',
                    certName: 'Degree Semester Grade Transcript',
                    locked: false
                  }
                }}
                eduType={eduType}
                onToggleLock={(certKey, certName) => handleTriggerTimelineLockOtp(certKey, certName)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedStudent(null)}
                style={{ backgroundColor: '#E2E8F0', border: 'none', padding: '9px 18px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CITIZEN OTP PASSKEY VERIFICATION MODAL FOR PROFILE TIMELINE */}
      {profileOtpModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '460px', width: '100%', padding: '28px', border: '1px solid #E2E8F0', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            
            <div style={{
              width: '54px', height: '54px', borderRadius: '16px',
              backgroundColor: profileOtpModal.action === 'UNLOCK' ? '#E0F2FE' : '#ECFDF5',
              border: `1px solid ${profileOtpModal.action === 'UNLOCK' ? '#7DD3FC' : '#A7F3D0'}`,
              color: profileOtpModal.action === 'UNLOCK' ? '#0369A1' : '#059669',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: '1.5rem'
            }}>
              {profileOtpModal.action === 'UNLOCK' ? '🔓' : '🔑'}
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0F172A', textAlign: 'center', marginBottom: '4px' }}>
              {profileOtpModal.action === 'UNLOCK' ? 'Release & Unlock Digital Certificate' : 'Paperless Admission Certificate Lock'}
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748B', textAlign: 'center', marginBottom: '16px', lineHeight: 1.45 }}>
              {profileOtpModal.action === 'UNLOCK'
                ? <>Releasing <strong>{profileOtpModal.certName}</strong> from institution digital custody for <strong>{profileOtpModal.citizenName}</strong> ({profileOtpModal.citizenId}).</>
                : <>Locking <strong>{profileOtpModal.certName}</strong> in digital custody (replacing paper submission) for <strong>{profileOtpModal.citizenName}</strong> ({profileOtpModal.citizenId}).</>
              }
            </p>

            <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.8rem', color: '#92400E' }}>
              🌱 <strong>Paperless Authorization (DEMO MODE):</strong> Ask student to provide the 6-Digit OTP Passkey sent to their Citizen Portal to authorize {profileOtpModal.action === 'UNLOCK' ? 'certificate release & unlock' : 'digital custody lock'}.
              <div style={{ marginTop: '8px', fontSize: '0.775rem', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                <span>Student Security OTP Passkey: <strong style={{ fontFamily: 'monospace', fontSize: '1.05rem', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', border: '1px solid #FCD34D', color: '#059669' }}>{profileOtpModal.demoOtp}</strong></span>
                <button
                  type="button"
                  onClick={() => setProfileInputOtp(profileOtpModal.demoOtp)}
                  style={{ backgroundColor: '#059669', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '3px 8px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  ⚡ Auto-Fill Generated OTP
                </button>
              </div>
            </div>

            <form onSubmit={handleVerifyProfileOtpPasskey}>
              {profileOtpError && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '14px' }}>
                  {profileOtpError}
                </div>
              )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  <span>Enter 6-Digit Citizen Passkey OTP:</span>
                  <span style={{ fontSize: '0.7rem', color: '#059669', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '2px 6px', borderRadius: '4px' }}>
                    ⚡ DEMO PASSKEY: 123456
                  </span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={profileInputOtp}
                  onChange={(e) => setProfileInputOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 892104 or 123456"
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `2px solid ${profileOtpModal.action === 'UNLOCK' ? '#0284C7' : '#059669'}`, fontSize: '1.4rem', fontWeight: 900, textAlign: 'center', letterSpacing: '0.3em', fontFamily: 'monospace', outline: 'none' }}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setProfileInputOtp('123456')}
                    style={{ backgroundColor: '#F1F5F9', color: '#0F172A', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '4px 10px', fontSize: '0.725rem', fontWeight: 800, cursor: 'pointer' }}
                  >
                    🔑 Quick Fill Universal Demo OTP (123456)
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setProfileOtpModal(null)}
                  style={{ flex: 1, backgroundColor: '#F1F5F9', color: '#64748B', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    backgroundColor: profileOtpModal.action === 'UNLOCK' ? '#0284C7' : '#059669',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    boxShadow: profileOtpModal.action === 'UNLOCK' ? '0 4px 12px rgba(2,132,199,0.3)' : '0 4px 12px rgba(5,150,105,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {profileOtpModal.action === 'UNLOCK' ? 'Authorize Certificate Release 🔓' : 'Authorize Digital Custody 🔒'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Layout Responsiveness CSS */}
      <style>{`
        @media (max-width: 1023px) {
          main > div {
            grid-template-columns: 1fr !important;
          }
          main > div > div {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  );
}
