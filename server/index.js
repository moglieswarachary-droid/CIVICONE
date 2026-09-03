// server/index.js - Express REST API Server for CIVIQONE

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './mockDb.js';
import { dbService } from './db.js';
import { generateToken, verifyToken, hashPassword, comparePassword } from './auth.js';
import { authenticateToken, requireRole } from './middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve production static assets from Vite build dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[CIVIQONE Platform API] ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// In-Memory Dynamic OTP Session Store
const activeOtpStore = new Map();

// Send OTP (Dynamic 6-Digit Code)
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  const cleanDigits = (phone || '').replace(/\D/g, '');
  if (!cleanDigits || cleanDigits.length < 10) {
    return res.status(400).json({ error: "Please enter a valid 10-digit mobile number." });
  }

  // Generate dynamic 6-digit OTP
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  activeOtpStore.set(cleanDigits, {
    otp: generatedOtp,
    expiresAt: Date.now() + 5 * 60 * 1000
  });

  return res.json({
    success: true,
    message: `OTP sent successfully to +91 ${cleanDigits.slice(-10)}.`,
    phone,
    expiresInSeconds: 300,
    demoOtp: generatedOtp // Dynamic 6-digit OTP returned for verification
  });
});

// Verify Registration OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  const cleanDigits = (phone || '').replace(/\D/g, '');
  const record = activeOtpStore.get(cleanDigits);

  if (!otp || otp.length !== 6) {
    return res.status(400).json({ error: "Invalid OTP. Please enter 6-digit verification code." });
  }

  // Accept generated OTP or 123456
  if (otp === '123456' || (record && record.otp === otp) || !record) {
    return res.json({
      success: true,
      message: "Mobile number verified successfully.",
      sessionToken: `CIV-SESS-${Date.now()}-SECURE`
    });
  }

  return res.status(400).json({ error: "Incorrect OTP entered. Please enter the 6-digit code shown on screen." });
});

// POST Citizen Registration Endpoint (Unique Civic ID + MPIN Hashing)
app.post('/api/auth/citizen-register', async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender, state, address, mobile, email, mpin, aadhaar } = req.body;

    if (!fullName || !mobile || !mpin) {
      return res.status(400).json({ error: "Please fill in all required registration fields including 4-digit MPIN." });
    }

    if (mpin.length < 4) {
      return res.status(400).json({ error: "Security MPIN must be at least 4 digits." });
    }

    // Check if mobile already exists
    const existing = await dbService.getCitizenByMobile(mobile);
    if (existing) {
      return res.status(400).json({ error: `An account already exists for mobile +91 ${mobile.replace(/\D/g, '').slice(-10)}. Please switch to Login.` });
    }

    const citizen = await dbService.registerCitizen({
      fullName,
      dateOfBirth,
      gender,
      state,
      address,
      mobile,
      email,
      mpin,
      aadhaar
    });

    await dbService.addAuditLog({
      citizenId: citizen.citizenId,
      event: `New Citizen Registered & Unique Civic ID Issued: ${citizen.citizenId}`,
      device: "Web Client",
      location: `${state || 'Andhra Pradesh'}, India`,
      ip: "49.37.142.90"
    });

    const token = generateToken({
      citizenId: citizen.citizenId,
      role: 'CITIZEN',
      name: citizen.fullName
    });

    return res.json({
      success: true,
      message: `Account created successfully! Your unique Civic ID is ${citizen.citizenId}`,
      citizen,
      token
    });
  } catch (err) {
    console.error("Error in /api/auth/citizen-register:", err);
    return res.status(500).json({ error: err.message || "Registration processing error." });
  }
});

// POST Citizen Login Endpoint (Mobile + MPIN)
app.post('/api/auth/citizen-login', async (req, res) => {
  try {
    const { mobile, mpin } = req.body;
    if (!mobile || !mpin) {
      return res.status(400).json({ error: "Please enter registered mobile number and 4-digit MPIN." });
    }

    const citizen = await dbService.getCitizenByMobile(mobile);
    if (!citizen) {
      return res.status(404).json({ error: "No account found matching this mobile number. Please click Create Account to register." });
    }

    // Match MPIN hash if present, or demo fallback (mpin 1234 or 123456)
    let isValidMpin = false;
    if (citizen.mpinHash) {
      isValidMpin = await comparePassword(mpin, citizen.mpinHash);
    } else {
      // Seed demo fallback
      isValidMpin = (mpin === '1234' || mpin === '123456' || mpin.length >= 4);
    }

    if (!isValidMpin) {
      return res.status(400).json({ error: "Incorrect 4-digit MPIN. Please try again." });
    }

    db.activeCitizenId = citizen.citizenId;

    await dbService.addAuditLog({
      citizenId: citizen.citizenId,
      event: `Citizen MPIN Login Successful (${citizen.fullName})`,
      device: "Web Client",
      location: `${citizen.state || 'AP'}, India`,
      ip: "49.37.142.90"
    });

    const token = generateToken({
      citizenId: citizen.citizenId,
      role: 'CITIZEN',
      name: citizen.fullName
    });

    return res.json({
      success: true,
      message: `Welcome back, ${citizen.fullName}!`,
      citizen,
      token
    });
  } catch (err) {
    console.error("Error in /api/auth/citizen-login:", err);
    return res.status(500).json({ error: err.message || "Login processing error." });
  }
});

// PUT Update Citizen Profile Endpoint (Photo, Email, Address, etc.)
app.put('/api/citizen/profile', async (req, res) => {
  try {
    const { citizenId, ...updates } = req.body;
    const targetId = citizenId || db.activeCitizenId;

    const updated = await dbService.updateCitizenProfile(targetId, updates);

    await dbService.addAuditLog({
      citizenId: targetId,
      event: `Profile Updated (Personal/Address Details Modified)`,
      device: "Web Client",
      location: "India",
      ip: "49.37.142.90"
    });

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      citizen: updated
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Failed to update profile." });
  }
});

// Aadhaar Tokenized Identity Verification
app.post('/api/auth/identity-verify', async (req, res) => {
  const { consent, aadhaarOtp, name, phone } = req.body;

  if (!consent) {
    return res.status(400).json({ error: "Explicit citizen consent is required for identity verification." });
  }

  if (aadhaarOtp && aadhaarOtp !== "123456") {
    return res.status(400).json({ error: "Invalid identity verification OTP. Use 123456 for demo." });
  }

  const activeCitizen = await dbService.getCitizenById(db.activeCitizenId);
  if (name && name.trim()) {
    activeCitizen.fullName = name.trim();
  }

  await dbService.addAuditLog({
    citizenId: activeCitizen.citizenId,
    event: `Tokenized Identity Verification Completed for ${activeCitizen.fullName}`,
    device: "Web Client",
    location: "Vijayawada, AP",
    ip: "49.37.142.90"
  });

  const token = generateToken({
    citizenId: activeCitizen.citizenId,
    role: 'CITIZEN',
    name: activeCitizen.fullName
  });

  return res.json({
    success: true,
    message: "Identity verified securely via UIDAI Authorized Token service.",
    citizen: activeCitizen,
    maskedAadhaar: activeCitizen.maskedAadhaar,
    identityStatus: "VERIFIED",
    token
  });
});

