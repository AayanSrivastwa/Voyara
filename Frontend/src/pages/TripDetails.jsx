import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  MapPin,
  Users,
  Wallet,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  CloudSun,
  ArrowLeft,
  X,
} from 'lucide-react';
import { tripService } from '../services/tripService';
import { weatherService } from '../services/weatherService';
import { placesService } from '../services/placesService';
import MapView from '../components/MapView';

const ACTIVITY_CATEGORIES = [
  'Sightseeing',
  'Adventure',
  'Food',
  'Shopping',
  'Transportation',
  'Accommodation',
  'Relaxation',
  'Other',
];

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [weather, setWeather] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Activity Modal State
  const [showModal, setShowModal] = useState(false);
  const [actTitle, setActTitle] = useState('');
  const [actDate, setActDate] = useState('');
  const [actTime, setActTime] = useState('09:00');
  const [actCategory, setActCategory] = useState('Sightseeing');
  const [actLocation, setActLocation] = useState('');
  const [actCost, setActCost] = useState(0);
  const [actDesc, setActDesc] = useState('');

  useEffect(() => {
    const loadTripData = async () => {
      try {
        const tripData = await tripService.getTripById(id);
        setTrip(tripData);
        setActDate(tripData.startDate.split('T')[0]);

        const items = await tripService.getItineraries(id);
        setItineraries(items);

        // Fetch destination weather
        if (tripData.destination) {
          weatherService.getCurrentWeather({ city: tripData.destination })
            .then((w) => setWeather(w))
            .catch(() => {});
        }

        // Fetch nearby places if coordinates exist
        if (tripData.latitude && tripData.longitude) {
          placesService.getNearbyPlaces(tripData.latitude, tripData.longitude)
            .then((p) => setNearbyPlaces(p))
            .catch(() => {});
        }
      } catch (err) {
        console.warn('Trip loading failed:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTripData();
  }, [id]);

  const handleToggleCompleted = async (item) => {
    try {
      const updated = await tripService.updateItinerary(id, item._id, {
        completed: !item.completed,
      });
      setItineraries((prev) =>
        prev.map((it) => (it._id === item._id ? updated : it))
      );
    } catch {}
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await tripService.deleteItinerary(id, activityId);
      setItineraries((prev) => prev.filter((it) => it._id !== activityId));
    } catch {}
  };

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    try {
      const created = await tripService.createItinerary(id, {
        title: actTitle,
        date: actDate,
        time: actTime,
        category: actCategory,
        location: actLocation,
        estimatedCost: Number(actCost),
        description: actDesc,
      });

      setItineraries((prev) => [...prev, created]);
      setShowModal(false);
      setActTitle('');
      setActDesc('');
      setActCost(0);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add activity.');
    }
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading itinerary...</div>;
  }

  if (!trip) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Trip not found.</div>;
  }

  // Group activities by date
  const grouped = {};
  itineraries.forEach((it) => {
    const d = it.date.split('T')[0];
    if (!grouped[d]) grouped[d] = [];
    grouped[d].push(it);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Bar with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="glass-button"
          style={{ width: '40px', height: '40px', padding: 0, borderRadius: '50%' }}
          onClick={() => navigate('/trips')}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <span className="glass-chip" style={{ height: '26px', fontSize: '11px', padding: '0 10px' }}>
            {trip.status}
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 600, color: '#FFF', fontFamily: 'var(--font-headline)' }}>
            {trip.title}
          </h1>
          <p style={{ color: 'var(--color-sage)', fontSize: '14px' }}>
            {trip.destination}{trip.country ? `, ${trip.country}` : ''} • {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Trip Metrics Card */}
      <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={20} color="var(--color-sage)" />
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Duration</span>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>{trip.durationDays} Days</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users size={20} color="var(--color-sage)" />
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Travellers</span>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>{trip.travellers} Guests</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Wallet size={20} color="var(--color-sage)" />
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Budget</span>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>{trip.currency} {trip.budget}</p>
          </div>
        </div>
        {weather && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CloudSun size={20} color="#38BDF8" />
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Forecast</span>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>{weather.temperature}°C ({weather.condition})</p>
            </div>
          </div>
        )}
      </div>

      {/* Day-Wise Itinerary Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#FFF' }}>
            Day-Wise Itinerary Schedule
          </h3>
          <button
            className="glass-button primary"
            style={{ height: '38px', padding: '0 16px', fontSize: '13px' }}
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} /> Add Activity
          </button>
        </div>

        {itineraries.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <CalendarCheck size={32} color="var(--color-sage)" style={{ margin: '0 auto 12px auto', display: 'block' }} />
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
              No activities planned yet. Add your first stop, museum, or dining reservation!
            </p>
            <button
              className="glass-button primary"
              style={{ marginTop: '14px' }}
              onClick={() => setShowModal(true)}
            >
              Add Activity
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.entries(grouped).map(([dateStr, items]) => (
              <div key={dateStr} className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                  <Calendar size={16} color="#38BDF8" />
                  <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>
                    {new Date(dateStr).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h4>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                    {items.filter((i) => i.completed).length} / {items.length} completed
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {items.map((it) => (
                    <div
                      key={it._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: '14px',
                        background: it.completed ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)',
                        border: '1px solid var(--glass-border)',
                        opacity: it.completed ? 0.65 : 1,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={() => handleToggleCompleted(it)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: it.completed ? '#4ADE80' : 'var(--text-muted)' }}
                        >
                          {it.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                        </button>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--color-sage)', fontWeight: 600 }}>
                              {it.time}
                            </span>
                            <span className="glass-chip" style={{ height: '22px', fontSize: '10px', padding: '0 8px' }}>
                              {it.category}
                            </span>
                          </div>
                          <h5 style={{ fontSize: '15px', fontWeight: 600, color: '#FFF', textDecoration: it.completed ? 'line-through' : 'none' }}>
                            {it.title}
                          </h5>
                          {it.location && (
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              📍 {it.location}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {it.estimatedCost > 0 && (
                          <span style={{ fontSize: '13px', color: 'var(--color-sage)', fontWeight: 600 }}>
                            {trip.currency} {it.estimatedCost}
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteActivity(it._id)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                          title="Delete Activity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(4, 18, 27, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#FFF' }}>Add Itinerary Activity</h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Activity Title *
                </label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Visit Louvre Museum, Sunset Harbor Walk"
                  value={actTitle}
                  onChange={(e) => setActTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    className="glass-input"
                    value={actDate}
                    onChange={(e) => setActDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Time
                  </label>
                  <input
                    type="time"
                    className="glass-input"
                    value={actTime}
                    onChange={(e) => setActTime(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    className="glass-input"
                    value={actCategory}
                    onChange={(e) => setActCategory(e.target.value)}
                    style={{ background: 'rgba(8, 24, 34, 0.9)' }}
                  >
                    {ACTIVITY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Est. Cost ({trip.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="glass-input"
                    value={actCost}
                    onChange={(e) => setActCost(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Location / Address
                </label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Rue de Rivoli, 75001 Paris"
                  value={actLocation}
                  onChange={(e) => setActLocation(e.target.value)}
                />
              </div>

              <button type="submit" className="glass-button primary" style={{ height: '44px', marginTop: '8px' }}>
                Save Activity
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
