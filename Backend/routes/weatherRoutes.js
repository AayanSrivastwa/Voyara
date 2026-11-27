const express = require('express');
const router = express.Router();
const {
  getCurrentWeather,
  getWeatherForecast,
  getFeaturedWeather
} = require('../controllers/weatherController');

router.get('/current', getCurrentWeather);
router.get('/forecast', getWeatherForecast);
router.get('/featured', getFeaturedWeather);

module.exports = router;
