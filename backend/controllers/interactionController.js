const { prisma } = require('../models/prismaDatabase');

// Toggle Like
const toggleLike = async (req, res) => {
    try {
        const { type, itemId } = req.body;
        const userId = req.user.id;

        if (!['news', 'article', 'lesson'].includes(type)) {
            return res.status(400).json({ error: 'Invalid item type' });
        }

        const existingLike = await prisma.user_likes.findFirst({
            where: {
                user_id: userId,
                item_type: type,
                item_id: parseInt(itemId)
            }
        });

        if (existingLike) {
            // Unlike
            await prisma.user_likes.delete({
                where: { id: existingLike.id }
            });
            res.json({ liked: false });
        } else {
            // Like
            await prisma.user_likes.create({
                data: {
                    user_id: userId,
                    item_type: type,
                    item_id: parseInt(itemId)
                }
            });
            res.json({ liked: true });
        }
    } catch (err) {
        console.error('Toggle like error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Toggle Bookmark
const toggleBookmark = async (req, res) => {
    try {
        const { type, itemId } = req.body;
        const userId = req.user.id;

        if (!['news', 'article', 'lesson', 'course'].includes(type)) {
            return res.status(400).json({ error: 'Invalid item type' });
        }

        const existingBookmark = await prisma.user_bookmarks.findFirst({
            where: {
                user_id: userId,
                item_type: type,
                item_id: parseInt(itemId)
            }
        });

        if (existingBookmark) {
            // Remove Bookmark
            await prisma.user_bookmarks.delete({
                where: { id: existingBookmark.id }
            });
            res.json({ bookmarked: false });
        } else {
            // Add Bookmark
            await prisma.user_bookmarks.create({
                data: {
                    user_id: userId,
                    item_type: type,
                    item_id: parseInt(itemId)
                }
            });
            res.json({ bookmarked: true });
        }
    } catch (err) {
        console.error('Toggle bookmark error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Mark Viewed & Award XP (for simple items like News/Articles)
const markViewed = async (req, res) => {
    try {
        const { type, itemId } = req.body;
        const userId = req.user.id;

        // specific XP rewards for simple views
        const rewards = {
            'news': 3,
            'article': 8
        };

        if (!rewards[type]) {
            return res.status(400).json({ error: 'Invalid item type for view tracking' });
        }

        const actionKey = `${type}_complete_${itemId}`;

        const existingLog = await prisma.logs.findFirst({
            where: {
                user_id: userId,
                action: actionKey
            }
        });

        if (existingLog) {
            return res.json({ message: 'Already viewed', xpAwarded: 0 });
        }

        // Award XP
        const xp = rewards[type];

        await prisma.$transaction([
            prisma.users.update({
                where: { id: userId },
                data: { total_xp: { increment: xp } }
            }),
            prisma.logs.create({
                data: {
                    user_id: userId,
                    action: actionKey,
                    resource_type: type,
                    resource_id: parseInt(itemId),
                    details: `Completed ${type} and earned ${xp} XP`
                }
            })
        ]);

        res.json({ message: 'View recorded', xpAwarded: xp });
    } catch (err) {
        console.error('Mark viewed error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get User Interactions (Likes & Bookmarks)
const getUserInteractions = async (req, res) => {
    try {
        const userId = req.user.id;

        const [likes, bookmarks] = await Promise.all([
            prisma.user_likes.findMany({ where: { user_id: userId } }),
            prisma.user_bookmarks.findMany({ where: { user_id: userId } })
        ]);

        const result = {
            likes: {},
            bookmarks: {}
        };

        likes.forEach(row => {
            if (!result.likes[row.item_type]) result.likes[row.item_type] = [];
            result.likes[row.item_type].push(row.item_id);
        });

        bookmarks.forEach(row => {
            if (!result.bookmarks[row.item_type]) result.bookmarks[row.item_type] = [];
            result.bookmarks[row.item_type].push(row.item_id);
        });

        res.json(result);
    } catch (err) {
        console.error('Get user interactions error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Get User Saved Items (Detailed)
const getSavedItems = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookmarks = await prisma.user_bookmarks.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        });

        res.json(bookmarks);
    } catch (err) {
        console.error('Get saved items error:', err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    toggleLike,
    toggleBookmark,
    markViewed,
    getUserInteractions,
    getSavedItems
};
