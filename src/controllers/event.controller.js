const Event = require("../models/event.model");
const mongoose = require('mongoose');
const Registration = require("../models/registration.model");
const Venue = require("../models/venue.model");
const Feedback = require("../models/feedback.model");

exports.createEvent = async (req, res) => {
    const { title, description, dateTime, venueId, status="submitted" } = req.body;

    const createdBy = req.user.id;
    // Validate venueId
    if (!mongoose.Types.ObjectId.isValid(venueId)) {
        return res.status(400).json({ error: 'Invalid venueId' });
    }
    // Validate createdBy
    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
        return res.status(400).json({ error: 'Invalid createdBy userId' });
    }
    try {
        const event = new Event({
            title,
            description,
            dateTime,
            venueId,
            status,
            createdBy
        });
        await event.save();
        res.status(201).json({ message: "Event created successfully", event });
    } catch (err) {
        console.error("Error creating event:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.editEvent = async (req, res) => {
    const { title, description, dateTime, venueId, status } = req.body;
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        event.title = title !== undefined ? title : event.title;
        event.description = description !== undefined ? description : event.description;
        event.dateTime = dateTime !== undefined ? dateTime : event.dateTime;
        event.venueId = venueId !== undefined ? venueId : event.venueId;
        event.status = status !== undefined ? status : event.status;
        await event.save();
        res.json({ message: "Event updated successfully", event });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getEventByUserId = async (req, res) => {
    const userId = req.user.id;
    console.log("🚀 ~ exports.getEventByUserId= ~ userId:", userId)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId' });
    }
    try {
        const events = await Event.find({ createdBy: userId });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getAllApprovedEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: "approved" });
        const eventsWithVenue = await Promise.all(events.map(async (event) => {
            const venue = await Venue.findById(event.venueId);
            // Fetch feedback for the event
            let feedback = [];
            if (event._id) {
                try {
                    feedback = await Feedback.find({ eventId: event._id });
                } catch (e) {
                    // Feedback model might not exist or error occurred
                    feedback = [];
                }
            }
            return {
                _id: event._id,
                title: event.title,
                description: event.description,
                dateTime: event.dateTime,
                date: event.dateTime ? new Date(event.dateTime).toLocaleDateString() : null,
                venueName: venue ? venue.name : null,
                status: event.status,
                createdBy: event.createdBy,
                feedback: feedback
            };
        }));
        res.json(eventsWithVenue);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


exports.getPendingEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: "submitted" });
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.approveEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        event.status = "approved";
        await event.save();
        res.json({ message: "Event approved successfully", event });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.rejectEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        event.status = "rejected";
        await event.save();
        res.json({ message: "Event rejected successfully", event });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

exports.getCounts = async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments({ status: "approved" });
        const userEvents = await Event.countDocuments({ createdBy: req.user.id });
        const registrations = await Registration.countDocuments({ userId: req.user.id });
        const myEventsCount = userEvents + registrations;

        res.json({
            totalEvents,
            myEventsCount
        });
    } catch (err) {
        console.log("🚀 ~ exports.getCounts= ~ err:", err)
        res.status(500).json({ message: "Server error", error: err.message });
    }
};