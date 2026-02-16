const express = require('express');
const router = express.Router();
const { db } = require('../models/database');

// ═══════════════════════════════════════════════
// EVENTS CRUD
// ═══════════════════════════════════════════════

// GET all events
router.get('/', (req, res) => {
    db.all('SELECT * FROM club_events ORDER BY date DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Parse JSON fields
        const events = (rows || []).map(e => ({
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
    });
});

// POST create event
router.post('/', (req, res) => {
    const {
        title, type, category, date, time, location, description,
        max_participants, xp_reward, badges, organizer, requirements,
        agenda, instructor, speaker, prerequisites, materials,
        difficulty, categories, prizes, topics, activities, status, link, image
    } = req.body;

    db.run(
        `INSERT INTO club_events (title, type, category, date, time, location, description,
         max_participants, registered, status, xp_reward, badges, organizer, requirements,
         agenda, instructor, speaker, prerequisites, materials, difficulty, categories, prizes, topics, activities, link, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            title, type || 'workshop', category || 'training', date, time, location, description,
            max_participants || 50, status || 'open', xp_reward || 100,
            JSON.stringify(badges || []), organizer,
            JSON.stringify(requirements || []), JSON.stringify(agenda || []),
            instructor || null, speaker || null,
            JSON.stringify(prerequisites || []), JSON.stringify(materials || []),
            difficulty || null, JSON.stringify(categories || []),
            JSON.stringify(prizes || []), JSON.stringify(topics || []),
            JSON.stringify(activities || []), link || null, image || null
        ],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Event created' });
        }
    );
});

// PUT update event
router.put('/:id', (req, res) => {
    const {
        title, type, category, date, time, location, description,
        max_participants, registered, xp_reward, badges, organizer, requirements,
        agenda, instructor, speaker, prerequisites, materials,
        difficulty, categories, prizes, topics, activities, status, link, image
    } = req.body;

    db.run(
        `UPDATE club_events SET 
         title=?, type=?, category=?, date=?, time=?, location=?, description=?,
         max_participants=?, registered=?, status=?, xp_reward=?, badges=?, organizer=?,
         requirements=?, agenda=?, instructor=?, speaker=?, prerequisites=?, materials=?,
         difficulty=?, categories=?, prizes=?, topics=?, activities=?, link=?, image=?
         WHERE id=?`,
        [
            title, type, category, date, time, location, description,
            max_participants, registered || 0, status, xp_reward,
            JSON.stringify(badges || []), organizer,
            JSON.stringify(requirements || []), JSON.stringify(agenda || []),
            instructor || null, speaker || null,
            JSON.stringify(prerequisites || []), JSON.stringify(materials || []),
            difficulty || null, JSON.stringify(categories || []),
            JSON.stringify(prizes || []), JSON.stringify(topics || []),
            JSON.stringify(activities || []), link || null, image || null,
            req.params.id
        ],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ changes: this.changes, message: 'Event updated' });
        }
    );
});

// DELETE event
router.delete('/:id', (req, res) => {
    db.run('DELETE FROM club_events WHERE id=?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ changes: this.changes, message: 'Event deleted' });
    });
});

// ═══════════════════════════════════════════════
// SURVEYS CRUD
// ═══════════════════════════════════════════════

router.get('/surveys', (req, res) => {
    db.all('SELECT * FROM club_surveys ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        const surveys = (rows || []).map(s => ({
            ...s,
            options: JSON.parse(s.options || '[]')
        }));
        res.json(surveys);
    });
});

router.post('/surveys', (req, res) => {
    const { title, description, end_date, questions, xp_reward, options, status } = req.body;
    db.run(
        `INSERT INTO club_surveys (title, description, end_date, questions, xp_reward, options, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, description, end_date, questions || 0, xp_reward || 10, JSON.stringify(options || []), status || 'active'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Survey created' });
        }
    );
});

router.put('/surveys/:id', (req, res) => {
    const { title, description, end_date, participants, questions, xp_reward, options, status, rating } = req.body;
    db.run(
        `UPDATE club_surveys SET title=?, description=?, end_date=?, participants=?, questions=?, xp_reward=?, options=?, status=?, rating=? WHERE id=?`,
        [title, description, end_date, participants || 0, questions || 0, xp_reward || 10, JSON.stringify(options || []), status || 'active', rating || 0, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ changes: this.changes, message: 'Survey updated' });
        }
    );
});

router.delete('/surveys/:id', (req, res) => {
    db.run('DELETE FROM club_surveys WHERE id=?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ changes: this.changes, message: 'Survey deleted' });
    });
});

// ═══════════════════════════════════════════════
// ANNOUNCEMENTS CRUD
// ═══════════════════════════════════════════════

router.get('/announcements', (req, res) => {
    db.all('SELECT * FROM club_announcements ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

router.post('/announcements', (req, res) => {
    const { title, content, date, priority, type, link } = req.body;
    db.run(
        `INSERT INTO club_announcements (title, content, date, priority, type, link) VALUES (?, ?, ?, ?, ?, ?)`,
        [title, content, date, priority || 'normal', type || 'info', link || null],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Announcement created' });
        }
    );
});

router.put('/announcements/:id', (req, res) => {
    const { title, content, date, priority, type, link } = req.body;
    db.run(
        `UPDATE club_announcements SET title=?, content=?, date=?, priority=?, type=?, link=? WHERE id=?`,
        [title, content, date, priority, type, link, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ changes: this.changes, message: 'Announcement updated' });
        }
    );
});

router.delete('/announcements/:id', (req, res) => {
    db.run('DELETE FROM club_announcements WHERE id=?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ changes: this.changes, message: 'Announcement deleted' });
    });
});
// ═══════════════════════════════════════════════
// REGISTRATIONS
// ═══════════════════════════════════════════════

// POST register for an event
router.post('/:id/register', (req, res) => {
    const eventId = req.params.id;
    const { name, email, phone, student_id, experience } = req.body;
    if (!name) return res.status(400).json({ error: 'الاسم مطلوب' });

    db.run(
        `INSERT INTO event_registrations (event_id, name, email, phone, student_id, experience) VALUES (?, ?, ?, ?, ?, ?)`,
        [eventId, name, email, phone, student_id, experience],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            // Auto-increment registered count
            db.run(`UPDATE club_events SET registered = registered + 1 WHERE id = ?`, [eventId]);
            res.json({ id: this.lastID, message: 'تم التسجيل بنجاح' });
        }
    );
});

// GET registrations for a specific event (admin)
router.get('/:id/registrations', (req, res) => {
    db.all(
        `SELECT * FROM event_registrations WHERE event_id = ? ORDER BY registered_at DESC`,
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        }
    );
});

// GET all registrations summary (admin dashboard)
router.get('/admin/registrations-summary', (req, res) => {
    db.all(
        `SELECT e.id, e.title, e.status, e.max_participants, e.registered,
                COUNT(r.id) as actual_registrations
         FROM club_events e
         LEFT JOIN event_registrations r ON e.id = r.event_id
         GROUP BY e.id
         ORDER BY e.date DESC`,
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        }
    );
});

module.exports = router;
