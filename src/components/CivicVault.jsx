// src/components/CivicVault.jsx - Next-Generation Structured Digital Document Vault with Expiry Engine & Dates

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, HeartPulse, Car, GraduationCap, Briefcase, Building2, User, Landmark,
  FileText, Search, Plus, Download, Share2, Eye, CheckCircle2, Clock, AlertCircle, X,
  Lock, Sparkles, Star, ChevronRight, Activity, Filter, RefreshCw, ZoomIn, ZoomOut, Maximize2, FileCheck, ArrowUpRight, AlertTriangle
} from 'lucide-react';
import VoterIdVault from './VoterIdVault.jsx';
import { DEMO_DOCUMENTS, calculateDocExpiryStatus } from '../data/mockData.js';

export default function CivicVault({ documents: initialDocs, onRefreshDocs }) {
  const [documents, setDocuments] = useState(initialDocs && initialDocs.length > 0 ? initialDocs : DEMO_DOCUMENTS);
  const [summary, setSummary] = useState({
    totalDocuments: 12,
    verifiedDocuments: 11,
    pendingVerification: 1,
    expiringSoon: 2,
    expiredCount: 1,
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
  const [showAuditModal, setShowAuditModal] = useState(null);
  const [shareDuration, setShareDuration] = useState('1 hour');
  const [shareResult, setShareResult] = useState(null);

  // Upload Form State with OCR simulation
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'Government',
    issuer: '',
    refNo: '',
    issueDate: new Date().toLocaleDateString('en-GB'),
    expiryDate: '10-09-2028',
    description: '',
    isPrivate: false
  });
  const [ocrDetected, setOcrDetected] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Viewer State inside Modal
  const [zoomLevel, setZoomLevel] = useState(100);

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
    const catDocs = documents.filter(d => d.category.toLowerCase().includes(catId.toLowerCase()) || (catId === 'RTO & Vehicles' && (d.category === 'RTO' || d.category === 'RTO & Vehicles')));
    const verified = catDocs.filter(d => d.status === 'Verified').length;
    const expiring = catDocs.filter(d => {
      const exp = calculateDocExpiryStatus(d);
      return exp.status === 'EXPIRING SOON' || exp.status === 'EXPIRED';
    }).length;
    return { count: catDocs.length, verified, expiring };
  };

  // Filter & Search Documents
  const filteredDocs = documents.filter(doc => {
    const matchesCategory = activeCategory === 'All' ||
      doc.category.toLowerCase().includes(activeCategory.toLowerCase()) ||
      (activeCategory === 'RTO & Vehicles' && (doc.category === 'RTO' || doc.category === 'RTO & Vehicles'));
    
    const expInfo = calculateDocExpiryStatus(doc);
    let matchesStatus = true;
    if (statusFilter === 'Verified') matchesStatus = doc.status === 'Verified';
    else if (statusFilter === 'Pending') matchesStatus = doc.status === 'Pending Verification' || doc.status === 'PENDING';
    else if (statusFilter === 'Expiring') matchesStatus = expInfo.status === 'EXPIRING SOON';
    else if (statusFilter === 'Expired') matchesStatus = expInfo.status === 'EXPIRED';
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

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setOcrDetected(true);
      const fname = file.name.toLowerCase();
      if (fname.includes('dl') || fname.includes('licence') || fname.includes('driving')) {
        setUploadForm({
          name: "Smart Driving Licence Document",
          category: "RTO & Vehicles",
          issuer: "Regional Transport Office (RTO)",
          refNo: "MH02 2026009410",
          issueDate: "12-01-2024",
          expiryDate: "10-09-2028",
          description: "Auto-recognized driving authorization document via Civic OCR scan.",
          isPrivate: false
        });
      } else {
        setUploadForm({
          name: file.name.replace(/\.[^/.]+$/, ""),
          category: "Government",
          issuer: "Authorized Government Authority",
          refNo: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
          issueDate: new Date().toLocaleDateString('en-GB'),
          expiryDate: "14-08-2030",
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
        setUploadForm({ name: '', category: 'Government', issuer: '', refNo: '', issueDate: '', expiryDate: '', description: '', isPrivate: false });
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
      case 'RTO':
      case 'RTO & Vehicles': return <Car size={22} style={{ color: '#D97706' }} />;
      case 'Finance': return <Landmark size={22} style={{ color: '#059669' }} />;
      case 'Education': return <GraduationCap size={22} style={{ color: '#7C3AED' }} />;
      case 'Professional': return <Briefcase size={22} style={{ color: '#2563EB' }} />;
      case 'Organization': return <Building2 size={22} style={{ color: '#4B5563' }} />;
      default: return <User size={22} style={{ color: '#6B7280' }} />;
    }
  };

  // Requirement 19: Automatic Document Status Engine Badge
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

    if (doc.status === 'Pending Verification' || doc.status === 'PENDING') {
      return (
        <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={12} /> Pending
        </span>
      );
    }

    return (
      <span style={{ backgroundColor: '#E2E8F0', color: '#475569', padding: '3px 10px', borderRadius: '12px', fontSize: '0.725rem', fontWeight: 700 }}>
        NO EXPIRY
      </span>
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
                  Structured Digital Vault
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#475569', marginTop: '2px' }}>
                  Your verified documents, credentials and records — organized with issue &amp; expiry tracking.
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
            <span style={{ fontSize: '0.75rem', color: '#0F5132', fontWeight: 700, textTransform: 'uppercase' }}>Verified Active</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0F5132', marginTop: '2px' }}>
              {documents.filter(d => calculateDocExpiryStatus(d).status === 'ACTIVE' || calculateDocExpiryStatus(d).status === 'NO EXPIRY').length} Active
            </div>
          </div>

          <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#C2410C', fontWeight: 700, textTransform: 'uppercase' }}>Expiring Soon</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#C2410C', marginTop: '2px' }}>
              {documents.filter(d => calculateDocExpiryStatus(d).status === 'EXPIRING SOON').length} Expiring
            </div>
          </div>

          <div style={{ borderRight: '1px solid #E2E8F0', paddingRight: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: '#991B1B', fontWeight: 700, textTransform: 'uppercase' }}>Expired</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#991B1B', marginTop: '2px' }}>
              {documents.filter(d => calculateDocExpiryStatus(d).status === 'EXPIRED').length} Expired
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: '#0B5ED7', fontWeight: 700, textTransform: 'uppercase' }}>Vault Health</span>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B5ED7', marginTop: '2px' }}>100% Verified</div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, credentials or records (e.g. Driving Licence, expiring)..."
            style={{ width: '100%', padding: '12px 16px 12px 46px', borderRadius: '16px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 600, backgroundColor: '#FFFFFF' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: '#64748B' }}>
              <X size={16} />
            </button>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <Sparkles size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#7C3AED' }} />
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder="Ask CivicOne AI (e.g. 'Show education certificates', 'expiring this month')..."
            style={{ width: '100%', padding: '12px 16px 12px 46px', borderRadius: '16px', border: '1.5px solid #DDD6FE', backgroundColor: '#F5F3FF', fontSize: '0.875rem', fontWeight: 600, color: '#5B21B6' }}
          />
          {aiQuery && (
            <button onClick={() => setAiQuery('')} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', color: '#7C3AED' }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* FILTER & SORT TOOLBAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['All', 'Verified', 'Pending', 'Expiring', 'Expired', 'Private', 'Favorites'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '6px 14px', borderRadius: '18px', fontSize: '0.8rem', fontWeight: 700,
                backgroundColor: statusFilter === st ? '#0B1F3A' : '#FFFFFF',
                color: statusFilter === st ? '#FFFFFF' : '#475569',
                border: statusFilter === st ? 'none' : '1px solid #CBD5E1'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '0.8rem', fontWeight: 700, backgroundColor: '#FFFFFF', color: '#0B1F3A' }}
          >
            <option value="Recently Added">Recently Added</option>
            <option value="Name">Document Name</option>
            <option value="Expiry Date">Expiry Date</option>
            <option value="Verification Status">Verification Status</option>
          </select>
        </div>
      </div>

      {/* REQUIREMENT 20: DOCUMENT CARDS GRID WITH ISSUE & EXPIRY DATES */}
      {sortedDocs.length === 0 ? (
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '48px 24px', textAlign: 'center', border: '1px dashed #CBD5E1', color: '#64748B' }}>
          <FileText size={48} style={{ color: '#94A3B8', marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '4px' }}>
            No documents found matching criteria
          </h3>
          <button onClick={() => setShowUploadModal(true)} style={{ backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '10px 18px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', marginTop: '12px' }}>
            + Add First Document
          </button>
        </div>
      ) : (
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
                  justify: 'space-between',
                  opacity: isExpired ? 0.95 : 1
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0' }}>
                      {getDocIcon(doc.icon, doc.category)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {doc.isPrivate && (
                        <span style={{ backgroundColor: '#FEF2F2', color: '#991B1B', padding: '3px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800 }}>
                          <Lock size={10} /> Private
                        </span>
                      )}
                      {getStatusBadge(doc)}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>
                    {doc.name}
                  </h3>
                  <div style={{ fontSize: '0.775rem', color: '#0B5ED7', fontWeight: 700, marginBottom: '12px' }}>
                    Issuer: {doc.issuer}
                  </div>

                  {/* Middle Info Details: Credential ID, Issue Date, Expiry Date, Last Verified, Access Status */}
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

                {/* Requirement 20 Action Buttons: View, Verify, Share, Access History */}
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

      {/* MODAL: DOCUMENT DETAIL & VIEWER */}
      {selectedDoc && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 31, 58, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
            <button onClick={() => setSelectedDoc(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: '#64748B', border: 'none', cursor: 'pointer' }}>
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

            <div style={{ backgroundColor: '#1E293B', borderRadius: '16px', padding: '20px', color: '#FFFFFF', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <FileCheck size={54} style={{ color: '#60A5FA', marginBottom: '10px' }} />
                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedDoc.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '4px' }}>Credential ID: {selectedDoc.refNo}</div>
                <div style={{ fontSize: '0.8rem', color: '#FEF08A', marginTop: '6px' }}>
                  Issue Date: <strong>{selectedDoc.issueDate || '15-01-2024'}</strong> | Expiry Date: <strong>{selectedDoc.expiryDate || 'N/A'}</strong>
                </div>
              </div>
            </div>

            <button onClick={() => setSelectedDoc(null)} style={{ width: '100%', backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '12px', borderRadius: '12px', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
              Close Viewer
            </button>
          </div>
        </div>
      )}

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
                <strong>CivicOne Demo College</strong> (Academic Admission Check)<br />
                <span style={{ color: '#64748B' }}>14 Aug 2026, 08:30 AM — Status: AUTHORIZED VIEW</span>
              </div>
              <div style={{ padding: '10px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <strong>Parivahan E-Governance Portal</strong> (Credential Verification Sync)<br />
                <span style={{ color: '#64748B' }}>10 Aug 2026, 11:20 AM — Status: VERIFIED</span>
              </div>
            </div>
            <button onClick={() => setShowAuditModal(null)} style={{ width: '100%', backgroundColor: '#F1F5F9', color: '#475569', padding: '10px', borderRadius: '10px', fontWeight: 800, marginTop: '20px', border: 'none', cursor: 'pointer' }}>
              Close History
            </button>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL WITH ISSUE & EXPIRY DATES */}
      {showUploadModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(11, 31, 58, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px', maxWidth: '580px', width: '100%', position: 'relative' }}>
            <button onClick={() => setShowUploadModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', color: '#64748B', border: 'none', cursor: 'pointer' }}>
              <X size={22} />
            </button>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '16px' }}>
              Add Document to Vault
            </h3>
            <form onSubmit={handleUploadSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Document Name</label>
                <input type="text" value={uploadForm.name} onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Issuing Authority</label>
                <input type="text" value={uploadForm.issuer} onChange={(e) => setUploadForm({ ...uploadForm, issuer: e.target.value })} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Issue Date</label>
                  <input type="text" value={uploadForm.issueDate} onChange={(e) => setUploadForm({ ...uploadForm, issueDate: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Expiry Date</label>
                  <input type="text" value={uploadForm.expiryDate} onChange={(e) => setUploadForm({ ...uploadForm, expiryDate: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }} />
                </div>
              </div>
              <button type="submit" style={{ width: '100%', backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '12px', borderRadius: '10px', fontWeight: 800, border: 'none', cursor: 'pointer' }}>
                Save Document to Vault 🚀
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