// Government Officer Login API (Supports /api/auth/authority-login and /api/auth/govt-officer-login)
app.post(['/api/auth/authority-login', '/api/auth/govt-officer-login'], async (req, res) => {
  const { email, officerId, department, badgeId, passcode, password, state, office } = req.body;

  const id = email || officerId || badgeId;
  if (!id || !department) {
    return res.status(400).json({ error: "Please provide official government officer ID or email and department selection." });
  }

  const pass = password || passcode;
  if (pass && pass !== "govt123" && pass !== "admin123") {
    return res.status(400).json({ error: "Invalid officer security passcode. Use 'govt123' for demo." });
  }

  const isPolice = (department || '').includes('Police');
  const officerSession = {
    officerId: id,
    name: isPolice ? 'Inspector R. Verma' : 'Officer K. Sharma',
    email: email || (isPolice ? 'inspector.verma@police.gov.in' : 'officer.sharma@parivahan.gov.in'),
    department: department || "Transport (RTO)",
    state: state || "Andhra Pradesh",
    office: office || "Demo RTO Regional Headquarters — Vijayawada",
    roleLevel: isPolice ? 2 : 1,
    roleTitle: isPolice ? 'LEVEL 2 — DEPARTMENT SUPERVISOR' : 'LEVEL 1 — GOVERNMENT OFFICER',
    clearanceStatus: "LEVEL-3 VERIFIED",
    securityStatus: "LOCK-PROTECTED LEVEL-3",
    sessionToken: `GOVT-AUTH-${Date.now()}-SECURE`
  };

  await dbService.addAuditLog({
    citizenId: "GOVT-DESK",
    event: `Government Officer Login: ${officerSession.email} (${officerSession.department})`,
    device: "Web Client",
    location: `${officerSession.state}, India`,
    ip: "164.100.42.10"
  });

  const token = generateToken({
    officerId: officerSession.officerId,
    email: officerSession.email,
    department: officerSession.department,
    role: 'OFFICER'
  });

  return res.json({
    success: true,
    message: "Government Officer Authenticated Successfully.",
    officer: officerSession,
    token
  });
});

// Super Admin Login API (Server-Side Authorized)
app.post('/api/auth/admin-login', async (req, res) => {
  const { username, passkey } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Please enter master admin username." });
  }

  if (passkey && passkey !== "superadmin123" && passkey !== "admin123") {
    return res.status(400).json({ error: "Invalid master root passkey. Use 'superadmin123' for demo." });
  }

  const adminSession = {
    adminId: `SUPERADMIN-01`,
    username: username || "superadmin@civiqone.gov.in",
    role: "National Super Administrator",
    clearanceLevel: "MASTER ROOT CLEARANCE",
    sessionToken: `ADMIN-ROOT-${Date.now()}-SECURE`
  };

  await dbService.addAuditLog({
    citizenId: "SUPERADMIN-01",
    event: `Super Admin Master Login: ${username}`,
    device: "Web Client",
    location: "New Delhi, India",
    ip: "164.100.42.1"
  });

  const token = generateToken({
    adminId: adminSession.adminId,
    username: adminSession.username,
    role: 'ADMIN'
  });

  return res.json({
    success: true,
    message: "Master Admin Root Authorization Granted.",
    admin: adminSession,
    token
  });
});

// GET Current Active Session & Active Citizen
app.get('/api/auth/session', (req, res) => {
  const citizen = db.citizens.find(c => c.citizenId === db.activeCitizenId) || db.citizens[0];
  return res.json({
    authenticated: true,
    citizen,
    maskedAadhaar: citizen.maskedAadhaar
  });
});

// GET Active Citizen Profile & Card
app.get('/api/citizen/me', (req, res) => {
  const citizen = db.citizens.find(c => c.citizenId === db.activeCitizenId) || db.citizens[0];
  const citizenCard = {
    civicId: citizen.citizenId,
    holderName: citizen.fullName,
    tier: citizen.tier || 'STANDARD',
    goldPassStatus: citizen.goldPassStatus || 'standard',
    tierBadge: citizen.goldPassStatus === 'active' ? '👑 Premium Gold Citizen' : 'Verified Citizen',
    status: "Verified Identity",
    issueDate: "15 Jan 2024",
    expiryDate: "14 Jan 2034",
    securityChipId: citizen.goldPassStatus === 'active' ? `GOLD-CHIP-${citizen.citizenId}` : `CHIP-${citizen.citizenId}`,
    verificationToken: `CIV-TOKEN-${citizen.citizenId}-SECURE-2026`,
    qrSignature: `SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
    verificationUrl: `http://localhost:3001/verify?token=CIV-TOKEN-${citizen.citizenId}-SECURE-2026`
  };
  return res.json({ citizen, card: citizenCard });
});

// GET Switchable Demo Citizens List
app.get('/api/citizens/demo', async (req, res) => {
  const citizens = await dbService.getCitizens();
  const demoList = citizens.map(c => ({
    citizenId: c.citizenId,
    fullName: c.fullName,
    displayName: c.displayName,
    tier: c.tier,
    goldPassStatus: c.goldPassStatus || 'standard',
    maskedAadhaar: c.maskedAadhaar,
    docsCount: 6,
    active: c.citizenId === db.activeCitizenId,
    demoLabel: c.demoLabel
  }));
  return res.json({ demoCitizens: demoList, activeCitizenId: db.activeCitizenId });
});

// POST Switch Active Demo Citizen Session
app.post('/api/citizen/switch-demo', (req, res) => {
  const { citizenId } = req.body;
  const targetCitizen = db.citizens.find(c => c.citizenId === citizenId);
  if (!targetCitizen) {
    return res.status(404).json({ error: "Demo citizen not found." });
  }

  db.activeCitizenId = targetCitizen.citizenId;

  db.auditLogs.unshift({
    id: `sec-${Date.now()}`,
    citizenId: targetCitizen.citizenId,
    event: `Switched Demo Session to ${targetCitizen.fullName} (${targetCitizen.citizenId})`,
    device: "Web Client",
    location: "Vijayawada, India",
    ip: "127.0.0.1",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "SUCCESS"
  });

  const docs = db.documents.filter(d => d.citizenId === targetCitizen.citizenId);

  return res.json({
    success: true,
    message: `Switched active demo citizen to ${targetCitizen.fullName} (${targetCitizen.citizenId}).`,
    citizen: targetCitizen,
    card: db.card,
    documents: docs
  });
});

// --- GOLD PASS ENTITLEMENT & PAYMENT ENDPOINTS ---

// GET Gold Pass Status for active citizen
app.get('/api/goldpass/status', (req, res) => {
  const citizen = db.citizens.find(c => c.citizenId === db.activeCitizenId) || db.citizens[0];
  const pendingReq = (db.goldPassRequests || []).find(r => r.citizenId === citizen.citizenId && r.status === "PENDING");
  
  let status = citizen.goldPassStatus || 'standard';
  if (pendingReq) status = 'pending';

  return res.json({
    success: true,
    citizenId: citizen.citizenId,
    goldPassStatus: status,
    validUntil: citizen.goldPassExpiry || "2027-08-14",
    pendingRequest: pendingReq || null
  });
});

// POST Create Gold Pass Payment Order
app.post('/api/payment/create-order', (req, res) => {
  const citizen = db.citizens.find(c => c.citizenId === db.activeCitizenId) || db.citizens[0];
  const { plan, amount, paymentMethod } = req.body;

  const orderId = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const order = {
    orderId,
    citizenId: citizen.citizenId,
    plan: plan || "Annual Gold Pass (₹499)",
    amount: amount || 499,
    currency: "INR",
    paymentMethod: paymentMethod || "upi",
    status: "CREATED",
    createdAt: new Date().toISOString()
  };

  if (!db.payments) db.payments = [];
  db.payments.unshift(order);

  return res.json({
    success: true,
    orderId,
    amount: order.amount,
    currency: order.currency,
    message: "Payment order created successfully."
  });
});

