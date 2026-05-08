const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: String,

  whatsappLink: String,
  telegramLink: String,
  instagramLink: String,

  joinCount: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Event", EventSchema);