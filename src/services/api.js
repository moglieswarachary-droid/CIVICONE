// src/services/api.js - Modular Service Layer Architecture with Token Auth Header Support for CivicOne Platform

export const authStorage = {
  setToken: (token) => {
    if (token) localStorage.setItem('civicone_token', token);
  },
  getToken: () => {
    return localStorage.getItem('civicone_token') || '';
  },
  clearToken: () => {
    localStorage.removeItem('civicone_token');
  },
  getHeaders: () => {
    const token = localStorage.getItem('civicone_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }
};

export const citizenService = {
  getProfile: () => fetch('/api/citizen/me', { headers: authStorage.getHeaders() }).then(r => r.json()),
  getDemoList: () => fetch('/api/citizens/demo', { headers: authStorage.getHeaders() }).then(r => r.json()),
  switchDemo: (citizenId) => fetch('/api/citizen/switch-demo', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify({ citizenId })
  }).then(r => r.json())
};

export const cardService = {
  getCard: () => fetch('/api/card/me', { headers: authStorage.getHeaders() }).then(r => r.json()),
  getGoldPassStatus: () => fetch('/api/goldpass/status', { headers: authStorage.getHeaders() }).then(r => r.json()),
  createPaymentOrder: (plan, amount, paymentMethod) => fetch('/api/payment/create-order', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify({ plan, amount, paymentMethod })
  }).then(r => r.json()),
  verifyWebhookPayment: (orderId, paymentId, status) => fetch('/api/payment/webhook', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify({ orderId, paymentId, status: status || 'SUCCESS' })
  }).then(r => r.json())
};

export const vaultService = {
  getSummary: () => fetch('/api/vault/summary', { headers: authStorage.getHeaders() }).then(r => r.json()),
  getDocuments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`/api/vault/documents?${query}`, { headers: authStorage.getHeaders() }).then(r => r.json());
  },
  uploadDocument: (data) => fetch('/api/vault/upload', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify(data)
  }).then(r => r.json()),
  verifyDocument: (docId) => fetch(`/api/vault/verify-doc/${docId}`, { method: 'POST', headers: authStorage.getHeaders() }).then(r => r.json())
};

export const privacyService = {
  getActiveConsents: () => fetch('/api/consent/active', { headers: authStorage.getHeaders() }).then(r => r.json()),
  getPendingRequests: () => fetch('/api/consent/citizen-requests', { headers: authStorage.getHeaders() }).then(r => r.json()),
  createDirectShare: (data) => fetch('/api/consent/create-direct-share', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify(data)
  }).then(r => r.json()),
  approveRequest: (requestId) => fetch('/api/consent/approve', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify({ requestId })
  }).then(r => r.json()),
  revokeConsent: (shareId) => fetch(`/api/consent/revoke/${shareId}`, { method: 'POST', headers: authStorage.getHeaders() }).then(r => r.json())
};

export const orgService = {
  getOrganizations: () => fetch('/api/organizations', { headers: authStorage.getHeaders() }).then(r => r.json()),
  getRoleMeta: (roleCode) => fetch(`/api/organization/role/${roleCode}`, { headers: authStorage.getHeaders() }).then(r => r.json()),
  verifyOrgAccess: (shareId, requestingOrgRole) => fetch(`/api/consent/org-access/${shareId}?requestingOrgRole=${requestingOrgRole}`, { headers: authStorage.getHeaders() }).then(r => r.json())
};

export const tourismService = {
  getDestinations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetch(`/api/tourism/destinations?${query}`, { headers: authStorage.getHeaders() }).then(r => r.json());
  }
};

export const travelService = {
  getProviders: () => fetch('/api/travel/providers', { headers: authStorage.getHeaders() }).then(r => r.json()),
  searchTravel: (searchData) => fetch('/api/travel/search', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify(searchData)
  }).then(r => r.json())
};

export const aiService = {
  sendQuery: (prompt) => fetch('/api/ai/query', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify({ prompt })
  }).then(r => r.json())
};

export const govService = {
  getUpdates: () => fetch('/api/updates/govt', { headers: authStorage.getHeaders() }).then(r => r.json())
};

export const auditService = {
  getAuditLogs: () => fetch('/api/security/audit-logs', { headers: authStorage.getHeaders() }).then(r => r.json())
};

export const notificationService = {
  getNotifications: () => fetch('/api/notifications', { headers: authStorage.getHeaders() }).then(r => r.json())
};
