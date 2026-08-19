// src/App.jsx - Main Application Router & State-Wise Organization Portal Gateway

import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import PreEntryGate from './components/PreEntryGate.jsx';
import CitizenDashboard from './components/CitizenDashboard.jsx';
import OrganizationGate from './components/OrganizationGate.jsx';
import OrganizationPortal from './components/OrganizationPortal.jsx';
import AuthorityGate from './components/AuthorityGate.jsx';
import AuthorityPortal from './components/AuthorityPortal.jsx';
import PolicePortal from './components/PolicePortal.jsx';
import AdminGate from './components/AdminGate.jsx';
import AdminPortal from './components/AdminPortal.jsx';
import PublicQRVerification from './components/PublicQRVerification.jsx';
import DesktopWorkstationGuard from './components/DesktopWorkstationGuard.jsx';

const DEFAULT_OFFICIAL_CITIZEN = {
  id: 'cit-9000000001',
  citizenId: 'CIV-AP-710646-823',
  civicId: 'CIV-AP-710646-823',
  fullName: 'Raghavendra',
  displayName: 'Raghavendra',
  name: 'Raghavendra',
  mobile: '+91 90000 00001',
  email: 'raghavendra.demo@civicone.gov.in',
  dateOfBirth: '15/08/1995',
  dob: '15/08/1995',
  gender: 'Male',
  state: 'Andhra Pradesh',
  address: 'Door 4-12, MG Road, Vijayawada, Andhra Pradesh 520002',
  tier: 'STANDARD',
  goldPassStatus: 'standard',
  verificationStatus: 'Verified Citizen',
  identityStatus: 'Verified',
  maskedAadhaar: 'XXXX XXXX 8234',
  isDemo: true,
  demoLabel: 'OFFICIAL CITIZEN PROFILE'
};

