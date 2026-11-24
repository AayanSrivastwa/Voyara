import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token = null;

  // 1. Check Bearer token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Check HTTP-only cookie
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in to continue.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'voyara_default_secret_fallback';
    const decoded = jwt.verify(token, secret);

    // Try finding user in database
    let user = null;
    try {
      user = await User.findById(decoded.id).select('-passwordHash');
    } catch {
      // DB might be offline or using demo user
    }

    if (!user) {
      // If DB is offline but valid token was issued
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name || 'Voyara Traveler',
        email: decoded.email || 'traveler@voyara.com',
        preferences: decoded.preferences || { defaultCurrency: 'INR', temperatureUnit: 'C' },
      };
    } else {
      req.user = user;
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please sign in again.',
    });
  }
};
