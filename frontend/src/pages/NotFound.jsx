import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Compass size={64} color="var(--color-sage)" style={{ marginBottom: '20px' }} />
      <h1 style={{ fontSize: '72px', fontWeight: 700, fontFamily: 'var(--font-headline)', color: '#FFF', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#FFF', margin: '16px 0 8px 0' }}>
        Destination Uncharted
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '420px', lineHeight: 1.6, marginBottom: '28px' }}>
        The coordinates or route you're looking for do not exist or have moved into unmapped territory.
      </p>
      <Link to="/dashboard" className="glass-button primary">
        <ArrowLeft size={16} /> Return to Dashboard
      </Link>
    </div>
  );
}
