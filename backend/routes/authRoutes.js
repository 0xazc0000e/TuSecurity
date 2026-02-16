const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (require authentication)
router.get('/profile', authController.authenticate, authController.getProfile);
router.put('/profile', authController.authenticate, authController.upload.single('avatar'), authController.updateProfile);

module.exports = router;
