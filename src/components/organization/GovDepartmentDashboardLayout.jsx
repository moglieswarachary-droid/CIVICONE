// src/components/organization/GovDepartmentDashboardLayout.jsx - Unified 3-Column Government Department Workspace

import React, { useState } from 'react';
import { ShieldCheck, LogOut, Search, Filter, Plus, FileText, CheckCircle, AlertCircle, Eye, ArrowLeft, RefreshCw, Check } from 'lucide-react';
import GovCitizenVerificationPanel from './GovCitizenVerificationPanel.jsx';

export default function GovDepartmentDashboardLayout({
  officer,
  config,
  stats = [],
  leftContent,
  worklist = [],
  worklistFilters = [],
  onRegisterAction,
  onLogout,
  onReturnHome
}) {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [syncNotice, setSyncNotice] = useState('');

  // Filtering
  const filteredWorklist = worklist.filter((item) => {
    if (activeFilter === 'ALL') return true;
    const cat = (item.category || item.type || item.status || '').toUpperCase();
    return cat.includes(activeFilter.toUpperCase());
  });

  const triggerCitizenSync = (actionName, citizenId) => {
    setSyncNotice(`Record successfully synchronized with CivicOne Citizen ID (${citizenId}).`);
    setTimeout(() => setSyncNotice(''), 4000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
      
      {/* Top Header Bar */}
      <header style={{
        backgroundColor: '#0B1F3A',
        color: '#FFFFFF',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              {config?.logoEmoji || '🏛️'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  {officer?.department || config?.name || 'Government Department'}
                </h1>
                <span style={{
                  backgroundColor: '#22C55E20',
                  color: '#4ADE80',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  border: '1px solid #22C55E40'
                }}>
                  ACTIVE SESSION
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', margin: 0 }}>
                {officer?.state || 'State Level'} • Station/Office Code: <strong style={{ color: '#E2E8F0' }}>{officer?.officeCode || officer?.policeStationCode || 'GOVT-101'}</strong> • Branch: {officer?.policeBranch || 'Administrative'}
              </p>
            </div>
          </div>

          {/* Officer Profile & Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#F8FAFC' }}>
                {officer?.name || 'Authorized Officer'}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                {officer?.roleTitle || 'Level 3 Clearance'}
              </div>
            </div>

            <button
              onClick={onReturnHome || onLogout}
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#FCA5A5',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.825rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

        </div>
      </header>

      {/* Synchronized Citizen Notice Toast */}
      {syncNotice && (
        <div style={{
          backgroundColor: '#059669',
          color: '#FFFFFF',
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 700,
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <CheckCircle size={18} /> {syncNotice}
        </div>
      )}

      {/* Main Container */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 16px' }}>
        
        {/* Statistics Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {stats.map((st, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '18px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
                {st.label}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: st.color || '#0F172A' }}>
                {st.value}
              </div>
            </div>
          ))}
        </div>

        {/* 3-Column Responsive Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px'
        }}>
          
          {/* LEFT SIDE PANEL (3 Columns on Desktop) */}
          <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                Jurisdiction & Station Details
              </h3>
              {leftContent || (
                <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
                  <strong>Office:</strong> {officer?.officeName || 'Central HQ'}<br />
                  <strong>Jurisdiction:</strong> District Level<br />
                  <strong>Station Code:</strong> {officer?.officeCode || officer?.policeStationCode || 'AP-101'}<br />
                  <strong>Active Officers:</strong> 12 On Duty<br />
                  <strong>Clearance Level:</strong> Level 3 Verified
                </div>
              )}
            </div>
          </div>

          {/* CENTER PANEL - WORKLIST & CASES (6 Columns on Desktop) */}
          <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
            }}>
              
              {/* Header & Filter Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                    Department Records & Worklist
                  </h3>
                  <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                    Showing {filteredWorklist.length} total entries
                  </span>
                </div>
              </div>

              {/* Filters Horizontal Scroll Bar */}
              {worklistFilters.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '16px' }}>
                  {worklistFilters.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.775rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: activeFilter === f ? '#0B5ED7' : '#E2E8F0',
                        backgroundColor: activeFilter === f ? '#EAF3FF' : '#FFFFFF',
                        color: activeFilter === f ? '#0B5ED7' : '#475569',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}

              {/* Worklist Items Table / Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredWorklist.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '14px',
                      border: '1px solid #E2E8F0',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0B5ED7' }}>
                          {item.id || item.refNo}
                        </span>
                        <span style={{
                          backgroundColor: '#E2E8F0',
                          color: '#334155',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px'
                        }}>
                          {item.category || item.type || 'General'}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                        {item.title || item.name || item.applicantName || 'Citizen Record'}
                      </div>
                      
                      <div style={{ fontSize: '0.775rem', color: '#64748B', marginTop: '2px' }}>
                        Citizen ID: <strong>{item.citizenId || item.civicId}</strong> • Date: {item.date || 'Today'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        backgroundColor: (item.status || '').includes('Closed') || (item.status || '').includes('VERIFIED') || (item.status || '').includes('Approved') ? '#DCFCE7' : '#FEF3C7',
                        color: (item.status || '').includes('Closed') || (item.status || '').includes('VERIFIED') || (item.status || '').includes('Approved') ? '#166534' : '#92400E',
                        fontSize: '0.725rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '10px'
                      }}>
                        {item.status || 'Pending'}
                      </span>

                      <button
                        onClick={() => setSelectedRecord(item)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '10px',
                          padding: '6px 12px',
                          fontSize: '0.775rem',
                          fontWeight: 700,
                          color: '#0F172A',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Eye size={14} /> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* RIGHT SIDE PANEL - CITIZEN VERIFICATION (3 Columns on Desktop) */}
          <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <GovCitizenVerificationPanel
              department={config?.id || 'police'}
              onRegisterNewAction={(citizen) => {
                setShowRegisterModal(true);
                if (onRegisterAction) onRegisterAction(citizen);
              }}
            />
          </div>

        </div>
      </main>

      {/* Record View Modal */}
      {selectedRecord && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15,23,42,0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '560px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Record Details ({selectedRecord.id || selectedRecord.refNo})
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              Official Department Verification Log
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.875rem', color: '#334155', marginBottom: '24px' }}>
              <div><strong>Citizen ID:</strong> {selectedRecord.citizenId || selectedRecord.civicId}</div>
              <div><strong>Title / Description:</strong> {selectedRecord.title || selectedRecord.name || selectedRecord.description}</div>
              <div><strong>Category:</strong> {selectedRecord.category || selectedRecord.type}</div>
              <div><strong>Status:</strong> {selectedRecord.status}</div>
              <div><strong>Assigned Officer:</strong> {officer?.name || 'Department Officer'}</div>
              <div><strong>Audit Hash:</strong> SHA256:{Math.random().toString(36).substring(2, 15)}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => {
                  triggerCitizenSync(selectedRecord.title, selectedRecord.citizenId || 'CIV-DEMO-10001');
                  setSelectedRecord(null);
                }}
                style={{
                  backgroundColor: '#0B5ED7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Sync with Citizen Vault
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                style={{
                  backgroundColor: '#E2E8F0',
                  color: '#334155',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Layout Responsiveness */}
      <style>{`
        @media (max-width: 1023px) {
          main > div {
            grid-template-columns: 1fr !important;
          }
          main > div > div {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  );
}
