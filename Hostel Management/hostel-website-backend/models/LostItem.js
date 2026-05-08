const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  item: String,
  description: String,
  location: String,
  image: String, // image path
  comments: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LostItem', lostItemSchema);
