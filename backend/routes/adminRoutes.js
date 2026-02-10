const express = require('express');
const { db } = require('../models/database');
const { authenticate } = require('../controllers/authController');
const { requireAdmin, requireEditor } = require('../middleware/rbacMiddleware');

const router = express.Router();

// Get admin dashboard stats
router.get('/stats', authenticate, requireAdmin, (req, res) => {
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
});

// Get all users (admin only)
router.get('/users', authenticate, requireAdmin, (req, res) => {
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
});

// Update user (admin only)
router.put('/users/:id', authenticate, requireAdmin, (req, res) => {
    const { id } = req.params;
    const { role, status } = req.body;

    db.run(
        'UPDATE users SET role = ?, status = ? WHERE id = ?',
        [role, status, id],
        function(err) {
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
});

// Delete user (admin only)
router.delete('/users/:id', authenticate, requireAdmin, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Delete user error:', err);
            return res.status(500).json({ error: 'Failed to delete user' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    });
});

// Toggle user ban status (admin only)
router.put('/users/:id/ban', authenticate, requireAdmin, (req, res) => {
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
            function(err) {
                if (err) {
                    console.error('Ban toggle error:', err);
                    return res.status(500).json({ error: 'Failed to update ban status' });
                }

                // Log the action
                const action = newStatus === 'suspended' ? 'USER_BANNED' : 'USER_UNBANNED';
                db.run(
                    `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
                     VALUES (?, ?, 'user', ?, ?, ?)`,
                    [req.userId, action, id, reason || 'No reason provided', req.ip || 'unknown']
                );

                res.json({ 
                    message: `User ${newStatus === 'suspended' ? 'banned' : 'unbanned'} successfully`,
                    status: newStatus
                });
            }
        );
    });
});

// Admin reset user password (admin only)
router.post('/reset-password', authenticate, requireAdmin, (req, res) => {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
        return res.status(400).json({ error: 'User ID and new password are required' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    bcrypt.hash(newPassword, saltRounds, (err, hash) => {
        if (err) {
            console.error('Password hash error:', err);
            return res.status(500).json({ error: 'Failed to hash password' });
        }

        db.run(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [hash, userId],
            function(err) {
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
                    [req.userId, 'ADMIN_PASSWORD_RESET', userId, 'Password reset by admin', req.ip || 'unknown']
                );

                res.json({ message: 'Password reset successfully' });
            }
        );
    });
});

// Get system logs (admin only)
router.get('/logs', authenticate, requireAdmin, (req, res) => {
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
});

// Update user role (admin only)
router.put('/users/:id/role', authenticate, requireAdmin, (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'editor', 'student'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be admin, editor, or student' });
    }

    db.run(
        'UPDATE users SET role = ? WHERE id = ?',
        [role, id],
        function(err) {
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
                [req.userId, 'ROLE_CHANGED', id, `Role changed to ${role}`, req.ip || 'unknown']
            );

            res.json({ 
                message: 'Role updated successfully',
                role: role
            });
        }
    );
});

// Content Management Endpoints (admin and editor access)

// Get all content (news/articles) - admin and editor
router.get('/content', authenticate, requireEditor, (req, res) => {
    const { type = 'all', limit = 50 } = req.query;
    
    let query = 'SELECT * FROM content';
    const params = [];
    
    if (type !== 'all') {
        query += ' WHERE type = ?';
        params.push(type);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ?';
    params.push(parseInt(limit));
    
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Get content error:', err);
            return res.status(500).json({ error: 'Failed to fetch content' });
        }
        res.json(rows);
    });
});

