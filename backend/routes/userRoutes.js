const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, getUsers, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUsers); // Listing route from Phase 2

// Protected routes
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile);

module.exports = router;
