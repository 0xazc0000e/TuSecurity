const { prisma } = require('../models/prismaDatabase');

// Get comprehensive dashboard statistics
async function getDashboardStats() {
    try {
        const [
            total_users,
            new_users_today,
            new_users_week,
            admin_count,
            total_tracks,
            total_courses,
            total_lessons,
            total_simulators,
            total_events,
            total_news,
            total_lesson_completions,
            completions_this_week,
            total_xp_awarded_sum,
            total_bookmarks,
            total_likes,
            activeUsersCount
        ] = await Promise.all([
            prisma.users.count(),
            prisma.users.count({ where: { created_at: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
            prisma.users.count({ where: { created_at: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
            prisma.users.count({ where: { role: 'admin' } }),
            prisma.tracks.count(),
            prisma.courses.count(),
            prisma.lessons.count(),
            prisma.simulators.count(),
            prisma.club_events.count(),
            prisma.news.count(),
            prisma.lesson_progress.count({ where: { is_completed: true } }),
            prisma.lesson_progress.count({ where: { is_completed: true, completed_at: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } }),
            prisma.xp_transactions.aggregate({ _sum: { xp_amount: true } }),
            prisma.bookmarks.count(),
            prisma.likes.count(),
            prisma.lesson_progress.groupBy({
                by: ['user_id'],
                where: { completed_at: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
            })
        ]);

        return {
            total_users,
            new_users_today,
            new_users_week,
            admin_count,
            total_tracks,
            total_courses,
            total_lessons,
            total_simulators,
            total_events,
            total_news,
            total_lesson_completions,
            completions_this_week,
            total_xp_awarded: total_xp_awarded_sum._sum.xp_amount || 0,
            total_bookmarks,
            total_likes,
            active_users_this_week: activeUsersCount.length
        };
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        throw error;
    }
}

// Get user activity report
async function getUserActivityReport(days = 30) {
    try {
        // Use raw query for date grouping as Prisma doesn't support it directly
        const activities = await prisma.$queryRaw`
            SELECT 
                activity_type,
                COUNT(*) as count,
                DATE(created_at) as date
            FROM user_activity
            WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
            GROUP BY activity_type, DATE(created_at)
            ORDER BY date DESC
        `;

        // Aggregate by type
        const byType = {};
        const byDate = {};

        activities.forEach(activity => {
            const count = Number(activity.count);
            // By type
            if (!byType[activity.activity_type]) {
                byType[activity.activity_type] = 0;
            }
            byType[activity.activity_type] += count;

            // By date
            const dateStr = activity.date.toISOString().split('T')[0];
            if (!byDate[dateStr]) {
                byDate[dateStr] = 0;
            }
            byDate[dateStr] += count;
        });

        return {
            raw: activities,
            byType,
            byDate,
            total: activities.reduce((sum, a) => sum + Number(a.count), 0)
        };
    } catch (error) {
        console.error('Error getting user activity report:', error);
        throw error;
    }
}

// Get top users by XP
async function getTopUsers(limit = 10) {
    try {
        const users = await prisma.users.findMany({
            take: limit,
            orderBy: { total_xp: 'desc' },
            select: {
                id: true,
                username: true,
                email: true,
                full_name: true,
                total_xp: true,
                role: true,
                created_at: true,
                _count: {
                    select: {
                        lesson_progress: { where: { is_completed: true } },
                        user_badges: true
                    }
                }
            }
        });

        // We also need streak, which is in a separate table
        const usersWithStreaks = await Promise.all(users.map(async (u) => {
            const streak = await prisma.user_streaks.findUnique({
                where: { user_id: u.id },
                select: { current_streak: true }
            });
            return {
                ...u,
                completed_lessons: u._count.lesson_progress,
                badges_count: u._count.user_badges,
                streak: streak?.current_streak || 0
            };
        }));

        return usersWithStreaks;
    } catch (error) {
        console.error('Error getting top users:', error);
        throw error;
    }
}

// Get content performance report
async function getContentPerformanceReport() {
    try {
        // Track performance
        const tracksRaw = await prisma.tracks.findMany({
            select: {
                id: true,
                title: true,
                _count: {
                    select: {
                        user_enrollments: { where: { type: 'track' } }
                    }
                }
            }
        });

        const tracks = await Promise.all(tracksRaw.map(async (t) => {
            // Count distinct learners who completed any lesson in this track
            const activeLearners = await prisma.$queryRaw`
                SELECT COUNT(DISTINCT lp.user_id) as count
                FROM lesson_progress lp
                JOIN lessons l ON lp.lesson_id = l.id
                JOIN units u ON l.unit_id = u.id
                JOIN courses c ON u.course_id = c.id
                WHERE c.track_id = ${t.id} AND lp.is_completed = true
            `;
            return {
                id: t.id,
                title: t.title,
                enrollments: t._count.user_enrollments,
                active_learners: Number(activeLearners[0].count)
            };
        }));

        // Most completed lessons
        const topLessonsRaw = await prisma.lesson_progress.groupBy({
            by: ['lesson_id'],
            where: { is_completed: true },
            _count: { user_id: true },
            orderBy: { _count: { user_id: 'desc' } },
            take: 10
        });

        const topLessons = await Promise.all(topLessonsRaw.map(async (lp) => {
            const lesson = await prisma.lessons.findUnique({
                where: { id: lp.lesson_id },
                select: { title: true }
            });
            return {
                id: lp.lesson_id,
                title: lesson?.title || 'Unknown',
                completion_count: lp._count.user_id
            };
        }));

        // Popular simulators
        const simulatorsRaw = await prisma.simulators.findMany({
            orderBy: { created_at: 'desc' }
        });

        const simulators = await Promise.all(simulatorsRaw.map(async (s) => {
            const completionCount = await prisma.user_activity.count({
                where: {
                    activity_type: 'simulator_completed',
                    description: { contains: s.title }
                }
            });
            return {
                ...s,
                completion_count: completionCount
            };
        }));

        return {
            tracks,
            topLessons,
            simulators: simulators.sort((a, b) => b.completion_count - a.completion_count)
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
        const dau = await prisma.$queryRaw`
            SELECT 
                DATE(created_at) as date,
                COUNT(DISTINCT user_id) as active_users
            FROM user_activity
            WHERE created_at >= NOW() - INTERVAL '30 days'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `;

        // Average session metrics
        const avgLessonsRaw = await prisma.$queryRaw`
            SELECT AVG(lesson_count) as avg_lessons
            FROM (
                SELECT COUNT(*) as lesson_count
                FROM lesson_progress
                WHERE is_completed = true
                GROUP BY user_id
            ) AS sub
        `;
        const avgLessonsPerUser = Number(avgLessonsRaw[0].avg_lessons || 0).toFixed(2);

        // Retention
        const retentionRaw = await prisma.$queryRaw`
            SELECT 
                (COUNT(DISTINCT CASE WHEN activity_count > 1 THEN user_id END) * 100.0 / 
                NULLIF(COUNT(DISTINCT user_id), 0)) as retention_rate
            FROM (
                SELECT user_id, COUNT(*) as activity_count
                FROM user_activity
                GROUP BY user_id
            ) AS sub
        `;
        const retention = Number(retentionRaw[0].retention_rate || 0).toFixed(2);

        return {
            dailyActiveUsers: dau,
            averageLessonsPerUser: Number(avgLessonsPerUser),
            retentionRate: Number(retention)
        };
    } catch (error) {
        console.error('Error getting engagement metrics:', error);
        throw error;
    }
}

// Get system health report
async function getSystemHealthReport() {
    try {
        const [
            users,
            tracks,
            courses,
            lessons,
            progress_records,
            xp_records,
            activity_records
        ] = await Promise.all([
            prisma.users.count(),
            prisma.tracks.count(),
            prisma.courses.count(),
            prisma.lessons.count(),
            prisma.lesson_progress.count(),
            prisma.xp_transactions.count(),
            prisma.user_activity.count()
        ]);

        const dbStats = {
            users, tracks, courses, lessons,
            progress_records, xp_records, activity_records
        };

        // Recent errors from logs
        const recentErrors = await prisma.logs.findMany({
            where: {
                OR: [
                    { action: { contains: 'error' } },
                    { action: { contains: 'fail' } }
                ]
            },
            orderBy: { timestamp: 'desc' },
            take: 10
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
