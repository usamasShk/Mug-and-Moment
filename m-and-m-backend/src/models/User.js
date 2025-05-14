const mongoose = require('mongoose');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  birthdate: {
    type: Date
  },
  rewards: {
    stars: {
      type: Number,
      default: 0
    },
    level: {
      type: String,
      enum: ['Green', 'Gold', 'Platinum'],
      default: 'Green'
    },
    // Track star transactions for history
    starHistory: [{
      amount: Number,      // Can be positive (earned) or negative (redeemed)
      source: String,      // 'purchase', 'referral', 'birthday', 'reusable_cup', 'mobile_order', 'redemption'
      description: String, // Human-readable description
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    // Referral tracking
    referralCode: String,
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    referrals: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      date: {
        type: Date,
        default: Date.now
      },
      rewarded: {
        type: Boolean,
        default: false
      }
    }],
    // Redeem history
    redemptions: [{
      reward: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reward'
      },
      starsSpent: Number,
      date: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['active', 'used', 'expired'],
        default: 'active'
      }
    }]
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Generate referral code when a user is created
UserSchema.pre('save', function(next) {
  // Only generate code if it doesn't exist and user is being created
  if (!this.rewards.referralCode && this.isNew) {
    // Create a referral code using part of the user's ID and a random string
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    this.rewards.referralCode = `${this._id.toString().substring(0, 4)}${random}`;
  }
  next();
});

module.exports = mongoose.model('User', UserSchema); 