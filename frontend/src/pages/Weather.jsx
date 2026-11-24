import React, { useState } from 'react';
import { Search, CloudSun, MapPin, RefreshCw, Wind, Droplets, Sun, Compass } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { PrimaryWeatherCard } from '../components/WeatherCard';
import ForecastChart from '../components/ForecastChart';
import TravelScore from '../components/TravelScore';

export default function Weather() {
  const { currentWeather, fetchWeather, loading } = useWeather();
  const [cityInput, setCityInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      fetchWeather(cityInput.trim());
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <span className="glass-chip" style={{ marginBottom: '12px' }}>
          <CloudSun size={14} color="var(--color-sage)" /> Atmospheric Analytics
        </span>
        <h1 style={{ fontSize: '36px', fontWeight: 600, color: '#FFF', fontFamily: 'var(--font-headline)' }}>
          Weather Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
          Real-time global weather conditions, travel comfort evaluation, and forecast trajectories.
        </p>
      </div>

      {/* City Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '12px', maxWidth: '600px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            className="glass-input"
            placeholder="Check any city (e.g. Tokyo, Reykjavik, Zurich, Bali)..."
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            style={{ paddingLeft: '40px', height: '48px', borderRadius: '16px' }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
        <button
          type="submit"
          className="glass-button primary"
          style={{ height: '48px', padding: '0 24px', borderRadius: '16px' }}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Search Weather'}
        </button>
      </form>

      {/* Main Grid: Weather Card & Forecast Curve */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div>
          <PrimaryWeatherCard weather={currentWeather} onRefresh={() => fetchWeather(currentWeather?.destination)} />
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <ForecastChart forecast={currentWeather?.forecast} />
        </div>
      </div>

      {/* Travel Comfort & Suitability Score */}
      {currentWeather?.suitability && (
        <TravelScore suitability={currentWeather.suitability} />
      )}
    </div>
  );
}
