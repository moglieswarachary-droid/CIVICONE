// src/components/organization/AcademicTimeline.jsx - Visual Student Academic Progression Timeline

import React from 'react';
import { GraduationCap, School, BookOpen, Award, CheckCircle2, Lock, Clock } from 'lucide-react';

export default function AcademicTimeline({ academicHistory, eduType = 'college', onToggleLock }) {
  if (!academicHistory) return null;

  const { school, intermediate, college, skills } = academicHistory;

  // Filter timeline items based on scoped access hierarchy
  const timelineItems = [];

  // 1. School (Visible to all)
  if (school) {
    timelineItems.push({
      certKey: '10TH',
      level: 'School / 10th (SSC)',
      icon: <School size={18} color="#0284C7" />,
      color: '#0284C7',
      bgColor: '#E0F2FE',
      institution: school.schoolName,
      details: `${school.board} • Class: ${school.completedClass}`,
      year: school.passingYear,
      certName: school.certName || '10th Secondary Board Marksheet',
      status: school.status || 'VERIFIED',
      locked: school.locked !== false
    });
  }

  // 2. Intermediate / PUC (Visible to PUC, College, Tech)
  if (intermediate && (eduType === 'intermediate' || eduType === 'college' || eduType === 'technology')) {
    timelineItems.push({
      certKey: '12TH',
      level: 'PUC / Intermediate (+12)',
      icon: <BookOpen size={18} color="#7C3AED" />,
      color: '#7C3AED',
      bgColor: '#F3E8FF',
      institution: intermediate.institutionName,
      details: `${intermediate.board} • Stream: ${intermediate.stream}`,
      year: intermediate.passingYear,
      certName: intermediate.certName || '12th Intermediate Marksheet',
      status: intermediate.status || 'VERIFIED',
      locked: intermediate.locked !== false
    });
  }

  // 3. College / University (Visible to College, Tech)
  if (college && (eduType === 'college' || eduType === 'technology')) {
    timelineItems.push({
      certKey: 'DEGREE',
      level: `${college.programType || 'UG'} - ${college.course}`,
      icon: <GraduationCap size={18} color="#059669" />,
      color: '#059669',
      bgColor: '#ECFDF5',
      institution: college.collegeName,
      details: `${college.university} • Dept: ${college.department} (${college.year})`,
      year: college.academicPeriod || '2024 - 2028',
      certName: college.certName || 'Degree Semester Record',
      status: college.status || 'CURRENTLY STUDYING',
      locked: college.locked !== false
    });
  }

  // 4. Skills & Certifications (Visible to Tech & College)
  if (skills && skills.length > 0 && (eduType === 'technology' || eduType === 'college')) {
    skills.forEach((sk) => {
      timelineItems.push({
        certKey: 'SKILL',
        level: `Technical Skill: ${sk.name}`,
        icon: <Award size={18} color="#D97706" />,
        color: '#D97706',
        bgColor: '#FEF3C7',
        institution: sk.institution || 'Govt-Certified Tech Center',
        details: `Cert ID: ${sk.certId} • Level: ${sk.level}`,
        year: sk.issuedDate || '2026',
        certName: 'Skill Certification Badge',
        status: sk.status || 'VERIFIED',
        locked: true
      });
    });
  }

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: '1px solid #E2E8F0',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
    }}>
      <h4 style={{
        fontSize: '0.9rem',
        fontWeight: 800,
        color: '#0F172A',
        marginBottom: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <GraduationCap size={18} color="#059669" /> Verified Student Academic Progression Timeline
      </h4>

      <div style={{ position: 'relative', paddingLeft: '26px' }}>
        {/* Vibrant Gradient Connecting Line */}
        <div style={{
          position: 'absolute',
          left: '10px',
          top: '12px',
          bottom: '24px',
          width: '3px',
          background: 'linear-gradient(180deg, #0284C7 0%, #7C3AED 50%, #059669 100%)',
          borderRadius: '99px',
          zIndex: 0
        }} />

        {timelineItems.map((item, idx) => (
          <div
            key={idx}
            className="animate-fade-slide"
            style={{
              position: 'relative',
              marginBottom: idx === timelineItems.length - 1 ? 0 : '18px',
              zIndex: 1,
              animationDelay: `${idx * 0.1}s`
            }}
          >
            {/* Timeline Node Icon with Ring & Glow */}
            <div style={{
              position: 'absolute',
              left: '-26px',
              top: '4px',
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: item.bgColor,
              border: `2px solid ${item.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 10px ${item.color}40`
            }}>
              {item.icon}
            </div>

            {/* Timeline Card Content */}
            <div
              className="card-hover-lift"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                borderLeft: `4px solid ${item.color}`,
                padding: '12px 16px',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 900, color: item.color, fontFamily: 'var(--font-heading)' }}>
                  {item.level}
                </span>
                <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 700, backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '6px' }}>
                  {item.year}
                </span>
              </div>

              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0F172A' }}>
                {item.institution}
              </div>

              <div style={{ fontSize: '0.775rem', color: '#475569', marginTop: '2px' }}>
                {item.details}
              </div>

              {/* Status and Interactive Lock / Unlock Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  backgroundColor: item.status === 'CURRENTLY STUDYING' ? '#FEF3C7' : '#DCFCE7',
                  color: item.status === 'CURRENTLY STUDYING' ? '#92400E' : '#166534',
                  padding: '3px 9px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <CheckCircle2 size={13} /> {item.status}
                </span>

                {/* Educational Institution Lock / Unlock Action Button */}
                {item.certKey !== 'SKILL' && (
                  <button
                    type="button"
                    onClick={() => onToggleLock && onToggleLock(item.certKey, item.certName)}
                    className="tab-pill-animated"
                    style={{
                      fontSize: '0.725rem',
                      fontWeight: 800,
                      backgroundColor: item.locked ? '#FEF2F2' : '#ECFDF5',
                      color: item.locked ? '#991B1B' : '#065F46',
                      padding: '5px 12px',
                      borderRadius: '10px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      border: `1.5px solid ${item.locked ? '#FCA5A5' : '#A7F3D0'}`,
                      cursor: 'pointer',
                      boxShadow: item.locked ? '0 2px 6px rgba(239, 68, 68, 0.15)' : '0 2px 6px rgba(5, 150, 105, 0.15)'
                    }}
                    title="Click to Lock/Unlock certificate custody via OTP Passkey"
                  >
                    {item.locked ? (
                      <>
                        <Lock size={12} /> 🔒 Locked in CIVICONE Vault (Click to Unlock)
                      </>
                    ) : (
                      <>
                        <Lock size={12} /> 🔑 Unlock / Lock via OTP
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
