import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { RewardsAPI } from '../services/api';

const RewardsContext = createContext();

export function useRewards() {
  return useContext(RewardsContext);
}

export function RewardsProvider({ children }) {
  const { currentUser } = useAuth();
  const [rewardsProfile, setRewardsProfile] = useState(null);
  const [starHistory, setStarHistory] = useState([]);
  const [availableRewards, setAvailableRewards] = useState([]);
  const [offers, setOffers] = useState([]);
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load rewards profile when user is authenticated
  useEffect(() => {
    if (currentUser) {
      loadRewardsProfile();
    } else {
      setRewardsProfile(null);
      setLoading(false);
    }
  }, [currentUser]);

  // Load available rewards for all users
  useEffect(() => {
    loadAvailableRewards();
    
    // Load public offers for non-logged in users or offers for authenticated users
    if (currentUser) {
      loadOffers();
    } else {
      loadPublicOffers();
    }
  }, [currentUser]);

  const loadRewardsProfile = async () => {
    try {
      setLoading(true);
      const profile = await RewardsAPI.getProfile();
      setRewardsProfile(profile);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading rewards profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStarHistory = async () => {
    try {
      setLoading(true);
      const history = await RewardsAPI.getStarHistory();
      setStarHistory(history);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading star history:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRewards = async () => {
    try {
      const rewards = await RewardsAPI.getAvailableRewards();
      setAvailableRewards(rewards);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading available rewards:', err);
    }
  };

  const loadOffers = async () => {
    try {
      const userOffers = await RewardsAPI.getOffers();
      setOffers(userOffers);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading offers:', err);
    }
  };

  const loadPublicOffers = async () => {
    try {
      const publicOffers = await RewardsAPI.getPublicOffers();
      setOffers(publicOffers);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading public offers:', err);
    }
  };

  const loadReferralStats = async () => {
    try {
      setLoading(true);
      const stats = await RewardsAPI.getReferralStats();
      setReferralStats(stats);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error loading referral stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const redeemReward = async (rewardId) => {
    try {
      setLoading(true);
      await RewardsAPI.redeemReward(rewardId);
      // Refresh profile after redemption
      await loadRewardsProfile();
      setError(null);
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error redeeming reward:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const joinRewardsProgram = async (birthdate) => {
    try {
      setLoading(true);
      const result = await RewardsAPI.joinProgram(birthdate);
      await loadRewardsProfile();
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error joining rewards program:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const applyReferralCode = async (userId, referralCode) => {
    try {
      setLoading(true);
      const result = await RewardsAPI.applyReferralCode(userId, referralCode);
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Error applying referral code:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    rewardsProfile,
    starHistory,
    availableRewards,
    offers,
    referralStats,
    loading,
    error,
    loadRewardsProfile,
    loadStarHistory,
    loadAvailableRewards,
    loadOffers,
    loadReferralStats,
    redeemReward,
    joinRewardsProgram,
    applyReferralCode
  };

  return (
    <RewardsContext.Provider value={value}>
      {children}
    </RewardsContext.Provider>
  );
} 