const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const rewardService = require('../services/rewardService');

// Helper function to check MongoDB connection status
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1; // 1 = connected
};

// Helper function to validate email format
const isValidEmail = (email) => {
  // Basic email validation regex
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!basicEmailRegex.test(email)) {
    return false;
  }
  
  // Check for common valid domains
  const validDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
    'icloud.com', 'aol.com', 'protonmail.com', 'mail.com',
    'zoho.com', 'yandex.com', 'gmx.com', 'live.com',
    'example.com' // Keeping this for testing purposes
  ];
  
  // Extract domain from email
  const domain = email.split('@')[1].toLowerCase();
  
  // Check domain TLD for educational, government or company emails
  const validTLDs = ['.edu', '.gov', '.org', '.net', '.co', '.io', '.com'];
  const hasTLD = validTLDs.some(tld => domain.endsWith(tld));
  
  // Email is valid if it has a common domain or valid TLD
  return validDomains.includes(domain) || hasTLD;
};

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER || 'mugnmoment@gmail.com',
    pass: (process.env.EMAIL_PASSWORD || 'ttcxbwxljqalymmr').replace(/\s+/g, '') // Remove spaces from the password
  },
  debug: true // Show debug output
});

// Sign up route
router.post('/signup', async (req, res) => {
  try {
    // Check MongoDB connection first
    if (!isMongoConnected()) {
      return res.status(503).json({ 
        message: 'Database not available. Please try again later.',
        connectionState: mongoose.connection.readyState
      });
    }

    // Validate email format
    if (!req.body.email || !isValidEmail(req.body.email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Validate required fields
    if (!req.body.firstName || !req.body.lastName || !req.body.password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate password strength (at least 8 characters)
    if (req.body.password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password, // In a real app, you would hash this password
      rewards: {
        stars: 0,
        level: 'Green'
      }
    });

    const savedUser = await user.save();
    
    // Remove password from the response
    const userResponse = {
      _id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      phone: savedUser.phone,
      rewards: savedUser.rewards
    };

    res.status(201).json({ 
      message: 'User created successfully',
      user: userResponse
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  console.log('Login attempt:', req.body.email);
  console.log('MongoDB connection state:', mongoose.connection.readyState);
  
  // Check MongoDB connection first
  if (!isMongoConnected()) {
    console.log('MongoDB is not connected. Connection state:', mongoose.connection.readyState);
    return res.status(503).json({ 
      message: 'Database not available. Please try again later.',
      connectionState: mongoose.connection.readyState
    });
  }
  
  try {
    // Set a timeout for the database operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timed out')), 5000);
    });
    
    // The actual database query
    const dbQueryPromise = User.findOne({ email: req.body.email }).exec();
    
    // Race between the timeout and the actual query
    const user = await Promise.race([dbQueryPromise, timeoutPromise]);
    
    if (!user) {
      console.log('User not found:', req.body.email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    console.log('User found:', user.email);
    
    // Check password (in a real app, you would compare hashed passwords)
    if (user.password !== req.body.password) {
      console.log('Password mismatch for user:', user.email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    console.log('Login successful:', user.email);

    // Award 1 star for login
    try {
      await rewardService.awardLoginStar(user._id);
      console.log('Login star awarded to:', user.email);
    } catch (rewardError) {
      console.error('Error awarding login star:', rewardError);
      // Continue login process even if star award fails
    }

    // Create user response without password
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      rewards: user.rewards
    };

    res.status(200).json({
      message: 'Login successful',
      user: userResponse
    });
  } catch (err) {
    console.error('Login error:', err);
    
    // Provide a more helpful error message based on the error type
    if (err.message === 'Database operation timed out') {
      return res.status(504).json({ message: 'Database operation timed out. Please try again later.' });
    } else if (err.name === 'MongooseServerSelectionError') {
      return res.status(503).json({ message: 'Cannot connect to database server. Please try again later.' });
    }
    
    res.status(500).json({ message: err.message });
  }
});

// Forgot password route - sends an email with reset link
router.post('/forgot-password', async (req, res) => {
  console.log('Forgot password request for:', req.body.email);
  
  // Check MongoDB connection first
  if (!isMongoConnected()) {
    console.log('MongoDB is not connected. Connection state:', mongoose.connection.readyState);
    return res.status(503).json({ 
      message: 'Database not available. Please try again later.',
      connectionState: mongoose.connection.readyState
    });
  }
  
  try {
    // Validate email format
    if (!req.body.email || !isValidEmail(req.body.email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    
    // Find the user with the provided email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // For security reasons, don't reveal if the email exists or not
      return res.status(200).json({ 
        message: 'If your email is registered, you will receive a password reset link shortly.' 
      });
    }
    
    // Generate random token
    const token = crypto.randomBytes(20).toString('hex');
    
    // Set token and expiry on user's record
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
    
    await user.save();
    
    // Determine frontend URL from request origin or use localhost as fallback
    const frontendBaseUrl = req.headers.origin || 'http://localhost:3000';
    
    // Create reset URL (frontend should handle this route)
    const resetUrl = `${frontendBaseUrl}/reset-password/${token}`;
    
    // Create email
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Mug & Moment Password Reset',
      text: `You are receiving this because you (or someone else) requested a password reset for your account.\n\n
      Please click on the following link, or paste it into your browser to complete the process:\n\n
      ${resetUrl}\n\n
      If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #6F4E37; text-align: center;">Mug & Moment Password Reset</h2>
          <p>You are receiving this because you (or someone else) requested a password reset for your account.</p>
          <p>Please click on the following link, or paste it into your browser to complete the process:</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #6F4E37; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #777;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <div style="text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p style="color: #6F4E37; font-weight: bold;">Mug & Moment Coffee Shop</p>
          </div>
        </div>
      `
    };
    
    // Send email
    try {
      console.log('Sending password reset email to:', user.email);
      await transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully to:', user.email);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue even if email fails, so we don't reveal if the email exists
    }
    
    res.status(200).json({ 
      message: 'If your email is registered, you will receive a password reset link shortly.' 
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Password reset request failed. Please try again later.' });
  }
});

// Reset password route - verify token and update password
router.post('/reset-password/:token', async (req, res) => {
  console.log('Reset password attempt with token:', req.params.token);
  
  // Check MongoDB connection first
  if (!isMongoConnected()) {
    console.log('MongoDB is not connected. Connection state:', mongoose.connection.readyState);
    return res.status(503).json({ 
      message: 'Database not available. Please try again later.',
      connectionState: mongoose.connection.readyState
    });
  }
  
  try {
    // Find user with the provided token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }
    
    // Validate new password
    if (!req.body.password) {
      return res.status(400).json({ message: 'Please provide a new password.' });
    }
    
    if (req.body.password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }
    
    // Update password and clear reset token fields
    user.password = req.body.password; // In a real app, you would hash this password
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    
    await user.save();
    
    // Send confirmation email
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Your password has been changed',
      text: `Hello,\n\nThis is a confirmation that the password for your account ${user.email} has just been changed.\n`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <h2 style="color: #6F4E37; text-align: center;">Password Changed</h2>
          <p>Hello ${user.firstName},</p>
          <p>This is a confirmation that the password for your account ${user.email} has just been changed.</p>
          <div style="text-align: center; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
            <p style="color: #6F4E37; font-weight: bold;">Mug & Moment Coffee Shop</p>
          </div>
        </div>
      `
    };
    
    // Send confirmation email
    try {
      console.log('Sending password change confirmation email to:', user.email);
      await transporter.sendMail(mailOptions);
      console.log('Password change confirmation email sent successfully to:', user.email);
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Continue even if email fails
    }
    
    res.status(200).json({ message: 'Password has been updated successfully.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Password reset failed. Please try again later.' });
  }
});

// Get user profile
router.get('/profile/:id', async (req, res) => {
  try {
    // Check MongoDB connection first
    if (!isMongoConnected()) {
      return res.status(503).json({ 
        message: 'Database not available. Please try again later.',
        connectionState: mongoose.connection.readyState
      });
    }
    
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Profile error:', err);
    res.status(500).json({ message: err.message });
  }
});

// Update user rewards
router.patch('/rewards/:id', async (req, res) => {
  try {
    // Check MongoDB connection first
    if (!isMongoConnected()) {
      return res.status(503).json({ 
        message: 'Database not available. Please try again later.',
        connectionState: mongoose.connection.readyState
      });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update rewards if provided
    if (req.body.stars !== undefined) {
      user.rewards.stars = req.body.stars;
      
      // Update level based on stars
      if (user.rewards.stars >= 301) {
        user.rewards.level = 'Platinum';
      } else if (user.rewards.stars >= 101) {
        user.rewards.level = 'Gold';
      } else {
        user.rewards.level = 'Green';
      }
    }

    const updatedUser = await user.save();
    
    // Remove password from response
    const userResponse = {
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      phone: updatedUser.phone,
      rewards: updatedUser.rewards
    };

    res.json({
      message: 'Rewards updated successfully',
      user: userResponse
    });
  } catch (err) {
    console.error('Rewards update error:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router; 