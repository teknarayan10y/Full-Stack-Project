const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const loyaltyController = require('./loyaltyController');

exports.createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      hotelId,
      roomId,
      checkIn,
      checkOut,
      guests,
      paymentMethod,
      specialRequests
    } = req.body;

    // Validate hotel and room
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const room = hotel.rooms.id(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.available) {
      return res.status(400).json({ message: 'Room is not available' });
    }

    // Calculate total price
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * nights;

    // Log the user information for debugging
    console.log('User info from request:', req.user);
    console.log('User ID from request:', req.user.id);
    
    // Ensure we have valid ObjectIDs
    const mongoose = require('mongoose');
    const userId = req.user.id;
    const hotelObjectId = mongoose.Types.ObjectId.isValid(hotelId) ? new mongoose.Types.ObjectId(hotelId) : null;
    const roomObjectId = mongoose.Types.ObjectId.isValid(roomId) ? new mongoose.Types.ObjectId(roomId) : null;
    
    if (!hotelObjectId) {
      return res.status(400).json({ message: 'Invalid hotel ID format' });
    }
    
    if (!roomObjectId) {
      return res.status(400).json({ message: 'Invalid room ID format' });
    }
    
    // Create booking with properly formatted ObjectIDs
    const booking = new Booking({
      user: userId,
      hotel: hotelObjectId,
      room: roomObjectId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests,
      totalPrice,
      payment: {
        method: paymentMethod
      },
      specialRequests: specialRequests || ''
    });
    
    console.log('Booking object before save:', booking);
    
    // Save the booking with error handling
    try {
      await booking.save();
      console.log('Booking saved successfully');
    } catch (saveError) {
      console.error('Error saving booking:', saveError);
      throw saveError; // This will be caught by the outer try/catch
    }

    // Update room availability
    room.available = false;
    await hotel.save();
    
    // Award loyalty points for the booking
    await loyaltyController.awardPointsForBooking(userId, booking._id, totalPrice);

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully. Loyalty points have been awarded.'
    });
  } catch (error) {
    console.error('Create booking error:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack 
    });
  }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    console.log('Getting all bookings');
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('hotel', 'name location')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// Get user's bookings
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting bookings for user:', userId);
    
    // Ensure we have a valid user ID
    if (!userId) {
      console.error('No user ID found in request');
      return res.status(400).json({
        message: 'User ID is required'
      });
    }

    // Find all bookings for the user and populate necessary fields
    console.log('Finding bookings with user ID:', userId);
    const bookings = await Booking.find({ user: userId })
      .populate('hotel', 'name location images rating')
      .populate('room', 'name type price')
      .sort({ createdAt: -1 });

    console.log(`Found ${bookings.length} bookings for user:`, userId);
    
    // Transform the data to include only necessary fields
    const transformedBookings = bookings.map(booking => {
      console.log('Processing booking:', booking._id);
      return {
        _id: booking._id,
        hotel: {
          name: booking.hotel?.name || 'Hotel Name Unavailable',
          location: booking.hotel?.location || 'Location Unavailable',
          image: booking.hotel?.images?.[0] || null
        },
        room: {
          name: booking.room?.name || 'Room Unavailable',
          type: booking.room?.type || 'Standard'
        },
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        status: booking.status,
        payment: booking.payment
      };
    });

    console.log('Successfully transformed bookings');
    res.json(transformedBookings);
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      message: 'Failed to fetch bookings',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotel')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the user or if user is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the user or if user is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Only allow updates to certain fields
    const allowedUpdates = ['specialRequests', 'guests'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    updates.forEach(update => booking[update] = req.body[update]);
    await booking.save();

    res.json(booking);
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ 
        message: 'Invalid status. Status must be one of: pending, confirmed, cancelled, completed' 
      });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Only instructor can update status
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ message: 'Not authorized. Instructor privileges required.' });
    }
    
    // Update status
    booking.status = status;
    
    // If status is cancelled, make the room available again
    if (status === 'cancelled') {
      const hotel = await Hotel.findById(booking.hotel);
      if (hotel) {
        const room = hotel.rooms.id(booking.room);
        if (room) {
          room.available = true;
          await hotel.save();
        }
      }
    }
    
    await booking.save();
    
    res.json({ 
      success: true, 
      message: `Booking status updated to ${status}`, 
      booking 
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if the booking belongs to the user or if user is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if booking can be cancelled (e.g., not too close to check-in date)
    const checkIn = new Date(booking.checkIn);
    const now = new Date();
    const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);

    if (hoursUntilCheckIn < 24) {
      return res.status(400).json({ 
        message: 'Bookings can only be cancelled at least 24 hours before check-in' 
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Update room availability
    const hotel = await Hotel.findById(booking.hotel);
    const room = hotel.rooms.id(booking.room);
    room.available = true;
    await hotel.save();

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
