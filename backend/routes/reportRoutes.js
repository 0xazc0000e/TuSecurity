const express = require('express');
const router = express.Router();
const { requireAuth, requireAdmin } = require('../middleware/rbacMiddleware');
const reportController = require('../controllers/reportController');

// All report routes require admin role
router.use(requireAuth, requireAdmin);

// Dashboard statistics
router.get('/dashboard', reportController.getDashboardStats);

// User activity report
router.get('/activity', reportController.getUserActivityReport);

// Top users leaderboard
router.get('/top-users', reportController.getTopUsers);

// Content performance
router.get('/content-performance', reportController.getContentPerformanceReport);

// Engagement metrics
router.get('/engagement', reportController.getEngagementMetrics);

// System health
router.get('/system-health', reportController.getSystemHealthReport);

// Full comprehensive report
router.get('/full', reportController.getFullReport);

// Export report (CSV/PDF placeholder)
router.get('/export/:type', reportController.exportReport);

module.exports = router;
