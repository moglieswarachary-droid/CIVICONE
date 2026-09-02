// src/components/organization/PrivateCitizenVerificationPanel.jsx - Reusable Employer Citizen ID Verification & Onboarding Panel

import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, AlertCircle, UserCheck, Lock, Building2, Briefcase, Plus, FileText, Award, GraduationCap } from 'lucide-react';

// MOCK CITIZEN EMPLOYER VAULT
const CITIZEN_EMPLOYER_VAULT = {
  'CIV-DEMO-10001': {
    citizenId: 'CIV-DEMO-10001',
    fullName: 'Rajesh Kumar Sharma',
    dob: '15/08/1988',
    gender: 'Male',
    maskedAadhaar: 'XXXX-XXXX-8912',
    address: 'Flat 402, Sri Sai Residency, Benz Circle, Vijayawada, AP - 520010',
    email: 'rajesh.sharma@example.com',
    consentGranted: true,
    education: [
      { level: 'UG Degree', course: 'B.Tech Computer Science', inst: 'JNTU Kakinada', year: '2020', status: '✓ Verified' },
      { level: 'PG Degree', course: 'M.Tech Software Engineering', inst: 'IIT Madras', year: '2022', status: '✓ Verified' }
    ],
    experience: '4 Years 7 Months',
    previousEmployment: [
      { companyName: 'CIVIQONE Technologies', designation: 'AI/ML Senior Engineer', period: '2026 – Present', status: '✓ Verified' },
      { companyName: 'ABC Technologies', designation: 'Software Engineer', period: '2024 – 2026', status: '✓ Verified' },
      { companyName: 'XYZ Solutions', designation: 'Junior Developer', period: '2022 – 2024', status: '✓ Verified' }
    ],
    skills: [
      { name: 'Python', level: 'Advanced', status: '✓ Certificate Verified' },
      { name: 'Machine Learning', level: 'Intermediate', status: '✓ Certificate Verified' },
      { name: 'React & Node.js', level: 'Advanced', status: '✓ Verified' }
    ]
  },
  'CIV-DEMO-10002': {
    citizenId: 'CIV-DEMO-10002',
    fullName: 'Priya Sundaram',
    dob: '22/11/1994',
    gender: 'Female',
    maskedAadhaar: 'XXXX-XXXX-4412',
    address: 'House No. 12-4, MG Road, Guntur, AP - 522002',
    email: 'priya.sundaram@example.com',
    consentGranted: true,
    education: [
      { level: 'UG Degree', course: 'B.E Electronics', inst: 'Anna University', year: '2021', status: '✓ Verified' }
    ],
    experience: '3 Years 2 Months',
    previousEmployment: [
      { companyName: 'CIVIQONE Technologies', designation: 'Frontend Specialist', period: '2026 – Present', status: '✓ Verified' },
      { companyName: 'Global Tech Systems', designation: 'UI Developer', period: '2023 – 2026', status: '✓ Verified' }
    ],
    skills: [
      { name: 'React.js', level: 'Expert', status: '✓ Certificate Verified' },
      { name: 'TypeScript', level: 'Intermediate', status: '✓ Certificate Verified' }
    ]
  }
};

