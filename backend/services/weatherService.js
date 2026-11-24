import axios from 'axios';
import { memoryCache } from './cacheService.js';
import { calculateWeatherSuitability } from './recommendationService.js';

const DEMO_DESTINATIONS_WEATHER = {
  'central jakarta': {
    destination: 'Central Jakarta',
    country: 'Indonesia',
    temperature: 28,
    feelsLike: 32,
    tempMin: 25,
    tempMax: 30,
    condition: 'Thunderstorm',
    description: 'Thunderstorms with heavy tropical rain',
    humidity: 86,
    windSpeed: 4.8,
    precipitationProb: 85,
    uvIndex: 4,
    sunrise: '05:38',
    sunset: '17:58',
    isNight: false,
    forecast: [
      { time: '12:00', day: 'Mon', temp: 28, condition: 'Thunderstorm', rainProb: 80 },
      { time: '15:00', day: 'Mon', temp: 29, condition: 'Rain', rainProb: 75 },
      { time: '18:00', day: 'Mon', temp: 27, condition: 'Rain', rainProb: 60 },
      { time: '21:00', day: 'Mon', temp: 26, condition: 'Clouds', rainProb: 40 },
      { time: '00:00', day: 'Tue', temp: 25, condition: 'Clouds', rainProb: 30 },
      { time: '06:00', day: 'Tue', temp: 25, condition: 'Clear', rainProb: 15 },
      { time: '12:00', day: 'Tue', temp: 29, condition: 'Clouds', rainProb: 20 },
      { time: '18:00', day: 'Tue', temp: 28, condition: 'Rain', rainProb: 50 },
    ],
  },
  'paris': {
    destination: 'Paris',
    country: 'France',
    temperature: 18,
    feelsLike: 17,
    tempMin: 14,
    tempMax: 20,
    condition: 'Clouds',
    description: 'Partly cloudy with pleasant mild breeze',
    humidity: 62,
    windSpeed: 3.2,
    precipitationProb: 20,
    uvIndex: 5,
    sunrise: '06:15',
    sunset: '21:20',
    isNight: false,
    forecast: [
      { time: '12:00', day: 'Mon', temp: 18, condition: 'Clouds', rainProb: 15 },
      { time: '15:00', day: 'Mon', temp: 20, condition: 'Clear', rainProb: 10 },
      { time: '18:00', day: 'Mon', temp: 19, condition: 'Clear', rainProb: 10 },
      { time: '21:00', day: 'Mon', temp: 16, condition: 'Clouds', rainProb: 15 },
      { time: '00:00', day: 'Tue', temp: 14, condition: 'Clear', rainProb: 5 },
      { time: '06:00', day: 'Tue', temp: 13, condition: 'Clear', rainProb: 5 },
      { time: '12:00', day: 'Tue', temp: 21, condition: 'Clear', rainProb: 10 },
      { time: '18:00', day: 'Tue', temp: 19, condition: 'Clouds', rainProb: 20 },
    ],
  },
  'tokyo': {
    destination: 'Tokyo',
    country: 'Japan',
    temperature: 22,
    feelsLike: 22,
    tempMin: 18,
    tempMax: 24,
    condition: 'Clear',
    description: 'Clear sunny skies and gentle winds',
    humidity: 55,
    windSpeed: 2.8,
    precipitationProb: 10,
    uvIndex: 6,
    sunrise: '04:50',
    sunset: '18:40',
    isNight: false,
    forecast: [
      { time: '12:00', day: 'Mon', temp: 22, condition: 'Clear', rainProb: 5 },
      { time: '15:00', day: 'Mon', temp: 24, condition: 'Clear', rainProb: 5 },
      { time: '18:00', day: 'Mon', temp: 21, condition: 'Clear', rainProb: 5 },
      { time: '21:00', day: 'Mon', temp: 19, condition: 'Clouds', rainProb: 10 },
      { time: '00:00', day: 'Tue', temp: 18, condition: 'Clouds', rainProb: 10 },
      { time: '06:00', day: 'Tue', temp: 17, condition: 'Clear', rainProb: 5 },
      { time: '12:00', day: 'Tue', temp: 23, condition: 'Clear', rainProb: 5 },
      { time: '18:00', day: 'Tue', temp: 20, condition: 'Clear', rainProb: 10 },
    ],
  },
  'zermatt': {
    destination: 'Zermatt',
    country: 'Switzerland',
    temperature: -2,
    feelsLike: -6,
    tempMin: -8,
    tempMax: 1,
    condition: 'Snow',
    description: 'Light snowfall across alpine ridges',
    humidity: 78,
    windSpeed: 5.4,
    precipitationProb: 70,
    uvIndex: 3,
    sunrise: '06:05',
    sunset: '20:45',
    isNight: false,
    forecast: [
      { time: '12:00', day: 'Mon', temp: -1, condition: 'Snow', rainProb: 75 },
      { time: '15:00', day: 'Mon', temp: 0, condition: 'Snow', rainProb: 80 },
      { time: '18:00', day: 'Mon', temp: -3, condition: 'Snow', rainProb: 70 },
      { time: '21:00', day: 'Mon', temp: -5, condition: 'Clouds', rainProb: 50 },
      { time: '00:00', day: 'Tue', temp: -7, condition: 'Clouds', rainProb: 40 },
      { time: '06:00', day: 'Tue', temp: -8, condition: 'Snow', rainProb: 65 },
      { time: '12:00', day: 'Tue', temp: -2, condition: 'Clouds', rainProb: 40 },
      { time: '18:00', day: 'Tue', temp: -4, condition: 'Clear', rainProb: 20 },
    ],
  },
};

