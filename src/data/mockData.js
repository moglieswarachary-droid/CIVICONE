// src/data/mockData.js — CivicOne Local Synthetic Demo Dataset (Fictional / No Real Personal Data)
// All records are clearly marked DEMO DATA — NOT A REAL CITIZEN / DEMO ORGANIZATION.

export const INDIA_STATES_AND_UTS = [
  // 28 States
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // 8 Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export const PRIVATE_ORG_TYPES = [
  {
    id: "bank",
    name: "Banks & Financial Institutions",
    roleCode: "BANKING_ACCESS_ADMIN",
    description: "KYC verification for account opening and loan processing.",
    icon: "Landmark",
    color: "#0284C7",
    allowed: ["Identity Verification", "KYC Details", "Address Verification", "PAN Document"],
    disallowed: ["Healthcare", "Education", "Vehicle", "SIM History", "Travel"]
  },
  {
    id: "insurance",
    name: "Insurance Companies",
    roleCode: "INSURANCE_ACCESS_ADMIN",
    description: "Verification for policy issuance and claim processing.",
    icon: "ShieldCheck",
    color: "#0D9488",
    allowed: ["Identity Verification", "Healthcare Summary", "Vehicle Insurance Status"],
    disallowed: ["Education", "Banking", "SIM History", "Travel"]
  },
  {
    id: "college",
    name: "Colleges & Universities",
    roleCode: "COLLEGE_ACCESS_ADMIN",
    description: "Student identity and education verification.",
    icon: "GraduationCap",
    color: "#6366F1",
    allowed: ["Student Identity", "Academic Certificates", "Marksheets", "Degree", "Transfer Certificate"],
    disallowed: ["Banking", "Loans", "Healthcare", "RTO", "SIM History", "Travel"]
  },
  {
    id: "school",
    name: "Schools & Academies",
    roleCode: "SCHOOL_ACCESS_ADMIN",
    description: "Student and admission verification.",
    icon: "BookOpen",
    color: "#059669",
    allowed: ["Student Identity", "Birth Certificate", "Previous Education Records", "TC", "Admission Info"],
    disallowed: ["Banking", "Loans", "Healthcare", "Vehicle", "SIM History", "Travel"]
  },
  {
    id: "hotel",
    name: "Hotel & Hospitality",
    roleCode: "HOTEL_ACCESS_ADMIN",
    description: "Guest identity and booking verification.",
    icon: "Building2",
    color: "#D97706",
    allowed: ["Guest Name", "ID Verification Badge", "Approved Identity Doc", "Check-in Info"],
    disallowed: ["Banking", "Loans", "Education", "Vehicle", "SIM History", "Full Profile"]
  },
  {
    id: "electronics",
    name: "Electronics & Gadget Stores",
    roleCode: "ELECTRONICS_ACCESS_ADMIN",
    description: "Minimum KYC verification for device/electronics transactions.",
    icon: "Smartphone",
    color: "#2563EB",
    allowed: ["Identity Status", "Address / KYC Verification", "Verification Status", "Transaction Reference"],
    disallowed: ["Full Profile", "Education", "Healthcare", "Banking", "Loans", "Vehicle", "SIM History"]
  },
  {
    id: "mobile",
    name: "Mobile Shops & Retailers",
    roleCode: "MOBILE_SHOP_ACCESS_ADMIN",
    description: "Minimum KYC verification for SIM and mobile purchases.",
    icon: "Tablet",
    color: "#7C3AED",
    allowed: ["Identity: VERIFIED", "Address: VERIFIED", "KYC: VERIFIED", "Transaction: AUTHORIZED"],
    disallowed: ["Full Vault Browsing", "Education", "Healthcare", "Banking", "Vehicle", "Travel"]
  },
  {
    id: "healthcare",
    name: "Healthcare & Hospitals",
    roleCode: "HEALTHCARE_ACCESS_ADMIN",
    description: "Authorized healthcare identity and medical data access.",
    icon: "HeartPulse",
    color: "#16A34A",
    allowed: ["Patient Identity", "ABHA Health Account", "Medical Diagnostic Summary"],
    disallowed: ["Banking", "Education", "Vehicle", "SIM", "Travel"]
  },
  {
    id: "other",
    name: "Other Organizations",
    roleCode: "OTHER_ACCESS_ADMIN",
    description: "Purpose-based verification services for employers, insurance & agencies.",
    icon: "Briefcase",
    color: "#4B5563",
    allowed: ["Configurable Purpose-Based Authorization Scope"],
    disallowed: ["Unpermissioned Personal Data"]
  }
];

export const DEMO_CITIZEN = {
  name: "Aarav Kumar",
  fullName: "Aarav Kumar",
  citizenId: "CIV-DEMO-10001",
  phone: "+91 9876543210",
  maskedAadhaar: "XXXX XXXX 1001",
  identityStatus: "Verified Demo",
  email: "aarav.kumar.demo@example.in",
  dob: "15-07-2004",
  gender: "Male",
  address: "42, MG Road, Bandra West, Mumbai, MH 400050",
  state: "Maharashtra",
  photo: null,
  tier: "STANDARD",
  goldPassStatus: "standard",
  demoLabel: "DEMO DATA — NOT A REAL CITIZEN"
};

export const DEMO_CARD = {
  cardNumber: "CIV 1000 1057 3310",
  holderName: "AARAV KUMAR",
  civicId: "CIV-DEMO-10001",
  maskedAadhaar: "XXXX XXXX 1001",
  tier: "STANDARD",
  goldPassStatus: "standard",
  status: "ACTIVE",
  issuedDate: "15-01-2024",
  expiryDate: "14-01-2029",
  qrToken: "CIV-TOKEN-CIV-DEMO-10001-SECURE-2026",
  shareLink: "http://localhost:3001/verify?token=CIV-TOKEN-CIV-DEMO-10001-SECURE-2026",
};

// Document Expiry Calculation Engine Utility Function (Requirement 18 & 19)
export function calculateDocExpiryStatus(doc) {
  if (!doc) return { status: 'NO EXPIRY', daysRemaining: Infinity };
  
  if (doc.status === 'Pending Verification' || doc.status === 'PENDING') {
    return { status: 'PENDING VERIFICATION', daysRemaining: Infinity };
  }

  const expStr = doc.expiryDate || doc.expiresDate;
  if (!expStr || expStr === 'N/A' || expStr === 'Lifetime' || expStr === 'Permanent' || expStr === 'No Expiry') {
    return { status: 'NO EXPIRY', daysRemaining: Infinity };
  }

  let expDate = null;
  if (expStr.includes('-')) {
    const parts = expStr.split('-');
    if (parts[0].length === 4) {
      expDate = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
    } else if (parts[2].length === 4) {
      expDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
  } else {
    expDate = new Date(expStr);
  }

  if (!expDate || isNaN(expDate.getTime())) {
    return { status: 'ACTIVE', daysRemaining: 365 };
  }

  const today = new Date('2026-08-14'); // System reference date
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: 'EXPIRED', daysRemaining: diffDays };
  } else if (diffDays <= 30) {
    return { status: 'EXPIRING SOON', daysRemaining: diffDays };
  } else {
    return { status: 'ACTIVE', daysRemaining: diffDays };
  }
}

