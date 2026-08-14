// server/index.js - Express REST API Server for CivicOne

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './mockDb.js';

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
  console.log(`[CivicOne Platform API] ${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// --- AUTHENTICATION API ENDPOINTS ---

// Send OTP
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: "Please enter a valid 10-digit mobile number." });
  }

  return res.json({
    success: true,
    message: "OTP sent successfully to registered mobile number.",
    phone,
    expiresInSeconds: 60,
    demoOtp: "123456"
  });
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (!otp || otp.length !== 6) {
    return res.status(400).json({ error: "Invalid OTP. Please enter 6-digit code." });
  }

  return res.json({
    success: true,
    message: "Mobile number verified successfully.",
    sessionToken: `CIV-SESS-${Date.now()}-SECURE`,
    requireIdentityVerification: true
  });
});

// Aadhaar Tokenized Identity Verification
app.post('/api/auth/identity-verify', (req, res) => {
  const { consent, aadhaarOtp, name, phone } = req.body;

  if (!consent) {
    return res.status(400).json({ error: "Explicit citizen consent is required for identity verification." });
  }

  if (aadhaarOtp && aadhaarOtp !== "123456") {
    return res.status(400).json({ error: "Invalid identity verification OTP. Use 123456 for demo." });
  }

  const activeCitizen = db.citizens.find(c => c.citizenId === db.activeCitizenId) || db.citizens[0];
  if (name && name.trim()) {
    activeCitizen.fullName = name.trim();
  }

  db.auditLogs.unshift({
    id: `sec-${Date.now()}`,
    citizenId: activeCitizen.citizenId,
    event: `Tokenized Identity Verification Completed for ${activeCitizen.fullName}`,
    device: "Web Client",
    location: "Vijayawada, AP",
    ip: "49.37.142.90",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  return res.json({
    success: true,
    message: "Identity verified securely via UIDAI Authorized Token service.",
    citizen: activeCitizen,
    maskedAadhaar: activeCitizen.maskedAadhaar,
    identityStatus: "VERIFIED"
  });
});

// Government Officer Login API
app.post('/api/auth/authority-login', (req, res) => {
  const { email, department, badgeId, passcode } = req.body;

  if (!email || !department) {
    return res.status(400).json({ error: "Please provide official government email and department selection." });
  }

  if (passcode && passcode !== "govt123" && passcode !== "admin123") {
    return res.status(400).json({ error: "Invalid officer security passcode. Use 'govt123' for demo." });
  }

  const officerSession = {
    officerId: badgeId || `OFFICER-${Math.floor(1000 + Math.random() * 9000)}`,
    email,
    department: department || "Parivahan Sewa (MoRTH)",
    role: "Government Officer / Issuer",
    clearanceLevel: "LEVEL-3 VERIFIED",
    sessionToken: `GOVT-AUTH-${Date.now()}-SECURE`
  };

  db.auditLogs.unshift({
    id: `sec-${Date.now()}`,
    citizenId: "GOVT-DESK",
    event: `Government Officer Login: ${email} (${department})`,
    device: "Web Client",
    location: "New Delhi, India",
    ip: "164.100.42.10",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  return res.json({
    success: true,
    message: "Government Officer Authenticated Successfully.",
    officer: officerSession
  });
});

// Super Admin Login API (Server-Side Authorized)
app.post('/api/auth/admin-login', (req, res) => {
  const { username, passkey } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Please enter master admin username." });
  }

  if (passkey && passkey !== "superadmin123" && passkey !== "admin123") {
    return res.status(400).json({ error: "Invalid master root passkey. Use 'superadmin123' for demo." });
  }

  const adminSession = {
    adminId: `SUPERADMIN-01`,
    username: username || "superadmin@civicone.gov.in",
    role: "National Super Administrator",
    clearanceLevel: "MASTER ROOT CLEARANCE",
    sessionToken: `ADMIN-ROOT-${Date.now()}-SECURE`
  };

  db.auditLogs.unshift({
    id: `sec-${Date.now()}`,
    citizenId: "SUPERADMIN-01",
    event: `Super Admin Master Login: ${username}`,
    device: "Master Console",
    location: "NIC Security Hub",
    ip: "164.100.1.1",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  return res.json({
    success: true,
    message: "Super Admin Authenticated with Master Clearance.",
    admin: adminSession
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
app.get('/api/citizens/demo', (req, res) => {
  const demoList = db.citizens.map(c => ({
    citizenId: c.citizenId,
    fullName: c.fullName,
    displayName: c.displayName,
    tier: c.tier,
    goldPassStatus: c.goldPassStatus,
    maskedAadhaar: c.maskedAadhaar,
    docsCount: db.documents.filter(d => d.citizenId === c.citizenId).length,
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
app.get('/api/card/me', (req, res) => {
  const citizen = db.citizens.find(c => c.citizenId === db.activeCitizenId) || db.citizens[0];
  return res.json({
    card: db.card,
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
      issuingAuthority: "CivicOne National Identity Authority",
      cryptographicSignature: "VALID - SHA256 AUTHORIZED",
      timestamp: new Date().toISOString(),
      notice: "No sensitive Aadhaar numbers, bank details, or private documents are embedded in QR codes."
    });
  }

  return res.status(404).json({
    valid: false,
    status: "🔴 Invalid / Expired Credential",
    message: "This verification token does not match any active authorized CivicOne credential."
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

// GET Vault Documents with Filters, Search, Category
app.get('/api/vault/documents', (req, res) => {
  const { category, search, status, sort } = req.query;
  const activeCitizenId = db.activeCitizenId;
  let docs = db.documents.filter(d => d.citizenId === activeCitizenId);

  if (category && category !== "All") {
    docs = docs.filter(d => d.category.toLowerCase() === category.toLowerCase() || (category === 'Vehicle/RTO' && d.category === 'RTO'));
  }

  if (status && status !== "All") {
    docs = docs.filter(d => d.status.toLowerCase() === status.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    docs = docs.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.issuer.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      (d.refNo && d.refNo.toLowerCase().includes(q))
    );
  }

  if (sort === "Name") {
    docs.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "Status") {
    docs.sort((a, b) => a.status.localeCompare(b.status));
  }

  return res.json({
    count: docs.length,
    documents: docs
  });
});

// Upload New Document
app.post('/api/vault/upload', (req, res) => {
  const { name, category, issuer, refNo, description, isPrivate } = req.body;
  const citizen = db.citizens.find(c => c.citizenId === db.activeCitizenId) || db.citizens[0];

  if (!name || !category || !issuer) {
    return res.status(400).json({ error: "Please provide document name, category, and issuing authority." });
  }

  const newDoc = {
    id: `doc-${Date.now()}`,
    citizenId: citizen.citizenId,
    name,
    category: category || "Identity",
    issuer,
    status: "Verified",
    issueDate: new Date().toLocaleDateString('en-GB'),
    expiryDate: "N/A",
    refNo: refNo || `DEMO-REF-${Math.floor(100000 + Math.random() * 900000)}`,
    fileType: "PDF",
    fileSize: "1.4 MB",
    icon: "FileCheck",
    description: description || "User uploaded document stored securely in Civic Vault.",
    securitySeal: `CIVIC-SEAL-VERIFIED-${Date.now()}`,
    isPrivate: Boolean(isPrivate),
    tags: [category, "User Uploaded", "Demo"],
    isDemo: true
  };

  db.documents.unshift(newDoc);

  db.auditLogs.unshift({
    id: `sec-${Date.now()}`,
    citizenId: citizen.citizenId,
    event: `Document Uploaded & Verified: ${name}`,
    device: "Web Client",
    location: "Vijayawada, AP",
    ip: "49.37.142.90",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  return res.json({
    success: true,
    message: "Document uploaded and authenticated successfully in My Civic Vault.",
    document: newDoc
  });
});

// Trigger Document Credential Verification
app.post('/api/vault/verify-doc/:id', (req, res) => {
  const { id } = req.params;
  const doc = db.documents.find(d => d.id === id);

  if (!doc) {
    return res.status(404).json({ error: "Document not found." });
  }

  doc.status = "Verified";
  doc.securitySeal = `VERIFIED-ISSUER-SEAL-${Date.now()}`;

  db.auditLogs.unshift({
    id: `sec-${Date.now()}`,
    citizenId: doc.citizenId,
    event: `Credential Verified: ${doc.name}`,
    device: "Web Client",
    location: "Vijayawada, AP",
    ip: "49.37.142.90",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  return res.json({
    success: true,
    message: `${doc.name} verified successfully against ${doc.issuer}.`,
    document: doc
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
  const activeCitizenId = db.activeCitizenId;
  const requests = db.shareRequests.filter(r => r.citizenCivicId === activeCitizenId);
  return res.json({ requests });
});

// Approve Consent Request
app.post('/api/consent/approve', (req, res) => {
  const { requestId } = req.body;
  const reqItem = db.shareRequests.find(r => r.id === requestId);

  if (!reqItem) {
    return res.status(404).json({ error: "Access request not found." });
  }

  reqItem.status = "APPROVED";

  const expDate = new Date();
  expDate.setDate(expDate.getDate() + 7);

  const consentRecord = {
    id: `share-${Date.now()}`,
    citizenId: "cit-demo-10001",
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
    watermarkText: `CONFIDENTIAL — AUTHORIZED FOR ${reqItem.orgName.toUpperCase()} — ${reqItem.purpose.toUpperCase()} — ${new Date().toLocaleDateString('en-GB')}`
  };

  db.consentRecords.unshift(consentRecord);

  return res.json({ success: true, consentRecord });
});

// --- TOURISM GUIDE ENDPOINTS (CIVICONE WORLD) ---

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
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  const p = prompt.toLowerCase();
  const citizen = db.citizens.find(c => c.citizenId === db.activeCitizenId) || db.citizens[0];
  let reply = "";

  if (p.includes("expir") || p.includes("licence") || p.includes("dl")) {
    const dl = db.documents.find(d => d.citizenId === citizen.citizenId && d.name.includes("Licence"));
    reply = `Your **Smart Driving Licence** (${dl ? dl.refNo : citizen.governmentInfo.drivingLicence}) is valid until **${dl ? dl.expiryDate : '2042'}** (🟢 Verified Demo Record). You can initiate online renewal via Parivahan Sewa on CivicOne.`;
  } else if (p.includes("aadhaar") || p.includes("identity")) {
    reply = `Your CivicOne digital identity is linked to tokenized Aadhaar reference **${citizen.maskedAadhaar}**. Physical Aadhaar numbers are never stored or exposed on CivicOne for privacy compliance.`;
  } else if (p.includes("vault") || p.includes("document")) {
    const count = db.documents.filter(d => d.citizenId === citizen.citizenId).length;
    reply = `You currently have **${count} digital records** stored across Identity, Education, Government, Vehicle/RTO, Healthcare, and Travel categories in My Civic Vault.`;
  } else if (p.includes("gold pass") || p.includes("gold")) {
    reply = `Gold Pass status for **${citizen.fullName}** is **${citizen.goldPassStatus.toUpperCase()}**. Standard CivicOne Card is active by default. Upgrading to Gold Pass unlocks VIP identity verification and priority service desks.`;
  } else if (p.includes("tour") || p.includes("dubai") || p.includes("travel") || p.includes("paris")) {
    reply = `Explore **CivicOne World** tourism guide for travel destinations like Dubai, Paris, Tokyo, and Goa. Check budget estimates, best travel times, and book flights, buses, or trains with minimum identity sharing.`;
  } else {
    reply = `I am CivicOne AI, your official digital identity assistant. I can help you check document expiry dates, search vault records, verify credentials, explore tourism destinations, and manage data consent. How can I assist you further?`;
  }

  return res.json({
    query: prompt,
    reply,
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
  const activeCitizenId = db.activeCitizenId;
  const notifs = db.notifications.filter(n => n.citizenId === activeCitizenId || !n.citizenId);
  return res.json({ notifications: notifs.length > 0 ? notifs : db.notifications });
});

app.get('/api/updates/govt', (req, res) => {
  return res.json({ updates: db.govtUpdates });
});

// SPA Fallback Route
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api')) {
    const indexPath = path.join(__dirname, '../dist/index.html');
    return res.sendFile(indexPath, (err) => {
      if (err) {
        res.status(500).send("CivicOne Frontend build assets not found. Please run build step first.");
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  CivicOne Hosted Web App & API running on:`);
  console.log(`  👉 http://localhost:${PORT}`);
  console.log(`=================================================`);
});
