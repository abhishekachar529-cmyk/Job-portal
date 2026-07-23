// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { 
  register, 
  login, 
  checkEmailExists,  // ← ADD THIS
  getMe 
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['seeker', 'recruiter', 'admin']).withMessage('Invalid role')  // ← ADD 'admin'
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// Public routes
router.post('/register', upload.single('profilePhoto'), registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/check-email', checkEmailExists);  // ← ADD THIS LINE

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;