// server/mockDb.js - Relational In-Memory Multi-Citizen Database & Verification State Engine

export const db = {
  // Active Authenticated Citizen ID (Default: CIV-100001 - Rajesh Kumar)
  activeCitizenId: "CIV-100001",

  // 1. MASTER CITIZEN DATASET (20 Relational Citizens)
  citizens: [
    {
      id: "cit-101",
      citizenId: "CIV-100001",
      civiconeId: "CVC-DEMO-1001",
      fullName: "Arjun Rao",
      displayName: "Arjun",
      dateOfBirth: "15-08-1992",
      gender: "Male",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      mobileMasked: "+91 98765 43210",
      emailMasked: "arjun.rao@civicone.gov.in",
      addressSummary: "Flat 402, Green Valley Towers, Bandra West, Mumbai 400050",
      trustLevel: "TRUST LEVEL 05",
      verificationStatus: "VERIFIED",
      securityScore: 98,
      createdAt: "2026-01-15T09:30:00Z",
      virtualCardId: "VCD-CVC-DEMO-1001",
      virtualCardStatus: "ACTIVE",
      bloodGroup: "O+",
      emergencyContact: "+91 9812345678 (Spouse - Priya Rao)",
      maskedAadhaar: "XXXX XXXX 8942"
    },
    {
      id: "cit-102",
      citizenId: "CIV-100002",
      civiconeId: "CVC-DEMO-1002",
      fullName: "Ananya Sharma",
      displayName: "Ananya",
      dateOfBirth: "14-08-1994",
      gender: "Female",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      mobileMasked: "+91 98123 45678",
      emailMasked: "ananya.sharma@civicone.gov.in",
      addressSummary: "Flat 12B, Ocean View Apts, Worli, Mumbai 400018",
      trustLevel: "TRUST LEVEL 04",
      verificationStatus: "VERIFIED",
      securityScore: 96,
      createdAt: "2026-01-20T10:15:00Z",
      virtualCardId: "VCD-CVC-DEMO-1002",
      virtualCardStatus: "ACTIVE",
      bloodGroup: "A+",
      emergencyContact: "+91 9898765432 (Father - Rajendra Sharma)",
      maskedAadhaar: "XXXX XXXX 1029"
    },
    {
      id: "cit-103",
      citizenId: "CIV-100003",
      civiconeId: "CVC-DEMO-1003",
      fullName: "Rahul Kumar",
      displayName: "Rahul",
      dateOfBirth: "02-11-1988",
      gender: "Male",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      mobileMasked: "+91 97654 32109",
      emailMasked: "rahul.kumar@civicone.gov.in",
      addressSummary: "House 45, Indiranagar 100ft Road, Bengaluru 560038",
      trustLevel: "TRUST LEVEL 04",
      verificationStatus: "VERIFIED",
      securityScore: 91,
      createdAt: "2026-02-01T11:20:00Z",
      virtualCardId: "VCD-CVC-DEMO-1003",
      virtualCardStatus: "ACTIVE",
      bloodGroup: "B+",
      emergencyContact: "+91 9711223344 (Brother - Karthik Kumar)",
      maskedAadhaar: "XXXX XXXX 3301"
    },
    {
      id: "cit-104",
      citizenId: "CIV-100004",
      civiconeId: "CVC-DEMO-1004",
      fullName: "Meera Reddy",
      displayName: "Meera",
      dateOfBirth: "22-05-1996",
      gender: "Female",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
      mobileMasked: "+91 96543 21098",
      emailMasked: "meera.reddy@civicone.gov.in",
      addressSummary: "Apt 501, Jubilee Hills, Hyderabad 500033",
      trustLevel: "TRUST LEVEL 05",
      verificationStatus: "VERIFIED",
      securityScore: 97,
      createdAt: "2026-02-15T14:40:00Z",
      virtualCardId: "VCD-CVC-DEMO-1004",
      virtualCardStatus: "ACTIVE",
      bloodGroup: "AB+",
      emergencyContact: "+91 9600112233 (Mother - Sundaram R)",
      maskedAadhaar: "XXXX XXXX 4019"
    },
    {
      id: "cit-105",
      citizenId: "CIV-100005",
      civiconeId: "CVC-DEMO-1005",
      fullName: "Vikram Singh",
      displayName: "Vikram",
      dateOfBirth: "10-01-1990",
      gender: "Male",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      mobileMasked: "+91 95432 10987",
      emailMasked: "vikram.singh@civicone.gov.in",
      addressSummary: "Plot 88, CG Road, Navrangpura, Ahmedabad 380009",
      trustLevel: "TRUST LEVEL 03",
      verificationStatus: "VERIFIED",
      securityScore: 89,
      createdAt: "2026-03-01T09:10:00Z",
      virtualCardId: "VCD-CVC-DEMO-1005",
      virtualCardStatus: "ACTIVE",
      bloodGroup: "O-",
      emergencyContact: "+91 9588776655 (Spouse - Meena Singh)",
      maskedAadhaar: "XXXX XXXX 7734"
    }
      displayName: "Dev",
      dateOfBirth: "10-01-1990",
      gender: "Male",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      mobileMasked: "+91 95432 10987",
      emailMasked: "devendra.patel@civicone.gov.in",
      addressSummary: "Plot 88, CG Road, Navrangpura, Ahmedabad 380009",
      trustLevel: "Standard Verified",
      verificationStatus: "VERIFIED",
      securityScore: 89,
      createdAt: "2026-03-01T09:10:00Z",
      virtualCardId: "VCD-STD-100005",
      virtualCardStatus: "ACTIVE",
      tier: "STANDARD",
      bloodGroup: "O-",
      emergencyContact: "+91 9588776655 (Spouse - Meena Patel)",
      maskedAadhaar: "XXXX XXXX 7734"
    }
  ],

  // 2. RELATIONAL DOCUMENTS DATASET (Tied by citizenId)
  documents: [
    // --- CITIZEN 1: CIV-100001 (Rajesh Kumar) ---
    {
      id: "doc-101",
      citizenId: "CIV-100001",
      name: "Tokenized Aadhaar Reference",
      category: "Government",
      issuer: "UIDAI",
      status: "Verified",
      issueDate: "12-05-2016",
      expiryDate: "Lifetime",
      refNo: "XXXX XXXX 8942",
      fileType: "PDF",
      fileSize: "1.2 MB",
      icon: "ShieldCheck",
      description: "Official Tokenized Aadhaar Identity Card Reference",
      securitySeal: "CRYPT-UIDAI-SEAL-2026-OK",
      isFavorite: true,
      tags: ["Identity", "Government", "Important"]
    },
    {
      id: "doc-102",
      citizenId: "CIV-100001",
      name: "Permanent Account Number (PAN)",
      category: "Government",
      issuer: "Income Tax Department, Govt of India",
      status: "Verified",
      issueDate: "18-09-2017",
      expiryDate: "N/A",
      refNo: "ABCDE1234F",
      fileType: "PDF",
      fileSize: "850 KB",
      icon: "FileText",
      description: "Verified Tax Identity & Financial Document",
      securitySeal: "ITD-PAN-VERIFIED-HASH-092",
      isFavorite: true,
      tags: ["Finance", "Tax", "Identity"]
    },
    {
      id: "doc-103",
      citizenId: "CIV-100001",
      name: "Smart Driving Licence",
      category: "RTO",
      issuer: "Regional Transport Office (MH-02 Mumbai)",
      status: "Verified",
      issueDate: "15-10-2018",
      expiryDate: "14-10-2028",
      refNo: "MH02 20180094821",
      fileType: "PDF",
      fileSize: "1.8 MB",
      icon: "Car",
      description: "Motor Vehicle Driving Authorization & Transport ID",
      securitySeal: "RTO-MH-DL-AUTHENTICATED",
      isFavorite: true,
      vehicleNo: "MH 02 CD 4589",
      tags: ["RTO", "Transport", "Important"]
    },
    {
      id: "doc-104",
      citizenId: "CIV-100001",
      name: "ABHA Health Account Card",
      category: "Healthcare",
      issuer: "National Health Authority (NHA)",
      status: "Verified",
      issueDate: "05-11-2022",
      expiryDate: "N/A",
      refNo: "ABHA-91-8493-2049-11",
      fileType: "PDF",
      fileSize: "920 KB",
      icon: "HeartPulse",
      description: "Universal Digital Health Ecosystem Identifier",
      securitySeal: "NHA-ABHA-HEALTH-AUTHENTIC",
      isPrivate: true,
      tags: ["Healthcare", "Private"]
    },
    {
      id: "doc-105",
      citizenId: "CIV-100001",
      name: "B.Tech Computer Science Degree",
      category: "Education",
      issuer: "Indian Institute of Technology, Bombay",
      status: "Verified",
      issueDate: "10-06-2014",
      expiryDate: "N/A",
      refNo: "IITB-DEGREE-2014-CS-094",
      fileType: "PDF",
      fileSize: "3.4 MB",
      icon: "GraduationCap",
      description: "First Class Honors Degree in Computer Science",
      securitySeal: "NAD-IITB-VERIFIED-CERT",
      isFavorite: true,
      tags: ["Education", "Degree"]
    },
    {
      id: "doc-106",
      citizenId: "CIV-100001",
      name: "HDFC Bank Verified Account Statement",
      category: "Finance",
      issuer: "HDFC Bank Ltd",
      status: "Verified",
      issueDate: "01-04-2026",
      expiryDate: "N/A",
      refNo: "XXXX XXXX 4567 (HDFC)",
      fileType: "PDF",
      fileSize: "2.4 MB",
      icon: "Landmark",
      description: "Masked Annual Financial KYC & Account Verification Document",
      securitySeal: "HDFC-BANK-CRYPT-SEAL",
      isPrivate: true,
      tags: ["Finance", "Banking", "Masked"]
    },
    {
      id: "doc-107",
      citizenId: "CIV-100001",
      name: "AWS Certified Solutions Architect Token",
      category: "Professional",
      issuer: "Amazon Web Services (AWS)",
      status: "Verified",
      issueDate: "15-11-2023",
      expiryDate: "14-11-2026",
      refNo: "AWS-CERT-SA-904812",
      fileType: "PDF",
      fileSize: "950 KB",
      icon: "Award",
      description: "Professional AWS Cloud Architecture Credential",
      securitySeal: "AWS-BADGE-AUTHENTIC-2026",
      tags: ["Certification", "Expiring Soon"]
    },
    {
      id: "doc-108",
      citizenId: "CIV-100001",
      name: "CII Institutional Membership Token",
      category: "Organization",
      issuer: "Confederation of Indian Industry",
      status: "Verified",
      issueDate: "01-01-2024",
      expiryDate: "31-12-2026",
      refNo: "CII-MEM-2024-9402",
      fileType: "PDF",
      fileSize: "980 KB",
      icon: "Building2",
      description: "Institutional Professional Network Credential",
      securitySeal: "CII-ORG-VERIFIED-TOKEN",
      tags: ["Organization", "Membership"]
    },

    // --- CITIZEN 2: CIV-100002 (Ananya Sharma) ---
    {
      id: "doc-201",
      citizenId: "CIV-100002",
      name: "National Voter Identity Card (EPIC)",
      category: "Government",
      issuer: "Election Commission of India",
      status: "Verified",
      issueDate: "14-01-2019",
      expiryDate: "Permanent",
      refNo: "EPIC-MH-904812",
      fileType: "PDF",
      fileSize: "1.1 MB",
      icon: "ShieldCheck",
      description: "168-Chandivali Constituency ECI Verified Elector Credential",
      securitySeal: "ECI-EPIC-SEAL-VERIFIED",
      isFavorite: true,
      tags: ["Identity", "Voter ID"]
    },
    {
      id: "doc-202",
      citizenId: "CIV-100002",
      name: "M.Tech Data Science Degree",
      category: "Education",
      issuer: "ABC University",
      status: "Verified",
      issueDate: "12-07-2020",
      expiryDate: "N/A",
      refNo: "ABC-MTECH-DS-2020-11",
      fileType: "PDF",
      fileSize: "2.9 MB",
      icon: "GraduationCap",
      description: "Master of Technology in Data Science & Machine Learning",
      securitySeal: "NAD-ABC-MTECH-VERIFIED",
      isFavorite: true,
      tags: ["Education", "Degree"]
    },
    {
      id: "doc-203",
      citizenId: "CIV-100002",
      name: "Metropolis Executive Diagnostic Report",
      category: "Healthcare",
      issuer: "Metropolis Diagnostics",
      status: "Verified",
      issueDate: "10-07-2026",
      expiryDate: "N/A",
      refNo: "METRO-LAB-2026-9048",
      fileType: "PDF",
      fileSize: "1.4 MB",
      icon: "HeartPulse",
      description: "Annual Pathology Health Clearance Report",
      securitySeal: "LAB-SEAL-ENCRYPTED",
      isPrivate: true,
      tags: ["Healthcare", "Private"]
    },

    // --- CITIZEN 3: CIV-100003 (Vikramaditya Rao) ---
    {
      id: "doc-301",
      citizenId: "CIV-100003",
      name: "KA RTO Commercial Vehicle Licence",
      category: "RTO",
      issuer: "RTO KA-05 Bengaluru South",
      status: "Verified",
      issueDate: "10-05-2015",
      expiryDate: "09-05-2035",
      refNo: "KA05 20150033019",
      fileType: "PDF",
      fileSize: "1.6 MB",
      icon: "Car",
      description: "Karnataka State Motor Transport Driver Authorization",
      securitySeal: "KA-RTO-SEAL-VALID",
      tags: ["RTO", "Licence"]
    },

    // --- CITIZEN 4: CIV-100004 (Priya Sundaram) ---
    {
      id: "doc-401",
      citizenId: "CIV-100004",
      name: "ICICI Bank Loan Clearance Document",
      category: "Finance",
      issuer: "ICICI Bank Ltd",
      status: "Verified",
      issueDate: "01-02-2026",
      expiryDate: "N/A",
      refNo: "XXXX XXXX 9901 (ICICI)",
      fileType: "PDF",
      fileSize: "1.9 MB",
      icon: "Landmark",
      description: "Home Loan No-Objection & Financial Clearance Certificate",
      securitySeal: "ICICI-LOAN-SEAL-OK",
      isPrivate: true,
      tags: ["Finance", "Loan"]
    },

    // --- CITIZEN 5: CIV-100005 (Devendra Patel) ---
    {
      id: "doc-501",
      citizenId: "CIV-100005",
      name: "State Residence & Domicile Certificate",
      category: "Government",
      issuer: "Revenue Dept, Govt of Gujarat",
      status: "Pending Verification",
      issueDate: "15-06-2026",
      expiryDate: "N/A",
      refNo: "GUJ-DOM-2026-7734",
      fileType: "PDF",
      fileSize: "1.1 MB",
      icon: "ShieldCheck",
      description: "State Resident Domicile Clearance Reference",
      securitySeal: "GUJ-REV-PENDING-AUDIT",
      tags: ["Government", "Pending"]
    }
  ],

  // 3. PUBLIC VERIFICATION TOKENS
  publicTokens: {
    "CIV-TOKEN-984210-SECURE-2026": {
      citizenId: "CIV-100001",
      citizenName: "Rajesh Kumar",
      credentialTitle: "CivicOne Gold National Credential",
      issuer: "CivicOne Identity Authority",
      status: "VERIFIED",
      verifiedAt: "2026-08-13T09:30:00Z",
      trustScore: "98% Cryptographically Authentic",
      verificationRef: "VER-2026-90481029",
      tier: "GOLD"
    },
    "CIV-TOKEN-100002-SECURE-2026": {
      citizenId: "CIV-100002",
      citizenName: "Ananya Sharma",
      credentialTitle: "CivicOne Gold National Credential",
      issuer: "CivicOne Identity Authority",
      status: "VERIFIED",
      verifiedAt: "2026-08-13T10:15:00Z",
      trustScore: "96% Cryptographically Authentic",
      verificationRef: "VER-2026-10294821",
      tier: "GOLD"
    }
  },

  // 4. AUDIT LOGS
  auditLogs: [
    {
      id: "sec-101",
      citizenId: "CIV-100001",
      event: "Pre-Entry OTP Authenticated",
      device: "Chrome on Windows 11",
      location: "Mumbai, India",
      ip: "49.37.142.90",
      timestamp: "13 Aug 2026, 09:30:15 AM",
      status: "SUCCESS"
    },
    {
      id: "sec-102",
      citizenId: "CIV-100001",
      event: "Smart Driving Licence Verified",
      device: "Chrome on Windows 11",
      location: "Mumbai, India",
      ip: "49.37.142.90",
      timestamp: "13 Aug 2026, 09:42:00 AM",
      status: "SUCCESS"
    }
  ],

  // 5. NOTIFICATIONS
  notifications: [
    {
      id: "notif-101",
      citizenId: "CIV-100001",
      title: "Smart Driving Licence Verified",
      category: "Documents",
      message: "Your MH-02 Driving Licence record was successfully authenticated by MoRTH server.",
      timestamp: "10 minutes ago",
      read: false,
      type: "success"
    },
    {
      id: "notif-102",
      citizenId: "CIV-100001",
      title: "Document Expiry Reminder",
      category: "Security",
      message: "Your driving licence (MH02 20180094821) expires in 792 days on 14-10-2028.",
      timestamp: "2 hours ago",
      read: false,
      type: "warning"
    }
  ],

  // 6. ORGANIZATIONS & CONSENT RECORDS
  organizations: [
    { id: "org-1", name: "ABC University", category: "Education", regNo: "EDU-REG-9048", verified: true, contactEmail: "admissions@abc.edu.in" },
    { id: "org-2", name: "XYZ University", category: "Education", regNo: "EDU-REG-1102", verified: true, contactEmail: "admissions@xyz.edu.in" },
    { id: "org-3", name: "Apollo Hospitals", category: "Healthcare", regNo: "HEALTH-REG-4401", verified: true, contactEmail: "records@apollo.org" },
    { id: "org-4", name: "HDFC Bank Ltd", category: "Finance", regNo: "BANK-REG-8820", verified: true, contactEmail: "kyc@hdfcbank.com" },
    { id: "org-5", name: "Tata Consultancy Services", category: "Employment", regNo: "CORP-REG-9910", verified: true, contactEmail: "onboarding@tcs.com" }
  ],

  consentRecords: [
    {
      id: "share-9041",
      citizenId: "CIV-100001",
      citizenCivicId: "CIV-100001",
      docId: "doc-105",
      docName: "B.Tech Computer Science Degree",
      orgId: "org-1",
      orgName: "ABC University",
      purpose: "M.Tech Admission Verification",
      accessType: "View + Verify",
      createdAt: "13 Aug 2026, 09:35 AM",
      expiryDate: "20 Aug 2026",
      status: "ACTIVE",
      watermarkText: "CONFIDENTIAL — AUTHORIZED FOR ABC UNIVERSITY — M.TECH ADMISSION — 13 AUG 2026"
    }
  ],

  // 7. OFFICIAL GOVERNMENT DIRECTIVES & PRESS RELEASES (Recent Timestamps)
  govtUpdates: [
    {
      id: "gov-upd-101",
      title: "MeitY Mandates Tokenized Zero-Knowledge Verification across 450+ Public Utilities",
      category: "Government Policy & Digital Infrastructure",
      priority: "High",
      date: "13 Aug 2026, 18:30 IST (Just Now)",
      source: "Ministry of Electronics & Information Technology (MeitY)",
      content: "The Ministry has officially directed all central and state public utilities to mandate ZK-SNARK tokenized verification via CivicOne. Citizens will no longer be required to hand over physical document photocopies for government services.",
      unread: true,
      isGoldPass: false
    },
    {
      id: "gov-upd-102",
      title: "👑 CivicOne Gold Pass Fast-Track Passport & Express Clearance Rollout",
      category: "Gold Pass Priority Services",
      priority: "High",
      date: "13 Aug 2026, 16:15 IST (2 Hours Ago)",
      source: "Ministry of External Affairs & Passport Seva Division",
      content: "Gold Pass verified citizens can now access dedicated express queues at 38 Regional Passport Offices nationwide. Identity validation is completed in under 45 seconds via dynamic cryptographic QR credentials.",
      unread: true,
      isGoldPass: true
    },
    {
      id: "gov-upd-103",
      title: "MoRTH E-DL & Smart Vehicle RC Auto-Sync Protocol Live",
      category: "RTO & Transport Logistics",
      priority: "Medium",
      date: "13 Aug 2026, 12:45 IST",
      source: "Ministry of Road Transport & Highways (MoRTH)",
      content: "All active driving licences and vehicle registration certificates issued by state RTOs are now automatically synchronized into the citizen's Civic Vault with real-time PUC and insurance verification flags.",
      unread: false,
      isGoldPass: false
    },
    {
      id: "gov-upd-104",
      title: "National Health Authority Integrates ABHA 2.0 Tele-Health Vault Credentials",
      category: "Healthcare & Medical Vault",
      priority: "Medium",
      date: "12 Aug 2026, 19:20 IST",
      source: "National Health Authority (NHA)",
      content: "ABHA 2.0 digital health accounts are officially linked with CivicOne structured vault. Diagnostic reports, pathology lab results, and vaccination records can now be shared securely with instant time-limited consent.",
      unread: false,
      isGoldPass: false
    },
    {
      id: "gov-upd-105",
      title: "👑 Gold Pass Exclusive Priority Banking KYC Sync Approved by RBI",
      category: "Gold Pass Banking Privileges",
      priority: "High",
      date: "12 Aug 2026, 14:10 IST",
      source: "Reserve Bank of India (RBI) Financial Cell",
      content: "Gold Pass verified citizens enjoy automatic multi-bank KYC synchronization across all Tier-1 banks without re-submitting financial documents or attending physical branch verification visits.",
      unread: false,
      isGoldPass: true
    },
    {
      id: "gov-upd-106",
      title: "Election Commission Approves E-EPIC Digital Voter Card Instant Verification",
      category: "Electoral Governance",
      priority: "High",
      date: "11 Aug 2026, 14:00 IST",
      source: "Election Commission of India (ECI)",
      content: "The ECI has integrated digital voter ID records into CivicOne. Citizens can verify constituency polling stations and generate cryptographic elector proofs directly from their virtual card.",
      unread: false,
      isGoldPass: false
    }
  ],

  // 8. DAILY NEWS & MEDIA (With Gold Pass Special Coverage)
  dailyNews: [
    {
      id: "news-201",
      title: "👑 CivicOne Unveils Next-Gen Gold Pass VIP Portal for Premium Identity Holders",
      category: "Gold Pass News",
      source: "Economic Times Tech",
      date: "13 Aug 2026, 19:10 IST (Recent)",
      snippet: "CivicOne's new Gold Pass tier introduces instant airport security e-gates, priority banking KYC synchronization, and 24/7 dedicated identity concierges for high-trust verified citizens.",
      isGoldPass: true
    },
    {
      id: "news-202",
      title: "India's Digital Vault Infrastructure Handles 10 Million Paperless Verifications in Q3",
      category: "Tech & Innovation",
      source: "Business Standard Digital",
      date: "13 Aug 2026, 17:30 IST",
      snippet: "CivicOne platform records a 400% surge in paperless credential verifications as universities, banks, and healthcare providers adopt end-to-end tokenized document sharing.",
      isGoldPass: false
    },
    {
      id: "news-203",
      title: "👑 Gold Pass Priority Airport E-Gates Launched at Delhi, Mumbai & Bengaluru Air Hubs",
      category: "Gold Pass Privilege",
      source: "The Hindu Business Line",
      date: "13 Aug 2026, 15:00 IST",
      snippet: "Airports Authority of India implements seamless biometric e-gate entry for CivicOne Gold Pass holders, reducing security queue waiting times from 25 minutes to under 15 seconds.",
      isGoldPass: true
    },
    {
      id: "news-204",
      title: "Cybersecurity Agency Certifies CivicOne Zero-Knowledge Encryption Standard",
      category: "Security & Privacy",
      source: "Financial Express Security",
      date: "12 Aug 2026, 21:00 IST",
      snippet: "National Critical Information Infrastructure Protection Centre (NCIIPC) awards top-tier security compliance to CivicOne's hardware-backed AES-256 identity vault.",
      isGoldPass: false
    },
    {
      id: "news-205",
      title: "Top 100 Indian Universities Enable One-Click Degree Verification via Civic Vault",
      category: "Education & Employment",
      source: "Mint Education",
      date: "12 Aug 2026, 10:30 IST",
      snippet: "Leading IITs, IIMs, and central universities migrate to digital degree tokens, eliminating counterfeit credentials and reducing employment background check times from 2 weeks to 3 seconds.",
      isGoldPass: false
    },
    {
      id: "news-206",
      title: "HDFC Bank & ICICI Introduce Instant Zero-Paper Home Loans for CivicOne Verified Users",
      category: "Finance & Housing",
      source: "NDTV Profit",
      date: "11 Aug 2026, 16:45 IST",
      snippet: "Major retail banks announce instant pre-approved mortgage loans for citizens with high trust scores on CivicOne, requiring zero physical document submissions.",
      isGoldPass: false
    }
  ]
};

