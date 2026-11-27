import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Luggage, Plus, Search, Filter, Calendar } from 'lucide-react';
import { tripService } from '../services/tripService';
import TripCard from '../components/TripCard';

const STATUS_FILTERS = ['All', 'Planned', 'Ongoing', 'Completed', 'Cancelled'];

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadTrips = () => {
    setLoading(true);
    tripService.getTrips({ status: statusFilter, search })
      .then((data) => setTrips(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTrips();
  }, [statusFilter, search]);

  const handleDeleteTrip = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip and its day-wise itineraries?')) {
      try {
        await tripService.deleteTrip(id);
        setTrips((prev) => prev.filter((t) => t._id !== id));
      } catch {
        alert('Failed to delete trip.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="glass-chip" style={{ marginBottom: '12px' }}>
            <Luggage size={14} color="var(--color-sage)" /> Trip Portfolio
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: 600, color: '#FFF', fontFamily: 'var(--font-headline)' }}>
            My Journeys
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Manage upcoming adventures, active travel schedules, and past memories.
          </p>
        </div>

        <button
          className="glass-button primary"
          style={{ height: '44px', padding: '0 20px' }}
          onClick={() => navigate('/planner')}
        >
          <Plus size={16} /> Plan New Trip
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="glass-input"
            placeholder="Search by title, destination, or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {STATUS_FILTERS.map((st) => (
            <button
              key={st}
              className="glass-chip"
              style={{
                cursor: 'pointer',
                background: statusFilter === st ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.12)',
                borderColor: statusFilter === st ? '#FFF' : 'var(--glass-border)',
                color: '#FFF',
                fontWeight: statusFilter === st ? 600 : 500,
              }}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading your trips...
        </div>
      ) : trips.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Luggage size={40} color="var(--color-sage)" style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFF', marginBottom: '6px' }}>
            No trips found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px auto' }}>
            You haven't created any trips matching this filter yet. Start planning your next journey now!
          </p>
          <button
            className="glass-button primary"
            onClick={() => navigate('/planner')}
          >
            Create Your First Trip
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onDelete={handleDeleteTrip}
            />
          ))}
        </div>
      )}
    </div>
  );
}
