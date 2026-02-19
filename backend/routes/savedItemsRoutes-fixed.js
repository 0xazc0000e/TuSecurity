const express = require('express');
const { requireAuth } = require('../middleware/rbacMiddleware');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const router = express.Router();

const getDb = () => {
    return new sqlite3.Database(path.join(__dirname, '../../cyberclub.db'));
};

// Get all saved items
router.get('/saved-items', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;

        // Mock data for now - in production would query database
        res.json({
            success: true,
            bookmarks: [
                {
                    id: 1,
                    item_id: 1,
                    item_type: 'article',
                    title: 'مقدمة في أمن المعلومات',
                    saved_at: new Date().toISOString(),
                    reading_time: 15,
                    folder_id: null
                },
                {
                    id: 2,
                    item_id: 2,
                    item_type: 'lesson',
                    title: 'أساسيات الشبكات',
                    saved_at: new Date(Date.now() - 86400000).toISOString(),
                    reading_time: 30,
                    folder_id: null
                }
            ],
            likes: [
                {
                    id: 1,
                    item_id: 3,
                    item_type: 'article',
                    title: 'هجوم XSS وكيفية الوقاية منه',
                    created_at: new Date().toISOString()
                }
            ],
            readingList: [
                {
                    id: 1,
                    item_id: 4,
                    item_type: 'article',
                    title: 'التحقيق الجنائي الرقمي',
                    added_at: new Date().toISOString(),
                    reading_time: 45
                }
            ],
            folders: [
                { id: 'default', name: 'الكل', icon: '📁', count: 2, is_default: true },
                { id: 'favorites', name: 'المفضلة', icon: '⭐', count: 0, is_default: true },
                { id: 'reading', name: 'للقراءة لاحقاً', icon: '📖', count: 0, is_default: true }
            ]
        });
    } catch (error) {
        console.error('Error:', error);
        res.json({ success: true, bookmarks: [], likes: [], readingList: [], folders: [] });
    }
});

// Add bookmark
router.post('/bookmarks/add', requireAuth, async (req, res) => {
    try {
        const { itemId, itemType, note, folderId } = req.body;
        res.json({
            success: true,
            message: 'Item bookmarked successfully',
            bookmarkId: Date.now()
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Remove bookmark
router.post('/bookmarks/remove', requireAuth, async (req, res) => {
    try {
        res.json({ success: true, message: 'Bookmark removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add like
router.post('/likes/add', requireAuth, async (req, res) => {
    try {
        const { itemId, itemType } = req.body;
        res.json({
            success: true,
            message: 'Item liked successfully',
            likeId: Date.now()
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Remove like
router.post('/likes/remove', requireAuth, async (req, res) => {
    try {
        res.json({ success: true, message: 'Like removed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Add to reading list
router.post('/reading-list/add', requireAuth, async (req, res) => {
    try {
        const { itemId, itemType } = req.body;
        res.json({
            success: true,
            message: 'Item added to reading list',
            itemId: Date.now()
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Remove from reading list
router.post('/reading-list/remove', requireAuth, async (req, res) => {
    try {
        res.json({ success: true, message: 'Item removed from reading list' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Create folder
router.post('/folders/create', requireAuth, async (req, res) => {
    try {
        const { name, icon } = req.body;
        res.json({
            success: true,
            message: 'Folder created successfully',
            folder: {
                id: Date.now(),
                name: name,
                icon: icon || '📁',
                count: 0
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Move bookmark to folder
router.post('/bookmarks/move', requireAuth, async (req, res) => {
    try {
        res.json({ success: true, message: 'Bookmark moved to folder' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get saved count
router.get('/saved-count', requireAuth, async (req, res) => {
    try {
        res.json({
            success: true,
            bookmarks: 2,
            likes: 1,
            reading_list: 1
        });
    } catch (error) {
        res.json({ success: true, bookmarks: 0, likes: 0, reading_list: 0 });
    }
});

// Check item status
router.get('/item-status/:itemType/:itemId', requireAuth, async (req, res) => {
    try {
        const { itemType, itemId } = req.params;
        // Mock status - would check database in production
        res.json({
            success: true,
            isBookmarked: false,
            isLiked: false,
            inReadingList: false
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
