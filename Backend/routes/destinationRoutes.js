const express = require('express');
const router = express.Router();
const {
  searchDestinations,
  getNearbyPlaces
} = require('../controllers/weatherController');

router.get('/search', searchDestinations);
router.get('/nearby', getNearbyPlaces);

module.exports = router;