export const DEMO_FAMILY_MEMBERS = [
  {
    id: 'fam-self',
    name: 'Raghavendra (Self)',
    role: 'Primary Citizen (Self)',
    relationship: 'Self',
    age: 29,
    gender: 'Male',
    initials: 'RS',
    themeColor: '#1A4F9C',
    civicId: 'CIV-AP-710646-823',
    guardianStatus: 'Self Sovereign',
    docCount: 12
  },
  {
    id: 'fam-child-1',
    name: 'Aarav Sharma',
    role: 'Minor Son (Age 8)',
    relationship: 'Son (Minor)',
    age: 8,
    gender: 'Male',
    initials: 'AS',
    themeColor: '#0284C7',
    civicId: 'CIV-AP-990214-411',
    guardianStatus: 'Father (Primary Legal Guardian)',
    docCount: 4,
    documents: [
      {
        id: 'fam-doc-01',
        name: 'Official Birth Certificate (Form 5)',
        category: 'government',
        type: 'certificate',
        issuer: 'Greater Visakhapatnam Municipal Corporation (GVMC)',
        refNo: 'B-2018-AP-09824',
        status: 'Verified',
        issueDate: '12-04-2018',
        expiryDate: 'Lifetime',
        description: 'Certified registration of birth under Registration of Births and Deaths Act.',
        isDemo: true
      },
      {
        id: 'fam-doc-02',
        name: 'Universal Immunization Programme Card (UIP)',
        category: 'government',
        type: 'certificate',
        issuer: 'Ministry of Health & Family Welfare (MoHFW)',
        refNo: 'IMM-UIP-2018-842',
        status: 'Verified',
        issueDate: '14-04-2018',
        expiryDate: 'Active (Child Complete)',
        description: 'National childhood vaccine and immunization record (BCG, OPV, Pentavalent, MMR).',
        isDemo: true
      },
      {
        id: 'fam-doc-03',
        name: 'School Admission & Bonafide Certificate',
        category: 'academic',
        type: 'certificate',
        issuer: 'Delhi Public School (CBSE Affiliated)',
        refNo: 'DPS-ADM-2024-GR3',
        status: 'Verified',
        issueDate: '05-06-2024',
        expiryDate: '31-03-2025',
        description: 'Current Grade 3 Bonafide student certification and academic identity token.',
        isDemo: true
      },
      {
        id: 'fam-doc-04',
        name: 'Aadhaar Minor Identity Enrolment (Baal Aadhaar)',
        category: 'government',
        type: 'document',
        issuer: 'UIDAI — Unique Identification Authority of India',
        refNo: 'XXXX XXXX 4110 (Blue Aadhaar)',
        status: 'Verified',
        issueDate: '20-05-2018',
        expiryDate: 'Biometric update at Age 15',
        description: 'Child Aadhaar linked to primary parent biometric and mobile identity.',
        isDemo: true
      }
    ]
  },
  {
    id: 'fam-child-2',
    name: 'Ananya Sharma',
    role: 'Minor Daughter (Age 14)',
    relationship: 'Daughter (Minor)',
    age: 14,
    gender: 'Female',
    initials: 'AS',
    themeColor: '#7C3AED',
    civicId: 'CIV-AP-774102-198',
    guardianStatus: 'Father (Primary Legal Guardian)',
    docCount: 3,
    documents: [
      {
        id: 'fam-doc-05',
        name: 'Official Birth Certificate (Form 5)',
        category: 'government',
        type: 'certificate',
        issuer: 'Municipal Administration Department, AP',
        refNo: 'B-2012-AP-54129',
        status: 'Verified',
        issueDate: '18-09-2012',
        expiryDate: 'Lifetime',
        description: 'Municipal registered birth certificate record.',
        isDemo: true
      },
      {
        id: 'fam-doc-06',
        name: 'Class IX Secondary School Bonafide & ID',
        category: 'academic',
        type: 'document',
        issuer: 'Kendriya Vidyalaya (CBSE)',
        refNo: 'KV-2025-IX-089',
        status: 'Verified',
        issueDate: '10-06-2025',
        expiryDate: '31-03-2026',
        description: 'Secondary school verified enrolment record.',
        isDemo: true
      },
      {
        id: 'fam-doc-07',
        name: 'National Junior Athletics Championship Certificate',
        category: 'academic',
        type: 'certificate',
        issuer: 'Sports Authority of India (SAI)',
        refNo: 'SAI-ATH-2025-GOLD',
        status: 'Verified',
        issueDate: '15-02-2025',
        expiryDate: 'Lifetime',
        description: 'State Level 100m Sprint Gold Medal verified digital merit credential.',
        isDemo: true
      }
    ]
  },
  {
    id: 'fam-parent-1',
    name: 'Suryanarayana Sharma',
    role: 'Senior Citizen Father (Age 72)',
    relationship: 'Father (Senior Citizen)',
    age: 72,
    gender: 'Male',
    initials: 'SS',
    themeColor: '#D97706',
    civicId: 'CIV-AP-102948-002',
    guardianStatus: 'Adult Caretaker & Nominee',
    docCount: 4,
    documents: [
      {
        id: 'fam-doc-08',
        name: 'National Senior Citizen Identity Card',
        category: 'government',
        type: 'document',
        issuer: 'Ministry of Social Justice & Empowerment',
        refNo: 'SR-AP-2019-7721',
        status: 'Verified',
        issueDate: '10-01-2019',
        expiryDate: 'Lifetime',
        description: 'Official National Senior Citizen Card for healthcare, rail travel, and utility priority.',
        isDemo: true
      },
      {
        id: 'fam-doc-09',
        name: 'Central Pension Payment Order (PPO Passbook)',
        category: 'government',
        type: 'document',
        issuer: 'Central Pension Accounting Office (CPAO)',
        refNo: 'PPO-CPAO-2018-9941',
        status: 'Verified',
        issueDate: '31-05-2018',
        expiryDate: 'Active',
        description: 'Superannuation pension disbursement entitlement passbook.',
        isDemo: true
      },
      {
        id: 'fam-doc-10',
        name: 'Ayushman Bharat PM-JAY Senior Health Card',
        category: 'government',
        type: 'certificate',
        issuer: 'National Health Authority (NHA)',
        refNo: 'PMJAY-SR-7104-982',
        status: 'Verified',
        issueDate: '15-08-2023',
        expiryDate: 'Lifetime',
        description: '₹5 Lakh annual health coverage for senior citizen hospitalization.',
        isDemo: true
      },
      {
        id: 'fam-doc-11',
        name: 'Digital Life Certificate (Jeevan Pramaan)',
        category: 'government',
        type: 'certificate',
        issuer: 'Jeevan Pramaan / UIDAI Biometric Auth',
        refNo: 'JP-2025-NOV-8812',
        status: 'Verified',
        issueDate: '10-11-2025',
        expiryDate: '30-11-2026',
        description: 'Biometric face-authenticated digital life certificate for pension continuity.',
        isDemo: true
      }
    ]
  }
];

