import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Wallet, ArrowRight, Trash2 } from 'lucide-react';

export default function TripCard({ trip, onDelete }) {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ongoing':
        return { bg: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80' };
      case 'Completed':
        return { bg: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8' };
      case 'Cancelled':
        return { bg: 'rgba(248, 113, 113, 0.2)', color: '#F87171' };
      default:
        return { bg: 'rgba(251, 191, 36, 0.2)', color: '#FBBF24' };
    }
  };

  const statusStyle = getStatusBadge(trip.status);

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span
            style={{
              display: 'inline-block',
              padding: '2px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 600,
              background: statusStyle.bg,
              color: statusStyle.color,
              marginBottom: '6px',
            }}
          >
            {trip.status}
          </span>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#FFF' }}>
            {trip.title}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-sage)', fontWeight: 500 }}>
            {trip.destination}{trip.country ? `, ${trip.country}` : ''}
          </p>
        </div>

        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(trip._id);
            }}
            title="Delete Trip"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#F87171'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} color="var(--color-sage)" />
          <span>{trip.durationDays || 1} Days</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Users size={14} color="var(--color-sage)" />
          <span>{trip.travellers || 1} Guests</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Wallet size={14} color="var(--color-sage)" />
          <span>{trip.currency} {trip.budget || 0}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {trip.daysUntil > 0 ? `In ${trip.daysUntil} days` : trip.isCurrent ? 'Happening now' : 'Past trip'}
        </span>

        <button
          className="glass-button primary"
          style={{ height: '36px', padding: '0 14px', fontSize: '13px' }}
          onClick={() => navigate(`/trips/${trip._id}`)}
        >
          <span>View Itinerary</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
