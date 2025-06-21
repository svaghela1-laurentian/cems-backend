const express = require("express");
const router = express.Router();
const { createEvent, getEventByUserId, getAllEvents, getAllApprovedEvents } = require("../controllers/event.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { editEvent } = require("../controllers/event.controller");
const { getEventById } = require("../controllers/event.controller");
const { getPendingEvents, approveEvent, rejectEvent } = require("../controllers/event.controller");
const { getCounts } = require("../controllers/event.controller");


router.get("/", authMiddleware, getAllApprovedEvents);
router.post("/create", authMiddleware, createEvent);
router.get("/pending", authMiddleware, getPendingEvents);
router.get("/my-events", authMiddleware, getEventByUserId);
router.get("/counts", authMiddleware, getCounts);
router.post("/:id/approve", authMiddleware, approveEvent);
router.post("/:id/reject", authMiddleware, rejectEvent);
router.put("/:id", authMiddleware, editEvent);
router.get("/:id", authMiddleware, getEventById);


// // PUT /events/:id - Update an existing event
// router.put('/:id', async (req, res) => {
//   const { title, description, dateTime, venueId, createdBy } = req.body;

//   if (venueId && !mongoose.Types.ObjectId.isValid(venueId)) {
//     return res.status(400).json({ error: 'Invalid venueId' });
//   }
//   if (createdBy && !mongoose.Types.ObjectId.isValid(createdBy)) {
//     return res.status(400).json({ error: 'Invalid createdBy userId' });
//   }

//   try {
//     const updatedEvent = await Event.findByIdAndUpdate(
//       req.params.id,
//       { title, description, dateTime, venueId, createdBy },
//       { new: true }
//     );
//     if (!updatedEvent) {
//       return res.status(404).json({ error: 'Event not found' });
//     }
//     res.json(updatedEvent);
//   } catch (error) {
//     res.status(400).json({ error: 'Error updating event' });
//   }
// });

// // DELETE /events/:id - Delete an event
// router.delete('/:id', async (req, res) => {
//   try {
//     const deletedEvent = await Event.findByIdAndDelete(req.params.id);
//     if (!deletedEvent) {
//       return res.status(404).json({ error: 'Event not found' });
//     }
//     res.json({ message: 'Event deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error deleting event' });
//   }
// });


module.exports = router;
