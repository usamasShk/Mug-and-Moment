const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate token
const authenticateToken = async (req, res, next) => {
  try {
    // Get the token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    // Verify token using the JWT_SECRET (should be stored in .env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Find user by id from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(403).json({ message: 'Invalid token. User not found.' });
    }
    
    // Add user info to request
    req.user = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin || false // Add admin check if you have admin roles
    };
    
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token.' });
  }
};

// Mock authentication for development - use this if you don't have auth set up yet
const mockAuthenticateToken = async (req, res, next) => {
  try {
    // Find an actual user in the database
    const user = await User.findOne();
    
    if (!user) {
      // If no users exist in the database, create a default mock user
      req.user = {
        id: '60d21b4667d0d8992e610c85', // Example user ID
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        isAdmin: true
      };
    } else {
      // Use a real user from the database
      req.user = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin || false
      };
    }
    next();
  } catch (error) {
    console.error('Error in mock authentication:', error);
    // Fall back to default mock user if error occurs
    req.user = {
      id: '60d21b4667d0d8992e610c85',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      isAdmin: true
    };
    next();
  }
};

// Export both methods so we can switch between real and mock authentication
module.exports = {
  authenticateToken,
  mockAuthenticateToken
}; 