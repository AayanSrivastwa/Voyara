const express = require('express');
const router = express.Router();
const {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary
} = require('../controllers/tripController');
const {
  getTripExpenses,
  addExpense,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getTrips)
  .post(createTrip);

router.route('/:id')
  .get(getTripById)
  .patch(updateTrip)
  .put(updateTrip)
  .delete(deleteTrip);

// Itinerary sub-resource
router.route('/:id/itineraries')
  .get(getItineraries)
  .post(createItinerary);

router.route('/:id/itineraries/:itemId')
  .patch(updateItinerary)
  .delete(deleteItinerary);

// Nested Expenses sub-resource
router.route('/:tripId/expenses')
  .get(getTripExpenses)
  .post(addExpense);

router.route('/:tripId/expenses/:id')
  .patch(updateExpense)
  .delete(deleteExpense);

module.exports = router;
