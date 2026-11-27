const mongoose = require('mongoose');
const dns = require('dns');

let isConnected = false;
let memoryStore = {
  users: [],
  trips: [],
  expenses: [],
  savedPlaces: [],
  notifications: []
};

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/voyara';
  try {
    // Windows / Node.js DNS often refuses SRV lookups on local/ISP resolvers for mongodb+srv://
    if (uri.startsWith('mongodb+srv://')) {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = true;
    console.log(`[Voyara Backend] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    isConnected = false;
    console.log(`[Voyara Backend] MongoDB connection notice: ${err.message}`);
    console.log(`[Voyara Backend] Running with in-memory resilient data fallback so college demo works without local mongod!`);
  }
};

const getDBStatus = () => isConnected;
const getMemoryStore = () => memoryStore;

module.exports = { connectDB, getDBStatus, getMemoryStore };
