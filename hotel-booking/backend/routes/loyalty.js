const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const loyaltyController = require('../controllers/loyaltyController');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/loyalty
 * @desc    Get user's loyalty program details
 * @access  Private
 */
router.get('/', auth, loyaltyController.getLoyaltyDetails);

/**
 * @route   GET /api/loyalty/history
 * @desc    Get user's points history
 * @access  Private
 */
router.get('/history', auth, loyaltyController.getPointsHistory);

/**
 * @route   POST /api/loyalty/redeem
 * @desc    Redeem points for a discount
 * @access  Private
 */
router.post(
  '/redeem',
  [
    auth,
    [
      check('points', 'Points must be a positive number').isInt({ min: 1 })
    ]
  ],
  loyaltyController.redeemPoints
);

module.exports = router;
