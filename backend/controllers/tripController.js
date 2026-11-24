import Trip from '../models/Trip.js';
import Itinerary from '../models/Itinerary.js';
import Expense from '../models/Expense.js';
import Notification from '../models/Notification.js';

export const getTrips = async (req, res, next) => {
  try {
    const { status, search, sort = 'startDate' } = req.query;
    const filter = { userId: req.user._id };

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search && search.trim() !== '') {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { destination: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOptions = {};
    if (sort === 'startDate') sortOptions.startDate = 1;
    else if (sort === '-startDate') sortOptions.startDate = -1;
    else if (sort === 'budget') sortOptions.budget = -1;
    else sortOptions.createdAt = -1;

    const trips = await Trip.find(filter).sort(sortOptions);

    // Compute durations and countdowns
    const now = new Date();
    const enriched = trips.map((trip) => {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);
      const durationDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
      const daysUntil = Math.ceil((start - now) / (1000 * 60 * 60 * 24));

      return {
        ...trip.toObject(),
        durationDays,
        daysUntil,
        isUpcoming: daysUntil > 0,
        isCurrent: daysUntil <= 0 && now <= end,
      };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched,
    });
  } catch (err) {
    next(err);
  }
};

export const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized access.',
      });
    }

    const now = new Date();
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const durationDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
    const daysUntil = Math.ceil((start - now) / (1000 * 60 * 60 * 24));

    res.status(200).json({
      success: true,
      data: {
        ...trip.toObject(),
        durationDays,
        daysUntil,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    const {
      title,
      destination,
      country,
      latitude,
      longitude,
      startDate,
      endDate,
      travellers,
      budget,
      currency,
      notes,
      status,
    } = req.body;

    const trip = await Trip.create({
      userId: req.user._id,
      title,
      destination,
      country,
      latitude,
      longitude,
      startDate,
      endDate,
      travellers: travellers || 1,
      budget: budget || 0,
      currency: currency || req.user.preferences?.defaultCurrency || 'INR',
      notes,
      status: status || 'Planned',
    });

    // Notify user
    try {
      await Notification.create({
        userId: req.user._id,
        title: 'Trip Created',
        message: `Your trip to ${destination} ("${title}") is ready for day-wise itinerary planning.`,
        type: 'trip',
        relatedTripId: trip._id,
      });
    } catch {
      // Ignore
    }

    res.status(201).json({
      success: true,
      data: trip,
      message: 'Trip created successfully.',
    });
  } catch (err) {
    next(err);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.',
      });
    }

    const fields = [
      'title',
      'destination',
      'country',
      'latitude',
      'longitude',
      'startDate',
      'endDate',
      'travellers',
      'budget',
      'currency',
      'notes',
      'status',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        trip[field] = req.body[field];
      }
    });

    await trip.save();

    res.status(200).json({
      success: true,
      data: trip,
      message: 'Trip updated successfully.',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found or unauthorized.',
      });
    }

    // Cascade delete itineraries, expenses, and notifications related to this trip
    await Promise.all([
      Itinerary.deleteMany({ tripId: trip._id }),
      Expense.deleteMany({ tripId: trip._id }),
      Notification.deleteMany({ relatedTripId: trip._id }),
      Trip.findByIdAndDelete(trip._id),
    ]);

    res.status(200).json({
      success: true,
      message: 'Trip and associated itinerary/expense records deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};
