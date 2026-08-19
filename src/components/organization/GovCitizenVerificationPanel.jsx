// src/components/organization/GovCitizenVerificationPanel.jsx - Reusable Scoped Citizen ID Verification & Registration Panel

import React, { useState } from 'react';
import { Search, ShieldCheck, UserCheck, AlertTriangle, FileText, CheckCircle2, Lock, PlusCircle, Calendar, MapPin, Phone } from 'lucide-react';

const MOCK_CITIZENS = {
  'CIV-DEMO-10001': {
    citizenId: 'CIV-DEMO-10001',
    fullName: 'Rajesh Kumar Sharma',
    dob: '15/08/1988',
    maskedAadhaar: 'XXXX-XXXX-8912',
    address: 'Flat 402, Royal Palms, MG Road, Vijayawada, Andhra Pradesh - 520010',
    mobile: '+91 98765 43210',
    verificationStatus: 'VERIFIED',
    policeRecord: {
      status: 'CLEAN',
      firs: [],
      message: 'No Previous Criminal Record Found'
    },
    rtoRecord: {
      dlNo: 'AP-16-2012-0098123',
      dlExpiry: '14/08/2032',
      registeredVehicles: ['AP-16-CD-9012 (Honda City)']
    },
    passportRecord: {
      passportNo: 'Z9012841',
      fileNo: 'VJA-9012-2023',
      pccStatus: 'POLICE CLEARANCE ISSUED'
    },
    revenueRecord: {
      landRecords: ['Survey No. 402/1, Penamaluru Mandal, Krishna Dist'],
      certificates: ['Income Certificate (Verified)', 'Residence Proof (Verified)']
    },
    electionRecord: {
      epicNo: 'AP/16/092/109283',
      pollingStation: 'Govt High School, Ward 14, Vijayawada',
      voterStatus: 'ACTIVE VOTER'
    },
    identityRecord: {
      advToken: 'ADV-TOKEN-8912-VJA',
      demographicStatus: 'UPDATED (MARCH 2026)'
    },
    municipalRecord: {
      propertyTaxId: 'PT-VMC-8910',
      activeComplaints: []
    }
  },
  'CIV-DEMO-10002': {
    citizenId: 'CIV-DEMO-10002',
    fullName: 'Priya Sundaram',
    dob: '22/11/1994',
    maskedAadhaar: 'XXXX-XXXX-4410',
    address: 'Door 12-4-9, Anna Salai, Chennai, Tamil Nadu - 600002',
    mobile: '+91 94450 12345',
    verificationStatus: 'VERIFIED',
    policeRecord: {
      status: 'FLAGGED',
      firs: [{ firNo: 'FIR-2025-102', station: 'Cyber Crime PS', type: 'Cyber Fraud Investigation', date: '10/01/2025' }],
      message: '1 Active FIR Under Investigation'
    },
    rtoRecord: {
      dlNo: 'TN-01-2015-88123',
      dlExpiry: '21/11/2035',
      registeredVehicles: ['TN-01-AB-1234 (Scooter)']
    },
    passportRecord: {
      passportNo: 'N4410921',
      fileNo: 'CHE-4410-2024',
      pccStatus: 'PENDING VERIFICATION'
    },
    revenueRecord: {
      landRecords: [],
      certificates: ['Caste Certificate (Verified)']
    },
    electionRecord: {
      epicNo: 'TN/01/014/991204',
      pollingStation: 'Anna Nagar Municipal Center, Chennai',
      voterStatus: 'ACTIVE VOTER'
    },
    identityRecord: {
      advToken: 'ADV-TOKEN-4410-CHE',
      demographicStatus: 'UPDATED'
    },
    municipalRecord: {
      propertyTaxId: 'PT-CHE-1102',
      activeComplaints: ['Water Supply Disruption (In Progress)']
    }
  }
};

