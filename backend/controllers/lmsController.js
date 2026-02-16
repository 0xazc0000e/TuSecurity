const { db } = require('../models/database');

// --- 1. Tracks ---
const getTracks = (req, res) => {
    db.all('SELECT * FROM tracks ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
};

const createTrack = (req, res) => {
    const { title, description, icon } = req.body;
    db.run('INSERT INTO tracks (title, description, icon) VALUES (?, ?, ?)',
        [title, description, icon], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, title });
        });
};

const deleteTrack = (req, res) => {
    db.run('DELETE FROM tracks WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted' });
    });
};

// --- 2. Courses ---
const getCourses = (req, res) => {
    db.all('SELECT * FROM courses WHERE track_id = ? ORDER BY sort_order ASC',
        [req.params.trackId], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
};

const createCourse = (req, res) => {
    const { track_id, title, description, sort_order } = req.body;
    db.run('INSERT INTO courses (track_id, title, description, sort_order) VALUES (?, ?, ?, ?)',
        [track_id, title, description, sort_order || 0], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, title });
        });
};

const deleteCourse = (req, res) => {
    db.run('DELETE FROM courses WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted' });
    });
};

// --- 3. Units ---
const getUnits = (req, res) => {
    db.all('SELECT * FROM units WHERE course_id = ? ORDER BY sort_order ASC',
        [req.params.courseId], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
};

const createUnit = (req, res) => {
    const { course_id, title, sort_order } = req.body;
    db.run('INSERT INTO units (course_id, title, sort_order) VALUES (?, ?, ?)',
        [course_id, title, sort_order || 0], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, title });
        });
};

const deleteUnit = (req, res) => {
    db.run('DELETE FROM units WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted' });
    });
};

