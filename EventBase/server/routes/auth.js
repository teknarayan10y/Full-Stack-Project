// server/routes/auth.js
const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  logout, 
  getMe, 
  refreshToken 
} = require('../controllers/authController');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected routes
const { protect } = require('../middleware/auth');
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);

module.exports = router;