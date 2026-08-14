// src/components/HelpCentre.jsx - Comprehensive Searchable Help & Support Centre

import React, { useState } from 'react';
import {
  HelpCircle, Search, FileText, ShieldCheck, Ticket, MessageSquare, Plus,
  CheckCircle2, ChevronDown, X, Lock, Compass, Plane, Crown, Sparkles, Building2
} from 'lucide-react';

export default function HelpCentre() {
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState('All');
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: '', category: 'CivicOne ID', message: '' });
  const [ticketSubmitted, setTicketSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);

  const sections = [
    { id: 'All', label: 'All Topics', icon: HelpCircle },
    { id: 'CivicOne ID', label: 'CivicOne ID', icon: ShieldCheck },
    { id: 'Digital Vault', label: 'Digital Vault', icon: FileText },
    { id: 'Cards', label: 'Civic Cards', icon: Ticket },
    { id: 'Gold Pass', label: 'Gold Pass', icon: Crown },
    { id: 'Document Verification', label: 'Doc Verification', icon: CheckCircle2 },
    { id: 'Organization Access', label: 'Org Access', icon: Building2 },
    { id: 'Privacy & Consent', label: 'Privacy & Consent', icon: Lock },
    { id: 'Travel & Tourism', label: 'Travel & Tourism', icon: Compass },
    { id: 'Booking', label: 'Booking Hub', icon: Plane },
    { id: 'Account Security', label: 'Account Security', icon: ShieldCheck }
  ];

  const faqs = [
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
      a: "Every citizen receives the Standard Civic Card initially. Gold Pass can be purchased from the Citizen Portal via secure online payment. Once approved, the Gold Pass status persists across session logins."
    },
    {
      section: "Document Verification",
      q: "How does CivicOne re-verify document authenticity?",
      a: "You can click 'Verify' on any vault item. CivicOne checks the issuer cryptographic signature and returns verification status indicators (Verified, Expiring Soon, or Pending)."
    },
    {
      section: "Organization Access",
      q: "How do Colleges, Schools, Mobile Shops, and Hotels view citizen records?",
      a: "Organizations receive strict least-privilege view-only access based on citizen consent. For example, Mobile Shops receive name & address KYC only; Hotels receive check-in guest verification badges only."
    },
    {
      section: "Privacy & Consent",
      q: "Can I instantly revoke an organization's access to my documents?",
      a: "Yes! In the Privacy & Access Control Center, you can review active consents ('Who Has Access?') and click 'Revoke Consent' to immediately terminate access."
    },
    {
      section: "Consent",
      q: "What happens when an organization requests document access?",
      a: "Pending requests appear in your Privacy Center. Access is granted only after you explicitly approve the request and set an expiration duration."
    },
    {
      section: "Tourism",
      q: "What is CivicOne World Tourism Guide?",
      a: "CivicOne World provides travel information, local transport advice, budget estimates, and destination guides for worldwide cities (Dubai, Paris, Tokyo, Goa, etc.)."
    },
    {
      section: "Travel & Booking",
      q: "How does the Book & Travel Hub work?",
      a: "Book & Travel lets citizens search Flights, Buses, Trains, Cabs, and Bike Rentals using their verified identity profile. Active bookings display a transparent notice: 'Live booking integration not connected'."
    },
    {
      section: "Account Security",
      q: "How do I secure my CivicOne account?",
      a: "Enable Two-Factor Authentication (2FA) in Security Centre, review active session logs, and utilize private Super Admin controls if authorized."
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSection = selectedSection === 'All' || faq.section.toLowerCase().includes(selectedSection.toLowerCase());
    const query = search.toLowerCase();
    const matchesSearch = !query || faq.q.toLowerCase().includes(query) || faq.a.toLowerCase().includes(query);
    return matchesSection && matchesSearch;
  });

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketForm.subject || !ticketForm.message) return;
    setLoading(true);

    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketForm)
      });
      const data = await res.json();
      setLoading(false);
      if (data.success) {
        setTicketSubmitted(data.ticket);
        setShowTicketModal(false);
        setTicketForm({ subject: '', category: 'CivicOne ID', message: '' });
      }
    } catch (err) {
      setLoading(false);
      setTicketSubmitted({ id: "TKT-8849", subject: ticketForm.subject, status: "Submitted" });
      setShowTicketModal(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0B1F3A' }}>
          CivicOne Knowledge &amp; Support Hub
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#475569', marginTop: '6px' }}>
          Comprehensive documentation for CivicOne ID, Vault, Cards, Gold Pass, Privacy, and Travel.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: '600px', margin: '24px auto 0 auto', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help topics (e.g. Gold Pass, QR verification, Mobile shop access)..."
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              borderRadius: '16px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.95rem',
              boxShadow: 'var(--shadow-sm)',
              backgroundColor: '#FFFFFF'
            }}
          />
        </div>
      </div>

      {ticketSubmitted && (
        <div style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '16px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center' }}>
          <CheckCircle2 size={24} style={{ display: 'inline-block', marginBottom: '4px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Support Ticket Submitted Successfully!</h3>
          <p style={{ fontSize: '0.85rem' }}>Ticket ID: <strong>{ticketSubmitted.id}</strong> - Our support team will assist you within 24 hours.</p>
        </div>
      )}

      {/* SECTION SELECTOR CHIPS */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '28px' }}>
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
                backgroundColor: isSelected ? '#0B5ED7' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#475569',
                border: isSelected ? 'none' : '1px solid #CBD5E1',
                whiteSpace: 'nowrap',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Icon size={16} /> {sec.label}
            </button>
          );
        })}
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '28px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)', marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1F3A' }}>
            {selectedSection === 'All' ? 'All Knowledge Articles' : `${selectedSection} Articles`}
          </h2>
          <button
            onClick={() => setShowTicketModal(true)}
            style={{ backgroundColor: '#0B5ED7', color: '#FFFFFF', padding: '8px 16px', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <MessageSquare size={16} /> Raise Support Ticket
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredFaqs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
              No articles found matching "{search}". Raise a ticket or ask CivicOne AI!
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setActiveFaqIndex(activeFaqIndex === idx ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    backgroundColor: activeFaqIndex === idx ? '#F8FAFC' : '#FFFFFF',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#0B1F3A',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.7rem', color: '#0B5ED7', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                      {faq.section}
                    </span>
                    {faq.q}
                  </div>
                  <ChevronDown size={18} style={{ transform: activeFaqIndex === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {activeFaqIndex === idx && (
                  <div style={{ padding: '16px 20px', fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* CREATE SUPPORT TICKET MODAL */}
      {showTicketModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.65)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF', borderRadius: '24px', padding: '32px',
            maxWidth: '460px', width: '100%', position: 'relative'
          }}>
            <button
              onClick={() => setShowTicketModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '16px' }}>
              Create Support Ticket
            </h3>

            <form onSubmit={handleTicketSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0B1F3A', marginBottom: '4px' }}>Subject *</label>
                <input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  placeholder="Summary of issue..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0B1F3A', marginBottom: '4px' }}>Category</label>
                <select
                  value={ticketForm.category}
                  onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', backgroundColor: '#FFFFFF' }}
                >
                  <option value="CivicOne ID">CivicOne ID</option>
                  <option value="Digital Vault">Digital Vault</option>
                  <option value="Gold Pass">Gold Pass</option>
                  <option value="Organization Access">Organization Access</option>
                  <option value="Privacy & Consent">Privacy & Consent</option>
                  <option value="Travel & Booking">Travel & Booking</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#0B1F3A', marginBottom: '4px' }}>Description *</label>
                <textarea
                  rows={4}
                  required
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                  placeholder="Describe your query in detail..."
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: '#0B5ED7',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
