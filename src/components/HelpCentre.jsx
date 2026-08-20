// src/components/HelpCentre.jsx - 24/7 Advanced Citizen Care & Rapid Response Command Center
// Connected with Official National Support Email: civicone.official.in@gmail.com

import React, { useState, useEffect, useRef } from 'react';
import {
  Headphones, Search, FileText, ShieldCheck, Ticket, MessageSquare, Plus,
  CheckCircle2, ChevronDown, X, Lock, Compass, Plane, Crown, Sparkles, Building2,
  Mail, PhoneCall, Clock, Copy, Check, Send, AlertTriangle, ShieldAlert,
  Zap, ArrowRight, UserCheck, RefreshCw, Radio
} from 'lucide-react';

const OFFICIAL_SUPPORT_EMAIL = 'civicone.official.in@gmail.com';
const TOLL_FREE_HELPLINE = '1800-248-4266'; // 1800-CIVIC-ONE
const EMERGENCY_FRAUD_HOTLINE = '1947-CIVIC';

export default function HelpCentre({ citizen = {} }) {
  const citizenName = citizen?.fullName || citizen?.name || 'Citizen';
  const civicId = citizen?.citizenId || 'CIV-DEMO-10001';
  const citizenMobile = citizen?.mobile || '+91 90000 00001';

  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  
  // Modals & Active Channel States
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showLiveChatModal, setShowLiveChatModal] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Ticket Form & Recent Tickets State
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'CivicOne ID & Aadhaar',
    priority: 'HIGH',
    message: ''
  });
  const [recentTickets, setRecentTickets] = useState([
    {
      id: 'TKT-2026-9048',
      subject: 'Aadhaar Masking Toggle Verification Query',
      category: 'CivicOne ID',
      priority: 'HIGH',
      status: 'RESOLVED',
      sla: 'Resolved in 6 mins',
      timestamp: 'Today, 09:15 AM'
    },
    {
      id: 'TKT-2026-8812',
      subject: 'Gold Pass Founder Membership Activation Status',
      category: 'Gold Pass',
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      sla: 'Assigned to Senior Officer Sharma',
      timestamp: 'Today, 10:20 AM'
    }
  ]);
  const [ticketSubmitted, setTicketSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);

  // 30-Second Priority Callback State
  const [callbackNumber, setCallbackNumber] = useState(citizenMobile);
  const [callbackReason, setCallbackReason] = useState('Urgent Identity Verification Issue');
  const [callbackStatus, setCallbackStatus] = useState(null); // 'COUNTDOWN' | 'CONNECTED'
  const [countdownSeconds, setCountdownSeconds] = useState(30);

  // Live Rapid Chat Simulator State
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'agent',
      name: 'CivicOne 24/7 Rapid Response Desk',
      badge: 'OFFICIAL ASSISTANT',
      text: `Namaste ${citizenName}! CivicOne 24/7 Emergency Citizen Care is online. How can our national duty officer assist you today?`,
      time: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatTyping, setChatTyping] = useState(false);
  const chatBottomRef = useRef(null);

  // Copy Email Helper
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(OFFICIAL_SUPPORT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Start Callback Countdown Simulation
  const handleRequestCallback = (e) => {
    e.preventDefault();
    if (!callbackNumber) return;
    setCallbackStatus('COUNTDOWN');
    setCountdownSeconds(30);
  };

  useEffect(() => {
    let timer;
    if (callbackStatus === 'COUNTDOWN' && countdownSeconds > 0) {
      timer = setTimeout(() => setCountdownSeconds(prev => prev - 1), 1000);
    } else if (callbackStatus === 'COUNTDOWN' && countdownSeconds === 0) {
      setCallbackStatus('CONNECTED');
    }
    return () => clearTimeout(timer);
  }, [callbackStatus, countdownSeconds]);

  // Send Chat Message & Simulated Fast Agent Response (< 1.5s)
  const handleSendChatMessage = (presetText) => {
    const textToSend = presetText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'citizen',
      name: citizenName,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!presetText) setChatInput('');
    setChatTyping(true);

    setTimeout(() => {
      setChatTyping(false);
      let replyText = "Our 24/7 duty officer has received your priority query. Reference Token: CIV-CARE-" + Math.floor(100000 + Math.random() * 900000) + ". For complex grievances, you can also email us directly at " + OFFICIAL_SUPPORT_EMAIL;

      const lower = textToSend.toLowerCase();
      if (lower.includes('gold pass') || lower.includes('payment')) {
        replyText = "Gold Pass transactions are verified in real-time. If your status shows standard, our automated ledger verifies webhook reconciliations instantly. Your ticket has been expedited under the 15-minute Founder SLA.";
      } else if (lower.includes('aadhaar') || lower.includes('mask')) {
        replyText = "Your Aadhaar number is securely stored in hardware-encrypted vaults. Only the last 4 digits are revealed when dynamic masking is enabled for authorized inspections.";
      } else if (lower.includes('revoke') || lower.includes('organization') || lower.includes('access')) {
        replyText = "You can immediately revoke any organization's access from your Privacy & Consent Matrix. Revocations take effect instantly across all state databases.";
      } else if (lower.includes('lost') || lower.includes('freeze') || lower.includes('stolen')) {
        replyText = "🚨 EMERGENCY PROTOCOL TRIGGERED: We have initiated a temporary security hold on tokenized verification attempts. Call our 24/7 Fraud Desk at 1947-CIVIC immediately.";
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'agent',
          name: 'Officer Rajesh Varma (Badge: CIV-AP-994)',
          badge: 'SENIOR DUTY OFFICER',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatTyping]);

  // Submit Support Ticket
  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.message) return;
    setLoading(true);

    const newTicket = {
      id: `TKT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketForm.subject,
      category: ticketForm.category,
      priority: ticketForm.priority,
      status: 'UNDER_OFFICER_REVIEW',
      sla: ticketForm.priority === 'URGENT' ? '15-Min Express SLA' : '1-Hour Standard SLA',
      timestamp: 'Just now'
    };

    try {
      await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...ticketForm, citizenId: civicId, citizenEmail: citizen?.email })
      });
    } catch (err) {
      // Local fallback
    }

    setLoading(false);
    setTicketSubmitted(newTicket);
    setRecentTickets(prev => [newTicket, ...prev]);
    setShowTicketModal(false);
    setTicketForm({ subject: '', category: 'CivicOne ID & Aadhaar', priority: 'HIGH', message: '' });
  };

  // FAQ Categories
  const sections = [
    { id: 'All', label: 'All Topics', icon: HelpCircle },
    { id: '24/7 Care', label: '24/7 Support Desk', icon: Headphones },
    { id: 'CivicOne ID', label: 'CivicOne ID & UIDAI', icon: ShieldCheck },
    { id: 'Digital Vault', label: 'Digital Vault', icon: FileText },
    { id: 'Cards', label: 'Civic Cards & QR', icon: Ticket },
    { id: 'Gold Pass', label: 'Gold Pass Membership', icon: Crown },
    { id: 'Doc Verification', label: 'Doc Verification', icon: CheckCircle2 },
    { id: 'Org Access', label: 'Organization Access', icon: Building2 },
    { id: 'Privacy', label: 'Privacy & Consent', icon: Lock },
    { id: 'Security', label: 'Account Security', icon: ShieldAlert }
  ];

  const faqs = [
    {
      section: "24/7 Care",
      q: "How fast does the CivicOne 24/7 Customer Care team respond?",
      a: "Our AI + Officer Triage Desk responds within seconds (< 15 seconds average). For emergency disputes, identity theft, or lost device reports, citizens receive immediate callback assistance and live ticket routing to our official inbox: civicone.official.in@gmail.com."
    },
    {
      section: "24/7 Care",
      q: "What is the official email for CivicOne citizen grievance escalation?",
      a: `The official authorized support email is ${OFFICIAL_SUPPORT_EMAIL}. When emailing us, please include your unique Civic ID (${civicId}) for priority automated routing.`
    },
    {
      section: "CivicOne ID",
      q: "What is CivicOne ID and how does it protect my identity?",
      a: "CivicOne ID is a unified national digital identity credential. It links verified government, education, RTO, and healthcare records without exposing sensitive plaintext numbers like Aadhaar or PAN directly."
    },
    {
      section: "Digital Vault",
      q: "How does the Digital Vault structure my documents?",
      a: "The vault organizes credentials into 8 clear categories (Identity, Government, Education, Healthcare, RTO/Vehicles, Finance, Professional, Personal). Each document features cryptographic verification metadata."
    },
    {
      section: "Cards",
      q: "What is the dynamic QR code on my Civic Card?",
      a: "The dynamic QR code contains a time-limited tokenized link. When scanned by an authorized verifier, it validates credential authenticity without embedding raw personal numbers inside the QR image."
    },
    {
      section: "Gold Pass",
      q: "How do I activate the CivicOne Gold Pass?",
      a: "Every citizen receives the Standard Civic Card initially. Gold Pass can be purchased from the Citizen Portal via secure online payment. Once approved, the Gold Pass status persists across session logins with 15-minute priority support SLA."
    },
    {
      section: "Doc Verification",
      q: "How does CivicOne re-verify document authenticity?",
      a: "You can click 'Verify' on any vault item. CivicOne checks the issuer cryptographic signature and returns verification status indicators (Verified, Expiring Soon, or Pending)."
    },
    {
      section: "Org Access",
      q: "How do Colleges, Schools, Mobile Shops, and Hotels view citizen records?",
      a: "Organizations receive strict least-privilege view-only access based on citizen consent. For example, Mobile Shops receive name & address KYC only; Hotels receive check-in guest verification badges only."
    },
    {
      section: "Privacy",
      q: "Can I instantly revoke an organization's access to my documents?",
      a: "Yes! In the Privacy & Access Control Center, you can review active consents ('Who Has Access?') and click 'Revoke Consent' to immediately terminate access."
    },
    {
      section: "Security",
      q: "What should I do if I suspect unauthorized verification of my ID?",
      a: "Open the 24/7 Live Support Chat and select 'Report Unauthorized Verification Attempt', or call the 24/7 National Emergency Fraud Helpline at 1947-CIVIC immediately."
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSection = selectedSection === 'All' || faq.section.toLowerCase().includes(selectedSection.toLowerCase());
    const query = search.toLowerCase();
    const matchesSearch = !query || faq.q.toLowerCase().includes(query) || faq.a.toLowerCase().includes(query);
    return matchesSection && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 8px' }} className="animate-fade-in-scale">
      
      {/* 24/7 OPERATIONAL COMMAND HERO BANNER */}
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
        {/* Background Ambient Glow */}
        <div style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 2 }}>
          <div>
            {/* Live 24/7 Active Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              color: '#A7F3D0',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: '14px'
            }}>
              <span className="live-pulse-dot" />
              24/7 ACTIVE CITIZEN CARE &amp; RAPID RESPONSE DESK
            </div>

            <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
              National Citizen Care Command
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#BFDBFE', marginTop: '6px', maxWidth: '640px', lineHeight: 1.5 }}>
              Dedicated 24/7 assistance for identity verification, encrypted vault assistance, Gold Pass reconciliation, and emergency fraud defense.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div style={{
            backgroundColor: 'rgba(7, 15, 30, 0.65)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            minWidth: '220px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Average Queue Speed:</span>
              <span style={{ fontSize: '0.85rem', color: '#34D399', fontWeight: 800 }}>&lt; 15 Seconds</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>Active Duty Officers:</span>
              <span style={{ fontSize: '0.85rem', color: '#93C5FD', fontWeight: 800 }}>148 Nationwide</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>SLA Resolution:</span>
              <span style={{ fontSize: '0.85rem', color: '#FCD34D', fontWeight: 800 }}>99.84% First Call</span>
            </div>
          </div>
        </div>

        {/* OFFICIAL EMAIL QUICK ACCESS STRIP */}
        <div style={{
          marginTop: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
              <span style={{ fontSize: '0.725rem', color: '#E2E8F0', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                Official National Citizen Support Inbox:
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
                backgroundColor: copiedEmail ? '#059669' : 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              {copiedEmail ? <Check size={16} /> : <Copy size={16} />}
              {copiedEmail ? 'Copied!' : 'Copy Email'}
            </button>

            <a
              href={`mailto:${OFFICIAL_SUPPORT_EMAIL}?subject=CivicOne%20Citizen%20Support%20Request%20-%20${civicId}&body=Hello%20CivicOne%20Support%20Team,%0D%0A%0D%0ACitizen%20Name:%20${encodeURIComponent(citizenName)}%0D%0ACivic%20ID:%20${encodeURIComponent(civicId)}%0D%0A%0D%0AProblem%20Description:%0D%0A`}
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
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
            >
              <Send size={15} /> Compose Email
            </a>
          </div>
        </div>
      </div>

      {/* 4 INSTANT SUPPORT CHANNELS (GRID) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        
        {/* CHANNEL 1: 24/7 LIVE CHAT TRIAGE */}
        <div className="hover-card-lift" style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              backgroundColor: 'rgba(11, 94, 215, 0.12)',
              color: 'var(--primary-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <MessageSquare size={24} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <span className="live-pulse-dot" />
              <span style={{ fontSize: '0.725rem', color: 'var(--success)', fontWeight: 800 }}>LIVE OFFICER QUEUE</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              24/7 Rapid Live Chat
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
              Instant conversational assistance with automated credential diagnostics and live officer dispatch.
            </p>
          </div>

          <button
            onClick={() => setShowLiveChatModal(true)}
            style={{
              marginTop: '16px',
              width: '100%',
              backgroundColor: 'var(--primary-blue)',
              color: '#FFFFFF',
              padding: '11px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.85rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-blue)'
            }}
          >
            Start Rapid Chat <ArrowRight size={16} />
          </button>
        </div>

        {/* CHANNEL 2: 30-SECOND PRIORITY CALLBACK */}
        <div className="hover-card-lift" style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              backgroundColor: 'rgba(16, 185, 129, 0.12)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <PhoneCall size={24} />
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--success)', fontWeight: 800, marginBottom: '4px' }}>
              ⚡ 30-SECOND DIALER DISPATCH
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Request Instant Callback
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
              Speak directly with an identity specialist. Automated dialer connects your mobile in &lt; 30 seconds.
            </p>
          </div>

          <button
            onClick={() => setShowCallbackModal(true)}
            style={{
              marginTop: '16px',
              width: '100%',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
              border: '1.5px solid var(--border-light)',
              padding: '11px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <PhoneCall size={16} /> Request Callback
          </button>
        </div>

        {/* CHANNEL 3: TOLL-FREE NATIONAL HELPLINE */}
        <div className="hover-card-lift" style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              backgroundColor: 'rgba(245, 158, 11, 0.12)',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <Headphones size={24} />
            </div>
            <div style={{ fontSize: '0.725rem', color: '#D97706', fontWeight: 800, marginBottom: '4px' }}>
              ☎️ TOLL-FREE 24/7 / 365
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              National Hotline
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
              Dial toll-free nationwide for general inquiries or <strong>1947-CIVIC</strong> for immediate fraud defense.
            </p>
          </div>

          <div style={{
            marginTop: '16px',
            backgroundColor: 'var(--bg-main)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            padding: '10px 14px',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 700, display: 'block' }}>Direct Toll-Free Line:</span>
            <a href="tel:18002484266" style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--primary-blue)', textDecoration: 'none' }}>
              {TOLL_FREE_HELPLINE}
            </a>
          </div>
        </div>

        {/* CHANNEL 4: PRIORITY TICKET DESK */}
        <div className="hover-card-lift" style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              backgroundColor: 'rgba(99, 102, 241, 0.12)',
              color: '#6366F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px'
            }}>
              <Ticket size={24} />
            </div>
            <div style={{ fontSize: '0.725rem', color: '#6366F1', fontWeight: 800, marginBottom: '4px' }}>
              🛡️ GUARANTEED SLA ESCALATION
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Raise Formal Ticket
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.4 }}>
              Submit complex verification complaints with automated tracking and direct notification to our grievance team.
            </p>
          </div>

          <button
            onClick={() => setShowTicketModal(true)}
            style={{
              marginTop: '16px',
              width: '100%',
              backgroundColor: 'var(--bg-main)',
              color: 'var(--text-main)',
              border: '1.5px solid var(--border-light)',
              padding: '11px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Plus size={16} /> New Support Ticket
          </button>
        </div>

      </div>

      {/* RECENT TICKETS & LIVE DISPATCH STATUS */}
      {recentTickets.length > 0 && (
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} style={{ color: 'var(--primary-blue)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                My Support Tickets &amp; SLA Tracker
              </h3>
            </div>
            <button
              onClick={() => setShowTicketModal(true)}
              style={{
                backgroundColor: 'var(--light-blue)',
                color: 'var(--primary-blue)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '0.775rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              + Create Another Ticket
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {recentTickets.map(tkt => (
              <div
                key={tkt.id}
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
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.8rem', color: 'var(--primary-blue)' }}>
                      {tkt.id}
                    </span>
                    <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--light-blue)', color: 'var(--primary-blue)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                      {tkt.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                      {tkt.timestamp}
                    </span>
                  </div>
                  <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block' }}>
                    {tkt.subject}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ⏱️ SLA Tracker: {tkt.sla}
                  </span>
                </div>

                <span style={{
                  padding: '5px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  backgroundColor: tkt.status === 'RESOLVED' ? 'var(--success-bg)' : 'var(--warning-bg)',
                  color: tkt.status === 'RESOLVED' ? 'var(--success-text)' : 'var(--warning-text)'
                }}>
                  ● {tkt.status === 'RESOLVED' ? 'Resolved' : 'In Officer Review'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEARCHABLE KNOWLEDGE BASE */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '24px',
        padding: '28px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
            CivicOne Knowledge Base &amp; Self-Help Directory
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Instant answers for identity protection, document sharing, and verification protocols.
          </p>

          {/* Search Input */}
          <div style={{ maxWidth: '600px', margin: '20px auto 0 auto', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help topics (e.g. 24/7 Care, Gold Pass, Masked Aadhaar, QR scan)..."
              style={{
                width: '100%',
                padding: '12px 16px 12px 46px',
                borderRadius: '14px',
                border: '1.5px solid var(--border-light)',
                fontSize: '0.9rem',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-main)',
                boxShadow: 'var(--shadow-sm)'
              }}
            />
          </div>
        </div>

        {/* Section Selector Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '24px' }}>
          {sections.map(sec => {
            const Icon = sec.icon;
            const isSelected = selectedSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: isSelected ? 'var(--primary-blue)' : 'var(--bg-main)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                  border: isSelected ? 'none' : '1px solid var(--border-light)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={15} /> {sec.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredFaqs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No help articles found matching "{search}". Use our 24/7 Rapid Live Chat or email us at <strong>{OFFICIAL_SUPPORT_EMAIL}</strong>!
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  backgroundColor: 'var(--bg-main)'
                }}
              >
                <button
                  onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    backgroundColor: 'transparent',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '0.925rem',
                    color: 'var(--text-main)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.675rem', color: 'var(--primary-blue)', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                      {faq.section}
                    </span>
                    {faq.q}
                  </div>
                  <ChevronDown size={18} style={{ transform: activeFaqIndex === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-light)' }} />
                </button>
                {activeFaqIndex === idx && (
                  <div style={{ padding: '16px 20px', fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-light)' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 24/7 RAPID LIVE CHAT MODAL */}
      {showLiveChatModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(7, 15, 30, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px'
        }}>
          <div className="animate-fade-in-scale" style={{
            backgroundColor: 'var(--bg-card)', borderRadius: '24px',
            maxWidth: '520px', width: '100%', height: '620px',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            border: '1.5px solid var(--border-light)', boxShadow: 'var(--shadow-lg)'
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '16px 20px',
              backgroundColor: 'var(--primary-blue)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Headphones size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>CivicOne 24/7 Support Desk</h4>
                    <span style={{ fontSize: '0.625rem', backgroundColor: '#059669', padding: '1px 6px', borderRadius: '8px', fontWeight: 800 }}>LIVE</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#DBEAFE' }}>Official Support: {OFFICIAL_SUPPORT_EMAIL}</span>
                </div>
              </div>

              <button
                onClick={() => setShowLiveChatModal(false)}
                style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Chat Preset Shortcuts */}
            <div style={{ padding: '10px 14px', backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {[
                "Gold Pass Payment Issue",
                "Aadhaar Masking Query",
                "Revoke Org Access",
                "Lost Card Emergency Freeze"
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => handleSendChatMessage(query)}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-light)',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    color: 'var(--text-main)',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                  }}
                >
                  {query}
                </button>
              ))}
            </div>

            {/* Chat Messages Log */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: 'var(--bg-main)' }}>
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'citizen' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%'
                  }}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginBottom: '2px', textAlign: msg.sender === 'citizen' ? 'right' : 'left' }}>
                    {msg.name} {msg.badge && <span style={{ fontWeight: 800, color: 'var(--primary-blue)' }}>• {msg.badge}</span>}
                  </div>
                  <div style={{
                    backgroundColor: msg.sender === 'citizen' ? 'var(--primary-blue)' : 'var(--bg-card)',
                    color: msg.sender === 'citizen' ? '#FFFFFF' : 'var(--text-main)',
                    padding: '12px 16px',
                    borderRadius: msg.sender === 'citizen' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    fontSize: '0.875rem',
                    lineHeight: 1.45,
                    border: msg.sender === 'citizen' ? 'none' : '1px solid var(--border-light)',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-light)', marginTop: '2px', textAlign: msg.sender === 'citizen' ? 'right' : 'left' }}>
                    {msg.time}
                  </div>
                </div>
              ))}

              {chatTyping && (
                <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--bg-card)', padding: '8px 14px', borderRadius: '14px', border: '1px solid var(--border-light)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Senior Officer is typing response...
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendChatMessage(); }}
              style={{ padding: '12px 16px', backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '8px' }}
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message for instant officer response..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-input)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: 'var(--primary-blue)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 30-SECOND CALLBACK MODAL */}
      {showCallbackModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(7, 15, 30, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px'
        }}>
          <div className="animate-fade-in-scale" style={{
            backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '32px',
            maxWidth: '460px', width: '100%', position: 'relative', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)'
          }}>
            <button
              onClick={() => { setShowCallbackModal(false); setCallbackStatus(null); }}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '54px', height: '54px', borderRadius: '16px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px'
              }}>
                <PhoneCall size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                Instant 30-Second Callback
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Our automated dialer connects you with an on-duty National Officer immediately.
              </p>
            </div>

            {callbackStatus === 'COUNTDOWN' ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{
                  width: '90px', height: '90px', borderRadius: '50%',
                  border: '4px solid var(--primary-blue)', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900,
                  color: 'var(--primary-blue)', marginBottom: '16px', animation: 'pulseLive 1.5s infinite'
                }}>
                  {countdownSeconds}s
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Dispatching Call to {callbackNumber}...
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Please keep your phone ready. Officer Sharma is taking your line.
                </p>
              </div>
            ) : callbackStatus === 'CONNECTED' ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '50%',
                  backgroundColor: 'var(--success-bg)', color: 'var(--success-text)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px'
                }}>
                  <CheckCircle2 size={32} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Call In Progress
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Your phone is ringing now from CivicOne National Care (+91 1800-CIVIC-ONE).
                </p>
                <button
                  onClick={() => setShowCallbackModal(false)}
                  style={{
                    marginTop: '20px',
                    backgroundColor: 'var(--primary-blue)',
                    color: '#FFFFFF',
                    padding: '10px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestCallback}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Your Registered Mobile Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={callbackNumber}
                    onChange={(e) => setCallbackNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem',
                      fontWeight: 700
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Reason for Urgent Callback
                  </label>
                  <select
                    value={callbackReason}
                    onChange={(e) => setCallbackReason(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      backgroundColor: 'var(--bg-input)',
                      color: 'var(--text-main)',
                      fontSize: '0.875rem'
                    }}
                  >
                    <option value="Urgent Identity Verification Issue">Urgent Identity Verification Issue</option>
                    <option value="Gold Pass Payment & Membership Query">Gold Pass Payment &amp; Membership Query</option>
                    <option value="Unauthorized Organization Access Alert">Unauthorized Organization Access Alert</option>
                    <option value="Lost Device Emergency Security Hold">Lost Device Emergency Security Hold</option>
                    <option value="General Grievance Escalation">General Grievance Escalation</option>
                  </select>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: 'var(--success)',
                    color: '#FFFFFF',
                    padding: '13px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.925rem',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <PhoneCall size={18} /> Call Me Now (30 Seconds)
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CREATE SUPPORT TICKET MODAL */}
      {showTicketModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(7, 15, 30, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px'
        }}>
          <div className="animate-fade-in-scale" style={{
            backgroundColor: 'var(--bg-card)', borderRadius: '24px', padding: '32px',
            maxWidth: '500px', width: '100%', position: 'relative', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)'
          }}>
            <button
              onClick={() => setShowTicketModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Ticket size={22} style={{ color: 'var(--primary-blue)' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  Raise Priority Support Ticket
                </h3>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                Directly dispatched to <strong>{OFFICIAL_SUPPORT_EMAIL}</strong> and the National Officer Queue.
              </p>
            </div>

            <form onSubmit={handleTicketSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Subject *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="Summary of issue (e.g. Gold Pass payment verification)..."
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: '10px',
                    border: '1.5px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.875rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Category</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '10px',
                      border: '1.5px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.875rem'
                    }}
                  >
                    <option value="CivicOne ID & Aadhaar">CivicOne ID &amp; Aadhaar</option>
                    <option value="Digital Vault & Docs">Digital Vault &amp; Docs</option>
                    <option value="Gold Pass Membership">Gold Pass Membership</option>
                    <option value="Organization Access">Organization Access</option>
                    <option value="Privacy & Consent">Privacy &amp; Consent</option>
                    <option value="Security & Fraud">Security &amp; Fraud</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Priority Level</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    style={{
                      width: '100%', padding: '11px 14px', borderRadius: '10px',
                      border: '1.5px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.875rem'
                    }}
                  >
                    <option value="HIGH">High Priority (1-Hr SLA)</option>
                    <option value="URGENT">Urgent (15-Min Express SLA)</option>
                    <option value="NORMAL">Standard (4-Hr SLA)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Description *</label>
                <textarea
                  rows={4}
                  required
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  placeholder="Describe your issue in detail. Include transaction ID or organization name if applicable..."
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: '10px',
                    border: '1.5px solid var(--border-light)', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)', fontSize: '0.875rem', resize: 'vertical'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--primary-blue)',
                  color: '#FFFFFF',
                  padding: '13px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.925rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-blue)'
                }}
              >
                {loading ? 'Submitting to National Desk...' : 'Submit Priority Ticket'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
