import express from 'express';
import Event from '../models/Event.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all events with status updates
const updateEventStatus = (event) => {
  const currentDate = new Date();
  const eventDate = new Date(event.date);
  const eventDateTime = new Date(`${event.date}T${event.time}`);
  
  if (currentDate < eventDateTime) {
    event.status = 'upcoming';
  } else if (currentDate > eventDateTime) {
    event.status = 'completed';
  } else {
    event.status = 'ongoing';
  }
  return event;
};

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'name avatar')
      .populate('attendees', 'name email avatar')
      .sort({ date: 1 });
    
    // Update status for each event
    const updatedEvents = events.map(event => {
      const eventObj = event.toObject();
      return updateEventStatus(eventObj);
    });
    
    res.json(updatedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events' });
  }
});

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizer: req.userId
    });
    await event.save();
    
    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'name avatar')
      .populate('attendees', 'name email avatar');
    
    // Emit socket event for real-time update
    req.app.get('io').emit('newEvent', populatedEvent);
    
    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event' });
  }
});

// Get user's events (My Events)
router.get('/my-events', auth, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.userId })
      .populate('organizer', 'name avatar')
      .populate('attendees', 'name email avatar')
      .sort({ date: 1 });
    
    // Update status for each event
    const updatedEvents = events.map(event => {
      const eventObj = event.toObject();
      return updateEventStatus(eventObj);
    });
    
    res.json(updatedEvents);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your events' });
  }
});

// Get event by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name avatar')
      .populate('attendees', 'name email avatar');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    const eventObj = event.toObject();
    const updatedEvent = updateEventStatus(eventObj);
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event details' });
  }
});

// Get all attendees
router.get('/attendees/list', auth, async (req, res) => {
  try {
    const events = await Event.find()
      .populate('attendees', 'name email avatar');
    
    // Get unique attendees across all events
    const attendeesMap = new Map();
    events.forEach(event => {
      event.attendees.forEach(attendee => {
        if (attendeesMap.has(attendee._id.toString())) {
          attendeesMap.get(attendee._id.toString()).eventsJoined++;
        } else {
          attendeesMap.set(attendee._id.toString(), {
            _id: attendee._id,
            name: attendee.name,
            email: attendee.email,
            avatar: attendee.avatar,
            eventsJoined: 1
          });
        }
      });
    });
    
    const attendeesList = Array.from(attendeesMap.values());
    res.json(attendeesList);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendees' });
  }
});

// Join event
router.post('/:id/join', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.attendees.includes(req.userId)) {
      return res.status(400).json({ message: 'You have already joined this event' });
    }
    
    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is at full capacity' });
    }
    
    event.attendees.push(req.userId);
    await event.save();
    
    const updatedEvent = await Event.findById(req.params.id)
      .populate('organizer', 'name avatar')
      .populate('attendees', 'name email avatar');
    
    // Emit socket event for real-time update
    req.app.get('io').emit('eventUpdated', updatedEvent);
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to join event' });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.userId
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found or you are not the organizer' });
    }
    
    Object.assign(event, req.body);
    await event.save();
    
    const updatedEvent = await Event.findById(req.params.id)
      .populate('organizer', 'name avatar')
      .populate('attendees', 'name email avatar');
    
    // Emit socket event for real-time update
    req.app.get('io').emit('eventUpdated', updatedEvent);
    
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event' });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      organizer: req.userId
    });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found or you are not the organizer' });
    }
    
    // Emit socket event for real-time update
    req.app.get('io').emit('eventDeleted', req.params.id);
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event' });
  }
});

export default router;