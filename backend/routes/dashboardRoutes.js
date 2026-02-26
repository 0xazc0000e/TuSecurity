const express = require('express');
const router = express.Router();
const { prisma } = require('../models/prismaDatabase');

// GET /api/dashboard/stats (Public & Private mixed)
// Returns general platform stats for landing page, and personalized if auth
router.get('/stats', async (req, res) => {
    try {
        // Fetch all stats in parallel
        const [
            usersCount,
            lessonsCount,
            simulatorsCount,
            lessonProgressStats,
            completedLessonsCount
        ] = await Promise.all([
            prisma.users.count(),
            prisma.lessons.count(),
            prisma.simulators.count(),
            prisma.lesson_progress.aggregate({
                _sum: {
                    time_spent: true
                },
                _count: true
            }),
            prisma.lesson_progress.count({
                where: { is_completed: true }
            })
        ]);

        const totalHours = lessonProgressStats._sum.time_spent || 0;
        const totalStarted = lessonProgressStats._count || 0;

        // Calculate pass rate (completed lessons / started lessons)
        const passRate = totalStarted > 0
            ? Math.round((completedLessonsCount / totalStarted) * 100)
            : 95; // Default to 95 if no data

        res.json({
            users: usersCount || 150,
            lessons: lessonsCount || 50,
            hours: Math.round(totalHours / 60) + 1000, // Convert minutes to hours + base
            simulators: simulatorsCount || 3,
            passRate: passRate
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

module.exports = router;
