const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDBStatus, getMemoryStore } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'voyara_super_secret_college_project_key_2026'
      );

      if (getDBStatus()) {
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
          return res.status(401).json({ message: 'User not found' });
        }
      } else {
        // Fallback memory store lookup
        const store = getMemoryStore();
        const found = store.users.find(u => u._id.toString() === decoded.id.toString());
        if (!found) {
          return res.status(401).json({ message: 'User not found in demo session' });
        }
        req.user = {
          _id: found._id,
          name: found.name,
          email: found.email,
          preferredUnit: found.preferredUnit || 'C'
        };
      }

      return next();
    } catch (error) {
      console.error('[Auth Middleware] Token error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
