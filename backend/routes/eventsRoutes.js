const express = require('express');
const router = express.Router();
const { prisma } = require('../models/prismaDatabase');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu-cyber-security-secret-key-2024';

// ═══════════════════════════════════════════════
// EVENTS CRUD
// ═══════════════════════════════════════════════

// GET all events
router.get('/', async (req, res) => {
    try {
        const rows = await prisma.club_events.findMany({
            orderBy: { date: 'desc' }
        });

        const events = rows.map(e => ({
            ...e,
            badges: JSON.parse(e.badges || '[]'),
            requirements: JSON.parse(e.requirements || '[]'),
            agenda: JSON.parse(e.agenda || '[]'),
            prerequisites: JSON.parse(e.prerequisites || '[]'),
            materials: JSON.parse(e.materials || '[]'),
            categories: JSON.parse(e.categories || '[]'),
            prizes: JSON.parse(e.prizes || '[]'),
            topics: JSON.parse(e.topics || '[]'),
            activities: JSON.parse(e.activities || '[]')
        }));
        res.json(events);
    } catch (err) {
        console.error('Get events error:', err);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// POST create event
router.post('/', async (req, res) => {
    try {
        const {
            title, type, category, date, time, location, description,
            max_participants, xp_reward, badges, organizer, requirements,
            agenda, instructor, speaker, prerequisites, materials,
            difficulty, categories, prizes, topics, activities, status, link, image
        } = req.body;

        const event = await prisma.club_events.create({
            data: {
                title,
                type: type || 'workshop',
                category: category || 'training',
                date: date ? new Date(date) : null,
                time,
                location,
                description,
                max_participants: max_participants || 50,
                registered: 0,
                status: status || 'open',
                xp_reward: xp_reward || 100,
                badges: JSON.stringify(badges || []),
                organizer,
                requirements: JSON.stringify(requirements || []),
                agenda: JSON.stringify(agenda || []),
                instructor: instructor || null,
                speaker: speaker || null,
                prerequisites: JSON.stringify(prerequisites || []),
                materials: JSON.stringify(materials || []),
                difficulty,
                categories: JSON.stringify(categories || []),
                prizes: JSON.stringify(prizes || []),
                topics: JSON.stringify(topics || []),
                activities: JSON.stringify(activities || []),
                link,
                image
            }
        });

        res.json({ id: event.id, message: 'Event created' });
    } catch (err) {
        console.error('Create event error:', err);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// PUT update event
router.put('/:id', async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const {
            title, type, category, date, time, location, description,
            max_participants, registered, xp_reward, badges, organizer, requirements,
            agenda, instructor, speaker, prerequisites, materials,
            difficulty, categories, prizes, topics, activities, status, link, image
        } = req.body;

        await prisma.club_events.update({
            where: { id: eventId },
            data: {
                title, type, category,
                date: date ? new Date(date) : undefined,
                time, location, description,
                max_participants,
                registered: registered || undefined,
                status, xp_reward,
                badges: badges ? JSON.stringify(badges) : undefined,
                organizer,
                requirements: requirements ? JSON.stringify(requirements) : undefined,
                agenda: agenda ? JSON.stringify(agenda) : undefined,
                instructor, speaker,
                prerequisites: prerequisites ? JSON.stringify(prerequisites) : undefined,
                materials: materials ? JSON.stringify(materials) : undefined,
                difficulty,
                categories: categories ? JSON.stringify(categories) : undefined,
                prizes: prizes ? JSON.stringify(prizes) : undefined,
                topics: topics ? JSON.stringify(topics) : undefined,
                activities: activities ? JSON.stringify(activities) : undefined,
                link, image
            }
        });

        res.json({ success: true, message: 'Event updated' });
    } catch (err) {
        console.error('Update event error:', err);
        res.status(500).json({ error: 'Failed to update event' });
    }
});

// DELETE event
router.delete('/:id', async (req, res) => {
    try {
        await prisma.club_events.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ success: true, message: 'Event deleted' });
    } catch (err) {
        console.error('Delete event error:', err);
        res.status(500).json({ error: 'Failed to delete event' });
    }
});

// ═══════════════════════════════════════════════
// SURVEYS CRUD
// ═══════════════════════════════════════════════

router.get('/surveys', async (req, res) => {
    try {
        const rows = await prisma.club_surveys.findMany({
            orderBy: { created_at: 'desc' }
        });
        const surveys = rows.map(s => ({
            ...s,
            options: JSON.parse(s.options || '[]')
        }));
        res.json(surveys);
    } catch (err) {
        console.error('Get surveys error:', err);
        res.status(500).json({ error: 'Failed' });
    }
});

router.post('/surveys', async (req, res) => {
    try {
        const { title, description, end_date, questions, xp_reward, options, status } = req.body;
        const survey = await prisma.club_surveys.create({
            data: {
                title, description,
                end_date: end_date ? new Date(end_date) : null,
                questions: questions || 0,
                xp_reward: xp_reward || 10,
                options: JSON.stringify(options || []),
                status: status || 'active'
            }
        });
        res.json({ id: survey.id, message: 'Survey created' });
    } catch (err) {
        console.error('Create survey error:', err);
        res.status(500).json({ error: 'Failed' });
    }
});

router.put('/surveys/:id', async (req, res) => {
    try {
        const { title, description, end_date, participants, questions, xp_reward, options, status, rating } = req.body;
        await prisma.club_surveys.update({
            where: { id: parseInt(req.params.id) },
            data: {
                title, description,
                end_date: end_date ? new Date(end_date) : undefined,
                participants, questions, xp_reward,
                options: options ? JSON.stringify(options) : undefined,
                status, rating
            }
        });
        res.json({ success: true, message: 'Survey updated' });
    } catch (err) {
        console.error('Update survey error:', err);
        res.status(500).json({ error: 'Failed' });
    }
});

router.delete('/surveys/:id', async (req, res) => {
    try {
        await prisma.club_surveys.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ success: true, message: 'Survey deleted' });
    } catch (err) {
        console.error('Delete survey error:', err);
        res.status(500).json({ error: 'Failed' });
    }
});

