// src/components/organization/OrganizationSelector.jsx - Organization Selection Screen per Sector

import React, { useState } from 'react';
import { ArrowLeft, Search, ShieldCheck, CheckCircle2, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { getOrganizationsBySector } from '../../config/organizationConfig.js';

export default function OrganizationSelector({ sector, onSelectOrganization, onGoBackToSectors }) {
  const [searchTerm, setSearchTerm] = useState('');
  const orgs = getOrganizationsBySector(sector.id);

  const filteredOrgs = orgs.filter(o =>
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
      
      {/* Back Button */}
      <button
        onClick={onGoBackToSectors}
        style={{
          background: 'none',
          border: 'none',
          color: '#475569',
          fontSize: '0.875rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          marginBottom: '24px'
        }}
      >
        <ArrowLeft size={18} /> Back to All Sectors
      </button>

      {/* Header Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '2rem' }}>{sector.emoji}</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: '#0B1F3A' }}>
              {sector.title} Organizations
            </h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
            Select an organization type to access its authorized login and verification portal.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            placeholder={`Search ${sector.title}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              borderRadius: '12px',
              border: '1px solid #CBD5E1',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Simulated Integration Notice */}
      <div style={{
        backgroundColor: '#EFF6FF',
        border: '1px solid #BFDBFE',
        borderRadius: '14px',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '32px',
        fontSize: '0.825rem',
        color: '#1E40AF'
      }}>
        <Info size={18} style={{ flexShrink: 0 }} />
        <div>
          <b>Integration Status Notice:</b> Organization interfaces are prototype/simulated integration layers for verification workflows. Direct live connections to official external databases operate via authorized sandbox APIs.
        </div>
      </div>

      {/* Organizations Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
        gap: '20px'
      }}>
        {filteredOrgs.map((org) => (
          <div
            key={org.id}
            onClick={() => onSelectOrganization(org)}
            className="org-card-hover"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              padding: '24px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: sector.badgeBg,
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    fontSize: '1.4rem'
                  }}>
                    {org.logoEmoji}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0B1F3A', lineHeight: 1.2 }}>
                      {org.name}
                    </h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>
                      {org.categoryName}
                    </span>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.675rem',
                  fontWeight: 700,
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  whiteSpace: 'nowrap'
                }}>
                  {org.integrationStatus}
                </span>
              </div>

              <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5, marginBottom: '18px' }}>
                {org.description}
              </p>

              {/* Capabilities Pills */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Verification Capabilities:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {org.capabilities.map((cap, i) => (
                    <span
                      key={i}
                      style={{
                        backgroundColor: '#F8FAFC',
                        color: '#334155',
                        border: '1px solid #E2E8F0',
                        fontSize: '0.725rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      ✓ {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Login CTA */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              paddingTop: '14px',
              borderTop: '1px solid #F1F5F9',
              color: sector.badgeColor,
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              <span>Login &amp; Verify</span>
              <ChevronRight size={16} />
            </div>

          </div>
        ))}
      </div>

      <style>{`
        .org-card-hover:hover {
          transform: translateY(-3px);
          box-shadow: 0 14px 28px rgba(0,0,0,0.06) !important;
          border-color: #BFDBFE !important;
        }
      `}</style>
    </div>
  );
}
