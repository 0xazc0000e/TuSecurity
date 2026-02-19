const { db } = require('../models/database');

// Get comprehensive dashboard statistics
async function getDashboardStats() {
    try {
        const stats = await new Promise((resolve, reject) => {
            db.get(`
                SELECT
                    (SELECT COUNT(*) FROM users) as total_users,
                    (SELECT COUNT(*) FROM users WHERE date(created_at) = date('now')) as new_users_today,
                    (SELECT COUNT(*) FROM users WHERE created_at >= datetime('now', '-7 days')) as new_users_week,
                    (SELECT COUNT(*) FROM users WHERE role = 'admin') as admin_count,
                    (SELECT COUNT(*) FROM tracks) as total_tracks,
                    (SELECT COUNT(*) FROM courses) as total_courses,
                    (SELECT COUNT(*) FROM lessons) as total_lessons,
                    (SELECT COUNT(*) FROM simulators) as total_simulators,
                    (SELECT COUNT(*) FROM club_events) as total_events,
                    (SELECT COUNT(*) FROM news) as total_news,
                    (SELECT COUNT(*) FROM lesson_progress WHERE is_completed = 1) as total_lesson_completions,
                    (SELECT COUNT(*) FROM lesson_progress WHERE is_completed = 1 AND completed_at >= datetime('now', '-7 days')) as completions_this_week,
                    (SELECT SUM(xp_amount) FROM xp_transactions) as total_xp_awarded,
                    (SELECT COUNT(*) FROM bookmarks) as total_bookmarks,
                    (SELECT COUNT(*) FROM likes) as total_likes
            `, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        // Get active users (completed something in last 7 days)
        const activeUsers = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(DISTINCT user_id) as count
                FROM lesson_progress
                WHERE completed_at >= datetime('now', '-7 days')
            `, (err, row) => {
                if (err) reject(err);
                else resolve(row?.count || 0);
            });
        });

        return {
            ...stats,
            active_users_this_week: activeUsers
        };
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        throw error;
    }
}

// Get user activity report
async function getUserActivityReport(days = 30) {
    try {
        const activities = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    activity_type,
                    COUNT(*) as count,
                    date(created_at) as date
                FROM user_activity
                WHERE created_at >= datetime('now', '-${days} days')
                GROUP BY activity_type, date(created_at)
                ORDER BY date DESC
            `, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        // Aggregate by type
        const byType = {};
        const byDate = {};

        activities.forEach(activity => {
            // By type
            if (!byType[activity.activity_type]) {
                byType[activity.activity_type] = 0;
            }
            byType[activity.activity_type] += activity.count;

            // By date
            if (!byDate[activity.date]) {
                byDate[activity.date] = 0;
            }
            byDate[activity.date] += activity.count;
        });

        return {
            raw: activities,
            byType,
            byDate,
            total: activities.reduce((sum, a) => sum + a.count, 0)
        };
    } catch (error) {
        console.error('Error getting user activity report:', error);
        throw error;
    }
}

// Get top users by XP
async function getTopUsers(limit = 10) {
    try {
        const users = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    u.id,
                    u.username,
                    u.email,
                    u.full_name,
                    u.total_xp,
                    u.role,
                    u.created_at,
                    (SELECT COUNT(*) FROM lesson_progress WHERE user_id = u.id AND is_completed = 1) as completed_lessons,
                    (SELECT COUNT(*) FROM user_badges WHERE user_id = u.id) as badges_count,
                    (SELECT current_streak FROM user_streaks WHERE user_id = u.id) as streak
                FROM users u
                ORDER BY u.total_xp DESC
                LIMIT ?
            `, [limit], (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        return users;
    } catch (error) {
        console.error('Error getting top users:', error);
        throw error;
    }
}

// Get content performance report
async function getContentPerformanceReport() {
    try {
        // Track performance
        const tracks = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    t.id,
                    t.title,
                    (SELECT COUNT(*) FROM user_enrollments WHERE item_id = t.id AND type = 'track') as enrollments,
                    (SELECT COUNT(DISTINCT lp.user_id) FROM lesson_progress lp
                     JOIN lessons l ON lp.lesson_id = l.id
                     JOIN units u ON l.unit_id = u.id
                     JOIN courses c ON u.course_id = c.id
                     WHERE c.track_id = t.id AND lp.is_completed = 1) as active_learners
                FROM tracks t
            `, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        // Most completed lessons
        const topLessons = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    l.id,
                    l.title,
                    COUNT(lp.user_id) as completion_count
                FROM lessons l
                JOIN lesson_progress lp ON l.id = lp.lesson_id
                WHERE lp.is_completed = 1
                GROUP BY l.id
                ORDER BY completion_count DESC
                LIMIT 10
            `, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        // Popular simulators
        const simulators = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    s.id,
                    s.title,
                    s.type,
                    (SELECT COUNT(*) FROM user_activity WHERE activity_type = 'simulator_completed' AND 
                     description LIKE '%' || s.title || '%') as completion_count
                FROM simulators s
                ORDER BY completion_count DESC
            `, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        return {
            tracks,
            topLessons,
            simulators
        };
    } catch (error) {
        console.error('Error getting content performance:', error);
        throw error;
    }
}

// Get engagement metrics
async function getEngagementMetrics() {
    try {
        // Daily active users (last 30 days)
        const dau = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    date(created_at) as date,
                    COUNT(DISTINCT user_id) as active_users
                FROM user_activity
                WHERE created_at >= datetime('now', '-30 days')
                GROUP BY date(created_at)
                ORDER BY date ASC
            `, (err, rows) => {
                if (err) reject(err);
                else resolve(rows || []);
            });
        });

        // Average session metrics (estimated from activity)
        const avgLessonsPerUser = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    ROUND(AVG(lesson_count), 2) as avg_lessons
                FROM (
                    SELECT COUNT(*) as lesson_count
                    FROM lesson_progress
                    WHERE is_completed = 1
                    GROUP BY user_id
                )
            `, (err, row) => {
                if (err) reject(err);
                else resolve(row?.avg_lessons || 0);
            });
        });

        // Retention (users who came back after first visit)
        const retention = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    ROUND(
                        (COUNT(DISTINCT CASE WHEN activity_count > 1 THEN user_id END) * 100.0 / 
                        COUNT(DISTINCT user_id)), 2
                    ) as retention_rate
                FROM (
                    SELECT user_id, COUNT(*) as activity_count
                    FROM user_activity
                    GROUP BY user_id
                )
            `, (err, row) => {
                if (err) reject(err);
                else resolve(row?.retention_rate || 0);
            });
        });

        return {
            dailyActiveUsers: dau,
            averageLessonsPerUser: avgLessonsPerUser,
            retentionRate: retention
        };
    } catch (error) {
        console.error('Error getting engagement metrics:', error);
        throw error;
    }
}

// Get system health report
async function getSystemHealthReport() {
    try {
        // Database size (approximate)
        const dbStats = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    (SELECT COUNT(*) FROM users) as users,
                    (SELECT COUNT(*) FROM tracks) as tracks,
                    (SELECT COUNT(*) FROM courses) as courses,
                    (SELECT COUNT(*) FROM lessons) as lessons,
                    (SELECT COUNT(*) FROM lesson_progress) as progress_records,
                    (SELECT COUNT(*) FROM xp_transactions) as xp_records,
                    (SELECT COUNT(*) FROM user_activity) as activity_records
            `, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        // Recent errors (from logs if available)
        const recentErrors = await new Promise((resolve, reject) => {
            db.all(`
                SELECT action, details, timestamp
                FROM logs
                WHERE action LIKE '%error%' OR action LIKE '%fail%'
                ORDER BY timestamp DESC
                LIMIT 10
            `, (err, rows) => {
                if (err) resolve([]); // Logs might not exist or be empty
                else resolve(rows || []);
            });
        });

        return {
            database: dbStats,
            recentErrors,
            status: recentErrors.length === 0 ? 'healthy' : 'warnings'
        };
    } catch (error) {
        console.error('Error getting system health:', error);
        throw error;
    }
}

// Export functions
module.exports = {
    getDashboardStats,
    getUserActivityReport,
    getTopUsers,
    getContentPerformanceReport,
    getEngagementMetrics,
    getSystemHealthReport
};
