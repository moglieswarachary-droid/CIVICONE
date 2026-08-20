import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Search, Bell, User, LayoutDashboard, Ticket, FolderClosed,
  Grid, Landmark, Newspaper, Shield, HelpCircle, LogOut, Sun, Moon, CheckCircle2,
  ChevronRight, ChevronDown, Menu, X, Crown, Sparkles, HelpCircle as HelpIcon, ArrowRight, ArrowLeft, Zap, Radio, Share2, FileText,
  Lock, Compass, Plane, MoreHorizontal, Activity, Eye, AlertTriangle, Clock, RefreshCw, Milestone, Users,
  Headphones, PhoneCall, Mail
} from 'lucide-react';
import VirtualCard from './VirtualCard.jsx';
import CivicVault from './CivicVault.jsx';
import MyJourney from './MyJourney.jsx';
import ServicesSection from './ServicesSection.jsx';
import UpdatesAndNews from './UpdatesAndNews.jsx';
import SecurityCentre from './SecurityCentre.jsx';
import HelpCentre from './HelpCentre.jsx';
import ProfileSettings from './ProfileSettings.jsx';
import AiAgentFloating from './AiAgentFloating.jsx';
import PrivacyCenter from './PrivacyCenter.jsx';
import TourismGuide from './TourismGuide.jsx';
import TravelBookingHub from './TravelBookingHub.jsx';
import {
  DEMO_CARD, DEMO_DOCUMENTS, DEMO_GOVT_UPDATES, DEMO_NEWS,
  DEMO_NOTIFICATIONS, DEMO_CITIZENS_LIST, DEMO_FAMILY_MEMBERS, calculateDocExpiryStatus
} from '../data/mockData.js';

