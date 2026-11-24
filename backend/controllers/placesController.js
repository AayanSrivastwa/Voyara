import { searchDestinations, getNearbyPlaces } from '../services/placesService.js';

export const searchPlaces = async (req, res, next) => {
  try {
    const { text = '', category = '' } = req.query;
    const results = await searchDestinations(text, category);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (err) {
    next(err);
  }
};

export const getNearby = async (req, res, next) => {
  try {
    const { lat, lon, categories } = req.query;
    const parsedLat = lat ? parseFloat(lat) : null;
    const parsedLon = lon ? parseFloat(lon) : null;

    const places = await getNearbyPlaces(parsedLat, parsedLon, categories);

    res.status(200).json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (err) {
    next(err);
  }
};
