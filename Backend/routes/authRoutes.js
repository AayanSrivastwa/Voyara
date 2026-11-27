const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  demoLogin,
  logoutUser,
  getMe,
  updateProfile,
  updatePassword,
  deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/demo-login', demoLogin);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.patch('/profile', protect, updateProfile);
router.patch('/password', protect, updatePassword);
router.delete('/account', protect, deleteAccount);

module.exports = router;
