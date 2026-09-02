// src/components/organization/OrganizationSectors.jsx - Top-Level 5-Sector Hub UI

import React from 'react';
import { Landmark, GraduationCap, HeartPulse, Building2, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { ORGANIZATION_SECTORS } from '../../config/organizationConfig.js';

const ICON_MAP = {
  Landmark: Landmark,
  GraduationCap: GraduationCap,
  HeartPulse: HeartPulse,
  Building2: Building2
};

export default function OrganizationSectors({ onSelectSector, onGoBack }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      
      {/* Header Banner */}
      <div style={{
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#EAF3FF',
          color: '#073B8C',
          padding: '6px 18px',
          borderRadius: '20px',
          fontSize: '0.825rem',
          fontWeight: 700,
          marginBottom: '16px',
          border: '1px solid #BFDBFE'
        }}>
          <ShieldCheck size={16} /> CIVIQONE National Organization Verification Network
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.2rem',
          fontWeight: 900,
          color: '#0B1F3A',
          letterSpacing: '-0.02em',
          marginBottom: '10px'
        }}>
          Select Your Organization Sector
        </h2>
        
        <p style={{ fontSize: '0.975rem', color: '#64748B', maxWidth: '640px', margin: '0 auto' }}>
          Choose your sector to access specialized verification tools, attribute-scoped consent requests, and role-authorized dashboards.
        </p>
      </div>

      {/* 5 Sectors Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
        gap: '24px',
        alignItems: 'stretch'
      }}>
        {ORGANIZATION_SECTORS.map((sector) => {
          const IconComp = ICON_MAP[sector.icon] || Building2;

          return (
            <div
              key={sector.id}
              onClick={() => onSelectSector(sector)}
              className="sector-card-hover"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                borderRadius: '20px',
                padding: '28px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Accent Line */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                backgroundColor: sector.badgeColor
              }} />

              <div>
                {/* Badge & Icon Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '16px',
                    backgroundColor: sector.badgeBg,
                    color: sector.badgeColor,
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    boxShadow: `0 6px 16px ${sector.badgeColor}20`
                  }}>
                    <span style={{ fontSize: '1.6rem' }}>{sector.emoji}</span>
                  </div>

                  <span style={{
                    backgroundColor: sector.badgeBg,
                    color: sector.badgeColor,
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: `1px solid ${sector.badgeColor}30`
                  }}>
                    {sector.orgCount} Organizations
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px' }}>
                  {sector.title}
                </h3>

                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.55, marginBottom: '24px' }}>
                  {sector.description}
                </p>
              </div>

              {/* Action Button */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                paddingTop: '16px',
                borderTop: '1px solid #F1F5F9',
                color: sector.badgeColor,
                fontWeight: 800,
                fontSize: '0.9rem'
              }}>
                <span>Explore Organizations</span>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: sector.badgeBg,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center'
                }}>
                  <ChevronRight size={18} />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* CSS Hover Effect */}
      <style>{`
        .sector-card-hover:hover {
          transform: translateY(-5px);
          boxShadow: 0 20px 40px rgba(0,0,0,0.08) !important;
          borderColor: #BFDBFE !important;
        }
      `}</style>
    </div>
  );
}
