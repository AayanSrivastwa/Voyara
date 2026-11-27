const mongoose = require('mongoose');

const savedPlaceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destinationId: {
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
  category: {
    type: String,
    default: 'Destination'
  },
  latitude: {
    type: Number,
    default: 0
  },
  longitude: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SavedPlace', savedPlaceSchema);
