// middleware/validation.js
const { body, validationResult } = require('express-validator');

const validateCreateOrder = [
  body('userId')
    .notEmpty()
    .withMessage('userId is required'),
  body('products')
    .isArray({ min: 1 })
    .withMessage('products must be a non-empty array'),
  body('products.*.id')
    .notEmpty()
    .withMessage('Each product must have an id'),
  body('products.*.quantity')
    .isInt({ min: 1 })
    .withMessage('quantity must be at least 1'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = { validateCreateOrder };
