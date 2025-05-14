const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });
if (result.error) {
  console.error('Error loading .env file:', result.error);
}

// Import routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const dealRoutes = require('./routes/deals');
const paymentRoutes = require('./routes/payments');
const rewardRoutes = require('./routes/rewards');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Print loaded environment variables (without sensitive data)
console.log('Environment variables loaded:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

// CORS configuration - more permissive for development
app.use(cors({
  origin: '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// MongoDB Connection setup with improved error handling
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`MongoDB URI: ${process.env.MONGODB_URI || 'Not set'}`);
    
    // Fallback to a default connection string if not set in .env
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mug-and-moment';
    
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
      socketTimeoutMS: 45000, // Socket timeout
      connectTimeoutMS: 30000, // Connection timeout
      family: 4 // Use IPv4, skip trying IPv6
    };
    
    await mongoose.connect(mongoURI, connectionOptions);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    
    // More detailed error logging
    if (err.name === 'MongooseServerSelectionError') {
      console.error('MongoDB server selection failed. Check if MongoDB is running.');
    } else if (err.name === 'MongoParseError') {
      console.error('Invalid MongoDB connection string. Check your MONGODB_URI in .env file.');
    } else if (err.message.includes('buffering timed out')) {
      console.error('Connection timeout. MongoDB might be unreachable or overloaded.');
    }
    
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000); // Retry connection after 5 seconds
  }
};

// Connect to MongoDB
connectDB();

// Root route
app.get('/', (req, res) => {
  res.send('Mug & Moment API is running');
});

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/rewards', rewardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});