export default function GovCitizenVerificationPanel({ department = 'police', onRegisterNewAction }) {
  const [searchQuery, setSearchQuery] = useState('CIV-DEMO-10001');
  const [selectedCitizen, setSelectedCitizen] = useState(MOCK_CITIZENS['CIV-DEMO-10001']);
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError('');
    const cleanQ = searchQuery.trim().toUpperCase();

    let found = MOCK_CITIZENS[cleanQ];
    if (!found) {
      found = Object.values(MOCK_CITIZENS).find(
        c => c.fullName.toUpperCase().includes(cleanQ) || c.mobile.includes(cleanQ) || c.citizenId.includes(cleanQ)
      );
    }

    if (found) {
      setSelectedCitizen(found);
    } else {
      setSearchError('Citizen record not found. Try search using CIV-DEMO-10001 or CIV-DEMO-10002.');
    }
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 10px 25px rgba(0,0,0,0.03)',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} color="#0B5ED7" /> Citizen ID Verification
          </h3>
          <p style={{ fontSize: '0.775rem', color: '#64748B' }}>
            Department Scoped Verification Gateway
          </p>
        </div>
        <span style={{
          backgroundColor: '#EAF3FF',
          color: '#073B8C',
          fontSize: '0.725rem',
          fontWeight: 800,
          padding: '4px 10px',
          borderRadius: '12px',
          border: '1px solid #BFDBFE'
        }}>
          {department.toUpperCase()} SCOPED
        </span>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Citizen ID, Name, Mobile..."
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
        <button
          type="submit"
          style={{
            backgroundColor: '#0B5ED7',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '0 16px',
            fontWeight: 700,
            fontSize: '0.825rem',
            cursor: 'pointer'
          }}
        >
          Verify
        </button>
      </form>

      {searchError && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '8px 12px', borderRadius: '10px', fontSize: '0.8rem' }}>
          {searchError}
        </div>
      )}

      {/* Citizen Profile Card */}
      {selectedCitizen && (
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          {/* Identity Header Row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0B5ED7', letterSpacing: '0.04em' }}>
                {selectedCitizen.citizenId}
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                {selectedCitizen.fullName}
              </div>
              <div style={{ fontSize: '0.775rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <span>DOB: {selectedCitizen.dob}</span>
                <span>Aadhaar: {selectedCitizen.maskedAadhaar}</span>
              </div>
            </div>
            <span style={{
              backgroundColor: '#DCFCE7',
              color: '#166534',
              fontSize: '0.7rem',
              fontWeight: 800,
              padding: '4px 8px',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <CheckCircle2 size={12} /> Identity Verified
            </span>
          </div>

          {/* Department-Scoped Record Display */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '12px', border: '1px solid #E2E8F0' }}>
            
            {/* POLICE SCOPED DATA */}
            {department === 'police' && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={14} color="#0B5ED7" /> Police & Judicial Record Audit
                </div>
                {selectedCitizen.policeRecord.status === 'CLEAN' ? (
                  <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D', padding: '8px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} /> {selectedCitizen.policeRecord.message}
                  </div>
                ) : (
                  <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#B91C1C', padding: '8px 12px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={14} /> {selectedCitizen.policeRecord.message}
                  </div>
                )}
              </div>
            )}

            {/* RTO SCOPED DATA */}
            {department === 'rto' && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  🚘 Transport & DL Records
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <strong>DL No:</strong> {selectedCitizen.rtoRecord.dlNo}<br />
                  <strong>DL Valid Until:</strong> {selectedCitizen.rtoRecord.dlExpiry}<br />
                  <strong>Vehicles:</strong> {selectedCitizen.rtoRecord.registeredVehicles.join(', ')}
                </div>
              </div>
            )}

            {/* PASSPORT SCOPED DATA */}
            {department === 'passport' && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  🛂 Passport Seva Verification
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <strong>Passport No:</strong> {selectedCitizen.passportRecord.passportNo}<br />
                  <strong>File Reference:</strong> {selectedCitizen.passportRecord.fileNo}<br />
                  <strong>PCC Status:</strong> <span style={{ color: '#16A34A', fontWeight: 700 }}>{selectedCitizen.passportRecord.pccStatus}</span>
                </div>
              </div>
            )}

            {/* REVENUE SCOPED DATA */}
            {department === 'revenue' && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  📜 Revenue & Land Title Records
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <strong>Land Holdings:</strong> {selectedCitizen.revenueRecord.landRecords.join(', ') || 'No registered agricultural land.'}<br />
                  <strong>Certificates:</strong> {selectedCitizen.revenueRecord.certificates.join(', ')}
                </div>
              </div>
            )}

            {/* ELECTION SCOPED DATA */}
            {department === 'election' && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  🗳️ Electoral Roll Record
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <strong>EPIC Voter No:</strong> {selectedCitizen.electionRecord.epicNo}<br />
                  <strong>Polling Station:</strong> {selectedCitizen.electionRecord.pollingStation}
                </div>
              </div>
            )}

            {/* IDENTITY SCOPED DATA */}
            {department === 'identity_authority' && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  🆔 Identity Vault (ADV Token)
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <strong>ADV Token:</strong> {selectedCitizen.identityRecord.advToken}<br />
                  <strong>Demographic Status:</strong> {selectedCitizen.identityRecord.demographicStatus}
                </div>
              </div>
            )}

            {/* MUNICIPAL SCOPED DATA */}
            {department === 'municipal' && (
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  🏛️ Municipal Services & Agricultural Records
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  <strong>Focus Sectors:</strong> Farming, Seedings, Cleaning, Water<br />
                  <strong>Active Requests:</strong> {selectedCitizen.municipalRecord.activeComplaints.join(', ') || 'None (All Requests Resolved)'}
                </div>
              </div>
            )}

          </div>

          {/* Department Registration Action Button */}
          <button
            onClick={() => onRegisterNewAction && onRegisterNewAction(selectedCitizen)}
            style={{
              width: '100%',
              padding: '10px 14px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              fontSize: '0.825rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(15,23,42,0.15)'
            }}
          >
            <PlusCircle size={16} />
            {department === 'police' && 'Register Case / FIR for Citizen'}
            {department === 'rto' && 'Create New DL / RC Application'}
            {department === 'passport' && 'Register Passport Application'}
            {department === 'revenue' && 'Issue Land / Encumbrance Certificate'}
            {department === 'election' && 'Register / Update Voter Entry'}
            {department === 'identity_authority' && 'Initiate Demographic Correction'}
            {department === 'municipal' && 'Register Farming / Seedings / Water Request'}
          </button>
        </div>
      )}
    </div>
  );
}
