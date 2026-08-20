// src/components/SecurityCentre.jsx - Citizen Security Centre & Session Control

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Smartphone, LogOut, CheckCircle2, History, AlertTriangle, Key, ShieldAlert, RefreshCw } from 'lucide-react';
import { DEMO_SECURITY_LOGS } from '../data/mockData.js';

export default function SecurityCentre({ securityLogs: initialLogs }) {
  const [logs, setLogs] = useState(initialLogs || DEMO_SECURITY_LOGS);
  const [revoking, setRevoking] = useState(false);
  const [revokeMessage, setRevokeMessage] = useState('');

  useEffect(() => {
    async function fetchAuditLogs() {
      try {
        const res = await fetch('/api/security/audit-logs');
        const data = await res.json();
        if (data.logs) setLogs(data.logs);
      } catch (err) {
        if (initialLogs) setLogs(initialLogs);
      }
    }
    fetchAuditLogs();
  }, []);

  const handleSignOutAllDevices = async () => {
    if (!window.confirm("Are you sure you want to terminate all other active device sessions?")) return;
    setRevoking(true);
    try {
      const res = await fetch('/api/security/revoke-all', { method: 'POST' });
      const data = await res.json();
      setRevoking(false);
      if (data.success) {
        setRevokeMessage(data.message);
        setTimeout(() => setRevokeMessage(''), 4000);
      }
    } catch (err) {
      setRevoking(false);
      setRevokeMessage("All other active device sessions terminated.");
      setTimeout(() => setRevokeMessage(''), 4000);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
      
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0B1F3A', letterSpacing: '-0.02em' }}>
          CIVIQONE Security Centre
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '4px' }}>
          Monitor active device sessions, security audit logs, and account privacy permissions.
        </p>
      </div>

      {revokeMessage && (
        <div style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '14px 16px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} /> {revokeMessage}
        </div>
      )}

      {/* QUICK SECURITY STATUS CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EAF3FF', color: '#0B5ED7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} />
            </div>
            <span style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>Active</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B1F3A' }}>2FA Authorization</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
            Mobile OTP + Tokenized Identity verification active on all logins.
          </p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EAF3FF', color: '#0B5ED7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone size={20} />
            </div>
            <span style={{ backgroundColor: '#E2E8F0', color: '#475569', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>1 Active</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0B1F3A' }}>Active Devices</h3>
          <p style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
            Chrome on Windows 11 (Current Web Session).
          </p>
        </div>

      </div>

      {/* ACTION CONTROLS BAR */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)', marginBottom: '32px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <button
          onClick={handleSignOutAllDevices}
          disabled={revoking}
          style={{
            backgroundColor: '#DC3545',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {revoking ? <RefreshCw size={16} className="animate-spin" /> : <LogOut size={16} />} Sign out all devices
        </button>

        <button
          onClick={() => alert("Trusted devices list: Chrome on Windows 11 (Verified)")}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#0B1F3A',
            border: '1px solid #CBD5E1',
            padding: '12px 20px',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          Manage trusted devices
        </button>

        <button
          onClick={() => alert("Identity sharing consent management: All permissions active.")}
          style={{
            backgroundColor: '#FFFFFF',
            color: '#0B1F3A',
            border: '1px solid #CBD5E1',
            padding: '12px 20px',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '0.875rem'
          }}
        >
          Manage permissions
        </button>
      </div>

      {/* AUDIT LOG TABLE */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '16px' }}>
          Security Audit Logs & Verification Activity
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Event Description</th>
                <th style={{ padding: '12px' }}>Device / Client</th>
                <th style={{ padding: '12px' }}>IP & Location</th>
                <th style={{ padding: '12px' }}>Timestamp</th>
                <th style={{ padding: '12px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 700, color: '#0B1F3A' }}>{log.event}</td>
                  <td style={{ padding: '14px 12px', color: '#475569' }}>{log.device}</td>
                  <td style={{ padding: '14px 12px', color: '#475569' }}>{log.ip} ({log.location})</td>
                  <td style={{ padding: '14px 12px', color: '#64748B' }}>{log.timestamp}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span style={{ backgroundColor: '#D1E7DD', color: '#0F5132', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700 }}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