export const fetchWeatherForLocation = async ({ city, lat, lon }) => {
  const cacheKey = `weather_${city || ''}_${lat || ''}_${lon || ''}`.toLowerCase();
  const cached = memoryCache.get(cacheKey);
  if (cached) return cached;

  const apiKey = process.env.OPENWEATHER_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`;
      if (lat && lon) {
        url += `&lat=${lat}&lon=${lon}`;
      } else if (city) {
        url += `&q=${encodeURIComponent(city)}`;
      }

      const res = await axios.get(url, { timeout: 6000 });
      const data = res.data;

      // Also attempt to get 5-day forecast
      let forecastList = [];
      try {
        let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric`;
        if (lat && lon) forecastUrl += `&lat=${lat}&lon=${lon}`;
        else if (city) forecastUrl += `&q=${encodeURIComponent(city)}`;
        const forecastRes = await axios.get(forecastUrl, { timeout: 6000 });
        forecastList = forecastRes.data.list.slice(0, 8).map((item) => ({
          time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          day: new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short' }),
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main,
          rainProb: Math.round((item.pop || 0) * 100),
        }));
      } catch {
        // Forecast optional fallback
      }

      const sunriseDate = new Date(data.sys.sunrise * 1000);
      const sunsetDate = new Date(data.sys.sunset * 1000);
      const now = new Date();
      const isNight = now < sunriseDate || now > sunsetDate;

      const result = {
        isLive: true,
        destination: data.name,
        country: data.sys.country || '',
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        precipitationProb: data.clouds ? data.clouds.all : 0,
        sunrise: sunriseDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: sunsetDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNight,
        forecast: forecastList.length > 0 ? forecastList : null,
        lastUpdated: new Date().toISOString(),
      };

      result.suitability = calculateWeatherSuitability(result);
      memoryCache.set(cacheKey, result, 600); // 10 min cache
      return result;
    } catch (err) {
      console.warn(`OpenWeatherMap request failed (${err.message}). Using fallback data.`);
    }
  }

  // Fallback demo data
  const normalizedSearch = (city || '').toLowerCase().trim();
  let demoMatch = null;
  for (const [key, val] of Object.entries(DEMO_DESTINATIONS_WEATHER)) {
    if (normalizedSearch.includes(key) || key.includes(normalizedSearch)) {
      demoMatch = val;
      break;
    }
  }

  const fallback = demoMatch || {
    destination: city || 'Central Jakarta',
    country: 'Indonesia',
    temperature: 28,
    feelsLike: 32,
    tempMin: 25,
    tempMax: 30,
    condition: 'Thunderstorm',
    description: 'Thunderstorms with heavy rain',
    humidity: 84,
    windSpeed: 4.5,
    precipitationProb: 80,
    uvIndex: 4,
    sunrise: '05:38',
    sunset: '17:58',
    isNight: false,
    forecast: DEMO_DESTINATIONS_WEATHER['central jakarta'].forecast,
  };

  const formatted = {
    ...fallback,
    isLive: false,
    lastUpdated: new Date().toISOString(),
  };

  formatted.suitability = calculateWeatherSuitability(formatted);
  memoryCache.set(cacheKey, formatted, 600);
  return formatted;
};

export const getFeaturedDestinationsWeather = async () => {
  const featured = ['Central Jakarta', 'Paris', 'Tokyo', 'Zermatt'];
  const results = [];
  for (const city of featured) {
    const weather = await fetchWeatherForLocation({ city });
    results.push(weather);
  }
  return results;
};
