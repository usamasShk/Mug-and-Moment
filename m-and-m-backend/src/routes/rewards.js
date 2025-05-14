const express = require('express');
const router = express.Router();
const rewardService = require('../services/rewardService');
const Reward = require('../models/Reward');
const Offer = require('../models/Offer');
const User = require('../models/User');
const mongoose = require('mongoose');
const { mockAuthenticateToken: authenticateToken } = require('../middleware/auth');

// Helper function to validate and find user
const getValidUser = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format');
  }
  
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User not found with ID: ${userId}`);
  }
  
  // Initialize rewards if needed
  if (!user.rewards) {
    user.rewards = {
      stars: 0,
      level: 'Green',
      starHistory: [],
      referrals: [],
      redemptions: []
    };
    await user.save();
  }
  
  return user;
};

// Get user's rewards profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting rewards profile for user:', userId);
    
    try {
      await getValidUser(userId);
    } catch (userError) {
      console.error('User validation error:', userError.message);
      // Continue to getUserRewardsProfile which has fallback behavior
    }
    
    const profile = await rewardService.getUserRewardsProfile(userId);
    res.json(profile);
  } catch (error) {
    console.error('Error fetching reward profile:', error.message);
    res.status(500).json({ 
      message: error.message,
      userId: req.user.id
    });
  }
});

// Get user's star history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting star history for user:', userId);
    
    // Validate user exists
    try {
      await getValidUser(userId);
    } catch (userError) {
      return res.status(404).json({ 
        message: userError.message,
        userId: req.user.id
      });
    }
    
    const history = await rewardService.getStarHistory(userId);
    res.json(history);
  } catch (error) {
    console.error('Error fetching star history:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get available rewards for redemption
router.get('/available', async (req, res) => {
  try {
    const rewards = await rewardService.getAvailableRewards();
    res.json(rewards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Redeem a reward
router.post('/redeem', authenticateToken, async (req, res) => {
  try {
    const { rewardId } = req.body;
    const userId = req.user.id;
    console.log(`Attempting to redeem reward ${rewardId} for user ${userId}`);
    
    if (!rewardId) {
      return res.status(400).json({ message: 'Reward ID is required' });
    }
    
    // Validate user exists
    try {
      await getValidUser(userId);
    } catch (userError) {
      return res.status(404).json({ 
        message: userError.message,
        userId
      });
    }
    
    const updatedUser = await rewardService.redeemReward(userId, rewardId);
    res.json({ message: 'Reward redeemed successfully', user: updatedUser });
  } catch (error) {
    console.error('Error redeeming reward:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// Get eligible offers for user
router.get('/offers', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const offers = await rewardService.getEligibleOffers(userId);
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get public offers (for non-logged in users)
router.get('/public-offers', async (req, res) => {
  try {
    const today = new Date();
    const offers = await Offer.find({
      isActive: true,
      eligibleLevels: { $size: 0 }, // Public offers with no level requirement
      startDate: { $lte: today },
      $or: [
        { endDate: { $gte: today } },
        { endDate: null }
      ]
    });
    
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get referral stats
router.get('/referral', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting referral stats for user:', userId);
    
    // Validate user exists
    try {
      await getValidUser(userId);
    } catch (userError) {
      return res.status(404).json({ 
        message: userError.message,
        userId: req.user.id
      });
    }
    
    const referralStats = await rewardService.getReferralStats(userId);
    res.json(referralStats);
  } catch (error) {
    console.error('Error fetching referral stats:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Apply a referral code during signup
router.post('/referral/apply', async (req, res) => {
  try {
    const { userId, referralCode } = req.body;
    
    if (!userId || !referralCode) {
      return res.status(400).json({ message: 'User ID and referral code are required' });
    }
    
    const result = await rewardService.processReferral(userId, referralCode);
    res.json({ message: 'Referral code applied successfully', result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Award stars for a purchase
router.post('/add-purchase-stars', authenticateToken, async (req, res) => {
  try {
    const { orderAmount, isMobileOrder, isReusableCup } = req.body;
    const userId = req.user.id;
    
    if (!orderAmount) {
      return res.status(400).json({ message: 'Order amount is required' });
    }
    
    const updatedUser = await rewardService.applyPurchaseStars(userId, orderAmount, {
      isMobileOrder,
      isReusableCup
    });
    
    res.json({ 
      message: 'Stars added successfully', 
      stars: updatedUser.rewards.stars,
      level: updatedUser.rewards.level
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark a reward as used
router.put('/mark-used', authenticateToken, async (req, res) => {
  try {
    const { redemptionId } = req.body;
    const userId = req.user.id;
    
    if (!redemptionId) {
      return res.status(400).json({ message: 'Redemption ID is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const redemption = user.rewards.redemptions.id(redemptionId);
    if (!redemption) {
      return res.status(404).json({ message: 'Redemption not found' });
    }
    
    redemption.status = 'used';
    await user.save();
    
    res.json({ message: 'Reward marked as used', redemption });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Join rewards program (updates user profile with rewards info)
router.post('/join', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { birthdate } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Add birthdate if provided
    if (birthdate) {
      user.birthdate = new Date(birthdate);
    }
    
    // Make sure rewards structure is properly initialized
    if (!user.rewards) {
      user.rewards = {
        stars: 0,
        level: 'Green',
        starHistory: [],
        referrals: []
      };
    }
    
    // Give 50 welcome stars
    user.rewards.stars += 50;
    user.rewards.starHistory.push({
      amount: 50,
      source: 'signup',
      description: 'Welcome bonus for joining rewards program'
    });
    
    await user.save();
    
    res.json({ 
      message: 'Successfully joined rewards program',
      stars: user.rewards.stars,
      level: user.rewards.level,
      referralCode: user.rewards.referralCode
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ADMIN ROUTES
// Create a new reward (admin only)
router.post('/admin/rewards', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin (you'll need to implement this in your auth middleware)
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
    
    const reward = new Reward(req.body);
    await reward.save();
    
    res.status(201).json(reward);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new offer (admin only)
router.post('/admin/offers', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized: Admin access required' });
    }
    
    const offer = new Offer(req.body);
    await offer.save();
    
    res.status(201).json(offer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 