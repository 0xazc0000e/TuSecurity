const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/rbacMiddleware');
const badgeController = require('../controllers/badgeController');

// Get all badges
router.get('/', badgeController.getAllBadges);

// Get user's badges
router.get('/my-badges', requireAuth, badgeController.getUserBadges);

// Check and award badges
router.post('/check', requireAuth, badgeController.checkBadges);

// Get badge progress
router.get('/progress', requireAuth, badgeController.getBadgeProgress);

// Admin routes
router.post('/', requireAuth, requireAdmin, badgeController.createBadge);
router.delete('/:id', requireAuth, requireAdmin, badgeController.deleteBadge);

module.exports = router;
