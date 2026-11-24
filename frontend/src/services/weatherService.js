import api from './api';

export const weatherService = {
  async getCurrentWeather(params = {}) {
    const res = await api.get('/weather/current', { params });
    return res.data.data;
  },

  async getWeatherForecast(params = {}) {
    const res = await api.get('/weather/forecast', { params });
    return res.data;
  },

  async getFeaturedWeather() {
    const res = await api.get('/weather/featured');
    return res.data.data;
  },
};
