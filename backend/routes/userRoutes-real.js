const express = require('express');
const { requireAuth } = require('../middleware/rbacMiddleware');
const { db } = require('../models/database');
const { updateStreak, getStreak, awardStreakBonus } = require('../services/streakService');

const router = express.Router();

// Get comprehensive XP stats from all sources
router.get('/xp-stats', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;

        // Get total XP from user table
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT total_xp FROM users WHERE id = ?', [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row || { total_xp: 0 });
            });
        });

        // Get weekly XP (last 7 days)
        const weeklyXP = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COALESCE(SUM(xp_amount), 0) as total FROM xp_transactions 
                WHERE user_id = ? AND created_at >= datetime('now', '-7 days')
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.total || 0);
            });
        });

        // Get monthly XP (last 30 days)
        const monthlyXP = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COALESCE(SUM(xp_amount), 0) as total FROM xp_transactions 
                WHERE user_id = ? AND created_at >= datetime('now', '-30 days')
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.total || 0);
            });
        });

        // Get XP breakdown by source
        const xpBySource = await new Promise((resolve, reject) => {
            db.all(`
                SELECT source, COALESCE(SUM(xp_amount), 0) as total 
                FROM xp_transactions 
                WHERE user_id = ? 
                GROUP BY source
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else {
                    const sources = {
                        lessons: 0,
                        simulators: 0,
                        quizzes: 0,
                        dailyLogin: 0,
                        streakBonus: 0,
                        articleRead: 0
                    };
                    rows?.forEach(row => {
                        if (sources.hasOwnProperty(row.source)) {
                            sources[row.source] = row.total;
                        }
                    });
                    resolve(sources);
                }
            });
        });

        // Get recent activity
        const recentActivity = await new Promise((resolve, reject) => {
            db.all(`
                SELECT * FROM xp_transactions 
                WHERE user_id = ? 
                ORDER BY created_at DESC 
                LIMIT 10
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        res.json({
            success: true,
            totalXP: user.total_xp || 0,
            weeklyXP: weeklyXP || 0,
            monthlyXP: monthlyXP || 0,
            sources: xpBySource,
            recentActivity: recentActivity.map(activity => ({
                id: activity.id,
                type: activity.source,
                title: activity.description,
                xp: activity.xp_amount,
                date: activity.created_at
            }))
        });
    } catch (error) {
        console.error('Error fetching XP stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch XP stats' });
    }
});

// Get detailed XP stats
router.get('/xp-detailed-stats', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;

        const user = await new Promise((resolve, reject) => {
            db.get('SELECT total_xp FROM users WHERE id = ?', [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row || { total_xp: 0 });
            });
        });

        const totalXP = user.total_xp || 0;

        // Get XP by source
        const sources = await new Promise((resolve, reject) => {
            db.all(`
                SELECT source, COALESCE(SUM(xp_amount), 0) as total 
                FROM xp_transactions 
                WHERE user_id = ? 
                GROUP BY source
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else {
                    const result = {
                        lessons: 0,
                        simulators: 0,
                        quizzes: 0,
                        dailyLogin: 0,
                        streakBonus: 0
                    };
                    rows?.forEach(row => {
                        if (result.hasOwnProperty(row.source)) {
                            result[row.source] = row.total;
                        }
                    });
                    resolve(result);
                }
            });
        });

        // Calculate percentages
        const weeklyXP = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COALESCE(SUM(xp_amount), 0) as total FROM xp_transactions 
                WHERE user_id = ? AND created_at >= datetime('now', '-7 days')
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.total || 0);
            });
        });

        const monthlyXP = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COALESCE(SUM(xp_amount), 0) as total FROM xp_transactions 
                WHERE user_id = ? AND created_at >= datetime('now', '-30 days')
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.total || 0);
            });
        });

        // Get recent activity
        const recentActivity = await new Promise((resolve, reject) => {
            db.all(`
                SELECT xt.*, 
                    COALESCE(l.title, s.title, 'نشاط') as item_title
                FROM xp_transactions xt
                LEFT JOIN lessons l ON xt.source = 'lessons' AND xt.reference_id = l.id
                LEFT JOIN simulators s ON xt.source = 'simulators' AND xt.reference_id = s.id
                WHERE xt.user_id = ? 
                ORDER BY xt.created_at DESC 
                LIMIT 10
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        res.json({
            success: true,
            total: totalXP,
            weekly: weeklyXP,
            monthly: monthlyXP,
            sources,
            recentActivity: recentActivity.map(activity => ({
                id: activity.id,
                type: activity.source,
                title: activity.item_title || activity.description,
                xp: activity.xp_amount,
                date: activity.created_at
            }))
        });
    } catch (error) {
        console.error('Error fetching detailed XP stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch detailed XP stats' });
    }
});

