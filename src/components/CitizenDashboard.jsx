// src/components/CitizenDashboard.jsx - Main Authenticated Citizen Portal Layout with Premium Navigation & Grouped Collapsible Dock

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Search, Bell, User, LayoutDashboard, Ticket, FolderClosed,
  Grid, Landmark, Newspaper, Shield, HelpCircle, LogOut, Sun, Moon, CheckCircle2,
  ChevronRight, ChevronDown, Menu, X, Crown, Sparkles, HelpCircle as HelpIcon, ArrowRight, Zap, Radio, Share2, FileText,
  Lock, Compass, Plane, MoreHorizontal, Activity, Eye
} from 'lucide-react';
import VirtualCard from './VirtualCard.jsx';
import CivicVault from './CivicVault.jsx';
import ServicesSection from './ServicesSection.jsx';
import UpdatesAndNews from './UpdatesAndNews.jsx';
import SecurityCentre from './SecurityCentre.jsx';
import HelpCentre from './HelpCentre.jsx';
import ProfileSettings from './ProfileSettings.jsx';
import AiAgentFloating from './AiAgentFloating.jsx';
import GoldPassPaymentModal from './GoldPassPaymentModal.jsx';
import PrivacyCenter from './PrivacyCenter.jsx';
import TourismGuide from './TourismGuide.jsx';
import TravelBookingHub from './TravelBookingHub.jsx';
import {
  DEMO_CARD, DEMO_DOCUMENTS, DEMO_GOVT_UPDATES, DEMO_NEWS,
  DEMO_NOTIFICATIONS, DEMO_CITIZENS_LIST
} from '../data/mockData.js';

