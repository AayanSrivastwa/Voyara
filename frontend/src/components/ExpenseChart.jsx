import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

const COLORS = ['#38BDF8', '#4ADE80', '#FBBF24', '#F472B6', '#A78BFA', '#F87171', '#94A3B8'];

export default function ExpenseChart({ categoryData = [], summary = {} }) {
  if (!categoryData || categoryData.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
        No expense data recorded yet for this trip.
      </div>
    );
  }

  const { budget = 0, totalSpent = 0, remainingBudget = 0, isOverBudget = false, currency = 'INR' } = summary;

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '12px', color: 'var(--color-sage)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Financial Overview
          </span>
          <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#FFF' }}>
            Budget Utilization
          </h4>
        </div>
        {isOverBudget && (
          <span style={{ background: 'rgba(248, 113, 113, 0.2)', color: '#F87171', border: '1px solid rgba(248, 113, 113, 0.4)', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: 600 }}>
            Over Budget
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '12px', borderRadius: '14px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Planned Budget</span>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#FFF', marginTop: '2px' }}>
            {currency} {budget}
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '12px', borderRadius: '14px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Spent</span>
          <p style={{ fontSize: '18px', fontWeight: 600, color: isOverBudget ? '#F87171' : '#4ADE80', marginTop: '2px' }}>
            {currency} {totalSpent}
          </p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', padding: '12px', borderRadius: '14px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Remaining</span>
          <p style={{ fontSize: '18px', fontWeight: 600, color: remainingBudget < 0 ? '#F87171' : '#38BDF8', marginTop: '2px' }}>
            {currency} {remainingBudget}
          </p>
        </div>
      </div>

      <div style={{ height: '240px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${currency} ${value}`, 'Amount']}
              contentStyle={{
                backgroundColor: 'rgba(4, 18, 27, 0.95)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                color: '#FFF',
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
