const express = require('express');
const router = express.Router();
const Deal = require('../models/Deal');

// Get all deals
router.get('/', async (req, res) => {
  try {
    const deals = await Deal.find();
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get featured deals
router.get('/featured', async (req, res) => {
  try {
    const featuredDeals = await Deal.find({ featured: true });
    res.json(featuredDeals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific deal
router.get('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id).populate('items.productId');
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }
    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new deal
router.post('/', async (req, res) => {
  const deal = new Deal({
    title: req.body.title,
    description: req.body.description,
    items: req.body.items,
    dealPrice: req.body.dealPrice,
    savings: req.body.savings,
    featured: req.body.featured,
    image: req.body.image
  });

  try {
    const newDeal = await deal.save();
    res.status(201).json(newDeal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a deal
router.patch('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    if (req.body.title) deal.title = req.body.title;
    if (req.body.description) deal.description = req.body.description;
    if (req.body.items) deal.items = req.body.items;
    if (req.body.dealPrice) deal.dealPrice = req.body.dealPrice;
    if (req.body.savings) deal.savings = req.body.savings;
    if (req.body.featured !== undefined) deal.featured = req.body.featured;
    if (req.body.image) deal.image = req.body.image;

    const updatedDeal = await deal.save();
    res.json(updatedDeal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a deal
router.delete('/:id', async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    await Deal.deleteOne({ _id: req.params.id });
    res.json({ message: 'Deal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 