const mongoose = require('mongoose');

const itineraryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, default: '09:00' },
  category: { type: String, default: 'Sightseeing' },
  location: { type: String, default: '' },
  estimatedCost: { type: Number, default: 0 },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false }
});

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    default: ''
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  travellers: {
    type: Number,
    default: 1
  },
  budget: {
    type: Number,
    required: true,
    default: 25000
  },
  currency: {
    type: String,
    default: 'INR'
  },
  coverImage: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  },
  itinerary: [itineraryItemSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Trip', tripSchema);
