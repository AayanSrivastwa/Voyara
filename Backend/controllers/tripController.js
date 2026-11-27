const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const Notification = require('../models/Notification');
const { getDBStatus, getMemoryStore } = require('../config/db');

const getLocalTodayStr = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const validateTripDates = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid start or end date.';
  }
  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);
  const todayStr = getLocalTodayStr();

  if (startStr < todayStr) {
    return 'Planning start date cannot be before today.';
  }
  if (endStr < startStr) {
    return 'Trip end date cannot be before the starting trip date.';
  }
  return null;
};

const enhanceTrip = (trip, expenses = []) => {
  const plainTrip = trip.toObject ? trip.toObject() : { ...trip };
  const now = new Date();
  const start = new Date(plainTrip.startDate);
  const end = new Date(plainTrip.endDate);

  const daysRemaining = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
  let status = 'upcoming';
  let countdownText = `Starts in ${daysRemaining} days`;

  if (now > end) {
    status = 'completed';
    countdownText = 'Trip Completed';
  } else if (now >= start && now <= end) {
    status = 'ongoing';
    countdownText = 'Trip Ongoing Today';
  } else if (daysRemaining <= 0) {
    countdownText = 'Starts Today!';
  } else if (daysRemaining === 1) {
    countdownText = 'Starts Tomorrow!';
  }

  const tripExpenses = expenses.filter(
    (e) => e.tripId.toString() === plainTrip._id.toString()
  );
  const totalSpent = tripExpenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const remainingBudget = Number(plainTrip.budget) - totalSpent;
  const budgetUtilization = plainTrip.budget > 0 ? Math.round((totalSpent / plainTrip.budget) * 100) : 0;

  return {
    ...plainTrip,
    title: plainTrip.title || `Trip to ${plainTrip.destination}`,
    status,
    daysRemaining,
    countdownText,
    totalSpent,
    remainingBudget,
    budgetUtilization
  };
};

// @route GET /api/trips
const getTrips = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    if (getDBStatus()) {
      const trips = await Trip.find({ userId }).sort({ startDate: 1 });
      const expenses = await Expense.find({ userId });
      return res.json({ data: trips.map((t) => enhanceTrip(t, expenses)) });
    } else {
      const store = getMemoryStore();
      const userTrips = store.trips.filter((t) => t.userId.toString() === userId);
      return res.json({ data: userTrips.map((t) => enhanceTrip(t, store.expenses)) });
    }
  } catch (error) {
    console.error('getTrips error:', error);
    res.status(500).json({ message: 'Failed to fetch trips', error: error.message });
  }
};

// @route GET /api/trips/:id
const getTripById = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user._id.toString();

    if (getDBStatus()) {
      const trip = await Trip.findOne({ _id: tripId, userId });
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      const expenses = await Expense.find({ tripId });
      return res.json({ data: enhanceTrip(trip, expenses) });
    } else {
      const store = getMemoryStore();
      const trip = store.trips.find(
        (t) => t._id.toString() === tripId && t.userId.toString() === userId
      );
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      return res.json({ data: enhanceTrip(trip, store.expenses) });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trip details', error: error.message });
  }
};

// @route POST /api/trips
const createTrip = async (req, res) => {
  try {
    const userId = req.user._id.toString();
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
      coverImage,
      itinerary
    } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ message: 'Destination, start date, and end date are required' });
    }

    const dateError = validateTripDates(startDate, endDate);
    if (dateError) {
      return res.status(400).json({ message: dateError });
    }

    if (getDBStatus()) {
      const trip = await Trip.create({
        userId,
        title: title || `Trip to ${destination}`,
        destination,
        country: country || '',
        latitude: latitude || null,
        longitude: longitude || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        travellers: Number(travellers) || 1,
        budget: Number(budget) || 25000,
        currency: currency || 'INR',
        notes: notes || '',
        coverImage: coverImage || '',
        itinerary: itinerary || []
      });

      await Notification.create({
        userId,
        title: `Trip Created: ${destination}`,
        message: `Your journey "${trip.title}" is scheduled for ${new Date(startDate).toLocaleDateString()}.`,
        type: 'trip'
      });

      return res.status(201).json({ data: enhanceTrip(trip, []) });
    } else {
      const store = getMemoryStore();
      const newTrip = {
        _id: 'trip_' + Date.now(),
        userId,
        title: title || `Trip to ${destination}`,
        destination,
        country: country || '',
        latitude: latitude || null,
        longitude: longitude || null,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        travellers: Number(travellers) || 1,
        budget: Number(budget) || 25000,
        currency: currency || 'INR',
        notes: notes || '',
        coverImage: coverImage || '',
        itinerary: itinerary || [],
        createdAt: new Date().toISOString()
      };
      store.trips.push(newTrip);
      store.notifications.unshift({
        _id: 'notif_' + Date.now(),
        userId,
        title: `Trip Created: ${destination}`,
        message: `Your journey "${newTrip.title}" is scheduled for ${new Date(startDate).toLocaleDateString()}.`,
        type: 'trip',
        read: false,
        createdAt: new Date().toISOString()
      });
      return res.status(201).json({ data: enhanceTrip(newTrip, []) });
    }
  } catch (error) {
    console.error('createTrip error:', error);
    res.status(500).json({ message: 'Failed to create trip', error: error.message });
  }
};

