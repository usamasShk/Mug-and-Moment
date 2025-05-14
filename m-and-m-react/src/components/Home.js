import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaGithub, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';
import axios from 'axios';

const Home = () => {
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedToCart, setAddedToCart] = useState({});
  const { addDealToCart, cartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/deals');
        setDeals(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching deals:', err);
        setError('Failed to load deals. Please try again later.');
        setIsLoading(false);
        
        // Use hardcoded deals as fallback (temporary)
        setDeals([
          {
            _id: '1',
            title: 'Perfect Pair Deal',
            description: 'The classic combination - one coffee and one cookie at a special bundle price!',
            dealPrice: 6.00,
            savings: 1.00,
            items: [
              { name: 'Classic Coffee', originalPrice: 4.00 },
              { name: 'Chocolate Cookie', originalPrice: 3.00 }
            ]
          },
          {
            _id: '2',
            title: 'Double Cookie Deal',
            description: 'Twice the sweetness! Get two delicious cookies at a special bundle price.',
            dealPrice: 5.00,
            savings: 1.00,
            items: [
              { name: 'Chocolate Cookie', originalPrice: 3.00 },
              { name: 'Brownie', originalPrice: 3.00 }
            ]
          },
          {
            _id: '3',
            title: 'Coffee Lovers Deal',
            description: 'Double the energy! Perfect for sharing or for your all-day coffee needs.',
            dealPrice: 6.00,
            savings: 2.00,
            items: [
              { name: 'Classic Coffee', originalPrice: 4.00 },
              { name: 'Classic Coffee', originalPrice: 4.00 }
            ]
          },
          {
            _id: '4',
            title: 'Cookie Party Pack',
            description: 'Perfect for sharing! Get four delicious cookies at a special bundle price.',
            dealPrice: 10.00,
            savings: 2.00,
            items: [
              { name: 'Chocolate Cookie', originalPrice: 3.00 },
              { name: 'Brownie', originalPrice: 3.00 },
              { name: 'Chocolate Cookie', originalPrice: 3.00 },
              { name: 'Brownie', originalPrice: 3.00 }
            ]
          },
          {
            _id: '5',
            title: 'Triple Cookie Pack',
            description: 'Three delicious cookies of your choice at a special price!',
            dealPrice: 7.00,
            savings: 2.00,
            items: [
              { name: 'Chocolate Cookie', originalPrice: 3.00 },
              { name: 'Brownie', originalPrice: 3.00 },
              { name: 'Chocolate Cookie', originalPrice: 3.00 }
            ]
          },
          {
            _id: '6',
            title: 'Coffee & Cookies',
            description: 'One coffee with two cookies of your choice!',
            dealPrice: 8.00,
            savings: 2.00,
            items: [
              { name: 'Classic Coffee', originalPrice: 4.00 },
              { name: 'Chocolate Cookie', originalPrice: 3.00 },
              { name: 'Brownie', originalPrice: 3.00 }
            ]
          }
        ]);
      }
    };
    
    fetchDeals();
  }, []);
  
  const getProductImage = (productName) => {
    const productImages = {
      'Classic Coffee': '/images/cup.png',
      'Espresso': '/images/cup.png',
      'Cappuccino': '/images/cup.png',
      'Latte': '/images/cup.png',
      'Iced Coffee': '/images/cup.png',
      'Cold Brew': '/images/cup.png',
      'Chocolate Cookie': '/images/Capture2-removebg-preview.png',
      'Brownie': '/images/12-2-cookie-png-pic-removebg-preview.png',
      'Croissant': '/images/png-clipart-chocolate-chip-cookie-peanut-butter-cookie-chocolate-brownie-coffee-biscuits-coffee-removebg-preview.png'
    };
    
    return productImages[productName] || '/images/cup.png';
  };
  
  // Group deals into rows of 3
  const groupDealsIntoRows = (dealsArray) => {
    const rows = [];
    for (let i = 0; i < dealsArray.length; i += 3) {
      rows.push(dealsArray.slice(i, i + 3));
    }
    return rows;
  };
  
  const dealRows = groupDealsIntoRows(deals);
  
  const handleOrderNow = (deal) => {
    // If not authenticated, redirect to sign in
    if (!isAuthenticated) {
      navigate('/signin', { 
        state: { from: '/', message: 'Please sign in to add items to your cart' } 
      });
      return;
    }
    
    addDealToCart(deal);
    
    // Show "Added" feedback for this specific deal
    setAddedToCart({...addedToCart, [deal._id]: true});
    
    // Reset the "Added" state after 2 seconds
    setTimeout(() => {
      setAddedToCart({...addedToCart, [deal._id]: false});
    }, 2000);
  };
  
  return (
    <div className="home-container">
      {/* Top Brown Background Section with Hero */}
      <div className="hero-bg">
        <div className="background-text">
          <span className="mug-text">MUG</span>
          <span className="cup-wrapper">
            <img src="/images/cup.png" alt="Coffee Cup" className="coffee-cup-img" />
            <span className="logo-overlay">
              <svg viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90" className="paw-logo-img">
                <circle cx="31" cy="31" r="30" fill="#7a5732" />
                <path fillRule="evenodd" clipRule="evenodd" d="M31 5C16.6406 5 5 16.6406 5 31C5 45.3594 16.6406 57 31 57C45.3594 57 57 45.3594 57 31C57 16.6406 45.3594 5 31 5ZM31 3C15.536 3 3 15.536 3 31C3 46.464 15.536 59 31 59C46.464 59 59 46.464 59 31C59 15.536 46.464 3 31 3Z" fill="#7a5732" />
                <path fillRule="evenodd" clipRule="evenodd" d="M34.5715 10.4285C34.5715 10.4285 35.4285 10.4285 35.4285 11.2855C35.4285 12.1425 34.5715 18.7139 34.5715 18.7139C34.5715 18.7139 34.5715 19.5709 33.7145 19.5709C32.8575 19.5709 31.1435 19.5709 31.1435 19.5709C31.1435 19.5709 29.4295 19.5709 28.5725 19.5709C27.7155 19.5709 27.7155 18.7139 27.7155 18.7139C27.7155 18.7139 26.8585 12.1425 26.8585 11.2855C26.8585 10.4285 27.7155 10.4285 27.7155 10.4285H34.5715ZM43.9994 25.4282C43.9994 25.4282 44.8564 24.5712 44.8564 23.7142C44.8564 22.8572 43.1424 17.8569 43.1424 17.8569C43.1424 17.8569 42.2854 16.9999 41.4284 17.8569C40.5714 18.7139 39.7144 19.5709 39.7144 19.5709C39.7144 19.5709 38.0004 21.2849 37.1434 22.1419C36.2864 22.9989 37.1434 23.8559 37.1434 23.8559L41.4284 25.4282C42.2854 25.5699 43.9994 25.4282 43.9994 25.4282ZM18.0006 25.4282C18.0006 25.4282 17.1436 24.5712 17.1436 23.7142C17.1436 22.8572 18.8576 17.8569 18.8576 17.8569C18.8576 17.8569 19.7146 16.9999 20.5716 17.8569C21.4286 18.7139 22.2856 19.5709 22.2856 19.5709C22.2856 19.5709 23.9996 21.2849 24.8566 22.1419C25.7136 22.9989 24.8566 23.8559 24.8566 23.8559L20.5716 25.4282C19.7146 25.5699 18.0006 25.4282 18.0006 25.4282ZM31.1435 49.7143C24.7149 49.7143 19.2861 44.2855 19.2861 37.8569C19.2861 32.7149 22.8575 28.2861 27.8575 26.8571C27.8575 26.8571 29.5715 26.2861 31.1435 26.2861C32.7155 26.2861 34.4295 26.8571 34.4295 26.8571C39.4295 28.2861 43.0009 32.7149 43.0009 37.8569C43.0009 44.2855 37.5721 49.7143 31.1435 49.7143Z" fill="#FFFFFF" />
              </svg>
            </span>
            <span className="smoke-container">
              <span className="smoke-1"></span>
              <span className="smoke-2"></span>
              <span className="smoke-3"></span>
              <span className="smoke-4"></span>
            </span>
          </span>
          <span className="moment-text">MOMENT</span>
        </div>
      </div>

      {/* Cart Icon with Count */}
      <div className="cart-icon-container">
        <Link to="/payment" className="cart-icon-link">
          <FaShoppingCart className="cart-icon" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>

      {/* Main Content Below the Brown Section */}
      <main>
        <div className="main-content">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading deals...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : (
            <div className="order-sections-container">
              {dealRows.map((row, rowIndex) => (
                <div key={`row-${rowIndex}`} className="order-row">
                  {row.map((deal) => (
                    <div key={deal._id} className="order-section">
                      <h2 className="order-title">{deal.title}</h2>
                      <div className="order-content">
                        <div className={`product-items ${deal.items.length > 2 ? 'cookie-party' : ''}`}>
                          {deal.items.length <= 2 ? (
                            // Regular display for 1-2 items
                            deal.items.map((item, idx) => (
                              <div key={`${deal._id}-item-${idx}`} className="product-item">
                                <img 
                                  src={getProductImage(item.name)} 
                                  alt={item.name} 
                                  className={`product-img ${item.name.includes('Cookie') || item.name.includes('Brownie') ? 'food-img' : ''}`} 
                                />
                                <span className="original-price">${item.originalPrice.toFixed(2)}</span>
                              </div>
                            ))
                          ) : (
                            // Special display for 3-4 items
                            <>
                              <div className="cookie-row">
                                {deal.items.slice(0, 2).map((item, idx) => (
                                  <div key={`${deal._id}-item-${idx}`} className="product-item">
                                    <img 
                                      src={getProductImage(item.name)} 
                                      alt={item.name} 
                                      className={`product-img ${item.name.includes('Cookie') || item.name.includes('Brownie') ? 'food-img' : ''}`} 
                                    />
                                    <span className="original-price">${item.originalPrice.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                              {deal.items.length > 2 && (
                                <div className="cookie-row">
                                  {deal.items.slice(2, 4).map((item, idx) => (
                                    <div key={`${deal._id}-item-${idx+2}`} className="product-item">
                                      <img 
                                        src={getProductImage(item.name)} 
                                        alt={item.name} 
                                        className={`product-img ${item.name.includes('Cookie') || item.name.includes('Brownie') ? 'food-img' : ''}`} 
                                      />
                                      <span className="original-price">${item.originalPrice.toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        <div className="deal-price">
                          <span className="deal-label">Deal Price:</span>
                          <span className="price-tag">${deal.dealPrice.toFixed(2)}</span>
                          <span className="savings">Save ${deal.savings.toFixed(2)}</span>
                        </div>
                        <p className="order-description">{deal.description}</p>
                        <button 
                          onClick={() => handleOrderNow(deal)} 
                          className={`order-btn ${addedToCart[deal._id] ? 'added' : ''}`}
                        >
                          {addedToCart[deal._id] ? 'Added to Cart!' : 'Order Now'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          
          {/* Promo Section */}
          <div className="promo-section">
            <div className="promo-container">
              <div className="promo-image">
                <div className="cup-wrapper promo-cup">
                  <img src="/images/cup.png" alt="Coffee Cup" className="promo-cup-img" />
                  <div className="logo-overlay promo-logo">
                    <svg className="starbucks-cup-logo" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="31" cy="31" r="30" fill="#74512D" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M31 5C16.6406 5 5 16.6406 5 31C5 45.3594 16.6406 57 31 57C45.3594 57 57 45.3594 57 31C57 16.6406 45.3594 5 31 5ZM31 3C15.536 3 3 15.536 3 31C3 46.464 15.536 59 31 59C46.464 59 59 46.464 59 31C59 15.536 46.464 3 31 3Z" fill="#74512D" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M34.5715 10.4285C34.5715 10.4285 35.4285 10.4285 35.4285 11.2855C35.4285 12.1425 34.5715 18.7139 34.5715 18.7139C34.5715 18.7139 34.5715 19.5709 33.7145 19.5709C32.8575 19.5709 31.1435 19.5709 31.1435 19.5709C31.1435 19.5709 29.4295 19.5709 28.5725 19.5709C27.7155 19.5709 27.7155 18.7139 27.7155 18.7139C27.7155 18.7139 26.8585 12.1425 26.8585 11.2855C26.8585 10.4285 27.7155 10.4285 27.7155 10.4285H34.5715ZM43.9994 25.4282C43.9994 25.4282 44.8564 24.5712 44.8564 23.7142C44.8564 22.8572 43.1424 17.8569 43.1424 17.8569C43.1424 17.8569 42.2854 16.9999 41.4284 17.8569C40.5714 18.7139 39.7144 19.5709 39.7144 19.5709C39.7144 19.5709 38.0004 21.2849 37.1434 22.1419C36.2864 22.9989 37.1434 23.8559 37.1434 23.8559L41.4284 25.4282C42.2854 25.5699 43.9994 25.4282 43.9994 25.4282ZM18.0006 25.4282C18.0006 25.4282 17.1436 24.5712 17.1436 23.7142C17.1436 22.8572 18.8576 17.8569 18.8576 17.8569C18.8576 17.8569 19.7146 16.9999 20.5716 17.8569C21.4286 18.7139 22.2856 19.5709 22.2856 19.5709C22.2856 19.5709 23.9996 21.2849 24.8566 22.1419C25.7136 22.9989 24.8566 23.8559 24.8566 23.8559L20.5716 25.4282C19.7146 25.5699 18.0006 25.4282 18.0006 25.4282ZM31.1435 49.7143C24.7149 49.7143 19.2861 44.2855 19.2861 37.8569C19.2861 32.7149 22.8575 28.2861 27.8575 26.8571C27.8575 26.8571 29.5715 26.2861 31.1435 26.2861C32.7155 26.2861 34.4295 26.8571 34.4295 26.8571C39.4295 28.2861 43.0009 32.7149 43.0009 37.8569C43.0009 44.2855 37.5721 49.7143 31.1435 49.7143Z" fill="#FFFFFF" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="promo-content">
                <h2 className="promo-title">A Special Monday Treat</h2>
                <p className="promo-text">Join M&M Rewards members and get a free tall hot or iced coffee every Monday. Start your week with the perfect cup!</p>
                <Link to="/signup" className="promo-btn">Join now</Link>
              </div>
            </div>
          </div>
          <div className="spacer"></div>
        </div>
      </main>

      {/* Footer Section */}
      <footer>
        <div className="footer-content">
          <div className="footer-sections-container">
            <section className="footer-section">
              <h1>About Us</h1>
              <p>Welcome to MUG & MOMENT, where every sip tells a story. Born from a passion for rich flavors and meaningful moments, our café is more than just a coffee shop—it's a place to gather, unwind, and savor the simple joys of life.</p>
              <p>We believe in quality, craftsmanship, and community.</p>
            </section>
            <section className="contact-section">
              <h1>Contact</h1>
              <p className="intro">Get in touch with us to start your next project:</p>
              <div className="contact-info">
                <p>Email: info@mugandmoment.com</p>
                <p>Phone: +44 123 456 7890</p>
                <p>Address: 123 Coffee Street, London, UK</p>
              </div>
            </section>
          </div>
          <div className="social-icons">
            <a href="#" className="social-icon"><FaFacebookF /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaGithub /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 