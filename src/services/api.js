// src/services/api.js - Modular Service Layer Architecture for CivicOne Vault

export const citizenService = {
  getProfile: () => fetch('/api/citizen/me').then(r => r.json()),
  getDemoList: () => fetch('/api/citizens/demo').then(r => r.json()),
  switchDemo: (citizenId) => fetch('/api/citizen/switch-demo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ citizenId })
  }).then(r => r.json())
};

export const cardService = {
  getCard: () => fetch('/api/card/me').then(r => r.json()),
  updateTier: (tier) => fetch('/api/card/update-tier', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier })
  }).then(r => r.json()),
  generateShareLink: (docId, durationHours) => fetch('/api/card/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ docId, durationHours })
  }).then(r => r.json())
};

export const vaultService = {
  getSummary: () => fetch('/api/vault/summary').then(r => r.json()),
  getDocuments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`/api/vault/documents?${query}`).then(r => r.json());
  },
  uploadDocument: (formData) => fetch('/api/vault/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  }).then(r => r.json()),
  verifyDocument: (docId) => fetch(`/api/vault/verify-doc/${docId}`, { method: 'POST' }).then(r => r.json())
};

export const credentialService = {
  getPublicToken: (token) => fetch(`/api/card/verify-qr/${token}`).then(r => r.json())
};

export const auditService = {
  getAuditLogs: () => fetch('/api/security/audit-logs').then(r => r.json())
};

export const notificationService = {
  getNotifications: () => fetch('/api/notifications').then(r => r.json())
};
