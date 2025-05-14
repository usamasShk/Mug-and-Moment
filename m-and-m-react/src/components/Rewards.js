import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageNavigation from './PageNavigation';
import { useAuth } from '../contexts/AuthContext';
import { useRewards } from '../contexts/RewardsContext';
import './Rewards.css';

const Rewards = () => {
  const [activeTab, setActiveTab] = useState('stars');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [birthdate, setBirthdate] = useState('');
  const [loadingTab, setLoadingTab] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const { 
    rewardsProfile, 
    availableRewards, 
    offers, 
    referralStats,
    loading,
    error,
    loadRewardsProfile,
    loadStarHistory,
    loadReferralStats,
    redeemReward,
    joinRewardsProgram
  } = useRewards();

  // Load referral stats when the referral tab is active
  useEffect(() => {
    if (activeTab === 'referral' && !referralStats) {
      setLoadingTab(true);
      loadReferralStats().finally(() => setLoadingTab(false));
    }
  }, [activeTab, referralStats, loadReferralStats]);

  // Handle reward redemption
  const handleRedeemReward = async (rewardId) => {
    if (!rewardsProfile) return;
    
    try {
      const result = await redeemReward(rewardId);
      if (result) {
        alert('Reward redeemed successfully!');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      alert('Failed to redeem reward. Please try again.');
    }
  };

  // Handle join reward program
  const handleJoinProgram = async (e) => {
    e.preventDefault();
    try {
      await joinRewardsProgram(birthdate);
      setShowJoinModal(false);
      alert('Successfully joined the rewards program!');
    } catch (error) {
      console.error('Error joining rewards program:', error);
      alert('Failed to join rewards program. Please try again.');
    }
  };

  // Handle copy referral code
  const handleCopyReferralCode = () => {
    if (referralStats?.referralCode) {
      navigator.clipboard.writeText(`https://m-and-m.com/signup?ref=${referralStats.referralCode}`);
      alert('Referral link copied to clipboard!');
    }
  };

  // Handle share buttons
  const handleShare = (platform) => {
    if (!referralStats?.referralCode) return;
    
    const referralLink = `https://m-and-m.com/signup?ref=${referralStats.referralCode}`;
    const message = `Join Mug & Moment Coffee Shop and earn rewards! Use my referral code: ${referralStats.referralCode}`;
    
    switch (platform) {
      case 'email':
        window.open(`mailto:?subject=Join Mug & Moment Rewards&body=${message} ${referralLink}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(message)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message + ' ' + referralLink)}`);
        break;
      default:
        break;
    }
  };

  // Function to check if user has enough stars for a reward
  const canRedeem = (starsRequired) => {
    return rewardsProfile && rewardsProfile.stars >= starsRequired;
  };

  // Redirect to signup page for non-members
  const handleJoinNowClick = () => {
    if (currentUser) {
      setShowJoinModal(true);
    } else {
      navigate('/signup');
    }
  };

  // Mock data for demonstration when backend is not available
  const fallbackUserData = {
    name: "Guest User",
    stars: 125,
    level: "Gold",
    availableRewards: [
      { id: 1, name: "Free Coffee", starsRequired: 50 },
      { id: 2, name: "Free Pastry", starsRequired: 75 },
      { id: 3, name: "30% Off Any Drink", starsRequired: 100 }
    ]
  };

  const fallbackFeaturedOffers = [
    {
      id: 1,
      title: "Monday Brew Day",
      description: "Get a free tall hot or iced coffee every Monday with 25 stars",
      image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600",
      expires: "Ongoing"
    },
    {
      id: 2,
      title: "Double Star Days",
      description: "Earn twice the stars on all purchases every Tuesday",
      image: "https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg?auto=compress&cs=tinysrgb&w=600",
      expires: "Ongoing"
    },
    {
      id: 3,
      title: "Birthday Reward",
      description: "Enjoy any handcrafted drink for free during your birthday month",
      image: "https://images.pexels.com/photos/1793037/pexels-photo-1793037.jpeg?auto=compress&cs=tinysrgb&w=600",
      expires: "Your birthday month"
    }
  ];

  const fallbackRedemptionOptions = [
    {
      id: 1,
      name: "Free Hot Coffee",
      stars: 50,
      image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 2,
      name: "Free Cold Drink",
      stars: 75,
      image: "https://images.pexels.com/photos/2074122/pexels-photo-2074122.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 3,
      name: "Free Bakery Item",
      stars: 100,
      image: "https://images.pexels.com/photos/890577/pexels-photo-890577.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 4,
      name: "Free Specialty Drink",
      stars: 150,
      image: "https://images.pexels.com/photos/1193335/pexels-photo-1193335.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    {
      id: 5,
      name: "50% Off Any Item",
      stars: 125,
      image: "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=600"
    }
  ];

  const referralSteps = [
    {
      id: 1,
      title: "Invite Friends",
      description: "Share your unique referral link with friends and family",
      icon: "👥"
    },
    {
      id: 2,
      title: "Friends Join",
      description: "When they sign up using your link and make their first purchase",
      icon: "🎯"
    },
    {
      id: 3,
      title: "Earn Rewards",
      description: "You'll receive 50 bonus stars for each successful referral",
      icon: "🎁"
    }
  ];

  const starsTiers = [
    {
      level: "Green",
      stars: "0-100",
      benefits: ["Personalized offers", "Birthday reward", "Free in-store refills"]
    },
    {
      level: "Gold",
      stars: "101-300",
      benefits: ["All Green benefits", "Monthly Double-Star Day", "Free bakery item quarterly"]
    },
    {
      level: "Platinum",
      stars: "301+",
      benefits: ["All Gold benefits", "Free drink weekly", "Priority customer service"]
    }
  ];

  // Use real data from backend when available, fallback to mock data when not
  const userData = rewardsProfile || fallbackUserData;
  const featuredOffers = offers.length > 0 ? offers.map(offer => ({
    id: offer._id,
    title: offer.title,
    description: offer.description,
    image: offer.image,
    expires: offer.endDate ? new Date(offer.endDate).toLocaleDateString() : "Ongoing"
  })) : fallbackFeaturedOffers;
  
  const redemptionOptions = availableRewards.length > 0 ? availableRewards.map(reward => ({
    id: reward._id,
    name: reward.name,
    stars: reward.starsRequired,
    image: reward.image
  })) : fallbackRedemptionOptions;

  return (
    <div className="rewards-container">
      <PageNavigation />
      
      <div className="rewards-hero">
        <div className="rewards-hero-content">
          <h1>M&M Rewards</h1>
          <p>Join our rewards program and start earning stars with every purchase</p>
          <button className="rewards-signup-btn" onClick={handleJoinNowClick}>
            Join Now
          </button>
        </div>
      </div>

      <div className="rewards-tabs">
        <button 
          className={`rewards-tab ${activeTab === 'stars' ? 'active' : ''}`} 
          onClick={() => setActiveTab('stars')}
        >
          Stars System
        </button>
        <button 
          className={`rewards-tab ${activeTab === 'redeem' ? 'active' : ''}`} 
          onClick={() => setActiveTab('redeem')}
        >
          Redemption
        </button>
        <button 
          className={`rewards-tab ${activeTab === 'offers' ? 'active' : ''}`} 
          onClick={() => setActiveTab('offers')}
        >
          Exclusive Offers
        </button>
        <button 
          className={`rewards-tab ${activeTab === 'referral' ? 'active' : ''}`} 
          onClick={() => setActiveTab('referral')}
        >
          Referral Program
        </button>
      </div>

      {loading || loadingTab ? (
        <div className="loading-indicator">Loading...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="rewards-content">
          {activeTab === 'stars' && (
            <div className="rewards-section stars-section">
              <h2>How Our Stars System Works</h2>
              <p className="section-description">Earn stars with every purchase and unlock exciting rewards as you progress through different tiers.</p>
              
              <div className="rewards-card user-stars-card">
                <div className="stars-icon">⭐</div>
                <h3>Your Stars Balance</h3>
                <div className="stars-balance">{userData.stars}</div>
                <p>Current level: <span className="user-level">{userData.level}</span></p>
              </div>

              <h3 className="subsection-title">Stars Earning Guide</h3>
              <div className="earning-grid">
                <div className="earning-item">
                  <div className="earning-icon">☕</div>
                  <div className="earning-details">
                    <h4>Basic Purchases</h4>
                    <p>1 star per $1 spent on any purchase</p>
                  </div>
                </div>
                <div className="earning-item">
                  <div className="earning-icon">🎂</div>
                  <div className="earning-details">
                    <h4>Birthday Bonus</h4>
                    <p>Double stars during your birthday month</p>
                  </div>
                </div>
                <div className="earning-item">
                  <div className="earning-icon">📱</div>
                  <div className="earning-details">
                    <h4>Mobile Ordering</h4>
                    <p>Extra 3 stars when you order via our app</p>
                  </div>
                </div>
                <div className="earning-item">
                  <div className="earning-icon">🔄</div>
                  <div className="earning-details">
                    <h4>Reusable Cup</h4>
                    <p>5 bonus stars when bringing your own cup</p>
                  </div>
                </div>
              </div>

              <h3 className="subsection-title">Membership Tiers</h3>
              <div className="tiers-container">
                {starsTiers.map((tier, index) => (
                  <div key={index} className={`tier-card ${userData.level === tier.level ? 'current-tier' : ''}`}>
                    <h4 className="tier-level">{tier.level}</h4>
                    <p className="tier-stars">{tier.stars} stars</p>
                    <ul className="tier-benefits">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                    {userData.level === tier.level && <div className="current-badge">Your Level</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'redeem' && (
            <div className="rewards-section redemption-section">
              <h2>Redeem Your Stars</h2>
              <p className="section-description">Use your hard-earned stars to treat yourself to a variety of rewards.</p>
              
              <div className="redemption-options">
                {redemptionOptions.map(option => (
                  <div key={option.id} className="redemption-card">
                    <img src={option.image} alt={option.name} className="redemption-img" />
                    <div className="redemption-info">
                      <h3>{option.name}</h3>
                      <div className="stars-cost">
                        <span className="star-icon">⭐</span>
                        <span>{option.stars} stars</span>
                      </div>
                      <button 
                        className={`redeem-button ${canRedeem(option.stars) ? 'available' : 'unavailable'}`}
                        disabled={!canRedeem(option.stars)}
                        onClick={() => handleRedeemReward(option.id)}
                      >
                        {canRedeem(option.stars) ? 'Redeem Now' : 'Not Enough Stars'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="redemption-tips">
                <h3>Tips for Redemption</h3>
                <ul>
                  <li>Stars expire 6 months after earning them</li>
                  <li>You can redeem stars at any of our locations</li>
                  <li>Simply tell our barista what reward you'd like to redeem</li>
                  <li>Check our app for limited-time redemption offers</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
            <div className="rewards-section offers-section">
              <h2>Exclusive Member Offers</h2>
              <p className="section-description">Special promotions and deals only available to our rewards members.</p>
              
              <div className="offers-grid">
                {featuredOffers.map(offer => (
                  <div key={offer.id} className="offer-card">
                    <div className="offer-img-container">
                      <img src={offer.image} alt={offer.title} className="offer-img" />
                    </div>
                    <div className="offer-content">
                      <h3>{offer.title}</h3>
                      <p>{offer.description}</p>
                      <div className="offer-expires">
                        <span>Expires: {offer.expires}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="member-exclusive">
                <h3>Member-Exclusive Benefits</h3>
                <div className="benefits-grid">
                  <div className="benefit-item">
                    <div className="benefit-icon">🔔</div>
                    <h4>Early Access</h4>
                    <p>Be the first to try new menu items</p>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">💰</div>
                    <h4>Special Pricing</h4>
                    <p>Member-only pricing on seasonal items</p>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">🎉</div>
                    <h4>Surprise Treats</h4>
                    <p>Random rewards throughout the year</p>
                  </div>
                  <div className="benefit-item">
                    <div className="benefit-icon">📆</div>
                    <h4>Happy Hours</h4>
                    <p>Special member happy hours with discounts</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'referral' && (
            <div className="rewards-section referral-section">
              <h2>Refer Friends, Earn Rewards</h2>
              <p className="section-description">Share the love and earn bonus stars when your friends join our rewards program.</p>
              
              <div className="referral-process">
                {referralSteps.map(step => (
                  <div key={step.id} className="process-step">
                    <div className="step-icon">{step.icon}</div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                ))}
              </div>

              <div className="referral-action">
                <h3>Your Referral Link</h3>
                <div className="referral-link-container">
                  <input 
                    type="text" 
                    readOnly 
                    value={referralStats ? `https://m-and-m.com/signup?ref=${referralStats.referralCode}` : "Sign in or join rewards to get your referral link"} 
                    className="referral-link"
                  />
                  <button 
                    className="copy-button" 
                    onClick={handleCopyReferralCode}
                    disabled={!referralStats?.referralCode}
                  >
                    Copy
                  </button>
                </div>
                <div className="share-buttons">
                  <button className="share-btn email" onClick={() => handleShare('email')}>Email</button>
                  <button className="share-btn facebook" onClick={() => handleShare('facebook')}>Facebook</button>
                  <button className="share-btn twitter" onClick={() => handleShare('twitter')}>Twitter</button>
                  <button className="share-btn whatsapp" onClick={() => handleShare('whatsapp')}>WhatsApp</button>
                </div>
              </div>

              <div className="referral-stats">
                <div className="stat-item">
                  <h4>Your Referrals</h4>
                  <p className="stat-value">{referralStats?.totalReferrals || 0}</p>
                </div>
                <div className="stat-item">
                  <h4>Stars Earned</h4>
                  <p className="stat-value">{referralStats?.starsEarned || 0}</p>
                </div>
                <div className="stat-item">
                  <h4>Pending Invites</h4>
                  <p className="stat-value">{referralStats?.pendingReferrals || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="enrollment-banner">
        <div className="banner-content">
          <h2>Not a member yet?</h2>
          <p>Join M&M Rewards today and start earning stars with your first purchase!</p>
          <button className="enrollment-button" onClick={handleJoinNowClick}>Enroll Now</button>
        </div>
      </div>

      {/* Join Rewards Modal */}
      {showJoinModal && (
        <div className="modal-overlay">
          <div className="join-modal">
            <button className="close-button" onClick={() => setShowJoinModal(false)}>×</button>
            <h2>Join M&M Rewards</h2>
            <p>Get 50 welcome stars just for joining!</p>
            <form onSubmit={handleJoinProgram}>
              <div className="form-group">
                <label htmlFor="birthdate">Your Birthdate (for birthday bonus):</label>
                <input 
                  type="date" 
                  id="birthdate"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="join-button">Join Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards; 