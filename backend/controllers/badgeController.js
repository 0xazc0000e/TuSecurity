const { prisma } = require('../models/prismaDatabase');
const { getAllBadges, getUserBadges, checkAndAwardBadges } = require('../services/badgeService');

// Get all available badges
exports.getAllBadges = async (req, res) => {
    try {
        const badges = await getAllBadges();
        res.json({ success: true, badges });
    } catch (error) {
        console.error('Error fetching badges:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch badges' });
    }
};

// Get user's earned badges
exports.getUserBadges = async (req, res) => {
    try {
        const userId = req.user.id;
        const badges = await getUserBadges(userId);
        res.json({ success: true, badges });
    } catch (error) {
        console.error('Error fetching user badges:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch user badges' });
    }
};

// Check and award badges for current user
exports.checkBadges = async (req, res) => {
    try {
        const userId = req.user.id;
        const newlyAwarded = await checkAndAwardBadges(userId);
        res.json({
            success: true,
            newlyAwarded,
            message: newlyAwarded.length > 0 ? `Congratulations! You earned ${newlyAwarded.length} new badge(s)` : 'No new badges yet'
        });
    } catch (error) {
        console.error('Error checking badges:', error);
        res.status(500).json({ success: false, error: 'Failed to check badges' });
    }
};

// Get badge progress for user
exports.getBadgeProgress = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user stats using Prisma
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
        const allBadges = await getAllBadges();

        // Get earned badges
        const earnedBadges = await getUserBadges(userId);
        const earnedIds = earnedBadges.map(b => b.id);

        // Calculate progress for each badge
        const badgesWithProgress = allBadges.map(badge => {
            let currentValue = 0;
            switch (badge.requirement_type) {
                case 'xp':
                    currentValue = userStats.total_xp || 0;
                    break;
                case 'lessons':
                    currentValue = userStats.completed_lessons || 0;
                    break;
                case 'streak':
                    currentValue = userStats.streak || 0;
                    break;
                case 'simulators':
                    currentValue = userStats.completed_simulators || 0;
                    break;
                case 'events':
                    currentValue = userStats.attended_events || 0;
                    break;
            }

            const progress = Math.min(100, Math.round((currentValue / badge.requirement_value) * 100));

            return {
                ...badge,
                current_value: currentValue,
                progress,
                is_earned: earnedIds.includes(badge.id),
                earned_at: earnedIds.includes(badge.id) ? earnedBadges.find(eb => eb.id === badge.id)?.earned_at : null
            };
        });

        res.json({
            success: true,
            badges: badgesWithProgress,
            totalBadges: allBadges.length,
            earnedBadges: earnedBadges.length
        });
    } catch (error) {
        console.error('Error fetching badge progress:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch badge progress' });
    }
};

// Admin: Create new badge
exports.createBadge = async (req, res) => {
    try {
        const { name, description, icon, color, requirement_type, requirement_value, xp_reward } = req.body;

        if (!name || !description || !requirement_type || !requirement_value) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const badge = await prisma.badges.create({
            data: {
                name,
                description,
                icon: icon || '🏅',
                color: color || '#f59e0b',
                requirement_type,
                requirement_value,
                xp_reward: xp_reward || 50
            }
        });

        res.status(201).json({
            success: true,
            message: 'Badge created successfully',
            badgeId: badge.id
        });
    } catch (error) {
        console.error('Error creating badge:', error);
        res.status(500).json({ success: false, error: 'Failed to create badge' });
    }
};

// Admin: Delete badge
exports.deleteBadge = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.badges.delete({
            where: { id: parseInt(id) }
        });

        res.json({ success: true, message: 'Badge deleted successfully' });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ success: false, error: 'Badge not found' });
        }
        console.error('Error deleting badge:', error);
        res.status(500).json({ success: false, error: 'Failed to delete badge' });
    }
};
