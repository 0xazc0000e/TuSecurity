const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const { authenticate } = require('../controllers/authController');

// All routes require authentication
router.use(authenticate);

router.post('/like', interactionController.toggleLike);
router.post('/bookmark', interactionController.toggleBookmark);
router.post('/view', interactionController.markViewed);
router.get('/me', interactionController.getUserInteractions);
router.get('/saved', interactionController.getSavedItems);

module.exports = router;
