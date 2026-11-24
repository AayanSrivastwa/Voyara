import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Calendar, Wallet, CloudSun, Info } from 'lucide-react';
import { notificationService } from '../services/favouriteService';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = () => {
    setLoading(true);
    notificationService.getNotifications()
      .then((res) => setNotifications(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch {}
  };

  const getIcon = (type) => {
    switch (type) {
      case 'trip':
        return <Calendar size={18} color="#38BDF8" />;
      case 'budget':
        return <Wallet size={18} color="#F87171" />;
      case 'weather':
        return <CloudSun size={18} color="#FBBF24" />;
      default:
        return <Info size={18} color="var(--color-sage)" />;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="glass-chip" style={{ marginBottom: '12px' }}>
            <Bell size={14} color="var(--color-sage)" /> Activity Center
          </span>
          <h1 style={{ fontSize: '36px', fontWeight: 600, color: '#FFF', fontFamily: 'var(--font-headline)' }}>
            Notifications
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
            Alerts for upcoming trip milestones, budget warnings, and travel notices.
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <button
            className="glass-button"
            style={{ height: '38px', fontSize: '13px' }}
            onClick={handleMarkAllAsRead}
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px 24px', textAlign: 'center' }}>
          <Bell size={36} color="var(--color-sage)" style={{ margin: '0 auto 14px auto', display: 'block' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#FFF', marginBottom: '4px' }}>
            All caught up!
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            You have no pending notifications at this time.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((n) => (
            <div
              key={n._id}
              className="glass-panel"
              style={{
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                background: n.read ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.18)',
                borderLeft: n.read ? '1px solid var(--glass-border)' : '4px solid #38BDF8',
              }}
            >
              <div style={{ marginTop: '2px' }}>{getIcon(n.type)}</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#FFF' }}>
                    {n.title}
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  {n.message}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n._id)}
                    style={{ background: 'none', border: 'none', color: '#38BDF8', cursor: 'pointer', padding: '4px' }}
                    title="Mark as read"
                  >
                    <CheckCheck size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(n._id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                  title="Delete notification"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