export const DEMO_DOCUMENTS = [
  // 1. Academic Documents & Certificates
  {
    id: "doc-006",
    name: "B.Tech Degree Certificate",
    category: "academic",
    type: "certificate",
    issuer: "CivicOne Demo College",
    refNo: "DEMO-DEG-10001",
    status: "Verified",
    issueDate: "20-01-2024",
    addedDate: "20-01-2024",
    expiryDate: "N/A",
    lastVerified: "14 Aug 2026",
    isPrivate: false,
    description: "Bachelor of Technology (Computer Science) Degree Certificate.",
    isDemo: true,
  },
  {
    id: "doc-010",
    name: "Class X Marksheet",
    category: "academic",
    type: "document",
    issuer: "CivicOne Model School (CBSE)",
    refNo: "DEMO-10TH-10001",
    status: "Verified",
    issueDate: "10-06-2020",
    addedDate: "28-01-2024",
    expiryDate: "N/A",
    lastVerified: "14 Aug 2026",
    isPrivate: false,
    description: "10th Grade Marksheet – CivicOne Model School.",
    isDemo: true,
  },
  {
    id: "doc-012",
    name: "Intermediate Class XII Certificate",
    category: "academic",
    type: "certificate",
    issuer: "CivicOne Model School",
    refNo: "DEMO-12TH-10001",
    status: "Verified",
    issueDate: "05-06-2022",
    addedDate: "05-02-2024",
    expiryDate: "N/A",
    lastVerified: "14 Aug 2026",
    isPrivate: false,
    description: "12th Grade Senior Secondary Science Pass Certificate.",
    isDemo: true,
  },
  {
    id: "doc-011",
    name: "School Transfer Certificate (TC)",
    category: "academic",
    type: "document",
    issuer: "CivicOne Model School",
    refNo: "DEMO-TC-10001",
    status: "Verified",
    issueDate: "15-06-2023",
    addedDate: "02-02-2024",
    expiryDate: "N/A",
    lastVerified: "14 Aug 2026",
    isPrivate: false,
    description: "School Transfer Certificate.",
    isDemo: true,
  },
  {
    id: "doc-013",
    name: "AI Engineering Internship Certificate",
    category: "academic",
    type: "certificate",
    issuer: "National Skill Portal / Tech Academy",
    refNo: "DEMO-INT-2025-CS09",
    status: "Verified",
    issueDate: "10-01-2025",
    addedDate: "15-01-2025",
    expiryDate: "N/A",
    lastVerified: "14 Aug 2026",
    isPrivate: false,
    description: "Verified Internship Certificate in Web Engineering.",
    isDemo: true,
  },

  // 2. Government Authorized Documents & Certificates
  {
    id: "doc-001",
    name: "Tokenized Aadhaar Record",
    category: "government",
    type: "document",
    issuer: "UIDAI – Unique Identification Authority of India",
    refNo: "XXXX XXXX 1001",
    status: "Verified",
    issueDate: "15-07-2020",
    addedDate: "10-01-2024",
    expiryDate: "N/A",
    lastVerified: "14 Aug 2026",
    isPrivate: true,
    description: "Synthetic Aadhaar identity reference.",
    isDemo: true,
  },
  {
    id: "doc-002",
    name: "Permanent Account Number (PAN)",
    category: "government",
    type: "document",
    issuer: "Income Tax Department – GoI",
    refNo: "DEMOP10001F",
    status: "Verified",
    issueDate: "10-08-2022",
    addedDate: "10-01-2024",
    expiryDate: "N/A",
    lastVerified: "14 Aug 2026",
    isPrivate: false,
    description: "Synthetic Permanent Account Number reference.",
    isDemo: true,
  },
  {
    id: "doc-004",
    name: "Voter ID Card (EPIC)",
    category: "government",
    type: "document",
    issuer: "Election Commission of India",
    refNo: "DEMO-VOTER-10001",
    status: "Verified",
    issueDate: "15-01-2024",
    addedDate: "15-01-2024",
    expiryDate: "N/A",
    lastVerified: "14 Aug 2026",
    isPrivate: false,
    description: "Synthetic EPIC voter identity card.",
    isDemo: true,
  },
  {
    id: "doc-007",
    name: "Indian Passport",
    category: "government",
    type: "document",
    issuer: "Ministry of External Affairs – GoI",
    refNo: "DEMO-PASS-10001",
    status: "Verified",
    issueDate: "22-01-2024",
    addedDate: "22-01-2024",
    expiryDate: "30-06-2033",
    lastVerified: "12 Aug 2026",
    isPrivate: true,
    description: "Synthetic Indian passport record.",
    isDemo: true,
  },
  {
    id: "doc-009",
    name: "State Income Certificate",
    category: "government",
    type: "certificate",
    issuer: "Revenue Department, Govt of AP",
    refNo: "DEMO-INC-2025-10001",
    status: "Verified",
    issueDate: "12-04-2025",
    addedDate: "12-04-2025",
    expiryDate: "01-06-2026", // Expired
    lastVerified: "01 Jun 2026",
    isPrivate: false,
    description: "State Revenue Income Certificate (Expired Record).",
    isDemo: true,
  },
  {
    id: "doc-014",
    name: "Domicile & Residence Certificate",
    category: "government",
    type: "certificate",
    issuer: "Revenue Department, Govt of AP",
    refNo: "DEMO-DOM-2024-9002",
    status: "Verified",
    issueDate: "18-05-2024",
    addedDate: "18-05-2024",
    expiryDate: "N/A",
    lastVerified: "14 Aug 2026",
    isPrivate: false,
    description: "State Domicile and Residence Pass Certificate.",
    isDemo: true,
  },

  // 3. RTO & Vehicles Documents & Certificates
  {
    id: "doc-003",
    name: "Smart Driving Licence",
    category: "rto",
    type: "document",
    issuer: "Parivahan Sewa – MoRTH",
    refNo: "DEMO-DL-10001",
    status: "Verified",
    issueDate: "12-01-2024",
    addedDate: "12-01-2024",
    expiryDate: "10-09-2026", // Expiring Soon
    lastVerified: "10 Aug 2026",
    isPrivate: false,
    description: "Synthetic Smart Driving Licence valid for LMV and Motorcycle.",
    isDemo: true,
  },
  {
    id: "doc-008",
    name: "Vehicle Registration RC (AP-DEMO-1001)",
    category: "rto",
    type: "document",
    issuer: "Parivahan Sewa – MoRTH",
    refNo: "AP-DEMO-1001",
    status: "Verified",
    issueDate: "25-01-2024",
    addedDate: "25-01-2024",
    expiryDate: "01-09-2026", // Expiring Soon
    lastVerified: "11 Aug 2026",
    isPrivate: false,
    description: "Vehicle RC for Hyundai Creta (White) — Registration: AP-DEMO-1001.",
    isDemo: true,
  },
  {
    id: "doc-015",
    name: "Vehicle Insurance Certificate",
    category: "rto",
    type: "certificate",
    issuer: "National Insurance Co / Parivahan",
    refNo: "DEMO-INS-2025-4401",
    status: "Verified",
    issueDate: "01-09-2025",
    addedDate: "01-09-2025",
    expiryDate: "31-08-2026",
    lastVerified: "14 Aug 2026",
    isPrivate: false,
    description: "Comprehensive Motor Vehicle Insurance Certificate.",
    isDemo: true,
  },
  {
    id: "doc-016",
    name: "Pollution Under Control (PUC) Certificate",
    category: "rto",
    type: "certificate",
    issuer: "Parivahan Emission Control Portal",
    refNo: "DEMO-PUC-2026-8802",
    status: "Verified",
    issueDate: "15-02-2026",
    addedDate: "15-02-2026",
    expiryDate: "14-08-2026",
    lastVerified: "14 Aug 2026",
    isPrivate: false,
    description: "Valid Pollution Control Compliance Certificate.",
    isDemo: true,
  }
];

