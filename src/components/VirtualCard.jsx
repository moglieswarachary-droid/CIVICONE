// src/components/VirtualCard.jsx - Official CivicOne High-Security Digital Identity Card System
// Supports Two Official Tiers: NORMAL CITIZEN & GOLD TIER PREMIUM

import React, { useState, useRef, useEffect } from 'react';
import {
  ShieldCheck, QrCode, RotateCw, Share2, Download, CheckCircle2,
  Copy, X, Eye, EyeOff, Radio, Mail, MapPin, Calendar, Phone,
  Crown, Sparkles, Lock, Cpu, Fingerprint, ExternalLink,
  Check, AlertCircle, Shield, Key
} from 'lucide-react';

export default function VirtualCard({ citizen = {}, card = {}, onNavigateToVerification, onCardUpdate }) {
  // Determine active tier: defaults to citizen's active gold pass if upgraded, otherwise Normal
  const isCitizenGold = citizen?.tier === 'GOLD' || citizen?.goldPassStatus === 'active' || card?.tier === 'GOLD';
  const [selectedTier, setSelectedTier] = useState(isCitizenGold ? 'GOLD' : 'NORMAL');
  
  // Sync selectedTier if citizen changes
  useEffect(() => {
    if (citizen?.tier === 'GOLD' || citizen?.goldPassStatus === 'active') {
      setSelectedTier('GOLD');
    }
  }, [citizen]);

  const [isFlipped, setIsFlipped] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNfcModal, setShowNfcModal] = useState(false);
  const [showFullAadhaar, setShowFullAadhaar] = useState(false);

  const [nfcScanning, setNfcScanning] = useState(false);
  const [nfcSuccess, setNfcSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);

  const cardRef = useRef(null);

  // Dynamic Citizen Information
  const civicId = citizen?.citizenId || card?.civicId || citizen?.civicId || 'CIV-AP-710646-823';
  const citizenName = citizen?.fullName || citizen?.name || citizen?.displayName || 'Raghavendra';
  const photoUrl = citizen?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300";
  const dob = citizen?.dob || citizen?.dateOfBirth || '15/08/1995';
  const gender = citizen?.gender || 'Male';
  const state = citizen?.state || 'Andhra Pradesh';
  const jurisdiction = `Republic of India • ${state}`;
  const validFrom = card?.issueDate || '15/01/2024';
  const validUntil = card?.expiryDate || '14/01/2034';
  const maskedAadhaar = citizen?.maskedAadhaar || 'XXXX XXXX 8909';
  const fullAadhaar = citizen?.aadhaarNumber || '8121 4981 8909';
  const mobile = citizen?.mobile || citizen?.phone || '+91 8121280857';
  const email = citizen?.email || 'raghavendra@civicone.gov.in';
  const ledgerHash = card?.ledgerHash || '0x99a4c82b710e64b8a15c3d2e';
  const verificationRef = `REF-${civicId.replace(/[^A-Z0-9]/g, '')}-SEC`;
  const verificationUrl = `https://verify.civicone.gov.in/card/${encodeURIComponent(civicId)}`;

  // Copy helper
  const copyToClipboard = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Flip Toggle
  const handleFlipCard = () => {
    setIsFlipped(prev => !prev);
  };

  // NFC Simulation Trigger
  const handleTriggerNfc = () => {
    setShowNfcModal(true);
    setNfcScanning(true);
    setNfcSuccess(false);

    setTimeout(() => {
      setNfcScanning(false);
      setNfcSuccess(true);
    }, 1800);
  };

  // Web Share API with Modal Fallback
  const handleShareCard = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CivicOne Official Digital Identity - ${citizenName}`,
          text: `Official CivicOne Verified Identity Card (${selectedTier === 'GOLD' ? 'Gold Tier Premium' : 'Normal Citizen'}) for ${citizenName}. Civic ID: ${civicId}`,
          url: verificationUrl
        });
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to modal
      }
    }
    setShowShareModal(true);
  };

  // High-Resolution PNG Card Download
  const handleDownloadCardImage = () => {
    setDownloadingImage(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 630; // CR80 ratio 1.586
    const ctx = canvas.getContext('2d');

    const isGold = selectedTier === 'GOLD';

    // 1. Background
    if (isGold) {
      const grad = ctx.createLinearGradient(0, 0, 1000, 630);
      grad.addColorStop(0, '#090C12');
      grad.addColorStop(0.5, '#131824');
      grad.addColorStop(1, '#0B0F17');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1000, 630);

      // Gold Perimeter Border
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, 968, 598);

      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(24, 24, 952, 582);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 1000, 630);
      grad.addColorStop(0, '#0B1F3A');
      grad.addColorStop(0.5, '#073B8C');
      grad.addColorStop(1, '#0B5ED7');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1000, 630);

      // Silver/Cyan Border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 3;
      ctx.strokeRect(16, 16, 968, 598);
    }

    // 2. Header
    ctx.fillStyle = isGold ? '#F5E7A3' : '#FFFFFF';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText('CivicOne DIGITAL IDENTITY', 50, 70);

    ctx.fillStyle = isGold ? '#D4AF37' : '#93C5FD';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText(isGold ? 'GOLD TIER ENHANCED SECURITY • SOVEREIGN CREDENTIAL' : 'NATIONAL SOVEREIGN CITIZEN CREDENTIAL', 50, 98);

    // 3. Status Badge
    ctx.fillStyle = isGold ? '#2D2305' : '#064E3B';
    ctx.fillRect(720, 42, 230, 44);
    ctx.strokeStyle = isGold ? '#FACC15' : '#34D399';
    ctx.lineWidth = 2;
    ctx.strokeRect(720, 42, 230, 44);
    ctx.fillStyle = isGold ? '#FEF08A' : '#A7F3D0';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText(isGold ? '👑 Level Gold Verified' : '✓ Verified Identity', 740, 70);

    // 4. Citizen Info
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 42px Inter, sans-serif';
    ctx.fillText(citizenName, 220, 220);

    ctx.fillStyle = isGold ? '#FACC15' : '#93C5FD';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`Civic ID: ${civicId}`, 220, 265);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText(`DOB: ${dob}   |   Gender: ${gender}`, 220, 310);
    ctx.fillText(`Jurisdiction: ${jurisdiction}`, 220, 350);
    ctx.fillText(`Validity: ${validFrom} – ${validUntil}`, 220, 390);

    // 5. Tier Label Bottom
    ctx.fillStyle = isGold ? '#D4AF37' : '#60A5FA';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(isGold ? '★ GOLD TIER PREMIUM' : '● NORMAL CITIZEN', 50, 560);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '14px monospace';
    ctx.fillText(`PKI: ${verificationRef} • LEDGER: ${ledgerHash.slice(0, 16)}...`, 50, 590);

    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `CivicOne_${selectedTier}_Card_${civicId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloadingImage(false);
    }, 400);
  };

  // Reusable Scannable Dynamic QR Code
  const renderQrCode = (size = 110, isGold = false) => {
    // Construct real scannable verification data payload
    const qrPayload = `https://verify.civicone.gov.in/verify?id=${encodeURIComponent(civicId)}&tier=${selectedTier}&name=${encodeURIComponent(citizenName)}&v=${encodeURIComponent(ledgerHash.slice(0, 10))}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrPayload)}&color=0A1128&bgcolor=FFFFFF`;

    return (
      <div style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        padding: '6px',
        borderRadius: '10px',
        border: isGold ? '2px solid #D4AF37' : '2px solid #93C5FD',
        boxShadow: isGold ? '0 0 12px rgba(212, 175, 55, 0.35)' : '0 4px 12px rgba(0,0,0,0.12)',
        display: 'inline-block'
      }}>
        <img
          src={qrUrl}
          alt={`Official QR Code for Civic ID ${civicId}`}
          style={{ width: `${size}px`, height: `${size}px`, display: 'block', borderRadius: '4px' }}
        />
        <div style={{
          position: 'absolute',
          bottom: '2px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '6px',
          fontWeight: 900,
          color: '#0B1F3A',
          letterSpacing: '0.5px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          padding: '1px 4px',
          borderRadius: '3px'
        }}>
          CIVIC-VERIFIED
        </div>
      </div>
    );
  };

  const isGold = selectedTier === 'GOLD';

  return (
    <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto' }}>
      
      {/* TIER SWITCHER PILL (Allows seamless instant preview & switching of both official tiers) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-card)',
        padding: '6px',
        borderRadius: '14px',
        border: '1px solid var(--border-light)',
        marginBottom: '14px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontSize: '0.725rem', fontWeight: 800, color: 'var(--text-light)', paddingLeft: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Select Card Tier:
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {/* Normal Citizen Button */}
          <button
            type="button"
            onClick={() => setSelectedTier('NORMAL')}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: !isGold ? '#0B5ED7' : 'transparent',
              color: !isGold ? '#FFFFFF' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: !isGold ? '0 2px 8px rgba(11, 94, 215, 0.3)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <ShieldCheck size={14} /> Normal Citizen
          </button>

          {/* Gold Tier Premium Button */}
          <button
            type="button"
            onClick={() => setSelectedTier('GOLD')}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              border: isGold ? '1px solid #FACC15' : '1px solid transparent',
              background: isGold ? 'linear-gradient(135deg, #1C190D 0%, #3B2E09 60%, #0A0D14 100%)' : 'transparent',
              color: isGold ? '#FEF08A' : 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: isGold ? '0 2px 10px rgba(212, 175, 55, 0.35)' : 'none',
              transition: 'all 0.2s'
            }}
          >
            <Crown size={14} style={{ color: '#FACC15' }} /> Gold Tier Premium
          </button>
        </div>
      </div>

      {/* 3D ROTATABLE DIGITAL IDENTITY CARD */}
      <div
        ref={cardRef}
        tabIndex={0}
        role="region"
        aria-label={`Official CivicOne ${isGold ? 'Gold Tier Premium' : 'Normal Citizen'} Digital Identity Card. Press Enter or Space to flip.`}
        className={`card-container-3d ${isFlipped ? 'flipped' : ''}`}
        style={{
          width: '100%',
          aspectRatio: '1.586',
          position: 'relative',
          cursor: 'pointer',
          borderRadius: '18px'
        }}
        onClick={handleFlipCard}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlipCard();
          }
        }}
      >
        <div className="card-inner-3d">

          {/* =========================================================================
              FRONT OF DIGITAL IDENTITY CARD
              ========================================================================= */}
          <div
            className={`card-front-3d ${isGold ? 'card-gold-bg gold-security-pattern-bg' : 'security-pattern-bg'}`}
            style={{
              background: isGold
                ? 'linear-gradient(145deg, #090C12 0%, #121622 45%, #181E2E 75%, #0B0E17 100%)'
                : 'linear-gradient(135deg, #0B1F3A 0%, #073B8C 50%, #0B5ED7 100%)',
              padding: '18px 20px',
              color: '#FFFFFF',
              border: isGold ? '1.5px solid rgba(212, 175, 55, 0.65)' : '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: isGold
                ? '0 20px 45px -10px rgba(0, 0, 0, 0.65), 0 0 25px rgba(212, 175, 55, 0.2)'
                : '0 20px 45px -10px rgba(11, 31, 58, 0.45), 0 0 15px rgba(11, 94, 215, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Shimmer Overlays */}
            <div className={isGold ? 'gold-hologram-shimmer' : 'hologram-shimmer'} />
            
            {/* Holographic Security Strip */}
            <div
              className={isGold ? 'gold-security-strip' : 'hologram-security-strip'}
              style={{ right: '92px' }}
            />

            {/* Fine Guilloche Micro-Security Pattern Overlay (SVG) */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: isGold ? 0.15 : 0.08 }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id={`guilloche-${isGold ? 'gold' : 'blue'}`} width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 20 Q 10 0, 20 20 T 40 20" fill="none" stroke={isGold ? '#D4AF37' : '#93C5FD'} strokeWidth="0.5" />
                  <path d="M20 0 Q 30 20, 20 40 T 20 0" fill="none" stroke={isGold ? '#D4AF37' : '#93C5FD'} strokeWidth="0.5" />
                  <circle cx="20" cy="20" r="8" fill="none" stroke={isGold ? '#D4AF37' : '#93C5FD'} strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#guilloche-${isGold ? 'gold' : 'blue'})`} />
            </svg>

            {/* Microtext Security Header Line */}
            <div className="microtext-security" style={{ color: isGold ? '#D4AF37' : '#93C5FD' }}>
              {isGold
                ? 'CIVICONE GOLD SOVEREIGN PASS • QUANTUM-RESISTANT PROTOCOL • SECURE SOVEREIGN CREDENTIAL • LEVEL 1 VIP ACCESS •'
                : 'CIVICONE SECURE IDENTITY VERIFICATION SYSTEM • NATIONAL DIGITAL IDENTITY FRAMEWORK • AUTHENTICATED CREDENTIAL •'}
            </div>

            {/* CARD HEADER SECTION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
              
              {/* Branding & Sovereign Seal */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: isGold ? 'rgba(212, 175, 55, 0.18)' : 'rgba(255, 255, 255, 0.16)',
                  border: isGold ? '1px solid #D4AF37' : '1px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isGold ? '0 0 10px rgba(212, 175, 55, 0.3)' : 'none'
                }}>
                  {isGold ? (
                    <Crown size={18} style={{ color: '#FACC15' }} />
                  ) : (
                    <ShieldCheck size={18} style={{ color: '#60A5FA' }} />
                  )}
                </div>
                <div>
                  <div style={{
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    letterSpacing: '0.04em',
                    lineHeight: 1.1,
                    color: isGold ? '#F5E7A3' : '#FFFFFF'
                  }}>
                    CivicOne <span style={{ fontSize: '0.7rem', fontWeight: 800, color: isGold ? '#D4AF37' : '#93C5FD' }}>DIGITAL IDENTITY</span>
                  </div>
                  <div style={{
                    fontSize: '0.55rem',
                    color: isGold ? '#C5A059' : '#93C5FD',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700
                  }}>
                    {isGold ? 'Sovereign Gold Pass Protocol' : 'National Verified Citizen ID'}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{
                backgroundColor: isGold ? 'rgba(212, 175, 55, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                border: isGold ? '1px solid #FACC15' : '1px solid #34D399',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '0.65rem',
                fontWeight: 800,
                color: isGold ? '#FEF08A' : '#A7F3D0',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: isGold ? '0 0 10px rgba(234, 179, 8, 0.25)' : '0 2px 6px rgba(0,0,0,0.1)'
              }}>
                {isGold ? '👑 Level Gold Verified' : '🟢 Verified Identity'}
              </div>
            </div>

            {/* CARD MAIN PROFILE BODY */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', margin: '6px 0', zIndex: 2 }}>
              
              {/* Photo in Identity Frame with Micro-Hologram Corner Marks */}
              <div style={{ position: 'relative' }}>
                <img
                  src={photoUrl}
                  alt={citizenName}
                  style={{
                    width: '68px',
                    height: '76px',
                    borderRadius: '10px',
                    objectFit: 'cover',
                    border: isGold ? '2px solid #D4AF37' : '2px solid rgba(255, 255, 255, 0.9)',
                    boxShadow: isGold ? '0 4px 14px rgba(212, 175, 55, 0.35)' : '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                />
                {/* Official Photo Verification Hologram Seal */}
                <div style={{
                  position: 'absolute',
                  bottom: '-3px',
                  right: '-3px',
                  backgroundColor: isGold ? '#090C12' : '#0B1F3A',
                  border: isGold ? '1px solid #FACC15' : '1px solid #60A5FA',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Shield size={11} style={{ color: isGold ? '#FACC15' : '#60A5FA' }} />
                </div>
              </div>

              {/* Citizen Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: isGold ? '#FFFFFF' : '#FFFFFF',
                  letterSpacing: '-0.01em',
                  marginBottom: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {citizenName}
                </h2>

                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: isGold ? '#FDE047' : '#BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span>Civic ID:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 900, letterSpacing: '0.3px' }}>{civicId}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(civicId); }}
                    style={{ background: 'none', color: isGold ? '#FDE047' : '#BFDBFE', border: 'none', padding: 0, cursor: 'pointer', opacity: 0.8 }}
                    title="Copy Civic ID"
                  >
                    <Copy size={11} />
                  </button>
                </div>

                <div style={{ fontSize: '0.675rem', color: isGold ? '#D1D5DB' : 'rgba(255,255,255,0.85)', marginTop: '2px' }}>
                  DOB: <strong>{dob}</strong> &bull; Gender: <strong>{gender}</strong>
                </div>

                <div style={{
                  fontSize: '0.625rem',
                  color: isGold ? '#C5A059' : '#93C5FD',
                  marginTop: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <MapPin size={10} />
                  <span>{jurisdiction}</span>
                </div>
              </div>

              {/* Front Scannable QR Code */}
              <div
                onClick={(e) => { e.stopPropagation(); setShowQrModal(true); }}
                style={{ cursor: 'pointer' }}
                title="Click to expand dynamic scannable QR Code"
              >
                {renderQrCode(46, isGold)}
              </div>
            </div>

            {/* CARD FOOTER & DIGITAL SIGNATURE */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: isGold ? '1px solid rgba(212, 175, 55, 0.35)' : '1px solid rgba(255,255,255,0.2)',
              paddingTop: '6px',
              fontSize: '0.65rem',
              zIndex: 2
            }}>
              
              {/* Bottom Tier Label & PKI Mark */}
              <div>
                <div style={{
                  fontWeight: 900,
                  fontSize: '0.7rem',
                  letterSpacing: '0.06em',
                  color: isGold ? '#FACC15' : '#60A5FA',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {isGold ? <Crown size={12} /> : <ShieldCheck size={12} />}
                  {isGold ? 'GOLD TIER PREMIUM' : 'NORMAL CITIZEN'}
                </div>
                <div style={{
                  fontSize: '0.55rem',
                  color: isGold ? 'rgba(212, 175, 55, 0.75)' : 'rgba(255,255,255,0.6)',
                  fontFamily: 'monospace'
                }}>
                  PKI: {verificationRef}
                </div>
              </div>

              {/* Flip Hint */}
              <div style={{
                fontSize: '0.625rem',
                color: isGold ? '#FEF08A' : '#93C5FD',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}>
                <RotateCw size={11} /> Tap to Flip
              </div>
            </div>

          </div>


          {/* =========================================================================
              BACK OF DIGITAL IDENTITY CARD
              ========================================================================= */}
          <div
            className={`card-back-3d ${isGold ? 'card-gold-bg gold-security-pattern-bg' : 'security-pattern-bg'}`}
            style={{
              background: isGold
                ? 'linear-gradient(145deg, #07090E 0%, #0F131C 50%, #090C12 100%)'
                : 'linear-gradient(135deg, #08162A 0%, #0B1F3A 60%, #073B8C 100%)',
              padding: '16px 18px',
              color: '#FFFFFF',
              border: isGold ? '1.5px solid rgba(212, 175, 55, 0.65)' : '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: isGold
                ? '0 20px 45px -10px rgba(0, 0, 0, 0.65), 0 0 25px rgba(212, 175, 55, 0.2)'
                : '0 20px 45px -10px rgba(11, 31, 58, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Shimmer Overlays */}
            <div className={isGold ? 'gold-hologram-shimmer' : 'hologram-shimmer'} />

            {/* Back Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
              <div style={{
                fontSize: '0.725rem',
                fontWeight: 900,
                color: isGold ? '#FACC15' : '#93C5FD',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <Lock size={13} style={{ color: isGold ? '#FACC15' : '#60A5FA' }} />
                {isGold ? 'GOLD TIER ENHANCED SECURITY' : 'BACKSIDE SECURITY FEATURES'}
              </div>

              <div style={{
                fontSize: '0.625rem',
                fontWeight: 800,
                color: isGold ? '#FEF08A' : '#4ADE80',
                backgroundColor: isGold ? 'rgba(212, 175, 55, 0.2)' : 'rgba(74, 222, 128, 0.15)',
                padding: '2px 8px',
                borderRadius: '12px',
                border: isGold ? '1px solid #D4AF37' : '1px solid #4ADE80'
              }}>
                {isGold ? 'SOVEREIGN TIER-1' : 'AUTHENTICATED'}
              </div>
            </div>

            {/* Back Main Content (Split Grid: Left Features, Right Large QR Code) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', alignItems: 'center', margin: '4px 0', zIndex: 2 }}>
              
              {/* Left Column: Security Specifications */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.675rem' }}>
                
                {isGold ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
                      <Cpu size={12} style={{ color: '#FACC15' }} />
                      <span><strong>Quantum-Resistant Crypto:</strong> PQ-Kyber-1024</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
                      <Crown size={12} style={{ color: '#FACC15' }} />
                      <span><strong>Priority Access:</strong> VIP Fast-Track Clearance</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
                      <Fingerprint size={12} style={{ color: '#FACC15' }} />
                      <span><strong>Multi-Factor Biometrics:</strong> FIDO2 Continuous</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
                      <Radio size={12} style={{ color: '#FACC15' }} />
                      <span><strong>Secure NFC Auth:</strong> Encrypted Type 4</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
                      <ShieldCheck size={12} style={{ color: '#FACC15' }} />
                      <span><strong>Ledger Hash:</strong> <span style={{ fontFamily: 'monospace' }}>{ledgerHash.slice(0, 14)}...</span></span>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
                      <Fingerprint size={12} style={{ color: '#60A5FA' }} />
                      <span><strong>Multi-Factor Biometrics:</strong> Grade A+ Verified</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
                      <Key size={12} style={{ color: '#60A5FA' }} />
                      <span><strong>Blockchain Ledger Hash:</strong> <span style={{ fontFamily: 'monospace' }}>{ledgerHash.slice(0, 14)}...</span></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
                      <Phone size={12} style={{ color: '#F87171' }} />
                      <span><strong>Emergency Contact:</strong> <strong style={{ color: '#FECA57' }}>112</strong> (Helpline)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
                      <Radio size={12} style={{ color: '#60A5FA' }} />
                      <span><strong>NFC Contactless:</strong> ISO/IEC 14443 Type A</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E2E8F0' }}>
                      <ShieldCheck size={12} style={{ color: '#60A5FA' }} />
                      <span><strong>Verification:</strong> Dual-Key PKI Digital Auth</span>
                    </div>
                  </>
                )}

              </div>

              {/* Right Column: Large Dynamic Scannable QR Code */}
              <div
                onClick={(e) => { e.stopPropagation(); setShowQrModal(true); }}
                style={{ textAlign: 'center', cursor: 'pointer' }}
                title="Click to view high-resolution QR modal"
              >
                {renderQrCode(76, isGold)}
                <div style={{ fontSize: '0.55rem', color: isGold ? '#D4AF37' : '#93C5FD', fontWeight: 800, marginTop: '2px' }}>
                  Scan to Verify
                </div>
              </div>
            </div>

            {/* Back Footer */}
            <div style={{
              backgroundColor: isGold ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '0.625rem',
              color: isGold ? '#D4AF37' : '#BFDBFE',
              border: isGold ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 2
            }}>
              <span>Verify at: <strong style={{ color: '#FFFFFF' }}>verify.civicone.gov.in</strong></span>
              <span style={{ fontFamily: 'monospace', color: isGold ? '#FEF08A' : '#FFFFFF' }}>{civicId}</span>
            </div>

          </div>

        </div>
      </div>


      {/* =========================================================================
          CARD ACTION BAR (4 BUTTONS: FLIP CARD | VIEW QR | NFC TAP | SHARE)
          ========================================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginTop: '16px'
      }}>
        
        {/* Button 1: Flip Card */}
        <button
          type="button"
          onClick={handleFlipCard}
          aria-label="Flip Digital Identity Card"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid var(--border-light)',
            borderRadius: '12px',
            padding: '12px 6px',
            fontSize: '0.775rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="hover-card"
        >
          <RotateCw size={18} style={{ color: isGold ? '#D4AF37' : '#0B5ED7' }} />
          <span>Flip Card</span>
        </button>

        {/* Button 2: View QR */}
        <button
          type="button"
          onClick={() => setShowQrModal(true)}
          aria-label="View Enlarged QR Code"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid var(--border-light)',
            borderRadius: '12px',
            padding: '12px 6px',
            fontSize: '0.775rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="hover-card"
        >
          <QrCode size={18} style={{ color: isGold ? '#D4AF37' : '#0B5ED7' }} />
          <span>View QR</span>
        </button>

        {/* Button 3: NFC Tap */}
        <button
          type="button"
          onClick={handleTriggerNfc}
          aria-label="Simulate NFC Tap Contactless Verification"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid var(--border-light)',
            borderRadius: '12px',
            padding: '12px 6px',
            fontSize: '0.775rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="hover-card"
        >
          <Radio size={18} style={{ color: isGold ? '#D4AF37' : '#0B5ED7' }} />
          <span>NFC Tap</span>
        </button>

        {/* Button 4: Share */}
        <button
          type="button"
          onClick={handleShareCard}
          aria-label="Share or Export Identity Card"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1.5px solid var(--border-light)',
            borderRadius: '12px',
            padding: '12px 6px',
            fontSize: '0.775rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="hover-card"
        >
          <Share2 size={18} style={{ color: isGold ? '#D4AF37' : '#0B5ED7' }} />
          <span>Share</span>
        </button>
      </div>


      {/* =========================================================================
          MODAL 1: VIEW ENLARGED HIGH-SECURITY QR LIGHTBOX
          ========================================================================= */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 250,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '440px',
            width: '100%',
            position: 'relative',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            border: isGold ? '2px solid #D4AF37' : '2px solid #DBEAFE'
          }}>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              aria-label="Close QR modal"
              style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', color: '#64748B', cursor: 'pointer', border: 'none', padding: '4px' }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: isGold ? '#B45309' : '#0B5ED7', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', backgroundColor: isGold ? '#FEF3C7' : '#EFF6FF', padding: '4px 12px', borderRadius: '12px', marginBottom: '10px' }}>
              <ShieldCheck size={14} /> OFFICIAL VERIFICATION QR
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>
              {isGold ? 'Gold Tier Cryptographic QR' : 'CivicOne Verification QR Code'}
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '20px' }}>
              Scan with any authorized reader to instantly verify <strong>{citizenName}</strong>'s credential.
            </p>

            {/* High Resolution Scannable QR */}
            <div style={{
              padding: '20px',
              backgroundColor: '#F8FAFC',
              borderRadius: '20px',
              display: 'inline-block',
              marginBottom: '20px',
              border: isGold ? '2px solid #FDE047' : '2px solid #E2E8F0',
              boxShadow: isGold ? '0 8px 24px rgba(212, 175, 55, 0.25)' : '0 4px 16px rgba(0,0,0,0.06)'
            }}>
              {renderQrCode(200, isGold)}
            </div>

            {/* Token Info Box */}
            <div style={{
              fontSize: '0.8rem',
              color: isGold ? '#78350F' : '#073B8C',
              backgroundColor: isGold ? '#FEF9C3' : '#EAF3FF',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '16px',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
              border: isGold ? '1px solid #FDE047' : '1px solid #BFDBFE'
            }}>
              TOKEN: {civicId}
            </div>

            {/* Action Buttons inside QR Modal */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => copyToClipboard(verificationUrl)}
                style={{
                  flex: 1,
                  backgroundColor: copied ? '#198754' : '#0B5ED7',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? 'Link Copied!' : 'Copy Verify URL'}
              </button>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#F1F5F9',
                  color: '#334155',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


      {/* =========================================================================
          MODAL 2: NFC TAP SIMULATION (With Clear Simulation Disclaimer)
          ========================================================================= */}
      {showNfcModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 250,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            position: 'relative',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            border: isGold ? '2px solid #D4AF37' : '2px solid #DBEAFE'
          }}>
            <button
              type="button"
              onClick={() => setShowNfcModal(false)}
              aria-label="Close NFC modal"
              style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', color: '#64748B', cursor: 'pointer', border: 'none' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: isGold ? '#FEF3C7' : '#EFF6FF', color: isGold ? '#B45309' : '#0B5ED7', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '12px' }}>
              <Radio size={14} /> CONTACTLESS TERMINAL
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '6px' }}>
              NFC Contactless Simulation
            </h3>

            {/* Clear Disclaimer as requested */}
            <div style={{
              fontSize: '0.725rem',
              color: '#64748B',
              backgroundColor: '#F8FAFC',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #E2E8F0',
              marginBottom: '20px'
            }}>
              ℹ️ <em>Visual terminal simulation for browsers without direct Web-NFC hardware access.</em>
            </div>

            {nfcScanning && (
              <div style={{ padding: '20px 0' }}>
                <div style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  backgroundColor: isGold ? 'rgba(212, 175, 55, 0.15)' : 'rgba(11, 94, 215, 0.12)',
                  border: isGold ? '3px solid #D4AF37' : '3px solid #0B5ED7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  animation: 'pulseGlow 1.5s infinite ease-in-out'
                }}>
                  <Radio size={42} style={{ color: isGold ? '#D4AF37' : '#0B5ED7' }} />
                </div>
                <div style={{ fontWeight: 800, color: isGold ? '#B45309' : '#0B5ED7', fontSize: '0.9rem' }}>
                  Emitting Contactless Signal...
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                  Hold near sovereign access terminal
                </div>
              </div>
            )}

            {nfcSuccess && (
              <div style={{ padding: '16px 0' }}>
                <div style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  backgroundColor: '#D1E7DD',
                  color: '#0F5132',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto',
                  boxShadow: '0 4px 14px rgba(15, 81, 50, 0.2)'
                }}>
                  <CheckCircle2 size={44} />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0F5132' }}>
                  NFC Terminal Handshake Verified!
                </h4>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#334155',
                  backgroundColor: '#F0FDF4',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #BBF7D0',
                  marginTop: '10px',
                  marginBottom: '20px'
                }}>
                  <strong>Payload:</strong> {selectedTier} Card ({civicId}) validated for contactless transit / venue entry.
                </div>
                <button
                  type="button"
                  onClick={() => setShowNfcModal(false)}
                  style={{
                    width: '100%',
                    backgroundColor: isGold ? '#B45309' : '#0B5ED7',
                    color: '#FFFFFF',
                    padding: '11px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}


      {/* =========================================================================
          MODAL 3: SHARE & EXPORT HIGH-RES PNG CARD
          ========================================================================= */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 250,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '440px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            border: isGold ? '2px solid #D4AF37' : '2px solid #DBEAFE'
          }}>
            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              aria-label="Close Share modal"
              style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', color: '#64748B', cursor: 'pointer', border: 'none' }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isGold ? '#B45309' : '#0B5ED7', fontWeight: 900, fontSize: '1.25rem', marginBottom: '6px' }}>
              <Share2 size={22} /> Share & Export Identity Card
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              Export an official high-resolution image of your <strong>{selectedTier === 'GOLD' ? 'Gold Tier Premium' : 'Normal Citizen'}</strong> card.
            </p>

            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>OFFICIAL VERIFICATION LINK</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0B1F3A', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                {verificationUrl}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Download PNG Button */}
              <button
                type="button"
                onClick={handleDownloadCardImage}
                disabled={downloadingImage}
                style={{
                  width: '100%',
                  backgroundColor: isGold ? '#B45309' : '#0B5ED7',
                  color: '#FFFFFF',
                  padding: '13px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Download size={18} />
                {downloadingImage ? 'Generating High-Res PNG...' : `Download ${selectedTier} Card PNG`}
              </button>

              {/* Copy URL Button */}
              <button
                type="button"
                onClick={() => copyToClipboard(verificationUrl)}
                style={{
                  width: '100%',
                  backgroundColor: copied ? '#198754' : '#F1F5F9',
                  color: copied ? '#FFFFFF' : '#0B1F3A',
                  padding: '11px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? 'Verification Link Copied!' : 'Copy Verification URL'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
