const express = require('express');
const router = express.Router();
const { prisma } = require('../models/prismaDatabase');

// ═══════════════════════════════════════════════
// DISTINGUISHED MEMBERS
// ═══════════════════════════════════════════════

// GET all members (optional ?month=YYYY-MM filter)
router.get('/', async (req, res) => {
    try {
        const { month } = req.query;
        const where = {};
        if (month) {
            where.month = month;
        }

        const members = await prisma.distinguished_members.findMany({
            where,
            orderBy: { created_at: 'desc' }
        });

        res.json(members);
    } catch (err) {
        console.error('Get members error:', err);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

// GET available months
router.get('/months', async (req, res) => {
    try {
        const rows = await prisma.distinguished_members.findMany({
            select: { month: true },
            distinct: ['month'],
            orderBy: { month: 'desc' }
        });
        res.json(rows.map(r => r.month));
    } catch (err) {
        console.error('Get months error:', err);
        res.status(500).json({ error: 'Failed to fetch months' });
    }
});

// POST create member (admin)
router.post('/', async (req, res) => {
    try {
        const { name, committee, month, reason, color } = req.body;
        if (!name || !month) return res.status(400).json({ error: 'name and month are required' });

        const member = await prisma.distinguished_members.create({
            data: {
                name,
                committee: committee || null,
                month,
                reason: reason || null,
                color: color || '#f59e0b'
            }
        });

        res.json({ id: member.id, message: 'Member added' });
    } catch (err) {
        console.error('Create member error:', err);
        res.status(500).json({ error: 'Failed to add member' });
    }
});

// DELETE member (admin)
router.delete('/:id', async (req, res) => {
    try {
        const memberId = parseInt(req.params.id);

        await prisma.$transaction([
            prisma.anonymous_messages.deleteMany({ where: { member_id: memberId } }),
            prisma.distinguished_members.delete({ where: { id: memberId } })
        ]);

        res.json({ success: true, message: 'Member deleted' });
    } catch (err) {
        console.error('Delete member error:', err);
        res.status(500).json({ error: 'Failed to delete member' });
    }
});

// ═══════════════════════════════════════════════
// ANONYMOUS MESSAGES
// ═══════════════════════════════════════════════

// GET messages for a member
router.get('/:id/messages', async (req, res) => {
    try {
        const rows = await prisma.anonymous_messages.findMany({
            where: { member_id: parseInt(req.params.id) },
            orderBy: { created_at: 'desc' },
            select: { id: true, message: true, created_at: true }
        });
        res.json(rows);
    } catch (err) {
        console.error('Get messages error:', err);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// POST anonymous message
router.post('/:id/messages', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || message.trim().length === 0) return res.status(400).json({ error: 'message is required' });
        if (message.length > 200) return res.status(400).json({ error: 'message too long (max 200 chars)' });

        const msg = await prisma.anonymous_messages.create({
            data: {
                member_id: parseInt(req.params.id),
                message: message.trim()
            }
        });

        res.json({ id: msg.id, message: 'Message sent' });
    } catch (err) {
        console.error('Send message error:', err);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

module.exports = router;
