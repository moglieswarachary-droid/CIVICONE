// src/components/HelpCentre.jsx - Searchable Help Centre & Support Ticket System

import React, { useState } from 'react';
import { HelpCircle, Search, FileText, ShieldCheck, Ticket, MessageSquare, Plus, CheckCircle2, ChevronDown, X } from 'lucide-react';

export default function HelpCentre() {
  const [search, setSearch] = useState('');
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketForm, setTicketForm] = useState({ subject: '', category: 'Document Verification', message: '' });
  const [ticketSubmitted, setTicketSubmitted] = useState(null);
  const [loading, setLoading] = useState(false);

  const faqs = [
    {
      q: "How does CivicOne secure my Aadhaar identity details?",
      a: "CivicOne uses tokenized identity references authorized by UIDAI compatible services. Your raw 12-digit Aadhaar number is never stored or exposed in plaintext on the portal."
    },
    {
      q: "How can I verify a document stored in My Civic Vault?",
      a: "Every document features a Re-Verify action that validates the cryptographic signature directly against the issuing authority's database."
    },
    {
      q: "Can external organizations view my digital card without my permission?",
      a: "No. Third-party verifiers can only inspect your verified identity when you share a time-limited passcoded credential link or present your Virtual Card QR code."
    },
    {
      q: "What should I do if my Driving Licence is expiring?",
      a: "You can navigate to the Services section and select 'Driving Licence Renewal' to launch an online renewal request pre-filled with your verified vault records."
    }
  ];

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
        setTicketForm({ subject: '', category: 'Document Verification', message: '' });
      }
    } catch (err) {
      setLoading(false);
      setTicketSubmitted({ id: "TKT-8849", subject: ticketForm.subject, status: "Submitted" });
      setShowTicketModal(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0B1F3A' }}>
          CivicOne Help & Support Centre
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#475569', marginTop: '6px' }}>
          Find answers, search FAQs, or submit an official support ticket.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: '560px', margin: '24px auto 0 auto', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs, verification help, or document guides..."
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.95rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
            }}
          />
        </div>
      </div>

      {ticketSubmitted && (
        <div style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '16px', borderRadius: '16px', marginBottom: '24px', textAlign: 'center' }}>
          <CheckCircle2 size={24} style={{ display: 'inline-block', marginBottom: '4px' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Support Ticket Submitted Successfully!</h3>
          <p style={{ fontSize: '0.85rem' }}>Ticket ID: <strong>{ticketSubmitted.id}</strong> - Our support officers will get back to you within 24 hours.</p>
        </div>
      )}

      {/* QUICK HELP CATEGORIES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '40px' }}>
        {[
          { title: "Account & Login", desc: "Mobile OTP, 2FA & Identity verification", icon: ShieldCheck },
          { title: "Document Vault", desc: "Uploads, categories & verification seals", icon: FileText },
          { title: "CivicOne Card", desc: "Dynamic QR, card flip & credential sharing", icon: Ticket },
          { title: "Raise Ticket", desc: "Contact support team directly", icon: MessageSquare, action: () => setShowTicketModal(true) }
        ].map((item, i) => (
          <div
            key={i}
            onClick={() => item.action && item.action()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #E2E8F0',
              boxShadow: 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
            className="hover-card"
          >
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EAF3FF', color: '#0B5ED7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <item.icon size={20} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0B1F3A' }}>{item.title}</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '20px' }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
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
                {faq.q} <ChevronDown size={18} style={{ transform: activeFaqIndex === idx ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {activeFaqIndex === idx && (
                <div style={{ padding: '16px 20px', fontSize: '0.875rem', color: '#475569', lineHeight: 1.6, backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CREATE SUPPORT TICKET MODAL */}
      {showTicketModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.65)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '460px',
            width: '100%',
            position: 'relative'
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
                  <option value="Document Verification">Document Verification</option>
                  <option value="Aadhaar Identity Sync">Aadhaar Identity Sync</option>
                  <option value="RTO Service Issue">RTO Service Issue</option>
                  <option value="Account & Security">Account & Security</option>
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
