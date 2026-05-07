const mongoose = require('mongoose');
const slugify = require('slugify');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  eventType: {
    type: String,
    required: [true, 'Please select event type'],
    enum: [
      'hackathon',
      'workshop',
      'conference',
      'meetup',
      'webinar',
      'competition',
      'other'
    ]
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  registrationDeadline: {
    type: Date,
    required: [true, 'Please add a registration deadline']
  },
  location: {
    type: {
      type: String,
      enum: ['online', 'in-person', 'hybrid'],
      default: 'online'
    },
    venue: String,
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    onlineLink: String
  },
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  maxParticipants: {
    type: Number,
    min: 1
  },
  price: {
    type: Number,
    default: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  categories: {
    type: [String],
    required: [true, 'Please add at least one category'],
    enum: [
      'technology',
      'business',
      'science',
      'health',
      'arts',
      'sports',
      'education',
      'entertainment',
      'other'
    ]
  },
  tags: [String],
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  requirements: [String],
  schedule: [
    {
      title: {
        type: String,
        required: [true, 'Please add a schedule item title']
      },
      description: String,
      startTime: {
        type: Date,
        required: [true, 'Please add a start time']
      },
      endTime: {
        type: Date,
        required: [true, 'Please add an end time']
      },
      speaker: String,
      location: String
    }
  ],
  prizes: [
    {
      position: {
        type: String,
        required: [true, 'Please add a position (e.g., 1st, 2nd)']
      },
      title: {
        type: String,
        required: [true, 'Please add a prize title']
      },
      description: String,
      value: Number
    }
  ],
  isPublished: {
    type: Boolean,
    default: false
  },
  isTeamEvent: {
    type: Boolean,
    default: false
  },
  maxTeamSize: {
    type: Number,
    min: 1,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create event slug from the name
EventSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Cascade delete teams when an event is deleted
EventSchema.pre('remove', async function(next) {
  console.log(`Teams being removed for event ${this._id}`);
  await this.model('Team').deleteMany({ event: this._id });
  next();
});

// Reverse populate with virtuals
EventSchema.virtual('teams', {
  ref: 'Team',
  localField: '_id',
  foreignField: 'event',
  justOne: false
});

// Static method to get average of event prices
EventSchema.statics.getAverageCost = async function(organizerId) {
  const obj = await this.aggregate([
    {
      $match: { organizer: organizerId }
    },
    {
      $group: {
        _id: '$organizer',
        averageCost: { $avg: '$price' }
      }
    }
  ]);

  try {
    await this.model('User').findByIdAndUpdate(organizerId, {
      averageEventPrice: Math.ceil(obj[0].averageCost / 10) * 10 || 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
EventSchema.post('save', function() {
  this.constructor.getAverageCost(this.organizer);
});

// Call getAverageCost before remove
EventSchema.pre('remove', function() {
  this.constructor.getAverageCost(this.organizer);
});

module.exports = mongoose.model('Event', EventSchema);
