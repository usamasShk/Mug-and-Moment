const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Hot Beverages', 'Cold Beverages', 'Snacks & Pastries', 'Breakfast Items']
  },
  ingredients: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false
  },
  backupImage: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema); 