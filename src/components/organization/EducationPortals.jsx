// src/components/organization/EducationPortals.jsx - Education Sector Portals & Router Integration

import React, { useState } from 'react';
import EduDepartmentLogin from './EduDepartmentLogin.jsx';
import EduDepartmentDashboardLayout from './EduDepartmentDashboardLayout.jsx';
import { ORGANIZATION_CONFIGS } from '../../config/organizationConfig.js';

// --- MOCK CROSS-INSTITUTION DATASETS ---
const EDUCATION_DATASETS = {
  college: {
    stats: [
      { label: 'Active Session', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Students', value: '2,480', color: '#0F172A' },
      { label: 'UG Students', value: '1,940', color: '#0284C7' },
      { label: 'PG Students', value: '540', color: '#7C3AED' },
      { label: 'Pending Verification', value: '18', color: '#D97706' },
      { label: 'Verified Students', value: '2,420', color: '#2563EB' },
      { label: 'Graduated Students', value: '620', color: '#059669' }
    ],
    departments: ['CSE', 'CSE (AI & ML)', 'ECE', 'EEE', 'Mechanical', 'Civil', 'IT', 'MBA', 'MCA'],
    students: [
      { id: 'STU-KEC-101', citizenId: 'CIV-DEMO-10001', rollNo: '2026-CSE-001', name: 'Rajesh Kumar Sharma', programType: 'UG', department: 'CSE (AI & ML)', year: '3rd Year', status: 'CURRENTLY STUDYING' },
      { id: 'STU-KEC-102', citizenId: 'CIV-DEMO-10002', rollNo: '2026-ECE-042', name: 'Priya Sundaram', programType: 'UG', department: 'ECE', year: '2nd Year', status: 'CURRENTLY STUDYING' },
      { id: 'STU-KEC-103', citizenId: 'CIV-DEMO-10001', rollNo: '2026-MBA-012', name: 'Aarav Sharma', programType: 'PG', department: 'MBA', year: '1st Year', status: 'VERIFIED' }
    ]
  },
  intermediate: {
    stats: [
      { label: 'Active Session', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Students', value: '1,200', color: '#0F172A' },
      { label: '1st Year Students', value: '620', color: '#0284C7' },
      { label: '2nd Year Students', value: '580', color: '#7C3AED' },
      { label: 'Pending Verification', value: '12', color: '#D97706' },
      { label: 'Verified 10th SSC', value: '1,188', color: '#2563EB' }
    ],
    departments: ['MPC', 'BiPC', 'MEC', 'CEC', 'Vocational'],
    students: [
      { id: 'INT-AP-01', citizenId: 'CIV-DEMO-10001', rollNo: 'INT-MPC-102', name: 'Rajesh Kumar Sharma', programType: 'Intermediate', department: 'MPC', year: 'Passed 2022', status: 'VERIFIED' },
      { id: 'INT-AP-02', citizenId: 'CIV-DEMO-10002', rollNo: 'INT-BIPC-204', name: 'Priya Sundaram', programType: 'Intermediate', department: 'BiPC', year: 'Passed 2023', status: 'VERIFIED' }
    ]
  },
  school: {
    stats: [
      { label: 'Active Session', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Students', value: '850', color: '#0F172A' },
      { label: 'Primary (1-5)', value: '340', color: '#0284C7' },
      { label: 'Secondary (6-10)', value: '380', color: '#7C3AED' },
      { label: 'Higher Sec (11-12)', value: '130', color: '#059669' },
      { label: 'Verified DOB Certs', value: '842', color: '#D97706' }
    ],
    departments: ['Class 10', 'Class 9', 'Class 8', 'Class 7', 'Class 6', 'Class 5', 'Class 12'],
    students: [
      { id: 'SCH-CBSE-01', citizenId: 'CIV-DEMO-10001', rollNo: 'ROLL-10A-14', name: 'Rajesh Kumar Sharma', programType: 'School', department: 'Class 10', year: 'Passed 2020', status: 'VERIFIED' },
      { id: 'SCH-CBSE-02', citizenId: 'CIV-DEMO-10002', rollNo: 'ROLL-12B-08', name: 'Priya Sundaram', programType: 'School', department: 'Class 10', year: 'Passed 2021', status: 'VERIFIED' }
    ]
  },
  technology: {
    stats: [
      { label: 'Active Session', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Learners', value: '640', color: '#0F172A' },
      { label: 'Active Learners', value: '480', color: '#0284C7' },
      { label: 'Completed Courses', value: '160', color: '#7C3AED' },
      { label: 'Pending Verification', value: '6', color: '#D97706' },
      { label: 'Certificates Issued', value: '154', color: '#059669' }
    ],
    departments: ['Full Stack Dev', 'AI & Machine Learning', 'Cloud Computing', 'Cybersecurity', 'Data Science'],
    students: [
      { id: 'TECH-SKILL-01', citizenId: 'CIV-DEMO-10001', rollNo: 'PY-2026-001', name: 'Rajesh Kumar Sharma', programType: 'Skill Cert', department: 'Python & AI Programming', year: 'Batch 2026', status: 'VERIFIED' },
      { id: 'TECH-SKILL-02', citizenId: 'CIV-DEMO-10002', rollNo: 'FS-2026-088', name: 'Priya Sundaram', programType: 'Skill Cert', department: 'Full Stack Web Dev', year: 'Batch 2026', status: 'VERIFIED' }
    ]
  }
};

export default function EducationPortals({ eduId = 'college', onReturnHome }) {
  const config = ORGANIZATION_CONFIGS[eduId] || ORGANIZATION_CONFIGS['college'];
  const dataset = EDUCATION_DATASETS[eduId] || EDUCATION_DATASETS['college'];

  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  if (!authenticatedUser) {
    return (
      <EduDepartmentLogin
        orgConfig={config}
        onLoginSuccess={(user) => setAuthenticatedUser(user)}
        onGoBack={onReturnHome}
      />
    );
  }

  return (
    <EduDepartmentDashboardLayout
      session={authenticatedUser}
      config={config}
      stats={dataset.stats}
      departmentsOrClasses={dataset.departments}
      studentRecords={dataset.students}
      onLogout={() => setAuthenticatedUser(null)}
      onReturnHome={onReturnHome}
    />
  );
}
