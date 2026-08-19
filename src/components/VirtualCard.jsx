// src/components/VirtualCard.jsx - Official CivicOne Digital Citizen Identity Card
// High-Reliability 3D Card Architecture (Card Wrapper -> Card Inner -> Card Face Front / Back)
// Indian Identity Signature: Deep Indigo (#101B3D) + Ivory (#F8F7F2) + Ashoka Blue (#1A4F9C) + Tricolor Security Filament

import React, { useState } from 'react';
import {
  ShieldCheck, QrCode, RotateCw, Share2, Download, CheckCircle2,
  Copy, X, Radio, MapPin, Calendar, Phone, Lock, Fingerprint,
  ExternalLink, Shield, Key, Sparkles, Check, Info
} from 'lucide-react';

export default function VirtualCard({ citizen = {}, card = {}, onNavigateToVerification, onCardUpdate }) {
  // Single boolean state controlling the 3D flip
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNfcModal, setShowNfcModal] = useState(false);

  const [nfcScanning, setNfcScanning] = useState(false);
  const [nfcSuccess, setNfcSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);

  // Dynamic Citizen Information from authenticated user profile / props
  const civicId = citizen?.citizenId || card?.civicId || citizen?.civicId || 'CIV-AP-710646-823';
  const citizenName = citizen?.fullName || citizen?.name || citizen?.displayName || 'Raghavendra';
  const citizenInitials = citizenName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'RS';
  const dob = citizen?.dob || citizen?.dateOfBirth || '15/08/1995';
  const gender = citizen?.gender || 'Male';
  const state = citizen?.state || 'Andhra Pradesh';
  const jurisdiction = `${state}, India`;
  const validFrom = card?.issueDate || '15/01/2024';
  const validUntil = card?.expiryDate || '14/01/2034';
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

  // NFC Simulation Trigger with Honest Demonstration Feedback
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
          title: `CivicOne Official Digital Citizen Identity - ${citizenName}`,
          text: `Official CivicOne Verified Citizen Identity Card for ${citizenName}. Civic ID: ${civicId}`,
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
    canvas.height = 630; // CR80 standard ID aspect ratio 1.586
    const ctx = canvas.getContext('2d');

    // 1. Background Gradient (Deep Indigo Navy)
    const grad = ctx.createLinearGradient(0, 0, 1000, 630);
    grad.addColorStop(0, '#101B3D');
    grad.addColorStop(0.6, '#1E2F6B');
    grad.addColorStop(1, '#0C1530');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1000, 630);

    // Soft Silver Perimeter Border
    ctx.strokeStyle = '#D9DEE8';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(16, 16, 968, 598);

    // Indian Tricolor Security Filament Line
    const triGrad = ctx.createLinearGradient(16, 105, 984, 105);
    triGrad.addColorStop(0, '#FF9933');
    triGrad.addColorStop(0.33, '#FF9933');
    triGrad.addColorStop(0.33, '#FFFFFF');
    triGrad.addColorStop(0.66, '#FFFFFF');
    triGrad.addColorStop(0.66, '#138808');
    triGrad.addColorStop(1, '#138808');
    ctx.fillStyle = triGrad;
    ctx.fillRect(16, 105, 968, 4);

    // 2. Header
    ctx.fillStyle = '#F8F7F2';
    ctx.font = 'bold 34px Inter, sans-serif';
    ctx.fillText('CIVICONE DIGITAL CITIZEN IDENTITY', 50, 70);

    ctx.fillStyle = '#93C5FD';
    ctx.font = 'bold 15px Inter, sans-serif';
    ctx.fillText('VERIFIED CITIZEN CREDENTIAL • NATIONAL DIGITAL IDENTITY', 50, 95);

    // 3. Status Badge
    ctx.fillStyle = '#064E3B';
    ctx.fillRect(730, 42, 220, 44);
    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 2;
    ctx.strokeRect(730, 42, 220, 44);
    ctx.fillStyle = '#A7F3D0';
    ctx.font = 'bold 16px Inter, sans-serif';
    ctx.fillText('✓ VERIFIED', 780, 70);

    // 4. Citizen Info
    ctx.fillStyle = '#F8F7F2';
    ctx.font = 'bold 42px Inter, sans-serif';
    ctx.fillText(citizenName, 220, 220);

    ctx.fillStyle = '#93C5FD';
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`CIVIC ID: ${civicId}`, 220, 265);

    ctx.fillStyle = '#D9DEE8';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText(`DOB: ${dob}   |   GENDER: ${gender}`, 220, 310);
    ctx.fillText(`STATE / REGION: ${jurisdiction}`, 220, 350);
    ctx.fillText(`VALIDITY: ${validFrom} – ${validUntil}`, 220, 390);

    // 5. Tier Label Bottom
    ctx.fillStyle = '#93C5FD';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText('● NORMAL CITIZEN', 50, 560);

    ctx.fillStyle = 'rgba(217, 222, 232, 0.65)';
    ctx.font = '14px monospace';
    ctx.fillText(`PKI: ${verificationRef} • LEDGER: ${ledgerHash.slice(0, 16)}...`, 50, 590);

    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `CivicOne_Citizen_Card_${civicId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloadingImage(false);
    }, 400);
  };

  // Reusable Scannable Dynamic QR Code
  const renderQrCode = (size = 100, labelUnder = true) => {
    const qrPayload = `https://verify.civicone.gov.in/verify?id=${encodeURIComponent(civicId)}&tier=NORMAL&name=${encodeURIComponent(citizenName)}&v=${encodeURIComponent(ledgerHash.slice(0, 10))}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrPayload)}&color=101B3D&bgcolor=F8F7F2`;

    return (
      <div style={{
        position: 'relative',
        backgroundColor: '#F8F7F2',
        padding: '6px',
        borderRadius: '10px',
        border: '1.5px solid #D9DEE8',
        boxShadow: '0 4px 12px rgba(16, 27, 61, 0.15)',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src={qrUrl}
          alt={`Official QR Code for Civic ID ${civicId}`}
          style={{ width: `${size}px`, height: `${size}px`, display: 'block', borderRadius: '4px' }}
        />
        {labelUnder && (
          <div style={{
            fontSize: '6.5px',
            fontWeight: 900,
            color: '#101B3D',
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            marginTop: '3px',
            whiteSpace: 'nowrap'
          }}>
            SCAN TO VERIFY
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '540px', width: '100%', margin: '0 auto' }}>

      {/* 3D ROTATABLE DIGITAL IDENTITY CARD WRAPPER */}
      <div
        tabIndex={0}
        role="region"
        aria-label="CivicOne Normal Citizen Digital Identity Card. Press Enter or Space to flip."
        className="card-wrapper"
        onClick={handleFlipCard}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlipCard();
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        {/* CARD INNER ELEMENT — Sole element rotated via rotateY(180deg) */}
        <div className={`card-inner ${isFlipped ? 'is-flipped' : ''}`}>

          {/* =========================================================================
              FRONT FACE (Deep Indigo Navy Surface)
              ========================================================================= */}
          <div
            className="card-face card-front security-pattern-bg"
            style={{
              background: 'linear-gradient(135deg, #101B3D 0%, #1E2F6B 55%, #0C1530 100%)',
              padding: '22px 24px',
              color: '#F8F7F2',
              border: '1.5px solid rgba(217, 222, 232, 0.4)',
              boxShadow: '0 20px 45px -10px rgba(16, 27, 61, 0.5), 0 0 15px rgba(26, 79, 156, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Subtle Hologram Shimmer */}
            <div className="hologram-shimmer" />

            {/* Fine Guilloche Micro-Security Pattern Overlay (SVG) */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.07 }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="civic-guilloche" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 20 Q 10 0, 20 20 T 40 20" fill="none" stroke="#D9DEE8" strokeWidth="0.5" />
                  <path d="M20 0 Q 30 20, 20 40 T 20 0" fill="none" stroke="#1A4F9C" strokeWidth="0.5" />
                  <circle cx="20" cy="20" r="7" fill="none" stroke="#38BDF8" strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#civic-guilloche)" />
            </svg>

            {/* CARD HEADER SECTION */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                
                {/* Left: CivicOne Logo & Identity Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(26, 79, 156, 0.4)',
                    border: '1px solid rgba(217, 222, 232, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    <ShieldCheck size={20} style={{ color: '#38BDF8' }} />
                  </div>
                  <div>
                    <div style={{
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      letterSpacing: '0.04em',
                      lineHeight: 1.1,
                      color: '#F8F7F2'
                    }}>
                      CIVICONE <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#93C5FD' }}>DIGITAL CITIZEN IDENTITY</span>
                    </div>
                    <div style={{
                      fontSize: '0.575rem',
                      color: '#38BDF8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontWeight: 700
                    }}>
                      VERIFIED CITIZEN
                    </div>
                  </div>
                </div>

                {/* Right: Compact Verification Badge */}
                <div style={{
                  backgroundColor: 'rgba(19, 136, 8, 0.2)',
                  border: '1.5px solid #34D399',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.675rem',
                  fontWeight: 800,
                  color: '#A7F3D0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                }}>
                  ✓ VERIFIED
                </div>
              </div>

              {/* Signature Indian Tricolor Security Filament Line */}
              <div className="tricolor-filament-line" />
            </div>

            {/* CARD MAIN PROFILE SECTION (Two-Column Layout) */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '4px 0' }}>
              
              {/* Left Column: Official Citizen Sovereign Identity Badge */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div
                  style={{
                    width: '74px',
                    height: '88px', // 4:5 portrait aspect ratio
                    borderRadius: '11px',
                    background: 'linear-gradient(145deg, #1E2F6B 0%, #0F172A 100%)',
                    border: '1.5px solid rgba(217, 222, 232, 0.6)',
                    boxShadow: '0 4px 14px rgba(16, 27, 61, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Subtle Guilloche Circle Backdrop */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'radial-gradient(circle at center, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
                    pointerEvents: 'none'
                  }} />

                  <User size={30} style={{ color: '#38BDF8', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
                  
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 900,
                    color: '#F8F7F2',
                    letterSpacing: '0.08em',
                    lineHeight: 1
                  }}>
                    {citizenInitials}
                  </div>

                  <span style={{
                    fontSize: '0.55rem',
                    color: '#93C5FD',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    CITIZEN
                  </span>
                </div>

                {/* Official Photo Verification Seal Overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: '-3px',
                  right: '-3px',
                  backgroundColor: '#101B3D',
                  border: '1px solid #38BDF8',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Shield size={11} style={{ color: '#38BDF8' }} />
                </div>
              </div>

              {/* Right Column: Citizen Identity Information */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Citizen Full Name */}
                <h2 style={{
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: '#F8F7F2',
                  letterSpacing: '-0.01em',
                  marginBottom: '3px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {citizenName}
                </h2>

                {/* Civic ID with Copy Helper */}
                <div style={{
                  fontSize: '0.775rem',
                  fontWeight: 800,
                  color: '#93C5FD',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '2px'
                }}>
                  <span style={{ color: '#D9DEE8', fontSize: '0.7rem', fontWeight: 700 }}>CIVIC ID:</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 900, letterSpacing: '0.3px', color: '#F8F7F2' }}>{civicId}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(civicId); }}
                    style={{ background: 'none', color: '#93C5FD', border: 'none', padding: 0, cursor: 'pointer', opacity: 0.85 }}
                    title="Copy Civic ID"
                    aria-label="Copy Civic ID"
                  >
                    <Copy size={11} />
                  </button>
                </div>

                {/* DOB & Gender */}
                <div style={{ fontSize: '0.7rem', color: '#D9DEE8', marginBottom: '2px' }}>
                  <span style={{ color: '#93C5FD', fontWeight: 700 }}>DOB:</span> <strong style={{ color: '#F8F7F2' }}>{dob}</strong> &bull; <span style={{ color: '#93C5FD', fontWeight: 700 }}>GENDER:</span> <strong style={{ color: '#F8F7F2' }}>{gender}</strong>
                </div>

                {/* State / Region */}
                <div style={{
                  fontSize: '0.675rem',
                  color: '#38BDF8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <MapPin size={11} />
                  <span><strong>STATE / REGION:</strong> {jurisdiction}</span>
                </div>
              </div>

              {/* Integrated Front QR Code Area */}
              <div
                onClick={(e) => { e.stopPropagation(); setShowQrModal(true); }}
                style={{ cursor: 'pointer', flexShrink: 0 }}
                title="Click to view scannable QR verification modal"
              >
                {renderQrCode(46, true)}
              </div>
            </div>

            {/* CARD FOOTER & DIGITAL CITIZEN SIGNATURE */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: '1px solid rgba(217, 222, 232, 0.25)',
              paddingTop: '6px',
              fontSize: '0.65rem'
            }}>
              
              {/* Left: Citizen Status & Security Reference */}
              <div>
                <div style={{
                  fontWeight: 900,
                  fontSize: '0.725rem',
                  letterSpacing: '0.06em',
                  color: '#93C5FD',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={12} />
                  NORMAL CITIZEN
                </div>
                <div style={{
                  fontSize: '0.55rem',
                  color: 'rgba(217, 222, 232, 0.65)',
                  fontFamily: 'monospace'
                }}>
                  PKI: {verificationRef}
                </div>
              </div>

              {/* Right: Interactive Flip Hint */}
              <div style={{
                fontSize: '0.65rem',
                color: '#38BDF8',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <RotateCw size={11} /> Tap to Flip
              </div>
            </div>

          </div>


          {/* =========================================================================
              BACK FACE (Ivory White #F8F7F2 Surface)
              ========================================================================= */}
          <div
            className="card-face card-back security-pattern-ivory"
            style={{
              backgroundColor: '#F8F7F2',
              padding: '20px 24px',
              color: '#172033',
              border: '1.5px solid #D9DEE8',
              boxShadow: '0 20px 45px -10px rgba(16, 27, 61, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {/* Header Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <div>
                  <div style={{
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    color: '#101B3D',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <Lock size={13} style={{ color: '#1A4F9C' }} />
                    SECURITY & VERIFICATION
                  </div>
                  <div style={{ fontSize: '0.575rem', color: '#64748B', fontWeight: 700 }}>
                    CIVICONE DIGITAL IDENTITY
                  </div>
                </div>

                <div style={{
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  color: '#1A4F9C',
                  backgroundColor: '#EAF3FF',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid #BFDBFE'
                }}>
                  SECURE IDENTITY
                </div>
              </div>

              {/* Signature Indian Tricolor Security Filament Line */}
              <div className="tricolor-filament-line" />
            </div>

            {/* Back Main Content (Split Grid: Left Structured Cards, Right Large QR Code) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '14px', alignItems: 'center', margin: '4px 0' }}>
              
              {/* Left Column: Structured Identity Security Specifications */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.675rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#172033' }}>
                  <Fingerprint size={12} style={{ color: '#1A4F9C' }} />
                  <span><strong>Multi-Factor Identity:</strong> <span style={{ color: '#101B3D' }}>Grade-A Verified</span></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#172033' }}>
                  <Key size={12} style={{ color: '#1A4F9C' }} />
                  <span><strong>Digital Authentication:</strong> <span style={{ color: '#101B3D' }}>Dual-Key PKI Token</span></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#172033' }}>
                  <ShieldCheck size={12} style={{ color: '#1A4F9C' }} />
                  <span><strong>Verification Ref:</strong> <span style={{ fontFamily: 'monospace', color: '#101B3D' }}>{verificationRef.slice(0, 16)}</span></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#172033' }}>
                  <Radio size={12} style={{ color: '#1A4F9C' }} />
                  <span><strong>NFC Authentication:</strong> <span style={{ color: '#101B3D' }}>ISO/IEC 14443 Type A</span></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#172033' }}>
                  <Phone size={12} style={{ color: '#DC2626' }} />
                  <span><strong>Emergency Contact:</strong> <strong style={{ color: '#DC2626' }}>112</strong> (National Helpline)</span>
                </div>
              </div>

              {/* Right Column: Large Dynamic Scannable QR Code */}
              <div
                onClick={(e) => { e.stopPropagation(); setShowQrModal(true); }}
                style={{ textAlign: 'center', cursor: 'pointer' }}
                title="Click to view high-resolution QR modal"
              >
                {renderQrCode(72, true)}
              </div>
            </div>

            {/* Back Footer */}
            <div style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '8px',
              padding: '6px 10px',
              fontSize: '0.625rem',
              color: '#1E2F6B',
              border: '1px solid #DBEAFE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>VERIFY CIVICONE DIGITAL IDENTITY: <strong style={{ color: '#101B3D' }}>verify.civicone.gov.in</strong></span>
              <span style={{ fontFamily: 'monospace', color: '#101B3D', fontWeight: 800 }}>{civicId}</span>
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
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '12px',
            padding: '12px 6px',
            fontSize: '0.775rem',
            fontWeight: 800,
            color: '#101B3D',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 6px rgba(16, 27, 61, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="hover-card"
        >
          <RotateCw size={18} style={{ color: '#1A4F9C' }} />
          <span>Flip Card</span>
        </button>

        {/* Button 2: View QR */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setShowQrModal(true); }}
          aria-label="View Enlarged QR Code"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '12px',
            padding: '12px 6px',
            fontSize: '0.775rem',
            fontWeight: 800,
            color: '#101B3D',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 6px rgba(16, 27, 61, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="hover-card"
        >
          <QrCode size={18} style={{ color: '#1A4F9C' }} />
          <span>View QR</span>
        </button>

        {/* Button 3: NFC Tap */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleTriggerNfc(); }}
          aria-label="Simulate NFC Tap Contactless Verification"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '12px',
            padding: '12px 6px',
            fontSize: '0.775rem',
            fontWeight: 800,
            color: '#101B3D',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 6px rgba(16, 27, 61, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="hover-card"
        >
          <Radio size={18} style={{ color: '#1A4F9C' }} />
          <span>NFC Tap</span>
        </button>

        {/* Button 4: Share */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); handleShareCard(); }}
          aria-label="Share or Export Identity Card"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '12px',
            padding: '12px 6px',
            fontSize: '0.775rem',
            fontWeight: 800,
            color: '#101B3D',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 2px 6px rgba(16, 27, 61, 0.06)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          className="hover-card"
        >
          <Share2 size={18} style={{ color: '#1A4F9C' }} />
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
          backgroundColor: 'rgba(16, 27, 61, 0.82)',
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
            boxShadow: '0 25px 50px rgba(16, 27, 61, 0.35)',
            border: '2px solid #DBEAFE'
          }}>
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              aria-label="Close QR modal"
              style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', color: '#64748B', cursor: 'pointer', border: 'none', padding: '4px' }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#1A4F9C', fontWeight: 900, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', backgroundColor: '#EFF6FF', padding: '4px 12px', borderRadius: '12px', marginBottom: '10px' }}>
              <ShieldCheck size={14} /> OFFICIAL VERIFICATION QR
            </div>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#101B3D', marginBottom: '4px' }}>
              SCAN TO VERIFY THIS CIVICONE DIGITAL IDENTITY
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '20px' }}>
              Scan with any authorized reader to instantly verify <strong>{citizenName}</strong>'s digital identity credential.
            </p>

            {/* High Resolution Scannable QR */}
            <div style={{
              padding: '20px',
              backgroundColor: '#F8F7F2',
              borderRadius: '20px',
              display: 'inline-block',
              marginBottom: '20px',
              border: '2px solid #D9DEE8',
              boxShadow: '0 4px 16px rgba(16, 27, 61, 0.08)'
            }}>
              {renderQrCode(200, false)}
            </div>

            {/* Token Info Box */}
            <div style={{
              fontSize: '0.8rem',
              color: '#1E2F6B',
              backgroundColor: '#EAF3FF',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '16px',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
              border: '1px solid #BFDBFE'
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
                  backgroundColor: copied ? '#198754' : '#1A4F9C',
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
          MODAL 2: NFC TAP SIMULATION (With Honest Demonstration Disclaimer)
          ========================================================================= */}
      {showNfcModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(16, 27, 61, 0.82)',
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
            boxShadow: '0 25px 50px rgba(16, 27, 61, 0.35)',
            border: '2px solid #DBEAFE'
          }}>
            <button
              type="button"
              onClick={() => setShowNfcModal(false)}
              aria-label="Close NFC modal"
              style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', color: '#64748B', cursor: 'pointer', border: 'none' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#EFF6FF', color: '#1A4F9C', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '12px' }}>
              <Radio size={14} /> CONTACTLESS NFC AUTHENTICATION
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#101B3D', marginBottom: '6px' }}>
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
              ℹ️ <em>Visual terminal demonstration for browsers and devices without direct Web-NFC hardware access.</em>
            </div>

            {nfcScanning && (
              <div style={{ padding: '20px 0' }}>
                <div style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(26, 79, 156, 0.12)',
                  border: '3px solid #1A4F9C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  animation: 'pulseGlow 1.5s infinite ease-in-out'
                }}>
                  <Radio size={42} style={{ color: '#1A4F9C' }} />
                </div>
                <div style={{ fontWeight: 800, color: '#1A4F9C', fontSize: '0.9rem' }}>
                  Emitting Contactless Signal...
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                  Hold near sovereign identity terminal
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
                  <strong>Payload:</strong> CivicOne Citizen Card ({civicId}) validated for contactless transit / terminal check-in.
                </div>
                <button
                  type="button"
                  onClick={() => setShowNfcModal(false)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1A4F9C',
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
          backgroundColor: 'rgba(16, 27, 61, 0.82)',
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
            boxShadow: '0 25px 50px rgba(16, 27, 61, 0.35)',
            border: '2px solid #DBEAFE'
          }}>
            <button
              type="button"
              onClick={() => setShowShareModal(false)}
              aria-label="Close Share modal"
              style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', color: '#64748B', cursor: 'pointer', border: 'none' }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1A4F9C', fontWeight: 900, fontSize: '1.25rem', marginBottom: '6px' }}>
              <Share2 size={22} /> Share & Export Citizen Identity Card
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              Export an official high-resolution image of your <strong>CivicOne Digital Citizen Card</strong>.
            </p>

            <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '14px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>OFFICIAL VERIFICATION LINK</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#101B3D', fontFamily: 'monospace', wordBreak: 'break-all' }}>
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
                  backgroundColor: '#1A4F9C',
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
                {downloadingImage ? 'Generating High-Res PNG...' : 'Download Citizen Card PNG'}
              </button>

              {/* Copy URL Button */}
              <button
                type="button"
                onClick={() => copyToClipboard(verificationUrl)}
                style={{
                  width: '100%',
                  backgroundColor: copied ? '#198754' : '#F1F5F9',
                  color: copied ? '#FFFFFF' : '#101B3D',
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
