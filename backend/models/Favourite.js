import mongoose from 'mongoose';

const favouriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    destinationId: {
      type: String,
      default: '',
    },
    destination: {
      type: String,
      required: [true, 'Destination name is required'],
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
    notes: {
      type: String,
      default: '',
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

favouriteSchema.index({ userId: 1, destination: 1 }, { unique: true });

export default mongoose.models.Favourite || mongoose.model('Favourite', favouriteSchema);
