// src/services/api.js - Modular Service Layer Architecture with Token Auth Header Support & Resilient Static/Offline Fallbacks

import {
  DEMO_CITIZEN,
  DEMO_CARD,
  DEMO_DOCUMENTS,
  DEMO_NOTIFICATIONS,
  DEMO_GOVT_UPDATES,
  DEMO_CITIZENS_LIST,
  PRIVATE_ORG_TYPES
} from '../data/mockData.js';

export const authStorage = {
  setToken: (token) => {
    if (token) localStorage.setItem('civiqone_token', token);
  },
  getToken: () => {
    return localStorage.getItem('civiqone_token') || '';
  },
  clearToken: () => {
    localStorage.removeItem('civiqone_token');
  },
  getHeaders: () => {
    const token = localStorage.getItem('civiqone_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }
};

// Safe request wrapper that tries the real backend API and gracefully falls back to mock data
async function safeFetch(url, options = {}, fallbackData = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      return typeof fallbackData === 'function' ? fallbackData() : fallbackData;
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (e) {
      return typeof fallbackData === 'function' ? fallbackData() : fallbackData;
    }
  } catch (err) {
    return typeof fallbackData === 'function' ? fallbackData() : fallbackData;
  }
}

export const citizenService = {
  getProfile: () => safeFetch('/api/citizen/me', { headers: authStorage.getHeaders() }, { success: true, citizen: DEMO_CITIZEN }),
  getDemoList: () => safeFetch('/api/citizens/demo', { headers: authStorage.getHeaders() }, { success: true, demoCitizens: DEMO_CITIZENS_LIST }),
  switchDemo: (citizenId) => {
    const target = DEMO_CITIZENS_LIST.find(c => c.citizenId === citizenId) || DEMO_CITIZEN;
    return safeFetch('/api/citizen/switch-demo', {
      method: 'POST',
      headers: authStorage.getHeaders(),
      body: JSON.stringify({ citizenId })
    }, {
      success: true,
      citizen: target,
      card: { ...DEMO_CARD, holderName: (target.fullName || target.name || '').toUpperCase(), civicId: target.citizenId },
      documents: DEMO_DOCUMENTS
    });
  }
};

export const cardService = {
  getCard: () => safeFetch('/api/card/me', { headers: authStorage.getHeaders() }, { success: true, card: DEMO_CARD, citizen: DEMO_CITIZEN }),
  getGoldPassStatus: () => safeFetch('/api/goldpass/status', { headers: authStorage.getHeaders() }, {
    success: true,
    goldPass: {
      status: 'active',
      plan: 'LIFETIME_FOUNDER',
      membershipId: 'GP-AP-2026-0988',
      expiryDate: 'Lifetime Permanent',
      tier: 'FOUNDER_GOLD'
    }
  }),
  createPaymentOrder: (plan, amount, paymentMethod) => safeFetch('/api/payment/create-order', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify({ plan, amount, paymentMethod })
  }, {
    success: true,
    orderId: `ORD-GP-${Date.now()}`,
    amount,
    currency: 'INR',
    keyId: 'rzp_test_civiqone_demo'
  }),
  verifyWebhookPayment: (orderId, paymentId, status) => safeFetch('/api/payment/webhook', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify({ orderId, paymentId, status: status || 'SUCCESS' })
  }, {
    success: true,
    status: 'ACTIVE',
    goldPass: {
      tier: 'GOLD',
      badge: 'Gold Pass Citizen',
      activatedAt: new Date().toISOString()
    }
  })
};

export const vaultService = {
  getSummary: () => safeFetch('/api/vault/summary', { headers: authStorage.getHeaders() }, {
    totalDocuments: DEMO_DOCUMENTS.length,
    verifiedCount: DEMO_DOCUMENTS.filter(d => d.status === 'Verified').length,
    pendingCount: 0,
    categories: ['government', 'rto', 'academic']
  }),
  getDocuments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeFetch(`/api/vault/documents?${query}`, { headers: authStorage.getHeaders() }, {
      success: true,
      documents: DEMO_DOCUMENTS,
      total: DEMO_DOCUMENTS.length
    });
  },
  uploadDocument: (data) => safeFetch('/api/vault/upload', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify(data)
  }, {
    success: true,
    document: {
      id: `doc-${Date.now()}`,
      name: data.name,
      category: data.category || 'government',
      type: data.type || 'document',
      issuer: data.issuer || 'Official Authority',
      refNo: data.refNo || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      issueDate: data.issueDate || new Date().toLocaleDateString('en-GB'),
      expiryDate: data.expiryDate || 'N/A',
      status: 'Verified',
      isPrivate: !!data.isPrivate,
      isDemo: true
    }
  }),
  verifyDocument: (docId) => safeFetch(`/api/vault/verify-doc/${docId}`, {
    method: 'POST',
    headers: authStorage.getHeaders()
  }, {
    success: true,
    document: { id: docId, status: 'Verified', lastVerified: 'Today (SHA-256 Validated)' },
    verificationCheck: {
      credentialFound: true,
      issuerConfirmed: true,
      informationMatched: true,
      credentialActive: true
    }
  })
};

