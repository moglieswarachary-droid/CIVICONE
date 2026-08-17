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
    description: 'Universities, colleges, schools, education boards, and accredited skill training institutions.',
    orgCount: 5
  },
  {
    id: 'healthcare',
    slug: 'healthcare',
    title: 'Healthcare',
    icon: 'HeartPulse',
    emoji: '🏥',
    badgeColor: '#DC2626',
    badgeBg: '#FEF2F2',
    description: 'Hospitals, medical research institutions, and state health scheme authorities.',
    orgCount: 3
  },
  {
    id: 'banking_finance',
    slug: 'banking-finance',
    title: 'Banking & Finance',
    icon: 'Landmark',
    emoji: '🏦',
    badgeColor: '#D97706',
    badgeBg: '#FEF3C7',
    description: 'Government banks, private banks, NBFCs, insurance institutions, and FinTech companies.',
    orgCount: 9
  },
  {
    id: 'private_sector',
    slug: 'private-sector',
    title: 'Private Sector',
    icon: 'Building2',
    emoji: '🏢',
    badgeColor: '#7C3AED',
    badgeBg: '#F3E8FF',
    description: 'Corporate enterprises, HR background verification, technology firms, and commercial businesses.',
    orgCount: 6
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
    description: 'Authorized law enforcement identity verification, FIR management, and criminal history checks.',
    roles: ['Police Admin', 'Police Officer', 'Police Verifier', 'Police Auditor'],
    capabilities: [
      'Identity Verification',
      'Credential Verification',
      'Authorized Citizen Access',
      'Verification Requests',
      'Verification History'
    ],
    allowedCategories: ['Identity', 'Vehicle/RTO', 'Legal/Police'],
    allowedDocTypes: ['Aadhaar Identity', 'Driving Licence', 'FIR Records', 'Police Verification']
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
    description: 'Municipal Corporation for birth/death certificates, property tax, trade license, and local civic services.',
    roles: ['Municipal Admin', 'Civic Inspector', 'Verifier', 'Auditor'],
    capabilities: [
      'Residence Verification',
      'Municipal Certificate Verification',
      'Civic Credential Verification'
    ],
    allowedCategories: ['Identity', 'Civic', 'Property'],
    allowedDocTypes: ['Birth Certificate', 'Property Tax Record', 'Trade Licence', 'Residence Proof']
  },

  // -------------------------------------------------------------
  // 2. EDUCATION SECTOR
  // -------------------------------------------------------------
  'university': {
    id: 'university',
    slug: 'university',
    sector: 'education',
    sectorTitle: 'Education',
    name: 'University',
    roleCode: 'UNIVERSITY_ADMIN',
    logoEmoji: '🎓',
    categoryName: 'Higher Education',
    integrationStatus: 'Prototype / Simulated',
    description: 'University registrar portal for degree verification, semester marksheets, and academic credential issuance.',
    roles: ['University Admin', 'Registrar', 'Academic Officer', 'Verifier', 'Auditor'],
    capabilities: [
      'Student Verification',
      'Degree Verification',
      'Marksheet Verification',
      'Academic Credential Verification',
      'Certificate Issuance',
      'Certificate Revocation'
    ],
    allowedCategories: ['Education', 'Identity'],
    allowedDocTypes: ['Degree Certificate', 'Semester Marksheet', 'Transfer Certificate', 'Enrollment ID']
  },
  'college': {
    id: 'college',
    slug: 'college',
    sector: 'education',
    sectorTitle: 'Education',
    name: 'College',
    roleCode: 'COLLEGE_ADMIN',
    logoEmoji: '🏛️',
    categoryName: 'Higher Education',
    integrationStatus: 'Prototype / Simulated',
    description: 'Higher education college portal for student verification, diploma certificates, and course completion.',
    roles: ['College Admin', 'Dean of Academics', 'Verification Officer', 'Auditor'],
    capabilities: [
      'Student Verification',
      'Academic Verification',
      'Certificate Verification',
      'Certificate Issuance'
    ],
    allowedCategories: ['Education', 'Identity'],
    allowedDocTypes: ['College ID Card', 'Diploma Certificate', 'Bonafide Certificate', 'Marksheet']
  },
  'school': {
    id: 'school',
    slug: 'school',
    sector: 'education',
    sectorTitle: 'Education',
    name: 'School',
    roleCode: 'SCHOOL_ADMIN',
    logoEmoji: '🏫',
    categoryName: 'School Education',
    integrationStatus: 'Prototype / Simulated',
    description: 'K-12 school portal for student identity, transfer certificates, and grade progress records.',
    roles: ['School Admin', 'Principal', 'Teacher Verification Officer', 'Auditor'],
    capabilities: [
      'Student Verification',
      'Student Credential Verification',
      'Certificate Verification'
    ],
    allowedCategories: ['Education', 'Identity'],
    allowedDocTypes: ['School ID Card', 'Transfer Certificate', 'Grade Report', 'Birth Certificate']
  },
  'education_board': {
    id: 'education_board',
    slug: 'education-board',
    sector: 'education',
    sectorTitle: 'Education',
    name: 'Education Board',
    roleCode: 'EDU_BOARD_ADMIN',
    logoEmoji: '📋',
    categoryName: 'State / Central Secondary Board',
    integrationStatus: 'Prototype / Simulated',
    description: 'CBSE/ICSE/State Board portal for 10th & 12th board marksheet authentication and passing certificate issuance.',
    roles: ['Board Admin', 'Controller of Examinations', 'Verification Officer', 'Auditor'],
    capabilities: [
      'Marksheet Verification',
      'Certificate Verification',
      'Student Verification',
      'Academic Credential Verification'
    ],
    allowedCategories: ['Education', 'Identity'],
    allowedDocTypes: ['10th Marksheet', '12th Marksheet', 'Passing Certificate', 'Migration Certificate']
  },
  'skill_institution': {
    id: 'skill_institution',
    slug: 'skill-institution',
    sector: 'education',
    sectorTitle: 'Education',
    name: 'Skill / Training Institution',
    roleCode: 'SKILL_INST_ADMIN',
    logoEmoji: '🛠️',
    categoryName: 'Vocational Training',
    integrationStatus: 'Prototype / Simulated',
    description: 'NSDC/Skill India training provider for vocational certificates, trade qualifications, and apprenticeship records.',
    roles: ['Institute Admin', 'Skill Assessor', 'Certification Officer', 'Auditor'],
    capabilities: [
      'Skill Certificate Verification',
      'Training Verification',
      'Qualification Verification',
      'Certificate Issuance'
    ],
    allowedCategories: ['Education', 'Skill'],
    allowedDocTypes: ['NSDC Certificate', 'Vocational Skill Badge', 'Apprenticeship Record']
  },

  // -------------------------------------------------------------
  // 3. HEALTHCARE SECTOR
  // -------------------------------------------------------------
  'hospital': {
    id: 'hospital',
    slug: 'hospital',
    sector: 'healthcare',
    sectorTitle: 'Healthcare',
    name: 'Hospital',
    roleCode: 'HOSPITAL_ADMIN',
    logoEmoji: '🏥',
    categoryName: 'Medical Services',
    integrationStatus: 'Prototype / Simulated',
    description: 'Hospital patient onboarding, consent-driven medical records access, and vaccination record verification.',
    roles: ['Hospital Admin', 'Medical Records Officer', 'Consent Coordinator', 'Auditor'],
    capabilities: [
      'Patient Identity Verification',
      'Consent Requests',
      'Authorized Data Access',
      'Healthcare Credential Verification',
      'Verification History'
    ],
    allowedCategories: ['Healthcare', 'Identity'],
    allowedDocTypes: ['ABHA Health Card', 'Vaccination Record', 'Medical Report', 'Discharge Summary']
  },
  'medical_institution': {
    id: 'medical_institution',
    slug: 'medical-institution',
    sector: 'healthcare',
    sectorTitle: 'Healthcare',
    name: 'Medical Institution',
    roleCode: 'MEDICAL_INST_ADMIN',
    logoEmoji: '🔬',
    categoryName: 'Research & Labs',
    integrationStatus: 'Prototype / Simulated',
    description: 'Diagnostic labs & medical research centers for consent-driven test results and clinical credentials.',
    roles: ['Lab Admin', 'Pathologist', 'Verification Officer', 'Auditor'],
    capabilities: [
      'Patient Identity Verification',
      'Medical Credential Verification',
      'Authorized Data Access',
      'Verification History'
    ],
    allowedCategories: ['Healthcare', 'Identity'],
    allowedDocTypes: ['Lab Report', 'Diagnostic Image Record', 'Patient Consent Token']
  },
  'health_authority': {
    id: 'health_authority',
    slug: 'health-authority',
    sector: 'healthcare',
    sectorTitle: 'Healthcare',
    name: 'Health Authority',
    roleCode: 'HEALTH_AUTH_ADMIN',
    logoEmoji: '🩺',
    categoryName: 'Public Health Scheme',
    integrationStatus: 'Prototype / Simulated',
    description: 'National Health Authority (Ayushman Bharat / ABHA) for health scheme eligibility and health card issuance.',
    roles: ['Health Admin', 'Scheme Officer', 'Verification Verifier', 'Auditor'],
    capabilities: [
      'Health Credential Verification',
      'Health Scheme Eligibility',
      'Authorized Citizen Verification',
      'Health Service Verification'
    ],
    allowedCategories: ['Healthcare', 'Identity'],
    allowedDocTypes: ['Ayushman Bharat Card', 'ABHA ID Record', 'Disability Certificate']
  },

  // -------------------------------------------------------------
  // 4. BANKING & FINANCE SECTOR
  // -------------------------------------------------------------
  'government_bank': {
    id: 'government_bank',
    slug: 'government-bank',
    sector: 'banking_finance',
    sectorTitle: 'Banking & Finance',
    name: 'Government Bank',
    roleCode: 'GOVT_BANK_ADMIN',
    logoEmoji: '🏦',
    categoryName: 'Public Sector Bank',
    integrationStatus: 'Prototype / Simulated',
    description: 'State Bank & Public Sector Banks for eKYC, digital account opening, loan processing, and credit verification.',
    roles: ['Bank Admin', 'KYC Manager', 'Loan Officer', 'Auditor'],
    capabilities: [
      'KYC Verification',
      'Identity Verification',
      'Address Verification',
      'Credential Verification',
      'Consent-Based Data Access',
      'Verification History'
    ],
    allowedCategories: ['Finance', 'Identity', 'Income'],
    allowedDocTypes: ['PAN Card', 'Aadhaar Identity', 'ITR Return', 'Bank Statement', 'Salary Slip']
  },
  'private_bank': {
    id: 'private_bank',
    slug: 'private-bank',
    sector: 'banking_finance',
    sectorTitle: 'Banking & Finance',
    name: 'Private Bank',
    roleCode: 'PRIVATE_BANK_ADMIN',
    logoEmoji: '🏛️',
    categoryName: 'Commercial Private Bank',
    integrationStatus: 'Prototype / Simulated',
    description: 'Private commercial banks for instant eKYC verification, credit card evaluation, and wealth management.',
    roles: ['Bank Admin', 'KYC Officer', 'Credit Analyst', 'Auditor'],
    capabilities: [
      'KYC Verification',
      'Identity Verification',
      'Address Verification',
      'Credential Verification',
      'Consent-Based Data Access',
      'Verification History'
    ],
    allowedCategories: ['Finance', 'Identity'],
    allowedDocTypes: ['PAN Card', 'Aadhaar Identity', 'Form 16', 'Credit Score Certificate']
  },
  'nbfc': {
    id: 'nbfc',
    slug: 'nbfc',
    sector: 'banking_finance',
    sectorTitle: 'Banking & Finance',
    name: 'NBFC',
    roleCode: 'NBFC_ADMIN',
    logoEmoji: '💳',
    categoryName: 'Non-Banking Financial Company',
    integrationStatus: 'Prototype / Simulated',
    description: 'Non-Banking Finance Companies for micro-loans, vehicle finance, and instant digital credit underwriting.',
    roles: ['NBFC Admin', 'Underwriter', 'Verification Officer', 'Auditor'],
    capabilities: [
      'Identity Verification',
      'KYC Verification',
      'Credential Verification',
      'Consent-Based Data Access'
    ],
    allowedCategories: ['Finance', 'Identity'],
    allowedDocTypes: ['PAN Card', 'Income Certificate', 'Aadhaar Identity']
  },
  'govt_financial_inst': {
    id: 'govt_financial_inst',
    slug: 'government-financial-institution',
    sector: 'banking_finance',
    sectorTitle: 'Banking & Finance',
    name: 'Government Financial Institution',
    roleCode: 'GOVT_FIN_INST_ADMIN',
    logoEmoji: '🏢',
    categoryName: 'Public Financial Institution',
    integrationStatus: 'Prototype / Simulated',
    description: 'NABARD, SIDBI, EXIM Bank & public financial institutions for government scheme disbursement & enterprise credit.',
    roles: ['Inst Admin', 'Disbursement Officer', 'Auditor'],
    capabilities: [
      'Identity Verification',
      'Eligibility Verification',
      'Credential Verification',
      'Consent-Based Data Access'
    ],
    allowedCategories: ['Finance', 'Identity', 'Agriculture/MSME'],
    allowedDocTypes: ['MSME Certificate', 'Farmer Land Deed', 'PAN Card', 'Aadhaar Identity']
  },
  'private_financial_inst': {
    id: 'private_financial_inst',
    slug: 'private-financial-institution',
    sector: 'banking_finance',
    sectorTitle: 'Banking & Finance',
    name: 'Private Financial Institution',
    roleCode: 'PRIVATE_FIN_INST_ADMIN',
    logoEmoji: '📈',
    categoryName: 'Private Financial Services',
    integrationStatus: 'Prototype / Simulated',
    description: 'Asset management companies, mutual funds, and private financial advisory firms.',
    roles: ['Inst Admin', 'Compliance Officer', 'Auditor'],
    capabilities: [
      'Identity Verification',
      'Eligibility Verification',
      'Credential Verification',
      'Consent-Based Data Access'
    ],
    allowedCategories: ['Finance', 'Identity'],
    allowedDocTypes: ['PAN Card', 'Demat Account Record', 'KYC Certificate']
  },
  'govt_insurance': {
    id: 'govt_insurance',
    slug: 'government-insurance',
    sector: 'banking_finance',
    sectorTitle: 'Banking & Finance',
    name: 'Government Insurance',
    roleCode: 'GOVT_INS_ADMIN',
    logoEmoji: '🛡️',
    categoryName: 'Public Sector Insurance',
    integrationStatus: 'Prototype / Simulated',
    description: 'LIC & public insurance corporations for policy issuance, claim settlement, and identity verification.',
    roles: ['Insurance Admin', 'Claims Inspector', 'Verifier', 'Auditor'],
    capabilities: [
      'Identity Verification',
      'Policy Verification',
      'Eligibility Verification',
      'Credential Verification'
    ],
    allowedCategories: ['Finance', 'Identity', 'Insurance'],
    allowedDocTypes: ['Aadhaar Identity', 'Medical Certificate', 'Policy Record']
  },
  'private_insurance': {
    id: 'private_insurance',
    slug: 'private-insurance',
    sector: 'banking_finance',
    sectorTitle: 'Banking & Finance',
    name: 'Private Insurance',
    roleCode: 'PRIVATE_INS_ADMIN',
    logoEmoji: '☂️',
    categoryName: 'Private Life & General Insurance',
    integrationStatus: 'Prototype / Simulated',
    description: 'Private life, health & motor insurance companies for digital policy underwriting and instant claim checks.',
    roles: ['Insurance Admin', 'Underwriter', 'Claim Assessor', 'Auditor'],
    capabilities: [
      'Identity Verification',
      'Policy Verification',
      'Eligibility Verification',
      'Credential Verification'
    ],
    allowedCategories: ['Finance', 'Identity', 'Insurance'],
    allowedDocTypes: ['Driving Licence', 'Vehicle RC', 'Aadhaar Identity', 'Medical Report']
  },
  'investment_inst': {
    id: 'investment_inst',
    slug: 'investment-institution',
    sector: 'banking_finance',
    sectorTitle: 'Banking & Finance',
    name: 'Investment Institution',
    roleCode: 'INVEST_INST_ADMIN',
    logoEmoji: '📊',
    categoryName: 'Stockbroking & Investments',
    integrationStatus: 'Prototype / Simulated',
    description: 'Stock exchanges, depositories (NSDL/CDSL), and broking firms for investor CKYC and demat verification.',
    roles: ['Investment Admin', 'Compliance Officer', 'Auditor'],
    capabilities: [
      'Identity Verification',
      'Investor Verification',
      'Credential Verification',
      'Consent-Based Data Access'
    ],
    allowedCategories: ['Finance', 'Identity'],
    allowedDocTypes: ['PAN Card', 'Bank Account Proof', 'Aadhaar Identity']
  },
  'fintech': {
    id: 'fintech',
    slug: 'fintech',
    sector: 'banking_finance',
    sectorTitle: 'Banking & Finance',
    name: 'FinTech Company',
    roleCode: 'FINTECH_ADMIN',
    logoEmoji: '📱',
    categoryName: 'Digital Payments & Neo-Banking',
    integrationStatus: 'Prototype / Simulated',
    description: 'Payment gateways, UPI apps, neo-banks, and digital lending platforms for instant zero-paper onboarding.',
    roles: ['FinTech Admin', 'Risk Officer', 'Verifier', 'Auditor'],
    capabilities: [
      'KYC Verification',
      'Identity Verification',
      'Credential Verification',
      'Consent-Based Data Access'
    ],
    allowedCategories: ['Finance', 'Identity'],
    allowedDocTypes: ['Identity Status', 'PAN Status', 'Address Verification']
  },

  // -------------------------------------------------------------
  // 5. PRIVATE SECTOR
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
  'hr_recruitment': {
    id: 'hr_recruitment',
    slug: 'hr-recruitment',
    sector: 'private_sector',
    sectorTitle: 'Private Sector',
    name: 'HR / Recruitment',
    roleCode: 'HR_ADMIN',
    logoEmoji: '👥',
    categoryName: 'Human Resources',
    integrationStatus: 'Prototype / Simulated',
    description: 'HR agencies & recruitment firms for candidate profile validation, degree checks, and experience proofs.',
    roles: ['HR Admin', 'Recruiter', 'Background Executive', 'Auditor'],
    capabilities: [
      'Identity Verification',
      'Background Check',
      'Qualification Verification'
    ],
    allowedCategories: ['Identity', 'Education'],
    allowedDocTypes: ['Degree Certificate', 'Marksheet', 'Aadhaar Identity']
  },
  'background_verification': {
    id: 'background_verification',
    slug: 'background-verification',
    sector: 'private_sector',
    sectorTitle: 'Private Sector',
    name: 'Background Verification Agency',
    roleCode: 'BGV_ADMIN',
    logoEmoji: '🔍',
    categoryName: 'Verification Agency',
    integrationStatus: 'Prototype / Simulated',
    description: 'Third-party background verification (BGV) agencies executing consent-bound address & credential checks.',
    roles: ['BGV Admin', 'Screening Officer', 'Field Auditor'],
    capabilities: [
      'Identity Verification',
      'Address Verification',
      'Credential Verification',
      'Audit History'
    ],
    allowedCategories: ['Identity', 'Education', 'Property'],
    allowedDocTypes: ['Address Proof', 'Degree Record', 'Identity Status']
  },
  'tech_company': {
    id: 'tech_company',
    slug: 'tech-company',
    sector: 'private_sector',
    sectorTitle: 'Private Sector',
    name: 'Technology Company',
    roleCode: 'TECH_CO_ADMIN',
    logoEmoji: '💻',
    categoryName: 'IT & Software Firm',
    integrationStatus: 'Prototype / Simulated',
    description: 'IT & SaaS firms for remote developer identity verification, security clearance, and access tokens.',
    roles: ['Tech Admin', 'Security Officer', 'Auditor'],
    capabilities: [
      'Identity Verification',
      'Developer Credentials',
      'Consent-Based Access'
    ],
    allowedCategories: ['Identity', 'Education'],
    allowedDocTypes: ['Aadhaar Identity', 'Technical Certifications']
  },
  'corporate_org': {
    id: 'corporate_org',
    slug: 'corporate-org',
    sector: 'private_sector',
    sectorTitle: 'Private Sector',
    name: 'Corporate Organization',
    roleCode: 'CORP_ADMIN',
    logoEmoji: '🏬',
    categoryName: 'Multinational Corporate',
    integrationStatus: 'Prototype / Simulated',
    description: 'Multinational corporations for corporate governance, contractor verification, and executive onboarding.',
    roles: ['Corp Admin', 'Governance Officer', 'Auditor'],
    capabilities: [
      'Corporate Verification',
      'Employee Credential Verification',
      'Identity Verification'
    ],
    allowedCategories: ['Identity', 'Education'],
    allowedDocTypes: ['Aadhaar Identity', 'Degree Certificate', 'Employment Record']
  }
};

export const getOrganizationsBySector = (sectorId) => {
  return Object.values(ORGANIZATION_CONFIGS).filter(org => org.sector === sectorId);
};

export const getOrgConfigById = (orgId) => {
  return ORGANIZATION_CONFIGS[orgId] || Object.values(ORGANIZATION_CONFIGS).find(o => o.slug === orgId) || ORGANIZATION_CONFIGS['police'];
};
