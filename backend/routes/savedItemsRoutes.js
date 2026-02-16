const express = require('express');
const { authenticate } = require('../controllers/authController');
const { db } = require('../models/database');

const router = express.Router();

// Get all saved items (bookmarks, likes, reading list, folders)
router.get('/saved-items', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get bookmarks
        const bookmarks = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    b.*,
                    COALESCE(a.title, l.title, s.title, n.title, 'غير معنون') as title,
                    COALESCE(a.reading_time, l.duration, 5) as reading_time,
                    b.folder_id
                FROM bookmarks b
                LEFT JOIN articles a ON b.item_type = 'article' AND b.item_id = a.id
                LEFT JOIN lessons l ON b.item_type = 'lesson' AND b.item_id = l.id
                LEFT JOIN simulators s ON b.item_type = 'simulator' AND b.item_id = s.id
                LEFT JOIN news n ON b.item_type = 'news' AND b.item_id = n.id
                WHERE b.user_id = ?
                ORDER BY b.created_at DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        // Get likes
        const likes = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    l.*,
                    COALESCE(a.title, n.title, s.title, 'غير معنون') as title
                FROM likes l
                LEFT JOIN articles a ON l.item_type = 'article' AND l.item_id = a.id
                LEFT JOIN news n ON l.item_type = 'news' AND l.item_id = n.id
                LEFT JOIN simulators s ON l.item_type = 'simulator' AND l.item_id = s.id
                WHERE l.user_id = ?
                ORDER BY l.created_at DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        // Get reading list
        const readingList = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    rl.*,
                    COALESCE(a.title, l.title, 'غير معنون') as title,
                    COALESCE(a.reading_time, l.duration, 5) as reading_time
                FROM reading_list rl
                LEFT JOIN articles a ON rl.item_type = 'article' AND rl.item_id = a.id
                LEFT JOIN lessons l ON rl.item_type = 'lesson' AND rl.item_id = l.id
                WHERE rl.user_id = ?
                ORDER BY rl.added_at DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        // Get folders
        const folders = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    f.*,
                    (SELECT COUNT(*) FROM bookmarks WHERE folder_id = f.id) as count
                FROM bookmark_folders f
                WHERE f.user_id = ?
                ORDER BY f.created_at DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else {
                    // Add default folder if no folders exist
                    if (!rows || rows.length === 0) {
                        resolve([
                            { id: 'default', name: 'الكل', icon: '📁', count: bookmarks.length, is_default: true },
                            { id: 'favorites', name: 'المفضلة', icon: '⭐', count: 0, is_default: true },
                            { id: 'reading', name: 'للقراءة لاحقاً', icon: '📖', count: 0, is_default: true }
                        ]);
                    } else {
                        // Add default "All" folder
                        const allFolder = { 
                            id: 'default', 
                            name: 'الكل', 
                            icon: '📁', 
                            count: bookmarks.length,
                            is_default: true 
                        };
                        resolve([allFolder, ...rows]);
                    }
                }
            });
        });

        // Get saved counts for quick stats
        const counts = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    (SELECT COUNT(*) FROM bookmarks WHERE user_id = ?) as bookmarks_count,
                    (SELECT COUNT(*) FROM likes WHERE user_id = ?) as likes_count,
                    (SELECT COUNT(*) FROM reading_list WHERE user_id = ?) as reading_list_count
            `, [userId, userId, userId], (err, row) => {
                if (err) reject(err);
                else resolve(row || { bookmarks_count: 0, likes_count: 0, reading_list_count: 0 });
            });
        });

        res.json({
            success: true,
            bookmarks,
            likes,
            readingList,
            folders,
            counts: {
                bookmarks: counts.bookmarks_count,
                likes: counts.likes_count,
                readingList: counts.reading_list_count
            }
        });
    } catch (error) {
        console.error('Error fetching saved items:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch saved items' });
    }
});

// Add bookmark
router.post('/bookmarks/add', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, itemType, note, folderId } = req.body;

        // Check if already bookmarked
        const existing = await new Promise((resolve, reject) => {
            db.get(`
                SELECT id FROM bookmarks 
                WHERE user_id = ? AND item_id = ? AND item_type = ?
            `, [userId, itemId, itemType], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (existing) {
            return res.status(400).json({ 
                success: false, 
                error: 'Item already bookmarked',
                bookmarkId: existing.id
            });
        }

        // Add bookmark
        const result = await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO bookmarks (user_id, item_id, item_type, note, folder_id, created_at)
                VALUES (?, ?, ?, ?, ?, datetime('now'))
            `, [userId, itemId, itemType, note || null, folderId || null], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });

        // Update user's bookmarks count
        await new Promise((resolve, reject) => {
            db.run(`
                UPDATE users 
                SET bookmarks_count = bookmarks_count + 1,
                    updated_at = datetime('now')
                WHERE id = ?
            `, [userId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({
            success: true,
            message: 'Item bookmarked successfully',
            bookmarkId: result
        });
    } catch (error) {
        console.error('Error adding bookmark:', error);
        res.status(500).json({ success: false, error: 'Failed to add bookmark' });
    }
});

// Remove bookmark
router.post('/bookmarks/remove', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, itemType } = req.body;

        // Delete bookmark
        await new Promise((resolve, reject) => {
            db.run(`
                DELETE FROM bookmarks 
                WHERE user_id = ? AND item_id = ? AND item_type = ?
            `, [userId, itemId, itemType], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Update user's bookmarks count
        await new Promise((resolve, reject) => {
            db.run(`
                UPDATE users 
                SET bookmarks_count = MAX(0, bookmarks_count - 1),
                    updated_at = datetime('now')
                WHERE id = ?
            `, [userId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ success: true, message: 'Bookmark removed successfully' });
    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(500).json({ success: false, error: 'Failed to remove bookmark' });
    }
});

// Add like
router.post('/likes/add', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, itemType } = req.body;

        // Check if already liked
        const existing = await new Promise((resolve, reject) => {
            db.get(`
                SELECT id FROM likes 
                WHERE user_id = ? AND item_id = ? AND item_type = ?
            `, [userId, itemId, itemType], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (existing) {
            return res.status(400).json({ 
                success: false, 
                error: 'Item already liked',
                likeId: existing.id
            });
        }

        // Add like
        const result = await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO likes (user_id, item_id, item_type, created_at)
                VALUES (?, ?, ?, datetime('now'))
            `, [userId, itemId, itemType], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });

        // Increment item's like count
        const tableMap = {
            'article': 'articles',
            'lesson': 'lessons',
            'news': 'news',
            'simulator': 'simulators'
        };
        const table = tableMap[itemType];
        if (table) {
            await new Promise((resolve, reject) => {
                db.run(`
                    UPDATE ${table} 
                    SET likes_count = likes_count + 1,
                        updated_at = datetime('now')
                    WHERE id = ?
                `, [itemId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        res.json({
            success: true,
            message: 'Item liked successfully',
            likeId: result
        });
    } catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ success: false, error: 'Failed to add like' });
    }
});

// Remove like
router.post('/likes/remove', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, itemType } = req.body;

        // Delete like
        await new Promise((resolve, reject) => {
            db.run(`
                DELETE FROM likes 
                WHERE user_id = ? AND item_id = ? AND item_type = ?
            `, [userId, itemId, itemType], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Decrement item's like count
        const tableMap = {
            'article': 'articles',
            'lesson': 'lessons',
            'news': 'news',
            'simulator': 'simulators'
        };
        const table = tableMap[itemType];
        if (table) {
            await new Promise((resolve, reject) => {
                db.run(`
                    UPDATE ${table} 
                    SET likes_count = MAX(0, likes_count - 1),
                        updated_at = datetime('now')
                    WHERE id = ?
                `, [itemId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }

        res.json({ success: true, message: 'Like removed successfully' });
    } catch (error) {
        console.error('Error removing like:', error);
        res.status(500).json({ success: false, error: 'Failed to remove like' });
    }
});

// Add to reading list
router.post('/reading-list/add', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, itemType } = req.body;

        // Check if already in reading list
        const existing = await new Promise((resolve, reject) => {
            db.get(`
                SELECT id FROM reading_list 
                WHERE user_id = ? AND item_id = ? AND item_type = ?
            `, [userId, itemId, itemType], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (existing) {
            return res.status(400).json({ 
                success: false, 
                error: 'Item already in reading list',
                itemId: existing.id
            });
        }

        // Add to reading list
        const result = await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO reading_list (user_id, item_id, item_type, added_at)
                VALUES (?, ?, ?, datetime('now'))
            `, [userId, itemId, itemType], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });

        res.json({
            success: true,
            message: 'Item added to reading list',
            itemId: result
        });
    } catch (error) {
        console.error('Error adding to reading list:', error);
        res.status(500).json({ success: false, error: 'Failed to add to reading list' });
    }
});

// Remove from reading list
router.post('/reading-list/remove', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, itemType } = req.body;

        await new Promise((resolve, reject) => {
            db.run(`
                DELETE FROM reading_list 
                WHERE user_id = ? AND item_id = ? AND item_type = ?
            `, [userId, itemId, itemType], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ success: true, message: 'Item removed from reading list' });
    } catch (error) {
        console.error('Error removing from reading list:', error);
        res.status(500).json({ success: false, error: 'Failed to remove from reading list' });
    }
});

