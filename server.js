require('dotenv').config();

const app = require('./app');
const connectDatabase = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () => {
      console.log('');
      console.log('╔═══════════════════════════════════════════════════════╗');
      console.log('║                                                       ║');
      console.log('║             🌐  CircleSphere Server                   ║');
      console.log('║         Connect. Share. Belong.                       ║');
      console.log('║                                                       ║');
      console.log('╚═══════════════════════════════════════════════════════╝');
      console.log('');
      console.log(`✓ Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`✓ Server listening on port ${PORT}`);
      console.log(`✓ Server URL: http://localhost:${PORT}`);
      console.log('');
      console.log('Press CTRL+C to stop the server');
      console.log('');
    });

    process.on('unhandledRejection', (err) => {
      console.error(`✗ Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

  } catch (error) {
    console.error(`✗ Server startup error: ${error.message}`);
    process.exit(1);
  }
};

startServer();
