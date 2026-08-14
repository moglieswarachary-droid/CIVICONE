// server/mockDb.js - Relational Synthetic In-Memory Multi-Citizen Database & Access Control Engine

export const db = {
  // Active Authenticated Citizen ID (Default: CIV-DEMO-10001 - Aarav Kumar)
  activeCitizenId: "CIV-DEMO-10001",

  // 1. MASTER SYNTHETIC CITIZEN DATASET (Clearly Marked Synthetic / Demo Records)
  citizens: [
    {
      id: "cit-demo-10001",
      citizenId: "CIV-DEMO-10001",
      fullName: "Aarav Kumar",
      displayName: "Aarav",
      dateOfBirth: "15-07-2004",
      gender: "Male",
      profileImage: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
      mobile: "+91-90000-00001",
      mobileMasked: "+91 90000 00001",
      email: "aarav.demo@civicone.example",
      emailMasked: "aarav.demo@civicone.example",
      address: "Door 4-12, MG Road, Vijayawada, Andhra Pradesh 520002",
      addressSummary: "Vijayawada, Andhra Pradesh",
      state: "Andhra Pradesh",
      trustLevel: "Verified Demo Citizen",
      verificationStatus: "Verified Demo",
      securityScore: 99,
      createdAt: "2026-01-10T08:00:00Z",
      virtualCardId: "VCD-STD-10001",
      virtualCardStatus: "ACTIVE",
      tier: "STANDARD",
      goldPassStatus: "standard",
      bloodGroup: "O+",
      emergencyContact: "+91 90000 00099 (Parent - Ramesh Kumar)",
      maskedAadhaar: "XXXX XXXX 1001",
      isDemo: true,
      demoLabel: "DEMO DATA — NOT A REAL CITIZEN",
      educationInfo: {
        institution: "CivicOne Demo Institute",
        course: "B.Tech Computer Science",
        year: "2023–2027",
        status: "Pursuing",
        school: "CivicOne Model School",
        transferCertificate: "Available",
        marksheets: "Available"
      },
      governmentInfo: {
        voterId: "DEMO-VOTER-10001",
        drivingLicence: "DEMO-DL-10001"
      },
      rtoInfo: {
        vehicleRegistration: "AP-DEMO-1001",
        vehicleModel: "TVS Jupiter 125 (Blue)",
        validUntil: "2028-12-31"
      },
      healthcareInfo: {
        abhaId: "ABHA-DEMO-10001-90",
        bloodGroup: "O+",
        allergies: "None Reported (Synthetic Record)",
        lastHealthCheck: "15 Jan 2026"
      },
      travelInfo: {
        passport: "DEMO-PASS-10001",
        passportExpiry: "2034-05-20"
      }
    },
    {
      id: "cit-demo-10002",
      citizenId: "CIV-DEMO-10002",
      fullName: "Priya Sharma",
      displayName: "Priya",
      dateOfBirth: "22-09-2002",
      gender: "Female",
      profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
      mobile: "+91-90000-00002",
      mobileMasked: "+91 90000 00002",
      email: "priya.demo@civicone.example",
      emailMasked: "priya.demo@civicone.example",
      address: "Flat 302, Cyber Heights, Gachibowli, Hyderabad, Telangana 500032",
      addressSummary: "Hyderabad, Telangana",
      state: "Telangana",
      trustLevel: "Verified Demo Citizen",
      verificationStatus: "Verified Demo",
      securityScore: 97,
      createdAt: "2026-01-12T10:30:00Z",
      virtualCardId: "VCD-GOLD-10002",
      virtualCardStatus: "ACTIVE",
      tier: "GOLD",
      goldPassStatus: "active",
      goldPassExpiry: "2027-08-14",
      bloodGroup: "A+",
      emergencyContact: "+91 90000 00088 (Father - S. Sharma)",
      maskedAadhaar: "XXXX XXXX 1002",
      isDemo: true,
      demoLabel: "DEMO DATA — NOT A REAL CITIZEN",
      educationInfo: {
        institution: "CivicOne Tech University",
        course: "M.Tech Data Science",
        year: "2024–2026",
        status: "Graduated",
        school: "Hyderabad Public Model School",
        transferCertificate: "Available",
        marksheets: "Available"
      },
      governmentInfo: {
        voterId: "DEMO-VOTER-10002",
        drivingLicence: "DEMO-DL-10002"
      },
      rtoInfo: {
        vehicleRegistration: "TS-DEMO-1002",
        vehicleModel: "Hyundai i20 (White)",
        validUntil: "2029-06-30"
      },
      healthcareInfo: {
        abhaId: "ABHA-DEMO-10002-88",
        bloodGroup: "A+",
        allergies: "Penicillin (Synthetic Record)",
        lastHealthCheck: "02 Feb 2026"
      },
      travelInfo: {
        passport: "DEMO-PASS-10002",
        passportExpiry: "2033-11-10"
      }
    },
    {
      id: "cit-demo-10003",
      citizenId: "CIV-DEMO-10003",
      fullName: "Rajesh Patel",
      displayName: "Rajesh",
      dateOfBirth: "10-04-1995",
      gender: "Male",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
      mobile: "+91-90000-00003",
      mobileMasked: "+91 90000 00003",
      email: "rajesh.demo@civicone.example",
      emailMasked: "rajesh.demo@civicone.example",
      address: "Plot 88, CG Road, Navrangpura, Ahmedabad, Gujarat 380009",
      addressSummary: "Ahmedabad, Gujarat",
      state: "Gujarat",
      trustLevel: "Verified Demo Citizen",
      verificationStatus: "Verified Demo",
      securityScore: 95,
      createdAt: "2026-01-15T14:20:00Z",
      virtualCardId: "VCD-STD-10003",
      virtualCardStatus: "ACTIVE",
      tier: "STANDARD",
      goldPassStatus: "standard",
      bloodGroup: "B+",
      emergencyContact: "+91 90000 00077 (Spouse - Meena Patel)",
      maskedAadhaar: "XXXX XXXX 1003",
      isDemo: true,
      demoLabel: "DEMO DATA — NOT A REAL CITIZEN",
      educationInfo: {
        institution: "Gujarat Engineering College",
        course: "B.E Mechanical",
        year: "2013–2017",
        status: "Graduated",
        school: "Ahmedabad Model School",
        transferCertificate: "Available",
        marksheets: "Available"
      },
      governmentInfo: {
        voterId: "DEMO-VOTER-10003",
        drivingLicence: "DEMO-DL-10003"
      },
      rtoInfo: {
        vehicleRegistration: "GJ-DEMO-1003",
        vehicleModel: "Honda City (Silver)",
        validUntil: "2027-04-15"
      },
      healthcareInfo: {
        abhaId: "ABHA-DEMO-10003-77",
        bloodGroup: "B+",
        allergies: "Dust (Synthetic Record)",
        lastHealthCheck: "10 Mar 2026"
      },
      travelInfo: {
        passport: "DEMO-PASS-10003",
        passportExpiry: "2031-08-05"
      }
    },
    {
      id: "cit-demo-10004",
      citizenId: "CIV-DEMO-10004",
      fullName: "Ananya Verma",
      displayName: "Ananya",
      dateOfBirth: "05-11-2003",
      gender: "Female",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      mobile: "+91-90000-00004",
      mobileMasked: "+91 90000 00004",
      address: "House 12, Connaught Place, New Delhi, Delhi 110001",
      addressSummary: "New Delhi, Delhi",
      state: "Delhi",
      trustLevel: "Verified Demo Citizen",
      verificationStatus: "Verified Demo",
      securityScore: 98,
      createdAt: "2026-01-18T09:00:00Z",
      virtualCardId: "VCD-GOLD-10004",
      virtualCardStatus: "ACTIVE",
      tier: "GOLD",
      goldPassStatus: "active",
      goldPassExpiry: "2027-08-14",
      bloodGroup: "AB+",
      emergencyContact: "+91 90000 00066 (Mother - S. Verma)",
      maskedAadhaar: "XXXX XXXX 1004",
      isDemo: true,
      demoLabel: "DEMO DATA — NOT A REAL CITIZEN",
      educationInfo: {
        institution: "CivicOne School of Planning",
        course: "B.Arch Architecture",
        year: "2021–2026",
        status: "Pursuing",
        school: "Delhi Public Convent School",
        transferCertificate: "Available",
        marksheets: "Available"
      },
      governmentInfo: {
        voterId: "DEMO-VOTER-10004",
        drivingLicence: "DEMO-DL-10004"
      },
      rtoInfo: {
        vehicleRegistration: "DL-DEMO-1004",
        vehicleModel: "Tata Nexon EV (Teal)",
        validUntil: "2030-01-15"
      },
      healthcareInfo: {
        abhaId: "ABHA-DEMO-10004-66",
        bloodGroup: "AB+",
        allergies: "None Reported (Synthetic Record)",
        lastHealthCheck: "12 Apr 2026"
      },
      travelInfo: {
        passport: "DEMO-PASS-10004",
        passportExpiry: "2035-02-14"
      }
    },
    {
      id: "cit-demo-10005",
      citizenId: "CIV-DEMO-10005",
      fullName: "Vikram Singh",
      displayName: "Vikram",
      dateOfBirth: "18-02-1998",
      gender: "Male",
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
      mobile: "+91-90000-00005",
      mobileMasked: "+91 90000 00005",
      address: "No 77, Indiranagar 100ft Road, Bengaluru, Karnataka 560038",
      addressSummary: "Bengaluru, Karnataka",
      state: "Karnataka",
      trustLevel: "Verified Demo Citizen",
      verificationStatus: "Verified Demo",
      securityScore: 96,
      createdAt: "2026-01-20T11:00:00Z",
      virtualCardId: "VCD-STD-10005",
      virtualCardStatus: "ACTIVE",
      tier: "STANDARD",
      goldPassStatus: "standard",
      bloodGroup: "O-",
      emergencyContact: "+91 90000 00055 (Brother - K. Singh)",
      maskedAadhaar: "XXXX XXXX 1005",
      isDemo: true,
      demoLabel: "DEMO DATA — NOT A REAL CITIZEN",
      educationInfo: {
        institution: "CivicOne Institute of Technology",
        course: "M.Tech Mechanical Engineering",
        year: "2020–2022",
        status: "Graduated",
        school: "Bengaluru Army School",
        transferCertificate: "Available",
        marksheets: "Available"
      },
      governmentInfo: {
        voterId: "DEMO-VOTER-10005",
        drivingLicence: "DEMO-DL-10005"
      },
      rtoInfo: {
        vehicleRegistration: "KA-DEMO-1005",
        vehicleModel: "Royal Enfield Himalayan (Black)",
        validUntil: "2032-11-20"
      },
      healthcareInfo: {
        abhaId: "ABHA-DEMO-10005-55",
        bloodGroup: "O-",
        allergies: "Pollen (Synthetic Record)",
        lastHealthCheck: "20 May 2026"
      },
      travelInfo: {
        passport: "DEMO-PASS-10005",
        passportExpiry: "2032-09-01"
      }
    }
  ],

  // 2. STRUCTURED DIGITAL VAULT RECORDS (Tied by citizenId across all required categories)
  documents: [
    // --- CITIZEN 1: CIV-DEMO-10001 (Aarav Kumar) ---
    // 1. Academic Documents & Certificates
    {
      id: "doc-aarav-05",
      citizenId: "CIV-DEMO-10001",
      name: "Class X Secondary Marksheet",
      category: "academic",
      type: "document",
      issuer: "CivicOne Model School / Board of Secondary Education",
      status: "Verified",
      issueDate: "10-06-2020",
      expiryDate: "N/A",
      refNo: "DEMO-SSC-2020-10001",
      fileType: "PDF",
      fileSize: "1.4 MB",
      icon: "GraduationCap",
      description: "10th Standard Secondary Marksheet Record (94.2% Aggregate).",
      securitySeal: "BSE-BOARD-SYNTHETIC-VERIFIED",
      isFavorite: true,
      tags: ["academic", "Marksheet", "10th", "Demo"],
      isDemo: true
    },
    {
      id: "doc-aarav-06",
      citizenId: "CIV-DEMO-10001",
      name: "Intermediate Class XII Certificate",
      category: "academic",
      type: "certificate",
      issuer: "CivicOne Model School / Board of Intermediate Education",
      status: "Verified",
      issueDate: "05-06-2022",
      expiryDate: "N/A",
      refNo: "DEMO-HSC-2022-10001",
      fileType: "PDF",
      fileSize: "1.6 MB",
      icon: "GraduationCap",
      description: "12th Standard Intermediate Marksheet & Pass Certificate.",
      securitySeal: "BIE-BOARD-SYNTHETIC-VERIFIED",
      tags: ["academic", "Intermediate", "12th", "Demo"],
      isDemo: true
    },
    {
      id: "doc-aarav-07",
      citizenId: "CIV-DEMO-10001",
      name: "School Transfer Certificate (TC)",
      category: "academic",
      type: "document",
      issuer: "CivicOne Model School",
      status: "Verified",
      issueDate: "15-06-2023",
      expiryDate: "N/A",
      refNo: "DEMO-TC-2023-10001",
      fileType: "PDF",
      fileSize: "950 KB",
      icon: "FileCheck",
      description: "Official School Transfer Certificate & Conduct Clearance.",
      securitySeal: "SCHOOL-TC-SYNTHETIC-AUTHENTIC",
      tags: ["academic", "TC", "Admission", "Demo"],
      isDemo: true
    },
    {
      id: "doc-aarav-08",
      citizenId: "CIV-DEMO-10001",
      name: "B.Tech Degree Certificate",
      category: "academic",
      type: "certificate",
      issuer: "CivicOne Demo Institute",
      status: "Verified",
      issueDate: "01-08-2023",
      expiryDate: "31-07-2027",
      refNo: "DEMO-ADM-2023-CS101",
      fileType: "PDF",
      fileSize: "1.8 MB",
      icon: "BookOpen",
      description: "B.Tech Computer Science & Engineering Degree Certificate.",
      securitySeal: "INSTITUTE-ADM-VERIFIED-HASH",
      tags: ["academic", "Degree", "College", "Demo"],
      isDemo: true
    },
    {
      id: "doc-aarav-13",
      citizenId: "CIV-DEMO-10001",
      name: "AI Engineering Internship Certificate",
      category: "academic",
      type: "certificate",
      issuer: "National Skill Portal / Tech Academy",
      status: "Verified",
      issueDate: "10-01-2025",
      expiryDate: "N/A",
      refNo: "DEMO-INT-2025-CS09",
      fileType: "PDF",
      fileSize: "1.1 MB",
      icon: "Award",
      description: "Verified Internship Certificate in Web Engineering.",
      securitySeal: "TECH-INT-SYNTHETIC-VERIFIED",
      tags: ["academic", "Internship", "Certificate", "Demo"],
      isDemo: true
    },

    // 2. Government Authorized Documents & Certificates
    {
      id: "doc-aarav-01",
      citizenId: "CIV-DEMO-10001",
      name: "Tokenized Aadhaar Record",
      category: "government",
      type: "document",
      issuer: "UIDAI — Unique Identification Authority of India",
      status: "Verified",
      issueDate: "15-07-2020",
      expiryDate: "Lifetime",
      refNo: "DEMO-AADHAAR-10001",
      fileType: "PDF",
      fileSize: "1.2 MB",
      icon: "ShieldCheck",
      description: "Official Tokenized Synthetic Aadhaar Identity Record.",
      securitySeal: "UIDAI-SYNTHETIC-SEAL-VERIFIED",
      isFavorite: true,
      tags: ["government", "Aadhaar", "Demo"],
      isDemo: true
    },
    {
      id: "doc-aarav-02",
      citizenId: "CIV-DEMO-10001",
      name: "Permanent Account Number (PAN)",
      category: "government",
      type: "document",
      issuer: "Income Tax Department — GoI",
      status: "Verified",
      issueDate: "10-08-2022",
      expiryDate: "N/A",
      refNo: "DEMO-PAN-10001",
      fileType: "PDF",
      fileSize: "850 KB",
      icon: "FileText",
      description: "Verified Synthetic PAN Identity Card Record.",
      securitySeal: "ITD-PAN-SYNTHETIC-SEAL",
      isFavorite: true,
      tags: ["government", "PAN", "Demo"],
      isDemo: true
    },
    {
      id: "doc-aarav-03",
      citizenId: "CIV-DEMO-10001",
      name: "National Voter ID Card (EPIC)",
      category: "government",
      type: "document",
      issuer: "Election Commission of India",
      status: "Verified",
      issueDate: "01-01-2023",
      expiryDate: "Permanent",
      refNo: "DEMO-VOTER-10001",
      fileType: "PDF",
      fileSize: "1.1 MB",
      icon: "Vote",
      description: "Synthetic Voter ID Card Registered in Vijayawada Constituency.",
      securitySeal: "ECI-EPIC-DEMO-SEAL",
      tags: ["government", "Voter ID", "Demo"],
      isDemo: true
    },
    {
      id: "doc-aarav-04",
      citizenId: "CIV-DEMO-10001",
      name: "Indian Passport",
      category: "government",
      type: "document",
      issuer: "Ministry of External Affairs — Passport Seva",
      status: "Verified",
      issueDate: "21-05-2024",
      expiryDate: "20-05-2034",
      refNo: "DEMO-PASS-10001",
      fileType: "PDF",
      fileSize: "2.1 MB",
      icon: "Plane",
      description: "Synthetic Passport Identity Document for Travel Verification.",
      securitySeal: "MEA-PASS-DEMO-VERIFIED",
      isPrivate: true,
      tags: ["government", "Passport", "Travel", "Demo"],
      isDemo: true
    },
    {
      id: "doc-aarav-09",
      citizenId: "CIV-DEMO-10001",
      name: "State Income Certificate",
      category: "government",
      type: "certificate",
      issuer: "Revenue Department, Govt of AP",
      status: "Verified",
      issueDate: "12-04-2025",
      expiryDate: "11-04-2026",
      refNo: "DEMO-INC-2025-10001",
      fileType: "PDF",
      fileSize: "1.0 MB",
      icon: "Landmark",
      description: "Official State Revenue Income Certificate Record.",
      securitySeal: "REV-AP-INCOME-SEAL",
      tags: ["government", "Income", "Demo"],
      isDemo: true
    },
    {
      id: "doc-aarav-10",
      citizenId: "CIV-DEMO-10001",
      name: "Residence & Domicile Certificate",
      category: "government",
      type: "certificate",
      issuer: "Revenue Department, Govt of AP",
      status: "Verified",
      issueDate: "15-05-2023",
      expiryDate: "Lifetime",
      refNo: "DEMO-DOM-2023-10001",
      fileType: "PDF",
      fileSize: "1.1 MB",
      icon: "Home",
      description: "State Residence & Domicile Verification Record.",
      securitySeal: "REV-AP-DOMICILE-SEAL",
      tags: ["government", "Residence", "Demo"],
      isDemo: true
    },

    // 3. RTO & Vehicles Documents & Certificates
    {
      id: "doc-aarav-11",
      citizenId: "CIV-DEMO-10001",
      name: "Smart Driving Licence",
      category: "rto",
      type: "document",
      issuer: "Regional Transport Office (RTO AP-16 Vijayawada)",
      status: "Verified",
      issueDate: "10-10-2022",
      expiryDate: "09-10-2042",
      refNo: "DEMO-DL-10001",
      fileType: "PDF",
      fileSize: "1.5 MB",
      icon: "Car",
      description: "Motor Transport Driving Licence for LMV & Motorcycle with Gear.",
      securitySeal: "RTO-AP-DL-AUTHENTICATED",
      isFavorite: true,
      tags: ["rto", "Driving Licence", "Demo"],
      isDemo: true
    },
    {
      id: "doc-aarav-12",
      citizenId: "CIV-DEMO-10001",
      name: "Vehicle Registration Certificate (RC)",
      category: "rto",
      type: "document",
      issuer: "Parivahan Sewa — RTO AP-16",
      status: "Verified",
      issueDate: "05-11-2023",
      expiryDate: "04-11-2038",
      refNo: "AP-DEMO-1001",
      fileType: "PDF",
      fileSize: "1.3 MB",
      icon: "Shield",
      description: "Registration Certificate for TVS Jupiter 125 (Blue).",
      securitySeal: "PARIVAHAN-RC-SYNTHETIC-OK",
      tags: ["rto", "RC", "Demo"],
      isDemo: true
    },
    {
      id: "doc-aarav-14",
      citizenId: "CIV-DEMO-10001",
      name: "Vehicle Insurance Certificate",
      category: "rto",
      type: "certificate",
      issuer: "National Insurance Co / Parivahan",
      status: "Verified",
      issueDate: "01-09-2025",
      expiryDate: "31-08-2026",
      refNo: "DEMO-INS-2025-4401",
      fileType: "PDF",
      fileSize: "1.2 MB",
      icon: "Shield",
      description: "Comprehensive Motor Vehicle Insurance Certificate.",
      securitySeal: "INS-PARIVAHAN-SYNTHETIC-OK",
      tags: ["rto", "Insurance", "Demo"],
      isDemo: true
    },
    {
      id: "doc-aarav-15",
      citizenId: "CIV-DEMO-10001",
      name: "Pollution Under Control (PUC) Certificate",
      category: "rto",
      type: "certificate",
      issuer: "Parivahan Emission Control Portal",
      status: "Verified",
      issueDate: "15-02-2026",
      expiryDate: "14-08-2026",
      refNo: "DEMO-PUC-2026-8802",
      fileType: "PDF",
      fileSize: "680 KB",
      icon: "FileCheck",
      description: "Valid Pollution Control Compliance Certificate.",
      securitySeal: "PUC-PARIVAHAN-SYNTHETIC-OK",
      tags: ["rto", "PUC", "Demo"],
      isDemo: true
    },
    // Category 5: Healthcare
    {
      id: "doc-aarav-13",
      citizenId: "CIV-DEMO-10001",
      name: "ABHA Synthetic Digital Health Record",
      category: "Healthcare",
      issuer: "National Health Authority (NHA)",
      status: "Verified",
      issueDate: "10-01-2024",
      expiryDate: "N/A",
      refNo: "ABHA-DEMO-10001-90",
      fileType: "PDF",
      fileSize: "920 KB",
      icon: "HeartPulse",
      description: "Universal ABHA Digital Health Identifier & Synthetic Vaccination Summary.",
      securitySeal: "NHA-ABHA-SYNTHETIC-AUTHENTIC",
      isPrivate: true,
      tags: ["Healthcare", "ABHA", "Private", "Demo"],
      isDemo: true
    },
    // Category 6: Travel
    {
      id: "doc-aarav-14",
      citizenId: "CIV-DEMO-10001",
      name: "Travel Identity Verification & Booking Token",
      category: "Travel",
      issuer: "CivicOne Travel Gateway",
      status: "Verified",
      issueDate: "01-08-2026",
      expiryDate: "31-08-2026",
      refNo: "DEMO-TRV-2026-9001",
      fileType: "PDF",
      fileSize: "880 KB",
      icon: "Compass",
      description: "Verified Travel Identity Token for Airport / Hotel Check-in.",
      securitySeal: "CIVIC-TRAVEL-TOKEN-SEAL",
      tags: ["Travel", "Identity", "Booking", "Demo"],
      isDemo: true
    },

    // --- CITIZEN 2: CIV-DEMO-10002 (Priya Sharma) ---
    {
      id: "doc-priya-01",
      citizenId: "CIV-DEMO-10002",
      name: "Tokenized Aadhaar Record",
      category: "Identity",
      issuer: "UIDAI",
      status: "Verified",
      issueDate: "22-09-2018",
      expiryDate: "Lifetime",
      refNo: "DEMO-AADHAAR-10002",
      fileType: "PDF",
      fileSize: "1.2 MB",
      icon: "ShieldCheck",
      description: "Tokenized Aadhaar Record for Priya Sharma.",
      securitySeal: "UIDAI-SYNTHETIC-SEAL-VERIFIED",
      tags: ["Identity", "Aadhaar", "Demo"],
      isDemo: true
    },
    {
      id: "doc-priya-02",
      citizenId: "CIV-DEMO-10002",
      name: "M.Tech Data Science Degree",
      category: "Education",
      issuer: "CivicOne Tech University",
      status: "Verified",
      issueDate: "12-07-2026",
      expiryDate: "N/A",
      refNo: "DEMO-MTECH-2026-02",
      fileType: "PDF",
      fileSize: "2.9 MB",
      icon: "GraduationCap",
      description: "Master of Technology Degree in Data Science.",
      securitySeal: "NAD-TECH-UNIV-VERIFIED",
      tags: ["Education", "Degree", "Demo"],
      isDemo: true
    },

    // --- CITIZEN 3: CIV-DEMO-10003 (Rajesh Patel) ---
    {
      id: "doc-rajesh-01",
      citizenId: "CIV-DEMO-10003",
      name: "Smart Driving Licence",
      category: "Vehicle/RTO",
      issuer: "Parivahan Sewa — RTO GJ-01 Ahmedabad",
      status: "Verified",
      issueDate: "10-05-2015",
      expiryDate: "09-05-2035",
      refNo: "DEMO-DL-10003",
      fileType: "PDF",
      fileSize: "1.6 MB",
      icon: "Car",
      description: "Gujarat State Driving Licence Record.",
      securitySeal: "GJ-RTO-SEAL-VALID",
      tags: ["Vehicle/RTO", "Licence", "Demo"],
      isDemo: true
    }
  ],

  // 3. PUBLIC VERIFICATION TOKENS
  publicTokens: {
    "CIV-TOKEN-CIV-DEMO-10001-SECURE-2026": {
      citizenId: "CIV-DEMO-10001",
      citizenName: "Authorized viewer only",
      civicIdStatus: "Verified",
      identityStatus: "Verified",
      accountStatus: "Active",
      issuer: "CivicOne National Identity Authority",
      verifiedAt: "2026-08-14T09:00:00Z",
      trustScore: "100% Tokenized Security Verification",
      verificationRef: "VER-2026-DEMO-10001",
      tier: "STANDARD",
      isDemo: true
    },
    "CIV-TOKEN-CIV-DEMO-10002-SECURE-2026": {
      citizenId: "CIV-DEMO-10002",
      citizenName: "Authorized viewer only",
      civicIdStatus: "Verified",
      identityStatus: "Verified",
      accountStatus: "Active",
      issuer: "CivicOne National Identity Authority",
      verifiedAt: "2026-08-14T09:15:00Z",
      trustScore: "100% Tokenized Security Verification",
      verificationRef: "VER-2026-DEMO-10002",
      tier: "GOLD",
      isDemo: true
    }
  },

  // 4. DEMO ORGANIZATIONS WITH SPECIFIC ROLES & RESTRICTED ACCESS SCOPES
  organizations: [
    {
      id: "org-college",
      roleCode: "COLLEGE_ACCESS_ADMIN",
      name: "CivicOne Demo College",
      category: "Education",
      regNo: "EDU-COLLEGE-9048",
      contactEmail: "admissions@democollege.edu.in",
      accessLevel: "VIEW ONLY",
      badgeText: "VIEW ONLY — ACADEMIC CREDENTIALS",
      allowedCategories: ["Education", "Identity"],
      disallowedCategories: ["Finance", "Banking", "Loans", "Healthcare", "Vehicle/RTO", "SIM History", "Travel"],
      allowedDocTypes: ["Student Identity", "Education Certificates", "Marksheets", "Degree/Diploma", "Course Info", "Institution Details", "Transfer Certificate", "Admission Docs"],
      verified: true
    },
    {
      id: "org-school",
      roleCode: "SCHOOL_ACCESS_ADMIN",
      name: "CivicOne Model School",
      category: "Education",
      regNo: "EDU-SCHOOL-1102",
      contactEmail: "principal@modelschool.edu.in",
      accessLevel: "VIEW ONLY",
      badgeText: "VIEW ONLY — LIMITED EDUCATION ACCESS",
      allowedCategories: ["Education", "Identity"],
      disallowedCategories: ["Finance", "Banking", "Loans", "Vehicle/RTO", "Healthcare", "SIM History", "Travel"],
      allowedDocTypes: ["Student Identity", "Birth Certificate", "Previous Education Records", "Transfer Certificate", "Admission Info"],
      verified: true
    },
    {
      id: "org-mobile",
      roleCode: "MOBILE_SHOP_ACCESS_ADMIN",
      name: "CivicOne Mobile Store",
      category: "Telecom / KYC",
      regNo: "TEL-STORE-4401",
      contactEmail: "kyc@civicmobilestore.com",
      accessLevel: "VIEW ONLY — MINIMUM KYC",
      badgeText: "KYC VERIFIED — MINIMUM DATA SHARED",
      allowedCategories: ["Identity"],
      disallowedCategories: ["Vault Browsing", "Education", "Healthcare", "Finance", "Banking", "Loans", "Vehicle/RTO", "SIM History", "Travel"],
      allowedDocTypes: ["Identity Status", "Name", "Address Verification", "Verification Status"],
      verified: true,
      restrictedMode: true
    },
    {
      id: "org-hotel",
      roleCode: "HOTEL_ACCESS_ADMIN",
      name: "CivicOne Grand Hotel",
      category: "Hospitality",
      regNo: "HOSP-HOTEL-8820",
      contactEmail: "frontdesk@civicgrandhotel.com",
      accessLevel: "VIEW ONLY — GUEST VERIFICATION",
      badgeText: "HOTEL VERIFICATION — LIMITED ACCESS",
      allowedCategories: ["Identity", "Travel"],
      disallowedCategories: ["Finance", "Banking", "Loans", "Education", "Vehicle/RTO", "SIM History", "Healthcare", "Full Profile"],
      allowedDocTypes: ["Guest Name", "Identity Verification Status", "Approved Identity Document", "Booking/Check-in Info"],
      verified: true
    },
    {
      id: "org-hospital",
      roleCode: "HEALTHCARE_ACCESS_ADMIN",
      name: "CivicOne Demo Hospital",
      category: "Healthcare",
      regNo: "HLTH-HOSP-9910",
      contactEmail: "records@civichospital.org",
      accessLevel: "VIEW ONLY — HEALTHCARE",
      badgeText: "HEALTHCARE ACCESS — MEDICAL RECORDS ONLY",
      allowedCategories: ["Healthcare", "Identity"],
      disallowedCategories: ["Finance", "Banking", "Education", "Vehicle/RTO", "SIM History", "Travel"],
      allowedDocTypes: ["Patient Identity", "ABHA Health Account", "Medical Diagnostic Summary"],
      verified: true
    },
    {
      id: "org-rto",
      roleCode: "RTO_ACCESS_ADMIN",
      name: "CivicOne RTO Office",
      category: "Transport",
      regNo: "RTO-AP-16-OFFICE",
      contactEmail: "rto.ap16@civicone.gov.in",
      accessLevel: "VIEW ONLY — RTO",
      badgeText: "RTO VERIFICATION — TRANSPORT & DRIVING RECORDS",
      allowedCategories: ["Vehicle/RTO", "Identity"],
      disallowedCategories: ["Finance", "Banking", "Education", "Healthcare", "SIM History", "Travel"],
      allowedDocTypes: ["Driving Licence", "Vehicle Registration", "Insurance", "Pollution Certificate"],
      verified: true
    }
  ],

  // 5. CONSENT RECORDS & ACCESS PERMISSIONS
  consentRecords: [
    {
      id: "share-demo-101",
      citizenId: "cit-demo-10001",
      citizenCivicId: "CIV-DEMO-10001",
      docId: "doc-aarav-08",
      docName: "B.Tech Computer Science Course Admission Record",
      orgId: "org-college",
      orgName: "CivicOne Demo College",
      roleCode: "COLLEGE_ACCESS_ADMIN",
      purpose: "B.Tech Admission Verification",
      accessType: "View Only (Academic)",
      createdAt: "14 Aug 2026, 08:30 AM",
      expiryDate: "21 Aug 2026",
      status: "ACTIVE",
      watermarkText: "CONFIDENTIAL — AUTHORIZED FOR CIVICONE DEMO COLLEGE — ADMISSION VERIFICATION — 14 AUG 2026",
      isDemo: true
    },
    {
      id: "share-demo-102",
      citizenId: "cit-demo-10001",
      citizenCivicId: "CIV-DEMO-10001",
      docId: "doc-aarav-01",
      docName: "Tokenized Aadhaar Record (KYC Only)",
      orgId: "org-mobile",
      orgName: "CivicOne Mobile Store",
      roleCode: "MOBILE_SHOP_ACCESS_ADMIN",
      purpose: "SIM Activation KYC Verification",
      accessType: "Minimum KYC View Only",
      createdAt: "14 Aug 2026, 09:10 AM",
      expiryDate: "15 Aug 2026",
      status: "ACTIVE",
      watermarkText: "CONFIDENTIAL — MINIMUM KYC SHARED FOR CIVICONE MOBILE STORE — 14 AUG 2026",
      isDemo: true
    }
  ],

  shareRequests: [
    {
      id: "req-demo-201",
      orgId: "org-hotel",
      orgName: "CivicOne Grand Hotel",
      roleCode: "HOTEL_ACCESS_ADMIN",
      citizenCivicId: "CIV-DEMO-10001",
      docId: "doc-aarav-04",
      docName: "Indian Passport",
      purpose: "Hotel Guest Registration & Check-in",
      accessType: "Limited Hotel View",
      requestedExpiry: "3 Days",
      requestedAt: "14 Aug 2026, 09:30 AM",
      status: "PENDING",
      isDemo: true
    }
  ],

  // 6. PRIVACY ACCESS AUDIT LOGS
  auditLogs: [
    {
      id: "sec-demo-01",
      citizenId: "CIV-DEMO-10001",
      event: "CivicOne Demo Session Initialized for Aarav Kumar",
      device: "Web Browser",
      location: "Vijayawada, India",
      ip: "49.37.142.90",
      timestamp: "14 Aug 2026, 08:00 AM",
      status: "SUCCESS"
    },
    {
      id: "sec-demo-02",
      citizenId: "CIV-DEMO-10001",
      event: "Academic Access Granted to CivicOne Demo College",
      device: "Citizen Consent Engine",
      location: "Vijayawada, India",
      ip: "49.37.142.90",
      timestamp: "14 Aug 2026, 08:30 AM",
      status: "SUCCESS"
    }
  ],

  // 7. NOTIFICATIONS
  notifications: [
    {
      id: "notif-demo-01",
      citizenId: "CIV-DEMO-10001",
      title: "New Access Request: CivicOne Grand Hotel",
      category: "Consent",
      message: "CivicOne Grand Hotel requested limited guest verification access to your Passport for Hotel Check-in.",
      timestamp: "15 minutes ago",
      read: false,
      type: "info"
    },
    {
      id: "notif-demo-02",
      citizenId: "CIV-DEMO-10001",
      title: "Academic Access Granted",
      category: "Consent",
      message: "CivicOne Demo College was granted View Only access to your Course Admission Record.",
      timestamp: "1 hour ago",
      read: true,
      type: "success"
    }
  ],

  // 8. TOURISM DESTINATIONS DATASET (CIVICONE WORLD)
  destinations: [
    {
      id: "dest-dubai",
      title: "Dubai, United Arab Emirates",
      country: "United Arab Emirates",
      city: "Dubai",
      category: "Luxury / Architecture",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800",
      shortDescription: "Ultra-modern metropolis famous for Burj Khalifa, desert safaris, luxury shopping, and world-class attractions.",
      bestTimeToVisit: "November to March",
      estimatedBudget: "₹75,000 – ₹1,500,000 per person",
      popularAttractions: ["Burj Khalifa", "Dubai Mall & Fountain", "Palm Jumeirah", "Desert Safari", "Museum of the Future"],
      localTransport: "Dubai Metro, Tram, RTA Cabs, Careem, Water Taxis",
      safetyInfo: "Ranked among the safest global destinations. Clean, strictly monitored, 24/7 tourist police helpline.",
      nearbyHotels: ["Burj Al Arab Jumeirah", "Atlantis The Palm", "Rove Downtown"],
      nearbyRestaurants: ["Zuma Dubai", "Pierchic", "Al Fanar Seafood"],
      travelOptions: {
        flights: "Direct 3.5 hr flights from Mumbai, Delhi, Bengaluru, Hyderabad, Chennai",
        buses: "Inter-emirate RTA bus routes from Abu Dhabi and Sharjah",
        cabs: "RTA Taxi app, Uber, Careem available 24/7"
      }
    },
    {
      id: "dest-paris",
      title: "Paris, France",
      country: "France",
      city: "Paris",
      category: "Historical / Cultural",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800",
      shortDescription: "The City of Light, renowned for art museums, iconic Eiffel Tower, fine dining, and rich European heritage.",
      bestTimeToVisit: "April to May & September to October",
      estimatedBudget: "₹1,20,000 – ₹2,50,000 per person",
      popularAttractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Arc de Triomphe", "Seine River Cruise"],
      localTransport: "RATP Metro, RER Suburban Rail, Velib City Bikes, Buses",
      safetyInfo: "Generally safe. Watch for pickpockets at major tourist hubs like Eiffel Tower and Louvre.",
      nearbyHotels: ["Le Bristol Paris", "Hotel Plaza Athenee", "CitizenM Paris Gare de Lyon"],
      nearbyRestaurants: ["Le Jules Verne", "Bistrot Paul Bert", "L'As du Fallafel"],
      travelOptions: {
        flights: "Direct 8-9 hr flights from Delhi & Mumbai (Air India, Air France)",
        trains: "Eurostar connected to London, Brussels, and Amsterdam",
        cabs: "G7 Taxi app and Uber Paris"
      }
    },
    {
      id: "dest-tokyo",
      title: "Tokyo, Japan",
      country: "Japan",
      city: "Tokyo",
      category: "Modern / Cultural",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=800",
      shortDescription: "Hyper-futuristic capital blending ancient temples, neon-lit skyscrapers, culinary excellence, and bullet trains.",
      bestTimeToVisit: "March to May (Cherry Blossom) & October to November",
      estimatedBudget: "₹1,10,000 – ₹2,20,000 per person",
      popularAttractions: ["Shinjuku Crossing", "Senso-ji Temple", "Tokyo Tower", "TeamLab Planets", "Mount Fuji Day Trip"],
      localTransport: "JR Yamanote Line, Tokyo Metro, Suica IC Card, Shinkansen Bullet Train",
      safetyInfo: "Extremely safe with near-zero crime rates. High civic discipline and medical standards.",
      nearbyHotels: ["Park Hyatt Tokyo", "Aman Tokyo", "Hotel Gracery Shinjuku"],
      nearbyRestaurants: ["Sukiyabashi Jiro", "Ichiran Ramen Shinjuku", "Gyukatsu Motomura"],
      travelOptions: {
        flights: "Direct 7.5 hr flights from Delhi & Bengaluru (ANA, Japan Airlines)",
        trains: "Shinkansen High Speed Bullet Train network to Kyoto and Osaka",
        cabs: "JapanTaxi App and Uber Tokyo"
      }
    },
    {
      id: "dest-goa",
      title: "Goa, India",
      country: "India",
      city: "Goa",
      category: "Beaches / Budget",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800",
      shortDescription: "India's beach paradise known for golden coastlines, Portuguese heritage, seafood delis, and vibrant nightlife.",
      bestTimeToVisit: "November to February",
      estimatedBudget: "₹15,000 – ₹50,000 per person",
      popularAttractions: ["Baga Beach", "Aguada Fort", "Basilica of Bom Jesus", "Dudhsagar Waterfalls", "Panjim Latin Quarter"],
      localTransport: "Self-drive bikes, rental cars, Goa Miles cabs, local buses",
      safetyInfo: "Safe coastal state. Lifeguards stationed on all major public beaches.",
      nearbyHotels: ["Taj Exotica Resort", "W Goa Anjuna", "Hard Rock Hotel Goa"],
      nearbyRestaurants: ["Brittos Baga", "Fisherman's Wharf", "Mum's Kitchen Panaji"],
      travelOptions: {
        flights: "Direct flights to Dabolim (GOI) and Mopa (GOX) from all major Indian cities",
        trains: "Konkan Railway trains to Madgaon (MAO) and Thivim (THVM)",
        buses: "Overnight sleeper buses from Mumbai, Pune, Bengaluru, Hyderabad"
      }
    }
  ],

  // 9. TRAVEL PROVIDER ADAPTERS & INTEGRATION STATE
  travelProviders: [
    { id: "prov-air", name: "CivicOne Flight Engine (IndiGo, Air India, Emirates)", category: "Flights", status: "ADAPTER_READY", connected: false },
    { id: "prov-bus", name: "CivicOne Bus Gateway (RedBus, KSRTC, APSRTC)", category: "Buses", status: "ADAPTER_READY", connected: false },
    { id: "prov-rail", name: "IRCTC Rail Link", category: "Railway", status: "ADAPTER_READY", connected: false },
    { id: "prov-cab", name: "CivicOne Cabs (Uber, Ola, Rapido)", category: "Cabs", status: "ADAPTER_READY", connected: false },
    { id: "prov-bike", name: "CivicOne Rentals (Bounce, Royal Brothers)", category: "Bike Rental", status: "ADAPTER_READY", connected: false }
  ],

  // 10. RECENT OFFICIAL GOVERNMENT UPDATES
  govtUpdates: [
    {
      id: "gov-up-001",
      title: "UIDAI Mandates Tokenized Aadhaar References for Identity Verification",
      department: "Ministry of Electronics & IT (MeitY) / UIDAI",
      source: "Official UIDAI Press Release",
      category: "Identity",
      content: "UIDAI has reiterated that service providers must use tokenized Aadhaar references rather than storing 12-digit physical Aadhaar numbers, safeguarding citizen privacy across digital platforms.",
      summary: "Tokenized Aadhaar references mandated for identity privacy.",
      publishedAt: "2026-08-12T09:00:00Z",
      date: "12 Aug 2026",
      unread: true,
      priority: "High",
      isOfficial: true
    },
    {
      id: "gov-up-002",
      title: "Parivahan Portal Launches Unified Digital Driving Licence Verification",
      department: "Ministry of Road Transport and Highways (MoRTH)",
      source: "MoRTH E-Governance Desk",
      category: "RTO",
      content: "MoRTH announces full API integration for smart driving licence verification, allowing citizens to share authenticated transport credentials securely without paper copies.",
      summary: "Unified digital DL verification activated on Parivahan portal.",
      publishedAt: "2026-08-11T11:30:00Z",
      date: "11 Aug 2026",
      unread: true,
      priority: "Medium",
      isOfficial: true
    },
    {
      id: "gov-up-003",
      title: "National Health Authority Expands Universal ABHA Digital Health Network",
      department: "National Health Authority (NHA)",
      source: "Ayushman Bharat Digital Mission",
      category: "Healthcare",
      content: "NHA reports over 60 crore citizens linked to ABHA accounts, enabling paperless digital lab reports and hospital registration across verified healthcare facilities.",
      summary: "ABHA Health Account network expanded nationwide.",
      publishedAt: "2026-08-10T08:00:00Z",
      date: "10 Aug 2026",
      unread: false,
      priority: "Medium",
      isOfficial: true
    }
  ],

  dailyNews: [
    {
      id: "news-up-001",
      title: "India Advances Unified Citizen Services Platform Framework",
      headline: "India Advances Unified Citizen Services Platform Framework",
      source: "CivicOne News Network",
      category: "Technology",
      snippet: "India's digital identity landscape achieves new milestones with unified privacy-first consent frameworks and least-privilege organization access.",
      summary: "India advances unified citizen service framework with consent-driven security.",
      publishedAt: "2026-08-13T07:30:00Z",
      date: "13 Aug 2026",
      readingTime: "3 min"
    }
  ],

  goldPassRequests: [
    {
      id: "gpr-demo-10001",
      citizenId: "CIV-DEMO-10001",
      citizenName: "Aarav Kumar",
      appliedAt: "2026-08-14T08:00:00Z",
      status: "PENDING",
      plan: "Annual Gold Pass (₹499)",
      paymentRef: "TXN-900001-DEMO",
      notes: "Awaiting Webhook / Admin Entitlement Verification"
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

  issuers: [
    { id: "iss-01", name: "Parivahan Sewa (MoRTH)", department: "Transport", officer: "Rakesh Sharma", status: "VERIFIED", issuedDocs: "12,482" },
    { id: "iss-02", name: "UIDAI National Desk", department: "Identity", officer: "Priya Menon", status: "VERIFIED", issuedDocs: "48,910" },
    { id: "iss-03", name: "National Health Authority", department: "Healthcare", officer: "Dr. A. K. Verma", status: "VERIFIED", issuedDocs: "9,210" }
  ],

  // Getters for active citizen and card
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
      securityChipId: c.goldPassStatus === 'active' ? `GOLD-CHIP-${c.citizenId}` : `CHIP-${c.citizenId}`,
      verificationToken: `CIV-TOKEN-${c.citizenId}-SECURE-2026`,
      qrSignature: "SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      verificationUrl: `http://localhost:3001/verify?token=CIV-TOKEN-${c.citizenId}-SECURE-2026`
    };
  }
};
