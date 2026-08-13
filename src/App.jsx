// src/App.jsx - Main Application Router & Portal Separation Gateway

import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage.jsx';
import PreEntryGate from './components/PreEntryGate.jsx';
import CitizenDashboard from './components/CitizenDashboard.jsx';
import OrganizationPortal from './components/OrganizationPortal.jsx';
import AuthorityGate from './components/AuthorityGate.jsx';
import AuthorityPortal from './components/AuthorityPortal.jsx';
import AdminGate from './components/AdminGate.jsx';
import AdminPortal from './components/AdminPortal.jsx';
import PublicQRVerification from './components/PublicQRVerification.jsx';

export default function App() {
  // Persistent Authentication State across Browser Refresh
  const [authenticatedCitizen, setAuthenticatedCitizen] = useState(() => {
    try {
      const saved = localStorage.getItem('civicone_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          tier: parsed.tier || 'STANDARD',
          goldPassStatus: parsed.goldPassStatus || 'standard'
        };
      }
    } catch (e) {}
    return null;
  });

  const [currentView, setCurrentView] = useState(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('token') || path.startsWith('/verify')) return 'verify';
    if (hash === '#org' || path.startsWith('/org')) return 'organization';
    if (hash === '#owner-admin' || hash === '#admin' || path.startsWith('/owner-admin')) return 'admin-gate';
    if (path.startsWith('/authority') || hash === '#authority') return 'authority-gate';
    
    try {
      const saved = localStorage.getItem('civicone_session');
      if (saved) return 'citizen';
    } catch (e) {}
    return 'landing';
  });

  const [authenticatedOfficer, setAuthenticatedOfficer] = useState(null);
  const [authenticatedAdmin, setAuthenticatedAdmin] = useState(null);
  const [verifyToken, setVerifyToken] = useState('CIV-TOKEN-984210-SECURE-2026');

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
    const sessionCitizen = {
      ...citizenData,
      tier: citizenData?.tier || 'STANDARD',
      goldPassStatus: citizenData?.goldPassStatus || 'standard'
    };
    try {
      localStorage.setItem('civicone_session', JSON.stringify(sessionCitizen));
    } catch (e) {}
    setAuthenticatedCitizen(sessionCitizen);
    setCurrentView('citizen');
  };

  // Handle Officer Login Authentication Completion
  const handleOfficerAuthSuccess = (officerData) => {
    setAuthenticatedOfficer(officerData);
    setCurrentView('authority');
  };

  // Handle Admin Login Authentication Completion
  const handleAdminAuthSuccess = (adminData) => {
    setAuthenticatedAdmin(adminData);
    setCurrentView('admin');
  };

  // Handle Logout
  const handleLogout = () => {
    try {
      localStorage.removeItem('civicone_session');
    } catch (e) {}
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
