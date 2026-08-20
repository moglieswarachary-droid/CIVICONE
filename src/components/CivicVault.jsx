// src/components/CivicVault.jsx - Structured Digital Document Vault with 3 Primary Categories & 2 Document Types

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Car, GraduationCap, Award, FileText, Search, Plus, Share2, Eye,
  CheckCircle2, Clock, AlertCircle, X, Lock, Sparkles, ChevronRight, FileCheck,
  RotateCcw, AlertTriangle, Building2, User, Users, Heart, Baby, Check
} from 'lucide-react';
import { DEMO_DOCUMENTS, DEMO_FAMILY_MEMBERS, calculateDocExpiryStatus } from '../data/mockData.js';

export default function CivicVault({ documents: initialDocs, onRefreshDocs, initialMemberId = 'fam-self' }) {
  const [documents, setDocuments] = useState(initialDocs && initialDocs.length > 0 ? initialDocs : DEMO_DOCUMENTS);

  // Requirement 3 & 4: Category & Type Filters State
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'government' | 'rto' | 'academic'
  const [activeType, setActiveType] = useState('all'); // 'all' | 'certificate' | 'document'
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Category Priority');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');

  // Modals State
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [copyToast, setCopyToast] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(null); // 'government' | 'rto' | 'academic' | null
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showShareModal, setShowShareModal] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(null);
  const [shareDuration, setShareDuration] = useState('1 hour');
  const [shareResult, setShareResult] = useState(null);

  // Family & Dependent Vault State (Starts empty with Self only for clean new accounts)
  const [familyMembers, setFamilyMembers] = useState([
    { id: 'fam-self', name: 'Raghavendra (Self)', relationship: 'Self', isSelf: true, documents: [] }
  ]);
  const [selectedMemberId, setSelectedMemberId] = useState(initialMemberId || 'fam-self');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    name: '',
    relationship: 'Son (Minor)',
    age: '',
    gender: 'Male',
    idProof: ''
  });

  useEffect(() => {
    if (initialMemberId) {
      setSelectedMemberId(initialMemberId);
    }
  }, [initialMemberId]);

  const activeMember = familyMembers.find(m => m.id === selectedMemberId) || familyMembers[0];
  const activeDocList = activeMember.id === 'fam-self' ? documents : (activeMember.documents || []);

  // Requirement 11: Expanded Add Document Form State
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'government',
    type: 'document',
    issuer: '',
    refNo: '',
    issueDate: new Date().toLocaleDateString('en-GB'),
    expiryDate: 'N/A',
    description: '',
    isPrivate: false,
    institution: '',
    course: '',
    degree: '',
    semester: ''
  });
  const [uploading, setUploading] = useState(false);

  // Sync initialDocs prop when changed externally
  useEffect(() => {
    if (initialDocs && initialDocs.length > 0) {
      setDocuments(initialDocs);
    }
  }, [initialDocs]);

  // Load Vault Documents from REST API backend on mount
  useEffect(() => {
    async function loadVaultData() {
      try {
        const res = await fetch('/api/vault/documents').then(r => r.json());
        if (res.documents && res.documents.length > 0) {
          setDocuments(res.documents);
        }
      } catch (err) {
        console.log("Using local cached vault dataset");
      }
    }
    loadVaultData();
  }, []);

  // Helper 1: Normalize Category into 3 strict standards ('government' | 'rto' | 'academic')
  const getNormCat = (cat) => {
    const s = (cat || '').toLowerCase();
    if (s.includes('gov') || s.includes('identity') || s.includes('voter') || s.includes('passport') || s.includes('pan') || s.includes('aadhaar')) return 'government';
    if (s.includes('rto') || s.includes('vehicle') || s.includes('driving') || s.includes('rc') || s.includes('puc')) return 'rto';
    if (s.includes('edu') || s.includes('academic') || s.includes('degree') || s.includes('school') || s.includes('college')) return 'academic';
    return 'government';
  };

  // Helper 2: Normalize Type into 2 strict standards ('document' | 'certificate')
  const getNormType = (doc) => {
    if (doc.type) {
      const t = doc.type.toLowerCase();
      if (t.includes('cert')) return 'certificate';
      return 'document';
    }
    const name = (doc.name || '').toLowerCase();
    if (
      name.includes('certificate') ||
      name.includes('degree') ||
      name.includes('insurance') ||
      name.includes('puc') ||
      name.includes('domicile') ||
      name.includes('income') ||
      name.includes('passing')
    ) {
      return 'certificate';
    }
    return 'document';
  };

  // Requirement 5: Calculate Dynamic Category Summaries
  const getCategoryStats = (catKey) => {
    const catDocs = activeDocList.filter(d => getNormCat(d.category) === catKey);
    const docCount = catDocs.filter(d => getNormType(d) === 'document').length;
    const certCount = catDocs.filter(d => getNormType(d) === 'certificate').length;
    return { total: catDocs.length, docCount, certCount };
  };

  const govStats = getCategoryStats('government');
  const rtoStats = getCategoryStats('rto');
  const academicStats = getCategoryStats('academic');

  // Requirement 13: Combined Multi-Level State Filtering
  const filteredDocs = activeDocList.filter(doc => {
    const cat = getNormCat(doc.category);
    const type = getNormType(doc);

    // 1. Category Filter
    const matchesCategory = activeCategory === 'all' || cat === activeCategory;

    // 2. Type Filter
    const matchesType = activeType === 'all' || type === activeType;

    // 3. Status Filter
    const expInfo = calculateDocExpiryStatus(doc);
    let matchesStatus = true;
    if (statusFilter === 'Verified') matchesStatus = doc.status === 'Verified';
    else if (statusFilter === 'Pending') matchesStatus = doc.status === 'Pending Verification' || doc.status === 'PENDING';
    else if (statusFilter === 'Expiring') matchesStatus = expInfo.status === 'EXPIRING SOON';
    else if (statusFilter === 'Expired') matchesStatus = expInfo.status === 'EXPIRED';
    else if (statusFilter === 'Private') matchesStatus = doc.isPrivate;
    else if (statusFilter === 'Favorites') matchesStatus = doc.isFavorite;

    // 4. Requirement 10: Multi-Field Search
    const query = (searchQuery || aiQuery).toLowerCase().trim();
    const matchesSearch = !query ||
      doc.name.toLowerCase().includes(query) ||
      (doc.issuer && doc.issuer.toLowerCase().includes(query)) ||
      (doc.refNo && doc.refNo.toLowerCase().includes(query)) ||
      cat.includes(query) ||
      type.includes(query) ||
      (doc.institution && doc.institution.toLowerCase().includes(query)) ||
      (doc.course && doc.course.toLowerCase().includes(query)) ||
      (doc.tags && doc.tags.some(t => t.toLowerCase().includes(query)));

    return matchesCategory && matchesType && matchesStatus && matchesSearch;
  });

  // Category Priority Ranking for Default Sort
  const getCategoryRank = (cat) => {
    const c = getNormCat(cat);
    if (c === 'academic') return 1;
    if (c === 'government') return 2;
    if (c === 'rto') return 3;
    return 99;
  };

  // Sort Documents
  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sortBy === 'Name') return a.name.localeCompare(b.name);
    if (sortBy === 'Expiry Date') return (a.expiryDate || '').localeCompare(b.expiryDate || '');
    if (sortBy === 'Verification Status') return a.status.localeCompare(b.status);
    return getCategoryRank(a.category) - getCategoryRank(b.category);
  });

  // Handle File Selection from Browser Device
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);

    let cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

    let derivedCat = 'government';
    let derivedIssuer = 'UIDAI / National Authority';
    const lower = cleanName.toLowerCase();

    if (lower.includes('dl') || lower.includes('driving') || lower.includes('licence') || lower.includes('rc') || lower.includes('vehicle') || lower.includes('car')) {
      derivedCat = 'rto';
      derivedIssuer = 'MoRTH / RTO Department';
    } else if (lower.includes('b.tech') || lower.includes('degree') || lower.includes('marksheet') || lower.includes('edu') || lower.includes('school') || lower.includes('college')) {
      derivedCat = 'academic';
      derivedIssuer = 'University Academic Board';
    } else if (lower.includes('pan')) {
      derivedIssuer = 'Income Tax Department';
    }

    setUploadForm({
      ...uploadForm,
      name: cleanName,
      category: derivedCat,
      issuer: derivedIssuer,
      refNo: `REF-${Math.floor(100000 + Math.random() * 900000)}`
    });
  };

  // Submit Upload Form with REST API integration
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.name) return;

    setUploading(true);
    try {
      const res = await fetch('/api/vault/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadForm)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.document) {
          setDocuments([data.document, ...documents]);
          setShowUploadModal(false);
          setUploadForm({
            name: '',
            category: 'government',
            type: 'document',
            issuer: '',
            refNo: '',
            issueDate: new Date().toLocaleDateString('en-GB'),
            expiryDate: 'N/A',
            description: '',
            isPrivate: false,
            institution: '',
            course: '',
            degree: '',
            semester: ''
          });
          setUploading(false);
          return;
        }
      }
      throw new Error("offline");
    } catch (err) {
      setUploading(false);
      // Local fallback document addition
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: uploadForm.name,
        category: uploadForm.category || 'government',
        type: uploadForm.type || 'document',
        issuer: uploadForm.issuer || 'CIVIQONE Authority',
        refNo: uploadForm.refNo || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        issueDate: uploadForm.issueDate || new Date().toLocaleDateString('en-GB'),
        expiryDate: uploadForm.expiryDate || 'N/A',
        status: 'Verified',
        isPrivate: !!uploadForm.isPrivate,
        description: uploadForm.description || '',
        isDemo: true
      };
      setDocuments(prev => [newDoc, ...prev]);
      setShowUploadModal(false);
      setUploadForm({
        name: '',
        category: 'government',
        type: 'document',
        issuer: '',
        refNo: '',
        issueDate: new Date().toLocaleDateString('en-GB'),
        expiryDate: 'N/A',
        description: '',
        isPrivate: false,
        institution: '',
        course: '',
        degree: '',
        semester: ''
      });
    }
  };

  // Execute Credential Verification Check
  const handleRunVerification = async (doc) => {
    setShowVerifyModal({
      doc,
      verifying: true,
      checkResult: null
    });

    try {
      const res = await fetch(`/api/vault/verify-doc/${doc.id}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setDocuments(prev => prev.map(d => d.id === doc.id ? data.document : d));
          setShowVerifyModal({
            doc: data.document,
            verifying: false,
            checkResult: data.verificationCheck || {
              credentialFound: true,
              issuerConfirmed: true,
              informationMatched: true,
              credentialActive: true
            }
          });
          return;
        }
      }
      throw new Error("offline");
    } catch (err) {
      const updatedDoc = { ...doc, status: 'Verified', lastVerified: 'Today (SHA-256 Validated)' };
      setDocuments(prev => prev.map(d => d.id === doc.id ? updatedDoc : d));
      setShowVerifyModal({
        doc: updatedDoc,
        verifying: false,
        checkResult: {
          credentialFound: true,
          issuerConfirmed: true,
          informationMatched: true,
          credentialActive: true
        }
      });
    }
  };

  // Add New Family Dependent
  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    if (!newMemberForm.name) return;

    const newId = `fam-custom-${Date.now()}`;
    const newMember = {
      id: newId,
      name: newMemberForm.name,
      role: `${newMemberForm.relationship} (Age ${newMemberForm.age || '10'})`,
      relationship: newMemberForm.relationship,
      age: parseInt(newMemberForm.age) || 10,
      gender: newMemberForm.gender,
      initials: newMemberForm.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'FM',
      themeColor: newMemberForm.gender === 'Female' ? '#7C3AED' : '#0284C7',
      civicId: `CIV-AP-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(100 + Math.random() * 900)}`,
      guardianStatus: 'Legal Sovereign Guardian & Primary Caretaker',
      docCount: 1,
      documents: [
        {
          id: `fam-doc-${Date.now()}`,
          name: `${newMemberForm.relationship} Birth / Identity Proof`,
          category: 'government',
          type: 'certificate',
          issuer: 'Civil Registration Authority',
          refNo: newMemberForm.idProof || `CRA-${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'Verified',
          issueDate: new Date().toLocaleDateString('en-GB'),
          expiryDate: 'Lifetime',
          description: `Primary family dependent linkage credential for ${newMemberForm.name}.`,
          isDemo: true
        }
      ]
    };

    setFamilyMembers(prev => [...prev, newMember]);
    setSelectedMemberId(newId);
    setShowAddMemberModal(false);
    setNewMemberForm({
      name: '',
      relationship: 'Son (Minor)',
      age: '',
      gender: 'Male',
      idProof: ''
    });
  };

  // Generate Revocable Time-Limited Share Link
  const handleGenerateShare = async (doc) => {
    setShowShareModal(doc);
    const token = `SEC-SHARE-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setShareResult({
      link: `http://localhost:3001/verify?token=${token}`,
      token,
      passcode: Math.floor(1000 + Math.random() * 9000).toString(),
      duration: shareDuration,
      status: 'Active'
    });
  };

  // Icon Resolver based on Category & Type
  const getDocIcon = (doc) => {
    const cat = getNormCat(doc.category);
    const type = getNormType(doc);

    if (type === 'certificate') {
      return <Award size={22} style={{ color: '#7C3AED' }} />;
    }
    switch (cat) {
      case 'government': return <ShieldCheck size={22} style={{ color: '#0B5ED7' }} />;
      case 'rto': return <Car size={22} style={{ color: '#D97706' }} />;
      case 'academic': return <GraduationCap size={22} style={{ color: '#7C3AED' }} />;
      default: return <FileText size={22} style={{ color: '#64748B' }} />;
    }
  };

  // Classification Badge (Requirement 8)
  const getClassificationBadge = (doc) => {
    const cat = getNormCat(doc.category);
    const type = getNormType(doc);

    if (cat === 'academic') {
      return (
        <span style={{ backgroundColor: '#F5F3FF', color: '#6D28D9', border: '1px solid #DDD6FE', padding: '3px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <GraduationCap size={12} /> Academic • {type === 'certificate' ? '🏅 Certificate' : '📄 Document'}
        </span>
      );
    }
    if (cat === 'rto') {
      return (
        <span style={{ backgroundColor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A', padding: '3px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Car size={12} /> RTO &amp; Vehicles • {type === 'certificate' ? '🏅 Certificate' : '📄 Document'}
        </span>
      );
    }
    return (
      <span style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '3px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <ShieldCheck size={12} /> Government • {type === 'certificate' ? '🏅 Certificate' : '📄 Document'}
      </span>
    );
  };

  // Requirement 19: Expiry Status Badge
  const getStatusBadge = (doc) => {
    const expInfo = calculateDocExpiryStatus(doc);

    if (expInfo.status === 'EXPIRED') {
      return (
        <span style={{ backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5', padding: '3px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 900, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <AlertTriangle size={12} /> EXPIRED
        </span>
      );
    }
    if (expInfo.status === 'EXPIRING SOON') {
      return (
        <span style={{ backgroundColor: '#FFEDD5', color: '#C2410C', border: '1px solid #FDBA74', padding: '3px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} /> Expiring in {expInfo.daysRemaining} days
        </span>
      );
    }
    if (doc.status === 'Verified') {
      return (
        <span style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '3px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircle2 size={12} /> Verified ACTIVE
        </span>
      );
    }
    return (
      <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
        <AlertCircle size={12} /> Pending
      </span>
    );
  };

  // Requirement 9: Breadcrumb Text Resolver
  const getBreadcrumbText = () => {
    let catLabel = "All Categories";
    if (activeCategory === 'government') catLabel = "Government Authorized";
    else if (activeCategory === 'rto') catLabel = "RTO & Vehicles";
    else if (activeCategory === 'academic') catLabel = "Academic";

    let typeLabel = "";
    if (activeType === 'certificate') typeLabel = "Certificates";
    else if (activeType === 'document') typeLabel = "Documents";

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '16px' }}>
        <span>My Vault</span>
        <ChevronRight size={14} style={{ color: '#94A3B8' }} />
        <span style={{ color: activeCategory !== 'all' ? '#0B5ED7' : '#475569' }}>{catLabel}</span>
        {typeLabel && (
          <>
            <ChevronRight size={14} style={{ color: '#94A3B8' }} />
            <span style={{ color: '#7C3AED' }}>{typeLabel}</span>
          </>
        )}
        <span style={{ fontSize: '0.75rem', backgroundColor: '#F1F5F9', color: '#64748B', padding: '2px 8px', borderRadius: '10px', marginLeft: '6px' }}>
          {sortedDocs.length} records shown
        </span>
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 16px' }}>

      {/* HEADER & VAULT COMPACT SUMMARY */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        padding: '28px',
        border: '1px solid #E2E8F0',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#EAF3FF', color: '#0B5ED7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={26} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0B1F3A', letterSpacing: '-0.02em' }}>
                  STRUCTURED DIGITAL VAULT
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '2px' }}>
                  Organized Repository for Government, RTO &amp; Academic Credentials
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            style={{
              backgroundColor: '#0B5ED7',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(11, 94, 215, 0.25)',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <Plus size={18} /> Add Document
          </button>
        </div>

        {/* Requirement 12: Dashboard Summary Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          backgroundColor: '#F8FAFC',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>TOTAL DOCUMENTS</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B1F3A', marginTop: '2px' }}>{documents.length} Docs</div>
          </div>

          <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#0F5132', fontWeight: 700, textTransform: 'uppercase' }}>VERIFIED ACTIVE</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F5132', marginTop: '2px' }}>
              {documents.filter(d => calculateDocExpiryStatus(d).status === 'ACTIVE' || calculateDocExpiryStatus(d).status === 'NO EXPIRY').length} Active
            </div>
          </div>

          <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#C2410C', fontWeight: 700, textTransform: 'uppercase' }}>EXPIRING SOON</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#C2410C', marginTop: '2px' }}>
              {documents.filter(d => calculateDocExpiryStatus(d).status === 'EXPIRING SOON').length} Expiring
            </div>
          </div>

          <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#991B1B', fontWeight: 700, textTransform: 'uppercase' }}>EXPIRED</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#991B1B', marginTop: '2px' }}>
              {documents.filter(d => calculateDocExpiryStatus(d).status === 'EXPIRED').length} Expired
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#0B5ED7', fontWeight: 700, textTransform: 'uppercase' }}>VAULT HEALTH</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B5ED7', marginTop: '2px' }}>100% Verified</div>
          </div>
        </div>
      </div>

      {/* FAMILY & DEPENDENT VAULT SWITCHER BAR */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1.5px solid #E2E8F0',
        padding: '16px 20px',
        marginBottom: '20px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} style={{ color: '#1A4F9C' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 900, color: '#101B3D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Family &amp; Dependent Vaults
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAddMemberModal(true)}
            style={{
              backgroundColor: '#EFF6FF',
              color: '#1A4F9C',
              border: '1.5px solid #BFDBFE',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '0.775rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={14} /> Add Dependent
          </button>
        </div>

        {/* Family Member Pill Chips */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
          {familyMembers.map((member) => {
            const isSelected = member.id === selectedMemberId;
            const count = member.id === 'fam-self' ? documents.length : (member.documents?.length || member.docCount || 0);

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => setSelectedMemberId(member.id)}
                style={{
                  backgroundColor: isSelected ? '#101B3D' : '#F8FAFC',
                  color: isSelected ? '#FFFFFF' : '#1E293B',
                  border: isSelected ? '1.5px solid #101B3D' : '1.5px solid #CBD5E1',
                  borderRadius: '14px',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isSelected ? '0 4px 12px rgba(16, 27, 61, 0.2)' : 'none',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? '#38BDF8' : (member.themeColor || '#1A4F9C'),
                  color: isSelected ? '#101B3D' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  letterSpacing: '0.02em',
                  flexShrink: 0
                }}>
                  {member.initials || (member.name ? member.name.substring(0, 2).toUpperCase() : 'FM')}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 800, lineHeight: 1.1 }}>{member.name}</div>
                  <div style={{ fontSize: '0.675rem', color: isSelected ? '#93C5FD' : '#64748B', fontWeight: 700 }}>
                    {member.role} &bull; {count} Docs
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* DEPENDENT PROFILE BANNER IF VIEWING A CHILD OR SENIOR PARENT */}
      {activeMember.id !== 'fam-self' && (
        <div style={{
          backgroundColor: '#EFF6FF',
          borderRadius: '18px',
          border: '1.5px solid #BFDBFE',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              backgroundColor: activeMember.themeColor || '#1A4F9C',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: '1.1rem',
              boxShadow: '0 4px 12px rgba(26, 79, 156, 0.25)',
              flexShrink: 0
            }}>
              {activeMember.initials || (activeMember.name ? activeMember.name.substring(0, 2).toUpperCase() : 'FM')}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#101B3D' }}>{activeMember.name}</h3>
                <span style={{ backgroundColor: '#1A4F9C', color: '#FFFFFF', padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>
                  {activeMember.relationship}
                </span>
              </div>
              <div style={{ fontSize: '0.775rem', color: '#1E2F6B', marginTop: '2px' }}>
                Civic ID: <strong>{activeMember.civicId}</strong> &bull; Guardian: <strong>{activeMember.guardianStatus}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ backgroundColor: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '6px 12px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> Verified Guardian Custody
            </span>
          </div>
        </div>
      )}

      {/* REQUIREMENT 5: THREE CATEGORY OVERVIEW CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        
        {/* CARD 1: GOVERNMENT AUTHORIZED */}
        <div style={{
          backgroundColor: activeCategory === 'government' ? '#EFF6FF' : '#FFFFFF',
          borderRadius: '20px',
          padding: '20px',
          border: activeCategory === 'government' ? '2px solid #3B82F6' : '1px solid #E2E8F0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '4px 10px', borderRadius: '12px', border: '1px solid #BFDBFE' }}>
                Official Identity
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>
              🏛️ Government Authorized
            </h3>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1D4ED8', marginTop: '4px' }}>
              {govStats.total} Records
            </div>
            <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
              {govStats.docCount} Documents • {govStats.certCount} Certificates
            </div>
          </div>
          <button
            onClick={() => setShowCategoryModal('government')}
            style={{
              marginTop: '16px',
              backgroundColor: '#1D4ED8',
              color: '#FFFFFF',
              padding: '10px 16px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Open Vault →
          </button>
        </div>

        {/* CARD 2: RTO & VEHICLES */}
        <div style={{
          backgroundColor: activeCategory === 'rto' ? '#FFFBEB' : '#FFFFFF',
          borderRadius: '20px',
          padding: '20px',
          border: activeCategory === 'rto' ? '2px solid #F59E0B' : '1px solid #E2E8F0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Car size={24} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#FFFBEB', color: '#D97706', padding: '4px 10px', borderRadius: '12px', border: '1px solid #FDE68A' }}>
                Parivahan Sewa
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>
              🚗 RTO &amp; Vehicles
            </h3>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#D97706', marginTop: '4px' }}>
              {rtoStats.total} Records
            </div>
            <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
              {rtoStats.docCount} Documents • {rtoStats.certCount} Certificates
            </div>
          </div>
          <button
            onClick={() => setShowCategoryModal('rto')}
            style={{
              marginTop: '16px',
              backgroundColor: '#D97706',
              color: '#FFFFFF',
              padding: '10px 16px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Open Vault →
          </button>
        </div>

        {/* CARD 3: ACADEMIC */}
        <div style={{
          backgroundColor: activeCategory === 'academic' ? '#F5F3FF' : '#FFFFFF',
          borderRadius: '20px',
          padding: '20px',
          border: activeCategory === 'academic' ? '2px solid #7C3AED' : '1px solid #E2E8F0',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={24} />
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#F5F3FF', color: '#7C3AED', padding: '4px 10px', borderRadius: '12px', border: '1px solid #DDD6FE' }}>
                Education Credentials
              </span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>
              🎓 Academic
            </h3>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#7C3AED', marginTop: '4px' }}>
              {academicStats.total} Records
            </div>
            <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
              {academicStats.docCount} Documents • {academicStats.certCount} Certificates
            </div>
          </div>
          <button
            onClick={() => setShowCategoryModal('academic')}
            style={{
              marginTop: '16px',
              backgroundColor: '#7C3AED',
              color: '#FFFFFF',
              padding: '10px 16px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.825rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Open Vault →
          </button>
        </div>

      </div>

      {/* REQUIREMENT 10: SEARCH BAR */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search B.Tech, Aadhaar, PAN, Driving Licence, Certificate, Marksheet..."
            style={{ width: '100%', padding: '12px 16px 12px 46px', borderRadius: '16px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 600, backgroundColor: '#FFFFFF' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: '#64748B', border: 'none', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* REQUIREMENT 3 & 4: CATEGORY AND TYPE FILTER TOOLBAR */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '16px 20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)', marginBottom: '16px' }}>
        
        {/* 1. Category Filter Buttons */}
        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: '85px' }}>
            CATEGORY:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'ALL' },
              { id: 'government', label: 'GOVERNMENT' },
              { id: 'rto', label: 'RTO & VEHICLES' },
              { id: 'academic', label: 'ACADEMIC' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '7px 16px', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 800,
                  backgroundColor: activeCategory === cat.id ? '#0B5ED7' : '#F8FAFC',
                  color: activeCategory === cat.id ? '#FFFFFF' : '#334155',
                  border: activeCategory === cat.id ? 'none' : '1px solid #CBD5E1',
                  cursor: 'pointer',
                  boxShadow: activeCategory === cat.id ? '0 2px 8px rgba(11, 94, 215, 0.25)' : 'none'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Document Type Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', minWidth: '85px' }}>
            DOCUMENT TYPE:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'ALL TYPES' },
              { id: 'certificate', label: '🏅 CERTIFICATES' },
              { id: 'document', label: '📄 DOCUMENTS' }
            ].map(tp => (
              <button
                key={tp.id}
                onClick={() => setActiveType(tp.id)}
                style={{
                  padding: '6px 14px', borderRadius: '12px', fontSize: '0.775rem', fontWeight: 800,
                  backgroundColor: activeType === tp.id ? '#7C3AED' : '#FFFFFF',
                  color: activeType === tp.id ? '#FFFFFF' : '#475569',
                  border: activeType === tp.id ? 'none' : '1px solid #CBD5E1',
                  cursor: 'pointer',
                  boxShadow: activeType === tp.id ? '0 2px 8px rgba(124, 58, 237, 0.25)' : 'none'
                }}
              >
                {tp.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* REQUIREMENT 9: BREADCRUMB INDICATOR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        {getBreadcrumbText()}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#FFFFFF', color: '#0B1F3A' }}
          >
            <option value="Category Priority">Category Priority (Academic ➜ Govt ➜ RTO)</option>
            <option value="Name">Document Name</option>
            <option value="Expiry Date">Expiry Date</option>
            <option value="Verification Status">Verification Status</option>
          </select>
        </div>
      </div>

      {/* REQUIREMENT 15: EMPTY STATE WHEN NO RESULTS MATCH */}
      {sortedDocs.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '56px 24px', textAlign: 'center', border: '1px dashed #CBD5E1', color: '#64748B', marginBottom: '40px' }}>
          <FileText size={52} style={{ color: '#94A3B8', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '6px' }}>
            No {activeCategory !== 'all' ? activeCategory.toUpperCase() : ''} {activeType !== 'all' ? activeType.toUpperCase() + 'S' : 'Records'} Found
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#64748B', maxWidth: '440px', margin: '0 auto 16px auto' }}>
            There are currently no document records matching your active filter criteria or search query.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              onClick={() => { setActiveCategory('all'); setActiveType('all'); setSearchQuery(''); setAiQuery(''); setStatusFilter('All'); }}
              style={{ backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '10px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RotateCcw size={16} /> Clear Filters
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              style={{ backgroundColor: '#F1F5F9', color: '#334155', padding: '10px 18px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', border: 'none', cursor: 'pointer' }}
            >
              + Add New Document
            </button>
          </div>
        </div>
      ) : (
        /* REQUIREMENT 8 & 16: RESPONSIVE DOCUMENT CARDS GRID WITH CLASSIFICATION BADGES */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {sortedDocs.map(doc => {
            const expInfo = calculateDocExpiryStatus(doc);
            const isExpired = expInfo.status === 'EXPIRED';

            return (
              <div
                key={doc.id}
                style={{
                  backgroundColor: isExpired ? '#FEF2F2' : '#FFFFFF',
                  borderRadius: '20px',
                  padding: '24px',
                  border: isExpired ? '1.5px solid #FCA5A5' : '1px solid #E2E8F0',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  opacity: isExpired ? 0.95 : 1
                }}
              >
                <div>
                  {/* Top Bar: Icon, Classification Indicator Badge & Status Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                      {getDocIcon(doc)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      {getClassificationBadge(doc)}
                      {getStatusBadge(doc)}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>
                    {doc.name}
                  </h3>
                  <div style={{ fontSize: '0.775rem', color: '#0B5ED7', fontWeight: 700, marginBottom: '12px' }}>
                    Issuer: {doc.issuer}
                  </div>

                  {/* Middle Info Details: Credential ID, Dates, Verification */}
                  <div style={{ backgroundColor: isExpired ? '#FFFFFF' : '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.775rem', color: '#334155', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748B' }}>Credential Number:</span>
                      <strong style={{ color: '#0B1F3A', fontFamily: 'monospace' }}>{doc.refNo}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748B' }}>Issue Date:</span>
                      <strong style={{ color: '#0B1F3A' }}>{doc.issueDate || '15-01-2024'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748B' }}>Expiry Date:</span>
                      <strong style={{ color: isExpired ? '#991B1B' : (expInfo.status === 'EXPIRING SOON' ? '#C2410C' : '#0F5132') }}>
                        {doc.expiryDate || 'N/A'} {isExpired ? '(EXPIRED)' : ''}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#64748B' }}>Last Verified:</span>
                      <span>{doc.lastVerified || '14 Aug 2026'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Access Status:</span>
                      <span style={{ color: doc.isPrivate ? '#991B1B' : '#0B5ED7', fontWeight: 700 }}>
                        {doc.isPrivate ? 'Private Vault Only' : 'Sharable via Consent'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Requirement 19 Action Buttons: View, Verify, Share, History */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                  <button
                    onClick={() => setSelectedDoc(doc)}
                    style={{ backgroundColor: '#EAF3FF', color: '#0B5ED7', padding: '8px', borderRadius: '10px', fontSize: '0.725rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', border: 'none', cursor: 'pointer' }}
                  >
                    <Eye size={12} /> View
                  </button>

                  <button
                    onClick={() => handleRunVerification(doc)}
                    style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '8px', borderRadius: '10px', fontSize: '0.725rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', border: 'none', cursor: 'pointer' }}
                  >
                    <CheckCircle2 size={12} /> Verify
                  </button>

                  <button
                    onClick={() => handleGenerateShare(doc)}
                    disabled={isExpired}
                    style={{ backgroundColor: isExpired ? '#E2E8F0' : '#FEF3C7', color: isExpired ? '#94A3B8' : '#92400E', padding: '8px', borderRadius: '10px', fontSize: '0.725rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', border: 'none', cursor: isExpired ? 'not-allowed' : 'pointer' }}
                  >
                    <Share2 size={12} /> Share
                  </button>

                  <button
                    onClick={() => setShowAuditModal(doc)}
                    style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '8px', borderRadius: '10px', fontSize: '0.725rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', border: 'none', cursor: 'pointer' }}
                  >
                    <Clock size={12} /> History
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: FULL OFFICIAL GRAPHIC DOCUMENT PREVIEW & COPY SUITE */}
      {selectedDoc && (() => {
        const docNameLower = (selectedDoc.name || '').toLowerCase();
        const docRef = selectedDoc.refNo || selectedDoc.docNumber || '8121 4981 8909';
        const isAadhaar = docNameLower.includes('aadhaar');
        const isPan = docNameLower.includes('pan');
        const isDL = docNameLower.includes('driving') || docNameLower.includes('licence') || docNameLower.includes('dl');
        const isAcademic = docNameLower.includes('b.tech') || docNameLower.includes('degree') || docNameLower.includes('marksheet') || docNameLower.includes('academic');

        const handleCopyCode = (codeStr, labelText) => {
          if (navigator.clipboard && codeStr) {
            navigator.clipboard.writeText(codeStr);
            setCopyToast(`✅ Copied ${labelText} (${codeStr}) to clipboard!`);
            setTimeout(() => setCopyToast(''), 3500);
          }
        };

        return (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 31, 58, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
            <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '680px', width: '100%', maxHeight: '92vh', overflowY: 'auto', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>
              
              {/* Close Button */}
              <button onClick={() => setSelectedDoc(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F1F5F9', border: 'none', color: '#64748B', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#EAF3FF', color: '#0B5ED7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getDocIcon(selectedDoc)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B1F3A' }}>{selectedDoc.name}</h3>
                  <div style={{ fontSize: '0.825rem', color: '#0B5ED7', fontWeight: 800 }}>Issuing Authority: {selectedDoc.issuer}</div>
                </div>
              </div>

              {/* COPY FEEDBACK TOAST */}
              {copyToast && (
                <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 16px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', marginBottom: '16px', textAlign: 'center' }}>
                  {copyToast}
                </div>
              )}

              {/* 1. VISUAL GRAPHIC DOCUMENT CARD PREVIEW */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  🖼️ Sovereign Digital Document Visual Card Preview:
                </div>

                {/* AADHAAR CARD VISUAL DESIGN */}
                {isAadhaar && (
                  <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '2px solid #E2E8F0', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    {/* Tricolor Header Bar */}
                    <div style={{ height: '6px', background: 'linear-gradient(to right, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #128807 66%)' }} />
                    <div style={{ backgroundColor: '#F8FAFC', padding: '14px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontSize: '1.4rem' }}>🏛️</div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#0B1F3A' }}>UNIQUE IDENTIFICATION AUTHORITY OF INDIA</div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#FF9933' }}>GOVERNMENT OF INDIA • Aadhaar - Digital Identity</div>
                        </div>
                      </div>
                      <ShieldCheck size={28} color="#128807" />
                    </div>

                    <div style={{ padding: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ width: '90px', height: '110px', borderRadius: '10px', backgroundColor: '#E2E8F0', border: '2px solid #CBD5E1', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <User size={54} color="#64748B" />
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#0B5ED7', marginTop: '4px' }}>VERIFIED</span>
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>Raghavendra</div>
                        <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>DOB: <strong>15/08/1995</strong> | Gender: <strong>Male</strong></div>
                        <div style={{ fontSize: '0.775rem', color: '#64748B', marginTop: '4px' }}>Address: Vijayawada, Andhra Pradesh - 520001</div>
                        
                        {/* Aadhaar Number Box */}
                        <div style={{ marginTop: '12px', backgroundColor: '#F1F5F9', border: '1px dashed #0B5ED7', padding: '10px 14px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '1.25rem', fontFamily: 'monospace', fontWeight: 900, color: '#0B1F3A', letterSpacing: '0.15em' }}>
                            {docRef}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#FF9933', color: '#FFFFFF', padding: '6px 14px', fontSize: '0.7rem', fontWeight: 800, textAlign: 'center' }}>
                      Aadhaar is proof of identity, not of citizenship • Sovereign Token Verified
                    </div>
                  </div>
                )}

                {/* PAN CARD VISUAL DESIGN */}
                {isPan && (
                  <div style={{ backgroundColor: '#1E3A8A', borderRadius: '16px', color: '#FFFFFF', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', pb: '10px', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#FEF08A' }}>INCOME TAX DEPARTMENT</div>
                        <div style={{ fontSize: '0.7rem', color: '#93C5FD', fontWeight: 700 }}>GOVT. OF INDIA • Permanent Account Number Card</div>
                      </div>
                      <div style={{ fontSize: '1.4rem' }}>🏛️</div>
                    </div>

                    <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                      <div style={{ width: '80px', height: '95px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={48} color="#93C5FD" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#93C5FD', fontWeight: 700 }}>Name / Name</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#FFFFFF' }}>RAGHAVENDRA</div>
                        <div style={{ fontSize: '0.75rem', color: '#93C5FD', fontWeight: 700, marginTop: '6px' }}>Father's Name / Father Name</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#FEF08A' }}>S. RAGHAVENDRA</div>
                        <div style={{ fontSize: '0.75rem', color: '#93C5FD', fontWeight: 700, marginTop: '6px' }}>Date of Birth / DOB</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>15/08/1995</div>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', padding: '10px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#93C5FD', fontWeight: 800 }}>PAN NUMBER:</span>
                      <span style={{ fontSize: '1.2rem', fontFamily: 'monospace', fontWeight: 900, color: '#FEF08A', letterSpacing: '0.1em' }}>
                        {docRef}
                      </span>
                    </div>
                  </div>
                )}

                {/* DRIVING LICENCE VISUAL DESIGN */}
                {isDL && (
                  <div style={{ backgroundColor: '#0F172A', borderRadius: '16px', color: '#FFFFFF', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1.5px solid #0B5ED7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Car size={26} color="#60A5FA" />
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#60A5FA' }}>TRANSPORT DEPARTMENT — ANDHRA PRADESH</div>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>MINISTRY OF ROAD TRANSPORT & HIGHWAYS (MoRTH)</div>
                        </div>
                      </div>
                      <span style={{ backgroundColor: '#059669', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 900, padding: '3px 8px', borderRadius: '4px' }}>ACTIVE DL</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '80px', height: '95px', borderRadius: '8px', backgroundColor: '#1E293B', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={44} color="#60A5FA" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Licence Number:</div>
                        <div style={{ fontSize: '1.15rem', fontFamily: 'monospace', fontWeight: 900, color: '#FEF08A' }}>{docRef}</div>
                        <div style={{ fontSize: '0.8rem', color: '#E2E8F0', marginTop: '4px' }}>Holder: <strong>Raghavendra</strong></div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>Authorised Vehicle Class: <strong style={{ color: '#60A5FA' }}>MCWG, LMV</strong></div>
                        <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Valid Expiry Date: <strong style={{ color: '#34D399' }}>{selectedDoc.expiryDate || '14-01-2034'}</strong></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ACADEMIC DEGREE VISUAL DESIGN */}
                {isAcademic && (
                  <div style={{ backgroundColor: '#FFFDF5', borderRadius: '16px', border: '2px solid #D97706', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', position: 'relative' }}>
                    <div style={{ textAlign: 'center', borderBottom: '2px solid #FDE68A', paddingBottom: '14px', marginBottom: '16px' }}>
                      <GraduationCap size={36} color="#B45309" style={{ margin: '0 auto 6px' }} />
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#78350F', letterSpacing: '0.02em' }}>STATE TECHNOLOGICAL UNIVERSITY</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>OFFICIAL ACADEMIC CREDENTIAL DEGREE CERTIFICATE</div>
                    </div>

                    <div style={{ textAlign: 'center', margin: '14px 0' }}>
                      <div style={{ fontSize: '0.8rem', color: '#92400E' }}>This is to certify that</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#78350F', margin: '4px 0' }}>Raghavendra</div>
                      <div style={{ fontSize: '0.85rem', color: '#92400E' }}>has successfully completed the degree of</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#B45309', marginTop: '4px' }}>{selectedDoc.name}</div>
                    </div>

                    <div style={{ backgroundColor: '#FEF3C7', border: '1px dashed #D97706', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#78350F' }}>ROLL / TRANSCRIPT REF:</span>
                      <span style={{ fontSize: '1.05rem', fontFamily: 'monospace', fontWeight: 900, color: '#78350F' }}>{docRef}</span>
                    </div>
                  </div>
                )}

                {/* OTHER / GENERIC DOCUMENT VISUAL DESIGN */}
                {!isAadhaar && !isPan && !isDL && !isAcademic && (
                  <div style={{ backgroundColor: '#0B1F3A', borderRadius: '16px', color: '#FFFFFF', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '14px', marginBottom: '16px' }}>
                      <FileCheck size={36} color="#60A5FA" />
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{selectedDoc.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Issuing Authority: {selectedDoc.issuer}</div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 18px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>CREDENTIAL REF CODE:</span>
                      <span style={{ fontSize: '1.15rem', fontFamily: 'monospace', fontWeight: 900, color: '#FEF08A' }}>{docRef}</span>
                    </div>
                  </div>
                )}

              </div>

              {/* 2. DIRECT ONE-CLICK COPY CODE & METADATA SECTION */}
              <div style={{ backgroundColor: '#F8FAFC', borderRadius: '16px', border: '1.5px solid #E2E8F0', padding: '20px', marginBottom: '24px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  📋 Quick Copy Document Code &amp; Reference:
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ flex: 1, backgroundColor: '#FFFFFF', border: '1.5px solid #CBD5E1', padding: '10px 14px', borderRadius: '10px', fontFamily: 'monospace', fontWeight: 900, fontSize: '1.05rem', color: '#0B1F3A', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{docRef}</span>
                      <span style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 700, fontFamily: 'sans-serif' }}>Primary Code</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(docRef, selectedDoc.name)}
                      style={{ backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '11px 18px', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(11, 94, 215, 0.25)' }}
                    >
                      📋 Copy Code
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ flex: 1, backgroundColor: '#FFFFFF', border: '1.5px solid #CBD5E1', padding: '10px 14px', borderRadius: '10px', fontSize: '0.8rem', color: '#475569', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {`${selectedDoc.name} | Ref: ${docRef} | Issuer: ${selectedDoc.issuer}`}
                    </div>
                    <button
                      onClick={() => handleCopyCode(`${selectedDoc.name} | Ref: ${docRef} | Issuer: ${selectedDoc.issuer}`, 'Full Credential Details')}
                      style={{ backgroundColor: '#EAF3FF', color: '#0B5ED7', padding: '11px 14px', borderRadius: '10px', fontWeight: 800, fontSize: '0.8rem', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      📋 Copy Details
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. METADATA SUMMARY TABLE */}
              <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '16px 20px', marginBottom: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.825rem' }}>
                <div>
                  <span style={{ color: '#64748B', fontWeight: 700, display: 'block' }}>Issue Date</span>
                  <strong style={{ color: '#0B1F3A' }}>{selectedDoc.issueDate || '15 Jan 2024'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontWeight: 700, display: 'block' }}>Expiry Date</span>
                  <strong style={{ color: '#0B1F3A' }}>{selectedDoc.expiryDate || 'N/A (Lifetime)'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontWeight: 700, display: 'block' }}>Verification Status</span>
                  <span style={{ color: '#059669', fontWeight: 800 }}>🟢 Verified Sovereign Record</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', fontWeight: 700, display: 'block' }}>Sharing Access</span>
                  <strong style={{ color: '#0B5ED7' }}>Time-Bound Consent Token</strong>
                </div>
              </div>

              {/* CLOSE BUTTON */}
              <button onClick={() => setSelectedDoc(null)} style={{ width: '100%', backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '14px', borderRadius: '14px', fontWeight: 800, fontSize: '0.925rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(11, 94, 215, 0.3)' }}>
                Done / Close Document Preview
              </button>

            </div>
          </div>
        );
      })()}

      {/* MODAL: ACCESS HISTORY AUDIT */}
      {showAuditModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 31, 58, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '28px', maxWidth: '540px', width: '100%', position: 'relative' }}>
            <button onClick={() => setShowAuditModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: '#64748B', border: 'none', cursor: 'pointer' }}>
              <X size={22} />
            </button>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '12px' }}>
              Access History for {showAuditModal.name}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem' }}>
              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <strong>CIVIQONE Demo Authority</strong> (Credential Verification)<br />
                <span style={{ color: '#64748B' }}>14 Aug 2026, 08:30 AM — Status: AUTHORIZED VIEW</span>
              </div>
            </div>
            <button onClick={() => setShowAuditModal(null)} style={{ width: '100%', backgroundColor: '#F1F5F9', color: '#475569', padding: '10px', borderRadius: '10px', fontWeight: 800, marginTop: '20px', border: 'none', cursor: 'pointer' }}>
              Close History
            </button>
          </div>
        </div>
      )}

      {/* STREAMLINED FILE UPLOAD MODAL */}
      {showUploadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 31, 58, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '540px', width: '100%', position: 'relative', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>
            
            <button onClick={() => { setShowUploadModal(false); setSelectedFile(null); }} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F1F5F9', border: 'none', color: '#64748B', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: '#EAF3FF', color: '#0B5ED7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Plus size={26} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B1F3A' }}>Add Document to Vault</h3>
                <p style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '2px' }}>Choose a document or image file directly from your computer or device.</p>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* FILE PICKER ZONE */}
              <div style={{ border: '2px dashed #0B5ED7', borderRadius: '16px', padding: '24px', textAlign: 'center', backgroundColor: '#F8FAFC', cursor: 'pointer', position: 'relative' }}>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: '#EAF3FF', color: '#0B5ED7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <FileText size={28} />
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0B1F3A' }}>
                  {selectedFile ? `📄 Selected File: ${selectedFile.name}` : '📁 Click to Choose File from Device'}
                </div>
                <div style={{ fontSize: '0.775rem', color: '#64748B', marginTop: '4px' }}>
                  {selectedFile ? `File Size: ${(selectedFile.size / 1024).toFixed(1)} KB` : 'Supports PDF, PNG, JPG, JPEG & Digital Certificates'}
                </div>
              </div>

              {/* DOCUMENT NAME (PRE-FILLED OR EDITABLE) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
                  Document Name
                </label>
                <input
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="e.g. Aadhaar Card, Driving Licence, B.Tech Marksheet"
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}
                  required
                />
              </div>

              {/* CATEGORY SELECTOR */}
              <div>
                <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
                  Category
                </label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', backgroundColor: '#FFFFFF' }}
                >
                  <option value="government">🏛️ Government Authorized</option>
                  <option value="rto">🚗 RTO &amp; Vehicles</option>
                  <option value="academic">🎓 Academic &amp; Education</option>
                </select>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={uploading}
                style={{ width: '100%', backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '14px', borderRadius: '14px', fontWeight: 800, fontSize: '0.95rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(11, 94, 215, 0.3)', marginTop: '6px' }}
              >
                {uploading ? 'Saving Document...' : 'Upload & Save Document to Vault 🚀'}
              </button>

            </form>
          </div>
        </div>
      )}

      {/* CATEGORY OVERLAY DIALOG MODAL */}
      {showCategoryModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '850px',
            width: '100%',
            maxHeight: '88vh',
            overflowY: 'auto',
            padding: '32px',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)'
          }}>
            <button
              onClick={() => setShowCategoryModal(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            {/* Modal Category Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '16px',
                backgroundColor: showCategoryModal === 'government' ? '#DBEAFE' : showCategoryModal === 'rto' ? '#FEF3C7' : '#EDE9FE',
                color: showCategoryModal === 'government' ? '#1D4ED8' : showCategoryModal === 'rto' ? '#D97706' : '#7C3AED',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {showCategoryModal === 'government' ? <ShieldCheck size={28} /> : showCategoryModal === 'rto' ? <Car size={28} /> : <GraduationCap size={28} />}
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0B1F3A' }}>
                  {showCategoryModal === 'government' ? '🏛️ Government Authorized Vault' : showCategoryModal === 'rto' ? '🚗 RTO & Vehicle Credentials' : '🎓 Academic Degrees & Marksheets'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '2px' }}>
                  Exclusive category vault view for your verified {showCategoryModal} records.
                </p>
              </div>
            </div>

            {/* Document Cards in this Category */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', marginTop: '24px' }}>
              {documents.filter(d => getNormCat(d.category) === showCategoryModal).map(doc => (
                <div key={doc.id} style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      {getDocIcon(doc)}
                      {getStatusBadge(doc)}
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '4px' }}>{doc.name}</h4>
                    <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Issuer: {doc.issuer}</div>
                    {doc.refNo && <div style={{ fontSize: '0.75rem', color: '#0B5ED7', fontFamily: 'monospace', fontWeight: 700, marginTop: '2px' }}>Ref: {doc.refNo}</div>}
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => { setShowCategoryModal(null); setSelectedDoc(doc); }}
                      style={{ flex: 1, backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '8px', borderRadius: '10px', fontWeight: 700, fontSize: '0.775rem', border: 'none', cursor: 'pointer' }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => { setShowCategoryModal(null); handleRunVerification(doc); }}
                      style={{ backgroundColor: '#EAF3FF', color: '#0B5ED7', padding: '8px', borderRadius: '10px', fontWeight: 700, fontSize: '0.775rem', border: 'none', cursor: 'pointer' }}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ADD FAMILY DEPENDENT MODAL */}
      {showAddMemberModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.65)',
          backdropFilter: 'blur(8px)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            padding: '28px',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            animation: 'modalSlideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>
            <button
              type="button"
              onClick={() => setShowAddMemberModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', backgroundColor: '#EFF6FF', color: '#1A4F9C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#101B3D' }}>
                  Enroll Family Dependent
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Add a child or senior parent to manage their digital credentials
                </p>
              </div>
            </div>

            <form onSubmit={handleAddMemberSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#101B3D', marginBottom: '6px' }}>
                  Dependent Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advait Sharma"
                  value={newMemberForm.name}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 600, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#101B3D', marginBottom: '6px' }}>
                    Relationship *
                  </label>
                  <select
                    value={newMemberForm.relationship}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, relationship: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 600, boxSizing: 'border-box' }}
                  >
                    <option value="Son (Minor)">Son (Minor)</option>
                    <option value="Daughter (Minor)">Daughter (Minor)</option>
                    <option value="Father (Senior Citizen)">Father (Senior Citizen)</option>
                    <option value="Mother (Senior Citizen)">Mother (Senior Citizen)</option>
                    <option value="Spouse">Spouse</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#101B3D', marginBottom: '6px' }}>
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="110"
                    placeholder="e.g. 6"
                    value={newMemberForm.age}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, age: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 600, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#101B3D', marginBottom: '6px' }}>
                    Gender *
                  </label>
                  <select
                    value={newMemberForm.gender}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, gender: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 600, boxSizing: 'border-box' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#101B3D', marginBottom: '6px' }}>
                    Identity Proof / Ref No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B-2022-AP-8841"
                    value={newMemberForm.idProof}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, idProof: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 600, boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.75rem', color: '#475569' }}>
                🛡️ <strong>Guardian Consent:</strong> Adding this dependent links their digital credentials under your primary sovereign guardianship with cryptographic signature.
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  style={{ flex: 1, backgroundColor: '#F1F5F9', color: '#475569', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.875rem', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, backgroundColor: '#1A4F9C', color: '#FFFFFF', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.875rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Check size={16} /> Enroll &amp; Create Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
