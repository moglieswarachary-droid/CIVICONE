// src/components/organization/EmploymentTimeline.jsx - Visual Chronological Employment Timeline Component

import React from 'react';
import { Briefcase, CheckCircle2, Calendar, Clock, Building2, ShieldCheck } from 'lucide-react';

export default function EmploymentTimeline({ history = [], totalExperience = '4 Years 7 Months', relevantExperience = '3 Years 8 Months' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Experience Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        backgroundColor: '#F8FAFC',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid #E2E8F0'
      }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Total Experience</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#7C3AED' }}>{totalExperience}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Relevant Experience</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>{relevantExperience}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 600 }}>Current Tenure</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#166534' }}>7 Months</div>
        </div>
      </div>

      {/* Timeline List */}
      <div style={{ position: 'relative', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Vertical Line */}
        <div style={{
          position: 'absolute',
          left: '9px',
          top: '8px',
          bottom: '8px',
          width: '2px',
          backgroundColor: '#DDD6FE'
        }}></div>

        {history.map((item, idx) => (
          <div key={idx} style={{ position: 'relative' }}>
            
            {/* Timeline Bullet */}
            <div style={{
              position: 'absolute',
              left: '-24px',
              top: '2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: idx === 0 ? '#7C3AED' : '#FFFFFF',
              border: idx === 0 ? '3px solid #DDD6FE' : '3px solid #7C3AED',
              display: 'flex',
              alignItems: 'center',
              justify: 'center'
            }}></div>

            {/* Employment Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #E2E8F0',
              padding: '14px 16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div>
                  <h4 style={{ fontSize: '0.925rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    {item.companyName}
                  </h4>
                  <div style={{ fontSize: '0.775rem', fontWeight: 700, color: '#7C3AED', marginTop: '2px' }}>
                    {item.designation} • <span style={{ color: '#64748B' }}>{item.department || 'Engineering'}</span>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.675rem',
                  fontWeight: 800,
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle2 size={12} /> {item.verificationStatus || '✓ Verified Employment'}
                </span>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '8px' }}>
                <span>📅 <strong>Period:</strong> {item.joiningDate} – {item.leavingDate || 'Present'}</span>
                <span>⏱️ <strong>Duration:</strong> {item.duration || '2 Years'}</span>
                <span>💼 <strong>Type:</strong> {item.employmentType || 'Full Time'}</span>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
