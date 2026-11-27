import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WeatherProvider } from './context/WeatherContext';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import TripPlanner from './pages/TripPlanner';
import MyTrips from './pages/MyTrips';
import TripDetails from './pages/TripDetails';
import Weather from './pages/Weather';
import MapPage from './pages/Map';
import Budget from './pages/Budget';
import SavedPlaces from './pages/SavedPlaces';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WeatherProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated / App Layout Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/planner" element={<TripPlanner />} />
                <Route path="/trips" element={<MyTrips />} />
                <Route path="/trips/:id" element={<TripDetails />} />
                <Route path="/weather" element={<Weather />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/budget" element={<Budget />} />
                <Route path="/saved" element={<SavedPlaces />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>

            {/* Fallback for unauthenticated 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </WeatherProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
