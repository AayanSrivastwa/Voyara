import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudSun, ArrowRight, Compass, Calendar, Luggage, Plus } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { PrimaryWeatherCard, CompactWeatherCard } from '../components/WeatherCard';
import ForecastChart from '../components/ForecastChart';
import TravelScore from '../components/TravelScore';
import { tripService } from '../services/tripService';
import TripCard from '../components/TripCard';

export default function Dashboard() {
  const { currentWeather, featuredWeather, selectDestination } = useWeather();
  const navigate = useNavigate();
  const [upcomingTrips, setUpcomingTrips] = useState([]);

  useEffect(() => {
    tripService.getTrips()
      .then((data) => {
        setUpcomingTrips(data.slice(0, 2));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="forecast-dashboard">
      {/* LEFT CONTENT AREA */}
      <div className="dashboard-left-pane">
        <div className="dashboard-hero">
          {/* Hero Glass Chip */}
          <div className="glass-chip hero-chip-anim">
            <CloudSun size={16} color="var(--color-sage)" />
            <span>Weather Forecast & Travel Intel</span>
          </div>

          {/* Masked Headline with staggered reveals */}
          <h1 className="hero-headline">
            <span className="headline-line-1">Beyond the</span>
            <span className="headline-line-2">ordinary.</span>
          </h1>

          {/* Hero description */}
          <p className="hero-desc">
            {currentWeather ? (
              <>
                Viewing meteorological conditions for <strong>{currentWeather.destination}</strong>.
                Expect {currentWeather.description || currentWeather.condition.toLowerCase()} with winds at {currentWeather.windSpeed} m/s.
              </>
            ) : (
              'Real-time atmospheric insights combined with smart day-wise travel itineraries.'
            )}
          </p>

          {/* Action CTAs */}
          <div className="hero-cta-group">
            <button
              className="glass-button primary"
              style={{ height: '46px', padding: '0 24px', fontSize: '15px' }}
              onClick={() => navigate('/planner')}
            >
              <span>Plan A Trip</span>
              <Plus size={16} />
            </button>
            <button
              className="glass-button"
              style={{ height: '46px', padding: '0 22px', fontSize: '15px' }}
              onClick={() => navigate('/explore')}
            >
              <span>Explore Destinations</span>
              <Compass size={16} />
            </button>
          </div>
        </div>

        {/* Forecast Wave Chart Area */}
        <div className="dashboard-forecast-area">
          <ForecastChart forecast={currentWeather?.forecast} />
        </div>

        {/* Travel Suitability Score Section */}
        {currentWeather?.suitability && (
          <div style={{ marginTop: '24px' }}>
            <TravelScore suitability={currentWeather.suitability} />
          </div>
        )}

        {/* Upcoming Trips Summary (Secondary section) */}
        {upcomingTrips.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Luggage size={18} color="var(--color-sage)" />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFF' }}>
                  Upcoming Journeys
                </h3>
              </div>
              <button
                className="glass-button"
                style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}
                onClick={() => navigate('/trips')}
              >
                View All Trips
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {upcomingTrips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE WEATHER RAIL */}
      <div className="dashboard-weather-rail">
        {/* Primary Liquid-Glass Weather Card */}
        <PrimaryWeatherCard weather={currentWeather} />

        {/* 3 Compact Destination Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-sage)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Featured Destinations
          </span>

          {featuredWeather.map((item, idx) => (
            <CompactWeatherCard
              key={idx}
              item={item}
              isActive={currentWeather?.destination === item.destination}
              onClick={() => selectDestination(item.destination)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
