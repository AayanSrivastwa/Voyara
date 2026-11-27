import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { weatherService } from '../services/weatherService';

const WeatherContext = createContext(null);

export const WeatherProvider = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [featuredWeather, setFeaturedWeather] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Central Jakarta');
  const [loading, setLoading] = useState(false);

  const fetchWeather = useCallback(async (city = 'Central Jakarta') => {
    setLoading(true);
    try {
      const data = await weatherService.getCurrentWeather({ city });
      setCurrentWeather(data);
      setSelectedCity(data.destination || city);
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFeatured = useCallback(async () => {
    try {
      const list = await weatherService.getFeaturedWeather();
      setFeaturedWeather(list);
    } catch (err) {
      console.warn('Featured weather error:', err);
    }
  }, []);

  useEffect(() => {
    fetchWeather(selectedCity);
    loadFeatured();
  }, [fetchWeather, loadFeatured]);

  return (
    <WeatherContext.Provider
      value={{
        currentWeather,
        featuredWeather,
        selectedCity,
        loading,
        fetchWeather,
        selectDestination: (city) => fetchWeather(city),
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
