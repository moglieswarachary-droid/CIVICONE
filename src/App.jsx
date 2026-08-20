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
import { authStorage } from './services/api.js';

export default function App() {
  // Views: 'landing' | 'gate' | 'citizen' | 'organization-gate' | 'organization' | 'authority-gate' | 'authority' | 'police' | 'admin-gate' | 'admin' | 'verify'
  const [currentView, setCurrentView] = useState('landing');
  const [authenticatedCitizen, setAuthenticatedCitizen] = useState(() => {
    try {
      const active = localStorage.getItem('civiqone_active_citizen');
      if (active) return JSON.parse(active);
    } catch (e) {}
    return null;
  });
  const [authenticatedOfficer, setAuthenticatedOfficer] = useState(null);
  const [authenticatedAdmin, setAuthenticatedAdmin] = useState(null);
  const [verifyToken, setVerifyToken] = useState('CIV-TOKEN-CIV-DEMO-10001-SECURE-2026');
  const [selectedOrgConfig, setSelectedOrgConfig] = useState(null);

  // Global Persistent Theme State (Synced across all portals and gates)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('civiqone_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('civiqone_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

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

      let activeCitizenData = authenticatedCitizen;
      if (!activeCitizenData) {
        try {
          const cached = localStorage.getItem('civiqone_active_citizen');
          if (cached) activeCitizenData = JSON.parse(cached);
        } catch (e) {}
      }

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
      } else if (rawHash === 'citizen' || rawHash.startsWith('citizen')) {
        if (activeCitizenData) {
          setCurrentView('citizen');
        } else {
          setCurrentView('gate');
        }
      } else if (path.startsWith('/verify') || rawHash === 'verify' || token) {
        if (token) setVerifyToken(token);
        setCurrentView('verify');
      } else {
        // Direct URL visit without hash or explicit landing
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
    try {
      localStorage.setItem('civiqone_active_citizen', JSON.stringify(citizenData));
      if (citizenData?.citizenId) {
        localStorage.setItem(`civiqone_citizen_${citizenData.citizenId}`, JSON.stringify(citizenData));
      }
    } catch (e) {}
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
    try {
      localStorage.removeItem('civiqone_active_citizen');
      authStorage.clearToken();
    } catch (e) {}
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
          theme={theme}
          onToggleTheme={toggleTheme}
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
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      ) : (
        <PreEntryGate
          onAuthenticated={handleAuthSuccess}
          onGoBackToLanding={() => changeView('landing')}
          theme={theme}
          onToggleTheme={toggleTheme}
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
            theme={theme}
            onToggleTheme={toggleTheme}
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
            theme={theme}
            onToggleTheme={toggleTheme}
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
            theme={theme}
            onToggleTheme={toggleTheme}
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
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          ) : (
            <AuthorityGate
              onAuthenticated={handleOfficerAuthSuccess}
              onGoBackToLanding={() => changeView('landing')}
              theme={theme}
              onToggleTheme={toggleTheme}
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
            theme={theme}
            onToggleTheme={toggleTheme}
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
            theme={theme}
            onToggleTheme={toggleTheme}
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
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          ) : (
            <AdminGate
              onAuthenticated={handleAdminAuthSuccess}
              onGoBackToLanding={() => changeView('landing')}
              theme={theme}
              onToggleTheme={toggleTheme}
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
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      );

    case 'landing':
    default:
      return (
        <LandingPage
          onAccessCIVIQONE={() => changeView('gate')}
          onOpenAuthorityPortal={() => changeView('authority-gate')}
          onOpenOwnerAdmin={() => changeView('admin-gate')}
          onOpenOrganizationGate={() => changeView('organization-gate')}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      );
  }
}

