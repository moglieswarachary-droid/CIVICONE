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

export const ORGANIZATION_TYPES = [
  {
    id: "police",
    name: "Police Departments",
    roleCode: "POLICE_ADMIN",
    description: "Police verification, FIR case reference check and authorized identity verification.",
    icon: "ShieldAlert",
    color: "#DC2626",
    allowed: ["Identity Verification", "Verified Documents", "FIR Case Reference", "Audit Logs"],
    disallowed: ["Full Unrestricted Vault Browsing"]
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
    id: "government",
    name: "Government Departments",
    roleCode: "GOVERNMENT_ADMIN",
    description: "Service-specific citizen verification.",
    icon: "Landmark",
    color: "#073B8C",
    allowed: ["Service-Specific Identity Verification Only"],
    disallowed: ["Automatic Exposure of Education/Healthcare/Banking/Travel"]
  },
  {
    id: "rto",
    name: "RTO & Transport Authorities",
    roleCode: "RTO_ACCESS_ADMIN",
    description: "Driving licence and vehicle verification.",
    icon: "Car",
    color: "#EA580C",
    allowed: ["Driving Licence", "Vehicle Registration (RC)", "Insurance", "Pollution Certificate"],
    disallowed: ["Education", "Healthcare", "Bank", "Loan", "SIM", "Travel"]
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
  {
    id: "doc-001",
    name: "Aadhaar Card Reference",
    category: "Government",
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
    name: "PAN Card Reference",
    category: "Finance",
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
    id: "doc-003",
    name: "Smart Driving Licence",
    category: "RTO & Vehicles",
    issuer: "Parivahan Sewa – MoRTH",
    refNo: "DEMO-DL-10001",
    status: "Verified",
    issueDate: "12-01-2024",
    addedDate: "12-01-2024",
    expiryDate: "10-09-2026", // Expiring in 27 days -> EXPIRING SOON!
    lastVerified: "10 Aug 2026",
    isPrivate: false,
    description: "Synthetic Smart Driving Licence valid for LMV and Motorcycle.",
    isDemo: true,
  },
  {
    id: "doc-004",
    name: "Voter ID Card (EPIC)",
    category: "Government",
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
    id: "doc-005",
    name: "ABHA Health Card",
    category: "Healthcare",
    issuer: "National Health Authority",
    refNo: "91-1000-8761-0001",
    status: "Verified",
    issueDate: "18-01-2024",
    addedDate: "18-01-2024",
    expiryDate: "N/A",
    lastVerified: "14 Aug 2026",
    isPrivate: false,
    description: "Ayushman Bharat Health Account linked to health records.",
    isDemo: true,
  },
  {
    id: "doc-006",
    name: "B.Tech Computer Science Degree",
    category: "Education",
    issuer: "CivicOne Demo College",
    refNo: "DEMO-DEG-10001",
    status: "Verified",
    issueDate: "20-01-2024",
    addedDate: "20-01-2024",
    expiryDate: "N/A",
    lastVerified: "14 Aug 2026",
    isPrivate: false,
    description: "Bachelor of Technology (Computer Science) – CivicOne Demo College.",
    isDemo: true,
  },
  {
    id: "doc-007",
    name: "Indian Passport",
    category: "Government",
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
    id: "doc-008",
    name: "Vehicle Registration RC (AP-DEMO-1001)",
    category: "RTO & Vehicles",
    issuer: "Parivahan Sewa – MoRTH",
    refNo: "AP-DEMO-1001",
    status: "Verified",
    issueDate: "25-01-2024",
    addedDate: "25-01-2024",
    expiryDate: "01-09-2026", // Expiring in 18 days -> EXPIRING SOON!
    lastVerified: "11 Aug 2026",
    isPrivate: false,
    description: "Vehicle RC for Hyundai Creta (White) — Registration: AP-DEMO-1001.",
    isDemo: true,
  },
  {
    id: "doc-009",
    name: "State Income Certificate",
    category: "Government",
    issuer: "Revenue Department, Govt of AP",
    refNo: "DEMO-INC-2025-10001",
    status: "Verified",
    issueDate: "12-04-2025",
    addedDate: "12-04-2025",
    expiryDate: "01-06-2026", // Expired 74 days ago -> EXPIRED!
    lastVerified: "01 Jun 2026",
    isPrivate: false,
    description: "State Revenue Income Certificate (Expired Record).",
    isDemo: true,
  },
  {
    id: "doc-010",
    name: "10th Marksheet & Board Certificate",
    category: "Education",
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
    id: "doc-011",
    name: "Transfer Certificate (TC)",
    category: "Education",
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
    id: "doc-012",
    name: "12th Senior Secondary Marksheet",
    category: "Education",
    issuer: "CivicOne Model School",
    refNo: "DEMO-12TH-10001",
    status: "Verified",
    issueDate: "05-06-2022",
    addedDate: "05-02-2024",
    expiryDate: "N/A",
    lastVerified: "14 Aug 2026",
    isPrivate: false,
    description: "12th Grade Senior Secondary Science Marksheet.",
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
