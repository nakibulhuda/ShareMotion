// server/src/index.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');

// Import your models so Mongoose registers them
require('./models/user.model');
require('./models/ride.model');
require('./models/rideRequest.model');

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to Mongo
connectDB();

// Routes (you’ll build these next)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/rides', require('./routes/ride.routes'));
app.use('/api/requests', require('./routes/request.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
