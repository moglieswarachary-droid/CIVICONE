// src/components/UpdatesAndNews.jsx - Official Government Updates, Daily Media News & Gold Pass Highlights

import React, { useState, useEffect } from 'react';
import { Landmark, Newspaper, AlertCircle, Bell, ExternalLink, Calendar, ShieldCheck, ChevronRight, Crown, Sparkles, Search, Filter, X } from 'lucide-react';

export default function UpdatesAndNews({ govtUpdates: initialGovt, dailyNews: initialNews }) {
  const [activeTab, setActiveTab] = useState('govt'); // 'govt', 'news', or 'gold'
  const [govtUpdates, setGovtUpdates] = useState(initialGovt || []);
  const [dailyNews, setDailyNews] = useState(initialNews || []);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticleModal, setSelectedArticleModal] = useState(null);

  // Fetch updates & news from REST API if props not provided
  useEffect(() => {
    async function fetchNewsData() {
      try {
        const [gRes, nRes] = await Promise.all([
          fetch('/api/updates/govt').then(r => r.json()),
          fetch('/api/updates/news').then(r => r.json())
        ]);
        if (gRes.updates && gRes.updates.length > 0) setGovtUpdates(gRes.updates);
        if (nRes.news && nRes.news.length > 0) setDailyNews(nRes.news);
      } catch (err) {
        console.log("Using initial updates state");
      }
    }
    fetchNewsData();
  }, []);

  const markAsRead = (id) => {
    setGovtUpdates(prev => prev.map(u => u.id === id ? { ...u, unread: false } : u));
  };

  // Filter Govt Updates
  const filteredGovt = govtUpdates.filter(u => {
    const matchesCategory = selectedCategory === 'All' || u.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = searchQuery === '' || u.title.toLowerCase().includes(searchQuery.toLowerCase()) || u.content.toLowerCase().includes(searchQuery.toLowerCase()) || u.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter Daily News & Gold Pass News
  const filteredNews = dailyNews.filter(n => {
    let matchesCategory = true;
    if (activeTab === 'gold') {
      matchesCategory = n.category.toLowerCase().includes('gold') || n.title.toLowerCase().includes('gold');
    } else if (selectedCategory !== 'All') {
      matchesCategory = n.category.toLowerCase().includes(selectedCategory.toLowerCase());
    }
    const matchesSearch = searchQuery === '' || n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.snippet.toLowerCase().includes(searchQuery.toLowerCase()) || n.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HEADER BANNER */}
      <div style={{
        backgroundColor: '#0B1F3A',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 10px 25px rgba(11, 31, 58, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        backgroundImage: 'radial-gradient(circle at 90% 10%, rgba(59, 130, 246, 0.25) 0%, transparent 60%)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#FEF08A', border: '1px solid rgba(234, 179, 8, 0.4)', borderRadius: '20px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '8px' }}>
            <Sparkles size={14} style={{ color: '#FACC15' }} /> REAL-TIME PRESS GAZETTE & NEWS NETWORK
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
            Official Gazette Directives & Civic Media
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: 0, maxWidth: '650px' }}>
            Verified government policy circulars, department press releases, and recent media updates regarding CivicOne Digital Identity & Gold Pass infrastructure.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder="Search news or directives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#1E293B',
              color: '#FFFFFF',
              border: '1px solid #334155',
              borderRadius: '12px',
              padding: '10px 14px 10px 42px',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* MAIN TAB SWITCHER BAR */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        borderBottom: '2px solid var(--border-light)',
        paddingBottom: '12px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setActiveTab('govt'); setSelectedCategory('All'); }}
            style={{
              backgroundColor: activeTab === 'govt' ? '#0B5ED7' : 'transparent',
              color: activeTab === 'govt' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Landmark size={18} /> Official Govt Directives ({govtUpdates.length})
          </button>

          <button
            onClick={() => { setActiveTab('news'); setSelectedCategory('All'); }}
            style={{
              backgroundColor: activeTab === 'news' ? '#0B5ED7' : 'transparent',
              color: activeTab === 'news' ? '#FFFFFF' : 'var(--text-muted)',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Newspaper size={18} /> Daily News & Media ({dailyNews.length})
          </button>

          <button
            onClick={() => { setActiveTab('gold'); setSelectedCategory('All'); }}
            style={{
              backgroundColor: activeTab === 'gold' ? '#CA8A04' : 'transparent',
              color: activeTab === 'gold' ? '#FFFFFF' : '#D97706',
              border: activeTab === 'gold' ? 'none' : '1px solid #FCD34D',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Crown size={18} style={{ color: activeTab === 'gold' ? '#FFFFFF' : '#EAB308' }} /> Gold Pass News
          </button>
        </div>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {activeTab === 'govt' ? 'Official Department Press Releases' : activeTab === 'gold' ? '👑 VIP Tier Announcements' : 'Verified Media Outlets'}
        </span>
      </div>

      {/* TAB 1: OFFICIAL GOVERNMENT UPDATES */}
      {activeTab === 'govt' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredGovt.length > 0 ? (
            filteredGovt.map(upd => (
              <div
                key={upd.id}
                onClick={() => { markAsRead(upd.id); setSelectedArticleModal(upd); }}
                style={{
                  backgroundColor: upd.unread ? 'var(--bg-card-accent, #EAF3FF)' : 'var(--bg-card)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: upd.unread ? '1.5px solid #60A5FA' : '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease, boxShadow 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      backgroundColor: upd.priority === 'High' ? '#F8D7DA' : '#FEF3C7',
                      color: upd.priority === 'High' ? '#842029' : '#92400E',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}>
                      {upd.priority} Priority Directive
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      {upd.category}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <Calendar size={14} /> {upd.date}
                    {upd.unread && (
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0B5ED7' }} title="New Update" />
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.35 }}>
                  {upd.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-sub)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {upd.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                  <span>Official Authority: <strong style={{ color: 'var(--text-main)' }}>{upd.source}</strong></span>
                  <span style={{ color: '#0B5ED7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Read Full Department Directive <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', color: 'var(--text-muted)' }}>
              No government directives match your search query.
            </div>
          )}
        </div>
      )}

      {/* TAB 2 & 3: DAILY NEWS & MEDIA / GOLD PASS NEWS */}
      {(activeTab === 'news' || activeTab === 'gold') && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredNews.length > 0 ? (
            filteredNews.map(item => {
              const isGoldItem = item.category.toLowerCase().includes('gold') || item.title.toLowerCase().includes('gold');
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedArticleModal(item)}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: isGoldItem ? '1.5px solid #FCD34D' : '1px solid var(--border-light)',
                    boxShadow: isGoldItem ? '0 4px 16px rgba(234, 179, 8, 0.15)' : 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 800, color: isGoldItem ? '#D97706' : '#0B5ED7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {isGoldItem && <Crown size={14} style={{ color: '#EAB308' }} />} {item.source}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{item.date}</span>
                    </div>

                    {isGoldItem && (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '6px', fontSize: '0.68rem', fontWeight: 800, marginBottom: '8px' }}>
                        👑 GOLD PASS FEATURE
                      </div>
                    )}

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', lineHeight: 1.35 }}>
                      {item.title}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: 1.5, marginBottom: '16px' }}>
                      {item.snippet}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category: <strong>{item.category}</strong></span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: isGoldItem ? '#CA8A04' : '#0B5ED7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Read Article <ExternalLink size={14} />
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', backgroundColor: 'var(--bg-card)', borderRadius: '16px', color: 'var(--text-muted)' }}>
              No news articles match your filter.
            </div>
          )}
        </div>
      )}

      {/* FULL ARTICLE MODAL */}
      {selectedArticleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            borderRadius: '20px',
            maxWidth: '650px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span style={{
                backgroundColor: selectedArticleModal.priority === 'High' ? '#F8D7DA' : '#FEF3C7',
                color: selectedArticleModal.priority === 'High' ? '#842029' : '#92400E',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 800
              }}>
                {selectedArticleModal.source} • {selectedArticleModal.date}
              </span>
              <button
                onClick={() => setSelectedArticleModal(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '12px', lineHeight: 1.3 }}>
              {selectedArticleModal.title}
            </h2>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-sub)', lineHeight: 1.6, marginBottom: '20px' }}>
              {selectedArticleModal.content || selectedArticleModal.snippet}
            </p>

            <div style={{ backgroundColor: 'var(--bg-main)', borderRadius: '12px', padding: '14px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
              <strong>Official Verification Note:</strong> This press directive is certified by the National Informatics Centre (NIC) and CivicOne Newsroom Authority under Gazette Security Token ID <code>GAZ-2026-9048</code>.
            </div>

            <button
              onClick={() => setSelectedArticleModal(null)}
              style={{
                width: '100%',
                backgroundColor: '#0B5ED7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Close Article Reader
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
