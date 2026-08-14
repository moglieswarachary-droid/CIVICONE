// src/components/TourismGuide.jsx - CivicOne World Tourism Explorer

import React, { useState, useEffect } from 'react';
import { Compass, Search, MapPin, Calendar, DollarSign, ShieldCheck, Bus, Plane, Car, Hotel, Utensils, Star, ExternalLink, Filter } from 'lucide-react';
import { tourismService } from '../services/api.js';

export default function TourismGuide({ onSelectTravelBooking }) {
  const [destinations, setDestinations] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedDest, setSelectedDest] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await tourismService.getDestinations({ search, category });
      if (res.destinations) setDestinations(res.destinations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [search, category]);

  const categories = ['All', 'Luxury', 'Historical', 'Cultural', 'Beaches', 'Modern', 'Budget'];

  return (
    <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
      {/* HEADER BAR */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#F0FDF4', color: '#166534', padding: '6px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
          <Compass size={16} /> CIVICONE WORLD TOURISM GUIDE
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0B1F3A', letterSpacing: '-0.02em' }}>
          Explore Global & Indian Destinations
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>
          Discover handpicked cities, historical landmarks, pristine beaches, luxury resorts, local transport options, and verified travel safety guidance.
        </p>
      </div>

      {/* SEARCH AND FILTER CONTROLS */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {/* Search input */}
        <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city, country, or keyword (e.g. Dubai, Paris, Goa, Tokyo)..."
            style={{
              width: '100%',
              padding: '12px 14px 12px 42px',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#0B1F3A'
            }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: category === cat ? '#0B5ED7' : '#F1F5F9',
                color: category === cat ? '#FFFFFF' : '#475569',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* DESTINATION CARDS GRID */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748B' }}>Loading destinations...</div>
      ) : destinations.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '16px', color: '#64748B' }}>
          No destinations found matching your search term. Try searching "Dubai" or "Goa".
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {destinations.map((dest) => (
            <div
              key={dest.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                transition: 'transform 0.2s ease'
              }}
            >
              <div>
                <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                  <img
                    src={dest.image}
                    alt={dest.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(11, 31, 58, 0.85)', color: '#FEF08A', padding: '4px 10px', borderRadius: '20px', fontWeight: 800, fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={12} fill="#FEF08A" /> {dest.rating}
                  </div>
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#0B1F3A', padding: '4px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '0.75rem' }}>
                    {dest.category}
                  </div>
                </div>

                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '4px' }}>
                    {dest.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} color="#0B5ED7" /> {dest.city}, {dest.country}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: '1.5', marginBottom: '16px' }}>
                    {dest.shortDescription}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: '#334155', backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
                    <div><strong>Best Time to Visit:</strong> {dest.bestTimeToVisit}</div>
                    <div><strong>Est. Budget:</strong> <span style={{ color: '#059669', fontWeight: 800 }}>{dest.estimatedBudget}</span></div>
                    <div><strong>Safety Rating:</strong> 🟢 Verified Safe Destination</div>
                  </div>
                </div>
              </div>

              <div style={{ padding: '0 20px 20px 20px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setSelectedDest(dest)}
                  style={{
                    flex: 1,
                    backgroundColor: '#0B5ED7',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '11px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  View Details & Guide
                </button>
                {onSelectTravelBooking && (
                  <button
                    onClick={() => onSelectTravelBooking(dest.city)}
                    style={{
                      backgroundColor: '#EFF6FF',
                      color: '#1D4ED8',
                      border: '1px solid #BFDBFE',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plane size={14} /> Book Travel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DESTINATION DETAIL MODAL */}
      {selectedDest && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(11, 31, 58, 0.7)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '24px', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0B5ED7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  CIVICONE WORLD TRAVEL GUIDE
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0B1F3A', marginTop: '2px' }}>
                  {selectedDest.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedDest(null)}
                style={{ backgroundColor: '#F1F5F9', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <img
              src={selectedDest.image}
              alt={selectedDest.title}
              style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '16px', marginBottom: '20px' }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>BEST TIME TO VISIT</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0B1F3A' }}>{selectedDest.bestTimeToVisit}</div>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>ESTIMATED BUDGET</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>{selectedDest.estimatedBudget}</div>
              </div>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 700 }}>SAFETY & HEALTH</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#166534' }}>{selectedDest.safetyInfo}</div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} color="#D97706" /> Popular Tourist Attractions
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedDest.popularAttractions.map((att, i) => (
                  <span key={i} style={{ backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                    {att}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0B1F3A', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bus size={16} color="#0B5ED7" /> Local Transport Options
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#334155' }}>
                {selectedDest.localTransport}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Hotel size={14} /> Nearby Verified Hotels
                </h5>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.825rem', color: '#334155' }}>
                  {selectedDest.nearbyHotels.map((h, idx) => <li key={idx}>{h}</li>)}
                </ul>
              </div>

              <div>
                <h5 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Utensils size={14} /> Popular Restaurants
                </h5>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.825rem', color: '#334155' }}>
                  {selectedDest.nearbyRestaurants.map((r, idx) => <li key={idx}>{r}</li>)}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setSelectedDest(null)}
                style={{ backgroundColor: '#F1F5F9', color: '#475569', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
              >
                Close
              </button>
              {onSelectTravelBooking && (
                <button
                  onClick={() => {
                    const destCity = selectedDest.city;
                    setSelectedDest(null);
                    onSelectTravelBooking(destCity);
                  }}
                  style={{ backgroundColor: '#0B5ED7', color: '#FFFFFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Book Flights & Transport 🚀
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
