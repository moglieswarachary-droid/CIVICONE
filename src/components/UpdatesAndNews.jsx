// src/components/UpdatesAndNews.jsx - Official Government Directives, Daily News & Gold Pass VIP Announcements

import React, { useState, useEffect } from 'react';
import { Landmark, Newspaper, Crown, Calendar, ChevronRight, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';

export default function UpdatesAndNews({ govtUpdates: initialGovt, dailyNews: initialNews }) {
  const [activeTab, setActiveTab] = useState('govt'); // 'govt' | 'news' | 'gold'
  const [govtUpdates, setGovtUpdates] = useState(initialGovt || []);
  const [dailyNews, setDailyNews] = useState(initialNews || []);

  useEffect(() => {
    async function fetchUpdates() {
      try {
        const [gRes, nRes] = await Promise.all([
          fetch('/api/updates/govt').then(r => r.json()),
          fetch('/api/updates/news').then(r => r.json())
        ]);
        if (gRes.updates) setGovtUpdates(gRes.updates);
        if (nRes.news) setDailyNews(nRes.news);
      } catch (err) {
        console.log("Using cached news data");
      }
    }
    fetchUpdates();
  }, []);

  const markAsRead = (id) => {
    setGovtUpdates(prev => prev.map(u => u.id === id ? { ...u, unread: false } : u));
  };

  const goldGovt = govtUpdates.filter(u => u.isGoldPass);
  const goldNews = dailyNews.filter(n => n.isGoldPass);
  const allGold = [...goldGovt.map(g => ({ ...g, type: 'Directive' })), ...goldNews.map(n => ({ ...n, type: 'News' }))];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* Tab Switcher Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        borderBottom: '2px solid #E2E8F0',
        paddingBottom: '12px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('govt')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'govt' ? '3px solid #0B5ED7' : '3px solid transparent',
              paddingBottom: '12px',
              fontSize: '1rem',
              fontWeight: 800,
              color: activeTab === 'govt' ? '#0B5ED7' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Landmark size={20} /> Official Government Updates ({govtUpdates.length})
          </button>

          <button
            onClick={() => setActiveTab('news')}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'news' ? '3px solid #0B5ED7' : '3px solid transparent',
              paddingBottom: '12px',
              fontSize: '1rem',
              fontWeight: 800,
              color: activeTab === 'news' ? '#0B5ED7' : '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <Newspaper size={20} /> Daily News & Media ({dailyNews.length})
          </button>

          <button
            onClick={() => setActiveTab('gold')}
            style={{
              backgroundColor: activeTab === 'gold' ? '#FEF08A' : 'transparent',
              border: activeTab === 'gold' ? '1px solid #CA8A04' : '1px solid transparent',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#854D0E',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: activeTab === 'gold' ? '0 2px 8px rgba(202, 138, 4, 0.3)' : 'none'
            }}
          >
            <Crown size={18} style={{ color: '#CA8A04' }} /> 👑 Gold Pass News & Privileges
          </button>
        </div>

        <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
          {activeTab === 'govt' ? 'Official Department Press Releases' : activeTab === 'news' ? 'Verified Media Outlets' : 'Exclusive VIP Tier Announcements'}
        </span>
      </div>

      {/* TAB 1: OFFICIAL GOVERNMENT UPDATES */}
      {activeTab === 'govt' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {govtUpdates.map(upd => (
            <div
              key={upd.id}
              onClick={() => markAsRead(upd.id)}
              style={{
                backgroundColor: upd.isGoldPass ? '#FEFCE8' : upd.unread ? '#EAF3FF' : '#FFFFFF',
                borderRadius: '16px',
                padding: '20px',
                border: upd.isGoldPass ? '1.5px solid #FDE047' : upd.unread ? '1.5px solid #BFDBFE' : '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {upd.isGoldPass && (
                    <span style={{ backgroundColor: '#CA8A04', color: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Crown size={12} /> GOLD PASS VIP
                    </span>
                  )}
                  <span style={{
                    backgroundColor: upd.priority === 'High' ? '#F8D7DA' : '#FEF3C7',
                    color: upd.priority === 'High' ? '#842029' : '#92400E',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 700
                  }}>
                    {upd.priority} Priority
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                    {upd.category}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#64748B' }}>
                  <Calendar size={14} /> {upd.date}
                  {upd.unread && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0B5ED7' }} />
                  )}
                </div>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>
                {upd.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, marginBottom: '12px' }}>
                {upd.content}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748B', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <span>Official Source: <strong>{upd.source}</strong></span>
                <span style={{ color: '#0B5ED7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Read Full Department Directive <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: DAILY NEWS & MEDIA */}
      {activeTab === 'news' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {dailyNews.map(item => (
            <div
              key={item.id}
              style={{
                backgroundColor: item.isGoldPass ? '#FEFCE8' : '#FFFFFF',
                borderRadius: '16px',
                padding: '20px',
                border: item.isGoldPass ? '1.5px solid #FDE047' : '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748B', marginBottom: '10px' }}>
                  <span style={{ fontWeight: 700, color: item.isGoldPass ? '#854D0E' : '#073B8C' }}>{item.source}</span>
                  <span>{item.date}</span>
                </div>

                {item.isGoldPass && (
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ backgroundColor: '#EAB308', color: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 800 }}>
                      👑 GOLD PASS SPECIAL
                    </span>
                  </div>
                )}

                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '8px', lineHeight: 1.35 }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, marginBottom: '16px' }}>
                  {item.snippet}
                </p>
              </div>

              <a
                href="#news"
                onClick={(e) => { e.preventDefault(); alert(`Opening full article: "${item.title}" from ${item.source}`); }}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#0B5ED7',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                Read Article <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: GOLD PASS VIP NEWS & PRIVILEGES */}
      {activeTab === 'gold' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF08A 100%)',
            border: '1.5px solid #CA8A04',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#854D0E', fontSize: '1.1rem' }}>
                <Crown size={24} style={{ color: '#CA8A04' }} /> CivicOne Gold Pass Executive Privilege Feed
              </div>
              <p style={{ fontSize: '0.85rem', color: '#713F12', marginTop: '4px' }}>
                Official directives, express airport clearances, priority passport dispatches, and VIP banking privileges for Gold Tier Identity Holders.
              </p>
            </div>
            <span style={{ backgroundColor: '#CA8A04', color: '#FFFFFF', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
              👑 GOLD PASS VERIFIED
            </span>
          </div>

          {allGold.map(item => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px',
                border: '1.5px solid #FACC15',
                boxShadow: '0 4px 14px rgba(234, 179, 8, 0.15)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ backgroundColor: '#FEF08A', color: '#854D0E', padding: '3px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} style={{ color: '#CA8A04' }} /> GOLD PASS {item.type?.toUpperCase() || 'PRIVILEGE'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{item.date}</span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '8px' }}>
                {item.title}
              </h3>

              <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, marginBottom: '12px' }}>
                {item.content || item.snippet}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748B', paddingTop: '10px', borderTop: '1px solid #FEF08A' }}>
                <span>Source: <strong>{item.source}</strong></span>
                <span style={{ color: '#CA8A04', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => alert(`Opening Gold Pass Privilege details for ${item.title}`)}>
                  View Gold Pass Perk <ChevronRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

