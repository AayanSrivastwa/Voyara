import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, AlertTriangle, ArrowRight, X } from 'lucide-react';
import { tripService } from '../services/tripService';
import { expenseService } from '../services/expenseService';
import ExpenseChart from '../components/ExpenseChart';

const EXPENSE_CATEGORIES = [
  'Accommodation',
  'Transportation',
  'Food',
  'Activities',
  'Shopping',
  'Emergency',
  'Other',
];

export default function Budget() {
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [expenseData, setExpenseData] = useState(null);
  const [loading, setLoading] = useState(false);

  // New Expense Modal State
  const [showModal, setShowModal] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState('Food');
  const [expAmount, setExpAmount] = useState('');
  const [expDesc, setExpDesc] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    tripService.getTrips()
      .then((data) => {
        setTrips(data);
        if (data.length > 0) {
          setSelectedTripId(data[0]._id);
        }
      })
      .catch(() => {});
  }, []);

  const loadExpenses = (tripId) => {
    if (!tripId) return;
    setLoading(true);
    expenseService.getExpenses(tripId)
      .then((res) => setExpenseData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (selectedTripId) {
      loadExpenses(selectedTripId);
    }
  }, [selectedTripId]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expTitle || !expAmount) return;

    try {
      await expenseService.createExpense(selectedTripId, {
        title: expTitle,
        category: expCategory,
        amount: Number(expAmount),
        description: expDesc,
        date: expDate,
      });

      setShowModal(false);
      setExpTitle('');
      setExpAmount('');
      setExpDesc('');
      loadExpenses(selectedTripId);
    } catch {
      alert('Failed to record expense.');
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expenseService.deleteExpense(selectedTripId, id);
      loadExpenses(selectedTripId);
    } catch {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="glass-chip" style={{ marginBottom: '12px' }}>
            <Wallet size={14} color="var(--color-sage)" /> Financial Intelligence
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: 600, color: '#FFF', fontFamily: 'var(--font-headline)' }}>
            Budget & Expense Tracker
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Monitor trip allocations, categorize minor transactions, and prevent overspending.
          </p>
        </div>

        {selectedTripId && (
          <button
            className="glass-button primary"
            style={{ height: '42px', padding: '0 18px' }}
            onClick={() => setShowModal(true)}
          >
            <Plus size={16} /> Record Expense
          </button>
        )}
      </div>

      {/* Trip Selector */}
      {trips.length > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Select Trip:</label>
          <select
            className="glass-input"
            style={{ width: 'auto', minWidth: '220px', background: 'rgba(8, 24, 34, 0.9)' }}
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
          >
            {trips.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title} ({t.destination})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Please create a trip first to track travel expenses.</p>
        </div>
      )}

      {/* Analytics Chart & Breakdown */}
      {expenseData && (
        <ExpenseChart
          categoryData={expenseData.categoryData}
          summary={expenseData.summary}
        />
      )}

      {/* Expenses Table */}
      {expenseData && expenseData.data && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: 600, color: '#FFF', marginBottom: '16px' }}>
            Transaction History
          </h4>

          {expenseData.data.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No expenses recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {expenseData.data.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid var(--glass-border)',
                  }}
                >
                  <div>
                    <span className="glass-chip" style={{ height: '22px', fontSize: '10px', padding: '0 8px', marginBottom: '4px' }}>
                      {item.category}
                    </span>
                    <h5 style={{ fontSize: '15px', fontWeight: 600, color: '#FFF' }}>{item.title}</h5>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 600, color: '#FFF' }}>
                      {item.currency} {item.amount}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(item._id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Expense Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(4, 18, 27, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#FFF' }}>Record New Expense</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Title / Merchant *
                </label>
                <input
                  type="text"
                  className="glass-input"
                  placeholder="e.g. Traditional Ramen Lunch, Bullet Train Ticket"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    className="glass-input"
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value)}
                    style={{ background: 'rgba(8, 24, 34, 0.9)' }}
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Amount *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    className="glass-input"
                    placeholder="e.g. 1200"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Date
                </label>
                <input
                  type="date"
                  className="glass-input"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                />
              </div>

              <button type="submit" className="glass-button primary" style={{ height: '44px', marginTop: '8px' }}>
                Save Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
