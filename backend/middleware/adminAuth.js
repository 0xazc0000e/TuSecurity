const jwt = require('jsonwebtoken');
const { prisma } = require('../models/prismaDatabase');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is not set!');
    process.exit(1);
}

/**
 * Middleware to verify JWT token and check if user is admin
 * Must be applied to ALL /api/admin/* routes
 */
const requireAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if user is admin
        const user = await prisma.users.findUnique({
            where: { id: decoded.id },
            select: { id: true, role: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden. Admin access required.' });
        }

        // Attach user info to request
        req.userId = decoded.id;
        req.userRole = user.role;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        console.error('Admin auth error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Middleware to verify JWT token only (for authenticated routes)
 */
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = {
    requireAdmin,
    requireAuth
};
