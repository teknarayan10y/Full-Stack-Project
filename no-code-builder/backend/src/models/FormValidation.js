const mongoose = require('mongoose');

const ValidationRuleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['required', 'minLength', 'maxLength', 'pattern', 'email', 'number', 'min', 'max', 'custom']
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: function() {
      return this.type !== 'required' && this.type !== 'email';
    }
  },
  message: {
    type: String,
    required: true
  },
  customValidator: {
    type: String,
    required: function() {
      return this.type === 'custom';
    }
  }
});

const FormFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['text', 'email', 'password', 'number', 'tel', 'date', 'textarea', 'select', 'checkbox', 'radio']
  },
  placeholder: {
    type: String
  },
  defaultValue: {
    type: mongoose.Schema.Types.Mixed
  },
  options: [{
    label: String,
    value: String
  }],
  validationRules: [ValidationRuleSchema],
  style: {
    type: Object,
    default: {}
  }
});

const FormValidationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  fields: [FormFieldSchema],
  submitAction: {
    type: {
      type: String,
      enum: ['email', 'api', 'redirect', 'custom'],
      default: 'email'
    },
    config: {
      type: Object,
      default: {}
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

module.exports = mongoose.model('FormValidation', FormValidationSchema);