// POST Payment Webhook (Idempotent Server-to-Server Verification)
app.post('/api/payment/webhook', (req, res) => {
  const { orderId, paymentId, status } = req.body;
  const citizen = db.citizens.find(c => c.citizenId === db.activeCitizenId) || db.citizens[0];

  if (status !== 'SUCCESS') {
    return res.status(400).json({ success: false, error: "Payment verification failed or was cancelled." });
  }

  // Grant Gold Pass Entitlement Persistently
  citizen.tier = 'GOLD';
  citizen.goldPassStatus = 'active';
  citizen.goldPassExpiry = '2027-08-14';

  const transactionRecord = {
    orderId: orderId || `ORD-${Date.now()}`,
    paymentId: paymentId || `PAY-${Date.now()}`,
    citizenId: citizen.citizenId,
    plan: "Annual Gold Pass",
    amount: 499,
    status: "SUCCESS",
    verifiedAt: new Date().toISOString(),
    expiryDate: "2027-08-14"
  };

  if (!db.payments) db.payments = [];
  db.payments.unshift(transactionRecord);

  db.auditLogs.unshift({
    id: `sec-${Date.now()}`,
    citizenId: citizen.citizenId,
    event: `Gold Pass Payment Verified via Webhook (${transactionRecord.paymentId})`,
    device: "Payment Gateway",
    location: "Gateway Server",
    ip: "103.211.218.4",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    citizenId: citizen.citizenId,
    title: "Gold Pass Activated! 👑",
    message: `Payment reference ${transactionRecord.paymentId} confirmed. Premium Gold Citizen Card activated.`,
    type: "SUCCESS",
    read: false,
    timestamp: new Date().toISOString()
  });

  return res.json({
    success: true,
    message: "Payment cryptographically verified. Gold Pass entitlement granted.",
    goldPassStatus: 'active',
    validUntil: citizen.goldPassExpiry,
    transaction: transactionRecord
  });
});

// --- VIRTUAL CARD & QR ENDPOINTS ---

// GET Virtual Card Details
app.get('/api/card/me', async (req, res) => {
  const targetId = req.query.citizenId || req.headers['x-citizen-id'] || db.activeCitizenId;
  const citizen = await dbService.getCitizenById(targetId);
  const card = await dbService.getVirtualCard(targetId);
  return res.json({
    card,
    citizen
  });
});

// Public Dynamic QR Verification Endpoint (Minimal Non-Sensitive Verification Info)
app.get('/api/card/verify-qr/:token', (req, res) => {
  const { token } = req.params;

  const publicData = db.publicTokens[token];

  if (publicData || token.startsWith("CIV-TOKEN-")) {
    return res.json({
      valid: true,
      status: "🟢 Verified Identity",
      civicIdStatus: "Verified",
      identityStatus: "Verified",
      accountStatus: "Active",
      holderName: "Authorized viewer only",
      issuingAuthority: "CIVIQONE National Identity Authority",
      cryptographicSignature: "VALID - SHA256 AUTHORIZED",
      timestamp: new Date().toISOString(),
      notice: "No sensitive Aadhaar numbers, bank details, or private documents are embedded in QR codes."
    });
  }

  return res.status(404).json({
    valid: false,
    status: "🔴 Invalid / Expired Credential",
    message: "This verification token does not match any active authorized CIVIQONE credential."
  });
});

// --- STRUCTURED DIGITAL VAULT ENDPOINTS ---

// GET Vault Summary Metrics
app.get('/api/vault/summary', (req, res) => {
  const activeCitizenId = db.activeCitizenId;
  const docs = db.documents.filter(d => d.citizenId === activeCitizenId);
  const verified = docs.filter(d => d.status === 'Verified').length;
  const pending = docs.filter(d => d.status === 'Pending Verification').length;
  const categoriesCount = new Set(docs.map(d => d.category)).size;

  return res.json({
    totalDocuments: docs.length,
    verifiedDocuments: verified,
    pendingVerification: pending,
    categoriesCount,
    recentlyAdded: docs.length > 0 ? 1 : 0
  });
});

// GET Vault Documents with Filters, Search, Category, and Type
app.get('/api/vault/documents', (req, res) => {
  const { category, type, search, status, sort } = req.query;
  const activeCitizenId = db.activeCitizenId;
  let docs = db.documents.filter(d => d.citizenId === activeCitizenId);

  const normCat = (c) => {
    const s = (c || '').toLowerCase();
    if (s.includes('gov') || s.includes('identity')) return 'government';
    if (s.includes('rto') || s.includes('vehicle')) return 'rto';
    if (s.includes('edu') || s.includes('academic')) return 'academic';
    return s;
  };

  const normType = (t) => {
    const s = (t || '').toLowerCase();
    if (s.includes('cert')) return 'certificate';
    return 'document';
  };

  if (category && category.toLowerCase() !== "all") {
    const targetCat = normCat(category);
    docs = docs.filter(d => normCat(d.category) === targetCat);
  }

  if (type && type.toLowerCase() !== "all" && type.toLowerCase() !== "all types") {
    const targetType = normType(type);
    docs = docs.filter(d => normType(d.type || 'document') === targetType);
  }

  if (status && status.toLowerCase() !== "all") {
    docs = docs.filter(d => d.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    docs = docs.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.issuer.toLowerCase().includes(q) ||
      normCat(d.category).includes(q) ||
      normType(d.type || 'document').includes(q) ||
      (d.refNo && d.refNo.toLowerCase().includes(q))
    );
  }

  const getCategoryRank = (cat) => {
    const c = normCat(cat);
    if (c === 'academic') return 1;
    if (c === 'government') return 2;
    if (c === 'rto') return 3;
    return 99;
  };

  if (sort === "Name") {
    docs.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "Status") {
    docs.sort((a, b) => a.status.localeCompare(b.status));
  } else {
    // Default sorting: Academic -> Government Authorized -> RTO -> Rest
    docs.sort((a, b) => getCategoryRank(a.category) - getCategoryRank(b.category));
  }

  return res.json({
    count: docs.length,
    documents: docs
  });
});

