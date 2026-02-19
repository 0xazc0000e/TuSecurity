const { db } = require('../models/database');

// Update user streak when they complete an activity
const updateStreak = async (userId) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Get current streak data
        const streakData = await new Promise((resolve, reject) => {
            db.get(
                `SELECT current_streak, longest_streak, last_activity_date 
                 FROM user_streaks 
                 WHERE user_id = ?`,
                [userId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row || { current_streak: 0, longest_streak: 0, last_activity_date: null });
                }
            );
        });

        let { current_streak, longest_streak, last_activity_date } = streakData;

        // Check if already active today
        if (last_activity_date === today) {
            return { current_streak, longest_streak, isNewDay: false };
        }

        // Check if this is a consecutive day
        const lastDate = last_activity_date ? new Date(last_activity_date) : null;
        const todayDate = new Date(today);

        if (lastDate) {
            const diffTime = Math.abs(todayDate - lastDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day - increment streak
                current_streak += 1;
            } else if (diffDays > 1) {
                // Streak broken - reset
                current_streak = 1;
            }
        } else {
            // First activity ever
            current_streak = 1;
        }

        // Update longest streak if current is higher
        if (current_streak > longest_streak) {
            longest_streak = current_streak;
        }

        // Save to database
        await new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_activity_date, updated_at)
                 VALUES (?, ?, ?, ?, datetime('now'))
                 ON CONFLICT(user_id) DO UPDATE SET
                 current_streak = ?, longest_streak = ?, last_activity_date = ?, updated_at = datetime('now')`,
                [userId, current_streak, longest_streak, today, current_streak, longest_streak, today],
                function(err) {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });

        return {
            current_streak,
            longest_streak,
            isNewDay: true,
            isMilestone: current_streak % 7 === 0 // Weekly milestone
        };
    } catch (error) {
        console.error('Error updating streak:', error);
        return null;
    }
};

// Get user streak data
const getStreak = async (userId) => {
    try {
        const streakData = await new Promise((resolve, reject) => {
            db.get(
                `SELECT current_streak, longest_streak, last_activity_date 
                 FROM user_streaks 
                 WHERE user_id = ?`,
                [userId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row || { current_streak: 0, longest_streak: 0, last_activity_date: null });
                }
            );
        });

        return streakData;
    } catch (error) {
        console.error('Error getting streak:', error);
        return { current_streak: 0, longest_streak: 0, last_activity_date: null };
    }
};

// Award streak bonus XP
const awardStreakBonus = async (userId, streak) => {
    try {
        // Bonus XP based on streak length
        let bonusXP = 0;
        if (streak >= 30) bonusXP = 100;
        else if (streak >= 14) bonusXP = 50;
        else if (streak >= 7) bonusXP = 25;
        else if (streak >= 3) bonusXP = 10;

        if (bonusXP > 0) {
            // Add XP transaction
            await new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO xp_transactions (user_id, xp_amount, source, description, created_at)
                     VALUES (?, ?, 'streakBonus', ?, datetime('now'))`,
                    [userId, bonusXP, `${streak} day streak bonus!`],
                    function(err) {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });

            // Update user total XP
            await new Promise((resolve, reject) => {
                db.run(
                    `UPDATE users SET total_xp = total_xp + ? WHERE id = ?`,
                    [bonusXP, userId],
                    function(err) {
                        if (err) reject(err);
                        else resolve();
                    }
                );
            });
        }

        return bonusXP;
    } catch (error) {
        console.error('Error awarding streak bonus:', error);
        return 0;
    }
};

module.exports = {
    updateStreak,
    getStreak,
    awardStreakBonus
};
