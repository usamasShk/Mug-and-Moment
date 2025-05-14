import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PageNavigation from './PageNavigation';
import { useCart } from '../contexts/CartContext';
import { FaShoppingCart } from 'react-icons/fa';
import './Menu.css';

// Placeholder image - more reliable source
const placeholderImage = 'https://placehold.co/300x300/f9f6f2/74512D?text=Coffee+%26+Food';

// Backup images in case primary sources fail
const backupImages = {
  coffee: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600',
  espresso: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
  cappuccino: 'https://images.pexels.com/photos/302902/pexels-photo-302902.jpeg?auto=compress&cs=tinysrgb&w=600',
  latte: 'https://images.pexels.com/photos/350478/pexels-photo-350478.jpeg?auto=compress&cs=tinysrgb&w=600',
  mocha: 'https://images.pexels.com/photos/213780/pexels-photo-213780.jpeg?auto=compress&cs=tinysrgb&w=600',
  caramel: 'https://images.pexels.com/photos/1193335/pexels-photo-1193335.jpeg?auto=compress&cs=tinysrgb&w=600',
  iced: 'https://images.pexels.com/photos/2074122/pexels-photo-2074122.jpeg?auto=compress&cs=tinysrgb&w=600',
  coldBrew: 'https://images.pexels.com/photos/2608943/pexels-photo-2608943.jpeg?auto=compress&cs=tinysrgb&w=600',
  frappuccino: 'https://images.pexels.com/photos/5590241/pexels-photo-5590241.jpeg?auto=compress&cs=tinysrgb&w=600',
  tea: 'https://images.pexels.com/photos/230477/pexels-photo-230477.jpeg?auto=compress&cs=tinysrgb&w=600',
  lemonade: 'https://images.pexels.com/photos/96974/pexels-photo-96974.jpeg?auto=compress&cs=tinysrgb&w=600',
  cookie: 'https://images.pexels.com/photos/890577/pexels-photo-890577.jpeg?auto=compress&cs=tinysrgb&w=600',
  muffin: 'https://images.pexels.com/photos/1277202/pexels-photo-1277202.jpeg?auto=compress&cs=tinysrgb&w=600',
  croissant: 'https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=600',
  pastry: 'https://images.pexels.com/photos/267308/pexels-photo-267308.jpeg?auto=compress&cs=tinysrgb&w=600',
  danish: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=600',
  cheese: 'https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=600',
  bagel: 'https://images.pexels.com/photos/5419036/pexels-photo-5419036.jpeg?auto=compress&cs=tinysrgb&w=600',
  brownie: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=600',
  avocado: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=600',
  breakfast: 'https://images.pexels.com/photos/139746/pexels-photo-139746.jpeg?auto=compress&cs=tinysrgb&w=600',
  oats: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=600',
  yogurt: 'https://images.pexels.com/photos/128865/pexels-photo-128865.jpeg?auto=compress&cs=tinysrgb&w=600'
};

