const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Process credit card payment
router.post('/process/card', async (req, res) => {
  try {
    const { 
      cardDetails, 
      contactInfo, 
      orderItems, 
      subtotal, 
      tax, 
      deliveryFee, 
      total 
    } = req.body;
    
    // Validate card information
    if (!cardDetails.name || !cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
      return res.status(400).json({ success: false, message: 'All card details are required' });
    }
    
    // Simple card validation (this would be replaced with a real payment processor)
    if (cardDetails.number.replace(/\s/g, '').length !== 16) {
      return res.status(400).json({ success: false, message: 'Invalid card number' });
    }
    
    // Create order record
    const orderNumber = generateOrderNumber();
    
    const newOrder = new Order({
      orderNumber,
      paymentMethod: 'card',
      contactInfo,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      status: 'processing'
    });
    
    await newOrder.save();
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      orderNumber
    });
    
  } catch (error) {
    console.error('Card payment error:', error);
    return res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
});

// Process JazzCash payment
router.post('/process/jazzcash', async (req, res) => {
  try {
    const { 
      jazzCashNumber, 
      contactInfo, 
      orderItems, 
      subtotal, 
      tax, 
      deliveryFee, 
      total 
    } = req.body;
    
    // Validate JazzCash information
    if (!jazzCashNumber) {
      return res.status(400).json({ success: false, message: 'JazzCash number is required' });
    }
    
    // Simple validation (this would be replaced with a real JazzCash integration)
    if (jazzCashNumber.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ success: false, message: 'Invalid JazzCash number' });
    }
    
    // Create order record
    const orderNumber = generateOrderNumber();
    
    const newOrder = new Order({
      orderNumber,
      paymentMethod: 'jazzcash',
      contactInfo,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      status: 'processing'
    });
    
    await newOrder.save();
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'JazzCash payment initiated successfully',
      orderNumber
    });
    
  } catch (error) {
    console.error('JazzCash payment error:', error);
    return res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
});

// Process EasyPaisa payment
router.post('/process/easypaisa', async (req, res) => {
  try {
    const { 
      easyPaisaNumber, 
      contactInfo, 
      orderItems, 
      subtotal, 
      tax, 
      deliveryFee, 
      total 
    } = req.body;
    
    // Validate EasyPaisa information
    if (!easyPaisaNumber) {
      return res.status(400).json({ success: false, message: 'EasyPaisa number is required' });
    }
    
    // Simple validation (this would be replaced with a real EasyPaisa integration)
    if (easyPaisaNumber.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ success: false, message: 'Invalid EasyPaisa number' });
    }
    
    // Create order record
    const orderNumber = generateOrderNumber();
    
    const newOrder = new Order({
      orderNumber,
      paymentMethod: 'easypaisa',
      contactInfo,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      status: 'processing'
    });
    
    await newOrder.save();
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'EasyPaisa payment initiated successfully',
      orderNumber
    });
    
  } catch (error) {
    console.error('EasyPaisa payment error:', error);
    return res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
});

// Process cash on delivery payment
router.post('/process/cash', async (req, res) => {
  try {
    const { 
      contactInfo, 
      orderItems, 
      subtotal, 
      tax, 
      deliveryFee, 
      total 
    } = req.body;
    
    // Create order record
    const orderNumber = generateOrderNumber();
    
    const newOrder = new Order({
      orderNumber,
      paymentMethod: 'cash',
      contactInfo,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      total,
      status: 'processing'
    });
    
    await newOrder.save();
    
    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Cash on delivery order placed successfully',
      orderNumber
    });
    
  } catch (error) {
    console.error('Cash payment error:', error);
    return res.status(500).json({ success: false, message: 'Order processing failed' });
  }
});

// Helper function to generate order number
function generateOrderNumber() {
  const prefix = 'MM';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}${timestamp}${random}`;
}

module.exports = router; 