// src/components/VirtualCard.jsx - Unified Premium Gold-Graded National CivicOne Card

import React, { useState } from 'react';
import {
  ShieldCheck, QrCode, RotateCw, Share2, Download, History, Lock, CheckCircle2,
  Copy, X, Sparkles, ShieldAlert, Fingerprint, Crown, Smartphone, Radio, Zap, Award
} from 'lucide-react';

export default function VirtualCard({ citizen, card, onNavigateToVerification }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showNfcModal, setShowNfcModal] = useState(false);
  
  const [nfcScanning, setNfcScanning] = useState(false);
  const [nfcSuccess, setNfcSuccess] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  // Simulate NFC Tap Scan
  const handleTriggerNfc = () => {
    setShowNfcModal(true);
    setNfcScanning(true);
    setNfcSuccess(false);

    setTimeout(() => {
      setNfcScanning(false);
      setNfcSuccess(true);
    }, 2200);
  };

  // Generate dynamic SVG QR Code pattern with Gold accents
  const renderQrSvg = (size = 140) => (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', margin: '0 auto', background: '#FFFFFF', padding: '6px', borderRadius: '8px' }}>
      <rect width="100" height="100" fill="#FFFFFF" />
      {/* Corner Position Detection Squares */}
      <rect x="5" y="5" width="26" height="26" fill="#856414" />
      <rect x="9" y="9" width="18" height="18" fill="#FFFFFF" />
      <rect x="13" y="13" width="10" height="10" fill="#D4AF37" />

      <rect x="69" y="5" width="26" height="26" fill="#856414" />
      <rect x="73" y="9" width="18" height="18" fill="#FFFFFF" />
      <rect x="77" y="13" width="10" height="10" fill="#D4AF37" />

      <rect x="5" y="69" width="26" height="26" fill="#856414" />
      <rect x="9" y="73" width="18" height="18" fill="#FFFFFF" />
      <rect x="13" y="77" width="10" height="10" fill="#D4AF37" />

      {/* Dynamic Data Modules */}
      <rect x="36" y="8" width="6" height="6" fill="#D4AF37" />
      <rect x="46" y="8" width="6" height="6" fill="#0B1F3A" />
      <rect x="56" y="8" width="6" height="6" fill="#D4AF37" />

      <rect x="36" y="18" width="6" height="6" fill="#0B1F3A" />
      <rect x="46" y="18" width="12" height="6" fill="#D4AF37" />

      <rect x="8" y="36" width="6" height="6" fill="#0B1F3A" />
      <rect x="18" y="36" width="6" height="6" fill="#D4AF37" />
      <rect x="28" y="36" width="12" height="6" fill="#0B1F3A" />
      <rect x="46" y="36" width="6" height="6" fill="#D4AF37" />
      <rect x="56" y="36" width="12" height="6" fill="#0B1F3A" />
      <rect x="74" y="36" width="6" height="6" fill="#D4AF37" />
      <rect x="84" y="36" width="8" height="6" fill="#0B1F3A" />

      <rect x="36" y="46" width="12" height="6" fill="#D4AF37" />
      <rect x="54" y="46" width="6" height="6" fill="#0B1F3A" />
      <rect x="66" y="46" width="12" height="6" fill="#D4AF37" />

      <rect x="8" y="56" width="6" height="6" fill="#D4AF37" />
      <rect x="20" y="56" width="12" height="6" fill="#0B1F3A" />
      <rect x="38" y="56" width="6" height="6" fill="#D4AF37" />
      <rect x="48" y="56" width="12" height="6" fill="#0B1F3A" />

      <rect x="36" y="66" width="8" height="6" fill="#0B1F3A" />
      <rect x="48" y="66" width="6" height="6" fill="#D4AF37" />
      <rect x="60" y="66" width="14" height="6" fill="#0B1F3A" />

      <rect x="36" y="78" width="6" height="6" fill="#D4AF37" />
      <rect x="48" y="78" width="12" height="6" fill="#0B1F3A" />
      <rect x="66" y="78" width="6" height="6" fill="#D4AF37" />
      <rect x="78" y="78" width="14" height="6" fill="#0B1F3A" />

      {/* Center Symbol */}
      <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="6" fill="#CA8A04" />
    </svg>
  );

  // Trigger Credential Link Generation API
  const handleGenerateShareLink = async () => {
    setShareLoading(true);
    try {
      const res = await fetch('/api/card/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ durationHours: 24 })
      });
      const data = await res.json();
      setShareLoading(false);
      if (data.success) {
        setShareData(data);
        setShowShareModal(true);
      }
    } catch (err) {
      setShareLoading(false);
      setShareData({
        shareUrl: `http://localhost:3000/verify?token=${card?.verificationToken || 'CIV-TOKEN-984210'}`,
        expiresInHours: 24,
        passcode: "8942"
      });
      setShowShareModal(true);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>

      {/* CARD TITLE BADGE */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        padding: '6px 14px',
        borderRadius: '12px',
        backgroundColor: 'rgba(234, 179, 8, 0.12)',
        border: '1px solid #FACC15'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Crown size={18} style={{ color: '#EAB308' }} />
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#B45309', letterSpacing: '0.02em' }}>
            PREMIUM GOLD NATIONAL CIVIC CARD
          </span>
        </div>

        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#CA8A04', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '10px' }}>
          🟢 VERIFIED IDENTITY
        </span>
      </div>

      {/* 3D CARD WRAPPER */}
      <div
        className={`card-container-3d ${isFlipped ? 'flipped' : ''}`}
        style={{ width: '100%', minHeight: '230px', aspectRatio: '1.586', position: 'relative', cursor: 'pointer' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="card-inner-3d">

          {/* FRONT OF PREMIUM GOLD-GRADED CIVICONE CARD */}
          <div
            className="card-front-3d security-pattern-bg card-gold-bg"
            style={{
              background: 'linear-gradient(135deg, #1C190D 0%, #3B2E09 30%, #856414 65%, #C5A038 90%, #E6C86E 100%)',
              padding: '16px 20px',
              color: '#FFFFFF',
              boxShadow: '0 16px 40px -8px rgba(197, 160, 56, 0.45), 0 0 25px rgba(230, 200, 110, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1.5px solid #FEF08A'
            }}
          >
            {/* Shimmer Overlay */}
            <div className="gold-hologram-shimmer" />

            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(254, 240, 138, 0.25)',
                  border: '1px solid #FEF08A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Crown size={22} style={{ color: '#FDE047' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.05rem', letterSpacing: '0.04em', lineHeight: 1, color: '#FEF08A' }}>
                    CivicOne
                  </div>
                  <div style={{ fontSize: '0.625rem', color: '#FDE047', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    National Identity Card
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="gold-vip-badge">
                <Crown size={12} style={{ color: '#FDE047' }} /> Gold Grade
              </div>
            </div>

            {/* Card Main Profile Section */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '12px 0' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={citizen?.profileImage || citizen?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                  alt={citizen?.fullName || citizen?.name}
                  style={{
                    width: '62px',
                    height: '62px',
                    borderRadius: '14px',
                    objectFit: 'cover',
                    border: '2px solid #FEF08A',
                    boxShadow: '0 0 12px rgba(253, 224, 71, 0.5)'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '-4px', right: '-4px',
                  backgroundColor: '#CA8A04',
                  borderRadius: '50%',
                  padding: '2px',
                  border: '1px solid #FEF08A'
                }}>
                  <Crown size={10} style={{ color: '#FEF08A' }} />
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em', textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                  {citizen?.fullName || citizen?.name}
                </h2>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#FEF08A', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Civic ID: {card?.civicId || citizen?.citizenId || citizen?.civicId}
                  <button
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(card?.civicId || citizen?.citizenId || citizen?.civicId); }}
                    style={{ background: 'none', color: '#FDE047', opacity: 0.9 }}
                    title="Copy Civic ID"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <div style={{ fontSize: '0.725rem', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>
                  Aadhaar Ref: {citizen?.maskedAadhaar || "XXXX XXXX 8942"}
                </div>
              </div>

              {/* Mini Interactive QR Code Icon */}
              <div
                onClick={(e) => { e.stopPropagation(); setShowQrModal(true); }}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '6px',
                  borderRadius: '10px',
                  boxShadow: '0 0 14px rgba(253, 224, 71, 0.4)',
                  cursor: 'pointer',
                  border: '1.5px solid #CA8A04'
                }}
                title="Click to view enlarged dynamic QR code"
              >
                {renderQrSvg(44)}
              </div>
            </div>

            {/* Card Footer Bar */}
            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(254, 240, 138, 0.3)',
              paddingTop: '10px',
              fontSize: '0.7rem',
              color: '#FEF08A'
            }}>
              {/* Micro Security Chip visual */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="gold-security-chip" />
                <span style={{ fontWeight: 600 }}>Valid: {card?.issueDate || "15 Jan 2024"} - {card?.expiryDate || "14 Jan 2034"}</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#FDE047', fontWeight: 700 }}>
                Tap to Flip 🔄
              </span>
            </div>
          </div>

          {/* BACK OF VIRTUAL CIVICONE CARD */}
          <div
            className="card-back-3d card-gold-bg"
            style={{
              background: 'linear-gradient(135deg, #110E06 0%, #2A2107 40%, #6E5311 80%, #9A7B2C 100%)',
              padding: '16px 20px',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              border: '1.5px solid #FEF08A'
            }}
          >
            {/* Magnetic Stripe Visual */}
            <div style={{
              backgroundColor: '#0F0E0B',
              height: '34px',
              margin: '-16px -20px 10px -20px',
              borderBottom: '1px solid #CA8A04'
            }} />

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#FEF08A', marginBottom: '6px' }}>
                <span>Security Token Signature:</span>
                <span>SHA-256 Encrypted</span>
              </div>

              {/* Signature Bar Visual */}
              <div style={{
                backgroundColor: '#FFFFFF',
                color: '#0B1F3A',
                fontFamily: 'monospace',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{card?.qrSignature ? card.qrSignature.substring(0, 24) : 'SHA256:e3b0c44298fc1c14...'}</span>
                <Lock size={12} style={{ color: '#CA8A04' }} />
              </div>

              <div style={{ fontSize: '0.68rem', color: '#FDE047', lineHeight: 1.4 }}>
                This is a legally valid National Digital Credential issued under National Digital Identity Rules. Scanning the QR code or NFC tap validates document authenticity instantly without PII exposure.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#FEF08A', borderTop: '1px solid rgba(254, 240, 138, 0.2)', paddingTop: '8px' }}>
              <span>Security Chip ID: <code>{card?.securityChipId || `GOLD-CHIP-${citizen?.citizenId || '100001'}`}</code></span>
              <span style={{ cursor: 'pointer', color: '#FDE047', textDecoration: 'underline' }} onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}>
                Flip to Front 🔄
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* CARD ACTION BUTTONS STRIP */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '16px' }}>
        <button
          onClick={() => setShowQrModal(true)}
          style={{
            backgroundColor: '#0F172A',
            color: '#FEF08A',
            border: '1px solid #CA8A04',
            borderRadius: '12px',
            padding: '10px 4px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 12px rgba(202, 138, 4, 0.15)'
          }}
        >
          <QrCode size={18} style={{ color: '#FACC15' }} /> View QR
        </button>

        <button
          onClick={handleGenerateShareLink}
          disabled={shareLoading}
          style={{
            backgroundColor: '#0F172A',
            color: '#FEF08A',
            border: '1px solid #CA8A04',
            borderRadius: '12px',
            padding: '10px 4px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 12px rgba(202, 138, 4, 0.15)'
          }}
        >
          <Share2 size={18} style={{ color: '#FACC15' }} /> Share Link
        </button>

        <button
          onClick={handleTriggerNfc}
          style={{
            backgroundColor: '#0F172A',
            color: '#FEF08A',
            border: '1px solid #CA8A04',
            borderRadius: '12px',
            padding: '10px 4px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 12px rgba(202, 138, 4, 0.15)'
          }}
        >
          <Radio size={18} style={{ color: '#FACC15' }} /> NFC Tap
        </button>

        <button
          onClick={() => setShowHistoryModal(true)}
          style={{
            backgroundColor: '#0F172A',
            color: '#FEF08A',
            border: '1px solid #CA8A04',
            borderRadius: '12px',
            padding: '10px 4px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 12px rgba(202, 138, 4, 0.15)'
          }}
        >
          <History size={18} style={{ color: '#FACC15' }} /> Audit Log
        </button>
      </div>

      {/* ENLARGED QR MODAL */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '380px',
            width: '100%',
            padding: '24px',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '2px solid #CA8A04'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B45309', fontWeight: 800, fontSize: '0.9rem' }}>
                <Crown size={18} style={{ color: '#CA8A04' }} /> DYNAMIC VERIFICATION QR
              </div>
              <button onClick={() => setShowQrModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#FEF3C7', padding: '16px', borderRadius: '16px', marginBottom: '16px', border: '1px solid #FCD34D' }}>
              {renderQrSvg(220)}
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '4px' }}>
              {citizen?.fullName || citizen?.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 16px 0' }}>
              Civic ID: <strong>{card?.civicId || citizen?.citizenId}</strong>
            </p>

            <button
              onClick={() => {
                setShowQrModal(false);
                if (onNavigateToVerification) {
                  onNavigateToVerification(card?.verificationToken || `CIV-TOKEN-${citizen?.citizenId || '100001'}-SECURE-2026`);
                } else {
                  window.location.hash = `#verify?token=${card?.verificationToken || 'CIV-TOKEN-100001-SECURE-2026'}`;
                }
              }}
              style={{
                width: '100%',
                backgroundColor: '#0B5ED7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Test Public QR Scanner Link 🔗
            </button>
          </div>
        </div>
      )}

      {/* SHARE MODAL */}
      {showShareModal && shareData && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '420px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1F3A', margin: 0 }}>
                Share Verified Credential Link
              </h3>
              <button onClick={() => setShowShareModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '12px', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '4px' }}>Temporary Verification URL:</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B5ED7', wordBreak: 'break-all' }}>
                {shareData.shareUrl}
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(shareData.shareUrl)}
              style={{
                width: '100%',
                backgroundColor: copied ? '#198754' : '#0B5ED7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              {copied ? "✓ Verification Link Copied!" : "Copy Verification Link"}
            </button>
          </div>
        </div>
      )}

      {/* NFC TAP MODAL */}
      {showNfcModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '380px',
            width: '100%',
            padding: '28px',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowNfcModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{
              width: '80px', height: '80px',
              borderRadius: '50%',
              backgroundColor: nfcSuccess ? '#DCFCE7' : '#FEF3C7',
              color: nfcSuccess ? '#15803D' : '#D97706',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <Radio size={40} className={nfcScanning ? "pulse-ring" : ""} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              {nfcScanning ? "Hold Card Near Inspector Scanner" : "NFC Credential Transferred!"}
            </h3>

            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              {nfcScanning ? "Transmitting cryptographically signed digital identity token..." : "Verification token successfully validated by receiver terminal."}
            </p>

            <button
              onClick={() => setShowNfcModal(false)}
              style={{
                width: '100%',
                backgroundColor: nfcSuccess ? '#198754' : '#0B5ED7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {nfcSuccess ? "Close NFC Verification" : "Cancel Scan"}
            </button>
          </div>
        </div>
      )}

      {/* AUDIT LOG MODAL */}
      {showHistoryModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '500px',
            width: '100%',
            padding: '24px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1F3A', margin: 0 }}>
                Card Access & Verification History
              </h3>
              <button onClick={() => setShowHistoryModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '10px', fontSize: '0.8rem', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, color: '#0B5ED7' }}>QR Code Verified by Traffic Inspector</div>
                <div style={{ fontSize: '0.725rem', color: '#64748B' }}>Today, 09:30 AM • Location: Mumbai Central</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '10px', fontSize: '0.8rem', border: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, color: '#0B5ED7' }}>Pre-Entry OTP Authenticated</div>
                <div style={{ fontSize: '0.725rem', color: '#64748B' }}>Today, 09:15 AM • Device: Chrome Windows</div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
