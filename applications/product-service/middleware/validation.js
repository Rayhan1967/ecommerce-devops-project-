// middleware/validation.js
const { body, validationResult } = require('express-validator');

// Middleware untuk cek hasil validation
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

// Validation rules untuk create product
const validateCreateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3-100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10-2000 characters'),
  
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be greater than or equal to 0'),
  
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'beauty'])
    .withMessage('Invalid category'),
  
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  checkValidation
];

// Validation rules untuk update product
const validateUpdateProduct = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3-100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10-2000 characters'),
  
  body('price')
    .optional()
    .isNumeric()
    .withMessage('Price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price must be greater than or equal to 0'),
  
  body('category')
    .optional()
    .trim()
    .isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'beauty'])
    .withMessage('Invalid category'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  
  checkValidation
];

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
  checkValidation
};