// @route PATCH/PUT /api/trips/:id
const updateTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user._id.toString();
    const { title, destination, country, startDate, endDate, travellers, budget, currency, notes, coverImage, itinerary } = req.body;

    if (getDBStatus()) {
      const trip = await Trip.findOne({ _id: tripId, userId });
      if (!trip) return res.status(404).json({ message: 'Trip not found' });

      if (startDate || endDate) {
        const dateError = validateTripDates(startDate || trip.startDate, endDate || trip.endDate);
        if (dateError) return res.status(400).json({ message: dateError });
      }

      if (title !== undefined) trip.title = title;
      if (destination) trip.destination = destination;
      if (country !== undefined) trip.country = country;
      if (startDate) trip.startDate = new Date(startDate);
      if (endDate) trip.endDate = new Date(endDate);
      if (travellers !== undefined) trip.travellers = Number(travellers);
      if (budget !== undefined) trip.budget = Number(budget);
      if (currency !== undefined) trip.currency = currency;
      if (notes !== undefined) trip.notes = notes;
      if (coverImage !== undefined) trip.coverImage = coverImage;
      if (itinerary !== undefined) trip.itinerary = itinerary;

      const updated = await trip.save();
      const expenses = await Expense.find({ tripId });
      return res.json({ data: enhanceTrip(updated, expenses) });
    } else {
      const store = getMemoryStore();
      const index = store.trips.findIndex(
        (t) => t._id.toString() === tripId && t.userId.toString() === userId
      );
      if (index === -1) return res.status(404).json({ message: 'Trip not found' });

      if (startDate || endDate) {
        const dateError = validateTripDates(
          startDate || store.trips[index].startDate,
          endDate || store.trips[index].endDate
        );
        if (dateError) return res.status(400).json({ message: dateError });
      }

      store.trips[index] = {
        ...store.trips[index],
        title: title !== undefined ? title : store.trips[index].title,
        destination: destination || store.trips[index].destination,
        country: country !== undefined ? country : store.trips[index].country,
        startDate: startDate ? new Date(startDate).toISOString() : store.trips[index].startDate,
        endDate: endDate ? new Date(endDate).toISOString() : store.trips[index].endDate,
        travellers: travellers !== undefined ? Number(travellers) : store.trips[index].travellers,
        budget: budget !== undefined ? Number(budget) : store.trips[index].budget,
        currency: currency !== undefined ? currency : store.trips[index].currency,
        notes: notes !== undefined ? notes : store.trips[index].notes,
        coverImage: coverImage !== undefined ? coverImage : store.trips[index].coverImage,
        itinerary: itinerary !== undefined ? itinerary : store.trips[index].itinerary,
        updatedAt: new Date().toISOString()
      };
      return res.json({ data: enhanceTrip(store.trips[index], store.expenses) });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update trip', error: error.message });
  }
};

