const User = require('../models/User');
const Reward = require('../models/Reward');
const Offer = require('../models/Offer');
const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * Update user level based on star count
 * @param {Object} user - User document
 */
const updateUserLevel = (user) => {
  const stars = user.rewards.stars;
  
  if (stars >= 301) {
    user.rewards.level = 'Platinum';
  } else if (stars >= 101) {
    user.rewards.level = 'Gold';
  } else {
    user.rewards.level = 'Green';
  }
};

/**
 * Add stars to a user account
 * @param {String} userId - User ID
 * @param {Number} amount - Amount of stars to add
 * @param {String} source - Source of stars (purchase, referral, etc)
 * @param {String} description - Human-readable description
 * @returns {Promise<Object>} - Updated user object
 */
const addStarsToUser = async (userId, amount, source, description) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  
  // Add stars
  user.rewards.stars += amount;
  
  // Add to history
  user.rewards.starHistory.push({
    amount,
    source,
    description
  });
  
  // Check and update level if necessary
  updateUserLevel(user);
  
  await user.save();
  return user;
};

/**
 * Apply purchase stars including special bonuses
 * @param {String} userId - User ID
 * @param {Number} orderAmount - Order amount in dollars
 * @param {Object} options - Additional options (isMobileOrder, isReusableCup)
 * @returns {Promise<Object>} - Updated user object with earned stars
 */
const applyPurchaseStars = async (userId, orderAmount, options = {}) => {
  let starsEarned = Math.floor(orderAmount); // 1 star per $1
  let description = `Purchase of $${orderAmount.toFixed(2)}`;
  
  // Check for birthday month
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  
  if (user.birthdate) {
    const today = new Date();
    const birthMonth = user.birthdate.getMonth();
    
    if (today.getMonth() === birthMonth) {
      starsEarned *= 2;
      description += ' with birthday bonus (2x)';
    }
  }
  
  // Check for mobile ordering
  if (options.isMobileOrder) {
    starsEarned += 3;
    description += ' via mobile app (+3)';
  }
  
  // Check for reusable cup
  if (options.isReusableCup) {
    starsEarned += 5;
    description += ' with reusable cup (+5)';
  }
  
  return addStarsToUser(userId, starsEarned, 'purchase', description);
};

/**
 * Redeem a reward
 * @param {String} userId - User ID
 * @param {String} rewardId - Reward ID
 * @returns {Promise<Object>} - Updated user object
 */
