const express = require('express');
const { prisma } = require('../models/prismaDatabase');
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
router.get('/lessons/completed', requireAuth, lmsController.getCompletedLessons);
router.post('/lessons/:id/complete', requireAuth, lmsController.completeLesson);

// Quiz Submission
router.post('/quiz/submit', requireAuth, lmsController.submitQuiz);

// Flag Submission (CTF)
router.post('/flag/submit', requireAuth, lmsController.submitFlag);

// ═══════════════════════════════════════════════════════════
//  ARTICLES — CRUD
// ═══════════════════════════════════════════════════════════
router.get('/articles', async (req, res) => {
    try {
        const rows = await prisma.articles.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json(rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/articles/:id', async (req, res) => {
    try {
        const row = await prisma.articles.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!row) return res.status(404).json({ error: 'Not found' });
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/articles', requireAuth, requireEditor, upload.single('cover_image'), async (req, res) => {
    try {
        const { title, content, description, author, cover_image: coverImageAlt, tags, read_time } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : (coverImageAlt || '');

        const article = await prisma.articles.create({
            data: {
                title,
                content: content || '',
                description: description || '',
                author: author || '',
                cover_image: imagePath,
                tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
                read_time: parseInt(read_time) || 5
            }
        });
        res.status(201).json({ id: article.id, title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/articles/:id', requireAuth, requireEditor, upload.single('cover_image'), async (req, res) => {
    try {
        const { title, content, description, author, cover_image: coverImageAlt, tags, read_time } = req.body;
        const { id } = req.params;
        let imagePath = req.file ? `/uploads/${req.file.filename}` : coverImageAlt;

        const data = {
            title,
            content,
            description,
            author,
            tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
            read_time: parseInt(read_time)
        };

        if (imagePath !== undefined) {
            data.cover_image = imagePath;
        }

        const article = await prisma.articles.update({
            where: { id: parseInt(id) },
            data
        });
        res.json({ message: 'Updated', article });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/articles/:id', requireAuth, requireEditor, async (req, res) => {
    try {
        await prisma.articles.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ═══════════════════════════════════════════════════════════
//  SYLLABUS (Nested Tracks > Courses > Units > Lessons)
// ═══════════════════════════════════════════════════════════
router.get('/syllabus', lmsController.getSyllabus);
router.get('/latest', lmsController.getLatestKnowledge);

// ═══════════════════════════════════════════════════════════
//  LESSONS
// ═══════════════════════════════════════════════════════════
router.get('/units/:id/lessons', async (req, res) => {
    try {
        const rows = await prisma.lessons.findMany({
            where: { unit_id: parseInt(req.params.id) },
            orderBy: { sort_order: 'asc' }
        });
        res.json(rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/lessons/:id', async (req, res) => {
    try {
        const row = await prisma.lessons.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!row) return res.status(404).json({ error: 'Lesson not found' });
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/lessons', requireAuth, requireEditor, async (req, res) => {
    try {
        const { unit_id, title, content, xp_reward, video_url, is_interactive, sort_order, quiz_config, terminal_config, next_lesson_id } = req.body;
        const lesson = await prisma.lessons.create({
            data: {
                unit_id: parseInt(unit_id),
                title,
                content: content || '',
                xp_reward: parseInt(xp_reward) || 10,
                video_url: video_url || null,
                is_interactive: !!is_interactive,
                sort_order: parseInt(sort_order) || 0,
                quiz_config: typeof quiz_config === 'string' ? quiz_config : JSON.stringify(quiz_config || []),
                terminal_config: typeof terminal_config === 'string' ? terminal_config : JSON.stringify(terminal_config || {}),
                next_lesson_id: next_lesson_id ? parseInt(next_lesson_id) : null
            }
        });
        res.status(201).json({ id: lesson.id, title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/lessons/:id', requireAuth, requireEditor, async (req, res) => {
    try {
        const { title, content, xp_reward, video_url, is_interactive, sort_order, quiz_config, terminal_config, next_lesson_id } = req.body;
        await prisma.lessons.update({
            where: { id: parseInt(req.params.id) },
            data: {
                title,
                content,
                xp_reward: parseInt(xp_reward),
                video_url,
                is_interactive: !!is_interactive,
                sort_order: parseInt(sort_order),
                quiz_config: typeof quiz_config === 'string' ? quiz_config : JSON.stringify(quiz_config),
                terminal_config: typeof terminal_config === 'string' ? terminal_config : JSON.stringify(terminal_config),
                next_lesson_id: next_lesson_id ? parseInt(next_lesson_id) : null
            }
        });
        res.json({ message: 'Updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/lessons/bulk', requireAuth, requireEditor, async (req, res) => {
    try {
        const { lessons } = req.body;
        if (!lessons || !Array.isArray(lessons) || lessons.length === 0) {
            return res.status(400).json({ error: 'Invalid data.' });
        }

        const createdLessons = await prisma.$transaction(
            lessons.map((lesson, index) => prisma.lessons.create({
                data: {
                    unit_id: parseInt(lesson.unit_id),
                    title: lesson.title,
                    content: lesson.content || '',
                    xp_reward: parseInt(lesson.xp_reward) || 10,
                    sort_order: parseInt(lesson.sort_order) || index + 1,
                    terminal_config: typeof lesson.terminal_config === 'string' ? lesson.terminal_config : JSON.stringify(lesson.terminal_config || {}),
                    quiz_config: typeof lesson.quiz_config === 'string' ? lesson.quiz_config : JSON.stringify(lesson.quiz_config || [])
                }
            }))
        );

        res.status(201).json({ message: `Successfully added ${createdLessons.length} lessons.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ═══════════════════════════════════════════════════════════
//  TRACKS / COURSES / UNITS — CRUD
// ═══════════════════════════════════════════════════════════
router.get('/tracks', async (req, res) => {
    try {
        const rows = await prisma.tracks.findMany({
            orderBy: { id: 'asc' }
        });
        res.json(rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/tracks', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { title, description, icon } = req.body;
        const track = await prisma.tracks.create({
            data: { title, description: description || '', icon: icon || '' }
        });
        res.status(201).json({ id: track.id, title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/tracks/:id/courses', async (req, res) => {
    try {
        const rows = await prisma.courses.findMany({
            where: { track_id: parseInt(req.params.id) },
            orderBy: { sort_order: 'asc' }
        });
        res.json(rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/courses', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { track_id, title } = req.body;
        const course = await prisma.courses.create({
            data: { track_id: parseInt(track_id), title }
        });
        res.status(201).json({ id: course.id, title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/courses/:id/units', async (req, res) => {
    try {
        const rows = await prisma.units.findMany({
            where: { course_id: parseInt(req.params.id) },
            orderBy: { sort_order: 'asc' }
        });
        res.json(rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/units', requireAuth, requireAdmin, async (req, res) => {
    try {
        const { course_id, title } = req.body;
        const unit = await prisma.units.create({
            data: { course_id: parseInt(course_id), title }
        });
        res.status(201).json({ id: unit.id, title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generic Delete for tracks/courses/units/lessons
router.delete('/tracks/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        await prisma.tracks.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.delete('/courses/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        await prisma.courses.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.delete('/units/:id', requireAuth, requireAdmin, async (req, res) => {
    try {
        await prisma.units.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.delete('/lessons/:id', requireAuth, requireEditor, async (req, res) => {
    try {
        await prisma.lessons.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ═══════════════════════════════════════════════════════════
//  RECORDED COURSES — CRUD
// ═══════════════════════════════════════════════════════════
router.get('/recorded-courses', async (req, res) => {
    try {
        const rows = await prisma.recorded_courses.findMany({
            orderBy: [
                { sort_order: 'asc' },
                { created_at: 'desc' }
            ]
        });
        res.json(rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/recorded-courses/:id', async (req, res) => {
    try {
        const row = await prisma.recorded_courses.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!row) return res.status(404).json({ error: 'Not found' });
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/recorded-courses', requireAuth, requireEditor, async (req, res) => {
    try {
        const { title, description, instructor, thumbnail_url, video_url, duration, tags, sort_order } = req.body;
        const course = await prisma.recorded_courses.create({
            data: {
                title,
                description: description || '',
                instructor: instructor || '',
                thumbnail_url: thumbnail_url || '',
                video_url,
                duration: duration || '',
                tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
                sort_order: parseInt(sort_order) || 0
            }
        });
        res.status(201).json({ id: course.id, title });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/recorded-courses/:id', requireAuth, requireEditor, async (req, res) => {
    try {
        const { title, description, instructor, thumbnail_url, video_url, duration, tags, sort_order } = req.body;
        await prisma.recorded_courses.update({
            where: { id: parseInt(req.params.id) },
            data: {
                title,
                description,
                instructor,
                thumbnail_url,
                video_url,
                duration,
                tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
                sort_order: parseInt(sort_order)
            }
        });
        res.json({ message: 'Updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/recorded-courses/:id', requireAuth, requireEditor, async (req, res) => {
    try {
        await prisma.recorded_courses.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ═══════════════════════════════════════════════════════════
//  TAGS — CRUD
// ═══════════════════════════════════════════════════════════
router.get('/tags', async (req, res) => {
    try {
        const rows = await prisma.kb_tags.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/tags', requireAuth, requireEditor, async (req, res) => {
    try {
        const { name, color, type } = req.body;
        const tag = await prisma.kb_tags.create({
            data: {
                name,
                color: color || '#7112AF',
                type: type || 'general'
            }
        });
        res.status(201).json({ id: tag.id, name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/tags/:id', requireAuth, requireEditor, async (req, res) => {
    try {
        await prisma.kb_tags.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