export const DEMO_GOVT_UPDATES = [
  {
    id: "gov-001",
    title: "Unified Citizen Digital Identity Vault Upgrade — Demo",
    department: "Ministry of Electronics & IT (MeitY)",
    source: "Ministry of Electronics & IT (MeitY)",
    category: "Technology",
    content: "DEMO: Citizens can now seamlessly manage verified digital credentials in their CivicOne Vault. This synthetic update is displayed for testing.",
    summary: "DEMO: Citizens can seamlessly manage verified digital credentials in CivicOne Vault.",
    publishedAt: "2026-08-12T09:00:00Z",
    date: "12 Aug 2026",
    unread: true,
    priority: "High",
    isDemo: true,
  },
  {
    id: "gov-002",
    title: "Vehicle RC & Smart DL Sync — Parivahan Demo Notice",
    department: "Parivahan Sewa — MoRTH",
    source: "Parivahan Sewa — MoRTH",
    category: "RTO",
    content: "DEMO: Online verification and renewal of vehicle registration certificates is active. Synthetic demo notice.",
    summary: "DEMO: Online verification of vehicle RCs available via Parivahan portal.",
    publishedAt: "2026-08-11T11:30:00Z",
    date: "11 Aug 2026",
    unread: true,
    priority: "Medium",
    isDemo: true,
  }
];

export const DEMO_NEWS = [
  {
    id: "news-001",
    title: "India Advances Secure Citizen Digital ID Standards — Demo News",
    headline: "India Advances Secure Citizen Digital ID Standards — Demo News",
    source: "CivicOne News",
    category: "Technology",
    snippet: "DEMO NEWS: India continues to strengthen citizen privacy and digital credential verification.",
    summary: "DEMO NEWS: India continues to strengthen citizen privacy and digital identity.",
    publishedAt: "2026-08-13T07:30:00Z",
    date: "13 Aug 2026",
    readingTime: "3 min",
    isDemo: true,
  }
];

export const DEMO_NOTIFICATIONS = [
  {
    id: "notif-001",
    title: "Smart Driving Licence Expiry Alert",
    message: "Your Smart Driving Licence (DEMO-DL-10001) expires in 27 days on 10-09-2026. Click to renew.",
    type: "WARNING",
    read: false,
    timestamp: "2026-08-14T08:00:00Z",
  },
  {
    id: "notif-002",
    title: "Vehicle Registration Certificate Expiry Alert",
    message: "Your Vehicle Registration Certificate AP-DEMO-1001 expires in 18 days on 01-09-2026.",
    type: "WARNING",
    read: false,
    timestamp: "2026-08-13T12:00:00Z",
  },
  {
    id: "notif-003",
    title: "State Income Certificate Expired",
    message: "Your State Income Certificate (DEMO-INC-2025-10001) expired on 01-06-2026 and requires renewal.",
    type: "ERROR",
    read: false,
    timestamp: "2026-08-12T10:00:00Z",
  }
];

