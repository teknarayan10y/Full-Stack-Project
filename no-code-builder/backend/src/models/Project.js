const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pages: [{
    name: String,
    components: [{
      type: {
        type: String,
        required: true
      },
      props: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      children: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
      },
      style: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
      },
      id: {
        type: String,
        required: function() {
          // Only require ID if this is not a template structure
          return !this.isTemplate;
        }
      },
      position: {
        x: Number,
        y: Number
      },
      isTemplate: {
        type: Boolean,
        default: false
      }
    }],
    layout: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  }],
  published: {
    type: Boolean,
    default: false
  },
  publishedUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
