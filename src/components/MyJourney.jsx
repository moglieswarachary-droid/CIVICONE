// src/components/MyJourney.jsx - Citizen Chronological Document Life Journey
// Organizes all official citizen documents in strict chronological order from Birth Certificate to current credentials.

import React, { useState } from 'react';
import {
  Milestone, Calendar, CheckCircle2, ShieldCheck, Download, Eye,
  Search, Filter, Award, FileText, User, Sparkles, Clock, ArrowRight,
  GraduationCap, Landmark, Car, HeartPulse, Building2, Ticket, QrCode,
  Check, Copy, ExternalLink, Share2, Info, ChevronDown
} from 'lucide-react';

export default function MyJourney({ citizen, documents = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocForPreview, setSelectedDocForPreview] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const citizenName = citizen?.fullName || citizen?.name || 'Aarav Kumar';
  const citizenDob = citizen?.dob || citizen?.dateOfBirth || '15-07-2004';
  const citizenState = citizen?.state || 'Andhra Pradesh';
  const citizenId = citizen?.citizenId || 'CIV-DEMO-10001';

  // Chronological Lifecycle Documents Dataset — Ordered from First (Birth Certificate) to Last (Recent Credentials)
  const LIFE_JOURNEY_DOCUMENTS = [
    {
      step: 1,
      id: 'jour-01',
      name: 'Birth Certificate',
      officialTitle: 'Official Certificate of Birth Registration',
      category: 'BIRTH',
      categoryLabel: 'Birth & Early Life',
      icon: User,
      iconColor: '#0284C7',
      iconBg: '#E0F2FE',
      issuer: 'Registrar of Births & Deaths — Municipal Corporation',
      issueDate: '15-07-2004',
      year: '2004',
      ageMilestone: 'At Birth (Age 0)',
      refNo: 'BC-2004-AP-8849201',
      status: 'VERIFIED',
      verificationHash: '0x8f2d91a4b73e6c012845c39a',
      description: 'Official birth certificate issued at municipal hospital registration, establishing sovereign citizenship and legal identity.',
      signatory: 'Chief Registrar of Births & Deaths, Govt of Andhra Pradesh',
      keyDetails: {
        'Child Name': citizenName,
        'Date of Birth': citizenDob,
        'Place of Birth': 'Government General Hospital, Vijayawada',
        'Gender': citizen?.gender || 'Male',
        'Registration Date': '18-07-2004',
        'Registration No': 'REG/B/2004/008849'
      }
    },
    {
      step: 2,
      id: 'jour-02',
      name: 'Child Immunization & Pediatric Health Record',
      officialTitle: 'National Child Health & Immunization Registry',
      category: 'HEALTH',
      categoryLabel: 'Early Childhood',
      icon: HeartPulse,
      iconColor: '#16A34A',
      iconBg: '#DCFCE7',
      issuer: 'Ministry of Health & Family Welfare — Directorate of Public Health',
      issueDate: '10-08-2005',
      year: '2005',
      ageMilestone: 'Age 1',
      refNo: 'IMM-2005-AP-55219',
      status: 'VERIFIED',
      verificationHash: '0x71e40a83cf82d6194b5e27a1',
      description: 'Universal immunization and early pediatric health record verifying mandatory vaccinations and early health milestones.',
      signatory: 'District Medical & Health Officer (DMHO)',
      keyDetails: {
        'Beneficiary': citizenName,
        'Immunization Status': 'Fully Immunized (100%)',
        'Polio & BCG': 'Completed',
        'DPT & Hepatitis-B': 'Completed',
        'Registration Center': 'PHC Urban Center, Vijayawada'
      }
    },
    {
      step: 3,
      id: 'jour-03',
      name: 'Aadhaar Sovereign Identity Enrolment',
      officialTitle: 'Unique Identification Authority of India (UIDAI)',
      category: 'IDENTITY',
      categoryLabel: 'Sovereign Identity',
      icon: ShieldCheck,
      iconColor: '#0B5ED7',
      iconBg: '#DBEAFE',
      issuer: 'UIDAI — Unique Identification Authority of India',
      issueDate: '12-11-2010',
      year: '2010',
      ageMilestone: 'Age 6',
      refNo: citizen?.maskedAadhaar || 'XXXX XXXX 1001',
      status: 'VERIFIED',
      verificationHash: '0x99a4c82b1d3e750f5892c431',
      description: 'National 12-digit biometric identity enrolment for sovereign public service delivery and verifiable digital identification.',
      signatory: 'Registrar General, UIDAI Regional Office',
      keyDetails: {
        'Aadhaar Holder': citizenName,
        'Aadhaar Number': citizen?.maskedAadhaar || 'XXXX XXXX 1001',
        'Biometrics': 'Biometrics Captured & Verified',
        'Enrolment Agency': 'UIDAI Center AP-04',
        'Verification Mode': 'Cryptographic QR Verified'
      }
    },
    {
      step: 4,
      id: 'jour-04',
      name: 'Class X Secondary School Certificate (SSC / CBSE)',
      officialTitle: 'Central Board of Secondary Education — Grade 10 Marksheet',
      category: 'EDUCATION',
      categoryLabel: 'Secondary Education',
      icon: GraduationCap,
      iconColor: '#7C3AED',
      iconBg: '#EDE9FE',
      issuer: 'Central Board of Secondary Education (CBSE)',
      issueDate: '10-06-2020',
      year: '2020',
      ageMilestone: 'Age 16',
      refNo: 'DEMO-10TH-10001',
      status: 'VERIFIED',
      verificationHash: '0x33b1e7c94d08a256f102e88a',
      description: 'Senior secondary class 10 graduation certificate and scholastic marksheet qualifying for higher secondary education.',
      signatory: 'Controller of Examinations, CBSE New Delhi',
      keyDetails: {
        'Candidate Name': citizenName,
        'Roll Number': '10849201',
        'School': 'CivicOne Model Public School',
        'CGPA / Result': '9.6 CGPA (Distinction)',
        'Pass Year': 'May 2020'
      }
    },
    {
      step: 5,
      id: 'jour-05',
      name: 'Class XII Senior Secondary Certificate (HSC / CBSE)',
      officialTitle: 'Board of Intermediate Education — Senior Secondary Pass',
      category: 'EDUCATION',
      categoryLabel: 'Higher Secondary',
      icon: GraduationCap,
      iconColor: '#7C3AED',
      iconBg: '#EDE9FE',
      issuer: 'Board of Intermediate Education / CBSE',
      issueDate: '05-06-2022',
      year: '2022',
      ageMilestone: 'Age 18',
      refNo: 'DEMO-12TH-10001',
      status: 'VERIFIED',
      verificationHash: '0x55c9e2b10a47f89d3421e7b6',
      description: 'Higher Secondary Science stream (MPC) graduation pass certificate qualifying for university admission.',
      signatory: 'Secretary, Board of Intermediate Education',
      keyDetails: {
        'Student Name': citizenName,
        'Stream': 'Science (Mathematics, Physics, Chemistry)',
        'Score': '95.4% Marks',
        'College Code': 'INST-AP-402',
        'Result Status': 'Passed with Grade A+'
      }
    },
    {
      step: 6,
      id: 'jour-06',
      name: 'Permanent Account Number (PAN Card)',
      officialTitle: 'Income Tax Department — Sovereign Tax Identity',
      category: 'IDENTITY',
      categoryLabel: 'Tax & Financial ID',
      icon: Landmark,
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
      issuer: 'Income Tax Department — Govt of India',
      issueDate: '10-08-2022',
      year: '2022',
      ageMilestone: 'Age 18 (Adult Milestone)',
      refNo: 'DEMOP10001F',
      status: 'VERIFIED',
      verificationHash: '0x12c4e8b7d90a5f33e891c640',
      description: 'Ten-digit alphanumeric tax identifier issued by the Income Tax Department for national financial and economic compliance.',
      signatory: 'Director General of Income Tax (Systems)',
      keyDetails: {
        'PAN Cardholder': citizenName,
        'PAN Number': 'DEMOP10001F',
        'Father Name': 'S. Varma',
        'Aadhaar Linked': 'Yes (Active & Linked)',
        'Status': 'Operative & Valid'
      }
    },
    {
      step: 7,
      id: 'jour-07',
      name: 'Voter ID Card (EPIC - Electors Photo Identity)',
      officialTitle: 'Election Commission of India — National Voter Registry',
      category: 'IDENTITY',
      categoryLabel: 'Democratic Suffrage',
      icon: Landmark,
      iconColor: '#DC2626',
      iconBg: '#FEE2E2',
      issuer: 'Election Commission of India (ECI)',
      issueDate: '15-01-2024',
      year: '2024',
      ageMilestone: 'Age 19',
      refNo: 'DEMO-VOTER-10001',
      status: 'VERIFIED',
      verificationHash: '0x88e1a3c09f4b75d261e49b01',
      description: 'Electoral photo identity card establishing national franchise and voting rights in sovereign parliamentary elections.',
      signatory: 'Electoral Registration Officer (ERO)',
      keyDetails: {
        'Elector Name': citizenName,
        'EPIC Number': 'DEMO-VOTER-10001',
        'Constituency': 'Vijayawada Central (AC-079)',
        'Polling Station': 'PS-42 Community Hall',
        'Status': 'Active Registered Voter'
      }
    },
    {
      step: 8,
      id: 'jour-08',
      name: 'Smart Driving Licence (LMV & Motorcycle)',
      officialTitle: 'Ministry of Road Transport & Highways — Smart Card DL',
      category: 'TRANSPORT',
      categoryLabel: 'Transport & Mobility',
      icon: Car,
      iconColor: '#059669',
      iconBg: '#D1FAE5',
      issuer: 'Parivahan Sewa — State Transport Authority',
      issueDate: '12-01-2024',
      year: '2024',
      ageMilestone: 'Age 19',
      refNo: 'DEMO-DL-10001',
      status: 'VERIFIED',
      verificationHash: '0x44d7a8e21c90f5b67e33a189',
      description: 'Smart biometric driving permit authorizing operation of Light Motor Vehicles (LMV) and Motorcycles across India.',
      signatory: 'Regional Transport Officer (RTO)',
      keyDetails: {
        'Licence Holder': citizenName,
        'Licence No': 'DEMO-DL-10001',
        'Vehicle Class': 'MCWG / LMV (Car & Motorcycle)',
        'Valid Until': '10-09-2026',
        'Issuing RTO': 'RTO Vijayawada (AP-16)'
      }
    },
    {
      step: 9,
      id: 'jour-09',
      name: 'B.Tech Degree in Computer Science & Engineering',
      officialTitle: 'Autonomous Institute of Technology — University Graduation Degree',
      category: 'EDUCATION',
      categoryLabel: 'University Degree',
      icon: GraduationCap,
      iconColor: '#7C3AED',
      iconBg: '#EDE9FE',
      issuer: 'Autonomous Technical University / College',
      issueDate: '20-01-2024',
      year: '2024',
      ageMilestone: 'Age 19',
      refNo: 'DEMO-DEG-10001',
      status: 'VERIFIED',
      verificationHash: '0x66f2c0a91e4b88d374a51e09',
      description: 'Bachelor of Technology (Computer Science & AI) undergraduate degree certificate with first class with distinction.',
      signatory: 'Vice Chancellor & Controller of Examinations',
      keyDetails: {
        'Graduate': citizenName,
        'Degree Conferred': 'Bachelor of Technology (B.Tech)',
        'Specialization': 'Computer Science & Engineering',
        'Division': 'First Class with Distinction',
        'Convocation Year': '2024'
      }
    },
    {
      step: 10,
      id: 'jour-10',
      name: 'Republic of India Sovereign Passport',
      officialTitle: 'Ministry of External Affairs — Consular, Passport & Visa Division',
      category: 'IDENTITY',
      categoryLabel: 'Global Identity',
      icon: ShieldCheck,
      iconColor: '#0284C7',
      iconBg: '#E0F2FE',
      issuer: 'Ministry of External Affairs — Govt of India',
      issueDate: '22-01-2024',
      year: '2024',
      ageMilestone: 'Age 19',
      refNo: 'DEMO-PASS-10001',
      status: 'VERIFIED',
      verificationHash: '0x99e4b7a10f3c88d5621e09a3',
      description: 'Official 36-page sovereign passport granting international travel rights and protection under the Republic of India.',
      signatory: 'Passport Officer, Regional Passport Office',
      keyDetails: {
        'Passport Holder': citizenName,
        'Passport Number': 'DEMO-PASS-10001',
        'Nationality': 'Indian',
        'Expiry Date': '30-06-2033',
        'Passport Office': 'RPO Visakhapatnam'
      }
    },
    {
      step: 11,
      id: 'jour-11',
      name: 'State Domicile & Permanent Residence Certificate',
      officialTitle: 'Revenue Department — State Government Residence Pass',
      category: 'IDENTITY',
      categoryLabel: 'State Domicile',
      icon: Building2,
      iconColor: '#4B5563',
      iconBg: '#F3F4F6',
      issuer: 'Revenue Department, Govt of Andhra Pradesh',
      issueDate: '18-05-2024',
      year: '2024',
      ageMilestone: 'Age 19',
      refNo: 'DEMO-DOM-2024-9002',
      status: 'VERIFIED',
      verificationHash: '0x11b5e9c42d78a630f982c771',
      description: 'Official revenue certificate validating state domicile and local residency for competitive opportunities and civil welfare.',
      signatory: 'Tahsildar / Mandal Revenue Officer',
      keyDetails: {
        'Citizen Name': citizenName,
        'Resident State': citizenState,
        'District': 'Krishna District',
        'Residence Period': 'Continuous Resident since Birth',
        'Validity': 'Permanent Sovereign Record'
      }
    },
    {
      step: 12,
      id: 'jour-12',
      name: 'Vehicle Registration Certificate (RC: AP-DEMO-1001)',
      officialTitle: 'Ministry of Road Transport & Highways — Motor Vehicle RC',
      category: 'TRANSPORT',
      categoryLabel: 'Vehicle Ownership',
      icon: Car,
      iconColor: '#059669',
      iconBg: '#D1FAE5',
      issuer: 'Parivahan Sewa — State Transport Authority',
      issueDate: '25-01-2024',
      year: '2024',
      ageMilestone: 'Age 19',
      refNo: 'AP-DEMO-1001',
      status: 'VERIFIED',
      verificationHash: '0x22a8c1f90b4d76e5831e9a44',
      description: 'Motor Vehicle Registration Certificate proving registered ownership of passenger car (Hyundai Creta).',
      signatory: 'Registering Authority (MV Department)',
      keyDetails: {
        'Registered Owner': citizenName,
        'Registration No': 'AP-DEMO-1001',
        'Vehicle Model': 'Hyundai Creta SX (White)',
        'Fuel Type': 'Petrol / BS-VI',
        'Validity': '01-09-2026'
      }
    },
    {
      step: 13,
      id: 'jour-13',
      name: 'AI Engineering & Cloud Architecture Certification',
      officialTitle: 'National Skill Development Portal — Professional Accreditation',
      category: 'CAREER',
      categoryLabel: 'Professional Skill',
      icon: Award,
      iconColor: '#D97706',
      iconBg: '#FEF3C7',
      issuer: 'National Skill Development Council / Tech Academy',
      issueDate: '10-01-2025',
      year: '2025',
      ageMilestone: 'Age 20',
      refNo: 'DEMO-INT-2025-CS09',
      status: 'VERIFIED',
      verificationHash: '0x77d1e8c09a4b32f6518e209a',
      description: 'Professional engineering accreditation and certified internship in Advanced Agentic AI & Cloud Architecture.',
      signatory: 'Director of Certifications, NSDC',
      keyDetails: {
        'Candidate': citizenName,
        'Credential': 'AI & Full-Stack Cloud Architecture',
        'Grade': 'Outstanding Distinction (A+)',
        'Issuer': 'National Skill Portal'
      }
    },
    {
      step: 14,
      id: 'jour-14',
      name: 'ABHA — Ayushman Bharat Digital Health Account',
      officialTitle: 'National Health Authority (NHA) — Sovereign Health ID',
      category: 'HEALTH',
      categoryLabel: 'Digital Healthcare',
      icon: HeartPulse,
      iconColor: '#16A34A',
      iconBg: '#DCFCE7',
      issuer: 'National Health Authority (NHA) — MoHFW',
      issueDate: '14-02-2025',
      year: '2025',
      ageMilestone: 'Age 20',
      refNo: '91-4820-1940-2041',
      status: 'VERIFIED',
      verificationHash: '0x55e9c2b18a4d70f6128e3401',
      description: 'Unified 14-digit digital health account enabling paperless healthcare, lab reports, and doctor consultations across India.',
      signatory: 'Chief Executive Officer, National Health Authority',
      keyDetails: {
        'ABHA Holder': citizenName,
        'ABHA Number': '91-4820-1940-2041',
        'ABHA Address': 'aaravkumar@abdm',
        'Health Vault': 'Active & Encrypted',
        'Status': 'Operational'
      }
    },
    {
      step: 15,
      id: 'jour-15',
      name: 'CivicOne Sovereign Digital Identity Credential',
      officialTitle: 'CivicOne Sovereign Digital Identity Authority — Verified Citizen Pass',
      category: 'SOVEREIGN',
      categoryLabel: 'Sovereign Milestone',
      icon: ShieldCheck,
      iconColor: '#0B5ED7',
      iconBg: '#EFF6FF',
      issuer: 'CivicOne National Sovereign Authority',
      issueDate: '15-08-2026',
      year: '2026',
      ageMilestone: 'Age 22 (Present)',
      refNo: `${citizenId}-SOV-ID`,
      status: 'ACTIVE CITIZEN TIER',
      verificationHash: '0x99f4c1a82d0e76b5193e449a',
      description: 'Official sovereign digital identity credential with instant QR verification, digital authentication, and offline cryptography.',
      signatory: 'Chief Technology Officer, CivicOne Sovereign ID',
      keyDetails: {
        'Citizen': citizenName,
        'Civic ID': citizenId,
        'Identity Tier': 'NORMAL CITIZEN / VERIFIED',
        'Verification Chain': '15/15 Milestones Cryptographically Linked',
        'Status': 'ACTIVE & PROTECTED'
      }
    }
  ];

  const categories = [
    { id: 'ALL', label: 'All Journey Milestones', count: LIFE_JOURNEY_DOCUMENTS.length },
    { id: 'BIRTH', label: '👶 Birth & Early Life', count: 2 },
    { id: 'IDENTITY', label: '🏛️ Sovereign Identity', count: 4 },
    { id: 'EDUCATION', label: '🎓 Education & Degree', count: 3 },
    { id: 'TRANSPORT', label: '🚗 Mobility & Vehicles', count: 2 },
    { id: 'HEALTH', label: '🏥 Healthcare & ABHA', count: 2 },
    { id: 'SOVEREIGN', label: '🛡️ Sovereign Credentials', count: 2 }
  ];

  const filteredDocs = LIFE_JOURNEY_DOCUMENTS.filter(doc => {
    const matchesCategory = selectedCategory === 'ALL' ||
      (selectedCategory === 'BIRTH' && (doc.category === 'BIRTH' || doc.id === 'jour-02')) ||
      (selectedCategory === 'IDENTITY' && doc.category === 'IDENTITY') ||
      (selectedCategory === 'EDUCATION' && doc.category === 'EDUCATION') ||
      (selectedCategory === 'TRANSPORT' && doc.category === 'TRANSPORT') ||
      (selectedCategory === 'HEALTH' && doc.category === 'HEALTH') ||
      (selectedCategory === 'SOVEREIGN' && (doc.category === 'SOVEREIGN' || doc.category === 'CAREER'));

    const matchesSearch = !searchQuery.trim() ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.year.includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  const handleCopyRef = (refNo) => {
    navigator.clipboard?.writeText(refNo);
    setCopiedId(refNo);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* HEADER HERO BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #0B1F3A 0%, #073B8C 50%, #0B5ED7 100%)',
        borderRadius: '24px',
        padding: '32px 28px',
        color: '#FFFFFF',
        boxShadow: '0 12px 36px -4px rgba(11, 94, 215, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          right: '-50px',
          top: '-50px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
            <Milestone size={16} color="#FEF08A" /> CITIZEN LIFE-CYCLE TIMELINE
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '6px', color: '#FFFFFF' }}>
            My Sovereign Citizen Journey
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#DBEAFE', maxWidth: '780px', lineHeight: '1.5' }}>
            Chronological registry of every verified legal credential, educational qualification, government identity record, and sovereign milestone belonging to <strong>{citizenName}</strong> from birth to present.
          </p>

          {/* Quick Statistics Banner */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginTop: '24px' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(6px)', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '0.7rem', color: '#BFDBFE', fontWeight: 700, textTransform: 'uppercase' }}>First Milestone</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>👶 Birth Certificate</div>
              <div style={{ fontSize: '0.7rem', color: '#93C5FD' }}>15 Jul 2004</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(6px)', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '0.7rem', color: '#BFDBFE', fontWeight: 700, textTransform: 'uppercase' }}>Total Milestones</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>15 Verified Documents</div>
              <div style={{ fontSize: '0.7rem', color: '#86EFAC' }}>● 100% Verified Chain</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(6px)', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '0.7rem', color: '#BFDBFE', fontWeight: 700, textTransform: 'uppercase' }}>Current Milestone</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FEF08A', marginTop: '2px' }}>✨ Gold Pass Tier</div>
              <div style={{ fontSize: '0.7rem', color: '#BFDBFE' }}>15 Aug 2026 (Active)</div>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(6px)', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
              <div style={{ fontSize: '0.7rem', color: '#BFDBFE', fontWeight: 700, textTransform: 'uppercase' }}>Citizen Record</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>{citizenId}</div>
              <div style={{ fontSize: '0.7rem', color: '#BFDBFE' }}>Cryptographically Intact</div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        padding: '20px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '16px' }}>
          {/* Search Box */}
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search journey by document name, issuer, year, or reference..."
              style={{
                width: '100%',
                padding: '11px 14px 11px 42px',
                borderRadius: '12px',
                border: '1.5px solid var(--border-light)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.875rem',
                fontWeight: 600
              }}
            />
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            Showing <strong>{filteredDocs.length}</strong> of <strong>{LIFE_JOURNEY_DOCUMENTS.length}</strong> Milestones
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: selectedCategory === cat.id ? '#0B5ED7' : 'var(--bg-main)',
                color: selectedCategory === cat.id ? '#FFFFFF' : 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CHRONOLOGICAL TIMELINE LIST */}
      <div style={{ position: 'relative' }}>
        
        {/* Continuous Center Timeline Line */}
        <div style={{
          position: 'absolute',
          left: '28px',
          top: '30px',
          bottom: '30px',
          width: '3px',
          background: 'linear-gradient(to bottom, #0284C7 0%, #0B5ED7 50%, #10B981 100%)',
          borderRadius: '4px',
          zIndex: 1
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 2 }}>
          {filteredDocs.map((doc, index) => {
            const IconComponent = doc.icon;
            const isFirst = doc.step === 1;
            const isLatest = doc.step === LIFE_JOURNEY_DOCUMENTS.length;

            return (
              <div
                key={doc.id}
                style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'flex-start'
                }}
              >
                {/* Timeline Step Badge */}
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  backgroundColor: doc.iconBg,
                  color: doc.iconColor,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                  border: isFirst ? '2.5px solid #0284C7' : isLatest ? '2.5px solid #D97706' : '1.5px solid var(--border-light)',
                  position: 'relative',
                  marginTop: '4px'
                }}>
                  <IconComponent size={22} />
                  <span style={{ fontSize: '0.6rem', fontWeight: 900, marginTop: '2px' }}>
                    #{doc.step < 10 ? `0${doc.step}` : doc.step}
                  </span>
                </div>

                {/* Milestone Document Card */}
                <div style={{
                  flex: 1,
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '20px',
                  border: isFirst ? '2px solid #93C5FD' : isLatest ? '2px solid #FDE68A' : '1px solid var(--border-light)',
                  padding: '22px 24px',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}>
                  
                  {/* Top Bar of Milestone */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span style={{
                          backgroundColor: isFirst ? '#E0F2FE' : isLatest ? '#FEF3C7' : 'var(--bg-main)',
                          color: isFirst ? '#0369A1' : isLatest ? '#B45309' : 'var(--text-muted)',
                          padding: '3px 10px',
                          borderRadius: '8px',
                          fontSize: '0.725rem',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}>
                          {isFirst ? '🏁 Starting Milestone' : isLatest ? '✨ Current Milestone' : doc.categoryLabel}
                        </span>
                        
                        <span style={{
                          backgroundColor: '#EFF6FF',
                          color: '#1D4ED8',
                          padding: '3px 10px',
                          borderRadius: '8px',
                          fontSize: '0.725rem',
                          fontWeight: 800
                        }}>
                          🗓️ {doc.issueDate} ({doc.ageMilestone})
                        </span>

                        <span style={{
                          backgroundColor: '#ECFDF5',
                          color: '#065F46',
                          padding: '3px 10px',
                          borderRadius: '8px',
                          fontSize: '0.725rem',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <CheckCircle2 size={12} color="#059669" /> Verified Credential
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginBottom: '2px' }}>
                        {doc.name}
                      </h3>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-light)', fontWeight: 600 }}>
                        {doc.officialTitle}
                      </div>
                    </div>

                    {/* Step Number & Reference Tag */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: 'var(--bg-main)',
                        border: '1px solid var(--border-light)',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        color: 'var(--text-main)'
                      }}>
                        <span>{doc.refNo}</span>
                        <button
                          onClick={() => handleCopyRef(doc.refNo)}
                          title="Copy Document Reference"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-light)' }}
                        >
                          {copiedId === doc.refNo ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Description / Summary */}
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>
                    {doc.description}
                  </p>

                  {/* Issuing Authority & Key Data Highlights */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '10px',
                    backgroundColor: 'var(--bg-main)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    fontSize: '0.8rem'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-light)', fontWeight: 700, display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Issuing Authority</span>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{doc.issuer}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-light)', fontWeight: 700, display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Authorized Signatory</span>
                      <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{doc.signatory}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-light)', fontWeight: 700, display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Cryptographic Proof</span>
                      <strong style={{ color: '#0B5ED7', fontFamily: 'monospace', fontSize: '0.8rem' }}>{doc.verificationHash}</strong>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setSelectedDocForPreview(doc)}
                      style={{
                        backgroundColor: '#0B5ED7',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Eye size={16} /> View Official Document
                    </button>

                    <button
                      onClick={() => {
                        const content = JSON.stringify(doc, null, 2);
                        const blob = new Blob([content], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${doc.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_verified.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      style={{
                        backgroundColor: 'var(--bg-main)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-light)',
                        padding: '8px 14px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.825rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Download size={15} /> Download Credential
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAILED DOCUMENT PREVIEW MODAL */}
      {selectedDocForPreview && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            border: '2px solid #DBEAFE',
            position: 'relative'
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: selectedDocForPreview.iconBg, color: selectedDocForPreview.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0B5ED7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    SOVEREIGN VERIFIED CREDENTIAL • MILESTONE #{selectedDocForPreview.step}
                  </span>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0B1F3A', marginTop: '2px' }}>
                    {selectedDocForPreview.name}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setSelectedDocForPreview(null)}
                style={{ backgroundColor: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontWeight: 800, fontSize: '1.1rem', color: '#64748B', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Official Certificate Style Container */}
            <div style={{
              backgroundColor: '#F8FAFC',
              border: '2px solid #CBD5E1',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
              position: 'relative'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '18px', borderBottom: '1px dashed #CBD5E1', paddingBottom: '14px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
                  {selectedDocForPreview.issuer}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B1F3A', marginTop: '4px' }}>
                  {selectedDocForPreview.officialTitle}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 800, marginTop: '4px' }}>
                  ● Cryptographically Issued on {selectedDocForPreview.issueDate}
                </div>
              </div>

              {/* Dynamic Field Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '18px' }}>
                {Object.entries(selectedDocForPreview.keyDetails || {}).map(([key, val]) => (
                  <div key={key} style={{ backgroundColor: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>{key}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0B1F3A', marginTop: '2px' }}>{val}</div>
                  </div>
                ))}
              </div>

              {/* Cryptographic Proof Footer */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #BFDBFE', padding: '12px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700 }}>IMMUTABLE AUDIT HASH</div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#0B5ED7', fontWeight: 800 }}>{selectedDocForPreview.verificationHash}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ECFDF5', color: '#065F46', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>
                  <CheckCircle2 size={14} color="#059669" /> 100% Verified
                </div>
              </div>
            </div>

            {/* Modal Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => handleCopyRef(selectedDocForPreview.refNo)}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {copiedId === selectedDocForPreview.refNo ? <Check size={16} color="#059669" /> : <Copy size={16} />}
                {copiedId === selectedDocForPreview.refNo ? 'Copied Ref!' : 'Copy Reference Number'}
              </button>

              <button
                onClick={() => setSelectedDocForPreview(null)}
                style={{
                  backgroundColor: '#0B5ED7',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Close Certificate
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