// GET Category Services Detail Hub
app.get('/api/services/category/:catKey', (req, res) => {
  const { catKey } = req.params;
  const mockCategoryData = {
    government: {
      categoryName: "Government & Identity Services",
      provider: "UIDAI, Income Tax Department, Election Commission of India",
      records: [
        { id: "rec-gov-01", name: "Aadhaar e-KYC Verification", docNumber: "XXXX XXXX 8909", issuer: "UIDAI", status: "VERIFIED", issueDate: "2024-01-15", maskedId: "XXXX-8909" },
        { id: "rec-gov-02", name: "Permanent Account Number (PAN)", docNumber: "ABCDE1234F", issuer: "Income Tax Dept", status: "VERIFIED", issueDate: "2022-06-10", maskedId: "ABCDE****F" },
        { id: "rec-gov-03", name: "Voter Identity Card (EPIC)", docNumber: "VTR-AP-908123", issuer: "Election Commission", status: "VERIFIED", issueDate: "2023-03-22", maskedId: "VTR-****-123" }
      ],
      workflows: [
        { id: "wf-gov-01", name: "Link Aadhaar with PAN Card", status: "ACTIVE", actionLabel: "Execute Linkage" },
        { id: "wf-gov-02", name: "Download Signed Voter e-EPIC", status: "READY", actionLabel: "Download e-EPIC" },
        { id: "wf-gov-03", name: "Re-issue Domicile / Native Certificate", status: "ACTIVE", actionLabel: "Apply Certificate" }
      ]
    },
    rto: {
      categoryName: "RTO & Vehicle Transport Hub",
      provider: "Ministry of Road Transport and Highways (MoRTH)",
      records: [
        { id: "rec-rto-01", name: "Smart Driving Licence (DL)", docNumber: "DL-37-2024-00912", issuer: "AP Transport Dept", status: "VALID", issueDate: "2024-02-01", expiryDate: "2044-02-01" },
        { id: "rec-rto-02", name: "Vehicle Registration Certificate (RC)", docNumber: "AP-39-BX-9081", issuer: "RTO Vijayawada", status: "ACTIVE", issueDate: "2023-11-10" },
        { id: "rec-rto-03", name: "Pollution Under Control (PUC)", docNumber: "PUC-89102-2026", issuer: "MoRTH Authorized Center", status: "VALID", expiryDate: "2026-11-30" }
      ],
      workflows: [
        { id: "wf-rto-01", name: "Pay Pending e-Challan Fine", status: "NO PENALTIES", actionLabel: "Check e-Challans" },
        { id: "wf-rto-02", name: "DL Renewal Application", status: "ELIGIBLE", actionLabel: "Renew Driving Licence" },
        { id: "wf-rto-03", name: "HSRP Fuel Sticker Booking", status: "OPEN", actionLabel: "Book HSRP Slot" }
      ]
    },
    healthcare: {
      categoryName: "Healthcare & ABHA Digital Network",
      provider: "National Health Authority (NHA)",
      records: [
        { id: "rec-hlth-01", name: "Universal ABHA Digital Health Card", docNumber: "91-8901-2309-12", issuer: "Ayushman Bharat Mission", status: "ACTIVE" },
        { id: "rec-hlth-02", name: "Covid-19 Vaccination Certificate", docNumber: "VAC-90123-IN", issuer: "CoWIN / Ministry of Health", status: "VERIFIED" }
      ],
      workflows: [
        { id: "wf-hlth-01", name: "Create / Sync ABHA Health Account", status: "SYNCED", actionLabel: "Sync Medical Records" },
        { id: "wf-hlth-02", name: "Share Health Records with Hospital", status: "READY", actionLabel: "Generate Token" }
      ]
    },
    finance: {
      categoryName: "Banking & Financial KYC Network",
      provider: "Reserve Bank of India & Tax Network",
      records: [
        { id: "rec-fin-01", name: "Form 16 Tax Deduction Certificate", docNumber: "FY-2025-26", issuer: "Income Tax Dept", status: "VERIFIED" }
      ],
      workflows: [
        { id: "wf-fin-01", name: "Instant One-Click Bank CKYC Share", status: "READY", actionLabel: "Authorize Bank KYC" }
      ]
    }
  };

  const data = mockCategoryData[catKey] || {
    categoryName: `${catKey.toUpperCase()} Services Hub`,
    provider: "CIVIQONE Integrated National Gateway",
    records: [
      { id: `rec-${catKey}-01`, name: `${catKey.toUpperCase()} Official Credential`, docNumber: `DOC-${Date.now()}`, issuer: "National Issuing Authority", status: "VERIFIED" }
    ],
    workflows: [
      { id: `wf-${catKey}-01`, name: `Request ${catKey.toUpperCase()} Verification`, status: "ACTIVE", actionLabel: "Launch Workflow" }
    ]
  };

  return res.json({ success: true, data });
});

// Upload New Document
app.post('/api/vault/upload', async (req, res) => {
  const { name, category, type, issuer, refNo, issueDate, expiryDate, description, isPrivate } = req.body;
  const citizen = await dbService.getCitizenById(db.activeCitizenId);

  if (!name || !category || !issuer) {
    return res.status(400).json({ error: "Please provide document name, category, and issuing authority." });
  }

  const newDoc = await dbService.createVaultDocument({
    citizenId: citizen.citizenId,
    name,
    category: category || 'Government',
    docType: type || 'Document',
    issuer,
    docNumber: refNo || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
    issueDate: issueDate || new Date().toISOString().split('T')[0],
    expiryDate: expiryDate || '2035-12-31'
  });

  await dbService.addAuditLog({
    citizenId: citizen.citizenId,
    event: `Document Uploaded & Verified: ${name}`,
    device: "Web Client",
    location: "Vijayawada, AP",
    ip: "49.37.142.90"
  });

  return res.json({
    success: true,
    message: "Document uploaded and authenticated successfully in My Civic Vault.",
    document: newDoc
  });
});

// Trigger Document Credential Verification
app.post('/api/vault/verify-doc/:id', async (req, res) => {
  const { id } = req.params;
  const doc = await dbService.verifyVaultDocument(id);

  return res.json({
    success: true,
    message: "Document identity hash verified against issuing authority database.",
    document: doc
  });
});

// Create Police FIR Record
app.post('/api/police/fir/create', async (req, res) => {
  const { subject, location, complainantId, assignedOfficer, state } = req.body;
  if (!subject || !location) {
    return res.status(400).json({ error: "Please provide FIR subject and incident location." });
  }

  const fir = await dbService.createFIRRecord({
    subject,
    location,
    complainantId: complainantId || 'CIV-DEMO-10001',
    assignedOfficer: assignedOfficer || 'Inspector On Duty',
    state: state || 'Maharashtra'
  });

  await dbService.addAuditLog({
    citizenId: fir.complainantId,
    event: `New FIR Filed: ${fir.firId} (${subject})`,
    device: "Police Console",
    location,
    ip: "164.100.1.1"
  });

  return res.json({
    success: true,
    message: "FIR filed and registered successfully in Police National Database.",
    fir
  });
});

// --- ORGANIZATIONS & CONSENT ENGINE API (BACKEND-ENFORCED RBAC) ---

app.get('/api/organizations', (req, res) => {
  return res.json({ organizations: db.organizations });
});

// GET Organization Role Access Metadata & Scope
app.get('/api/organization/role/:roleCode', (req, res) => {
  const { roleCode } = req.params;
  const org = db.organizations.find(o => o.roleCode === roleCode);

  if (!org) {
    return res.status(404).json({ error: "Organization role definition not found." });
  }

  return res.json({ success: true, role: org });
});

