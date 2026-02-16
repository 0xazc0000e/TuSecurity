const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../models/database');

const JWT_SECRET = process.env.JWT_SECRET || 'tu-cyber-security-secret-key-2024';
const JWT_EXPIRES_IN = '24h';

// ── Multer Configuration ──────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueName = `avatar-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
};

exports.upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ── All user fields to SELECT in queries ──────────────────────────────
const USER_FIELDS = 'id, username, email, role, avatar, total_xp, university_id, major, bio, skill_level, interests';

// ── Register ──────────────────────────────────────────────────────────
exports.register = async (req, res) => {
    try {
        const { username, email, password, role = 'student' } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const existingUser = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Username or email already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
                [username, email, passwordHash, role],
                function (err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                }
            );
        });

        const token = jwt.sign(
            { id: result, username, email, role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

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
                university_id: null,
                major: null,
                bio: null,
                skill_level: null,
                interests: null,
                avatar: '/default-avatar.png',
                total_xp: 0
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Registration failed' });
    }
};

// ── Login ─────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await new Promise((resolve, reject) => {
            db.get(
                `SELECT ${USER_FIELDS}, password_hash, status FROM users WHERE email = ?`,
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

        if (user.status !== 'active') {
            return res.status(403).json({ error: 'Account is suspended or inactive' });
        }

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        db.run('UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        db.run(
            'INSERT INTO logs (user_id, action, resource_type, details, ip_address) VALUES (?, ?, ?, ?, ?)',
            [user.id, 'USER_LOGIN', 'user', JSON.stringify({ email }), req.ip]
        );

        // Remove internal fields before sending
        const { password_hash, status, ...safeUser } = user;

        res.json({
            message: 'Login successful',
            token,
            user: safeUser
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};

// ── Get Profile ───────────────────────────────────────────────────────
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await new Promise((resolve, reject) => {
            db.get(
                `SELECT u.id, u.username, u.email, u.role, u.avatar, u.total_xp,
                        u.university_id, u.major, u.bio, u.skill_level, u.interests, u.created_at,
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

        // 1. Fetch Badges
        let badges = [];
        try {
            badges = await new Promise((resolve) => {
                db.all(`SELECT ub.badge_id, ub.badge_name, ub.earned_at FROM user_badges ub WHERE ub.user_id = ? ORDER BY ub.earned_at DESC`, [userId], (err, rows) => resolve(rows || []));
            });
        } catch { }

        // 2. Fetch Simulator Progress
        const progress = await new Promise((resolve, reject) => {
            db.all(`SELECT up.*, s.title as simulator_title, s.type as simulator_type FROM user_progress up JOIN simulators s ON up.simulator_id = s.id WHERE up.user_id = ?`, [userId], (err, rows) => {
                if (err) reject(err); else resolve(rows || []);
            });
        });

        // 3. Fetch Enrollments (Tracks/Courses)
        const enrollments = await new Promise((resolve) => {
            db.all(`SELECT ue.*, 
                    CASE WHEN ue.type = 'track' THEN t.title ELSE c.title END as title,
                    CASE WHEN ue.type = 'track' THEN t.icon ELSE '' END as icon
                    FROM user_enrollments ue 
                    LEFT JOIN tracks t ON ue.type = 'track' AND ue.item_id = t.id
                    LEFT JOIN courses c ON ue.type = 'course' AND ue.item_id = c.id
                    WHERE ue.user_id = ? ORDER BY ue.last_accessed DESC`, [userId], (err, rows) => resolve(rows || []));
        });

        // 4. Fetch Event Registrations
        const events = await new Promise((resolve) => {
            db.all(`SELECT er.*, ce.title, ce.date, ce.time, ce.location, ce.type 
                    FROM event_registrations er 
                    JOIN club_events ce ON er.event_id = ce.id 
                    WHERE er.student_id = ? OR er.email = ? ORDER BY ce.date DESC`, [user.university_id, user.email], (err, rows) => resolve(rows || []));
        });

        // 5. Fetch Likes
        const likes = await new Promise((resolve) => {
            db.all(`SELECT ul.*, 
                    CASE WHEN ul.item_type = 'article' THEN a.title 
                         WHEN ul.item_type = 'news' THEN n.title 
                         WHEN ul.item_type = 'lesson' THEN l.title END as title
                    FROM user_likes ul
                    LEFT JOIN articles a ON ul.item_type = 'article' AND ul.item_id = a.id
                    LEFT JOIN news n ON ul.item_type = 'news' AND ul.item_id = n.id
                    LEFT JOIN lessons l ON ul.item_type = 'lesson' AND ul.item_id = l.id
                    WHERE ul.user_id = ? ORDER BY ul.created_at DESC`, [userId], (err, rows) => resolve(rows || []));
        });

        // 6. Fetch Bookmarks
        const bookmarks = await new Promise((resolve) => {
            db.all(`SELECT ub.*, 
                    CASE WHEN ub.item_type = 'article' THEN a.title 
                         WHEN ub.item_type = 'news' THEN n.title 
                         WHEN ub.item_type = 'lesson' THEN l.title END as title
                    FROM user_bookmarks ub
                    LEFT JOIN articles a ON ub.item_type = 'article' AND ub.item_id = a.id
                    LEFT JOIN news n ON ub.item_type = 'news' AND ub.item_id = n.id
                    LEFT JOIN lessons l ON ub.item_type = 'lesson' AND ub.item_id = l.id
                    WHERE ub.user_id = ? ORDER BY ub.created_at DESC`, [userId], (err, rows) => resolve(rows || []));
        });

        res.json({
            ...user,
            badges,
            progress,
            enrollments,
            events,
            likes,
            bookmarks
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// ── Update Profile (supports multipart/form-data + JSON) ──────────────
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { username, university_id, major, bio, skill_level, interests } = req.body;

        // Build dynamic SET clause — only update provided fields
        const fields = [];
        const values = [];

        if (username !== undefined && username !== '') {
            // Check username uniqueness
            const existing = await new Promise((resolve, reject) => {
                db.get('SELECT id FROM users WHERE username = ? AND id != ?', [username, userId], (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
            });
            if (existing) {
                return res.status(409).json({ error: 'Username already taken' });
            }
            fields.push('username = ?');
            values.push(username);
        }
        if (university_id !== undefined) { fields.push('university_id = ?'); values.push(university_id); }
        if (major !== undefined) { fields.push('major = ?'); values.push(major); }
        if (bio !== undefined) { fields.push('bio = ?'); values.push(bio); }
        if (skill_level !== undefined) { fields.push('skill_level = ?'); values.push(skill_level); }
        if (interests !== undefined) { fields.push('interests = ?'); values.push(interests); }

        // Handle file upload — multer puts file info in req.file
        if (req.file) {
            const avatarPath = `/uploads/${req.file.filename}`;
            fields.push('avatar = ?');
            values.push(avatarPath);
        }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(userId);

        await new Promise((resolve, reject) => {
            db.run(
                `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
                values,
                function (err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });

        // Fetch and return updated user
        const updatedUser = await new Promise((resolve, reject) => {
            db.get(
                `SELECT ${USER_FIELDS} FROM users WHERE id = ?`,
                [userId],
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                }
            );
        });

        res.json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// ── JWT Middleware ─────────────────────────────────────────────────────
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

// ── Admin Middleware ──────────────────────────────────────────────────
exports.requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};
