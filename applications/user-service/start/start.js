// start.js
require('dotenv').config();
const app = require('./server');

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`🚀 User Service running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received');
  console.log('Closing http server');
  server.close(() => {
    console.log('Http server closed');
    process.exit(0);
  });
});
