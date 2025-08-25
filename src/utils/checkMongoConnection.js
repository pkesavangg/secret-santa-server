require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

async function checkConnection() {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    await connectDB();
    console.log('MongoDB connection is working properly!');
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

checkConnection();