export const DEMO_CITIZENS_LIST = [
  {
    citizenId: "CIV-DEMO-10001",
    fullName: "Aarav Kumar",
    displayName: "Aarav K. (B.Tech CS)",
    docsCount: 12,
    active: true,
    tier: "STANDARD",
    education: "B.Tech Computer Science",
    institution: "CivicOne Demo College",
    school: "CivicOne Model School",
    voterId: "DEMO-VOTER-10001",
    drivingLicence: "DEMO-DL-10001",
    vehicle: "AP-DEMO-1001",
    passport: "DEMO-PASS-10001",
    demoLabel: "DEMO DATA — NOT A REAL CITIZEN"
  },
  {
    citizenId: "CIV-DEMO-10002",
    fullName: "Priya Sharma",
    displayName: "Priya S. (M.B.B.S)",
    docsCount: 11,
    active: false,
    tier: "GOLD",
    education: "M.B.B.S Healthcare Science",
    institution: "CivicOne Demo Medical College",
    school: "CivicOne Public School",
    voterId: "DEMO-VOTER-10002",
    drivingLicence: "DEMO-DL-10002",
    vehicle: "MH-DEMO-1002",
    passport: "DEMO-PASS-10002",
    demoLabel: "DEMO DATA — NOT A REAL CITIZEN"
  },
  {
    citizenId: "CIV-DEMO-10003",
    fullName: "Rajesh Patel",
    displayName: "Rajesh P. (M.B.A)",
    docsCount: 14,
    active: false,
    tier: "STANDARD",
    education: "M.B.A Finance & Management",
    institution: "CivicOne Demo Business School",
    school: "CivicOne Central Academy",
    voterId: "DEMO-VOTER-10003",
    drivingLicence: "DEMO-DL-10003",
    vehicle: "GJ-DEMO-1003",
    passport: "DEMO-PASS-10003",
    demoLabel: "DEMO DATA — NOT A REAL CITIZEN"
  },
  {
    citizenId: "CIV-DEMO-10004",
    fullName: "Ananya Verma",
    displayName: "Ananya V. (B.Arch)",
    docsCount: 10,
    active: false,
    tier: "GOLD",
    education: "B.Arch Architecture",
    institution: "CivicOne School of Planning",
    school: "CivicOne Convent School",
    voterId: "DEMO-VOTER-10004",
    drivingLicence: "DEMO-DL-10004",
    vehicle: "DL-DEMO-1004",
    passport: "DEMO-PASS-10004",
    demoLabel: "DEMO DATA — NOT A REAL CITIZEN"
  },
  {
    citizenId: "CIV-DEMO-10005",
    fullName: "Vikram Singh",
    displayName: "Vikram S. (M.Tech)",
    docsCount: 15,
    active: false,
    tier: "STANDARD",
    education: "M.Tech Mechanical Engineering",
    institution: "CivicOne Institute of Technology",
    school: "CivicOne Army School",
    voterId: "DEMO-VOTER-10005",
    drivingLicence: "DEMO-DL-10005",
    vehicle: "KA-DEMO-1005",
    passport: "DEMO-PASS-10005",
    demoLabel: "DEMO DATA — NOT A REAL CITIZEN"
  }
];

export const DEMO_SECURITY_LOGS = [
  {
    id: "sec-001",
    event: "Citizen Login — Identity Verified via OTP",
    device: "Chrome Web Client (Windows)",
    location: "Mumbai, Maharashtra",
    ip: "49.37.142.90",
    timestamp: "2026-08-14T09:00:00Z",
    status: "SUCCESS",
  }
];

export const GOVERNMENT_DEPARTMENTS = [
  { id: "home", name: "Home Affairs", code: "DEPT-HOME", icon: "ShieldAlert" },
  { id: "police", name: "Police Department", code: "DEPT-POLICE", icon: "ShieldCheck" },
  { id: "revenue", name: "Revenue & Land Records", code: "DEPT-REV", icon: "FileText" },
  { id: "transport", name: "Transport (RTO)", code: "DEPT-RTO", icon: "Car" },
  { id: "higher_edu", name: "Higher Education", code: "DEPT-HEDU", icon: "GraduationCap" },
  { id: "school_edu", name: "School Education", code: "DEPT-SEDU", icon: "BookOpen" },
  { id: "health", name: "Health & Family Welfare", code: "DEPT-HLTH", icon: "Activity" },
  { id: "municipal", name: "Municipal Administration", code: "DEPT-MUNI", icon: "Building2" },
  { id: "social_welfare", name: "Social Welfare", code: "DEPT-SWEL", icon: "Users" },
  { id: "civil_supplies", name: "Civil Supplies & Consumer Affairs", code: "DEPT-CSUP", icon: "ShoppingBag" },
  { id: "labour", name: "Labour & Employment", code: "DEPT-LABR", icon: "Briefcase" },
  { id: "it_dept", name: "Information Technology & Electronics", code: "DEPT-ITD", icon: "Cpu" },
  { id: "rural_dev", name: "Rural Development", code: "DEPT-RDEV", icon: "TreePine" },
  { id: "urban_dev", name: "Urban Development", code: "DEPT-UDEV", icon: "Building" },
  { id: "other_govt", name: "Other Government Departments", code: "DEPT-OGOV", icon: "Landmark" }
];

export const GOVERNMENT_OFFICER_LEVELS = [
  { level: 1, title: "LEVEL 1 — GOVERNMENT OFFICER", code: "GOVT_OFFICER_L1", description: "Can manage authorized services within assigned jurisdiction." },
  { level: 2, title: "LEVEL 2 — DEPARTMENT SUPERVISOR", code: "GOVT_SUPERVISOR_L2", description: "Can supervise authorized officers within the assigned department." },
  { level: 3, title: "LEVEL 3 — STATE SUPERVISOR", code: "GOVT_STATE_SUPERVISOR_L3", description: "Can supervise authorized department activity within the assigned state." },
  { level: 4, title: "LEVEL 4 — NATIONAL / CENTRAL SUPERVISOR", code: "GOVT_NATIONAL_SUPERVISOR_L4", description: "If enabled, can view authorized cross-state CivicOne government activity." },
  { level: 5, title: "LEVEL 5 — CIVICONE SUPER ADMIN", code: "SUPER_ADMIN", description: "Platform-level control & master root supervision." }
];

export const DEMO_GOVERNMENT_OFFICERS = [
  {
    id: "OFF-1001",
    officerId: "GOVT-OFFICER-8942",
    name: "Officer K. Sharma",
    email: "officer.sharma@parivahan.gov.in",
    department: "Transport (RTO)",
    deptCode: "DEPT-RTO",
    state: "Andhra Pradesh",
    office: "Demo RTO Regional Headquarters — Vijayawada",
    roleLevel: 1,
    roleTitle: "LEVEL 1 — GOVERNMENT OFFICER",
    status: "APPROVED",
    clearance: "LEVEL-3 VERIFIED",
    lastLogin: "Today, 09:30 AM",
    demoLabel: "DEMO DATA — NOT A REAL GOVERNMENT OFFICER"
  },
  {
    id: "OFF-1002",
    officerId: "GOVT-SUP-9012",
    name: "Inspector R. Verma",
    email: "inspector.verma@police.gov.in",
    department: "Police Department",
    deptCode: "DEPT-POLICE",
    state: "Maharashtra",
    office: "Demo Police Headquarters — Mumbai",
    roleLevel: 2,
    roleTitle: "LEVEL 2 — DEPARTMENT SUPERVISOR",
    status: "APPROVED",
    clearance: "LEVEL-4 CLEARANCE",
    lastLogin: "Today, 10:15 AM",
    demoLabel: "DEMO DATA — NOT A REAL GOVERNMENT OFFICER"
  },
  {
    id: "OFF-1003",
    officerId: "GOVT-STATE-7710",
    name: "Director S. Kulkarni",
    email: "director.kulkarni@education.gov.in",
    department: "Higher Education",
    deptCode: "DEPT-HEDU",
    state: "Karnataka",
    office: "Demo State Education Directorate — Bengaluru",
    roleLevel: 3,
    roleTitle: "LEVEL 3 — STATE SUPERVISOR",
    status: "APPROVED",
    clearance: "STATE DIRECTED",
    lastLogin: "Yesterday, 04:45 PM",
    demoLabel: "DEMO DATA — NOT A REAL GOVERNMENT OFFICER"
  },
  {
    id: "OFF-1004",
    officerId: "GOVT-NAT-0001",
    name: "Commissioner A. Roy",
    email: "commissioner.roy@gov.in",
    department: "Home Affairs",
    deptCode: "DEPT-HOME",
    state: "Delhi",
    office: "Demo Central Secretariat — New Delhi",
    roleLevel: 4,
    roleTitle: "LEVEL 4 — NATIONAL / CENTRAL SUPERVISOR",
    status: "APPROVED",
    clearance: "NATIONAL CLEARANCE",
    lastLogin: "Today, 08:00 AM",
    demoLabel: "DEMO DATA — NOT A REAL GOVERNMENT OFFICER"
  }
];

