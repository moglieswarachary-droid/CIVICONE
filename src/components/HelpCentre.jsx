// src/components/HelpCentre.jsx - CivicOne Customer Care Support Center
// Official Support Channel: civicone.official.in@gmail.com

import React, { useState, useEffect, useRef } from 'react';
import {
  Headphones, Search, FileText, ShieldCheck, Ticket, MessageSquare, Plus,
  CheckCircle2, ChevronDown, X, Lock, Compass, Building2, User,
  Mail, PhoneCall, Clock, Copy, Check, Send, AlertTriangle, ShieldAlert,
  Zap, ArrowRight, UserCheck, RefreshCw, Radio, HelpCircle, Upload,
  Layers, AlertCircle, FileCheck, ExternalLink
} from 'lucide-react';

const OFFICIAL_SUPPORT_EMAIL = 'civicone.official.in@gmail.com';
const TOLL_FREE_HELPLINE = '1800-248-4266';
const EMERGENCY_FRAUD_HOTLINE = '1947-CIVIC';

export default function HelpCentre({ citizen = {} }) {
  const citizenName = citizen?.fullName || citizen?.name || 'Citizen';
  const civicId = citizen?.citizenId || 'CIV-DEMO-10001';
  const citizenMobile = citizen?.mobile || '+91 90000 00001';
  const citizenEmail = citizen?.email || 'citizen.demo@civicone.gov.in';

  // Active View / Scroll target refs
  const formRef = useRef(null);
  const faqRef = useRef(null);
  const trackerRef = useRef(null);

  // Search & FAQ state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedRequestId, setCopiedRequestId] = useState(false);

  // Tracker State
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [trackingError, setTrackingError] = useState('');

  // Support Request Form State
  const [formData, setFormData] = useState({
    fullName: citizenName,
    mobileNumber: citizenMobile,
    emailAddress: citizenEmail,
    department: 'General Citizen Platform',
    category: 'Citizen Services',
    description: '',
    attachmentName: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);

  // List of Recent / Submitted Requests for Tracking
  const [requestsList, setRequestsList] = useState([
    {
      id: 'REQ-2026-90482',
      category: 'Documents & Verification',
      department: 'Digital Vault Attestation',
      subject: 'Aadhaar Masking & Vault Sync Verification',
      description: 'Requested verification check for demographic token sync.',
      status: 'RESOLVED',
      statusLabel: 'Resolved',
      sla: 'Completed in 12 mins',
      timestamp: 'Today, 09:15 AM'
    },
    {
      id: 'REQ-2026-88120',
      category: 'Applications',
      department: 'Civic Pass Department',
      subject: 'Gold Pass Founder Membership Activation Status',
      description: 'Inquiry regarding payment reconciliation and badge update.',
      status: 'IN_REVIEW',
      statusLabel: 'Under Officer Review',
      sla: 'Assigned to Senior Officer Sharma',
      timestamp: 'Today, 10:20 AM'
    }
  ]);

  // Copy Email Helper
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(OFFICIAL_SUPPORT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Scroll Helpers
  const scrollToForm = (prefillCategory = null) => {
    if (prefillCategory) {
      setFormData(prev => ({ ...prev, category: prefillCategory }));
    }
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToFaqs = () => {
    faqRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTracker = () => {
    trackerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Handle Form Submission
  const handleSubmitRequest = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `REQ-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newRequest = {
        id: generatedId,
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        emailAddress: formData.emailAddress,
        department: formData.department,
        category: formData.category,
        description: formData.description,
        attachmentName: formData.attachmentName,
        status: 'SUBMITTED',
        statusLabel: 'Submitted & Queued',
        sla: 'First Response in < 2 Hours',
        timestamp: 'Just now'
      };

      setSubmittedRequest(newRequest);
      setRequestsList(prev => [newRequest, ...prev]);
      setIsSubmitting(false);

      // Reset form description & attachment
      setFormData(prev => ({
        ...prev,
        description: '',
        attachmentName: ''
      }));
    }, 800);
  };

  // Handle Tracking Search
  const handleTrackSearch = (e) => {
    e.preventDefault();
    setTrackingError('');
    if (!searchTrackingId.trim()) {
      setTrackingResult(null);
      return;
    }

    const query = searchTrackingId.trim().toUpperCase();
    const found = requestsList.find(r => r.id.toUpperCase() === query);

    if (found) {
      setTrackingResult(found);
    } else {
      setTrackingResult(null);
      setTrackingError(`No active support request found matching ID: "${searchTrackingId}". Please verify your Support Request ID and try again.`);
    }
  };

  // 6 Support Domains Data
  const supportDomains = [
    {
      number: '1',
      title: 'General Support',
      description: 'Get help with CivicOne features, services, navigation, and general platform-related questions.',
      icon: HelpCircle,
      categoryPrefill: 'Other',
      tag: 'Platform & Guidance'
    },
    {
      number: '2',
      title: 'Account & Profile Support',
      description: 'Assistance with account registration, login problems, profile updates, mobile number or email updates, identity/profile-related issues, and account access problems.',
      icon: User,
      categoryPrefill: 'Account & Login',
      tag: 'Credentials & Access'
    },
    {
      number: '3',
      title: 'Citizen Service Support',
      description: 'Get assistance regarding CivicOne citizen services, applications, requests, submissions, and service status.',
      icon: Layers,
      categoryPrefill: 'Citizen Services',
      tag: 'Civic Services'
    },
    {
      number: '4',
      title: 'Complaint & Grievance Support',
      description: 'Report an issue, submit a complaint, or request assistance regarding a civic service or unresolved problem.',
      icon: AlertTriangle,
      categoryPrefill: 'Complaints & Grievances',
      tag: 'Grievance Redressal'
    },
    {
      number: '5',
      title: 'Application & Request Tracking',
      description: 'Need help checking the status of your submitted application or request? Use Customer Care to get guidance and track the appropriate service.',
      icon: Clock,
      categoryPrefill: 'Applications',
      tag: 'Status & Tracking'
    },
    {
      number: '6',
      title: 'Technical Support',
      description: 'Report website errors, broken features, loading problems, verification issues, or other technical difficulties.',
      icon: Zap,
      categoryPrefill: 'Technical Issues',
      tag: 'Bug Reports & Systems'
    }
  ];

  // Support Categories List
  const supportCategoriesList = [
    'Account & Login',
    'Citizen Services',
    'Applications',
    'Complaints & Grievances',
    'Payments',
    'Documents & Verification',
    'Technical Issues',
    'Other'
  ];

  // Department Dropdown Options
  const departmentOptions = [
    'General Citizen Platform',
    'Identity & UIDAI / Aadhaar',
    'Transport & Parivahan RTO',
    'National Health Authority (ABHA)',
    'Education & Degree Vault',
    'Police Verification & PCC',
    'Municipal & Urban Governance',
    'Civic Pass & Founder Payments',
    'Other Department'
  ];

  // FAQs Data
  const faqData = [
    {
      category: 'General',
      q: 'How do I contact CivicOne Customer Care?',
      a: 'Use the Customer Care section to submit your support request with the required details, or reach our official support email directly at civicone.official.in@gmail.com. You can also dial our national toll-free helpline at 1800-248-4266.'
    },
    {
      category: 'Tracking',
      q: 'How can I track my complaint?',
      a: 'Use your Support Request ID to check the current status of your complaint or support request in the "Track My Request" section below.'
    },
    {
      category: 'General',
      q: 'What if my issue is not listed?',
      a: 'Select "Other" under Issue Category and clearly describe your issue. The support team will review and route it to the appropriate department.'
    },
    {
      category: 'Documents',
      q: 'Can I upload screenshots or supporting documents?',
      a: 'Yes. Upload relevant screenshots or documents (PDF, JPG, PNG up to 10MB) when submitting your request to help our team understand and resolve your issue faster.'
    },
    {
      category: 'Account',
      q: 'How do I resolve login or profile update issues?',
      a: 'Select "Account & Login" from the support form. For mobile or email updates, ensure your Aadhaar-linked registered mobile is active for verification OTPs.'
    },
    {
      category: 'Security',
      q: 'What should I do if I suspect unauthorized access or fraud?',
      a: 'Immediately submit a request under "Complaints & Grievances" or dial our 24/7 National Emergency Fraud Hotline at 1947-CIVIC to freeze compromised digital identity credentials.'
    }
  ];

  const filteredFaqs = faqData.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const query = search.toLowerCase();
    const matchesSearch = !query || item.q.toLowerCase().includes(query) || item.a.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 12px' }}>
      
      {/* 1. HERO HEADER: CivicOne Customer Care */}
      <div style={{
        background: 'linear-gradient(135deg, #071E3D 0%, #0B3C7B 50%, #0B5ED7 100%)',
        color: '#FFFFFF',
        borderRadius: '24px',
        padding: '32px 24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: '#FFFFFF',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '12px'
          }}>
            <Headphones size={16} />
            OFFICIAL CITIZEN SUPPORT DESK
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.3rem)', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
            CivicOne Customer Care
          </h1>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#93C5FD', marginTop: '6px', marginBottom: '8px' }}>
            We’re Here to Help You
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#E2E8F0', maxWidth: '780px', lineHeight: 1.55, margin: 0 }}>
            CivicOne Customer Care is your dedicated support center for assistance with CivicOne services, citizen services, account-related issues, applications, complaints, and general queries.
          </p>

          {/* Official Email Strip */}
          <div style={{
            marginTop: '20px',
            backgroundColor: 'rgba(7, 15, 30, 0.65)',
            backdropFilter: 'blur(8px)',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Mail size={20} style={{ color: '#FCD34D' }} />
              <div>
                <span style={{ fontSize: '0.725rem', color: '#CBD5E1', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                  Official Customer Care Email:
                </span>
                <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'monospace' }}>
                  {OFFICIAL_SUPPORT_EMAIL}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleCopyEmail}
                style={{
                  backgroundColor: copiedEmail ? '#059669' : 'rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
                {copiedEmail ? 'Copied!' : 'Copy Email'}
              </button>

              <a
                href={`mailto:${OFFICIAL_SUPPORT_EMAIL}?subject=CivicOne%20Citizen%20Support%20Request%20-%20${civicId}&body=Hello%20CivicOne%20Customer%20Care%20Team,%0D%0A%0D%0ACitizen%20Name:%20${encodeURIComponent(citizenName)}%0D%0ACivic%20ID:%20${encodeURIComponent(civicId)}%0D%0AMobile:%20${encodeURIComponent(citizenMobile)}%0D%0A%0D%0ADescription%20of%20the%20Issue:%0D%0A`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#073B8C',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none'
                }}
              >
                <Send size={15} /> Send Mail
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* 2. CUSTOMER CARE ACTIONS (4 Clear Action Buttons) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px',
        marginBottom: '28px'
      }}>
        
        <button
          onClick={() => scrollToForm()}
          style={{
            backgroundColor: 'var(--primary-blue)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '16px',
            padding: '16px 18px',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-sm)',
            textAlign: 'left'
          }}
        >
          <Plus size={20} />
          <span>Submit a Support Request</span>
        </button>

        <button
          onClick={scrollToTracker}
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1.5px solid var(--border-light)',
            borderRadius: '16px',
            padding: '16px 18px',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <Clock size={20} style={{ color: 'var(--primary-blue)' }} />
          <span>Track My Request</span>
        </button>

        <button
          onClick={scrollToFaqs}
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1.5px solid var(--border-light)',
            borderRadius: '16px',
            padding: '16px 18px',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <HelpCircle size={20} style={{ color: '#059669' }} />
          <span>View FAQs</span>
        </button>

        <button
          onClick={() => scrollToForm('Complaints & Grievances')}
          style={{
            backgroundColor: 'var(--bg-card)',
            color: '#DC2626',
            border: '1.5px solid rgba(220, 38, 38, 0.3)',
            borderRadius: '16px',
            padding: '16px 18px',
            fontSize: '0.9rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <AlertTriangle size={20} />
          <span>Report an Issue</span>
        </button>

      </div>

      {/* 3. IMPORTANT SECURITY NOTICE */}
      <div style={{
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        border: '1.5px solid rgba(239, 68, 68, 0.35)',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
        <ShieldAlert size={24} style={{ color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong style={{ fontSize: '0.95rem', color: '#DC2626', display: 'block', marginBottom: '2px' }}>
            Important Security Notice
          </strong>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
            For your security, never share passwords, OTPs, PINs, banking credentials, or other confidential authentication information with anyone through Customer Care.
          </span>
        </div>
      </div>

      {/* 4. HOW CAN WE HELP? (6 Support Domains) */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ marginBottom: '18px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            SUPPORT CAPABILITIES
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', margin: '4px 0 0 0' }}>
            How Can We Help?
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {supportDomains.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '18px',
                  padding: '22px',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--light-blue)',
                      color: 'var(--primary-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={22} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', backgroundColor: 'var(--bg-main)', padding: '3px 8px', borderRadius: '6px' }}>
                      Domain {item.number}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 8px 0' }}>
                    {item.number}. {item.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => scrollToForm(item.categoryPrefill)}
                  style={{
                    marginTop: '16px',
                    backgroundColor: 'var(--bg-main)',
                    color: 'var(--primary-blue)',
                    border: '1px solid var(--border-light)',
                    padding: '9px 14px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>Request {item.title}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. CONTACT CUSTOMER CARE — SUBMIT A SUPPORT REQUEST */}
      <div
        ref={formRef}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '30px 24px',
          border: '1.5px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '36px'
        }}
      >
        <div style={{ marginBottom: '22px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            DIRECT CITIZEN HELP DESK
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', margin: '4px 0 2px 0' }}>
            Submit a Support Request
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>
            Fill in the required information below to submit a formal request. You will receive an official <strong>Support Request ID</strong> for real-time tracking.
          </p>
        </div>

        {/* Success Confirmation Modal / Banner if just submitted */}
        {submittedRequest && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1.5px solid #10B981',
            borderRadius: '18px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={24} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', display: 'block' }}>
                    Support Request Submitted Successfully!
                  </strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px', display: 'block' }}>
                    Your request has been routed to our duty team. Please save your Support Request ID for reference:
                  </span>
                  
                  <div style={{
                    marginTop: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    padding: '8px 14px',
                    borderRadius: '10px'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 800 }}>REQUEST ID:</span>
                    <strong style={{ fontSize: '1.05rem', fontFamily: 'monospace', color: 'var(--primary-blue)' }}>
                      {submittedRequest.id}
                    </strong>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(submittedRequest.id);
                        setCopiedRequestId(true);
                        setTimeout(() => setCopiedRequestId(false), 2000);
                      }}
                      style={{
                        backgroundColor: copiedRequestId ? '#059669' : 'var(--light-blue)',
                        color: copiedRequestId ? '#FFFFFF' : 'var(--primary-blue)',
                        border: 'none',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copiedRequestId ? <Check size={13} /> : <Copy size={13} />}
                      {copiedRequestId ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSubmittedRequest(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Support Request Form */}
        <form onSubmit={handleSubmitRequest}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px',
            marginBottom: '18px'
          }}>
            
            {/* 1. Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Full Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* 2. Registered Mobile Number */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Registered Mobile Number <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                placeholder="+91 90000 00000"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* 3. Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Email Address <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="email"
                required
                value={formData.emailAddress}
                onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
                placeholder="citizen@example.com"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* 4. Service / Department */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Service / Department <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              >
                {departmentOptions.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* 5. Issue Category (Required 8 Categories) */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Issue Category <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  fontWeight: 700
                }}
              >
                {supportCategoriesList.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* 6. Description of the Issue */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Description of the Issue <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Please describe your issue, complaint, or inquiry in detail. Include any relevant reference IDs, timestamps, or application numbers."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* 7. Supporting Document or Screenshot (Optional) */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Supporting Document or Screenshot (Optional)
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                border: '1.5px dashed var(--border-light)',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-main)',
                flexWrap: 'wrap'
              }}>
                <Upload size={18} style={{ color: 'var(--primary-blue)' }} />
                <input
                  type="file"
                  id="care-file-upload"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({ ...formData, attachmentName: e.target.files[0].name });
                    }
                  }}
                />
                <label
                  htmlFor="care-file-upload"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    cursor: 'pointer'
                  }}
                >
                  Choose File
                </label>
                <span style={{ fontSize: '0.8rem', color: formData.attachmentName ? 'var(--primary-blue)' : 'var(--text-muted)' }}>
                  {formData.attachmentName ? `Attached: ${formData.attachmentName}` : 'Upload error screenshots, PDF receipt, or identity proofs (Max 10MB)'}
                </span>

                {formData.attachmentName && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attachmentName: '' })}
                    style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', marginLeft: 'auto' }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              backgroundColor: 'var(--primary-blue)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 28px',
              fontSize: '0.925rem',
              fontWeight: 800,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {isSubmitting ? <RefreshCw size={18} className="spin" /> : <Send size={18} />}
            <span>{isSubmitting ? 'Submitting Request...' : 'Submit Support Request'}</span>
          </button>
        </form>
      </div>

      {/* 6. TRACK MY REQUEST SECTION */}
      <div
        ref={trackerRef}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '28px 24px',
          border: '1.5px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '36px'
        }}
      >
        <div style={{ marginBottom: '18px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            STATUS VERIFICATION
          </span>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', margin: '4px 0 2px 0' }}>
            Track My Request
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Enter your <strong>Support Request ID</strong> to check the real-time progress of your complaint or grievance.
          </p>
        </div>

        {/* Tracking Search Input */}
        <form onSubmit={handleTrackSearch} style={{ display: 'flex', gap: '10px', maxWidth: '560px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              value={searchTrackingId}
              onChange={(e) => setSearchTrackingId(e.target.value)}
              placeholder="e.g. REQ-2026-90482"
              style={{
                width: '100%',
                padding: '11px 14px 11px 38px',
                borderRadius: '12px',
                border: '1.5px solid var(--border-light)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                fontFamily: 'monospace'
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: 'var(--primary-blue)',
              color: '#FFFFFF',
              border: 'none',
              padding: '0 20px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Track
          </button>
        </form>

        {trackingError && (
          <div style={{ padding: '12px 16px', backgroundColor: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '12px', color: '#DC2626', fontSize: '0.85rem', marginBottom: '16px' }}>
            {trackingError}
          </div>
        )}

        {/* Tracking Result Card */}
        {trackingResult && (
          <div style={{
            backgroundColor: 'var(--bg-main)',
            border: '1.5px solid var(--border-light)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
              <div>
                <span style={{ fontFamily: 'monospace', fontWeight: 900, color: 'var(--primary-blue)', fontSize: '1.05rem' }}>
                  {trackingResult.id}
                </span>
                <span style={{ marginLeft: '10px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', backgroundColor: 'var(--bg-card)', padding: '2px 8px', borderRadius: '6px' }}>
                  {trackingResult.category}
                </span>
              </div>

              <span style={{
                fontSize: '0.775rem',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: '12px',
                backgroundColor: trackingResult.status === 'RESOLVED' ? 'var(--success-bg)' : 'var(--warning-bg)',
                color: trackingResult.status === 'RESOLVED' ? 'var(--success-text)' : 'var(--warning-text)'
              }}>
                ● {trackingResult.statusLabel}
              </span>
            </div>

            <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
              {trackingResult.subject || trackingResult.description}
            </strong>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Department: {trackingResult.department} | Logged: {trackingResult.timestamp}
            </div>
            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--primary-blue)', fontWeight: 700 }}>
              SLA Status: {trackingResult.sla}
            </div>
          </div>
        )}

        {/* Existing Active Requests List */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>
            Your Recent Support Requests ({requestsList.length})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {requestsList.map(req => (
              <div
                key={req.id}
                style={{
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary-blue)' }}>
                      {req.id}
                    </span>
                    <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--light-blue)', color: 'var(--primary-blue)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      {req.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      {req.timestamp}
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>
                    {req.subject || req.description}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {req.sla}
                  </span>
                </div>

                <span style={{
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  backgroundColor: req.status === 'RESOLVED' ? 'var(--success-bg)' : 'var(--warning-bg)',
                  color: req.status === 'RESOLVED' ? 'var(--success-text)' : 'var(--warning-text)'
                }}>
                  ● {req.statusLabel}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <div
        ref={faqRef}
        style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '28px 24px',
          border: '1.5px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            HELP DIRECTORY
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', margin: '4px 0 2px 0' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
            Common questions regarding support requests, complaint tracking, and citizen service assistance.
          </p>

          {/* FAQ Search */}
          <div style={{ maxWidth: '540px', margin: '16px auto 0 auto', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions (e.g. tracking, upload, email)..."
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: '12px',
                border: '1.5px solid var(--border-light)',
                backgroundColor: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.875rem'
              }}
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredFaqs.map((faq, idx) => {
            const isOpen = activeFaqIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '14px',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '16px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--text-main)'
                  }}
                >
                  <strong style={{ fontSize: '0.925rem', fontWeight: 800 }}>{faq.q}</strong>
                  <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', color: 'var(--text-light)', flexShrink: 0 }} />
                </button>

                {isOpen && (
                  <div style={{ padding: '0 18px 16px 18px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.55, borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Need More Assistance Banner */}
        <div style={{
          marginTop: '24px',
          padding: '16px 20px',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-main)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>Still have questions?</strong>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Our customer care officers are ready to assist you.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => scrollToForm()}
              style={{
                backgroundColor: 'var(--primary-blue)',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Submit a Request
            </button>
            <a
              href={`mailto:${OFFICIAL_SUPPORT_EMAIL}`}
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-light)',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Mail size={14} /> Email Support
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
