import React from 'react';
import {
  MapPin,
  Wind,
  Droplets,
  CloudRain,
  Sun,
  CloudLightning,
  CloudSnow,
  Cloud,
  Eye,
} from 'lucide-react';

export const getWeatherIcon = (condition = 'clear', size = 24) => {
  const cond = condition.toLowerCase();
  if (cond.includes('thunder') || cond.includes('storm')) {
    return <CloudLightning size={size} color="#FBBF24" />;
  }
  if (cond.includes('rain') || cond.includes('drizzle')) {
    return <CloudRain size={size} color="#60A5FA" />;
  }
  if (cond.includes('snow')) {
    return <CloudSnow size={size} color="#93C5FD" />;
  }
  if (cond.includes('cloud')) {
    return <Cloud size={size} color="#94A3B8" />;
  }
  return <Sun size={size} color="#FCD34D" />;
};

export function PrimaryWeatherCard({ weather, onRefresh }) {
  if (!weather) return null;

  return (
    <div className="primary-weather-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-sage)', fontSize: '13px', fontWeight: 500 }}>
            <MapPin size={14} />
            <span>{weather.country || 'Global'}</span>
          </div>
          <h3 style={{ fontSize: '24px', fontWeight: 600, color: '#FFF', fontFamily: 'var(--font-headline)', marginTop: '2px' }}>
            {weather.destination}
          </h3>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px', borderRadius: '16px' }}>
          {getWeatherIcon(weather.condition, 28)}
        </div>
      </div>

      {/* Main Temperature Display */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', margin: '4px 0' }}>
        <span style={{ fontSize: '56px', fontWeight: 500, fontFamily: 'var(--font-headline)', lineHeight: 1 }}>
          {weather.temperature}°
        </span>
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Feels like {weather.feelsLike}°
        </span>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
        {weather.description || weather.condition}
      </p>

      {/* Weather Attributes Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.14)',
          fontSize: '13px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <Droplets size={16} color="var(--color-sage)" />
          <span>Humidity {weather.humidity}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <Wind size={16} color="var(--color-sage)" />
          <span>Wind {weather.windSpeed} m/s</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <CloudRain size={16} color="var(--color-sage)" />
          <span>Rain prob. {weather.precipitationProb || 0}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
          <Eye size={16} color="var(--color-sage)" />
          <span>{weather.isLive ? 'Live Sensor' : 'Standard'}</span>
        </div>
      </div>

      {weather.lastUpdated && (
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>
          Updated {new Date(weather.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
}

export function CompactWeatherCard({ item, isActive, onClick }) {
  return (
    <div
      className={`compact-weather-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <div>
        <p style={{ fontSize: '12px', color: 'var(--color-sage)', fontWeight: 500 }}>
          {item.country || 'Region'}
        </p>
        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>
          {item.destination}
        </h4>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          {item.condition}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {getWeatherIcon(item.condition, 20)}
        <span style={{ fontSize: '24px', fontWeight: 600, fontFamily: 'var(--font-headline)' }}>
          {item.temperature}°
        </span>
      </div>
    </div>
  );
}