export default function CitizenDashboard({ citizen, onLogout, onNavigateToVerification, theme: initialTheme = 'light', onToggleTheme }) {
  // Navigation View: 'home' | 'card' | 'vault' | 'services' | 'activity' | 'privacy' | 'notifications' | 'tourism' | 'travel' | 'govt-updates' | 'news' | 'security' | 'help' | 'ai' | 'profile'
  const getTabFromUrl = () => {
    try {
      const rawHash = window.location.hash.replace('#', '');
      if (rawHash.startsWith('citizen/')) return rawHash.replace('citizen/', '') || 'home';
      if (rawHash.startsWith('citizen-')) return rawHash.replace('citizen-', '') || 'home';
    } catch (e) {}
    return 'home';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl);
  const [tabHistory, setTabHistory] = useState(() => [getTabFromUrl()]);
  const [theme, setTheme] = useState(() => initialTheme || localStorage.getItem('civiqone_theme') || 'light');
  const [notifications, setNotifications] = useState([]);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [documents, setDocuments] = useState(DEMO_DOCUMENTS);
  const [govtUpdates, setGovtUpdates] = useState(DEMO_GOVT_UPDATES);
  const [dailyNews, setDailyNews] = useState(DEMO_NEWS);
  const [cardData, setCardData] = useState(DEMO_CARD);
  const [globalSearch, setGlobalSearch] = useState('');
  const [mobileMoreDrawerOpen, setMobileMoreDrawerOpen] = useState(false);
  const [demoCitizens, setDemoCitizens] = useState(DEMO_CITIZENS_LIST);
  const [currentCitizen, setCurrentCitizen] = useState(() => {
    try {
      const cid = citizen?.citizenId;
      if (cid) {
        const cached = localStorage.getItem(`civiqone_citizen_${cid}`);
        if (cached) return JSON.parse(cached);
      }
      const active = localStorage.getItem('civiqone_active_citizen');
      if (active) {
        const parsed = JSON.parse(active);
        if (parsed?.citizenId === citizen?.citizenId) return parsed;
      }
    } catch (e) {}
    return citizen;
  });
  const [targetTravelCity, setTargetTravelCity] = useState('');
  const [familyVaultMemberId, setFamilyVaultMemberId] = useState('fam-self');
  const [familyMembers, setFamilyMembers] = useState(() => {
    try {
      const cid = citizen?.citizenId;
      if (cid) {
        const cached = localStorage.getItem(`civiqone_family_${cid}`);
        if (cached) return JSON.parse(cached);
      }
    } catch (e) {}
    if (citizen?.citizenId === 'CIV-DEMO-10001') return DEMO_FAMILY_MEMBERS;
    return [
      { id: 'fam-self', name: `${citizen?.fullName || 'Citizen'} (Self)`, relationship: 'Self', isSelf: true, documents: [] }
    ];
  });

  const handleProfileUpdate = (updatedCitizen) => {
    setCurrentCitizen(prev => {
      const merged = { ...prev, ...updatedCitizen };
      try {
        localStorage.setItem(`civiqone_citizen_${merged.citizenId}`, JSON.stringify(merged));
        localStorage.setItem('civiqone_active_citizen', JSON.stringify(merged));
      } catch (e) {}
      return merged;
    });
  };

  // Sync with prop if it updates externally
  useEffect(() => {
    if (initialTheme && initialTheme !== theme) {
      setTheme(initialTheme);
    }
  }, [initialTheme]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('civiqone_theme', nextTheme);
    if (onToggleTheme) onToggleTheme();
  };

  // Collapsible Group States for Desktop Sidebar
  const [openGroups, setOpenGroups] = useState({
    main: true,
    myCIVIQONE: true,
    explore: true,
    support: true,
    account: true
  });

  const toggleGroup = (groupKey) => {
    setOpenGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // Fetch initial dashboard data & demo accounts from REST API backend
  useEffect(() => {
    const fetchJsonSafe = async (url) => {
      try {
        const r = await fetch(url);
        if (!r.ok) return {};
        return await r.json();
      } catch (e) {
        return {};
      }
    };

    async function loadDashboardData() {
      try {
        const cid = currentCitizen?.citizenId || citizen?.citizenId || '';
        const [cardRes, docsRes, notifRes, govtRes, newsRes, demoRes] = await Promise.all([
          fetchJsonSafe('/api/card/me'),
          fetchJsonSafe(`/api/vault/documents${cid ? `?citizenId=${cid}` : ''}`),
          fetchJsonSafe(`/api/notifications${cid ? `?citizenId=${cid}` : ''}`),
          fetchJsonSafe('/api/updates/govt'),
          fetchJsonSafe('/api/updates/news'),
          fetchJsonSafe('/api/citizens/demo')
        ]);

        if (cardRes.citizen) setCurrentCitizen(cardRes.citizen);
        if (cardRes.card) setCardData(cardRes.card);
        if (docsRes.documents) setDocuments(docsRes.documents);
        if (notifRes.notifications) setNotifications(notifRes.notifications);
        if (govtRes.updates) setGovtUpdates(govtRes.updates);
        if (newsRes.news) setDailyNews(newsRes.news);
        if (demoRes.demoCitizens) setDemoCitizens(demoRes.demoCitizens);
      } catch (err) {
        console.log("Using cached/seed data fallback");
      }
    }
    loadDashboardData();

    // Real-time live polling for incoming notifications & admission/guest requests
    const interval = setInterval(async () => {
      try {
        const cid = currentCitizen?.citizenId || citizen?.citizenId || '';
        const notifRes = await fetchJsonSafe(`/api/notifications${cid ? `?citizenId=${cid}` : ''}`);
        if (notifRes && notifRes.notifications) {
          setNotifications(prev => {
            const serverNotifs = notifRes.notifications;
            return serverNotifs.map(sn => {
              const existing = prev.find(p => p.id === sn.id);
              if (existing && (existing.status === 'APPROVED' || existing.status === 'DECLINED')) {
                return { ...sn, status: existing.status, read: existing.read, title: existing.title, message: existing.message };
              }
              return sn;
            });
          });
        }
      } catch (e) {}
    }, 3000);

    return () => clearInterval(interval);
  }, [currentCitizen?.citizenId]);

  // Switch Demo Citizen Account Handler
  const handleSwitchDemoAccount = async (citizenId) => {
    try {
      const res = await fetch('/api/citizen/switch-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citizenId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCurrentCitizen(data.citizen);
          setCardData(data.card);
          setDocuments(data.documents);
          return;
        }
      }
      throw new Error("offline");
    } catch (err) {
      // Local fallback for switching demo citizens on Netlify/offline
      const target = demoCitizens.find(c => c.citizenId === citizenId) || DEMO_CITIZENS_LIST.find(c => c.citizenId === citizenId);
      if (target) {
        setCurrentCitizen(target);
        setCardData({
          ...DEMO_CARD,
          holderName: (target.fullName || target.name || '').toUpperCase(),
          civicId: target.citizenId,
          maskedAadhaar: target.maskedAadhaar || 'XXXX XXXX 1001'
        });
      }
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sidebar Grouped Structure (Requirement 15)
  const navigationGroups = [
    {
      key: 'main',
      title: 'MAIN',
      items: [
        { id: 'home', label: 'Home', icon: LayoutDashboard },
        { id: 'journey', label: 'My Journey', icon: Milestone },
        { id: 'card', label: 'My Civic Card', icon: Ticket },
        { id: 'vault', label: 'My Vault', icon: FolderClosed },
        { id: 'services', label: 'Services', icon: Grid }
      ]
    },
    {
      key: 'myCIVIQONE',
      title: 'MY CIVIQONE',
      items: [
        { id: 'family-vault', label: 'Family Vault', icon: Users },
        { id: 'activity', label: 'My Activity', icon: Activity },
        { id: 'privacy', label: 'My Access & Consent', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell }
      ]
    },
    {
      key: 'explore',
      title: 'EXPLORE',
      items: [
        { id: 'tourism', label: 'CIVIQONE World', icon: Compass },
        { id: 'govt-updates', label: 'Government Updates', icon: Landmark },
        { id: 'news', label: 'Daily News', icon: Newspaper }
      ]
    },
    {
      key: 'support',
      title: 'SECURITY & SUPPORT',
      items: [
        { id: 'help', label: 'Customer Care', icon: Headphones },
        { id: 'security', label: 'Security Centre', icon: Shield },
        { id: 'privacy', label: 'Privacy Centre', icon: Lock }
      ]
    },
    {
      key: 'account',
      title: 'ACCOUNT',
      items: [
        { id: 'profile', label: 'Profile Settings', icon: User }
      ]
    }
  ];

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleSelectTab = (tabId, memberId = 'fam-self', pushHistory = true) => {
    let resolvedTab = tabId;
    if (tabId === 'family-vault') {
      setFamilyVaultMemberId(memberId === 'fam-self' ? 'fam-child-1' : memberId);
      resolvedTab = 'vault';
    } else {
      if (tabId === 'vault') {
        setFamilyVaultMemberId(memberId);
      }
    }
    setActiveTab(resolvedTab);
    setMobileMoreDrawerOpen(false);

    setTabHistory(prev => (prev[prev.length - 1] === resolvedTab ? prev : [...prev, resolvedTab]));

    if (pushHistory) {
      const targetHash = resolvedTab === 'home' ? '#citizen' : `#citizen/${resolvedTab}`;
      if (window.location.hash !== targetHash) {
        try {
          window.history.pushState({ view: 'citizen', tab: resolvedTab }, '', targetHash);
        } catch (e) {
          window.location.hash = targetHash;
        }
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    if (tabHistory.length > 1) {
      const updated = [...tabHistory];
      updated.pop();
      const previousTab = updated[updated.length - 1] || 'home';
      setTabHistory(updated);
      handleSelectTab(previousTab, 'fam-self', true);
    } else {
      handleSelectTab('home', 'fam-self', true);
    }
  };

  // Sync tab with browser URL hash and handle browser back/forward buttons
  useEffect(() => {
    const handleSyncTabFromHash = () => {
      const rawHash = window.location.hash.replace('#', '');
      let targetTab = 'home';
      if (rawHash.startsWith('citizen/')) {
        targetTab = rawHash.replace('citizen/', '') || 'home';
      } else if (rawHash.startsWith('citizen-')) {
        targetTab = rawHash.replace('citizen-', '') || 'home';
      } else if (rawHash === 'citizen' || !rawHash) {
        targetTab = 'home';
      }

      if (targetTab && targetTab !== activeTab) {
        handleSelectTab(targetTab, 'fam-self', false);
      }
    };

    window.addEventListener('popstate', handleSyncTabFromHash);
    window.addEventListener('hashchange', handleSyncTabFromHash);
    return () => {
      window.removeEventListener('popstate', handleSyncTabFromHash);
      window.removeEventListener('hashchange', handleSyncTabFromHash);
    };
  }, [activeTab]);

  // Requirement 22: Documents Requiring Attention Widget Calculation
  const docsRequiringAttention = documents.filter(d => {
    const expInfo = calculateDocExpiryStatus(d);
    return expInfo.status === 'EXPIRING SOON' || expInfo.status === 'EXPIRED';
  });

  const handleApproveConsent = async (notifItem) => {
    try {
      await fetch('/api/consent/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          requestId: notifItem.requestId || notifItem.id || 'req-demo-hotel-1',
          citizenCivicId: currentCitizen?.citizenId || citizen?.citizenId
        })
      });
    } catch (err) {}
    setNotifications(notifications.map(n => n.id === notifItem.id ? {
      ...n,
      title: '🟢 Consent Approved!',
      message: `${n.message} (Status: ACCEPTED & Verified Records Shared)`,
      read: true,
      status: 'APPROVED'
    } : n));
    alert(`🟢 Consent Granted! Your requested credentials (Aadhaar / Academic) were securely shared with ${notifItem.orgName || 'the organization'}.`);
  };

  const handleDeclineConsent = (notifItem) => {
    setNotifications(notifications.map(n => n.id === notifItem.id ? {
      ...n,
      title: '🔴 Consent Declined',
      message: `${n.message} (Status: DECLINED BY CITIZEN)`,
      read: true,
      status: 'DECLINED'
    } : n));
    alert('🔴 Consent Declined. Access request was denied.');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* GLOBAL HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-light)',
        padding: '12px 16px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => handleSelectTab('home')}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#0B5ED7',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(11, 94, 215, 0.3)'
              }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  CIVIQONE
                </span>
                <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: '#0B5ED7', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '-4px' }}>
                  Citizen Portal
                </span>
              </div>
            </div>
          </div>

          {/* Global Search Bar */}
          <div style={{ flex: '1', maxWidth: '360px', position: 'relative' }} className="hidden-mobile">
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                if (e.target.value) setActiveTab('vault');
              }}
              placeholder="Search vault documents, DL, ABHA..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '10px',
                border: '1.5px solid var(--border-light)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Header Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            {/* Customer Care Quick Access */}
            <button
              onClick={() => handleSelectTab('help')}
              title="National Citizen Customer Care Desk"
              style={{
                backgroundColor: activeTab === 'help' ? 'var(--primary-blue)' : 'var(--bg-main)',
                color: activeTab === 'help' ? '#FFFFFF' : 'var(--text-main)',
                border: '1px solid var(--border-light)',
                borderRadius: '10px',
                padding: '7px 12px',
                fontSize: '0.8rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Headphones size={15} style={{ color: activeTab === 'help' ? '#FFFFFF' : 'var(--primary-blue)' }} />
              <span className="hidden-mobile">Customer Care</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={handleToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="theme-toggle-btn"
              style={{ width: '38px', height: '38px', borderRadius: '10px' }}
            >
              {theme === 'dark' ? <Sun size={17} style={{ color: '#F59E0B' }} /> : <Moon size={17} style={{ color: '#0B5ED7' }} />}
            </button>

            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifPopover(!showNotifPopover)}
                className="touch-target"
                style={{
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '10px',
                  padding: '8px',
                  color: 'var(--text-main)',
                  position: 'relative'
                }}
              >
                <Bell size={18} />
                {unreadNotifCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    width: '18px', height: '18px', borderRadius: '50%',
                    backgroundColor: '#DC3545', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {showNotifPopover && (
                <div style={{
                  position: 'absolute', top: '48px', right: 0, width: '320px', maxHeight: '420px',
                  backgroundColor: 'var(--bg-card)', borderRadius: '16px', boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-light)', padding: '16px', zIndex: 100
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Notifications</strong>
                    <button onClick={() => setShowNotifPopover(false)} style={{ background: 'none', color: 'var(--text-light)', border: 'none' }}><X size={16} /></button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div key={n.id} style={{ padding: '12px', borderRadius: '10px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', fontSize: '0.8rem' }}>
                        <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>{n.title}</strong>
                        <span style={{ color: 'var(--text-muted)' }}>{n.message}</span>

                        {/* ACCEPT / DECLINE BUTTONS FOR CONSENT REQUESTS */}
                        {(n.type === 'CONSENT_REQUEST' || n.title.includes('Request') || n.title.includes('Access') || n.title.includes('Guest')) && n.status !== 'APPROVED' && n.status !== 'DECLINED' && (
                          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                            <button
                              onClick={() => handleApproveConsent(n)}
                              style={{ flex: 1, backgroundColor: '#059669', color: '#FFFFFF', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                            >
                              🟢 ACCEPT
                            </button>
                            <button
                              onClick={() => handleDeclineConsent(n)}
                              style={{ flex: 1, backgroundColor: '#DC2626', color: '#FFFFFF', padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                            >
                              🔴 DECLINE
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* MAIN CONTENT AREA WITH COLLAPSIBLE SIDEBAR */}
      <div style={{ flex: 1, display: 'flex', maxWidth: '1400px', width: '100%', margin: '0 auto', paddingBottom: '70px' }}>
        
        {/* DESKTOP SIDEBAR WITH COLLAPSIBLE GROUPS (Sticky & Synced Layout) */}
        <aside style={{
          width: '260px',
          borderRight: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-card)',
          padding: '20px 14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'sticky',
          top: '90px',
          alignSelf: 'flex-start'
        }} className="hidden-mobile">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {navigationGroups.map(group => {
              const isOpen = openGroups[group.key];
              return (
                <div key={group.key}>
                  <button
                    onClick={() => toggleGroup(group.key)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      background: 'none',
                      border: 'none',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: 'var(--text-light)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      cursor: 'pointer'
                    }}
                  >
                    <span>{group.title}</span>
                    <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
                  </button>

                  {isOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                      {group.items.map(item => {
                        const Icon = item.icon;
                        const isSelected = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleSelectTab(item.id)}
                            style={{
                              backgroundColor: isSelected ? 'var(--primary-blue)' : 'transparent',
                              color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              textAlign: 'left',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            <Icon size={18} />
                            <span>{item.label}</span>
                            {item.badge && (
                              <span style={{
                                marginLeft: 'auto',
                                fontSize: '0.625rem',
                                backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : 'rgba(16, 185, 129, 0.15)',
                                color: isSelected ? '#FFFFFF' : 'var(--success)',
                                border: `1px solid ${isSelected ? 'rgba(255, 255, 255, 0.4)' : 'rgba(16, 185, 129, 0.3)'}`,
                                padding: '1px 6px',
                                borderRadius: '8px',
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}>
                                {item.isLive && <span className="live-pulse-dot" style={{ width: '5px', height: '5px' }} />}
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={onLogout}
              style={{
                backgroundColor: 'var(--bg-main)',
                color: '#DC3545',
                border: '1px solid var(--border-light)',
                padding: '10px 14px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '12px',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} /> Sign Out Session
            </button>
          </div>

        </aside>

        {/* MAIN DISPLAY PANEL (Synced Window Scroll) */}
        <main style={{ flex: 1, padding: '20px 24px', minWidth: 0 }}>
          
          {/* BACK TO DASHBOARD NAVIGATION BAR (When inside any sub-section) */}
          {activeTab !== 'home' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
              padding: '12px 18px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '16px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={handleGoBack}
                  style={{
                    backgroundColor: 'var(--light-blue)',
                    color: 'var(--primary-blue)',
                    border: '1px solid var(--border-blue)',
                    borderRadius: '10px',
                    padding: '7px 14px',
                    fontSize: '0.825rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <ArrowLeft size={16} /> Back to Dashboard
                </button>
                <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Citizen Portal / <strong style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>{activeTab.replace('-', ' ')}</strong>
                </span>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 700 }}>
                CIVIQONE Verified Citizen Session
              </div>
            </div>
          )}

          {/* TAB 1: CITIZEN HOME DASHBOARD (Requirement 16 & 22) */}
          {activeTab === 'home' && (
            <div>
              
              {/* Requirement 16: Top Greeting Section */}
              <div style={{
                background: 'var(--bg-card)',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                color: 'var(--text-main)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                      Welcome back, {currentCitizen.fullName}
                    </h1>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '2px' }}>
                    CIVIQONE ID: <strong>{currentCitizen.citizenId}</strong> | Aadhaar Ref: <strong>{currentCitizen.maskedAadhaar}</strong>
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <span style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Identity: Verified
                    </span>
                    <span style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Shield size={12} /> Security: Protected
                    </span>
                    <span style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                      Status: ACTIVE CITIZEN
                    </span>
                  </div>
                </div>
              </div>

              {/* Requirement 17: Clean Large Touch-Friendly Quick Actions */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                  Quick Actions:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  {[
                    { label: 'My Journey', icon: Milestone, action: () => handleSelectTab('journey'), color: '#0B5ED7' },
                    { label: 'Family Vault', icon: Users, action: () => handleSelectTab('family-vault', 'fam-child-1'), color: '#4F46E5' },
                    { label: 'View Civic Card', icon: Ticket, action: () => handleSelectTab('card'), color: '#0284C7' },
                    { label: 'Open Vault', icon: FolderClosed, action: () => handleSelectTab('vault', 'fam-self'), color: '#059669' },
                    { label: 'Verify Document', icon: CheckCircle2, action: () => handleSelectTab('vault'), color: '#7C3AED' },
                    { label: 'Share Access', icon: Share2, action: () => handleSelectTab('privacy'), color: '#DC2626' },
                    { label: 'Check Services', icon: Grid, action: () => handleSelectTab('services'), color: '#D97706' },
                    { label: 'CIVIQONE World', icon: Compass, action: () => handleSelectTab('tourism'), color: '#166534' },
                    { label: 'Ask AI', icon: Sparkles, action: () => handleSelectTab('help'), color: '#8B5CF6' }
                  ].map((act, i) => (
                    <button
                      key={i}
                      onClick={act.action}
                      style={{
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-light)',
                        borderRadius: '16px',
                        padding: '14px 10px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-sm)',
                        minHeight: '84px'
                      }}
                      className="hover-card"
                    >
                      <act.icon size={22} style={{ color: act.color }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', textAlign: 'center' }}>{act.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* FAMILY & DEPENDENT DOCUMENTS HUB WIDGET */}
              <div style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: '20px',
                border: '1.5px solid var(--border-light)',
                padding: '22px',
                marginBottom: '24px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '12px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        Family &amp; Dependent Vaults ({familyMembers.filter(m => m.id !== 'fam-self').length})
                      </h3>
                      <p style={{ fontSize: '0.775rem', color: 'var(--text-light)', marginTop: '2px' }}>
                        Manage official credentials for minor children &amp; senior parents under legal sovereign guardianship
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSelectTab('vault', 'fam-self')}
                    style={{
                      backgroundColor: '#4F46E5',
                      color: '#FFFFFF',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '0.775rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    Open Family Vault →
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {familyMembers.filter(m => m.id !== 'fam-self').length === 0 ? (
                    <div style={{
                      backgroundColor: 'var(--bg-main)',
                      borderRadius: '16px',
                      border: '1.5px dashed var(--border-light)',
                      padding: '24px 16px',
                      textAlign: 'center',
                      gridColumn: '1 / -1',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Users size={28} style={{ color: '#4F46E5', opacity: 0.6 }} />
                      <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>No Family Members Added</strong>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: 0 }}>
                        Your family vault has no dependents. You can add family members manually in the Vault.
                      </p>
                    </div>
                  ) : (
                    familyMembers.filter(m => m.id !== 'fam-self').map(member => (
                      <div
                        key={member.id}
                        style={{
                          backgroundColor: 'var(--bg-main)',
                          borderRadius: '16px',
                          border: '1px solid var(--border-light)',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                        className="hover-card"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            backgroundColor: member.themeColor || '#4F46E5',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '1rem',
                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
                            flexShrink: 0
                          }}>
                            {member.initials || (member.name ? member.name.substring(0, 2).toUpperCase() : 'FM')}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{member.name}</strong>
                              <span style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', fontSize: '0.675rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px' }}>
                                {member.relationship}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>
                              Civic ID: <strong>{member.civicId || 'CIV-FAM-DEP'}</strong>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={13} /> {member.documents?.length || member.docCount || 0} Verified Documents
                          </span>

                          <button
                            onClick={() => handleSelectTab('vault', member.id)}
                            style={{
                              backgroundColor: '#4F46E5',
                              color: '#FFFFFF',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            View Vault →
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* REQUIREMENT 22: DOCUMENTS REQUIRING ATTENTION WIDGET */}
              {docsRequiringAttention.length > 0 && (
                <div style={{ backgroundColor: '#FFFBEB', borderRadius: '18px', border: '1.5px solid #FDE68A', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 16px rgba(217, 119, 6, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={20} color="#D97706" />
                      <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#92400E' }}>
                        DOCUMENTS REQUIRING ATTENTION ({docsRequiringAttention.length})
                      </h3>
                    </div>
                    <button onClick={() => handleSelectTab('vault')} style={{ backgroundColor: '#D97706', color: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                      View All in Vault →
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    {docsRequiringAttention.map(doc => {
                      const expInfo = calculateDocExpiryStatus(doc);
                      const isExpired = expInfo.status === 'EXPIRED';

                      return (
                        <div key={doc.id} style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '12px', border: isExpired ? '1px solid #FCA5A5' : '1px solid #FCD34D', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ fontSize: '0.875rem', color: '#0B1F3A', display: 'block' }}>{doc.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: isExpired ? '#991B1B' : '#C2410C', fontWeight: 800, marginTop: '2px' }}>
                              {isExpired ? `⚠️ EXPIRED on ${doc.expiryDate}` : `⏰ Expires in ${expInfo.daysRemaining} days (${doc.expiryDate})`}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button onClick={() => handleSelectTab('vault')} style={{ backgroundColor: '#EAF3FF', color: '#0B5ED7', padding: '6px 10px', borderRadius: '6px', fontSize: '0.725rem', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                              View
                            </button>
                            <button onClick={() => alert(`Initiating renewal for ${doc.name}`)} style={{ backgroundColor: isExpired ? '#DC2626' : '#D97706', color: '#FFFFFF', padding: '6px 10px', borderRadius: '6px', fontSize: '0.725rem', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                              {isExpired ? 'Renew' : 'Update'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Requirement 16: Important Citizen Information Widgets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '28px' }}>
                <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Identity Verification</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>🟢 Verified</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Vault Credentials</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B5ED7', marginTop: '4px' }}>{documents.length} Verified Docs</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Security Status</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1E40AF', marginTop: '4px' }}>🔒 Protected</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Active Org Access</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#D97706', marginTop: '4px' }}>2 Authorized Orgs</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Notifications</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#DC2626', marginTop: '4px' }}>{unreadNotifCount} Unread</div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-light)' }}>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Account Status</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
                    Active
                  </div>
                </div>
              </div>

              {/* CARD PREVIEW */}
              <div style={{ maxWidth: '540px', margin: '0 auto' }}>
                <VirtualCard
                  citizen={currentCitizen}
                  card={cardData || DEMO_CARD}
                  onNavigateToVerification={onNavigateToVerification}
                  onCardUpdate={(updatedCard) => setCardData(updatedCard)}
                />
              </div>

            </div>
          )}

          {/* TAB: MY JOURNEY (CHRONOLOGICAL DOCUMENT LIFECYCLE) */}
          {activeTab === 'journey' && (
            <MyJourney citizen={currentCitizen} documents={documents} onGoBack={handleGoBack} />
          )}

          {/* TAB 2: VIRTUAL CIVIC CARD */}
          {activeTab === 'card' && (
            <div style={{ maxWidth: '520px', margin: '0 auto', paddingTop: '12px' }}>
              <VirtualCard
                citizen={currentCitizen}
                card={cardData || DEMO_CARD}
                onNavigateToVerification={onNavigateToVerification}
                onCardUpdate={(updatedCard) => setCardData(updatedCard)}
                onGoBack={handleGoBack}
              />
            </div>
          )}

          {/* TAB 3: DIGITAL VAULT */}
          {activeTab === 'vault' && (
            <CivicVault documents={documents} initialMemberId={familyVaultMemberId} onGoBack={handleGoBack} />
          )}

          {/* TAB: CIVIQONE WORLD TOURISM & DESTINATIONS GUIDE */}
          {activeTab === 'tourism' && (
            <TourismGuide onGoBack={handleGoBack} />
          )}

          {/* TAB 4: PRIVACY & ACCESS CONSENT */}
          {activeTab === 'privacy' && (
            <PrivacyCenter citizen={currentCitizen} onGoBack={handleGoBack} />
          )}

          {/* TAB: NOTIFICATIONS HUB */}
          {activeTab === 'notifications' && (
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={24} style={{ color: '#0B5ED7' }} /> Citizen Notification &amp; Alert Hub
                  </h1>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Real-time official alerts, consent requests, document expiry notifications, and security dispatches.
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                  style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)', border: '1px solid var(--border-light)', padding: '8px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                >
                  Mark All as Read
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifications && notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} style={{
                      backgroundColor: n.read ? 'var(--bg-main)' : 'rgba(11, 94, 215, 0.04)',
                      border: `1px solid ${n.read ? 'var(--border-light)' : '#BFDBFE'}`,
                      borderRadius: '14px', padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start'
                    }}>
                      <div style={{
                        padding: '10px', borderRadius: '12px',
                        backgroundColor: n.type === 'CONSENT_REQUEST' ? '#FEF3C7' : n.type === 'SECURITY_ALERT' ? '#FEE2E2' : '#DBEAFE',
                        color: n.type === 'CONSENT_REQUEST' ? '#D97706' : n.type === 'SECURITY_ALERT' ? '#DC2626' : '#2563EB'
                      }}>
                        <Bell size={20} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{n.title}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>{n.time || n.date || 'Today'}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>{n.message || n.summary || n.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No new notifications at this time.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: PUBLIC SERVICES */}
          {activeTab === 'services' && (
            <ServicesSection onGoBack={handleGoBack} />
          )}

          {/* TAB: MY ACTIVITY LOG & AUDIT HISTORY */}
          {activeTab === 'activity' && (
            <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={24} style={{ color: '#0B5ED7' }} /> My Activity & Audit History
                  </h1>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Comprehensive log of all identity verifications, document accesses, consent authorizations, and login security events.
                  </p>
                </div>
                <div style={{ backgroundColor: '#EAF3FF', color: '#0B5ED7', padding: '6px 14px', borderRadius: '20px', fontSize: '0.775rem', fontWeight: 800 }}>
                  🔒 Cryptographically Verified Audit Log
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { title: "Tokenized Identity Verification Completed", category: "UIDAI Verification", time: "Today, 10:42 AM", ip: "49.37.142.90", location: "Vijayawada, AP", status: "SUCCESS" },
                  { title: "Civic Card Aadhaar Unmasked Toggle", category: "Privacy Audit", time: "Today, 10:38 AM", ip: "49.37.142.90", location: "Web App", status: "SUCCESS" },
                  { title: "Access Request Dispatched by CIVIQONE Grand Hotel", category: "Consent Request", time: "Today, 08:21 PM", ip: "164.100.42.10", location: "Hotel Check-in Desk", status: "PENDING" },
                  { title: "Civic ID Session Login Authenticated", category: "Security Auth", time: "18 Aug 2026, 07:15 PM", ip: "49.37.142.90", location: "Chrome / Windows", status: "SUCCESS" },
                  { title: "Driving Licence (DL-AP-2024-9984) Credential Issued", category: "Government Issuance", time: "15 Aug 2026, 03:20 PM", ip: "164.100.42.10", location: "RTO AP Headquarters", status: "VERIFIED" },
                  { title: "Consent Token Approved for State Health Registry", category: "Consent Clearance", time: "14 Aug 2026, 11:05 AM", ip: "49.37.142.90", location: "Health Portal", status: "ACTIVE" }
                ].map((act, i) => (
                  <div key={i} style={{
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border-light)',
                    borderRadius: '14px',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0B5ED7', backgroundColor: '#DBEAFE', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                          {act.category}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>{act.time}</span>
                      </div>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', display: 'block' }}>{act.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        IP Address: <span style={{ fontFamily: 'monospace' }}>{act.ip}</span> | Location: {act.location}
                      </div>
                    </div>

                    <span style={{
                      backgroundColor: act.status === 'PENDING' ? '#FEF3C7' : '#D1E7DD',
                      color: act.status === 'PENDING' ? '#D97706' : '#0F5132',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 800
                    }}>
                      ● {act.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* TAB: GOVT UPDATES & DAILY NEWS */}
          {(activeTab === 'govt-updates' || activeTab === 'news') && (
            <UpdatesAndNews govtUpdates={govtUpdates} dailyNews={dailyNews} initialTab={activeTab === 'news' ? 'news' : 'govt'} onGoBack={handleGoBack} />
          )}

          {/* TAB: SECURITY CENTRE */}
          {activeTab === 'security' && (
            <SecurityCentre onGoBack={handleGoBack} />
          )}

          {/* TAB: HELP CENTRE & 24/7 CUSTOMER CARE */}
          {activeTab === 'help' && (
            <HelpCentre citizen={currentCitizen} onGoBack={handleGoBack} />
          )}

          {/* TAB: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <ProfileSettings
              citizen={currentCitizen}
              onLogout={onLogout}
              card={cardData}
              onCardUpdate={(updatedCard) => setCardData(updatedCard)}
              onProfileUpdate={handleProfileUpdate}
              onGoBack={handleGoBack}
            />
          )}

        </main>
      </div>

      {/* Requirement 37: MOBILE BOTTOM NAVIGATION (Home | Vault | Card | Services | More) */}
      <nav className="mobile-bottom-nav mobile-only">
        <button className={`mobile-bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => handleSelectTab('home')}>
          <LayoutDashboard size={20} />
          <span>Home</span>
        </button>

        <button className={`mobile-bottom-nav-item ${activeTab === 'vault' ? 'active' : ''}`} onClick={() => handleSelectTab('vault')}>
          <FolderClosed size={20} />
          <span>Vault</span>
        </button>

        <button className={`mobile-bottom-nav-item ${activeTab === 'card' ? 'active' : ''}`} onClick={() => handleSelectTab('card')}>
          <Ticket size={20} style={{ color: '#0B5ED7' }} />
          <span>Card</span>
        </button>

        <button className={`mobile-bottom-nav-item ${activeTab === 'services' ? 'active' : ''}`} onClick={() => handleSelectTab('services')}>
          <Grid size={20} />
          <span>Services</span>
        </button>

        <button className={`mobile-bottom-nav-item ${mobileMoreDrawerOpen ? 'active' : ''}`} onClick={() => setMobileMoreDrawerOpen(true)}>
          <MoreHorizontal size={20} />
          <span>More</span>
        </button>
      </nav>

      {/* MOBILE "MORE" DRAWER MENU */}
      {mobileMoreDrawerOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.8)', backdropFilter: 'blur(8px)',
          zIndex: 200, display: 'flex', justifyContent: 'flex-end'
        }}>
          <div className="drawer-slide-in" style={{
            width: '300px', height: '100%', backgroundColor: 'var(--bg-card)', padding: '24px 16px',
            display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>CIVIQONE Features</strong>
                <button onClick={() => setMobileMoreDrawerOpen(false)} style={{ background: 'none', color: 'var(--text-muted)', border: 'none' }}><X size={22} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { id: 'help', label: 'Customer Care', icon: Headphones },
                  { id: 'journey', label: 'My Journey', icon: Milestone },
                  { id: 'activity', label: 'My Activity', icon: Activity },
                  { id: 'privacy', label: 'Access & Consent', icon: Lock },
                  { id: 'tourism', label: 'CIVIQONE World', icon: Compass },
                  { id: 'govt-updates', label: 'Government Updates', icon: Landmark },
                  { id: 'news', label: 'Daily News', icon: Newspaper },
                  { id: 'security', label: 'Security Centre', icon: Shield },
                  { id: 'profile', label: 'Profile Settings', icon: User }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    style={{
                      padding: '12px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem',
                      display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                      backgroundColor: activeTab === item.id ? 'var(--primary-blue)' : 'transparent',
                      color: activeTab === item.id ? '#FFFFFF' : 'var(--text-main)',
                      border: 'none', cursor: 'pointer'
                    }}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span style={{
                        marginLeft: 'auto',
                        fontSize: '0.625rem',
                        backgroundColor: activeTab === item.id ? 'rgba(255, 255, 255, 0.25)' : 'rgba(16, 185, 129, 0.15)',
                        color: activeTab === item.id ? '#FFFFFF' : 'var(--success)',
                        padding: '1px 6px',
                        borderRadius: '6px',
                        fontWeight: 800
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onLogout}
              style={{
                backgroundColor: '#DC3545', color: '#FFFFFF', padding: '12px', borderRadius: '12px',
                fontWeight: 800, fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px', border: 'none', cursor: 'pointer'
              }}
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>

          <div style={{ flex: 1 }} onClick={() => setMobileMoreDrawerOpen(false)} />
        </div>
      )}



      <AiAgentFloating
        citizen={currentCitizen}
        documents={documents}
        onNavigateTab={handleSelectTab}
      />

    </div>
  );
}
