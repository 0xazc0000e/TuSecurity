const { prisma } = require('../models/prismaDatabase');

// Update user streak when they complete an activity
const updateStreak = async (userId) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Get current streak data
        let streakData = await prisma.user_streaks.findUnique({
            where: { user_id: userId }
        });

        if (!streakData) {
            streakData = { current_streak: 0, longest_streak: 0, last_activity_date: null };
        }

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

        // Save to database using upsert
        await prisma.user_streaks.upsert({
            where: { user_id: userId },
            update: {
                current_streak,
                longest_streak,
                last_activity_date: today,
                updated_at: new Date()
            },
            create: {
                user_id: userId,
                current_streak,
                longest_streak,
                last_activity_date: today,
                updated_at: new Date()
            }
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
        const streakData = await prisma.user_streaks.findUnique({
            where: { user_id: userId }
        });

        return streakData || { current_streak: 0, longest_streak: 0, last_activity_date: null };
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
            await prisma.$transaction([
                // Add XP transaction
                prisma.xp_transactions.create({
                    data: {
                        user_id: userId,
                        xp_amount: bonusXP,
                        source: 'streakBonus',
                        description: `${streak} day streak bonus!`,
                        created_at: new Date()
                    }
                }),
                // Update user total XP
                prisma.users.update({
                    where: { id: userId },
                    data: { total_xp: { increment: bonusXP } }
                })
            ]);
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
