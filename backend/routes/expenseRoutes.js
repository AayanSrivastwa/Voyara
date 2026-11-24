import express from 'express';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/validationMiddleware.js';

const router = express.Router({ mergeParams: true });

router.use(protect);

router.route('/')
  .get(getExpenses)
  .post(createExpense);

router.route('/:id')
  .patch(validateObjectId('id'), updateExpense)
  .delete(validateObjectId('id'), deleteExpense);

export default router;
