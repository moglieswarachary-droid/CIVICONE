// server/mockDb.js - In-memory Database & State Engine for CivicOne

export const db = {
  citizen: {
    name: "Rajesh Kumar",
    civicId: "CIV-984210",
    phone: "+91 9876543210",
    email: "rajesh.kumar@civicone.gov.in",
    dob: "15-08-1992",
    gender: "Male",
    maskedAadhaar: "XXXX XXXX 8942",
    identityStatus: "VERIFIED",
    verifiedAt: "2026-01-15T09:30:00Z",
    address: "Flat 402, Green Valley Towers, Bandra West, Mumbai, Maharashtra 400050",
    emergencyContact: "+91 9812345678 (Spouse - Priya Kumar)",
    bloodGroup: "O+",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
  },

  card: {
    civicId: "CIV-984210",
    holderName: "Rajesh Kumar",
    tier: "GOLD",
    tierBadge: "👑 Premium Gold Citizen",
    status: "Verified Identity",
    issueDate: "15 Jan 2024",
    expiryDate: "14 Jan 2034",
    securityChipId: "GOLD-CHIP-9984-SEC-ID",
    verificationToken: "CIV-TOKEN-984210-SECURE-2026",
    qrSignature: "SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    verificationUrl: "http://localhost:3000/verify?token=CIV-TOKEN-984210-SECURE-2026",
    perks: [
      "Priority VIP Public Service Clearance",
      "Cryptographic Gold Identity Seal",
      "Instant Multi-Department Vault Access",
      "24/7 Priority Emergency Verification"
    ]
  },

  documents: [
    {
      id: "doc-1",
      name: "Aadhaar Identity Reference",
      category: "Government",
      issuer: "Unique Identification Authority of India (UIDAI)",
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
      id: "doc-2",
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
      id: "doc-3",
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
      id: "doc-4",
      name: "Vehicle Registration (RC) - Hyundai Creta",
      category: "RTO",
      issuer: "Ministry of Road Transport and Highways (MoRTH)",
      status: "Verified",
      issueDate: "20-03-2021",
      expiryDate: "19-03-2036",
      refNo: "MH 02 CD 4589",
      fileType: "PDF",
      fileSize: "2.1 MB",
      icon: "Car",
      description: "Hyundai Creta SX 1.5 - Registration Certificate",
      securitySeal: "VAHAN-REG-SEAL-MH02CD4589",
      vehicleNo: "MH 02 CD 4589",
      vehicleModel: "Hyundai Creta SX 1.5",
      tags: ["Vehicle", "RTO"]
    },
    {
      id: "doc-4b",
      name: "Pollution Certificate (PUC)",
      category: "RTO",
      issuer: "Transport Dept, Govt of Maharashtra",
      status: "Expiring Soon",
      issueDate: "15-02-2026",
      expiryDate: "14-09-2026",
      refNo: "PUC-MH02CD4589-940",
      fileType: "PDF",
      fileSize: "620 KB",
      icon: "Compass",
      description: "Emission Control Compliance Certificate",
      securitySeal: "PUC-MH02-SEAL-OK",
      vehicleNo: "MH 02 CD 4589",
      tags: ["RTO", "Expiring Soon"]
    },
    {
      id: "doc-5",
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
      accessLogs: ["Self-access via CivicOne (Today)", "Apollo Hospital Dr. Sharma (08 Aug 2026)"],
      tags: ["Healthcare", "Private"]
    },
    {
      id: "doc-5b",
      name: "Comprehensive Medical Diagnostic Summary",
      category: "Healthcare",
      issuer: "Metropolis Diagnostics & Health Centre",
      status: "Verified",
      issueDate: "10-07-2026",
      expiryDate: "N/A",
      refNo: "METRO-LAB-2026-9048",
      fileType: "PDF",
      fileSize: "1.4 MB",
      icon: "Activity",
      description: "Annual Executive Health Checkup & Blood Pathology Report",
      securitySeal: "LAB-SEAL-ENCRYPTED",
      isPrivate: true,
      accessLogs: ["Self-access only (Consent-protected)"],
      tags: ["Medical", "Private"]
    },
    {
      id: "doc-6",
      name: "COVID-19 Vaccination Certificate",
      category: "Healthcare",
      issuer: "Ministry of Health & Family Welfare (CoWIN)",
      status: "Verified",
      issueDate: "12-01-2022",
      expiryDate: "Permanent",
      refNo: "COWIN-REF-90481029",
      fileType: "PDF",
      fileSize: "1.1 MB",
      icon: "Syringe",
      description: "Covishield Dose 1, 2 & Precautionary Dose Certificate",
      securitySeal: "COWIN-QR-CRYPT-OK",
      tags: ["Healthcare", "Vaccination"]
    },
    {
      id: "doc-7",
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
      academicLevel: "B.Tech Graduation",
      isFavorite: true,
      tags: ["Education", "Degree"]
    },
    {
      id: "doc-8",
      name: "Class XII Senior School Marksheet",
      category: "Education",
      issuer: "Central Board of Secondary Education (CBSE)",
      status: "Verified",
      issueDate: "25-05-2010",
      expiryDate: "N/A",
      refNo: "CBSE-XII-2010-940281",
      fileType: "PDF",
      fileSize: "1.5 MB",
      icon: "Award",
      description: "AISSCE Science Stream Academic Transcripts (94.2%)",
      securitySeal: "CBSE-NAD-SEAL-AUTHENTIC",
      academicLevel: "12th Senior Secondary",
      tags: ["Education", "CBSE"]
    },
    {
      id: "doc-8b",
      name: "Class X Secondary School Certificate",
      category: "Education",
      issuer: "Central Board of Secondary Education (CBSE)",
      status: "Verified",
      issueDate: "20-05-2008",
      expiryDate: "N/A",
      refNo: "CBSE-X-2008-840921",
      fileType: "PDF",
      fileSize: "1.3 MB",
      icon: "Award",
      description: "Class X All India Secondary School Examination Certificate",
      securitySeal: "CBSE-X-VERIFIED-NAD",
      academicLevel: "10th High School",
      tags: ["Education"]
    },
    {
      id: "doc-9",
      name: "TCS Senior Systems Engineer Experience Certificate",
      category: "Professional",
      issuer: "Tata Consultancy Services Ltd",
      status: "Verified",
      issueDate: "30-09-2021",
      expiryDate: "N/A",
      refNo: "TCS-EMP-EXP-840921",
      fileType: "PDF",
      fileSize: "1.7 MB",
      icon: "Briefcase",
      description: "Official Work Experience & Designation Credential",
      securitySeal: "TCS-CORP-VERIFIED-SIGN",
      skills: ["Cloud Architecture", "Node.js", "Enterprise Security"],
      tags: ["Career", "Employment"]
    },
    {
      id: "doc-9b",
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
      skills: ["AWS", "DevOps", "Cloud Security"],
      tags: ["Certification", "Expiring Soon"]
    },
    {
      id: "doc-10",
      name: "Confederation of Indian Industry (CII) Membership",
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
    {
      id: "doc-10b",
      name: "HDFC Bank Verified Account Statement & KYC Clearance",
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
      id: "doc-10c",
      name: "Form 16 Tax Income Clearance",
      category: "Finance",
      issuer: "Income Tax Dept / Employers Unified Portal",
      status: "Verified",
      issueDate: "15-06-2026",
      expiryDate: "N/A",
      refNo: "IT-FORM16-2025-26",
      fileType: "PDF",
      fileSize: "1.9 MB",
      icon: "DollarSign",
      description: "Annual Income Tax Deducted at Source (TDS) Certificate",
      securitySeal: "ITD-TDS-VERIFIED-2026",
      isPrivate: true,
      tags: ["Finance", "Tax"]
    },
    {
      id: "doc-11",
      name: "Indian Passport Copy",
      category: "Personal",
      issuer: "Ministry of External Affairs (MEA)",
      status: "Verified",
      issueDate: "14-04-2021",
      expiryDate: "13-04-2031",
      refNo: "Z4928109",
      fileType: "PDF",
      fileSize: "2.8 MB",
      icon: "Globe",
      description: "Personal Travel Document & Overseas Clearance",
      securitySeal: "MEA-PASSPORT-SEAL-VERIFIED",
      isFavorite: true,
      tags: ["Personal", "Travel", "Important"]
    },
    {
      id: "doc-12",
      name: "Property Title Deed & Clearance",
      category: "Personal",
      issuer: "Revenue Dept, Govt of Maharashtra",
      status: "Pending Verification",
      issueDate: "10-02-2026",
      expiryDate: "N/A",
      refNo: "MH-REV-PROP-2026-904",
      fileType: "PDF",
      fileSize: "4.2 MB",
      icon: "Home",
      description: "Property Ownership Registration Document",
      securitySeal: "SUB-REGISTRAR-PENDING-AUDIT",
      tags: ["Personal", "Property", "Pending"]
    }
  ],

  services: [
    {
      id: "srv-1",
      title: "Driving Licence Renewal",
      category: "RTO",
      provider: "Parivahan Sewa (MoRTH)",
      status: "Connected",
      badge: "Available Now",
      icon: "Car",
      description: "Submit online DL renewal application directly using verified RTO vault records.",
      timeframe: "3 - 5 Working Days",
      fee: "₹200 + Processing Fee",
      requiredDocs: ["Smart Driving Licence", "Aadhaar Identity Reference"],
      eligibility: "Valid for DLs expiring within 365 days or expired up to 1 year."
    },
    {
      id: "srv-2",
      title: "ABHA Health Locker Sync",
      category: "Healthcare",
      provider: "National Health Authority (NHA)",
      status: "Connected",
      badge: "Available Now",
      icon: "HeartPulse",
      description: "Link hospital lab reports and digital prescriptions seamlessly with ABHA health locker.",
      timeframe: "Instant Sync",
      fee: "Free (Govt Grant)",
      requiredDocs: ["ABHA Health Account Card"],
      eligibility: "All citizens with active ABHA ID."
    },
    {
      id: "srv-3",
      title: "Passport Fast-Track Verification",
      category: "Government",
      provider: "Passport Seva (Ministry of External Affairs)",
      status: "Connected",
      badge: "Available Now",
      icon: "Globe",
      description: "Fast-track address and identity verification using tokenized CivicOne credentials.",
      timeframe: "1 - 2 Business Days",
      fee: "₹1,500 (Tatkaal ₹2,000)",
      requiredDocs: ["Indian Passport Copy", "Aadhaar Identity Reference", "PAN Card"],
      eligibility: "Valid Indian citizens holding verified Aadhaar and PAN credentials."
    },
    {
      id: "srv-4",
      title: "Degree Verification for Employment",
      category: "Education",
      provider: "National Academic Depository (NAD / UGC)",
      status: "Connected",
      badge: "Available Now",
      icon: "GraduationCap",
      description: "Share tamper-proof university marksheet tokens directly with prospective employers.",
      timeframe: "Instant Token Issue",
      fee: "Free",
      requiredDocs: ["B.Tech Computer Science Degree", "Class XII Marksheet"],
      eligibility: "All verified academic degree holders."
    },
    {
      id: "srv-5",
      title: "State Income Certificate Service",
      category: "Government",
      provider: "State Revenue Department",
      status: "Connected",
      badge: "Available Now",
      icon: "Landmark",
      description: "Apply for official state annual income & domicile certificates using verified ITD Form 16.",
      timeframe: "2 - 4 Working Days",
      fee: "₹50",
      requiredDocs: ["Permanent Account Number (PAN)", "Aadhaar Identity Reference", "Form 16 Tax Income Clearance"],
      eligibility: "State residents requiring annual income tax clearance certificate."
    },
    {
      id: "srv-6",
      title: "Commercial & Private Fleet Vehicle Sync",
      category: "RTO",
      provider: "State Transport Authority (VAHAN)",
      status: "Connected",
      badge: "Available Now",
      icon: "Truck",
      description: "Link vehicle registration (RC), PUC, and insurance for instant fleet compliance clearance.",
      timeframe: "Instant Sync",
      fee: "Free",
      requiredDocs: ["Vehicle Registration (RC) - Hyundai Creta", "Pollution Certificate (PUC)"],
      eligibility: "All registered motor vehicle owners."
    },
    {
      id: "srv-7",
      title: "Traffic E-Challan Payment & Clearance",
      category: "RTO",
      provider: "MoRTH E-Challan System",
      status: "Connected",
      badge: "Available Now",
      icon: "Car",
      description: "Query outstanding vehicle fines and clear pending traffic e-challans instantly.",
      timeframe: "Instant Clearance",
      fee: "Variable as per Fine Amount",
      requiredDocs: ["Vehicle Registration (RC) - Hyundai Creta", "Smart Driving Licence"],
      eligibility: "All vehicle owners with active registration."
    },
    {
      id: "srv-8",
      title: "Property & Municipal Tax Clearance",
      category: "Government",
      provider: "Municipal Corporation Revenue Department",
      status: "Connected",
      badge: "Available Now",
      icon: "Landmark",
      description: "Verify property ownership deeds and request annual municipal property tax clearance certificate.",
      timeframe: "1 - 3 Working Days",
      fee: "₹100 Processing Fee",
      requiredDocs: ["Property Title Deed & Clearance", "Permanent Account Number (PAN)"],
      eligibility: "Registered property owners."
    }
  ],

  serviceActivities: [
    {
      id: "ACT-9041",
      serviceId: "srv-2",
      serviceTitle: "ABHA Health Locker Sync",
      provider: "National Health Authority",
      status: "Active Sync",
      appliedAt: "13 Aug 2026, 09:12 AM",
      referenceNo: "NHA-ABHA-SYNC-98421",
      notes: "Health locker connected. Hospital prescriptions auto-syncing."
    },
    {
      id: "ACT-8920",
      serviceId: "srv-1",
      serviceTitle: "Driving Licence Renewal",
      provider: "Parivahan Sewa (MoRTH)",
      status: "In Progress",
      appliedAt: "11 Aug 2026, 02:45 PM",
      referenceNo: "MH02-DL-REN-2026-9048",
      notes: "Application submitted to MH-02 RTO. Biometric re-check verified."
    }
  ],

  govtUpdates: [
    {
      id: "gup-1",
      title: "Mandatory Aadhaar-Linked Address Update Drive",
      category: "Identity & Security",
      priority: "High",
      date: "12 Aug 2026",
      source: "UIDAI Press Information Bureau",
      unread: true,
      content: "Citizens with documents older than 10 years are requested to update proof of identity and address seamlessly via CivicOne Vault at zero charge until October 31, 2026."
    },
    {
      id: "gup-2",
      title: "Unified Health ID Integration Activated for All Hospitals",
      category: "Healthcare",
      priority: "Medium",
      date: "08 Aug 2026",
      source: "Ministry of Health & Family Welfare",
      unread: true,
      content: "All empaneled government and private hospitals across 28 states can now query consent-based patient health records directly via CivicOne Healthcare vault."
    },
    {
      id: "gup-3",
      title: "High Security Registration Plate (HSRP) Compliance Notice",
      category: "Transport / RTO",
      priority: "Medium",
      date: "02 Aug 2026",
      source: "MoRTH Transport Wing",
      unread: false,
      content: "All motor vehicles registered prior to April 2019 must upload verified HSRP installation receipts into their RTO Vault category to avoid electronic challans."
    }
  ],

  dailyNews: [
    {
      id: "news-1",
      title: "India Expands Digital Public Infrastructure Model to 15 Partner Nations",
      source: "The Economic Times - Technology",
      date: "13 Aug 2026 | 09:15 AM",
      snippet: "The CivicOne open digital credential architecture is being adopted by international trade partners for cross-border identity verification."
    },
    {
      id: "news-2",
      title: "Reserve Bank of India Approves Zero-Paper KYC via Verified Vault Tokens",
      source: "Financial Express",
      date: "12 Aug 2026 | 04:30 PM",
      snippet: "Commercial banks can now onboard savings account customers in under 60 seconds using tokenized CivicOne Vault verification."
    },
    {
      id: "news-3",
      title: "CBSE and State Boards Complete 100% Digitization of Academic Degrees",
      source: "Press Trust of India (PTI)",
      date: "11 Aug 2026 | 02:00 PM",
      snippet: "Students graduating in 2026 can instantly claim cryptographically signed diplomas in their CivicOne Education Vault."
    }
  ],

  notifications: [
    {
      id: "notif-1",
      title: "Smart Driving Licence Verified",
      category: "Documents",
      message: "Your MH-02 Driving Licence record was successfully authenticated by MoRTH server.",
      timestamp: "10 minutes ago",
      read: false,
      type: "success"
    },
    {
      id: "notif-2",
      title: "Document Expiry Reminder",
      category: "Security",
      message: "Your driving licence (MH02 20180094821) expires in 792 days on 14-10-2028.",
      timestamp: "2 hours ago",
      read: false,
      type: "warning"
    },
    {
      id: "notif-3",
      title: "New Device Login Detected",
      category: "Security",
      message: "Logged in successfully from Chrome on Windows 11 (IP: 49.37.142.90).",
      timestamp: "Today, 09:30 AM",
      read: true,
      type: "info"
    }
  ],

  securityLogs: [
    {
      id: "sec-1",
      event: "Pre-Entry OTP Authenticated",
      device: "Chrome on Windows 11",
      location: "Mumbai, India",
      ip: "49.37.142.90",
      timestamp: "13 Aug 2026, 09:30:15 AM",
      status: "SUCCESS"
    },
    {
      id: "sec-2",
      event: "Tokenized Aadhaar Verification",
      device: "Chrome on Windows 11",
      location: "Mumbai, India",
      ip: "49.37.142.90",
      timestamp: "13 Aug 2026, 09:31:02 AM",
      status: "SUCCESS"
    },
    {
      id: "sec-3",
      event: "Virtual Card Dynamic QR Generated",
      device: "Chrome on Windows 11",
      location: "Mumbai, India",
      ip: "49.37.142.90",
      timestamp: "13 Aug 2026, 09:45:22 AM",
      status: "SUCCESS"
    },
    {
      id: "sec-4",
      event: "Passport Document Download Token Issued",
      device: "Safari on iOS 18",
      location: "Mumbai, India",
      ip: "49.37.142.90",
      timestamp: "11 Aug 2026, 06:12:40 PM",
      status: "SUCCESS"
    }
  ],

  supportTickets: [
    {
      id: "TKT-8849",
      subject: "Property Title Deed Verification Pending",
      category: "Document Verification",
      status: "In Progress",
      createdAt: "10 Aug 2026",
      lastUpdate: "Sub-Registrar office audit pending"
    }
  ],

  adminStats: {
    totalCitizens: "14,892,104",
    verifiedVaultDocs: "48,291,048",
    activeIssuingAuthorities: "1,240",
    systemUptime: "99.99%",
    securityThreatsBlocked: "42,910",
    serverLoad: "18% CPU / 4.2 GB RAM"
  },

  categoryServices: {
    government: {
      category: "Government & Identity",
      provider: "UIDAI, ITD, MEA & Revenue Dept",
      connected: true,
      lastSynced: "Today, 10:42 AM",
      requiresMfa: false,
      records: [
        { id: "gov-1", name: "Tokenized Aadhaar Identity Credential", issuer: "UIDAI", maskedId: "XXXX XXXX 8942", status: "VERIFIED", issueDate: "12-05-2016", expiryDate: "Lifetime" },
        { id: "gov-2", name: "Permanent Account Number (PAN)", issuer: "Income Tax Department", maskedId: "ABCDE1234F", status: "VERIFIED", issueDate: "18-09-2017", expiryDate: "N/A" },
        { id: "gov-3", name: "National Voter Identity Card", issuer: "Election Commission of India", maskedId: "EPIC-MH-904812", status: "VERIFIED", issueDate: "14-01-2019", expiryDate: "Permanent" },
        { id: "gov-4", name: "Indian Passport Record", issuer: "Ministry of External Affairs", maskedId: "Z4928109", status: "VERIFIED", issueDate: "14-04-2021", expiryDate: "13-04-2031" },
        { id: "gov-5", name: "State Domicile & Residence Certificate", issuer: "State Revenue Department", maskedId: "RES-MH-2022-9048", status: "VERIFIED", issueDate: "10-06-2022", expiryDate: "Lifetime" }
      ]
    },
    healthcare: {
      category: "Healthcare & Medical",
      provider: "National Health Authority (NHA / ABHA)",
      connected: true,
      lastSynced: "Today, 09:15 AM",
      requiresMfa: true,
      records: [
        { id: "hc-1", name: "ABHA Universal Health Identifier Card", issuer: "National Health Authority", maskedId: "ABHA-91-8493-2049-11", status: "VERIFIED", issueDate: "05-11-2022", expiryDate: "N/A", isProtected: true },
        { id: "hc-2", name: "Comprehensive Pathology & Diagnostic Summary", issuer: "Metropolis Health Centre", maskedId: "LAB-2026-9048", status: "VERIFIED", issueDate: "10-07-2026", expiryDate: "N/A", isProtected: true },
        { id: "hc-3", name: "Covishield Vaccination Certificate", issuer: "Ministry of Health & FW (CoWIN)", maskedId: "COWIN-90481029", status: "VERIFIED", issueDate: "12-01-2022", expiryDate: "Permanent", isProtected: false },
        { id: "hc-4", name: "Star Health Comprehensive Insurance Cover", issuer: "Star Health & Allied Insurance", maskedId: "POL-STAR-9048102", status: "VERIFIED", issueDate: "01-01-2026", expiryDate: "31-12-2026", isProtected: true }
      ],
      accessLogs: [
        { id: "hclog-1", accessor: "Self-Access via CivicOne Portal", timestamp: "Today, 09:15 AM", purpose: "Patient Record Audit", permission: "Owner Access" },
        { id: "hclog-2", accessor: "Apollo Hospital Dr. Sharma (Reg #69041)", timestamp: "08 Aug 2026, 04:30 PM", purpose: "Annual OPD Checkup", permission: "Time-Limited Consent" }
      ]
    },
    rto: {
      category: "RTO & Vehicles",
      provider: "Ministry of Road Transport and Highways (MoRTH)",
      connected: true,
      lastSynced: "Today, 11:05 AM",
      requiresMfa: false,
      licence: { id: "dl-1", name: "Smart Driving Licence", refNo: "MH02 20180094821", issuer: "RTO MH-02 Mumbai", status: "VERIFIED", expiryDate: "14-10-2028" },
      vehicles: [
        {
          registrationNo: "MH 02 CD 4589",
          model: "Hyundai Creta SX 1.5",
          rcStatus: "VERIFIED",
          rcExpiry: "19-03-2036",
          insuranceStatus: "ACTIVE",
          insuranceExpiry: "18-03-2027",
          pucStatus: "EXPIRING SOON",
          pucExpiry: "14-09-2026",
          fitnessStatus: "FIT"
        },
        {
          registrationNo: "KA 05 MA 9402",
          model: "Royal Enfield Classic 350",
          rcStatus: "VERIFIED",
          rcExpiry: "10-05-2035",
          insuranceStatus: "ACTIVE",
          insuranceExpiry: "09-05-2027",
          pucStatus: "ACTIVE",
          pucExpiry: "20-11-2026",
          fitnessStatus: "FIT"
        }
      ]
    },
    finance: {
      category: "Banking & Finance",
      provider: "Unified Banking & Income Tax Network",
      connected: true,
      lastSynced: "Today, 08:30 AM",
      requiresMfa: true,
      records: [
        { id: "fin-1", name: "HDFC Bank Savings Primary Account", issuer: "HDFC Bank Ltd", maskedId: "XXXX XXXX 4567 (HDFC)", status: "VERIFIED", issueDate: "01-04-2026", expiryDate: "N/A" },
        { id: "fin-2", name: "Form 16 Tax Income Clearance", issuer: "Income Tax Dept / Employer", maskedId: "IT-FORM16-2025-26", status: "VERIFIED", issueDate: "15-06-2026", expiryDate: "N/A" },
        { id: "fin-3", name: "ICICI Lombard Home Insurance Policy", issuer: "ICICI Lombard General Insurance", maskedId: "POL-ICICI-849201", status: "VERIFIED", issueDate: "10-02-2026", expiryDate: "09-02-2027" }
      ]
    },
    education: {
      category: "Education & Academic",
      provider: "National Academic Depository (NAD / UGC)",
      connected: true,
      lastSynced: "Yesterday",
      requiresMfa: false,
      qualificationTimeline: [
        { level: "10th High School", year: "2008", board: "CBSE", refNo: "CBSE-X-2008-840921", status: "VERIFIED" },
        { level: "12th Senior Secondary", year: "2010", board: "CBSE (Science 94.2%)", refNo: "CBSE-XII-2010-940281", status: "VERIFIED" },
        { level: "B.Tech Computer Science", year: "2014", board: "IIT Bombay", refNo: "IITB-DEGREE-2014-CS-094", status: "VERIFIED" }
      ],
      records: [
        { id: "edu-1", name: "B.Tech Computer Science Degree", issuer: "IIT Bombay", maskedId: "IITB-DEGREE-2014-CS-094", status: "VERIFIED", issueDate: "10-06-2014", expiryDate: "N/A" },
        { id: "edu-2", name: "Class XII Senior School Marksheet", issuer: "CBSE", maskedId: "CBSE-XII-2010-940281", status: "VERIFIED", issueDate: "25-05-2010", expiryDate: "N/A" },
        { id: "edu-3", name: "Class X Secondary School Certificate", issuer: "CBSE", maskedId: "CBSE-X-2008-840921", status: "VERIFIED", issueDate: "20-05-2008", expiryDate: "N/A" }
      ]
    },
    professional: {
      category: "Professional & Career",
      provider: "Corporate Verification & AWS Credential Engine",
      connected: true,
      lastSynced: "10 Aug 2026",
      requiresMfa: false,
      skills: ["Cloud Architecture", "Node.js Enterprise APIs", "DevOps & Security", "React Frontend Architecture"],
      records: [
        { id: "prof-1", name: "TCS Senior Systems Engineer Certificate", issuer: "Tata Consultancy Services Ltd", maskedId: "TCS-EMP-EXP-840921", status: "VERIFIED", issueDate: "30-09-2021", expiryDate: "N/A" },
        { id: "prof-2", name: "AWS Certified Solutions Architect Token", issuer: "Amazon Web Services (AWS)", maskedId: "AWS-CERT-SA-904812", status: "VERIFIED", issueDate: "15-11-2023", expiryDate: "14-11-2026" }
      ]
    },
    organization: {
      category: "Organization & Membership",
      provider: "Institutional Access Portal",
      connected: true,
      lastSynced: "01 Aug 2026",
      requiresMfa: false,
      records: [
        { id: "org-1", name: "Confederation of Indian Industry (CII) Membership", issuer: "Confederation of Indian Industry", maskedId: "CII-MEM-2024-9402", status: "VERIFIED", issueDate: "01-01-2024", expiryDate: "31-12-2026" }
      ]
    },
    personal: {
      category: "Personal Documents",
      provider: "CivicVault Encrypted User Storage",
      connected: true,
      lastSynced: "Today",
      requiresMfa: false,
      records: [
        { id: "pers-1", name: "Property Title Deed & Clearance", issuer: "Revenue Dept, Govt of Maharashtra", maskedId: "MH-REV-PROP-2026-904", status: "PENDING VERIFICATION", issueDate: "10-02-2026", expiryDate: "N/A" }
      ]
    }
  },

  citizens: [
    { id: "cit-101", name: "Ananya Sharma", civicId: "CIV-9048-1029-4821", phone: "+91 98765 43210", maskedAadhaar: "XXXX XXXX 8942", status: "ACTIVE", tier: "Gold Citizen Pass", docsCount: 12, registeredAt: "14 Jan 2026" },
    { id: "cit-102", name: "Vikramaditya Rao", civicId: "CIV-8921-4092-1102", phone: "+91 98123 45678", maskedAadhaar: "XXXX XXXX 1102", status: "ACTIVE", tier: "Standard", docsCount: 8, registeredAt: "20 Feb 2026" },
    { id: "cit-103", name: "Priya Sundaram", civicId: "CIV-7810-3301-9920", phone: "+91 97654 32109", maskedAadhaar: "XXXX XXXX 9920", status: "ACTIVE", tier: "Gold Citizen Pass", docsCount: 15, registeredAt: "05 Mar 2026" },
    { id: "cit-104", name: "Devendra Patel", civicId: "CIV-6502-8812-4019", phone: "+91 96543 21098", maskedAadhaar: "XXXX XXXX 4019", status: "ACTIVE", tier: "Standard", docsCount: 6, registeredAt: "18 Apr 2026" },
    { id: "cit-105", name: "Sunita Deshmukh", civicId: "CIV-5401-2291-7734", phone: "+91 95432 10987", maskedAadhaar: "XXXX XXXX 7734", status: "LOCKED", tier: "Standard", docsCount: 4, registeredAt: "30 May 2026" }
  ],

  issuers: [
    { id: "iss-1", officerName: "Officer Rajesh Sharma", department: "Parivahan Sewa (MoRTH / RTO)", badgeId: "GOVT-OFFICER-8942", email: "officer.sharma@parivahan.gov.in", status: "APPROVED", issuedCount: 4820 },
    { id: "iss-2", officerName: "Dr. Alok Verma", department: "National Health Authority (NHA / ABHA)", badgeId: "NHA-OFFICER-1104", email: "alok.verma@nha.gov.in", status: "APPROVED", issuedCount: 9140 },
    { id: "iss-3", officerName: "Meenakshi Iyer", department: "Income Tax Department (ITD)", badgeId: "ITD-OFFICER-5521", email: "meenakshi.iyer@incometax.gov.in", status: "APPROVED", issuedCount: 12400 },
    { id: "iss-4", officerName: "Sanjay Kulkarni", department: "Passport Seva (MEA)", badgeId: "MEA-OFFICER-3390", email: "sanjay.k@passportindia.gov.in", status: "PENDING APPROVAL", issuedCount: 0 }
  ]
};

