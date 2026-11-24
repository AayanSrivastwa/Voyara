import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarCheck, MapPin, Users, Wallet, ArrowRight, AlertCircle } from 'lucide-react';
import { tripService } from '../services/tripService';

export default function TripPlanner() {
  const navigate = useNavigate();
  const location = useLocation();

  const prefill = location.state?.prefilledDestination;

  const [title, setTitle] = useState(prefill ? `Trip to ${prefill.name}` : '');
  const [destination, setDestination] = useState(prefill ? prefill.name : '');
  const [country, setCountry] = useState(prefill ? prefill.country : '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [travellers, setTravellers] = useState(1);
  const [budget, setBudget] = useState(25000);
  const [currency, setCurrency] = useState('INR');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default to today and 5 days later
  useEffect(() => {
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 5);

    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(future.toISOString().split('T')[0]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !destination || !startDate || !endDate) {
      setError('Please provide a title, destination, and valid dates.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    setLoading(true);
    try {
      const createdTrip = await tripService.createTrip({
        title,
        destination,
        country,
        latitude: prefill?.coordinates?.lat || null,
        longitude: prefill?.coordinates?.lon || null,
        startDate,
        endDate,
        travellers: Number(travellers),
        budget: Number(budget),
        currency,
        notes,
      });

      navigate(`/trips/${createdTrip._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <span className="glass-chip" style={{ marginBottom: '12px' }}>
          <CalendarCheck size={14} color="var(--color-sage)" /> Smart Journey Architect
        </span>
        <h1 style={{ fontSize: '36px', fontWeight: 600, color: '#FFF', fontFamily: 'var(--font-headline)' }}>
          Plan Your Next Adventure
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Set up your journey details, planned budget, and dates. You can immediately build your day-wise itinerary next.
        </p>
      </div>

      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '14px',
            background: 'rgba(248, 113, 113, 0.15)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            color: '#F87171',
            fontSize: '13px',
          }}
        >
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Trip Title *
          </label>
          <input
            type="text"
            className="glass-input"
            placeholder="e.g. Alpine Winter Retreat, Tropical Bali Getaway"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Destination City *
            </label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Central Jakarta, Paris, Kyoto"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Country / Region
            </label>
            <input
              type="text"
              className="glass-input"
              placeholder="e.g. Indonesia, France, Japan"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Start Date *
            </label>
            <input
              type="date"
              className="glass-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              End Date *
            </label>
            <input
              type="date"
              className="glass-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Travellers
            </label>
            <input
              type="number"
              min="1"
              max="50"
              className="glass-input"
              value={travellers}
              onChange={(e) => setTravellers(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Planned Budget
            </label>
            <input
              type="number"
              min="0"
              step="500"
              className="glass-input"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Currency
            </label>
            <select
              className="glass-input"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ background: 'rgba(8, 24, 34, 0.8)' }}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Travel Notes & Vision
          </label>
          <textarea
            className="glass-input"
            rows="3"
            placeholder="Key packing reminders, bucket list experiences, flight confirmations..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ height: 'auto', padding: '12px 16px', resize: 'vertical' }}
          />
        </div>

        <button
          type="submit"
          className="glass-button primary"
          style={{ height: '48px', fontSize: '15px', marginTop: '10px' }}
          disabled={loading}
        >
          {loading ? 'Creating Trip...' : 'Create Trip & Start Itinerary'} <ArrowRight size={16} />
        </button>
      </form>
    </div>
  );
}
