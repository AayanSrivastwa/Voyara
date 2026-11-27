const SavedPlace = require('../models/SavedPlace');
const Notification = require('../models/Notification');
const { getDBStatus, getMemoryStore } = require('../config/db');

// @route GET /api/favourites
const getFavourites = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    if (getDBStatus()) {
      const favs = await SavedPlace.find({ userId }).sort({ createdAt: -1 });
      return res.json({ data: favs });
    } else {
      const store = getMemoryStore();
      return res.json({ data: store.savedPlaces.filter((p) => p.userId.toString() === userId) });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to load favourites', error: error.message });
  }
};

// @route POST /api/favourites
const addFavourite = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { destinationId, destination, placeName, country, latitude, longitude, notes } = req.body;
    const destName = destination || placeName;
    if (!destName) return res.status(400).json({ message: 'Destination name is required' });

    if (getDBStatus()) {
      const exists = await SavedPlace.findOne({ userId, destination: destName });
      if (exists) return res.status(400).json({ message: 'Destination already saved' });
      const fav = await SavedPlace.create({
        userId,
        destinationId: destinationId || '',
        destination: destName,
        country: country || '',
        latitude: latitude || 0,
        longitude: longitude || 0,
        notes: notes || ''
      });
      return res.status(201).json({ data: fav });
    } else {
      const store = getMemoryStore();
      const exists = store.savedPlaces.find(
        (p) => p.userId.toString() === userId && (p.destination || '').toLowerCase() === destName.toLowerCase()
      );
      if (exists) return res.status(400).json({ message: 'Destination already saved' });
      const newFav = {
        _id: 'fav_' + Date.now(),
        userId,
        destinationId: destinationId || '',
        destination: destName,
        country: country || '',
        latitude: latitude || 0,
        longitude: longitude || 0,
        notes: notes || '',
        createdAt: new Date().toISOString()
      };
      store.savedPlaces.push(newFav);
      return res.status(201).json({ data: newFav });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to save favourite', error: error.message });
  }
};

// @route PATCH /api/favourites/:id
const updateFavourite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();
    const { notes } = req.body;

    if (getDBStatus()) {
      const fav = await SavedPlace.findOneAndUpdate({ _id: id, userId }, { notes }, { new: true });
      if (!fav) return res.status(404).json({ message: 'Saved place not found' });
      return res.json({ data: fav });
    } else {
      const store = getMemoryStore();
      const fav = store.savedPlaces.find((p) => p._id.toString() === id && p.userId.toString() === userId);
      if (!fav) return res.status(404).json({ message: 'Saved place not found' });
      fav.notes = notes;
      return res.json({ data: fav });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update favourite', error: error.message });
  }
};

// @route DELETE /api/favourites/:id
const removeFavourite = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();

    if (getDBStatus()) {
      await SavedPlace.findOneAndDelete({ _id: id, userId });
      return res.json({ message: 'Removed from favourites' });
    } else {
      const store = getMemoryStore();
      store.savedPlaces = store.savedPlaces.filter(
        (p) => !(p._id.toString() === id && p.userId.toString() === userId)
      );
      return res.json({ message: 'Removed from favourites' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove favourite', error: error.message });
  }
};

// @route GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    if (getDBStatus()) {
      const list = await Notification.find({ userId }).sort({ createdAt: -1 });
      const unreadCount = list.filter((n) => !n.read).length;
      return res.json({ data: list, unreadCount });
    } else {
      const store = getMemoryStore();
      const list = store.notifications.filter((n) => n.userId.toString() === userId);
      const unreadCount = list.filter((n) => !n.read).length;
      return res.json({ data: list, unreadCount });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
};

// @route PATCH /api/notifications/:id/read
const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();
    if (getDBStatus()) {
      const notif = await Notification.findOneAndUpdate({ _id: id, userId }, { read: true }, { new: true });
      return res.json({ data: notif });
    } else {
      const store = getMemoryStore();
      const notif = store.notifications.find((n) => n._id.toString() === id && n.userId.toString() === userId);
      if (notif) notif.read = true;
      return res.json({ data: notif });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PATCH /api/notifications/read-all
const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    if (getDBStatus()) {
      await Notification.updateMany({ userId }, { read: true });
    } else {
      const store = getMemoryStore();
      store.notifications.forEach((n) => {
        if (n.userId.toString() === userId) n.read = true;
      });
    }
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route DELETE /api/notifications/:id
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id.toString();
    if (getDBStatus()) {
      await Notification.findOneAndDelete({ _id: id, userId });
    } else {
      const store = getMemoryStore();
      store.notifications = store.notifications.filter(
        (n) => !(n._id.toString() === id && n.userId.toString() === userId)
      );
    }
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFavourites,
  addFavourite,
  updateFavourite,
  removeFavourite,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
};
