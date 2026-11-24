import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('⚠️  MONGODB_URI not configured in .env. Running in offline/demo fallback mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Proceeding with development fallback. Connect MongoDB Atlas to persist all data.');
    isConnected = false;
    return false;
  }
};

export const getDbStatus = () => {
  return {
    connected: isConnected || mongoose.connection.readyState === 1,
    state: mongoose.STATES[mongoose.connection.readyState] || 'disconnected',
  };
};
