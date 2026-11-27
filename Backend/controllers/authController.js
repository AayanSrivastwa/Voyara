const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Trip = require('../models/Trip');
const Expense = require('../models/Expense');
const SavedPlace = require('../models/SavedPlace');
const Notification = require('../models/Notification');
const { getDBStatus, getMemoryStore } = require('../config/db');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'voyara_super_secret_college_project_key_2026',
    { expiresIn: '30d' }
  );
};

const formatUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  preferredUnit: u.preferredUnit || 'C',
  createdAt: u.createdAt || new Date().toISOString()
});

const seedDemoDataIfEmpty = async (userId) => {
  const today = new Date();
  const t1Start = new Date(today);
  t1Start.setDate(today.getDate() + 10);
  const t1End = new Date(t1Start);
  t1End.setDate(t1Start.getDate() + 4);

  const t2Start = new Date(today);
  t2Start.setDate(today.getDate() + 26);
  const t2End = new Date(t2Start);
  t2End.setDate(t2Start.getDate() + 5);

  const t3Start = new Date(today);
  t3Start.setDate(today.getDate() + 48);
  const t3End = new Date(t3Start);
  t3End.setDate(t3Start.getDate() + 5);

  if (getDBStatus()) {
    const existingTrips = await Trip.find({ userId });
    if (existingTrips.length > 0) return;

    const manaliTrip = await Trip.create({
      userId,
      title: 'Himalayan Escape to Manali',
      destination: 'Manali',
      country: 'India',
      latitude: 32.2432,
      longitude: 77.1892,
      startDate: t1Start,
      endDate: t1End,
      travellers: 2,
      budget: 25000,
      currency: 'INR',
      notes: 'Solang Valley snow activities, Hadimba Temple & Old Manali cafes.',
      itinerary: [
        { title: 'Check-in & Mall Road Walk', date: t1Start, time: '10:00', category: 'Transportation', location: 'Old Manali', estimatedCost: 800, description: 'Settle in and explore local markets' },
        { title: 'Hadimba Devi Temple & Cedar Forest', date: t1Start, time: '15:00', category: 'Sightseeing', location: 'Dhungri Van Vihar', estimatedCost: 300, description: 'Peaceful afternoon walk' },
        { title: 'Solang Valley Ropeway & Paragliding', date: new Date(t1Start.getTime() + 86400000), time: '09:00', category: 'Adventure', location: 'Solang Valley', estimatedCost: 3500, description: 'Weather-dependent outdoor adventure' },
        { title: 'Dinner at Cafe 1947', date: new Date(t1Start.getTime() + 86400000), time: '19:30', category: 'Food', location: 'Old Manali', estimatedCost: 1400, description: 'Riverside dining' }
      ]
    });

    await Trip.create({
      userId,
      title: 'Kyoto Heritage & Shrines',
      destination: 'Kyoto',
      country: 'Japan',
      latitude: 35.0116,
      longitude: 135.7681,
      startDate: t2Start,
      endDate: t2End,
      travellers: 2,
      budget: 140000,
      currency: 'INR',
      notes: 'International getaway · Fushimi Inari, Arashiyama & matcha ceremonies.',
      itinerary: [
        { title: 'Fushimi Inari Shrine Morning Walk', date: t2Start, time: '08:00', category: 'Sightseeing', location: 'Fushimi Ward', estimatedCost: 0, description: 'Early morning torii gates' }
      ]
    });

    await Trip.create({
      userId,
      title: 'Goa Coastal Retreat',
      destination: 'Goa',
      country: 'India',
      latitude: 15.4909,
      longitude: 73.8278,
      startDate: t3Start,
      endDate: t3End,
      travellers: 3,
      budget: 32000,
      currency: 'INR',
      notes: 'Fort Aguada sunset, Fontainhas heritage walk & Konkan seafood.',
      itinerary: []
    });

    await Expense.insertMany([
      { tripId: manaliTrip._id, userId, title: 'Volvo Sleeper Bus (Delhi–Manali)', amount: 3800, currency: 'INR', category: 'Transportation' },
      { tripId: manaliTrip._id, userId, title: 'Riverside Boutique Stay (3 Nights)', amount: 9500, currency: 'INR', category: 'Accommodation' },
      { tripId: manaliTrip._id, userId, title: 'Solang Ropeway & Snow Gear', amount: 3200, currency: 'INR', category: 'Activities' },
      { tripId: manaliTrip._id, userId, title: 'Cafe 1947 & Himachali Dham', amount: 2400, currency: 'INR', category: 'Food' },
      { tripId: manaliTrip._id, userId, title: 'Mall Road Woollens & Souvenirs', amount: 1800, currency: 'INR', category: 'Shopping' }
    ]);

    await SavedPlace.insertMany([
      { userId, destinationId: 'dest_1', destination: 'Manali', country: 'India', latitude: 32.2432, longitude: 77.1892, notes: 'Must-visit Himalayan valley' },
      { userId, destinationId: 'dest_3', destination: 'Jaipur', country: 'India', latitude: 26.9124, longitude: 75.7873, notes: 'Pink City palaces' },
      { userId, destinationId: 'dest_7', destination: 'Kyoto', country: 'Japan', latitude: 35.0116, longitude: 135.7681, notes: 'International cultural dream' }
    ]);

    await Notification.insertMany([
      { userId, title: 'Welcome to Voyara', message: 'Your Manali trip starts in 10 days. Weather suitability is currently Ideal!', type: 'trip', read: false },
      { userId, title: 'Budget Notice: Manali', message: 'You have utilized 83% of your ₹25,000 Manali budget.', type: 'budget', read: false },
      { userId, title: 'Clear Mountain Skies', message: 'Manali forecast shows crisp sunny mornings for Solang Valley.', type: 'weather', read: true }
    ]);
    return;
  }

  // Memory Store Fallback
  const store = getMemoryStore();
  const userTrips = store.trips.filter((t) => t.userId.toString() === userId.toString());
  if (userTrips.length === 0) {
    const trip1 = {
      _id: 'trip_demo_manali',
      userId: userId.toString(),
      title: 'Himalayan Escape to Manali',
      destination: 'Manali',
      country: 'India',
      latitude: 32.2432,
      longitude: 77.1892,
      startDate: t1Start.toISOString(),
      endDate: t1End.toISOString(),
      travellers: 2,
      budget: 25000,
      currency: 'INR',
      notes: 'Solang Valley snow activities, Hadimba Temple & Old Manali cafes.',
      itinerary: [
        { _id: 'itin_1', title: 'Check-in & Mall Road Walk', date: t1Start.toISOString(), time: '10:00', category: 'Transportation', location: 'Old Manali', estimatedCost: 800, description: 'Settle in and explore local markets', completed: true },
        { _id: 'itin_2', title: 'Hadimba Devi Temple & Cedar Forest', date: t1Start.toISOString(), time: '15:00', category: 'Sightseeing', location: 'Dhungri Van Vihar', estimatedCost: 300, description: 'Peaceful afternoon walk', completed: false },
        { _id: 'itin_3', title: 'Solang Valley Ropeway & Paragliding', date: new Date(t1Start.getTime() + 86400000).toISOString(), time: '09:00', category: 'Adventure', location: 'Solang Valley', estimatedCost: 3500, description: 'Weather-dependent outdoor adventure', completed: false },
        { _id: 'itin_4', title: 'Dinner at Cafe 1947', date: new Date(t1Start.getTime() + 86400000).toISOString(), time: '19:30', category: 'Food', location: 'Old Manali', estimatedCost: 1400, description: 'Riverside dining', completed: false }
      ],
      createdAt: new Date().toISOString()
    };

    const trip2 = {
      _id: 'trip_demo_kyoto',
      userId: userId.toString(),
      title: 'Kyoto Heritage & Shrines',
      destination: 'Kyoto',
      country: 'Japan',
      latitude: 35.0116,
      longitude: 135.7681,
      startDate: t2Start.toISOString(),
      endDate: t2End.toISOString(),
      travellers: 2,
      budget: 140000,
      currency: 'INR',
      notes: 'International getaway · Fushimi Inari, Arashiyama & matcha ceremonies.',
      itinerary: [
        { _id: 'itin_5', title: 'Fushimi Inari Shrine Morning Walk', date: t2Start.toISOString(), time: '08:00', category: 'Sightseeing', location: 'Fushimi Ward', estimatedCost: 0, description: 'Early morning torii gates', completed: false }
      ],
      createdAt: new Date().toISOString()
    };

    const trip3 = {
      _id: 'trip_demo_goa',
      userId: userId.toString(),
      title: 'Goa Coastal Retreat',
      destination: 'Goa',
      country: 'India',
      latitude: 15.4909,
      longitude: 73.8278,
      startDate: t3Start.toISOString(),
      endDate: t3End.toISOString(),
      travellers: 3,
      budget: 32000,
      currency: 'INR',
      notes: 'Fort Aguada sunset, Fontainhas heritage walk & Konkan seafood.',
      itinerary: [],
      createdAt: new Date().toISOString()
    };

    store.trips.push(trip1, trip2, trip3);

    store.expenses.push(
      { _id: 'exp_1', tripId: 'trip_demo_manali', userId: userId.toString(), title: 'Volvo Sleeper Bus (Delhi–Manali)', amount: 3800, currency: 'INR', category: 'Transportation', date: new Date().toISOString() },
      { _id: 'exp_2', tripId: 'trip_demo_manali', userId: userId.toString(), title: 'Riverside Boutique Stay (3 Nights)', amount: 9500, currency: 'INR', category: 'Accommodation', date: new Date().toISOString() },
      { _id: 'exp_3', tripId: 'trip_demo_manali', userId: userId.toString(), title: 'Solang Ropeway & Snow Gear', amount: 3200, currency: 'INR', category: 'Activities', date: new Date().toISOString() },
      { _id: 'exp_4', tripId: 'trip_demo_manali', userId: userId.toString(), title: 'Cafe 1947 & Himachali Dham', amount: 2400, currency: 'INR', category: 'Food', date: new Date().toISOString() },
      { _id: 'exp_5', tripId: 'trip_demo_manali', userId: userId.toString(), title: 'Mall Road Woollens & Souvenirs', amount: 1800, currency: 'INR', category: 'Shopping', date: new Date().toISOString() }
    );

    store.savedPlaces.push(
      { _id: 'place_1', userId: userId.toString(), destinationId: 'dest_1', destination: 'Manali', country: 'India', latitude: 32.2432, longitude: 77.1892, notes: 'Must-visit Himalayan valley' },
      { _id: 'place_2', userId: userId.toString(), destinationId: 'dest_3', destination: 'Jaipur', country: 'India', latitude: 26.9124, longitude: 75.7873, notes: 'Pink City palaces' },
      { _id: 'place_3', userId: userId.toString(), destinationId: 'dest_7', destination: 'Kyoto', country: 'Japan', latitude: 35.0116, longitude: 135.7681, notes: 'International cultural dream' }
    );

    store.notifications.push(
      { _id: 'notif_1', userId: userId.toString(), title: 'Welcome to Voyara', message: 'Your Manali trip starts in 10 days. Weather suitability is Ideal!', type: 'trip', read: false, createdAt: new Date().toISOString() },
      { _id: 'notif_2', userId: userId.toString(), title: 'Budget Notice: Manali', message: 'You have utilized 83% of your ₹25,000 Manali budget.', type: 'budget', read: false, createdAt: new Date().toISOString() },
      { _id: 'notif_3', userId: userId.toString(), title: 'Clear Mountain Skies', message: 'Manali forecast shows crisp sunny mornings for Solang Valley.', type: 'weather', read: true, createdAt: new Date().toISOString() }
    );
  }
};

// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, preferredUnit } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    if (getDBStatus()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        preferredUnit: preferredUnit || 'C'
      });
      await seedDemoDataIfEmpty(user._id);
      return res.status(201).json({
        token: generateToken(user._id),
        user: formatUser(user)
      });
    } else {
      const store = getMemoryStore();
      const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = {
        _id: 'user_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        preferredUnit: preferredUnit || 'C',
        createdAt: new Date().toISOString()
      };
      store.users.push(newUser);
      await seedDemoDataIfEmpty(newUser._id);
      return res.status(201).json({
        token: generateToken(newUser._id),
        user: formatUser(newUser)
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    if (getDBStatus()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          token: generateToken(user._id),
          user: formatUser(user)
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    } else {
      const store = getMemoryStore();
      const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (user && (await bcrypt.compare(password, user.password))) {
        return res.json({
          token: generateToken(user._id),
          user: formatUser(user)
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @route POST /api/auth/demo-login
const demoLogin = async (req, res) => {
  try {
    const demoEmail = 'student.demo@voyara.edu';
    if (getDBStatus()) {
      let demoUser = await User.findOne({ email: demoEmail });
      if (!demoUser) {
        demoUser = await User.create({
          name: 'Aarav Sharma',
          email: demoEmail,
          password: 'DemoVoyara2026!',
          preferredUnit: 'C'
        });
      }
      await seedDemoDataIfEmpty(demoUser._id);
      return res.json({
        token: generateToken(demoUser._id),
        user: formatUser(demoUser),
        isDemo: true
      });
    } else {
      const store = getMemoryStore();
      let demoUser = store.users.find((u) => u.email === demoEmail);
      if (!demoUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('DemoVoyara2026!', salt);
        demoUser = {
          _id: 'user_demo_voyara_id',
          name: 'Aarav Sharma',
          email: demoEmail,
          password: hashedPassword,
          preferredUnit: 'C',
          createdAt: new Date().toISOString()
        };
        store.users.push(demoUser);
      }
      await seedDemoDataIfEmpty(demoUser._id);
      return res.json({
        token: generateToken(demoUser._id),
        user: formatUser(demoUser),
        isDemo: true
      });
    }
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ message: 'Failed to initialize demo login', error: error.message });
  }
};

// @route POST /api/auth/logout
const logoutUser = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// @route PATCH /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { name, email, preferredUnit } = req.body;

    if (getDBStatus()) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (name) user.name = name;
      if (email) user.email = email.toLowerCase();
      if (preferredUnit) user.preferredUnit = preferredUnit;
      await user.save();
      return res.json({ user: formatUser(user) });
    } else {
      const store = getMemoryStore();
      const user = store.users.find((u) => u._id.toString() === userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      if (name) user.name = name;
      if (email) user.email = email.toLowerCase();
      if (preferredUnit) user.preferredUnit = preferredUnit;
      return res.json({ user: formatUser(user) });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// @route PATCH /api/auth/password
const updatePassword = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    if (getDBStatus()) {
      const user = await User.findById(userId);
      if (!user || !(await user.matchPassword(currentPassword))) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = newPassword;
      await user.save();
      return res.json({ message: 'Password updated successfully' });
    } else {
      const store = getMemoryStore();
      const user = store.users.find((u) => u._id.toString() === userId);
      if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      return res.json({ message: 'Password updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update password', error: error.message });
  }
};

// @route DELETE /api/auth/account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    if (getDBStatus()) {
      await Trip.deleteMany({ userId });
      await Expense.deleteMany({ userId });
      await SavedPlace.deleteMany({ userId });
      await Notification.deleteMany({ userId });
      await User.findByIdAndDelete(userId);
    } else {
      const store = getMemoryStore();
      store.trips = store.trips.filter((t) => t.userId.toString() !== userId);
      store.expenses = store.expenses.filter((e) => e.userId.toString() !== userId);
      store.savedPlaces = store.savedPlaces.filter((p) => p.userId.toString() !== userId);
      store.notifications = store.notifications.filter((n) => n.userId.toString() !== userId);
      store.users = store.users.filter((u) => u._id.toString() !== userId);
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete account', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  demoLogin,
  logoutUser,
  getMe,
  updateProfile,
  updatePassword,
  deleteAccount
};
