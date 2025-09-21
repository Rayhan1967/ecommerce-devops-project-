const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder
} = require('../controllers/orderController');
const { validateCreateOrder } = require('../middleware/validation');

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Order service is healthy' });
});

// CRUD endpoints
router.post('/', validateCreateOrder, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.put('/:id', updateOrder);

module.exports = router;
