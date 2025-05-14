const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: String,
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: Date, // Optional for ongoing offers
  eligibleLevels: [{
    type: String,
    enum: ['Green', 'Gold', 'Platinum']
  }],
  offerType: {
    type: String,
    enum: ['discount', 'bonus_stars', 'free_item', 'special_pricing'],
    required: true
  },
  offerValue: {
    type: mongoose.Schema.Types.Mixed, // Could be percentage, number of stars, etc.
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Offer', OfferSchema);