// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const sequelize = require('./config/database');

const app = express();
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Initialize database connection
const initDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected');
    await sequelize.sync();
    console.log('DB synced');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};
const client = require('prom-client');
client.collectDefaultMetrics();
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Only initialize DB if not in test environment
if (process.env.NODE_ENV !== 'test') {
  initDB();
}

app.get('/health', (req, res) => res.json({ success: true, message: 'Order service is healthy' }));

app.use('/api/orders', require('./routes/orderRoutes'));

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

app.use((req, res) => res.status(404).json({ success: false, message: 'Not found' }));

module.exports = app;
