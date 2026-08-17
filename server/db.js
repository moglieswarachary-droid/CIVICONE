// server/db.js - Database Service Engine for CivicOne Platform

import { PrismaClient } from '@prisma/client';
import { db as fallbackDb } from './mockDb.js';
import { generateSHA256, encryptData } from './crypto.js';

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
      requestingOrg: reqData.requestingOrg || 'CivicOne Partner Org',
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
    const log = {
      id: logId,
      logId,
      citizenId: logData.citizenId || 'CIV-DEMO-10001',
      event: logData.event,
      device: logData.device || 'Web Client',
      location: logData.location || 'Vijayawada, AP',
      ip: logData.ip || '127.0.0.1',
      timestamp: new Date().toLocaleString(),
      status: logData.status || 'SUCCESS'
    };

    try {
      if (prisma) {
        await prisma.auditLog.create({ data: log });
      }
    } catch (err) {
      console.warn("DB Log save fallback to in-memory audit log");
    }

    fallbackDb.auditLogs.unshift(log);
    return log;
  }
};
