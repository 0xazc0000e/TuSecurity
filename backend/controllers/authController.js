const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { db } = require('../models/database');
const { sendVerificationEmail, generateVerificationCode } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('ERROR: JWT_SECRET environment variable is not set!');
    console.error('Please add JWT_SECRET to your .env file');
    console.error('Example: JWT_SECRET=your-super-secret-random-key-min-32-chars');
    process.exit(1);
}

// Multer for Avatar Upload
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: './backend/uploads/',
    filename: (req, file, cb) => {
        cb(null, 'avatar-' + Date.now() + path.extname(file.originalname));
    }
});
exports.upload = multer({ storage: storage });

exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        // Check if user exists
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (existingUser) return res.status(400).json({ error: 'Email already registered' });

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Generate verification code
            const verificationCode = generateVerificationCode();

            // Use provided username or generate one if missing (fallback)
            // The frontend sends 'username' in the body
            let finalUsername = req.body.username;
            if (!finalUsername) {
                finalUsername = email.split('@')[0] + Math.floor(Math.random() * 1000);
            }

            // Save to DB (AUTO-VERIFIED for testing)
            db.run(
                `INSERT INTO users (full_name, username, email, password_hash, verification_code, verification_expires, is_verified, email_verified) VALUES (?, ?, ?, ?, NULL, NULL, 1, 1)`,
                [fullName, finalUsername, email, hashedPassword],
                async function (err) {
                    if (err) return res.status(500).json({ error: err.message });

                    // Auto-login or verify response
                    res.status(201).json({
                        success: true,
                        message: 'Registration successful. Email verification disabled for testing.',
                        email: email,
                        requiresVerification: false // Tell frontend no code needed
                    });
                }
            );
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.verifyEmail = (req, res) => {
    // ... kept for compatibility but not used
    res.json({ success: true, message: 'Email automatically verified.' });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        // Check if social login user (no password)
        if (!user.password_hash) {
            return res.status(400).json({ error: 'Please login with your social account' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        // TEMPORARILY DISABLED VERIFICATION CHECK
        // if (!user.is_verified) {
        //     return res.status(403).json({ error: 'Please verify your email first' });
        // }

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        // Determine redirect
        const redirectTo = user.bio ? '/dashboard' : '/complete-profile';

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                bio: user.bio,
                fullName: user.full_name
            },
            redirectTo
        });
    });
};

exports.completeProfile = (req, res) => {
    const userId = req.user.id;
    const { bio, interests } = req.body;

    // File upload handled by multer middleware, file path in req.file
    let avatarPath = req.body.avatarUrl; // Or from previous logic
    if (req.file) {
        avatarPath = `/uploads/${req.file.filename}`;
    }

    const updates = [];
    const params = [];

    if (bio) { updates.push('bio = ?'); params.push(bio); }
    if (interests) { updates.push('interests = ?'); params.push(interests); } // Store as JSON string usually
    if (avatarPath) { updates.push('avatar = ?'); params.push(avatarPath); }

    if (updates.length === 0) return res.json({ success: true, redirectTo: '/dashboard' });

    params.push(userId);

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });

        // Fetch updated user to return to frontend
        db.get('SELECT id, username, email, full_name, avatar, bio, interests, role FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) return res.json({ success: true, redirectTo: '/dashboard' }); // Fallback

            res.json({
                success: true,
                redirectTo: '/dashboard',
                user: row // Return updated user object
            });
        });
    });
};

exports.authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

exports.socialLoginCallback = (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    const redirectPath = !user.bio ? '/complete-profile' : '/dashboard';
    res.redirect(`http://localhost:5173/login?token=${token}&redirectTo=${redirectPath}`);
};

exports.getProfile = async (req, res) => {
    const userId = req.user.id;

    // Get user details
    db.get('SELECT id, username, email, full_name, avatar, bio, interests, role, total_xp, streak_days FROM users WHERE id = ?', [userId], (err, user) => {
        if (err || !user) return res.status(404).json({ error: 'User not found' });

        // Get user enrollments
        db.all('SELECT type, item_id FROM user_enrollments WHERE user_id = ?', [userId], (err, enrollments) => {
            if (err) {
                console.error("Error fetching enrollments:", err);
                // Return user without enrollments if error (fail graceful)
                return res.json({ ...user, enrollments: [] });
            }

            // Add enrollments to user object
            res.json({
                ...user,
                enrollments: enrollments || []
            });
        });
    });
};

exports.forgotPassword = async (req, res) => { res.json({ message: "Check email for link" }) };
exports.resetPassword = async (req, res) => { res.json({ message: "Password reset" }) };
exports.updateProfile = exports.completeProfile;
