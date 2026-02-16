const { db } = require('../models/database');

// Toggle Like
const toggleLike = (req, res) => {
    const { type, itemId } = req.body;
    const userId = req.user.id;

    if (!['news', 'article', 'lesson'].includes(type)) {
        return res.status(400).json({ error: 'Invalid item type' });
    }

    db.get('SELECT id FROM user_likes WHERE user_id = ? AND item_type = ? AND item_id = ?',
        [userId, type, itemId], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });

            if (row) {
                // Unlike
                db.run('DELETE FROM user_likes WHERE id = ?', [row.id], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ liked: false });
                });
            } else {
                // Like
                db.run('INSERT INTO user_likes (user_id, item_type, item_id) VALUES (?, ?, ?)',
                    [userId, type, itemId], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ liked: true });
                    });
            }
        });
};

// Toggle Bookmark
const toggleBookmark = (req, res) => {
    const { type, itemId } = req.body;
    const userId = req.user.id;

    if (!['news', 'article', 'lesson', 'course'].includes(type)) {
        return res.status(400).json({ error: 'Invalid item type' });
    }

    db.get('SELECT id FROM user_bookmarks WHERE user_id = ? AND item_type = ? AND item_id = ?',
        [userId, type, itemId], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });

            if (row) {
                // Remove Bookmark
                db.run('DELETE FROM user_bookmarks WHERE id = ?', [row.id], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ bookmarked: false });
                });
            } else {
                // Add Bookmark
                db.run('INSERT INTO user_bookmarks (user_id, item_type, item_id) VALUES (?, ?, ?)',
                    [userId, type, itemId], (err) => {
                        if (err) return res.status(500).json({ error: err.message });
                        res.json({ bookmarked: true });
                    });
            }
        });
};

// Mark Viewed & Award XP (for simple items like News/Articles)
const markViewed = (req, res) => {
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

    // Check if already viewed/completed to avoid duplicate XP
    // For simplicity, we can use user_lesson_completion table logic or a new table.
    // However, the schema has 'user_lesson_completion'. For generic content, we might need a 'user_content_completion' or similar.
    // But since the user schema has 'user_lesson_completion' which is specific to lessons,
    // and 'user_progress' for simulators.
    // Let's reuse 'user_lesson_completion' if we generalize it, OR create a simple 'user_content_log' if not exists.
    // The current schema has 'logs' table but it's for audit.
    // The current schema has 'user_enrollments' but that's for courses.

    // Let's implement a simple check using a new table or existing one.
    // The schema provided earlier didn't have a generic 'content_completion'.
    // We will use 'logs' to check if action was 'view_complete' for this item to prevent duplicate XP.

    const actionKey = `${type}_complete_${itemId}`;

    db.get('SELECT id FROM logs WHERE user_id = ? AND action = ?', [userId, actionKey], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.json({ message: 'Already viewed', xpAwarded: 0 });

        // Award XP
        const xp = rewards[type];
        db.serialize(() => {
            db.run('UPDATE users SET total_xp = total_xp + ? WHERE id = ?', [xp, userId]);
            db.run('INSERT INTO logs (user_id, action, resource_type, resource_id, details) VALUES (?, ?, ?, ?, ?)',
                [userId, actionKey, type, itemId, `Completed ${type} and earned ${xp} XP`]);

            res.json({ message: 'View recorded', xpAwarded: xp });
        });
    });
};

// Get User Interactions (Likes & Bookmarks)
const getUserInteractions = (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT 'like' as interaction_type, item_type, item_id FROM user_likes WHERE user_id = ?
        UNION ALL
        SELECT 'bookmark' as interaction_type, item_type, item_id FROM user_bookmarks WHERE user_id = ?
    `;

    db.all(query, [userId, userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Transform to easier format: { likes: { news: [1,2], ... }, bookmarks: { ... } }
        const result = {
            likes: {},
            bookmarks: {}
        };

        rows.forEach(row => {
            const cat = row.interaction_type === 'like' ? result.likes : result.bookmarks;
            if (!cat[row.item_type]) cat[row.item_type] = [];
            cat[row.item_type].push(row.item_id);
        });

        res.json(result);
    });
};

// Get User Saved Items (Detailed)
const getSavedItems = (req, res) => {
    const userId = req.user.id;

    // This is a bit complex as we need to join with different tables based on type.
    // For now, let's fetch bookmarks and then fetch details.
    // Or we can just return the IDs and let frontend fetch details (simpler but more requests).
    // Better: Fetch bookmarks with some metadata if possible.

    // Let's return the bookmarks list.
    db.all('SELECT * FROM user_bookmarks WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

module.exports = {
    toggleLike,
    toggleBookmark,
    markViewed,
    getUserInteractions,
    getSavedItems
};
