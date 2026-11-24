import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotifications);

router.patch('/read-all', markAllAsRead);

router.route('/:id')
  .patch(validateObjectId('id'), markAsRead)
  .delete(validateObjectId('id'), deleteNotification);

export default router;
