require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initFirebase } = require('./config/firebase');
const connectDB = require('./config/db');

// Initialize Firebase
initFirebase();

// Import routes
const checkDisplayNameRoute = require('./routes/checkDisplayNameRoute');
const gameRoutes = require('./routes/gameRoutes');

// Initialize app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Info route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Secret Santa API Server', 
    version: '1.0.0',
    status: 'In development',
    info: 'Firebase Authentication is integrated'
  });
});

// Routes
app.use('/api/users', checkDisplayNameRoute);
app.use('/api/games', gameRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Something went wrong on the server'
  });
});

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch(err => console.log(err));

module.exports = app; // Export for testing