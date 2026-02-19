const { db } = require('../models/database');
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
            await new Promise((resolve, reject) => {
                db.run(`
                    INSERT OR IGNORE INTO badges (name, description, icon, color, requirement_type, requirement_value, xp_reward)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [badge.name, badge.description, badge.icon, badge.color, badge.requirement_type, badge.requirement_value, badge.xp_reward], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }
        console.log('Default badges seeded');
    } catch (error) {
        console.error('Error seeding badges:', error);
    }
}

// Get all badges
async function getAllBadges() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM badges ORDER BY requirement_value ASC', (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

// Get user's earned badges
async function getUserBadges(userId) {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT b.*, ub.earned_at
            FROM badges b
            JOIN user_badges ub ON b.id = ub.badge_id
            WHERE ub.user_id = ?
            ORDER BY ub.earned_at DESC
        `, [userId], (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
}

// Check and award badges for a user
async function checkAndAwardBadges(userId) {
    try {
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
        const badges = await getAllBadges();

        // Get already earned badge IDs
        const earnedBadges = await new Promise((resolve, reject) => {
            db.all('SELECT badge_id FROM user_badges WHERE user_id = ?', [userId], (err, rows) => {
                if (err) reject(err);
                else resolve((rows || []).map(r => r.badge_id));
            });
        });

        const newlyAwarded = [];

        // Check each badge
        for (const badge of badges) {
            if (earnedBadges.includes(badge.id)) continue;

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
                // Award badge
                await new Promise((resolve, reject) => {
                    db.run(`
                        INSERT INTO user_badges (user_id, badge_id, badge_name, earned_at)
                        VALUES (?, ?, ?, datetime('now'))
                    `, [userId, badge.id, badge.name], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                // Award XP for badge
                if (badge.xp_reward > 0) {
                    await new Promise((resolve, reject) => {
                        db.run(`
                            INSERT INTO xp_transactions (user_id, xp_amount, source, description, created_at)
                            VALUES (?, ?, 'badge', ?, datetime('now'))
                        `, [userId, badge.xp_reward, `Earned badge: ${badge.name}`], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });

                    // Update user total XP
                    await new Promise((resolve, reject) => {
                        db.run('UPDATE users SET total_xp = total_xp + ? WHERE id = ?', [badge.xp_reward, userId], (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                }

                // Record activity
                await new Promise((resolve, reject) => {
                    db.run(`
                        INSERT INTO user_activity (user_id, activity_type, description, xp_earned, created_at)
                        VALUES (?, 'badge_earned', ?, ?, datetime('now'))
                    `, [userId, `Earned ${badge.name} badge`, badge.xp_reward || 0], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });

                // Create notification
                await createNotification(userId, `🎉 مبروك!`, `لقد حصلت على وسام ${badge.name}`, 'achievement', null);

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
