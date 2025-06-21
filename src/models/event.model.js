const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dateTime: { type: Date, required: true },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
  status: { type: String, required: true, enum: ["draft", "submitted", "approved", "rejected", "scheduled"] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model("Event", eventSchema);