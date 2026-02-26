const { prisma } = require('../models/prismaDatabase');

// Get all simulators
exports.getAllSimulators = async (req, res) => {
    try {
        const simulators = await prisma.simulators.findMany({
            where: { status: 'active' },
            orderBy: { created_at: 'desc' },
            include: {
                _count: {
                    select: {
                        user_progress: {
                            where: { is_completed: true }
                        }
                    }
                }
            }
        });

        const result = simulators.map(s => ({
            ...s,
            completed_count: s._count.user_progress
        }));

        res.json(result);
    } catch (err) {
        console.error('Get simulators error:', err);
        return res.status(500).json({ error: 'Failed to fetch simulators' });
    }
};

// Get latest 3 simulators limit for homepage
exports.getLatestSimulators = async (req, res) => {
    try {
        const simulators = await prisma.simulators.findMany({
            where: { status: 'active' },
            orderBy: { created_at: 'desc' },
            take: 3
        });
        res.json(simulators);
    } catch (err) {
        console.error('Get latest simulators error:', err);
        return res.status(500).json({ error: 'Failed to fetch latest simulators' });
    }
};

// Get simulator by ID with user progress
exports.getSimulatorById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    try {
        const simulator = await prisma.simulators.findFirst({
            where: {
                id: parseInt(id),
                status: 'active'
            }
        });

        if (!simulator) {
            return res.status(404).json({ error: 'Simulator not found' });
        }

        let progress = null;
        if (userId) {
            progress = await prisma.user_progress.findUnique({
                where: {
                    user_id_simulator_id: {
                        user_id: userId,
                        simulator_id: parseInt(id)
                    }
                }
            });
        }

        res.json({
            ...simulator,
            user_progress: progress || {
                current_module: 0,
                is_completed: 0,
                score: 0,
                completed_lessons: '[]',
                role_data: '{}'
            }
        });
    } catch (err) {
        console.error('Get simulator error:', err);
        return res.status(500).json({ error: 'Failed to fetch simulator' });
    }
};

// Validate Simulator Mission securely on Backend
exports.validateMission = async (req, res) => {
    const userId = req.user.id;
    const { simulator_id, mission_id, command } = req.body;

    if (!simulator_id || mission_id === undefined || !command) {
        return res.status(400).json({ error: 'Missing required validation data' });
    }

    // Hardcoded mission verification logic (In production, this should come from DB/Config)
    // For Bash Simulator
    const bashMissions = {
        1: { expectedCmds: ['ls', 'ls -l', 'ls -la'], xpReward: 10 },
        2: { expectedCmds: ['cd documents', 'cd Documents', 'cd ./Documents'], xpReward: 15 },
        3: { expectedCmds: ['cat secret.txt', 'cat ./secret.txt'], xpReward: 20 },
        4: { expectedCmds: ['grep "password" system.log', 'grep password system.log'], xpReward: 25 },
        5: { expectedCmds: ['rm old_log.txt', 'rm ./old_log.txt'], xpReward: 15 },
        6: { expectedCmds: ['mkdir backups', 'mkdir ./backups'], xpReward: 10 },
        7: { expectedCmds: ['touch new_script.sh', 'touch ./new_script.sh'], xpReward: 10 },
        8: { expectedCmds: ['chmod +x new_script.sh', 'chmod 755 new_script.sh'], xpReward: 25 },
        9: { expectedCmds: ['pwd'], xpReward: 5 },
        10: { expectedCmds: ['cp secret.txt backups/secret_backup.txt', 'cp secret.txt ./backups/secret_backup.txt'], xpReward: 20 },
    };

    const mission = bashMissions[mission_id];

    if (!mission) {
        return res.status(404).json({ error: 'Mission not found or no validation defined' });
    }

    const isMatch = mission.expectedCmds.some(expected =>
        command.trim() === expected ||
        command.trim().startsWith(expected + ' ') // simplistic check for flags
    );

    if (isMatch) {
        try {
            await prisma.users.update({
                where: { id: userId },
                data: {
                    total_xp: { increment: mission.xpReward }
                }
            });

            // Re-check badges
            checkAndAwardBadges(userId);

            res.json({
                success: true,
                message: 'Mission validated successfully',
                xpAwarded: mission.xpReward
            });
        } catch (err) {
            console.error('Update XP error during validation:', err);
            return res.status(500).json({ error: 'Verified, but failed to grant XP' });
        }
    } else {
        res.status(400).json({ success: false, error: 'Command validation failed. Incorrect command for this mission.' });
    }
};

// Save Bash Simulator Progress
exports.saveBashProgress = async (req, res) => {
    const userId = req.user.id;
    const { simulator_id, current_module, completed_lessons, score } = req.body;

    if (!simulator_id) {
        return res.status(400).json({ error: 'Simulator ID is required' });
    }

    const completedLessonsJson = JSON.stringify(completed_lessons || []);
    const isCompleted = completed_lessons?.length >= 32; // All 32 lessons completed

    try {
        const result = await prisma.user_progress.upsert({
            where: {
                user_id_simulator_id: {
                    user_id: userId,
                    simulator_id: parseInt(simulator_id)
                }
            },
            update: {
                current_module,
                completed_lessons: completedLessonsJson,
                score,
                is_completed: isCompleted,
                last_accessed: new Date()
            },
            create: {
                user_id: userId,
                simulator_id: parseInt(simulator_id),
                current_module,
                completed_lessons: completedLessonsJson,
                score,
                is_completed: isCompleted
            }
        });

        if (isCompleted) {
            updateUserXP(userId, 500); // 500 XP for completing Bash simulator
        }

        res.json({ message: 'Progress saved successfully', is_completed: isCompleted });
    } catch (err) {
        console.error('Save progress error:', err);
        return res.status(500).json({ error: 'Failed to save progress' });
    }
};

