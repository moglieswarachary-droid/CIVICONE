// src/components/organization/PrivateSectorPortals.jsx - Private Sector Portals & Router Integration

import React, { useState } from 'react';
import CompanyLogin from './CompanyLogin.jsx';
import EmployerDashboardLayout from './EmployerDashboardLayout.jsx';
import { ORGANIZATION_CONFIGS } from '../../config/organizationConfig.js';

// --- MOCK PRIVATE SECTOR DATASETS ---
const PRIVATE_SECTOR_DATASETS = {
  company_employer: {
    stats: [
      { label: 'Active System', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Employees', value: '1,240', color: '#0F172A' },
      { label: 'Active Employees', value: '1,150', color: '#0284C7' },
      { label: 'New Onboarded', value: '35', color: '#7C3AED' },
      { label: 'Pending Verification', value: '12', color: '#D97706' },
      { label: 'Verified Employees', value: '1,138', color: '#166534' },
      { label: 'Former Employees', value: '90', color: '#64748B' },
      { label: 'Verification Requests', value: '18 Active', color: '#2563EB' }
    ],
    employeeRecords: [
      {
        id: 'EMP-2026-001',
        citizenId: 'CIV-DEMO-10001',
        name: 'Rajesh Kumar Sharma',
        department: 'Engineering',
        designation: 'AI/ML Senior Engineer',
        joiningDate: '15/01/2026',
        employmentStatus: 'Active',
        verificationStatus: 'Verified',
        employmentType: 'Full Time',
        workLocation: 'Vijayawada Innovation Hub',
        manager: 'Srinivas Rao'
      },
      {
        id: 'EMP-2026-002',
        citizenId: 'CIV-DEMO-10002',
        name: 'Priya Sundaram',
        department: 'Engineering',
        designation: 'Frontend Specialist',
        joiningDate: '14/02/2026',
        employmentStatus: 'Active',
        verificationStatus: 'Verified',
        employmentType: 'Full Time',
        workLocation: 'Guntur Development Center',
        manager: 'Anand Varma'
      }
    ]
  }
};

export default function PrivateSectorPortals({ companyId = 'company_employer', onReturnHome }) {
  const config = ORGANIZATION_CONFIGS['company_employer'] || ORGANIZATION_CONFIGS['company'];
  const dataset = PRIVATE_SECTOR_DATASETS['company_employer'];

  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  if (!authenticatedUser) {
    return (
      <CompanyLogin
        orgConfig={config}
        onLoginSuccess={(user) => setAuthenticatedUser(user)}
        onGoBack={onReturnHome}
      />
    );
  }

  return (
    <EmployerDashboardLayout
      session={authenticatedUser}
      config={config}
      stats={dataset.stats}
      employeeRecords={dataset.employeeRecords}
      onLogout={() => setAuthenticatedUser(null)}
      onReturnHome={onReturnHome}
    />
  );
}
