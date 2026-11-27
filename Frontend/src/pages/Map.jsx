import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Compass } from 'lucide-react';
import MapView from '../components/MapView';
import { placesService } from '../services/placesService';
import { CURATED_DESTINATIONS } from '../services/placesService';

const CATEGORIES = [
  { label: 'All Places', value: 'all' },
  { label: 'Sights & Monuments', value: 'tourism.sights' },
  { label: 'Museums', value: 'entertainment.museum' },
  { label: 'Restaurants & Dining', value: 'catering.restaurant' },
  { label: 'Parks & Nature', value: 'leisure.park' },
];

export default function MapPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState([-6.1805, 106.8284]);

  useEffect(() => {
    // Generate markers from curated destinations and attractions
    const destMarkers = CURATED_DESTINATIONS.map((d) => ({
      id: d.id,
      name: d.name,
      category: d.category,
      address: `${d.name}, ${d.country}`,
      coordinates: d.coordinates,
      color: '#38BDF8',
    }));

    // Add local attraction spots for Central Jakarta default
    const localSights = [
      { id: 's1', name: 'National Monument (Monas)', category: 'tourism.sights', address: 'Central Jakarta', coordinates: { lat: -6.1754, lon: 106.8272 }, color: '#4ADE80' },
      { id: 's2', name: 'National Museum of Indonesia', category: 'entertainment.museum', address: 'Jl. Medan Merdeka Barat', coordinates: { lat: -6.1764, lon: 106.8217 }, color: '#FBBF24' },
      { id: 's3', name: 'Istiqlal Grand Mosque', category: 'tourism.sights', address: 'Pasar Baru', coordinates: { lat: -6.1702, lon: 106.8317 }, color: '#A78BFA' },
      { id: 's4', name: 'Jakarta Old Town (Kota Tua)', category: 'tourism.sights', address: 'West Jakarta', coordinates: { lat: -6.1352, lon: 106.8133 }, color: '#F472B6' },
    ];

    setMarkers([...destMarkers, ...localSights]);
  }, []);

  const filteredMarkers = selectedCategory === 'all'
    ? markers
    : markers.filter((m) => m.category?.toLowerCase().includes(selectedCategory.split('.')[1] || selectedCategory));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <span className="glass-chip" style={{ marginBottom: '12px' }}>
          <Compass size={14} color="var(--color-sage)" /> Geospatial Intelligence
        </span>
        <h1 style={{ fontSize: '36px', fontWeight: 600, color: '#FFF', fontFamily: 'var(--font-headline)' }}>
          Interactive Map Explorer
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Navigate destinations, tourist sights, and cultural points of interest with OpenStreetMap.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className="glass-chip"
            style={{
              cursor: 'pointer',
              background: selectedCategory === cat.value ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.12)',
              borderColor: selectedCategory === cat.value ? '#FFF' : 'var(--glass-border)',
              color: '#FFF',
              fontWeight: selectedCategory === cat.value ? 600 : 500,
            }}
            onClick={() => setSelectedCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Map View Frame */}
      <MapView
        center={center}
        zoom={12}
        markers={filteredMarkers}
        height="560px"
      />
    </div>
  );
}