// Create bookmark folder
router.post('/folders/create', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, icon } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ success: false, error: 'Folder name is required' });
        }

        const result = await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO bookmark_folders (user_id, name, icon, created_at)
                VALUES (?, ?, ?, datetime('now'))
            `, [userId, name.trim(), icon || '📁'], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });

        res.json({
            success: true,
            message: 'Folder created successfully',
            folder: {
                id: result,
                name: name.trim(),
                icon: icon || '📁',
                count: 0
            }
        });
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ success: false, error: 'Failed to create folder' });
    }
});

// Move bookmark to folder
router.post('/bookmarks/move', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId, folderId } = req.body;

        await new Promise((resolve, reject) => {
            db.run(`
                UPDATE bookmarks 
                SET folder_id = ?,
                    updated_at = datetime('now')
                WHERE user_id = ? AND item_id = ?
            `, [folderId, userId, itemId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ success: true, message: 'Bookmark moved to folder' });
    } catch (error) {
        console.error('Error moving bookmark:', error);
        res.status(500).json({ success: false, error: 'Failed to move bookmark' });
    }
});

// Get saved count for quick stats
router.get('/saved-count', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const counts = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    (SELECT COUNT(*) FROM bookmarks WHERE user_id = ?) as bookmarks,
                    (SELECT COUNT(*) FROM likes WHERE user_id = ?) as likes,
                    (SELECT COUNT(*) FROM reading_list WHERE user_id = ?) as reading_list
            `, [userId, userId, userId], (err, row) => {
                if (err) reject(err);
                else resolve(row || { bookmarks: 0, likes: 0, reading_list: 0 });
            });
        });

        res.json({
            success: true,
            bookmarks: counts.bookmarks,
            likes: counts.likes,
            reading_list: counts.reading_list
        });
    } catch (error) {
        console.error('Error fetching saved count:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch saved count' });
    }
});

