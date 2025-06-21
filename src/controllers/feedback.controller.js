const Feedback = require("../models/feedback.model");

exports.submitFeedback = async (req, res) => {
  const { eventId, rating, comment } = req.body;
  console.log("🚀 ~ exports.submitFeedback= ~ eventId:", eventId)
  try {
    const feedback = await Feedback.create({ userId: req.user.id, eventId, rating, comment });
    res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (err) {
    console.log("🚀 ~ exports.submitFeedback= ~ err:", err)
    res.status(500).json({ message: "Submission failed", error: err.message });
  }
};