export const DEMO_GLOBAL_ACCESS_LOGS = [
  {
    id: "LOG-GLOB-901",
    timestamp: "10:42 AM",
    organization: "CivicOne Demo College",
    orgType: "College",
    state: "Andhra Pradesh",
    citizenId: "CIV-DEMO-10001",
    requestedData: "Student Education Verification (12th & TC)",
    purpose: "Academic Admission Verification",
    result: "APPROVED",
    accessType: "VIEW ONLY"
  },
  {
    id: "LOG-GLOB-902",
    timestamp: "10:35 AM",
    organization: "CivicOne Demo Police",
    orgType: "Police",
    state: "Maharashtra",
    citizenId: "CIV-DEMO-10002",
    requestedData: "Identity Status & Driving Licence",
    purpose: "FIR Reference FIR-2026-904812 Check",
    result: "APPROVED",
    accessType: "AUTHORIZED POLICE VIEW"
  },
  {
    id: "LOG-GLOB-903",
    timestamp: "10:10 AM",
    organization: "CivicOne Demo Hotel",
    orgType: "Hotel",
    state: "Karnataka",
    citizenId: "CIV-DEMO-10003",
    requestedData: "Guest Name & ID Verification Badge",
    purpose: "Hotel Guest Check-in Verification",
    result: "APPROVED",
    accessType: "LIMITED VIEW ONLY"
  },
  {
    id: "LOG-GLOB-904",
    timestamp: "09:55 AM",
    organization: "CivicOne Demo Electronics Store",
    orgType: "Electronics",
    state: "Delhi",
    citizenId: "CIV-DEMO-10004",
    requestedData: "Minimum KYC Verification (Identity & Address)",
    purpose: "High Value Gadget Purchase KYC",
    result: "APPROVED",
    accessType: "MINIMUM KYC VIEW ONLY"
  }
];

export const ROLE_PERMISSION_MATRIX = [
  { role: "Citizen", citizenData: "Own Data Only", orgMgmt: "No", officerMgmt: "No", platformMgmt: "No" },
  { role: "Organization", citizenData: "Purpose-Authorized Only", orgMgmt: "Own Org", officerMgmt: "No", platformMgmt: "No" },
  { role: "Level 1 Government Officer", citizenData: "Authorized Jurisdiction", orgMgmt: "Assigned Orgs", officerMgmt: "Limited", platformMgmt: "No" },
  { role: "Level 2 Department Supervisor", citizenData: "Authorized Jurisdiction", orgMgmt: "Dept Orgs", officerMgmt: "Assigned Officers", platformMgmt: "No" },
  { role: "Level 3 State Supervisor", citizenData: "Authorized State", orgMgmt: "State Orgs", officerMgmt: "State Officers", platformMgmt: "No" },
  { role: "Level 4 National Supervisor", citizenData: "Cross-State Authorized", orgMgmt: "Cross-State Orgs", officerMgmt: "National Officers", platformMgmt: "No" },
  { role: "Level 5 CivicOne Super Admin", citizenData: "Platform Authorized Audit", orgMgmt: "All Organizations", officerMgmt: "All Officers", platformMgmt: "Full Control" }
];

export const DEMO_HOTEL_GUESTS = [
  {
    id: "GUEST-001",
    name: "Ravi Kumar",
    citizenId: "CIV-DEMO-10001",
    checkIn: "2026-08-10 14:00",
    checkOut: "2026-08-15 11:00",
    status: "Checked In",
    verificationStatus: "Verified via CivicOne",
    roomNo: "204"
  },
  {
    id: "GUEST-002",
    name: "Priya Sharma",
    citizenId: "CIV-DEMO-10002",
    checkIn: "2026-08-12 15:30",
    checkOut: "2026-08-16 11:00",
    status: "Checked In",
    verificationStatus: "Verified via CivicOne",
    roomNo: "310"
  },
  {
    id: "GUEST-003",
    name: "Amit Patel",
    citizenId: "CIV-DEMO-10003",
    checkIn: "2026-08-14 12:15",
    checkOut: "2026-08-18 11:00",
    status: "Checked In",
    verificationStatus: "Pending Verification",
    roomNo: "105"
  }
];

export const DEMO_POLICE_FIRS = [
  {
    id: "FIR-2026-904812",
    date: "2026-08-10",
    subject: "Vehicle Theft",
    location: "Andheri West, Mumbai",
    complainantName: "Sanjay Gupta",
    complainantId: "CIV-DEMO-10005",
    status: "Pending Investigation",
    assignedOfficer: "Inspector V. Deshmukh"
  },
  {
    id: "FIR-2026-904813",
    date: "2026-08-12",
    subject: "Cyber Fraud",
    location: "Online",
    complainantName: "Meera Reddy",
    complainantId: "CIV-DEMO-10006",
    status: "Resolved",
    assignedOfficer: "Sub-Inspector A. Khan"
  },
  {
    id: "FIR-2026-904814",
    date: "2026-08-14",
    subject: "Property Dispute",
    location: "Koramangala, Bengaluru",
    complainantName: "Vikram Singh",
    complainantId: "CIV-DEMO-10007",
    status: "Pending Investigation",
    assignedOfficer: "Inspector K. Patil"
  }
];

