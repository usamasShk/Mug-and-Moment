const mongoose = require('mongoose');
const Deal = require('../models/Deal');
const Product = require('../models/Product');

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/mug-and-moment', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding deals'))
.catch(err => console.error('MongoDB connection error:', err));

// Function to seed deals
const seedDeals = async () => {
  try {
    // First get all products to reference them in deals
    const products = await Product.find();
    
    // Find products by name
    const findProductByName = (name) => {
      const product = products.find(p => p.name.toLowerCase() === name.toLowerCase());
      return product ? product : null;
    };
    
    // Function to create deal items
    const createDealItems = (productNames) => {
      return productNames.map(name => {
        const product = findProductByName(name);
        if (!product) {
          console.warn(`Warning: Product "${name}" not found`);
          return null;
        }
        return {
          productId: product._id,
          name: product.name,
          originalPrice: product.price
        };
      }).filter(item => item !== null);
    };
    
    // Clear existing deals
    await Deal.deleteMany({});
    console.log('Deleted existing deals');
    
    // Create deals based on products
    const perfectPairItems = createDealItems(['Classic Coffee', 'Chocolate Cookie']);
    const doubleCookieItems = createDealItems(['Chocolate Cookie', 'Brownie']);
    const coffeeLoversItems = createDealItems(['Classic Coffee', 'Classic Coffee']);
    const cookiePartyItems = createDealItems(['Chocolate Cookie', 'Brownie', 'Chocolate Cookie', 'Brownie']);
    const tripleCookieItems = createDealItems(['Chocolate Cookie', 'Brownie', 'Chocolate Cookie']);
    const coffeeCookiesItems = createDealItems(['Classic Coffee', 'Chocolate Cookie', 'Brownie']);
    
    // Skip creation if products couldn't be found
    if (perfectPairItems.length === 0 || doubleCookieItems.length === 0 || 
        coffeeLoversItems.length === 0 || cookiePartyItems.length === 0 || 
        tripleCookieItems.length === 0 || coffeeCookiesItems.length === 0) {
      console.error('Missing products, some deals could not be created');
      return;
    }
    
    // Calculate original prices
    const calcOriginalPrice = (items) => {
      return items.reduce((total, item) => total + item.originalPrice, 0);
    };
    
    // Create deals array
    const deals = [
      {
        title: 'Perfect Pair Deal',
        description: 'The classic combination - one coffee and one cookie at a special bundle price!',
        items: perfectPairItems,
        dealPrice: 6.00,
        savings: calcOriginalPrice(perfectPairItems) - 6.00,
        featured: true,
        image: ''
      },
      {
        title: 'Double Cookie Deal',
        description: 'Twice the sweetness! Get two delicious cookies at a special bundle price.',
        items: doubleCookieItems,
        dealPrice: 5.00,
        savings: calcOriginalPrice(doubleCookieItems) - 5.00,
        featured: true,
        image: ''
      },
      {
        title: 'Coffee Lovers Deal',
        description: 'Double the energy! Perfect for sharing or for your all-day coffee needs.',
        items: coffeeLoversItems,
        dealPrice: 6.00,
        savings: calcOriginalPrice(coffeeLoversItems) - 6.00,
        featured: true,
        image: ''
      },
      {
        title: 'Cookie Party Pack',
        description: 'Perfect for sharing! Get four delicious cookies at a special bundle price.',
        items: cookiePartyItems,
        dealPrice: 10.00,
        savings: calcOriginalPrice(cookiePartyItems) - 10.00,
        featured: false,
        image: ''
      },
      {
        title: 'Triple Cookie Pack',
        description: 'Three delicious cookies of your choice at a special price!',
        items: tripleCookieItems,
        dealPrice: 7.00,
        savings: calcOriginalPrice(tripleCookieItems) - 7.00,
        featured: false,
        image: ''
      },
      {
        title: 'Coffee & Cookies',
        description: 'One coffee with two cookies of your choice!',
        items: coffeeCookiesItems,
        dealPrice: 8.00,
        savings: calcOriginalPrice(coffeeCookiesItems) - 8.00,
        featured: false,
        image: ''
      }
    ];
    
    // Insert deals
    const insertedDeals = await Deal.insertMany(deals);
    console.log(`${insertedDeals.length} deals inserted successfully`);
    
    // Close connection
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error seeding deals:', err);
    mongoose.connection.close();
  }
};

// Run the seed function
seedDeals(); 