export default function App() {
  // Views: 'landing' | 'gate' | 'citizen' | 'organization-gate' | 'organization' | 'authority-gate' | 'authority' | 'police' | 'admin-gate' | 'admin' | 'verify'
  const [currentView, setCurrentView] = useState(() => {
    if (typeof window !== 'undefined') {
      const rawHash = window.location.hash.replace('#', '');
      const path = window.location.pathname;
      if (rawHash === 'citizen' || path.startsWith('/citizen')) return 'citizen';
      if (rawHash === 'organization-gate' || rawHash === 'organization-access') return 'organization-gate';
      if (rawHash === 'organization' || rawHash === 'org' || path.startsWith('/org')) return 'organization';
      if (rawHash === 'owner-admin' || rawHash === 'admin' || rawHash === 'admin-gate' || path.startsWith('/owner-admin')) return 'admin-gate';
      if (rawHash === 'police' || rawHash.startsWith('police-') || path.startsWith('/police')) return 'police';
      if (rawHash === 'authority-gate' || rawHash === 'authority' || path.startsWith('/authority')) return 'authority-gate';
      if (rawHash === 'gate' || rawHash === 'citizen-login') return 'gate';
      if (rawHash === 'verify' || path.startsWith('/verify')) return 'verify';
    }
    return 'landing';
  });

  const [authenticatedCitizen, setAuthenticatedCitizen] = useState(() => {
    try {
      const stored = localStorage.getItem('civicone_current_citizen');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    if (typeof window !== 'undefined') {
      const rawHash = window.location.hash.replace('#', '');
      if (rawHash === 'citizen') return DEFAULT_OFFICIAL_CITIZEN;
    }
    return null;
  });

  const [authenticatedOfficer, setAuthenticatedOfficer] = useState(null);
  const [authenticatedAdmin, setAuthenticatedAdmin] = useState(null);
  const [verifyToken, setVerifyToken] = useState('CIV-TOKEN-CIV-DEMO-10001-SECURE-2026');
  const [selectedOrgConfig, setSelectedOrgConfig] = useState(null);

  // Helper to change view and push browser history state
  const changeView = (newView, customHash = '') => {
    setCurrentView(newView);
    const targetHash = customHash || (newView === 'landing' ? '' : `#${newView}`);
    if (window.location.hash !== targetHash) {
      try {
        window.history.pushState({ view: newView }, '', targetHash || window.location.pathname);
      } catch (e) {
        window.location.hash = targetHash;
      }
    }
  };

  // Handle URL Hash, Path Routing, and Owner Keyboard Shortcut (Ctrl + Shift + A)
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const rawHash = window.location.hash.replace('#', '');
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token');

      if (rawHash === 'organization-gate' || rawHash === 'organization-access') {
        setCurrentView('organization-gate');
      } else if (rawHash === 'organization' || rawHash === 'org' || rawHash.startsWith('org-') || path.startsWith('/org')) {
        setCurrentView('organization');
      } else if (rawHash === 'owner-admin' || rawHash === 'admin' || rawHash === 'admin-gate' || path.startsWith('/owner-admin')) {
        setCurrentView('admin-gate');
      } else if (rawHash === 'police' || rawHash.startsWith('police-') || rawHash === 'passport' || rawHash === 'pcc' || path.startsWith('/police') || path.startsWith('/passport')) {
        setCurrentView('police');
      } else if (rawHash === 'authority-gate' || rawHash === 'authority' || path.startsWith('/authority')) {
        setCurrentView('authority-gate');
      } else if (rawHash === 'gate' || rawHash === 'citizen-login') {
        setCurrentView('gate');
      } else if (rawHash === 'citizen') {
        setAuthenticatedCitizen(prev => prev || DEFAULT_OFFICIAL_CITIZEN);
        setCurrentView('citizen');
      } else if (path.startsWith('/verify') || rawHash === 'verify' || token) {
        if (token) setVerifyToken(token);
        setCurrentView('verify');
      } else if (!rawHash) {
        setCurrentView('landing');
      }
    };

    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        changeView('admin-gate');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle Citizen Login Authentication Completion
  const handleAuthSuccess = (citizenData) => {
    try {
      localStorage.setItem('civicone_current_citizen', JSON.stringify(citizenData));
    } catch (e) {}
    setAuthenticatedCitizen(citizenData);
    changeView('citizen');
  };

  // Handle Officer Login Authentication Completion
  const handleOfficerAuthSuccess = (officerData) => {
    setAuthenticatedOfficer(officerData);
    if (officerData.role === 'POLICE_ADMIN' || officerData.department?.includes('Police')) {
      changeView('police');
    } else {
      changeView('authority');
    }
  };

  // Handle Admin Login Authentication Completion
  const handleAdminAuthSuccess = (adminData) => {
    setAuthenticatedAdmin(adminData);
    changeView('admin');
  };

  // Handle Logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('civicone_current_citizen');
    } catch (e) {}
    setAuthenticatedCitizen(null);
    setAuthenticatedOfficer(null);
    setAuthenticatedAdmin(null);
    changeView('landing');
  };

  const handleOpenOrgPortal = (config) => {
    setSelectedOrgConfig(config);
    changeView('organization');
  };

  // Render Current Portal Experience
  switch (currentView) {
    case 'gate':
      return (
        <PreEntryGate
          onAuthenticated={handleAuthSuccess}
          onGoBackToLanding={() => changeView('landing')}
        />
      );

    case 'citizen':
      return authenticatedCitizen ? (
        <CitizenDashboard
          citizen={authenticatedCitizen}
          onLogout={handleLogout}
          onNavigateToVerification={(token) => {
            setVerifyToken(token);
            changeView('verify');
          }}
        />
      ) : (
        <PreEntryGate
          onAuthenticated={handleAuthSuccess}
          onGoBackToLanding={() => changeView('landing')}
        />
      );

    case 'organization-gate':
      return (
        <DesktopWorkstationGuard
          portalType="organization"
          portalTitle="Organization Access Gateway"
          onSwitchToCitizen={() => changeView('gate')}
          onGoBackToLanding={() => changeView('landing')}
        >
          <OrganizationGate
            onAuthenticated={handleOpenOrgPortal}
            onGoBackToLanding={() => changeView('landing')}
            onOpenSuperAdmin={() => changeView('admin-gate')}
          />
        </DesktopWorkstationGuard>
      );

    case 'organization':
      return (
        <DesktopWorkstationGuard
          portalType="organization"
          portalTitle="Organization Verification Workspace"
          onSwitchToCitizen={() => changeView('gate')}
          onGoBackToLanding={() => changeView('landing')}
        >
          <OrganizationPortal
            initialOrgConfig={selectedOrgConfig}
            onReturnHome={() => changeView('organization-gate')}
          />
        </DesktopWorkstationGuard>
      );

    case 'authority-gate':
      return (
        <DesktopWorkstationGuard
          portalType="authority"
          portalTitle="Government Officer Portal Gateway"
          onSwitchToCitizen={() => changeView('gate')}
          onGoBackToLanding={() => changeView('landing')}
        >
          <AuthorityGate
            onAuthenticated={handleOfficerAuthSuccess}
            onGoBackToLanding={() => changeView('landing')}
          />
        </DesktopWorkstationGuard>
      );

    case 'authority':
      return (
        <DesktopWorkstationGuard
          portalType="authority"
          portalTitle="Government Officer Supervision Portal"
          onSwitchToCitizen={() => changeView('gate')}
          onGoBackToLanding={() => changeView('landing')}
        >
          {authenticatedOfficer ? (
            <AuthorityPortal
              officer={authenticatedOfficer}
              onReturnHome={handleLogout}
            />
          ) : (
            <AuthorityGate
              onAuthenticated={handleOfficerAuthSuccess}
              onGoBackToLanding={() => changeView('landing')}
            />
          )}
        </DesktopWorkstationGuard>
      );

    case 'police':
      return (
        <DesktopWorkstationGuard
          portalType="police"
          portalTitle="Police & Law Enforcement Investigation Desk"
          onSwitchToCitizen={() => changeView('gate')}
          onGoBackToLanding={() => changeView('landing')}
        >
          <PolicePortal
            officer={authenticatedOfficer}
            initialState={selectedOrgConfig?.state}
            onReturnHome={handleLogout}
          />
        </DesktopWorkstationGuard>
      );

    case 'admin-gate':
      return (
        <DesktopWorkstationGuard
          portalType="admin"
          portalTitle="Super Admin Control Gate"
          onSwitchToCitizen={() => changeView('gate')}
          onGoBackToLanding={() => changeView('landing')}
        >
          <AdminGate
            onAuthenticated={handleAdminAuthSuccess}
            onGoBackToLanding={() => changeView('landing')}
          />
        </DesktopWorkstationGuard>
      );

    case 'admin':
      return (
        <DesktopWorkstationGuard
          portalType="admin"
          portalTitle="National Super Admin Supervision Console"
          onSwitchToCitizen={() => changeView('gate')}
          onGoBackToLanding={() => changeView('landing')}
        >
          {authenticatedAdmin ? (
            <AdminPortal
              admin={authenticatedAdmin}
              onReturnHome={handleLogout}
            />
          ) : (
            <AdminGate
              onAuthenticated={handleAdminAuthSuccess}
              onGoBackToLanding={() => changeView('landing')}
            />
          )}
        </DesktopWorkstationGuard>
      );

    case 'verify':
      return (
        <PublicQRVerification
          token={verifyToken}
          onBackToPortal={() => {
            if (authenticatedCitizen) {
              changeView('citizen');
            } else {
              changeView('landing');
            }
          }}
        />
      );

    case 'landing':
    default:
      return (
        <LandingPage
          onAccessCivicOne={() => changeView('gate')}
          onOpenAuthorityPortal={() => changeView('authority-gate')}
          onOpenOwnerAdmin={() => changeView('admin-gate')}
          onOpenOrganizationGate={() => changeView('organization-gate')}
        />
      );
  }
}

