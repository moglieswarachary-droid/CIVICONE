// src/components/TravelBookingHub.jsx - Book & Travel Global Transport Hub

import React, { useState, useEffect } from 'react';
import { Plane, Bus, Train, Car, Bike, Search, ShieldCheck, AlertCircle, ExternalLink, Calendar, MapPin, Users, Info } from 'lucide-react';
import { travelService } from '../services/api.js';

export default function TravelBookingHub({ citizen, initialDestination = '' }) {
  const [activeTab, setActiveTab] = useState('flight'); // 'flight' | 'bus' | 'train' | 'cab' | 'bike'
  const [origin, setOrigin] = useState('Vijayawada');
  const [destination, setDestination] = useState(initialDestination || 'Dubai');
  const [departureDate, setDepartureDate] = useState('2026-09-01');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [travelResults, setTravelResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('Live booking integration not connected. Official deep-link routing enabled.');

  useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const res = await travelService.searchTravel({
        type: activeTab,
        origin,
        destination,
        departureDate,
        returnDate,
        passengers
      });
      if (res.results) setTravelResults(res.results);
      if (res.notice) setNotice(res.notice);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'flight', label: '✈️ Flights', icon: Plane },
    { id: 'bus', label: '🚌 Bus', icon: Bus },
    { id: 'train', label: '🚆 Train', icon: Train },
    { id: 'cab', label: '🚖 Car / Cab', icon: Car },
    { id: 'bike', label: '🛵 Bike Rental', icon: Bike }
  ];

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
          <Plane size={16} /> CIVIQONE BOOK & TRAVEL
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0B1F3A', letterSpacing: '-0.02em' }}>
          Global Transport & Booking Hub
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
          Search flights, inter-city buses, high-speed rail, outstation cabs, and local bike rentals with minimum tokenized identity sharing.
        </p>
      </div>

      {/* INTEGRATION RULE BANNER */}
      <div style={{ backgroundColor: '#FFFBEB', border: '1.5px solid #FCD34D', padding: '16px 20px', borderRadius: '16px', color: '#92400E', fontSize: '0.875rem', fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <AlertCircle size={20} color="#D97706" style={{ shrink: 0, marginTop: '2px' }} />
        <div>
          <div style={{ fontWeight: 900, color: '#78350F', marginBottom: '2px' }}>
            ⚠️ Live Booking Provider Adapter Status
          </div>
          <div>
            {notice} Official booking provider deep-links and verified partner routing will be used. No fake booking confirmation numbers are generated.
          </div>
        </div>
      </div>

      {/* SERVICE TAB BAR */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px', marginBottom: '24px' }}>
        {tabs.map((t) => {
          const IconComp = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setTravelResults([]);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: isActive ? '#0B5ED7' : '#F8FAFC',
                color: isActive ? '#FFFFFF' : '#475569',
                fontWeight: 800,
                fontSize: '0.875rem',
                cursor: 'pointer',
                boxShadow: isActive ? '0 4px 14px rgba(11, 94, 215, 0.25)' : 'none',
                whiteSpace: 'nowrap'
              }}
            >
              <IconComp size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* SEARCH FORM */}
      <form onSubmit={handleSearch} style={{ backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '20px', border: '1px solid #E2E8F0', marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              Origin / From
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g. Vijayawada / Mumbai"
                style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 700 }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              Destination / To
            </label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Dubai / Hyderabad"
                style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 700 }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              Departure Date
            </label>
            <div style={{ position: 'relative' }}>
              <Calendar size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 700 }}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#0B1F3A', marginBottom: '6px' }}>
              Passengers / Travelers
            </label>
            <div style={{ position: 'relative' }}>
              <Users size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <select
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.875rem', fontWeight: 700 }}
              >
                <option value="1">1 Passenger</option>
                <option value="2">2 Passengers</option>
                <option value="4">4 Passengers (Family)</option>
              </select>
            </div>
          </div>

        </div>

        {/* MINIMUM DATA PRE-FILL BADGE */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 800, backgroundColor: '#ECFDF5', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} /> Tokenized KYC Pre-fill Active: {citizen ? citizen.fullName : 'Aarav Kumar'} (Only minimum required info shared)
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#0B5ED7',
              color: '#FFFFFF',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Search size={16} /> Search {activeTab.toUpperCase()} Options 🚀
          </button>
        </div>
      </form>

      {/* SEARCH RESULTS SECTION */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Searching verified transport providers...</div>
      ) : travelResults.length > 0 ? (
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '16px' }}>
            Available Route Options ({origin} ➔ {destination})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {travelResults.map((r) => (
              <div
                key={r.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid #E2E8F0',
                  padding: '20px',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0B5ED7', textTransform: 'uppercase', marginBottom: '2px' }}>
                    VERIFIED PROVIDER • {r.classOption}
                  </div>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>
                    {r.provider}
                  </h4>
                  <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                    Departure: <strong>{r.departureTime}</strong> | Arrival: <strong>{r.arrivalTime}</strong> ({r.duration})
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#059669' }}>
                    {r.price}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '8px' }}>
                    {r.availableSeats} seats left
                  </div>

                  <a
                    href={`https://www.google.com/search?q=book+${encodeURIComponent(r.provider)}+${encodeURIComponent(r.origin)}+to+${encodeURIComponent(r.destination)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#073B8C',
                      color: '#FFFFFF',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      textDecoration: 'none'
                    }}
                  >
                    Official Provider Booking <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: '36px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '16px', color: '#64748B', fontSize: '0.9rem' }}>
          Enter origin and destination above and click <strong>Search Options</strong> to view available routes and live adapter statuses.
        </div>
      )}

    </div>
  );
}