export default function CitizenDashboard({ citizen, onLogout, onNavigateToVerification }) {
  // Navigation View: 'home' | 'card' | 'vault' | 'services' | 'gold-pass' | 'activity' | 'privacy' | 'notifications' | 'tourism' | 'travel' | 'govt-updates' | 'news' | 'security' | 'help' | 'ai' | 'profile'
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('light');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [documents, setDocuments] = useState(DEMO_DOCUMENTS);
  const [govtUpdates, setGovtUpdates] = useState(DEMO_GOVT_UPDATES);
  const [dailyNews, setDailyNews] = useState(DEMO_NEWS);
  const [cardData, setCardData] = useState(DEMO_CARD);
  const [globalSearch, setGlobalSearch] = useState('');
  const [mobileMoreDrawerOpen, setMobileMoreDrawerOpen] = useState(false);
  const [demoCitizens, setDemoCitizens] = useState(DEMO_CITIZENS_LIST);
  const [currentCitizen, setCurrentCitizen] = useState(citizen);
  const [targetTravelCity, setTargetTravelCity] = useState('');

  // Collapsible Group States for Desktop Sidebar
  const [openGroups, setOpenGroups] = useState({
    main: true,
    myCivicOne: true,
    explore: true,
    support: true,
    account: true
  });

  const toggleGroup = (groupKey) => {
    setOpenGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // Fetch initial dashboard data & demo accounts from REST API backend
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [cardRes, docsRes, notifRes, govtRes, newsRes, demoRes] = await Promise.all([
          fetch('/api/card/me').then(r => r.json()),
          fetch('/api/vault/documents').then(r => r.json()),
          fetch('/api/notifications').then(r => r.json()),
          fetch('/api/updates/govt').then(r => r.json()),
          fetch('/api/updates/news').then(r => r.json()),
          fetch('/api/citizens/demo').then(r => r.json())
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
  }, []);

  // Switch Demo Citizen Account Handler
  const handleSwitchDemoAccount = async (citizenId) => {
    try {
      const res = await fetch('/api/citizen/switch-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citizenId })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentCitizen(data.citizen);
        setCardData(data.card);
        setDocuments(data.documents);
        const [notifRes, demoRes] = await Promise.all([
          fetch('/api/notifications').then(r => r.json()),
          fetch('/api/citizens/demo').then(r => r.json())
        ]);
        if (notifRes.notifications) setNotifications(notifRes.notifications);
        if (demoRes.demoCitizens) setDemoCitizens(demoRes.demoCitizens);
      }
    } catch (err) {
      console.log("Demo switch failed");
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sidebar Grouped Structure (Requirement 2)
  const navigationGroups = [
    {
      key: 'main',
      title: 'MAIN',
      items: [
        { id: 'home', label: 'Home', icon: LayoutDashboard },
        { id: 'card', label: 'My Civic Card', icon: Ticket },
        { id: 'vault', label: 'My Vault', icon: FolderClosed },
        { id: 'services', label: 'Services', icon: Grid },
        { id: 'gold-pass', label: 'Gold Pass', icon: Crown }
      ]
    },
    {
      key: 'myCivicOne',
      title: 'MY CIVICONE',
      items: [
        { id: 'activity', label: 'My Activity', icon: Activity },
        { id: 'privacy', label: 'My Access & Consent', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell }
      ]
    },
    {
      key: 'explore',
      title: 'EXPLORE',
      items: [
        { id: 'tourism', label: 'CivicOne World', icon: Compass },
        { id: 'travel', label: 'Travel & Bookings', icon: Plane },
        { id: 'govt-updates', label: 'Government Updates', icon: Landmark },
        { id: 'news', label: 'Daily News', icon: Newspaper }
      ]
    },
    {
      key: 'support',
      title: 'SUPPORT & SECURITY',
      items: [
        { id: 'security', label: 'Security Centre', icon: Shield },
        { id: 'privacy', label: 'Privacy Centre', icon: Lock },
        { id: 'help', label: 'Help Centre', icon: HelpCircle }
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

  const [goldPassStatus, setGoldPassStatus] = useState(currentCitizen?.goldPassStatus || cardData?.goldPassStatus || 'standard');
  const [goldPassMessage, setGoldPassMessage] = useState('');

  useEffect(() => {
    async function checkGoldPass() {
      try {
        const res = await fetch('/api/goldpass/status');
        const data = await res.json();
        if (data.goldPassStatus) {
          setGoldPassStatus(data.goldPassStatus);
        }
      } catch (err) {
        console.log("Using default entitlement status");
      }
    }
    checkGoldPass();
  }, [currentCitizen]);

  const isGoldTier = goldPassStatus === 'active';

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileMoreDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                background: isGoldTier ? 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)' : '#0B5ED7',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isGoldTier ? '0 4px 14px rgba(202, 138, 4, 0.4)' : '0 4px 12px rgba(11, 94, 215, 0.3)'
              }}>
                {isGoldTier ? <Crown size={20} /> : <ShieldCheck size={20} />}
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  CivicOne
                </span>
                <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: isGoldTier ? '#CA8A04' : '#0B5ED7', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '-4px' }}>
                  {isGoldTier ? "👑 Gold Pass Active" : "Citizen Portal"}
                </span>
              </div>
            </div>
          </div>

          {/* Demo Citizen Profile Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B' }}>Active Citizen:</span>
            <select
              value={currentCitizen.citizenId}
              onChange={(e) => handleSwitchDemoAccount(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontWeight: 800,
                fontSize: '0.8rem',
                color: '#0B1F3A',
                backgroundColor: '#FFFFFF'
              }}
            >
              {demoCitizens.map(c => (
                <option key={c.citizenId} value={c.citizenId}>
                  {c.fullName} ({c.citizenId}) {c.tier === 'GOLD' ? '👑' : ''}
                </option>
              ))}
            </select>
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
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="touch-target"
              style={{
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-light)',
                borderRadius: '10px',
                padding: '8px',
                color: 'var(--text-main)'
              }}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
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
                  position: 'absolute', top: '48px', right: 0, width: '300px', maxHeight: '380px',
                  backgroundColor: 'var(--bg-card)', borderRadius: '16px', boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-light)', padding: '16px', zIndex: 100
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Notifications</strong>
                    <button onClick={() => setShowNotifPopover(false)} style={{ background: 'none', color: 'var(--text-light)' }}><X size={16} /></button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div key={n.id} style={{ padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-main)', border: '1px solid var(--border-light)', fontSize: '0.8rem' }}>
                        <strong style={{ color: 'var(--text-main)', display: 'block' }}>{n.title}</strong>
                        <span style={{ color: 'var(--text-muted)' }}>{n.message}</span>
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
        
        {/* DESKTOP SIDEBAR WITH COLLAPSIBLE GROUPS (Requirement 2) */}
        <aside style={{
          width: '260px',
          borderRight: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-card)',
          padding: '20px 14px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          flexShrink: 0
        }} className="hidden-mobile">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
            {navigationGroups.map(group => {
              const isOpen = openGroups[group.key];
              return (
                <div key={group.key}>
                  {/* Collapsible Header */}
                  <button
                    onClick={() => toggleGroup(group.key)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justify: 'space-between',
                      alignItems: 'center',
                      padding: '4px 10px',
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

                  {/* Group Nav Items */}
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
                              backgroundColor: isSelected ? (isGoldTier ? '#CA8A04' : '#0B5ED7') : 'transparent',
                              color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                              padding: '10px 14px',
                              borderRadius: '10px',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              textAlign: 'left'
                            }}
                          >
                            <Icon size={18} /> {item.label}
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
                marginTop: '12px'
              }}
            >
              <LogOut size={16} /> Sign Out Session
            </button>
          </div>

        </aside>

        {/* MAIN DISPLAY PANEL */}
        <main style={{ flex: 1, padding: '20px 14px', overflowY: 'auto', width: '100%' }}>
          
          {/* TAB 1: CITIZEN HOME DASHBOARD (Requirements 4, 5, 6) */}
          {activeTab === 'home' && (
            <div>
              
              {/* Synthetic Data Notice Banner */}
              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '8px 16px', borderRadius: '12px', color: '#92400E', fontSize: '0.8rem', fontWeight: 800, marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>⚠️ {currentCitizen.demoLabel || "DEMO DATA — NOT A REAL CITIZEN"}</span>
                <span>Profile: <strong>{currentCitizen.fullName} ({currentCitizen.citizenId})</strong></span>
              </div>

              {/* Requirement 4: Top Greeting Section */}
              <div style={{
                background: isGoldTier
                  ? 'linear-gradient(135deg, #1C190D 0%, #3B2E09 60%, #856414 100%)'
                  : 'var(--bg-card)',
                borderRadius: '20px',
                padding: '24px',
                border: isGoldTier ? '1.5px solid #FACC15' : '1px solid var(--border-light)',
                boxShadow: isGoldTier ? '0 10px 30px rgba(202, 138, 4, 0.25)' : 'var(--shadow-sm)',
                marginBottom: '20px',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                color: isGoldTier ? '#FFFFFF' : 'var(--text-main)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {isGoldTier && <Crown size={22} style={{ color: '#FDE047' }} />}
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em', color: isGoldTier ? '#FEF08A' : 'var(--text-main)' }}>
                      Welcome back, {currentCitizen.fullName}
                    </h1>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: isGoldTier ? 'rgba(255,255,255,0.9)' : 'var(--text-light)', marginTop: '2px' }}>
                    CivicOne ID: <strong>{currentCitizen.citizenId}</strong> | Aadhaar Ref: <strong>{currentCitizen.maskedAadhaar}</strong>
                  </p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <span style={{ backgroundColor: isGoldTier ? '#CA8A04' : '#D1E7DD', color: isGoldTier ? '#FFFFFF' : '#0F5132', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> Identity: Verified
                    </span>
                    <span style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Shield size={12} /> Security: Protected
                    </span>
                    <span style={{ backgroundColor: isGoldTier ? '#FEF3C7' : '#F1F5F9', color: isGoldTier ? '#92400E' : '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                      Status: {isGoldTier ? "GOLD PASS ACTIVE 👑" : "STANDARD"}
                    </span>
                  </div>
                </div>

                <div>
                  {!isGoldTier ? (
                    <button
                      onClick={() => handleSelectTab('gold-pass')}
                      style={{ backgroundColor: '#CA8A04', color: '#FFFFFF', padding: '12px 20px', borderRadius: '14px', fontWeight: 900, fontSize: '0.875rem', boxShadow: '0 4px 14px rgba(202, 138, 4, 0.4)' }}
                    >
                      👑 Upgrade to Gold Pass
                    </button>
                  ) : (
                    <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#FDE047', fontWeight: 700 }}>
                      <div>Activated: 14 Aug 2026</div>
                      <div>Valid: 14 Aug 2027</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Requirement 5: Clean Large Touch-Friendly Quick Actions */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                  Quick Actions:
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                  {[
                    { label: 'View Civic Card', icon: Ticket, action: () => handleSelectTab('card'), color: '#0B5ED7' },
                    { label: 'Open Vault', icon: FolderClosed, action: () => handleSelectTab('vault'), color: '#059669' },
                    { label: 'Verify Document', icon: CheckCircle2, action: () => handleSelectTab('vault'), color: '#7C3AED' },
                    { label: 'Share Access', icon: Share2, action: () => handleSelectTab('privacy'), color: '#DC2626' },
                    { label: 'Check Services', icon: Grid, action: () => handleSelectTab('services'), color: '#D97706' },
                    { label: 'Travel', icon: Plane, action: () => handleSelectTab('travel'), color: '#0284C7' },
                    { label: 'CivicOne World', icon: Compass, action: () => handleSelectTab('tourism'), color: '#166534' },
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

              {/* Requirement 6: Important Citizen Information Widgets */}
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
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-light)', fontWeight: 700, textTransform: 'uppercase' }}>Gold Pass Status</span>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: isGoldTier ? '#CA8A04' : '#64748B', marginTop: '4px' }}>
                    {isGoldTier ? "Active 👑" : "Not Active"}
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

          {/* TAB 2: VIRTUAL CIVIC CARD */}
          {activeTab === 'card' && (
            <div style={{ maxWidth: '520px', margin: '0 auto', paddingTop: '12px' }}>
              <VirtualCard
                citizen={currentCitizen}
                card={cardData || DEMO_CARD}
                onNavigateToVerification={onNavigateToVerification}
                onCardUpdate={(updatedCard) => setCardData(updatedCard)}
              />
            </div>
          )}

          {/* TAB 3: DIGITAL VAULT */}
          {activeTab === 'vault' && (
            <CivicVault documents={documents} />
          )}

          {/* TAB 4: PRIVACY & ACCESS CONSENT */}
          {activeTab === 'privacy' && (
            <PrivacyCenter citizen={currentCitizen} />
          )}

          {/* TAB 5: CIVICONE WORLD TOURISM GUIDE */}
          {activeTab === 'tourism' && (
            <TourismGuide
              onSelectTravelBooking={(city) => {
                setTargetTravelCity(city);
                setActiveTab('travel');
              }}
            />
          )}

          {/* TAB 6: BOOK & TRAVEL GLOBAL HUB */}
          {activeTab === 'travel' && (
            <TravelBookingHub citizen={currentCitizen} initialDestination={targetTravelCity} />
          )}

          {/* TAB 7: PUBLIC SERVICES */}
          {activeTab === 'services' && (
            <ServicesSection />
          )}

          {/* TAB 8: GOLD PASS ENTITLEMENT */}
          {activeTab === 'gold-pass' && (
            <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '12px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '6px 16px', borderRadius: '20px', fontWeight: 800, fontSize: '0.85rem', marginBottom: '12px' }}>
                  <Crown size={18} style={{ color: '#D97706' }} /> CivicOne Gold Pass Entitlement
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-main)' }}>
                  Unlock Premium Identity Credentials
                </h1>
              </div>

              <div style={{
                backgroundColor: goldPassStatus === 'active' ? '#FEF3C7' : 'var(--bg-card)',
                borderRadius: '20px', padding: '24px', border: goldPassStatus === 'active' ? '2px solid #FACC15' : '1px solid var(--border-light)',
                marginBottom: '24px', boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase' }}>
                      Account Status:
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: goldPassStatus === 'active' ? '#856414' : 'var(--text-main)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {goldPassStatus === 'active' && <Crown size={24} style={{ color: '#CA8A04' }} />}
                      {goldPassStatus === 'active' ? "GOLD PASS ACTIVE 👑" : "STANDARD ACCOUNT"}
                    </div>
                  </div>

                  {goldPassStatus !== 'active' && (
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      style={{ backgroundColor: '#CA8A04', color: '#FFFFFF', padding: '12px 24px', borderRadius: '14px', fontWeight: 900, fontSize: '0.95rem' }}
                    >
                      Get Gold Pass (₹499/yr)
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: GOVT UPDATES & DAILY NEWS */}
          {(activeTab === 'govt-updates' || activeTab === 'news') && (
            <UpdatesAndNews govtUpdates={govtUpdates} dailyNews={dailyNews} initialTab={activeTab === 'news' ? 'news' : 'govt'} />
          )}

          {/* TAB: SECURITY CENTRE */}
          {activeTab === 'security' && (
            <SecurityCentre />
          )}

          {/* TAB: HELP CENTRE */}
          {activeTab === 'help' && (
            <HelpCentre />
          )}

          {/* TAB: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <ProfileSettings citizen={currentCitizen} onLogout={onLogout} card={cardData} onCardUpdate={(updatedCard) => setCardData(updatedCard)} />
          )}

        </main>
      </div>

      {/* Requirement 3: MOBILE BOTTOM NAVIGATION (Home | Vault | Card | Services | More) */}
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
          <Ticket size={20} style={{ color: isGoldTier ? '#CA8A04' : '#0B5ED7' }} />
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

      {/* MOBILE "MORE" DRAWER MENU (Requirement 3) */}
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
                <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>CivicOne Features</strong>
                <button onClick={() => setMobileMoreDrawerOpen(false)} style={{ background: 'none', color: 'var(--text-muted)' }}><X size={22} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { id: 'gold-pass', label: 'Gold Pass', icon: Crown },
                  { id: 'activity', label: 'My Activity', icon: Activity },
                  { id: 'privacy', label: 'Access & Consent', icon: Lock },
                  { id: 'tourism', label: 'CivicOne World', icon: Compass },
                  { id: 'travel', label: 'Travel & Bookings', icon: Plane },
                  { id: 'govt-updates', label: 'Government Updates', icon: Landmark },
                  { id: 'news', label: 'Daily News', icon: Newspaper },
                  { id: 'security', label: 'Security Centre', icon: Shield },
                  { id: 'privacy', label: 'Privacy Centre', icon: Lock },
                  { id: 'help', label: 'Help Centre', icon: HelpCircle },
                  { id: 'profile', label: 'Profile Settings', icon: User }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    style={{
                      padding: '12px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.875rem',
                      display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left',
                      backgroundColor: activeTab === item.id ? '#0B5ED7' : 'transparent',
                      color: activeTab === item.id ? '#FFFFFF' : 'var(--text-main)'
                    }}
                  >
                    <item.icon size={18} /> {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onLogout}
              style={{
                backgroundColor: '#DC3545', color: '#FFFFFF', padding: '12px', borderRadius: '12px',
                fontWeight: 800, fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px'
              }}
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>

          <div style={{ flex: 1 }} onClick={() => setMobileMoreDrawerOpen(false)} />
        </div>
      )}

      {/* FLOATING AI ASSISTANT */}
      <AiAgentFloating citizen={currentCitizen} documents={documents} />

      {/* GOLD PASS SECURE CHECKOUT PAYMENT MODAL */}
      <GoldPassPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={(entitlement) => {
          setGoldPassStatus('active');
          setCardData(prev => ({
            ...(prev || DEMO_CARD),
            tier: 'GOLD',
            goldPassStatus: 'active'
          }));
          setGoldPassMessage("Payment Verified! Your account is now upgraded to CivicOne Gold Pass 👑.");
        }}
      />

    </div>
  );
}