// --- CROSS-DEPARTMENT PROCESS PIPELINE DATASET ---
export const DEMO_ALL_DEPARTMENT_PROCESSES = [
  // 1. RTO / Parivahan Sewa
  {
    id: "PROC-RTO-101",
    title: "Smart Driving Licence Renewal Verification",
    department: "Parivahan Sewa (MoRTH / RTO)",
    deptCode: "DEPT-RTO",
    sector: "Government",
    state: "Andhra Pradesh",
    citizenName: "Aarav Kumar",
    civicId: "CIV-DEMO-10001",
    status: "PENDING_APPROVAL",
    priority: "High",
    timestamp: "14 Aug 2026, 10:45 AM",
    slaDeadline: "18 Hours Remaining",
    requestedDoc: "Smart Driving Licence (DEMO-DL-10001)",
    purpose: "License Expiry Renewal & Medical Fitness Validation",
    securityToken: "HASH-RTO-994821-AP",
    verificationTrace: [
      { step: "Citizen Renewal Request Submitted", time: "14 Aug 09:00 AM", actor: "Citizen (Aarav Kumar)" },
      { step: "Aadhaar e-KYC Token Validated", time: "14 Aug 09:02 AM", actor: "UIDAI ADV Engine" },
      { step: "RTO Fitness Clearance Uploaded", time: "14 Aug 10:15 AM", actor: "RTO Medical Board" },
      { step: "Pending Regional Officer Seal Approval", time: "14 Aug 10:45 AM", actor: "Officer K. Sharma (RTO)" }
    ]
  },
  {
    id: "PROC-RTO-102",
    title: "Vehicle Registration RC Transfer",
    department: "Parivahan Sewa (MoRTH / RTO)",
    deptCode: "DEPT-RTO",
    sector: "Government",
    state: "Maharashtra",
    citizenName: "Priya Sharma",
    civicId: "CIV-DEMO-10002",
    status: "VERIFIED_SUCCESS",
    priority: "Normal",
    timestamp: "14 Aug 2026, 09:30 AM",
    slaDeadline: "Completed (SLA Met)",
    requestedDoc: "Vehicle RC (MH-DEMO-1002)",
    purpose: "Inter-State Vehicle Ownership Transfer Verification",
    securityToken: "HASH-RTO-883104-MH",
    verificationTrace: [
      { step: "Ownership Transfer Initiated", time: "13 Aug 03:00 PM", actor: "Priya Sharma" },
      { step: "NOC Issued by RTO Mumbai", time: "14 Aug 08:30 AM", actor: "RTO Officer" },
      { step: "Cryptographic Certificate Generated", time: "14 Aug 09:30 AM", actor: "CivicOne Vault Service" }
    ]
  },

  // 2. Passport Seva / MEA
  {
    id: "PROC-PASSPORT-201",
    title: "Passport Re-Issuance Address & Identity Verification",
    department: "Passport Seva (Ministry of External Affairs)",
    deptCode: "DEPT-PASS",
    sector: "Government",
    state: "Delhi",
    citizenName: "Ananya Verma",
    civicId: "CIV-DEMO-10004",
    status: "IN_VERIFICATION",
    priority: "Urgent",
    timestamp: "14 Aug 2026, 11:15 AM",
    slaDeadline: "12 Hours Remaining",
    requestedDoc: "Indian Passport & Address Proof",
    purpose: "Tatkaal Passport Re-issuance Verification",
    securityToken: "HASH-MEA-441092-DL",
    verificationTrace: [
      { step: "Tatkaal Application Lodged", time: "14 Aug 08:00 AM", actor: "Ananya Verma" },
      { step: "DigiLocker Identity Cross-Check", time: "14 Aug 08:05 AM", actor: "Passport API Gateway" },
      { step: "Police Verification Dispatched to Special Branch", time: "14 Aug 11:15 AM", actor: "MEA System" }
    ]
  },

  // 3. Police Department / Law Enforcement
  {
    id: "PROC-POLICE-301",
    title: "Tenant Police Background Verification",
    department: "Police Department (Home Affairs)",
    deptCode: "DEPT-POLICE",
    sector: "Government",
    state: "Maharashtra",
    citizenName: "Rajesh Patel",
    civicId: "CIV-DEMO-10003",
    status: "PENDING_APPROVAL",
    priority: "High",
    timestamp: "14 Aug 2026, 10:20 AM",
    slaDeadline: "24 Hours Remaining",
    requestedDoc: "Police Clearance Record & Identity Token",
    purpose: "Residential Property Lease Verification",
    securityToken: "HASH-POL-332910-MH",
    verificationTrace: [
      { step: "Landlord Verification Request", time: "13 Aug 06:00 PM", actor: "Property Owner" },
      { step: "Crime Database Automated Search Clean", time: "14 Aug 07:00 AM", actor: "CCTNS Police Engine" },
      { step: "Awaiting Station House Officer Sign-Off", time: "14 Aug 10:20 AM", actor: "Inspector R. Verma" }
    ]
  },
  {
    id: "PROC-POLICE-302",
    title: "Lost Document FIR Digital Authentication",
    department: "Police Department (Home Affairs)",
    deptCode: "DEPT-POLICE",
    sector: "Government",
    state: "Andhra Pradesh",
    citizenName: "Aarav Kumar",
    civicId: "CIV-DEMO-10001",
    status: "FLAGGED_REVIEW",
    priority: "Urgent",
    timestamp: "14 Aug 2026, 08:50 AM",
    slaDeadline: "Flagged for Inspection",
    requestedDoc: "Digital FIR Loss Copy",
    purpose: "Duplicate Marksheet Claim Verification",
    securityToken: "HASH-POL-990142-AP",
    verificationTrace: [
      { step: "E-FIR Filed for Missing Certificate", time: "13 Aug 11:00 PM", actor: "Aarav Kumar" },
      { step: "Duplicate Timestamp Flag Detected", time: "14 Aug 08:50 AM", actor: "AI Integrity Agent" }
    ]
  },

  // 4. Education & Universities
  {
    id: "PROC-EDU-401",
    title: "B.Tech Degree Certificate Digital Authentication",
    department: "Higher Education & UGC Board",
    deptCode: "DEPT-HEDU",
    sector: "Education",
    state: "Karnataka",
    citizenName: "Vikram Singh",
    civicId: "CIV-DEMO-10005",
    status: "DOCUMENT_ISSUED",
    priority: "Normal",
    timestamp: "14 Aug 2026, 09:10 AM",
    slaDeadline: "Completed",
    requestedDoc: "M.Tech Mechanical Degree Certificate",
    purpose: "Overseas University Verification Request",
    securityToken: "HASH-UGC-774019-KA",
    verificationTrace: [
      { step: "University Convocation Record Sync", time: "12 Aug 02:00 PM", actor: "VTU Registrar" },
      { step: "Digital Signature Stamped with RSA-4096", time: "14 Aug 09:10 AM", actor: "CivicOne Education Gateway" }
    ]
  },

  // 5. Health & Ayushman Bharat (MoHFW)
  {
    id: "PROC-HLTH-501",
    title: "ABHA Universal Health ID Link & Medical Pass",
    department: "Health & Family Welfare (MoHFW)",
    deptCode: "DEPT-HLTH",
    sector: "Healthcare",
    state: "Maharashtra",
    citizenName: "Priya Sharma",
    civicId: "CIV-DEMO-10002",
    status: "VERIFIED_SUCCESS",
    priority: "Normal",
    timestamp: "14 Aug 2026, 07:45 AM",
    slaDeadline: "Completed",
    requestedDoc: "ABHA Health Card & Diagnostic Summary",
    purpose: "Ayushman Bharat National Health Ecosystem Consent",
    securityToken: "HASH-ABHA-204918-MH",
    verificationTrace: [
      { step: "ABHA Address Created: priya.sharma@abdm", time: "14 Aug 07:30 AM", actor: "Priya Sharma" },
      { step: "ABDM Health Information Provider Verified", time: "14 Aug 07:45 AM", actor: "MoHFW Gateway" }
    ]
  },

  // 6. Revenue & Income Tax (CBDT)
  {
    id: "PROC-REV-601",
    title: "Income & Asset Certificate Renewal Validation",
    department: "Revenue & Tax Department",
    deptCode: "DEPT-REV",
    sector: "Government",
    state: "Andhra Pradesh",
    citizenName: "Aarav Kumar",
    civicId: "CIV-DEMO-10001",
    status: "PENDING_APPROVAL",
    priority: "Normal",
    timestamp: "14 Aug 2026, 11:30 AM",
    slaDeadline: "48 Hours Remaining",
    requestedDoc: "State Income Certificate (DEMO-INC-2025-10001)",
    purpose: "Academic Scholarship Eligibility Re-verification",
    securityToken: "HASH-REV-119402-AP",
    verificationTrace: [
      { step: "Renewal Application Submitted", time: "14 Aug 11:00 AM", actor: "Aarav Kumar" },
      { step: "Form-16 IT Return Cross-Checked", time: "14 Aug 11:15 AM", actor: "Income Tax API" },
      { step: "Awaiting Revenue Inspector Seal", time: "14 Aug 11:30 AM", actor: "Tahsildar Desk" }
    ]
  },

  // 7. Banking & Financial Institutions
  {
    id: "PROC-BANK-801",
    title: "High-Assurance e-KYC Verification for Home Loan",
    department: "Banking & Financial Services (RBI Regulated)",
    deptCode: "BANK-01",
    sector: "Banking & Finance",
    state: "Gujarat",
    citizenName: "Rajesh Patel",
    civicId: "CIV-DEMO-10003",
    status: "VERIFIED_SUCCESS",
    priority: "Urgent",
    timestamp: "14 Aug 2026, 10:05 AM",
    slaDeadline: "Completed",
    requestedDoc: "Tokenized Aadhaar, PAN & 3-Year ITR Record",
    purpose: "State Bank Home Loan Facility Verification",
    securityToken: "HASH-FIN-990412-GJ",
    verificationTrace: [
      { step: "Bank KYC Consent Granted by Citizen", time: "14 Aug 09:50 AM", actor: "Rajesh Patel" },
      { step: "Tokenized Data Streamed via Encrypted Tunnel", time: "14 Aug 10:00 AM", actor: "CivicOne Banking Engine" },
      { step: "Bank Underwriting Verification Complete", time: "14 Aug 10:05 AM", actor: "SBI Credit Desk" }
    ]
  },

  // 8. Telecom & SIM Services (DoT)
  {
    id: "PROC-TEL-901",
    title: "SIM Card Biometric KYC Re-Verification",
    department: "Telecom & Mobile Retailers (DoT Authorized)",
    deptCode: "MOBILE-01",
    sector: "Private Sector",
    state: "Delhi",
    citizenName: "Ananya Verma",
    civicId: "CIV-DEMO-10004",
    status: "VERIFIED_SUCCESS",
    priority: "Normal",
    timestamp: "14 Aug 2026, 08:20 AM",
    slaDeadline: "Completed",
    requestedDoc: "Minimum Address & Tokenized KYC",
    purpose: "New Enterprise 5G SIM Connection KYC",
    securityToken: "HASH-TEL-441890-DL",
    verificationTrace: [
      { step: "Retailer Scanned CivicOne QR", time: "14 Aug 08:15 AM", actor: "Mobile Retail Outlet" },
      { step: "Zero-Knowledge Consent Verified", time: "14 Aug 08:20 AM", actor: "DoT TAFCOP Engine" }
    ]
  }
];