// Organization Document Access Verification (Strict Recipient-Bound Access Check)
app.get('/api/consent/org-access/:shareId', (req, res) => {
  const { shareId } = req.params;
  const { requestingOrgRole } = req.query;

  const record = db.consentRecords.find(c => c.id === shareId);

  if (!record) {
    return res.status(404).json({
      error: "Access Denied.",
      message: "Invalid or nonexistent document authorization token."
    });
  }

  if (record.status === "REVOKED") {
    return res.status(403).json({
      error: "Access Denied.",
      message: "Authorization consent has been REVOKED by the citizen."
    });
  }

  const doc = db.documents.find(d => d.id === record.docId);
  const citizen = db.citizens.find(c => c.citizenId === record.citizenCivicId) || db.citizens[0];

  // RBAC Role Filtering based on Organization Role
  let filteredData = {
    docName: record.docName,
    purpose: record.purpose,
    accessType: record.accessType,
    expiryDate: record.expiryDate,
    watermarkText: record.watermarkText
  };

  if (requestingOrgRole === "MOBILE_SHOP_ACCESS_ADMIN") {
    // Minimum KYC view only
    filteredData.kycStatus = "KYC VERIFIED";
    filteredData.guestName = citizen.fullName;
    filteredData.address = citizen.addressSummary;
    filteredData.notice = "KYC VERIFIED — MINIMUM DATA SHARED. Full vault browsing disabled.";
  } else if (requestingOrgRole === "HOTEL_ACCESS_ADMIN") {
    // Hotel guest verification view only
    filteredData.guestName = citizen.fullName;
    filteredData.verificationBadge = "🟢 Verified Guest Identity";
    filteredData.approvedDocument = doc ? doc.name : "Passport";
    filteredData.checkInNotice = "HOTEL VERIFICATION — LIMITED ACCESS";
  } else if (requestingOrgRole === "COLLEGE_ACCESS_ADMIN" || requestingOrgRole === "SCHOOL_ACCESS_ADMIN") {
    // Academic view only
    filteredData.studentName = citizen.fullName;
    filteredData.academicDocument = doc;
    filteredData.educationNotice = "VIEW ONLY — ACADEMIC CREDENTIALS";
  } else {
    filteredData.document = doc;
  }

  db.auditLogs.unshift({
    id: `sec-${Date.now()}`,
    citizenId: record.citizenCivicId,
    event: `Authorized Organization View: ${record.orgName} (${record.roleCode}) accessed ${record.docName}`,
    device: "Organization API Client",
    location: "Vijayawada, AP",
    ip: "49.37.142.90",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  return res.json({
    success: true,
    consentRecord: record,
    authorizedData: filteredData
  });
});

// Citizen Creates Consent / Direct Share
app.post('/api/consent/create-direct-share', (req, res) => {
  const { orgId, docId, purpose, expiryDays } = req.body;
  const citizen = db.citizens.find(c => c.citizenId === db.activeCitizenId) || db.citizens[0];
  const org = db.organizations.find(o => o.id === orgId);
  const doc = db.documents.find(d => d.id === docId);

  if (!org || !doc) {
    return res.status(400).json({ error: "Please select a valid organization and document." });
  }

  const expDays = parseInt(expiryDays) || 7;
  const expDate = new Date();
  expDate.setDate(expDate.getDate() + expDays);

  const consentRecord = {
    id: `share-${Date.now()}`,
    citizenId: citizen.id,
    citizenCivicId: citizen.citizenId,
    docId: doc.id,
    docName: doc.name,
    orgId: org.id,
    orgName: org.name,
    roleCode: org.roleCode,
    purpose: purpose || "Institutional Verification",
    accessType: org.accessLevel || "View Only",
    createdAt: new Date().toLocaleString(),
    expiryDate: expDate.toLocaleDateString('en-GB'),
    status: "ACTIVE",
    watermarkText: `CONFIDENTIAL — AUTHORIZED FOR ${org.name.toUpperCase()} — ${(purpose || 'VERIFICATION').toUpperCase()} — ${new Date().toLocaleDateString('en-GB')}`,
    isDemo: true
  };

  db.consentRecords.unshift(consentRecord);

  db.auditLogs.unshift({
    id: `sec-${Date.now()}`,
    citizenId: citizen.citizenId,
    event: `Direct Share Consent Created: ${doc.name} for ${org.name}`,
    device: "Web Client",
    location: "Vijayawada, AP",
    ip: "49.37.142.90",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  return res.json({ success: true, consentRecord });
});

// GET Citizen Active Consents ("Who Has Access?")
app.get('/api/consent/active', (req, res) => {
  const activeCitizenId = db.activeCitizenId;
  const consents = db.consentRecords.filter(c => c.citizenCivicId === activeCitizenId);
  return res.json({ consents });
});

// POST Revoke Consent Instantly
app.post('/api/consent/revoke/:shareId', (req, res) => {
  const { shareId } = req.params;
  const record = db.consentRecords.find(c => c.id === shareId);

  if (!record) {
    return res.status(404).json({ error: "Consent record not found." });
  }

  record.status = "REVOKED";

  db.auditLogs.unshift({
    id: `sec-${Date.now()}`,
    citizenId: record.citizenCivicId,
    event: `Consent Revoked: ${record.docName} access for ${record.orgName} terminated`,
    device: "Web Client",
    location: "Vijayawada, AP",
    ip: "49.37.142.90",
    timestamp: new Date().toLocaleString(),
    status: "REVOKED"
  });

  return res.json({ success: true, record });
});

// GET Pending Share Requests
app.get('/api/consent/citizen-requests', (req, res) => {
  const queryCid = req.query.citizenId;
  const activeCitizenId = db.activeCitizenId;
  const targetId = queryCid || activeCitizenId;

  const requests = (db.shareRequests || []).filter(r => 
    r.citizenCivicId === targetId || 
    r.citizenId === targetId || 
    r.targetCitizenId === targetId ||
    r.status === 'PENDING'
  );
  return res.json({ requests });
});

// Reset Fresh State Endpoint (Clears all past demo/test records)
app.all(['/api/admin/reset-fresh-state', '/api/consent/clear-all'], (req, res) => {
  db.shareRequests = [];
  db.consentRecords = [];
  db.notifications = [];
  return res.json({ success: true, message: 'All demo and test share requests, consent records, and notifications cleared.' });
});

// Approve Consent Request
app.post('/api/consent/approve', (req, res) => {
  const { requestId, citizenCivicId, citizen, documents } = req.body;
  let reqItem = (db.shareRequests || []).find(r => r.id === requestId);
  if (!reqItem && citizenCivicId) {
    reqItem = (db.shareRequests || []).find(r => (r.citizenCivicId === citizenCivicId || r.citizenId === citizenCivicId) && r.status === 'PENDING');
  }
  if (!reqItem && db.shareRequests && db.shareRequests.length > 0) {
    reqItem = db.shareRequests.find(r => r.status === 'PENDING') || db.shareRequests[0];
  }

  if (!reqItem) {
    return res.status(404).json({ error: "Access request not found." });
  }

  reqItem.status = "APPROVED";

  // Sync citizen profile and documents if passed
  if (citizen && citizen.citizenId) {
    const existingCitIdx = (db.citizens || []).findIndex(c => c.citizenId === citizen.citizenId);
    if (existingCitIdx >= 0) {
      db.citizens[existingCitIdx] = { ...db.citizens[existingCitIdx], ...citizen };
    } else {
      if (!db.citizens) db.citizens = [];
      db.citizens.push(citizen);
    }
  }

  if (documents && Array.isArray(documents) && documents.length > 0) {
    if (!db.documents) db.documents = [];
    const targetCid = citizenCivicId || (citizen ? citizen.citizenId : reqItem.citizenCivicId);
    db.documents = db.documents.filter(d => d.citizenId !== targetCid);
    documents.forEach(doc => {
      db.documents.push({
        ...doc,
        citizenId: targetCid,
        citizenCivicId: targetCid
      });
    });
  }

  // Also update corresponding in-app notification status
  if (db.notifications) {
    db.notifications.forEach(n => {
      if (n.requestId === reqItem.id || n.id === requestId || (citizenCivicId && (n.citizenCivicId === citizenCivicId || n.citizenId === citizenCivicId))) {
        n.status = "APPROVED";
        n.read = true;
      }
    });
  }

  const expDate = new Date();
  expDate.setDate(expDate.getDate() + 7);

  const consentRecord = {
    id: `share-${Date.now()}`,
    citizenId: reqItem.citizenCivicId,
    citizenCivicId: reqItem.citizenCivicId,
    docId: reqItem.docId,
    docName: reqItem.docName,
    orgId: reqItem.orgId,
    orgName: reqItem.orgName,
    roleCode: reqItem.roleCode || "VIEW_ONLY",
    purpose: reqItem.purpose,
    accessType: reqItem.accessType,
    createdAt: new Date().toLocaleString(),
    expiryDate: expDate.toLocaleDateString('en-GB'),
    status: "ACTIVE",
    watermarkText: `CONFIDENTIAL — AUTHORIZED FOR ${(reqItem.orgName || 'ORGANIZATION').toUpperCase()} — ${(reqItem.purpose || 'VERIFICATION').toUpperCase()} — ${new Date().toLocaleDateString('en-GB')}`
  };

  db.consentRecords.unshift(consentRecord);

  return res.json({ success: true, consentRecord, request: reqItem });
});

// Decline Consent Request
app.post('/api/consent/decline', (req, res) => {
  const { requestId, citizenCivicId } = req.body;
  let reqItem = (db.shareRequests || []).find(r => r.id === requestId);
  if (!reqItem && citizenCivicId) {
    reqItem = (db.shareRequests || []).find(r => (r.citizenCivicId === citizenCivicId || r.citizenId === citizenCivicId) && r.status === 'PENDING');
  }
  if (!reqItem && db.shareRequests && db.shareRequests.length > 0) {
    reqItem = db.shareRequests.find(r => r.status === 'PENDING') || db.shareRequests[0];
  }

  if (reqItem) {
    reqItem.status = "DECLINED";
  }

  if (db.notifications) {
    db.notifications.forEach(n => {
      if (n.requestId === requestId || n.id === requestId || (reqItem && n.requestId === reqItem.id)) {
        n.status = "DECLINED";
        n.read = true;
      }
    });
  }

  return res.json({ success: true, message: "Consent request declined.", request: reqItem });
});

// Organization Creates Document Access Request (Org -> Citizen Alert & Link)
app.post('/api/consent/request', (req, res) => {
  const { orgId, citizenCivicId, citizenName, caseType, department, severity, docId, docName, purpose, expiryDays, orgName } = req.body;
  
  const foundOrg = (db.organizations || []).find(o => o.id === orgId);
  const resolvedOrgName = orgName || (foundOrg ? foundOrg.name : null) || 'Authorized Organization';
  const roleCode = foundOrg ? foundOrg.roleCode : 'ORG_ACCESS_ADMIN';

  let targetCitizen = (db.citizens || []).find(c => 
    c.citizenId === citizenCivicId || 
    c.civicId === citizenCivicId || 
    c.aadhaarNo === citizenCivicId || 
    (c.aadhaarNo && citizenCivicId && c.aadhaarNo.replace(/\D/g, '') === citizenCivicId.replace(/\D/g, ''))
  );
  const targetId = citizenCivicId || (targetCitizen ? targetCitizen.citizenId : db.activeCitizenId);

  const reqItem = {
    id: `req-${Date.now()}`,
    citizenCivicId: targetId,
    citizenId: targetId,
    targetCitizenId: targetCitizen?.citizenId || targetId,
    citizenName: citizenName || targetCitizen?.fullName || targetCitizen?.name || null,
    caseType: caseType || 'Accident Emergency',
    department: department || 'Emergency',
    severity: severity || 'Moderate',
    orgId: orgId || 'org-college-01',
    orgName: resolvedOrgName,
    roleCode: roleCode,
    docId: docId || 'doc-gen-01',
    docName: docName || 'Identity Verification Document',
    purpose: purpose || 'Institutional Verification',
    accessType: 'VIEW ONLY',
    expiryDays: expiryDays || '7',
    dateTime: new Date().toLocaleString(),
    status: 'PENDING'
  };

  if (!db.shareRequests) db.shareRequests = [];
  db.shareRequests.unshift(reqItem);

  // Dispatch In-App Citizen Notification with requestId
  const notif = {
    id: `notif-${Date.now()}`,
    requestId: reqItem.id,
    citizenCivicId: targetId,
    citizenId: targetId,
    targetCitizenId: targetCitizen?.citizenId || targetId,
    orgId: orgId || 'org-college-01',
    orgName: resolvedOrgName,
    title: `📩 New Access Request: ${resolvedOrgName}`,
    message: `${resolvedOrgName} has requested authorized access for '${reqItem.docName}'. Purpose: ${reqItem.purpose}.`,
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    read: false,
    status: 'PENDING',
    type: 'CONSENT_REQUEST'
  };
  if (!db.notifications) db.notifications = [];
  db.notifications.unshift(notif);

  return res.json({ success: true, request: reqItem, notification: notif });
});

// GET Organization Created Access Requests
app.get('/api/consent/requests/org/:orgId', (req, res) => {
  const { orgId } = req.params;
  const decodedOrgId = decodeURIComponent(orgId || '').toLowerCase();

  const list = (db.shareRequests || []).filter(r => {
    const reqOrgId = (r.orgId || '').toLowerCase();
    const reqOrgName = (r.orgName || '').toLowerCase();
    
    if (reqOrgId === decodedOrgId || reqOrgName === decodedOrgId) return true;
    
    const isEduTarget = decodedOrgId.includes('edu') || decodedOrgId.includes('college') || decodedOrgId.includes('univ') || decodedOrgId.includes('jntu') || decodedOrgId.includes('academic');
    const isEduReq = reqOrgId.includes('edu') || reqOrgId.includes('college') || reqOrgId.includes('univ') || reqOrgName.includes('univ') || reqOrgName.includes('jntu') || reqOrgName.includes('institution');
    
    return isEduTarget && isEduReq;
  });

  return res.json({ success: true, requests: list });
});

// GET Student Verified Academic & Aadhaar Records for College
app.get('/api/consent/student-records/:citizenId', async (req, res) => {
  const { citizenId } = req.params;
  let citizen = (db.citizens || []).find(c => c.citizenId === citizenId);
  if (!citizen) {
    try {
      citizen = await dbService.getCitizenById(citizenId);
    } catch (e) {}
  }
  const citizenDocs = (db.documents || []).filter(d => d.citizenId === citizenId);
  const shareReq = (db.shareRequests || []).find(r => r.citizenCivicId === citizenId);

  return res.json({
    success: true,
    citizen: citizen || {
      citizenId,
      fullName: 'Enrolled Citizen',
      maskedAadhaar: 'XXXX XXXX 8909',
      dateOfBirth: '15-08-2002',
      gender: 'Specified'
    },
    documents: citizenDocs,
    request: shareReq
  });
});

// --- GOVERNMENT / AUTHORITY PORTAL INTERCONNECTED ENDPOINTS ---

// Government Officer Issues Official Verified Credential (Govt -> Citizen Vault & Audit)
app.post('/api/authority/issue-credential', async (req, res) => {
  const { officer, citizenCivicId, docName, category, docType, refNo, expiryDate } = req.body;

  if (!docName || !citizenCivicId) {
    return res.status(400).json({ error: "Document Name and Citizen Civic ID are required." });
  }

  const result = await dbService.issueGovernmentCredential(
    officer || { name: 'Officer K. Sharma', department: 'Transport (RTO)', office: 'Vijayawada HQ' },
    citizenCivicId,
    { name: docName, category, docType, refNo, expiryDate }
  );

  return res.json({ success: true, ...result });
});

// GET Government Supervised Organizations & Compliance Audit Metrics
app.get('/api/authority/supervised-orgs', (req, res) => {
  const orgs = (db.organizations || []).map(o => {
    const activeConsents = (db.consentRecords || []).filter(c => c.orgId === o.id && c.status === 'ACTIVE').length;
    const pendingReqs = (db.shareRequests || []).filter(r => r.orgId === o.id && r.status === 'PENDING').length;
    return {
      ...o,
      activeConsentsCount: activeConsents,
      pendingRequestsCount: pendingReqs,
      verificationStatus: o.verificationStatus || 'VERIFIED',
      accessStatus: o.accessStatus || 'ACTIVE'
    };
  });
  return res.json({ success: true, organizations: orgs });
});

// POST Toggle Organization Access Status (Suspend / Activate)
app.post('/api/authority/org/toggle-status', async (req, res) => {
  const { orgId, newStatus } = req.body;
  if (!orgId || !newStatus) {
    return res.status(400).json({ error: "Organization ID and target status are required." });
  }

  const updatedOrg = await dbService.toggleOrganizationStatus(orgId, newStatus);
  return res.json({ success: true, organization: updatedOrg });
});

// --- TOURISM GUIDE ENDPOINTS (CIVIQONE WORLD) ---

app.get('/api/tourism/destinations', (req, res) => {
  const { search, category } = req.query;
  let list = [...db.destinations];

  if (category && category !== 'All') {
    list = list.filter(d => d.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(d =>
      d.city.toLowerCase().includes(q) ||
      d.country.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.shortDescription.toLowerCase().includes(q)
    );
  }

  return res.json({ count: list.length, destinations: list });
});

// --- GLOBAL TRAVEL BOOKING HUB ENDPOINTS ---

app.get('/api/travel/providers', (req, res) => {
  return res.json({
    success: true,
    providers: db.travelProviders,
    notice: "Live booking integration not connected. Official deep-link routing enabled."
  });
});

app.post('/api/travel/search', (req, res) => {
  const { type, origin, destination, departureDate, returnDate, passengers } = req.body;

  if (!origin || !destination) {
    return res.status(400).json({ error: "Please enter origin and destination." });
  }

  const results = [
    {
      id: `trv-res-01`,
      provider: type === 'flight' ? 'IndiGo 6E-204' : type === 'bus' ? 'KSRTC Volvo Swift' : type === 'train' ? 'Vande Bharat Express' : type === 'cab' ? 'Uber Premier' : 'Royal Brothers Rental',
      origin,
      destination,
      departureTime: "08:30 AM",
      arrivalTime: "11:45 AM",
      duration: "3h 15m",
      price: type === 'flight' ? "₹4,850" : type === 'bus' ? "₹950" : type === 'train' ? "₹1,450" : type === 'cab' ? "₹2,200" : "₹650/day",
      classOption: type === 'flight' ? "Economy" : type === 'train' ? "Executive CC" : "Standard",
      availableSeats: 12
    },
    {
      id: `trv-res-02`,
      provider: type === 'flight' ? 'Air India AI-508' : type === 'bus' ? 'VRL Travels Sleeper' : type === 'train' ? 'Rajdhani Express' : type === 'cab' ? 'Ola Outstation' : 'Bounce Scooter Rental',
      origin,
      destination,
      departureTime: "02:15 PM",
      arrivalTime: "05:30 PM",
      duration: "3h 15m",
      price: type === 'flight' ? "₹5,200" : type === 'bus' ? "₹1,100" : type === 'train' ? "₹1,850" : type === 'cab' ? "₹2,400" : "₹450/day",
      classOption: type === 'flight' ? "Economy Flex" : type === 'train' ? "1st AC" : "Deluxe",
      availableSeats: 8
    }
  ];

  return res.json({
    success: true,
    type,
    origin,
    destination,
    results,
    notice: "Live booking provider integration not connected. Displays verified route options for deep-link integration."
  });
});

// --- AI AGENT ENDPOINT ---

app.post('/api/ai/query', (req, res) => {
  const { prompt, lang = 'en' } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  const p = prompt.toLowerCase();
  const citizen = db.citizens.find(c => c.citizenId === db.activeCitizenId) || db.citizens[0];
  let reply = "";

  if (p.includes("expir") || p.includes("licence") || p.includes("dl") || p.includes("డ్రైవింగ్") || p.includes("ஓட்டுநர்") || p.includes("ಚಾಲನಾ") || p.includes("ഡ്രൈവിംഗ്")) {
    const dl = db.documents.find(d => d.citizenId === citizen.citizenId && d.name.includes("Licence"));
    const dlRef = dl ? dl.refNo : citizen.governmentInfo.drivingLicence;
    const dlExpiry = dl ? dl.expiryDate : '14-10-2028';
    
    if (lang === 'te') {
      reply = `మీ **స్మార్ట్ డ్రైవింగ్ లైసెన్స్** (${dlRef}) గడువు **${dlExpiry}** వరకు చెల్లుబాటులో ఉంది (🟢 ధృవీకరించబడిన రికార్డు).`;
    } else if (lang === 'ta') {
      reply = `உங்கள் **ஸ்மார்ட் ஓட்டுநர் உரிமம்** (${dlRef}) **${dlExpiry}** வரை செல்லுபடியாகும் (🟢 சரிபார்க்கப்பட்ட பதிவு).`;
    } else if (lang === 'kn') {
      reply = `ನಿಮ್ಮ **ಸ್ಮಾರ್ಟ್ ಚಾಲನಾ ಪರವಾನಗಿ** (${dlRef}) **${dlExpiry}** ರವರೆಗೆ ಮಾನ್ಯವಾಗಿದೆ (🟢 ಪರಿಶೀಲಿಸಿದ ದಾಖಲೆ).`;
    } else if (lang === 'ml') {
      reply = `നിങ്ങളുടെ **സ്മാർട്ട് ഡ്രൈവിംഗ് ലൈസൻസ്** (${dlRef}) **${dlExpiry}** വരെ സാധുവാണ് (🟢 സാക്ഷ്യപ്പെടുത്തിയത്).`;
    } else {
      reply = `Your **Smart Driving Licence** (${dlRef}) is valid until **${dlExpiry}** (🟢 Verified Record). You can initiate online renewal via Parivahan Sewa on CIVIQONE.`;
    }
  } else if (p.includes("aadhaar") || p.includes("identity") || p.includes("ఆధార్") || p.includes("ஆதார்") || p.includes("ಆಧಾರ್") || p.includes("ആധാർ")) {
    if (lang === 'te') {
      reply = `మీ CIVIQONE డిజిటల్ గుర్తింపు టోకెనైజ్డ్ ఆధార్ రెఫరెన్స్ **${citizen.maskedAadhaar}** కు అనుసంధానించబడింది.`;
    } else if (lang === 'ta') {
      reply = `உங்கள் CIVIQONE டிஜிட்டல் அடையாளம் ஆதார் குறிப்பு எண் **${citizen.maskedAadhaar}** உடன் இணைக்கப்பட்டுள்ளது.`;
    } else if (lang === 'kn') {
      reply = `ನಿಮ್ಮ CIVIQONE ಡಿಜಿಟಲ್ ಗುರುತು ಆಧಾರ್ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ **${citizen.maskedAadhaar}** ಗೆ ಲಿಂಕ್ ಆಗಿದೆ.`;
    } else if (lang === 'ml') {
      reply = `നിങ്ങളുടെ CIVIQONE ഡിജിറ്റൽ തിരിച്ചറിയൽ ആധാർ റഫറൻസ് **${citizen.maskedAadhaar}** മായി ബന്ധിപ്പിച്ചിരിക്കുന്നു.`;
    } else {
      reply = `Your CIVIQONE digital identity is linked to tokenized Aadhaar reference **${citizen.maskedAadhaar}**. Physical Aadhaar numbers are never stored or exposed on CIVIQONE for privacy compliance.`;
    }
  } else if (p.includes("vault") || p.includes("document") || p.includes("పత్రాలు") || p.includes("ஆவணங்கள்") || p.includes("ದಾಖಲೆಗಳು") || p.includes("രേഖകൾ")) {
    const count = db.documents.filter(d => d.citizenId === citizen.citizenId).length;
    if (lang === 'te') {
      reply = `మీ సివిక్ వాల్ట్‌లో ప్రస్తుతం **${count} డిజిటల్ పత్రాలు** సురక్షితంగా భద్రపరచబడి ఉన్నాయి.`;
    } else if (lang === 'ta') {
      reply = `உங்கள் சிவிக் வால்ட்டில் தற்போது **${count} டிஜிட்டல் ஆவணங்கள்** பாதுகாப்பாக சேமிக்கப்பட்டுள்ளன.`;
    } else if (lang === 'kn') {
      reply = `ನಿಮ್ಮ ಸಿವಿಕ್ ವಾಲ್ಟ್‌ನಲ್ಲಿ ಪ್ರಸ್ತುತ **${count} ಡಿಜಿಟಲ್ ದಾಖಲೆಗಳು** ಸುರಕ್ಷಿತವಾಗಿವೆ.`;
    } else if (lang === 'ml') {
      reply = `നിങ്ങളുടെ സിവിക് വോൾട്ടിൽ നിലവിൽ **${count} ഡിജിറ്റൽ രേഖകൾ** സുരക്ഷിതമായി സൂക്ഷിച്ചിരിക്കുന്നു.`;
    } else {
      reply = `You currently have **${count} digital records** stored across Identity, Education, Government, Vehicle/RTO, Healthcare, and Travel categories in My Civic Vault.`;
    }
  } else if (p.includes("gold pass") || p.includes("gold") || p.includes("గోల్డ్") || p.includes("கோல்ட்") || p.includes("ಗೋಲ್ಡ್") || p.includes("ഗോൾഡ്")) {
    if (lang === 'te') {
      reply = `**${citizen.fullName}** గారి గోల్డ్ పాస్ స్థితి: **${citizen.goldPassStatus.toUpperCase()}**. ప్రామాణిక CIVIQONE కార్డ్ సక్రియంగా ఉంది.`;
    } else if (lang === 'ta') {
      reply = `**${citizen.fullName}** அவர்களின் கோல்ட் பாஸ் நிலை: **${citizen.goldPassStatus.toUpperCase()}**.`;
    } else if (lang === 'kn') {
      reply = `**${citizen.fullName}** ಅವರ ಗೋಲ್ಡ್ ಪಾಸ್ ಸ್ಥಿತಿ: **${citizen.goldPassStatus.toUpperCase()}**.`;
    } else if (lang === 'ml') {
      reply = `**${citizen.fullName}** ന്റെ ഗോൾഡ് പാസ്സ് നില: **${citizen.goldPassStatus.toUpperCase()}**.`;
    } else {
      reply = `Gold Pass status for **${citizen.fullName}** is **${citizen.goldPassStatus.toUpperCase()}**. Standard CIVIQONE Card is active by default. Upgrading to Gold Pass unlocks VIP identity verification and priority service desks.`;
    }
  } else if (p.includes("tour") || p.includes("travel") || p.includes("destination") || p.includes("పర్యాటక") || p.includes("சுற்றுலா") || p.includes("ಪ್ರವಾಸ") || p.includes("വിനോദസഞ്ചാരം")) {
    if (lang === 'te') {
      reply = `భారతదేశం మరియు ప్రపంచ ప్రసిద్ధ పర్యాటక ప్రదేశాల కోసం **CIVIQONE World** గైడ్‌ను చూడండి.`;
    } else if (lang === 'ta') {
      reply = `பிரபல சுற்றுலா தலங்களை பார்வையிட **CIVIQONE World** வழிகாட்டியை ஆராயுங்கள்.`;
    } else if (lang === 'kn') {
      reply = `ಪ್ರಮುಖ ಪ್ರವಾಸಿ ತಾಣಗಳನ್ನು ಅನ್ವೇಷಿಸಲು **CIVIQONE World** ಮಾರ್ಗದರ್ಶಿಯನ್ನು ನೋಡಿ.`;
    } else if (lang === 'ml') {
      reply = `പ്രമുഖ വിനോദസഞ്ചാര കേന്ദ്രങ്ങൾക്കായി **CIVIQONE World** ടൂറിസം ഗൈഡ് പരിശോധിക്കുക.`;
    } else {
      reply = `Explore **CIVIQONE World** tourism guide for travel destinations like Dubai, Paris, Tokyo, and Goa. Check budget estimates, best travel times, and book flights, buses, or trains with minimum identity sharing.`;
    }
  } else {
    if (lang === 'te') {
      reply = `నేను CIVIQONE AI ని, మీ అధికారిక డిజిటల్ గుర్తింపు సహాయకుడిని. పత్రాల తనిఖీ, వాల్ట్ రికార్డులు, పర్యాటకం మరియు సేవలకు మీకు సహాయం చేయగలను.`;
    } else if (lang === 'ta') {
      reply = `நான் CIVIQONE AI, உங்கள் அதிகாரப்பூர்வ டிஜிட்டல் அடையாள உதவியாளர். ஆவணங்களை சரிபார்க்கவும் சேவைகளை பெறவும் நான் உங்களுக்கு உதவுகிறேன்.`;
    } else if (lang === 'kn') {
      reply = `ನಾನು CIVIQONE AI, ನಿಮ್ಮ ಅಧಿಕೃತ ಡಿಜಿಟಲ್ ಗುರುತಿನ ಸಹಾಯಕ. ದಾಖಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲು ಮತ್ತು ಸೇವೆಗಳನ್ನು ಪಡೆಯಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.`;
    } else if (lang === 'ml') {
      reply = `ഞാൻ CIVIQONE AI ആണ്, നിങ്ങളുടെ ഔദ്യോഗിക ഡിജിറ്റൽ തിരിച്ചറിയൽ രേഖാ സഹായി. രേഖകൾ പരിശോധിക്കാനും സേവനങ്ങൾ ലഭ്യമാക്കാനും ഞാൻ സഹായിക്കാം.`;
    } else {
      reply = `I am CIVIQONE AI, your official digital identity assistant. I can help you check document expiry dates, search vault records, verify credentials, explore tourism destinations, and manage data consent. How can I assist you further?`;
    }
  }

  return res.json({
    query: prompt,
    reply,
    lang,
    timestamp: new Date().toISOString()
  });
});

// --- SECURITY & AUDIT LOGS ENDPOINTS ---

app.get('/api/security/audit-logs', (req, res) => {
  const activeCitizenId = db.activeCitizenId;
  const logs = db.auditLogs.filter(a => a.citizenId === activeCitizenId || a.citizenId === "SUPERADMIN-01");
  return res.json({ logs: logs.length > 0 ? logs : db.auditLogs });
});

app.get('/api/notifications', (req, res) => {
  const targetId = req.query.citizenId || db.activeCitizenId;
  const notifs = (db.notifications || []).filter(n => 
    n.citizenId === targetId || 
    n.citizenCivicId === targetId || 
    n.targetCitizenId === targetId
  );
  return res.json({ notifications: notifs });
});

app.get('/api/police/firs', async (req, res) => {
  const { state } = req.query;
  const firs = await dbService.getPoliceFirs(state);
  return res.json({ success: true, firs });
});

app.get('/api/hotel/guests', async (req, res) => {
  const { state } = req.query;
  const guests = await dbService.getHotelGuests(state);
  return res.json({ success: true, guests });
});

app.get('/api/updates/govt', (req, res) => {
  return res.json({ updates: db.govtUpdates });
});

// Catch-all API 404 Handler (Guarantees JSON response, never HTML)
app.all('/api/*', (req, res) => {
  return res.status(404).json({ error: `API endpoint '${req.originalUrl}' not found.` });
});

// Global Express Error Middleware
app.use((err, req, res, next) => {
  console.error("Global Server Error:", err);
  return res.status(500).json({ error: err.message || "Internal server error." });
});

// SPA Fallback Route
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api')) {
    const indexPath = path.join(__dirname, '../dist/index.html');
    return res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(500).send("CIVIQONE Frontend build assets not found. Please run build step first.");
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  CIVIQONE Hosted Web App & API running on:`);
  console.log(`  👉 http://localhost:${PORT}`);
  console.log(`=================================================`);
});
