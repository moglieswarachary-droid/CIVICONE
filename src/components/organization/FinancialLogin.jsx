// src/components/organization/FinancialLogin.jsx - Centered Login Page for Banking & Finance Sector

import React, { useState } from 'react';
import { Landmark, ShieldCheck, Lock, ArrowLeft, Building2, CheckCircle2, AlertCircle, TrendingUp, ShieldAlert, Award } from 'lucide-react';

export default function FinancialLogin({ orgConfig, onLoginSuccess, onGoBack }) {
  const isGovBank = orgConfig?.id === 'gov_bank' || orgConfig?.id === 'government_bank';
  const isPrivBank = orgConfig?.id === 'priv_bank' || orgConfig?.id === 'private_bank';
  const isInvestment = orgConfig?.id === 'investment' || orgConfig?.id === 'investment_inst';
  const isInsurance = orgConfig?.id === 'insurance' || orgConfig?.id === 'govt_insurance' || orgConfig?.id === 'private_insurance';

  // Default values based on org category
  const defaultState = isGovBank ? 'Andhra Pradesh' : isPrivBank ? 'Tamil Nadu' : isInvestment ? 'Karnataka' : 'Telangana';
  const defaultOrgName = isGovBank
    ? 'State Public Sector Bank'
    : isPrivBank
    ? 'Private Commercial Bank'
    : isInvestment
    ? 'National Asset Management & Mutual Funds'
    : 'Public Sector Insurance Corporation';

  const defaultBranch = isGovBank
    ? 'Vijayawada Main Branch'
    : isPrivBank
    ? 'Chennai Central Branch'
    : isInvestment
    ? 'Bengaluru Regional Office'
    : 'Hyderabad Zonal Office';

  const defaultCode = isGovBank
    ? 'GB-AP-VJA-001'
    : isPrivBank
    ? 'PB-TN-CHE-002'
    : isInvestment
    ? 'INV-MUTUAL-801'
    : 'INS-LIFE-401';

  const defaultEmail = isGovBank
    ? 'manager@examplebank.gov.in'
    : isPrivBank
    ? 'manager@privatebank.com'
    : isInvestment
    ? 'compliance@investamc.in'
    : 'claims@insurance.gov.in';

  const [state, setState] = useState(defaultState);
  const [orgName, setOrgName] = useState(defaultOrgName);
  const [branchName, setBranchName] = useState(defaultBranch);
  const [code, setCode] = useState(defaultCode);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('fin123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!state || !orgName || !branchName || !code || !email || !password) {
      setErrorMsg('Please complete all required financial institution credentials.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const sessionData = {
        orgId: orgConfig?.id || (isGovBank ? 'gov_bank' : isPrivBank ? 'priv_bank' : isInvestment ? 'investment' : 'insurance'),
        name: orgName,
        category: isGovBank ? 'Government Bank' : isPrivBank ? 'Private Bank' : isInvestment ? 'Mutual Funds & Investment' : 'Insurance',
        categoryType: isGovBank ? 'government_bank' : isPrivBank ? 'private_bank' : isInvestment ? 'investment' : 'insurance',
        state,
        branchName,
        code,
        email,
        roleTitle: isGovBank ? 'Branch Manager' : isPrivBank ? 'Credit & KYC Officer' : isInvestment ? 'Compliance Manager' : 'Claims Officer',
        clearanceStatus: 'VERIFIED FINANCIAL ENTITY',
        sessionToken: `FIN-AUTH-${Date.now()}-SECURE`
      };

      if (onLoginSuccess) {
        onLoginSuccess(sessionData);
      }
    }, 600);
  };

  const getButtonText = () => {
    if (isGovBank) return 'Login to Government Bank';
    if (isPrivBank) return 'Login to Private Bank';
    if (isInvestment) return 'Login to Investment Portal';
    if (isInsurance) return 'Login to Insurance Portal';
    return 'Login to Financial Portal';
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FDF8F6',
      backgroundImage: 'radial-gradient(#FDBA74 0.5px, transparent 0.5px), radial-gradient(#FDBA74 0.5px, #FDF8F6 0.5px)',
      backgroundSize: '20px 20px',
      backgroundPosition: '0 0, 10px 10px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justify: 'center',
      padding: '24px 16px'
    }}>
      {/* Top Bar with Go Back */}
      <div style={{ width: '100%', maxWidth: '480px', marginBottom: '16px' }}>
        <button
          onClick={onGoBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#9A3412',
            fontSize: '0.875rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '4px 0'
          }}
        >
          <ArrowLeft size={18} /> Back to Sector Organizations
        </button>
      </div>

      {/* Main Centered Login Card */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #FED7AA',
        boxShadow: '0 20px 40px rgba(217,119,6,0.08)',
        padding: '32px 28px',
        boxSizing: 'border-box'
      }}>

        {/* Card Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '20px',
            backgroundColor: '#FEF3C7',
            border: '2px solid #FDE68A',
            display: 'inline-flex',
            alignItems: 'center',
            justify: 'center',
            fontSize: '1.8rem',
            marginBottom: '12px'
          }}>
            {orgConfig?.logoEmoji || (isGovBank ? '🏦' : isPrivBank ? '🏛️' : isInvestment ? '📊' : '🛡️')}
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: '12px', padding: '4px 12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {orgConfig?.categoryName || (isGovBank ? 'Public Sector Bank' : isPrivBank ? 'Private Banking' : isInvestment ? 'Asset Management & Broking' : 'Public & Private Insurance')}
            </span>
          </div>

          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 900, color: '#0F172A', margin: '4px 0 6px 0' }}>
            {orgConfig?.name || (isGovBank ? 'Government Bank' : isPrivBank ? 'Private Bank' : isInvestment ? 'Mutual Funds & Investment' : 'Insurance Authority')}
          </h2>

          <p style={{ fontSize: '0.825rem', color: '#64748B', margin: 0 }}>
            CIVIQONE Banking &amp; Financial Verification Gateway
          </p>
        </div>

        {/* Prototype / Security Notice */}
        <div style={{
          backgroundColor: '#FFF7ED',
          border: '1px solid #FFEDD5',
          borderRadius: '14px',
          padding: '10px 14px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.775rem',
          color: '#9A3412'
        }}>
          <ShieldCheck size={18} style={{ flexShrink: 0, color: '#D97706' }} />
          <div>
            <strong>Simulated Financial Sandbox:</strong> High-assurance KYC and account verification gateway.
          </div>
        </div>

        {errorMsg && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '16px',
            fontSize: '0.8rem',
            color: '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* State */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
              State / Jurisdiction
            </label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Delhi NCT">Delhi NCT</option>
            </select>
          </div>

          {/* Org Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
              {isGovBank || isPrivBank ? 'Bank Name' : isInvestment ? 'Investment Organization Name' : 'Insurance Company Name'}
            </label>
            <input
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="e.g. State Bank of India"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Branch Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
              {isGovBank || isPrivBank ? 'Branch Name' : isInvestment ? 'Office / Regional Branch' : 'Branch / Zonal Office'}
            </label>
            <input
              type="text"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              placeholder="e.g. Vijayawada Main Branch"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Code */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
              {isGovBank || isPrivBank ? 'Bank Code / IFSC' : isInvestment ? 'Organization Code' : 'Insurance Organization Code'}
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="e.g. GB-AP-VJA-001"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'monospace',
                fontWeight: 700
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
              Official Financial Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@examplebank.gov.in"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
              Portal Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '0.925rem',
              fontWeight: 800,
              cursor: isLoading ? 'wait' : 'pointer',
              marginTop: '6px',
              boxShadow: '0 4px 12px rgba(217,119,6,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isLoading ? 'Authenticating Gateway...' : getButtonText()}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.725rem', color: '#94A3B8' }}>
          CIVIQONE Financial Identity Network • RBI / SEBI / IRDAI Standard eKYC Protocols
        </div>
      </div>
    </div>
  );
}
