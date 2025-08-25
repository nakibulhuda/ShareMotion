// File: server/src/models/ride.model.js

const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startLocation: {
    address: { type: String, required: true },
    coordinates: { 
      type: [Number],   // [longitude, latitude]
      index: '2dsphere'
    }
  },
  endLocation: {
    address: { type: String, required: true },
    coordinates: { 
      type: [Number],
      index: '2dsphere'
    }
  },
  dateTime: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['Open', 'Closed'],
    default: 'Open',
    index: true
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ride', RideSchema);
