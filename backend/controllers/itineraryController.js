import Itinerary from '../models/Itinerary.js';
import Trip from '../models/Trip.js';

export const getItineraries = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    // Verify trip ownership
    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    const items = await Itinerary.find({ tripId }).sort({ date: 1, time: 1, order: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

export const createItinerary = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const trip = await Trip.findOne({ _id: tripId, userId: req.user._id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
    }

    const {
      date,
      time,
      title,
      description,
      category,
      location,
      latitude,
      longitude,
      estimatedCost,
      order,
    } = req.body;

    // Validate date falls within trip range
    const activityDate = new Date(date);
    const tripStart = new Date(trip.startDate);
    const tripEnd = new Date(trip.endDate);

    // Normalize dates to midnight for comparison
    tripStart.setHours(0, 0, 0, 0);
    tripEnd.setHours(23, 59, 59, 999);

    if (activityDate < tripStart || activityDate > tripEnd) {
      return res.status(400).json({
        success: false,
        message: 'Activity date must fall between the trip start date and end date.',
      });
    }

    const item = await Itinerary.create({
      userId: req.user._id,
      tripId,
      date: activityDate,
      time: time || '09:00',
      title,
      description,
      category: category || 'Sightseeing',
      location,
      latitude,
      longitude,
      estimatedCost: estimatedCost || 0,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      data: item,
      message: 'Itinerary activity added successfully.',
    });
  } catch (err) {
    next(err);
  }
};

export const updateItinerary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Itinerary.findOne({ _id: id, userId: req.user._id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Activity not found or unauthorized.' });
    }

    const fields = [
      'date',
      'time',
      'title',
      'description',
      'category',
      'location',
      'latitude',
      'longitude',
      'estimatedCost',
      'completed',
      'order',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    await item.save();

    res.status(200).json({
      success: true,
      data: item,
      message: 'Itinerary activity updated.',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteItinerary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Itinerary.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Activity not found or unauthorized.' });
    }

    res.status(200).json({
      success: true,
      message: 'Activity removed from itinerary.',
    });
  } catch (err) {
    next(err);
  }
};
