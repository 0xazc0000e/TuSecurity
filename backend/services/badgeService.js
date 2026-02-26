const { prisma } = require('../models/prismaDatabase');
const { createNotification } = require('../controllers/notificationController');

// Default badges to seed
const DEFAULT_BADGES = [
    {
        name: 'المبتدئ',
        description: 'أكمل أول درس لك',
        icon: '🌟',
        color: '#22c55e',
        requirement_type: 'lessons',
        requirement_value: 1,
        xp_reward: 10
    },
    {
        name: 'الطالب المجتهد',
        description: 'أكمل 10 دروس',
        icon: '📚',
        color: '#3b82f6',
        requirement_type: 'lessons',
        requirement_value: 10,
        xp_reward: 50
    },
    {
        name: 'خبير الأمن',
        description: 'أكمل 50 درس',
        icon: '🛡️',
        color: '#8b5cf6',
        requirement_type: 'lessons',
        requirement_value: 50,
        xp_reward: 200
    },
    {
        name: 'المتصدر',
        description: 'احصل على 1000 XP',
        icon: '🏆',
        color: '#f59e0b',
        requirement_type: 'xp',
        requirement_value: 1000,
        xp_reward: 100
    },
    {
        name: 'أسطورة الأمن السيبراني',
        description: 'احصل على 10000 XP',
        icon: '👑',
        color: '#ef4444',
        requirement_type: 'xp',
        requirement_value: 10000,
        xp_reward: 500
    },
    {
        name: 'المحافظ على التوالي',
        description: 'حافظ على توالٍ لمدة 7 أيام',
        icon: '🔥',
        color: '#f97316',
        requirement_type: 'streak',
        requirement_value: 7,
        xp_reward: 100
    },
    {
        name: 'المحترف',
        description: 'أكمل 5 محاكيات',
        icon: '💻',
        color: '#06b6d4',
        requirement_type: 'simulators',
        requirement_value: 5,
        xp_reward: 150
    },
    {
        name: 'المشارك النشط',
        description: 'شارك في 3 فعاليات',
        icon: '🎉',
        color: '#ec4899',
        requirement_type: 'events',
        requirement_value: 3,
        xp_reward: 100
    }
];

// Seed default badges
async function seedBadges() {
    try {
        for (const badge of DEFAULT_BADGES) {
            await prisma.badges.upsert({
                where: { name: badge.name },
                update: {},
                create: {
                    name: badge.name,
                    description: badge.description,
                    icon: badge.icon,
                    color: badge.color,
                    requirement_type: badge.requirement_type,
                    requirement_value: badge.requirement_value,
                    xp_reward: badge.xp_reward
                }
            });
        }
        console.log('Default badges seeded');
    } catch (error) {
        console.error('Error seeding badges:', error);
    }
}

// Get all badges
async function getAllBadges() {
    try {
        return await prisma.badges.findMany({
            orderBy: { requirement_value: 'asc' }
        });
    } catch (error) {
        console.error('Error fetching all badges:', error);
        throw error;
    }
}

// Get user's earned badges
async function getUserBadges(userId) {
    try {
        const userBadges = await prisma.user_badges.findMany({
            where: { user_id: userId },
            include: { badges: true },
            orderBy: { earned_at: 'desc' }
        });

        return userBadges.map(ub => ({
            ...ub.badges,
            earned_at: ub.earned_at
        }));
    } catch (error) {
        console.error('Error fetching user badges:', error);
        throw error;
    }
}

// Check and award badges for a user
async function checkAndAwardBadges(userId) {
    try {
        // Get user stats directly using Prisma
        const [totalXp, completedLessons, streak, completedSimulators, attendedEvents] = await Promise.all([
            prisma.users.findUnique({ where: { id: userId }, select: { total_xp: true } }).then(u => u?.total_xp || 0),
            prisma.lesson_progress.count({ where: { user_id: userId, is_completed: true } }),
            prisma.user_streaks.findUnique({ where: { user_id: userId }, select: { current_streak: true } }).then(s => s?.current_streak || 0),
            prisma.user_activity.count({ where: { user_id: userId, activity_type: 'simulator_completed' } }),
            prisma.event_registrations.count({ where: { user_id: userId } })
        ]);

        const userStats = {
            total_xp: totalXp,
            completed_lessons: completedLessons,
            streak: streak,
            completed_simulators: completedSimulators,
            attended_events: attendedEvents
        };

        // Get all badges
        const badges = await getAllBadges();

        // Get already earned badge IDs
        const earnedBadgeIds = await prisma.user_badges.findMany({
            where: { user_id: userId },
            select: { badge_id: true }
        }).then(rows => rows.map(r => r.badge_id).filter(Boolean));

        const newlyAwarded = [];

        // Check each badge
        for (const badge of badges) {
            if (earnedBadgeIds.includes(badge.id)) continue;

            let requirementMet = false;
            switch (badge.requirement_type) {
                case 'xp':
                    requirementMet = (userStats.total_xp || 0) >= badge.requirement_value;
                    break;
                case 'lessons':
                    requirementMet = (userStats.completed_lessons || 0) >= badge.requirement_value;
                    break;
                case 'streak':
                    requirementMet = (userStats.streak || 0) >= badge.requirement_value;
                    break;
                case 'simulators':
                    requirementMet = (userStats.completed_simulators || 0) >= badge.requirement_value;
                    break;
                case 'events':
                    requirementMet = (userStats.attended_events || 0) >= badge.requirement_value;
                    break;
            }

            if (requirementMet) {
                // Award badge using transaction if multiple updates
                await prisma.$transaction(async (tx) => {
                    // Award badge
                    await tx.user_badges.create({
                        data: {
                            user_id: userId,
                            badge_id: badge.id,
                            badge_name: badge.name,
                            earned_at: new Date()
                        }
                    });

                    // Award XP for badge
                    if (badge.xp_reward && badge.xp_reward > 0) {
                        await tx.xp_transactions.create({
                            data: {
                                user_id: userId,
                                xp_amount: badge.xp_reward,
                                source: 'badge',
                                description: `Earned badge: ${badge.name}`,
                                created_at: new Date()
                            }
                        });

                        // Update user total XP
                        await tx.users.update({
                            where: { id: userId },
                            data: {
                                total_xp: { increment: badge.xp_reward }
                            }
                        });
                    }

                    // Record activity
                    await tx.user_activity.create({
                        data: {
                            user_id: userId,
                            activity_type: 'badge_earned',
                            description: `Earned ${badge.name} badge`,
                            xp_earned: badge.xp_reward || 0,
                            created_at: new Date()
                        }
                    });
                });

                // Create notification (async, but not in transaction)
                createNotification(userId, `🎉 مبروك!`, `لقد حصلت على وسام ${badge.name}`, 'achievement', null);

                newlyAwarded.push(badge);
            }
        }

        return newlyAwarded;
    } catch (error) {
        console.error('Error checking badges:', error);
        throw error;
    }
}

module.exports = {
    seedBadges,
    getAllBadges,
    getUserBadges,
    checkAndAwardBadges
};
