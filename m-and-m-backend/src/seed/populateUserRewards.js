const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const crypto = require('crypto');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mug-and-moment';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected for populating user rewards...');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Generate a random referral code
const generateReferralCode = (userId) => {
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${userId.toString().substring(0, 4)}${random}`;
};

// Function to populate rewards for existing users
const populateUserRewards = async () => {
  try {
    await connectDB();
    
    // Find all users
    const users = await User.find();
    console.log(`Found ${users.length} users`);
    
    let updatedCount = 0;
    
    // Update each user with rewards data
    for (const user of users) {
      // Skip users who already have rewards data
      if (user.rewards && user.rewards.stars > 0) {
        console.log(`User ${user.firstName} ${user.lastName} already has rewards`);
        continue;
      }
      
      // Generate random stars between 0-350
      const stars = Math.floor(Math.random() * 350);
      
      // Determine level based on stars
      let level = 'Green';
      if (stars >= 301) {
        level = 'Platinum';
      } else if (stars >= 101) {
        level = 'Gold';
      }
      
      // Generate a referral code
      const referralCode = generateReferralCode(user._id);
      
      // Initialize rewards object if it doesn't exist
      if (!user.rewards) {
        user.rewards = {
          stars: 0,
          level: 'Green',
          starHistory: [],
          referrals: [],
          redemptions: []
        };
      }
      
      // Update rewards data
      user.rewards.stars = stars;
      user.rewards.level = level;
      user.rewards.referralCode = referralCode;
      
      // Add some random star history
      const sources = ['purchase', 'referral', 'birthday', 'mobile_order'];
      const historyCount = Math.floor(Math.random() * 5) + 1; // 1-5 history items
      
      // Clear existing history (if any)
      user.rewards.starHistory = [];
      
      for (let i = 0; i < historyCount; i++) {
        const amount = Math.floor(Math.random() * 50) + 10; // 10-60 stars
        const sourceIndex = Math.floor(Math.random() * sources.length);
        const source = sources[sourceIndex];
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date in the last 30 days
        
        user.rewards.starHistory.push({
          amount,
          source,
          description: `Earned ${amount} stars from ${source}`,
          createdAt: date
        });
      }
      
      // Save the updated user
      await user.save();
      updatedCount++;
      console.log(`Updated rewards for ${user.firstName} ${user.lastName} (${stars} stars, ${level} level)`);
    }
    
    console.log(`Successfully updated rewards for ${updatedCount} users`);
    
    // Close connection
    mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error populating user rewards:', error);
    mongoose.connection.close();
  }
};

// Run the function
populateUserRewards(); 