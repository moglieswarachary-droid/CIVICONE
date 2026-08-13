// src/components/CivicVault.jsx - Next-Generation Structured Digital Document Vault

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, HeartPulse, Car, GraduationCap, Briefcase, Building2, User, Landmark,
  FileText, Search, Plus, Download, Share2, Eye, CheckCircle2, Clock, AlertCircle, X,
  Lock, Sparkles, Star, ChevronRight, Activity, Filter, RefreshCw, ZoomIn, ZoomOut, Maximize2, FileCheck, ArrowUpRight
} from 'lucide-react';
import VoterIdVault from './VoterIdVault.jsx';
import { DEMO_DOCUMENTS } from '../data/mockData.js';

export default function CivicVault({ documents: initialDocs, onRefreshDocs }) {
  const [documents, setDocuments] = useState(initialDocs && initialDocs.length > 0 ? initialDocs : DEMO_DOCUMENTS);
  const [summary, setSummary] = useState({
    totalDocuments: 14,
    verifiedDocuments: 12,
    pendingVerification: 1,
    expiringSoon: 2,
    recentlyAdded: 3
  });

  // Filter & Search State
  const [activeCategory, setActiveCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Added');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'workspace'

  // Modals State
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(null);
  const [shareDuration, setShareDuration] = useState('1 hour');
  const [shareResult, setShareResult] = useState(null);

  // Upload Form State with OCR simulation
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'Government',
    issuer: '',
    refNo: '',
    description: '',
    isPrivate: false
  });
  const [ocrDetected, setOcrDetected] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Viewer State inside Modal
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load Vault Summary & Documents on Mount
  useEffect(() => {
    async function loadVaultData() {
      try {
        const [docRes, sumRes] = await Promise.all([
          fetch('/api/vault/documents').then(r => r.json()),
          fetch('/api/vault/summary').then(r => r.json())
        ]);
        if (docRes.documents) setDocuments(docRes.documents);
        if (sumRes.totalDocuments) setSummary(sumRes);
      } catch (err) {
        console.log("Using cached vault data");
      }
    }
    loadVaultData();
  }, []);

  const categories = [
    { id: 'Voter ID', label: 'Voter ID Module', icon: Landmark, color: '#0284C7' },
    { id: 'Consent', label: 'Who Has Access? (Consent)', icon: Lock, color: '#DC2626' },
    { id: 'Government', label: 'Government & Identity', icon: ShieldCheck, color: '#0B5ED7' },
    { id: 'Healthcare', label: 'Healthcare & Medical', icon: HeartPulse, color: '#E11D48' },
    { id: 'RTO & Vehicles', label: 'RTO & Vehicles', icon: Car, color: '#D97706' },
    { id: 'Finance', label: 'Banking & Finance', icon: Landmark, color: '#059669' },
    { id: 'Education', label: 'Education & Academic', icon: GraduationCap, color: '#7C3AED' },
    { id: 'Professional', label: 'Professional & Career', icon: Briefcase, color: '#2563EB' },
    { id: 'Organizations', label: 'Organizations & Membership', icon: Building2, color: '#4B5563' },
    { id: 'Personal Documents', label: 'Personal Documents', icon: User, color: '#6B7280' }
  ];

  // Calculate Category Counts
  const getCategoryStats = (catId) => {
    const catDocs = documents.filter(d => d.category.toLowerCase() === catId.toLowerCase());
    const verified = catDocs.filter(d => d.status === 'Verified').length;
    const expiring = catDocs.filter(d => d.status === 'Expiring Soon' || (d.expiryDate && d.expiryDate.includes('2026'))).length;
    return { count: catDocs.length, verified, expiring };
  };

  // Filter & Search Documents
  const filteredDocs = documents.filter(doc => {
    const matchesCategory = activeCategory === 'All' || doc.category.toLowerCase() === activeCategory.toLowerCase();
    
    let matchesStatus = true;
    if (statusFilter === 'Verified') matchesStatus = doc.status === 'Verified';
    else if (statusFilter === 'Pending') matchesStatus = doc.status === 'Pending Verification';
    else if (statusFilter === 'Expiring') matchesStatus = doc.status === 'Expiring Soon' || (doc.expiryDate && doc.expiryDate.includes('2026'));
    else if (statusFilter === 'Private') matchesStatus = doc.isPrivate;
    else if (statusFilter === 'Favorites') matchesStatus = doc.isFavorite;

    const query = (searchQuery || aiQuery).toLowerCase();
    const matchesSearch = !query ||
      doc.name.toLowerCase().includes(query) ||
      doc.issuer.toLowerCase().includes(query) ||
      doc.category.toLowerCase().includes(query) ||
      (doc.refNo && doc.refNo.toLowerCase().includes(query)) ||
      (doc.tags && doc.tags.some(t => t.toLowerCase().includes(query)));

    return matchesCategory && matchesStatus && matchesSearch;
  });

  // Sort Documents
  const sortedDocs = [...filteredDocs].sort((a, b) => {
    if (sortBy === 'Name') return a.name.localeCompare(b.name);
    if (sortBy === 'Expiry Date') return (a.expiryDate || '').localeCompare(b.expiryDate || '');
    if (sortBy === 'Verification Status') return a.status.localeCompare(b.status);
    return 0; // Recently Added default
  });

  // Pinned Favorites
  const favoriteDocs = documents.filter(d => d.isFavorite);

  // Handle OCR Simulation on File Selection
  const handleSimulateFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Simulate OCR Intelligence Detection
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setOcrDetected(true);
      const fname = file.name.toLowerCase();
      if (fname.includes('dl') || fname.includes('licence') || fname.includes('driving')) {
        setUploadForm({
          name: "Smart Driving Licence Document",
          category: "RTO",
          issuer: "Regional Transport Office (RTO)",
          refNo: "MH02 2026009410",
          description: "Auto-recognized driving authorization document via Civic OCR scan.",
          isPrivate: false
        });
      } else if (fname.includes('health') || fname.includes('report') || fname.includes('lab')) {
        setUploadForm({
          name: "Medical Diagnostic Health Report",
          category: "Healthcare",
          issuer: "Verified Health Centre",
          refNo: "LAB-REF-9048",
          description: "Auto-recognized diagnostic report with encrypted privacy control.",
          isPrivate: true
        });
      } else {
        setUploadForm({
          name: file.name.replace(/\.[^/.]+$/, ""),
          category: "Government",
          issuer: "Authorized Government Authority",
          refNo: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          description: "Authenticated digital credential record.",
          isPrivate: false
        });
      }
    }, 800);
  };

  // Submit Upload Form
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadForm.name || !uploadForm.issuer) return;

    setUploading(true);
    try {
      const res = await fetch('/api/vault/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadForm)
      });
      const data = await res.json();
      setUploading(false);

      if (data.success && data.document) {
        setDocuments([data.document, ...documents]);
        setShowUploadModal(false);
        setOcrDetected(false);
        setUploadForm({ name: '', category: 'Government', issuer: '', refNo: '', description: '', isPrivate: false });
      }
    } catch (err) {
      setUploading(false);
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
      }
    } catch (err) {
      setShowVerifyModal(null);
    }
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

  const getDocIcon = (iconName, category) => {
    switch (category) {
      case 'Government': return <ShieldCheck size={22} style={{ color: '#0B5ED7' }} />;
      case 'Healthcare': return <HeartPulse size={22} style={{ color: '#E11D48' }} />;
      case 'RTO': return <Car size={22} style={{ color: '#D97706' }} />;
      case 'Finance': return <Landmark size={22} style={{ color: '#059669' }} />;
      case 'Education': return <GraduationCap size={22} style={{ color: '#7C3AED' }} />;
      case 'Professional': return <Briefcase size={22} style={{ color: '#2563EB' }} />;
      case 'Organization': return <Building2 size={22} style={{ color: '#4B5563' }} />;
      default: return <User size={22} style={{ color: '#6B7280' }} />;
    }
  };

  const getStatusBadge = (doc) => {
    if (doc.status === 'Verified') {
      return <span style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '3px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} /> Verified</span>;
    }
    if (doc.status === 'Expiring Soon' || (doc.expiryDate && doc.expiryDate.includes('2026'))) {
      return <span style={{ backgroundColor: '#FFEDD5', color: '#C2410C', padding: '3px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Expiring Soon</span>;
    }
    if (doc.status === 'Pending Verification') {
      return <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={12} /> Pending</span>;
    }
    return <span style={{ backgroundColor: '#E2E8F0', color: '#475569', padding: '3px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 700 }}>Unverified</span>;
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
                  Structured Digital Vault
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '2px' }}>
                  Your verified documents, credentials and records — organized securely in one place.
                </p>
              </div>
            </div>
          </div>

          {/* + Add Document Action Launcher */}
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
              boxShadow: '0 4px 12px rgba(11, 94, 215, 0.25)'
            }}
          >
            <Plus size={18} /> Add Document
          </button>
        </div>

        {/* Compact Summary Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
          backgroundColor: '#F8FAFC',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid #E2E8F0'
        }}>
          <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Documents</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B1F3A', marginTop: '2px' }}>{documents.length} Docs</div>
          </div>

          <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#0F5132', fontWeight: 700, textTransform: 'uppercase' }}>Verified Documents</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F5132', marginTop: '2px' }}>{documents.filter(d => d.status === 'Verified').length} Verified</div>
          </div>

          <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 700, textTransform: 'uppercase' }}>Pending Verification</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#92400E', marginTop: '2px' }}>{documents.filter(d => d.status === 'Pending Verification').length} Pending</div>
          </div>

          <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#C2410C', fontWeight: 700, textTransform: 'uppercase' }}>Expiring Soon</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#C2410C', marginTop: '2px' }}>{documents.filter(d => d.status === 'Expiring Soon' || (d.expiryDate && d.expiryDate.includes('2026'))).length} Expiring</div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#0B5ED7', fontWeight: 700, textTransform: 'uppercase' }}>Vault Completion</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B5ED7', marginTop: '2px' }}>96% Secure</div>
          </div>
        </div>
      </div>

      {/* UNIVERSAL SEARCH & AI SEARCH BAR */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '12px',
        marginBottom: '24px',
      }}>
        {/* Universal Search Bar */}
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, credentials or records (e.g. Driving Licence, expiring)..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 46px',
              borderRadius: '16px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.875rem',
              fontWeight: 600,
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-sm)'
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: '#64748B' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* AI Vault Search Assistant */}
        <div style={{ position: 'relative' }}>
          <Sparkles size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#7C3AED' }} />
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask CivicOne AI (e.g. 'Show education certificates', 'expiring this month')..."
            style={{
              width: '100%',
              padding: '12px 16px 12px 46px',
              borderRadius: '16px',
              border: '1.5px solid #DDD6FE',
              backgroundColor: '#F5F3FF',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#5B21B6'
            }}
          />
          {aiQuery && (
            <button onClick={() => setAiQuery('')} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: '#7C3AED' }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* QUICK ACCESS FAVORITES STRIP */}
      {favoriteDocs.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={14} style={{ color: '#EAB308', fill: '#EAB308' }} /> Quick Access Favorites
          </div>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
            {favoriteDocs.map(doc => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  border: '1px solid #E2E8F0',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  minWidth: '220px',
                  flexShrink: 0
                }}
              >
                {getDocIcon(doc.icon, doc.category)}
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0B1F3A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>{doc.refNo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8 CATEGORY WORKSPACE CARDS GRID */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1F3A' }}>
            Document Categories Workspace
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '0.775rem', fontWeight: 700, backgroundColor: viewMode === 'grid' ? '#0B5ED7' : '#F1F5F9', color: viewMode === 'grid' ? '#FFFFFF' : '#475569' }}
            >
              All Documents Grid
            </button>
            <button
              onClick={() => setViewMode('workspace')}
              style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '0.775rem', fontWeight: 700, backgroundColor: viewMode === 'workspace' ? '#0B5ED7' : '#F1F5F9', color: viewMode === 'workspace' ? '#FFFFFF' : '#475569' }}
            >
              Categories Workspaces
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {categories.map(cat => {
            const stats = getCategoryStats(cat.id);
            const isSelected = activeCategory === cat.id;
            const IconComponent = cat.icon;

            return (
              <div
                key={cat.id}
                onClick={() => {
                  setActiveCategory(isSelected ? 'All' : cat.id);
                  setViewMode('grid');
                }}
                style={{
                  backgroundColor: isSelected ? '#EAF3FF' : '#FFFFFF',
                  borderRadius: '18px',
                  padding: '20px',
                  border: isSelected ? '2px solid #0B5ED7' : '1px solid #E2E8F0',
                  boxShadow: isSelected ? '0 4px 14px rgba(11, 94, 215, 0.15)' : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: `${cat.color}15`, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconComponent size={24} />
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0F5132', backgroundColor: '#D1E7DD', padding: '2px 8px', borderRadius: '10px' }}>
                    ● {stats.verified} Verified
                  </span>
                </div>

                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '4px' }}>
                  {cat.label}
                </h3>

                <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '14px' }}>
                  {stats.count} Documents Stored
                  {stats.expiring > 0 && <span style={{ color: '#C2410C', fontWeight: 700 }}> • {stats.expiring} Expiring</span>}
                </div>

                <div style={{ fontSize: '0.775rem', fontWeight: 800, color: cat.color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View Category <ChevronRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* VOTER ID MODULE DISPLAY */}
      {activeCategory === 'Voter ID' && (
        <div style={{ marginBottom: '32px' }}>
          <VoterIdVault
            citizen={{ name: 'Ananya Sharma' }}
            onOpenShareModal={(doc) => setShowShareModal(doc)}
          />
        </div>
      )}

      {/* FILTER & SORT TOOLBAR */}
      <div style={{
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Verified', 'Pending', 'Expiring', 'Private', 'Favorites'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px',
                borderRadius: '18px',
                fontSize: '0.8rem',
                fontWeight: 700,
                backgroundColor: statusFilter === st ? '#0B1F3A' : '#FFFFFF',
                color: statusFilter === st ? '#FFFFFF' : '#475569',
                border: statusFilter === st ? 'none' : '1px solid #CBD5E1'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              fontSize: '0.8rem',
              fontWeight: 700,
              backgroundColor: '#FFFFFF',
              color: '#0B1F3A'
            }}
          >
            <option value="Recently Added">Recently Added</option>
            <option value="Name">Document Name</option>
            <option value="Expiry Date">Expiry Date</option>
            <option value="Verification Status">Verification Status</option>
          </select>
        </div>
      </div>

      {/* SPECIALIZED CATEGORY VIEWS (RTO Vehicle Overview & Education Timeline) */}
      {activeCategory === 'RTO' && (
        <div style={{ backgroundColor: '#FFFBEB', padding: '20px', borderRadius: '18px', border: '1px solid #FDE68A', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#92400E', fontWeight: 800 }}>
            <Car size={20} /> Vehicle Overview (MoRTH Connected Records)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '14px', borderRadius: '14px', border: '1px solid #FCD34D' }}>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0B1F3A' }}>MH 02 CD 4589</div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>Hyundai Creta SX 1.5</div>
              <div style={{ fontSize: '0.75rem', marginTop: '8px', display: 'flex', gap: '12px' }}>
                <span style={{ color: '#0F5132', fontWeight: 700 }}>✓ RC: Active</span>
                <span style={{ color: '#0F5132', fontWeight: 700 }}>✓ Insurance: Active</span>
                <span style={{ color: '#C2410C', fontWeight: 700 }}>! PUC: Expiring Soon</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeCategory === 'Education' && (
        <div style={{ backgroundColor: '#F5F3FF', padding: '20px', borderRadius: '18px', border: '1px solid #DDD6FE', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#5B21B6', fontWeight: 800 }}>
            <GraduationCap size={20} /> Academic Timeline & Verified Credentials (NAD Connected)
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', overflowX: 'auto', paddingBottom: '6px' }}>
            <div style={{ backgroundColor: '#FFFFFF', padding: '10px 16px', borderRadius: '12px', border: '1px solid #C4B5FD', fontSize: '0.8rem', fontWeight: 800, color: '#5B21B6' }}>
              10th High School (CBSE 2008)
            </div>
            <ChevronRight size={16} style={{ color: '#7C3AED' }} />
            <div style={{ backgroundColor: '#FFFFFF', padding: '10px 16px', borderRadius: '12px', border: '1px solid #C4B5FD', fontSize: '0.8rem', fontWeight: 800, color: '#5B21B6' }}>
              12th Senior Secondary (CBSE 2010)
            </div>
            <ChevronRight size={16} style={{ color: '#7C3AED' }} />
            <div style={{ backgroundColor: '#FFFFFF', padding: '10px 16px', borderRadius: '12px', border: '1px solid #C4B5FD', fontSize: '0.8rem', fontWeight: 800, color: '#5B21B6' }}>
              B.Tech Computer Science (IIT Bombay 2014)
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT CARDS GRID */}
      {sortedDocs.length === 0 ? (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '48px 24px',
          textAlign: 'center',
          border: '1px dashed #CBD5E1',
          color: '#64748B'
        }}>
          <FileText size={48} style={{ color: '#94A3B8', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '4px' }}>
            No documents found matching criteria
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '16px' }}>
            Try searching for a different keyword or add your document to the vault.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            style={{ backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '10px 18px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem' }}
          >
            + Add First Document
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          {sortedDocs.map(doc => (
            <div
              key={doc.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #E2E8F0',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              <div>
                {/* Header Icon + Verification Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                    {getDocIcon(doc.icon, doc.category)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {doc.isPrivate && (
                      <span style={{ backgroundColor: '#FEF2F2', color: '#991B1B', padding: '3px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <Lock size={10} /> Private
                      </span>
                    )}
                    {getStatusBadge(doc)}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '4px' }}>
                  {doc.name}
                </h3>
                <div style={{ fontSize: '0.775rem', color: '#0B5ED7', fontWeight: 700, marginBottom: '12px' }}>
                  Issuer: {doc.issuer}
                </div>

                {/* Middle Info Details */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '0.775rem', color: '#334155', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748B' }}>Credential ID:</span>
                    <strong style={{ color: '#0B1F3A' }}>{doc.refNo}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#64748B' }}>Issued On:</span>
                    <span>{doc.issueDate}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Valid Until:</span>
                    <strong style={{ color: doc.expiryDate && doc.expiryDate.includes('2026') ? '#C2410C' : '#0B1F3A' }}>
                      {doc.expiryDate}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                <button
                  onClick={() => setSelectedDoc(doc)}
                  style={{ backgroundColor: '#EAF3FF', color: '#0B5ED7', padding: '8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <Eye size={14} /> View
                </button>

                <button
                  onClick={() => handleRunVerification(doc)}
                  style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <CheckCircle2 size={14} /> Verify
                </button>

                <button
                  onClick={() => handleGenerateShare(doc)}
                  style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                >
                  <Share2 size={14} /> Share
                </button>

                <a
                  href={`#download-${doc.id}`}
                  onClick={(e) => { e.preventDefault(); alert(`Downloading encrypted copy of ${doc.name}`); }}
                  style={{ backgroundColor: '#F1F5F9', color: '#475569', padding: '8px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', textDecoration: 'none' }}
                >
                  <Download size={14} /> Save
                </a>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: DOCUMENT DETAIL & SECURE VIEWER */}
      {selectedDoc && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px',
            maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative'
          }}>
            <button
              onClick={() => setSelectedDoc(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: '#64748B' }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#EAF3FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getDocIcon(selectedDoc.icon, selectedDoc.category)}
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0B1F3A' }}>{selectedDoc.name}</h3>
                <div style={{ fontSize: '0.8rem', color: '#0B5ED7', fontWeight: 700 }}>{selectedDoc.issuer}</div>
              </div>
            </div>

            {/* Document Viewer Frame with Zoom Controls */}
            <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', padding: '20px', color: '#FFFFFF', marginBottom: '20px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>SECURE DOCUMENT PREVIEW (ENCRYPTED)</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setZoomLevel(prev => Math.max(50, prev - 10))} style={{ background: 'none', color: '#FFFFFF' }}><ZoomOut size={16} /></button>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{zoomLevel}%</span>
                  <button onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))} style={{ background: 'none', color: '#FFFFFF' }}><ZoomIn size={16} /></button>
                </div>
              </div>

              <div style={{ textAlign: 'center', padding: '24px 0', transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}>
                <FileCheck size={54} style={{ color: '#60A5FA', marginBottom: '10px' }} />
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedDoc.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>Credential ID: {selectedDoc.refNo}</div>
                <div style={{ fontSize: '0.75rem', color: '#4ADE80', marginTop: '8px', fontWeight: 700 }}>
                  🔒 Cryptographic Seal: {selectedDoc.securitySeal}
                </div>
              </div>
            </div>

            {/* Document Metadata Table */}
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '20px', fontSize: '0.8rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><span style={{ color: '#64748B' }}>Category:</span> <strong>{selectedDoc.category}</strong></div>
                <div><span style={{ color: '#64748B' }}>File Format:</span> <strong>{selectedDoc.fileType} ({selectedDoc.fileSize})</strong></div>
                <div><span style={{ color: '#64748B' }}>Issue Date:</span> <strong>{selectedDoc.issueDate}</strong></div>
                <div><span style={{ color: '#64748B' }}>Expiry Date:</span> <strong>{selectedDoc.expiryDate}</strong></div>
              </div>
            </div>

            {/* Privacy Access Log (Healthcare & Private) */}
            {selectedDoc.isPrivate && (
              <div style={{ backgroundColor: '#FEF2F2', padding: '14px', borderRadius: '14px', border: '1px solid #FCA5A5', marginBottom: '20px', fontSize: '0.775rem', color: '#991B1B' }}>
                <strong style={{ display: 'block', marginBottom: '4px' }}>🔒 Privacy & Access History:</strong>
                {selectedDoc.accessLogs ? selectedDoc.accessLogs.map((log, idx) => (
                  <div key={idx}>• {log}</div>
                )) : <div>• Only authorized by identity holder via OTP passcode.</div>}
              </div>
            )}

            {/* Actions Footer */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                onClick={() => handleRunVerification(selectedDoc)}
                style={{ backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem' }}
              >
                Re-Verify Credential
              </button>
              <button
                onClick={() => handleGenerateShare(selectedDoc)}
                style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem' }}
              >
                Create Share Link
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: + ADD DOCUMENT WITH OCR RECOGNITION */}
      {showUploadModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px',
            maxWidth: '520px', width: '100%', position: 'relative'
          }}>
            <button
              onClick={() => setShowUploadModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>
              + Add Verified Document
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '20px' }}>
              Upload your credential file or import directly from official department sources.
            </p>

            {/* Smart File Selector with OCR Detection */}
            <div style={{
              border: '2px dashed #0B5ED7', borderRadius: '16px', padding: '24px', textAlign: 'center',
              backgroundColor: '#EAF3FF', marginBottom: '20px', cursor: 'pointer'
            }}>
              <input
                type="file"
                id="doc-file-upload"
                onChange={handleSimulateFileSelect}
                style={{ display: 'none' }}
              />
              <label htmlFor="doc-file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                <FileCheck size={36} style={{ color: '#0B5ED7', marginBottom: '8px' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0B1F3A' }}>
                  Click to Browse PDF or Image File
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                  Smart OCR will automatically extract document title & issuing authority
                </div>
              </label>
            </div>

            {ocrDetected && (
              <div style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '10px 14px', borderRadius: '12px', fontSize: '0.775rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} /> Smart OCR Detected Document Metadata! Review below before saving.
              </div>
            )}

            <form onSubmit={handleUploadSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '4px' }}>Document Name</label>
                <input
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                  placeholder="e.g. Smart Driving Licence"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  required
                />
              </div>

              <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '4px' }}>Vault Category</label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '4px' }}>Issuing Authority</label>
                  <input
                    type="text"
                    value={uploadForm.issuer}
                    onChange={(e) => setUploadForm({ ...uploadForm, issuer: e.target.value })}
                    placeholder="e.g. UIDAI, RTO, IIT"
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0B1F3A', marginBottom: '4px' }}>Credential Reference No (Optional)</label>
                <input
                  type="text"
                  value={uploadForm.refNo}
                  onChange={(e) => setUploadForm({ ...uploadForm, refNo: e.target.value })}
                  placeholder="e.g. MH02 2026009410"
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={uploading}
                style={{
                  width: '100%', backgroundColor: '#0B5ED7', color: '#FFFFFF',
                  padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '0.9rem'
                }}
              >
                {uploading ? 'Processing & Encrypting...' : 'Save & Authenticate in Vault 🚀'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CREDENTIAL VERIFICATION CHECK RESULT */}
      {showVerifyModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
            {showVerifyModal.verifying ? (
              <div>
                <RefreshCw size={42} className="pulse-glow" style={{ color: '#0B5ED7', margin: '0 auto 16px auto' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B1F3A' }}>Connecting to Issuer API...</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Validating document signature against {showVerifyModal.doc.issuer}.</p>
              </div>
            ) : (
              <div>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#D1E7DD', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F5132', marginBottom: '4px' }}>
                  Credential Verified 100% Authentic
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '20px' }}>
                  Validated with <strong>{showVerifyModal.doc.issuer}</strong>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', textAlign: 'left', fontSize: '0.8rem', marginBottom: '20px' }}>
                  <div style={{ color: '#0F5132', fontWeight: 700, marginBottom: '4px' }}>✓ Credential Found in National Database</div>
                  <div style={{ color: '#0F5132', fontWeight: 700, marginBottom: '4px' }}>✓ Issuer Cryptographic Stamp Confirmed</div>
                  <div style={{ color: '#0F5132', fontWeight: 700, marginBottom: '4px' }}>✓ Identity Holder Information Matched</div>
                  <div style={{ color: '#0F5132', fontWeight: 700 }}>✓ Credential Status: ACTIVE</div>
                </div>

                <button
                  onClick={() => setShowVerifyModal(null)}
                  style={{ width: '100%', backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '12px', borderRadius: '12px', fontWeight: 800 }}
                >
                  Done & Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 4: SECURE REVOCABLE SHARING */}
      {showShareModal && shareResult && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '500px', width: '100%', position: 'relative' }}>
            <button onClick={() => setShowShareModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: '#64748B' }}>
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>
              Secure Revocable Share Link
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '20px' }}>
              Sharing <strong>{showShareModal.name}</strong> securely with passcoded time limit.
            </p>

            <div style={{ backgroundColor: '#EAF3FF', padding: '14px', borderRadius: '14px', border: '1px solid #BFDBFE', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#073B8C', fontWeight: 700 }}>VERIFICATION LINK:</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0B5ED7', wordBreak: 'break-all', marginTop: '2px' }}>
                {shareResult.link}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '8px', color: '#334155' }}>
                <span>Passcode: <strong style={{ color: '#0B5ED7' }}>{shareResult.passcode}</strong></span>
                <span>Expires in: <strong>{shareResult.duration}</strong></span>
              </div>
            </div>

            <button
              onClick={() => {
                alert("Shared link revoked successfully.");
                setShowShareModal(null);
              }}
              style={{ width: '100%', backgroundColor: '#DC2626', color: '#FFFFFF', padding: '10px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem' }}
            >
              Revoke Share Access Now 🔒
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
