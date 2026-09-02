// src/components/organization/FinancialDashboardLayout.jsx - Unified 3-Column Workspace for Banking & Finance

import React, { useState } from 'react';
import { Landmark, LogOut, Search, Filter, Plus, CheckCircle2, AlertTriangle, Eye, ShieldCheck, TrendingUp, ShieldAlert, CreditCard, DollarSign, FileText, Lock } from 'lucide-react';
import FinancialCitizenVerificationPanel from './FinancialCitizenVerificationPanel.jsx';

export default function FinancialDashboardLayout({
  session,
  config,
  stats = [],
  worklist = [],
  loanApplications = [],
  claimsList = [],
  onLogout,
  onReturnHome
}) {
  const categoryType = session?.categoryType || config?.id || 'gov_bank';
  const isBank = categoryType === 'government_bank' || categoryType === 'private_bank' || categoryType === 'gov_bank' || categoryType === 'priv_bank';
  const isInvestment = categoryType === 'investment';
  const isInsurance = categoryType === 'insurance';

  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState(worklist);
  const [loans, setLoans] = useState(loanApplications);
  const [claims, setClaims] = useState(claimsList);

  // Handle New Customer / Investor / Policy Registration
  const handleRegisterCustomer = (newRecord) => {
    setRecords([newRecord, ...records]);
  };

  // Handle New Loan Application
  const handleApplyLoan = (newLoan) => {
    setLoans([newLoan, ...loans]);
  };

  // Handle New Claim Submission
  const handleSubmitClaim = (newClaim) => {
    setClaims([newClaim, ...claims]);
  };

  // Filter Worklist
  const filteredRecords = records.filter((rec) => {
    // 1. Status/Type Filter
    if (selectedFilter !== 'ALL') {
      const f = selectedFilter.toLowerCase();
      const matchType = (rec.accountType || rec.investmentType || rec.policyType || '').toLowerCase().includes(f);
      const matchStatus = (rec.status || rec.kycStatus || '').toLowerCase().includes(f);
      if (!matchType && !matchStatus) return false;
    }

    // 2. Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = (rec.name || rec.applicantName || '').toLowerCase().includes(q);
      const matchId = (rec.citizenId || rec.id || rec.policyholderId || '').toLowerCase().includes(q);
      if (!matchName && !matchId) return false;
    }
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A' }}>
      
      {/* Top Header Bar */}
      <header style={{
        backgroundColor: isBank ? '#9A3412' : isInvestment ? '#1E3A8A' : '#065F46',
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
              backgroundColor: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              fontSize: '1.5rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              {config?.logoEmoji || (isBank ? '🏦' : isInvestment ? '📊' : '🛡️')}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: '#FFFFFF' }}>
                  {session?.name || config?.name}
                </h1>
                <span style={{ fontSize: '0.675rem', fontWeight: 800, backgroundColor: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '6px' }}>
                  {session?.code || 'FIN-AP-001'}
                </span>
              </div>
              <p style={{ fontSize: '0.775rem', color: 'rgba(255,255,255,0.8)', margin: '2px 0 0 0' }}>
                {session?.branchName} • {session?.state} | Role: <strong>{session?.roleTitle || 'Financial Officer'}</strong>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80' }}></span>
              <span>● Active System</span>
            </div>

            <button
              onClick={onLogout}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.25)',
                borderRadius: '10px',
                padding: '7px 14px',
                fontSize: '0.8rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <LogOut size={15} /> Logout
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px' }}>
        
        {/* KPI Statistics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}>
          {stats.map((st, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '14px 16px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ fontSize: '0.775rem', color: '#64748B', fontWeight: 600, marginBottom: '6px' }}>
                {st.label}
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: st.color || '#0F172A' }}>
                {st.value}
              </div>
            </div>
          ))}
        </div>

        {/* 3-Column Grid Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px'
        }}>
          
          {/* LEFT PANEL: Institution Details & Quick Info (3 Columns) */}
          <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                {isBank ? 'Bank Details' : isInvestment ? 'Investment Org Details' : 'Insurance Details'}
              </h3>
              
              <div style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.6, marginBottom: '14px' }}>
                <strong>Name:</strong> {session?.name}<br />
                <strong>Branch / Office:</strong> {session?.branchName}<br />
                <strong>Code:</strong> {session?.code}<br />
                <strong>State:</strong> {session?.state}<br />
                <strong>Clearance:</strong> {session?.clearanceStatus || 'VERIFIED ENTITY'}<br />
                <strong>API Gateway:</strong> CIVIQONE ADV eKYC
              </div>

              <div style={{
                backgroundColor: '#FFF7ED',
                border: '1px solid #FFEDD5',
                borderRadius: '12px',
                padding: '10px 12px',
                fontSize: '0.75rem',
                color: '#9A3412',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={16} color="#D97706" />
                <span>eKYC Tokenized Compliance Enabled</span>
              </div>
            </div>

          </div>

          {/* CENTER PANEL: Main Customer / Investor / Policy Worklist (6 Columns) */}
          <div style={{ gridColumn: 'span 6', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
            }}>
              
              {/* Header & Filters */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                    {isBank ? 'Customer Accounts' : isInvestment ? 'Investor Worklist' : 'Policyholder Records'} ({filteredRecords.length})
                  </h3>
                  <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                    Authorized Financial Customer Database
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                  {['ALL', isBank ? 'Savings' : isInvestment ? 'SIP' : 'Life', isBank ? 'Loan' : isInvestment ? 'Demat' : 'Health', 'VERIFIED'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFilter(f)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: selectedFilter === f ? '#D97706' : '#CBD5E1',
                        backgroundColor: selectedFilter === f ? '#FEF3C7' : '#FFFFFF',
                        color: selectedFilter === f ? '#B45309' : '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, ID, or Citizen ID..."
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 36px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '0.85rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Records List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredRecords.map((rec, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: '14px',
                      border: '1px solid #E2E8F0',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.925rem', color: '#0F172A' }}>{rec.name}</strong>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>
                          ✓ {rec.kycStatus || 'KYC VERIFIED'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.775rem', color: '#64748B', lineHeight: 1.5 }}>
                        Citizen ID: <strong style={{ color: '#334155' }}>{rec.citizenId}</strong> • {rec.accountType || rec.investmentType || rec.policyType}<br />
                        {rec.policyNo && <span>Policy No: <strong>{rec.policyNo}</strong> (Masked) • </span>}
                        Status: <span style={{ color: '#0284C7', fontWeight: 700 }}>{rec.status}</span>
                      </div>
                    </div>

                    <button
                      style={{
                        backgroundColor: '#FFFFFF',
                        color: '#D97706',
                        border: '1px solid #FDE68A',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Eye size={14} /> View Record
                    </button>
                  </div>
                ))}
              </div>

            </div>

            {/* Sub-Section for Loans / Claims */}
            {isBank && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                  Loan Applications ({loans.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {loans.map((ln, idx) => (
                    <div key={idx} style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', padding: '10px 12px', borderRadius: '10px', fontSize: '0.775rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#9A3412' }}>{ln.applicantName}</strong> ({ln.loanId})<br />
                        <span>Type: {ln.loanType} Loan • Amount: <strong>{ln.amount}</strong></span>
                      </div>
                      <span style={{ backgroundColor: '#FEF3C7', color: '#B45309', fontSize: '0.675rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                        {ln.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isInsurance && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.03)'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                  Insurance Claims ({claims.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {claims.map((cl, idx) => (
                    <div key={idx} style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '10px 12px', borderRadius: '10px', fontSize: '0.775rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ color: '#166534' }}>{cl.name}</strong> ({cl.claimId})<br />
                        <span>Claim: {cl.claimType} • Amount: <strong>{cl.amount}</strong></span>
                      </div>
                      <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', fontSize: '0.675rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                        {cl.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT PANEL: Citizen Financial eKYC Panel (3 Columns) */}
          <div style={{ gridColumn: 'span 3' }}>
            <FinancialCitizenVerificationPanel
              categoryType={categoryType}
              onRegisterCustomer={handleRegisterCustomer}
              onApplyLoan={handleApplyLoan}
              onSubmitClaim={handleSubmitClaim}
            />
          </div>

        </div>
      </main>
    </div>
  );
}
