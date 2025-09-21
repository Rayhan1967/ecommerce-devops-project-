require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

console.log('=== API Gateway Starting ===');
console.log('Express version:', require('express/package.json').version);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  console.log('Health endpoint called');
  res.json({ 
    success: true, 
    timestamp: new Date().toISOString(),
    services: {
      users: process.env.USER_SERVICE_URL,
      products: process.env.PRODUCT_SERVICE_URL,
      orders: process.env.ORDER_SERVICE_URL
    }
  });
});

// PROXY ke User Service
app.use('/api/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' },
  logLevel: 'debug'
}));

// PROXY ke Product Service
app.use('/api/products', createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/products': '' },
  logLevel: 'debug'
}));

// PROXY ke Order Service  
app.use('/api/orders', createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '' },
  logLevel: 'debug'
}));

app.use((req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).json({ success: false, message: 'Route not found', path: req.path });
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 API Gateway running on 0.0.0.0:${port}`);
  console.log(`Environment: USER_SERVICE_URL = ${process.env.USER_SERVICE_URL}`);
});
