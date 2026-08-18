// src/components/VirtualCard.jsx - Sleek Modern Digital Civic Card & Dynamic Features

import React, { useState, useRef } from 'react';
import {
  ShieldCheck, QrCode, RotateCw, Share2, Download, CheckCircle2,
  Copy, X, Eye, EyeOff, Radio, Mail, MapPin, Calendar, Phone
} from 'lucide-react';

export default function VirtualCard({ citizen, card, onNavigateToVerification, onCardUpdate }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNfcModal, setShowNfcModal] = useState(false);
  const [showFullAadhaar, setShowFullAadhaar] = useState(false);
  
  const [nfcScanning, setNfcScanning] = useState(false);
  const [nfcSuccess, setNfcSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadingImage, setDownloadingImage] = useState(false);

  const civicId = citizen?.citizenId || card?.civicId || citizen?.civicId || 'CIV-AP-710646-823';
  const cardRef = useRef(null);

  // Simulate NFC Tap Scan
  const handleTriggerNfc = () => {
    setShowNfcModal(true);
    setNfcScanning(true);
    setNfcSuccess(false);

    setTimeout(() => {
      setNfcScanning(false);
      setNfcSuccess(true);
    }, 2000);
  };

  // Real Scannable QR Code generator bound to Civic ID
  const renderQrSvg = (size = 140, idValue = civicId) => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(idValue)}&color=0B1F3A&bgcolor=FFFFFF`;
    return (
      <img
        src={qrUrl}
        alt={`QR Code for ${idValue}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          display: 'block',
          margin: '0 auto',
          backgroundColor: '#FFFFFF',
          padding: '6px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
      />
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate Image Download of Civic Card
  const handleDownloadCardImage = () => {
    setDownloadingImage(true);
    
    // Create an offscreen canvas to render the card image
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 380;
    const ctx = canvas.getContext('2d');

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 600, 380);
    gradient.addColorStop(0, '#0B1F3A');
    gradient.addColorStop(0.5, '#073B8C');
    gradient.addColorStop(1, '#0B5ED7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 380);

    // Card Header
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillText('CivicOne Digital Identity', 30, 45);
    ctx.fillStyle = '#60A5FA';
    ctx.font = '12px Inter, sans-serif';
    ctx.fillText('VERIFIED CITIZEN CREDENTIAL', 30, 65);

    // Name & IDs
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Inter, sans-serif';
    const nameStr = citizen?.fullName || citizen?.name || 'Raghavendra';
    ctx.fillText(nameStr, 30, 140);

    ctx.fillStyle = '#BFDBFE';
    ctx.font = 'bold 16px Monospace, sans-serif';
    ctx.fillText(`Civic ID: ${civicId}`, 30, 175);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Aadhaar: ${citizen?.maskedAadhaar || 'XXXX XXXX 8909'}`, 30, 205);
    ctx.fillText(`DOB: ${citizen?.dob || '15/08/1995'}`, 30, 230);
    ctx.fillText(`Mobile: ${citizen?.mobile || citizen?.phone || '+91 8121280857'}`, 30, 255);
    ctx.fillText(`Email: ${citizen?.email || 'raghavendra@gmail.com'}`, 30, 280);

    // Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '11px Inter, sans-serif';
    ctx.fillText('Official Digital Identity Card — Government of Andhra Pradesh | CivicOne Platform', 30, 345);

    // Convert to Image Download
    setTimeout(() => {
      const link = document.createElement('a');
      link.download = `CivicOne_Card_${civicId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setDownloadingImage(false);
    }, 400);
  };

  return (
    <div style={{ maxWidth: '460px', width: '100%', margin: '0 auto' }}>

      {/* 3D CARD CONTAINER */}
      <div
        ref={cardRef}
        className={`card-container-3d ${isFlipped ? 'flipped' : ''}`}
        style={{ width: '100%', minHeight: '240px', aspectRatio: '1.586', position: 'relative', cursor: 'pointer' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="card-inner-3d">

          {/* FRONT OF VIRTUAL CIVICONE CARD */}
          <div
            className="card-front-3d security-pattern-bg"
            style={{
              background: 'linear-gradient(135deg, #0B1F3A 0%, #073B8C 55%, #0B5ED7 100%)',
              padding: '20px 24px',
              color: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 20px 40px -10px rgba(11, 31, 58, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid rgba(255,255,255,0.25)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Shimmer Overlay */}
            <div className="hologram-shimmer" />

            {/* Card Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={22} style={{ color: '#60A5FA' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.04em', lineHeight: 1, color: '#FFFFFF' }}>
                    CivicOne
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
                    Digital Identity
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{
                backgroundColor: 'rgba(25, 135, 84, 0.25)',
                border: '1px solid rgba(74, 222, 128, 0.4)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.725rem',
                fontWeight: 700,
                color: '#4ADE80',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                🟢 Verified Identity
              </div>
            </div>

            {/* Card Main Profile Section */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '14px 0' }}>
              <img
                src={citizen?.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                alt={citizen?.fullName || 'Citizen'}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '14px',
                  objectFit: 'cover',
                  border: '2px solid rgba(255,255,255,0.9)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                }}
              />

              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em', marginBottom: '4px' }}>
                  {citizen?.fullName || citizen?.name || citizen?.displayName || 'Raghavendra'}
                </h2>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#BFDBFE', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Civic ID: <span style={{ fontFamily: 'monospace', fontWeight: 900, letterSpacing: '0.5px' }}>{civicId}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(civicId); }}
                    style={{ background: 'none', color: '#BFDBFE', opacity: 0.85, cursor: 'pointer', border: 'none', padding: 0 }}
                    title="Copy Civic ID"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Aadhaar: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{showFullAadhaar ? (citizen?.aadhaarNumber || '8121 4981 8909') : (citizen?.maskedAadhaar || 'XXXX XXXX 8909')}</span></span>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowFullAadhaar(!showFullAadhaar); }}
                    style={{ background: 'none', border: 'none', color: '#BFDBFE', cursor: 'pointer', padding: 0, opacity: 0.95, display: 'flex', alignItems: 'center' }}
                    title={showFullAadhaar ? "Hide Aadhaar Number" : "Reveal Aadhaar Number"}
                  >
                    {showFullAadhaar ? <EyeOff size={14} /> : <Eye size={14} />}
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
                  boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
                  cursor: 'pointer'
                }}
                title="Click to view enlarged dynamic QR code"
              >
                {renderQrSvg(46, civicId)}
              </div>
            </div>

            {/* Card Footer Bar */}
            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(255,255,255,0.18)',
              paddingTop: '10px',
              fontSize: '0.725rem',
              color: 'rgba(255,255,255,0.85)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '24px',
                  height: '18px',
                  borderRadius: '4px',
                  background: 'linear-gradient(135deg, #FDE047 0%, #CA8A04 100%)',
                  border: '1px solid #FEF08A'
                }} />
                <span style={{ fontWeight: 600 }}>Valid: {card?.issueDate || "15 Jan 2024"} - {card?.expiryDate || "14 Jan 2034"}</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: '#93C5FD', fontWeight: 700 }}>
                Tap Card to Flip 🔄
              </span>
            </div>

          </div>

          {/* BACK OF VIRTUAL CIVICONE CARD */}
          <div
            className="card-back-3d security-pattern-bg"
            style={{
              background: 'linear-gradient(135deg, #0B1F3A 0%, #0F172A 100%)',
              padding: '20px 24px',
              color: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 20px 40px -10px rgba(11, 31, 58, 0.45)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Registered Identity Details
                </span>
                <span style={{ fontSize: '0.7rem', color: '#4ADE80', fontWeight: 700 }}>
                  CIVIC-SECURE VERIFIED
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: '#E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} style={{ color: '#60A5FA' }} />
                  <span><strong>Date of Birth:</strong> {citizen?.dob || '15-08-1995'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <MapPin size={14} style={{ color: '#60A5FA', marginTop: '2px' }} />
                  <div><strong>Registered Address:</strong> {citizen?.address || 'H.No 12-4-89, M.G. Road, Vijayawada, Andhra Pradesh - 520001'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} style={{ color: '#60A5FA' }} />
                  <span><strong>Mobile Number:</strong> {citizen?.mobile || citizen?.phone || '+91 8121280857'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} style={{ color: '#60A5FA' }} />
                  <span><strong>Email Address:</strong> {citizen?.email || 'raghavendra@gmail.com'}</span>
                </div>
              </div>
            </div>

            {/* Help & Support Contact Footer */}
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.06)',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.725rem',
              color: '#BFDBFE',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between'
            }}>
              <span>For queries or help, please contact us:</span>
              <strong style={{ color: '#FFFFFF' }}>civicone@gmail.com</strong>
            </div>
          </div>

        </div>
      </div>

      {/* CARD ACTION BUTTON BAR (4 BUTTONS: FLIP, VIEW QR, NFC TAP, SHARE) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginTop: '16px'
      }}>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '10px 6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#0B1F3A',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            cursor: 'pointer'
          }}
        >
          <RotateCw size={16} style={{ color: '#0B5ED7' }} /> Flip Card
        </button>

        <button
          onClick={() => setShowQrModal(true)}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '10px 6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#0B1F3A',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            cursor: 'pointer'
          }}
        >
          <QrCode size={16} style={{ color: '#0B5ED7' }} /> View QR
        </button>

        <button
          onClick={handleTriggerNfc}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '10px 6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#0B1F3A',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            cursor: 'pointer'
          }}
        >
          <Radio size={16} style={{ color: '#0B5ED7' }} /> NFC Tap
        </button>

        <button
          onClick={() => setShowShareModal(true)}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '10px 6px',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#0B1F3A',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            cursor: 'pointer'
          }}
        >
          <Share2 size={16} style={{ color: '#0B5ED7' }} /> Share
        </button>
      </div>

      {/* MODAL 1: ENLARGED QR CODE WITH EXACT CIVIC ID */}
      {showQrModal && (
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
            maxWidth: '420px',
            width: '100%',
            position: 'relative',
            textAlign: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <button
              onClick={() => setShowQrModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#64748B', cursor: 'pointer', border: 'none' }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={26} style={{ color: '#0B5ED7' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0B1F3A' }}>
                CivicOne Verification QR Code
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '20px' }}>
              Official cryptographic QR code bound to your Civic ID for instant verification.
            </p>

            <div style={{
              padding: '18px',
              backgroundColor: '#F6F9FC',
              borderRadius: '18px',
              display: 'inline-block',
              marginBottom: '20px',
              border: '2px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
            }}>
              {renderQrSvg(200, civicId)}
            </div>

            <div style={{
              fontSize: '0.85rem',
              color: '#073B8C',
              backgroundColor: '#EAF3FF',
              padding: '12px 16px',
              borderRadius: '12px',
              marginBottom: '16px',
              fontWeight: 800,
              fontFamily: 'monospace',
              letterSpacing: '0.5px'
            }}>
              CIVIC ID TOKEN: {civicId}
            </div>

            <button
              onClick={() => { copyToClipboard(civicId); }}
              style={{
                width: '100%',
                backgroundColor: copied ? '#198754' : '#0B5ED7',
                color: '#FFFFFF',
                padding: '12px',
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
              {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              {copied ? 'Civic ID Copied!' : 'Copy Civic ID Token'}
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
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#64748B', cursor: 'pointer', border: 'none' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '8px' }}>
              NFC Tap Identity Verification
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '24px' }}>
              NFC scanning feature is coming soon for physical terminal tapping.
            </p>

            {nfcScanning && (
              <div style={{ padding: '24px 0' }}>
                <div style={{
                  width: '80px', height: '80px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(11, 94, 215, 0.15)',
                  border: '3px solid #0B5ED7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}>
                  <Radio size={40} style={{ color: '#0B5ED7' }} />
                </div>
                <div style={{ fontWeight: 700, color: '#0B5ED7', fontSize: '0.9rem' }}>
                  Testing NFC Terminal Signal...
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
                  NFC Terminal Simulated!
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px', marginBottom: '20px' }}>
                  Civic ID {civicId} verified for contactless check-in.
                </p>
                <button
                  onClick={() => setShowNfcModal(false)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0B5ED7',
                    color: '#FFFFFF',
                    padding: '10px',
                    borderRadius: '10px',
                    fontWeight: 700,
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

      {/* MODAL 3: SHARE CIVIC CARD IMAGE & TOKEN */}
      {showShareModal && (
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
            maxWidth: '440px',
            width: '100%',
            position: 'relative',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
          }}>
            <button
              onClick={() => setShowShareModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', color: '#64748B', cursor: 'pointer', border: 'none' }}
            >
              <X size={22} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0B5ED7', fontWeight: 900, fontSize: '1.2rem', marginBottom: '8px' }}>
              <Share2 size={24} /> Share Civic Card
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '20px' }}>
              Export or share an official high-resolution image of your Civic Card.
            </p>

            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '16px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>YOUR CIVIC ID TOKEN</div>
              <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0B1F3A', fontFamily: 'monospace' }}>
                {civicId}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleDownloadCardImage}
                disabled={downloadingImage}
                style={{
                  width: '100%',
                  backgroundColor: '#0B5ED7',
                  color: '#FFFFFF',
                  padding: '14px',
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
                <Download size={18} />
                {downloadingImage ? 'Generating Image...' : 'Download Card PNG Image'}
              </button>

              <button
                onClick={() => copyToClipboard(civicId)}
                style={{
                  width: '100%',
                  backgroundColor: copied ? '#198754' : '#F1F5F9',
                  color: copied ? '#FFFFFF' : '#0B1F3A',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                {copied ? 'Civic ID Copied!' : 'Copy Civic ID String'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
