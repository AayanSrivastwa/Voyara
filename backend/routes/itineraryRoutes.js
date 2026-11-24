import express from 'express';
import {
  getItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary,
} from '../controllers/itineraryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/validationMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
  .get(getItineraries)
  .post(createItinerary);

router.route('/:id')
  .patch(validateObjectId('id'), updateItinerary)
  .delete(validateObjectId('id'), deleteItinerary);

export default router;
