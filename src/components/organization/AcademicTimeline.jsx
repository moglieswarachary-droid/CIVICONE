// src/components/organization/AcademicTimeline.jsx - Visual Student Academic Progression Timeline

import React from 'react';
import { GraduationCap, School, BookOpen, Award, CheckCircle2, Lock, Clock } from 'lucide-react';

export default function AcademicTimeline({ academicHistory, eduType = 'college' }) {
  if (!academicHistory) return null;

  const { school, intermediate, college, skills } = academicHistory;

  // Filter timeline items based on scoped access hierarchy
  const timelineItems = [];

  // 1. School (Visible to all)
  if (school) {
    timelineItems.push({
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

      <div style={{ position: 'relative', paddingLeft: '24px' }}>
        {/* Vertical Connecting Line */}
        <div style={{
          position: 'absolute',
          left: '9px',
          top: '10px',
          bottom: '20px',
          width: '2px',
          backgroundColor: '#CBD5E1',
          zIndex: 0
        }} />

        {timelineItems.map((item, idx) => (
          <div
            key={idx}
            style={{
              position: 'relative',
              marginBottom: idx === timelineItems.length - 1 ? 0 : '16px',
              zIndex: 1
            }}
          >
            {/* Timeline Node Icon */}
            <div style={{
              position: 'absolute',
              left: '-24px',
              top: '2px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: item.bgColor,
              border: `2px solid ${item.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {item.icon}
            </div>

            {/* Timeline Card Content */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '10px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: item.color }}>
                  {item.level}
                </span>
                <span style={{ fontSize: '0.725rem', color: '#64748B', fontWeight: 600 }}>
                  {item.year}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                {item.institution}
              </div>

              <div style={{ fontSize: '0.775rem', color: '#475569', marginTop: '2px' }}>
                {item.details}
              </div>

              {/* Status and Lock Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  backgroundColor: item.status === 'CURRENTLY STUDYING' ? '#FEF3C7' : '#DCFCE7',
                  color: item.status === 'CURRENTLY STUDYING' ? '#92400E' : '#166534',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle2 size={12} /> {item.status}
                </span>

                {item.locked && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    backgroundColor: '#EFF6FF',
                    color: '#1E40AF',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: '1px solid #BFDBFE'
                  }}>
                    <Lock size={11} /> Locked in CIVIQONE Vault
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
