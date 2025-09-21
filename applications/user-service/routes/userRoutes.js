// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  healthCheck
} = require('../controllers/userController');
const { isAuthenticated, authorizeAdmin } = require('../middleware/auth');

// Health check
router.get('/health', healthCheck);

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', isAuthenticated, getProfile);
router.put('/profile', isAuthenticated, updateProfile);

// Admin routes
router.get('/admin/users', isAuthenticated, authorizeAdmin, getAllUsers);

module.exports = router;