const menuData = [
  {
    category: 'Hot Beverages',
    items: [
      {
        id: 1,
        name: 'Classic Coffee',
        price: 3.50,
        ingredients: 'Premium Arabica beans, filtered water',
        image: '/images/hot-coffee.png',
        backupImage: backupImages.coffee
      },
      {
        id: 2,
        name: 'Espresso',
        price: 2.80,
        ingredients: 'Double shot of espresso',
        image: '/images/espresso.png',
        backupImage: backupImages.espresso
      },
      {
        id: 3,
        name: 'Cappuccino',
        price: 4.20,
        ingredients: 'Espresso, steamed milk, foam',
        image: '/images/cappuccino.png',
        backupImage: backupImages.cappuccino
      },
      {
        id: 4,
        name: 'Latte',
        price: 4.50,
        ingredients: 'Espresso, steamed milk, light foam',
        image: '/images/latte.png',
        backupImage: backupImages.latte
      },
      {
        id: 5,
        name: 'Mocha',
        price: 4.80,
        ingredients: 'Espresso, chocolate, steamed milk',
        image: '/images/mocha.png',
        backupImage: backupImages.mocha
      },
      {
        id: 6,
        name: 'Caramel Macchiato',
        price: 4.90,
        ingredients: 'Espresso, vanilla, caramel, steamed milk',
        image: '/images/caramel-macchiato.png',
        backupImage: backupImages.caramel
      }
    ],
  },
  {
    category: 'Cold Beverages',
    items: [
      {
        id: 7,
        name: 'Iced Coffee',
        price: 4.00,
        ingredients: 'Cold brew coffee, ice, choice of milk',
        image: '/images/iced-coffee.png',
        backupImage: backupImages.iced
      },
      {
        id: 8,
        name: 'Cold Brew',
        price: 4.50,
        ingredients: 'Slow-steeped cold brew, ice',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=600&fit=crop&q=80',
        backupImage: backupImages.coldBrew
      },
      {
        id: 9,
        name: 'Iced Latte',
        price: 4.80,
        ingredients: 'Espresso, cold milk, ice',
        image: '/images/iced-latte.png',
        backupImage: backupImages.iced
      },
      {
        id: 10,
        name: 'Frappuccino',
        price: 5.50,
        ingredients: 'Coffee, milk, ice, whipped cream',
        image: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=600&h=600&fit=crop&q=80',
        backupImage: backupImages.frappuccino
      },
      {
        id: 11,
        name: 'Iced Tea',
        price: 3.80,
        ingredients: 'Premium black tea, ice, lemon',
        image: '/images/iced-tea.png',
        backupImage: backupImages.tea
      },
      {
        id: 12,
        name: 'Lemonade',
        price: 4.20,
        ingredients: 'Fresh lemon juice, water, mint',
        image: '/images/lemonade.png',
        backupImage: backupImages.lemonade
      }
    ],
  },
  {
    category: 'Snacks & Pastries',
    items: [
      {
        id: 13,
        name: 'Chocolate Cookie',
        price: 2.00,
        ingredients: 'Dark chocolate, butter, flour',
        image: '/images/chocolate-cookie.png',
        backupImage: backupImages.cookie
      },
      {
        id: 14,
        name: 'Vegan Muffin',
        price: 2.50,
        ingredients: 'Oats, banana, almond milk',
        image: '/images/vegan-muffin.png',
        backupImage: backupImages.muffin
      },
      {
        id: 15,
        name: 'Croissant',
        price: 3.20,
        ingredients: 'Butter, flour, yeast',
        image: '/images/croissant.png',
        backupImage: backupImages.croissant
      },
      {
        id: 16,
        name: 'Cheese Danish',
        price: 3.50,
        ingredients: 'Cream cheese, puff pastry',
        image: '/images/cheese-danish.png',
        backupImage: backupImages.danish
      },
      {
        id: 17,
        name: 'Bagel',
        price: 2.80,
        ingredients: 'Choice of plain, sesame, or everything',
        image: '/images/bagel.png',
        backupImage: backupImages.bagel
      },
      {
        id: 18,
        name: 'Brownie',
        price: 3.00,
        ingredients: 'Dark chocolate, walnuts',
        image: '/images/brownie.png',
        backupImage: backupImages.brownie
      }
    ],
  },
  {
    category: 'Breakfast Items',
    items: [
      {
        id: 19,
        name: 'Avocado Toast',
        price: 6.50,
        ingredients: 'Sourdough, avocado, cherry tomatoes',
        image: '/images/avocado-toast.png',
        backupImage: backupImages.avocado
      },
      {
        id: 20,
        name: 'Breakfast Sandwich',
        price: 7.50,
        ingredients: 'Egg, cheese, bacon, English muffin',
        image: '/images/breakfast-sandwich.png',
        backupImage: backupImages.breakfast
      },
      {
        id: 21,
        name: 'Overnight Oats',
        price: 5.50,
        ingredients: 'Oats, almond milk, berries, honey',
        image: '/images/overnight-oats.png',
        backupImage: backupImages.oats
      },
      {
        id: 22,
        name: 'Yogurt Parfait',
        price: 5.80,
        ingredients: 'Greek yogurt, granola, mixed berries',
        image: '/images/yogurt-parfait.png',
        backupImage: backupImages.yogurt
      }
    ],
  }
];

