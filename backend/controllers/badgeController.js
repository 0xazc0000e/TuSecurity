const { requireAuth } = require('../middleware/rbacMiddleware');
const { db } = require('../models/database');
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

        // Get user stats
        const userStats = await new Promise((resolve, reject) => {
            db.get(`
                SELECT 
                    u.total_xp,
                    (SELECT COUNT(*) FROM lesson_progress WHERE user_id = u.id AND is_completed = 1) as completed_lessons,
                    (SELECT current_streak FROM user_streaks WHERE user_id = u.id) as streak,
                    (SELECT COUNT(*) FROM user_activity WHERE user_id = u.id AND activity_type = 'simulator_completed') as completed_simulators,
                    (SELECT COUNT(*) FROM event_registrations WHERE user_id = u.id) as attended_events
                FROM users u
                WHERE u.id = ?
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row || {});
            });
        });

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

        const result = await new Promise((resolve, reject) => {
            db.run(`
                INSERT INTO badges (name, description, icon, color, requirement_type, requirement_value, xp_reward)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [name, description, icon || '🏅', color || '#f59e0b', requirement_type, requirement_value, xp_reward || 50], function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
            });
        });

        res.status(201).json({
            success: true,
            message: 'Badge created successfully',
            badgeId: result
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

        await new Promise((resolve, reject) => {
            db.run('DELETE FROM badges WHERE id = ?', [id], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ success: true, message: 'Badge deleted successfully' });
    } catch (error) {
        console.error('Error deleting badge:', error);
        res.status(500).json({ success: false, error: 'Failed to delete badge' });
    }
};
