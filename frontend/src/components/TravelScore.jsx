import React from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TravelScore({ suitability }) {
  if (!suitability) return null;

  const {
    score = 85,
    category = 'Favorable',
    color = '#38BDF8',
    summary,
    factors = [],
    suggestedActivityTypes = [],
    tips = [],
  } = suitability;

  // SVG circular progress calculation
  const size = 110;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((score || 0) / 100) * circumference;

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--color-sage)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Weather Comfort Index
          </span>
          <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#FFF' }}>
            Travel Suitability
          </h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '12px' }}>
          <Info size={14} />
          <span>Informational Indicator</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
        {/* Circular Progress Meter */}
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
          <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '28px', fontWeight: 700, fontFamily: 'var(--font-headline)', color: '#FFF', lineHeight: 1 }}>
              {score}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              / 100
            </span>
          </div>
        </div>

        {/* Category Description */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '12px', background: `${color}22`, border: `1px solid ${color}44`, color: color, fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>
            {category} Suitability
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {summary}
          </p>
        </div>
      </div>

      {/* Influencing Factors */}
      {factors && factors.length > 0 && (
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <h5 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
            Key Factors
          </h5>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {factors.map((factor, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                {factor.impact === 'Severe' || factor.impact === 'Negative' ? (
                  <AlertTriangle size={15} color="#F87171" />
                ) : (
                  <CheckCircle2 size={15} color="#4ADE80" />
                )}
                <span style={{ fontWeight: 600, color: '#FFF' }}>{factor.name}:</span>
                <span style={{ color: 'var(--text-secondary)' }}>{factor.detail}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Activity Categories */}
      {suggestedActivityTypes && suggestedActivityTypes.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h5 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
            Ideal Activities For This Weather
          </h5>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {suggestedActivityTypes.map((act, i) => (
              <span key={i} className="glass-chip" style={{ height: '30px', fontSize: '12px' }}>
                {act}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