// HELPER DATA SERVICE METRIC GETTERS
export function getActiveCitizen() {
  return db.citizens.find(c => c.citizenId === db.activeCitizenId) || db.citizens[0];
}

export function setActiveCitizen(citizenId) {
  const citizen = db.citizens.find(c => c.citizenId === citizenId);
  if (citizen) {
    db.activeCitizenId = citizen.citizenId;
    return citizen;
  }
  return getActiveCitizen();
}

export function getCitizenDocuments(citizenId = db.activeCitizenId) {
  return db.documents.filter(d => d.citizenId === citizenId);
}

export function getCitizenNotifications(citizenId = db.activeCitizenId) {
  return db.notifications.filter(n => n.citizenId === citizenId);
}

export function getCitizenAuditLogs(citizenId = db.activeCitizenId) {
  return db.auditLogs.filter(a => a.citizenId === citizenId);
}

export function verifyDocument(docId) {
  const doc = db.documents.find(d => d.id === docId);
  if (doc) {
    doc.status = "Verified";
    doc.verifiedAt = new Date().toISOString();
    
    // Append entry to audit logs
    db.auditLogs.unshift({
      id: `sec-${Date.now()}`,
      citizenId: doc.citizenId,
      event: `${doc.name} Credential Verified`,
      device: "Chrome / CivicOne Platform",
      location: "Verified Issuer API",
      ip: "127.0.0.1",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "SUCCESS"
    });
    return doc;
  }
  return null;
}
