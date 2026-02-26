const express = require('express');
const { requireAuth } = require('../middleware/rbacMiddleware');
const { prisma } = require('../models/prismaDatabase');
const { updateStreak, getStreak, awardStreakBonus } = require('../services/streakService');

const router = express.Router();

// Get comprehensive XP stats from all sources
router.get('/xp-stats', requireAuth, async (req, res) => {
    try {
        const userId = req.userId;

        // Get total XP from user table
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { total_xp: true }
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

        // Get weekly and monthly XP, and breakdown in parallel
        const [weeklyXP, monthlyXP, xpBySource, recentActivity] = await Promise.all([
            prisma.xp_transactions.aggregate({
                where: {
                    user_id: userId,
                    created_at: { gte: sevenDaysAgo }
                },
                _sum: { xp_amount: true }
            }),
            prisma.xp_transactions.aggregate({
                where: {
                    user_id: userId,
                    created_at: { gte: thirtyDaysAgo }
                },
                _sum: { xp_amount: true }
            }),
            prisma.xp_transactions.groupBy({
                by: ['source'],
                where: { user_id: userId },
                _sum: { xp_amount: true }
            }),
            prisma.xp_transactions.findMany({
                where: { user_id: userId },
                orderBy: { created_at: 'desc' },
                take: 10
            })
        ]);

        const sources = {
            lessons: 0,
            simulators: 0,
            quizzes: 0,
            dailyLogin: 0,
            streakBonus: 0,
            articleRead: 0
        };

        xpBySource.forEach(item => {
            if (sources.hasOwnProperty(item.source)) {
                sources[item.source] = item._sum.xp_amount || 0;
            }
        });

        res.json({
            success: true,
            totalXP: user.total_xp || 0,
            weeklyXP: weeklyXP._sum.xp_amount || 0,
            monthlyXP: monthlyXP._sum.xp_amount || 0,
            sources: sources,
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

        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { total_xp: true }
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

        // Get stats in parallel
        const [xpBySource, weeklyXP, monthlyXP, recentActivity] = await Promise.all([
            prisma.xp_transactions.groupBy({
                by: ['source'],
                where: { user_id: userId },
                _sum: { xp_amount: true }
            }),
            prisma.xp_transactions.aggregate({
                where: {
                    user_id: userId,
                    created_at: { gte: sevenDaysAgo }
                },
                _sum: { xp_amount: true }
            }),
            prisma.xp_transactions.aggregate({
                where: {
                    user_id: userId,
                    created_at: { gte: thirtyDaysAgo }
                },
                _sum: { xp_amount: true }
            }),
            prisma.xp_transactions.findMany({
                where: { user_id: userId },
                include: {
                    // This is a bit tricky with dynamic relations, 
                    // we'll handle title logic in map if needed or just use description
                },
                orderBy: { created_at: 'desc' },
                take: 10
            })
        ]);

        const sourcesResult = {
            lessons: 0,
            simulators: 0,
            quizzes: 0,
            dailyLogin: 0,
            streakBonus: 0
        };

        xpBySource.forEach(item => {
            if (sourcesResult.hasOwnProperty(item.source)) {
                sourcesResult[item.source] = item._sum.xp_amount || 0;
            }
        });

        // For item titles, we'd need to fetch them separately if they are not in description
        // For simplicity and since description usually has the title, we'll use that.

        res.json({
            success: true,
            total: user.total_xp || 0,
            weekly: weeklyXP._sum.xp_amount || 0,
            monthly: monthlyXP._sum.xp_amount || 0,
            sources: sourcesResult,
            recentActivity: recentActivity.map(activity => ({
                id: activity.id,
                type: activity.source,
                title: activity.description,
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

        // Get data in parallel
        const [enrolledTracks, lessonProgress, totalLearningTime, streakData, totalLessons] = await Promise.all([
            prisma.user_enrollments.findMany({
                where: { user_id: userId, type: 'track' },
                include: {
                    // Need to check relationship name in schema, assuming 'tracks'
                }
            }),
            prisma.lesson_progress.findMany({
                where: { user_id: userId },
                include: {
                    lessons: {
                        include: {
                            units: {
                                include: {
                                    courses: {
                                        include: {
                                            tracks: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: { last_accessed: 'desc' }
            }),
            prisma.lesson_progress.aggregate({
                where: { user_id: userId },
                _sum: { time_spent: true }
            }),
            prisma.user_streaks.findUnique({
                where: { user_id: userId }
            }),
            prisma.lessons.count()
        ]);

        // Fetch tracks separately due to potential naming issues or missing relations in findMany
        const trackIds = enrolledTracks.map(ue => ue.item_id);
        const tracks = await prisma.tracks.findMany({
            where: { id: { in: trackIds } }
        });

        const completedLessons = lessonProgress.filter(lp => lp.is_completed);
        const inProgressLessons = lessonProgress.filter(lp => !lp.is_completed && (lp.progress || 0) > 0);

        const overallProgress = Math.round((completedLessons.length / (totalLessons || 1)) * 100);

        res.json({
            success: true,
            enrolledTracks: enrolledTracks.map(ue => {
                const track = tracks.find(t => t.id === ue.item_id);
                return {
                    id: ue.item_id,
                    title: track?.title || 'Unknown Track',
                    description: track?.description,
                    icon: track?.icon,
                    progress: ue.progress || 0,
                    is_completed: ue.is_completed ? 1 : 0,
                    last_accessed: ue.last_accessed
                };
            }),
            completedLessons: completedLessons.map(lp => ({
                id: lp.lesson_id,
                title: lp.lessons?.title,
                track_title: lp.lessons?.units?.courses?.tracks?.title,
                course_title: lp.lessons?.units?.courses?.title,
                unit_title: lp.lessons?.units?.title,
                completed_at: lp.completed_at,
                xp_earned: lp.xp_earned
            })),
            inProgressLessons: inProgressLessons.map(lp => ({
                id: lp.lesson_id,
                title: lp.lessons?.title,
                track_title: lp.lessons?.units?.courses?.tracks?.title,
                course_title: lp.lessons?.units?.courses?.title,
                unit_title: lp.lessons?.units?.title,
                progress: lp.progress,
                last_accessed: lp.last_accessed
            })),
            overallProgress,
            totalLearningTime: totalLearningTime._sum.time_spent || 0,
            currentStreak: streakData?.current_streak || 0,
            lastActivity: streakData?.last_activity_date
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

        const [completedLessons, completedTracks, inProgressLessons, totalLearningTime] = await Promise.all([
            prisma.lesson_progress.count({
                where: { user_id: userId, is_completed: true }
            }),
            prisma.user_enrollments.count({
                where: { user_id: userId, type: 'track', is_completed: true }
            }),
            prisma.lesson_progress.count({
                where: { user_id: userId, is_completed: false, progress: { gt: 0 } }
            }),
            prisma.lesson_progress.aggregate({
                where: { user_id: userId },
                _sum: { time_spent: true }
            })
        ]);

        res.json({
            success: true,
            completedLessons,
            completedTracks,
            inProgressLessons,
            totalLearningTime: totalLearningTime._sum.time_spent || 0
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
        const { lessonId } = req.body;

        await prisma.lesson_progress.upsert({
            where: {
                user_id_lesson_id: {
                    user_id: userId,
                    lesson_id: parseInt(lessonId)
                }
            },
            update: {
                last_accessed: new Date(),
                updated_at: new Date()
            },
            create: {
                user_id: userId,
                lesson_id: parseInt(lessonId),
                progress: 0,
                last_accessed: new Date(),
                updated_at: new Date()
            }
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
        const lesson = await prisma.lessons.findUnique({
            where: { id: parseInt(lessonId) },
            select: { xp_reward: true }
        });

        const xpReward = lesson?.xp_reward || 50;

        await prisma.$transaction([
            // Mark lesson as completed
            prisma.lesson_progress.upsert({
                where: {
                    user_id_lesson_id: {
                        user_id: userId,
                        lesson_id: parseInt(lessonId)
                    }
                },
                update: {
                    is_completed: true,
                    progress: 100,
                    completed_at: new Date(),
                    xp_earned: xpReward,
                    updated_at: new Date()
                },
                create: {
                    user_id: userId,
                    lesson_id: parseInt(lessonId),
                    is_completed: true,
                    progress: 100,
                    completed_at: new Date(),
                    xp_earned: xpReward,
                    updated_at: new Date()
                }
            }),
            // Award XP
            prisma.xp_transactions.create({
                data: {
                    user_id: userId,
                    xp_amount: xpReward,
                    source: 'lessons',
                    reference_id: parseInt(lessonId),
                    description: 'Completed lesson'
                }
            }),
            // Update user total XP
            prisma.users.update({
                where: { id: userId },
                data: {
                    total_xp: {
                        increment: xpReward
                    }
                }
            })
        ]);

        // Update streak (This uses its own services which should be updated to Prisma)
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

        const [bookmarksCount, likesCount, readingListCount] = await Promise.all([
            prisma.bookmarks.count({ where: { user_id: userId } }),
            prisma.likes.count({ where: { user_id: userId } }),
            prisma.reading_list.count({ where: { user_id: userId } })
        ]);

        res.json({
            success: true,
            bookmarks: bookmarksCount,
            likes: likesCount,
            reading_list: readingListCount
        });
    } catch (error) {
        console.error('Error fetching saved count:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch saved count' });
    }
});

module.exports = router;
