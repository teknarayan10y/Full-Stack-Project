const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Event',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team'
  },
  ticketNumber: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    enum: ['standard', 'vip', 'premium', 'student', 'early-bird', 'regular'],
    default: 'standard'
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'refunded', 'checked-in'],
    default: 'pending'
  },
  qrCode: {
    type: String,
    required: true
  },
  checkInTime: Date,
  checkOutTime: Date,
  metadata: {
    orderId: String,
    paymentId: String,
    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentDate: Date,
    amountPaid: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  additionalInfo: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  notes: String,
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: function() {
      // Default to 30 days after ticket creation
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent duplicate tickets for the same event and user
TicketSchema.index({ event: 1, user: 1 }, { unique: true });

// Generate ticket number before saving
TicketSchema.pre('save', async function(next) {
  if (!this.ticketNumber) {
    // Generate a unique ticket number (e.g., TKT-{timestamp}-{random})
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(1000 + Math.random() * 9000);
    this.ticketNumber = `TKT-${timestamp}-${random}`;
  }
  next();
});

// Static method to get ticket stats for an event
TicketSchema.statics.getTicketStats = async function(eventId) {
  const stats = await this.aggregate([
    {
      $match: { event: eventId }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$price' }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  return stats;
};

// Call getTicketStats after save
TicketSchema.post('save', async function() {
  await this.constructor.getTicketStats(this.event);
});

// Call getTicketStats before remove
TicketSchema.post('remove', async function() {
  await this.constructor.getTicketStats(this.event);
});

// Add a virtual for checking if the ticket is expired
TicketSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date();
});

// Add a virtual for checking if the ticket is checked in
TicketSchema.virtual('isCheckedIn').get(function() {
  return !!this.checkInTime;
});

// Add a virtual for getting the ticket holder's name
TicketSchema.virtual('holder', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

// Add a virtual for getting the event details
TicketSchema.virtual('eventDetails', {
  ref: 'Event',
  localField: 'event',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Ticket', TicketSchema);
