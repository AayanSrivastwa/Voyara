import React from 'react';
import { MapPin, Bookmark, Plus } from 'lucide-react';

export default function DestinationCard({
  destination,
  onSave,
  isSaved,
  onCreateTrip,
  onSelect,
}) {
  return (
    <div
      className="glass-panel"
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.25s ease',
      }}
      onClick={onSelect}
    >
      <div style={{ height: '170px', width: '100%', position: 'relative', overflow: 'hidden' }}>
        <img
          src={destination.image}
          alt={destination.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          loading="lazy"
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(4, 18, 27, 0.85) 100%)',
          }}
        />

        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(destination);
            }}
            className="glass-button"
            style={{
              width: '36px',
              height: '36px',
              padding: 0,
              borderRadius: '50%',
              background: isSaved ? 'rgba(255,255,255,0.4)' : 'rgba(4, 18, 27, 0.6)',
            }}
            title={isSaved ? 'Saved' : 'Save Destination'}
          >
            <Bookmark size={16} fill={isSaved ? '#FFF' : 'none'} color="#FFF" />
          </button>
        </div>

        <div style={{ position: 'absolute', bottom: '12px', left: '16px' }}>
          <span className="glass-chip" style={{ height: '26px', fontSize: '11px', padding: '0 10px' }}>
            {destination.category}
          </span>
        </div>
      </div>

      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-sage)', fontSize: '12px' }}>
            <MapPin size={12} />
            <span>{destination.country}</span>
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#FFF' }}>
            {destination.name}
          </h4>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {destination.description}
        </p>

        <div style={{ marginTop: 'auto', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)' }}>
          {destination.temp !== undefined && (
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFF' }}>
              {destination.temp}°C ({destination.weatherCondition})
            </span>
          )}

          <button
            className="glass-button"
            style={{ height: '32px', padding: '0 12px', fontSize: '12px', marginLeft: 'auto' }}
            onClick={(e) => {
              e.stopPropagation();
              onCreateTrip(destination);
            }}
          >
            <Plus size={14} /> Plan Trip
          </button>
        </div>
      </div>
    </div>
  );
}
