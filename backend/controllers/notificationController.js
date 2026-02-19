const { db } = require('../models/database');

// Get all notifications for a user
const getNotifications = async (req, res) => {
    try {
        const userId = req.userId;

        const notifications = await new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM notifications 
                 WHERE user_id = ? 
                 ORDER BY created_at DESC 
                 LIMIT 50`,
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows || []);
                }
            );
        });

        // Get unread count
        const unreadCount = await new Promise((resolve, reject) => {
            db.get(
                `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0`,
                [userId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row?.count || 0);
                }
            );
        });

        res.json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch notifications' });
    }
};

// Mark notification as read
const markAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        const { notificationId } = req.params;

        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`,
                [notificationId, userId],
                function(err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
    }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId;

        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0`,
                [userId],
                function(err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ success: false, error: 'Failed to mark notifications as read' });
    }
};

// Create notification (internal use)
const createNotification = async (userId, title, message, type = 'general', link = null) => {
    try {
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO notifications (user_id, title, message, type, link, created_at) 
                 VALUES (?, ?, ?, ?, ?, datetime('now'))`,
                [userId, title, message, type, link],
                function(err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
        return true;
    } catch (error) {
        console.error('Error creating notification:', error);
        return false;
    }
};

// Delete notification
const deleteNotification = async (req, res) => {
    try {
        const userId = req.userId;
        const { notificationId } = req.params;

        await new Promise((resolve, reject) => {
            db.run(
                `DELETE FROM notifications WHERE id = ? AND user_id = ?`,
                [notificationId, userId],
                function(err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ success: false, error: 'Failed to delete notification' });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
};
