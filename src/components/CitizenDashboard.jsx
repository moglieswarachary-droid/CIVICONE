// src/components/CitizenDashboard.jsx - Main Authenticated Citizen Portal Layout with Premium Gold Card & Responsive Cross-Platform Navigation

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Search, Bell, User, LayoutDashboard, Ticket, FolderClosed,
  Grid, Landmark, Newspaper, Shield, HelpCircle, LogOut, Sun, Moon, CheckCircle2,
  ChevronRight, Menu, X, Crown, Sparkles, HelpCircle as HelpIcon, ArrowRight, Zap, Radio, Share2
} from 'lucide-react';
import VirtualCard from './VirtualCard.jsx';
import CivicVault from './CivicVault.jsx';
import ServicesSection from './ServicesSection.jsx';
import UpdatesAndNews from './UpdatesAndNews.jsx';
import SecurityCentre from './SecurityCentre.jsx';
import HelpCentre from './HelpCentre.jsx';
import ProfileSettings from './ProfileSettings.jsx';
import AiAgentFloating from './AiAgentFloating.jsx';
import {
  DEMO_CARD, DEMO_DOCUMENTS, DEMO_GOVT_UPDATES, DEMO_NEWS,
  DEMO_NOTIFICATIONS, DEMO_CITIZENS_LIST
} from '../data/mockData.js';

