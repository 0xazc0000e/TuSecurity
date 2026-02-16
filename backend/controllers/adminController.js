const { db } = require('../models/database');
const bcrypt = require('bcrypt');

const getStats = (req, res) => {
    const stats = {};

    db.get('SELECT COUNT(*) as total_users FROM users', [], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        stats.total_users = row.total_users;

        db.get("SELECT COUNT(*) as active_users FROM users WHERE status = 'active'", [], (err, row) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            stats.active_users = row.active_users;

            db.get('SELECT COUNT(*) as total_simulators FROM simulators', [], (err, row) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                stats.total_simulators = row.total_simulators;

                db.get('SELECT COUNT(*) as total_content FROM content', [], (err, row) => {
                    if (err) return res.status(500).json({ error: 'Database error' });
                    stats.total_content = row.total_content;

                    db.get(
                        `SELECT COUNT(*) as today_logins FROM logs 
                         WHERE action = 'USER_LOGIN' 
                         AND date(timestamp) = date('now')`,
                        [],
                        (err, row) => {
                            if (err) return res.status(500).json({ error: 'Database error' });
                            stats.today_logins = row.today_logins;
                            stats.system_health = 98;
                            stats.security_score = 95;

                            res.json(stats);
                        }
                    );
                });
            });
        });
    });
};

const getAllUsers = (req, res) => {
    const { search, role, status, limit = 20, page = 1 } = req.query;

    let query = `
        SELECT id, username, email, role, avatar, total_xp, 
               created_at, last_active, status
        FROM users WHERE 1=1
    `;
    const params = [];

    if (search) {
        query += ' AND (username LIKE ? OR email LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    if (role && role !== 'all') {
        query += ' AND role = ?';
        params.push(role);
    }

    if (status && status !== 'all') {
        query += ' AND status = ?';
        params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Get users error:', err);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
        res.json(rows);
    });
};

const updateUser = (req, res) => {
    const { id } = req.params;
    const { role, status } = req.body;

    db.run(
        'UPDATE users SET role = ?, status = ? WHERE id = ?',
        [role, status, id],
        function (err) {
            if (err) {
                console.error('Update user error:', err);
                return res.status(500).json({ error: 'Failed to update user' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ message: 'User updated successfully' });
        }
    );
};

const deleteUser = (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
        if (err) {
            console.error('Delete user error:', err);
            return res.status(500).json({ error: 'Failed to delete user' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    });
};

const toggleUserBan = (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    // Get current user status
    db.get('SELECT status, username FROM users WHERE id = ?', [id], (err, user) => {
        if (err) {
            console.error('Ban check error:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Toggle between 'active' and 'suspended'
        const newStatus = user.status === 'suspended' ? 'active' : 'suspended';

        db.run(
            'UPDATE users SET status = ? WHERE id = ?',
            [newStatus, id],
            function (err) {
                if (err) {
                    console.error('Ban toggle error:', err);
                    return res.status(500).json({ error: 'Failed to update ban status' });
                }

                // Log the action
                const action = newStatus === 'suspended' ? 'USER_BANNED' : 'USER_UNBANNED';
                db.run(
                    `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
                     VALUES (?, ?, 'user', ?, ?, ?)`,
                    [req.user.id, action, id, reason || 'No reason provided', req.ip || 'unknown']
                );

                res.json({
                    message: `User ${newStatus === 'suspended' ? 'banned' : 'unbanned'} successfully`,
                    status: newStatus
                });
            }
        );
    });
};

const resetUserPassword = (req, res) => {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
        return res.status(400).json({ error: 'User ID and new password are required' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const saltRounds = 10;

    bcrypt.hash(newPassword, saltRounds, (err, hash) => {
        if (err) {
            console.error('Password hash error:', err);
            return res.status(500).json({ error: 'Failed to hash password' });
        }

        db.run(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [hash, userId],
            function (err) {
                if (err) {
                    console.error('Password reset error:', err);
                    return res.status(500).json({ error: 'Failed to reset password' });
                }

                if (this.changes === 0) {
                    return res.status(404).json({ error: 'User not found' });
                }

                // Log the action
                db.run(
                    `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
                     VALUES (?, ?, 'user', ?, ?, ?)`,
                    [req.user.id, 'ADMIN_PASSWORD_RESET', userId, 'Password reset by admin', req.ip || 'unknown']
                );

                res.json({ message: 'Password reset successfully' });
            }
        );
    });
};

const getSystemLogs = (req, res) => {
    const { limit = 100 } = req.query;

    db.all(
        `SELECT l.*, u.username, u.email
         FROM logs l
         LEFT JOIN users u ON l.user_id = u.id
         ORDER BY l.timestamp DESC
         LIMIT ?`,
        [parseInt(limit)],
        (err, rows) => {
            if (err) {
                console.error('Get logs error:', err);
                return res.status(500).json({ error: 'Failed to fetch logs' });
            }
            res.json(rows);
        }
    );
};

const updateUserRole = (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'editor', 'student'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be admin, editor, or student' });
    }

    db.run(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id],
        function (err) {
            if (err) {
                console.error('Role update error:', err);
                return res.status(500).json({ error: 'Failed to update role' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Log the action
            db.run(
                `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
                 VALUES (?, ?, 'user', ?, ?, ?)`,
                [req.user.id, 'ROLE_CHANGED', id, `Role changed to ${role}`, req.ip || 'unknown']
            );

            res.json({
                message: 'Role updated successfully',
                role: role
            });
        }
    );
};

// Setup Route - Make User Admin (Development Only)
const makeMeAdmin = (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(404).json({ error: 'User not found' });

        db.run(
            'UPDATE users SET role = "admin" WHERE id = ?',
            [user.id],
            function (err) {
                if (err) return res.status(500).json({ error: 'Failed to update role' });

                res.json({
                    message: `User ${email} is now an admin`,
                    oldRole: user.role,
                    newRole: 'admin'
                });
            }
        );
    });
};

module.exports = {
    getStats,
    getAllUsers,
    updateUser,
    deleteUser,
    toggleUserBan,
    resetUserPassword,
    getSystemLogs,
    updateUserRole,
    makeMeAdmin
};
