const express = require('express');
const router = express.Router();

// Health check untuk products
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK',
    service: 'product-service',
    timestamp: new Date().toISOString() 
  });
});

// Basic CRUD endpoints (minimal untuk testing)
router.get('/', (req, res) => {
  res.json({ message: 'Get all products', products: [] });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create product', product: req.body });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get product ${req.params.id}` });
});

module.exports = router;
