// src/services/api.js - Modular Service Layer Architecture for CivicOne Platform

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
  getGoldPassStatus: () => fetch('/api/goldpass/status').then(r => r.json()),
  createPaymentOrder: (plan, amount, paymentMethod) => fetch('/api/payment/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plan, amount, paymentMethod })
  }).then(r => r.json()),
  verifyWebhookPayment: (orderId, paymentId, status) => fetch('/api/payment/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, paymentId, status: status || 'SUCCESS' })
  }).then(r => r.json())
};

export const vaultService = {
  getSummary: () => fetch('/api/vault/summary').then(r => r.json()),
  getDocuments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`/api/vault/documents?${query}`).then(r => r.json());
  },
  uploadDocument: (data) => fetch('/api/vault/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  verifyDocument: (docId) => fetch(`/api/vault/verify-doc/${docId}`, { method: 'POST' }).then(r => r.json())
};

export const privacyService = {
  getActiveConsents: () => fetch('/api/consent/active').then(r => r.json()),
  getPendingRequests: () => fetch('/api/consent/citizen-requests').then(r => r.json()),
  createDirectShare: (data) => fetch('/api/consent/create-direct-share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),
  approveRequest: (requestId) => fetch('/api/consent/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId })
  }).then(r => r.json()),
  revokeConsent: (shareId) => fetch(`/api/consent/revoke/${shareId}`, { method: 'POST' }).then(r => r.json())
};

export const orgService = {
  getOrganizations: () => fetch('/api/organizations').then(r => r.json()),
  getRoleMeta: (roleCode) => fetch(`/api/organization/role/${roleCode}`).then(r => r.json()),
  verifyOrgAccess: (shareId, requestingOrgRole) => fetch(`/api/consent/org-access/${shareId}?requestingOrgRole=${requestingOrgRole}`).then(r => r.json())
};

export const tourismService = {
  getDestinations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`/api/tourism/destinations?${query}`).then(r => r.json());
  }
};

export const travelService = {
  getProviders: () => fetch('/api/travel/providers').then(r => r.json()),
  searchTravel: (searchData) => fetch('/api/travel/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(searchData)
  }).then(r => r.json())
};

export const aiService = {
  sendQuery: (prompt) => fetch('/api/ai/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  }).then(r => r.json())
};

export const govService = {
  getUpdates: () => fetch('/api/updates/govt').then(r => r.json())
};

export const auditService = {
  getAuditLogs: () => fetch('/api/security/audit-logs').then(r => r.json())
};

export const notificationService = {
  getNotifications: () => fetch('/api/notifications').then(r => r.json())
};
