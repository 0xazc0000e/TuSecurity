const { prisma } = require('../models/prismaDatabase');
const bcrypt = require('bcrypt');

const getStats = async (req, res) => {
    try {
        const [
            totalUsers,
            activeUsers,
            totalSimulators,
            totalContent,
            todayLogins
        ] = await Promise.all([
            prisma.users.count(),
            prisma.users.count({ where: { status: 'active' } }),
            prisma.simulators.count(),
            prisma.content.count(),
            prisma.logs.count({
                where: {
                    action: 'USER_LOGIN',
                    timestamp: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            })
        ]);

        res.json({
            total_users: totalUsers,
            active_users: activeUsers,
            total_simulators: totalSimulators,
            total_content: totalContent,
            today_logins: todayLogins,
            system_health: 98,
            security_score: 95
        });
    } catch (err) {
        console.error('Get stats error:', err);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const { search, role, status, limit = 20, page = 1 } = req.query;
        const take = parseInt(limit);
        const skip = (parseInt(page) - 1) * take;

        const where = {};
        if (search) {
            where.OR = [
                { username: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (role && role !== 'all') {
            where.role = role;
        }

        if (status && status !== 'all') {
            where.status = status;
        }

        const users = await prisma.users.findMany({
            where,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                avatar: true,
                total_xp: true,
                created_at: true,
                last_active: true,
                status: true
            },
            orderBy: { created_at: 'desc' },
            take,
            skip
        });

        res.json(users);
    } catch (err) {
        console.error('Get users error:', err);
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, status } = req.body;

        await prisma.users.update({
            where: { id: parseInt(id) },
            data: { role, status }
        });

        res.json({ message: 'User updated successfully' });
    } catch (err) {
        console.error('Update user error:', err);
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: 'Failed to update user' });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.users.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete user error:', err);
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

const toggleUserBan = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const user = await prisma.users.findUnique({
            where: { id: parseInt(id) },
            select: { status: true, username: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const newStatus = user.status === 'suspended' ? 'active' : 'suspended';

        await prisma.users.update({
            where: { id: parseInt(id) },
            data: { status: newStatus }
        });

        // Log the action
        const action = newStatus === 'suspended' ? 'USER_BANNED' : 'USER_UNBANNED';
        await prisma.logs.create({
            data: {
                user_id: req.user.id,
                action,
                resource_type: 'user',
                resource_id: parseInt(id),
                details: reason || 'No reason provided',
                ip_address: req.ip || 'unknown'
            }
        });

        res.json({
            message: `User ${newStatus === 'suspended' ? 'banned' : 'unbanned'} successfully`,
            status: newStatus
        });
    } catch (err) {
        console.error('Ban toggle error:', err);
        res.status(500).json({ error: 'Failed to update ban status' });
    }
};

const resetUserPassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) {
            return res.status(400).json({ error: 'User ID and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters' });
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(newPassword, saltRounds);

        await prisma.users.update({
            where: { id: parseInt(userId) },
            data: { password_hash: hash }
        });

        // Log the action
        await prisma.logs.create({
            data: {
                user_id: req.user.id,
                action: 'ADMIN_PASSWORD_RESET',
                resource_type: 'user',
                resource_id: parseInt(userId),
                details: 'Password reset by admin',
                ip_address: req.ip || 'unknown'
            }
        });

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        console.error('Password reset error:', err);
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: 'Failed to reset password' });
    }
};

const getSystemLogs = async (req, res) => {
    try {
        const { limit = 100 } = req.query;

        const rows = await prisma.logs.findMany({
            include: {
                users: {
                    select: {
                        username: true,
                        email: true
                    }
                }
            },
            orderBy: { timestamp: 'desc' },
            take: parseInt(limit)
        });

        // Format to match old structure if needed
        const formattedRows = rows.map(row => ({
            ...row,
            username: row.users?.username,
            email: row.users?.email
        }));

        res.json(formattedRows);
    } catch (err) {
        console.error('Get logs error:', err);
        return res.status(500).json({ error: 'Failed to fetch logs' });
    }
};

const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !['admin', 'editor', 'student'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role. Must be admin, editor, or student' });
        }

        await prisma.users.update({
            where: { id: parseInt(id) },
            data: { role }
        });

        // Log the action
        await prisma.logs.create({
            data: {
                user_id: req.user.id,
                action: 'ROLE_CHANGED',
                resource_type: 'user',
                resource_id: parseInt(id),
                details: `Role changed to ${role}`,
                ip_address: req.ip || 'unknown'
            }
        });

        res.json({
            message: 'Role updated successfully',
            role: role
        });
    } catch (err) {
        console.error('Role update error:', err);
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(500).json({ error: 'Failed to update role' });
    }
};

// Setup Route - Make User Admin (Development Only)
const makeMeAdmin = async (req, res) => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const user = await prisma.users.findUnique({
            where: { email }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        await prisma.users.update({
            where: { id: user.id },
            data: { role: 'admin' }
        });

        res.json({
            message: `User ${email} is now an admin`,
            oldRole: user.role,
            newRole: 'admin'
        });
    } catch (err) {
        console.error('Make admin error:', err);
        res.status(500).json({ error: 'Database error' });
    }
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
