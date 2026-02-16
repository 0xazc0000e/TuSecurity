const express = require('express');
const { db } = require('../models/database');
const multer = require('multer');
const path = require('path');
const lmsController = require('../controllers/lmsController');
const authController = require('../controllers/authController');

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

// ... (existing code)

// Enrollment
router.post('/enroll', authController.authenticate, lmsController.enrollUser);

// Lesson Completion
router.get('/lessons/completed', authController.authenticate, lmsController.getCompletedLessons);
router.post('/lessons/:id/complete', authController.authenticate, lmsController.completeLesson);

// ═══════════════════════════════════════════════════════════

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

router.post('/articles', upload.single('cover_image'), (req, res) => {
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

router.put('/articles/:id', upload.single('cover_image'), (req, res) => {
    const { title, content, description, author, cover_image: coverImageAlt, tags, read_time } = req.body;
    const { id } = req.params;

    // Handle file upload or string URL. 
    // Careful: if no file uploaded, keep existing or use provided string?
    // Usually if req.file is undefined, we rely on the body field.
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

// ═══════════════════════════════════════════════════════════
//  SYLLABUS (Nested Tracks > Courses > Units > Lessons)
// ═══════════════════════════════════════════════════════════
router.get('/syllabus', (req, res) => {
    const query = `
        SELECT 
            t.id as track_id, t.title as track_title, t.icon as track_icon, t.description as track_desc,
            c.id as course_id, c.title as course_title,
            u.id as unit_id, u.title as unit_title,
            l.id as lesson_id, l.title as lesson_title, l.xp_reward,
            l.is_interactive, l.next_lesson_id, l.sort_order,
            l.content, l.video_url, l.quiz_config, l.terminal_config
        FROM tracks t
        LEFT JOIN courses c ON c.track_id = t.id
        LEFT JOIN units u ON u.course_id = c.id
        LEFT JOIN lessons l ON l.unit_id = u.id
        ORDER BY t.id, c.id, u.id, l.sort_order ASC
    `;

    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        const syllabus = [];
        const trackMap = new Map();
        const courseMap = new Map();
        const unitMap = new Map();

        (rows || []).forEach(row => {
            if (!row.track_id) return;

            if (!trackMap.has(row.track_id)) {
                const track = {
                    id: row.track_id, title: row.track_title,
                    icon: row.track_icon, description: row.track_desc,
                    courses: []
                };
                trackMap.set(row.track_id, track);
                syllabus.push(track);
            }

            if (row.course_id && !courseMap.has(row.course_id)) {
                const course = { id: row.course_id, title: row.course_title, units: [] };
                courseMap.set(row.course_id, course);
                trackMap.get(row.track_id).courses.push(course);
            }

            if (row.unit_id && !unitMap.has(row.unit_id)) {
                const unit = { id: row.unit_id, title: row.unit_title, lessons: [] };
                unitMap.set(row.unit_id, unit);
                if (courseMap.has(row.course_id)) {
                    courseMap.get(row.course_id).units.push(unit);
                }
            }

            if (row.lesson_id && unitMap.has(row.unit_id)) {
                unitMap.get(row.unit_id).lessons.push({
                    id: row.lesson_id, title: row.lesson_title,
                    xp_reward: row.xp_reward,
                    is_interactive: row.is_interactive,
                    next_lesson_id: row.next_lesson_id,
                    sort_order: row.sort_order,
                    content: row.content, video_url: row.video_url,
                    quiz_config: row.quiz_config,
                    terminal_config: row.terminal_config
                });
            }
        });

        res.json(syllabus);
    });
});

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

router.post('/lessons', (req, res) => {
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

router.put('/lessons/:id', (req, res) => {
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

router.post('/lessons/bulk', (req, res) => {
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

router.post('/tracks', (req, res) => {
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

router.post('/courses', (req, res) => {
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

router.post('/units', (req, res) => {
    const { course_id, title } = req.body;
    db.run(`INSERT INTO units (course_id, title) VALUES (?, ?)`, [course_id, title], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, title });
    });
});

// Generic Delete for tracks/courses/units/lessons
router.delete('/tracks/:id', (req, res) => {
    db.run(`DELETE FROM tracks WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});
router.delete('/courses/:id', (req, res) => {
    db.run(`DELETE FROM courses WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});
router.delete('/units/:id', (req, res) => {
    db.run(`DELETE FROM units WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});
router.delete('/lessons/:id', (req, res) => {
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

router.post('/recorded-courses', (req, res) => {
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

router.put('/recorded-courses/:id', (req, res) => {
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

router.delete('/recorded-courses/:id', (req, res) => {
    db.run(`DELETE FROM recorded_courses WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});

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

router.post('/articles', (req, res) => {
    const { title, content, description, author, cover_image, tags, read_time } = req.body;
    db.run(
        `INSERT INTO articles (title, content, description, author, cover_image, tags, read_time)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, content || '', description || '', author || '', cover_image || '',
            JSON.stringify(tags || []), read_time || 5],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, title });
        }
    );
});

router.put('/articles/:id', (req, res) => {
    const { title, content, description, author, cover_image, tags, read_time } = req.body;
    db.run(
        `UPDATE articles SET title=?, content=?, description=?, author=?, cover_image=?, tags=?, read_time=? WHERE id=?`,
        [title, content, description, author, cover_image,
            JSON.stringify(tags || []), read_time, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Updated', changes: this.changes });
        }
    );
});

router.delete('/articles/:id', (req, res) => {
    db.run(`DELETE FROM articles WHERE id = ?`, [req.params.id], function (err) {
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

router.post('/tags', (req, res) => {
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

router.delete('/tags/:id', (req, res) => {
    db.run(`DELETE FROM kb_tags WHERE id = ?`, [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted', changes: this.changes });
    });
});

module.exports = router;
