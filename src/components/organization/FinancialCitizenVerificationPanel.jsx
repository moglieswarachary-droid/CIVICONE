// src/components/organization/FinancialCitizenVerificationPanel.jsx - Reusable Financial eKYC, Verification & Registration Panel

import React, { useState } from 'react';
import { Search, ShieldCheck, CheckCircle2, AlertCircle, FileText, UserCheck, Lock, Landmark, TrendingUp, ShieldAlert, Plus, CreditCard, DollarSign } from 'lucide-react';

// MOCK CITIZEN VAULT RECORDS FOR FINANCIAL eKYC
const CITIZEN_FINANCIAL_VAULT = {
  'CIV-DEMO-10001': {
    citizenId: 'CIV-DEMO-10001',
    fullName: 'Rajesh Kumar Sharma',
    dob: '15/08/1988',
    gender: 'Male',
    maskedAadhaar: 'XXXX-XXXX-8912',
    maskedPan: 'ABCDE1234F',
    address: 'Flat 402, Sri Sai Residency, Benz Circle, Vijayawada, AP - 520010',
    kycStatus: 'VERIFIED',
    kycVerifiedDate: '10/01/2026',
    identityStatus: 'HIGH ASSURANCE (ADV TOKENIZED)',
    bankAccount: 'XXXX-XXXX-4512 (State Bank of India)',
    existingAccounts: [
      { type: 'Savings Account', accNo: 'XXXX-XXXX-4512', balance: '₹1,45,000', status: 'ACTIVE' },
      { type: 'Personal Loan', accNo: 'LN-2026-901', amount: '₹3,50,000', status: 'APPROVED' }
    ],
    existingInvestments: [
      { type: 'Equity Mutual Fund', portfolioNo: 'MF-8801-992', value: '₹2,10,000', status: 'ACTIVE' },
      { type: 'Demat Account', dematId: 'IN300123-9901', status: 'VERIFIED' }
    ],
    existingInsurance: [
      { type: 'Life Insurance Policy', policyNo: 'POL-LIFE-9921', coverage: '₹25,00,000', status: 'ACTIVE' },
      { type: 'Health Insurance Policy', policyNo: 'POL-HLT-4402', coverage: '₹5,00,000', status: 'ACTIVE' }
    ]
  },
  'CIV-DEMO-10002': {
    citizenId: 'CIV-DEMO-10002',
    fullName: 'Priya Sundaram',
    dob: '22/11/1994',
    gender: 'Female',
    maskedAadhaar: 'XXXX-XXXX-4412',
    maskedPan: 'XYZPS9876K',
    address: 'House No. 12-4, MG Road, Guntur, AP - 522002',
    kycStatus: 'VERIFIED',
    kycVerifiedDate: '14/02/2026',
    identityStatus: 'HIGH ASSURANCE (ADV TOKENIZED)',
    bankAccount: 'XXXX-XXXX-7890 (Private Commercial Bank)',
    existingAccounts: [
      { type: 'Salary Account', accNo: 'XXXX-XXXX-7890', balance: '₹88,400', status: 'ACTIVE' }
    ],
    existingInvestments: [
      { type: 'SIP Portfolio', portfolioNo: 'SIP-2026-004', value: '₹65,000', status: 'ACTIVE' }
    ],
    existingInsurance: [
      { type: 'Health Insurance Policy', policyNo: 'POL-HLT-7712', coverage: '₹10,00,000', status: 'ACTIVE' }
    ]
  }
};

