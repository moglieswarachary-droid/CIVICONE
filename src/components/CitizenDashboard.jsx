// src/components/CitizenDashboard.jsx - Main Authenticated Citizen Portal Layout with Premium Gold Card

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

export default function CitizenDashboard({ citizen, onLogout, onNavigateToVerification }) {
  // Navigation View: 'home' | 'card' | 'vault' | 'services' | 'govt-updates' | 'news' | 'security' | 'help' | 'profile'
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [tourStep, setTourStep] = useState(1);
  const [documents, setDocuments] = useState([]);
  const [govtUpdates, setGovtUpdates] = useState([]);
  const [dailyNews, setDailyNews] = useState([]);
  const [cardData, setCardData] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch initial dashboard data from REST API backend
  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [cardRes, docsRes, notifRes, govtRes, newsRes] = await Promise.all([
          fetch('/api/card/me').then(r => r.json()),
          fetch('/api/vault/documents').then(r => r.json()),
          fetch('/api/notifications').then(r => r.json()),
          fetch('/api/updates/govt').then(r => r.json()),
          fetch('/api/updates/news').then(r => r.json())
        ]);

        if (cardRes.card) setCardData(cardRes.card);
        if (docsRes.documents) setDocuments(docsRes.documents);
        if (notifRes.notifications) setNotifications(notifRes.notifications);
        if (govtRes.updates) setGovtUpdates(govtRes.updates);
        if (newsRes.news) setDailyNews(newsRes.news);
      } catch (err) {
        console.log("Using cached/seed data fallback");
      }
    }
    loadDashboardData();
  }, []);

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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      
      {/* GLOBAL HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-light)',
        padding: '12px 24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: isGoldTier ? 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)' : '#0B5ED7',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isGoldTier ? '0 4px 14px rgba(202, 138, 4, 0.4)' : '0 4px 12px rgba(11, 94, 215, 0.3)'
            }}>
              {isGoldTier ? <Crown size={24} /> : <ShieldCheck size={24} />}
            </div>
            <div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)' }}>
                CivicOne
              </span>
              <span style={{ display: 'block', fontSize: '0.625rem', fontWeight: 800, color: isGoldTier ? '#CA8A04' : '#0B5ED7', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '-4px' }}>
                {isGoldTier ? "👑 Premium Gold Citizen Portal" : "Citizen Portal"}
              </span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            
            {/* Gold Tier / Security Badge */}
            <div style={{
              backgroundColor: isGoldTier ? '#FEF3C7' : '#D1E7DD',
              color: isGoldTier ? '#92400E' : '#0F5132',
              border: `1px solid ${isGoldTier ? '#FDE68A' : '#A3E635'}`,
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.75rem',
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
                  <CheckCircle2 size={14} /> 🟢 Identity Verified
                </>
              )}
            </div>

            {/* Guided Tour Trigger */}
            <button
              onClick={() => { setTourStep(1); setShowTourModal(true); }}
              style={{
                backgroundColor: 'var(--light-blue)',
                color: '#0B5ED7',
                border: '1px solid var(--border-blue)',
                borderRadius: '10px',
                padding: '8px 12px',
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
                  width: '320px',
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

      {/* MAIN CONTENT AREA WITH SIDEBAR */}
      <div style={{ flex: 1, display: 'flex', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
        
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
                onClick={() => setActiveTab(item.id)}
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
        <main style={{ flex: 1, padding: '24px 16px', overflowY: 'auto' }}>
          
          {/* TAB 1: HOME DASHBOARD OVERVIEW */}
          {activeTab === 'home' && (
            <div>
              
              {/* Main Greeting Banner */}
              <div style={{
                background: isGoldTier
                  ? 'linear-gradient(135deg, #1C190D 0%, #3B2E09 60%, #856414 100%)'
                  : 'var(--bg-card)',
                borderRadius: '20px',
                padding: '28px',
                border: isGoldTier ? '1.5px solid #FACC15' : '1px solid var(--border-light)',
                boxShadow: isGoldTier ? '0 10px 30px rgba(202, 138, 4, 0.25)' : 'var(--shadow-sm)',
                marginBottom: '20px',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px',
                color: isGoldTier ? '#FFFFFF' : 'var(--text-main)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    {isGoldTier && <Crown size={22} style={{ color: '#FDE047' }} />}
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', color: isGoldTier ? '#FEF08A' : 'var(--text-main)' }}>
                      Good morning, {citizen.name}
                    </h1>
                  </div>
                  <p style={{ fontSize: '0.95rem', color: isGoldTier ? '#FDE047' : '#0B5ED7', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={18} style={{ color: isGoldTier ? '#FACC15' : '#198754' }} />
                    {isGoldTier ? "Premium Gold VIP Clearance Active" : "Your digital identity is secure and verified."}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: isGoldTier ? 'rgba(255,255,255,0.85)' : 'var(--text-light)', marginTop: '4px' }}>
                    CivicOne ID: <strong>{citizen.civicId}</strong> | Aadhaar Ref: <strong>{citizen.maskedAadhaar}</strong>
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('card')}
                  className={isGoldTier ? "gold-btn" : ""}
                  style={!isGoldTier ? {
                    backgroundColor: '#0B5ED7',
                    color: '#FFFFFF',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(11, 94, 215, 0.3)'
                  } : {
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Ticket size={18} /> {isGoldTier ? "View Premium Gold Card" : "View Civic Card"}
                </button>
              </div>

              {/* USER-FRIENDLY QUICK ACTION BAR / SHORTCUT DOCK */}
              <div className="quick-action-dock" style={{ marginBottom: '28px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Quick Shortcuts:
                </span>

                <button className="quick-action-btn" onClick={() => setActiveTab('card')}>
                  <Crown size={16} style={{ color: '#CA8A04' }} /> Premium Gold Card
                </button>

                <button className="quick-action-btn" onClick={() => setActiveTab('vault')}>
                  <FolderClosed size={16} style={{ color: '#0B5ED7' }} /> My Vault ({documents.length})
                </button>

                <button className="quick-action-btn" onClick={() => setActiveTab('services')}>
                  <Grid size={16} style={{ color: '#10B981' }} /> Public Services
                </button>

                <button className="quick-action-btn" onClick={() => { setTourStep(1); setShowTourModal(true); }}>
                  <Sparkles size={16} style={{ color: '#8B5CF6' }} /> Guided Tour 💡
                </button>
              </div>

              {/* TWO COLUMN GRID: VIRTUAL CARD PREVIEW + QUICK STATS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isGoldTier ? <Crown size={18} style={{ color: '#CA8A04' }} /> : <Ticket size={18} style={{ color: '#0B5ED7' }} />}
                      {isGoldTier ? "Premium Gold Virtual Card" : "Virtual CivicOne Card"}
                    </h2>
                    <button onClick={() => setActiveTab('card')} style={{ background: 'none', color: isGoldTier ? '#CA8A04' : '#0B5ED7', fontSize: '0.8rem', fontWeight: 800 }}>
                      Manage Card <ChevronRight size={14} style={{ display: 'inline' }} />
                    </button>
                  </div>
                  
                  {cardData && (
                    <VirtualCard
                      citizen={citizen}
                      card={cardData}
                      onNavigateToVerification={onNavigateToVerification}
                      onCardUpdate={(updatedCard) => setCardData(updatedCard)}
                    />
                  )}
                </div>

                {/* QUICK VAULT STATS & EXPIRY ALERTS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      Vault Summary & Status
                    </h2>
                    <button onClick={() => setActiveTab('vault')} style={{ background: 'none', color: '#0B5ED7', fontSize: '0.8rem', fontWeight: 700 }}>
                      View All ({documents.length}) <ChevronRight size={14} style={{ display: 'inline' }} />
                    </button>
                  </div>

                  <div style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid var(--border-light)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px'
                  }}>
                    <div style={{ backgroundColor: 'var(--bg-main)', padding: '14px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0B5ED7' }}>
                        {documents.filter(d => d.status === 'Verified').length}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Verified Documents
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--bg-main)', padding: '14px', borderRadius: '12px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F59E0B' }}>
                        {documents.filter(d => d.status === 'Pending Verification').length}
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        Pending Audit
                      </div>
                    </div>
                  </div>

                  {/* Document Expiry Alert Banner */}
                  <div style={{
                    backgroundColor: '#FEF3C7',
                    border: '1px solid #FDE68A',
                    borderRadius: '16px',
                    padding: '16px',
                    color: '#92400E',
                    fontSize: '0.85rem'
                  }}>
                    <strong style={{ display: 'block', fontSize: '0.9rem', marginBottom: '4px' }}>
                      ⚡ Document Validity Alert
                    </strong>
                    Your Driving Licence (MH02 20180094821) is active and valid until 14-10-2028.
                  </div>
                </div>

              </div>

              {/* QUICK RECENT DOCUMENTS PREVIEW */}
              <div style={{ backgroundColor: 'var(--bg-card)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Recent Vault Credentials
                  </h2>
                  <button onClick={() => setActiveTab('vault')} style={{ background: 'none', color: '#0B5ED7', fontSize: '0.825rem', fontWeight: 700 }}>
                    Open My Civic Vault
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {documents.slice(0, 3).map(doc => (
                    <div key={doc.id} style={{ backgroundColor: 'var(--bg-main)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                      <div style={{ fontSize: '0.75rem', color: '#0B5ED7', fontWeight: 700 }}>{doc.category}</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Issuer: {doc.issuer}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: VIRTUAL CIVICONE CARD FULL VIEW */}
          {activeTab === 'card' && cardData && (
            <div style={{ maxWidth: '520px', margin: '0 auto', paddingTop: '20px' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  {isGoldTier ? <Crown size={28} style={{ color: '#CA8A04' }} /> : <ShieldCheck size={28} style={{ color: '#0B5ED7' }} />}
                  {isGoldTier ? "Premium Gold Card Portal" : "CivicOne Digital Card"}
                </h1>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Your official tamper-proof national digital identity credential with instant NFC & QR verification.
                </p>
              </div>

              <VirtualCard
                citizen={citizen}
                card={cardData}
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
            <UpdatesAndNews govtUpdates={govtUpdates} dailyNews={dailyNews} />
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
            padding: '32px',
            maxWidth: '460px',
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
                  width: '64px', height: '64px', borderRadius: '20px',
                  background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
                  color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px auto', boxShadow: '0 8px 20px rgba(202, 138, 4, 0.3)'
                }}>
                  <Crown size={32} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px' }}>
                  Welcome to Premium Gold CivicOne!
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '24px' }}>
                  Your portal features the **Premium Gold Virtual Card** tier, giving you VIP priority clearance and encrypted digital credentials.
                </p>
              </div>
            )}

            {/* TOUR STEP 2 */}
            {tourStep === 2 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '20px',
                  backgroundColor: '#0B5ED7', color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px auto', boxShadow: '0 8px 20px rgba(11, 94, 215, 0.3)'
                }}>
                  <FolderClosed size={32} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px' }}>
                  My Civic Vault Storage
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '24px' }}>
                  Store & organize all your official documents (Aadhaar, PAN, Driving Licence, ABHA, Degrees) with cryptographic verification.
                </p>
              </div>
            )}

            {/* TOUR STEP 3 */}
            {tourStep === 3 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '20px',
                  backgroundColor: '#10B981', color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px auto', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                }}>
                  <Radio size={32} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px' }}>
                  Instant NFC & QR Verification
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '24px' }}>
                  Tap your phone via NFC or display your dynamic QR code for instant zero-paper identity verification.
                </p>
              </div>
            )}

            {/* TOUR STEP 4 */}
            {tourStep === 4 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '20px',
                  backgroundColor: '#8B5CF6', color: '#FFFFFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px auto', boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
                }}>
                  <Share2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px' }}>
                  Passcoded Credential Sharing
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '24px' }}>
                  Share time-limited, passcoded links with banks, employers, or RTO without revealing raw document numbers.
                </p>
              </div>
            )}

            {/* PROGRESS DOTS */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
              {[1, 2, 3, 4].map(step => (
                <div key={step} style={{
                  width: '10px', height: '10px', borderRadius: '50%',
                  backgroundColor: tourStep === step ? '#0B5ED7' : '#E2E8F0'
                }} />
              ))}
            </div>

            {/* TOUR CONTROLS */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {tourStep > 1 && (
                <button
                  onClick={() => setTourStep(tourStep - 1)}
                  style={{
                    flex: 1, backgroundColor: '#F1F5F9', color: '#475569',
                    padding: '12px', borderRadius: '12px', fontWeight: 700
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
                    padding: '12px', borderRadius: '12px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                  }}
                >
                  Next Step <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={() => setShowTourModal(false)}
                  style={{
                    flex: 1, backgroundColor: '#10B981', color: '#FFFFFF',
                    padding: '12px', borderRadius: '12px', fontWeight: 800
                  }}
                >
                  Explore Portal Now 🚀
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
