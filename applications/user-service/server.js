require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/database');
const client = require('prom-client');

// Inisialisasi Express app terlebih dahulu
const app = express();

// Metrics endpoint setelah app dideklarasi
client.collectDefaultMetrics();
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req, res) => res.json({ status: 'OK' }));
app.use('/api/users', require('./routes/userRoutes'));

// Error handling and 404
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!', error: process.env.NODE_ENV === 'development' ? err.message : {} });
});
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Start server
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`🚀 User Service running on port ${port}`));

module.exports = app;
