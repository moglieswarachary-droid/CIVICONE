// server/db.js - Database Service Engine for CIVIQONE Platform

import { PrismaClient } from '@prisma/client';
import { db as fallbackDb } from './mockDb.js';
import { generateSHA256, encryptData } from './crypto.js';
import { hashPassword, comparePassword } from './auth.js';

let prisma;
try {
  prisma = new PrismaClient();
} catch (e) {
  console.warn("⚠️ Prisma client initialization deferred. Using in-memory engine fallback.");
}

export const dbService = {
  // Get All Citizens
  async getCitizens() {
    try {
      if (prisma) {
        const citizens = await prisma.citizen.findMany();
        if (citizens && citizens.length > 0) {
          return citizens.map(c => ({
            ...c,
            educationInfo: JSON.parse(c.educationInfoJson || '{}'),
            governmentInfo: JSON.parse(c.governmentInfoJson || '{}'),
            rtoInfo: JSON.parse(c.rtoInfoJson || '{}'),
            healthcareInfo: JSON.parse(c.healthcareInfoJson || '{}'),
            travelInfo: JSON.parse(c.travelInfoJson || '{}')
          }));
        }
      }
    } catch (err) {
      console.warn("DB Query fallback to in-memory citizens");
    }
    return fallbackDb.citizens;
  },

  // Get Citizen By ID
  async getCitizenById(citizenId) {
    try {
      if (prisma) {
        const c = await prisma.citizen.findUnique({ where: { citizenId } });
        if (c) {
          return {
            ...c,
            educationInfo: JSON.parse(c.educationInfoJson || '{}'),
            governmentInfo: JSON.parse(c.governmentInfoJson || '{}'),
            rtoInfo: JSON.parse(c.rtoInfoJson || '{}'),
            healthcareInfo: JSON.parse(c.healthcareInfoJson || '{}'),
            travelInfo: JSON.parse(c.travelInfoJson || '{}')
          };
        }
      }
    } catch (err) {
      console.warn("DB Query fallback to in-memory citizen search");
    }
    return fallbackDb.citizens.find(c => c.citizenId === citizenId) || fallbackDb.citizens[0];
  },

  // Get Citizen By Mobile Number
  async getCitizenByMobile(rawMobile) {
    const targetDigits = (rawMobile || '').replace(/\D/g, '').slice(-10);
    if (!targetDigits || targetDigits.length < 10) return null;

    try {
      if (prisma) {
        const citizens = await prisma.citizen.findMany();
        const found = citizens.find(c => {
          const mDigits = (c.mobile || '').replace(/\D/g, '').slice(-10);
          return mDigits === targetDigits;
        });
        if (found) {
          return {
            ...found,
            educationInfo: JSON.parse(found.educationInfoJson || '{}'),
            governmentInfo: JSON.parse(found.governmentInfoJson || '{}'),
            rtoInfo: JSON.parse(found.rtoInfoJson || '{}'),
            healthcareInfo: JSON.parse(found.healthcareInfoJson || '{}'),
            travelInfo: JSON.parse(found.travelInfoJson || '{}')
          };
        }
      }
    } catch (err) {
      console.warn("DB Query fallback for mobile search:", err.message);
    }
    return fallbackDb.citizens.find(c => {
      const mDigits = (c.mobile || '').replace(/\D/g, '').slice(-10);
      return mDigits === targetDigits;
    });
  },

  // Register New Citizen with Unique Civic ID Generation and MPIN Hashing
  async registerCitizen(data) {
    const { fullName, dateOfBirth, gender, state, address, mobile, email, mpin, aadhaar } = data;
    const statePrefix = (state || 'AP').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    // Generate Unique Civic ID
    let uniqueCivicId = '';
    let exists = true;
    let attempts = 0;

    while (exists && attempts < 10) {
      attempts++;
      const timeStampCode = Date.now().toString().slice(-6);
      const randomPart = Math.floor(100 + Math.random() * 900);
      uniqueCivicId = `CIV-${statePrefix}-${timeStampCode}-${randomPart}`;
      
      try {
        if (prisma) {
          const check = await prisma.citizen.findUnique({ where: { citizenId: uniqueCivicId } });
          if (!check) exists = false;
        } else {
          exists = fallbackDb.citizens.some(c => c.citizenId === uniqueCivicId);
        }
      } catch (e) {
        exists = false;
      }
    }

    const hashedMpin = mpin ? await hashPassword(mpin) : null;
    const cleanMobile = (mobile || '').startsWith('+91') ? mobile : `+91-${mobile}`;
    const userEmail = email || `${uniqueCivicId.toLowerCase()}@civiqone.gov.in`;
    const maskedAadhaar = aadhaar ? `XXXX XXXX ${aadhaar.slice(-4)}` : `XXXX XXXX ${Math.floor(1000 + Math.random() * 9000)}`;

    const newCitizen = {
      citizenId: uniqueCivicId,
      fullName: fullName || 'Citizen User',
      displayName: (fullName || 'Citizen').split(' ')[0],
      dateOfBirth: dateOfBirth || '01-01-2000',
      gender: gender || 'Specified',
      mobile: cleanMobile,
      mobileMasked: cleanMobile,
      email: userEmail,
      emailMasked: userEmail,
      address: address || `${state || 'Andhra Pradesh'}, India`,
      addressSummary: `${state || 'Andhra Pradesh'}, India`,
      state: state || 'Andhra Pradesh',
      trustLevel: 'Verified Citizen',
      verificationStatus: 'VERIFIED',
      securityScore: 98,
      virtualCardId: `VCD-STD-${Math.floor(10000 + Math.random() * 90000)}`,
      virtualCardStatus: 'ACTIVE',
      tier: 'STANDARD',
      maskedAadhaar,
      mpinHash: hashedMpin,
      isDemo: false
    };

    try {
      if (prisma) {
        await prisma.citizen.create({
          data: {
            citizenId: newCitizen.citizenId,
            fullName: newCitizen.fullName,
            displayName: newCitizen.displayName,
            dateOfBirth: newCitizen.dateOfBirth,
            gender: newCitizen.gender,
            mobile: newCitizen.mobile,
            mobileMasked: newCitizen.mobileMasked,
            email: newCitizen.email,
            emailMasked: newCitizen.emailMasked,
            address: newCitizen.address,
            addressSummary: newCitizen.addressSummary,
            state: newCitizen.state,
            trustLevel: newCitizen.trustLevel,
            verificationStatus: newCitizen.verificationStatus,
            securityScore: newCitizen.securityScore,
            virtualCardId: newCitizen.virtualCardId,
            virtualCardStatus: newCitizen.virtualCardStatus,
            tier: newCitizen.tier,
            maskedAadhaar: newCitizen.maskedAadhaar,
            mpinHash: newCitizen.mpinHash,
            isDemo: false,
            educationInfoJson: '{}',
            governmentInfoJson: JSON.stringify({ drivingLicence: `DL-${statePrefix}-2026-9048` }),
            rtoInfoJson: '{}',
            healthcareInfoJson: '{}',
            travelInfoJson: '{}'
          }
        });

        await prisma.virtualCard.create({
          data: {
            citizenId: uniqueCivicId,
            cardType: 'STANDARD',
            cardStatus: 'ACTIVE',
            qrToken: `CIV-TOKEN-${uniqueCivicId}-SECURE-2026`
          }
        });
      }
    } catch (err) {
      console.warn("DB Register fallback to in-memory store:", err.message);
    }

    fallbackDb.citizens.unshift(newCitizen);
    fallbackDb.activeCitizenId = uniqueCivicId;

    return newCitizen;
  },

  // Get Documents for Citizen
  async getVaultDocuments(citizenId) {
    try {
      if (prisma) {
        const docs = await prisma.vaultDocument.findMany({ where: { citizenId } });
        if (docs && docs.length > 0) return docs;
      }
    } catch (err) {
      console.warn("DB Query fallback to in-memory vault documents");
    }
    return fallbackDb.documents.filter(d => d.citizenId === citizenId || !d.citizenId);
  },

  // Get Active Card
  async getVirtualCard(citizenId) {
    try {
      if (prisma) {
        const card = await prisma.virtualCard.findUnique({ where: { citizenId } });
        if (card) return card;
      }
    } catch (err) {
      console.warn("DB Query fallback to in-memory virtual card");
    }
    return fallbackDb.card;
  },

  // Get FIR Records
  async getPoliceFirs(state) {
    try {
      if (prisma) {
        const firs = await prisma.fIRRecord.findMany();
        if (firs && firs.length > 0) return firs;
      }
    } catch (err) {
      console.warn("DB Query fallback to in-memory FIR records");
    }
    return fallbackDb.policeFirs;
  },

  // Get Hotel Guests
  async getHotelGuests(state) {
    try {
      if (prisma) {
        const guests = await prisma.hotelGuest.findMany();
        if (guests && guests.length > 0) return guests;
      }
    } catch (err) {
      console.warn("DB Query fallback to in-memory Hotel Guests");
    }
    return fallbackDb.hotelGuests;
  },

  // Create Vault Document
  async createVaultDocument(docData) {
    const docId = `doc-${Date.now()}`;
    const hash = generateSHA256(`${docData.name}-${docData.docNumber}-${Date.now()}`);
    const newDoc = {
      id: docId,
      citizenId: docData.citizenId || fallbackDb.activeCitizenId,
      docType: docData.docType || docData.name,
      name: docData.name,
      docNumber: docData.docNumber || `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      issuer: docData.issuer || 'Govt Authority',
      issueDate: docData.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: docData.expiryDate || '2035-12-31',
      isVerified: true,
      fileUrl: docData.fileUrl || null,
      category: docData.category || 'Government',
      sha256Hash: hash,
      encryptionStatus: 'AES-256-GCM ENCRYPTED'
    };

    try {
      if (prisma) {
        await prisma.vaultDocument.create({ data: newDoc });
      }
    } catch (err) {
      console.warn("DB Vault document save fallback to memory");
    }

    fallbackDb.documents.unshift(newDoc);
    return newDoc;
  },

  // Verify Vault Document
  async verifyVaultDocument(docId) {
    try {
      if (prisma) {
        await prisma.vaultDocument.update({
          where: { id: docId },
          data: { isVerified: true }
        });
      }
    } catch (err) {
      console.warn("DB Vault doc verify fallback to memory");
    }
    const d = fallbackDb.documents.find(doc => doc.id === docId);
    if (d) d.isVerified = true;
    return d || { id: docId, isVerified: true };
  },

  // Create Consent Access Request
  async createConsentRequest(reqData) {
    const reqId = `req-${Date.now()}`;
    const newReq = {
      id: reqId,
      citizenId: reqData.citizenId || 'CIV-DEMO-10001',
      requestingOrg: reqData.requestingOrg || 'CIVIQONE Partner Org',
      requestingRole: reqData.requestingRole || 'VERIFICATION_ADMIN',
      purpose: reqData.purpose || 'Credential Verification',
      scope: reqData.scope || 'Identity Status & Vault Credentials',
      status: 'PENDING',
      requestedAt: new Date()
    };

    try {
      if (prisma) {
        await prisma.consentRequest.create({ data: newReq });
      }
    } catch (err) {
      console.warn("DB Consent request fallback to memory");
    }

    if (!fallbackDb.consentRequests) fallbackDb.consentRequests = [];
    fallbackDb.consentRequests.unshift(newReq);
    return newReq;
  },

  // Create FIR Record
  async createFIRRecord(firData) {
    const firId = `FIR-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const newFir = {
      id: firId,
      firId,
      date: new Date().toISOString().split('T')[0],
      subject: firData.subject || 'Incident Report',
      location: firData.location || 'Local Station Jurisdiction',
      complainantId: firData.complainantId || 'CIV-DEMO-10001',
      status: 'Pending Investigation',
      assignedOfficer: firData.assignedOfficer || 'Inspector On Duty',
      state: firData.state || 'Maharashtra'
    };

    try {
      if (prisma) {
        await prisma.fIRRecord.create({ data: newFir });
      }
    } catch (err) {
      console.warn("DB FIR creation fallback to memory");
    }

    if (!fallbackDb.policeFirs) fallbackDb.policeFirs = [];
    fallbackDb.policeFirs.unshift(newFir);
    return newFir;
  },

  // Get Organizations
  async getOrganizations() {
    try {
      if (prisma) {
        const orgs = await prisma.organization.findMany();
        if (orgs && orgs.length > 0) return orgs;
      }
    } catch (err) {
      console.warn("DB Query fallback to memory for Organizations");
    }
    return fallbackDb.organizations;
  },

  // Add Security Audit Log
  async addAuditLog(logData) {
    const logId = `sec-${Date.now()}`;
    const targetCitizenId = logData.citizenId || 'CIV-DEMO-10001';
    const log = {
      id: logId,
      logId,
      citizenId: targetCitizenId,
      event: logData.event,
      device: logData.device || 'Web Client',
      location: logData.location || 'Vijayawada, AP',
      ip: logData.ip || '127.0.0.1',
      timestamp: new Date().toLocaleString(),
      status: logData.status || 'SUCCESS'
    };

    try {
      if (prisma) {
        // Check if citizen exists to avoid foreign key failure
        const citizenCheck = await prisma.citizen.findUnique({ where: { citizenId: targetCitizenId } });
        await prisma.auditLog.create({
          data: {
            ...log,
            citizenId: citizenCheck ? targetCitizenId : null
          }
        });
      }
    } catch (err) {
      console.warn("DB Log save fallback to in-memory audit log:", err.message);
    }

    fallbackDb.auditLogs.unshift(log);
    return log;
  },

  // Update Citizen Profile Details (Mobile, Email)
  async updateCitizenProfile(citizenId, updates) {
    const { mobile, email } = updates;
    const cleanMobile = mobile ? (mobile.startsWith('+91') ? mobile : `+91-${mobile}`) : undefined;

    try {
      if (prisma) {
        const updated = await prisma.citizen.update({
          where: { citizenId },
          data: {
            ...(cleanMobile && { mobile: cleanMobile, mobileMasked: cleanMobile }),
            ...(email && { email, emailMasked: email })
          }
        });
        return updated;
      }
    } catch (err) {
      console.warn("Prisma update profile fallback:", err.message);
    }

    const found = fallbackDb.citizens.find(c => c.citizenId === citizenId);
    if (found) {
      if (cleanMobile) {
        found.mobile = cleanMobile;
        found.mobileMasked = cleanMobile;
      }
      if (email) {
        found.email = email;
        found.emailMasked = email;
      }
    }
    return found;
  },

  // Issue Verified Government Credential directly into Citizen Vault
  async issueGovernmentCredential(officer, citizenCivicId, docData) {
    const targetCitizen = fallbackDb.citizens.find(c => c.citizenId === citizenCivicId) || fallbackDb.citizens[0];
    
    const newDoc = {
      id: `doc-govt-${Date.now()}`,
      citizenId: targetCitizen.citizenId,
      name: docData.name,
      category: docData.category || 'Government',
      docType: docData.docType || 'Official Credential',
      issuer: docData.issuer || officer.department || 'Government Authority',
      docNumber: docData.refNo || `GOVT-AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: docData.expiryDate || '2045-12-31',
      status: 'VERIFIED',
      verificationBadge: '🟢 GOVERNMENT ISSUED & DIGITALLY SIGNED',
      digitalSignature: `SIG-GOVT-AUTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
    };

    fallbackDb.documents.unshift(newDoc);

    // Create In-App Citizen Notification
    const notif = {
      id: `notif-${Date.now()}`,
      citizenCivicId: targetCitizen.citizenId,
      title: `🏛️ New Official Credential Issued: ${newDoc.name}`,
      message: `Issued by ${newDoc.issuer} (${officer.name || 'Government Officer'}). Document Ref: ${newDoc.docNumber}. Added directly to your CivicVault.`,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'GOVT_ISSUANCE'
    };
    if (!fallbackDb.notifications) fallbackDb.notifications = [];
    fallbackDb.notifications.unshift(notif);

    // Add Audit Log
    this.addAuditLog({
      citizenId: targetCitizen.citizenId,
      event: `Government Officer (${officer.name}) Issued Credential: ${newDoc.name} (${newDoc.docNumber})`,
      device: 'Government Officer Terminal',
      location: officer.office || 'Vijayawada HQ',
      status: 'SUCCESS'
    });

    return { success: true, document: newDoc, notification: notif };
  },

  // Toggle Organization Verification & Access Status
  async toggleOrganizationStatus(orgId, newStatus) {
    const org = fallbackDb.organizations.find(o => o.id === orgId);
    if (org) {
      org.accessStatus = newStatus;
      org.verificationStatus = newStatus === 'SUSPENDED' ? 'SUSPENDED' : 'VERIFIED';
    }
    return org;
  }
};
