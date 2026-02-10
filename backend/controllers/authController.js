const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../models/database');

const JWT_SECRET = process.env.JWT_SECRET || 'tu-cyber-security-secret-key-2024';
const JWT_EXPIRES_IN = '24h';

// Register new user
exports.register = async (req, res) => {
    try {
        const { username, email, password, role = 'student' } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if email already exists
        const existingUser = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert new user
        const result = await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [username, email, passwordHash, role],
                function(err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: result, username, email, role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Log registration
        db.run(
            'INSERT INTO logs (user_id, action, resource_type, details) VALUES (?, ?, ?, ?)',
            [result, 'USER_REGISTER', 'user', JSON.stringify({ email, role })]
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result,
                username,
                email,
                role,
                total_xp: 0
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await new Promise((resolve, reject) => {
            db.get(
                'SELECT id, username, email, password_hash, role, total_xp, avatar, status FROM users WHERE email = ?',
                [email],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if account is active
        if (user.status !== 'active') {
            return res.status(403).json({ error: 'Account is suspended or inactive' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last active
        db.run('UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // Log login
        db.run(
            'INSERT INTO logs (user_id, action, resource_type, details, ip_address) VALUES (?, ?, ?, ?, ?)',
            [user.id, 'USER_LOGIN', 'user', JSON.stringify({ email }), req.ip]
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                total_xp: user.total_xp,
                avatar: user.avatar
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await new Promise((resolve, reject) => {
            db.get(
                `SELECT u.id, u.username, u.email, u.role, u.avatar, u.total_xp, u.created_at,
                        COUNT(DISTINCT up.simulator_id) as completed_simulators,
                        COUNT(DISTINCT ub.badge_id) as badges_count
                 FROM users u
                 LEFT JOIN user_progress up ON u.id = up.user_id AND up.is_completed = 1
                 LEFT JOIN user_badges ub ON u.id = ub.user_id
                 WHERE u.id = ?
                 GROUP BY u.id`,
                [userId],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get user's badges
        const badges = await new Promise((resolve, reject) => {
            db.all(
                `SELECT b.id, b.name, b.description, b.icon, ub.earned_at
                 FROM badges b
                 JOIN user_badges ub ON b.id = ub.badge_id
                 WHERE ub.user_id = ?
                 ORDER BY ub.earned_at DESC`,
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows || []);
                }
            );
        });

        // Get user's progress across simulators
        const progress = await new Promise((resolve, reject) => {
            db.all(
                `SELECT up.*, s.title as simulator_title, s.type as simulator_type
                 FROM user_progress up
                 JOIN simulators s ON up.simulator_id = s.id
                 WHERE up.user_id = ?`,
                [userId],
                (err, rows) => {
                    if (err) reject(err);
                    resolve(rows || []);
                }
            );
        });

        res.json({
            ...user,
            badges,
            progress
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, avatar } = req.body;

        await new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET username = ?, avatar = ? WHERE id = ?',
                [username, avatar, userId],
                function(err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// Middleware to verify JWT token
exports.authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Middleware to check admin role
exports.requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
