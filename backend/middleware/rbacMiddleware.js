const jwt = require('jsonwebtoken');
const { db } = require('../models/database');

const JWT_SECRET = process.env.JWT_SECRET || 'tu-cyber-security-secret-key-2024';

// Role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY = {
    'student': 1,
    'editor': 2,
    'admin': 3
};

/**
 * Check if user has required role or higher
 * @param {string} requiredRole - Minimum role required
 */
const checkPermission = (requiredRole) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        
        const token = authHeader.split(' ')[1];
        
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            
            db.get(
                'SELECT role FROM users WHERE id = ?',
                [decoded.userId],
                (err, user) => {
                    if (err) {
                        console.error('Permission check error:', err);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    
                    if (!user) {
                        return res.status(401).json({ error: 'User not found' });
                    }
                    
                    const userLevel = ROLE_HIERARCHY[user.role] || 0;
                    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
                    
                    if (userLevel < requiredLevel) {
                        return res.status(403).json({ 
                            error: 'Forbidden. Insufficient permissions.',
                            required: requiredRole,
                            current: user.role
                        });
                    }
                    
                    req.userId = decoded.userId;
                    req.userRole = user.role;
                    next();
                }
            );
        } catch (error) {
            return res.status(401).json({ error: 'Invalid token' });
        }
    };
};

/**
 * Require admin access (full access)
 */
const requireAdmin = checkPermission('admin');

/**
 * Require editor or admin access (content management)
 */
const requireEditor = checkPermission('editor');

/**
 * Simple authentication (any logged-in user)
 */
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = {
    checkPermission,
    requireAdmin,
    requireEditor,
    requireAuth,
    ROLE_HIERARCHY
};
