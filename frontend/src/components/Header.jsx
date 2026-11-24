import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search, Bell, User as UserIcon, Settings, LogOut, CheckCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/favouriteService';

export default function Header({ pageTitle = '' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      notificationService.getNotifications()
        .then((res) => setUnreadCount(res.unreadCount || 0))
        .catch(() => {});
    }
  }, [user]);

  // Outside click & Escape key dismissal
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/login');
  };

  const getInitials = (name = 'Traveler') => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="app-header">
      <div className="header-user-welcome">
        <span className="header-welcome-label">
          {pageTitle || 'Voyara Intelligence'}
        </span>
        <h2 className="header-user-name">
          {user ? `Hello, ${user.name}` : 'Welcome, Traveler'}
        </h2>
      </div>

      <div className="header-actions">
        {/* Quick Add Trip */}
        <button
          className="header-circle-btn"
          title="Create New Trip"
          aria-label="Create New Trip"
          onClick={() => navigate('/planner')}
        >
          <Plus size={20} strokeWidth={2.2} />
        </button>

        {/* Search Destinations */}
        <button
          className="header-circle-btn"
          title="Explore Destinations"
          aria-label="Explore Destinations"
          onClick={() => navigate('/explore')}
        >
          <Search size={20} strokeWidth={2} />
        </button>

        {/* Notifications */}
        <button
          className="header-circle-btn"
          title="Notifications"
          aria-label="Notifications"
          onClick={() => navigate('/notifications')}
        >
          <Bell size={20} strokeWidth={2} />
          {unreadCount > 0 && <span className="header-badge">{unreadCount}</span>}
        </button>

        {/* User Profile Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            className="user-avatar-btn"
            onClick={() => setDropdownOpen((prev) => !prev)}
            aria-expanded={dropdownOpen}
            aria-label="User account menu"
          >
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span>{getInitials(user?.name)}</span>
            )}
          </button>

          {dropdownOpen && (
            <div className="glass-dropdown" role="menu">
              <div style={{ padding: '8px 14px', borderBottom: '1px solid var(--glass-border)' }}>
                <p style={{ fontWeight: 600, fontSize: '14px', color: '#FFF' }}>{user?.name || 'Voyara Traveler'}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{user?.email}</p>
              </div>

              <Link
                to="/profile"
                className="glass-dropdown-item"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
              >
                <UserIcon size={16} /> Profile
              </Link>
              <Link
                to="/settings"
                className="glass-dropdown-item"
                role="menuitem"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={16} /> Preferences
              </Link>

              <div className="glass-dropdown-divider" />

              <button
                className="glass-dropdown-item"
                role="menuitem"
                onClick={handleLogout}
                style={{ color: '#F87171' }}
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
