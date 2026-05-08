const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], authController.register);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], authController.login);

// @route   GET api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, authController.getProfile);

// @route   PUT api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, authController.updateProfile);

// @route   PUT api/auth/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, authController.updatePreferences);

// @route   PUT api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, [
  check('currentPassword', 'Current password is required').exists(),
  check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
], authController.changePassword);

module.exports = router;
