import Favourite from '../models/Favourite.js';

export const getFavourites = async (req, res, next) => {
  try {
    const favourites = await Favourite.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: favourites.length,
      data: favourites,
    });
  } catch (err) {
    next(err);
  }
};

export const createFavourite = async (req, res, next) => {
  try {
    const { destinationId, destination, country, latitude, longitude, notes } = req.body;

    if (!destination) {
      return res.status(400).json({ success: false, message: 'Destination name is required.' });
    }

    const existing = await Favourite.findOne({
      userId: req.user._id,
      destination: destination.trim(),
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This destination is already saved in your favourites.',
      });
    }

    const favourite = await Favourite.create({
      userId: req.user._id,
      destinationId,
      destination: destination.trim(),
      country,
      latitude,
      longitude,
      notes,
    });

    res.status(201).json({
      success: true,
      data: favourite,
      message: 'Destination saved to favourites.',
    });
  } catch (err) {
    next(err);
  }
};

export const updateFavourite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const favourite = await Favourite.findOne({ _id: id, userId: req.user._id });
    if (!favourite) {
      return res.status(404).json({ success: false, message: 'Saved destination not found.' });
    }

    if (notes !== undefined) favourite.notes = notes;
    await favourite.save();

    res.status(200).json({
      success: true,
      data: favourite,
      message: 'Notes updated.',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteFavourite = async (req, res, next) => {
  try {
    const { id } = req.params;
    const favourite = await Favourite.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!favourite) {
      return res.status(404).json({ success: false, message: 'Saved destination not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Destination removed from saved list.',
    });
  } catch (err) {
    next(err);
  }
};
