// server/db.js - Database Service Engine for CivicOne Platform

import { PrismaClient } from '@prisma/client';
import { db as fallbackDb } from './mockDb.js';

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
