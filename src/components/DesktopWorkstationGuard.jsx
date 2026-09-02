// src/components/DesktopWorkstationGuard.jsx - High-Security Institutional Clearance Boundary Guard

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, Lock, ArrowRight, Home, AlertTriangle, ShieldCheck,
  Building2, Landmark, Crown
} from 'lucide-react';

/**
 * Device & Viewport boundary detector.
 * Ensures non-workstation endpoints cannot access restricted institutional consoles.
 */
export function useDeviceType() {
  const [deviceInfo, setDeviceInfo] = useState(() => {
    if (typeof window === 'undefined') {
      return { isRestrictedEndpoint: false, width: 1440 };
    }
    const width = window.innerWidth;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isRestricted = width < 1024 || (isMobileUA && width < 1024);
    return {
      isRestrictedEndpoint: isRestricted,
      width
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isRestricted = width < 1024 || (isMobileUA && width < 1024);

      setDeviceInfo({
        isRestrictedEndpoint: isRestricted,
        width
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
 * Secret, high-security barrier that blocks unauthorized handheld/small-screen endpoints
 * without disclosing technical hardware criteria publicly.
 */
export default function DesktopWorkstationGuard({
  children,
  portalType = 'organization', // 'organization' | 'authority' | 'police' | 'admin'
  portalTitle = 'Restricted Portal',
  onSwitchToCitizen,
  onGoBackToLanding
}) {
  const { isRestrictedEndpoint } = useDeviceType();

  // Portal metadata styling & details
  const getPortalMeta = () => {
    switch (portalType) {
      case 'organization':
        return {
          badge: '🔒 RESTRICTED INSTITUTIONAL GATEWAY',
          name: 'Organization Verification Gateway',
          accentColor: '#073B8C',
          icon: Building2
        };
      case 'authority':
        return {
          badge: '🔒 RESTRICTED GOVERNMENT GATEWAY',
          name: 'Government Officer Administration',
          accentColor: '#0B5ED7',
          icon: Landmark
        };
      case 'police':
        return {
          badge: '🔒 LAW ENFORCEMENT RESTRICTED GATEWAY',
          name: 'Police & PCC Investigation Desk',
          accentColor: '#DC2626',
          icon: ShieldAlert
        };
      case 'admin':
      default:
        return {
          badge: '🔒 RESTRICTED MASTER CONTROL TERMINAL',
          name: 'National Super Admin Control Center',
          accentColor: '#4F46E5',
          icon: Crown
        };
    }
  };

  const portalMeta = getPortalMeta();
  const IconComponent = portalMeta.icon;

  // If authorized desktop station, render portal
  if (!isRestrictedEndpoint) {
    return <>{children}</>;
  }

  // If unauthorized endpoint, render strict security restriction notice
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#070F1E',
      backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(15, 30, 60, 0.95) 0%, #040913 100%)',
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
        maxWidth: '640px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
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
              CIVIQONE
            </span>
            <span style={{ display: 'block', fontSize: '0.6rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              National Gateway
            </span>
          </div>
        </div>

        <button
          onClick={onGoBackToLanding}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            color: '#CBD5E1',
            border: '1px solid rgba(255, 255, 255, 0.12)',
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

      {/* Main Security Restriction Card */}
      <div style={{
        maxWidth: '520px',
        width: '100%',
        margin: '24px auto',
        backgroundColor: '#0C182B',
        borderRadius: '24px',
        border: '1.5px solid rgba(255, 255, 255, 0.1)',
        padding: '36px 24px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Ambient Glow */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(220, 38, 38, 0.25) 0%, rgba(12, 24, 43, 0) 70%)',
          pointerEvents: 'none'
        }} />

        {/* Security Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'rgba(220, 38, 38, 0.12)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          padding: '5px 14px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: 800,
          color: '#FCA5A5',
          letterSpacing: '0.04em',
          marginBottom: '22px'
        }}>
          <Lock size={13} />
          {portalMeta.badge}
        </div>

        {/* Lock Graphic */}
        <div style={{
          width: '74px',
          height: '74px',
          borderRadius: '22px',
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: '2px solid rgba(220, 38, 38, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 10px 25px rgba(220, 38, 38, 0.2)'
        }}>
          <ShieldAlert size={38} color="#EF4444" />
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 900,
          color: '#FFFFFF',
          lineHeight: 1.25,
          marginBottom: '10px',
          letterSpacing: '-0.02em'
        }}>
          Access Restricted
        </h1>

        <p style={{
          fontSize: '0.875rem',
          color: '#94A3B8',
          lineHeight: 1.55,
          marginBottom: '26px'
        }}>
          This is a protected operational gateway. Access is strictly limited to authorized personnel with verified institutional credentials.
        </p>

        {/* Security Notices */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          textAlign: 'left',
          marginBottom: '28px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '7px',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#F87171',
              marginTop: '1px'
            }}>
              <Lock size={14} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F1F5F9' }}>
                Authorized Personnel Only
              </div>
              <div style={{ fontSize: '0.725rem', color: '#94A3B8', marginTop: '2px' }}>
                Administrative operations require authenticated institutional terminal clearance.
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '7px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: '#60A5FA',
              marginTop: '1px'
            }}>
              <ShieldCheck size={14} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F1F5F9' }}>
                End-to-End Cryptographic Audit
              </div>
              <div style={{ fontSize: '0.725rem', color: '#94A3B8', marginTop: '2px' }}>
                All access requests are securely authenticated and recorded under National Security standards.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
              boxShadow: '0 8px 24px rgba(11, 94, 215, 0.4)'
            }}
          >
            Return to Citizen Portal <ArrowRight size={18} />
          </button>

          <button
            onClick={onGoBackToLanding}
            style={{
              width: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              color: '#CBD5E1',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '11px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Home size={15} /> CIVIQONE Home
          </button>
        </div>
      </div>

      {/* Footer Notice */}
      <div style={{
        maxWidth: '520px',
        width: '100%',
        margin: '0 auto',
        textAlign: 'center',
        fontSize: '0.7rem',
        color: '#64748B'
      }}>
        Digital India Sovereign Architecture • Protected National Infrastructure
      </div>
    </div>
  );
}
