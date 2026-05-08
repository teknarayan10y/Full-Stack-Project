const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  checkIn: {
    type: Date,
    required: true
  },
  checkOut: {
    type: Date,
    required: true
  },
  guests: {
    adults: {
      type: Number,
      required: true,
      min: 1
    },
    children: {
      type: Number,
      default: 0
    }
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String
  },
  specialRequests: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ hotel: 1, status: 1 });
bookingSchema.index({ checkIn: 1, checkOut: 1 });

// Middleware to update room availability
bookingSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('status')) {
    const Hotel = mongoose.model('Hotel');
    const hotel = await Hotel.findById(this.hotel);
    
    if (!hotel) {
      return next(new Error('Hotel not found'));
    }

    const room = hotel.rooms.id(this.room);
    if (!room) {
      return next(new Error('Room not found'));
    }

    // Update room availability based on booking status
    room.available = this.status === 'cancelled';
    await hotel.save();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