// Get learning progress
router.get('/learning-progress', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;

        // Get enrolled tracks
        const enrolledTracks = await new Promise((resolve, reject) => {
            db.all(`
                SELECT t.*, ue.progress, ue.last_accessed, ue.is_completed
                FROM user_enrollments ue
                JOIN tracks t ON ue.item_id = t.id
                WHERE ue.user_id = ? AND ue.type = 'track'
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        // Get completed lessons
        const completedLessons = await new Promise((resolve, reject) => {
            db.all(`
                SELECT lp.*, l.title as lesson_title, l.xp_reward,
                    u.title as unit_title, c.title as course_title, t.title as track_title
                FROM lesson_progress lp
                JOIN lessons l ON lp.lesson_id = l.id
                JOIN units u ON l.unit_id = u.id
                JOIN courses c ON u.course_id = c.id
                JOIN tracks t ON c.track_id = t.id
                WHERE lp.user_id = ? AND lp.is_completed = 1
                ORDER BY lp.completed_at DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        // Get in-progress lessons
        const inProgressLessons = await new Promise((resolve, reject) => {
            db.all(`
                SELECT lp.*, l.title as lesson_title,
                    u.title as unit_title, c.title as course_title, t.title as track_title
                FROM lesson_progress lp
                JOIN lessons l ON lp.lesson_id = l.id
                JOIN units u ON l.unit_id = u.id
                JOIN courses c ON u.course_id = c.id
                JOIN tracks t ON c.track_id = t.id
                WHERE lp.user_id = ? AND lp.is_completed = 0 AND lp.progress > 0
                ORDER BY lp.last_accessed DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        // Get total learning time
        const totalLearningTime = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COALESCE(SUM(time_spent), 0) as total FROM lesson_progress 
                WHERE user_id = ?
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.total || 0);
            });
        });

        // Get current streak
        const streakData = await new Promise((resolve, reject) => {
            db.get(`
                SELECT current_streak, last_activity_date FROM user_streaks 
                WHERE user_id = ?
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row || { current_streak: 0, last_activity_date: null });
            });
        });

        // Calculate overall progress
        const totalLessonsQuery = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as total FROM lessons
            `, [], (err, row) => {
                if (err) reject(err);
                else resolve(row?.total || 0);
            });
        });

        const totalLessons = totalLessonsQuery || 1;
        const overallProgress = Math.round((completedLessons.length / totalLessons) * 100);

        res.json({
            success: true,
            enrolledTracks: enrolledTracks.map(track => ({
                id: track.id,
                title: track.title,
                description: track.description,
                icon: track.icon,
                progress: track.progress || 0,
                is_completed: track.is_completed || 0,
                last_accessed: track.last_accessed
            })),
            completedLessons: completedLessons.map(lesson => ({
                id: lesson.lesson_id,
                title: lesson.lesson_title,
                track_title: lesson.track_title,
                course_title: lesson.course_title,
                unit_title: lesson.unit_title,
                completed_at: lesson.completed_at,
                xp_earned: lesson.xp_earned
            })),
            inProgressLessons: inProgressLessons.map(lesson => ({
                id: lesson.lesson_id,
                title: lesson.lesson_title,
                track_title: lesson.track_title,
                course_title: lesson.course_title,
                unit_title: lesson.unit_title,
                progress: lesson.progress,
                last_accessed: lesson.last_accessed
            })),
            overallProgress,
            totalLearningTime,
            currentStreak: streakData.current_streak || 0,
            lastActivity: streakData.last_activity_date
        });
    } catch (error) {
        console.error('Error fetching learning progress:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch learning progress' });
    }
});

// Get learning stats
router.get('/learning-stats', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;

        const completedLessons = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as count FROM lesson_progress 
                WHERE user_id = ? AND is_completed = 1
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.count || 0);
            });
        });

        const completedTracks = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as count FROM user_enrollments 
                WHERE user_id = ? AND type = 'track' AND is_completed = 1
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.count || 0);
            });
        });

        const inProgressLessons = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as count FROM lesson_progress 
                WHERE user_id = ? AND is_completed = 0 AND progress > 0
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.count || 0);
            });
        });

        const totalLearningTime = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COALESCE(SUM(time_spent), 0) as total FROM lesson_progress 
                WHERE user_id = ?
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.total || 0);
            });
        });

        res.json({
            success: true,
            completedLessons,
            completedTracks,
            inProgressLessons,
            totalLearningTime
        });
    } catch (error) {
        console.error('Error fetching learning stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch learning stats' });
    }
});

// Record lesson access
router.post('/lesson-access', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { lessonId, action } = req.body;

        await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO lesson_progress (user_id, lesson_id, progress, last_accessed, updated_at)
                VALUES (?, ?, 0, datetime('now'), datetime('now'))
                ON CONFLICT(user_id, lesson_id) DO UPDATE SET
                last_accessed = datetime('now'),
                updated_at = datetime('now')
            `, [userId, lessonId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ success: true, message: 'Lesson access recorded' });
    } catch (error) {
        console.error('Error recording lesson access:', error);
        res.status(500).json({ success: false, error: 'Failed to record lesson access' });
    }
});

