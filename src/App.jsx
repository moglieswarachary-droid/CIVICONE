// src/App.jsx - Main Application Router & Portal Separation Gateway

import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import PreEntryGate from './components/PreEntryGate.jsx';
import CitizenDashboard from './components/CitizenDashboard.jsx';
import OrganizationPortal from './components/OrganizationPortal.jsx';
import AuthorityGate from './components/AuthorityGate.jsx';
import AuthorityPortal from './components/AuthorityPortal.jsx';
import PolicePortal from './components/PolicePortal.jsx';
import AdminGate from './components/AdminGate.jsx';
import AdminPortal from './components/AdminPortal.jsx';
import PublicQRVerification from './components/PublicQRVerification.jsx';

export default function App() {
  // Views: 'landing' | 'gate' | 'citizen' | 'organization' | 'authority-gate' | 'authority' | 'police' | 'admin-gate' | 'admin' | 'verify'
  const [currentView, setCurrentView] = useState('landing');
  const [authenticatedCitizen, setAuthenticatedCitizen] = useState(null);
  const [authenticatedOfficer, setAuthenticatedOfficer] = useState(null);
  const [authenticatedAdmin, setAuthenticatedAdmin] = useState(null);
  const [verifyToken, setVerifyToken] = useState('CIV-TOKEN-CIV-DEMO-10001-SECURE-2026');

  // Handle URL Hash, Path Routing, and Owner Keyboard Shortcut (Ctrl + Shift + A)
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      const token = searchParams.get('token');

      if (hash === '#org' || path.startsWith('/org')) {
        setCurrentView('organization');
      } else if (hash === '#owner-admin' || hash === '#admin' || path.startsWith('/owner-admin')) {
        setCurrentView('admin-gate');
      } else if (hash === '#police' || path.startsWith('/police')) {
        setCurrentView('police');
      } else if (path.startsWith('/authority') || hash === '#authority') {
        setCurrentView('authority-gate');
      } else if (path.startsWith('/verify') || token) {
        if (token) setVerifyToken(token);
        setCurrentView('verify');
      }
    };

    const handleKeyDown = (e) => {
      // Owner Secret Shortcut: Ctrl + Shift + A launches Super Admin Gate
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentView('admin-gate');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle Citizen Login Authentication Completion
  const handleAuthSuccess = (citizenData) => {
    setAuthenticatedCitizen(citizenData);
    setCurrentView('citizen');
  };

  // Handle Officer Login Authentication Completion
  const handleOfficerAuthSuccess = (officerData) => {
    setAuthenticatedOfficer(officerData);
    if (officerData.role === 'POLICE_ADMIN' || officerData.department?.includes('Police')) {
      setCurrentView('police');
    } else {
      setCurrentView('authority');
    }
  };

  // Handle Admin Login Authentication Completion
  const handleAdminAuthSuccess = (adminData) => {
    setAuthenticatedAdmin(adminData);
    setCurrentView('admin');
  };

  // Handle Logout
  const handleLogout = () => {
    setAuthenticatedCitizen(null);
    setAuthenticatedOfficer(null);
    setAuthenticatedAdmin(null);
    setCurrentView('landing');
  };

  // Render Current Portal Experience
  switch (currentView) {
    case 'gate':
      return (
        <PreEntryGate
          onAuthenticated={handleAuthSuccess}
          onGoBackToLanding={() => setCurrentView('landing')}
        />
      );

    case 'citizen':
      return authenticatedCitizen ? (
        <CitizenDashboard
          citizen={authenticatedCitizen}
          onLogout={handleLogout}
          onNavigateToVerification={(token) => {
            setVerifyToken(token);
            setCurrentView('verify');
          }}
        />
      ) : (
        <PreEntryGate
          onAuthenticated={handleAuthSuccess}
          onGoBackToLanding={() => setCurrentView('landing')}
        />
      );

    case 'organization':
      return (
        <OrganizationPortal
          onReturnHome={() => setCurrentView('landing')}
        />
      );

    case 'authority-gate':
      return (
        <AuthorityGate
          onAuthenticated={handleOfficerAuthSuccess}
          onGoBackToLanding={() => setCurrentView('landing')}
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
          onGoBackToLanding={() => setCurrentView('landing')}
        />
      );

    case 'police':
      return (
        <PolicePortal
          officer={authenticatedOfficer}
          onReturnHome={handleLogout}
        />
      );

    case 'admin-gate':
      return (
        <AdminGate
          onAuthenticated={handleAdminAuthSuccess}
          onGoBackToLanding={() => setCurrentView('landing')}
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
          onGoBackToLanding={() => setCurrentView('landing')}
        />
      );

    case 'verify':
      return (
        <PublicQRVerification
          token={verifyToken}
          onBackToPortal={() => {
            if (authenticatedCitizen) {
              setCurrentView('citizen');
            } else {
              setCurrentView('landing');
            }
          }}
        />
      );

    case 'landing':
    default:
      return (
        <LandingPage
          onAccessCivicOne={() => setCurrentView('gate')}
          onOpenAuthorityPortal={() => setCurrentView('authority-gate')}
          onOpenOwnerAdmin={() => setCurrentView('admin-gate')}
        />
      );
  }
}
