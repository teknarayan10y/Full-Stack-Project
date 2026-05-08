const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  amenities: [{
    type: String
  }],
  description: String,
  images: [String],
  virtualTour: {
    enabled: {
      type: Boolean,
      default: false
    },
    panoramaImages: [String],
    videoUrl: String,
    threeDModelUrl: String
  },
  available: {
    type: Boolean,
    default: true
  }
});

const hotelSchema = new mongoose.Schema({
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  amenities: [{
    type: String
  }],
  rooms: [roomSchema],
  images: [String],
  policies: {
    checkInTime: String,
    checkOutTime: String,
    cancellationPolicy: String
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better search performance
hotelSchema.index({ 'location.city': 1, 'location.country': 1 });
hotelSchema.index({ rating: -1 });
hotelSchema.index({ featured: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);
