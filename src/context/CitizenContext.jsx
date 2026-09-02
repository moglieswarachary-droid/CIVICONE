// src/context/CitizenContext.jsx - Centralized State Provider for Citizen Identity, Documents & Multi-Citizen Isolation

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { citizenService, cardService, vaultService, notificationService } from '../services/api.js';
import { DEMO_CITIZEN, DEMO_CARD, DEMO_DOCUMENTS, DEMO_CITIZENS_LIST, DEMO_FAMILY_MEMBERS } from '../data/mockData.js';

const CitizenContext = createContext(null);

export function CitizenProvider({ children }) {
  // Initialize Active Citizen from LocalStorage or Fallback
  const [activeCitizen, setActiveCitizen] = useState(() => {
    try {
      const active = localStorage.getItem('civiqone_active_citizen');
      if (active) return JSON.parse(active);
    } catch (e) {}
    return null;
  });

  const [cardData, setCardData] = useState(() => {
    try {
      const cached = localStorage.getItem('civiqone_card_data');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return DEMO_CARD;
  });

  const [demoCitizens, setDemoCitizens] = useState(DEMO_CITIZENS_LIST);
  const [documents, setDocuments] = useState(DEMO_DOCUMENTS);
  const [notifications, setNotifications] = useState([]);
  const [familyMembers, setFamilyMembers] = useState(() => {
    try {
      const cid = activeCitizen?.citizenId;
      if (cid) {
        const cached = localStorage.getItem(`civiqone_family_${cid}`);
        if (cached) return JSON.parse(cached);
      }
    } catch (e) {}
    return DEMO_FAMILY_MEMBERS;
  });
  const [loading, setLoading] = useState(false);

  // Synchronize Active Citizen with LocalStorage
  const setAndPersistCitizen = useCallback((citizen) => {
    setActiveCitizen(citizen);
    try {
      if (citizen) {
        localStorage.setItem('civiqone_active_citizen', JSON.stringify(citizen));
        if (citizen.citizenId) {
          localStorage.setItem(`civiqone_citizen_${citizen.citizenId}`, JSON.stringify(citizen));
        }
      } else {
        localStorage.removeItem('civiqone_active_citizen');
      }
    } catch (e) {}
  }, []);

  // Update Profile Attributes
  const updateProfile = useCallback((updatedFields) => {
    setActiveCitizen(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      try {
        localStorage.setItem('civiqone_active_citizen', JSON.stringify(updated));
        if (updated.citizenId) {
          localStorage.setItem(`civiqone_citizen_${updated.citizenId}`, JSON.stringify(updated));
        }
      } catch (e) {}
      return updated;
    });
  }, []);

  // Load Citizen Data on initial mount or citizen change
  const loadCitizenData = useCallback(async () => {
    setLoading(true);
    try {
      const cid = activeCitizen?.citizenId || '';
      const [profileRes, demoRes, docsRes, notifRes] = await Promise.all([
        citizenService.getProfile(),
        citizenService.getDemoList(),
        vaultService.getDocuments(cid ? { citizenId: cid } : {}),
        notificationService.getNotifications()
      ]);

      if (profileRes && profileRes.citizen && !activeCitizen) {
        setAndPersistCitizen(profileRes.citizen);
      }
      if (profileRes && profileRes.card) {
        setCardData(profileRes.card);
        localStorage.setItem('civiqone_card_data', JSON.stringify(profileRes.card));
      }
      if (demoRes && demoRes.demoCitizens) setDemoCitizens(demoRes.demoCitizens);
      if (docsRes && docsRes.documents) setDocuments(docsRes.documents);
      if (notifRes && notifRes.notifications) setNotifications(notifRes.notifications);
    } catch (err) {
      console.log("[CitizenContext] Loaded resilient static datasets");
    } finally {
      setLoading(false);
    }
  }, [activeCitizen, setAndPersistCitizen]);

  useEffect(() => {
    loadCitizenData();
  }, [loadCitizenData]);

  // Switch Active Demo Account
  const switchDemoAccount = async (citizenId) => {
    setLoading(true);
    try {
      const res = await citizenService.switchDemo(citizenId);
      if (res && res.success) {
        setAndPersistCitizen(res.citizen);
        if (res.card) setCardData(res.card);
        if (res.documents) setDocuments(res.documents);
      } else {
        const target = demoCitizens.find(c => c.citizenId === citizenId) || DEMO_CITIZEN;
        setAndPersistCitizen(target);
        setCardData({
          ...DEMO_CARD,
          holderName: (target.fullName || target.name || '').toUpperCase(),
          civicId: target.citizenId
        });
      }
    } catch (err) {
      console.error("Demo account switch fallback", err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAndPersistCitizen(null);
  };

  return (
    <CitizenContext.Provider value={{
      activeCitizen,
      setActiveCitizen: setAndPersistCitizen,
      cardData,
      setCardData,
      demoCitizens,
      documents,
      setDocuments,
      notifications,
      setNotifications,
      familyMembers,
      setFamilyMembers,
      loading,
      switchDemoAccount,
      updateProfile,
      logout,
      refreshData: loadCitizenData
    }}>
      {children}
    </CitizenContext.Provider>
  );
}

export function useCitizen() {
  const context = useContext(CitizenContext);
  if (!context) {
    throw new Error("useCitizen must be used within a CitizenProvider");
  }
  return context;
}
