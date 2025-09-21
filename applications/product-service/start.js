// start.js
require('dotenv').config();
const app = require('./server');
const PORT = process.env.PORT || 3002;
const server = app.listen(PORT, () => {
  console.log(`🚀 Product Service running on port ${PORT}`);
});
process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
