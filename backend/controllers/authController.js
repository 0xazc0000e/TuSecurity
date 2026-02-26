const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { prisma } = require('../models/prismaDatabase');
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
        try {
            const existingEmail = await prisma.users.findUnique({
                where: { email: email }
            });
            if (existingEmail) return res.status(400).json({ error: 'البريد الإلكتروني مسجل بالفعل' });

            // Using the provided username from body or generating one
            let finalUsername = req.body.username || fullName;

            // Check if username exists
            const existingUsername = await prisma.users.findUnique({
                where: { username: finalUsername }
            });

            if (existingUsername) {
                // If collision, append random numbers if it was generated/default
                finalUsername = `${finalUsername}_${Math.floor(Math.random() * 1000)}`;
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Save to DB with verification code
            const verificationCode = generateVerificationCode();
            const verificationExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

            const newUser = await prisma.users.create({
                data: {
                    full_name: fullName,
                    username: finalUsername,
                    email: email,
                    password_hash: hashedPassword,
                    verification_code: verificationCode,
                    verification_expires: verificationExpires,
                    is_verified: false,
                    email_verified: 0,
                    student_id: req.body.university_id || null // Map university_id to student_id if provided
                }
            });

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
        } catch (error) {
            console.error('Registration Database error:', error);

            // Handle Prisma unique constraint errors
            if (error.code === 'P2002') {
                const target = error.meta?.target?.[0] || '';
                if (target.includes('email')) return res.status(400).json({ error: 'البريد الإلكتروني مسجل بالفعل' });
                if (target.includes('username')) return res.status(400).json({ error: 'اسم المستخدم محجوز، جرب اسماً آخر' });
            }

            return res.status(500).json({
                error: 'خطأ في قاعدة البيانات',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).json({ error: 'البريد الإلكتروني ورمز التحقق مطلوبان' });
    }

    try {
        const user = await prisma.users.findUnique({
            where: { email: email },
            select: {
                id: true,
                verification_code: true,
                verification_expires: true
            }
        });

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
        await prisma.users.update({
            where: { id: user.id },
            data: {
                is_verified: true,
                email_verified: 1,
                verification_code: null,
                verification_expires: null
            }
        });

        res.json({ success: true, message: 'تم تأكيد البريد الإلكتروني بنجاح' });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: { email: email }
        });

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
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    });
    res.json({ success: true, message: 'Logged out successfully' });
};

exports.completeProfile = async (req, res) => {
    const userId = req.user.id;
    const { bio, interests } = req.body;

    // File upload handled by multer middleware, file path in req.file
    let avatarPath = req.body.avatarUrl; // Or from previous logic
    if (req.file) {
        avatarPath = `/uploads/${req.file.filename}`;
    }

    const updateData = {};
    if (bio) updateData.bio = bio;
    if (interests) updateData.interests = interests;
    if (avatarPath) updateData.avatar = avatarPath;

    if (Object.keys(updateData).length === 0) return res.json({ success: true, redirectTo: '/dashboard' });

    try {
        await prisma.users.update({
            where: { id: userId },
            data: updateData
        });

        // Fetch updated user to return to frontend
        const updatedUser = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                full_name: true,
                avatar: true,
                bio: true,
                interests: true,
                role: true
            }
        });

        res.json({
            success: true,
            redirectTo: '/dashboard',
            user: updatedUser
        });
    } catch (error) {
        console.error('Profile completion error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
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

    try {
        // Get user details
        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                full_name: true,
                avatar: true,
                bio: true,
                interests: true,
                role: true,
                total_xp: true,
                streak_days: true
            }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Get user enrollments
        const enrollments = await prisma.user_enrollments.findMany({
            where: { user_id: userId },
            select: {
                type: true,
                item_id: true
            }
        });

        res.json({
            ...user,
            enrollments: enrollments || []
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });
    }

    try {
        const user = await prisma.users.findUnique({
            where: { email: email },
            select: {
                id: true,
                username: true,
                email: true
            }
        });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({ success: true, message: 'إذا كان البريد مسجلاً، سيتم إرسال رمز إعادة التعيين.' });
        }

        const resetCode = generateVerificationCode();
        const resetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        await prisma.users.update({
            where: { id: user.id },
            data: {
                verification_code: resetCode,
                verification_expires: resetExpires
            }
        });

        // Send reset email
        try {
            await sendVerificationEmail(email, resetCode, user.username || 'مستخدم');
        } catch (emailErr) {
            console.error('Failed to send reset email:', emailErr);
        }

        res.json({ success: true, message: 'إذا كان البريد مسجلاً، سيتم إرسال رمز إعادة التعيين.' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
        return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
    }

    try {
        const user = await prisma.users.findUnique({
            where: { email: email },
            select: {
                id: true,
                verification_code: true,
                verification_expires: true
            }
        });

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
        await prisma.users.update({
            where: { id: user.id },
            data: {
                password_hash: hashedPassword,
                verification_code: null,
                verification_expires: null
            }
        });

        res.json({ success: true, message: 'تم إعادة تعيين كلمة المرور بنجاح' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.resendVerification = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });
    }

    try {
        const user = await prisma.users.findUnique({
            where: { email: email },
            select: {
                id: true,
                username: true,
                email: true,
                is_verified: true,
                email_verified: true
            }
        });

        // Always return success to prevent email enumeration
        if (!user) {
            return res.json({ success: true, message: 'إذا كان البريد مسجلاً، سيتم إرسال رمز تحقق جديد.' });
        }

        if (user.is_verified || user.email_verified) {
            return res.status(400).json({ error: 'البريد الإلكتروني مُفعّل بالفعل' });
        }

        const verificationCode = generateVerificationCode();
        const verificationExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

        await prisma.users.update({
            where: { id: user.id },
            data: {
                verification_code: verificationCode,
                verification_expires: verificationExpires
            }
        });

        try {
            await sendVerificationEmail(email, verificationCode, user.username || 'مستخدم');
        } catch (emailErr) {
            console.error('Failed to resend verification email:', emailErr);
        }

        res.json({ success: true, message: 'إذا كان البريد مسجلاً، سيتم إرسال رمز تحقق جديد.' });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

exports.updateProfile = exports.completeProfile;
