const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// @route   POST api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', [
  auth,
  [
    check('hotelId', 'Hotel ID is required').not().isEmpty(),
    check('roomId', 'Room ID is required').not().isEmpty(),
    check('checkIn', 'Check-in date is required').not().isEmpty(),
    check('checkOut', 'Check-out date is required').not().isEmpty(),
    check('guests.adults', 'Number of adults is required').isInt({ min: 1 }),
    check('paymentMethod', 'Payment method is required').not().isEmpty()
  ]
], bookingController.createBooking);

// @route   GET api/bookings/user
// @desc    Get user's bookings
// @access  Private
router.get('/user', auth, bookingController.getUserBookings);

// @route   GET api/bookings
// @desc    Get all bookings (admin only)
// @access  Private/Admin
router.get('/', [auth], bookingController.getAllBookings);

// @route   GET api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get('/:id', auth, bookingController.getBookingById);

// @route   PUT api/bookings/:id
// @desc    Update booking
// @access  Private
router.put('/:id', auth, bookingController.updateBooking);

// @route   PUT api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', auth, bookingController.cancelBooking);

// @route   PUT api/bookings/:id/status
// @desc    Update booking status (admin only)
// @access  Private/Admin
router.put('/:id/status', [auth], bookingController.updateBookingStatus);

module.exports = router;
