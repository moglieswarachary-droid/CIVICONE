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
  console.log(`[CivicOne Web & API] ${new Date().toISOString()} ${req.method} ${req.url}`);
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
    demoOtp: "123456" // Standard demo OTP
  });
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (!otp || otp.length !== 6) {
    return res.status(400).json({ error: "Invalid OTP. Please enter 6-digit code." });
  }

  // Accept 123456 or any 6-digit number in demo mode
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

  if (name && name.trim()) {
    db.citizen.name = name.trim();
    db.card.holderName = name.trim();
  }

  if (phone && phone.trim()) {
    db.citizen.phone = phone.trim();
  }

  // Add audit log
  db.securityLogs.unshift({
    id: `sec-${Date.now()}`,
    event: `Tokenized Identity Verification Completed for ${db.citizen.name}`,
    device: "Web Client",
    location: "Mumbai, India",
    ip: "49.37.142.90",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  return res.json({
    success: true,
    message: "Identity verified securely via UIDAI Authorized Token service.",
    citizen: db.citizen,
    maskedAadhaar: db.citizen.maskedAadhaar,
    identityStatus: "VERIFIED"
  });
});

// Government Officer Login API
app.post('/api/auth/authority-login', (req, res) => {
  const { email, department, badgeId, passcode } = req.body;

  if (!email || !department) {
    return res.status(400).json({ error: "Please provide official government email and department selection." });
  }

  // Demo passcode verification
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

  db.securityLogs.unshift({
    id: `sec-${Date.now()}`,
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

// Super Admin Login API
app.post('/api/auth/admin-login', (req, res) => {
  const { username, masterKey, passkey } = req.body;

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

  db.securityLogs.unshift({
    id: `sec-${Date.now()}`,
    event: `Super Admin Master Login: ${username}`,
    device: "Web Client",
    location: "National Informatics Centre",
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

// Get Current Session
app.get('/api/auth/session', (req, res) => {
  return res.json({
    authenticated: true,
    citizen: db.citizen,
    maskedAadhaar: db.citizen.maskedAadhaar
  });
});

// --- VIRTUAL CARD & QR ENDPOINTS ---

// Get Virtual Card Details
app.get('/api/card/me', (req, res) => {
  return res.json({
    card: db.card,
    citizen: db.citizen
  });
});

// Update Card Tier (STANDARD <-> GOLD)
app.post('/api/card/update-tier', (req, res) => {
  const { tier } = req.body;
  const newTier = tier === 'STANDARD' ? 'STANDARD' : 'GOLD';

  db.card.tier = newTier;
  db.card.tierBadge = newTier === 'GOLD' ? '👑 Premium Gold Citizen' : 'Verified Citizen';
  db.card.securityChipId = newTier === 'GOLD' ? 'GOLD-CHIP-9984-SEC-ID' : 'CHIP-9984-SEC-ID';

  db.securityLogs.unshift({
    id: `sec-${Date.now()}`,
    event: `Civic Card Tier Updated to ${newTier}`,
    device: "Web Client",
    location: "Mumbai, India",
    ip: "49.37.142.90",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  return res.json({
    success: true,
    message: `Civic Card successfully updated to ${newTier} tier.`,
    card: db.card
  });
});

// Public Dynamic QR Verification Endpoint
app.get('/api/card/verify-qr/:token', (req, res) => {
  const { token } = req.params;

  if (token === db.card.verificationToken || token.startsWith("CIV-TOKEN-")) {
    return res.json({
      valid: true,
      status: "🟢 Verified Identity",
      civicId: db.card.civicId,
      holderName: db.citizen.name,
      maskedAadhaar: db.citizen.maskedAadhaar,
      issueDate: db.card.issueDate,
      validUntil: db.card.expiryDate,
      issuingAuthority: "CivicOne National Identity Authority",
      cryptographicSignature: "VALID - SHA256 AUTHORIZED",
      timestamp: new Date().toISOString()
    });
  }

  return res.status(404).json({
    valid: false,
    status: "🔴 Invalid / Expired Credential",
    message: "This verification token does not match any active authorized CivicOne credential."
  });
});

// Share Card / Credential Link
app.post('/api/card/share', (req, res) => {
  const { docId, durationHours } = req.body;
  const shareToken = `SHARE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  return res.json({
    success: true,
    shareUrl: `http://localhost:3000/verify?token=${shareToken}`,
    expiresInHours: durationHours || 24,
    passcode: Math.floor(1000 + Math.random() * 9000).toString()
  });
});

// --- MY CIVIC VAULT ENDPOINTS ---

// Get Vault Summary Metrics
app.get('/api/vault/summary', (req, res) => {
  const docs = db.documents;
  const verified = docs.filter(d => d.status === 'Verified').length;
  const pending = docs.filter(d => d.status === 'Pending Verification').length;
  const expiringSoon = docs.filter(d => d.status === 'Expiring Soon' || (d.expiryDate && d.expiryDate.includes('2026'))).length;
  
  return res.json({
    totalDocuments: docs.length,
    verifiedDocuments: verified,
    pendingVerification: pending,
    expiringSoon: expiringSoon,
    recentlyAdded: 3
  });
});

// Get Vault Documents with Filters, Search, and Sort
app.get('/api/vault/documents', (req, res) => {
  const { category, search, status, sort, favoritesOnly } = req.query;
  let docs = [...db.documents];

  if (category && category !== "All") {
    docs = docs.filter(d => d.category.toLowerCase() === category.toLowerCase());
  }

  if (status && status !== "All") {
    if (status === "Favorites") {
      docs = docs.filter(d => d.isFavorite);
    } else if (status === "Private") {
      docs = docs.filter(d => d.isPrivate);
    } else {
      docs = docs.filter(d => d.status.toLowerCase() === status.toLowerCase());
    }
  }

  if (favoritesOnly === "true") {
    docs = docs.filter(d => d.isFavorite);
  }

  if (search) {
    const q = search.toLowerCase();
    docs = docs.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.issuer.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      (d.refNo && d.refNo.toLowerCase().includes(q)) ||
      (d.tags && d.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // Sorting
  if (sort === "Name") {
    docs.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "Expiry Date") {
    docs.sort((a, b) => (a.expiryDate || '').localeCompare(b.expiryDate || ''));
  } else if (sort === "Verification Status") {
    docs.sort((a, b) => a.status.localeCompare(b.status));
  }

  return res.json({
    count: docs.length,
    documents: docs
  });
});

// Upload New Document with OCR Auto-Extraction Preview
app.post('/api/vault/upload', (req, res) => {
  const { name, category, issuer, refNo, description, isPrivate } = req.body;

  if (!name || !category || !issuer) {
    return res.status(400).json({ error: "Please provide document name, category, and issuing authority." });
  }

  const newDoc = {
    id: `doc-${Date.now()}`,
    name,
    category: category || "Personal",
    issuer,
    status: "Verified",
    issueDate: new Date().toLocaleDateString('en-GB'),
    expiryDate: "N/A",
    refNo: refNo || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
    fileType: "PDF",
    fileSize: "1.4 MB",
    icon: category === 'Healthcare' ? 'HeartPulse' : category === 'RTO' ? 'Car' : category === 'Education' ? 'GraduationCap' : 'FileCheck',
    description: description || "User uploaded document authenticated & stored in Civic Vault.",
    securitySeal: `CIVIC-SEAL-VERIFIED-${Date.now()}`,
    isPrivate: Boolean(isPrivate),
    tags: [category, "User Uploaded"]
  };

  db.documents.unshift(newDoc);

  db.securityLogs.unshift({
    id: `sec-${Date.now()}`,
    event: `Document Uploaded & Verified: ${name}`,
    device: "Web Client",
    location: "Mumbai, India",
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

// Trigger Document Credential Verification against Issuer API
app.post('/api/vault/verify-doc/:id', (req, res) => {
  const { id } = req.params;
  const doc = db.documents.find(d => d.id === id);

  if (!doc) {
    return res.status(404).json({ error: "Document not found." });
  }

  doc.status = "Verified";
  doc.securitySeal = `VERIFIED-ISSUER-SEAL-${Date.now()}`;

  db.securityLogs.unshift({
    id: `sec-${Date.now()}`,
    event: `Credential Verified: ${doc.name}`,
    device: "Web Client",
    location: "Mumbai, India",
    ip: "49.37.142.90",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  return res.json({
    success: true,
    message: `${doc.name} verified successfully against ${doc.issuer}.`,
    verificationCheck: {
      credentialFound: true,
      issuerConfirmed: true,
      informationMatched: true,
      credentialActive: true
    },
    document: doc
  });
});

// --- SERVICES & UPDATES ENDPOINTS ---

app.get('/api/services', (req, res) => {
  return res.json({ services: db.services });
});

// Category Service Dashboard Profile API
app.get('/api/services/category/:catKey', (req, res) => {
  const { catKey } = req.params;
  const catData = db.categoryServices[catKey.toLowerCase()];

  if (!catData) {
    return res.status(404).json({ error: "Category service profile not found." });
  }

  return res.json({
    success: true,
    data: catData
  });
});

// Refresh Category Service Synchronization
app.post('/api/services/category/:catKey/sync', (req, res) => {
  const { catKey } = req.params;
  const catData = db.categoryServices[catKey.toLowerCase()];

  if (!catData) {
    return res.status(404).json({ error: "Category service profile not found." });
  }

  catData.lastSynced = `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  db.securityLogs.unshift({
    id: `sec-${Date.now()}`,
    event: `Department Service Synchronized: ${catData.category}`,
    device: "Web Client",
    location: "Mumbai, India",
    ip: "49.37.142.90",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  return res.json({
    success: true,
    message: `${catData.category} synchronized successfully.`,
    lastSynced: catData.lastSynced,
    data: catData
  });
});

// Grant Consent for Category Service
app.post('/api/services/category/:catKey/consent', (req, res) => {
  const { catKey } = req.params;
  const catData = db.categoryServices[catKey.toLowerCase()];

  if (!catData) {
    return res.status(404).json({ error: "Category service profile not found." });
  }

  catData.requiresMfa = false;

  return res.json({
    success: true,
    message: `Consent granted for ${catData.category}. Access authorized.`,
    data: catData
  });
});

// Service Application Submission API
app.post('/api/services/apply', (req, res) => {
  const { serviceId, selectedDocId, notes } = req.body;
  const srv = db.services.find(s => s.id === serviceId);

  if (!srv) {
    return res.status(404).json({ error: "Service not found or unavailable." });
  }

  const refNo = `${srv.category.substring(0, 3)}-REF-${Math.floor(10000 + Math.random() * 90000)}`;
  const newActivity = {
    id: `ACT-${Date.now()}`,
    serviceId: srv.id,
    serviceTitle: srv.title,
    provider: srv.provider,
    status: srv.title.includes("Sync") ? "Active Sync" : "Submitted / In Progress",
    appliedAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    referenceNo: refNo,
    notes: notes || `Application submitted securely using tokenized vault document reference.`
  };

  db.serviceActivities.unshift(newActivity);

  db.securityLogs.unshift({
    id: `sec-${Date.now()}`,
    event: `Service Workflow Executed: ${srv.title}`,
    device: "Web Client",
    location: "Mumbai, India",
    ip: "49.37.142.90",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  return res.json({
    success: true,
    message: `Application for ${srv.title} submitted successfully. Tracking Reference: ${refNo}`,
    activity: newActivity
  });
});

// Service Activities Tracking API
app.get('/api/services/activities', (req, res) => {
  return res.json({ activities: db.serviceActivities });
});

app.get('/api/updates/govt', (req, res) => {
  return res.json({ updates: db.govtUpdates });
});

app.get('/api/updates/news', (req, res) => {
  return res.json({ news: db.dailyNews });
});

// --- AI AGENT ENDPOINT ---

app.post('/api/ai/query', (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  const p = prompt.toLowerCase();
  let reply = "";

  if (p.includes("expir") || p.includes("licence") || p.includes("dl")) {
    const dl = db.documents.find(d => d.name.includes("Driving Licence"));
    reply = `Your **Smart Driving Licence** (${dl.refNo}) issued by ${dl.issuer} is valid until **${dl.expiryDate}** (🟢 Verified). Would you like me to guide you through the online renewal process?`;
  } else if (p.includes("aadhaar") || p.includes("identity")) {
    reply = `Your CivicOne digital identity is linked to tokenized Aadhaar reference **${db.citizen.maskedAadhaar}**. Full Aadhaar numbers are never stored or exposed on CivicOne for maximum privacy.`;
  } else if (p.includes("vault") || p.includes("document")) {
    reply = `You currently have **${db.documents.length} digital records** stored across Government, Healthcare, RTO, Education, Professional, Organization, and Personal categories in My Civic Vault.`;
  } else if (p.includes("share") || p.includes("qr")) {
    reply = `You can share any verified credential by opening your **Virtual CivicOne Card** or Vault document, clicking **Share**, and generating a time-limited passcoded link.`;
  } else {
    reply = `I am CivicOne AI, your official digital identity assistant. I can help you check document expiry dates, search vault records, verify credentials, and navigate government services. How can I assist you further?`;
  }

  return res.json({
    query: prompt,
    reply,
    timestamp: new Date().toISOString()
  });
});

// --- SECURITY & NOTIFICATIONS ENDPOINTS ---

app.get('/api/security/audit-logs', (req, res) => {
  return res.json({ logs: db.securityLogs });
});

app.post('/api/security/revoke-all', (req, res) => {
  db.securityLogs.unshift({
    id: `sec-${Date.now()}`,
    event: "Sign Out All Devices Executed",
    device: "Web Client",
    location: "Mumbai, India",
    ip: "49.37.142.90",
    timestamp: new Date().toLocaleString(),
    status: "SUCCESS"
  });

  return res.json({
    success: true,
    message: "All other active sessions have been terminated securely."
  });
});

app.get('/api/notifications', (req, res) => {
  return res.json({ notifications: db.notifications });
});

app.post('/api/support/tickets', (req, res) => {
  const { subject, category, message } = req.body;
  const newTkt = {
    id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
    subject,
    category: category || "General Support",
    status: "Submitted",
    createdAt: new Date().toLocaleDateString('en-GB'),
    lastUpdate: "Ticket received. Support agent assigned."
  };

  db.supportTickets.unshift(newTkt);
  return res.json({ success: true, ticket: newTkt });
});

// --- ISOLATED AUTHORITY PORTAL API ---

app.post('/api/authority/issue', (req, res) => {
  const { citizenCivicId, docName, category, refNo } = req.body;
  if (!citizenCivicId || !docName || !category) {
    return res.status(400).json({ error: "Missing required issuance fields." });
  }

  const issuedDoc = {
    id: `doc-auth-${Date.now()}`,
    name: docName,
    category,
    issuer: "Authority Issuer Portal (Verified Partner)",
    status: "Verified",
    issueDate: new Date().toLocaleDateString('en-GB'),
    expiryDate: "Lifetime",
    refNo: refNo || `AUTH-CRED-${Math.floor(100000 + Math.random() * 900000)}`,
    fileType: "PDF",
    fileSize: "1.6 MB",
    icon: "ShieldCheck",
    description: "Issued directly by authorized authority into citizen vault.",
    securitySeal: "DIRECT-AUTHORITY-ISSUED-SEAL"
  };

  db.documents.unshift(issuedDoc);
  return res.json({ success: true, issuedDoc });
});

// --- ISOLATED PRIVATE ADMIN PORTAL BACKEND PROTECTION ---

// Admin Authorization Middleware Check
app.use('/api/admin/*', (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers['x-admin-passkey'];
  
  // Allow login endpoint
  if (req.originalUrl === '/api/admin/auth' || req.originalUrl === '/api/auth/admin-login') {
    return next();
  }

  if (authHeader && (authHeader.includes("ADMIN-ROOT") || authHeader.includes("ADMIN-SESSION") || authHeader === "superadmin123" || authHeader === "admin123")) {
    return next();
  }

  // Reject unauthorized administrative access attempts with 403 Forbidden
  return res.status(403).json({
    error: "Access Denied.",
    message: "Administrative authorization required."
  });
});

app.post('/api/admin/auth', (req, res) => {
  const { passkey } = req.body;
  if (passkey === "superadmin123" || passkey === "admin123") {
    return res.json({
      authorized: true,
      adminToken: `ADMIN-ROOT-${Date.now()}-SECURE`,
      stats: db.adminStats,
      auditLogs: db.securityLogs
    });
  }
  return res.status(403).json({ error: "Access Denied.", message: "Administrative authorization required." });
});

app.get('/api/admin/stats', (req, res) => {
  return res.json({
    stats: db.adminStats,
    auditLogs: db.securityLogs
  });
});

// Admin Citizens Management API
app.get('/api/admin/citizens', (req, res) => {
  return res.json({ citizens: db.citizens });
});

app.post('/api/admin/citizen/:id/lock', (req, res) => {
  const { id } = req.params;
  const citizen = db.citizens.find(c => c.id === id);
  if (!citizen) {
    return res.status(404).json({ error: "Citizen record not found." });
  }

  citizen.status = citizen.status === "ACTIVE" ? "LOCKED" : "ACTIVE";

  db.securityLogs.unshift({
    id: `sec-${Date.now()}`,
    event: `Super Admin Action: Citizen ${citizen.name} status updated to ${citizen.status}`,
    device: "Master Admin Console",
    location: "NIC Security Hub",
    ip: "164.100.1.1",
    timestamp: new Date().toLocaleString(),
    status: "ADMIN_ACTION"
  });

  return res.json({ success: true, citizen });
});

// Admin Department Issuers Management API
app.get('/api/admin/issuers', (req, res) => {
  return res.json({ issuers: db.issuers });
});

app.post('/api/admin/issuer/approve', (req, res) => {
  const { issuerId } = req.body;
  const issuer = db.issuers.find(i => i.id === issuerId);
  if (!issuer) {
    return res.status(404).json({ error: "Department issuer record not found." });
  }

  issuer.status = "APPROVED";

  db.securityLogs.unshift({
    id: `sec-${Date.now()}`,
    event: `Super Admin Approved Issuing Officer: ${issuer.officerName} (${issuer.department})`,
    device: "Master Admin Console",
    location: "NIC Security Hub",
    ip: "164.100.1.1",
    timestamp: new Date().toLocaleString(),
    status: "ADMIN_ACTION"
  });

  return res.json({ success: true, issuer });
});

// Admin Emergency Platform Lockdown
app.post('/api/admin/system/lockdown', (req, res) => {
  db.adminStats.systemUptime = "99.99% (LOCKDOWN ACTIVE)";
  
  db.securityLogs.unshift({
    id: `sec-${Date.now()}`,
    event: "CRITICAL: Super Admin Initiated Platform Emergency Lockdown",
    device: "Master Admin Console",
    location: "NIC National Command Center",
    ip: "164.100.1.1",
    timestamp: new Date().toLocaleString(),
    status: "EMERGENCY_LOCKDOWN"
  });

  return res.json({
    success: true,
    message: "Emergency Platform Security Lockdown Executed. Sensitive endpoints isolated."
  });
});

// SPA Fallback Route for Web Client Routing (/verify, /admin, /authority, etc.)
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
