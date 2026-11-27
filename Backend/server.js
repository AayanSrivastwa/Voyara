const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();

const app = express();

// CORS configured with credentials: true for Frontend axios withCredentials
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

connectDB();

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/favourites', require('./routes/favouriteRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'Voyara - Smart Travel Planning & Weather Intelligence',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error('[Voyara Server Error]:', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`  Voyara Backend Running on http://localhost:${PORT}`);
  console.log(`  MERN Stack Academic Project - Ready for Demo / Viva`);
  console.log(`=======================================================`);
});
