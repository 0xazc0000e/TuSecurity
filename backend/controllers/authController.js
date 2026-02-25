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
    destination: path.join(__dirname, '..', 'uploads'),
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

            // Use provided username or generate one if missing (fallback)
            // The frontend sends 'username' in the body
            let finalUsername = req.body.username;
            if (!finalUsername) {
                finalUsername = email.split('@')[0] + Math.floor(Math.random() * 1000);
            }

            // Save to DB with verification code
            const verificationCode = generateVerificationCode();
            const verificationExpires = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes

            db.run(
                `INSERT INTO users (full_name, username, email, password_hash, verification_code, verification_expires, is_verified, email_verified) VALUES (?, ?, ?, ?, ?, ?, 0, 0)`,
                [fullName, finalUsername, email, hashedPassword, verificationCode, verificationExpires],
                async function (err) {
                    if (err) return res.status(500).json({ error: err.message });

                    // Send verification email
                    try {
                        await sendVerificationEmail(email, verificationCode, finalUsername);
                    } catch (emailErr) {
                        console.error('Failed to send verification email:', emailErr);
                    }

                    res.status(201).json({
                        success: true,
                        message: 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيد الحساب.',
                        email: email,
                        requiresVerification: true
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
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: 'البريد الإلكتروني ورمز التحقق مطلوبان' });
    }

    db.get(
        'SELECT id, verification_code, verification_expires FROM users WHERE email = ?',
        [email],
        (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });

            // Check code match
            if (user.verification_code !== code) {
                return res.status(400).json({ error: 'رمز التحقق غير صحيح' });
            }

            // Check expiry
            if (new Date() > new Date(user.verification_expires)) {
                return res.status(400).json({ error: 'انتهت صلاحية رمز التحقق. اطلب رمزاً جديداً.' });
            }

            // Mark as verified
            db.run(
                'UPDATE users SET is_verified = 1, email_verified = 1, verification_code = NULL, verification_expires = NULL WHERE id = ?',
                [user.id],
                function (err) {
                    if (err) return res.status(500).json({ error: 'فشل تحديث الحالة' });
                    res.json({ success: true, message: 'تم تأكيد البريد الإلكتروني بنجاح' });
                }
            );
        }
    );
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

        // Check if user is verified
        // TEMPORARILY DISABLED
        /*
        if (!user.is_verified && !user.email_verified) {
            return res.status(403).json({
                error: 'يرجى تأكيد بريدك الإلكتروني أولاً',
                requiresVerification: true,
                email: user.email
            });
        }
        */

        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

        // Determine redirect
        const redirectTo = user.bio ? '/dashboard' : '/complete-profile';

        // Set JWT as HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

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

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.json({ success: true, message: 'Logged out successfully' });
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
    // Check cookie first, fallback to header for backwards compatibility if needed during transition
    const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

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
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/login?token=${token}&redirectTo=${redirectPath}`);
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

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });
    }

    db.get('SELECT id, username, email FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({ success: true, message: 'إذا كان البريد مسجلاً، سيتم إرسال رمز إعادة التعيين.' });
        }

        const resetCode = generateVerificationCode();
        const resetExpires = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes

        db.run(
            'UPDATE users SET verification_code = ?, verification_expires = ? WHERE id = ?',
            [resetCode, resetExpires, user.id],
            async function (err) {
                if (err) return res.status(500).json({ error: 'فشل إنشاء رمز إعادة التعيين' });

                // Send reset email
                try {
                    await sendVerificationEmail(email, resetCode, user.username || 'مستخدم');
                } catch (emailErr) {
                    console.error('Failed to send reset email:', emailErr);
                }

                res.json({ success: true, message: 'إذا كان البريد مسجلاً، سيتم إرسال رمز إعادة التعيين.' });
            }
        );
    });
};

exports.resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
        return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    }

    db.get(
        'SELECT id, verification_code, verification_expires FROM users WHERE email = ?',
        [email],
        async (err, user) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });

            // Check code match
            if (user.verification_code !== code) {
                return res.status(400).json({ error: 'رمز إعادة التعيين غير صحيح' });
            }

            // Check expiry
            if (new Date() > new Date(user.verification_expires)) {
                return res.status(400).json({ error: 'انتهت صلاحية الرمز. اطلب رمزاً جديداً.' });
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password and clear reset code
            db.run(
                'UPDATE users SET password_hash = ?, verification_code = NULL, verification_expires = NULL WHERE id = ?',
                [hashedPassword, user.id],
                function (err) {
                    if (err) return res.status(500).json({ error: 'فشل تحديث كلمة المرور' });
                    res.json({ success: true, message: 'تم إعادة تعيين كلمة المرور بنجاح' });
                }
            );
        }
    );
};

exports.resendVerification = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });
    }

    db.get('SELECT id, username, email, is_verified, email_verified FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({ success: true, message: 'إذا كان البريد مسجلاً، سيتم إرسال رمز تحقق جديد.' });
        }

        if (user.is_verified || user.email_verified) {
            return res.status(400).json({ error: 'البريد الإلكتروني مُفعّل بالفعل' });
        }

        const verificationCode = generateVerificationCode();
        const verificationExpires = new Date(Date.now() + 30 * 60 * 1000).toISOString();

        db.run(
            'UPDATE users SET verification_code = ?, verification_expires = ? WHERE id = ?',
            [verificationCode, verificationExpires, user.id],
            async function (err) {
                if (err) return res.status(500).json({ error: 'فشل إنشاء رمز التحقق' });

                try {
                    await sendVerificationEmail(email, verificationCode, user.username || 'مستخدم');
                } catch (emailErr) {
                    console.error('Failed to resend verification email:', emailErr);
                }

                res.json({ success: true, message: 'إذا كان البريد مسجلاً، سيتم إرسال رمز تحقق جديد.' });
            }
        );
    });
};

exports.updateProfile = exports.completeProfile;
