const express = require('express');
const Venue = require('../models/venue.model'); // Adjust the path as needed

const router = express.Router();

// GET /venues - Get all venues
router.get('/', async (req, res) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving venues' });
  }
});

// GET /venues/:id - Get venue by ID
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    res.json(venue);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving venue' });
  }
});

// POST /venues - Create a new venue
router.post('/', async (req, res) => {
  try {
    const venue = new Venue(req.body);
    await venue.save();
    res.status(201).json(venue);
  } catch (error) {
    res.status(400).json({ error: 'Error creating venue' });
  }
});

// PUT /venues/:id - Update an existing venue
router.put('/:id', async (req, res) => {
  try {
    const updatedVenue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVenue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    res.json(updatedVenue);
  } catch (error) {
    res.status(400).json({ error: 'Error updating venue' });
  }
});

// DELETE /venues/:id - Delete a venue
router.delete('/:id', async (req, res) => {
  try {
    const deletedVenue = await Venue.findByIdAndDelete(req.params.id);
    if (!deletedVenue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    res.json({ message: 'Venue deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting venue' });
  }
});

module.exports = router;