export default function FinancialCitizenVerificationPanel({
  categoryType = 'government_bank',
  onRegisterCustomer,
  onApplyLoan,
  onSubmitClaim
}) {
  const isBank = categoryType === 'government_bank' || categoryType === 'private_bank' || categoryType === 'gov_bank' || categoryType === 'priv_bank';
  const isInvestment = categoryType === 'investment';
  const isInsurance = categoryType === 'insurance';

  const [searchId, setSearchId] = useState('CIV-DEMO-10001');
  const [activeCitizen, setActiveCitizen] = useState(CITIZEN_FINANCIAL_VAULT['CIV-DEMO-10001']);
  const [activeTab, setActiveTab] = useState('verify'); // 'verify' | 'register' | 'loan' | 'claim'
  const [searchError, setSearchError] = useState('');

  // Registration Form State
  const [regAccountType, setRegAccountType] = useState(isBank ? 'Savings Account' : isInvestment ? 'Mutual Fund SIP' : 'Health Insurance Policy');
  const [regNominee, setRegNominee] = useState('Spouse / Family Member');
  const [regSuccessMsg, setRegSuccessMsg] = useState('');

  // Loan Application State
  const [loanType, setLoanType] = useState('Personal');
  const [loanAmount, setLoanAmount] = useState('250000');
  const [loanPurpose, setLoanPurpose] = useState('Higher Education / Business Expansion');
  const [loanSuccessMsg, setLoanSuccessMsg] = useState('');

  // Claim State
  const [claimType, setClaimType] = useState('Medical Hospitalization');
  const [claimAmount, setClaimAmount] = useState('45000');
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');

  const handleSearch = () => {
    setSearchError('');
    setRegSuccessMsg('');
    setLoanSuccessMsg('');
    setClaimSuccessMsg('');
    const cleanQ = searchId.trim().toUpperCase();

    let found = CITIZEN_FINANCIAL_VAULT[cleanQ];
    if (!found && cleanQ.length > 2) {
      found = {
        citizenId: cleanQ,
        fullName: cleanQ.includes('710646') ? 'Raghavendra' : `Verified Citizen (${cleanQ})`,
        dob: '15/08/1990',
        gender: 'Specified',
        maskedAadhaar: `XXXX-XXXX-${cleanQ.slice(-4) || '8912'}`,
        maskedPan: 'ABCDE1234F',
        address: 'Verified Citizen Domicile Address, India',
        kycStatus: 'VERIFIED',
        kycVerifiedDate: '15/01/2026',
        identityStatus: 'HIGH ASSURANCE (ADV TOKENIZED)',
        bankAccount: `XXXX-XXXX-${cleanQ.slice(-4) || '4512'} (State Bank of India)`,
        existingAccounts: [
          { type: 'Savings Account', accNo: `XXXX-XXXX-${cleanQ.slice(-4) || '4512'}`, balance: '₹1,50,000', status: 'ACTIVE' }
        ],
        existingInvestments: [],
        existingInsurance: []
      };
    }

    if (found) {
      setActiveCitizen(found);
    } else {
      setActiveCitizen(null);
      setSearchError('No verified citizen financial record found for this ID.');
    }
  };

  const handleNewRegistration = async (e) => {
    e.preventDefault();
    if (!activeCitizen) return;

    try {
      const res = await fetch('/api/consent/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: 'org-bank-01',
          orgName: 'Banking & Financial Institution',
          citizenCivicId: activeCitizen.citizenId || searchId,
          docId: 'doc-financial-suite',
          docName: 'PAN Card, Bank Account e-KYC & Income Proof',
          purpose: `Bank Account / Financial Service Registration (${regAccountType})`,
          expiryDays: '7'
        })
      });
      const data = await res.json();
      if (data.success) {
        setRegSuccessMsg(`📩 e-KYC Access Request sent to citizen (${activeCitizen.fullName})! A notification has been sent to their app to Accept or Decline.`);
      }
    } catch (err) {
      console.error("Error dispatching bank consent request:", err);
    }

    const newRecord = {
      id: `REG-${Date.now().toString().slice(-4)}`,
      citizenId: activeCitizen.citizenId,
      name: activeCitizen.fullName,
      accountType: regAccountType,
      nominee: regNominee,
      status: 'AWAITING CONSENT',
      kycStatus: 'Pending Share',
      date: new Date().toLocaleDateString('en-GB')
    };

    if (onRegisterCustomer) onRegisterCustomer(newRecord);
  };

  const handleLoanSubmit = (e) => {
    e.preventDefault();
    if (!activeCitizen) return;

    const loanRecord = {
      loanId: `LN-2026-${Math.floor(100 + Math.random() * 900)}`,
      citizenId: activeCitizen.citizenId,
      applicantName: activeCitizen.fullName,
      loanType,
      amount: `₹${Number(loanAmount).toLocaleString('en-IN')}`,
      purpose: loanPurpose,
      status: 'UNDER REVIEW',
      date: new Date().toLocaleDateString('en-GB')
    };

    if (onApplyLoan) onApplyLoan(loanRecord);
    setLoanSuccessMsg(`✓ Loan Application ${loanRecord.loanId} submitted for ₹${Number(loanAmount).toLocaleString('en-IN')}!`);
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!activeCitizen) return;

    const claimRecord = {
      claimId: `CLM-2026-${Math.floor(100 + Math.random() * 900)}`,
      citizenId: activeCitizen.citizenId,
      name: activeCitizen.fullName,
      claimType,
      amount: `₹${Number(claimAmount).toLocaleString('en-IN')}`,
      status: 'SUBMITTED',
      date: new Date().toLocaleDateString('en-GB')
    };

    if (onSubmitClaim) onSubmitClaim(claimRecord);
    setClaimSuccessMsg(`✓ Claim ${claimRecord.claimId} submitted for ₹${Number(claimAmount).toLocaleString('en-IN')}!`);
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      padding: '20px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>

      {/* Panel Header */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="#D97706" /> Financial eKYC &amp; Registration
        </h3>
        <p style={{ fontSize: '0.775rem', color: '#64748B', margin: 0 }}>
          Verify citizen identity, check eKYC status, and register financial products.
        </p>
      </div>

      {/* Search Input */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Citizen ID (e.g. CIV-DEMO-10001)"
            style={{
              width: '100%',
              padding: '8px 10px 8px 32px',
              borderRadius: '10px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.8rem',
              outline: 'none',
              fontWeight: 700,
              fontFamily: 'monospace'
            }}
          />
        </div>
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: '#D97706',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 14px',
            fontSize: '0.775rem',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          Verify
        </button>
      </div>

      {searchError && (
        <div style={{ fontSize: '0.75rem', color: '#DC2626', backgroundColor: '#FEF2F2', padding: '8px 10px', borderRadius: '8px' }}>
          ⚠️ {searchError}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid #E2E8F0', pb: '8px' }}>
        <button
          onClick={() => setActiveTab('verify')}
          style={{
            padding: '6px 12px',
            borderRadius: '8px 8px 0 0',
            fontSize: '0.75rem',
            fontWeight: 800,
            border: 'none',
            backgroundColor: activeTab === 'verify' ? '#FEF3C7' : 'transparent',
            color: activeTab === 'verify' ? '#B45309' : '#64748B',
            cursor: 'pointer'
          }}
        >
          eKYC Profile
        </button>
        <button
          onClick={() => setActiveTab('register')}
          style={{
            padding: '6px 12px',
            borderRadius: '8px 8px 0 0',
            fontSize: '0.75rem',
            fontWeight: 800,
            border: 'none',
            backgroundColor: activeTab === 'register' ? '#FEF3C7' : 'transparent',
            color: activeTab === 'register' ? '#B45309' : '#64748B',
            cursor: 'pointer'
          }}
        >
          + {isBank ? 'New Customer' : isInvestment ? 'New Investor' : 'New Policy'}
        </button>
        {isBank && (
          <button
            onClick={() => setActiveTab('loan')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px 8px 0 0',
              fontSize: '0.75rem',
              fontWeight: 800,
              border: 'none',
              backgroundColor: activeTab === 'loan' ? '#FEF3C7' : 'transparent',
              color: activeTab === 'loan' ? '#B45309' : '#64748B',
              cursor: 'pointer'
            }}
          >
            Loan App
          </button>
        )}
        {isInsurance && (
          <button
            onClick={() => setActiveTab('claim')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px 8px 0 0',
              fontSize: '0.75rem',
              fontWeight: 800,
              border: 'none',
              backgroundColor: activeTab === 'claim' ? '#FEF3C7' : 'transparent',
              color: activeTab === 'claim' ? '#B45309' : '#64748B',
              cursor: 'pointer'
            }}
          >
            Submit Claim
          </button>
        )}
      </div>

      {/* TAB 1: eKYC PROFILE */}
      {activeTab === 'verify' && activeCitizen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Status Badge */}
          <div style={{
            backgroundColor: '#DCFCE7',
            border: '1px solid #86EFAC',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#166534" />
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534' }}>
                  ✓ KYC VERIFIED
                </div>
                <div style={{ fontSize: '0.675rem', color: '#15803D' }}>
                  Aadhaar &amp; PAN Token Verified on {activeCitizen.kycVerifiedDate}
                </div>
              </div>
            </div>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, backgroundColor: '#FFFFFF', color: '#166534', padding: '2px 6px', borderRadius: '4px' }}>
              SECURE
            </span>
          </div>

          {/* Identity Fields */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', fontSize: '0.775rem', lineHeight: 1.6, color: '#334155' }}>
            <strong>Citizen ID:</strong> {activeCitizen.citizenId}<br />
            <strong>Full Name:</strong> {activeCitizen.fullName}<br />
            <strong>DOB / Gender:</strong> {activeCitizen.dob} ({activeCitizen.gender})<br />
            <strong>Masked Aadhaar:</strong> {activeCitizen.maskedAadhaar}<br />
            <strong>Masked PAN:</strong> {activeCitizen.maskedPan}<br />
            <strong>Verified Address:</strong> {activeCitizen.address}
          </div>

          {/* Institution Product Summary */}
          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
              Authorized Financial Products:
            </div>
            {isBank && activeCitizen.existingAccounts.map((acc, i) => (
              <div key={i} style={{ fontSize: '0.725rem', backgroundColor: '#FFF7ED', padding: '6px 8px', borderRadius: '6px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>{acc.type}:</strong> {acc.accNo}</span>
                <span style={{ color: '#B45309', fontWeight: 800 }}>{acc.balance || acc.amount}</span>
              </div>
            ))}
            {isInvestment && activeCitizen.existingInvestments.map((inv, i) => (
              <div key={i} style={{ fontSize: '0.725rem', backgroundColor: '#EFF6FF', padding: '6px 8px', borderRadius: '6px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>{inv.type}:</strong> {inv.portfolioNo || inv.dematId}</span>
                <span style={{ color: '#1D4ED8', fontWeight: 800 }}>{inv.value || inv.status}</span>
              </div>
            ))}
            {isInsurance && activeCitizen.existingInsurance.map((ins, i) => (
              <div key={i} style={{ fontSize: '0.725rem', backgroundColor: '#F0FDF4', padding: '6px 8px', borderRadius: '6px', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>{ins.type}:</strong> {ins.policyNo}</span>
                <span style={{ color: '#15803D', fontWeight: 800 }}>{ins.coverage}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: NEW REGISTRATION */}
      {activeTab === 'register' && activeCitizen && (
        <form onSubmit={handleNewRegistration} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {regSuccessMsg && (
            <div style={{ fontSize: '0.75rem', color: '#166534', backgroundColor: '#DCFCE7', padding: '8px 10px', borderRadius: '8px', fontWeight: 700 }}>
              {regSuccessMsg}
            </div>
          )}

          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Auto-retrieved identity for: <strong>{activeCitizen.fullName}</strong> ({activeCitizen.citizenId})
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
              Product / Account Type
            </label>
            <select
              value={regAccountType}
              onChange={(e) => setRegAccountType(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.775rem' }}
            >
              {isBank && (
                <>
                  <option value="Savings Account">Savings Account</option>
                  <option value="Current Account">Current Account</option>
                  <option value="Salary Account">Salary Account</option>
                  <option value="Fixed Deposit">Fixed Deposit (FD)</option>
                  <option value="Recurring Deposit">Recurring Deposit (RD)</option>
                </>
              )}
              {isInvestment && (
                <>
                  <option value="Mutual Fund SIP">Mutual Fund SIP</option>
                  <option value="Equity Investment Account">Equity Investment Account</option>
                  <option value="Demat Portfolio Account">Demat Portfolio Account</option>
                  <option value="Fixed Income Bond">Fixed Income Bond</option>
                </>
              )}
              {isInsurance && (
                <>
                  <option value="Health Insurance Policy">Health Insurance Policy</option>
                  <option value="Life Term Assurance">Life Term Assurance</option>
                  <option value="Motor Comprehensive Policy">Motor Comprehensive Policy</option>
                  <option value="Government Ayushman Scheme">Government Ayushman Scheme</option>
                </>
              )}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
              Nominee Details
            </label>
            <input
              type="text"
              value={regNominee}
              onChange={(e) => setRegNominee(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.775rem' }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '9px',
              fontSize: '0.775rem',
              fontWeight: 800,
              cursor: 'pointer',
              marginTop: '4px'
            }}
          >
            Complete Registration
          </button>
        </form>
      )}

      {/* TAB 3: LOAN APPLICATION (BANKS) */}
      {activeTab === 'loan' && isBank && activeCitizen && (
        <form onSubmit={handleLoanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loanSuccessMsg && (
            <div style={{ fontSize: '0.75rem', color: '#166534', backgroundColor: '#DCFCE7', padding: '8px 10px', borderRadius: '8px', fontWeight: 700 }}>
              {loanSuccessMsg}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
              Loan Category
            </label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.775rem' }}
            >
              <option value="Personal">Personal Loan</option>
              <option value="Education">Education Loan</option>
              <option value="Home">Home / Housing Loan</option>
              <option value="Vehicle">Vehicle / Auto Loan</option>
              <option value="Business">Business / MSME Credit</option>
              <option value="Agricultural">Agricultural Kisan Credit</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
              Requested Amount (₹)
            </label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.775rem', fontWeight: 700 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
              Purpose
            </label>
            <input
              type="text"
              value={loanPurpose}
              onChange={(e) => setLoanPurpose(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.775rem' }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '9px',
              fontSize: '0.775rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Submit Loan Application
          </button>
        </form>
      )}

      {/* TAB 4: INSURANCE CLAIM (INSURANCE) */}
      {activeTab === 'claim' && isInsurance && activeCitizen && (
        <form onSubmit={handleClaimSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {claimSuccessMsg && (
            <div style={{ fontSize: '0.75rem', color: '#166534', backgroundColor: '#DCFCE7', padding: '8px 10px', borderRadius: '8px', fontWeight: 700 }}>
              {claimSuccessMsg}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
              Claim Type
            </label>
            <select
              value={claimType}
              onChange={(e) => setClaimType(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.775rem' }}
            >
              <option value="Medical Hospitalization">Medical Hospitalization</option>
              <option value="Life Death Claim">Life Death Claim</option>
              <option value="Motor Accident Damage">Motor Accident Damage</option>
              <option value="Critical Illness">Critical Illness Benefit</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
              Claim Amount (₹)
            </label>
            <input
              type="number"
              value={claimAmount}
              onChange={(e) => setClaimAmount(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.775rem', fontWeight: 700 }}
            />
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '9px',
              fontSize: '0.775rem',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            Submit Insurance Claim
          </button>
        </form>
      )}

    </div>
  );
}
