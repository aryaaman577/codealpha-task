require('dotenv').config();

// Mock Mongoose with in-memory NeDB driver
const mockMongoose = require('../utils/mongoose-mock');
require('module')._cache[require.resolve('mongoose')] = {
  id: require.resolve('mongoose'),
  filename: require.resolve('mongoose'),
  loaded: true,
  exports: mockMongoose
};

// Set fallback env variables for Vercel if not provided
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = 'circlesphere_super_secret_session_key_2024_change_in_production';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'circlesphere_super_secret_jwt_key_2024_change_in_production';
}
if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = 'mongodb://localhost:27017/circlesphere';
}

const app = require('../app');
const connectDatabase = require('../config/database');
const User = require('../models/User');
const seedData = require('../utils/seedData');

// Connect and auto-seed if empty
let isInitialized = false;
app.use(async (req, res, next) => {
  if (!isInitialized) {
    try {
      await connectDatabase();
      const userCount = await User.countDocuments({});
      if (userCount === 0) {
        console.log('✓ In-memory database is empty. Seeding default data...');
        await seedData();
        console.log('✓ Seeding complete.');
      }
      isInitialized = true;
    } catch (err) {
      console.error('Initialization error:', err);
    }
  }
  next();
});

module.exports = app;
