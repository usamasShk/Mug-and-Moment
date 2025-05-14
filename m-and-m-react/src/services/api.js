const API_BASE_URL = 'http://localhost:5000/api';

// Helper function for fetch calls
const fetchWithAuth = async (endpoint, options = {}) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (user && user.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }

  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API request failed');
  }

  return response.json();
};

// Auth API
export const AuthAPI = {
  login: (email, password) => {
    return fetchWithAuth('auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },
  
  signup: (userData) => {
    return fetchWithAuth('auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  forgotPassword: (email) => {
    return fetchWithAuth('auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }
};

// Rewards API
export const RewardsAPI = {
  // Get user's rewards profile
  getProfile: () => {
    return fetchWithAuth('rewards/profile');
  },
  
  // Get user's star history
  getStarHistory: () => {
    return fetchWithAuth('rewards/history');
  },
  
  // Get available rewards for redemption
  getAvailableRewards: () => {
    return fetchWithAuth('rewards/available');
  },
  
  // Redeem a reward
  redeemReward: (rewardId) => {
    return fetchWithAuth('rewards/redeem', {
      method: 'POST',
      body: JSON.stringify({ rewardId })
    });
  },
  
  // Get eligible offers for user
  getOffers: () => {
    return fetchWithAuth('rewards/offers');
  },
  
  // Get public offers (for non-logged in users)
  getPublicOffers: () => {
    return fetchWithAuth('rewards/public-offers');
  },
  
  // Get referral stats
  getReferralStats: () => {
    return fetchWithAuth('rewards/referral');
  },
  
  // Apply a referral code during signup
  applyReferralCode: (userId, referralCode) => {
    return fetchWithAuth('rewards/referral/apply', {
      method: 'POST',
      body: JSON.stringify({ userId, referralCode })
    });
  },
  
  // Join rewards program
  joinProgram: (birthdate) => {
    return fetchWithAuth('rewards/join', {
      method: 'POST',
      body: JSON.stringify({ birthdate })
    });
  },
  
  // Mark a reward as used
  markRewardAsUsed: (redemptionId) => {
    return fetchWithAuth('rewards/mark-used', {
      method: 'PUT',
      body: JSON.stringify({ redemptionId })
    });
  }
};

// Products API
export const ProductsAPI = {
  getAll: () => {
    return fetchWithAuth('products');
  },
  
  getById: (productId) => {
    return fetchWithAuth(`products/${productId}`);
  }
};

// Orders API
export const OrdersAPI = {
  getOrders: () => {
    return fetchWithAuth('orders');
  },
  
  createOrder: (orderData) => {
    return fetchWithAuth('orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }
};

export default {
  AuthAPI,
  RewardsAPI,
  ProductsAPI,
  OrdersAPI
};