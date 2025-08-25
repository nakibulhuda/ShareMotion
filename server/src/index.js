// server/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

// Register models so Mongoose knows them
require('./models/user.model');
require('./models/ride.model');
require('./models/rideRequest.model');

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

// Basic health check (handy in dev)
app.get('/health', (_req, res) => res.json({ ok: true }));

// ---- Start ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
