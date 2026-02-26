const express = require('express');
const { requireAuth } = require('../middleware/rbacMiddleware');
const { prisma } = require('../models/prismaDatabase');

const router = express.Router();

// Get all saved items (bookmarks, likes, reading list, folders)
router.get('/saved-items', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;

        // Get bookmarks, likes, and reading list
        const [bookmarksRaw, likesRaw, readingListRaw] = await Promise.all([
            prisma.bookmarks.findMany({
                where: { user_id: userId },
                orderBy: { added_at: 'desc' }
            }),
            prisma.likes.findMany({
                where: { user_id: userId },
                orderBy: { added_at: 'desc' }
            }),
            prisma.reading_list.findMany({
                where: { user_id: userId },
                orderBy: { added_at: 'desc' }
            })
        ]);

        // Helper to fetch details for items
        const fetchDetails = async (items) => {
            return Promise.all(items.map(async (item) => {
                let detail = null;
                if (item.item_type === 'article') {
                    detail = await prisma.articles.findUnique({ where: { id: item.item_id } });
                    return { ...item, title: detail?.title || 'غير معنون', reading_time: detail?.reading_time || 5 };
                } else if (item.item_type === 'lesson') {
                    detail = await prisma.lessons.findUnique({ where: { id: item.item_id } });
                    return { ...item, title: detail?.title || 'غير معنون', reading_time: detail?.duration || 5 };
                } else if (item.item_type === 'simulator') {
                    detail = await prisma.simulators.findUnique({ where: { id: item.item_id } });
                    return { ...item, title: detail?.title || 'غير معنون', reading_time: 5 };
                } else if (item.item_type === 'news') {
                    detail = await prisma.news.findUnique({ where: { id: item.item_id } });
                    return { ...item, title: detail?.title || 'غير معنون', reading_time: 5 };
                }
                return { ...item, title: 'غير معنون', reading_time: 5 };
            }));
        };

        const bookmarks = await fetchDetails(bookmarksRaw);
        const likes = await fetchDetails(likesRaw);
        const readingList = await fetchDetails(readingListRaw);

        // Get folders
        const foldersFromDb = await prisma.bookmark_folders.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        });

        // Manually count bookmarks for each folder
        const folders = await Promise.all(foldersFromDb.map(async (f) => {
            const count = await prisma.bookmarks.count({ where: { folder_id: f.id } });
            return { ...f, count };
        }));

        // Add default "All" folder
        const allFolder = {
            id: 'default',
            name: 'الكل',
            icon: '📁',
            count: bookmarks.length,
            is_default: true
        };

        res.json({
            success: true,
            bookmarks,
            likes,
            readingList,
            folders: [allFolder, ...folders]
        });
    } catch (error) {
        console.error('Error fetching saved items:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch saved items' });
    }
});

// Add bookmark
router.post('/bookmarks/add', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, itemType, note, folderId } = req.body;

        const bookmark = await prisma.bookmarks.upsert({
            where: {
                user_id_item_id_item_type: {
                    user_id: userId,
                    item_id: itemId,
                    item_type: itemType
                }
            },
            update: {
                note: note || undefined,
                folder_id: folderId || undefined
            },
            create: {
                user_id: userId,
                item_id: itemId,
                item_type: itemType,
                note: note || null,
                folder_id: folderId || null
            }
        });

        res.json({
            success: true,
            message: 'Item bookmarked successfully',
            bookmarkId: bookmark.id
        });
    } catch (error) {
        console.error('Error adding bookmark:', error);
        res.status(500).json({ success: false, error: 'Failed to add bookmark' });
    }
});

// Remove bookmark
router.post('/bookmarks/remove', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, itemType } = req.body;

        await prisma.bookmarks.delete({
            where: {
                user_id_item_id_item_type: {
                    user_id: userId,
                    item_id: itemId,
                    item_type: itemType
                }
            }
        });

        res.json({ success: true, message: 'Bookmark removed successfully' });
    } catch (error) {
        console.error('Error removing bookmark:', error);
        res.status(500).json({ success: false, error: 'Failed to remove bookmark' });
    }
});

// Add like
router.post('/likes/add', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, itemType } = req.body;

        const result = await prisma.$transaction(async (tx) => {
            const existing = await tx.likes.findUnique({
                where: {
                    user_id_item_id_item_type: {
                        user_id: userId,
                        item_id: itemId,
                        item_type: itemType
                    }
                }
            });

            if (existing) return { alreadyLiked: true, id: existing.id };

            const like = await tx.likes.create({
                data: { user_id: userId, item_id: itemId, item_type: itemType }
            });

            const tableMap = {
                'article': 'articles',
                'lesson': 'lessons',
                'news': 'news',
                'simulator': 'simulators'
            };
            const table = tableMap[itemType];
            if (table) {
                await tx[table].update({
                    where: { id: itemId },
                    data: { likes_count: { increment: 1 } }
                });
            }

            return { id: like.id };
        });

        if (result.alreadyLiked) {
            return res.status(400).json({
                success: false,
                error: 'Item already liked',
                likeId: result.id
            });
        }

        res.json({
            success: true,
            message: 'Item liked successfully',
            likeId: result.id
        });
    } catch (error) {
        console.error('Error adding like:', error);
        res.status(500).json({ success: false, error: 'Failed to add like' });
    }
});

