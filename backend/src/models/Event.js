import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Conference', 'Workshop', 'Seminar', 'Meetup', 'Other']
  },
  capacity: {
    type: Number,
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2000'
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed'],
    default: 'upcoming'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Event', eventSchema);