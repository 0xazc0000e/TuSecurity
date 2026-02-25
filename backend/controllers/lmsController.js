const { db } = require('../models/database');
const { checkAndAwardBadges } = require('../services/badgeService');

// --- 1. Tracks ---
const getTracks = async (req, res) => {
    try {
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM tracks ORDER BY created_at DESC', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
        res.json({ success: true, tracks: rows });
    } catch (error) {
        console.error('Error fetching tracks:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch tracks' });
    }
};

const createTrack = async (req, res) => {
    try {
        const { title, description, icon } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, error: 'Title is required' });
        }

        const result = await new Promise((resolve, reject) => {
            db.run('INSERT INTO tracks (title, description, icon) VALUES (?, ?, ?)',
                [title, description, icon], function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                });
        });

        res.status(201).json({ success: true, id: result.id, title, message: 'Track created successfully' });
    } catch (error) {
        console.error('Error creating track:', error);
        res.status(500).json({ success: false, error: 'Failed to create track' });
    }
};

const deleteTrack = async (req, res) => {
    try {
        const { id } = req.params;

        await new Promise((resolve, reject) => {
            db.run('DELETE FROM tracks WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ success: true, message: 'Track deleted successfully' });
    } catch (error) {
        console.error('Error deleting track:', error);
        res.status(500).json({ success: false, error: 'Failed to delete track' });
    }
};

// --- 2. Courses ---
const getCourses = async (req, res) => {
    try {
        const { trackId } = req.params;
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM courses WHERE track_id = ? ORDER BY sort_order ASC',
                [trackId], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
        });
        res.json({ success: true, courses: rows });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch courses' });
    }
};

const createCourse = async (req, res) => {
    try {
        const { track_id, title, description, sort_order } = req.body;

        if (!track_id || !title) {
            return res.status(400).json({ success: false, error: 'Track ID and title are required' });
        }

        const result = await new Promise((resolve, reject) => {
            db.run('INSERT INTO courses (track_id, title, description, sort_order) VALUES (?, ?, ?, ?)',
                [track_id, title, description, sort_order || 0], function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                });
        });

        res.status(201).json({ success: true, id: result.id, title, message: 'Course created successfully' });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ success: false, error: 'Failed to create course' });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        await new Promise((resolve, reject) => {
            db.run('DELETE FROM courses WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ success: true, message: 'Course deleted successfully' });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ success: false, error: 'Failed to delete course' });
    }
};

// --- 3. Units ---
const getUnits = async (req, res) => {
    try {
        const { courseId } = req.params;
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM units WHERE course_id = ? ORDER BY sort_order ASC',
                [courseId], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
        });
        res.json({ success: true, units: rows });
    } catch (error) {
        console.error('Error fetching units:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch units' });
    }
};

const createUnit = async (req, res) => {
    try {
        const { course_id, title, sort_order } = req.body;

        if (!course_id || !title) {
            return res.status(400).json({ success: false, error: 'Course ID and title are required' });
        }

        const result = await new Promise((resolve, reject) => {
            db.run('INSERT INTO units (course_id, title, sort_order) VALUES (?, ?, ?)',
                [course_id, title, sort_order || 0], function (err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                });
        });

        res.status(201).json({ success: true, id: result.id, title, message: 'Unit created successfully' });
    } catch (error) {
        console.error('Error creating unit:', error);
        res.status(500).json({ success: false, error: 'Failed to create unit' });
    }
};

const deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;

        await new Promise((resolve, reject) => {
            db.run('DELETE FROM units WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ success: true, message: 'Unit deleted successfully' });
    } catch (error) {
        console.error('Error deleting unit:', error);
        res.status(500).json({ success: false, error: 'Failed to delete unit' });
    }
};

// --- 4. Lessons ---
const getLessons = async (req, res) => {
    try {
        const { unitId } = req.params;
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM lessons WHERE unit_id = ? ORDER BY sort_order ASC',
                [unitId], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
        });
        res.json({ success: true, lessons: rows });
    } catch (error) {
        console.error('Error fetching lessons:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch lessons' });
    }
};

const createLesson = async (req, res) => {
    try {
        const { unit_id, title, content, xp_reward, video_url, is_interactive, sort_order, quiz_config, terminal_config, next_lesson_id } = req.body;

        if (!unit_id || !title) {
            return res.status(400).json({ success: false, error: 'Unit ID and title are required' });
        }

        const result = await new Promise((resolve, reject) => {
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
                    if (err) reject(err);
                    else resolve({ id: this.lastID });
                });
        });

        res.status(201).json({ success: true, id: result.id, title, message: 'Lesson created successfully' });
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ success: false, error: 'Failed to create lesson' });
    }
};