// --- WEBSITE USAGE & INFRASTRUCTURE TELEMETRY METRICS ---
export const DEMO_WEBSITE_USAGE_STATS = {
  totalRequestsToday: "1,482,910",
  activeUsersNow: "28,910",
  averageLatencyMs: "42 ms",
  requestsPerMinute: "3,420 RPM",
  uptimePercentage: "99.98%",
  pythonAuthEngineStatus: "ONLINE (Port 8000)",
  expressGatewayStatus: "ONLINE (Port 3001)",
  uidaiTokenizerStatus: "ONLINE (Token Encryption Active)",
  vaultStorageUsage: "4.2 TB / 10.0 TB",
  sectorTrafficDistribution: [
    { sector: "Government & RTO", percentage: 34, count: "504,189", color: "#3B82F6" },
    { sector: "Education & UGC", percentage: 24, count: "355,900", color: "#6366F1" },
    { sector: "Banking & Finance", percentage: 20, count: "296,582", color: "#0284C7" },
    { sector: "Police & Law Enforcement", percentage: 12, count: "177,949", color: "#EF4444" },
    { sector: "Healthcare & ABHA", percentage: 10, count: "148,290", color: "#10B981" }
  ],
  deviceDistribution: [
    { type: "Mobile Browsers", percentage: 68, color: "#38BDF8" },
    { type: "Desktop / Workstations", percentage: 26, color: "#818CF8" },
    { type: "Tablet & Enterprise Desks", percentage: 6, color: "#FACC15" }
  ],
  topStatesByUsage: [
    { state: "Maharashtra", requests: "312,490", activeUsers: "5,820" },
    { state: "Andhra Pradesh", requests: "248,100", activeUsers: "4,910" },
    { state: "Karnataka", requests: "210,500", activeUsers: "4,120" },
    { state: "Delhi NCR", requests: "189,300", activeUsers: "3,890" },
    { state: "Tamil Nadu", requests: "165,800", activeUsers: "3,400" },
    { state: "Gujarat", requests: "142,200", activeUsers: "2,840" }
  ]
};