export default function CitizenDashboard({ citizen, onLogout, onNavigateToVerification }) {
  // Navigation View: 'home' | 'card' | 'vault' | 'services' | 'govt-updates' | 'news' | 'security' | 'help' | 'profile'
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('light');
  // Initialize with mock data so dashboard always shows content even without backend
  const [notifications, setNotifications] = useState(DEMO_NOTIFICATIONS);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [tourStep, setTourStep] = useState(1);
  const [documents, setDocuments] = useState(DEMO_DOCUMENTS);
  const [govtUpdates, setGovtUpdates] = useState(DEMO_GOVT_UPDATES);
  const [dailyNews, setDailyNews] = useState(DEMO_NEWS);
  const [cardData, setCardData] = useState(DEMO_CARD);
  const [globalSearch, setGlobalSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoCitizens, setDemoCitizens] = useState(DEMO_CITIZENS_LIST);
  const [currentCitizen, setCurrentCitizen] = useState(citizen);

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
        // Refresh notifications & demo status
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

  // Sync theme attribute on root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'card', label: 'My Civic Card', icon: Ticket },
    { id: 'vault', label: 'My Vault', icon: FolderClosed },
    { id: 'services', label: 'Services', icon: Grid },
    { id: 'govt-updates', label: 'Govt Updates', icon: Landmark },
    { id: 'news', label: 'Daily News', icon: Newspaper },
    { id: 'security', label: 'Security Centre', icon: Shield },
    { id: 'help', label: 'Help Centre', icon: HelpCircle },
    { id: 'profile', label: 'Profile Settings', icon: User }
  ];

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const isGoldTier = cardData?.tier === 'GOLD' || !cardData;

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          
          {/* Logo & Mobile Menu Hamburger Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="mobile-only touch-target"
              style={{ background: 'none', color: 'var(--text-main)', padding: '4px' }}
              title="Open Navigation Menu"
            >
              <Menu size={24} />
            </button>

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
                  {isGoldTier ? "👑 Gold Pass" : "Citizen Portal"}
                </span>
              </div>
            </div>
          </div>

          {/* Global Search Bar */}
          <div style={{ flex: '1', maxWidth: '480px', position: 'relative' }} className="hidden-mobile">
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                if (e.target.value) setActiveTab('vault');
              }}
              placeholder="Global Search vault documents, Driving Licence, ABHA, services..."
              style={{
                width: '100%',
                padding: '10px 14px 10px 42px',
                borderRadius: '10px',
                border: '1.5px solid var(--border-light)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.875rem'
              }}
            />
          </div>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            {/* Gold Tier / Security Badge */}
            <div style={{
              backgroundColor: isGoldTier ? '#FEF3C7' : '#D1E7DD',
              color: isGoldTier ? '#92400E' : '#0F5132',
              border: `1px solid ${isGoldTier ? '#FDE68A' : '#A3E635'}`,
              padding: '4px 10px',
              borderRadius: '20px',
              fontSize: '0.725rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }} className="hidden-mobile">
              {isGoldTier ? (
                <>
                  <Crown size={14} style={{ color: '#D97706' }} /> Premium Gold VIP
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} /> 🟢 Verified
                </>
              )}
            </div>

            {/* Guided Tour Trigger */}
            <button
              onClick={() => { setTourStep(1); setShowTourModal(true); }}
              className="touch-target"
              style={{
                backgroundColor: 'var(--light-blue)',
                color: '#0B5ED7',
                border: '1px solid var(--border-blue)',
                borderRadius: '10px',
                padding: '6px 10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Open Easy Guided Tour"
            >
              <Sparkles size={16} /> <span className="hidden-mobile">Portal Tour</span>
            </button>

            {/* Dark Mode Toggle */}
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
              title="Toggle Light / Dark Theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notifications Dropdown */}
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
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#DC3545',
                    color: '#FFFFFF',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifPopover && (
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  right: 0,
                  width: '300px',
                  maxHeight: '380px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border-light)',
                  padding: '16px',
                  zIndex: 100
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

      {/* DEMO CITIZEN SWITCHER BAR (SYNTHETIC DATASET MULTI-CITIZEN ISOLATION TEST) */}
      <div style={{
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '8px 16px',
        borderBottom: '1px solid #1E293B',
        fontSize: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#FEF08A' }}>
          <Sparkles size={14} style={{ color: '#FACC15' }} /> DEMO CITIZEN SWITCHER (SYNTHETIC RELATIONAL DATASETS):
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          {demoCitizens.length > 0 ? (
            demoCitizens.map((c, i) => {
              const isActive = c.active || currentCitizen?.citizenId === c.citizenId;
              return (
                <button
                  key={c.citizenId}
                  onClick={() => handleSwitchDemoAccount(c.citizenId)}
                  style={{
                    backgroundColor: isActive ? '#0B5ED7' : '#1E293B',
                    color: isActive ? '#FFFFFF' : '#94A3B8',
                    border: isActive ? '1px solid #60A5FA' : '1px solid #334155',
                    borderRadius: '8px',
                    padding: '4px 10px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                  title={`Switch to ${c.fullName} (${c.citizenId}) - ${c.docsCount} Vault Docs`}
                >
                  👤 DEMO 0{i + 1}: {c.displayName} ({c.citizenId})
                </button>
              );
            })
          ) : (
            <span style={{ color: '#94A3B8', fontSize: '0.7rem' }}>Loading Demo Accounts...</span>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER SLIDE-OUT NAVIGATION */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.75)',
          backdropFilter: 'blur(6px)',
          zIndex: 200,
          display: 'flex'
        }}>
          <div className="drawer-slide-in" style={{
            width: '280px',
            height: '100%',
            backgroundColor: 'var(--bg-card)',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Crown size={22} style={{ color: '#CA8A04' }} />
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>CivicOne Menu</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', color: 'var(--text-muted)', padding: '6px' }}>
                  <X size={22} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    style={{
                      backgroundColor: activeTab === item.id ? (isGoldTier ? '#CA8A04' : '#0B5ED7') : 'transparent',
                      color: activeTab === item.id ? '#FFFFFF' : 'var(--text-muted)',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textAlign: 'left'
                    }}
                  >
                    <item.icon size={20} /> {item.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onLogout}
              style={{
                backgroundColor: '#DC3545',
                color: '#FFFFFF',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <LogOut size={18} /> Sign Out Session
            </button>
          </div>

          <div style={{ flex: 1 }} onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* MAIN CONTENT AREA WITH SIDEBAR */}
      <div style={{ flex: 1, display: 'flex', maxWidth: '1400px', width: '100%', margin: '0 auto', paddingBottom: '70px' }}>
        
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside style={{
          width: '240px',
          borderRight: '1px solid var(--border-light)',
          backgroundColor: 'var(--bg-card)',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          flexShrink: 0
        }} className="hidden-mobile">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px 8px 12px' }}>
              Citizen Portal Navigation
            </div>

            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                style={{
                  backgroundColor: activeTab === item.id ? (isGoldTier ? '#CA8A04' : '#0B5ED7') : 'transparent',
                  color: activeTab === item.id ? '#FFFFFF' : 'var(--text-muted)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  textAlign: 'left'
                }}
              >
                <item.icon size={18} /> {item.label}
              </button>
            ))}
          </div>

          {/* Logout Button */}
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
              marginTop: '24px'
            }}
          >
            <LogOut size={16} /> Sign Out Session
          </button>
        </aside>

        {/* MAIN DISPLAY PANEL */}
        <main style={{ flex: 1, padding: '20px 14px', overflowY: 'auto', width: '100%' }}>
          
          {/* TAB 1: HOME DASHBOARD OVERVIEW */}
          {activeTab === 'home' && (
            <div>
              
              {/* Main Greeting Banner */}
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
                      Good morning, {citizen.name}
                    </h1>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: isGoldTier ? '#FDE047' : '#0B5ED7', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={18} style={{ color: isGoldTier ? '#FACC15' : '#198754' }} />
                    {isGoldTier ? "Premium Gold VIP Clearance Active" : "Your digital identity is secure and verified."}
                  </p>
                  <p style={{ fontSize: '0.775rem', color: isGoldTier ? 'rgba(255,255,255,0.85)' : 'var(--text-light)', marginTop: '4px' }}>
                    CivicOne ID: <strong>{citizen.civicId}</strong> | Aadhaar Ref: <strong>{citizen.maskedAadhaar}</strong>
                  </p>
                </div>

                <button
                  onClick={() => handleSelectTab('card')}
                  className={isGoldTier ? "gold-btn" : ""}
                  style={!isGoldTier ? {
                    backgroundColor: '#0B5ED7',
                    color: '#FFFFFF',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(11, 94, 215, 0.3)'
                  } : {
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Ticket size={18} /> {isGoldTier ? "View Gold Card" : "View Civic Card"}
                </button>
              </div>

              {/* USER-FRIENDLY QUICK ACTION BAR / SHORTCUT DOCK */}
              <div className="quick-action-dock" style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Quick Shortcuts:
                </span>

                <button className="quick-action-btn" onClick={() => handleSelectTab('card')}>
                  <Crown size={16} style={{ color: '#CA8A04' }} /> Gold Card
                </button>

                <button className="quick-action-btn" onClick={() => handleSelectTab('vault')}>
                  <FolderClosed size={16} style={{ color: '#0B5ED7' }} /> My Vault ({documents.length})
                </button>

                <button className="quick-action-btn" onClick={() => handleSelectTab('services')}>
                  <Grid size={16} style={{ color: '#10B981' }} /> Public Services
                </button>

                <button className="quick-action-btn" onClick={() => { setTourStep(1); setShowTourModal(true); }}>
                  <Sparkles size={16} style={{ color: '#8B5CF6' }} /> Guided Tour 💡
                </button>
              </div>

              {/* TWO COLUMN GRID: VIRTUAL CARD PREVIEW + QUICK STATS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isGoldTier ? <Crown size={18} style={{ color: '#CA8A04' }} /> : <Ticket size={18} style={{ color: '#0B5ED7' }} />}
                      {isGoldTier ? "Premium Gold Card" : "Virtual Civic Card"}
                    </h2>
                    <button onClick={() => handleSelectTab('card')} style={{ background: 'none', color: isGoldTier ? '#CA8A04' : '#0B5ED7', fontSize: '0.8rem', fontWeight: 800 }}>
                      Manage <ChevronRight size={14} style={{ display: 'inline' }} />
                    </button>
                  </div>
                  
                  <VirtualCard
                    citizen={citizen}
                    card={cardData || DEMO_CARD}
                    onNavigateToVerification={onNavigateToVerification}
                    onCardUpdate={(updatedCard) => setCardData(updatedCard)}
                  />
                </div>

                {/* QUICK VAULT STATS & EXPIRY ALERTS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Vault Summary
                    </h2>
                    <button onClick={() => handleSelectTab('vault')} style={{ background: 'none', color: '#0B5ED7', fontSize: '0.8rem', fontWeight: 700 }}>
                      View All ({documents.length}) <ChevronRight size={14} style={{ display: 'inline' }} />
                    </button>
                  </div>

                  <div style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '16px',
                    padding: '16px',
                    border: '1px solid var(--border-light)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px'
                  }}>
                    <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0B5ED7' }}>
                        {documents.filter(d => d.status === 'Verified').length}
                      </div>
                      <div style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Verified Credentials
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#F59E0B' }}>
                        {documents.filter(d => d.status === 'Pending Verification').length}
                      </div>
                      <div style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Pending Audit
                      </div>
                    </div>
                  </div>

                  {/* Document Expiry Alert Banner */}
                  <div style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    borderRadius: '16px',
                    padding: '14px',
                    color: '#92400E',
                    fontSize: '0.825rem'
                  }}>
                    <strong style={{ display: 'block', fontSize: '0.85rem', marginBottom: '2px' }}>
                      ⚡ Document Validity Alert
                    </strong>
                    Driving Licence (MH02 20180094821) is active and valid until 14-10-2028.
                  </div>
                </div>

              </div>

              {/* QUICK RECENT DOCUMENTS PREVIEW */}
              <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Recent Credentials
                  </h2>
                  <button onClick={() => handleSelectTab('vault')} style={{ background: 'none', color: '#0B5ED7', fontSize: '0.8rem', fontWeight: 700 }}>
                    Open Vault
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  {documents.slice(0, 3).map(doc => (
                    <div key={doc.id} style={{ backgroundColor: 'var(--bg-main)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.725rem', color: '#0B5ED7', fontWeight: 700 }}>{doc.category}</div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)', marginTop: '4px' }}>Issuer: {doc.issuer}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: VIRTUAL CIVICONE CARD FULL VIEW */}
          {activeTab === 'card' && (
            <div style={{ maxWidth: '520px', margin: '0 auto', paddingTop: '12px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {isGoldTier ? <Crown size={26} style={{ color: '#CA8A04' }} /> : <ShieldCheck size={26} style={{ color: '#0B5ED7' }} />}
                  CivicOne Digital Card
                </h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Tamper-proof national digital identity credential with NFC &amp; Dynamic QR verification.
                </p>
              </div>

              <VirtualCard
                citizen={citizen}
                card={cardData || DEMO_CARD}
                onNavigateToVerification={onNavigateToVerification}
                onCardUpdate={(updatedCard) => setCardData(updatedCard)}
              />
            </div>
          )}

          {/* TAB 3: MY CIVIC VAULT */}
          {activeTab === 'vault' && (
            <CivicVault documents={documents} />
          )}

          {/* TAB 4: SERVICES */}
          {activeTab === 'services' && (
            <ServicesSection />
          )}

          {/* TAB 5 & 6: GOVERNMENT UPDATES & DAILY NEWS */}
          {(activeTab === 'govt-updates' || activeTab === 'news') && (
            <UpdatesAndNews
              govtUpdates={govtUpdates}
              dailyNews={dailyNews}
              initialTab={activeTab === 'news' ? 'news' : 'govt'}
            />
          )}

          {/* TAB 7: SECURITY CENTRE */}
          {activeTab === 'security' && (
            <SecurityCentre />
          )}

          {/* TAB 8: HELP CENTRE */}
          {activeTab === 'help' && (
            <HelpCentre />
          )}

          {/* TAB 9: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <ProfileSettings citizen={citizen} onLogout={onLogout} card={cardData} onCardUpdate={(updatedCard) => setCardData(updatedCard)} />
          )}

        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR (MOBILE ONLY) */}
      <nav className="mobile-bottom-nav mobile-only">
        <button
          className={`mobile-bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => handleSelectTab('home')}
        >
          <LayoutDashboard size={20} />
          <span>Home</span>
        </button>

        <button
          className={`mobile-bottom-nav-item ${activeTab === 'vault' ? 'active' : ''}`}
          onClick={() => handleSelectTab('vault')}
        >
          <FolderClosed size={20} />
          <span>Vault</span>
        </button>

        <button
          className={`mobile-bottom-nav-item ${activeTab === 'card' ? 'active' : ''}`}
          onClick={() => handleSelectTab('card')}
        >
          <Ticket size={20} style={{ color: isGoldTier ? '#CA8A04' : '#0B5ED7' }} />
          <span style={{ color: isGoldTier ? '#CA8A04' : '' }}>Card</span>
        </button>

        <button
          className={`mobile-bottom-nav-item ${activeTab === 'services' ? 'active' : ''}`}
          onClick={() => handleSelectTab('services')}
        >
          <Grid size={20} />
          <span>Services</span>
        </button>

        <button
          className={`mobile-bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => handleSelectTab('profile')}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
      </nav>

      {/* EASY GUIDED TOUR MODAL */}
      {showTourModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            maxWidth: '440px',
            width: '100%',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowTourModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            {/* TOUR STEP 1 */}
            {tourStep === 1 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '18px',
                  background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
                  color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px auto', boxShadow: '0 8px 20px rgba(202, 138, 4, 0.3)'
                }}>
                  <Crown size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px' }}>
                  Welcome to Premium Gold CivicOne!
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                  Your portal features the **Premium Gold Virtual Card** tier, giving you VIP priority clearance and encrypted digital credentials.
                </p>
              </div>
            )}

            {/* TOUR STEP 2 */}
            {tourStep === 2 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '18px',
                  backgroundColor: '#0B5ED7', color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px auto', boxShadow: '0 8px 20px rgba(11, 94, 215, 0.3)'
                }}>
                  <FolderClosed size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px' }}>
                  My Civic Vault Storage
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                  Store & organize all your official documents (Aadhaar, PAN, Driving Licence, ABHA, Degrees) with cryptographic verification.
                </p>
              </div>
            )}

            {/* TOUR STEP 3 */}
            {tourStep === 3 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '18px',
                  backgroundColor: '#10B981', color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px auto', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                }}>
                  <Radio size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px' }}>
                  Instant NFC & QR Verification
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                  Tap your phone via NFC or display your dynamic QR code for instant zero-paper identity verification.
                </p>
              </div>
            )}

            {/* TOUR STEP 4 */}
            {tourStep === 4 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '18px',
                  backgroundColor: '#8B5CF6', color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 14px auto', boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
                }}>
                  <Share2 size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px' }}>
                  Passcoded Credential Sharing
                </h3>
                <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, marginBottom: '20px' }}>
                  Share time-limited, passcoded links with banks, employers, or RTO without revealing raw document numbers.
                </p>
              </div>
            )}

            {/* PROGRESS DOTS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '18px' }}>
              {[1, 2, 3, 4].map(step => (
                <div key={step} style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  backgroundColor: tourStep === step ? '#0B5ED7' : '#E2E8F0'
                }} />
              ))}
            </div>

            {/* TOUR CONTROLS */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {tourStep > 1 && (
                <button
                  onClick={() => setTourStep(tourStep - 1)}
                  style={{
                    flex: 1, backgroundColor: '#F1F5F9', color: '#475569',
                    padding: '10px', borderRadius: '12px', fontWeight: 700
                  }}
                >
                  Back
                </button>
              )}
              {tourStep < 4 ? (
                <button
                  onClick={() => setTourStep(tourStep + 1)}
                  style={{
                    flex: 1, backgroundColor: '#0B5ED7', color: '#FFFFFF',
                    padding: '10px', borderRadius: '12px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setShowTourModal(false)}
                  style={{
                    flex: 1, backgroundColor: '#10B981', color: '#FFFFFF',
                    padding: '10px', borderRadius: '12px', fontWeight: 800
                  }}
                >
                  Explore 🚀
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CIVICONE AI ASSISTANT */}
      <AiAgentFloating citizen={citizen} documents={documents} />

    </div>
  );
}
