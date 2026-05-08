const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['layout', 'input', 'display', 'navigation', 'custom']
  },
  icon: {
    type: String
  },
  defaultProps: {
    type: Object,
    default: {}
  },
  defaultStyle: {
    type: Object,
    default: {}
  },
  isCustom: {
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

module.exports = mongoose.model('Component', ComponentSchema);
