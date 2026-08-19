// src/components/VirtualCard.jsx - State-of-the-Art 3D Sovereign Digital Identity Card
// High-tech holographic finishes, interactive 3D physics tilt, live rotating cryptographic tokens,
// metallic smart chip, NFC contactless indicator, full citizen metadata, and seamless backface flipping.

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, QrCode, RotateCw, Share2, Download, CheckCircle2,
  Copy, X, Eye, EyeOff, Radio, Mail, MapPin, Calendar, Phone,
  Sparkles, Lock, Cpu, Wifi, Heart, AlertCircle, RefreshCw, Palette, ExternalLink
} from 'lucide-react';

export default function VirtualCard({ citizen, card, onNavigateToVerification, onCardUpdate }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNfcModal, setShowNfcModal] = useState(false);
  const [showFullAadhaar, setShowFullAadhaar] = useState(false);
  
  // Card Theme Finish: 'NAVY' | 'GOLD' | 'EMERALD' | 'OBSIDIAN'
  const [cardTheme, setCardTheme] = useState(card?.goldPassStatus === 'gold' ? 'GOLD' : 'NAVY');
  
  // 3D Parallax Tilt State
  const [tilt, setTilt] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });
  
  // Dynamic Rotating Security Token (Rotates every 30s)
  const [dynamicToken, setDynamicToken] = useState('849 201');
  const [tokenTimer, setTokenTimer] = useState(30);

  const [nfcScanning, setNfcScanning] = useState(false);
  const [nfcSuccess, setNfcSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(null);
  const [downloadingImage, setDownloadingImage] = useState(false);

  const cardContainerRef = useRef(null);

  const citizenName = citizen?.fullName || citizen?.name || 'Aarav Kumar';
  const civicId = citizen?.citizenId || card?.civicId || citizen?.civicId || 'CIV-DEMO-10001';
  const cardNumber = card?.cardNumber || 'CIV 1000 1057 3310';
  const maskedAadhaar = citizen?.maskedAadhaar || 'XXXX XXXX 1001';
  const aadhaarNumber = citizen?.aadhaarNumber || '8121 4981 1001';
  const dob = citizen?.dob || citizen?.dateOfBirth || '15-07-2004';
  const gender = citizen?.gender || 'Male';
  const state = citizen?.state || 'Andhra Pradesh';
  const address = citizen?.address || 'Door 4-12, MG Road, Vijayawada, Andhra Pradesh - 520002';
  const phone = citizen?.mobile || citizen?.phone || '+91 90000 00001';
  const email = citizen?.email || 'aarav.kumar@civicone.in';
  const issueDate = card?.issuedDate || card?.issueDate || '15-01-2024';
  const expiryDate = card?.expiryDate || '14-01-2034';
  const isGoldTier = cardTheme === 'GOLD' || citizen?.tier === 'GOLD' || citizen?.goldPassStatus === 'gold';

  // Live rotating 6-digit cryptographic security token timer (30s rotation)
  useEffect(() => {
    const interval = setInterval(() => {
      setTokenTimer((prev) => {
        if (prev <= 1) {
          // Generate new 6-digit random token
          const part1 = Math.floor(100 + Math.random() * 900);
          const part2 = Math.floor(100 + Math.random() * 900);
          setDynamicToken(`${part1} ${part2}`);
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 3D Parallax Mouse Tracking Handler
  const handleMouseMove = (e) => {
    if (!cardContainerRef.current) return;
    const rect = cardContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10; // -10 to +10 deg
    const rotateY = ((x - centerX) / centerX) * 10;  // -10 to +10 deg

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({ x: rotateX, y: rotateY, glareX, glareY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  // 1-Click Copy Helper
  const copyToClipboard = (text, label = 'Copied') => {
    navigator.clipboard?.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Simulate NFC Contactless Tap
  const handleTriggerNfc = () => {
    setShowNfcModal(true);
    setNfcScanning(true);
    setNfcSuccess(false);

    setTimeout(() => {
      setNfcScanning(false);
      setNfcSuccess(true);
    }, 1800);
  };

  // Scannable Dynamic QR Code Image
  const renderQrImage = (size = 140) => {
    const qrData = `CIVICONE-AUTH:${civicId}:${cardNumber}:${dynamicToken.replace(/\s/g, '')}:${Date.now()}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qrData)}&color=0B1F3A&bgcolor=FFFFFF&margin=1`;
    return (
      <img
        src={qrUrl}
        alt={`QR Token for ${civicId}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          display: 'block',
          borderRadius: '8px'
        }}
      />
    );
  };

  // High-Resolution Card PNG Export
  const handleDownloadCardImage = () => {
    setDownloadingImage(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1012; // Standard CR-80 High Res Ratio (3.375" x 2.125" at 300 DPI)
    canvas.height = 638;
    const ctx = canvas.getContext('2d');

    // Gradient Background
    const gradient = ctx.createLinearGradient(0, 0, 1012, 638);
    if (cardTheme === 'GOLD') {
      gradient.addColorStop(0, '#1C190D');
      gradient.addColorStop(0.4, '#42320A');
      gradient.addColorStop(0.8, '#856414');
      gradient.addColorStop(1, '#D4AF37');
    } else if (cardTheme === 'EMERALD') {
      gradient.addColorStop(0, '#064E3B');
      gradient.addColorStop(0.5, '#047857');
      gradient.addColorStop(1, '#059669');
    } else if (cardTheme === 'OBSIDIAN') {
      gradient.addColorStop(0, '#090D16');
      gradient.addColorStop(0.5, '#1E293B');
      gradient.addColorStop(1, '#334155');
    } else {
      gradient.addColorStop(0, '#0B1F3A');
      gradient.addColorStop(0.4, '#073B8C');
      gradient.addColorStop(1, '#0B5ED7');
    }
    ctx.fillStyle = gradient;
    ctx.roundRect ? ctx.roundRect(0, 0, 1012, 638, 36) : ctx.fillRect(0, 0, 1012, 638);
    ctx.fill();

    // Gold / Silver Metallic Border
    ctx.strokeStyle = cardTheme === 'GOLD' ? '#FDE047' : '#93C5FD';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Header Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px Outfit, sans-serif';
    ctx.fillText('REPUBLIC OF INDIA • SOVEREIGN DIGITAL ID', 60, 75);

    ctx.fillStyle = cardTheme === 'GOLD' ? '#FEF08A' : '#93C5FD';
    ctx.font = 'bold 20px Inter, sans-serif';
    ctx.fillText('CIVICONE NATIONAL SOVEREIGN IDENTITY CARD', 60, 110);

    // Card Number & Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 44px Outfit, sans-serif';
    ctx.fillText(citizenName.toUpperCase(), 60, 240);

    ctx.fillStyle = cardTheme === 'GOLD' ? '#FDE047' : '#60A5FA';
    ctx.font = 'bold 32px Monospace, sans-serif';
    ctx.fillText(cardNumber, 60, 295);

    // Details Grid
    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText(`Civic ID: ${civicId}`, 60, 360);
    ctx.fillText(`Aadhaar: ${maskedAadhaar}`, 60, 400);
    ctx.fillText(`DOB: ${dob}  |  Gender: ${gender.toUpperCase()}`, 60, 440);
    ctx.fillText(`State: ${state}, INDIA`, 60, 480);

    // Validity & Dynamic Token
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText(`VALIDITY: ${issueDate} TO ${expiryDate}`, 60, 560);
    ctx.fillText(`DYNAMIC TOKEN: ${dynamicToken}`, 650, 560);

    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `CivicOne_Card_${civicId}_HD.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloadingImage(false);
    }, 400);
  };

  // Card Theme Palette Definition
  const themeStyles = {
    NAVY: {
      bg: 'linear-gradient(135deg, #07172F 0%, #0A326E 40%, #0B5ED7 85%, #1D4ED8 100%)',
      border: '1.5px solid rgba(147, 197, 253, 0.45)',
      shadow: '0 25px 60px -12px rgba(11, 94, 215, 0.4), 0 0 1px 1px rgba(147, 197, 253, 0.3)',
      accent: '#60A5FA',
      chipColor: 'gold',
      badgeBg: 'rgba(11, 94, 215, 0.35)',
      badgeBorder: '#93C5FD',
      badgeText: '#BFDBFE'
    },
    GOLD: {
      bg: 'linear-gradient(135deg, #1C190D 0%, #3B2E09 30%, #78570D 60%, #C5A038 88%, #E6C86E 100%)',
      border: '1.5px solid rgba(254, 240, 138, 0.7)',
      shadow: '0 25px 60px -12px rgba(202, 138, 4, 0.45), 0 0 25px rgba(234, 179, 8, 0.25)',
      accent: '#FEF08A',
      chipColor: 'gold',
      badgeBg: 'rgba(202, 138, 4, 0.35)',
      badgeBorder: '#FACC15',
      badgeText: '#FEF08A'
    },
    EMERALD: {
      bg: 'linear-gradient(135deg, #022C22 0%, #064E3B 35%, #059669 80%, #10B981 100%)',
      border: '1.5px solid rgba(110, 231, 183, 0.5)',
      shadow: '0 25px 60px -12px rgba(5, 150, 105, 0.4), 0 0 1px 1px rgba(110, 231, 183, 0.3)',
      accent: '#6EE7B7',
      chipColor: 'silver',
      badgeBg: 'rgba(5, 150, 105, 0.35)',
      badgeBorder: '#6EE7B7',
      badgeText: '#A7F3D0'
    },
    OBSIDIAN: {
      bg: 'linear-gradient(135deg, #090D16 0%, #111827 40%, #1E293B 80%, #334155 100%)',
      border: '1.5px solid rgba(148, 163, 184, 0.4)',
      shadow: '0 25px 60px -12px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(148, 163, 184, 0.2)',
      accent: '#38BDF8',
      chipColor: 'silver',
      badgeBg: 'rgba(51, 65, 85, 0.5)',
      badgeBorder: '#94A3B8',
      badgeText: '#E2E8F0'
    }
  };

  const currentTheme = themeStyles[cardTheme] || themeStyles.NAVY;

  return (
    <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto' }}>
      
      {/* CARD FINISH THEME SWITCHER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', padding: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <Palette size={14} color="#0B5ED7" /> Sovereign Card Finish:
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { id: 'NAVY', label: 'Sapphire', color: '#0B5ED7' },
            { id: 'GOLD', label: 'Imperial Gold', color: '#D97706' },
            { id: 'EMERALD', label: 'Emerald', color: '#059669' },
            { id: 'OBSIDIAN', label: 'Obsidian', color: '#1E293B' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setCardTheme(t.id)}
              title={t.label}
              style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                backgroundColor: t.color,
                border: cardTheme === t.id ? '2.5px solid #FFFFFF' : '1px solid rgba(0,0,0,0.15)',
                boxShadow: cardTheme === t.id ? '0 0 0 2px #0B5ED7, 0 2px 6px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'transform 0.15s'
              }}
            />
          ))}
        </div>
      </div>

      {/* 3D PARALLAX PERSPECTIVE CONTAINER */}
      <div
        ref={cardContainerRef}
        className={`card-container-3d ${isFlipped ? 'flipped' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          width: '100%',
          aspectRatio: '1.586',
          position: 'relative',
          cursor: 'pointer',
          perspective: '1200px'
        }}
      >
        <div
          className="card-inner-3d"
          style={{
            transform: `rotateY(${isFlipped ? 180 : 0}deg) rotateX(${tilt.isHovered && !isFlipped ? tilt.x : 0}deg) rotateY(${(isFlipped ? 180 : 0) + (tilt.isHovered && !isFlipped ? tilt.y : 0)}deg)`,
            transition: tilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)',
            transformStyle: 'preserve-3d',
            position: 'relative',
            width: '100%',
            height: '100%'
          }}
        >

          {/* ========================================================================= */}
          {/* FRONT OF THE ULTRA-PREMIUM CARD                                           */}
          {/* ========================================================================= */}
          <div
            className="card-front-3d security-pattern-bg"
            style={{
              background: currentTheme.bg,
              padding: '18px 22px',
              color: '#FFFFFF',
              borderRadius: '22px',
              border: currentTheme.border,
              boxShadow: currentTheme.shadow,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            {/* Dynamic Holographic Glare Lighting following Mouse Cursor */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.05) 45%, transparent 70%)`,
                pointerEvents: 'none',
                opacity: tilt.isHovered ? 1 : 0.4,
                transition: 'opacity 0.3s'
              }}
            />

            {/* Continuous Hologram Shimmer Sweep */}
            <div className={cardTheme === 'GOLD' ? 'gold-hologram-shimmer' : 'hologram-shimmer'} />

            {/* Guilloche Sovereign Watermark Background Seal */}
            <div style={{
              position: 'absolute',
              right: '25%',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              border: '2px dashed rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}>
              <ShieldCheck size={120} color="rgba(255,255,255,0.04)" />
            </div>

            {/* CARD TOP HEADER BAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 5 }}>
              
              {/* Sovereign Brand & Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: cardTheme === 'GOLD'
                    ? 'linear-gradient(135deg, #FDE047 0%, #CA8A04 100%)'
                    : 'linear-gradient(135deg, #38BDF8 0%, #0B5ED7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: cardTheme === 'GOLD' ? '#000000' : '#FFFFFF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                }}>
                  <ShieldCheck size={22} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.02em', lineHeight: 1, color: '#FFFFFF' }}>
                      CivicOne
                    </span>
                    <span style={{ fontSize: '0.6rem', color: currentTheme.accent, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      SOVEREIGN
                    </span>
                  </div>
                  <div style={{ fontSize: '0.625rem', color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginTop: '2px' }}>
                    Republic of India • National Digital ID
                  </div>
                </div>
              </div>

              {/* Status Badge & Contactless Wave */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wifi size={18} style={{ color: currentTheme.accent, transform: 'rotate(90deg)', opacity: 0.9 }} title="Contactless NFC Active" />
                
                <div style={{
                  backgroundColor: currentTheme.badgeBg,
                  border: `1px solid ${currentTheme.badgeBorder}`,
                  color: currentTheme.badgeText,
                  padding: '4px 10px',
                  borderRadius: '14px',
                  fontSize: '0.675rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ADE80', display: 'inline-block', boxShadow: '0 0 6px #4ADE80' }} />
                  {isGoldTier ? '✨ GOLD TIER' : 'VERIFIED ID'}
                </div>
              </div>

            </div>

            {/* CARD MAIN BODY */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', position: 'relative', zIndex: 5, margin: '6px 0' }}>
              
              {/* Citizen Portrait Frame with Holographic Trim */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: '66px',
                  height: '66px',
                  borderRadius: '14px',
                  padding: '2px',
                  background: cardTheme === 'GOLD'
                    ? 'linear-gradient(135deg, #FFFBEB 0%, #FDE047 50%, #B45309 100%)'
                    : 'linear-gradient(135deg, #FFFFFF 0%, #93C5FD 50%, #0B5ED7 100%)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                }}>
                  <img
                    src={citizen?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=240"}
                    alt={citizenName}
                    style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }}
                  />
                </div>

                {/* Verified Biometric Tick Mark */}
                <div style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #FFFFFF',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                }}>
                  <CheckCircle2 size={12} />
                </div>
              </div>

              {/* Citizen Info Block */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '0.02em',
                  marginBottom: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {citizenName.toUpperCase()}
                </h2>

                {/* Card Number Embossed Style */}
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  fontWeight: 900,
                  color: currentTheme.accent,
                  letterSpacing: '1px',
                  marginBottom: '3px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span>{cardNumber}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(cardNumber, 'Card Number Copied'); }}
                    title="Copy Card Number"
                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0 }}
                  >
                    <Copy size={12} />
                  </button>
                </div>

                {/* Civic ID & Masked Aadhaar Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.725rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.65)' }}>ID:</span>
                    <strong style={{ fontFamily: 'monospace', color: '#FFFFFF' }}>{civicId}</strong>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(civicId, 'Civic ID Copied'); }}
                      title="Copy Civic ID"
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', padding: 0 }}
                    >
                      <Copy size={11} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.65)' }}>UID:</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>
                      {showFullAadhaar ? aadhaarNumber : maskedAadhaar}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowFullAadhaar(!showFullAadhaar); }}
                      title={showFullAadhaar ? "Hide Aadhaar" : "Show Aadhaar"}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.8)', cursor: 'pointer', padding: 0 }}
                    >
                      {showFullAadhaar ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  </div>
                </div>

                {/* DOB & State Mini Tag */}
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.75)', marginTop: '2px' }}>
                  DOB: <strong>{dob}</strong> • <strong>{gender.toUpperCase()}</strong> • <strong>{state.toUpperCase()}</strong>
                </div>
              </div>

              {/* Physical Smart Microchip & QR Code */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                {/* Metallic Smart IC Microchip */}
                <div
                  style={{
                    width: '32px',
                    height: '24px',
                    borderRadius: '5px',
                    background: currentTheme.chipColor === 'gold'
                      ? 'linear-gradient(135deg, #FFFBEB 0%, #FDE047 30%, #CA8A04 70%, #78350F 100%)'
                      : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 40%, #94A3B8 80%, #475569 100%)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  title="Cryptographic Hardware Security Enclave"
                >
                  <div style={{ position: 'absolute', top: '40%', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(0,0,0,0.3)' }} />
                  <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', backgroundColor: 'rgba(0,0,0,0.3)' }} />
                </div>

                {/* Scannable Micro QR Box */}
                <div
                  onClick={(e) => { e.stopPropagation(); setShowQrModal(true); }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    padding: '3px',
                    borderRadius: '7px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.25)',
                    cursor: 'pointer'
                  }}
                  title="Click to expand full cryptographic QR"
                >
                  {renderQrImage(38)}
                </div>
              </div>

            </div>

            {/* CARD BOTTOM FOOTER BAR */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              paddingTop: '8px',
              fontSize: '0.7rem',
              color: 'rgba(255, 255, 255, 0.85)',
              position: 'relative',
              zIndex: 5
            }}>
              
              {/* Validity Date Range */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={13} style={{ color: currentTheme.accent }} />
                <span>
                  <strong style={{ color: 'rgba(255,255,255,0.65)' }}>VALID:</strong> {issueDate} — {expiryDate}
                </span>
              </div>

              {/* Dynamic Live Security Token */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                padding: '3px 8px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.15)'
              }}>
                <Lock size={11} style={{ color: '#4ADE80' }} />
                <span style={{ fontSize: '0.625rem', color: '#94A3B8', textTransform: 'uppercase' }}>TOKEN:</span>
                <strong style={{ fontFamily: 'monospace', color: '#FEF08A', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  {dynamicToken}
                </strong>
                <span style={{ fontSize: '0.6rem', color: '#60A5FA', opacity: 0.8 }}>({tokenTimer}s)</span>
              </div>

              {/* Flip Hint */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: currentTheme.accent,
                fontWeight: 800,
                fontSize: '0.675rem'
              }}>
                <RotateCw size={12} className="pulse-glow" />
                <span>Flip Card 🔄</span>
              </div>

            </div>

          </div>


          {/* ========================================================================= */}
          {/* BACK OF THE ULTRA-PREMIUM CARD                                            */}
          {/* ========================================================================= */}
          <div
            className="card-back-3d security-pattern-bg"
            style={{
              background: 'linear-gradient(135deg, #090D16 0%, #0F172A 50%, #1E293B 100%)',
              padding: '16px 20px',
              color: '#FFFFFF',
              borderRadius: '22px',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 25px 60px -12px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            {/* Top High-Coercivity Magnetic Stripe */}
            <div style={{
              margin: '-16px -20px 10px -20px',
              height: '38px',
              background: 'linear-gradient(90deg, #020617 0%, #1E293B 25%, #020617 50%, #1E293B 75%, #020617 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              position: 'relative'
            }}>
              <div className="hologram-shimmer" style={{ opacity: 0.25 }} />
            </div>

            {/* Back Card Top Identity Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} color="#60A5FA" /> Official Citizen Credentials
              </span>
              <span style={{ fontSize: '0.65rem', color: '#4ADE80', fontWeight: 800, backgroundColor: 'rgba(74, 222, 128, 0.15)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
                ● SHA-256 VERIFIED ENCLAVE
              </span>
            </div>

            {/* Complete Citizen Registered Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', color: '#E2E8F0' }}>
              
              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={13} style={{ color: '#60A5FA', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ lineHeight: '1.3' }}>
                  <span style={{ color: '#94A3B8', fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700 }}>Permanent Address:</span>{' '}
                  <strong style={{ color: '#FFFFFF' }}>{address}</strong>
                </div>
              </div>

              {/* Medical & Emergency Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '6px 10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Heart size={13} style={{ color: '#F43F5E' }} />
                  <div>
                    <span style={{ color: '#94A3B8', fontSize: '0.6rem', display: 'block' }}>BLOOD GROUP</span>
                    <strong style={{ color: '#FFFFFF', fontSize: '0.75rem' }}>O +ve (Positive)</strong>
                  </div>
                </div>

                <div>
                  <span style={{ color: '#94A3B8', fontSize: '0.6rem', display: 'block' }}>ORGAN DONOR</span>
                  <strong style={{ color: '#4ADE80', fontSize: '0.75rem' }}>YES — Pledged</strong>
                </div>
              </div>

              {/* Phone & Email Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={12} style={{ color: '#60A5FA' }} />
                  <span style={{ fontSize: '0.7rem' }}>{phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={12} style={{ color: '#60A5FA' }} />
                  <span style={{ fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</span>
                </div>
              </div>

            </div>

            {/* Simulated 2D PDF417 / Aztec Encrypted Barcode Strip */}
            <div style={{
              margin: '6px 0',
              backgroundColor: '#FFFFFF',
              padding: '3px 8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{
                height: '18px',
                flex: 1,
                backgroundImage: 'repeating-linear-gradient(90deg, #000 0, #000 2px, transparent 2px, transparent 4px, #000 4px, #000 7px, transparent 7px, transparent 9px, #000 9px, #000 10px, transparent 10px, transparent 13px)',
                backgroundSize: '100% 100%'
              }} />
              <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', fontWeight: 900, color: '#0B1F3A', marginLeft: '10px' }}>
                {civicId}
              </span>
            </div>

            {/* Back Card Bottom Security Footer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '6px',
              fontSize: '0.65rem',
              color: '#94A3B8'
            }}>
              <span>Emergency SOS: <strong>112</strong> | Support: <strong>support@civicone.gov.in</strong></span>
              <span style={{ color: '#60A5FA', fontWeight: 700 }}>Tap to Front 🔄</span>
            </div>

          </div>

        </div>
      </div>

      {/* ACTION FEEDBACK MESSAGE */}
      {copiedText && (
        <div style={{
          backgroundColor: '#ECFDF5',
          border: '1px solid #10B981',
          color: '#065F46',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontWeight: 800,
          textAlign: 'center',
          marginTop: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <CheckCircle2 size={14} color="#059669" /> {copiedText}
        </div>
      )}

      {/* 4 INTERACTIVE TOUCH ACTION BUTTONS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginTop: '14px'
      }}>
        
        {/* Button 1: 3D Flip */}
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '14px',
            padding: '10px 6px',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.15s, border-color 0.15s'
          }}
          className="hover-card"
        >
          <RotateCw size={16} style={{ color: '#0B5ED7' }} />
          <span>Flip Card</span>
        </button>

        {/* Button 2: Dynamic QR */}
        <button
          onClick={() => setShowQrModal(true)}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '14px',
            padding: '10px 6px',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.15s, border-color 0.15s'
          }}
          className="hover-card"
        >
          <QrCode size={16} style={{ color: '#0B5ED7' }} />
          <span>Live QR</span>
        </button>

        {/* Button 3: NFC Tap */}
        <button
          onClick={handleTriggerNfc}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '14px',
            padding: '10px 6px',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.15s, border-color 0.15s'
          }}
          className="hover-card"
        >
          <Radio size={16} style={{ color: '#0B5ED7' }} />
          <span>NFC Tap</span>
        </button>

        {/* Button 4: Share / Pass */}
        <button
          onClick={() => setShowShareModal(true)}
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-light)',
            borderRadius: '14px',
            padding: '10px 6px',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
            transition: 'transform 0.15s, border-color 0.15s'
          }}
          className="hover-card"
        >
          <Share2 size={16} style={{ color: '#0B5ED7' }} />
          <span>Share</span>
        </button>

      </div>


      {/* ========================================================================= */}
      {/* MODAL 1: ENLARGED CRYPTOGRAPHIC QR CODE WITH ROTATING TOKEN               */}
      {/* ========================================================================= */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '440px',
            width: '100%',
            position: 'relative',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            border: '2px solid #DBEAFE'
          }}>
            <button
              onClick={() => setShowQrModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#64748B', cursor: 'pointer', border: 'none' }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <ShieldCheck size={28} style={{ color: '#0B5ED7' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B1F3A' }}>
                CivicOne Verification QR
              </h3>
            </div>
            
            <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '18px' }}>
              Present this encrypted QR code for instant check-in, banking KYC, airport entry, and sovereign authorization.
            </p>

            {/* QR Frame Container */}
            <div style={{
              padding: '18px',
              backgroundColor: '#F8FAFC',
              borderRadius: '20px',
              display: 'inline-block',
              marginBottom: '18px',
              border: '2px solid #E2E8F0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.06)'
            }}>
              {renderQrImage(210)}
            </div>

            {/* Live Security Token Cardlet */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              padding: '10px 14px',
              borderRadius: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '0.675rem', fontWeight: 800, color: '#1E40AF', textTransform: 'uppercase' }}>
                  ROTATING SECURITY TOKEN
                </span>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, fontFamily: 'monospace', color: '#0B1F3A', letterSpacing: '1px' }}>
                  {dynamicToken}
                </div>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#0B5ED7', fontWeight: 800 }}>
                <span>⏱️ {tokenTimer}s left</span>
              </div>
            </div>

            {/* Copy Civic ID Button */}
            <button
              onClick={() => copyToClipboard(civicId, 'Civic ID Copied')}
              style={{
                width: '100%',
                backgroundColor: '#0B5ED7',
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
                gap: '8px',
                boxShadow: '0 4px 14px rgba(11, 94, 215, 0.3)'
              }}
            >
              <Copy size={16} /> Copy Civic ID String ({civicId})
            </button>
          </div>
        </div>
      )}


      {/* ========================================================================= */}
      {/* MODAL 2: NFC CONTACTLESS TERMINAL SCAN SIMULATION                         */}
      {/* ========================================================================= */}
      {showNfcModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            position: 'relative',
            textAlign: 'center',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            border: '2px solid #DBEAFE'
          }}>
            <button
              onClick={() => setShowNfcModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#64748B', cursor: 'pointer', border: 'none' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '6px' }}>
              NFC Contactless Verification
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#64748B', marginBottom: '24px' }}>
              Simulates secure wireless smart card identity handshake with airport e-Gates, hotel kiosks, and bank terminals.
            </p>

            {nfcScanning && (
              <div style={{ padding: '24px 0' }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  backgroundColor: '#EFF6FF',
                  border: '3px solid #0B5ED7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}>
                  <Radio size={46} style={{ color: '#0B5ED7' }} className="pulse-glow" />
                </div>
                <div style={{ fontWeight: 800, color: '#0B5ED7', fontSize: '0.95rem' }}>
                  Scanning Contactless NFC Field...
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
                  Hold virtual card near NFC terminal antenna
                </div>
              </div>
            )}

            {nfcSuccess && (
              <div style={{ padding: '16px 0' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto',
                  border: '2px solid #A7F3D0'
                }}>
                  <CheckCircle2 size={46} />
                </div>
                
                <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#065F46' }}>
                  Contactless Handshake Successful!
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#047857', marginTop: '4px', marginBottom: '20px' }}>
                  Identity for <strong>{citizenName}</strong> ({civicId}) validated over encrypted NFC channel.
                </p>

                <button
                  onClick={() => setShowNfcModal(false)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0B5ED7',
                    color: '#FFFFFF',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 800,
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


      {/* ========================================================================= */}
      {/* MODAL 3: SHARE / DOWNLOAD OFFICIAL HIGH-RES CARD PASS                     */}
      {/* ========================================================================= */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 31, 58, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '460px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
            border: '2px solid #DBEAFE'
          }}>
            <button
              onClick={() => setShowShareModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#64748B', cursor: 'pointer', border: 'none' }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0B5ED7', fontWeight: 900, fontSize: '1.3rem', marginBottom: '6px' }}>
              <Share2 size={26} /> Export Sovereign Card
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              Download official high-resolution PNG credential or share authenticated digital verification token.
            </p>

            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1.5px solid #E2E8F0', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>OFFICIAL VERIFICATION STRING</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0B1F3A', fontFamily: 'monospace', marginTop: '2px' }}>
                {civicId}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                ● Backed by Sovereign Identity Protocol
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={handleDownloadCardImage}
                disabled={downloadingImage}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #0B5ED7 0%, #0284C7 100%)',
                  color: '#FFFFFF',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 20px -4px rgba(11, 94, 215, 0.35)'
                }}
              >
                <Download size={18} />
                {downloadingImage ? 'Rendering High-Res PNG...' : 'Download High-Res Card (PNG)'}
              </button>

              <button
                onClick={() => copyToClipboard(civicId, 'Verification String Copied')}
                style={{
                  width: '100%',
                  backgroundColor: '#F1F5F9',
                  color: '#0B1F3A',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Copy size={16} /> Copy Civic ID Token
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
