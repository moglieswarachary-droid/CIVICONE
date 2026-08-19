// src/config/organizationConfig.js - Centralized CivicOne Organization Portal Configuration & Sector Taxonomy

export const ORGANIZATION_SECTORS = [
  {
    id: 'government',
    slug: 'government',
    title: 'Government',
    icon: 'Landmark',
    emoji: '🏛',
    badgeColor: '#0B5ED7',
    badgeBg: '#EAF3FF',
    description: 'State and central government departments, civic registries, law enforcement, and regulatory bodies.',
    orgCount: 7
  },
  {
    id: 'education',
    slug: 'education',
    title: 'Education',
    icon: 'GraduationCap',
    emoji: '🎓',
    badgeColor: '#059669',
    badgeBg: '#ECFDF5',
    description: 'Universities, affiliated colleges, intermediate institutions, K-12 schools, and government-certified technology institutions.',
    orgCount: 4
  },
  {
    id: 'healthcare',
    slug: 'healthcare',
    title: 'Healthcare',
    icon: 'HeartPulse',
    emoji: '🏥',
    badgeColor: '#DC2626',
    badgeBg: '#FEF2F2',
    description: 'Government hospitals and private healthcare networks providing emergency care, inpatient services, and patient verification.',
    orgCount: 2
  },
  {
    id: 'banking_finance',
    slug: 'banking-finance',
    title: 'Banking & Finance',
    icon: 'Landmark',
    emoji: '🏦',
    badgeColor: '#D97706',
    badgeBg: '#FEF3C7',
    description: 'Government banks, private banks, mutual funds & investment firms, and insurance institutions.',
    orgCount: 4
  },
  {
    id: 'private_sector',
    slug: 'private-sector',
    title: 'Private Sector',
    icon: 'Building2',
    emoji: '🏢',
    badgeColor: '#7C3AED',
    badgeBg: '#F3E8FF',
    description: 'Registered commercial companies and corporate employers for background verification.',
    orgCount: 2
  }
];