// Remove like
router.post('/likes/remove', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, itemType } = req.body;

        await prisma.$transaction(async (tx) => {
            await tx.likes.delete({
                where: {
                    user_id_item_id_item_type: {
                        user_id: userId,
                        item_id: itemId,
                        item_type: itemType
                    }
                }
            });

            const tableMap = {
                'article': 'articles',
                'lesson': 'lessons',
                'news': 'news',
                'simulator': 'simulators'
            };
            const table = tableMap[itemType];
            if (table) {
                // We'll manually check and decrement ensuring it doesn't go below 0
                const item = await tx[table].findUnique({ where: { id: itemId }, select: { likes_count: true } });
                if (item && item.likes_count > 0) {
                    await tx[table].update({
                        where: { id: itemId },
                        data: { likes_count: { decrement: 1 } }
                    });
                }
            }
        });

        res.json({ success: true, message: 'Like removed successfully' });
    } catch (error) {
        console.error('Error removing like:', error);
        res.status(500).json({ success: false, error: 'Failed to remove like' });
    }
});

// Add to reading list
router.post('/reading-list/add', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, itemType } = req.body;

        const result = await prisma.reading_list.upsert({
            where: {
                user_id_item_id_item_type: {
                    user_id: userId,
                    item_id: itemId,
                    item_type: itemType
                }
            },
            update: {},
            create: {
                user_id: userId,
                item_id: itemId,
                item_type: itemType
            }
        });

        res.json({
            success: true,
            message: 'Item added to reading list',
            itemId: result.id
        });
    } catch (error) {
        console.error('Error adding to reading list:', error);
        res.status(500).json({ success: false, error: 'Failed to add to reading list' });
    }
});

// Remove from reading list
router.post('/reading-list/remove', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, itemType } = req.body;

        await prisma.reading_list.delete({
            where: {
                user_id_item_id_item_type: {
                    user_id: userId,
                    item_id: itemId,
                    item_type: itemType
                }
            }
        });

        res.json({ success: true, message: 'Item removed from reading list' });
    } catch (error) {
        console.error('Error removing from reading list:', error);
        res.status(500).json({ success: false, error: 'Failed to remove from reading list' });
    }
});

// Create folder
router.post('/folders/create', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { name, icon } = req.body;

        if (!name || name.trim().length === 0) {
            return res.status(400).json({ success: false, error: 'Folder name is required' });
        }

        const folder = await prisma.bookmark_folders.create({
            data: {
                user_id: userId,
                name: name.trim(),
                icon: icon || '📁'
            }
        });

        res.json({
            success: true,
            message: 'Folder created successfully',
            folder: {
                ...folder,
                count: 0
            }
        });
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ success: false, error: 'Failed to create folder' });
    }
});

// Move bookmark to folder
router.post('/bookmarks/move', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId, itemType, folderId } = req.body; // itemId and itemType combined needed for unique key

        await prisma.bookmarks.update({
            where: {
                user_id_item_id_item_type: {
                    user_id: userId,
                    item_id: itemId,
                    item_type: itemType
                }
            },
            data: { folder_id: folderId }
        });

        res.json({ success: true, message: 'Bookmark moved to folder' });
    } catch (error) {
        console.error('Error moving bookmark:', error);
        res.status(500).json({ success: false, error: 'Failed to move bookmark' });
    }
});

// Get saved count for quick stats
router.get('/saved-count', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;

        const [bookmarks, likes, reading_list] = await Promise.all([
            prisma.bookmarks.count({ where: { user_id: userId } }),
            prisma.likes.count({ where: { user_id: userId } }),
            prisma.reading_list.count({ where: { user_id: userId } })
        ]);

        res.json({
            success: true,
            bookmarks,
            likes,
            reading_list
        });
    } catch (error) {
        console.error('Error fetching saved count:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch saved count' });
    }
});

// Check if item is bookmarked/liked
router.get('/item-status/:itemType/:itemId', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { itemType, itemId } = req.params;
        const id = parseInt(itemId);

        const [isBookmarked, isLiked, inReadingList] = await Promise.all([
            prisma.bookmarks.findUnique({
                where: { user_id_item_id_item_type: { user_id: userId, item_id: id, item_type: itemType } }
            }),
            prisma.likes.findUnique({
                where: { user_id_item_id_item_type: { user_id: userId, item_id: id, item_type: itemType } }
            }),
            prisma.reading_list.findUnique({
                where: { user_id_item_id_item_type: { user_id: userId, item_id: id, item_type: itemType } }
            })
        ]);

        res.json({
            success: true,
            isBookmarked: !!isBookmarked,
            isLiked: !!isLiked,
            inReadingList: !!inReadingList
        });
    } catch (error) {
        console.error('Error checking item status:', error);
        res.status(500).json({ success: false, error: 'Failed to check item status' });
    }
});

module.exports = router;