export default function PrivateCitizenVerificationPanel({
  onRegisterEmployee
}) {
  const [searchId, setSearchId] = useState('CIV-DEMO-10001');
  const [activeCitizen, setActiveCitizen] = useState(CITIZEN_EMPLOYER_VAULT['CIV-DEMO-10001']);
  const [activeTab, setActiveTab] = useState('verify'); // 'verify' | 'onboard'
  const [searchError, setSearchError] = useState('');
  const [consentGranted, setConsentGranted] = useState(true);

  // Onboarding Form State
  const [empId, setEmpId] = useState('EMP-2026-003');
  const [dept, setDept] = useState('Engineering');
  const [designation, setDesignation] = useState('AI/ML Senior Developer');
  const [empType, setEmpType] = useState('Full Time');
  const [workLocation, setWorkLocation] = useState('Vijayawada Innovation Hub');
  const [manager, setManager] = useState('Srinivas Rao (VP Engineering)');
  const [onboardSuccessMsg, setOnboardSuccessMsg] = useState('');

  const handleSearch = () => {
    setSearchError('');
    setOnboardSuccessMsg('');
    const cleanQ = searchId.trim().toUpperCase();

    let found = CITIZEN_EMPLOYER_VAULT[cleanQ];
    if (!found && cleanQ.length > 2) {
      found = {
        citizenId: cleanQ,
        fullName: cleanQ.includes('710646') ? 'Raghavendra' : `Verified Candidate (${cleanQ})`,
        dob: '15/08/1996',
        gender: 'Specified',
        maskedAadhaar: `XXXX-XXXX-${cleanQ.slice(-4) || '8912'}`,
        address: 'Verified Resident Address, India',
        email: 'candidate@example.com',
        consentGranted: true,
        education: [
          { level: 'UG Degree', course: 'B.Tech Computer Science', inst: 'State Technological University', year: '2022', status: '✓ Verified' }
        ],
        experience: '3 Years',
        previousEmployment: [],
        skills: [{ name: 'Software Development', level: 'Advanced', status: '✓ Verified' }]
      };
    }

    if (found) {
      setActiveCitizen(found);
      setConsentGranted(true);
    } else {
      setActiveCitizen(null);
      setSearchError('No verified citizen record found for this ID.');
    }
  };

  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    if (!activeCitizen) return;

    try {
      const res = await fetch('/api/consent/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: 'org-company-01',
          orgName: 'Corporate Employer Portal',
          citizenCivicId: activeCitizen.citizenId || searchId,
          docId: 'doc-employment-suite',
          docName: 'Aadhaar, Degree Certificates & Work Experience',
          purpose: `Employee Onboarding & Background Verification (${designation} - ${dept})`,
          expiryDays: '7'
        })
      });
      const data = await res.json();
      if (data.success) {
        setOnboardSuccessMsg(`📩 Background Verification Request sent to employee (${activeCitizen.fullName})! A notification has been sent to their app to Accept or Decline.`);
      }
    } catch (err) {
      console.error("Error dispatching employer consent request:", err);
    }

    const newEmpRecord = {
      id: empId,
      citizenId: activeCitizen.citizenId,
      name: activeCitizen.fullName,
      department: dept,
      designation,
      joiningDate: new Date().toLocaleDateString('en-GB'),
      employmentStatus: 'Active',
      verificationStatus: 'Awaiting Consent',
      employmentType: empType,
      workLocation,
      manager
    };

    if (onRegisterEmployee) onRegisterEmployee(newEmpRecord);
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1.5px solid #E9D5FF',
      padding: '20px',
      boxShadow: '0 10px 25px rgba(124,58,237,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>

      {/* Panel Header */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="#7C3AED" /> Employee Identity &amp; Verification
        </h3>
        <p style={{ fontSize: '0.775rem', color: '#64748B', margin: 0 }}>
          Verify candidate education, previous employment, and register new employees.
        </p>
      </div>

      {/* Search Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Citizen ID (e.g. CIV-DEMO-10001)"
            style={{
              width: '100%',
              padding: '8px 10px 8px 32px',
              borderRadius: '10px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.8rem',
              outline: 'none',
              fontWeight: 700,
              fontFamily: 'monospace'
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: '#7C3AED',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 14px',
            fontSize: '0.775rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          Verify
        </button>
      </div>

      {searchError && (
        <div style={{ fontSize: '0.75rem', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '8px 10px', borderRadius: '8px' }}>
          ⚠️ {searchError}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #E2E8F0', pb: '8px' }}>
        <button
          onClick={() => setActiveTab('verify')}
          style={{
            padding: '6px 12px',
            borderRadius: '8px 8px 0 0',
            fontSize: '0.75rem',
            fontWeight: 800,
            border: 'none',
            backgroundColor: activeTab === 'verify' ? '#F3E8FF' : 'transparent',
            color: activeTab === 'verify' ? '#7C3AED' : '#64748B',
            cursor: 'pointer'
          }}
        >
          Verification Summary
        </button>
        <button
          onClick={() => setActiveTab('onboard')}
          style={{
            padding: '6px 12px',
            borderRadius: '8px 8px 0 0',
            fontSize: '0.75rem',
            fontWeight: 800,
            border: 'none',
            backgroundColor: activeTab === 'onboard' ? '#F3E8FF' : 'transparent',
            color: activeTab === 'onboard' ? '#7C3AED' : '#64748B',
            cursor: 'pointer'
          }}
        >
          + Register Employee
        </button>
      </div>

      {/* Employee Consent Banner (Section 27) */}
      {activeCitizen && (
        <div style={{
          backgroundColor: consentGranted ? '#F0FDF4' : '#FFF7ED',
          border: consentGranted ? '1px solid #86EFAC' : '1px solid #FED7AA',
          borderRadius: '12px',
          padding: '10px 12px',
          fontSize: '0.75rem',
          color: consentGranted ? '#166534' : '#9A3412',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between'
        }}>
          <div>
            <strong>Employee Consent:</strong> {consentGranted ? 'Authorization Active for Background Verification' : 'Employee authorization required.'}
          </div>
          {!consentGranted && (
            <button
              onClick={() => setConsentGranted(true)}
              style={{
                backgroundColor: '#7C3AED',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.675rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Allow Access
            </button>
          )}
        </div>
      )}

      {/* TAB 1: VERIFICATION SUMMARY */}
      {activeTab === 'verify' && activeCitizen && consentGranted && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Identity Info */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', fontSize: '0.775rem', lineHeight: 1.6, color: '#334155' }}>
            <strong>Citizen ID:</strong> {activeCitizen.citizenId}<br />
            <strong>Full Name:</strong> {activeCitizen.fullName}<br />
            <strong>DOB:</strong> {activeCitizen.dob} ({activeCitizen.gender})<br />
            <strong>Masked Aadhaar:</strong> {activeCitizen.maskedAadhaar}<br />
            <strong>Total Experience:</strong> <strong style={{ color: '#7C3AED' }}>{activeCitizen.experience}</strong>
          </div>

          {/* Education Check */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <GraduationCap size={14} color="#7C3AED" /> Verified Education:
            </div>
            {activeCitizen.education.map((edu, i) => (
              <div key={i} style={{ fontSize: '0.725rem', backgroundColor: '#FAF5FF', padding: '6px 8px', borderRadius: '6px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>{edu.level}:</strong> {edu.course} ({edu.inst})</span>
                <span style={{ color: '#166534', fontWeight: 800 }}>{edu.status}</span>
              </div>
            ))}
          </div>

          {/* Previous Employment */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Briefcase size={14} color="#7C3AED" /> Previous Employment History:
            </div>
            {activeCitizen.previousEmployment.map((emp, i) => (
              <div key={i} style={{ fontSize: '0.725rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 8px', borderRadius: '6px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>{emp.companyName}:</strong> {emp.designation} ({emp.period})</span>
                <span style={{ color: '#166534', fontWeight: 800 }}>{emp.status}</span>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: NEW EMPLOYEE REGISTRATION (ONBOARDING) */}
      {activeTab === 'onboard' && activeCitizen && consentGranted && (
        <form onSubmit={handleOnboardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {onboardSuccessMsg && (
            <div style={{ fontSize: '0.75rem', color: '#166534', backgroundColor: '#DCFCE7', padding: '8px 10px', borderRadius: '8px', fontWeight: 700 }}>
              {onboardSuccessMsg}
            </div>
          )}

          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Auto-retrieved identity for: <strong>{activeCitizen.fullName}</strong> ({activeCitizen.citizenId})
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
              Employee ID
            </label>
            <input
              type="text"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.775rem', fontWeight: 700, fontFamily: 'monospace' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
              Department
            </label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.775rem' }}
            >
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
              <option value="Research & Development">Research &amp; Development</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
              Designation
            </label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.775rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
              Employment Type
            </label>
            <select
              value={empType}
              onChange={(e) => setEmpType(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.775rem' }}
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
              <option value="Consultant">Consultant</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '9px',
              fontSize: '0.775rem',
              fontWeight: 800,
              cursor: 'pointer',
              marginTop: '4px'
            }}
          >
            Complete Employee Onboarding
          </button>
        </form>
      )}

    </div>
  );
}
