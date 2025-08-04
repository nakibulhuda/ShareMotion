// RideRequest Model (incorporates bidding)
const RideRequestSchema = new mongoose.Schema({
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true,
    index: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  bidPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
    index: true
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

// optional: update `updatedAt` on each status change
RideRequestSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.updatedAt = new Date();
  }
  next();
});
