const express = require('express');
const { requireAuth } = require('../middleware/rbacMiddleware');
const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require('../controllers/notificationController');

const router = express.Router();

// Get all notifications
router.get('/', requireAuth, getNotifications);

// Mark notification as read
router.put('/:notificationId/read', requireAuth, markAsRead);

// Mark all as read
router.put('/read-all', requireAuth, markAllAsRead);

// Delete notification
router.delete('/:notificationId', requireAuth, deleteNotification);

module.exports = router;