const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, xp_reward, video_url, is_interactive, sort_order, quiz_config, terminal_config, next_lesson_id } = req.body;

        await new Promise((resolve, reject) => {
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
                    id
                ], function (err) {
                    if (err) reject(err);
                    else resolve();
                });
        });

        res.json({ success: true, message: 'Lesson updated successfully' });
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ success: false, error: 'Failed to update lesson' });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;

        await new Promise((resolve, reject) => {
            db.run('DELETE FROM lessons WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve();
            });
        });

        res.json({ success: true, message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ success: false, error: 'Failed to delete lesson' });
    }
};
// --- 5. Enrollment ---
const enrollUser = async (req, res) => {
    try {
        const { type, itemId } = req.body;
        const userId = req.user.id;

        if (!['track', 'course'].includes(type)) {
            return res.status(400).json({ success: false, error: 'Invalid enrollment type' });
        }

        if (!itemId) {
            return res.status(400).json({ success: false, error: 'Item ID is required' });
        }

        // Check if already enrolled
        const existing = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM user_enrollments WHERE user_id = ? AND type = ? AND item_id = ?',
                [userId, type, itemId], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
        });

        if (existing) {
            return res.json({ success: true, message: 'Already enrolled' });
        }

        // Enroll
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO user_enrollments (user_id, type, item_id) VALUES (?, ?, ?)',
                [userId, type, itemId], function (err) {
                    if (err) reject(err);
                    else resolve();
                });
        });

        res.status(201).json({ success: true, message: 'Enrolled successfully' });
    } catch (error) {
        console.error('Error enrolling user:', error);
        res.status(500).json({ success: false, error: 'Failed to enroll' });
    }
};

const completeLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Check if already completed
        const alreadyCompleted = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM lesson_progress WHERE user_id = ? AND lesson_id = ? AND is_completed = 1',
                [userId, id], (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                });
        });

        if (alreadyCompleted) {
            return res.json({ success: true, message: 'Lesson already completed' });
        }

        // Get lesson details
        const query = `
            SELECT l.xp_reward, l.title, l.unit_id, u.course_id, c.track_id 
            FROM lessons l 
            JOIN units u ON l.unit_id = u.id 
            JOIN courses c ON u.course_id = c.id
            WHERE l.id = ?
        `;

        const lesson = await new Promise((resolve, reject) => {
            db.get(query, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!lesson) {
            return res.status(404).json({ success: false, error: 'Lesson not found' });
        }

        const xp = lesson.xp_reward || 10;

        // Mark as completed
        await new Promise((resolve, reject) => {
            db.run(`INSERT INTO lesson_progress (user_id, lesson_id, is_completed, progress, completed_at, xp_earned, updated_at) 
                    VALUES (?, ?, 1, 100, datetime('now'), ?, datetime('now'))
                    ON CONFLICT(user_id, lesson_id) DO UPDATE SET
                    is_completed = 1, progress = 100, completed_at = datetime('now'), xp_earned = ?, updated_at = datetime('now')`,
                [userId, id, xp, xp], function (err) {
                    if (err) reject(err);
                    else resolve();
                });
        });

        // Award XP
        if (xp > 0) {
            await new Promise((resolve, reject) => {
                db.run('UPDATE users SET total_xp = total_xp + ? WHERE id = ?', [xp, userId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Record transaction
            await new Promise((resolve, reject) => {
                db.run(`INSERT INTO xp_transactions (user_id, xp_amount, source, reference_id, description, created_at)
                        VALUES (?, ?, 'lessons', ?, ?, datetime('now'))`,
                    [userId, xp, id, `Completed lesson: ${lesson.title}`], (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
            });
        }

        // Check and award badges
        const newlyAwarded = await checkAndAwardBadges(userId);

        res.json({
            success: true,
            message: 'Lesson completed',
            xpAwarded: xp,
            newBadges: newlyAwarded
        });
    } catch (error) {
        console.error('Error completing lesson:', error);
        res.status(500).json({ success: false, error: 'Failed to complete lesson' });
    }
};

const getCompletedLessons = async (req, res) => {
    try {
        const userId = req.user.id;
        const rows = await new Promise((resolve, reject) => {
            db.all('SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND is_completed = 1',
                [userId], (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                });
        });
        res.json({ success: true, completedLessons: rows.map(r => r.lesson_id) });
    } catch (error) {
        console.error('Error fetching completed lessons:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch completed lessons' });
    }
};

const submitQuiz = async (req, res) => {
    const { lesson_id, score, total_questions, passed, answers } = req.body;

    // Simple validation
    if (!lesson_id || score === undefined || !total_questions) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const userId = req.user.id;
    const answersJson = JSON.stringify(answers || []);

    try {
        await new Promise((resolve, reject) => {
            db.serialize(() => {
                // 1. Record the quiz result
                db.run(`
                    INSERT INTO quiz_results (user_id, lesson_id, score, total_questions, passed, answers, completed_at)
                    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
                `, [userId, lesson_id, score, total_questions, passed ? 1 : 0, answersJson], function (err) {
                    if (err) {
                        console.error("Quiz save error:", err);
                        return reject(err);
                    }

                    // 2. If passed, complete the lesson
                    if (passed) {
                        // Get lesson XP reward
                        db.get('SELECT xp_reward FROM lessons WHERE id = ?', [lesson_id], (err, row) => {
                            if (err) console.error("Error fetching lesson XP:", err);
                            const xpReward = row?.xp_reward || 0;

                            // Insert/Update lesson progress
                            db.run(`
                                INSERT INTO lesson_progress (user_id, lesson_id, is_completed, progress, completed_at, xp_earned, updated_at)
                                VALUES (?, ?, 1, 100, datetime('now'), ?, datetime('now'))
                                ON CONFLICT(user_id, lesson_id) DO UPDATE SET
                                is_completed = 1,
                                progress = 100,
                                completed_at = datetime('now'),
                                xp_earned = max(xp_earned, ?),
                                updated_at = datetime('now')
                            `, [userId, lesson_id, xpReward, xpReward], (err) => {
                                if (err) console.error("Lesson completion error:", err);
                                // Note: We are not awaiting this inner callback, but for SQLite serialization it should be fine.
                                // Ideal refinement: Promisify everything or use a wrapper.
                            });
                        });
                    }
                    resolve();
                });
            });
        });
        res.json({ success: true, message: 'Quiz submitted' });
    } catch (error) {
        console.error('Quiz submission error:', error);
        res.status(500).json({ error: 'Failed to save quiz result' });
    }
};

const submitFlag = async (req, res) => {
    const { lesson_id, flag } = req.body;

    if (!lesson_id || !flag) {
        return res.status(400).json({ error: 'Lesson ID and Flag are required' });
    }

    const userId = req.user.id;

    try {
        // Fetch the lesson's expected flag and XP
        const lesson = await new Promise((resolve, reject) => {
            db.get('SELECT flag, xp_reward FROM lessons WHERE id = ?', [lesson_id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        if (!lesson.flag) {
            return res.status(400).json({ error: 'This lesson does not require a flag' });
        }

        // Validate the flag (case sensitive)
        if (flag.trim() === lesson.flag) {
            const xpReward = lesson.xp_reward || 10;

            // Check if already completed
            const alreadyCompleted = await new Promise((resolve, reject) => {
                db.get('SELECT id FROM lesson_progress WHERE user_id = ? AND lesson_id = ? AND is_completed = 1',
                    [userId, lesson_id], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
            });

            if (alreadyCompleted) {
                return res.json({ success: true, message: 'Flag correct, but lesson already completed.', xpAwarded: 0 });
            }

            // Mark completed and award XP
            await new Promise((resolve, reject) => {
                db.run(`
                    INSERT INTO lesson_progress (user_id, lesson_id, is_completed, progress, completed_at, xp_earned, updated_at)
                    VALUES (?, ?, 1, 100, datetime('now'), ?, datetime('now'))
                    ON CONFLICT(user_id, lesson_id) DO UPDATE SET
                    is_completed = 1,
                    progress = 100,
                    completed_at = datetime('now'),
                    xp_earned = max(xp_earned, ?),
                    updated_at = datetime('now')
                `, [userId, lesson_id, xpReward, xpReward], function (err) {
                    if (err) reject(err);
                    else resolve();
                });
            });

            // Update user's Total XP
            await new Promise((resolve, reject) => {
                db.run('UPDATE users SET total_xp = total_xp + ? WHERE id = ?', [xpReward, userId], (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });

            checkAndAwardBadges(userId);

            return res.json({ success: true, message: 'Correct Flag! Challenge completed.', xpAwarded: xpReward });
        } else {
            return res.status(400).json({ success: false, error: 'Incorrect Flag.' });
        }
    } catch (error) {
        console.error('Flag submission error:', error);
        res.status(500).json({ error: 'Server error processing flag validation' });
    }
};

const getSyllabus = async (req, res) => {
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

    try {
        const rows = await new Promise((resolve, reject) => {
            db.all(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

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

    } catch (error) {
        console.error('Error fetching syllabus:', error);
        res.status(500).json({ error: error.message });
    }
};

const getLatestKnowledge = async (req, res) => {
    const safeGet = (sql, params = []) => new Promise((resolve) => {
        db.get(sql, params, (err, row) => {
            if (err) { console.error('[getLatestKnowledge] SQL error:', err.message); resolve(null); }
            else resolve(row || null);
        });
    });

    try {
        const [latestTrack, latestCourse, latestArticle] = await Promise.all([
            safeGet('SELECT id, title, description, icon as image, "track" as type, created_at FROM tracks ORDER BY created_at DESC LIMIT 1'),
            safeGet('SELECT id, title, description, thumbnail_url as image, "course" as type, created_at FROM recorded_courses ORDER BY created_at DESC LIMIT 1'),
            safeGet('SELECT id, title, description, cover_image as image, "article" as type, created_at FROM articles ORDER BY created_at DESC LIMIT 1'),
        ]);

        const latestItems = [latestTrack, latestCourse, latestArticle].filter(Boolean);
        res.json({ success: true, latest: latestItems });
    } catch (error) {
        console.error('Error fetching latest knowledge:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch latest knowledge items' });
    }
};

module.exports = {
    getTracks, createTrack, deleteTrack,
    getCourses, createCourse, deleteCourse,
    getUnits, createUnit, deleteUnit,
    getLessons, createLesson, updateLesson, deleteLesson,
    enrollUser,
    completeLesson, getCompletedLessons,
    submitQuiz, submitFlag, getSyllabus,
    getLatestKnowledge
};
