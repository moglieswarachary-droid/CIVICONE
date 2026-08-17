// src/components/OrganizationPortal.jsx - Independent Organization Portal Workspace

import React from 'react';
import OrganizationDashboard from './organization/OrganizationDashboard.jsx';

export default function OrganizationPortal({ initialOrgConfig, onReturnHome }) {
  const session = {
    orgId: initialOrgConfig?.orgId || initialOrgConfig?.orgType || 'police',
    orgSlug: initialOrgConfig?.orgSlug || initialOrgConfig?.orgType || 'police',
    name: initialOrgConfig?.name || 'CivicOne Organization Verification Portal',
    sector: initialOrgConfig?.sector || 'government',
    sectorTitle: initialOrgConfig?.sectorTitle || 'Government',
    state: initialOrgConfig?.state || 'Andhra Pradesh',
    role: initialOrgConfig?.role || initialOrgConfig?.roleCode || 'AUTHORIZED_OFFICER',
    officialEmail: initialOrgConfig?.officialEmail || 'officer@civicone.org.in',
    capabilities: initialOrgConfig?.capabilities || [
      'Identity Verification',
      'Credential Verification',
      'Authorized Access',
      'Verification Requests',
      'Verification History'
    ],
    allowedCategories: initialOrgConfig?.allowedCategories || ['Identity', 'Education', 'Finance'],
    allowedDocTypes: initialOrgConfig?.allowedDocTypes || ['Identity Status', 'Verification Certificate']
  };

  return (
    <OrganizationDashboard
      session={session}
      onLogout={onReturnHome}
    />
  );
}
