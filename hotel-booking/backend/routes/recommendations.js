const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/recommendations
 * @desc    Get personalized hotel recommendations for a user
 * @access  Private
 */
router.get('/', auth, recommendationController.getRecommendations);

/**
 * @route   GET /api/recommendations/similar/:hotelId
 * @desc    Get similar hotels to a specific hotel
 * @access  Public
 */
router.get('/similar/:hotelId', recommendationController.getSimilarHotels);

/**
 * @route   GET /api/recommendations/trending
 * @desc    Get trending destinations based on recent bookings
 * @access  Public
 */
router.get('/trending', recommendationController.getTrendingDestinations);

module.exports = router;
