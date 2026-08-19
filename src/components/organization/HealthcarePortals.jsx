// src/components/organization/HealthcarePortals.jsx - Healthcare Sector Portals & Router Integration (Government & Private Hospital Only)

import React, { useState } from 'react';
import HospitalLogin from './HospitalLogin.jsx';
import HospitalDashboardLayout from './HospitalDashboardLayout.jsx';
import { ORGANIZATION_CONFIGS } from '../../config/organizationConfig.js';

// --- MOCK HEALTHCARE DATASETS ---
const HEALTHCARE_DATASETS = {
  gov_hospital: {
    stats: [
      { label: 'Active System', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Patients', value: '1,420', color: '#0F172A' },
      { label: 'Active Inpatients', value: '310', color: '#0284C7' },
      { label: 'Emergency Patients', value: '48', color: '#DC2626' },
      { label: 'Critical Cases', value: '14', color: '#991B1B' },
      { label: 'Blood Requests', value: '12 Units', color: '#D97706' },
      { label: 'Transfers', value: '8 Issued', color: '#7C3AED' }
    ],
    departments: ['Emergency', 'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Surgery', 'Gynecology'],
    patients: [
      { id: 'PAT-GH-01', patientId: 'PAT-GH-2026-001', citizenId: 'CIV-DEMO-10001', name: 'Rajesh Kumar Sharma', bloodGroup: 'O+', department: 'Emergency', caseType: 'Accident Emergency', severity: 'Critical', status: 'UNDER TREATMENT', admissionDate: '19/08/2026' },
      { id: 'PAT-GH-02', patientId: 'PAT-GH-2026-042', citizenId: 'CIV-DEMO-10002', name: 'Priya Sundaram', bloodGroup: 'B+', department: 'General Medicine', caseType: 'Acute Health Issue', severity: 'Moderate', status: 'ADMITTED', admissionDate: '18/08/2026' },
      { id: 'PAT-GH-03', patientId: 'PAT-GH-2026-990', citizenId: 'CIV-DEMO-10001', name: 'Venkatesh Rao (Demo)', bloodGroup: 'AB+', department: 'ICU / Forensic', caseType: 'Restricted Record', severity: 'Deceased', status: 'DEATH RECORD', admissionDate: '15/08/2026' }
    ],
    bloodRequirements: [
      { bloodGroup: 'O+', units: 4, urgency: 'URGENT', dept: 'Trauma Emergency' },
      { bloodGroup: 'B-', units: 2, urgency: 'PENDING', dept: 'Cardiology Surgery' }
    ],
    bloodDonors: [
      { name: 'K. Ramesh (Donor)', bloodGroup: 'O+', location: 'Vijayawada Central', maskedPhone: '******7890', availability: 'AVAILABLE' },
      { name: 'S. Anitha (Donor)', bloodGroup: 'B+', location: 'Guntur City', maskedPhone: '******4412', availability: 'AVAILABLE' }
    ]
  },
  priv_hospital: {
    stats: [
      { label: 'Active System', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Patients', value: '890', color: '#0F172A' },
      { label: 'Inpatient Beds', value: '180', color: '#0284C7' },
      { label: 'Emergency Care', value: '24', color: '#DC2626' },
      { label: 'Insurance Claims', value: '142 Active', color: '#2563EB' },
      { label: 'Blood Requests', value: '6 Units', color: '#D97706' },
      { label: 'Transfers Accepted', value: '5 Completed', color: '#7C3AED' }
    ],
    departments: ['Emergency', 'Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics'],
    patients: [
      { id: 'PAT-PH-01', patientId: 'PAT-PH-2026-102', citizenId: 'CIV-DEMO-10002', name: 'Priya Sundaram', bloodGroup: 'B+', department: 'Cardiology', caseType: 'Acute Health Issue', severity: 'High', status: 'ADMITTED', admissionDate: '19/08/2026' },
      { id: 'PAT-PH-02', patientId: 'PAT-PH-2026-204', citizenId: 'CIV-DEMO-10001', name: 'Rajesh Kumar Sharma', bloodGroup: 'O+', department: 'Emergency', caseType: 'Accident Emergency', severity: 'Critical', status: 'UNDER TREATMENT', admissionDate: '19/08/2026' }
    ],
    bloodRequirements: [
      { bloodGroup: 'B+', units: 3, urgency: 'URGENT', dept: 'Oncology Surgery' }
    ],
    bloodDonors: [
      { name: 'N. Vikram', bloodGroup: 'AB+', location: 'Chennai Salai', maskedPhone: '******9012', availability: 'AVAILABLE' }
    ]
  }
};

export default function HealthcarePortals({ healthId = 'gov_hospital', onReturnHome }) {
  const targetId = healthId === 'priv_hospital' ? 'priv_hospital' : 'gov_hospital';
  const config = ORGANIZATION_CONFIGS[targetId] || ORGANIZATION_CONFIGS['gov_hospital'];
  const dataset = HEALTHCARE_DATASETS[targetId] || HEALTHCARE_DATASETS['gov_hospital'];

  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  if (!authenticatedUser) {
    return (
      <HospitalLogin
        orgConfig={config}
        onLoginSuccess={(user) => setAuthenticatedUser(user)}
        onGoBack={onReturnHome}
      />
    );
  }

  return (
    <HospitalDashboardLayout
      session={authenticatedUser}
      config={config}
      stats={dataset.stats}
      departments={dataset.departments}
      patientRecords={dataset.patients}
      bloodRequirements={dataset.bloodRequirements}
      bloodDonors={dataset.bloodDonors}
      onLogout={() => setAuthenticatedUser(null)}
      onReturnHome={onReturnHome}
    />
  );
}
