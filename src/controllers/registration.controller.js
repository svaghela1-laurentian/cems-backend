const Registration = require("../models/registration.model");
const Venue = require("../models/venue.model");

exports.registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  try {
    const registration = await Registration.create({ eventId, userId: req.user.id });
    res.status(201).json({ message: "Registered successfully", registration });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

exports.getEventsByUserId = async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user.id }).populate('eventId');
    const eventsWithVenue = await Promise.all(
      registrations.map(async (registration) => {
        const event = registration.eventId;
        if (!event) return null;
        const venue = await Venue.findById(event.venueId);
        return {
          _id: event._id,
          title: event.title,
          description: event.description,
          dateTime: event.dateTime,
          date: event.dateTime ? new Date(event.dateTime).toLocaleDateString() : null,
          venueName: venue ? venue.name : null,
          status: event.status,
          createdBy: event.createdBy
        };
      })
    );
    res.status(200).json({ events: eventsWithVenue.filter(e => e) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events with venue", error: err.message });
  }
};