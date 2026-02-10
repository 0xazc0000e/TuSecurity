const { db } = require('../models/database');

// Get all simulators
exports.getAllSimulators = (req, res) => {
    db.all(
        `SELECT s.*, 
                (SELECT COUNT(*) FROM user_progress WHERE simulator_id = s.id AND is_completed = 1) as completed_count
         FROM simulators s 
         WHERE s.status = 'active'
         ORDER BY s.created_at DESC`,
        [],
        (err, rows) => {
            if (err) {
                console.error('Get simulators error:', err);
                return res.status(500).json({ error: 'Failed to fetch simulators' });
            }
            res.json(rows);
        }
    );
};

// Get simulator by ID with user progress
exports.getSimulatorById = (req, res) => {
    const { id } = req.params;
    const userId = req.user?.id;

    db.get(
        'SELECT * FROM simulators WHERE id = ? AND status = ?',
        [id, 'active'],
        (err, simulator) => {
            if (err) {
                console.error('Get simulator error:', err);
                return res.status(500).json({ error: 'Failed to fetch simulator' });
            }

            if (!simulator) {
                return res.status(404).json({ error: 'Simulator not found' });
            }

            // Get user progress if user is authenticated
            if (userId) {
                db.get(
                    'SELECT * FROM user_progress WHERE user_id = ? AND simulator_id = ?',
                    [userId, id],
                    (err, progress) => {
                        if (err) {
                            console.error('Get progress error:', err);
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
                    }
                );
            } else {
                res.json(simulator);
            }
        }
    );
};

// Save Bash Simulator Progress
exports.saveBashProgress = (req, res) => {
    const userId = req.user.id;
    const { simulator_id, current_module, completed_lessons, score } = req.body;

    if (!simulator_id) {
        return res.status(400).json({ error: 'Simulator ID is required' });
    }

    const completedLessonsJson = JSON.stringify(completed_lessons || []);
    const isCompleted = completed_lessons?.length >= 32; // All 32 lessons completed

    // Check if progress record exists
    db.get(
        'SELECT id FROM user_progress WHERE user_id = ? AND simulator_id = ?',
        [userId, simulator_id],
        (err, row) => {
            if (err) {
                console.error('Check progress error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (row) {
                // Update existing progress
                db.run(
                    `UPDATE user_progress 
                     SET current_module = ?, completed_lessons = ?, score = ?, 
                         is_completed = ?, last_accessed = CURRENT_TIMESTAMP
                     WHERE id = ?`,
                    [current_module, completedLessonsJson, score, isCompleted ? 1 : 0, row.id],
                    function(err) {
                        if (err) {
                            console.error('Update progress error:', err);
                            return res.status(500).json({ error: 'Failed to update progress' });
                        }

                        // Update user XP if completed
                        if (isCompleted) {
                            updateUserXP(userId, 500); // 500 XP for completing Bash simulator
                        }

                        res.json({ message: 'Progress saved successfully', is_completed: isCompleted });
                    }
                );
            } else {
                // Create new progress record
                db.run(
                    `INSERT INTO user_progress 
                     (user_id, simulator_id, current_module, completed_lessons, score, is_completed) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [userId, simulator_id, current_module, completedLessonsJson, score, isCompleted ? 1 : 0],
                    function(err) {
                        if (err) {
                            console.error('Insert progress error:', err);
                            return res.status(500).json({ error: 'Failed to save progress' });
                        }

                        if (isCompleted) {
                            updateUserXP(userId, 500);
                        }

                        res.json({ message: 'Progress saved successfully', is_completed: isCompleted });
                    }
                );
            }
        }
    );
};

// Save Attack Simulator Progress
exports.saveAttackProgress = (req, res) => {
    const userId = req.user.id;
    const { simulator_id, current_stage, role, is_completed, score } = req.body;

    if (!simulator_id) {
        return res.status(400).json({ error: 'Simulator ID is required' });
    }

    const roleData = JSON.stringify({ role: role || 'attacker', current_stage: current_stage || 0 });

    db.get(
        'SELECT id FROM user_progress WHERE user_id = ? AND simulator_id = ?',
        [userId, simulator_id],
        (err, row) => {
            if (err) {
                console.error('Check progress error:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            if (row) {
                db.run(
                    `UPDATE user_progress 
                     SET current_module = ?, role_data = ?, score = ?, 
                         is_completed = ?, last_accessed = CURRENT_TIMESTAMP
                     WHERE id = ?`,
                    [current_stage, roleData, score || 0, is_completed ? 1 : 0, row.id],
                    function(err) {
                        if (err) {
                            console.error('Update attack progress error:', err);
                            return res.status(500).json({ error: 'Failed to update progress' });
                        }

                        if (is_completed) {
                            updateUserXP(userId, 800); // 800 XP for completing Attack simulator
                        }

                        res.json({ message: 'Attack simulator progress saved', is_completed });
                    }
                );
            } else {
                db.run(
                    `INSERT INTO user_progress 
                     (user_id, simulator_id, current_module, role_data, score, is_completed) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [userId, simulator_id, current_stage, roleData, score || 0, is_completed ? 1 : 0],
                    function(err) {
                        if (err) {
                            console.error('Insert attack progress error:', err);
                            return res.status(500).json({ error: 'Failed to save progress' });
                        }

                        if (is_completed) {
                            updateUserXP(userId, 800);
                        }

                        res.json({ message: 'Attack simulator progress saved', is_completed });
                    }
                );
            }
        }
    );
};

// Get user progress for all simulators
exports.getUserProgress = (req, res) => {
    const userId = req.user.id;

    db.all(
        `SELECT up.*, s.title, s.type, s.difficulty, s.category, s.xp_reward
         FROM user_progress up
         JOIN simulators s ON up.simulator_id = s.id
         WHERE up.user_id = ?`,
        [userId],
        (err, rows) => {
            if (err) {
                console.error('Get user progress error:', err);
                return res.status(500).json({ error: 'Failed to fetch progress' });
            }

            const progress = rows.map(row => ({
                ...row,
                completed_lessons: JSON.parse(row.completed_lessons || '[]'),
                role_data: JSON.parse(row.role_data || '{}')
            }));

            res.json(progress);
        }
    );
};

// Helper function to update user XP
function updateUserXP(userId, xpAmount) {
    db.run('UPDATE users SET total_xp = total_xp + ? WHERE id = ?', [xpAmount, userId], (err) => {
        if (err) {
            console.error('Update XP error:', err);
        } else {
            console.log(`Added ${xpAmount} XP to user ${userId}`);
            checkAndAwardBadges(userId);
        }
    });
}

// Helper function to check and award badges
function checkAndAwardBadges(userId) {
    db.get('SELECT total_xp FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) return;

        // Get badges that user qualifies for but hasn't earned yet
        db.all(
            `SELECT b.id FROM badges b
             WHERE b.xp_threshold <= ?
             AND b.id NOT IN (SELECT badge_id FROM user_badges WHERE user_id = ?)`,
            [user.total_xp, userId],
            (err, badges) => {
                if (err || !badges.length) return;

                badges.forEach(badge => {
                    db.run(
                        'INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)',
                        [userId, badge.id],
                        (err) => {
                            if (!err) {
                                console.log(`Awarded badge ${badge.id} to user ${userId}`);
                            }
                        }
                    );
                });
            }
        );
    });
}