// --- 4. Lessons ---
const getLessons = (req, res) => {
    db.all('SELECT * FROM lessons WHERE unit_id = ? ORDER BY sort_order ASC',
        [req.params.unitId], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
};

const createLesson = (req, res) => {
    const { unit_id, title, content, xp_reward, video_url, is_interactive, sort_order, quiz_config, terminal_config, next_lesson_id } = req.body;
    db.run(`INSERT INTO lessons (unit_id, title, content, xp_reward, video_url, is_interactive, sort_order, quiz_config, terminal_config, next_lesson_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            unit_id,
            title,
            content,
            xp_reward || 10,
            video_url,
            is_interactive ? 1 : 0,
            sort_order || 0,
            quiz_config || '[]',
            terminal_config || '{}',
            next_lesson_id || null
        ], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: this.lastID, title });
        });
};

const updateLesson = (req, res) => {
    const { title, content, xp_reward, video_url, is_interactive, sort_order, quiz_config, terminal_config, next_lesson_id } = req.body;
    db.run(`UPDATE lessons SET title=?, content=?, xp_reward=?, video_url=?, is_interactive=?, sort_order=?, quiz_config=?, terminal_config=?, next_lesson_id=? WHERE id=?`,
        [
            title,
            content,
            xp_reward,
            video_url,
            is_interactive ? 1 : 0,
            sort_order,
            quiz_config,
            terminal_config,
            next_lesson_id || null,
            req.params.id
        ], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Updated' });
        });
};

const deleteLesson = (req, res) => {
    db.run('DELETE FROM lessons WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Deleted' });
    });
};
// --- 5. Enrollment ---
const enrollUser = (req, res) => {
    const { type, itemId } = req.body;
    const userId = req.user.id; // From auth middleware

    if (!['track', 'course'].includes(type)) {
        return res.status(400).json({ error: 'Invalid enrollment type' });
    }

    // Check if already enrolled
    db.get('SELECT id FROM user_enrollments WHERE user_id = ? AND type = ? AND item_id = ?',
        [userId, type, itemId], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (row) return res.json({ message: 'Already enrolled' });

            // Enroll
            db.run('INSERT INTO user_enrollments (user_id, type, item_id) VALUES (?, ?, ?)',
                [userId, type, itemId], function (err) {
                    if (err) return res.status(500).json({ error: err.message });
                    res.status(201).json({ message: 'Enrolled successfully' });
                });
        });
};

const completeLesson = (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    // First check if already completed to avoid duplicate XP/logic
    db.get('SELECT id FROM user_lesson_completion WHERE user_id = ? AND lesson_id = ?', [userId, id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) return res.json({ message: 'Lesson already completed' });

        // Get lesson details including XP and Unit/Course info
        const query = `
            SELECT l.xp_reward, l.title, u.course_id 
            FROM lessons l 
            JOIN units u ON l.unit_id = u.id 
            WHERE l.id = ?
        `;

        db.get(query, [id], (err, lesson) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!lesson) return res.status(404).json({ error: 'Lesson not found' });

            const xp = lesson.xp_reward || 0;
            const courseId = lesson.course_id;

            db.serialize(() => {
                // 1. Mark as completed
                db.run('INSERT INTO user_lesson_completion (user_id, lesson_id) VALUES (?, ?)',
                    [userId, id], (err) => {
                        if (err) {
                            console.error('Failed to mark lesson complete:', err);
                            return res.status(500).json({ error: 'Failed to record completion' });
                        }
                    });

                // 2. Award XP
                if (xp > 0) {
                    db.run('UPDATE users SET total_xp = total_xp + ? WHERE id = ?', [xp, userId]);

                    // Log it
                    db.run('INSERT INTO logs (user_id, action, resource_type, resource_id, details) VALUES (?, ?, ?, ?, ?)',
                        [userId, 'lesson_complete', 'lesson', id, `Completed lesson "${lesson.title}" and earned ${xp} XP`]);
                }

                // 3. Update Course Progress
                // First get total lessons in course
                const countQuery = `
                    SELECT COUNT(*) as total 
                    FROM lessons l 
                    JOIN units u ON l.unit_id = u.id 
                    WHERE u.course_id = ?
                `;

                db.get(countQuery, [courseId], (err, totalRow) => {
                    if (err || !totalRow) return;

                    const totalLessons = totalRow.total;

                    // Get completed lessons for this course
                    const completedQuery = `
                        SELECT COUNT(ulc.lesson_id) as completed
                        FROM user_lesson_completion ulc
                        JOIN lessons l ON ulc.lesson_id = l.id
                        JOIN units u ON l.unit_id = u.id
                        WHERE ulc.user_id = ? AND u.course_id = ?
                    `;

                    db.get(completedQuery, [userId, courseId], (err, completedRow) => {
                        if (err || !completedRow) return;

                        const completedLessons = completedRow.completed;
                        const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
                        const isCompleted = progress === 100 ? 1 : 0;

                        // Ensure enrollment exists, then update it
                        db.run(`INSERT OR IGNORE INTO user_enrollments (user_id, type, item_id, progress, is_completed) 
                                VALUES (?, 'course', ?, ?, ?)`,
                            [userId, courseId, progress, isCompleted]);

                        db.run(`UPDATE user_enrollments SET progress = ?, is_completed = ?, last_accessed = CURRENT_TIMESTAMP 
                                WHERE user_id = ? AND type = 'course' AND item_id = ?`,
                            [progress, isCompleted, userId, courseId]);
                    });
                });

                res.json({ message: 'Lesson completed', xpAwarded: xp });
            });
        });
    });
};

const getCompletedLessons = (req, res) => {
    const userId = req.user.id;
    db.all('SELECT lesson_id FROM user_lesson_completion WHERE user_id = ?', [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(r => r.lesson_id));
    });
};

module.exports = {
    getTracks, createTrack, deleteTrack,
    getCourses, createCourse, deleteCourse,
    getUnits, createUnit, deleteUnit,
    getLessons, createLesson, updateLesson, deleteLesson,
    enrollUser,
    completeLesson, getCompletedLessons
};
