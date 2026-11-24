import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Background from '../components/Background';
import { useWeather } from '../context/WeatherContext';

export default function AppLayout() {
  const { currentWeather } = useWeather();

  return (
    <div className="app-container">
      {/* Dynamic cinematic weather background */}
      <Background
        weather={currentWeather?.condition || 'storm'}
        isNight={currentWeather?.isNight || false}
      />

      {/* Floating Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="main-content-area">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
