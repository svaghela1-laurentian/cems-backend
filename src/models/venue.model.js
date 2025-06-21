const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  capacity: { type: Number, required: true },
  availableSlots: [{ date: Date }]
});

module.exports = mongoose.model("Venue", venueSchema);