// Create new content - admin and editor
router.post('/content', authenticate, requireEditor, (req, res) => {
    const { title, content, type, category, image_url } = req.body;
    
    if (!title || !content || !type) {
        return res.status(400).json({ error: 'Title, content, and type are required' });
    }
    
    db.run(
        `INSERT INTO content (title, content, type, category, image_url, created_by) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, content, type, category || 'general', image_url || null, req.userId],
        function(err) {
            if (err) {
                console.error('Create content error:', err);
                return res.status(500).json({ error: 'Failed to create content' });
            }
            
            const contentId = this.lastID;
            
            // Log the action
            db.run(
                `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
                 VALUES (?, ?, 'content', ?, ?, ?)`,
                [req.userId, 'CONTENT_CREATED', contentId, `Created ${type}: ${title}`, req.ip || 'unknown']
            );
            
            res.status(201).json({ 
                message: 'Content created successfully',
                id: contentId
            });
        }
    );
});

// Update content - admin and editor
router.put('/content/:id', authenticate, requireEditor, (req, res) => {
    const { id } = req.params;
    const { title, content, category, image_url } = req.body;
    
    db.run(
        `UPDATE content 
         SET title = ?, content = ?, category = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [title, content, category || 'general', image_url || null, id],
        function(err) {
            if (err) {
                console.error('Update content error:', err);
                return res.status(500).json({ error: 'Failed to update content' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Content not found' });
            }
            
            // Log the action
            db.run(
                `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
                 VALUES (?, ?, 'content', ?, ?, ?)`,
                [req.userId, 'CONTENT_UPDATED', id, `Updated: ${title}`, req.ip || 'unknown']
            );
            
            res.json({ message: 'Content updated successfully' });
        }
    );
});

// Delete content - admin and editor
router.delete('/content/:id', authenticate, requireEditor, (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM content WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Delete content error:', err);
            return res.status(500).json({ error: 'Failed to delete content' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Content not found' });
        }
        
        // Log the action
        db.run(
            `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
             VALUES (?, ?, 'content', ?, ?, ?)`,
            [req.userId, 'CONTENT_DELETED', id, 'Content deleted', req.ip || 'unknown']
        );
        
        res.json({ message: 'Content deleted successfully' });
    });
});

// Simulators Management (admin and editor)

// Get all simulators
router.get('/simulators', authenticate, requireEditor, (req, res) => {
    db.all('SELECT * FROM simulators ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            console.error('Get simulators error:', err);
            return res.status(500).json({ error: 'Failed to fetch simulators' });
        }
        res.json(rows);
    });
});

// Create new simulator
router.post('/simulators', authenticate, requireEditor, (req, res) => {
    const { title, description, type, difficulty, category } = req.body;
    
    if (!title || !type || !difficulty) {
        return res.status(400).json({ error: 'Title, type, and difficulty are required' });
    }
    
    db.run(
        `INSERT INTO simulators (title, description, type, difficulty, category, created_by) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [title, description || '', type, difficulty, category || 'general', req.userId],
        function(err) {
            if (err) {
                console.error('Create simulator error:', err);
                return res.status(500).json({ error: 'Failed to create simulator' });
            }
            
            const simulatorId = this.lastID;
            
            // Log the action
            db.run(
                `INSERT INTO logs (user_id, action, resource_type, resource_id, details, ip_address) 
                 VALUES (?, ?, 'simulator', ?, ?, ?)`,
                [req.userId, 'SIMULATOR_CREATED', simulatorId, `Created: ${title}`, req.ip || 'unknown']
            );
            
            res.status(201).json({ 
                message: 'Simulator created successfully',
                id: simulatorId
            });
        }
    );
});

// Update simulator
router.put('/simulators/:id', authenticate, requireEditor, (req, res) => {
    const { id } = req.params;
    const { title, description, difficulty, category } = req.body;
    
    db.run(
        `UPDATE simulators 
         SET title = ?, description = ?, difficulty = ?, category = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [title, description, difficulty, category, id],
        function(err) {
            if (err) {
                console.error('Update simulator error:', err);
                return res.status(500).json({ error: 'Failed to update simulator' });
            }
            
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Simulator not found' });
            }
            
            res.json({ message: 'Simulator updated successfully' });
        }
    );
});

// Delete simulator
router.delete('/simulators/:id', authenticate, requireEditor, (req, res) => {
    const { id } = req.params;
    
    db.run('DELETE FROM simulators WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('Delete simulator error:', err);
            return res.status(500).json({ error: 'Failed to delete simulator' });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Simulator not found' });
        }
        
        res.json({ message: 'Simulator deleted successfully' });
    });
});

module.exports = router;
