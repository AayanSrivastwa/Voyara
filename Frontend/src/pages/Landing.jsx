import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, CloudSun, CalendarCheck, MapPin, Wallet, ArrowRight, ShieldCheck } from 'lucide-react';
import Background from '../components/Background';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Background weather="storm" />

      {/* Navigation Bar */}
      <header
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 48px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '14px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--glass-border)',
            }}
          >
            <Compass size={22} color="#FFF" />
          </div>
          <span style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'var(--font-headline)', color: '#FFF' }}>
            Voyara
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="glass-button primary">
              Open Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="glass-button">
                Sign In
              </Link>
              <Link to="/register" className="glass-button primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main
        style={{
          position: 'relative',
          zIndex: 10,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '40px 24px',
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <span className="glass-chip" style={{ marginBottom: '20px' }}>
          <CloudSun size={16} color="var(--color-sage)" />
          Weather-Aware Travel Intelligence
        </span>

        <h1
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(44px, 7vw, 76px)',
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '20px',
            textShadow: '0 8px 30px rgba(0,0,0,0.4)',
          }}
        >
          Beyond the ordinary.
        </h1>

        <p
          style={{
            fontSize: 'clamp(16px, 2.2vw, 20px)',
            color: 'var(--text-secondary)',
            maxWidth: '640px',
            lineHeight: 1.6,
            marginBottom: '36px',
          }}
        >
          Your journey, beautifully planned. Experience real-time meteorological intelligence,
          day-wise itineraries, interactive discovery maps, and seamless expense tracking.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            className="glass-button primary"
            style={{ height: '52px', padding: '0 32px', fontSize: '16px' }}
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
          >
            Start Planning Your Journey <ArrowRight size={18} />
          </button>
          <button
            className="glass-button"
            style={{ height: '52px', padding: '0 28px', fontSize: '16px' }}
            onClick={() => navigate('/explore')}
          >
            Explore Destinations
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            width: '100%',
            marginTop: '64px',
            textAlign: 'left',
          }}
        >
          <div className="glass-panel" style={{ padding: '24px' }}>
            <CloudSun size={28} color="#38BDF8" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#FFF', marginBottom: '6px' }}>
              Meteorological Intelligence
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Dynamic visual adaptations and rule-based activity recommendations derived from live weather.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <CalendarCheck size={28} color="#4ADE80" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#FFF', marginBottom: '6px' }}>
              Day-Wise Itineraries
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Effortlessly organize activities, schedules, categories, and estimated costs day by day.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <MapPin size={28} color="#FBBF24" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#FFF', marginBottom: '6px' }}>
              Interactive Discovery
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Locate curated destinations, nearby cultural sights, and restaurants on interactive maps.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <Wallet size={28} color="#F472B6" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: '#FFF', marginBottom: '6px' }}>
              Budget Analytics
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Track minor currency expenses, category allocations, and avoid overspending with live alerts.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          position: 'relative',
          zIndex: 10,
          borderTop: '1px solid var(--glass-border)',
          padding: '24px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <span>&copy; {new Date().getFullYear()} Voyara. Your journey, beautifully planned.</span>
        <span>Crafted with Node.js, Express, MongoDB Atlas, and React.</span>
      </footer>
    </div>
  );
}