export const ORGANIZATION_CONFIGS = {
  // -------------------------------------------------------------
  // 1. GOVERNMENT SECTOR
  // -------------------------------------------------------------
  'police': {
    id: 'police',
    slug: 'police',
    sector: 'government',
    sectorTitle: 'Government',
    name: 'Police Department',
    roleCode: 'POLICE_ADMIN',
    logoEmoji: '👮‍♂️',
    categoryName: 'Law Enforcement',
    integrationStatus: 'Prototype / Simulated',
    description: 'Authorized law enforcement identity verification, FIR management, criminal checks, and high-rank judicial warrant audits.',
    roles: [
      'Police Admin',
      'Senior Police Commissioner / SP (Level 3 High-Rank Access)',
      'Economic Offences Wing / Cyber Crime (EOW Financial Investigations)',
      'Medico-Legal Special Investigator (Forensic & Health Records)',
      'Police Inspector (Standard Enforcement)',
      'Police Verifier',
      'Police Auditor'
    ],
    capabilities: [
      'Identity Verification',
      'Credential Verification',
      'Authorized Citizen Access',
      'Verification Requests',
      'Verification History',
      'High-Rank Financial Warrant Access',
      'Medico-Legal Health Audit'
    ],
    allowedCategories: ['Identity', 'Vehicle/RTO', 'Legal/Police', 'Finance', 'Healthcare'],
    allowedDocTypes: ['Aadhaar Identity', 'Driving Licence', 'FIR Records', 'Police Verification', 'Bank Account Verification', 'PAN Status', 'ABHA Health Card', 'Medical Casualty Report']
  },
  'rto': {
    id: 'rto',
    slug: 'rto',
    sector: 'government',
    sectorTitle: 'Government',
    name: 'RTO / Transport Department',
    roleCode: 'RTO_ADMIN',
    logoEmoji: '🚘',
    categoryName: 'Transport & Licensing',
    integrationStatus: 'Prototype / Simulated',
    description: 'State Motor Vehicle Department for DL & RC verification, insurance verification, and credential issuance.',
    roles: ['RTO Admin', 'RTO Inspector', 'Verification Officer', 'Auditor'],
    capabilities: [
      'Driving Licence Verification',
      'Vehicle Registration Verification',
      'Vehicle Credential Verification',
      'Insurance Verification',
      'Credential Issuance',
      'Credential Revocation'
    ],
    allowedCategories: ['Vehicle/RTO', 'Identity'],
    allowedDocTypes: ['Driving Licence', 'Vehicle RC', 'Vehicle Insurance', 'PUC Certificate']
  },
  'passport': {
    id: 'passport',
    slug: 'passport',
    sector: 'government',
    sectorTitle: 'Government',
    name: 'Passport Authority',
    roleCode: 'PASSPORT_ADMIN',
    logoEmoji: '🛂',
    categoryName: 'Immigration & Passports',
    integrationStatus: 'Prototype / Simulated',
    description: 'Ministry of External Affairs Passport Seva verification and passport credential issuance.',
    roles: ['Passport Admin', 'Verification Officer', 'Auditor'],
    capabilities: [
      'Identity Verification',
      'Passport Verification',
      'Credential Verification',
      'Verification History'
    ],
    allowedCategories: ['Identity', 'Travel', 'Birth/Address'],
    allowedDocTypes: ['Passport Record', 'Aadhaar Identity', 'Birth Certificate']
  },
  'revenue': {
    id: 'revenue',
    slug: 'revenue',
    sector: 'government',
    sectorTitle: 'Government',
    name: 'Revenue & Land Records',
    roleCode: 'REVENUE_ADMIN',
    logoEmoji: '📜',
    categoryName: 'Land & Property',
    integrationStatus: 'Prototype / Simulated',
    description: 'State Revenue Department for property title, land records, encumbrance certificate, and patta verification.',
    roles: ['Revenue Admin', 'Tehsildar', 'Land Officer', 'Auditor'],
    capabilities: [
      'Property Verification',
      'Land Record Verification',
      'Owner Identity Verification',
      'Credential Verification'
    ],
    allowedCategories: ['Property', 'Identity'],
    allowedDocTypes: ['Land Deed', 'Patta Record', 'Property Tax Receipt', 'Encumbrance Certificate']
  },
  'election': {
    id: 'election',
    slug: 'election',
    sector: 'government',
    sectorTitle: 'Government',
    name: 'Election Authority',
    roleCode: 'ELECTION_ADMIN',
    logoEmoji: '🗳️',
    categoryName: 'Electoral Commission',
    integrationStatus: 'Prototype / Simulated',
    description: 'Election Commission voter ID verification, polling booth assignment, and electoral roll authentication.',
    roles: ['Election Admin', 'Electoral Officer', 'Verifier', 'Auditor'],
    capabilities: [
      'Voter Identity Verification',
      'Voter Credential Verification',
      'Authorized Citizen Verification'
    ],
    allowedCategories: ['Identity', 'Electoral'],
    allowedDocTypes: ['Voter ID Card', 'Electoral Roll Record', 'Aadhaar Identity']
  },
  'identity_authority': {
    id: 'identity_authority',
    slug: 'identity-authority',
    sector: 'government',
    sectorTitle: 'Government',
    name: 'Identity Authority',
    roleCode: 'IDENTITY_AUTH_ADMIN',
    logoEmoji: '🆔',
    categoryName: 'National Identity',
    integrationStatus: 'Prototype / Simulated',
    description: 'High-assurance Aadhaar Data Vault (ADV) identity tokenization and status verification gateway.',
    roles: ['Identity Admin', 'Tokenization Officer', 'Auditor'],
    capabilities: [
      'Identity Verification',
      'Tokenized Identity Verification',
      'Identity Status',
      'Authorized Identity Requests'
    ],
    allowedCategories: ['Identity'],
    allowedDocTypes: ['Aadhaar Token', 'Civic ID Card', 'Identity Verification Status']
  },
  'municipal': {
    id: 'municipal',
    slug: 'municipal',
    sector: 'government',
    sectorTitle: 'Government',
    name: 'Municipal Authority',
    roleCode: 'MUNICIPAL_ADMIN',
    logoEmoji: '🏛️',
    categoryName: 'Civic Body',
    integrationStatus: 'Prototype / Simulated',
    description: 'Municipal Corporation dedicated to farming schemes, seedings distribution, sanitation cleaning, and municipal water supply services.',
    roles: ['Municipal Admin', 'Agricultural & Water Officer', 'Sanitation Inspector', 'Auditor'],
    capabilities: [
      'Farming Scheme Verification',
      'Seedings Distribution Audit',
      'Cleaning & Sanitation Verification',
      'Water Supply Management'
    ],
    allowedCategories: ['Farming', 'Seedings', 'Cleaning', 'Water'],
    allowedDocTypes: ['Farming Subsidy Proof', 'Seedings Allotment Certificate', 'Water Supply Record', 'Sanitation Clearance']
  },

  // -------------------------------------------------------------
  // 2. EDUCATION SECTOR
  // -------------------------------------------------------------
  'college': {
    id: 'college',
    slug: 'college',
    sector: 'education',
    sectorTitle: 'Education',
    name: 'College / University',
    roleCode: 'COLLEGE_ADMIN',
    logoEmoji: '🎓',
    categoryName: 'Higher Education',
    integrationStatus: 'Prototype / Simulated',
    description: 'Universities, affiliated colleges, autonomous colleges, engineering colleges, degree colleges and higher education institutions.',
    roles: ['College Admin', 'Dean of Academics', 'Registrar', 'Auditor'],
    capabilities: [
      'Student Verification',
      'Degree Verification',
      'Marksheet Verification',
      'Academic Certificate Locking',
      'New Admission Verification'
    ],
    allowedCategories: ['Education', 'Identity'],
    allowedDocTypes: ['Degree Certificate', 'Semester Marksheet', 'Transfer Certificate', '10th Certificate', '12th Certificate']
  },
  'intermediate': {
    id: 'intermediate',
    slug: 'intermediate',
    sector: 'education',
    sectorTitle: 'Education',
    name: 'Intermediate / PUC / +12',
    roleCode: 'INTER_ADMIN',
    logoEmoji: '🏛️',
    categoryName: 'Pre-University & Higher Secondary',
    integrationStatus: 'Prototype / Simulated',
    description: 'Intermediate colleges, Pre-University Colleges, Higher Secondary and +12 educational institutions.',
    roles: ['Principal', 'Intermediate Admin', 'Verification Officer', 'Auditor'],
    capabilities: [
      'Student Verification',
      'Stream Verification (MPC/BiPC/MEC/CEC)',
      '10th Marksheet Verification',
      'Certificate Locking'
    ],
    allowedCategories: ['Education', 'Identity'],
    allowedDocTypes: ['10th Marksheet', 'Intermediate Transfer Certificate', 'Bonafide Certificate']
  },
  'school': {
    id: 'school',
    slug: 'school',
    sector: 'education',
    sectorTitle: 'Education',
    name: 'Schools',
    roleCode: 'SCHOOL_ADMIN',
    logoEmoji: '🏫',
    categoryName: 'K-12 Recognized Schools',
    integrationStatus: 'Prototype / Simulated',
    description: 'State Board, CBSE, ICSE and other recognized schools.',
    roles: ['School Admin', 'Principal', 'Teacher Verification Officer', 'Auditor'],
    capabilities: [
      'Student Verification',
      'Class & Section Roll Verification',
      'Parent/Guardian Verification',
      'Certificate Verification & Lock'
    ],
    allowedCategories: ['Education', 'Identity'],
    allowedDocTypes: ['School ID Card', 'Transfer Certificate', 'Grade Report', 'Birth Certificate']
  },
  'technology': {
    id: 'technology',
    slug: 'technology',
    sector: 'education',
    sectorTitle: 'Education',
    name: 'Government-Certified Technology Institutions',
    roleCode: 'TECH_INST_ADMIN',
    logoEmoji: '💻',
    categoryName: 'Skill Development & Technical Training',
    integrationStatus: 'Prototype / Simulated',
    description: 'Government-certified technical training institutions, skill development centers and approved technology education providers.',
    roles: ['Institute Admin', 'Technical Assessor', 'Certification Officer', 'Auditor'],
    capabilities: [
      'Student Skill Verification',
      'Technical Certification Issuance',
      'Course Completion Audit',
      'Citizen Skill Synchronization'
    ],
    allowedCategories: ['Education', 'Skill'],
    allowedDocTypes: ['Skill Certificate', 'Technical Certification ID', 'Apprenticeship Record']
  },

  // -------------------------------------------------------------
  // 3. HEALTHCARE SECTOR
  // -------------------------------------------------------------
  'gov_hospital': {
    id: 'gov_hospital',
    slug: 'gov-hospital',
    sector: 'healthcare',
    sectorTitle: 'Healthcare',
    name: 'Government Hospital',
    roleCode: 'GOV_HOSPITAL_ADMIN',
    logoEmoji: '🏥',
    categoryName: 'Public Healthcare Facility',
    integrationStatus: 'Prototype / Simulated',
    description: 'Government hospitals and public healthcare facilities providing emergency care, inpatient services, medical treatment and citizen healthcare services.',
    roles: ['Government Hospital Admin', 'Chief Medical Officer', 'Emergency Doctor', 'Medical Records Officer', 'Auditor'],
    capabilities: [
      'Patient Identity Verification',
      'Citizen ID Verification',
      'Medical Record Verification',
      'Emergency Patient Registration',
      'Patient Transfer Management',
      'Blood Requirement Management',
      'Blood Donor Management',
      'Insurance Verification'
    ],
    allowedCategories: ['Healthcare', 'Identity'],
    allowedDocTypes: ['ABHA Health Card', 'Emergency Casualty Report', 'Medical History Summary', 'Patient Transfer Token']
  },
  'priv_hospital': {
    id: 'priv_hospital',
    slug: 'priv-hospital',
    sector: 'healthcare',
    sectorTitle: 'Healthcare',
    name: 'Private Hospital',
    roleCode: 'PRIV_HOSPITAL_ADMIN',
    logoEmoji: '🏨',
    categoryName: 'Private Healthcare Network',
    integrationStatus: 'Prototype / Simulated',
    description: 'Private hospitals and healthcare networks providing emergency care, inpatient services, medical treatment and authorized citizen healthcare verification.',
    roles: ['Private Hospital Admin', 'Medical Director', 'Duty Doctor', 'Insurance Coordinator', 'Auditor'],
    capabilities: [
      'Patient Identity Verification',
      'Citizen ID Verification',
      'Medical Record Verification',
      'Emergency Patient Registration',
      'Patient Transfer Management',
      'Blood Requirement Management',
      'Blood Donor Management',
      'Insurance Verification'
    ],
    allowedCategories: ['Healthcare', 'Identity'],
    allowedDocTypes: ['ABHA Health Card', 'Private Insurance Claim Proof', 'Medical Summary', 'Patient Transfer Token']
  },

  // -------------------------------------------------------------
  // 4. BANKING & FINANCE SECTOR (EXACTLY 4 CATEGORIES)
  // -------------------------------------------------------------
  'gov_bank': {
    id: 'gov_bank',
    slug: 'government-bank',
    sector: 'banking_finance',
    sectorTitle: 'Banking & Finance',
    name: 'Government Banks',
    roleCode: 'GOVT_BANK_ADMIN',
    logoEmoji: '🏦',
    categoryName: 'Public Sector Banking',
    integrationStatus: 'Prototype / Simulated',
    description: 'State Bank, public sector banks, regional rural banks, and government cooperative banks for eKYC, account opening, and loan processing.',
    roles: ['Bank Admin', 'Branch Manager', 'KYC Officer', 'Loan Officer', 'Auditor'],
    capabilities: [
      'KYC Verification',
      'Customer Identity Verification',
      'PAN & Aadhaar Verification',
      'Account Verification',
      'Loan Processing'
    ],
    allowedCategories: ['Finance', 'Identity', 'Income'],
    allowedDocTypes: ['PAN Card', 'Aadhaar Identity', 'ITR Return', 'Bank Statement', 'Salary Slip']
  },
  'priv_bank': {
    id: 'priv_bank',
    slug: 'private-bank',
    sector: 'banking_finance',
    sectorTitle: 'Banking & Finance',
    name: 'Private Banks',
    roleCode: 'PRIVATE_BANK_ADMIN',
    logoEmoji: '🏛️',
    categoryName: 'Private Commercial Banking',
    integrationStatus: 'Prototype / Simulated',
    description: 'Private commercial banks, banking groups, and digital private banks for digital eKYC, credit card evaluation, and wealth management.',
    roles: ['Bank Admin', 'Branch Manager', 'KYC Officer', 'Credit Analyst', 'Auditor'],
    capabilities: [
      'KYC Verification',
      'Customer Identity Verification',
      'PAN Verification',
      'Credit Score Evaluation',
      'Digital Account Opening'
    ],
    allowedCategories: ['Finance', 'Identity'],
    allowedDocTypes: ['PAN Card', 'Aadhaar Identity', 'Form 16', 'Credit Score Certificate']
  },
  'investment': {
    id: 'investment',
    slug: 'investment-institution',
    sector: 'banking_finance',
    sectorTitle: 'Banking & Finance',
    name: 'Mutual Funds & Investment',
    roleCode: 'INVEST_INST_ADMIN',
    logoEmoji: '📊',
    categoryName: 'Asset Management & Stockbroking',
    integrationStatus: 'Prototype / Simulated',
    description: 'Mutual fund companies, asset management companies, investment firms, stockbroking institutions, and depositories (NSDL/CDSL).',
    roles: ['Investment Admin', 'Compliance Officer', 'Investor Relationship Manager', 'Auditor'],
    capabilities: [
      'Investor Identity Verification',
      'CKYC Verification',
      'PAN & Demat Verification',
      'Investment Account Verification',
      'SIP & Mutual Fund Management'
    ],
    allowedCategories: ['Finance', 'Identity'],
    allowedDocTypes: ['PAN Card', 'Demat Account Record', 'KYC Certificate', 'Bank Account Proof']
  },
  'insurance': {
    id: 'insurance',
    slug: 'insurance',
    sector: 'banking_finance',
    sectorTitle: 'Banking & Finance',
    name: 'Insurance',
    roleCode: 'INSURANCE_ADMIN',
    logoEmoji: '🛡️',
    categoryName: 'Government & Private Insurance',
    integrationStatus: 'Prototype / Simulated',
    description: 'Public sector insurance corporations and private life, health, motor, and general insurance providers.',
    roles: ['Insurance Admin', 'Claims Officer', 'Underwriter', 'Policy Manager', 'Auditor'],
    capabilities: [
      'Policyholder Verification',
      'Policy Issuance & Renewal',
      'Claim Settlement & Audit',
      'KYC & Identity Verification'
    ],
    allowedCategories: ['Finance', 'Identity', 'Insurance'],
    allowedDocTypes: ['Aadhaar Identity', 'PAN Card', 'Medical Certificate', 'Policy Record', 'Claim Receipt']
  },

  // -------------------------------------------------------------
  // 5. PRIVATE SECTOR (EXACTLY 2 CATEGORIES: COMPANY & EMPLOYER)
  // -------------------------------------------------------------
  'company': {
    id: 'company',
    slug: 'company',
    sector: 'private_sector',
    sectorTitle: 'Private Sector',
    name: 'Company',
    roleCode: 'COMPANY_ADMIN',
    logoEmoji: '🏢',
    categoryName: 'Commercial Business',
    integrationStatus: 'Prototype / Simulated',
    description: 'Registered business enterprises for vendor verification, customer identity, and business compliance.',
    roles: ['Company Admin', 'Operations Manager', 'Verifier', 'Auditor'],
    capabilities: [
      'Employee Verification',
      'Education Verification',
      'Identity Verification',
      'Credential Verification'
    ],
    allowedCategories: ['Identity', 'Education'],
    allowedDocTypes: ['Aadhaar Identity', 'Degree Certificate', 'PAN Card']
  },
  'employer': {
    id: 'employer',
    slug: 'employer',
    sector: 'private_sector',
    sectorTitle: 'Private Sector',
    name: 'Employer',
    roleCode: 'EMPLOYER_ADMIN',
    logoEmoji: '👔',
    categoryName: 'Employment & Hiring',
    integrationStatus: 'Prototype / Simulated',
    description: 'Corporate employers for pre-employment background verification, degree checks, and identity validation.',
    roles: ['Employer Admin', 'Hiring Manager', 'Verifier', 'Auditor'],
    capabilities: [
      'Identity Verification',
      'Employment Verification',
      'Credential Verification'
    ],
    allowedCategories: ['Identity', 'Education', 'Employment'],
    allowedDocTypes: ['Degree Certificate', 'Relieving Letter', 'Aadhaar Identity']
  },
  'hotel': {
    id: 'hotel',
    slug: 'hotel-hospitality',
    sector: 'private_sector',
    sectorTitle: 'Private Sector',
    name: 'Hotel & Hospitality',
    roleCode: 'HOTEL_ACCESS_ADMIN',
    logoEmoji: '🏨',
    categoryName: 'Hospitality & Guest Check-In',
    integrationStatus: 'Prototype / Simulated',
    description: 'Hotels, resorts, and hospitality lodges for guest check-in e-KYC verification and sovereign identity validation.',
    roles: ['Hotel Admin', 'Reception Desk', 'Guest Manager', 'Auditor'],
    capabilities: [
      'Guest Identity Verification',
      'e-KYC Check-In Verification',
      'Masked Aadhaar Authorization',
      'Guest Consent Logs'
    ],
    allowedCategories: ['Identity'],
    allowedDocTypes: ['Masked Aadhaar Identity', 'Passport Record']
  }
};

export const getOrganizationsBySector = (sectorId) => {
  return Object.values(ORGANIZATION_CONFIGS).filter(org => org.sector === sectorId);
};

export const getOrgConfigById = (orgId) => {
  return ORGANIZATION_CONFIGS[orgId] || Object.values(ORGANIZATION_CONFIGS).find(o => o.slug === orgId) || ORGANIZATION_CONFIGS['police'];
};
