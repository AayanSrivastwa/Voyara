import { fetchWeatherForLocation, getFeaturedDestinationsWeather } from '../services/weatherService.js';

export const getCurrentWeather = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;
    const data = await fetchWeatherForLocation({
      city: city || 'Central Jakarta',
      lat: lat ? parseFloat(lat) : undefined,
      lon: lon ? parseFloat(lon) : undefined,
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

export const getWeatherForecast = async (req, res, next) => {
  try {
    const { city, lat, lon } = req.query;
    const data = await fetchWeatherForLocation({
      city: city || 'Central Jakarta',
      lat: lat ? parseFloat(lat) : undefined,
      lon: lon ? parseFloat(lon) : undefined,
    });

    res.status(200).json({
      success: true,
      destination: data.destination,
      forecast: data.forecast,
      suitability: data.suitability,
    });
  } catch (err) {
    next(err);
  }
};

export const getFeaturedWeather = async (req, res, next) => {
  try {
    const items = await getFeaturedDestinationsWeather();
    res.status(200).json({
      success: true,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};