// Save Attack Simulator Progress
exports.saveAttackProgress = async (req, res) => {
    const userId = req.user.id;
    const { simulator_id, current_stage, role, is_completed, score } = req.body;

    if (!simulator_id) {
        return res.status(400).json({ error: 'Simulator ID is required' });
    }

    const roleData = JSON.stringify({ role: role || 'attacker', current_stage: current_stage || 0 });

    try {
        await prisma.user_progress.upsert({
            where: {
                user_id_simulator_id: {
                    user_id: userId,
                    simulator_id: parseInt(simulator_id)
                }
            },
            update: {
                current_module: current_stage,
                role_data: roleData,
                score: score || 0,
                is_completed: is_completed ? true : false,
                last_accessed: new Date()
            },
            create: {
                user_id: userId,
                simulator_id: parseInt(simulator_id),
                current_module: current_stage,
                role_data: roleData,
                score: score || 0,
                is_completed: is_completed ? true : false
            }
        });

        if (is_completed) {
            updateUserXP(userId, 800); // 800 XP for completing Attack simulator
        }

        res.json({ message: 'Attack simulator progress saved', is_completed });
    } catch (err) {
        console.error('Save attack progress error:', err);
        return res.status(500).json({ error: 'Failed to save progress' });
    }
};

// Get user progress for all simulators
exports.getUserProgress = async (req, res) => {
    const userId = req.user.id;

    try {
        const rows = await prisma.user_progress.findMany({
            where: { user_id: userId },
            include: {
                simulators: true
            }
        });

        const progress = rows.map(row => ({
            ...row,
            title: row.simulators.title,
            type: row.simulators.type,
            difficulty: row.simulators.difficulty,
            category: row.simulators.category,
            xp_reward: row.simulators.xp_reward,
            completed_lessons: JSON.parse(row.completed_lessons || '[]'),
            role_data: JSON.parse(row.role_data || '{}')
        }));

        res.json(progress);
    } catch (err) {
        console.error('Get user progress error:', err);
        return res.status(500).json({ error: 'Failed to fetch progress' });
    }
};

// Helper function to update user XP
async function updateUserXP(userId, xpAmount) {
    try {
        await prisma.users.update({
            where: { id: userId },
            data: {
                total_xp: { increment: xpAmount }
            }
        });
        console.log(`Added ${xpAmount} XP to user ${userId}`);
        checkAndAwardBadges(userId);
    } catch (err) {
        console.error('Update XP error:', err);
    }
}

// Helper function to check and award badges
async function checkAndAwardBadges(userId) {
    try {
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { total_xp: true }
        });

        if (!user) return;

        // Get badges that user qualifies for but hasn't earned yet
        const earnedBadgeIds = await prisma.user_badges.findMany({
            where: { user_id: userId },
            select: { badge_id: true }
        }).then(badges => badges.map(b => b.badge_id).filter(Boolean));

        const qualifyingBadges = await prisma.badges.findMany({
            where: {
                requirement_type: 'xp',
                requirement_value: { lte: user.total_xp },
                id: { notIn: earnedBadgeIds }
            }
        });

        if (qualifyingBadges.length === 0) return;

        for (const badge of qualifyingBadges) {
            await prisma.user_badges.create({
                data: {
                    user_id: userId,
                    badge_id: badge.id,
                    badge_name: badge.name
                }
            });
            console.log(`Awarded badge ${badge.id} to user ${userId}`);
        }
    } catch (err) {
        console.error('Check and award badges error:', err);
    }
}

// Start Simulator Session
exports.startSimulator = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    if (!id) {
        return res.status(400).json({ error: 'Simulator ID is required' });
    }

    try {
        await prisma.user_activity.create({
            data: {
                user_id: userId,
                activity_type: 'simulator_started',
                description: `بدء محاكاة: ${id}`
            }
        });
        res.status(200).json({ success: true, message: `Simulator ${id} started`, simulatorId: id });
    } catch (err) {
        console.error('Insert activity error:', err);
        res.status(500).json({ error: 'Failed to record activity' });
    }
};

// Generic Simulator Progress Update
exports.updateSimulatorProgress = async (req, res) => {
    const userId = req.user.id;
    const { simulator_id, progress_percentage, is_completed } = req.body;

    if (!simulator_id || progress_percentage === undefined) {
        return res.status(400).json({ error: 'Missing required progress data' });
    }

    try {
        await prisma.user_progress.upsert({
            where: {
                user_id_simulator_id: {
                    user_id: userId,
                    simulator_id: parseInt(simulator_id)
                }
            },
            update: {
                progress_percentage,
                is_completed: is_completed ? true : undefined, // Only update to true if provided
                last_accessed: new Date()
            },
            create: {
                user_id: userId,
                simulator_id: parseInt(simulator_id),
                progress_percentage,
                is_completed: is_completed ? true : false
            }
        });
        res.json({ message: 'Progress updated successfully', progress_percentage });
    } catch (err) {
        console.error('Update generic progress error:', err);
        return res.status(500).json({ error: 'Failed to update progress' });
    }
};
