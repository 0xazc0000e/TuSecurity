const express = require('express');
const contentController = require('../controllers/contentController');
const { authenticate, requireAdmin } = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/', contentController.getAllContent);
router.get('/:id', contentController.getContentById);
router.post('/:id/like', contentController.likeContent);

// Protected admin routes
router.post('/', authenticate, requireAdmin, contentController.createContent);
router.put('/:id', authenticate, requireAdmin, contentController.updateContent);
router.delete('/:id', authenticate, requireAdmin, contentController.deleteContent);

module.exports = router;
