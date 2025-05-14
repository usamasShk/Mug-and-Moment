const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  starsRequired: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['drink', 'food', 'merchandise', 'discount'],
    required: true
  },
  image: String,
  isActive: {
    type: Boolean,
    default: true
  },
  expirationDays: {
    type: Number,
    default: 30 // Days from redemption until expiration
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reward', RewardSchema);