const express = require('express');
const { db } = require('../models/database');
const multer = require('multer');
const path = require('path');
const lmsController = require('../controllers/lmsController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireEditor, requireAdmin } = require('../middleware/rbacMiddleware');

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only images are allowed'));
    }
});

// Enrollment
router.post('/enroll', requireAuth, lmsController.enrollUser);

// Lesson Completion
// Lesson Completion
router.get('/lessons/completed', requireAuth, lmsController.getCompletedLessons);
router.post('/lessons/:id/complete', requireAuth, lmsController.completeLesson);

// Quiz Submission
router.post('/quiz/submit', requireAuth, lmsController.submitQuiz);

// ═══════════════════════════════════════════════════════════
//  ARTICLES — CRUD
// ═══════════════════════════════════════════════════════════
router.get('/articles', (req, res) => {
    db.all(`SELECT * FROM articles ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

router.get('/articles/:id', (req, res) => {
    db.get(`SELECT * FROM articles WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Not found' });
        res.json(row);
    });
});

router.post('/articles', requireAuth, requireEditor, upload.single('cover_image'), (req, res) => {
    const { title, content, description, author, cover_image: coverImageAlt, tags, read_time } = req.body;

    // Handle file upload or string URL
    const imagePath = req.file ? `/uploads/${req.file.filename}` : (coverImageAlt || '');

    db.run(
        `INSERT INTO articles (title, content, description, author, cover_image, tags, read_time)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, content || '', description || '', author || '', imagePath,
            JSON.stringify(tags || []), read_time || 5],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, title });
        }
    );
});

router.put('/articles/:id', requireAuth, requireEditor, upload.single('cover_image'), (req, res) => {
    const { title, content, description, author, cover_image: coverImageAlt, tags, read_time } = req.body;
    const { id } = req.params;

    let imagePath = req.file ? `/uploads/${req.file.filename}` : coverImageAlt;

    const query = `UPDATE articles SET title=?, content=?, description=?, author=?, tags=?, read_time=?${imagePath !== undefined ? ', cover_image=?' : ''} WHERE id=?`;
    const params = [title, content, description, author, JSON.stringify(tags || []), read_time];

    if (imagePath !== undefined) {
        params.push(imagePath);
    }
    params.push(id);

    db.run(query, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Updated', changes: this.changes });
    });
});

router.delete('/articles/:id', requireAuth, requireEditor, (req, res) => {
    db.run(`DELETE FROM articles WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});

// ═══════════════════════════════════════════════════════════
//  SYLLABUS (Nested Tracks > Courses > Units > Lessons)
// ═══════════════════════════════════════════════════════════
router.get('/syllabus', lmsController.getSyllabus);

// ═══════════════════════════════════════════════════════════
//  LESSONS
// ═══════════════════════════════════════════════════════════
router.get('/units/:id/lessons', (req, res) => {
    db.all(`SELECT * FROM lessons WHERE unit_id = ? ORDER BY sort_order ASC`, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

router.get('/lessons/:id', (req, res) => {
    db.get(`SELECT * FROM lessons WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Lesson not found' });
        res.json(row);
    });
});

router.post('/lessons', requireAuth, requireEditor, (req, res) => {
    const { unit_id, title, content, xp_reward, video_url, is_interactive, sort_order, quiz_config, terminal_config, next_lesson_id } = req.body;
    db.run(
        `INSERT INTO lessons (unit_id, title, content, xp_reward, video_url, is_interactive, sort_order, quiz_config, terminal_config, next_lesson_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [unit_id, title, content || '', xp_reward || 10, video_url || null,
            is_interactive ? 1 : 0, sort_order || 0,
            quiz_config || '[]', terminal_config || '{}', next_lesson_id || null],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, title });
        }
    );
});

router.put('/lessons/:id', requireAuth, requireEditor, (req, res) => {
    const { title, content, xp_reward, video_url, is_interactive, sort_order, quiz_config, terminal_config, next_lesson_id } = req.body;
    db.run(
        `UPDATE lessons SET title=?, content=?, xp_reward=?, video_url=?, is_interactive=?, sort_order=?, quiz_config=?, terminal_config=?, next_lesson_id=? WHERE id=?`,
        [title, content, xp_reward, video_url, is_interactive ? 1 : 0, sort_order,
            quiz_config, terminal_config, next_lesson_id || null, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Updated', changes: this.changes });
        }
    );
});

router.post('/lessons/bulk', requireAuth, requireEditor, (req, res) => {
    const { lessons } = req.body;
    if (!lessons || !Array.isArray(lessons) || lessons.length === 0) {
        return res.status(400).json({ error: 'Invalid data.' });
    }
    let insertedCount = 0;
    let hasError = false;

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        lessons.forEach((lesson, index) => {
            if (hasError) return;
            db.run(
                `INSERT INTO lessons (unit_id, title, content, xp_reward, sort_order, terminal_config, quiz_config) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [lesson.unit_id, lesson.title, lesson.content || '', lesson.xp_reward || 10,
                lesson.sort_order || index + 1, lesson.terminal_config || '{}', lesson.quiz_config || '[]'],
                function (err) {
                    if (err) {
                        hasError = true;
                        db.run('ROLLBACK');
                        return res.status(500).json({ error: 'Bulk insert failed at: ' + lesson.title });
                    }
                    insertedCount++;
                    if (insertedCount === lessons.length) {
                        db.run('COMMIT', (commitErr) => {
                            if (commitErr) return res.status(500).json({ error: 'Commit failed' });
                            res.status(201).json({ message: `Successfully added ${insertedCount} lessons.` });
                        });
                    }
                }
            );
        });
    });
});

// ═══════════════════════════════════════════════════════════
//  TRACKS / COURSES / UNITS — CRUD
// ═══════════════════════════════════════════════════════════
router.get('/tracks', (req, res) => {
    db.all(`SELECT * FROM tracks ORDER BY id`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

router.post('/tracks', requireAuth, requireAdmin, (req, res) => {
    const { title, description, icon } = req.body;
    db.run(`INSERT INTO tracks (title, description, icon) VALUES (?, ?, ?)`, [title, description || '', icon || ''], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title });
    });
});

router.get('/tracks/:id/courses', (req, res) => {
    db.all(`SELECT * FROM courses WHERE track_id = ? ORDER BY sort_order`, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

router.post('/courses', requireAuth, requireAdmin, (req, res) => {
    const { track_id, title } = req.body;
    db.run(`INSERT INTO courses (track_id, title) VALUES (?, ?)`, [track_id, title], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title });
    });
});

router.get('/courses/:id/units', (req, res) => {
    db.all(`SELECT * FROM units WHERE course_id = ? ORDER BY sort_order`, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

router.post('/units', requireAuth, requireAdmin, (req, res) => {
    const { course_id, title } = req.body;
    db.run(`INSERT INTO units (course_id, title) VALUES (?, ?)`, [course_id, title], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title });
    });
});

// Generic Delete for tracks/courses/units/lessons
router.delete('/tracks/:id', requireAuth, requireAdmin, (req, res) => {
    db.run(`DELETE FROM tracks WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});
router.delete('/courses/:id', requireAuth, requireAdmin, (req, res) => {
    db.run(`DELETE FROM courses WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});
router.delete('/units/:id', requireAuth, requireAdmin, (req, res) => {
    db.run(`DELETE FROM units WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});
router.delete('/lessons/:id', requireAuth, requireEditor, (req, res) => {
    db.run(`DELETE FROM lessons WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});

// ═══════════════════════════════════════════════════════════
//  RECORDED COURSES — CRUD
// ═══════════════════════════════════════════════════════════
router.get('/recorded-courses', (req, res) => {
    db.all(`SELECT * FROM recorded_courses ORDER BY sort_order ASC, created_at DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

router.get('/recorded-courses/:id', (req, res) => {
    db.get(`SELECT * FROM recorded_courses WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Not found' });
        res.json(row);
    });
});

router.post('/recorded-courses', requireAuth, requireEditor, (req, res) => {
    const { title, description, instructor, thumbnail_url, video_url, duration, tags, sort_order } = req.body;
    db.run(
        `INSERT INTO recorded_courses (title, description, instructor, thumbnail_url, video_url, duration, tags, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description || '', instructor || '', thumbnail_url || '', video_url,
            duration || '', JSON.stringify(tags || []), sort_order || 0],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, title });
        }
    );
});

router.put('/recorded-courses/:id', requireAuth, requireEditor, (req, res) => {
    const { title, description, instructor, thumbnail_url, video_url, duration, tags, sort_order } = req.body;
    db.run(
        `UPDATE recorded_courses SET title=?, description=?, instructor=?, thumbnail_url=?, video_url=?, duration=?, tags=?, sort_order=? WHERE id=?`,
        [title, description, instructor, thumbnail_url, video_url, duration,
            JSON.stringify(tags || []), sort_order, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Updated', changes: this.changes });
        }
    );
});

router.delete('/recorded-courses/:id', requireAuth, requireEditor, (req, res) => {
    db.run(`DELETE FROM recorded_courses WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});

// ═══════════════════════════════════════════════════════════
//  TAGS — CRUD
// ═══════════════════════════════════════════════════════════
router.get('/tags', (req, res) => {
    db.all(`SELECT * FROM kb_tags ORDER BY name`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows || []);
    });
});

router.post('/tags', requireAuth, requireEditor, (req, res) => {
    const { name, color, type } = req.body;
    db.run(
        `INSERT INTO kb_tags (name, color, type) VALUES (?, ?, ?)`,
        [name, color || '#7112AF', type || 'general'],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, name });
        }
    );
});

router.delete('/tags/:id', requireAuth, requireEditor, (req, res) => {
    db.run(`DELETE FROM kb_tags WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});

module.exports = router;
