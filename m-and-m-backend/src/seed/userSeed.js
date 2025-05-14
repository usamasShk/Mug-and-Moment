const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB Connection - Updated connection string
mongoose.connect('mongodb://127.0.0.1:27017/mug-and-moment', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected for seeding users'))
.catch(err => console.error('MongoDB connection error:', err));

// Sample dummy users
const dummyUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    password: 'password123',
    rewards: {
      stars: 150,
      level: 'Gold'
    }
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '0987654321',
    password: 'password456',
    rewards: {
      stars: 50,
      level: 'Green'
    }
  },
  {
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob@example.com',
    phone: '5551234567',
    password: 'password789',
    rewards: {
      stars: 350,
      level: 'Platinum'
    }
  },
  {
    firstName: 'Alice',
    lastName: 'Williams',
    email: 'alice@example.com',
    phone: '7778889999',
    password: 'password321',
    rewards: {
      stars: 75,
      level: 'Green'
    }
  },
  {
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie@example.com',
    phone: '3334445555',
    password: 'password654',
    rewards: {
      stars: 200,
      level: 'Gold'
    }
  }
];

// Seed function
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Deleted existing users');

    // Insert new users
    const insertedUsers = await User.insertMany(dummyUsers);
    console.log(`${insertedUsers.length} users inserted successfully`);

    // Display user emails and passwords for testing
    console.log('\nTest User Credentials:');
    insertedUsers.forEach(user => {
      console.log(`Email: ${user.email}, Password: password123 (or as defined in the seed)`);
    });

    // Close connection
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error seeding users:', err);
    mongoose.connection.close();
  }
};

// Run the seed function
seedUsers(); 