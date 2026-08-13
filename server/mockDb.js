// server/mockDb.js - Relational In-Memory Multi-Citizen Database & Verification State Engine

export const db = {
  // Active Authenticated Citizen ID (Default: CIV-100001 - Rajesh Kumar)
  activeCitizenId: "CIV-100001",

  // 1. MASTER CITIZEN DATASET (20 Relational Citizens)
  citizens: [
    {
      id: "cit-101",
      citizenId: "CIV-100001",
      fullName: "Rajesh Kumar",
      displayName: "Rajesh",
      dateOfBirth: "15-08-1992",
      gender: "Male",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      mobileMasked: "+91 98765 43210",
      emailMasked: "rajesh.kumar@civicone.gov.in",
      addressSummary: "Flat 402, Green Valley Towers, Bandra West, Mumbai 400050",
      trustLevel: "Standard Verified Citizen",
      verificationStatus: "VERIFIED",
      securityScore: 98,
      createdAt: "2026-01-15T09:30:00Z",
      virtualCardId: "VCD-STD-100001",
      virtualCardStatus: "ACTIVE",
      tier: "STANDARD",
      goldPassStatus: "standard",
      bloodGroup: "O+",
      emergencyContact: "+91 9812345678 (Spouse - Priya Kumar)",
      maskedAadhaar: "XXXX XXXX 8942"
    },
    {
      id: "cit-102",
      citizenId: "CIV-100002",
      fullName: "Ananya Sharma",
      displayName: "Ananya",
      dateOfBirth: "14-08-1994",
      gender: "Female",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      mobileMasked: "+91 98123 45678",
      emailMasked: "ananya.sharma@civicone.gov.in",
      addressSummary: "Flat 12B, Ocean View Apts, Worli, Mumbai 400018",
      trustLevel: "VIP Tier Gold",
      verificationStatus: "VERIFIED",
      securityScore: 96,
      createdAt: "2026-01-20T10:15:00Z",
      virtualCardId: "VCD-GOLD-100002",
      virtualCardStatus: "ACTIVE",
      tier: "GOLD",
      bloodGroup: "A+",
      emergencyContact: "+91 9898765432 (Father - Rajendra Sharma)",
      maskedAadhaar: "XXXX XXXX 1029"
    },
    {
      id: "cit-103",
      citizenId: "CIV-100003",
      fullName: "Vikramaditya Rao",
      displayName: "Vikram",
      dateOfBirth: "02-11-1988",
      gender: "Male",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      mobileMasked: "+91 97654 32109",
      emailMasked: "vikram.rao@civicone.gov.in",
      addressSummary: "House 45, Indiranagar 100ft Road, Bengaluru 560038",
      trustLevel: "Standard Verified",
      verificationStatus: "VERIFIED",
      securityScore: 91,
      createdAt: "2026-02-01T11:20:00Z",
      virtualCardId: "VCD-STD-100003",
      virtualCardStatus: "ACTIVE",
      tier: "STANDARD",
      bloodGroup: "B+",
      emergencyContact: "+91 9711223344 (Brother - Karthik Rao)",
      maskedAadhaar: "XXXX XXXX 3301"
    },
    {
      id: "cit-104",
      citizenId: "CIV-100004",
      fullName: "Priya Sundaram",
      displayName: "Priya",
      dateOfBirth: "22-05-1996",
      gender: "Female",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
      mobileMasked: "+91 96543 21098",
      emailMasked: "priya.sundaram@civicone.gov.in",
      addressSummary: "Apt 501, Jubilee Hills, Hyderabad 500033",
      trustLevel: "VIP Tier Gold",
      verificationStatus: "VERIFIED",
      securityScore: 97,
      createdAt: "2026-02-15T14:40:00Z",
      virtualCardId: "VCD-GOLD-100004",
      virtualCardStatus: "ACTIVE",
      tier: "GOLD",
      bloodGroup: "AB+",
      emergencyContact: "+91 9600112233 (Mother - Sundaram M)",
      maskedAadhaar: "XXXX XXXX 4019"
    },
    {
      id: "cit-105",
      citizenId: "CIV-100005",
      fullName: "Devendra Patel",
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

  goldPassRequests: [
    {
      id: "gpr-demo-01",
      citizenId: "CIV-100001",
      citizenName: "Rajesh Kumar",
      appliedAt: "2026-08-13T10:00:00Z",
      status: "PENDING",
      plan: "Annual Pass (₹499)",
      paymentRef: "TXN-984210-DEMO",
      notes: "Pending Admin Verification"
    }
  ],

  // 6. LOGS & NOTIFICATIONS ALIASES
  securityLogs: [
    {
      id: "sec-101",
      citizenId: "CIV-100001",
      event: "Pre-Entry OTP Authenticated",
      device: "Chrome Web Client (Windows)",
      location: "Mumbai, India",
      ip: "49.37.142.90",
      timestamp: "13 Aug 2026, 09:30 AM",
      status: "SUCCESS"
    },
    {
      id: "sec-102",
      citizenId: "CIV-100001",
      event: "Smart Driving Licence Verified",
      device: "Chrome Web Client (Windows)",
      location: "Mumbai, India",
      ip: "49.37.142.90",
      timestamp: "13 Aug 2026, 09:42 AM",
      status: "SUCCESS"
    }
  ],

  // 7. SERVICES & WORKFLOWS
  services: [
    { id: "srv-01", title: "Aadhaar Identity Linkage", category: "Government", provider: "UIDAI", fee: "Free", timeframe: "Instant", requiredDocs: ["doc-101"] },
    { id: "srv-02", title: "Driving Licence Renewal", category: "RTO", provider: "Parivahan Sewa (MoRTH)", fee: "₹200", timeframe: "1-2 Days", requiredDocs: ["doc-103"] },
    { id: "srv-03", title: "PAN Card Instant Link", category: "Finance", provider: "Income Tax Department", fee: "Free", timeframe: "Instant", requiredDocs: ["doc-102"] },
    { id: "srv-04", title: "ABHA Health Account Sync", category: "Healthcare", provider: "National Health Authority", fee: "Free", timeframe: "Instant", requiredDocs: ["doc-106"] },
    { id: "srv-05", title: "Voter ID E-EPIC Download", category: "Government", provider: "Election Commission of India", fee: "Free", timeframe: "Instant", requiredDocs: ["doc-104"] }
  ],

  categoryServices: {
    government: {
      category: "Government & Identity",
      provider: "UIDAI, ITD, MEA & Election Commission",
      lastSynced: "Today, 10:42 AM",
      records: [
        { id: "rec-gov-01", name: "Aadhaar Identity Reference", issuer: "UIDAI", maskedId: "XXXX XXXX 8942", status: "Verified" },
        { id: "rec-gov-02", name: "Permanent Account Number (PAN)", issuer: "Income Tax Dept", maskedId: "ABCDE1234F", status: "Verified" },
        { id: "rec-gov-03", name: "Digital Voter ID Card (EPIC)", issuer: "Election Commission of India", maskedId: "MH/07/008/421899", status: "Verified" }
      ]
    },
    healthcare: {
      category: "Healthcare & Medical",
      provider: "National Health Authority (NHA)",
      lastSynced: "Today, 09:15 AM",
      records: [
        { id: "rec-hlth-01", name: "ABHA Health Account Number", issuer: "National Health Authority", maskedId: "23-4521-8761-0043", status: "Verified" }
      ]
    },
    rto: {
      category: "RTO & Vehicles",
      provider: "Ministry of Road Transport and Highways",
      lastSynced: "Today, 11:30 AM",
      vehicles: [
        { regNo: "MH02CA0094321", model: "Maruti Swift Dzire (White)", rto: "MH02 - Mumbai West", status: "Active", validUntil: "10-03-2026" }
      ],
      records: [
        { id: "rec-rto-01", name: "Smart Driving Licence", issuer: "Parivahan Sewa (MoRTH)", maskedId: "MH02 20180094821", status: "Verified" }
      ]
    },
    finance: {
      category: "Banking & Finance",
      provider: "Income Tax Department & Reserve Bank Gateway",
      lastSynced: "Yesterday, 04:20 PM",
      records: [
        { id: "rec-fin-01", name: "Form 16 TDS Statement", issuer: "Income Tax Dept", maskedId: "FY-2023-24", status: "Verified" }
      ]
    },
    education: {
      category: "Education & Academic",
      provider: "National Academic Depository (NAD)",
      lastSynced: "10 Aug 2026",
      qualificationTimeline: [
        { year: "2001", level: "10th SSC Board", board: "Maharashtra State Board (85.6%)" },
        { year: "2003", level: "12th HSC Board", board: "Maharashtra State Board (Science)" },
        { year: "2007", level: "B.Tech Computer Science", board: "University of Mumbai" }
      ],
      records: [
        { id: "rec-edu-01", name: "B.Tech Degree Certificate", issuer: "University of Mumbai", maskedId: "MU-ENG-2007-984210", status: "Verified" }
      ]
    }
  },

  serviceActivities: [
    {
      id: "act-101",
      serviceTitle: "Driving Licence Renewal",
      provider: "Parivahan Sewa (MoRTH)",
      status: "Submitted / In Progress",
      appliedAt: "12 Aug 2026",
      referenceNo: "RTO-REF-984210",
      notes: "Application submitted securely using verified CivicOne vault document."
    }
  ],

  govtUpdates: [
    {
      id: "gov-001",
      title: "DigiLocker Integration with CivicOne — Official Notice",
      department: "Ministry of Electronics & IT (MeitY)",
      source: "Ministry of Electronics & IT (MeitY)",
      category: "Technology",
      content: "Citizens can now link DigiLocker credentials to their CivicOne Vault for unified digital identity access across government portals.",
      summary: "Citizens can link DigiLocker credentials to their CivicOne Vault.",
      publishedAt: "2026-08-12T09:00:00Z",
      date: "12 Aug 2026",
      unread: true,
      priority: "High"
    },
    {
      id: "gov-002",
      title: "Vehicle RC Renewal via Parivahan Online Service",
      department: "Parivahan Sewa — MoRTH",
      source: "Parivahan Sewa — MoRTH",
      category: "RTO",
      content: "Online renewal of vehicle registration certificates is now fully active through the Parivahan portal.",
      summary: "Online renewal of vehicle RCs active via Parivahan portal.",
      publishedAt: "2026-08-11T11:30:00Z",
      date: "11 Aug 2026",
      unread: true,
      priority: "Medium"
    }
  ],

  dailyNews: [
    {
      id: "news-001",
      title: "India Advances National Digital ID Framework",
      headline: "India Advances National Digital ID Framework",
      source: "CivicOne News Network",
      category: "Technology",
      snippet: "India continues to strengthen its digital identity ecosystem with unified verified credential portals.",
      summary: "India continues to strengthen its digital identity ecosystem.",
      publishedAt: "2026-08-13T07:30:00Z",
      date: "13 Aug 2026",
      readingTime: "3 min"
    }
  ],

  supportTickets: [],

  voterRecord: {
    name: "Rajesh Kumar",
    epicNo: "MH/07/008/421899",
    constituency: "Bandra West (Assembly Constituency 165)",
    state: "Maharashtra",
    pollingStation: "St. Stanislaus High School, Room 4",
    status: "Active Voter Record",
    verifiedAt: "2026-01-15",
    qrToken: "VOTER-TOKEN-984210-SECURE"
  },

  shareRequests: [],

  adminStats: {
    totalCitizens: "14,892,104",
    verifiedVaultDocs: "48,291,048",
    activeIssuingAuthorities: "1,240",
    systemUptime: "99.99%",
    securityThreatsBlocked: "42,910",
    serverLoad: "18% CPU / 4.2 GB RAM"
  },

  issuers: [
    { id: "iss-01", name: "Parivahan Sewa (MoRTH)", department: "Transport", officer: "Rakesh Sharma", status: "VERIFIED", issuedDocs: "12,482" },
    { id: "iss-02", name: "UIDAI National Desk", department: "Identity", officer: "Priya Menon", status: "VERIFIED", issuedDocs: "48,910" },
    { id: "iss-03", name: "National Health Authority", department: "Healthcare", officer: "Dr. A. K. Verma", status: "VERIFIED", issuedDocs: "9,210" }
  ],

  // Getters for single citizen/card access
  get citizen() {
    return this.citizens.find(c => c.citizenId === this.activeCitizenId) || this.citizens[0];
  },
  get card() {
    const c = this.citizen;
    return {
      civicId: c.citizenId,
      holderName: c.fullName,
      tier: c.tier || 'STANDARD',
      goldPassStatus: c.goldPassStatus || 'standard',
      tierBadge: c.goldPassStatus === 'active' ? '👑 Premium Gold Citizen' : 'Verified Citizen',
      status: "Verified Identity",
      issueDate: "15 Jan 2024",
      expiryDate: "14 Jan 2034",
      securityChipId: `CHIP-${c.citizenId}`,
      verificationToken: `CIV-TOKEN-${c.citizenId}-SECURE-2026`,
      qrSignature: "SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      verificationUrl: `http://localhost:3001/verify?token=CIV-TOKEN-${c.citizenId}-SECURE-2026`
    };
  }
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
