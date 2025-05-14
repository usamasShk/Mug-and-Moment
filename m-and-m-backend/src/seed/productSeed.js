const mongoose = require('mongoose');
const Product = require('../models/Product');

// MongoDB Connection - Updated connection string
mongoose.connect('mongodb://127.0.0.1:27017/mug-and-moment', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding products'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample products based on the frontend menu data
const dummyProducts = [
  // Hot Beverages
  {
    name: 'Classic Coffee',
    price: 3.50,
    category: 'Hot Beverages',
    ingredients: 'Premium Arabica beans, filtered water',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Espresso',
    price: 2.80,
    category: 'Hot Beverages',
    ingredients: 'Double shot of espresso',
    image: 'https://images.unsplash.com/photo-1596952992251-24b2307bad66?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Cappuccino',
    price: 4.20,
    category: 'Hot Beverages',
    ingredients: 'Espresso, steamed milk, foam',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/302902/pexels-photo-302902.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Latte',
    price: 4.50,
    category: 'Hot Beverages',
    ingredients: 'Espresso, steamed milk, light foam',
    image: 'https://images.unsplash.com/photo-1582202736282-a068fbd0eed2?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/350478/pexels-photo-350478.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Mocha',
    price: 4.80,
    category: 'Hot Beverages',
    ingredients: 'Espresso, chocolate, steamed milk',
    image: 'https://images.unsplash.com/photo-1579888071069-c107a6f79d82?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/213780/pexels-photo-213780.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  
  // Cold Beverages
  {
    name: 'Iced Coffee',
    price: 4.00,
    category: 'Cold Beverages',
    ingredients: 'Cold brew coffee, ice, choice of milk',
    image: 'https://images.unsplash.com/photo-1529088148546-645efc92db32?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/2074122/pexels-photo-2074122.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Cold Brew',
    price: 4.50,
    category: 'Cold Beverages',
    ingredients: 'Slow-steeped cold brew, ice',
    image: 'https://images.unsplash.com/photo-1606791405792-b1cce8ce19a6?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/6802983/pexels-photo-6802983.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Iced Latte',
    price: 4.80,
    category: 'Cold Beverages',
    ingredients: 'Espresso, cold milk, ice',
    image: 'https://images.unsplash.com/photo-1620360289812-b1cce8ce19a6?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/2074122/pexels-photo-2074122.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  
  // Snacks & Pastries
  {
    name: 'Chocolate Cookie',
    price: 2.00,
    category: 'Snacks & Pastries',
    ingredients: 'Dark chocolate, butter, flour',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/890577/pexels-photo-890577.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Croissant',
    price: 3.20,
    category: 'Snacks & Pastries',
    ingredients: 'Butter, flour, yeast',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Brownie',
    price: 3.00,
    category: 'Snacks & Pastries',
    ingredients: 'Dark chocolate, walnuts',
    image: 'https://images.unsplash.com/photo-1515037893149-de7f840978e2?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/45202/brownie-dessert-cake-sweet-45202.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  
  // Breakfast Items
  {
    name: 'Avocado Toast',
    price: 6.50,
    category: 'Breakfast Items',
    ingredients: 'Sourdough, avocado, cherry tomatoes',
    image: 'https://images.unsplash.com/photo-1588137378164-543922f9f9e7?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/1351238/pexels-photo-1351238.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Breakfast Sandwich',
    price: 7.50,
    category: 'Breakfast Items',
    ingredients: 'Egg, cheese, bacon, English muffin',
    image: 'https://images.unsplash.com/photo-1639744091981-2460aeb23f32?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/139746/pexels-photo-139746.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    name: 'Yogurt Parfait',
    price: 5.80,
    category: 'Breakfast Items',
    ingredients: 'Greek yogurt, granola, mixed berries',
    image: 'https://images.unsplash.com/photo-1574179226364-0e640b8c7819?w=600&h=600&fit=crop&q=80',
    backupImage: 'https://images.pexels.com/photos/128865/pexels-photo-128865.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

// Seed function
const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    console.log('Deleted existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(dummyProducts);
    console.log(`${insertedProducts.length} products inserted successfully`);

    // Display product info
    console.log('\nProduct Categories:');
    const categories = [...new Set(insertedProducts.map(product => product.category))];
    categories.forEach(category => {
      const count = insertedProducts.filter(product => product.category === category).length;
      console.log(`${category}: ${count} items`);
    });

    // Close connection
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error seeding products:', err);
    mongoose.connection.close();
  }
};

// Run the seed function
seedProducts(); 