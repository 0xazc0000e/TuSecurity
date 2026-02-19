const express = require('express');
const router = express.Router();
const { db } = require('../models/database');
const { requireAuth } = require('../middleware/rbacMiddleware');
const bcrypt = require('bcrypt');

// Helper to get user XP
const getUserXP = (userId) => {
    return new Promise((resolve) => {
        db.get('SELECT total_xp FROM users WHERE id = ?', [userId], (err, row) => resolve(row?.total_xp || 0));
    });
};

// Helper to calculate rank (same as frontend)
const calculateRank = (xp) => {
    if (xp >= 50000) return { title: 'أسطورة الأمن السيبراني', nextLevel: 100000 };
    if (xp >= 25000) return { title: 'خبير الأمن السيبراني', nextLevel: 50000 };
    if (xp >= 10000) return { title: 'محترف الأمن', nextLevel: 25000 };
    if (xp >= 5000) return { title: 'متقدم', nextLevel: 10000 };
    if (xp >= 2500) return { title: 'متوسط', nextLevel: 5000 };
    if (xp >= 1000) return { title: 'مبتدئ متحمس', nextLevel: 2500 };
    return { title: 'مبتدئ', nextLevel: 1000 };
};

// GET /api/profile/stats
router.get('/stats', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;

        const user = await new Promise((resolve, reject) => {
            db.get('SELECT total_xp, role, department, specializations FROM users WHERE id = ?', [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        const streak = await new Promise((resolve) => {
            db.get('SELECT current_streak, last_activity_date FROM user_streaks WHERE user_id = ?', [userId], (err, row) => resolve(row || { current_streak: 0 }));
        });

        // Calculate Weekly and Monthly XP
        const timeStats = await new Promise((resolve) => {
            db.get(`
                SELECT 
                    SUM(CASE WHEN created_at >= datetime('now', '-7 days') THEN xp_earned ELSE 0 END) as weekly_xp,
                    SUM(CASE WHEN created_at >= datetime('now', '-30 days') THEN xp_earned ELSE 0 END) as monthly_xp
                FROM user_activity 
                WHERE user_id = ?
            `, [userId], (err, row) => resolve(row || { weekly_xp: 0, monthly_xp: 0 }));
        });

        // Counts
        const counts = await new Promise((resolve) => {
            db.get(`
                SELECT 
                    (SELECT COUNT(*) FROM lesson_progress WHERE user_id = ? AND is_completed = 1) as completed_lessons,
                    (SELECT COUNT(*) FROM user_activity WHERE user_id = ? AND activity_type = 'simulator_completed') as completed_simulators,
                    (SELECT COUNT(*) FROM bookmarks WHERE user_id = ?) as saved_items
            `, [userId, userId, userId], (err, row) => resolve(row || { completed_lessons: 0, completed_simulators: 0, saved_items: 0 }));
        });

        // Initialize or get weekly goals
        let goals = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM user_goals WHERE user_id = ? AND week_start_date >= datetime('now', '-7 days')", [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        if (goals.length === 0) {
            // Create default goals if none exist for this week
            const defaultGoals = [
                { type: 'xp', target: 500 },
                { type: 'lessons', target: 5 }
            ];
            // Create default goals if none exist for this week
            const newDefaultGoals = [
                { type: 'lessons', target: 5, current: counts.completed_lessons }, // This logic might need refinement for *weekly* progress, but for now simple
                { type: 'streak', target: 7, current: streak.current_streak },
                { type: 'xp', target: 500, current: timeStats.weekly_xp }
            ];
            // In a real app, 'current' for goals should be calculated based on activity *since* week start.
            // For now, we'll just insert and let the client or a separate background job update 'current'.
            // Or better, we calculate 'current' on the fly here for the response, but store '0' initially.

            for (const goal of newDefaultGoals) {
                db.run('INSERT INTO user_goals (user_id, goal_type, target_value, current_value) VALUES (?, ?, ?, ?)',
                    [userId, goal.type, goal.target, goal.current]);
            }
            // Fetch again
            goals = await new Promise((resolve) => {
                db.all("SELECT * FROM user_goals WHERE user_id = ? AND week_start_date >= datetime('now', '-7 days')", [userId], (err, rows) => resolve(rows));
            });
        }

        const rank = calculateRank(user.total_xp);

        res.json({
            xp: user.total_xp,
            weeklyXP: timeStats.weekly_xp || 0,
            monthlyXP: timeStats.monthly_xp || 0,
            rank: rank.title,
            nextRankXp: rank.nextLevel,
            currentStreak: streak.current_streak,
            goals: goals,
            completedLessons: counts.completed_lessons,
            completedSimulators: counts.completed_simulators,
            savedArticles: counts.saved_items,
            role: user.role,
            department: user.department,
            specializations: JSON.parse(user.specializations || '[]')
        });

    } catch (error) {
        console.error('Error fetching profile stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// GET /api/profile/activity
router.get('/activity', requireAuth, async (req, res) => {
    try {
        db.all(`
            SELECT * FROM user_activity 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT 10
        `, [req.userId], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activity' });
    }
});

// GET /api/profile/saved
router.get('/saved', requireAuth, async (req, res) => {
    try {
        const getItems = (table) => {
            return new Promise((resolve, reject) => {
                db.all(`
                    SELECT t.*, 
                        CASE 
                            WHEN t.item_type = 'article' THEN a.title
                            WHEN t.item_type = 'lesson' THEN l.title
                            WHEN t.item_type = 'course' THEN c.title
                            WHEN t.item_type = 'track' THEN tr.title
                            WHEN t.item_type = 'news' THEN n.title
                        END as title,
                        CASE 
                            WHEN t.item_type = 'article' THEN a.description
                            WHEN t.item_type = 'course' THEN c.description
                            WHEN t.item_type = 'track' THEN tr.description
                             WHEN t.item_type = 'news' THEN n.body
                        END as description,
                        CASE 
                             WHEN t.item_type = 'article' THEN a.cover_image
                             WHEN t.item_type = 'track' THEN tr.icon
                             WHEN t.item_type = 'news' THEN n.image_url
                        END as image
                    FROM ${table} t
                    LEFT JOIN articles a ON t.item_type = 'article' AND t.item_id = a.id
                    LEFT JOIN lessons l ON t.item_type = 'lesson' AND t.item_id = l.id
                    LEFT JOIN courses c ON t.item_type = 'course' AND t.item_id = c.id
                    LEFT JOIN tracks tr ON t.item_type = 'track' AND t.item_id = tr.id
                    LEFT JOIN news n ON t.item_type = 'news' AND t.item_id = n.id
                    WHERE t.user_id = ?
                    ORDER BY t.added_at DESC
                `, [req.userId], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
            });
        };

        const [folders, bookmarks, likes, readingList] = await Promise.all([
            new Promise((resolve) => db.all('SELECT * FROM bookmark_folders WHERE user_id = ?', [req.userId], (err, rows) => resolve(rows || []))),
            getItems('bookmarks'),
            getItems('likes'),
            getItems('reading_list')
        ]);

        res.json({ folders, bookmarks, likes, readingList });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch saved items' });
    }
});

// POST /api/profile/saved (Add/Remove)
router.post('/saved', requireAuth, async (req, res) => {
    const { itemId, itemType, folderId, note, action, section } = req.body; // action: 'add' or 'remove', section: 'bookmarks'|'likes'|'readingList'

    const tableMap = {
        'bookmarks': 'bookmarks',
        'likes': 'likes',
        'readingList': 'reading_list',
        'reading_list': 'reading_list'
    };

    const table = tableMap[section] || 'bookmarks';

    if (action === 'remove') {
        db.run(`DELETE FROM ${table} WHERE user_id = ? AND item_id = ? AND item_type = ?`,
            [req.userId, itemId, itemType], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, message: 'Item removed' });
            });
    } else {
        // Assume add is only for bookmarks for now via this endpoint, 
        // as likes/readingList usually have their own toggles on item pages.
        // But we can support generic add if needed.
        if (table === 'bookmarks') {
            db.run(`
                INSERT INTO bookmarks (user_id, item_id, item_type, folder_id, note)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT(user_id, item_id, item_type) DO UPDATE SET
                folder_id = excluded.folder_id,
                note = excluded.note
            `, [req.userId, itemId, itemType, folderId || null, note || ''], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, message: 'Item saved' });
            });
        } else {
            db.run(`INSERT OR IGNORE INTO ${table} (user_id, item_id, item_type) VALUES (?, ?, ?)`,
                [req.userId, itemId, itemType], (err) => {
                    if (err) return res.status(500).json({ error: err.message });
                    res.json({ success: true, message: 'Item saved' });
                });
        }
    }
});

// GET /api/profile/learning-path
router.get('/learning-path', requireAuth, async (req, res) => {
    try {
        const paths = await new Promise((resolve, reject) => {
            db.all(`
                SELECT ue.*, t.title, t.icon, t.description, t.id as track_id
                FROM user_enrollments ue
                JOIN tracks t ON ue.item_id = t.id
                WHERE ue.user_id = ? AND ue.type = 'track'
            `, [req.userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        // For each path, calculate progress and find resume lesson
        const pathsWithProgress = await Promise.all(paths.map(async (path) => {
            // Get total lessons in track
            const totalLessons = await new Promise((resolve) => {
                db.get(`
                    SELECT COUNT(l.id) as count
                    FROM lessons l
                    JOIN units u ON l.unit_id = u.id
                    JOIN courses c ON u.course_id = c.id
                    WHERE c.track_id = ?
                `, [path.item_id], (err, row) => resolve(row?.count || 0));
            });

            // Get completed lessons in track
            const completedLessons = await new Promise((resolve) => {
                db.get(`
                    SELECT COUNT(lp.lesson_id) as count
                    FROM lesson_progress lp
                    JOIN lessons l ON lp.lesson_id = l.id
                    JOIN units u ON l.unit_id = u.id
                    JOIN courses c ON u.course_id = c.id
                    WHERE lp.user_id = ? AND c.track_id = ? AND lp.is_completed = 1
                `, [req.userId, path.item_id], (err, row) => resolve(row?.count || 0));
            });

            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

            // Find resume lesson
            const lastLesson = await new Promise((resolve) => {
                db.get(`
                    SELECT l.id, l.title, l.unit_id 
                    FROM lesson_progress lp
                    JOIN lessons l ON lp.lesson_id = l.id
                    JOIN units u ON l.unit_id = u.id
                    JOIN courses c ON u.course_id = c.id
                    WHERE lp.user_id = ? AND c.track_id = ?
                    ORDER BY lp.last_accessed DESC LIMIT 1
                `, [req.userId, path.item_id], (err, row) => resolve(row));
            });

            // If no last accessed, find first lesson of track
            let resumeLesson = lastLesson;
            if (!resumeLesson) {
                resumeLesson = await new Promise((resolve) => {
                    db.get(`
                        SELECT l.id, l.title
                        FROM lessons l
                        JOIN units u ON l.unit_id = u.id
                        JOIN courses c ON u.course_id = c.id
                        WHERE c.track_id = ?
                        ORDER BY c.sort_order ASC, u.sort_order ASC, l.sort_order ASC
                        LIMIT 1
                    `, [path.item_id], (err, row) => resolve(row));
                });
            }

            return {
                ...path,
                progress,
                completedLessons,
                totalLessons,
                current_lesson_id: resumeLesson?.id,
                current_lesson_title: resumeLesson?.title
            };
        }));

        res.json(pathsWithProgress);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed' });
    }
});

const multer = require('multer');
const path = require('path');

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        // Ensure directory exists
        const fs = require('fs');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// GET /api/profile/events
router.get('/events', requireAuth, async (req, res) => {
    try {
        db.all(`
            SELECT * FROM club_events 
            WHERE date >= date('now') 
            ORDER BY date ASC 
            LIMIT 5
        `, (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// PUT /api/profile/update
// PUT /api/profile/update
router.put('/update', requireAuth, upload.single('avatar'), async (req, res) => {
    const { username, full_name, bio, oldPassword, newPassword, title, social_links } = req.body;
    let avatar = req.body.avatar; // if passed as string (unlikely for upload)

    if (req.file) {
        avatar = `/uploads/${req.file.filename}`;
    }

    const userId = req.userId;

    try {
        if (newPassword) {
            // Verify old password
            const user = await new Promise((resolve) => {
                db.get('SELECT password_hash FROM users WHERE id = ?', [userId], (err, row) => resolve(row));
            });

            if (!user || !(await bcrypt.compare(oldPassword, user.password_hash))) {
                return res.status(400).json({ error: 'كلمة المرور الحالية غير صحيحة' });
            }

            const hash = await bcrypt.hash(newPassword, 10);
            db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, userId]);
        }

        const socialLinksStr = typeof social_links === 'object' ? JSON.stringify(social_links) : social_links;

        db.run(`
            UPDATE users SET 
            username = COALESCE(?, username),
            full_name = COALESCE(?, full_name),
            bio = COALESCE(?, bio),
            avatar = COALESCE(?, avatar),
            title = COALESCE(?, title),
            social_links = COALESCE(?, social_links)
            WHERE id = ?
        `, [username, full_name, bio, avatar, title, socialLinksStr, userId], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            // Return updated user info
            db.get('SELECT id, username, email, full_name, avatar, bio, role, title, social_links FROM users WHERE id = ?', [userId], (err, row) => {
                if (row && row.social_links) {
                    try { row.social_links = JSON.parse(row.social_links); } catch { }
                }
                res.json({ success: true, message: 'Profile updated', user: row });
            });
        });

    } catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
});

// POST /api/profile/folders
router.post('/folders', requireAuth, async (req, res) => {
    const { name } = req.body;
    try {
        db.run('INSERT INTO bookmark_folders (user_id, name) VALUES (?, ?)', [req.userId, name], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID, name });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create folder' });
    }
});

// DELETE /api/profile/folders/:id
router.delete('/folders/:id', requireAuth, async (req, res) => {
    try {
        db.serialize(() => {
            // Move items from this folder to root (NULL)
            db.run('UPDATE bookmarks SET folder_id = NULL WHERE folder_id = ? AND user_id = ?', [req.params.id, req.userId]);

            // Delete the folder
            db.run('DELETE FROM bookmark_folders WHERE id = ? AND user_id = ?', [req.params.id, req.userId], function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete folder' });
    }
});

// DELETE /api/profile/delete-account
router.delete('/delete-account', requireAuth, async (req, res) => {
    try {
        db.run('DELETE FROM users WHERE id = ?', [req.userId], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: 'User deleted' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete account' });
    }
});

module.exports = router;
