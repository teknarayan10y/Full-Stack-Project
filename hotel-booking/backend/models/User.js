const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'instructor'],
    default: 'user'
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  preferences: {
    preferredRoomType: {
      type: String,
      enum: ['Standard', 'Deluxe', 'Suite', 'Any'],
      default: 'Any'
    },
    specialRequirements: {
      type: String,
      default: ''
    },
    preferredAmenities: [{
      type: String,
      enum: ['WiFi', 'Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Parking', 'AirportShuttle', 'PetFriendly', 'RoomService'],
    }],
    preferredLocations: [{
      type: String
    }]
  },
  loyaltyProgram: {
    points: {
      type: Number,
      default: 0
    },
    tier: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Bronze'
    },
    memberSince: {
      type: Date,
      default: Date.now
    },
    pointsHistory: [{
      points: Number,
      description: String,
      date: {
        type: Date,
        default: Date.now
      },
      bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
      }
    }]
  },
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
