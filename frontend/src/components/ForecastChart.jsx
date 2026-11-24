import React, { useState } from 'react';
import { getWeatherIcon } from './WeatherCard';

export default function ForecastChart({ forecast = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Default forecast if empty
  const data = forecast && forecast.length > 0 ? forecast : [
    { time: '12:00', day: 'Mon', temp: 28, condition: 'Thunderstorm', rainProb: 80 },
    { time: '15:00', day: 'Mon', temp: 29, condition: 'Rain', rainProb: 75 },
    { time: '18:00', day: 'Mon', temp: 27, condition: 'Rain', rainProb: 60 },
    { time: '21:00', day: 'Mon', temp: 26, condition: 'Clouds', rainProb: 40 },
    { time: '00:00', day: 'Tue', temp: 25, condition: 'Clouds', rainProb: 30 },
    { time: '06:00', day: 'Tue', temp: 25, condition: 'Clear', rainProb: 15 },
    { time: '12:00', day: 'Tue', temp: 29, condition: 'Clouds', rainProb: 20 },
    { time: '18:00', day: 'Tue', temp: 28, condition: 'Rain', rainProb: 50 },
  ];

  // SVG Chart Geometry
  const width = 640;
  const height = 140;
  const paddingX = 40;
  const paddingY = 25;

  const temps = data.map((d) => d.temp);
  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;
  const tempRange = maxTemp - minTemp || 1;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - ((d.temp - minTemp) / tempRange) * (height - 2 * paddingY);
    return { x, y, ...d };
  });

  // Generate smooth cubic bezier curve
  const generateCurvedPath = (pts) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i != pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = generateCurvedPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <div className="forecast-chart-container" style={{ width: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--color-sage)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Forecast Intelligence
          </span>
          <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#FFF' }}>
            Interval Conditions
          </h4>
        </div>
        {hoveredIdx !== null && (
          <div style={{ background: 'rgba(255,255,255,0.18)', padding: '4px 12px', borderRadius: '12px', fontSize: '13px' }}>
            {data[hoveredIdx].day} {data[hoveredIdx].time}: <strong>{data[hoveredIdx].temp}°C</strong> ({data[hoveredIdx].condition})
          </div>
        )}
      </div>

      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="forecastFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#728F89" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#728F89" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaPath} fill="url(#forecastFill)" />

          {/* Stroke wave */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#lineStroke)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Interactive node dots */}
          {points.map((pt, i) => (
            <g
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === i ? 6 : 4}
                fill={hoveredIdx === i ? '#FFFFFF' : '#173B40'}
                stroke="#FFFFFF"
                strokeWidth="2"
                style={{ transition: 'all 0.2s ease' }}
              />
              <text
                x={pt.x}
                y={pt.y - 12}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="600"
              >
                {pt.temp}°
              </text>
            </g>
          ))}
        </svg>

        {/* Forecast Day Labels & Weather icons below points */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '8px 10px 0 10px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
          }}
        >
          {data.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                opacity: hoveredIdx === null || hoveredIdx === idx ? 1 : 0.6,
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.time}</span>
              {getWeatherIcon(item.condition, 16)}
              <span style={{ fontWeight: 500 }}>{item.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
