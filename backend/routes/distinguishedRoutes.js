const express = require('express');
const router = express.Router();
const { db } = require('../models/database');

// ═══════════════════════════════════════════════
// DISTINGUISHED MEMBERS
// ═══════════════════════════════════════════════

// GET all members (optional ?month=YYYY-MM filter)
router.get('/', (req, res) => {
    const { month } = req.query;
    let sql = 'SELECT * FROM distinguished_members';
    const params = [];
    if (month) {
        sql += ' WHERE month = ?';
        params.push(month);
    }
    sql += ' ORDER BY created_at DESC';
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

// GET available months
router.get('/months', (req, res) => {
    db.all(
        'SELECT DISTINCT month FROM distinguished_members ORDER BY month DESC',
        [],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json((rows || []).map(r => r.month));
        }
    );
});

// POST create member (admin)
router.post('/', (req, res) => {
    const { name, committee, month, reason, color } = req.body;
    if (!name || !month) return res.status(400).json({ error: 'name and month are required' });
    db.run(
        'INSERT INTO distinguished_members (name, committee, month, reason, color) VALUES (?, ?, ?, ?, ?)',
        [name, committee || null, month, reason || null, color || '#f59e0b'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Member added' });
        }
    );
});

// DELETE member (admin)
router.delete('/:id', (req, res) => {
    // Also delete their messages
    db.run('DELETE FROM anonymous_messages WHERE member_id = ?', [req.params.id]);
    db.run('DELETE FROM distinguished_members WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

// ═══════════════════════════════════════════════
// ANONYMOUS MESSAGES
// ═══════════════════════════════════════════════

// GET messages for a member
router.get('/:id/messages', (req, res) => {
    db.all(
        'SELECT id, message, created_at FROM anonymous_messages WHERE member_id = ? ORDER BY created_at DESC',
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        }
    );
});

// POST anonymous message
router.post('/:id/messages', (req, res) => {
    const { message } = req.body;
    if (!message || message.trim().length === 0) return res.status(400).json({ error: 'message is required' });
    if (message.length > 200) return res.status(400).json({ error: 'message too long (max 200 chars)' });
    db.run(
        'INSERT INTO anonymous_messages (member_id, message) VALUES (?, ?)',
        [req.params.id, message.trim()],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Message sent' });
        }
    );
});

module.exports = router;
