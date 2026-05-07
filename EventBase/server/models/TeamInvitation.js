const mongoose = require('mongoose');

const TeamInvitationSchema = new mongoose.Schema({
  team: {
    type: mongoose.Schema.ObjectId,
    ref: 'Team',
    required: true
  },
  inviter: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  invitee: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['member', 'admin'],
    default: 'member'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'expired', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot be longer than 500 characters']
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Default to 7 days from now
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    },
    index: { expires: 0 } // TTL index
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent duplicate invitations
TeamInvitationSchema.index(
  { team: 1, invitee: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: 'pending' } }
);

// Add virtual for checking if invitation is expired
TeamInvitationSchema.virtual('isExpired').get(function() {
  return this.expiresAt < new Date() || this.status === 'expired';
});

// Static method to expire old invitations
TeamInvitationSchema.statics.expireOldInvitations = async function() {
  const result = await this.updateMany(
    {
      status: 'pending',
      expiresAt: { $lt: new Date() }
    },
    {
      $set: { status: 'expired' }
    }
  );
  
  if (result.nModified > 0) {
    console.log(`Expired ${result.nModified} old invitations`);
  }
  
  return result;
};

// Check for expiration before saving
TeamInvitationSchema.pre('save', function(next) {
  if (this.isExpired && this.status === 'pending') {
    this.status = 'expired';
  }
  next();
});

// Add virtual for team details
TeamInvitationSchema.virtual('teamDetails', {
  ref: 'Team',
  localField: 'team',
  foreignField: '_id',
  justOne: true
});

// Add virtual for inviter details
TeamInvitationSchema.virtual('inviterDetails', {
  ref: 'User',
  localField: 'inviter',
  foreignField: '_id',
  justOne: true,
  select: 'name email profile.avatar'
});

// Add virtual for invitee details
TeamInvitationSchema.virtual('inviteeDetails', {
  ref: 'User',
  localField: 'invitee',
  foreignField: '_id',
  justOne: true,
  select: 'name email profile.avatar'
});

// Set up a TTL index for automatic cleanup of expired invitations
TeamInvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TeamInvitation', TeamInvitationSchema);
