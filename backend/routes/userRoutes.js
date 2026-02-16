const express = require('express');
const { authenticate } = require('../controllers/authController');
const { db } = require('../models/database');

const router = express.Router();

// Get comprehensive XP stats from all sources
router.get('/xp-stats', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

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
                SELECT SUM(xp_amount) as total FROM xp_transactions 
                WHERE user_id = ? AND created_at >= datetime('now', '-7 days')
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.total || 0);
            });
        });

        // Get monthly XP (last 30 days)
        const monthlyXP = await new Promise((resolve, reject) => {
            db.get(`
                SELECT SUM(xp_amount) as total FROM xp_transactions 
                WHERE user_id = ? AND created_at >= datetime('now', '-30 days')
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.total || 0);
            });
        });

        // Get XP breakdown by source
        const xpBySource = await new Promise((resolve, reject) => {
            db.all(`
                SELECT source, SUM(xp_amount) as total 
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
                    rows.forEach(row => {
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

// Get detailed XP breakdown
router.get('/xp-detailed-stats', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user total XP
        const user = await new Promise((resolve, reject) => {
            db.get('SELECT total_xp FROM users WHERE id = ?', [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row || { total_xp: 0 });
            });
        });

        const totalXP = user.total_xp || 0;

        // Calculate breakdown percentages
        // This is a simplified version - in production you'd track actual sources
        const sources = {
            lessons: Math.floor(totalXP * 0.40),      // 40% from lessons
            simulators: Math.floor(totalXP * 0.30),   // 30% from simulators
            quizzes: Math.floor(totalXP * 0.15),      // 15% from quizzes
            dailyLogin: Math.floor(totalXP * 0.10),   // 10% from daily login
            streakBonus: Math.floor(totalXP * 0.05)   // 5% from streak bonus
        };

        // Get weekly and monthly XP from transactions
        const weeklyXP = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COALESCE(SUM(xp_amount), 0) as total FROM xp_transactions 
                WHERE user_id = ? AND created_at >= datetime('now', '-7 days')
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row.total);
            });
        });

        const monthlyXP = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COALESCE(SUM(xp_amount), 0) as total FROM xp_transactions 
                WHERE user_id = ? AND created_at >= datetime('now', '-30 days')
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row.total);
            });
        });

        // Get recent activity with more details
        const recentActivity = await new Promise((resolve, reject) => {
            db.all(`
                SELECT xt.*, COALESCE(l.title, s.title, 'نشاط') as item_title
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
router.get('/learning-progress', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get enrolled tracks with progress
        const enrolledTracks = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    t.*,
                    ue.progress,
                    ue.last_accessed,
                    ue.is_completed,
                    ue.current_lesson_id
                FROM user_enrollments ue
                JOIN tracks t ON ue.track_id = t.id
                WHERE ue.user_id = ? AND ue.item_type = 'track'
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        // Get completed lessons
        const completedLessons = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    lp.*,
                    l.title as lesson_title,
                    l.duration,
                    l.xp_reward,
                    u.title as unit_title,
                    c.title as course_title,
                    t.title as track_title
                FROM lesson_progress lp
                JOIN lessons l ON lp.lesson_id = l.id
                JOIN units u ON l.unit_id = u.id
                JOIN courses c ON u.course_id = c.id
                JOIN tracks t ON c.track_id = t.id
                WHERE lp.user_id = ? AND lp.is_completed = 1
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        // Get in-progress lessons
        const inProgressLessons = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    lp.*,
                    l.title as lesson_title,
                    l.duration,
                    l.xp_reward,
                    u.title as unit_title,
                    c.title as course_title,
                    t.title as track_title
                FROM lesson_progress lp
                JOIN lessons l ON lp.lesson_id = l.id
                JOIN units u ON l.unit_id = u.id
                JOIN courses c ON u.course_id = c.id
                JOIN tracks t ON c.track_id = t.id
                WHERE lp.user_id = ? AND lp.is_completed = 0 AND lp.progress > 0
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
        const totalLessons = completedLessons.length + inProgressLessons.length;
        const overallProgress = totalLessons > 0 
            ? Math.round((completedLessons.length / totalLessons) * 100)
            : 0;

        res.json({
            success: true,
            enrolledTracks: enrolledTracks.map(track => ({
                ...track,
                courses: [] // Would be populated with actual course data
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

// Get learning statistics
router.get('/learning-stats', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get count of completed lessons
        const completedLessons = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as count FROM lesson_progress 
                WHERE user_id = ? AND is_completed = 1
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.count || 0);
            });
        });

        // Get count of completed tracks
        const completedTracks = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as count FROM user_enrollments 
                WHERE user_id = ? AND item_type = 'track' AND is_completed = 1
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.count || 0);
            });
        });

        // Get in-progress lessons count
        const inProgressLessons = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as count FROM lesson_progress 
                WHERE user_id = ? AND is_completed = 0 AND progress > 0
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row?.count || 0);
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

// Record lesson access (for progress tracking)
router.post('/lesson-access', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { lessonId, action } = req.body;

        // Update or insert lesson progress
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

        // Update user streak
        await updateUserStreak(userId);

        res.json({ success: true, message: 'Lesson access recorded' });
    } catch (error) {
        console.error('Error recording lesson access:', error);
        res.status(500).json({ success: false, error: 'Failed to record lesson access' });
    }
});

// Complete lesson and award XP
router.post('/complete-lesson', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { lessonId } = req.body;

        // Get lesson details for XP
        const lesson = await new Promise((resolve, reject) => {
            db.get('SELECT xp_reward, duration FROM lessons WHERE id = ?', [lessonId], (err, row) => {
                if (err) reject(err);
                else resolve(row || { xp_reward: 50, duration: 15 });
            });
        });

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
            `, [userId, lessonId, lesson.xp_reward, lesson.xp_reward], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Award XP
        await awardXP(userId, lesson.xp_reward, 'lessons', lessonId, `Completed lesson: ${lessonId}`);

        // Update user total XP
        await new Promise((resolve, reject) => {
            db.run(`
                UPDATE users 
                SET total_xp = total_xp + ?, 
                    completed_lessons = completed_lessons + 1,
                    updated_at = datetime('now')
                WHERE id = ?
            `, [lesson.xp_reward, userId], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Update streak
        await updateUserStreak(userId);

        res.json({
            success: true,
            message: 'Lesson completed',
            xpEarned: lesson.xp_reward
        });
    } catch (error) {
        console.error('Error completing lesson:', error);
        res.status(500).json({ success: false, error: 'Failed to complete lesson' });
    }
});

// Helper function to award XP
async function awardXP(userId, amount, source, referenceId, description) {
    return new Promise((resolve, reject) => {
        db.run(`
            INSERT INTO xp_transactions (user_id, xp_amount, source, reference_id, description, created_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'))
        `, [userId, amount, source, referenceId, description], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

// Helper function to update user streak
async function updateUserStreak(userId) {
    return new Promise((resolve, reject) => {
        db.get(`
            SELECT current_streak, last_activity_date FROM user_streaks 
            WHERE user_id = ?
        `, [userId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }

            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

            let newStreak = 1;
            if (row) {
                const lastDate = row.last_activity_date?.split('T')[0];
                if (lastDate === today) {
                    // Already active today
                    resolve();
                    return;
                } else if (lastDate === yesterday) {
                    // Continue streak
                    newStreak = (row.current_streak || 0) + 1;
                }
            }

            // Update streak
            db.run(`
                INSERT INTO user_streaks (user_id, current_streak, last_activity_date, longest_streak)
                VALUES (?, ?, datetime('now'), ?)
                ON CONFLICT(user_id) DO UPDATE SET
                current_streak = ?,
                last_activity_date = datetime('now'),
                longest_streak = MAX(longest_streak, ?)
            `, [userId, newStreak, newStreak, newStreak, newStreak], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
}

module.exports = router;
