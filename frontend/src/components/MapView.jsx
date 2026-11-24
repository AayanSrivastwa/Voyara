import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons with clean SVG data URIs
const createCustomIcon = (color = '#38BDF8') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="30" height="30"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#FFFFFF"></circle></svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-map-pin',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
  });
};

function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 12);
    }
  }, [center, zoom, map]);
  return null;
}

export default function MapView({
  center = [-6.1805, 106.8284],
  zoom = 12,
  markers = [],
  height = '420px',
}) {
  const defaultCenter = center[0] && center[1] ? center : [-6.1805, 106.8284];

  return (
    <div
      style={{
        height,
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeMapView center={defaultCenter} zoom={zoom} />

        {/* Clean CartoDB Dark Matter tiles matching dark liquid-glass aesthetic */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {markers.map((m, idx) => {
          if (!m.coordinates || !m.coordinates.lat || !m.coordinates.lon) return null;
          return (
            <Marker
              key={m.id || idx}
              position={[m.coordinates.lat, m.coordinates.lon]}
              icon={createCustomIcon(m.color || '#38BDF8')}
            >
              <Popup>
                <div style={{ color: '#04121B', padding: '4px' }}>
                  <strong style={{ fontSize: '14px', display: 'block', marginBottom: '2px' }}>
                    {m.name || m.title}
                  </strong>
                  {m.category && (
                    <span style={{ fontSize: '12px', color: '#173B40', fontWeight: 500 }}>
                      {m.category}
                    </span>
                  )}
                  {m.address && (
                    <p style={{ fontSize: '12px', marginTop: '4px', color: '#555' }}>
                      {m.address}
                    </p>
                  )}
                  {m.distance && (
                    <p style={{ fontSize: '11px', marginTop: '2px', fontWeight: 600 }}>
                      Distance: {m.distance}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