const redeemReward = async (userId, rewardId) => {
  // Validate inputs
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  if (!rewardId) {
    throw new Error('Reward ID is required');
  }
  
  // Check if userId is valid ObjectId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID format');
  }
  
  if (!mongoose.Types.ObjectId.isValid(rewardId)) {
    throw new Error('Invalid reward ID format');
  }
  
  // Find user and reward
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User not found with ID: ${userId}`);
  }
  
  const reward = await Reward.findById(rewardId);
  if (!reward) {
    throw new Error(`Reward not found with ID: ${rewardId}`);
  }
  
  if (!reward.isActive) {
    throw new Error('Reward is no longer available');
  }
  
  // Check if user has rewards object initialized
  if (!user.rewards) {
    user.rewards = {
      stars: 0,
      level: 'Green',
      starHistory: [],
      redemptions: []
    };
    await user.save();
    throw new Error('Not enough stars to redeem this reward');
  }
  
  if (user.rewards.stars < reward.starsRequired) {
    throw new Error(`Not enough stars to redeem this reward. You have ${user.rewards.stars} stars, but ${reward.starsRequired} stars are required.`);
  }
  
  // Deduct stars
  user.rewards.stars -= reward.starsRequired;
  
  // Add to star history (negative amount for redemption)
  user.rewards.starHistory.push({
    amount: -reward.starsRequired,
    source: 'redemption',
    description: `Redeemed for ${reward.name}`
  });
  
  // Add to redemption history
  user.rewards.redemptions.push({
    reward: rewardId,
    starsSpent: reward.starsRequired,
    status: 'active'
  });
  
  await user.save();
  return user;
};

/**
 * Process a referral during user signup
 * @param {String} newUserId - New user ID
 * @param {String} referralCode - Referral code
 * @returns {Promise<Object>} - Object with referrer and new user
 */
const processReferral = async (newUserId, referralCode) => {
  // Find the referring user
  const referrer = await User.findOne({ 'rewards.referralCode': referralCode });
  if (!referrer) throw new Error('Invalid referral code');
  
  // Update new user to indicate they were referred
  const newUser = await User.findById(newUserId);
  if (!newUser) throw new Error('New user not found');
  
  newUser.rewards.referredBy = referrer._id;
  await newUser.save();
  
  // Add the referral to the referrer's list
  referrer.rewards.referrals.push({
    user: newUserId,
    rewarded: false
  });
  await referrer.save();
  
  return { referrer, newUser };
};

/**
 * Award stars for a successful referral (called after first purchase)
 * @param {String} newUserId - User ID for the person who was referred
 * @returns {Promise<Object>} - Updated referrer object
 */
const rewardReferral = async (newUserId) => {
  const newUser = await User.findById(newUserId);
  if (!newUser || !newUser.rewards.referredBy) return null;
  
  // Find the referral in the referrer's list
  const referrer = await User.findById(newUser.rewards.referredBy);
  if (!referrer) return null;
  
  const referralIndex = referrer.rewards.referrals.findIndex(r => 
    r.user.toString() === newUserId.toString() && !r.rewarded
  );
  
  if (referralIndex !== -1) {
    // Mark as rewarded
    referrer.rewards.referrals[referralIndex].rewarded = true;
    
    // Add 50 stars to referrer
    referrer.rewards.stars += 50;
    referrer.rewards.starHistory.push({
      amount: 50,
      source: 'referral',
      description: `Referral bonus for ${newUser.firstName} ${newUser.lastName}`
    });
    
    // Update level if needed
    updateUserLevel(referrer);
    
    await referrer.save();
    return referrer;
  }
  
  return null;
};

/**
 * Get eligible offers for a user
 * @param {String} userId - User ID
 * @returns {Promise<Array>} - Array of eligible offers
 */
const getEligibleOffers = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  
  const userLevel = user.rewards.level;
  const today = new Date();
  
  // Find relevant offers
  const offers = await Offer.find({
    isActive: true,
    $or: [
      { eligibleLevels: userLevel },
      { eligibleLevels: { $size: 0 } } // No specific level requirements
    ],
    startDate: { $lte: today },
    $or: [
      { endDate: { $gte: today } },
      { endDate: null } // Ongoing offers
    ]
  });
  
  return offers;
};

/**
 * Get user's rewards profile
 * @param {String} userId - User ID
 * @returns {Promise<Object>} - User rewards profile
 */
const getUserRewardsProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select(
      'firstName lastName rewards.stars rewards.level rewards.redemptions rewards.referralCode'
    ).populate({
      path: 'rewards.redemptions.reward',
      select: 'name description starsRequired image'
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Initialize rewards profile for users who don't have it
    if (!user.rewards || !user.rewards.stars) {
      return {
        name: `${user.firstName} ${user.lastName}`,
        stars: 0,
        level: 'Green',
        nextRewardNeeded: 50, // Assuming the lowest reward is 50 stars
        nextReward: "Free Hot Coffee",
        activeRedemptions: [],
        referralCode: ''
      };
    }
    
    // Get upcoming rewards
    const availableRewards = await Reward.find({ isActive: true })
      .sort('starsRequired')
      .select('name starsRequired');
    
    // Find the next reward the user can work toward
    const nextReward = availableRewards.find(r => r.starsRequired > user.rewards.stars);
    
    // Get active redemptions
    const activeRedemptions = user.rewards.redemptions && user.rewards.redemptions.length > 0
      ? user.rewards.redemptions
          .filter(r => r.status === 'active')
          .map(r => ({
            id: r._id,
            name: r.reward?.name || 'Reward',
            description: r.reward?.description || '',
            starsSpent: r.starsSpent,
            date: r.date,
            image: r.reward?.image || ''
          }))
      : [];
    
    return {
      name: `${user.firstName} ${user.lastName}`,
      stars: user.rewards?.stars || 0,
      level: user.rewards?.level || 'Green',
      nextRewardNeeded: nextReward ? nextReward.starsRequired - (user.rewards?.stars || 0) : 0,
      nextReward: nextReward ? nextReward.name : null,
      activeRedemptions,
      referralCode: user.rewards?.referralCode || ''
    };
  } catch (error) {
    console.error("Error getting user rewards profile:", error);
    // Return default profile instead of throwing error
    return {
      name: "User",
      stars: 0,
      level: 'Green',
      nextRewardNeeded: 50,
      nextReward: "Free Hot Coffee",
      activeRedemptions: [],
      referralCode: ''
    };
  }
};

/**
 * Get user's star history
 * @param {String} userId - User ID
 * @returns {Promise<Array>} - Array of star transactions
 */
const getStarHistory = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return [];
    }
    
    const user = await User.findById(userId).select('rewards.starHistory');
    
    if (!user) {
      console.log(`User not found for star history: ${userId}`);
      return [];
    }
    
    if (!user.rewards || !user.rewards.starHistory) {
      console.log(`User ${userId} has no star history`);
      return [];
    }
    
    return user.rewards.starHistory.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error(`Error getting star history for user ${userId}:`, error);
    return [];
  }
};

/**
 * Get available rewards for redemption
 * @returns {Promise<Array>} - Array of available rewards
 */
const getAvailableRewards = async () => {
  return Reward.find({ isActive: true }).sort('starsRequired');
};

/**
 * Get user's referral statistics
 * @param {String} userId - User ID
 * @returns {Promise<Object>} - Referral statistics
 */
const getReferralStats = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }
    
    const user = await User.findById(userId)
      .select('rewards.referrals rewards.referralCode')
      .populate({
        path: 'rewards.referrals.user',
        select: 'firstName lastName'
      });
    
    if (!user) {
      throw new Error(`User not found with ID: ${userId}`);
    }
    
    // If rewards don't exist yet, return default stats
    if (!user.rewards) {
      return {
        referralCode: '',
        totalReferrals: 0,
        successfulReferrals: 0,
        pendingReferrals: 0,
        starsEarned: 0,
        recentReferrals: []
      };
    }
    
    // Create referral code if missing
    if (!user.rewards.referralCode) {
      user.rewards.referralCode = generateReferralCode(userId);
      await user.save();
    }
    
    const referrals = user.rewards.referrals || [];
    const totalReferrals = referrals.length;
    const successfulReferrals = referrals.filter(r => r.rewarded).length;
    const pendingReferrals = totalReferrals - successfulReferrals;
    const starsEarned = successfulReferrals * 50; // 50 stars per successful referral
    
    const recentReferrals = referrals
      .sort((a, b) => b.date - a.date)
      .slice(0, 5)
      .map(r => ({
        name: r.user ? `${r.user.firstName} ${r.user.lastName}` : 'Unknown User',
        date: r.date,
        status: r.rewarded ? 'Completed' : 'Pending'
      }));
    
    return {
      referralCode: user.rewards.referralCode,
      totalReferrals,
      successfulReferrals,
      pendingReferrals,
      starsEarned,
      recentReferrals
    };
  } catch (error) {
    console.error(`Error getting referral stats for user ${userId}:`, error);
    // Return default stats on error
    return {
      referralCode: '',
      totalReferrals: 0,
      successfulReferrals: 0,
      pendingReferrals: 0,
      starsEarned: 0,
      recentReferrals: []
    };
  }
};

// Helper function to generate a referral code
const generateReferralCode = (userId) => {
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${userId.toString().substring(0, 4)}${random}`;
};

/**
 * Award 1 star to a user for logging in
 * @param {String} userId - User ID
 * @returns {Promise<Object>} - Updated user object
 */
const awardLoginStar = async (userId) => {
  return addStarsToUser(userId, 1, 'login', 'Daily login bonus');
};

module.exports = {
  addStarsToUser,
  applyPurchaseStars,
  redeemReward,
  processReferral,
  rewardReferral,
  getEligibleOffers,
  getUserRewardsProfile,
  getStarHistory,
  getAvailableRewards,
  getReferralStats,
  awardLoginStar
}; 