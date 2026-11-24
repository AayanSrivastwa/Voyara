import express from 'express';
import { searchPlaces, getNearby } from '../controllers/placesController.js';

const router = express.Router();

router.get('/search', searchPlaces);
router.get('/nearby', getNearby);

export default router;
