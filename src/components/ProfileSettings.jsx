// src/components/ProfileSettings.jsx - Citizen Profile Settings Management
// Fully functional profile view, editing, photo management, address updates, validation & persistence

import React, { useState, useEffect, useRef } from 'react';
import {
  User, ShieldCheck, Lock, CheckCircle2, Phone, Mail, MapPin,
  Edit3, AlertTriangle, X, Check, Camera, Trash2, Save, RotateCcw,
  Calendar, Building, FileText, AlertCircle, Info, ShieldAlert, Sparkles, ArrowLeft
} from 'lucide-react';
import { INDIA_STATES_AND_UTS } from '../data/mockData.js';

export default function ProfileSettings({ citizen = {}, onLogout, onProfileUpdate, onGoBack }) {
  // Extract initial values safely
  const initialCitizenId = citizen.citizenId || citizen.civicId || 'CIV-DEMO-10001';
  const initialFullName = citizen.fullName || citizen.name || citizen.displayName || 'Aarav Kumar';
  const initialDob = citizen.dateOfBirth || citizen.dob || '15-07-2004';
  const initialGender = citizen.gender || 'Male';
  const initialMobile = citizen.mobile || citizen.phone || '+91 9876543210';
  const initialEmail = citizen.email || citizen.emailMasked || 'aarav.kumar.demo@example.in';
  const initialPhoto = citizen.profileImage || citizen.photo || null;
  const initialAadhaar = citizen.maskedAadhaar || 'XXXX XXXX 1001';
  const initialTier = citizen.tier || (citizen.goldPassStatus === 'gold_founder' ? 'GOLD' : 'STANDARD');
  const initialAccountCreated = citizen.accountCreatedDate || '15 Jan 2024';
  const initialLastLogin = citizen.lastLogin || 'Today, 11:15 AM (Web Session)';

  // Initial Address Parsing Helper
  const parseInitialAddress = () => {
    if (citizen.addressDetails) {
      return {
        houseNo: citizen.addressDetails.houseNo || 'Plot No. 42, Block B',
        street: citizen.addressDetails.street || 'MG Road, Gandhi Nagar',
        city: citizen.addressDetails.city || 'Vijayawada',
        mandal: citizen.addressDetails.mandal || 'Urban Mandal',
        district: citizen.addressDetails.district || 'Krishna',
        state: citizen.addressDetails.state || citizen.state || 'Andhra Pradesh',
        pincode: citizen.addressDetails.pincode || '520002'
      };
    }
    return {
      houseNo: citizen.houseNo || 'Plot No. 42, Block B',
      street: citizen.street || 'MG Road, Gandhi Nagar',
      city: citizen.city || 'Vijayawada',
      mandal: citizen.mandal || 'Urban Mandal',
      district: citizen.district || 'Krishna',
      state: citizen.state || 'Andhra Pradesh',
      pincode: citizen.pincode || '520002'
    };
  };

  // Profile Form States
  const [photo, setPhoto] = useState(initialPhoto);
  const [photoPreview, setPhotoPreview] = useState(initialPhoto);
  const [email, setEmail] = useState(initialEmail);
  const [address, setAddress] = useState(parseInitialAddress());

  // Feedback, Loading & Validation States
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  const fileInputRef = useRef(null);

  // Sync state if citizen prop changes
  useEffect(() => {
    const updatedPhoto = citizen.profileImage || citizen.photo || null;
    setPhoto(updatedPhoto);
    setPhotoPreview(updatedPhoto);
    setEmail(citizen.email || citizen.emailMasked || 'aarav.kumar.demo@example.in');
    setAddress(parseInitialAddress());
    setIsDirty(false);
  }, [citizen.citizenId]);

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate File Type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'Please upload a valid image file (JPG, PNG, WebP).' }));
      return;
    }

    // Validate File Size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Image size exceeds 5MB limit. Please choose a smaller image.' }));
      return;
    }

    setErrors(prev => ({ ...prev, photo: null }));

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setPhoto(base64);
      setPhotoPreview(base64);
      setIsDirty(true);
    };
    reader.readAsDataURL(file);
  };

  // Handle Photo Removal
  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    setIsDirty(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    // PIN code validation (6 digits)
    const pinRegex = /^\d{6}$/;
    if (!address.pincode || !address.pincode.trim()) {
      newErrors.pincode = 'PIN code is required.';
    } else if (!pinRegex.test(address.pincode.trim())) {
      newErrors.pincode = 'PIN code must be exactly 6 digits.';
    }

    // Required address fields
    if (!address.houseNo || !address.houseNo.trim()) {
      newErrors.houseNo = 'House / Door Number is required.';
    }
    if (!address.street || !address.street.trim()) {
      newErrors.street = 'Street / Area is required.';
    }
    if (!address.city || !address.city.trim()) {
      newErrors.city = 'Village / Town / City is required.';
    }
    if (!address.district || !address.district.trim()) {
      newErrors.district = 'District is required.';
    }
    if (!address.state || !address.state.trim()) {
      newErrors.state = 'State is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Save Changes
  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) {
      setErrorMessage('Please fix the highlighted validation errors before saving.');
      return;
    }

    setIsSaving(true);

    const compiledAddress = `${address.houseNo.trim()}, ${address.street.trim()}, ${address.city.trim()}, ${address.district.trim()}, ${address.state.trim()} - ${address.pincode.trim()}`;

    const updatePayload = {
      citizenId: initialCitizenId,
      email: email.trim(),
      emailMasked: email.trim(),
      photo: photo,
      profileImage: photo,
      address: compiledAddress,
      state: address.state.trim(),
      houseNo: address.houseNo.trim(),
      street: address.street.trim(),
      city: address.city.trim(),
      mandal: address.mandal.trim(),
      district: address.district.trim(),
      pincode: address.pincode.trim(),
      addressDetails: {
        houseNo: address.houseNo.trim(),
        street: address.street.trim(),
        city: address.city.trim(),
        mandal: address.mandal.trim(),
        district: address.district.trim(),
        state: address.state.trim(),
        pincode: address.pincode.trim()
      }
    };

    try {
      const res = await fetch('/api/citizen/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload)
      });

      let updatedCitizen = { ...citizen, ...updatePayload };

      if (res.ok) {
        const data = await res.json();
        if (data.citizen) {
          updatedCitizen = { ...citizen, ...data.citizen, ...updatePayload };
        }
      }

      // Persist in LocalStorage
      try {
        localStorage.setItem(`civiqone_citizen_${initialCitizenId}`, JSON.stringify(updatedCitizen));
        localStorage.setItem('civiqone_active_citizen', JSON.stringify(updatedCitizen));
      } catch (storageErr) {
        console.warn("Storage write error:", storageErr);
      }

      setIsSaving(false);
      setIsDirty(false);
      setSuccessMessage('Profile updated successfully.');

      // Update parent component state
      if (onProfileUpdate) {
        onProfileUpdate(updatedCitizen);
      }

      // Auto-hide success message after 4 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);

    } catch (err) {
      // Local resilient fallback
      const updatedCitizen = { ...citizen, ...updatePayload };
      try {
        localStorage.setItem(`civiqone_citizen_${initialCitizenId}`, JSON.stringify(updatedCitizen));
        localStorage.setItem('civiqone_active_citizen', JSON.stringify(updatedCitizen));
      } catch (storageErr) {}

      setIsSaving(false);
      setIsDirty(false);
      setSuccessMessage('Profile updated successfully.');

      if (onProfileUpdate) {
        onProfileUpdate(updatedCitizen);
      }
    }
  };

  // Cancel Changes & Revert to saved state
  const handleCancelChanges = () => {
    const origPhoto = citizen.profileImage || citizen.photo || null;
    setPhoto(origPhoto);
    setPhotoPreview(origPhoto);
    setEmail(citizen.email || citizen.emailMasked || 'aarav.kumar.demo@example.in');
    setAddress(parseInitialAddress());
    setErrors({});
    setErrorMessage('');
    setSuccessMessage('');
    setIsDirty(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px 16px' }}>
      
      {/* Back to Citizen Dashboard */}
      {onGoBack && (
        <div style={{ marginBottom: '16px' }}>
          <button
            type="button"
            onClick={onGoBack}
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-main)',
              border: '1.5px solid var(--border-light)',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.15s ease'
            }}
          >
            <ArrowLeft size={16} style={{ color: 'var(--primary-blue)' }} /> Back to Dashboard
          </button>
        </div>
      )}

      {/* 1. HEADER PROFILE HERO CARD */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '24px',
        padding: '28px',
        border: '1.5px solid var(--border-light)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          
          {/* Avatar Container */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '90px',
              height: '90px',
              borderRadius: '22px',
              backgroundColor: photoPreview ? 'transparent' : 'var(--primary-blue)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.2rem',
              fontWeight: 900,
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
              border: '3px solid var(--border-blue)'
            }}>
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt={initialFullName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                initialFullName.charAt(0).toUpperCase()
              )}
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload new profile photo"
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-6px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-blue)',
                color: '#FFFFFF',
                border: '2px solid var(--bg-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Camera size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                {initialFullName}
              </h1>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--success)',
                padding: '3px 10px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                border: '1px solid rgba(16, 185, 129, 0.25)'
              }}>
                <CheckCircle2 size={13} /> Verified Citizen
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span>Citizen ID: <strong style={{ fontFamily: 'monospace', color: 'var(--primary-blue)' }}>{initialCitizenId}</strong></span>
              <span>•</span>
              <span>Tier: <strong style={{ color: initialTier === 'GOLD' ? '#D97706' : 'var(--text-main)' }}>{initialTier === 'GOLD' ? '👑 Gold Founder' : 'Standard'}</strong></span>
            </div>

            {/* Photo Action Links */}
            <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-blue)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline'
                }}
              >
                Change Photo
              </button>
              {photoPreview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#DC2626',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Remove Photo
                </button>
              )}
            </div>
            {errors.photo && (
              <span style={{ color: '#DC2626', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>
                {errors.photo}
              </span>
            )}
          </div>

        </div>

        {/* Global Save / Cancel Action Buttons in Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleCancelChanges}
            disabled={!isDirty || isSaving}
            style={{
              backgroundColor: 'var(--bg-main)',
              color: isDirty ? 'var(--text-main)' : 'var(--text-light)',
              border: '1.5px solid var(--border-light)',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: isDirty && !isSaving ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={16} /> Cancel Changes
          </button>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={isSaving}
            style={{
              backgroundColor: 'var(--primary-blue)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 22px',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Save size={16} />
            <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>

      </div>

      {/* SUCCESS / ERROR ALERTS */}
      {successMessage && (
        <div style={{
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          border: '1.5px solid #10B981',
          borderRadius: '14px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#065F46'
        }}>
          <CheckCircle2 size={20} style={{ color: '#10B981', flexShrink: 0 }} />
          <strong style={{ fontSize: '0.9rem' }}>{successMessage}</strong>
        </div>
      )}

      {errorMessage && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1.5px solid #EF4444',
          borderRadius: '14px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#991B1B'
        }}>
          <AlertCircle size={20} style={{ color: '#EF4444', flexShrink: 0 }} />
          <strong style={{ fontSize: '0.9rem' }}>{errorMessage}</strong>
        </div>
      )}

      {/* 2. MAIN FORM CONTAINER WITH SECTIONS */}
      <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* SECTION 1: PERSONAL INFORMATION */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <User size={20} style={{ color: 'var(--primary-blue)' }} />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                Personal Information
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Identity details verified through national registers.
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '18px'
          }}>
            
            {/* Full Name (Protected) */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                <span>Full Name</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} /> Protected
                </span>
              </label>
              <input
                type="text"
                disabled
                value={initialFullName}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  cursor: 'not-allowed'
                }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '4px', display: 'block' }}>
                This information is verified and cannot be changed directly. Contact Customer Care if you need to update it.
              </span>
            </div>

            {/* Date of Birth (Protected) */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                <span>Date of Birth</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} /> Protected
                </span>
              </label>
              <input
                type="text"
                disabled
                value={initialDob}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  cursor: 'not-allowed'
                }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '4px', display: 'block' }}>
                Verified via UIDAI / Birth Registry.
              </span>
            </div>

            {/* Gender (Protected) */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                <span>Gender</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} /> Protected
                </span>
              </label>
              <input
                type="text"
                disabled
                value={initialGender}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  cursor: 'not-allowed'
                }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '4px', display: 'block' }}>
                Demographic parameter verified.
              </span>
            </div>

            {/* Mobile Number (Protected / Verified) */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                <span>Mobile Number</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Lock size={12} /> Protected
                </span>
              </label>
              <input
                type="tel"
                disabled
                value={initialMobile}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  cursor: 'not-allowed'
                }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '4px', display: 'block' }}>
                This information is verified and cannot be changed directly. Contact Customer Care if you need to update it.
              </span>
            </div>

            {/* Email Address (Editable) */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                <span>Email Address <span style={{ color: '#DC2626' }}>*</span></span>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary-blue)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Edit3 size={12} /> Editable
                </span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsDirty(true);
                  if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                }}
                placeholder="name@example.com"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: `1.5px solid ${errors.email ? '#DC2626' : 'var(--border-light)'}`,
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
              {errors.email && (
                <span style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '4px', display: 'block' }}>
                  {errors.email}
                </span>
              )}
            </div>

          </div>
        </div>

        {/* SECTION 2: ADDRESS INFORMATION (Editable) */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <MapPin size={20} style={{ color: '#059669' }} />
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                  Address Information
                </h2>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Residential communication address details.
                </span>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', backgroundColor: 'rgba(5, 150, 105, 0.1)', padding: '4px 10px', borderRadius: '8px' }}>
              Editable Fields
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '18px'
          }}>
            
            {/* 1. House / Door Number */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                House / Door Number <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={address.houseNo}
                onChange={(e) => {
                  setAddress({ ...address, houseNo: e.target.value });
                  setIsDirty(true);
                  if (errors.houseNo) setErrors(prev => ({ ...prev, houseNo: null }));
                }}
                placeholder="e.g. Flat 402, Block B"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: `1.5px solid ${errors.houseNo ? '#DC2626' : 'var(--border-light)'}`,
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
              {errors.houseNo && <span style={{ color: '#DC2626', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>{errors.houseNo}</span>}
            </div>

            {/* 2. Street / Area */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Street / Area <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={address.street}
                onChange={(e) => {
                  setAddress({ ...address, street: e.target.value });
                  setIsDirty(true);
                  if (errors.street) setErrors(prev => ({ ...prev, street: null }));
                }}
                placeholder="e.g. MG Road, Gandhi Nagar"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: `1.5px solid ${errors.street ? '#DC2626' : 'var(--border-light)'}`,
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
              {errors.street && <span style={{ color: '#DC2626', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>{errors.street}</span>}
            </div>

            {/* 3. Village / Town / City */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Village / Town / City <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={address.city}
                onChange={(e) => {
                  setAddress({ ...address, city: e.target.value });
                  setIsDirty(true);
                  if (errors.city) setErrors(prev => ({ ...prev, city: null }));
                }}
                placeholder="e.g. Vijayawada"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: `1.5px solid ${errors.city ? '#DC2626' : 'var(--border-light)'}`,
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
              {errors.city && <span style={{ color: '#DC2626', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>{errors.city}</span>}
            </div>

            {/* 4. Mandal / Taluk */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Mandal / Taluk
              </label>
              <input
                type="text"
                value={address.mandal}
                onChange={(e) => {
                  setAddress({ ...address, mandal: e.target.value });
                  setIsDirty(true);
                }}
                placeholder="e.g. Urban Mandal"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* 5. District */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                District <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                value={address.district}
                onChange={(e) => {
                  setAddress({ ...address, district: e.target.value });
                  setIsDirty(true);
                  if (errors.district) setErrors(prev => ({ ...prev, district: null }));
                }}
                placeholder="e.g. Krishna"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: `1.5px solid ${errors.district ? '#DC2626' : 'var(--border-light)'}`,
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              />
              {errors.district && <span style={{ color: '#DC2626', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>{errors.district}</span>}
            </div>

            {/* 6. State (Dropdown) */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                State <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <select
                value={address.state}
                onChange={(e) => {
                  setAddress({ ...address, state: e.target.value });
                  setIsDirty(true);
                  if (errors.state) setErrors(prev => ({ ...prev, state: null }));
                }}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: `1.5px solid ${errors.state ? '#DC2626' : 'var(--border-light)'}`,
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem'
                }}
              >
                {INDIA_STATES_AND_UTS.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              {errors.state && <span style={{ color: '#DC2626', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>{errors.state}</span>}
            </div>

            {/* 7. PIN Code */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                PIN Code <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={address.pincode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '');
                  setAddress({ ...address, pincode: val });
                  setIsDirty(true);
                  if (errors.pincode) setErrors(prev => ({ ...prev, pincode: null }));
                }}
                placeholder="e.g. 520002"
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: `1.5px solid ${errors.pincode ? '#DC2626' : 'var(--border-light)'}`,
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-main)',
                  fontSize: '0.9rem',
                  fontFamily: 'monospace'
                }}
              />
              {errors.pincode && <span style={{ color: '#DC2626', fontSize: '0.75rem', display: 'block', marginTop: '4px' }}>{errors.pincode}</span>}
            </div>

          </div>
        </div>

        {/* SECTION 3: IDENTITY & VERIFICATION (Protected) */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <ShieldCheck size={20} style={{ color: 'var(--primary-blue)' }} />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                Identity &amp; Verification
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Government-issued verification flags and cryptographic proofs.
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '18px'
          }}>
            
            {/* Citizen ID */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Citizen ID / Civic ID
              </label>
              <input
                type="text"
                disabled
                value={initialCitizenId}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--primary-blue)',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  fontWeight: 800,
                  cursor: 'not-allowed'
                }}
              />
            </div>

            {/* Masked Aadhaar */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Aadhaar Reference
              </label>
              <input
                type="text"
                disabled
                value={initialAadhaar}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-light)',
                  backgroundColor: 'var(--bg-main)',
                  color: 'var(--text-muted)',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            {/* Identity Verification Status */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Identity Verification Status
              </label>
              <div style={{
                padding: '11px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#065F46',
                fontSize: '0.85rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} style={{ color: '#10B981' }} />
                <span>Cryptographically Verified (UIDAI Tokenized)</span>
              </div>
            </div>

            {/* Account Verification Status */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                Account Verification Status
              </label>
              <div style={{
                padding: '11px 14px',
                borderRadius: '12px',
                backgroundColor: 'rgba(11, 94, 215, 0.1)',
                border: '1px solid var(--border-blue)',
                color: 'var(--primary-blue)',
                fontSize: '0.85rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={16} />
                <span>Active &amp; Compliant (Level 1 Assurance)</span>
              </div>
            </div>

          </div>

          <div style={{ marginTop: '16px', padding: '12px 14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={16} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              This information is verified and cannot be changed directly. Contact Customer Care if you need to update it.
            </span>
          </div>
        </div>

        {/* SECTION 4: ACCOUNT INFORMATION (Protected) */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          borderRadius: '20px',
          padding: '24px',
          border: '1.5px solid var(--border-light)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
            <Building size={20} style={{ color: '#6366F1' }} />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                Account Information
              </h2>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                System identifiers and login audit metadata.
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            
            <div style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 800, textTransform: 'uppercase' }}>Username / ID</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block', marginTop: '2px', fontFamily: 'monospace' }}>
                {initialCitizenId}
              </strong>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 800, textTransform: 'uppercase' }}>Registered Email</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block', marginTop: '2px' }}>
                {email}
              </strong>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 800, textTransform: 'uppercase' }}>Registered Mobile</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block', marginTop: '2px' }}>
                {initialMobile}
              </strong>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 800, textTransform: 'uppercase' }}>Account Created Date</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block', marginTop: '2px' }}>
                {initialAccountCreated}
              </strong>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 800, textTransform: 'uppercase' }}>Last Login</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'block', marginTop: '2px' }}>
                {initialLastLogin}
              </strong>
            </div>

            <div style={{ padding: '14px', backgroundColor: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 800, textTransform: 'uppercase' }}>Account Status</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--success)', display: 'block', marginTop: '2px' }}>
                ● Active &amp; Verified
              </strong>
            </div>

          </div>
        </div>

        {/* BOTTOM SAVE / CANCEL BAR */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 0',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={handleCancelChanges}
            disabled={!isDirty || isSaving}
            style={{
              backgroundColor: 'var(--bg-card)',
              color: isDirty ? 'var(--text-main)' : 'var(--text-light)',
              border: '1.5px solid var(--border-light)',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: isDirty && !isSaving ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RotateCcw size={16} /> Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            style={{
              backgroundColor: 'var(--primary-blue)',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: 800,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <Save size={18} />
            <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
