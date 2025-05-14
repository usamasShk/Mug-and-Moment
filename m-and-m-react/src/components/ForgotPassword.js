import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  
  const API_URL = 'http://localhost:5000/api/auth';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setMessage('');
      
      try {
        console.log('Sending password reset request for:', formData.email);
        const response = await axios.post(`${API_URL}/forgot-password`, { 
          email: formData.email 
        });
        
        console.log('Response:', response.data);
        setSuccess(true);
        setMessage(response.data.message || 'If your email is registered, you will receive a password reset link shortly.');
        
        // Clear the form
        setFormData({
          email: ''
        });
      } catch (error) {
        console.error('Password reset error:', error);
        
        // Set error message based on the response or a default
        const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again later.';
        setSuccess(false);
        setMessage(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <div className="logo">
          <svg className="starbucks-logo" viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="31" cy="31" r="30" fill="#74512D" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M31 5C16.6406 5 5 16.6406 5 31C5 45.3594 16.6406 57 31 57C45.3594 57 57 45.3594 57 31C57 16.6406 45.3594 5 31 5ZM31 3C15.536 3 3 15.536 3 31C3 46.464 15.536 59 31 59C46.464 59 59 46.464 59 31C59 15.536 46.464 3 31 3Z"
              fill="#74512D"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M34.5715 10.4285C34.5715 10.4285 35.4285 10.4285 35.4285 11.2855C35.4285 12.1425 34.5715 18.7139 34.5715 18.7139C34.5715 18.7139 34.5715 19.5709 33.7145 19.5709C32.8575 19.5709 31.1435 19.5709 31.1435 19.5709C31.1435 19.5709 29.4295 19.5709 28.5725 19.5709C27.7155 19.5709 27.7155 18.7139 27.7155 18.7139C27.7155 18.7139 26.8585 12.1425 26.8585 11.2855C26.8585 10.4285 27.7155 10.4285 27.7155 10.4285H34.5715ZM43.9994 25.4282C43.9994 25.4282 44.8564 24.5712 44.8564 23.7142C44.8564 22.8572 43.1424 17.8569 43.1424 17.8569C43.1424 17.8569 42.2854 16.9999 41.4284 17.8569C40.5714 18.7139 39.7144 19.5709 39.7144 19.5709C39.7144 19.5709 38.0004 21.2849 37.1434 22.1419C36.2864 22.9989 37.1434 23.8559 37.1434 23.8559L41.4284 25.4282C42.2854 25.5699 43.9994 25.4282 43.9994 25.4282ZM18.0006 25.4282C18.0006 25.4282 17.1436 24.5712 17.1436 23.7142C17.1436 22.8572 18.8576 17.8569 18.8576 17.8569C18.8576 17.8569 19.7146 16.9999 20.5716 17.8569C21.4286 18.7139 22.2856 19.5709 22.2856 19.5709C22.2856 19.5709 23.9996 21.2849 24.8566 22.1419C25.7136 22.9989 24.8566 23.8559 24.8566 23.8559L20.5716 25.4282C19.7146 25.5699 18.0006 25.4282 18.0006 25.4282ZM31.1435 49.7143C24.7149 49.7143 19.2861 44.2855 19.2861 37.8569C19.2861 32.7149 22.8575 28.2861 27.8575 26.8571C27.8575 26.8571 29.5715 26.2861 31.1435 26.2861C32.7155 26.2861 34.4295 26.8571 34.4295 26.8571C39.4295 28.2861 43.0009 32.7149 43.0009 37.8569C43.0009 44.2855 37.5721 49.7143 31.1435 49.7143Z"
              fill="#FFFFFF"
            />
          </svg>
          <span>M&M</span>
        </div>
        <div className="forgot-password-header">
          <h1>Forgot Password</h1>
          <p>Enter your email address and we'll send you a link to reset your password.</p>
        </div>
        
        {/* Message display area */}
        {message && (
          <div className={`message ${success ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <form className="form-section" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          <button 
            type="submit" 
            className="forgot-password-submit-btn"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <div className="forgot-password-footer">
            <p>Remember your password? <Link to="/signin" className="signin-link">Sign In</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 