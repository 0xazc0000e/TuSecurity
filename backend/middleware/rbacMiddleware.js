const jwt = require('jsonwebtoken');
const { prisma } = require('../models/prismaDatabase');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('ERROR: JWT_SECRET not set in rbacMiddleware');
    process.exit(1);
}

// Role hierarchy (higher level = more permissions)
const ROLE_HIERARCHY = {
    'STUDENT': 1,
    'EDITOR': 2,
    'MANAGER': 3,
    'ADMIN': 4,
    'SUPER_ADMIN': 5
};

/**
 * Check if user has required role or higher
 * @param {string} requiredRole - Minimum role required
 */
const checkPermission = (requiredRole) => {
    return async (req, res, next) => {
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            const user = await prisma.users.findUnique({
                where: { id: decoded.id },
                select: { role: true, email: true }
            });

            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            // Normalization: Ensure role matches hierarchy keys (uppercase)
            const userRole = user.role ? user.role.toUpperCase() : 'STUDENT';
            const userEmail = user.email ? user.email.toLowerCase() : '';

            // Override role for the super admin email
            const effectiveRole = userEmail === 'az.jo.fm@gmail.com' ? 'SUPER_ADMIN' : userRole;
            const userLevel = ROLE_HIERARCHY[effectiveRole] || 0;
            const requiredLevel = ROLE_HIERARCHY[requiredRole.toUpperCase()] || 0;

            if (userLevel < requiredLevel) {
                return res.status(403).json({
                    error: 'Forbidden. Insufficient permissions.',
                    required: requiredRole,
                    current: effectiveRole
                });
            }

            req.userId = decoded.id;
            req.userRole = effectiveRole;
            req.user = { id: decoded.id, ...user, role: effectiveRole };
            next();
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid token' });
            }
            console.error('Permission check error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
};

/**
 * Require admin access (full access)
 */
const requireAdmin = checkPermission('ADMIN');

/**
 * Require manager or higher
 */
const requireManager = checkPermission('MANAGER');

/**
 * Require editor or admin access (content management)
 */
const requireEditor = checkPermission('EDITOR');

/**
 * Simple authentication (any logged-in user)
 */
const requireAuth = (req, res, next) => {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null);

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role ? decoded.role.toUpperCase() : 'STUDENT';
        req.user = { id: decoded.id, role: req.userRole }; // Standardized format
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = {
    checkPermission,
    requireAdmin,
    requireManager,
    requireEditor,
    requireAuth,
    ROLE_HIERARCHY
};
