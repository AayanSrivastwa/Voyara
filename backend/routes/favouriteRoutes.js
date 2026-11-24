import express from 'express';
import {
  getFavourites,
  createFavourite,
  updateFavourite,
  deleteFavourite,
} from '../controllers/favouriteController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getFavourites)
  .post(createFavourite);

router.route('/:id')
  .patch(validateObjectId('id'), updateFavourite)
  .delete(validateObjectId('id'), deleteFavourite);

export default router;
