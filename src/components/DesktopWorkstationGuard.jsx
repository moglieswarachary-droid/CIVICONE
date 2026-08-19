// src/components/DesktopWorkstationGuard.jsx - Senior GovTech Desktop Workstation Security Enforcement Guard

import React, { useState, useEffect } from 'react';
import {
  Monitor, Smartphone, ShieldAlert, Lock, ArrowRight, Home, Copy,
  Check, AlertTriangle, ShieldCheck, Building2, Landmark, Crown, RefreshCw
} from 'lucide-react';

/**
 * Custom hook to detect if current viewport or device is mobile / non-desktop.
 * Threshold: < 1024px is considered mobile/tablet where dense desktop multi-column governance layouts are not supported.
 */
export function useDeviceType() {
  const [deviceInfo, setDeviceInfo] = useState(() => {
    if (typeof window === 'undefined') {
      return { isMobile: false, width: 1440, height: 900, isTouch: false };
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isSmallScreen = width < 1024;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return {
      isMobile: isSmallScreen || (isMobileUA && width < 1024),
      width,
      height,
      isTouch,
      isMobileUA
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = width < 1024;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      setDeviceInfo({
        isMobile: isSmallScreen || (isMobileUA && width < 1024),
        width,
        height,
        isTouch,
        isMobileUA
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
}

/**
 * DesktopWorkstationGuard Component
 * Wraps desktop-only portals (Organization, Gov Officer, Police, Super Admin).
 * When accessed from a mobile phone or screen < 1024px, renders an institutional-grade
 * workstation requirement barrier with clear instructions and 1-click switch to Citizen Mobile Portal.
 */
export default function DesktopWorkstationGuard({
  children,
  portalType = 'organization', // 'organization' | 'authority' | 'police' | 'admin'
  portalTitle = 'Administrative Portal',
  onSwitchToCitizen,
  onGoBackToLanding
}) {
  const { isMobile, width, height } = useDeviceType();
  const [copied, setCopied] = useState(false);

  // Portal metadata styling & details
  const getPortalMeta = () => {
    switch (portalType) {
      case 'organization':
        return {
          badge: '🏢 COMMERCIAL & INSTITUTIONAL GATEWAY',
          name: 'Organization Verification Portal',
          accentColor: '#073B8C',
          lightBg: '#EAF3FF',
          icon: Building2,
          securityLevel: 'CORPORATE CKYC LEVEL 2'
        };
      case 'authority':
        return {
          badge: '🏛️ STATUTORY GOVERNMENT PORTAL',
          name: 'Government Officer Administration',
          accentColor: '#0B5ED7',
          lightBg: '#E0F2FE',
          icon: Landmark,
          securityLevel: 'STATUTORY OFFICER CLEARANCE'
        };
      case 'police':
        return {
          badge: '🚨 LAW ENFORCEMENT & VERIFICATION DESK',
          name: 'Police & PCC Investigation Portal',
          accentColor: '#DC2626',
          lightBg: '#FEF2F2',
          icon: ShieldAlert,
          securityLevel: 'LAW ENFORCEMENT RESTRICTED'
        };
      case 'admin':
      default:
        return {
          badge: '👑 MASTER ROOT CONTROL TERMINAL',
          name: 'National Super Admin Control Center',
          accentColor: '#4F46E5',
          lightBg: '#EEF2FF',
          icon: Crown,
          securityLevel: 'MASTER ROOT CLEARANCE'
        };
    }
  };

  const portalMeta = getPortalMeta();
  const IconComponent = portalMeta.icon;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      setCopied(true);
    }
  };

  // If on desktop / widescreen PC (>= 1024px), render the actual portal directly
  if (!isMobile) {
    return <>{children}</>;
  }

  // If on mobile device / screen < 1024px, render the Workstation Guard
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0B1528',
      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(15, 34, 64, 0.95) 0%, #060D19 100%)',
      color: '#FFFFFF',
      fontFamily: 'var(--font-body)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 16px',
      boxSizing: 'border-box'
    }}>
      {/* Top Bar Header */}
      <div style={{
        maxWidth: '680px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#0B5ED7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(11, 94, 215, 0.4)'
          }}>
            <ShieldCheck size={22} color="#FFFFFF" />
          </div>
          <div>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              CivicOne
            </span>
            <span style={{ display: 'block', fontSize: '0.6rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              National Gateway
            </span>
          </div>
        </div>

        <button
          onClick={onGoBackToLanding}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            color: '#CBD5E1',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            padding: '7px 14px',
            borderRadius: '8px',
            fontSize: '0.775rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Home size={14} /> Home
        </button>
      </div>

      {/* Main Guard Card Content */}
      <div style={{
        maxWidth: '560px',
        width: '100%',
        margin: '24px auto',
        backgroundColor: '#0F1E36',
        borderRadius: '24px',
        border: '1.5px solid rgba(255, 255, 255, 0.12)',
        padding: '32px 24px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glowing Ambient Background */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${portalMeta.accentColor}40 0%, rgba(15, 30, 54, 0) 70%)`,
          pointerEvents: 'none'
        }} />

        {/* Portal Identifier Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '5px 14px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: 800,
          color: '#93C5FD',
          letterSpacing: '0.04em',
          marginBottom: '20px'
        }}>
          <IconComponent size={14} />
          {portalMeta.badge}
        </div>

        {/* Visual Workstation Graphic with Restriction Icon */}
        <div style={{
          position: 'relative',
          width: '100px',
          height: '90px',
          margin: '0 auto 20px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '22px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(147, 197, 253, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)'
          }}>
            <Monitor size={42} color="#60A5FA" />
          </div>

          {/* Overlaid Smartphone with Warning Slash */}
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            right: '2px',
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            backgroundColor: '#DC2626',
            border: '2px solid #0F1E36',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.5)'
          }}>
            <Smartphone size={20} color="#FFFFFF" />
          </div>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: '1.6rem',
          fontWeight: 900,
          color: '#FFFFFF',
          lineHeight: 1.25,
          marginBottom: '8px',
          letterSpacing: '-0.02em'
        }}>
          Desktop Workstation Required
        </h1>

        <p style={{
          fontSize: '0.875rem',
          color: '#94A3B8',
          lineHeight: 1.55,
          marginBottom: '24px'
        }}>
          The <strong style={{ color: '#FFFFFF' }}>{portalTitle || portalMeta.name}</strong> contains high-security institutional controls, multi-pane verification consoles, and encrypted audit pipelines.
          For security compliance, this portal is <span style={{ color: '#F87171', fontWeight: 700 }}>accessible exclusively via Desktop Computers &amp; PCs</span>.
        </p>

        {/* Security & Display Compliance Reasons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          textAlign: 'left',
          marginBottom: '26px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: 'rgba(96, 165, 250, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#60A5FA',
              marginTop: '2px'
            }}>
              <Lock size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F1F5F9' }}>
                Statutory Security &amp; DPDP Policy
              </div>
              <div style={{ fontSize: '0.725rem', color: '#94A3B8', marginTop: '2px' }}>
                Administrative data lookup and officer approvals mandate secure intranet desktop terminals to prevent unauthorized handheld access.
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#34D399',
              marginTop: '2px'
            }}>
              <Monitor size={15} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F1F5F9' }}>
                Multi-Pane Verification Workspace
              </div>
              <div style={{ fontSize: '0.725rem', color: '#94A3B8', marginTop: '2px' }}>
                Document side-by-side auditing, CKYC inspection, and FIR dispatch require a minimum widescreen display resolution of 1024px.
              </div>
            </div>
          </div>
        </div>

        {/* Live Device Diagnostics Pill */}
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '12px',
          padding: '10px 14px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          fontSize: '0.725rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FCA5A5' }}>
            <AlertTriangle size={14} />
            <span>Detected: <strong>Mobile Viewport ({width} × {height}px)</strong></span>
          </div>
          <div style={{ color: '#94A3B8' }}>
            Required: <strong style={{ color: '#38BDF8' }}>Desktop PC (≥ 1024px)</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Primary Action: Citizen Mobile Portal */}
          <button
            onClick={onSwitchToCitizen}
            style={{
              width: '100%',
              backgroundColor: '#0B5ED7',
              backgroundImage: 'linear-gradient(135deg, #0B5ED7 0%, #0284C7 100%)',
              color: '#FFFFFF',
              padding: '14px 20px',
              borderRadius: '14px',
              fontWeight: 800,
              fontSize: '0.925rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(11, 94, 215, 0.4)',
              transition: 'transform 0.2s ease, boxShadow 0.2s ease'
            }}
          >
            📱 Switch to Citizen Mobile Portal <ArrowRight size={18} />
          </button>

          {/* Secondary Actions Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              onClick={handleCopyLink}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: copied ? '#34D399' : '#E2E8F0',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '11px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? 'Link Copied!' : 'Copy PC Link'}
            </button>

            <button
              onClick={onGoBackToLanding}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                color: '#E2E8F0',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '11px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Home size={15} /> CivicOne Home
            </button>
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div style={{
        maxWidth: '560px',
        width: '100%',
        margin: '0 auto',
        textAlign: 'center',
        fontSize: '0.7rem',
        color: '#64748B'
      }}>
        Digital India National Identity Architecture • DPDP Act 2023 Workstation Policy
      </div>
    </div>
  );
}
