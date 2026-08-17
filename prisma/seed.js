// prisma/seed.js - Seed Script for CivicOne Relational Database

import { PrismaClient } from '@prisma/client';
import { db } from '../server/mockDb.js';
import { DEMO_POLICE_FIRS, DEMO_HOTEL_GUESTS } from '../src/data/mockData.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding CivicOne Relational Database...');

  // 1. Seed Citizens & Virtual Cards
  for (const c of db.citizens) {
    await prisma.citizen.upsert({
      where: { citizenId: c.citizenId },
      update: {},
      create: {
        citizenId: c.citizenId,
        fullName: c.fullName,
        displayName: c.displayName || c.fullName.split(' ')[0],
        dateOfBirth: c.dateOfBirth,
        gender: c.gender,
        profileImage: c.profileImage,
        mobile: c.mobile,
        mobileMasked: c.mobileMasked,
        email: c.email || `${c.citizenId.toLowerCase()}@civicone.example`,
        emailMasked: c.emailMasked || `${c.citizenId.toLowerCase()}@civicone.example`,
        address: c.address,
        addressSummary: c.addressSummary,
        state: c.state,
        trustLevel: c.trustLevel || 'Verified Citizen',
        verificationStatus: c.verificationStatus || 'VERIFIED',
        securityScore: c.securityScore || 95,
        virtualCardId: c.virtualCardId,
        virtualCardStatus: c.virtualCardStatus || 'ACTIVE',
        tier: c.tier || 'STANDARD',
        bloodGroup: c.bloodGroup,
        emergencyContact: c.emergencyContact,
        maskedAadhaar: c.maskedAadhaar,
        isDemo: true,
        demoLabel: c.demoLabel,
        educationInfoJson: JSON.stringify(c.educationInfo || {}),
        governmentInfoJson: JSON.stringify(c.governmentInfo || {}),
        rtoInfoJson: JSON.stringify(c.rtoInfo || {}),
        healthcareInfoJson: JSON.stringify(c.healthcareInfo || {}),
        travelInfoJson: JSON.stringify(c.travelInfo || {})
      }
    });

    // Seed Virtual Card
    await prisma.virtualCard.upsert({
      where: { citizenId: c.citizenId },
      update: {},
      create: {
        citizenId: c.citizenId,
        cardType: c.tier || 'STANDARD',
        cardStatus: c.virtualCardStatus || 'ACTIVE',
        qrToken: `CIV-TOKEN-${c.citizenId}-SECURE-2026`
      }
    });
  }

  // 2. Seed Vault Documents
  for (const doc of db.documents) {
    const docId = doc.id;
    const citizenId = doc.citizenId || 'CIV-DEMO-10001';
    
    // Ensure citizen exists
    const citizenExists = await prisma.citizen.findUnique({ where: { citizenId } });
    if (citizenExists) {
      await prisma.vaultDocument.upsert({
        where: { id: docId },
        update: {},
        create: {
          id: docId,
          citizenId: citizenId,
          docType: doc.docType || doc.name,
          name: doc.name,
          docNumber: doc.docNumber || 'DEMO-NUM-1001',
          issuer: doc.issuer || 'Govt of India',
          issueDate: doc.issueDate || '2020-01-01',
          expiryDate: doc.expiryDate || '2030-01-01',
          isVerified: doc.isVerified !== false,
          fileUrl: doc.fileUrl || null,
          category: doc.category || 'Government'
        }
      });
    }
  }

  // 3. Seed Organizations
  for (const org of db.organizations) {
    await prisma.organization.upsert({
      where: { orgId: org.id },
      update: {},
      create: {
        orgId: org.id,
        name: org.name,
        state: org.state || 'Maharashtra',
        orgType: org.category ? org.category.toLowerCase() : 'hotel',
        roleCode: org.roleCode || 'HOTEL_ACCESS_ADMIN',
        accessLevel: org.accessLevel || 'VIEW ONLY',
        badgeText: org.badgeText || 'VERIFIED ORGANIZATION',
        regNo: org.regNo || `REG-${Math.floor(1000 + Math.random() * 9000)}`,
        status: org.status || 'VERIFIED'
      }
    });
  }

  // 4. Seed FIR Records
  const firList = db.policeFirs || DEMO_POLICE_FIRS;
  for (const fir of firList) {
    await prisma.fIRRecord.upsert({
      where: { firId: fir.id },
      update: {},
      create: {
        firId: fir.id,
        date: fir.date,
        subject: fir.subject,
        location: fir.location,
        complainantId: fir.complainantId || 'CIV-DEMO-10001',
        status: fir.status,
        assignedOfficer: fir.assignedOfficer,
        state: fir.state || 'Maharashtra'
      }
    });
  }

  // 5. Seed Hotel Guests
  const guestList = db.hotelGuests || DEMO_HOTEL_GUESTS;
  for (const guest of guestList) {
    await prisma.hotelGuest.create({
      data: {
        guestName: guest.guestName || guest.name || 'Demo Guest',
        civicId: guest.civicId || guest.citizenId || 'CIV-DEMO-10001',
        roomNo: guest.roomNo || '101',
        checkInDate: guest.checkInDate || guest.checkIn || '2026-08-14',
        checkOutDate: guest.checkOutDate || guest.checkOut || '2026-08-16',
        verificationStatus: guest.verificationStatus || 'VERIFIED',
        state: guest.state || 'Maharashtra'
      }
    });
  }

  // 6. Seed Audit Logs
  for (const log of db.auditLogs) {
    await prisma.auditLog.upsert({
      where: { logId: log.id },
      update: {},
      create: {
        logId: log.id,
        citizenId: log.citizenId || 'CIV-DEMO-10001',
        event: log.event,
        device: log.device || 'Web Client',
        location: log.location || 'Vijayawada, AP',
        ip: log.ip || '127.0.0.1',
        timestamp: log.timestamp || new Date().toLocaleString(),
        status: log.status || 'SUCCESS'
      }
    });
  }

  console.log('✅ Database Seeding Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
