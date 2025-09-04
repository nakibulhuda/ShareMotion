// server/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Register models so Mongoose knows them
require('./models/user.model');
require('./models/ride.model');
require('./models/rideRequest.model');
require('./models/message.model');
require('./models/contract.model');

const app = express();

// ---- Middleware ----
app.use(express.json()); // replaces body-parser for JSON

// ✅ CORS for React dev server
app.use(cors({
  origin: 'http://localhost:3000',      // your React app
  credentials: true,                    // allow cookies/Authorization header
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// (optional, helps some proxies/tools) reply to all preflights
app.options('*', cors());

// ---- DB ----
connectDB();

// ---- Routes ----
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/rides', require('./routes/ride.routes'));
app.use('/api/requests', require('./routes/request.routes'));
app.use('/api/messages', require('./routes/message.routes'));
app.use('/api/contracts', require('./routes/contract.routes'));
app.use('/api/polling', require('./routes/polling.routes'));

// Basic health check (handy in dev)
app.get('/health', (_req, res) => res.json({ ok: true }));

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid data format',
      error: 'The provided data format is not valid'
    });
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      message: 'Duplicate data',
      error: `${field} already exists`
    });
  }
  
  res.status(500).json({
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later'
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Route not found',
    error: `The requested route ${req.originalUrl} does not exist`
  });
});

// ---- Start ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
