import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Activity date is required'],
    },
    time: {
      type: String,
      default: '09:00',
    },
    title: {
      type: String,
      required: [true, 'Activity title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: [
        'Sightseeing',
        'Adventure',
        'Food',
        'Shopping',
        'Transportation',
        'Accommodation',
        'Relaxation',
        'Other',
      ],
      default: 'Sightseeing',
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    estimatedCost: {
      type: Number,
      default: 0,
      min: [0, 'Cost cannot be negative'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Itinerary || mongoose.model('Itinerary', itinerarySchema);
