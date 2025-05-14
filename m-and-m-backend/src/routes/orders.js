const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const order = new Order({
    customerName: req.body.customerName,
    customerPhone: req.body.customerPhone,
    address: req.body.address,
    items: req.body.items,
    subtotal: req.body.subtotal,
    tax: req.body.tax,
    deliveryFee: req.body.deliveryFee,
    total: req.body.total,
    status: req.body.status || 'Processing',
    paymentMethod: req.body.paymentMethod
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an order status
router.patch('/:id/status', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an order
router.patch('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update only allowed fields
    if (req.body.customerName) order.customerName = req.body.customerName;
    if (req.body.customerPhone) order.customerPhone = req.body.customerPhone;
    if (req.body.address) order.address = req.body.address;
    if (req.body.items) order.items = req.body.items;
    if (req.body.status) order.status = req.body.status;
    if (req.body.paymentMethod) order.paymentMethod = req.body.paymentMethod;
    
    // Recalculate totals if items changed
    if (req.body.subtotal) order.subtotal = req.body.subtotal;
    if (req.body.tax) order.tax = req.body.tax;
    if (req.body.deliveryFee) order.deliveryFee = req.body.deliveryFee;
    if (req.body.total) order.total = req.body.total;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.remove();
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 