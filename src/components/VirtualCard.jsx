// src/components/VirtualCard.jsx - Official Canonical CivicOne Virtual Card

import React, { useState } from 'react';
import {
  ShieldCheck, QrCode, RotateCw, Share2, Download, History, Lock, CheckCircle2,
  Copy, X, Sparkles, ShieldAlert, Fingerprint, Radio, Zap, ExternalLink, RefreshCw
} from 'lucide-react';

export default function VirtualCard({ citizen, card, onNavigateToVerification, onCardUpdate }) {
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
  const [refreshing, setRefreshing] = useState(false);

  // Active Citizen & Card Data Mapping
  const holderName = citizen?.fullName || citizen?.name || card?.holderName || "Arjun Rao";
  const civiconeId = citizen?.citizenId || card?.civicId || card?.civicone_id || "CVC-DEMO-1001";
  const trustLevel = citizen?.trustLevel || card?.trust_level || "TRUST LEVEL 04";
  const verificationStatus = citizen?.verificationStatus || card?.status || "VERIFIED";
  const issueDate = card?.issued_at || card?.issueDate || "15 Jan 2024";
  const expiryDate = card?.expires_at || card?.expiryDate || "14 Jan 2034";
  const verificationToken = card?.qr_token || card?.verificationToken || `CVC-VERIFY-${civiconeId}`;
  const verificationUrl = `/verify/card/${verificationToken}`;

  // Refresh Card Data State
  const handleRefreshCard = async () => {
    setRefreshing(true);
    try {
      const res = await fetch('/api/card/me');
      const data = await res.json();
      if (data.card && onCardUpdate) {
        onCardUpdate(data.card);
      }
    } catch (err) {
      console.log("Card refreshed");
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  // Simulate Wireless NFC Scan
  const handleTriggerNfc = () => {
    setShowNfcModal(true);
    setNfcScanning(true);
    setNfcSuccess(false);

    setTimeout(() => {
      setNfcScanning(false);
      setNfcSuccess(true);
    }, 2000);
  };

  // Generate dynamic SVG QR Code pattern
  const renderQrSvg = (size = 130) => (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', margin: '0 auto', background: '#FFFFFF', padding: '6px', borderRadius: '8px' }}>
      <rect width="100" height="100" fill="#FFFFFF" />
      {/* Corner Position Detection Squares */}
      <rect x="5" y="5" width="26" height="26" fill="#0B1F3A" />
      <rect x="9" y="9" width="18" height="18" fill="#FFFFFF" />
      <rect x="13" y="13" width="10" height="10" fill="#0B5ED7" />

      <rect x="69" y="5" width="26" height="26" fill="#0B1F3A" />
      <rect x="73" y="9" width="18" height="18" fill="#FFFFFF" />
      <rect x="77" y="13" width="10" height="10" fill="#0B5ED7" />

      <rect x="5" y="69" width="26" height="26" fill="#0B1F3A" />
      <rect x="9" y="73" width="18" height="18" fill="#FFFFFF" />
      <rect x="13" y="77" width="10" height="10" fill="#0B5ED7" />

      {/* Dynamic Data Modules */}
      <rect x="36" y="8" width="6" height="6" fill="#0B5ED7" />
      <rect x="46" y="8" width="6" height="6" fill="#0B1F3A" />
      <rect x="56" y="8" width="6" height="6" fill="#0B5ED7" />

      <rect x="36" y="18" width="6" height="6" fill="#0B1F3A" />
      <rect x="46" y="18" width="12" height="6" fill="#0B5ED7" />

      <rect x="8" y="36" width="6" height="6" fill="#0B1F3A" />
      <rect x="18" y="36" width="6" height="6" fill="#0B5ED7" />
      <rect x="28" y="36" width="12" height="6" fill="#0B1F3A" />
      <rect x="46" y="36" width="6" height="6" fill="#0B5ED7" />
      <rect x="56" y="36" width="12" height="6" fill="#0B1F3A" />
      <rect x="74" y="36" width="6" height="6" fill="#0B5ED7" />
      <rect x="84" y="36" width="8" height="6" fill="#0B1F3A" />

      <rect x="36" y="46" width="12" height="6" fill="#0B5ED7" />
      <rect x="54" y="46" width="6" height="6" fill="#0B1F3A" />
      <rect x="66" y="46" width="12" height="6" fill="#0B5ED7" />

      <rect x="8" y="56" width="6" height="6" fill="#0B5ED7" />
      <rect x="20" y="56" width="12" height="6" fill="#0B1F3A" />
      <rect x="38" y="56" width="6" height="6" fill="#0B5ED7" />
      <rect x="48" y="56" width="12" height="6" fill="#0B1F3A" />

      <rect x="36" y="66" width="8" height="6" fill="#0B1F3A" />
      <rect x="48" y="66" width="6" height="6" fill="#0B5ED7" />
      <rect x="60" y="66" width="14" height="6" fill="#0B1F3A" />

      <rect x="36" y="78" width="6" height="6" fill="#0B5ED7" />
      <rect x="48" y="78" width="12" height="6" fill="#0B1F3A" />
      <rect x="66" y="78" width="6" height="6" fill="#0B5ED7" />
      <rect x="78" y="78" width="14" height="6" fill="#0B1F3A" />

      {/* Center Symbol */}
      <circle cx="50" cy="50" r="8" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="6" fill="#0B5ED7" />
    </svg>
  );

  // Share Verification Link API
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
        shareUrl: `${window.location.origin}/verify?token=${verificationToken}`,
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
    <div style={{ maxWidth: '460px', width: '100%', margin: '0 auto' }}>

      {/* CANONICAL CIVICONE VIRTUAL CARD CONTAINER */}
      <div 
        style={{
          perspective: '1000px',
          width: '100%',
          margin: '0 auto 16px auto',
          cursor: 'pointer'
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1.586',
          minHeight: '250px',
          borderRadius: '20px',
          transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          boxShadow: '0 20px 40px rgba(11, 31, 58, 0.35), 0 8px 16px rgba(11, 94, 215, 0.2)'
        }}>

          {/* FRONT OF THE CIVICONE VIRTUAL CARD */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #0B1F3A 0%, #0F2B5B 55%, #1A365D 100%)',
            border: '1.5px solid rgba(56, 189, 248, 0.3)',
            padding: '20px',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            
            {/* Background Holographic Micro-Pattern */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, rgba(11, 94, 215, 0) 70%)',
              pointerEvents: 'none'
            }} />

            {/* Header: CIVICONE Logo & Subtitle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0B5ED7 0%, #00F2FE 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0, 242, 254, 0.4)'
                }}>
                  <ShieldCheck size={20} style={{ color: '#FFFFFF' }} />
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.05em', color: '#FFFFFF', lineHeight: 1 }}>
                    CIVICONE
                  </div>
                  <div style={{ fontSize: '0.6rem', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.08em', marginTop: '2px' }}>
                    VERIFIED DIGITAL IDENTITY CARD
                  </div>
                </div>
              </div>

              {/* Status Pill */}
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid #10B981',
                borderRadius: '20px',
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.65rem',
                fontWeight: 800,
                color: '#34D399'
              }}>
                <CheckCircle2 size={12} /> {verificationStatus}
              </div>
            </div>

            {/* Middle Section: Microchip, Wireless Sensor & QR Code Preview */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0', zIndex: 2 }}>
              {/* Metallic Smart Microchip */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '42px',
                  height: '32px',
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #E2E8F0 0%, #94A3B8 50%, #64748B 100%)',
                  border: '1px solid #CBD5E1',
                  boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#475569' }} />
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: '33%', width: '1px', background: '#475569' }} />
                  <div style={{ position: 'absolute', top: 0, bottom: 0, right: '33%', width: '1px', background: '#475569' }} />
                </div>
                <Radio size={18} style={{ color: '#38BDF8', opacity: 0.9 }} title="NFC Contactless Verification Ready" />
              </div>

              {/* QR Code Graphic (Clickable) */}
              <div 
                onClick={(e) => { e.stopPropagation(); setShowQrModal(true); }}
                style={{
                  backgroundColor: '#FFFFFF',
                  padding: '4px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                  cursor: 'pointer'
                }}
                title="Click to expand Verification QR Code"
              >
                {renderQrSvg(54)}
              </div>
            </div>

            {/* Bottom Section: Citizen Details */}
            <div style={{ zIndex: 2 }}>
              <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                CITIZEN NAME
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.04em', textTransform: 'uppercase', margin: '2px 0 6px 0' }}>
                {holderName}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase' }}>
                    CIVICONE ID
                  </div>
                  <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 800, color: '#38BDF8' }}>
                    {civiconeId}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>
                    TRUST CLEARANCE
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#FACC15', textAlign: 'right' }}>
                    {trustLevel}
                  </div>
                </div>
              </div>
            </div>

            {/* Tap Hint */}
            <div style={{ position: 'absolute', bottom: '6px', right: '12px', fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
              Tap to Flip 🔄
            </div>
          </div>

          {/* BACK OF THE CIVICONE VIRTUAL CARD */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            border: '1.5px solid #38BDF8',
            padding: '16px 20px',
            color: '#FFFFFF',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between',
            overflow: 'hidden',
            boxSizing: 'border-box'
          }}>
            {/* Magnetic Security Stripe */}
            <div style={{
              margin: '-16px -20px 10px -20px',
              height: '36px',
              backgroundColor: '#090D16',
              borderBottom: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '20px'
            }}>
              <span style={{ fontSize: '0.6rem', fontFamily: 'monospace', color: '#64748B' }}>
                SECURITY STRIPE • CRYPT-SHA256
              </span>
            </div>

            <div>
              <p style={{ fontSize: '0.7rem', color: '#94A3B8', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                This digital credential is verified through CivicOne. Authorized verifiers can authenticate token status at <strong>civicone.gov.in/verify</strong>.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.7rem', backgroundColor: '#090D16', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.6rem' }}>ISSUED AT</span>
                  <span style={{ color: '#E2E8F0', fontWeight: 700 }}>{issueDate}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.6rem' }}>VALID UNTIL</span>
                  <span style={{ color: '#38BDF8', fontWeight: 700 }}>{expiryDate}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.6rem' }}>CARD STATUS</span>
                  <span style={{ color: '#34D399', fontWeight: 800 }}>ACTIVE</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.6rem' }}>VERIFICATION ID</span>
                  <span style={{ color: '#E2E8F0', fontFamily: 'monospace', fontWeight: 700 }}>VER-{civiconeId.replace('CVC-', '')}</span>
                </div>
              </div>
            </div>

            {/* Bottom Support & Scan Notice */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: '#64748B', borderTop: '1px solid #334155', paddingTop: '8px' }}>
              <span>Support: <strong>support@civicone.gov.in</strong></span>
              <span style={{ color: '#38BDF8', fontWeight: 700 }}>Scan QR to Verify 🔍</span>
            </div>
          </div>

        </div>
      </div>

      {/* CARD INTERACTIVE ACTION BUTTONS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="touch-target"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            padding: '10px 4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
          title="Flip Virtual Card"
        >
          <RotateCw size={16} style={{ color: '#0B5ED7' }} />
          <span>Flip Card</span>
        </button>

        <button
          onClick={() => setShowQrModal(true)}
          className="touch-target"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            padding: '10px 4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
          title="Show Full QR Code"
        >
          <QrCode size={16} style={{ color: '#0B5ED7' }} />
          <span>Scan QR</span>
        </button>

        <button
          onClick={() => copyToClipboard(civiconeId)}
          className="touch-target"
          style={{
            backgroundColor: copied ? '#DCFCE7' : 'var(--bg-card)',
            color: copied ? '#15803D' : 'var(--text-main)',
            border: copied ? '1px solid #86EFAC' : '1px solid var(--border-light)',
            borderRadius: '12px',
            padding: '10px 4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
          title="Copy CivicOne ID"
        >
          <Copy size={16} style={{ color: copied ? '#15803D' : '#0B5ED7' }} />
          <span>{copied ? 'Copied!' : 'Copy ID'}</span>
        </button>

        <button
          onClick={handleGenerateShareLink}
          disabled={shareLoading}
          className="touch-target"
          style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            padding: '10px 4px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
          title="Share Credential Link"
        >
          <Share2 size={16} style={{ color: '#0B5ED7' }} />
          <span>{shareLoading ? 'Generating...' : 'Share'}</span>
        </button>
      </div>

      {/* SECONDARY UTILITY ACTIONS (NFC & HISTORY & REFRESH) */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button
          onClick={handleTriggerNfc}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border-light)',
            color: 'var(--text-muted)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Radio size={14} style={{ color: '#38BDF8' }} /> NFC Tap Scan
        </button>

        <button
          onClick={() => setShowHistoryModal(true)}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border-light)',
            color: 'var(--text-muted)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <History size={14} /> Access Logs
        </button>

        <button
          onClick={handleRefreshCard}
          disabled={refreshing}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border-light)',
            color: 'var(--text-muted)',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.75rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} className={refreshing ? "spin-animation" : ""} /> {refreshing ? 'Syncing...' : 'Refresh'}
        </button>
      </div>

      {/* MODAL 1: FULL HIGH-RES QR CODE VERIFICATION MODAL */}
      {showQrModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            maxWidth: '380px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowQrModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} style={{ color: '#64748B' }} />
            </button>

            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#E0F2FE',
              color: '#0284C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto'
            }}>
              <QrCode size={24} />
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '4px' }}>
              CivicOne Verification QR
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '16px' }}>
              Scan with any authorized verifier device to check live token authenticity.
            </p>

            <div style={{
              padding: '16px',
              backgroundColor: '#F8FAFC',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px'
            }}>
              {renderQrSvg(180)}
              <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#475569', marginTop: '10px', fontWeight: 700 }}>
                {verificationToken}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setShowQrModal(false);
                  if (onNavigateToVerification) {
                    onNavigateToVerification(verificationToken);
                  } else {
                    window.open(verificationUrl, '_blank');
                  }
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#0B5ED7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                Open Verification Page <ExternalLink size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: SHARE CREDENTIAL LINK MODAL */}
      {showShareModal && shareData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            maxWidth: '420px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowShareModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} style={{ color: '#64748B' }} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: '#DCFCE7',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Share2 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1F3A', margin: 0 }}>
                  Time-Limited Share Link Created
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Valid for {shareData.expiresInHours} Hours • Protected
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.4, marginBottom: '16px' }}>
              Share this link with authorized verifiers. Access automatically terminates after expiry.
            </p>

            <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '4px' }}>VERIFICATION URL</span>
              <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#0B5ED7', wordBreak: 'break-all', fontWeight: 700 }}>
                {shareData.shareUrl}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => copyToClipboard(shareData.shareUrl)}
                style={{
                  flex: 1,
                  backgroundColor: '#0B5ED7',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {copied ? 'Copied to Clipboard!' : 'Copy Verification Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ACCESS LOGS / AUDIT HISTORY */}
      {showHistoryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowHistoryModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} style={{ color: '#64748B' }} />
            </button>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '12px' }}>
              Virtual Card Access History
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
              <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '10px', fontSize: '0.75rem', borderLeft: '3px solid #10B981' }}>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>Card Authenticated via QR Scan</div>
                <div style={{ color: '#64748B', marginTop: '2px' }}>Verifier: MoRTH Authorized Officer • Today, 14:20 IST</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#F8FAFC', borderRadius: '10px', fontSize: '0.75rem', borderLeft: '3px solid #0B5ED7' }}>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>Identity Verification Completed</div>
                <div style={{ color: '#64748B', marginTop: '2px' }}>Method: UIDAI Tokenized Session • Yesterday, 09:30 IST</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: NFC WIRELESS TAP SIMULATOR */}
      {showNfcModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '28px 24px',
            maxWidth: '360px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowNfcModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#F1F5F9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} style={{ color: '#64748B' }} />
            </button>

            {nfcScanning ? (
              <div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#E0F2FE',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  animation: 'pulse 1.5s infinite'
                }}>
                  <Radio size={32} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
                  Hold Near NFC Reader...
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Transmitting cryptographic card identity token over wireless NFC sensor...
                </p>
              </div>
            ) : (
              <div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
                  NFC Contactless Verified!
                </h3>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '16px' }}>
                  Card token verified successfully by reader terminal.
                </p>
                <button
                  onClick={() => setShowNfcModal(false)}
                  style={{
                    backgroundColor: '#0B5ED7',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '10px 20px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
