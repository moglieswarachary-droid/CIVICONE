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

export default function App() {
  // Views: 'landing' | 'gate' | 'citizen' | 'organization-gate' | 'organization' | 'authority-gate' | 'authority' | 'police' | 'admin-gate' | 'admin' | 'verify'
  const [currentView, setCurrentView] = useState('landing');
  const [authenticatedCitizen, setAuthenticatedCitizen] = useState(null);
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
        <OrganizationGate
          onAuthenticated={handleOpenOrgPortal}
          onGoBackToLanding={() => changeView('landing')}
          onOpenSuperAdmin={() => changeView('admin-gate')}
        />
      );

    case 'organization':
      return (
        <OrganizationPortal
          initialOrgConfig={selectedOrgConfig}
          onReturnHome={() => changeView('organization-gate')}
        />
      );

    case 'authority-gate':
      return (
        <AuthorityGate
          onAuthenticated={handleOfficerAuthSuccess}
          onGoBackToLanding={() => changeView('landing')}
        />
      );

    case 'authority':
      return authenticatedOfficer ? (
        <AuthorityPortal
          officer={authenticatedOfficer}
          onReturnHome={handleLogout}
        />
      ) : (
        <AuthorityGate
          onAuthenticated={handleOfficerAuthSuccess}
          onGoBackToLanding={() => changeView('landing')}
        />
      );

    case 'police':
      return (
        <PolicePortal
          officer={authenticatedOfficer}
          initialState={selectedOrgConfig?.state}
          onReturnHome={handleLogout}
        />
      );

    case 'admin-gate':
      return (
        <AdminGate
          onAuthenticated={handleAdminAuthSuccess}
          onGoBackToLanding={() => changeView('landing')}
        />
      );

    case 'admin':
      return authenticatedAdmin ? (
        <AdminPortal
          admin={authenticatedAdmin}
          onReturnHome={handleLogout}
        />
      ) : (
        <AdminGate
          onAuthenticated={handleAdminAuthSuccess}
          onGoBackToLanding={() => changeView('landing')}
        />
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
