const mongoose = require('mongoose');

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    console.log(`✓ Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('error', (err) => {
  console.error(`✗ MongoDB Error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠ MongoDB Disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('✓ MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = connectDatabase;
