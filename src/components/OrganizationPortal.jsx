// src/components/OrganizationPortal.jsx - Independent Organization Portal Workspace with Reusable State & Role-Based Access Control

import React, { useState, useEffect } from 'react';
import {
  Building2, ShieldCheck, Search, PlusCircle, CheckCircle2, Lock, Eye, AlertCircle,
  ArrowLeft, RefreshCw, FileText, ExternalLink, Calendar, LogOut, UserCheck, ShieldAlert, Award, MapPin
} from 'lucide-react';
import DocumentViewerModal from './DocumentViewerModal.jsx';
import { orgService } from '../services/api.js';
import { INDIA_STATES_AND_UTS, PRIVATE_ORG_TYPES, DEMO_HOTEL_GUESTS } from '../data/mockData.js';

export default function OrganizationPortal({ initialOrgConfig, onReturnHome }) {
  const [organizations, setOrganizations] = useState([]);
  const [selectedState, setSelectedState] = useState(initialOrgConfig?.state || 'Andhra Pradesh');
  const [selectedOrg, setSelectedOrg] = useState({
    id: initialOrgConfig?.orgType ? `org-${initialOrgConfig.orgType}` : 'org-college',
    roleCode: initialOrgConfig?.roleCode || 'COLLEGE_ACCESS_ADMIN',
    name: initialOrgConfig?.name || 'CIVIQONE Demo College',
    category: initialOrgConfig?.orgType || 'Education',
    regNo: 'EDU-COLLEGE-9048',
    accessLevel: 'VIEW ONLY',
    badgeText: initialOrgConfig?.badgeText || 'VIEW ONLY — ACADEMIC CREDENTIALS'
  });

  const [requests, setRequests] = useState([]);
  const [consents, setConsents] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'locker' | 'request' | 'history'
  
  // Request Form State
  const [citizenCivicId, setCitizenCivicId] = useState('CIV-AP-710646-823');
  const [docId, setDocId] = useState('doc-aarav-08');
  const [docName, setDocName] = useState('B.Tech Degree Certificate (Academic)');
  const [purpose, setPurpose] = useState('Institutional Enrollment Verification');
  const [expiryDays, setExpiryDays] = useState('7');
  const [requestMsg, setRequestMsg] = useState('');

  // Industry Workflow Demo States & Hotel Receptionist e-KYC Module
  const [hotelInputId, setHotelInputId] = useState('CIV-AP-710646-823');
  const [hotelCitizenBanner, setHotelCitizenBanner] = useState(null);
  const [hotelRoomNo, setHotelRoomNo] = useState('Suite 402');
  const [hotelGuestList, setHotelGuestList] = useState([
    {
      id: 'gst-101',
      citizenId: 'CIV-AP-710646-823',
      name: 'Raghavendra',
      roomNo: 'Suite 402',
      checkIn: 'Today 02:30 PM',
      status: '🟡 AWAITING GUEST ACCEPTANCE IN APP',
      verificationStatus: 'Pending Consent',
      requestId: 'req-demo-hotel-1'
    }
  ]);
  const [viewMaskedAadhaarModal, setViewMaskedAadhaarModal] = useState(null);

  // College / University Admission State & Academic Records Viewer
  const [collegeAdmissionForm, setCollegeAdmissionForm] = useState({
    civicId: 'CIV-AP-710646-823',
    fullName: 'Raghavendra',
    programLevel: 'Undergraduate (UG / B.Tech)',
    course: 'B.Tech Computer Science & Engineering',
    stream: 'Computer Science & Engineering',
    rollNo: '2026-CSE-091'
  });
  const [viewCollegeAcademicDocsModal, setViewCollegeAcademicDocsModal] = useState(null);

  const handleSendCollegeAdmissionOffer = async (e) => {
    e.preventDefault();
    setRequestMsg('');
    try {
      const res = await fetch('/api/consent/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: selectedOrg.id || 'org-college-01',
          citizenCivicId: collegeAdmissionForm.civicId,
          docId: 'doc-academic-suite',
          docName: 'Aadhaar Card, 10th Marks Card, Inter Marks Card',
          purpose: `Admission Offer (${collegeAdmissionForm.course}) — Roll No: ${collegeAdmissionForm.rollNo}`,
          expiryDays: '7'
        })
      });
      const data = await res.json();
      if (data.success) {
        setRequestMsg(`📩 Admission Offer & Academic Access Request sent to ${collegeAdmissionForm.fullName} (${collegeAdmissionForm.civicId})! Notification sent to student app.`);
        fetchOrgData();
      } else {
        setRequestMsg(data.error || 'Failed to send admission request.');
      }
    } catch (err) {
      setRequestMsg('Network error sending admission request.');
    }
  };

  const handleHotelLookupCivicId = () => {
    if (!hotelInputId.trim()) return;
    setHotelCitizenBanner({
      citizenId: hotelInputId.trim(),
      name: hotelInputId.includes('710646') ? 'Raghavendra' : 'Verified Citizen',
      photoUrl: null,
      status: 'VALID CIVICONE IDENTITY'
    });
  };

  const handleHotelSendInvite = async () => {
    if (!hotelCitizenBanner) return;
    try {
      const res = await fetch('/api/consent/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: selectedOrg.id || 'org-hotel-01',
          citizenCivicId: hotelCitizenBanner.citizenId,
          docId: 'doc-aadhaar-01',
          docName: 'Masked Aadhaar Card (e-KYC)',
          purpose: 'Hotel Guest Check-In e-KYC Verification',
          expiryDays: '1'
        })
      });
      const data = await res.json();
      const newGuest = {
        id: `gst-${Date.now()}`,
        citizenId: hotelCitizenBanner.citizenId,
        name: hotelCitizenBanner.name,
        roomNo: hotelRoomNo || 'Room 101',
        checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: '🟡 AWAITING GUEST ACCEPTANCE IN APP',
        verificationStatus: 'Pending Consent',
        requestId: data.request ? data.request.id : `req-${Date.now()}`
      };
      setHotelGuestList([newGuest, ...hotelGuestList]);
      alert(`🏨 Check-in invite sent to ${hotelCitizenBanner.name} (${hotelCitizenBanner.citizenId})!\n\nThe citizen will receive a notification in their app with Accept and Decline options.`);
    } catch (err) {
      console.error(err);
    }
  };

  const [hotelScanGuest, setHotelScanGuest] = useState({ civicId: 'CIV-AP-710646-823', name: 'Raghavendra', checkInTime: 'Today 02:30 PM', roomNo: 'Suite 402', status: 'VERIFIED' });
  const [collegeVerifyStudent, setCollegeVerifyStudent] = useState({ civicId: 'CIV-AP-710646-823', studentName: 'Raghavendra', course: 'B.Tech CS', year: '2026', nadStatus: 'VERIFIED ON NAD' });

  // Document Viewer Modal State
  const [viewingDoc, setViewingDoc] = useState(null);
  const [viewingConsent, setViewingConsent] = useState(null);
  const [authorizedData, setAuthorizedData] = useState(null);
  const [accessError, setAccessError] = useState('');

  const fetchOrgData = async () => {
    try {
      const [resOrgs, resReqs, resCons] = await Promise.all([
        fetch('/api/organizations').then(r => r.json()),
        fetch(`/api/consent/requests/org/${selectedOrg.id}`).then(r => r.json()),
        fetch('/api/consent/active').then(r => r.json())
      ]);

      if (resOrgs.organizations) setOrganizations(resOrgs.organizations);
      if (resReqs.requests) setRequests(resReqs.requests);
      if (resCons.consents) setConsents(resCons.consents);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrgData();
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/consent/requests/org/${selectedOrg.id || 'org-hotel-01'}`);
        const data = await res.json();
        if (data.requests) {
          setHotelGuestList(prev => prev.map(g => {
            const req = data.requests.find(r => r.citizenCivicId === g.citizenId || r.id === g.requestId);
            if (req && req.status === 'APPROVED') {
              return {
                ...g,
                status: '🟢 GUEST VERIFIED (CONSENT GRANTED)',
                verificationStatus: 'Verified via Aadhaar e-KYC'
              };
            }
            return g;
          }));
        }
      } catch (err) {}
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedOrg.id]);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setRequestMsg('');

    try {
      const res = await fetch('/api/consent/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orgId: selectedOrg.id,
          citizenCivicId,
          docId,
          docName,
          purpose,
          expiryDays
        })
      });
      const data = await res.json();
      if (data.success) {
        setRequestMsg(`✅ Access request sent to citizen (${citizenCivicId})! Notification dispatched to citizen app.`);
        fetchOrgData();
      } else {
        setRequestMsg(data.error || 'Failed to send request.');
      }
    } catch (err) {
      setRequestMsg('Network error sending request.');
    }
  };

  const handleViewAuthorizedDoc = async (shareId) => {
    setAccessError('');
    try {
      const data = await orgService.verifyOrgAccess(shareId, selectedOrg.roleCode);

      if (data.success) {
        setAuthorizedData(data.authorizedData);
        setViewingConsent(data.consentRecord);
        setViewingDoc(data.authorizedData.academicDocument || data.authorizedData.document || {
          name: data.consentRecord.docName,
          category: selectedOrg.category,
          issuer: selectedOrg.name,
          status: "Verified",
          refNo: "REF-AUTH-2026",
          securitySeal: "RECIPIENT-BOUND-VERIFIED-SEAL",
          description: data.authorizedData.notice || data.authorizedData.educationNotice || "Authorized least-privilege view"
        });
      } else {
        setAccessError(data.message || 'Access Denied by Backend Authorization Engine.');
      }
    } catch (err) {
      setAccessError('Backend verification check failed.');
    }
  };

  const authorizedConsents = consents.filter(c => c.orgId === selectedOrg.id || c.roleCode === selectedOrg.roleCode);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F8FAFC', color: '#0F172A', fontFamily: 'var(--font-body)' }}>

      {/* HEADER BAR */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#073B8C', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0B1F3A', letterSpacing: '-0.02em' }}>
                CIVIQONE Organization Access Portal
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Recipient-Bound Verification &amp; Least-Privilege Authorized Workspace ({selectedState})
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Reusable State Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} color="#0B5ED7" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontWeight: 800,
                  fontSize: '0.825rem',
                  color: '#0B1F3A',
                  backgroundColor: '#FFFFFF'
                }}
              >
                {INDIA_STATES_AND_UTS.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Organization Role Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Active Org Role:</span>
              <select
                value={selectedOrg.id}
                onChange={(e) => {
                  const org = organizations.find(o => o.id === e.target.value);
                  if (org) setSelectedOrg(org);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  color: '#0B1F3A',
                  backgroundColor: '#FFFFFF'
                }}
              >
                {organizations.map(o => (
                  <option key={o.id} value={o.id}>{o.name} ({o.accessLevel})</option>
                ))}
              </select>
            </div>

            <button
              onClick={onReturnHome}
              style={{
                backgroundColor: '#F1F5F9',
                color: '#64748B',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={14} /> Exit Portal
            </button>
          </div>

        </div>
      </header>

      {/* ACCESS DENIED ALERT TOAST */}
      {accessError && (
        <div style={{ backgroundColor: '#FEF2F2', borderBottom: '1px solid #FCA5A5', padding: '12px 24px', textAlign: 'center', color: '#991B1B', fontWeight: 800, fontSize: '0.875rem' }}>
          ⚠️ {accessError}
        </div>
      )}

      {/* WORKSPACE CONTENT */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ORG HERO SUMMARY CARD WITH SPECIFIC ROLE BADGE */}
        <div style={{ backgroundColor: '#0B1F3A', borderRadius: '20px', color: '#FFFFFF', padding: '28px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(96, 165, 250, 0.2)', color: '#60A5FA', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
              <ShieldCheck size={14} /> {selectedOrg.badgeText || selectedOrg.accessLevel}
            </div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '2px', marginBottom: '6px' }}>
              {selectedOrg.name} — {selectedState}
            </h1>
            <div style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              Registration Ref: <span style={{ fontFamily: 'monospace', color: '#FEF08A' }}>{selectedOrg.regNo}</span> | Role: <span style={{ color: '#60A5FA', fontWeight: 800 }}>{selectedOrg.roleCode}</span> | State: <span style={{ color: '#FEF08A', fontWeight: 800 }}>{selectedState}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setActiveTab('request')}
              style={{
                backgroundColor: '#0B5ED7',
                color: '#FFFFFF',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <PlusCircle size={16} /> Request Document Access
            </button>
          </div>
        </div>

        {/* ROLE PRIVILEGE RESTRICTIONS BOX */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', marginBottom: '28px' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={16} color="#0B5ED7" /> Least-Privilege Data Access Scope for {selectedOrg.name} ({selectedState}):
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', fontSize: '0.825rem' }}>
            <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px', borderRadius: '10px', color: '#065F46' }}>
              <strong>Allowed Access Scope:</strong> <br />
              {selectedOrg.allowedCategories ? selectedOrg.allowedCategories.join(', ') : 'Authorized Categories Only'}
            </div>
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '12px', borderRadius: '10px', color: '#991B1B' }}>
              <strong>Strictly Excluded Data:</strong> <br />
              {selectedOrg.disallowedCategories ? selectedOrg.disallowedCategories.join(', ') : 'Unrelated Personal/Financial/Medical Vault Records'}
            </div>
          </div>
        </div>

        {/* TAB BAR */}
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #E2E8F0', marginBottom: '24px', paddingBottom: '10px' }}>
          {[
            { id: 'dashboard', label: '📊 Dashboard', count: selectedOrg.category === 'hotel' || selectedOrg.category === 'Hotel & Hospitality' ? DEMO_HOTEL_GUESTS.length : 0 },
            { id: 'locker', label: '📂 Authorized Credentials Locker', count: authorizedConsents.length },
            { id: 'request', label: '➕ Request Document Access', count: 0 },
            { id: 'history', label: '📜 Verification History Logs', count: requests.length }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: activeTab === t.id ? '#0B5ED7' : '#FFFFFF',
                color: activeTab === t.id ? '#FFFFFF' : '#64748B',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: activeTab === t.id ? '0 4px 14px rgba(11, 94, 215, 0.25)' : 'none'
              }}
            >
              {t.label} {t.count > 0 && `(${t.count})`}
            </button>
          ))}
        </div>

        {/* TAB 0: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '16px' }}>
              {selectedOrg.name} Dashboard
            </h3>
            {selectedOrg.category === 'hotel' || selectedOrg.category === 'Hotel & Hospitality' ? (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                
                {/* RECEPTIONIST CIVIC ID SEARCH BAR */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0B1F3A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    🏨 Hotel Guest Check-In &amp; e-KYC Verification
                  </h4>
                  <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '16px' }}>
                    Enter guest's Civic ID to lookup identity and send instant check-in e-KYC verification invite.
                  </p>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={hotelInputId}
                      onChange={(e) => setHotelInputId(e.target.value)}
                      placeholder="Enter Civic ID (e.g. CIV-AP-710646-823)"
                      style={{ flex: 1, minWidth: '240px', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
                    />
                    <input
                      type="text"
                      value={hotelRoomNo}
                      onChange={(e) => setHotelRoomNo(e.target.value)}
                      placeholder="Room No (e.g. Suite 402)"
                      style={{ width: '160px', padding: '12px 16px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
                    />
                    <button
                      onClick={handleHotelLookupCivicId}
                      style={{ backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '12px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '0.875rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Search size={18} /> Lookup Civic ID
                    </button>
                  </div>
                </div>

                {/* CITIZEN BANNER PREVIEW CARD */}
                {hotelCitizenBanner && (
                  <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', border: '2px solid #0B5ED7', padding: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#0B5ED7', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 900 }}>
                        {hotelCitizenBanner.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A' }}>
                          Guest: {hotelCitizenBanner.name}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
                          Civic ID: <strong style={{ color: '#0B5ED7', fontFamily: 'monospace' }}>{hotelCitizenBanner.citizenId}</strong> | Status: <span style={{ color: '#059669', fontWeight: 800 }}>{hotelCitizenBanner.status}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleHotelSendInvite}
                      style={{ backgroundColor: '#059669', color: '#FFFFFF', padding: '12px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '0.875rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)' }}
                    >
                      🏨 Add as Guest &amp; Send e-KYC Invite 📩
                    </button>
                  </div>
                )}

                {/* GUEST CHECK-IN TABLE WITH LIVE STATUS */}
                <h5 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '12px' }}>
                  Current Guest Check-in &amp; Consent Verification Live Logs
                </h5>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                        <th style={{ padding: '12px', fontWeight: 800, color: '#475569' }}>Guest Name</th>
                        <th style={{ padding: '12px', fontWeight: 800, color: '#475569' }}>Civic ID</th>
                        <th style={{ padding: '12px', fontWeight: 800, color: '#475569' }}>Room No</th>
                        <th style={{ padding: '12px', fontWeight: 800, color: '#475569' }}>Check-In Time</th>
                        <th style={{ padding: '12px', fontWeight: 800, color: '#475569' }}>Consent &amp; e-KYC Status</th>
                        <th style={{ padding: '12px', fontWeight: 800, color: '#475569' }}>Masked Aadhaar Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hotelGuestList.map((guest, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                          <td style={{ padding: '12px', fontWeight: 700, color: '#0B1F3A' }}>{guest.name}</td>
                          <td style={{ padding: '12px', fontFamily: 'monospace', color: '#0B5ED7' }}>{guest.citizenId}</td>
                          <td style={{ padding: '12px', fontWeight: 700 }}>{guest.roomNo}</td>
                          <td style={{ padding: '12px', color: '#64748B' }}>{guest.checkIn}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ 
                              backgroundColor: guest.status.includes('VERIFIED') ? '#ECFDF5' : '#FEF9C3', 
                              color: guest.status.includes('VERIFIED') ? '#047857' : '#854D0E', 
                              padding: '6px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 
                            }}>
                              {guest.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px' }}>
                            {guest.status.includes('VERIFIED') ? (
                              <button
                                onClick={() => setViewMaskedAadhaarModal(guest)}
                                style={{ backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                              >
                                <Eye size={14} /> View Masked Aadhaar 🆔
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: '#64748B', fontStyle: 'italic' }}>
                                Awaiting Citizen Accept...
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* COLLEGE STUDENT ADMISSION & ACADEMIC VERIFICATION MODULE */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🎓 Add Admission &amp; Send Acceptance Letter
                      </h4>
                      <p style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '2px' }}>
                        Enter student details to dispatch an official Admission Offer and request permitted academic credentials (Aadhaar, 10th Marks, Inter Marks).
                      </p>
                    </div>
                    <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '6px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800, color: '#1D4ED8' }}>
                      ⚡ Real-Time Polling Active (3s Sync)
                    </div>
                  </div>

                  <form onSubmit={handleSendCollegeAdmissionOffer} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
                        Student Civic ID Token *
                      </label>
                      <input
                        type="text"
                        value={collegeAdmissionForm.civicId}
                        onChange={(e) => setCollegeAdmissionForm({ ...collegeAdmissionForm, civicId: e.target.value })}
                        placeholder="e.g. CIV-AP-710646-823"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontFamily: 'monospace', fontWeight: 800, fontSize: '0.875rem' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={collegeAdmissionForm.fullName}
                        onChange={(e) => setCollegeAdmissionForm({ ...collegeAdmissionForm, fullName: e.target.value })}
                        placeholder="e.g. Raghavendra"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontWeight: 700, fontSize: '0.85rem' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
                        Program Level *
                      </label>
                      <select
                        value={collegeAdmissionForm.programLevel}
                        onChange={(e) => setCollegeAdmissionForm({ ...collegeAdmissionForm, programLevel: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontWeight: 700, fontSize: '0.85rem', backgroundColor: '#FFFFFF' }}
                      >
                        <option value="Undergraduate (UG / B.Tech)">Undergraduate (UG / B.Tech)</option>
                        <option value="Postgraduate (PG / M.Tech)">Postgraduate (PG / M.Tech)</option>
                        <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
                        Course *
                      </label>
                      <input
                        type="text"
                        value={collegeAdmissionForm.course}
                        onChange={(e) => setCollegeAdmissionForm({ ...collegeAdmissionForm, course: e.target.value })}
                        placeholder="e.g. B.Tech Computer Science"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontWeight: 700, fontSize: '0.85rem' }}
                        required
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
                        Department / Stream
                      </label>
                      <input
                        type="text"
                        value={collegeAdmissionForm.stream}
                        onChange={(e) => setCollegeAdmissionForm({ ...collegeAdmissionForm, stream: e.target.value })}
                        placeholder="e.g. Computer Science &amp; Engineering"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontWeight: 600, fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
                        Roll Number / Student ID *
                      </label>
                      <input
                        type="text"
                        value={collegeAdmissionForm.rollNo}
                        onChange={(e) => setCollegeAdmissionForm({ ...collegeAdmissionForm, rollNo: e.target.value })}
                        placeholder="e.g. 2026-CSE-091"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontWeight: 700, fontSize: '0.85rem' }}
                        required
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
                      <button
                        type="submit"
                        style={{
                          width: '100%',
                          backgroundColor: '#0B5ED7',
                          color: '#FFFFFF',
                          padding: '14px',
                          borderRadius: '12px',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(11, 94, 215, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <PlusCircle size={18} /> Send Admission Offer &amp; Academic Credentials Request 📩
                      </button>
                    </div>

                  </form>

                  {requestMsg && (
                    <div style={{ marginTop: '14px', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '12px', borderRadius: '10px', color: '#065F46', fontWeight: 800, fontSize: '0.85rem' }}>
                      {requestMsg}
                    </div>
                  )}
                </div>

                {/* ENROLLED / PENDING STUDENTS TABLE */}
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '16px' }}>
                    Institutional Student Verification Requests &amp; Access Status
                  </h4>
                  {requests.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#64748B', fontSize: '0.875rem' }}>
                      No student requests sent yet. Use the form above to add a student by Civic ID.
                    </div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#475569' }}>Student Civic ID</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#475569' }}>Requested Document</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#475569' }}>Purpose</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#475569' }}>Student Accept Status</th>
                            <th style={{ padding: '12px', fontWeight: 800, color: '#475569' }}>College Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {requests.map((r) => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                              <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 700, color: '#0B5ED7' }}>{r.citizenCivicId}</td>
                              <td style={{ padding: '12px', fontWeight: 700, color: '#0B1F3A' }}>{r.docName}</td>
                              <td style={{ padding: '12px', color: '#475569' }}>{r.purpose}</td>
                              <td style={{ padding: '12px' }}>
                                <span style={{
                                  backgroundColor: r.status === 'GRANTED' || r.status === 'ACTIVE' ? '#ECFDF5' : '#FEF3C7',
                                  color: r.status === 'GRANTED' || r.status === 'ACTIVE' ? '#047857' : '#D97706',
                                  padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800
                                }}>
                                  {r.status === 'GRANTED' || r.status === 'ACTIVE' ? '🟢 ACCEPTED BY STUDENT' : '🟡 PENDING STUDENT ACCEPTANCE'}
                                </span>
                              </td>
                              <td style={{ padding: '12px' }}>
                                {r.status === 'GRANTED' || r.status === 'APPROVED' || r.status === 'ACTIVE' ? (
                                  <button
                                    onClick={() => setViewCollegeAcademicDocsModal(r)}
                                    style={{ backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}
                                  >
                                    View Academic Records 🎓
                                  </button>
                                ) : (
                                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Awaiting Citizen Action</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: AUTHORIZED CREDENTIALS LOCKER */}
        {activeTab === 'locker' && (
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '16px' }}>
              Citizen Documents Authorized for {selectedOrg.name} ({selectedOrg.accessLevel})
            </h3>

            {authorizedConsents.length === 0 ? (
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '40px', textAlign: 'center', color: '#64748B' }}>
                No active document authorizations found for {selectedOrg.name}. Click "Request Document Access" to request credentials from a citizen.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                {authorizedConsents.map((c) => (
                  <div key={c.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0B5ED7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        AUTHORIZED CREDENTIAL
                      </span>
                      <span style={{
                        backgroundColor: c.status === 'ACTIVE' ? '#ECFDF5' : '#FEF2F2',
                        color: c.status === 'ACTIVE' ? '#047857' : '#991B1B',
                        padding: '4px 10px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem'
                      }}>
                        {c.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '6px' }}>
                      {c.docName}
                    </h4>

                    <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>Citizen Civic ID: <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0B5ED7' }}>{c.citizenCivicId}</span></div>
                      <div>Authorized Purpose: <strong>{c.purpose}</strong></div>
                      <div>Expiry Date: <strong>{c.expiryDate}</strong></div>
                    </div>

                    <button
                      onClick={() => handleViewAuthorizedDoc(c.id)}
                      disabled={c.status !== 'ACTIVE'}
                      style={{
                        width: '100%',
                        backgroundColor: c.status === 'ACTIVE' ? '#0B5ED7' : '#94A3B8',
                        color: '#FFFFFF',
                        padding: '12px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '0.875rem',
                        border: 'none',
                        cursor: c.status === 'ACTIVE' ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <Eye size={16} /> View Authorized Watermarked Credential
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REQUEST DOCUMENT ACCESS */}
        {activeTab === 'request' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '32px', maxWidth: '640px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px' }}>
              Request Document Access from Citizen
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '24px' }}>
              Specify the citizen's Civic ID, target document type, purpose, and requested access duration.
            </p>

            {requestMsg && (
              <div style={{ backgroundColor: '#EAF3FF', border: '1px solid #BFDBFE', padding: '12px 16px', borderRadius: '10px', color: '#073B8C', fontSize: '0.85rem', fontWeight: 700, marginBottom: '20px' }}>
                {requestMsg}
              </div>
            )}

            <form onSubmit={handleCreateRequest}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>
                  Citizen Civic ID Number
                </label>
                <input
                  type="text"
                  value={citizenCivicId}
                  onChange={(e) => setCitizenCivicId(e.target.value)}
                  placeholder="e.g. CIV-DEMO-10001"
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>
                  Required Document Type
                </label>
                <select
                  value={docId}
                  onChange={(e) => setDocId(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  <option value="doc-aarav-08">B.Tech Course Admission Record (Education)</option>
                  <option value="doc-aarav-06">Intermediate Class XII Marksheet (Education)</option>
                  <option value="doc-aarav-07">School Transfer Certificate TC (Education)</option>
                  <option value="doc-aarav-01">Tokenized Aadhaar Record (Identity / KYC)</option>
                  <option value="doc-aarav-04">Indian Passport (Travel / Hotel Guest ID)</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>
                  Specific Purpose for Authorization
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Academic Enrollment / Hotel Check-in Verification"
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '6px' }}>
                  Requested Authorization Duration
                </label>
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.9rem', fontWeight: 700 }}
                >
                  <option value="1">1 Day</option>
                  <option value="7">7 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  backgroundColor: '#0B5ED7',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Submit Request to Citizen 🚀
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: VERIFICATION HISTORY LOGS */}
        {activeTab === 'history' && (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '16px' }}>
              Verification &amp; Request History Logs
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {requests.map(r => (
                <div key={r.id} style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, color: '#0B1F3A' }}>{r.docName} ({r.orgName})</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>Purpose: {r.purpose} | Citizen: {r.citizenCivicId}</div>
                  </div>
                  <span style={{ backgroundColor: r.status === 'APPROVED' ? '#ECFDF5' : '#FFFBEB', color: r.status === 'APPROVED' ? '#047857' : '#D97706', padding: '4px 12px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem' }}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* DOCUMENT VIEWER MODAL */}
      {viewingDoc && (
        <DocumentViewerModal
          document={viewingDoc}
          consentRecord={viewingConsent}
          authorizedData={authorizedData}
          onClose={() => {
            setViewingDoc(null);
            setAuthorizedData(null);
          }}
        />
      )}

      {/* MASKED AADHAAR GUEST VERIFICATION MODAL OVERLAY */}
      {viewMaskedAadhaarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 31, 58, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '560px', width: '100%', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>
            <button onClick={() => setViewMaskedAadhaarModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F1F5F9', border: 'none', color: '#64748B', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>
              Verified Guest Aadhaar Card (e-KYC)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '20px' }}>
              Official Masked Aadhaar Card verified via citizen consent and UIDAI Sovereign Token.
            </p>

            {/* AADHAAR GRAPHIC CARD */}
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '2px solid #0B5ED7', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}>
              <div style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#0B1F3A' }}>UNIQUE IDENTIFICATION AUTHORITY OF INDIA</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#FF9933' }}>GOVERNMENT OF INDIA • Aadhaar - Digital e-KYC</div>
                  </div>
                </div>
                <ShieldCheck size={24} color="#059669" />
              </div>

              <div style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '80px', height: '95px', borderRadius: '8px', backgroundColor: '#E2E8F0', border: '1px solid #CBD5E1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={44} color="#64748B" />
                  <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>VERIFIED</span>
                </div>

                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0B1F3A' }}>{viewMaskedAadhaarModal.name}</div>
                  <div style={{ fontSize: '0.775rem', color: '#475569', marginTop: '2px' }}>DOB: 15/08/1995 | Gender: Male</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>Address: Vijayawada, Andhra Pradesh - 520001</div>

                  <div style={{ marginTop: '10px', backgroundColor: '#F1F5F9', border: '1px dashed #0B5ED7', padding: '6px 12px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem', fontFamily: 'monospace', fontWeight: 900, color: '#0B1F3A', letterSpacing: '0.1em' }}>
                      XXXX XXXX 8909
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#FF9933', color: '#FFFFFF', padding: '6px 12px', fontSize: '0.7rem', fontWeight: 800, textAlign: 'center' }}>
                Masked Aadhaar shared for Hotel Guest e-KYC Verification only • Sovereign Token Verified
              </div>
            </div>

            <button
              onClick={() => setViewMaskedAadhaarModal(null)}
              style={{ width: '100%', backgroundColor: '#F1F5F9', color: '#334155', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.875rem', border: 'none', cursor: 'pointer', marginTop: '20px' }}
            >
              Close Masked Aadhaar View
            </button>
          </div>
        </div>
      )}

      {/* VERIFIED COLLEGE ACADEMIC CREDENTIALS MODAL OVERLAY */}
      {viewCollegeAcademicDocsModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 31, 58, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>
            <button onClick={() => setViewCollegeAcademicDocsModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F1F5F9', border: 'none', color: '#64748B', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.6rem' }}>🎓</span>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B1F3A' }}>
                  Verified Student Academic Credentials
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Shared via student consent for Jawaharlal Nehru Technological University Admission.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              
              {/* 1. MASKED AADHAAR CARD */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #0B5ED7', borderRadius: '14px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0B1F3A' }}>🆔 Aadhaar Identity Card</span>
                  <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>VERIFIED UIDAI</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>Name: <strong>Raghavendra</strong> | Civic ID: <strong>{viewCollegeAcademicDocsModal.citizenCivicId}</strong></div>
                <div style={{ fontSize: '1rem', fontFamily: 'monospace', fontWeight: 900, color: '#0B5ED7', marginTop: '4px', letterSpacing: '0.1em' }}>XXXX XXXX 8909</div>
              </div>

              {/* 2. 10TH CLASS MARKS CARD */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #059669', borderRadius: '14px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0B1F3A' }}>📜 10th Class (SSC) Board Marks Card</span>
                  <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>VERIFIED BOARD</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>Board: <strong>Board of Secondary Education, AP</strong> | Roll No: <strong>SSC-2020-90812</strong></div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>GPA / Result: 10.0 / 10.0 (PASS WITH DISTINCTION)</div>
              </div>

              {/* 3. INTERMEDIATE (12TH) MARKS CARD */}
              <div style={{ backgroundColor: '#F8FAFC', border: '1.5px solid #D97706', borderRadius: '14px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0B1F3A' }}>🎓 Intermediate (12th Board) Marks Certificate</span>
                  <span style={{ backgroundColor: '#ECFDF5', color: '#059669', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 800 }}>VERIFIED BIEAP</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>Board: <strong>Board of Intermediate Education AP (MPC Group)</strong> | Hall Ticket: <strong>INTER-2022-44091</strong></div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>Total Marks: 982 / 1000 (GRADE A1)</div>
              </div>

            </div>

            <button
              onClick={() => setViewCollegeAcademicDocsModal(null)}
              style={{ width: '100%', backgroundColor: '#F1F5F9', color: '#334155', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.875rem', border: 'none', cursor: 'pointer', marginTop: '20px' }}
            >
              Close Academic Records View
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