// @route DELETE /api/trips/:id
const deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user._id.toString();

    if (getDBStatus()) {
      const trip = await Trip.findOneAndDelete({ _id: tripId, userId });
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      await Expense.deleteMany({ tripId });
      return res.json({ message: 'Trip and associated expenses removed' });
    } else {
      const store = getMemoryStore();
      const beforeCount = store.trips.length;
      store.trips = store.trips.filter(
        (t) => !(t._id.toString() === tripId && t.userId.toString() === userId)
      );
      if (store.trips.length === beforeCount) {
        return res.status(404).json({ message: 'Trip not found' });
      }
      store.expenses = store.expenses.filter((e) => e.tripId.toString() !== tripId);
      return res.json({ message: 'Trip and associated expenses removed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete trip', error: error.message });
  }
};

// @route GET /api/trips/:id/itineraries
const getItineraries = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user._id.toString();

    if (getDBStatus()) {
      const trip = await Trip.findOne({ _id: tripId, userId });
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      return res.json({ data: trip.itinerary || [] });
    } else {
      const store = getMemoryStore();
      const trip = store.trips.find(
        (t) => t._id.toString() === tripId && t.userId.toString() === userId
      );
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      return res.json({ data: trip.itinerary || [] });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch itineraries', error: error.message });
  }
};

// @route POST /api/trips/:id/itineraries
const createItinerary = async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user._id.toString();
    const { title, activity, date, time, category, location, estimatedCost, description } = req.body;

    const itemTitle = title || activity;
    if (!itemTitle) {
      return res.status(400).json({ message: 'Activity title is required' });
    }

    const newItem = {
      title: itemTitle,
      date: date ? new Date(date) : new Date(),
      time: time || '09:00',
      category: category || 'Sightseeing',
      location: location || '',
      estimatedCost: Number(estimatedCost) || 0,
      description: description || '',
      completed: false
    };

    if (getDBStatus()) {
      const trip = await Trip.findOne({ _id: tripId, userId });
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      trip.itinerary.push(newItem);
      await trip.save();
      const created = trip.itinerary[trip.itinerary.length - 1];
      return res.status(201).json({ data: created });
    } else {
      const store = getMemoryStore();
      const trip = store.trips.find(
        (t) => t._id.toString() === tripId && t.userId.toString() === userId
      );
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      const memItem = { _id: 'itin_' + Date.now(), ...newItem, date: newItem.date.toISOString() };
      trip.itinerary = trip.itinerary || [];
      trip.itinerary.push(memItem);
      return res.status(201).json({ data: memItem });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to add itinerary item', error: error.message });
  }
};

// @route PATCH /api/trips/:id/itineraries/:itemId
const updateItinerary = async (req, res) => {
  try {
    const { id: tripId, itemId } = req.params;
    const userId = req.user._id.toString();

    if (getDBStatus()) {
      const trip = await Trip.findOne({ _id: tripId, userId });
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      const item = trip.itinerary.id(itemId);
      if (!item) return res.status(404).json({ message: 'Itinerary item not found' });
      Object.assign(item, req.body);
      await trip.save();
      return res.json({ data: item });
    } else {
      const store = getMemoryStore();
      const trip = store.trips.find(
        (t) => t._id.toString() === tripId && t.userId.toString() === userId
      );
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      const item = (trip.itinerary || []).find((i) => i._id.toString() === itemId);
      if (!item) return res.status(404).json({ message: 'Itinerary item not found' });
      Object.assign(item, req.body);
      return res.json({ data: item });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update itinerary item', error: error.message });
  }
};

// @route DELETE /api/trips/:id/itineraries/:itemId
const deleteItinerary = async (req, res) => {
  try {
    const { id: tripId, itemId } = req.params;
    const userId = req.user._id.toString();

    if (getDBStatus()) {
      const trip = await Trip.findOne({ _id: tripId, userId });
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      trip.itinerary = trip.itinerary.filter((i) => i._id.toString() !== itemId);
      await trip.save();
      return res.json({ message: 'Activity removed' });
    } else {
      const store = getMemoryStore();
      const trip = store.trips.find(
        (t) => t._id.toString() === tripId && t.userId.toString() === userId
      );
      if (!trip) return res.status(404).json({ message: 'Trip not found' });
      trip.itinerary = (trip.itinerary || []).filter((i) => i._id.toString() !== itemId);
      return res.json({ message: 'Activity removed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete itinerary item', error: error.message });
  }
};

module.exports = {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getItineraries,
  createItinerary,
  updateItinerary,
  deleteItinerary
};
