import express from 'express';
import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
} from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateObjectId, validateDates } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTrips)
  .post(validateDates, createTrip);

router.route('/:id')
  .get(validateObjectId('id'), getTripById)
  .patch(validateObjectId('id'), validateDates, updateTrip)
  .delete(validateObjectId('id'), deleteTrip);

export default router;
