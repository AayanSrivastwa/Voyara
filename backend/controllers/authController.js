import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Trip from '../models/Trip.js';
import Itinerary from '../models/Itinerary.js';
import Expense from '../models/Expense.js';
import Favourite from '../models/Favourite.js';
import Notification from '../models/Notification.js';

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'voyara_default_secret_fallback';
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      preferences: user.preferences,
    },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('token', token, cookieOptions);

  return res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      preferences: user.preferences,
      createdAt: user.createdAt,
    },
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    // Create a welcome notification
    try {
      await Notification.create({
        userId: user._id,
        title: 'Welcome to Voyara',
        message: 'Your journey, beautifully planned. Start by exploring destinations or creating your first trip!',
        type: 'account',
      });
    } catch {
      // Non-critical
    }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, preferences, avatar } = req.body;
    const updateData = {};

    if (name) updateData.name = name.trim();
    if (avatar !== undefined) updateData.avatar = avatar;
    if (preferences) {
      updateData.preferences = {
        ...(req.user.preferences ? (req.user.preferences.toObject ? req.user.preferences.toObject() : req.user.preferences) : {}),
        ...preferences,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select('-passwordHash');

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully.',
    });
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long.',
      });
    }

    const user = await User.findById(req.user._id).select('+passwordHash');
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password does not match.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (err) {
    next(err);
  }
};

export const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id).select('+passwordHash');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (password) {
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Password confirmation failed.' });
      }
    }

    // Cascade deletion of all personal resources
    await Promise.all([
      Trip.deleteMany({ userId: user._id }),
      Itinerary.deleteMany({ userId: user._id }),
      Expense.deleteMany({ userId: user._id }),
      Favourite.deleteMany({ userId: user._id }),
      Notification.deleteMany({ userId: user._id }),
      User.findByIdAndDelete(user._id),
    ]);

    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: 'Account and associated data deleted permanently.',
    });
  } catch (err) {
    next(err);
  }
};
