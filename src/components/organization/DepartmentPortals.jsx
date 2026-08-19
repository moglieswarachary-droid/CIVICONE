// src/components/organization/DepartmentPortals.jsx - Department-Specific Portals & Router Integration

import React, { useState } from 'react';
import GovDepartmentLogin from './GovDepartmentLogin.jsx';
import GovDepartmentDashboardLayout from './GovDepartmentDashboardLayout.jsx';
import { ORGANIZATION_CONFIGS } from '../../config/organizationConfig.js';

// --- MOCK DEPARTMENT DATASETS ---
const DEPARTMENT_DATASETS = {
  police: {
    stats: [
      { label: 'Active Session', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Cases', value: '142', color: '#0F172A' },
      { label: 'Open Cases', value: '18', color: '#D97706' },
      { label: 'Pending Investigations', value: '9', color: '#DC2626' },
      { label: 'Closed Cases', value: '115', color: '#2563EB' },
      { label: 'FIRs Registered', value: '38', color: '#7C3AED' }
    ],
    filters: ['ALL', 'OPEN', 'PENDING', 'UNDER INVESTIGATION', 'CLOSED', 'FIR', 'CYBER CRIME', 'TRAFFIC'],
    worklist: [
      { id: 'FIR-2026-8910', citizenId: 'CIV-DEMO-10002', title: 'Cyber Fraud Investigation', category: 'CYBER CRIME', status: 'UNDER INVESTIGATION', date: '18/08/2026' },
      { id: 'FIR-2026-8911', citizenId: 'CIV-DEMO-10001', title: 'Traffic Signal Violation & Hit-and-Run Audit', category: 'TRAFFIC', status: 'Closed (Fine Paid)', date: '15/08/2026' },
      { id: 'FIR-2026-8912', citizenId: 'CIV-DEMO-10001', title: 'Commercial Identity Theft & Bank Account Verification', category: 'FIR', status: 'Open', date: '10/08/2026' }
    ]
  },
  rto: {
    stats: [
      { label: 'Active Session', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Applications', value: '840', color: '#0F172A' },
      { label: 'Pending', value: '32', color: '#D97706' },
      { label: 'Approved', value: '780', color: '#2563EB' },
      { label: 'DL Applications', value: '410', color: '#0284C7' },
      { label: 'RC Applications', value: '290', color: '#7C3AED' }
    ],
    filters: ['ALL', 'DRIVING LICENCE (DL)', 'LEARNER LICENCE (LL)', 'REGISTRATION CERTIFICATE (RC)', 'FITNESS CERTIFICATE (FC)'],
    worklist: [
      { id: 'DL-APP-2026-101', citizenId: 'CIV-DEMO-10001', title: 'Driving License Renewal (AP-16-2012-0098123)', category: 'DRIVING LICENCE (DL)', status: 'Approved', date: '17/08/2026' },
      { id: 'RC-APP-2026-102', citizenId: 'CIV-DEMO-10002', title: 'Commercial Vehicle Ownership Transfer', category: 'REGISTRATION CERTIFICATE (RC)', status: 'Pending Verification', date: '16/08/2026' },
      { id: 'FC-APP-2026-103', citizenId: 'CIV-DEMO-10001', title: 'Transport Vehicle Fitness Certificate Audit', category: 'FITNESS CERTIFICATE (FC)', status: 'Approved', date: '12/08/2026' }
    ]
  },
  passport: {
    stats: [
      { label: 'Active Session', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Applications', value: '520', color: '#0F172A' },
      { label: 'Pending', value: '14', color: '#D97706' },
      { label: 'Verified', value: '480', color: '#2563EB' },
      { label: 'PCC Applications', value: '140', color: '#7C3AED' }
    ],
    filters: ['ALL', 'FRESH PASSPORT', 'PASSPORT RE-ISSUE', 'TATKAAL', 'PCC', 'ADDRESS VERIFICATION'],
    worklist: [
      { id: 'PASS-VJA-2026-901', citizenId: 'CIV-DEMO-10001', title: 'Fresh Tatkaal Passport Verification', category: 'TATKAAL', status: 'Verified', date: '18/08/2026' },
      { id: 'PCC-VJA-2026-902', citizenId: 'CIV-DEMO-10002', title: 'Police Clearance Certificate (PCC) for Overseas Employment', category: 'PCC', status: 'Pending Verification', date: '14/08/2026' }
    ]
  },
  revenue: {
    stats: [
      { label: 'Active Session', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Applications', value: '610', color: '#0F172A' },
      { label: 'Land Records', value: '340', color: '#0284C7' },
      { label: 'Property Records', value: '210', color: '#7C3AED' },
      { label: 'Certificate Requests', value: '60', color: '#2563EB' }
    ],
    filters: ['ALL', 'PROPERTY VERIFICATION', 'LAND RECORD', 'OWNERSHIP', 'ENCUMBRANCE', 'RESIDENCE CERTIFICATE'],
    worklist: [
      { id: 'REV-PROP-2026-401', citizenId: 'CIV-DEMO-10001', title: 'Encumbrance Certificate & Title Audit (Survey No. 402/1)', category: 'PROPERTY VERIFICATION', status: 'VERIFIED', date: '17/08/2026' },
      { id: 'REV-LAND-2026-402', citizenId: 'CIV-DEMO-10002', title: 'Patta Mutation & Agricultural Land Verification', category: 'LAND RECORD', status: 'Pending', date: '11/08/2026' }
    ]
  },
  election: {
    stats: [
      { label: 'Active Session', value: 'ONLINE', color: '#16A34A' },
      { label: 'Voter Applications', value: '920', color: '#0F172A' },
      { label: 'Pending Verification', value: '45', color: '#D97706' },
      { label: 'Verified Voters', value: '875', color: '#2563EB' }
    ],
    filters: ['ALL', 'NEW VOTER REGISTRATION', 'VOTER ID CORRECTION', 'ADDRESS CHANGE', 'TRANSFER', 'DELETION'],
    worklist: [
      { id: 'ECI-VOTER-2026-501', citizenId: 'CIV-DEMO-10001', title: 'New Voter Registration Form 6 (Ward 14 Vijayawada)', category: 'NEW VOTER REGISTRATION', status: 'Verified', date: '15/08/2026' },
      { id: 'ECI-VOTER-2026-502', citizenId: 'CIV-DEMO-10002', title: 'Voter ID Address Correction & Electoral Roll Update', category: 'VOTER ID CORRECTION', status: 'Pending', date: '10/08/2026' }
    ]
  },
  identity_authority: {
    stats: [
      { label: 'Active Session', value: 'ONLINE', color: '#16A34A' },
      { label: 'Verification Requests', value: '1,240', color: '#0F172A' },
      { label: 'Pending', value: '18', color: '#D97706' },
      { label: 'Verified Citizens', value: '1,200', color: '#2563EB' },
      { label: 'Identity Updates', value: '310', color: '#7C3AED' }
    ],
    filters: ['ALL', 'IDENTITY VERIFICATION', 'ADDRESS VERIFICATION', 'DEMOGRAPHIC UPDATE', 'MOBILE UPDATE'],
    worklist: [
      { id: 'UID-UPD-2026-101', citizenId: 'CIV-DEMO-10001', title: 'Demographic Mobile & Address Update Verification', category: 'DEMOGRAPHIC UPDATE', status: 'VERIFIED', date: '18/08/2026' },
      { id: 'UID-ADV-2026-102', citizenId: 'CIV-DEMO-10002', title: 'Tokenized eKYC Token Audit (ADV Token)', category: 'IDENTITY VERIFICATION', status: 'VERIFIED', date: '13/08/2026' }
    ]
  },
  municipal: {
    stats: [
      { label: 'Active Session', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Services & Requests', value: '380', color: '#0F172A' },
      { label: 'Farming & Seedings Apps', value: '140', color: '#0284C7' },
      { label: 'Cleaning & Water Issues', value: '240', color: '#7C3AED' }
    ],
    filters: ['ALL', 'FARMING', 'SEEDINGS', 'CLEANING', 'WATER'],
    worklist: [
      { id: 'MUN-FARM-2026-701', citizenId: 'CIV-DEMO-10001', title: 'Farming & Irrigation Scheme Assistance', category: 'FARMING', status: 'Approved', date: '18/08/2026' },
      { id: 'MUN-SEED-2026-702', citizenId: 'CIV-DEMO-10002', title: 'Subsidized Seedings Distribution & Soil Audit', category: 'SEEDINGS', status: 'Pending Verification', date: '17/08/2026' },
      { id: 'MUN-CLN-2026-703', citizenId: 'CIV-DEMO-10001', title: 'Public Area & Agricultural Drain Cleaning', category: 'CLEANING', status: 'Resolved', date: '15/08/2026' },
      { id: 'MUN-WAT-2026-704', citizenId: 'CIV-DEMO-10002', title: 'Water Supply & Canal Flow Restoration', category: 'WATER', status: 'In Progress', date: '14/08/2026' }
    ]
  }
};

export default function DepartmentPortals({ deptId = 'police', onReturnHome }) {
  const config = ORGANIZATION_CONFIGS[deptId] || ORGANIZATION_CONFIGS['police'];
  const dataset = DEPARTMENT_DATASETS[deptId] || DEPARTMENT_DATASETS['police'];

  const [authenticatedOfficer, setAuthenticatedOfficer] = useState(null);

  if (!authenticatedOfficer) {
    return (
      <GovDepartmentLogin
        orgConfig={config}
        onLoginSuccess={(officer) => setAuthenticatedOfficer(officer)}
        onGoBack={onReturnHome}
      />
    );
  }

  return (
    <GovDepartmentDashboardLayout
      officer={authenticatedOfficer}
      config={config}
      stats={dataset.stats}
      worklist={dataset.worklist}
      worklistFilters={dataset.filters}
      onLogout={() => setAuthenticatedOfficer(null)}
      onReturnHome={onReturnHome}
    />
  );
}
