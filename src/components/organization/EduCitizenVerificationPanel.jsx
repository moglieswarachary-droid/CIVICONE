// src/components/organization/EduCitizenVerificationPanel.jsx - Education Student Verification, Academic History & Scoped Vault

import React, { useState } from 'react';
import { Search, ShieldCheck, UserCheck, Lock, Unlock, CheckCircle2, Award, BookOpen, Clock, Calendar, Building2, School, GraduationCap, Eye, FileText, Check, AlertCircle } from 'lucide-react';
import AcademicTimeline from './AcademicTimeline.jsx';

const CONNECTED_STUDENT_PROFILES = {
  'CIV-DEMO-10001': {
    citizenId: 'CIV-DEMO-10001',
    fullName: 'Rajesh Kumar Sharma',
    dob: '15/08/2004',
    maskedAadhaar: 'XXXX-XXXX-8912',
    gender: 'Male',
    address: 'Flat 402, Royal Palms, MG Road, Vijayawada, AP - 520010',
    parentName: 'Srinivas Sharma (Father)',
    abcId: 'ABC-8912-2026',
    govtCertificates: {
      dobCert: 'VERIFIED (Municipal Corp)',
      aadhaarStatus: 'VERIFIED (UIDAIADV)',
      casteCertStatus: 'VERIFIED (BC-B)',
      incomeCertStatus: 'VERIFIED (< ₹2 Lakhs)',
      nativityStatus: 'VERIFIED (Andhra Pradesh)'
    },
    academicHistory: {
      school: {
        schoolName: 'Delhi Public School (DPS Vijayawada)',
        board: 'CBSE (Central Board)',
        completedClass: 'Class 10 (SSC)',
        passingYear: '2020',
        regNumber: 'SCH-2020-CBSE-991',
        status: 'VERIFIED',
        certName: '10th Secondary Board Marksheet',
        locked: true
      },
      intermediate: {
        institutionName: 'Sri Chaitanya Junior College',
        board: 'AP Board of Intermediate Education',
        stream: 'MPC (Maths, Physics, Chemistry)',
        passingYear: '2022',
        regNumber: 'INT-AP-2022-8821',
        status: 'VERIFIED',
        certName: '12th Intermediate Higher Secondary',
        locked: true
      },
      college: {
        university: 'Jawaharlal Nehru Technological University (JNTU)',
        collegeName: 'Kuppam Engineering College',
        collegeCode: 'KEC-001',
        course: 'B.Tech',
        programType: 'UG',
        department: 'CSE (AI & ML)',
        year: '3rd Year',
        admissionYear: '2022',
        rollNo: '2026-CSE-001',
        regNumber: 'JNTU-REG-2022-9901',
        academicPeriod: '2022 - 2026',
        status: 'CURRENTLY STUDYING',
        certName: 'Degree Semester Grade Transcript',
        locked: false
      },
      skills: [
        { id: 'SKILL-101', name: 'Python & AI Programming', certId: 'PY-2026-001', level: 'Advanced', hours: '120', issuedDate: '15/01/2026', institution: 'National Skill Dev Center', status: 'VERIFIED' }
      ]
    }
  },
  'CIV-DEMO-10002': {
    citizenId: 'CIV-DEMO-10002',
    fullName: 'Priya Sundaram',
    dob: '22/11/2005',
    maskedAadhaar: 'XXXX-XXXX-4410',
    gender: 'Female',
    address: 'Door 12-4-9, Anna Salai, Chennai, TN - 600002',
    parentName: 'Ramanathan Sundaram (Father)',
    abcId: 'ABC-4410-2026',
    govtCertificates: {
      dobCert: 'VERIFIED (Greater Chennai Corp)',
      aadhaarStatus: 'VERIFIED (UIDAIADV)',
      casteCertStatus: 'VERIFIED (OC)',
      incomeCertStatus: 'VERIFIED (Salaried)',
      nativityStatus: 'VERIFIED (Tamil Nadu)'
    },
    academicHistory: {
      school: {
        schoolName: 'St. Joseph Higher Secondary School',
        board: 'State Board of Secondary Education',
        completedClass: 'Class 10 (SSLC)',
        passingYear: '2021',
        regNumber: 'TN-SSLC-2021-401',
        status: 'VERIFIED',
        certName: '10th Board SSLC Certificate',
        locked: true
      },
      intermediate: {
        institutionName: 'Velammal Higher Secondary College',
        board: 'Tamil Nadu Higher Sec Board',
        stream: 'BiPC (Biology, Physics, Chemistry)',
        passingYear: '2023',
        regNumber: 'TN-HSC-2023-902',
        status: 'VERIFIED',
        certName: '12th HSC Marksheet',
        locked: true
      },
      college: {
        university: 'Anna University',
        collegeName: 'Madras Institute of Technology',
        collegeCode: 'MIT-CHE-04',
        course: 'B.E.',
        programType: 'UG',
        department: 'ECE',
        year: '2nd Year',
        admissionYear: '2023',
        rollNo: '2026-ECE-042',
        regNumber: 'ANNA-UG-2023-1104',
        academicPeriod: '2023 - 2027',
        status: 'CURRENTLY STUDYING',
        certName: 'College Bonafide & Marksheet',
        locked: false
      },
      skills: []
    }
  }
};

