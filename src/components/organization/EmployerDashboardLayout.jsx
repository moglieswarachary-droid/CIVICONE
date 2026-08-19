// src/components/organization/EmployerDashboardLayout.jsx - Unified 3-Column Workspace for Private Sector Employers

import React, { useState } from 'react';
import { Building2, LogOut, Search, Filter, Plus, CheckCircle2, AlertTriangle, Eye, ShieldCheck, Briefcase, GraduationCap, Award, FileText, UserCheck, Calendar, Clock } from 'lucide-react';
import EmploymentTimeline from './EmploymentTimeline.jsx';
import PrivateCitizenVerificationPanel from './PrivateCitizenVerificationPanel.jsx';

export default function EmployerDashboardLayout({
  session,
  config,
  stats = [],
  employeeRecords = [],
  onLogout,
  onReturnHome
}) {
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState(employeeRecords);
  const [selectedEmployee, setSelectedEmployee] = useState(employeeRecords[0] || null);
  const [detailTab, setDetailTab] = useState('profile'); // 'profile' | 'resume' | 'education' | 'history' | 'skills'

  // Departments list (Section 9)
  const departmentsList = [
    'Engineering',
    'Human Resources',
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
    'Research & Development'
  ];

  // Handle New Employee Onboarding Registration
  const handleRegisterEmployee = (newEmp) => {
    setEmployees([newEmp, ...employees]);
    setSelectedEmployee(newEmp);
  };

  // Filter Employees
  const filteredEmployees = employees.filter((emp) => {
    // 1. Department Filter
    if (selectedDept !== 'ALL' && emp.department && !emp.department.toUpperCase().includes(selectedDept.toUpperCase())) {
      return false;
    }

    // 2. Status Filter
    if (selectedStatus !== 'ALL' && emp.employmentStatus && emp.employmentStatus.toUpperCase() !== selectedStatus.toUpperCase()) {
      return false;
    }

    // 3. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (emp.name || '').toLowerCase().includes(q);
      const matchId = (emp.citizenId || emp.id || '').toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
      
      {/* Top Header Bar */}
      <header style={{
        backgroundColor: '#5B21B6',
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
              🏢
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                  {session?.companyName || 'CivicOne Technologies Pvt. Ltd.'}
                </h1>
                <span style={{ fontSize: '0.675rem', fontWeight: 800, backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                  {session?.companyType || 'IT / Software'}
                </span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.8)', margin: '2px 0 0 0' }}>
                Code: <strong>{session?.employerCode || 'EMP-CIVIC-001'}</strong> • {session?.state} | Role: <strong>{session?.roleTitle || 'HR Lead'}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80' }}></span>
              <span>● Active System</span>
            </div>

            <button
              onClick={onLogout}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '10px',
                padding: '7px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} /> Logout
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px' }}>
        
        {/* KPI Statistics Row (Section 7) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}>
          {stats.map((st, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '14px 16px',
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

        {/* 3-Column Grid Layout (Section 8) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px'
        }}>
          
          {/* LEFT PANEL: Company Info & Department Filters (3 Columns) */}
          <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Company Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                Company Details
              </h3>
              
              <div style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.6, marginBottom: '14px' }}>
                <strong>Name:</strong> {session?.companyName || 'CivicOne Technologies'}<br />
                <strong>Industry:</strong> {session?.companyType || 'IT / Software'}<br />
                <strong>Code:</strong> {session?.employerCode || 'EMP-CIVIC-001'}<br />
                <strong>State:</strong> {session?.state || 'Andhra Pradesh'}<br />
                <strong>City:</strong> Vijayawada Tech Hub<br />
                <strong>Status:</strong> <span style={{ color: '#166534', fontWeight: 800 }}>● Active System</span>
              </div>

              <div style={{
                backgroundColor: '#FAF5FF',
                border: '1px solid #E9D5FF',
                borderRadius: '12px',
                padding: '10px 12px',
                fontSize: '0.75rem',
                color: '#6B21A8',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={16} color="#7C3AED" />
                <span>Attribute-Scoped Verification Compliant</span>
              </div>
            </div>

            {/* Department Quick Filters */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                Departments
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => setSelectedDept('ALL')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: selectedDept === 'ALL' ? '#7C3AED' : '#F8FAFC',
                    color: selectedDept === 'ALL' ? '#FFFFFF' : '#334155',
                    cursor: 'pointer'
                  }}
                >
                  All Departments
                </button>
                {departmentsList.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDept(d)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textAlign: 'left',
                      border: 'none',
                      backgroundColor: selectedDept === d ? '#7C3AED' : '#F8FAFC',
                      color: selectedDept === d ? '#FFFFFF' : '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* CENTER PANEL: Employee Records Worklist & Detailed View (6 Columns) */}
          <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Employee Worklist */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
            }}>
              
              {/* Header & Status Filters */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                    Employee Worklist ({filteredEmployees.length})
                  </h3>
                  <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                    Company Employee Verification Database
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {['ALL', 'ACTIVE', 'PROBATION', 'FORMER'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedStatus(st)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: selectedStatus === st ? '#7C3AED' : '#CBD5E1',
                        backgroundColor: selectedStatus === st ? '#F3E8FF' : '#FFFFFF',
                        color: selectedStatus === st ? '#6B21A8' : '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search employee by name, ID, or Citizen ID..."
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

              {/* Employee List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredEmployees.map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    style={{
                      backgroundColor: selectedEmployee?.id === emp.id ? '#FAF5FF' : '#F8FAFC',
                      borderRadius: '14px',
                      border: selectedEmployee?.id === emp.id ? '2px solid #7C3AED' : '1px solid #E2E8F0',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      gap: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.925rem', color: '#0F172A' }}>{emp.name}</strong>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>
                          ✓ {emp.verificationStatus || 'VERIFIED'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.775rem', color: '#64748B', lineHeight: 1.5 }}>
                        ID: <strong>{emp.id}</strong> • Citizen ID: <strong style={{ color: '#334155' }}>{emp.citizenId}</strong><br />
                        {emp.designation} ({emp.department}) • Joined: {emp.joiningDate}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEmployee(emp);
                      }}
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#7C3AED',
                        border: '1px solid #DDD6FE',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Eye size={14} /> View Profile
                    </button>
                  </div>
                ))}
              </div>

            </div>

            {/* TABBED EMPLOYEE DETAILED PROFILE (Sections 13 - 20) */}
            {selectedEmployee && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #F1F5F9', pb: '10px' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Employee Verification Profile: {selectedEmployee.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Emp ID: {selectedEmployee.id} | Citizen ID: {selectedEmployee.citizenId}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'profile', label: 'Profile' },
                      { id: 'resume', label: 'Resume/CV' },
                      { id: 'education', label: 'Education' },
                      { id: 'history', label: 'Career Timeline' },
                      { id: 'skills', label: 'Skills & Certs' }
                    ].map((tb) => (
                      <button
                        key={tb.id}
                        onClick={() => setDetailTab(tb.id)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '0.725rem',
                          fontWeight: 800,
                          border: 'none',
                          backgroundColor: detailTab === tb.id ? '#7C3AED' : '#F1F5F9',
                          color: detailTab === tb.id ? '#FFFFFF' : '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {tb.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TAB 1: PROFILE & IDENTITY */}
                {detailTab === 'profile' && (
                  <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.7 }}>
                    <strong>Full Name:</strong> {selectedEmployee.name}<br />
                    <strong>Citizen ID:</strong> {selectedEmployee.citizenId}<br />
                    <strong>Department:</strong> {selectedEmployee.department}<br />
                    <strong>Designation:</strong> {selectedEmployee.designation}<br />
                    <strong>Employment Type:</strong> {selectedEmployee.employmentType || 'Full Time'}<br />
                    <strong>Work Location:</strong> {selectedEmployee.workLocation || 'Vijayawada Tech Park'}<br />
                    <strong>Masked Aadhaar:</strong> XXXX-XXXX-8912 (ADV Verified)<br />
                    <strong>Verification Status:</strong> <span style={{ color: '#166534', fontWeight: 800 }}>✓ Verified Employee</span>
                  </div>
                )}

                {/* TAB 2: RESUME & CV */}
                {detailTab === 'resume' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.775rem' }}>
                    <div style={{ backgroundColor: '#FAF5FF', padding: '10px', borderRadius: '10px', border: '1px solid #E9D5FF' }}>
                      <strong>Professional Summary:</strong> AI/ML Engineer with 4+ years experience building scalable deep learning models, full-stack React systems, and government verification APIs.
                    </div>
                    <div>
                      <strong>Core Competencies:</strong> Python, PyTorch, React, Node.js, Cloud Architecture, PostgreSQL.
                    </div>
                  </div>
                )}

                {/* TAB 3: EDUCATION VERIFICATION */}
                {detailTab === 'education' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '8px', fontSize: '0.775rem', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>B.Tech Computer Science:</strong> JNTU Kakinada (2020)<br />
                        <span style={{ color: '#64748B' }}>First Class with Distinction</span>
                      </div>
                      <span style={{ color: '#166534', fontWeight: 800 }}>✓ Verified Degree</span>
                    </div>

                    <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px', borderRadius: '8px', fontSize: '0.775rem', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <strong>M.Tech Software Engineering:</strong> IIT Madras (2022)<br />
                        <span style={{ color: '#64748B' }}>Specialization in AI &amp; Distributed Systems</span>
                      </div>
                      <span style={{ color: '#166534', fontWeight: 800 }}>✓ Verified Degree</span>
                    </div>
                  </div>
                )}

                {/* TAB 4: EMPLOYMENT TIMELINE */}
                {detailTab === 'history' && (
                  <EmploymentTimeline
                    history={[
                      { companyName: 'CivicOne Technologies', designation: selectedEmployee.designation, joiningDate: '2026', leavingDate: 'Present', duration: '7 Months', verificationStatus: '✓ Verified' },
                      { companyName: 'ABC Technologies', designation: 'Software Engineer', joiningDate: '2024', leavingDate: '2026', duration: '2 Years', verificationStatus: '✓ Verified' },
                      { companyName: 'XYZ Solutions', designation: 'Junior Developer', joiningDate: '2022', leavingDate: '2024', duration: '2 Years', verificationStatus: '✓ Verified' }
                    ]}
                    totalExperience="4 Years 7 Months"
                    relevantExperience="3 Years 8 Months"
                  />
                )}

                {/* TAB 5: SKILLS & CERTIFICATIONS */}
                {detailTab === 'skills' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { name: 'Python & Machine Learning', issuer: 'NPTEL / Govt Cert', status: '✓ Certificate Verified' },
                      { name: 'React & Full-Stack Web', issuer: 'Meta Certified', status: '✓ Certificate Verified' },
                      { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', status: '✓ Verified' }
                    ].map((sk, i) => (
                      <div key={i} style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '8px 12px', borderRadius: '8px', fontSize: '0.775rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span><strong>{sk.name}:</strong> {sk.issuer}</span>
                        <span style={{ color: '#15803D', fontWeight: 800 }}>{sk.status}</span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>

          {/* RIGHT PANEL: Citizen Verification & Onboarding Panel (3 Columns) */}
          <div style={{ gridColumn: 'span 3' }}>
            <PrivateCitizenVerificationPanel
              onRegisterEmployee={handleRegisterEmployee}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
