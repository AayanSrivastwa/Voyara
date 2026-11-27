const express = require('express');
const router = express.Router();
const {
  getFavourites,
  addFavourite,
  updateFavourite,
  removeFavourite
} = require('../controllers/favouriteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getFavourites)
  .post(addFavourite);

router.route('/:id')
  .patch(updateFavourite)
  .delete(removeFavourite);

module.exports = router;
