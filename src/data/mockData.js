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

