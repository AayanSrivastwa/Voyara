import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
    },
    type: {
      type: String,
      enum: ['trip', 'budget', 'weather', 'account', 'system'],
      default: 'system',
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    relatedTripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
