const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const hotelController = require('../controllers/hotelController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

/**
 * @route   POST /api/hotels
 * @desc    Create a new hotel
 * @access  Private/Admin
 */
router.post('/',
  [
    auth,
    admin,
    upload.images,
    [
      check('data')
        .notEmpty()
        .withMessage('Hotel data is required')
        .custom((value, { req }) => {
          try {
            const data = JSON.parse(value);
            
            // Validate name
            if (!data.name || !data.name.trim()) {
              throw new Error('Hotel name is required');
            }
            if (data.name.trim().length < 2 || data.name.trim().length > 100) {
              throw new Error('Hotel name must be between 2 and 100 characters');
            }

            // Validate description
            if (!data.description || !data.description.trim()) {
              throw new Error('Description is required');
            }
            if (data.description.trim().length < 10) {
              throw new Error('Description must be at least 10 characters long');
            }

            // Validate location
            if (!data.location) {
              throw new Error('Location is required');
            }
            if (!data.location.city || !data.location.city.trim()) {
              throw new Error('City is required');
            }
            if (!data.location.country || !data.location.country.trim()) {
              throw new Error('Country is required');
            }
            if (!data.location.address || !data.location.address.trim()) {
              throw new Error('Address is required');
            }

            // Validate coordinates if provided
            if (data.location.coordinates) {
              const { latitude, longitude } = data.location.coordinates;
              if (latitude && (isNaN(latitude) || latitude < -90 || latitude > 90)) {
                throw new Error('Invalid latitude value');
              }
              if (longitude && (isNaN(longitude) || longitude < -180 || longitude > 180)) {
                throw new Error('Invalid longitude value');
              }
            }

            // Validate rooms
            if (!Array.isArray(data.rooms) || data.rooms.length === 0) {
              throw new Error('At least one room is required');
            }

            data.rooms.forEach((room, index) => {
              if (!room.type || !room.type.trim()) {
                throw new Error(`Room ${index + 1}: Type is required`);
              }
              if (!room.price || isNaN(room.price) || room.price <= 0) {
                throw new Error(`Room ${index + 1}: Price must be a positive number`);
              }
              if (!room.capacity || isNaN(room.capacity) || room.capacity < 1) {
                throw new Error(`Room ${index + 1}: Capacity must be at least 1`);
              }
              if (room.amenities && !Array.isArray(room.amenities)) {
                throw new Error(`Room ${index + 1}: Amenities must be an array`);
              }
            });

            // Validate amenities if provided
            if (data.amenities && !Array.isArray(data.amenities)) {
              throw new Error('Hotel amenities must be an array');
            }

            return true;
          } catch (err) {
            throw new Error(err.message);
          }
        })
    ]
  ],
  hotelController.createHotel
);

/**
 * @route   GET /api/hotels
 * @desc    Get all hotels with filters
 * @access  Public
 */
router.get('/', hotelController.getHotels);

/**
 * @route   GET /api/hotels/:id
 * @desc    Get hotel by ID
 * @access  Public
 */
router.get('/:id', hotelController.getHotelById);

/**
 * @route   PUT /api/hotels/:id
 * @desc    Update hotel
 * @access  Private/Admin
 */
router.put('/:id',
  [auth, admin],
  hotelController.updateHotel
);

/**
 * @route   DELETE /api/hotels/:id
 * @desc    Delete hotel
 * @access  Private/Admin
 */
router.delete('/:id',
  [auth, admin],
  hotelController.deleteHotel
);

module.exports = router;
