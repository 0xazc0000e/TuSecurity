const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail); // Validates token
router.post('/resend-verification', authController.resendVerification);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/logout', authController.logout);

// Protected routes (require authentication)
router.get('/profile', authController.authenticate, authController.getProfile);
router.put('/profile', authController.authenticate, authController.upload.single('avatar'), authController.updateProfile);
router.put('/complete-profile', authController.authenticate, authController.upload.single('avatar'), authController.completeProfile);

// Social Auth Routes
const passport = require('passport');
const socialFailureRedirect = (process.env.FRONTEND_URL || 'http://localhost:5173') + '/login?error=AuthFailed';

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: socialFailureRedirect, session: false }),
    authController.socialLoginCallback
);

router.get('/microsoft', passport.authenticate('microsoft', { scope: ['user.read'] }));
router.get('/microsoft/callback',
    passport.authenticate('microsoft', { failureRedirect: socialFailureRedirect, session: false }),
    authController.socialLoginCallback
);

module.exports = router;