const Menu = () => {
  // Use cart context 
  const { addToCart, cartCount } = useCart();
  const [addedItems, setAddedItems] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [popularItems, setPopularItems] = useState([13, 3, 7, 15, 19, 8]); // IDs of popular items

  // Function to handle image load errors
  const handleImageError = (e, itemName) => {
    // For specific cases with known issues
    if (itemName.toLowerCase().includes('cold brew')) {
      e.target.src = backupImages.coldBrew;
      return;
    }
    
    if (itemName.toLowerCase().includes('frappuccino')) {
      e.target.src = backupImages.frappuccino;
      return;
    }
    
    if (itemName.toLowerCase().includes('lemonade')) {
      e.target.src = backupImages.lemonade;
      return;
    }
    
    if (itemName.toLowerCase().includes('cheese danish') || itemName.toLowerCase().includes('danish')) {
      e.target.src = backupImages.danish;
      return;
    }
    
    const backupKey = Object.keys(backupImages).find(key => 
      itemName.toLowerCase().includes(key.toLowerCase())
    );
    
    e.target.src = backupKey ? backupImages[backupKey] : placeholderImage;
  };

  // Function to filter menu items based on category
  const filteredMenu = () => {
    if (selectedCategory === 'All') {
      return menuData;
    }

    const filtered = menuData.map(category => {
      // Skip if category doesn't match (unless 'All' is selected)
      if (category.category !== selectedCategory) {
        return { ...category, items: [] };
      }

      return category;
    });

    // Only return categories that have items
    return filtered.filter(category => category.items.length > 0);
  };

  // Function to handle adding an item to the cart
  const handleAddToCart = (item) => {
    // Prepare the item for cart
    const product = {
      id: `product-${item.id}`,
      name: item.name,
      description: item.ingredients,
      price: item.price,
      image: item.image || item.backupImage || placeholderImage
    };
    
    // Add to cart context
    addToCart(product);
    
    // Show "Added" feedback for this specific item
    setAddedItems({...addedItems, [item.id]: true});
    
    // Reset the "Added" state after 2 seconds
    setTimeout(() => {
      setAddedItems({...addedItems, [item.id]: false});
    }, 2000);
  };

  return (
    <div className="menu-container">
      <PageNavigation />
      
      {/* Cart Icon with Count */}
      <div className="cart-icon-container">
        <Link to="/payment" className="cart-icon-link">
          <FaShoppingCart className="cart-icon" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
      
      <div className="menu-header">
        <h1>Our Menu</h1>
        <p>Fresh ingredients, carefully crafted recipes</p>
        
        {/* Category Tabs */}
        <div className="category-tabs">
          <button 
            className={`category-tab ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </button>
          {menuData.map((category, index) => (
            <button
              key={`category-${index}`}
              className={`category-tab ${selectedCategory === category.category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.category)}
            >
              {category.category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Menu Content */}
      <div className="menu-content">
        {/* Popular Items (only show when 'All' category is selected) */}
        {selectedCategory === 'All' && (
          <div className="popular-section">
            <h2>Most Popular</h2>
            <div className="popular-items">
              {popularItems.map(id => {
                const item = menuData.flatMap(cat => cat.items).find(item => item.id === id);
                if (!item) return null;
                
                return (
                  <div key={`popular-${item.id}`} className="popular-item">
                    <div className="popular-item-image">
                      <img 
                        src={item.image || placeholderImage} 
                        alt={item.name}
                        onError={(e) => handleImageError(e, item.name)}
                      />
                    </div>
                    <div className="popular-item-info">
                      <h3>{item.name}</h3>
                      <p className="popular-item-price">${item.price.toFixed(2)}</p>
                      <button 
                        className={`add-to-cart-btn ${addedItems[item.id] ? 'added' : ''}`}
                        onClick={() => handleAddToCart(item)}
                      >
                        {addedItems[item.id] ? 'Added!' : 'Add to Order'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Main Menu */}
        <div className="menu-categories">
          {filteredMenu().map((category, categoryIndex) => (
            <div key={`category-${categoryIndex}`} className="menu-category">
              <h2>{category.category}</h2>
              <div className="menu-items">
                {category.items.map(item => (
                  <div key={`item-${item.id}`} className="menu-item">
                    <div className="menu-item-image">
                      <img 
                        src={item.image || placeholderImage} 
                        alt={item.name}
                        onError={(e) => handleImageError(e, item.name)}
                      />
                    </div>
                    <div className="menu-item-content">
                      <div className="menu-item-info">
                        <h3>{item.name}</h3>
                        <p className="menu-item-price">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="menu-item-ingredients">{item.ingredients}</p>
                      <button 
                        className={`add-to-cart-btn ${addedItems[item.id] ? 'added' : ''}`}
                        onClick={() => handleAddToCart(item)}
                      >
                        {addedItems[item.id] ? 'Added!' : 'Add to Order'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Allergen Info */}
      <div className="allergen-info">
        <h3>Allergen Information</h3>
        <p>Please inform our staff of any allergies or dietary requirements before ordering. Detailed ingredient information is available upon request.</p>
      </div>
      
      {/* Footer */}
      <div className="menu-footer">
        <button 
          className="view-cart-btn"
          onClick={() => window.location.href = '/payment'}
        >
          View Order <span className="cart-count-btn">{cartCount}</span>
        </button>
      </div>
    </div>
  );
};

export default Menu;