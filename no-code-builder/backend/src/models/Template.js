const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['layout', 'form', 'card', 'navigation', 'custom'],
    default: 'custom'
  },
  components: [{
    type: {
      type: String,
      required: true
    },
    props: {
      type: Object,
      default: {}
    },
    children: [mongoose.Schema.Types.Mixed],
    style: {
      type: Object,
      default: {}
    },
    id: {
      type: String,
      required: true
    },
    position: {
      x: Number,
      y: Number
    }
  }],
  thumbnail: {
    type: String
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Template', TemplateSchema);
