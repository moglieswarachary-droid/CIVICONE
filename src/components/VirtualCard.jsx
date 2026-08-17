// src/components/VirtualCard.jsx - Dynamic Premium Gold Virtual CivicOne Card & Interactive Features

import React, { useState } from 'react';
import {
  ShieldCheck, QrCode, RotateCw, Share2, Download, History, Lock, CheckCircle2,
  Copy, X, Sparkles, ShieldAlert, Fingerprint, Crown, Smartphone, Radio, Zap, Award, Eye, EyeOff
} from 'lucide-react';

export default function VirtualCard({ citizen, card, onNavigateToVerification, onCardUpdate }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showNfcModal, setShowNfcModal] = useState(false);
  const [showTierModal, setShowTierModal] = useState(false);
  const [showFullAadhaar, setShowFullAadhaar] = useState(false);
  
  // Card Tier State (Defaulting to STANDARD unless Gold Pass is ACTIVE)
  const [currentTier, setCurrentTier] = useState(card?.tier || 'STANDARD');
  const [nfcScanning, setNfcScanning] = useState(false);
  const [nfcSuccess, setNfcSuccess] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  // Gold Pass styling is ONLY active if goldPassStatus === 'active' or explicitly verified GOLD
  const isGold = (card?.goldPassStatus === 'active' || (card?.tier === 'GOLD' && card?.goldPassStatus !== 'standard' && card?.goldPassStatus !== 'pending'));

  // Toggle Card Tier (STANDARD <-> GOLD)
  const handleTierSwitch = async (newTier) => {
    setCurrentTier(newTier);
    try {
      const res = await fetch('/api/card/update-tier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: newTier })
      });
      const data = await res.json();
      if (data.success && onCardUpdate) {
        onCardUpdate(data.card);
      }
    } catch (err) {
      console.log("Tier updated locally");
    }
  };

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

  // Generate dynamic SVG QR Code pattern with theme accent
  const renderQrSvg = (size = 140) => (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', margin: '0 auto', background: '#FFFFFF', padding: '6px', borderRadius: '8px' }}>
      <rect width="100" height="100" fill="#FFFFFF" />
      {/* Corner Position Detection Squares */}
      <rect x="5" y="5" width="26" height="26" fill={isGold ? "#856414" : "#0B1F3A"} />
      <rect x="9" y="9" width="18" height="18" fill="#FFFFFF" />
      <rect x="13" y="13" width="10" height="10" fill={isGold ? "#D4AF37" : "#0B5ED7"} />

      <rect x="69" y="5" width="26" height="26" fill={isGold ? "#856414" : "#0B1F3A"} />
      <rect x="73" y="9" width="18" height="18" fill="#FFFFFF" />
      <rect x="77" y="13" width="10" height="10" fill={isGold ? "#D4AF37" : "#0B5ED7"} />

      <rect x="5" y="69" width="26" height="26" fill={isGold ? "#856414" : "#0B1F3A"} />
      <rect x="9" y="73" width="18" height="18" fill="#FFFFFF" />
      <rect x="13" y="77" width="10" height="10" fill={isGold ? "#D4AF37" : "#0B5ED7"} />

      {/* Dynamic Data Modules */}
      <rect x="36" y="8" width="6" height="6" fill={isGold ? "#D4AF37" : "#0B5ED7"} />
      <rect x="46" y="8" width="6" height="6" fill="#0B1F3A" />
      <rect x="56" y="8" width="6" height="6" fill={isGold ? "#D4AF37" : "#0B5ED7"} />

      <rect x="36" y="18" width="6" height="6" fill="#0B1F3A" />
      <rect x="46" y="18" width="12" height="6" fill={isGold ? "#D4AF37" : "#0B5ED7"} />

      <rect x="8" y="36" width="6" height="6" fill="#0B1F3A" />
      <rect x="18" y="36" width="6" height="6" fill={isGold ? "#D4AF37" : "#0B5ED7"} />
      <rect x="28" y="36" width="12" height="6" fill="#0B1F3A" />
      <rect x="46" y="36" width="6" height="6" fill={isGold ? "#D4AF37" : "#0B5ED7"} />
      <rect x="56" y="36" width="12" height="6" fill="#0B1F3A" />
      <rect x="74" y="36" width="6" height="6" fill={isGold ? "#D4AF37" : "#0B5ED7"} />
      <rect x="84" y="36" width="8" height="6" fill="#0B1F3A" />

      <rect x="36" y="46" width="12" height="6" fill={isGold ? "#D4AF37" : "#0B5ED7"} />
      <rect x="54" y="46" width="6" height="6" fill="#0B1F3A" />
      <rect x="66" y="46" width="12" height="6" fill={isGold ? "#D4AF37" : "#0B5ED7"} />

      <rect x="8" y="56" width="6" height="6" fill={isGold ? "#D4AF37" : "#0B5ED7"} />
      <rect x="20" y="56" width="12" height="6" fill="#0B1F3A" />
      <rect x="38" y="56" width="6" height="6" fill={isGold ? "#D4AF37" : "#0B5ED7"} />
      <rect x="48" y="56" width="12" height="6" fill="#0B1F3A" />

      <rect x="36" y="66" width="8" height="6" fill="#0B1F3A" />
      <rect x="48" y="66" width="6" height="6" fill={isGold ? "#D4AF37" : "#0B5ED7"} />
      <rect x="60" y="66" width="14" height="6" fill="#0B1F3A" />

      <rect x="36" y="78" width="6" height="6" fill={isGold ? "#D4AF37" : "#0B5ED7"} />
      <rect x="48" y="78" width="12" height="6" fill="#0B1F3A" />
      <rect x="66" y="78" width="6" height="6" fill={isGold ? "#D4AF37" : "#0B5ED7"} />
      <rect x="78" y="78" width="14" height="6" fill="#0B1F3A" />

      {/* Center Symbol */}
      <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="6" fill={isGold ? "#CA8A04" : "#0B5ED7"} />
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

      {/* TOP TIER QUICK TOGGLE STRIP */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        marginBottom: '10px',
        padding: '6px 12px',
        borderRadius: '12px',
        backgroundColor: isGold ? 'rgba(234, 179, 8, 0.12)' : 'var(--light-blue)',
        border: `1px solid ${isGold ? '#FACC15' : 'var(--border-blue)'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isGold ? <Crown size={18} style={{ color: '#EAB308' }} /> : <ShieldCheck size={18} style={{ color: '#0B5ED7' }} />}
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isGold ? '#B45309' : '#0B5ED7' }}>
            {isGold ? "👑 PREMIUM GOLD CARD ACTIVE" : "STANDARD DIGITAL CARD"}
          </span>
        </div>

        <button
          onClick={() => setShowTierModal(true)}
          style={{
            backgroundColor: isGold ? '#CA8A04' : '#0B5ED7',
            color: '#FFFFFF',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Sparkles size={12} /> Switch Theme
        </button>
      </div>

      {/* 3D CARD WRAPPER */}
      <div
        className={`card-container-3d ${isFlipped ? 'flipped' : ''}`}
        style={{ width: '100%', minHeight: '230px', aspectRatio: '1.586', position: 'relative', cursor: 'pointer' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="card-inner-3d">

          {/* FRONT OF VIRTUAL CIVICONE CARD */}
          <div
            className={`card-front-3d security-pattern-bg ${isGold ? 'card-gold-bg' : ''}`}
            style={{
              background: isGold
                ? 'linear-gradient(135deg, #1C190D 0%, #3B2E09 30%, #856414 65%, #C5A038 90%, #E6C86E 100%)'
                : 'linear-gradient(135deg, #0B1F3A 0%, #073B8C 50%, #0B5ED7 100%)',
              padding: '16px 20px',
              color: '#FFFFFF',
              boxShadow: isGold
                ? '0 16px 40px -8px rgba(197, 160, 56, 0.45), 0 0 25px rgba(230, 200, 110, 0.25)'
                : '0 16px 36px -8px rgba(11, 31, 58, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              border: isGold ? '1.5px solid #FEF08A' : '1px solid rgba(255,255,255,0.2)'
            }}
          >
            {/* Shimmer Overlay */}
            <div className={isGold ? "gold-hologram-shimmer" : "hologram-shimmer"} />

            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: isGold ? 'rgba(254, 240, 138, 0.25)' : 'rgba(255,255,255,0.15)',
                  border: isGold ? '1px solid #FEF08A' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isGold ? <Crown size={22} style={{ color: '#FDE047' }} /> : <ShieldCheck size={20} style={{ color: '#60A5FA' }} />}
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.05rem', letterSpacing: '0.04em', lineHeight: 1, color: isGold ? '#FEF08A' : '#FFFFFF' }}>
                    CivicOne {isGold ? "Gold" : ""}
                  </div>
                  <div style={{ fontSize: '0.625rem', color: isGold ? '#FDE047' : '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    {isGold ? "VIP National Credential" : "Digital Identity"}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className={isGold ? "gold-vip-badge" : ""} style={!isGold ? {
                backgroundColor: 'rgba(25, 135, 84, 0.25)',
                border: '1px solid rgba(74, 222, 128, 0.4)',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#4ADE80',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              } : {}}>
                {isGold ? (
                  <>
                    <Crown size={12} style={{ color: '#FDE047' }} /> Premium Gold
                  </>
                ) : (
                  "🟢 Verified Identity"
                )}
              </div>
            </div>

            {/* Card Main Profile Section */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '12px 0' }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={citizen.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                  alt={citizen.name}
                  style={{
                    width: '62px',
                    height: '62px',
                    borderRadius: '14px',
                    objectFit: 'cover',
                    border: isGold ? '2px solid #FEF08A' : '2px solid rgba(255,255,255,0.85)',
                    boxShadow: isGold ? '0 0 12px rgba(253, 224, 71, 0.5)' : '0 4px 10px rgba(0,0,0,0.2)'
                  }}
                />
                {isGold && (
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
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em', textShadow: isGold ? '0 2px 4px rgba(0,0,0,0.6)' : 'none' }}>
                  {citizen.fullName || citizen.name || citizen.displayName || 'Citizen'}
                </h2>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isGold ? '#FEF08A' : '#BFDBFE', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Civic ID: <span style={{ fontFamily: 'monospace', fontWeight: 900, letterSpacing: '0.5px' }}>{citizen.citizenId || card?.civicId || citizen.civicId}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(citizen.citizenId || card?.civicId || citizen.civicId); }}
                    style={{ background: 'none', color: isGold ? '#FDE047' : '#BFDBFE', opacity: 0.8, cursor: 'pointer', border: 'none', padding: 0 }}
                    title="Copy Civic ID"
                  >
                    <Copy size={12} />
                  </button>
                </div>
                <div style={{ fontSize: '0.725rem', color: isGold ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.75)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Aadhaar Number: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{showFullAadhaar ? (citizen.aadhaarNumber || '8121 4981 8909') : (citizen.maskedAadhaar || 'XXXX XXXX 8909')}</span></span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowFullAadhaar(!showFullAadhaar); }}
                    style={{ background: 'none', border: 'none', color: isGold ? '#FDE047' : '#BFDBFE', cursor: 'pointer', padding: 0, opacity: 0.95, display: 'flex', alignItems: 'center' }}
                    title={showFullAadhaar ? "Hide Aadhaar Number" : "Reveal Aadhaar Number"}
                  >
                    {showFullAadhaar ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>

              {/* Mini Interactive QR Code Icon */}
              <div
                onClick={(e) => { e.stopPropagation(); setShowQrModal(true); }}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '6px',
                  borderRadius: '10px',
                  boxShadow: isGold ? '0 0 14px rgba(253, 224, 71, 0.4)' : '0 4px 12px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  border: isGold ? '1.5px solid #CA8A04' : 'none'
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
              borderTop: isGold ? '1px solid rgba(254, 240, 138, 0.3)' : '1px solid rgba(255,255,255,0.15)',
              paddingTop: '10px',
              fontSize: '0.7rem',
              color: isGold ? '#FEF08A' : 'rgba(255,255,255,0.8)'
            }}>
              {/* Micro Security Chip visual */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className={isGold ? "gold-security-chip" : ""} style={!isGold ? {
                  width: '24px',
                  height: '18px',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #FDE047 0%, #CA8A04 100%)',
                  border: '1px solid #FEF08A'
                } : {}} />
                <span style={{ fontWeight: 600 }}>Valid: {card?.issueDate || "15 Jan 2024"} - {card?.expiryDate || "14 Jan 2034"}</span>
              </div>
              <span style={{ fontSize: '0.65rem', color: isGold ? '#FDE047' : '#93C5FD', fontWeight: 700 }}>
                Tap to Flip 🔄
              </span>
            </div>

          </div>

          {/* BACK OF VIRTUAL CIVICONE CARD */}
          <div
            className={`card-back-3d security-pattern-bg ${isGold ? 'card-gold-bg' : ''}`}
            style={{
              background: isGold
                ? 'linear-gradient(135deg, #0F0D06 0%, #292006 50%, #4D3B0B 100%)'
                : 'linear-gradient(135deg, #0B1F3A 0%, #0F172A 100%)',
              padding: '22px',
              color: '#FFFFFF',
              boxShadow: isGold
                ? '0 16px 40px -8px rgba(197, 160, 56, 0.45)'
                : '0 16px 36px -8px rgba(11, 31, 58, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              border: isGold ? '1.5px solid #FEF08A' : '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: isGold ? '#FEF08A' : '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {isGold ? "👑 VIP Priority Authorization" : "Emergency & Address Reference"}
                </span>
                <span style={{ fontSize: '0.7rem', color: isGold ? '#FDE047' : 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
                  Cryptographic Gold Seal
                </span>
              </div>

              <div style={{ fontSize: '0.775rem', color: '#E2E8F0', lineHeight: 1.4, marginBottom: '8px' }}>
                <strong>Registered Address:</strong> <br />
                {citizen.address}
              </div>

              <div style={{ fontSize: '0.775rem', color: '#E2E8F0', display: 'flex', gap: '16px' }}>
                <div><strong>Blood Group:</strong> {citizen.bloodGroup}</div>
                <div><strong>DOB:</strong> {citizen.dob}</div>
              </div>
              <div style={{ fontSize: '0.75rem', color: isGold ? '#FEF08A' : '#60A5FA', marginTop: '6px' }}>
                <strong>Emergency Contact:</strong> {citizen.emergencyContact}
              </div>
            </div>

            {/* Cryptographic Signature Bar */}
            <div style={{
              backgroundColor: isGold ? 'rgba(254, 240, 138, 0.15)' : 'rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.65rem',
              color: isGold ? '#FEF08A' : '#94A3B8',
              fontFamily: 'monospace',
              border: isGold ? '1px solid rgba(254, 240, 138, 0.3)' : 'none'
            }}>
              <div>SEAL: {card?.securityChipId || "GOLD-CHIP-9984-SEC-ID"}</div>
              <div style={{ wordBreak: 'break-all', opacity: 0.85 }}>{card?.qrSignature?.slice(0, 36) || 'SHA256:e3b0c44298fc1c14'}...</div>
            </div>
          </div>

        </div>
      </div>

      {/* CARD ACTION BUTTON BAR */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '6px',
        marginTop: '14px'
      }}>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            padding: '8px 4px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <RotateCw size={15} style={{ color: isGold ? '#CA8A04' : '#0B5ED7' }} /> Flip
        </button>

        <button
          onClick={() => setShowQrModal(true)}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            padding: '8px 4px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <QrCode size={15} style={{ color: isGold ? '#CA8A04' : '#0B5ED7' }} /> View QR
        </button>

        <button
          onClick={handleTriggerNfc}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            padding: '8px 4px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Radio size={15} style={{ color: isGold ? '#CA8A04' : '#0B5ED7' }} /> NFC Tap
        </button>

        <button
          onClick={handleGenerateShareLink}
          disabled={shareLoading}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            padding: '8px 4px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <Share2 size={15} style={{ color: isGold ? '#CA8A04' : '#0B5ED7' }} /> Share
        </button>

        <button
          onClick={() => setShowHistoryModal(true)}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '10px',
            padding: '8px 4px',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px'
          }}
        >
          <History size={15} style={{ color: isGold ? '#CA8A04' : '#0B5ED7' }} /> Audit
        </button>
      </div>

      {/* MODAL 1: ENLARGED QR CODE & PUBLIC VERIFICATION */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.7)',
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
            maxWidth: '420px',
            width: '100%',
            position: 'relative',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
            border: isGold ? '2px solid #CA8A04' : 'none'
          }}>
            <button
              onClick={() => setShowQrModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {isGold ? <Crown size={24} style={{ color: '#CA8A04' }} /> : <ShieldCheck size={24} style={{ color: '#0B5ED7' }} />}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0B1F3A' }}>
                CivicOne {isGold ? "Gold" : ""} Dynamic Verification QR
              </h3>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '18px' }}>
              Official cryptographic credential QR code. Instant verification for government authorities.
            </p>

            <div style={{
              padding: '16px',
              backgroundColor: isGold ? '#FEFCE8' : '#F6F9FC',
              borderRadius: '16px',
              display: 'inline-block',
              marginBottom: '18px',
              border: isGold ? '2px solid #FACC15' : '1px solid #E2E8F0'
            }}>
              {renderQrSvg(190)}
            </div>

            <div style={{
              fontSize: '0.75rem',
              color: isGold ? '#B45309' : '#073B8C',
              backgroundColor: isGold ? '#FEF3C7' : '#EAF3FF',
              padding: '10px 14px',
              borderRadius: '12px',
              marginBottom: '18px',
              fontWeight: 700
            }}>
              {isGold ? "👑 VIP Gold Verification Token:" : "🟢 Verified Identity Token:"} {card?.verificationToken || "CIV-TOKEN-984210"}
            </div>

            <button
              onClick={() => {
                setShowQrModal(false);
                onNavigateToVerification(card?.verificationToken || "CIV-TOKEN-984210");
              }}
              className={isGold ? "gold-btn" : ""}
              style={!isGold ? {
                width: '100%',
                backgroundColor: '#0B5ED7',
                color: '#FFFFFF',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.9rem'
              } : { width: '100%', padding: '12px', borderRadius: '12px', fontSize: '0.9rem' }}
            >
              Test Public Verification Page 🚀
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: NFC TOUCH SIMULATION */}
      {showNfcModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.75)',
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
            maxWidth: '380px',
            width: '100%',
            position: 'relative',
            textAlign: 'center'
          }}>
            <button
              onClick={() => setShowNfcModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '8px' }}>
              NFC Touch Identity Verification
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '24px' }}>
              Hold your smartphone near an authorized CivicOne NFC scanner.
            </p>

            {nfcScanning && (
              <div style={{ padding: '24px 0' }}>
                <div style={{
                  width: '80px', height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(234, 179, 8, 0.2)',
                  border: '3px solid #EAB308',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }} className="pulse-glow">
                  <Radio size={40} style={{ color: '#CA8A04' }} />
                </div>
                <div style={{ fontWeight: 700, color: '#CA8A04', fontSize: '0.9rem' }}>
                  Scanning NFC Signal...
                </div>
              </div>
            )}

            {nfcSuccess && (
              <div style={{ padding: '16px 0' }}>
                <div style={{
                  width: '70px', height: '70px',
                  borderRadius: '50%',
                  backgroundColor: '#D1E7DD',
                  color: '#0F5132',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto'
                }}>
                  <CheckCircle2 size={42} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F5132' }}>
                  NFC Identity Authenticated!
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px', marginBottom: '20px' }}>
                  Cryptographic Gold Seal transmitted to reader. Clearance: VIP Approved.
                </p>
                <button
                  onClick={() => setShowNfcModal(false)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0B5ED7',
                    color: '#FFFFFF',
                    padding: '10px',
                    borderRadius: '10px',
                    fontWeight: 700
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: TIER THEME SELECTION */}
      {showTierModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.7)',
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
            padding: '28px',
            maxWidth: '440px',
            width: '100%',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowTierModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Crown size={24} style={{ color: '#CA8A04' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A' }}>
                Manage Civic Card Tier
              </h3>
            </div>
            <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '20px' }}>
              Select your preferred card layout & digital identity tier.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              
              {/* GOLD TIER OPTION */}
              <div
                onClick={() => { handleTierSwitch('GOLD'); setShowTierModal(false); }}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: isGold ? '2px solid #EAB308' : '1px solid #E2E8F0',
                  backgroundColor: isGold ? '#FEFCE8' : '#F8FAFC',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  background: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF'
                }}>
                  <Crown size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#B45309' }}>
                    👑 Premium Gold Card
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Metallic Gold finish, Gold Chip, VIP Clearance & Priority Authorization
                  </div>
                </div>
                {isGold && <CheckCircle2 size={20} style={{ color: '#CA8A04' }} />}
              </div>

              {/* STANDARD TIER OPTION */}
              <div
                onClick={() => { handleTierSwitch('STANDARD'); setShowTierModal(false); }}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: !isGold ? '2px solid #0B5ED7' : '1px solid #E2E8F0',
                  backgroundColor: !isGold ? '#EAF3FF' : '#F8FAFC',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  backgroundColor: '#0B5ED7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF'
                }}>
                  <ShieldCheck size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0B5ED7' }}>
                    Standard Civic Card
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Classic Deep Blue digital credential with standard cryptographic verification
                  </div>
                </div>
                {!isGold && <CheckCircle2 size={20} style={{ color: '#0B5ED7' }} />}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: SHARE CREDENTIAL LINK */}
      {showShareModal && shareData && (
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
            maxWidth: '420px',
            width: '100%',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowShareModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0B5ED7', fontWeight: 800, fontSize: '1.1rem', marginBottom: '8px' }}>
              <Share2 size={22} /> Share Verified Credential
            </div>
            <p style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '20px' }}>
              Generate a secure, time-limited verification link to share your identity authorization with external organizations.
            </p>

            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', marginBottom: '4px' }}>VERIFICATION LINK</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0B1F3A', wordBreak: 'break-all' }}>
                {shareData.shareUrl}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#EAF3FF', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#073B8C', fontWeight: 600 }}>ONE-TIME PASSCODE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B5ED7' }}>{shareData.passcode}</div>
              </div>
              <div style={{ backgroundColor: '#FEF3C7', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', color: '#92400E', fontWeight: 600 }}>LINK VALIDITY</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#B45309', marginTop: '2px' }}>{shareData.expiresInHours} Hours</div>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(shareData.shareUrl)}
              style={{
                width: '100%',
                backgroundColor: copied ? '#198754' : '#0B5ED7',
                color: '#FFFFFF',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              {copied ? 'Link Copied to Clipboard!' : 'Copy Verification Link'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL 5: AUDIT LOGS */}
      {showHistoryModal && (
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
            padding: '28px',
            maxWidth: '460px',
            width: '100%',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowHistoryModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#64748B' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0B1F3A', fontWeight: 800, fontSize: '1.1rem', marginBottom: '16px' }}>
              <History size={20} style={{ color: '#0B5ED7' }} /> Card Verification History & Security Audit
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
              {[
                { event: "Gold Card VIP NFC Touch Authenticated", time: "Just now", status: "SUCCESS" },
                { event: "QR Code Scanned by RTO Officer", time: "Today, 10:14 AM", status: "SUCCESS" },
                { event: "Aadhaar Identity Tokenized Re-check", time: "13 Aug 2026, 09:31 AM", status: "SUCCESS" },
                { event: "Virtual Card Dynamic Token Issued", time: "13 Aug 2026, 09:30 AM", status: "SUCCESS" }
              ].map((log, i) => (
                <div key={i} style={{
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#F6F9FC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B1F3A' }}>{log.event}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{log.time}</div>
                  </div>
                  <span style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
