const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const upload = require('../middleware/upload');

// @route   GET /api/admin/hotels
// @desc    Get admin's hotels
// @access  Private/Admin
router.get('/hotels', [auth, admin], async (req, res) => {
  try {
    const hotels = await Hotel.find({ instructor: req.user.id })
      .select('name location images rooms rating createdAt')
      .sort({ createdAt: -1 });
    
    // Transform the response to ensure proper image URLs
    const transformedHotels = hotels.map(hotel => {
      const hotelData = hotel.toObject();
      // Ensure images are valid URLs
      hotelData.images = hotelData.images?.filter(url => 
        url && typeof url === 'string' && url.startsWith('http')
      ) || [];
      return hotelData;
    });

    console.log('Sending hotels with images:', 
      transformedHotels.map(h => ({ 
        name: h.name, 
        imageCount: h.images.length,
        images: h.images
      })));

    res.json(transformedHotels);
  } catch (err) {
    console.error('Get hotels error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/stats', [auth, admin], async (req, res) => {
  console.log('Getting stats for instructor:', req.user.id);
  const instructorId = req.user.id;
  try {
    const totalHotels = await Hotel.countDocuments({ instructor: instructorId });
    const activeBookings = await Booking.countDocuments({
      status: 'confirmed',
      hotel: { $in: await Hotel.find({ instructor: instructorId }).distinct('_id') }
    });
    const instructorHotels = await Hotel.find({ instructor: instructorId }).distinct('_id');

    const totalRevenue = await Booking.aggregate([
      { $match: { 
        status: 'confirmed',
        hotel: { $in: instructorHotels }
      } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    // Calculate occupancy rate
    let occupancyRate = 0;
    
    // Get total number of rooms across all instructor's hotels
    const totalRoomsResult = await Hotel.aggregate([
      { $match: { instructor: new mongoose.Types.ObjectId(instructorId) } },
      { $project: { roomCount: { $size: "$rooms" } } },
      { $group: { _id: null, total: { $sum: "$roomCount" } } }
    ]);
    
    const totalRooms = totalRoomsResult[0]?.total || 0;
    
    // Count booked rooms (rooms with available=false)
    const bookedRoomsResult = await Hotel.aggregate([
      { $match: { instructor: new mongoose.Types.ObjectId(instructorId) } },
      { $unwind: "$rooms" },
      { $match: { "rooms.available": false } },
      { $count: "bookedRooms" }
    ]);
    
    const bookedRooms = bookedRoomsResult[0]?.bookedRooms || 0;
    
    // Calculate occupancy rate
    if (totalRooms > 0) {
      occupancyRate = Math.round((bookedRooms / totalRooms) * 100);
    }

    res.json({
      totalHotels,
      activeBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      occupancyRate
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   POST /api/admin/hotels
// @desc    Create a new hotel
// @access  Private/Admin
router.post('/hotels', [
  auth,
  admin,
  upload.images,
  [
    check('data')
      .custom((value, { req }) => {
        if (!value) {
          throw new Error('Hotel data is required');
        }

        try {
          const data = JSON.parse(value);
          const errors = [];
          
          // Validate name
          if (!data.name?.trim()) {
            errors.push('Hotel name is required');
          }

          // Validate description
          if (!data.description?.trim()) {
            errors.push('Description is required');
          }

          // Validate location
          if (!data.location?.city?.trim()) {
            errors.push('City is required');
          }
          if (!data.location?.country?.trim()) {
            errors.push('Country is required');
          }

          // Validate rooms
          if (!Array.isArray(data.rooms) || data.rooms.length === 0) {
            errors.push('At least one room is required');
          } else {
            const validRooms = data.rooms.filter(room => {
              return (
                room?.type?.trim() && 
                !isNaN(parseFloat(room?.price)) && 
                parseFloat(room?.price) > 0 &&
                !isNaN(parseInt(room?.capacity)) && 
                parseInt(room?.capacity) > 0
              );
            });

            if (validRooms.length === 0) {
              errors.push('At least one valid room with type, price, and capacity is required');
            }
          }

          if (errors.length > 0) {
            throw new Error(errors.join('; '));
          }

          return true;
        } catch (err) {
          throw new Error(err.message || 'Invalid hotel data format');
        }
      }),
    check('rooms.*.price', 'Room price is required').isNumeric(),
    check('rooms.*.capacity', 'Room capacity is required').isNumeric()
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const hotelData = JSON.parse(req.body.data);
    console.log('Parsed hotel data:', hotelData);

    const hotel = new Hotel({
      name: hotelData.name,
      description: hotelData.description,
      location: {
        address: hotelData.location?.address || '',
        city: hotelData.location.city,
        country: hotelData.location.country,
        coordinates: hotelData.location.coordinates ? {
          lat: parseFloat(hotelData.location.coordinates.latitude),
          lng: parseFloat(hotelData.location.coordinates.longitude)
        } : undefined
      },
      rooms: hotelData.rooms.map(room => ({
        type: room.type,
        price: parseFloat(room.price),
        capacity: parseInt(room.capacity),
        amenities: room.amenities || []
      })),
      amenities: hotelData.amenities || [],
      instructor: req.user.id
    });

    await hotel.save();
    res.status(201).json(hotel);
  } catch (err) {
    console.error('Create hotel error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   PUT /api/admin/hotels/:id
// @desc    Update a hotel
// @access  Private/Admin
router.put('/hotels/:id', [auth, admin], async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ _id: req.params.id, instructor: req.user.id });
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found or unauthorized' });
    }

    Object.assign(hotel, req.body);
    await hotel.save();
    res.json(hotel);
  } catch (err) {
    console.error('Update hotel error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   DELETE /api/admin/hotels/:id
// @desc    Delete a hotel
// @access  Private/Admin
router.delete('/hotels/:id', [auth, admin], async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ _id: req.params.id, instructor: req.user.id });
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found or unauthorized' });
    }

    await hotel.deleteOne();
    res.json({ message: 'Hotel removed' });
  } catch (err) {
    console.error('Delete hotel error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   POST /api/admin/hotels/:id/images
// @desc    Upload hotel images
// @access  Private/Admin
router.post('/hotels/:id/images', [auth, admin, upload.array('images', 10)], async (req, res) => {
  try {
    const hotel = await Hotel.findOne({ _id: req.params.id, instructor: req.user.id });
    
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found or unauthorized' });
    }

    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    hotel.images = [...hotel.images, ...imageUrls];
    await hotel.save();

    res.json(hotel);
  } catch (err) {
    console.error('Upload images error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings with filters
// @access  Private/Admin
router.get('/bookings', [auth, admin], async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.checkIn = { $gte: new Date(startDate) };
      query.checkOut = { $lte: new Date(endDate) };
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('hotel', 'name location')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   PUT /api/admin/bookings/:id
// @desc    Update booking status
// @access  Private/Admin
router.put('/bookings/:id', [auth, admin], async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    )
      .populate('user', 'name email')
      .populate('hotel', 'name location');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// @route   PUT /api/admin/hotels/:hotelId/rooms/:roomId/reset
// @desc    Reset room availability for testing purposes
// @access  Private/Admin
router.put('/hotels/:hotelId/rooms/:roomId/reset', [auth, admin], async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;
    
    // Find the hotel
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    
    // Find the room
    const room = hotel.rooms.id(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Reset room availability
    room.available = true;
    await hotel.save();
    
    res.json({ message: 'Room availability reset successfully', room });
  } catch (err) {
    console.error('Reset room availability error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

module.exports = router;
