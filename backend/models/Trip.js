import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Trip title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    destination: {
      type: String,
      required: [true, 'Destination is required'],
      trim: true,
    },
    country: {
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
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    travellers: {
      type: Number,
      default: 1,
      min: [1, 'Number of travellers must be at least 1'],
    },
    budget: {
      type: Number,
      default: 0,
      min: [0, 'Budget cannot be negative'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    notes: {
      type: String,
      default: '',
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['Planned', 'Ongoing', 'Completed', 'Cancelled'],
      default: 'Planned',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

tripSchema.pre('validate', function (next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date cannot be earlier than start date');
  }
  next();
});

export default mongoose.models.Trip || mongoose.model('Trip', tripSchema);