export default function EduCitizenVerificationPanel({ eduType = 'college', onSyncVault }) {
  const [searchQuery, setSearchQuery] = useState('CIV-DEMO-10001');
  const [selectedStudent, setSelectedStudent] = useState(CONNECTED_STUDENT_PROFILES['CIV-DEMO-10001']);
  const [searchError, setSearchError] = useState('');
  const [activeTab, setActiveTab] = useState('timeline'); // 'identity' | 'current' | 'previous' | 'timeline' | 'certs'

  // Cert Locks state
  const [lockedCerts, setLockedCerts] = useState({
    '10TH': true,
    '12TH': true,
    'DEGREE': false
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError('');
    const cleanQ = searchQuery.trim().toUpperCase();

    let found = CONNECTED_STUDENT_PROFILES[cleanQ];
    if (!found) {
      found = Object.values(CONNECTED_STUDENT_PROFILES).find(
        c => c.fullName.toUpperCase().includes(cleanQ) || c.citizenId.includes(cleanQ)
      );
    }

    if (found) {
      setSelectedStudent(found);
    } else {
      setSearchError('Student record not found. Search using CIV-DEMO-10001 or CIV-DEMO-10002.');
    }
  };

  const toggleLock = (certKey) => {
    const nextState = !lockedCerts[certKey];
    setLockedCerts({ ...lockedCerts, [certKey]: nextState });
    if (onSyncVault) {
      onSyncVault(`Certificate ${certKey} ${nextState ? '🔒 LOCKED' : '🔓 UNLOCKED'} for Academic Year 2026`);
    }
  };

  const history = selectedStudent?.academicHistory;

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '18px'
    }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} color="#059669" /> Cross-Institution Verification
          </h3>
          <p style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Citizen ID Academic History Vault ({eduType.toUpperCase()} Scoped)
          </p>
        </div>
        <span style={{
          backgroundColor: '#ECFDF5',
          color: '#065F46',
          fontSize: '0.7rem',
          fontWeight: 800,
          padding: '4px 10px',
          borderRadius: '12px',
          border: '1px solid #A7F3D0'
        }}>
          {eduType.toUpperCase()} LEVEL
        </span>
      </div>

      {/* Citizen ID Search Box */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter Citizen ID (e.g. CIV-DEMO-10001)..."
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
        <button
          type="submit"
          style={{
            backgroundColor: '#059669',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '0 16px',
            fontWeight: 700,
            fontSize: '0.825rem',
            cursor: 'pointer'
          }}
        >
          Retrieve
        </button>
      </form>

      {searchError && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '8px 12px', borderRadius: '10px', fontSize: '0.8rem' }}>
          {searchError}
        </div>
      )}

      {/* Student Profile Content */}
      {selectedStudent && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Identity Bar */}
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#059669' }}>
                  {selectedStudent.citizenId}
                </span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '2px 0' }}>
                  {selectedStudent.fullName}
                </h4>
                <div style={{ fontSize: '0.775rem', color: '#64748B', display: 'flex', gap: '12px' }}>
                  <span>DOB: <strong>{selectedStudent.dob}</strong></span>
                  <span>Aadhaar: <strong>{selectedStudent.maskedAadhaar}</strong></span>
                </div>
              </div>
              <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '8px' }}>
                ABC ID: {selectedStudent.abcId}
              </span>
            </div>
          </div>

          {/* Tab Navigation Controls */}
          <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0', gap: '4px' }}>
            {[
              { id: 'timeline', label: 'Timeline' },
              { id: 'identity', label: 'Identity & DOB' },
              { id: 'current', label: 'Current Edu' },
              { id: 'previous', label: 'Previous Edu' },
              { id: 'certs', label: 'Cert Vault' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2.5px solid #059669' : '2.5px solid transparent',
                  color: activeTab === tab.id ? '#059669' : '#64748B',
                  backgroundColor: 'transparent',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: VISUAL ACADEMIC TIMELINE */}
          {activeTab === 'timeline' && (
            <AcademicTimeline academicHistory={history} eduType={eduType} />
          )}

          {/* TAB 2: IDENTITY & DOB */}
          {activeTab === 'identity' && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.825rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>Full Legal Name:</strong> {selectedStudent.fullName}</div>
              <div><strong>Date of Birth:</strong> {selectedStudent.dob} (Verified via Birth Registry)</div>
              <div><strong>Masked Aadhaar:</strong> {selectedStudent.maskedAadhaar}</div>
              <div><strong>Gender:</strong> {selectedStudent.gender}</div>
              <div><strong>Parent / Guardian:</strong> {selectedStudent.parentName}</div>
              <div><strong>Residential Address:</strong> {selectedStudent.address}</div>

              <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '8px', marginTop: '4px' }}>
                <strong style={{ color: '#0F172A' }}>Government Certificate Verification Status:</strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  <span style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                    DOB: {selectedStudent.govtCertificates.dobCert}
                  </span>
                  <span style={{ backgroundColor: '#E0F2FE', color: '#0369A1', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                    Caste: {selectedStudent.govtCertificates.casteCertStatus}
                  </span>
                  <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                    Income: {selectedStudent.govtCertificates.incomeCertStatus}
                  </span>
                  <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '6px' }}>
                    Nativity: {selectedStudent.govtCertificates.nativityStatus}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CURRENT EDUCATION */}
          {activeTab === 'current' && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.825rem' }}>
              {eduType === 'college' && history?.college && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#059669', marginBottom: '8px' }}>
                    Current Higher Education (College / University)
                  </h4>
                  <div><strong>University:</strong> {history.college.university}</div>
                  <div><strong>College:</strong> {history.college.collegeName} ({history.college.collegeCode})</div>
                  <div><strong>Program Level:</strong> <span style={{ backgroundColor: '#ECFDF5', color: '#065F46', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>{history.college.programType}</span> • <strong>Course:</strong> {history.college.course}</div>
                  <div><strong>Department:</strong> {history.college.department}</div>
                  <div><strong>Current Year:</strong> {history.college.year}</div>
                  <div><strong>Roll Number:</strong> {history.college.rollNo}</div>
                  <div><strong>Admission Year:</strong> {history.college.admissionYear}</div>
                </div>
              )}

              {eduType === 'intermediate' && history?.intermediate && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#7C3AED', marginBottom: '8px' }}>
                    Current Intermediate / PUC Record
                  </h4>
                  <div><strong>Institution:</strong> {history.intermediate.institutionName}</div>
                  <div><strong>Board:</strong> {history.intermediate.board}</div>
                  <div><strong>Stream:</strong> {history.intermediate.stream}</div>
                  <div><strong>Passing Year:</strong> {history.intermediate.passingYear}</div>
                  <div><strong>Registration Number:</strong> {history.intermediate.regNumber}</div>
                </div>
              )}

              {eduType === 'school' && history?.school && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0284C7', marginBottom: '8px' }}>
                    Current School Education Record
                  </h4>
                  <div><strong>School:</strong> {history.school.schoolName}</div>
                  <div><strong>Board:</strong> {history.school.board}</div>
                  <div><strong>Class Completed:</strong> {history.school.completedClass}</div>
                  <div><strong>Passing Year:</strong> {history.school.passingYear}</div>
                  <div><strong>Registration Number:</strong> {history.school.regNumber}</div>
                </div>
              )}

              {eduType === 'technology' && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#D97706', marginBottom: '8px' }}>
                    Technology Skill Certification Enrollment
                  </h4>
                  <div><strong>Certified Training Institution:</strong> National Skill Development &amp; Tech Center</div>
                  <div><strong>Skill Program:</strong> Advanced Technical Skill Certification</div>
                  <div><strong>Status:</strong> Active Learner (Simulated Sync Enabled)</div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PREVIOUS EDUCATION (SCOPED ACCESS CONTROL - SECTION 15) */}
          {activeTab === 'previous' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* College sees Intermediate & School */}
              {eduType === 'college' && (
                <>
                  {/* Previous Intermediate */}
                  <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 800, color: '#7C3AED', marginBottom: '4px' }}>
                      Previous Education: PUC / Intermediate (+12)
                    </div>
                    <div><strong>Institution:</strong> {history?.intermediate?.institutionName}</div>
                    <div><strong>Board:</strong> {history?.intermediate?.board} • <strong>Stream:</strong> {history?.intermediate?.stream}</div>
                    <div><strong>Passing Year:</strong> {history?.intermediate?.passingYear} • <strong>Status:</strong> ✓ Verified</div>
                  </div>

                  {/* Previous School */}
                  <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 800, color: '#0284C7', marginBottom: '4px' }}>
                      Previous Education: School (10th / SSC)
                    </div>
                    <div><strong>School:</strong> {history?.school?.schoolName}</div>
                    <div><strong>Board:</strong> {history?.school?.board} • <strong>Class:</strong> {history?.school?.completedClass}</div>
                    <div><strong>Passing Year:</strong> {history?.school?.passingYear} • <strong>Status:</strong> ✓ Verified</div>
                  </div>
                </>
              )}

              {/* PUC sees Previous School ONLY (Section 9) */}
              {eduType === 'intermediate' && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 800, color: '#0284C7', marginBottom: '4px' }}>
                    Previous Education: School (10th / SSC)
                  </div>
                  <div><strong>School:</strong> {history?.school?.schoolName}</div>
                  <div><strong>Board:</strong> {history?.school?.board} • <strong>Class:</strong> {history?.school?.completedClass}</div>
                  <div><strong>Passing Year:</strong> {history?.school?.passingYear} • <strong>Status:</strong> ✓ Verified</div>
                  <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '6px', fontStyle: 'italic' }}>
                    Note: Future college/UG/PG records are hidden from PUC access per security policy.
                  </div>
                </div>
              )}

              {/* School sees Previous School Only (Section 15) */}
              {eduType === 'school' && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 800, color: '#0284C7', marginBottom: '4px' }}>
                    Primary / Secondary Progress
                  </div>
                  <div><strong>School:</strong> {history?.school?.schoolName}</div>
                  <div><strong>Board:</strong> {history?.school?.board} • <strong>Completed Class:</strong> 10th</div>
                  <div style={{ fontSize: '0.725rem', color: '#64748B', marginTop: '6px', fontStyle: 'italic' }}>
                    Note: Higher educational records (PUC/UG/PG) are strictly restricted from school access.
                  </div>
                </div>
              )}

              {/* Tech sees Relevant Qualifications */}
              {eduType === 'technology' && (
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.8rem' }}>
                  <div style={{ fontWeight: 800, color: '#059669', marginBottom: '4px' }}>
                    Verified Academic Qualifications
                  </div>
                  <div><strong>Highest Academic Level:</strong> {history?.college?.course} ({history?.college?.department})</div>
                  <div><strong>Institution:</strong> {history?.college?.collegeName}</div>
                  <div><strong>Intermediate Stream:</strong> {history?.intermediate?.stream}</div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CERTIFICATE VAULT & LOCKING */}
          {activeTab === 'certs' && (
            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
                Academic Certificate Vault &amp; Locking System
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* 10th Cert */}
                <div style={{ backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>10th Secondary Board Marksheet</div>
                    <div style={{ fontSize: '0.725rem', color: '#64748B' }}>Issuer: {history?.school?.board} ({history?.school?.passingYear})</div>
                  </div>
                  <button
                    onClick={() => toggleLock('10TH')}
                    style={{
                      backgroundColor: lockedCerts['10TH'] ? '#FEF2F2' : '#EFF6FF',
                      color: lockedCerts['10TH'] ? '#991B1B' : '#1E40AF',
                      border: '1px solid',
                      borderColor: lockedCerts['10TH'] ? '#FCA5A5' : '#BFDBFE',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {lockedCerts['10TH'] ? '🔒 Locked (2026)' : 'Unlock'}
                  </button>
                </div>

                {/* 12th Cert */}
                {(eduType === 'intermediate' || eduType === 'college' || eduType === 'technology') && (
                  <div style={{ backgroundColor: '#FFFFFF', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>12th Intermediate Marksheet</div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B' }}>Issuer: {history?.intermediate?.board} ({history?.intermediate?.passingYear})</div>
                    </div>
                    <button
                      onClick={() => toggleLock('12TH')}
                      style={{
                        backgroundColor: lockedCerts['12TH'] ? '#FEF2F2' : '#EFF6FF',
                        color: lockedCerts['12TH'] ? '#991B1B' : '#1E40AF',
                        border: '1px solid',
                        borderColor: lockedCerts['12TH'] ? '#FCA5A5' : '#BFDBFE',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '0.725rem',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      {lockedCerts['12TH'] ? '🔒 Locked (2026)' : 'Unlock'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