// ═══════════════════════════════════════════════
// ANNOUNCEMENTS CRUD
// ═══════════════════════════════════════════════

router.get('/announcements', async (req, res) => {
    try {
        const rows = await prisma.club_announcements.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json(rows);
    } catch (err) {
        console.error('Get announcements error:', err);
        res.status(500).json({ error: 'Failed' });
    }
});

router.post('/announcements', async (req, res) => {
    try {
        const { title, content, date, priority, type, link } = req.body;
        const announcement = await prisma.club_announcements.create({
            data: {
                title, content,
                date: date ? new Date(date) : null,
                priority: priority || 'normal',
                type: type || 'info',
                link
            }
        });
        res.json({ id: announcement.id, message: 'Announcement created' });
    } catch (err) {
        console.error('Create announcement error:', err);
        res.status(500).json({ error: 'Failed' });
    }
});

router.put('/announcements/:id', async (req, res) => {
    try {
        const { title, content, date, priority, type, link } = req.body;
        await prisma.club_announcements.update({
            where: { id: parseInt(req.params.id) },
            data: {
                title, content,
                date: date ? new Date(date) : undefined,
                priority, type, link
            }
        });
        res.json({ success: true, message: 'Announcement updated' });
    } catch (err) {
        console.error('Update announcement error:', err);
        res.status(500).json({ error: 'Failed' });
    }
});

router.delete('/announcements/:id', async (req, res) => {
    try {
        await prisma.club_announcements.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ success: true, message: 'Announcement deleted' });
    } catch (err) {
        console.error('Delete announcement error:', err);
        res.status(500).json({ error: 'Failed' });
    }
});

// ═══════════════════════════════════════════════
// REGISTRATIONS
// ═══════════════════════════════════════════════

// POST register for an event
router.post('/:id/register', async (req, res) => {
    try {
        const eventId = parseInt(req.params.id);
        const { name, email, phone, student_id, experience } = req.body;
        if (!name) return res.status(400).json({ error: 'الاسم مطلوب' });

        // Extract user_id from JWT token if available
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        let userId = null;

        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.id;
            } catch (e) {
                // Token invalid but continue without user_id
            }
        }

        // Check if already registered
        const existing = await prisma.event_registrations.findFirst({
            where: userId
                ? { event_id: eventId, user_id: userId }
                : { event_id: eventId, email: email }
        });

        if (existing) {
            return res.status(400).json({ error: 'عذراً، أنت مسجل بالفعل في هذه الفعالية' });
        }

        const registration = await prisma.$transaction(async (tx) => {
            const reg = await tx.event_registrations.create({
                data: {
                    event_id: eventId,
                    user_id: userId,
                    name, email, phone, student_id, experience
                }
            });

            await tx.club_events.update({
                where: { id: eventId },
                data: { registered: { increment: 1 } }
            });

            return reg;
        });

        res.json({ id: registration.id, message: 'تم التسجيل بنجاح' });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Failed to register' });
    }
});

// GET registrations for a specific event (admin)
router.get('/:id/registrations', async (req, res) => {
    try {
        const rows = await prisma.event_registrations.findMany({
            where: { event_id: parseInt(req.params.id) },
            orderBy: { registered_at: 'desc' }
        });
        res.json(rows);
    } catch (err) {
        console.error('Get registrations error:', err);
        res.status(500).json({ error: 'Failed' });
    }
});

// GET all registrations summary (admin dashboard)
router.get('/admin/registrations-summary', async (req, res) => {
    try {
        // We can use raw query or structured findMany with _count
        const events = await prisma.club_events.findMany({
            orderBy: { date: 'desc' },
            select: {
                id: true,
                title: true,
                status: true,
                max_participants: true,
                registered: true
            }
        });

        // If 'registered' column is reliable, we use it, otherwise we could count event_registrations
        const summary = await Promise.all(events.map(async (e) => {
            const actualCount = await prisma.event_registrations.count({
                where: { event_id: e.id }
            });
            return {
                ...e,
                actual_registrations: actualCount
            };
        }));

        res.json(summary);
    } catch (err) {
        console.error('Summary error:', err);
        res.status(500).json({ error: 'Failed' });
    }
});

module.exports = router;
