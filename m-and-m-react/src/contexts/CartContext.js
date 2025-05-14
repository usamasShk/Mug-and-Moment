import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
export const CartContext = createContext();

// Create Provider
export const CartProvider = ({ children }) => {
  // Get cart from localStorage if available or start with empty array
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('m&m_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Total items in cart
  const [cartCount, setCartCount] = useState(0);
  
  // Total price
  const [cartTotal, setCartTotal] = useState(0);
  
  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('m&m_cart', JSON.stringify(cart));
    
    // Calculate cart count
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(itemCount);
    
    // Calculate cart total
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    setCartTotal(total);
  }, [cart]);
  
  // Add a product to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      
      if (existingItemIndex !== -1) {
        // If exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        // If new item, add to cart
        return [...prevCart, { ...product, quantity }];
      }
    });
  };
  
  // Add a deal to cart (multiple products as a bundle)
  const addDealToCart = (deal) => {
    // Add deal as a single bundled item
    const dealProduct = {
      id: `deal-${deal._id}`,
      name: deal.title,
      description: deal.description,
      price: deal.dealPrice,
      quantity: 1,
      isDeal: true,
      dealItems: deal.items.map(item => ({
        name: item.name,
        originalPrice: item.originalPrice
      }))
    };
    
    setCart(prevCart => {
      // Check if deal already exists in cart
      const existingDealIndex = prevCart.findIndex(item => item.id === dealProduct.id);
      
      if (existingDealIndex !== -1) {
        // If exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingDealIndex].quantity += 1;
        return updatedCart;
      } else {
        // If new deal, add to cart
        return [...prevCart, dealProduct];
      }
    });
  };
  
  // Remove an item from cart
  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };
  
  // Update quantity of an item
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCart([]);
  };
  
  return (
    <CartContext.Provider value={{ 
      cart, 
      cartCount, 
      cartTotal, 
      addToCart, 
      addDealToCart,
      removeFromCart, 
      updateQuantity, 
      clearCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 