import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageNavigation from './PageNavigation';
import { useCart } from '../contexts/CartContext';
import './Payment.css';

const Payment = () => {
  // Use cart context instead of local state
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  
  // Payment processing states
  const [paymentStep, setPaymentStep] = useState('summary');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Form states
  const [cardDetails, setCardDetails] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
    saveCard: false
  });
  
  const [jazzCashNumber, setJazzCashNumber] = useState('');
  const [easyPaisaNumber, setEasyPaisaNumber] = useState('');
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    address: ''
  });
  
  // Cart calculations
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax rate
  const deliveryFee = 2.50;
  const total = subtotal + tax + deliveryFee;
  
  // Handle form input changes
  const handleCardInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCardDetails({
      ...cardDetails,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value
    });
  };
  
  // Process payment function
  const processPayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let endpoint = '';
      let paymentData = {
        contactInfo,
        orderItems: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal,
        tax,
        deliveryFee,
        total
      };
      
      // Add payment method specific data
      switch (paymentMethod) {
        case 'card':
          endpoint = '/api/payments/process/card';
          paymentData = { ...paymentData, cardDetails };
          break;
        case 'jazzcash':
          endpoint = '/api/payments/process/jazzcash';
          paymentData = { ...paymentData, jazzCashNumber };
          break;
        case 'easypaisa':
          endpoint = '/api/payments/process/easypaisa';
          paymentData = { ...paymentData, easyPaisaNumber };
          break;
        case 'cash':
          endpoint = '/api/payments/process/cash';
          break;
        default:
          throw new Error('Invalid payment method');
      }
      
      // Call the payment API
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'Payment failed');
      }
      
      // Set order information and complete
      setOrderId(data.orderNumber);
      setOrderComplete(true);
      setLoading(false);
      
    } catch (error) {
      console.error('Payment error:', error);
      // In a real app, you would show an error message to the user
      alert(`Payment failed: ${error.message}`);
      setLoading(false);
    }
  };
  
  // Reset order
  const resetOrder = () => {
    clearCart();
    setPaymentStep('summary');
    setPaymentMethod('card');
    setOrderComplete(false);
    setOrderId('');
  };
  
  // Generate random order status for demo purposes
  const getRandomStatus = () => {
    const statuses = ['Processing', 'Preparing', 'Ready for pickup'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  return (
    <div className="payment-container">
      <PageNavigation />
      
      <div className="payment-header">
        <h1>Checkout</h1>
        <p>Secure payment processing for your order</p>
      </div>
      
      {orderComplete ? (
        <div className="order-confirmation">
          <div className="confirmation-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Your order has been placed successfully.</p>
          
          <div className="order-details">
            <div className="order-info">
              <p><strong>Order ID:</strong> {orderId}</p>
              <p><strong>Status:</strong> {getRandomStatus()}</p>
              <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
            </div>
            
            <h3>Order Summary</h3>
            <div className="confirmation-items">
              {cart.map(item => (
                <div key={item.id} className="confirmation-item">
                  <p className="item-name">{item.name} × {item.quantity}</p>
                  <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="confirmation-subtotal">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="confirmation-tax">
                <p>Tax</p>
                <p>${tax.toFixed(2)}</p>
              </div>
              <div className="confirmation-delivery">
                <p>Delivery Fee</p>
                <p>${deliveryFee.toFixed(2)}</p>
              </div>
              <div className="confirmation-total">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="receipt-actions">
              <button className="print-receipt-btn">
                <i className="fa fa-print"></i> Print Receipt
              </button>
              <button className="email-receipt-btn">
                <i className="fa fa-envelope"></i> Email Receipt
              </button>
            </div>
            
            <div className="refund-policy">
              <h4>Refund & Cancellation Policy</h4>
              <p>For order cancellations, please contact us within 10 minutes of placing your order.</p>
              <p>Refunds will be processed to your original payment method within 3-5 business days.</p>
            </div>
            
            <div className="after-order-actions">
              <Link to="/menu" className="continue-shopping-btn">Continue Shopping</Link>
              <button className="new-order-btn" onClick={resetOrder}>Place New Order</button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="payment-progress">
            <div className={`progress-step ${paymentStep === 'summary' ? 'active' : ''} ${paymentStep === 'payment' || paymentStep === 'confirmation' ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Order Summary</div>
            </div>
            <div className={`progress-step ${paymentStep === 'payment' ? 'active' : ''} ${paymentStep === 'confirmation' ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Payment</div>
            </div>
            <div className={`progress-step ${paymentStep === 'confirmation' ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Confirmation</div>
            </div>
          </div>
        
          <div className="payment-content">
            <div className="payment-main">
              {paymentStep === 'summary' && (
                <div className="order-summary">
                  <h2>Order Summary</h2>
                  
                  {cart.length === 0 ? (
                    <div className="empty-cart">
                      <h3>Your cart is empty</h3>
                      <p>Add items to your cart from our menu to continue.</p>
                      <Link to="/menu" className="browse-menu-btn">Browse Menu</Link>
                    </div>
                  ) : (
                    <div className="cart-items">
                      {cart.map(item => (
                        <div key={item.id} className="cart-item">
                          <div className="item-info">
                            <h3>{item.name}</h3>
                            {item.isDeal && (
                              <div className="deal-items">
                                {item.dealItems.map((dealItem, idx) => (
                                  <span key={idx} className="deal-item-name">{dealItem.name}</span>
                                ))}
                              </div>
                            )}
                            <div className="item-quantity">
                              <button className="quantity-btn" onClick={() => {
                                if (item.quantity > 1) {
                                  updateQuantity(item.id, item.quantity - 1);
                                } else {
                                  removeFromCart(item.id);
                                }
                              }}>-</button>
                              <span>{item.quantity}</span>
                              <button className="quantity-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                            </div>
                          </div>
                          <div className="item-price">
                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                            <button className="remove-item" onClick={() => removeFromCart(item.id)}>
                              <i className="fa fa-trash"></i>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {cart.length > 0 && (
                    <div className="summary-actions">
                      <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
                      <button className="summary-next-btn" onClick={() => setPaymentStep('payment')}>
                        Proceed to Payment
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              {paymentStep === 'payment' && (
                <div className="payment-form">
                  <h2>Payment Method</h2>
                  
                  <div className="payment-methods">
                    <div className={`payment-method ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}>
                      <div className="payment-method-icon">💳</div>
                      <div className="payment-method-name">Card Payment</div>
                    </div>
                    <div className={`payment-method ${paymentMethod === 'jazzcash' ? 'selected' : ''}`} onClick={() => setPaymentMethod('jazzcash')}>
                      <div className="payment-method-icon">📱</div>
                      <div className="payment-method-name">JazzCash</div>
                    </div>
                    <div className={`payment-method ${paymentMethod === 'easypaisa' ? 'selected' : ''}`} onClick={() => setPaymentMethod('easypaisa')}>
                      <div className="payment-method-icon">📱</div>
                      <div className="payment-method-name">EasyPaisa</div>
                    </div>
                    <div className={`payment-method ${paymentMethod === 'cash' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cash')}>
                      <div className="payment-method-icon">💵</div>
                      <div className="payment-method-name">Cash on Delivery</div>
                    </div>
                  </div>
                  
                  <div className="payment-details">
                    {paymentMethod === 'card' && (
                      <form className="card-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="card_name">Name on Card</label>
                            <input 
                              type="text" 
                              id="card_name" 
                              name="name" 
                              value={cardDetails.name} 
                              onChange={handleCardInputChange} 
                              required 
                            />
                          </div>
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="card_number">Card Number</label>
                            <input 
                              type="text" 
                              id="card_number" 
                              name="number" 
                              placeholder="1234 5678 9012 3456"
                              value={cardDetails.number} 
                              onChange={handleCardInputChange} 
                              required 
                            />
                          </div>
                        </div>
                        
                        <div className="form-row two-column">
                          <div className="form-group">
                            <label htmlFor="card_expiry">Expiry Date</label>
                            <input 
                              type="text" 
                              id="card_expiry" 
                              name="expiry"
                              placeholder="MM/YY"
                              value={cardDetails.expiry} 
                              onChange={handleCardInputChange} 
                              required 
                            />
                          </div>
                          
                          <div className="form-group">
                            <label htmlFor="card_cvv">CVV</label>
                            <input 
                              type="text" 
                              id="card_cvv" 
                              name="cvv"
                              placeholder="123"
                              value={cardDetails.cvv} 
                              onChange={handleCardInputChange} 
                              required 
                            />
                          </div>
                        </div>
                        
                        <div className="form-row">
                          <div className="form-group checkbox-group">
                            <input 
                              type="checkbox" 
                              id="save_card" 
                              name="saveCard"
                              checked={cardDetails.saveCard} 
                              onChange={handleCardInputChange} 
                            />
                            <label htmlFor="save_card">Save card for future payments</label>
                          </div>
                        </div>
                      </form>
                    )}
                    
                    {paymentMethod === 'jazzcash' && (
                      <div className="jazzcash-form">
                        <p>Pay with your JazzCash mobile account</p>
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="jazzcash_number">JazzCash Number</label>
                            <input 
                              type="tel" 
                              id="jazzcash_number" 
                              placeholder="03XX-XXXXXXX"
                              value={jazzCashNumber} 
                              onChange={(e) => setJazzCashNumber(e.target.value)} 
                              required 
                            />
                          </div>
                        </div>
                        <p className="payment-info">You'll receive a confirmation code on your phone to complete the payment.</p>
                      </div>
                    )}
                    
                    {paymentMethod === 'easypaisa' && (
                      <div className="easypaisa-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="easypaisa_number">EasyPaisa Mobile Number</label>
                            <input 
                              type="tel" 
                              id="easypaisa_number" 
                              placeholder="03XX-XXXXXXX"
                              value={easyPaisaNumber} 
                              onChange={(e) => setEasyPaisaNumber(e.target.value)} 
                              required 
                            />
                          </div>
                        </div>
                        <p className="payment-info">You'll receive a confirmation code on your phone to complete the payment.</p>
                      </div>
                    )}
                    
                    {paymentMethod === 'cash' && (
                      <div className="cash-form">
                        <p>Please keep the exact amount ready for delivery.</p>
                      </div>
                    )}
                    
                    <h3>Contact Information</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="contact_email">Email</label>
                        <input 
                          type="email" 
                          id="contact_email" 
                          name="email"
                          value={contactInfo.email} 
                          onChange={handleContactInfoChange} 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="contact_phone">Phone Number</label>
                        <input 
                          type="tel" 
                          id="contact_phone" 
                          name="phone"
                          value={contactInfo.phone} 
                          onChange={handleContactInfoChange} 
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="contact_address">Delivery Address</label>
                        <textarea 
                          id="contact_address" 
                          name="address"
                          value={contactInfo.address} 
                          onChange={handleContactInfoChange} 
                          required 
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="payment-actions">
                    <button className="payment-back-btn" onClick={() => setPaymentStep('summary')}>
                      Back to Summary
                    </button>
                    <button 
                      className="payment-submit-btn" 
                      onClick={processPayment}
                      disabled={loading || cart.length === 0}
                    >
                      {loading ? 'Processing...' : 'Confirm Payment'}
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="payment-sidebar">
              <div className="order-totals">
                <h3>Order Total</h3>
                
                <div className="totals-row">
                  <span>Subtotal ({cart.reduce((total, item) => total + item.quantity, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                <div className="totals-row">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="totals-row">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                
                <div className="totals-divider"></div>
                
                <div className="totals-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="sidebar-actions">
                {paymentStep === 'summary' ? (
                  <button 
                    className="continue-btn" 
                    onClick={() => setPaymentStep('payment')}
                    disabled={cart.length === 0}
                  >
                    Continue to Payment
                  </button>
                ) : (
                  <button 
                    className="place-order-btn" 
                    onClick={processPayment}
                    disabled={loading || cart.length === 0}
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Payment; 