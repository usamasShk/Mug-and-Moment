import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './PageNavigation.css';

const PageNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  
  // Different styling for Rewards page
  const isRewardsPage = currentPath === '/rewards';
  const navClass = isRewardsPage 
    ? `page-navigation rewards-nav ${!visible ? 'nav-hidden' : ''}` 
    : `page-navigation ${!visible ? 'nav-hidden' : ''}`;
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      
      // Show navigation when at the top of the page
      if (currentScrollPos === 0) {
        setVisible(true);
      } 
      // Hide navigation when scrolling down
      else if (currentScrollPos > prevScrollPos) {
        setVisible(false);
      }
      
      setPrevScrollPos(currentScrollPos);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);
  
  return (
    <div className={navClass}>
      <div className="page-nav-links">
        <Link 
          to="/" 
          className={`page-nav-link ${currentPath === '/' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link 
          to="/menu" 
          className={`page-nav-link ${currentPath === '/menu' ? 'active' : ''}`}
        >
          Menu
        </Link>
        <Link 
          to="/rewards" 
          className={`page-nav-link ${currentPath === '/rewards' ? 'active' : ''}`}
        >
          Rewards
        </Link>
        <Link 
          to="/payment" 
          className={`page-nav-link ${currentPath === '/payment' ? 'active' : ''}`}
        >
          Payment
        </Link>
      </div>
    </div>
  );
};

export default PageNavigation; 