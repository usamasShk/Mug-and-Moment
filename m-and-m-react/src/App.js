import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import Menu from './components/Menu';
import Contact from './components/Contact';
import Rewards from './components/Rewards';
import Payment from './components/Payment';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RewardsProvider } from './contexts/RewardsContext';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to signin page but save the location they were trying to access
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

// Create a wrapper component to access location
const AppContent = () => {
  const location = useLocation();
  const hideNavbarPaths = ['/menu', '/rewards', '/payment', '/signin', '/signup', '/forgot-password', '/reset-password/:token']; // Hide navbar on menu, rewards, payment, and authentication pages

  // Helper function to check if current path matches any patterns in hideNavbarPaths
  const shouldHideNavbar = () => {
    const currentPath = location.pathname;
    return hideNavbarPaths.some(path => {
      // Handle paths with parameters (like '/reset-password/:token')
      if (path.includes(':')) {
        const pathPattern = path.split(':')[0];
        return currentPath.startsWith(pathPattern);
      }
      return path === currentPath;
    });
  };

  return (
    <div className="App">
      {!shouldHideNavbar() && <Navigation />}
      <Routes>
        {/* Public routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/contact" element={<Contact />} />
        
        {/* Protected routes */}
        <Route 
          path="/payment" 
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } 
        />
        <Route path="/rewards" element={<Rewards />} />
        
        {/* Default route - public for now */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <RewardsProvider>
            <AppContent />
          </RewardsProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
