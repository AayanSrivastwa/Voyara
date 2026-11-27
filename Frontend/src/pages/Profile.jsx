import React, { useState } from 'react';
import { User, Mail, Shield, Save, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [currency, setCurrency] = useState(user?.preferences?.defaultCurrency || 'INR');
  const [temperatureUnit, setTemperatureUnit] = useState(user?.preferences?.temperatureUnit || 'C');
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({
        name,
        avatar,
        preferences: {
          defaultCurrency: currency,
          temperatureUnit,
        },
      });
      setToast('Profile updated successfully!');
      setTimeout(() => setToast(''), 3000);
    } catch {
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toast && (
        <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(74, 222, 128, 0.2)', color: '#4ADE80', border: '1px solid rgba(74, 222, 128, 0.4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Check size={16} />
          <span>{toast}</span>
        </div>
      )}

      <div>
        <span className="glass-chip" style={{ marginBottom: '12px' }}>
          <User size={14} color="var(--color-sage)" /> Identity & Account
        </span>
        <h1 style={{ fontSize: '36px', fontWeight: 600, color: '#FFF', fontFamily: 'var(--font-headline)' }}>
          User Profile
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Manage your personal information, traveler avatar, and defaults.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Full Name
          </label>
          <input
            type="text"
            className="glass-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Email Address (Read-only)
          </label>
          <input
            type="email"
            className="glass-input"
            value={user?.email || ''}
            disabled
            style={{ opacity: 0.6, cursor: 'not-allowed' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Avatar Image URL
          </label>
          <input
            type="url"
            className="glass-input"
            placeholder="https://example.com/avatar.jpg"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Default Currency
            </label>
            <select
              className="glass-input"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ background: 'rgba(8, 24, 34, 0.9)' }}
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Temperature Unit
            </label>
            <select
              className="glass-input"
              value={temperatureUnit}
              onChange={(e) => setTemperatureUnit(e.target.value)}
              style={{ background: 'rgba(8, 24, 34, 0.9)' }}
            >
              <option value="C">Celsius (°C)</option>
              <option value="F">Fahrenheit (°F)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="glass-button primary"
          style={{ height: '46px', marginTop: '10px' }}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'} <Save size={16} />
        </button>
      </form>
    </div>
  );
}
