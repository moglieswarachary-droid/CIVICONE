// src/context/CitizenContext.jsx - React State Provider for Active Citizen & Multi-Citizen Isolation

import React, { createContext, useContext, useState, useEffect } from 'react';
import { citizenService, cardService, vaultService } from '../services/api.js';

const CitizenContext = createContext(null);

export function CitizenProvider({ children }) {
  const [activeCitizen, setActiveCitizen] = useState(null);
  const [cardData, setCardData] = useState(null);
  const [demoCitizens, setDemoCitizens] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Initial Citizen Data
  const loadCitizenData = async () => {
    setLoading(true);
    try {
      const [profileRes, demoRes, docsRes] = await Promise.all([
        citizenService.getProfile(),
        citizenService.getDemoList(),
        vaultService.getDocuments()
      ]);

      if (profileRes.citizen) setActiveCitizen(profileRes.citizen);
      if (profileRes.card) setCardData(profileRes.card);
      if (demoRes.demoCitizens) setDemoCitizens(demoRes.demoCitizens);
      if (docsRes.documents) setDocuments(docsRes.documents);
    } catch (err) {
      console.log("Context fallback initialized");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitizenData();
  }, []);

  // Switch Active Demo Account
  const switchDemoAccount = async (citizenId) => {
    setLoading(true);
    try {
      const res = await citizenService.switchDemo(citizenId);
      if (res.success) {
        setActiveCitizen(res.citizen);
        setCardData(res.card);
        setDocuments(res.documents);
        
        // Refresh demo list
        const demoRes = await citizenService.getDemoList();
        if (demoRes.demoCitizens) setDemoCitizens(demoRes.demoCitizens);
      }
    } catch (err) {
      console.error("Demo account switch failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CitizenContext.Provider value={{
      activeCitizen,
      cardData,
      setCardData,
      demoCitizens,
      documents,
      setDocuments,
      loading,
      switchDemoAccount,
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
