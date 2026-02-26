const { prisma } = require('../models/prismaDatabase');

// Get all notifications for a user
const getNotifications = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const [notifications, unreadCount] = await Promise.all([
            prisma.notifications.findMany({
                where: { user_id: userId },
                orderBy: { created_at: 'desc' },
                take: 50
            }),
            prisma.notifications.count({
                where: { user_id: userId, is_read: false }
            })
        ]);

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
        const userId = req.userId || req.user?.id;
        const { notificationId } = req.params;

        await prisma.notifications.update({
            where: {
                id: parseInt(notificationId),
                user_id: userId
            },
            data: { is_read: true }
        });

        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }
        console.error('Error marking notification as read:', error);
        res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
    }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.userId || req.user?.id;

        await prisma.notifications.updateMany({
            where: { user_id: userId, is_read: false },
            data: { is_read: true }
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
        await prisma.notifications.create({
            data: {
                user_id: userId,
                title,
                message,
                type,
                link,
                created_at: new Date(),
                is_read: false
            }
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
        const userId = req.userId || req.user?.id;
        const { notificationId } = req.params;

        await prisma.notifications.delete({
            where: {
                id: parseInt(notificationId),
                user_id: userId
            }
        });

        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }
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