// Complete lesson and award XP
router.post('/complete-lesson', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const { lessonId } = req.body;

        // Get lesson XP reward
        const lesson = await new Promise((resolve, reject) => {
            db.get('SELECT xp_reward FROM lessons WHERE id = ?', [lessonId], (err, row) => {
                if (err) reject(err);
                else resolve(row || { xp_reward: 50 });
            });
        });

        const xpReward = lesson.xp_reward || 50;

        // Mark lesson as completed
        await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO lesson_progress (user_id, lesson_id, is_completed, progress, completed_at, xp_earned, updated_at)
                VALUES (?, ?, 1, 100, datetime('now'), ?, datetime('now'))
                ON CONFLICT(user_id, lesson_id) DO UPDATE SET
                is_completed = 1,
                progress = 100,
                completed_at = datetime('now'),
                xp_earned = ?,
                updated_at = datetime('now')
            `, [userId, lessonId, xpReward, xpReward], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Award XP
        await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO xp_transactions (user_id, xp_amount, source, reference_id, description, created_at)
                VALUES (?, ?, 'lessons', ?, 'Completed lesson', datetime('now'))
            `, [userId, xpReward, lessonId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Update user total XP
        await new Promise((resolve, reject) => {
            db.run(`
                UPDATE users SET total_xp = total_xp + ?, updated_at = datetime('now') WHERE id = ?
            `, [xpReward, userId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Update streak
        const streakUpdate = await updateStreak(userId);
        let streakBonus = 0;

        if (streakUpdate && streakUpdate.isNewDay) {
            streakBonus = await awardStreakBonus(userId, streakUpdate.current_streak);
        }

        res.json({
            success: true,
            message: 'Lesson completed',
            xpEarned: xpReward,
            streak: streakUpdate ? {
                current: streakUpdate.current_streak,
                longest: streakUpdate.longest_streak,
                isMilestone: streakUpdate.isMilestone,
                bonusXP: streakBonus
            } : null
        });
    } catch (error) {
        console.error('Error completing lesson:', error);
        res.status(500).json({ success: false, error: 'Failed to complete lesson' });
    }
});

// Get user streak
router.get('/streak', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;
        const streak = await getStreak(userId);

        res.json({
            success: true,
            streak: {
                current: streak.current_streak,
                longest: streak.longest_streak,
                lastActivity: streak.last_activity_date
            }
        });
    } catch (error) {
        console.error('Error fetching streak:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch streak' });
    }
});

// Get saved items count (for profile quick stats)
router.get('/saved-count', requireAuth, async (req, res) => {
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

module.exports = router;
