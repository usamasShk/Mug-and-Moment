const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Reward = require('../models/Reward');
const Offer = require('../models/Offer');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mug-and-moment';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected for seeding...');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Initial rewards data
const rewardsData = [
  {
    name: "Free Hot Coffee",
    description: "Enjoy a complimentary hot coffee of any size",
    starsRequired: 50,
    category: "drink",
    image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600",
    isActive: true
  },
  {
    name: "Free Cold Drink",
    description: "Refresh with any cold drink on the house",
    starsRequired: 75,
    category: "drink",
    image: "https://images.pexels.com/photos/2074122/pexels-photo-2074122.jpeg?auto=compress&cs=tinysrgb&w=600",
    isActive: true
  },
  {
    name: "Free Bakery Item",
    description: "Choose any item from our bakery display",
    starsRequired: 100,
    category: "food",
    image: "https://images.pexels.com/photos/890577/pexels-photo-890577.jpeg?auto=compress&cs=tinysrgb&w=600",
    isActive: true
  },
  {
    name: "Free Specialty Drink",
    description: "Try one of our signature specialty drinks",
    starsRequired: 150,
    category: "drink",
    image: "https://images.pexels.com/photos/1193335/pexels-photo-1193335.jpeg?auto=compress&cs=tinysrgb&w=600",
    isActive: true
  },
  {
    name: "50% Off Any Item",
    description: "Get 50% off any food or drink item",
    starsRequired: 125,
    category: "discount",
    image: "https://images.pexels.com/photos/3892469/pexels-photo-3892469.jpeg?auto=compress&cs=tinysrgb&w=600",
    isActive: true
  }
];

// Initial offers data
const offersData = [
  {
    title: "Monday Brew Day",
    description: "Get a free tall hot or iced coffee every Monday with 25 stars",
    image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600",
    startDate: new Date(),
    eligibleLevels: ["Green", "Gold", "Platinum"],
    offerType: "free_item",
    offerValue: "tall coffee",
    isActive: true
  },
  {
    title: "Double Star Days",
    description: "Earn twice the stars on all purchases every Tuesday",
    image: "https://images.pexels.com/photos/585753/pexels-photo-585753.jpeg?auto=compress&cs=tinysrgb&w=600",
    startDate: new Date(),
    eligibleLevels: ["Green", "Gold", "Platinum"],
    offerType: "bonus_stars",
    offerValue: 2, // multiplier
    isActive: true
  },
  {
    title: "Birthday Reward",
    description: "Enjoy any handcrafted drink for free during your birthday month",
    image: "https://images.pexels.com/photos/1793037/pexels-photo-1793037.jpeg?auto=compress&cs=tinysrgb&w=600",
    startDate: new Date(),
    eligibleLevels: ["Green", "Gold", "Platinum"],
    offerType: "free_item",
    offerValue: "any handcrafted drink",
    isActive: true
  },
  {
    title: "Gold Member Happy Hour",
    description: "30% off all drinks every Friday from 2-5pm",
    image: "https://images.pexels.com/photos/1162455/pexels-photo-1162455.jpeg?auto=compress&cs=tinysrgb&w=600",
    startDate: new Date(),
    eligibleLevels: ["Gold", "Platinum"],
    offerType: "discount",
    offerValue: 0.3, // 30% discount
    isActive: true
  },
  {
    title: "Platinum Exclusive: Free Weekly Drink",
    description: "Platinum members get one free drink every week",
    image: "https://images.pexels.com/photos/302894/pexels-photo-302894.jpeg?auto=compress&cs=tinysrgb&w=600",
    startDate: new Date(),
    eligibleLevels: ["Platinum"],
    offerType: "free_item",
    offerValue: "any drink",
    isActive: true
  }
];

// Seed function
const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Reward.deleteMany({});
    await Offer.deleteMany({});
    console.log('Previous reward and offer data cleared');
    
    // Insert new data
    await Reward.insertMany(rewardsData);
    console.log(`${rewardsData.length} rewards inserted`);
    
    await Offer.insertMany(offersData);
    console.log(`${offersData.length} offers inserted`);
    
    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Run the seed function
seedData(); 