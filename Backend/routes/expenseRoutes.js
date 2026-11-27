const express = require('express');
const router = express.Router();
const {
  getTripExpenses,
  addExpense,
  deleteExpense
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/trip/:tripId', getTripExpenses);
router.post('/', addExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
