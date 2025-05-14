const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      originalPrice: {
        type: Number,
        required: true
      }
    }
  ],
  dealPrice: {
    type: Number,
    required: true
  },
  savings: {
    type: Number,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Deal', DealSchema); 