// Check if item is bookmarked/liked (for UI state)
router.get('/item-status/:itemType/:itemId', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemType, itemId } = req.params;

        const [isBookmarked, isLiked, inReadingList] = await Promise.all([
            new Promise((resolve, reject) => {
                db.get(`
                    SELECT id FROM bookmarks 
                    WHERE user_id = ? AND item_id = ? AND item_type = ?
                `, [userId, itemId, itemType], (err, row) => {
                    if (err) reject(err);
                    else resolve(!!row);
                });
            }),
            new Promise((resolve, reject) => {
                db.get(`
                    SELECT id FROM likes 
                    WHERE user_id = ? AND item_id = ? AND item_type = ?
                `, [userId, itemId, itemType], (err, row) => {
                    if (err) reject(err);
                    else resolve(!!row);
                });
            }),
            new Promise((resolve, reject) => {
                db.get(`
                    SELECT id FROM reading_list 
                    WHERE user_id = ? AND item_id = ? AND item_type = ?
                `, [userId, itemId, itemType], (err, row) => {
                    if (err) reject(err);
                    else resolve(!!row);
                });
            })
        ]);

        res.json({
            success: true,
            isBookmarked,
            isLiked,
            inReadingList
        });
    } catch (error) {
        console.error('Error checking item status:', error);
        res.status(500).json({ success: false, error: 'Failed to check item status' });
    }
});

module.exports = router;
