import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  LayoutDashboard,
  Compass as ExploreIcon,
  CalendarCheck,
  Luggage,
  CloudSun,
  MapPin,
  Wallet,
  Bookmark,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/explore', icon: ExploreIcon, label: 'Explore Destinations' },
    { to: '/planner', icon: CalendarCheck, label: 'Trip Planner' },
    { to: '/trips', icon: Luggage, label: 'My Trips' },
    { to: '/weather', icon: CloudSun, label: 'Weather Forecast' },
    { to: '/map', icon: MapPin, label: 'Interactive Map' },
    { to: '/budget', icon: Wallet, label: 'Budget Tracker' },
    { to: '/saved', icon: Bookmark, label: 'Saved Places' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="floating-sidebar" aria-label="Main Navigation">
      <NavLink to="/dashboard" className="sidebar-logo" aria-label="Voyara Home">
        <Compass size={24} strokeWidth={2.2} />
      </NavLink>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              data-tooltip={item.label}
              aria-label={item.label}
            >
              <Icon size={20} strokeWidth={1.8} />
            </NavLink>
          );
        })}
      </nav>

      {isAuthenticated && (
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="sidebar-link"
            data-tooltip="Sign out"
            aria-label="Sign out"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <LogOut size={20} strokeWidth={1.8} />
          </button>
        </div>
      )}
    </aside>
  );
}
