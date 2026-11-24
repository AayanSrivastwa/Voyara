import express from 'express';
import {
  getCurrentWeather,
  getWeatherForecast,
  getFeaturedWeather,
} from '../controllers/weatherController.js';

const router = express.Router();

router.get('/current', getCurrentWeather);
router.get('/forecast', getWeatherForecast);
router.get('/featured', getFeaturedWeather);

export default router;
