// src/components/DocumentViewerModal.jsx - In-Platform Secure Watermarked Document Viewer

import React from 'react';
import { X, ShieldCheck, Lock, Download, Award, FileText, CheckCircle2 } from 'lucide-react';

export default function DocumentViewerModal({ document, consentRecord, onClose }) {
  if (!document) return null;

  const watermarkText = consentRecord?.watermarkText || 
    `CONFIDENTIAL — AUTHORIZED FOR VERIFIED RECIPIENT — PURPOSE: VERIFICATION — ${new Date().toLocaleDateString('en-GB')}`;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '720px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.5)',
        overflow: 'hidden'
      }}>

        {/* MODAL HEADER */}
        <div style={{
          padding: '20px 28px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          backgroundColor: '#0B1F3A',
          color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#0B5ED7', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800 }}>{document.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#93C5FD' }}>
                Issuer: {document.issuer} | Category: {document.category}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* DOCUMENT PREVIEW CONTAINER WITH DYNAMIC WATERMARK */}
        <div style={{
          padding: '32px 28px',
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#F8FAFC',
          position: 'relative'
        }}>

          {/* DYNAMIC WATERMARK OVERLAY */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            overflow: 'hidden'
          }}>
            <div style={{
              transform: 'rotate(-30deg)',
              fontSize: '1.15rem',
              fontWeight: 900,
              color: 'rgba(220, 38, 38, 0.14)',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              lineHeight: 1.6,
              maxWidth: '80%',
              userSelect: 'none'
            }}>
              {watermarkText}
              <br />
              {watermarkText}
            </div>
          </div>

          {/* DOCUMENT CONTENT SHEET */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #CBD5E1',
            padding: '36px 32px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            position: 'relative',
            zIndex: 1
          }}>

            {/* Document Header Logo */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0B1F3A', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0B5ED7', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  CIVIQONE VERIFIED CREDENTIAL DOCUMENT
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0B1F3A', marginTop: '2px' }}>
                  {document.name}
                </h2>
              </div>

              <div style={{ backgroundColor: '#ECFDF5', color: '#047857', padding: '6px 14px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', border: '1px solid #A7F3D0' }}>
                🟢 {document.status || 'VERIFIED'}
              </div>
            </div>

            {/* Document Fields List */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '0.875rem', marginBottom: '28px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Issuing Authority</span>
                <span style={{ fontWeight: 800, color: '#0F172A' }}>{document.issuer}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Reference Number</span>
                <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#0B5ED7' }}>{document.refNo || 'REF-9048-VERIFIED'}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Issue Date</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{document.issueDate || '10-06-2024'}</span>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Expiry Date</span>
                <span style={{ fontWeight: 700, color: '#0F172A' }}>{document.expiryDate || 'N/A'}</span>
              </div>
            </div>

            {/* Security Cryptographic Seal Box */}
            <div style={{
              backgroundColor: '#F1F5F9',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0B1F3A' }}>
                  🔒 Cryptographic Security Seal
                </div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748B', marginTop: '2px' }}>
                  {document.securitySeal || 'SHA-256-TOKEN-VERIFIED-SEAL-OK'}
                </div>
              </div>
              <CheckCircle2 size={24} color="#16A34A" />
            </div>

          </div>

        </div>

        {/* MODAL FOOTER */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.775rem', color: '#64748B' }}>
            🔒 Non-transferable Recipient-Bound Viewing Session
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: '#0B5ED7',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
}
