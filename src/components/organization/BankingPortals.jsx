// src/components/organization/BankingPortals.jsx - Banking & Finance Sector Portals & Router Integration

import React, { useState } from 'react';
import FinancialLogin from './FinancialLogin.jsx';
import FinancialDashboardLayout from './FinancialDashboardLayout.jsx';
import { ORGANIZATION_CONFIGS } from '../../config/organizationConfig.js';

// --- MOCK FINANCIAL DATASETS ---
const FINANCIAL_DATASETS = {
  gov_bank: {
    stats: [
      { label: 'Active System', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Customers', value: '14,890', color: '#0F172A' },
      { label: 'Active Accounts', value: '12,410', color: '#0284C7' },
      { label: 'Pending KYC', value: '142', color: '#D97706' },
      { label: 'Verified Customers', value: '12,268', color: '#166534' },
      { label: 'Loan Applications', value: '38 Active', color: '#7C3AED' },
      { label: 'Pending Loans', value: '9 Cases', color: '#DC2626' }
    ],
    worklist: [
      { id: 'CUST-GB-01', citizenId: 'CIV-DEMO-10001', name: 'Rajesh Kumar Sharma', accountType: 'Savings Account', status: 'ACTIVE', kycStatus: 'KYC VERIFIED', date: '15/01/2026' },
      { id: 'CUST-GB-02', citizenId: 'CIV-DEMO-10002', name: 'Priya Sundaram', accountType: 'Salary Account', status: 'ACTIVE', kycStatus: 'KYC VERIFIED', date: '20/02/2026' }
    ],
    loanApplications: [
      { loanId: 'LN-2026-901', citizenId: 'CIV-DEMO-10001', applicantName: 'Rajesh Kumar Sharma', loanType: 'Personal', amount: '₹3,50,000', purpose: 'Home Renovation', status: 'APPROVED', date: '10/08/2026' },
      { loanId: 'LN-2026-902', citizenId: 'CIV-DEMO-10002', applicantName: 'Priya Sundaram', loanType: 'Education', amount: '₹5,00,000', purpose: 'Higher Studies', status: 'UNDER REVIEW', date: '18/08/2026' }
    ],
    claimsList: []
  },

  priv_bank: {
    stats: [
      { label: 'Active System', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Customers', value: '8,450', color: '#0F172A' },
      { label: 'Active Accounts', value: '7,910', color: '#0284C7' },
      { label: 'Pending KYC', value: '68', color: '#D97706' },
      { label: 'Verified Customers', value: '7,842', color: '#166534' },
      { label: 'Credit Cards Issued', value: '1,240', color: '#7C3AED' },
      { label: 'Pending Loans', value: '5 Cases', color: '#DC2626' }
    ],
    worklist: [
      { id: 'CUST-PB-01', citizenId: 'CIV-DEMO-10002', name: 'Priya Sundaram', accountType: 'Salary Account', status: 'ACTIVE', kycStatus: 'KYC VERIFIED', date: '14/02/2026' },
      { id: 'CUST-PB-02', citizenId: 'CIV-DEMO-10001', name: 'Rajesh Kumar Sharma', accountType: 'Wealth Savings', status: 'ACTIVE', kycStatus: 'KYC VERIFIED', date: '10/01/2026' }
    ],
    loanApplications: [
      { loanId: 'LN-PB-104', citizenId: 'CIV-DEMO-10002', applicantName: 'Priya Sundaram', loanType: 'Vehicle', amount: '₹8,50,000', purpose: 'Auto Purchase', status: 'APPROVED', date: '12/08/2026' }
    ],
    claimsList: []
  },

  investment: {
    stats: [
      { label: 'Active System', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Investors', value: '6,210', color: '#0F172A' },
      { label: 'Active SIPs', value: '4,150', color: '#0284C7' },
      { label: 'Pending KYC', value: '45', color: '#D97706' },
      { label: 'Verified Investors', value: '6,165', color: '#166534' },
      { label: 'AUM Portfolio', value: '₹142 Cr', color: '#7C3AED' },
      { label: 'Demat Verification', value: '1,890 Active', color: '#2563EB' }
    ],
    worklist: [
      { id: 'INV-01', citizenId: 'CIV-DEMO-10001', name: 'Rajesh Kumar Sharma', investmentType: 'Equity Mutual Fund SIP', status: 'ACTIVE', kycStatus: 'KYC VERIFIED', date: '10/01/2026' },
      { id: 'INV-02', citizenId: 'CIV-DEMO-10002', name: 'Priya Sundaram', investmentType: 'Balanced SIP', status: 'ACTIVE', kycStatus: 'KYC VERIFIED', date: '15/02/2026' }
    ],
    loanApplications: [],
    claimsList: []
  },

  insurance: {
    stats: [
      { label: 'Active System', value: 'ONLINE', color: '#16A34A' },
      { label: 'Total Policyholders', value: '18,400', color: '#0F172A' },
      { label: 'Active Policies', value: '16,210', color: '#0284C7' },
      { label: 'Pending Claims', value: '24 Cases', color: '#DC2626' },
      { label: 'Approved Claims', value: '412 Settled', color: '#166534' },
      { label: 'Pending KYC', value: '52', color: '#D97706' },
      { label: 'New Issuances', value: '124 Month', color: '#7C3AED' }
    ],
    worklist: [
      { id: 'INS-01', citizenId: 'CIV-DEMO-10001', name: 'Rajesh Kumar Sharma', policyType: 'Life Insurance Policy', policyNo: 'POL-LIFE-9921', status: 'ACTIVE', kycStatus: 'KYC VERIFIED', date: '10/01/2026' },
      { id: 'INS-02', citizenId: 'CIV-DEMO-10002', name: 'Priya Sundaram', policyType: 'Health Insurance Policy', policyNo: 'POL-HLT-7712', status: 'ACTIVE', kycStatus: 'KYC VERIFIED', date: '14/02/2026' }
    ],
    loanApplications: [],
    claimsList: [
      { claimId: 'CLM-2026-401', citizenId: 'CIV-DEMO-10001', name: 'Rajesh Kumar Sharma', claimType: 'Medical Hospitalization', amount: '₹45,000', status: 'APPROVED', date: '15/08/2026' },
      { claimId: 'CLM-2026-402', citizenId: 'CIV-DEMO-10002', name: 'Priya Sundaram', claimType: 'Health Benefit', amount: '₹12,50,000', status: 'UNDER REVIEW', date: '18/08/2026' }
    ]
  }
};

export default function BankingPortals({ bankId = 'gov_bank', onReturnHome }) {
  let targetId = 'gov_bank';
  if (bankId === 'priv_bank' || bankId === 'private_bank') targetId = 'priv_bank';
  else if (bankId === 'investment' || bankId === 'investment_inst' || bankId === 'private_financial_inst' || bankId === 'govt_financial_inst') targetId = 'investment';
  else if (bankId === 'insurance' || bankId === 'govt_insurance' || bankId === 'private_insurance') targetId = 'insurance';
  else if (bankId === 'government_bank' || bankId === 'gov_bank') targetId = 'gov_bank';

  const config = ORGANIZATION_CONFIGS[targetId] || ORGANIZATION_CONFIGS['gov_bank'];
  const dataset = FINANCIAL_DATASETS[targetId] || FINANCIAL_DATASETS['gov_bank'];

  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  if (!authenticatedUser) {
    return (
      <FinancialLogin
        orgConfig={config}
        onLoginSuccess={(user) => setAuthenticatedUser(user)}
        onGoBack={onReturnHome}
      />
    );
  }

  return (
    <FinancialDashboardLayout
      session={authenticatedUser}
      config={config}
      stats={dataset.stats}
      worklist={dataset.worklist}
      loanApplications={dataset.loanApplications}
      claimsList={dataset.claimsList}
      onLogout={() => setAuthenticatedUser(null)}
      onReturnHome={onReturnHome}
    />
  );
}