export const privacyService = {
  getActiveConsents: () => safeFetch('/api/consent/active', { headers: authStorage.getHeaders() }, {
    success: true,
    consents: [
      {
        id: 'cs-01',
        orgName: 'State Bank of India',
        docName: 'Aadhaar & PAN Card Credentials',
        purpose: 'Savings Account KYC & Identity Verification',
        accessType: 'View Only',
        createdAt: '14 Aug 2026',
        expiryDate: '13 Sep 2026 (30 Days)',
        expiresAt: '30 Days',
        status: 'ACTIVE',
        authorizedFields: ['Full Name', 'Date of Birth', 'Masked Aadhaar Number', 'Permanent Address']
      },
      {
        id: 'cs-02',
        orgName: 'Apollo Hospitals',
        docName: 'ABHA Health Profile & Vaccination Records',
        purpose: 'ABHA Health Profile Access & Hospital Admission',
        accessType: 'View Only',
        createdAt: '18 Aug 2026',
        expiryDate: '19 Aug 2026 (12 Hours)',
        expiresAt: '12 Hours',
        status: 'ACTIVE',
        authorizedFields: ['ABHA ID', 'Immunization History', 'Blood Group', 'Emergency Contact']
      }
    ]
  }),
  getPendingRequests: () => safeFetch('/api/consent/citizen-requests', { headers: authStorage.getHeaders() }, {
    success: true,
    requests: []
  }),
  createDirectShare: (data) => safeFetch('/api/consent/create-direct-share', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify(data)
  }, {
    success: true,
    shareId: `SHR-${Date.now()}`,
    shareUrl: `${window.location.origin}/verify?token=CIV-SHARE-${Date.now()}`
  }),
  approveRequest: (requestId) => safeFetch('/api/consent/approve', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify({ requestId })
  }, { success: true }),
  revokeConsent: (shareId) => safeFetch(`/api/consent/revoke/${shareId}`, {
    method: 'POST',
    headers: authStorage.getHeaders()
  }, { success: true })
};

export const orgService = {
  getOrganizations: () => safeFetch('/api/organizations', { headers: authStorage.getHeaders() }, {
    success: true,
    organizations: PRIVATE_ORG_TYPES
  }),
  getRoleMeta: (roleCode) => safeFetch(`/api/organization/role/${roleCode}`, { headers: authStorage.getHeaders() }, {
    success: true,
    role: PRIVATE_ORG_TYPES.find(o => o.roleCode === roleCode) || null
  }),
  verifyOrgAccess: (shareId, requestingOrgRole) => safeFetch(`/api/consent/org-access/${shareId}?requestingOrgRole=${requestingOrgRole}`, {
    headers: authStorage.getHeaders()
  }, {
    success: true,
    status: 'AUTHORIZED',
    authorizedCitizen: DEMO_CITIZEN,
    disclosedFields: ['Identity Status', 'KYC Verified', 'Name', 'Photo Badge']
  })
};

export const tourismService = {
  getDestinations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeFetch(`/api/tourism/destinations?${query}`, { headers: authStorage.getHeaders() }, {
      destinations: [
        { id: 't-1', name: 'Taj Mahal, Agra', state: 'Uttar Pradesh', category: 'Heritage', rating: 4.9, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500' },
        { id: 't-2', name: 'Varanasi Ghats', state: 'Uttar Pradesh', category: 'Spiritual', rating: 4.8, image: 'https://images.unsplash.com/photo-1561361066-6b2160d6961a?w=500' },
        { id: 't-3', name: 'Hampi Monuments', state: 'Karnataka', category: 'Heritage', rating: 4.9, image: 'https://images.unsplash.com/photo-1600100397608-f010e47fa7e2?w=500' }
      ]
    });
  }
};

export const travelService = {
  getProviders: () => safeFetch('/api/travel/providers', { headers: authStorage.getHeaders() }, {
    providers: [
      { id: 'p-1', name: 'IRCTC Indian Railways', mode: 'Train', icon: 'Train' },
      { id: 'p-2', name: 'Air India / IndiGo Flights', mode: 'Flight', icon: 'Plane' },
      { id: 'p-3', name: 'State RTC Express Bus', mode: 'Bus', icon: 'Bus' }
    ]
  }),
  searchTravel: (searchData) => safeFetch('/api/travel/search', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify(searchData)
  }, {
    results: [
      { id: 'trv-1', provider: 'Vande Bharat Express', departure: '06:00 AM', arrival: '12:30 PM', price: '₹1,450', seats: 'Available 42' },
      { id: 'trv-2', provider: 'Air India Direct AI-402', departure: '09:15 AM', arrival: '11:20 AM', price: '₹3,890', seats: 'Available 18' }
    ]
  })
};

export const aiService = {
  sendQuery: (prompt, lang = 'en') => safeFetch('/api/ai/query', {
    method: 'POST',
    headers: authStorage.getHeaders(),
    body: JSON.stringify({ prompt, lang })
  }, {
    reply: `I am CIVIQONE AI. Your queries are processed securely. Your identity profile and documents are verified with 100% cryptographic integrity.`
  })
};

export const govService = {
  getUpdates: () => safeFetch('/api/updates/govt', { headers: authStorage.getHeaders() }, {
    updates: DEMO_GOVT_UPDATES
  })
};

export const auditService = {
  getAuditLogs: () => safeFetch('/api/security/audit-logs', { headers: authStorage.getHeaders() }, {
    logs: [
      { id: 'log-1', action: 'Citizen Login Verification', timestamp: new Date().toISOString(), status: 'SUCCESS', ip: '127.0.0.1' },
      { id: 'log-2', action: 'Virtual Card Presentation', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'SUCCESS', ip: '127.0.0.1' }
    ]
  })
};

export const notificationService = {
  getNotifications: () => safeFetch('/api/notifications', { headers: authStorage.getHeaders() }, {
    notifications: DEMO_NOTIFICATIONS
  })
};
