const { prisma } = require('../models/prismaDatabase');
const { checkAndAwardBadges } = require('../services/badgeService');

// --- 1. Tracks ---
const getTracks = async (req, res) => {
    try {
        const tracks = await prisma.tracks.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json({ success: true, tracks: tracks });
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

        const track = await prisma.tracks.create({
            data: {
                title: title,
                description: description,
                icon: icon
            }
        });

        res.status(201).json({ success: true, id: track.id, title, message: 'Track created successfully' });
    } catch (error) {
        console.error('Error creating track:', error);
        res.status(500).json({ success: false, error: 'Failed to create track' });
    }
};

const deleteTrack = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.tracks.delete({
            where: { id: parseInt(id) }
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
        const courses = await prisma.courses.findMany({
            where: { track_id: parseInt(trackId) },
            orderBy: { sort_order: 'asc' }
        });
        res.json({ success: true, courses: courses });
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

        const course = await prisma.courses.create({
            data: {
                track_id: parseInt(track_id),
                title: title,
                description: description,
                sort_order: sort_order || 0
            }
        });

        res.status(201).json({ success: true, id: course.id, title, message: 'Course created successfully' });
    } catch (error) {
        console.error('Error creating course:', error);
        res.status(500).json({ success: false, error: 'Failed to create course' });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.courses.delete({
            where: { id: parseInt(id) }
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
        const units = await prisma.units.findMany({
            where: { course_id: parseInt(courseId) },
            orderBy: { sort_order: 'asc' }
        });
        res.json({ success: true, units: units });
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

        const unit = await prisma.units.create({
            data: {
                course_id: parseInt(course_id),
                title: title,
                sort_order: sort_order || 0
            }
        });

        res.status(201).json({ success: true, id: unit.id, title, message: 'Unit created successfully' });
    } catch (error) {
        console.error('Error creating unit:', error);
        res.status(500).json({ success: false, error: 'Failed to create unit' });
    }
};

const deleteUnit = async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.units.delete({
            where: { id: parseInt(id) }
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
        const lessons = await prisma.lessons.findMany({
            where: { unit_id: parseInt(unitId) },
            orderBy: { sort_order: 'asc' }
        });
        res.json({ success: true, lessons });
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

        const lesson = await prisma.lessons.create({
            data: {
                unit_id: parseInt(unit_id),
                title,
                content,
                xp_reward: xp_reward || 10,
                video_url,
                is_interactive: !!is_interactive,
                sort_order: sort_order || 0,
                quiz_config: typeof quiz_config === 'string' ? quiz_config : JSON.stringify(quiz_config || []),
                terminal_config: typeof terminal_config === 'string' ? terminal_config : JSON.stringify(terminal_config || {}),
                next_lesson_id: next_lesson_id ? parseInt(next_lesson_id) : null
            }
        });

        res.status(201).json({ success: true, id: lesson.id, title, message: 'Lesson created successfully' });
    } catch (error) {
        console.error('Error creating lesson:', error);
        res.status(500).json({ success: false, error: 'Failed to create lesson' });
    }
};

const updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, xp_reward, video_url, is_interactive, sort_order, quiz_config, terminal_config, next_lesson_id } = req.body;

        await prisma.lessons.update({
            where: { id: parseInt(id) },
            data: {
                title,
                content,
                xp_reward,
                video_url,
                is_interactive: !!is_interactive,
                sort_order,
                quiz_config: typeof quiz_config === 'string' ? quiz_config : JSON.stringify(quiz_config),
                terminal_config: typeof terminal_config === 'string' ? terminal_config : JSON.stringify(terminal_config),
                next_lesson_id: next_lesson_id ? parseInt(next_lesson_id) : null
            }
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

        await prisma.lessons.delete({
            where: { id: parseInt(id) }
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

        const existing = await prisma.user_enrollments.findFirst({
            where: {
                user_id: userId,
                type: type,
                item_id: parseInt(itemId)
            }
        });

        if (existing) {
            return res.json({ success: true, message: 'Already enrolled' });
        }

        await prisma.user_enrollments.create({
            data: {
                user_id: userId,
                type: type,
                item_id: parseInt(itemId)
            }
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
        const lessonId = parseInt(id);

        // Check if already completed
        const alreadyCompleted = await prisma.lesson_progress.findFirst({
            where: { user_id: userId, lesson_id: lessonId, is_completed: true }
        });

        if (alreadyCompleted) {
            return res.json({ success: true, message: 'Lesson already completed' });
        }

        // Get lesson details
        const lesson = await prisma.lessons.findUnique({
            where: { id: lessonId },
            include: {
                units: {
                    include: {
                        courses: true
                    }
                }
            }
        });

        if (!lesson) {
            return res.status(404).json({ success: false, error: 'Lesson not found' });
        }

        const xp = lesson.xp_reward || 10;

        await prisma.$transaction(async (tx) => {
            // Mark as completed
            await tx.lesson_progress.upsert({
                where: {
                    user_id_lesson_id: {
                        user_id: userId,
                        lesson_id: lessonId
                    }
                },
                update: {
                    is_completed: true,
                    progress: 100,
                    completed_at: new Date(),
                    xp_earned: xp,
                    updated_at: new Date()
                },
                create: {
                    user_id: userId,
                    lesson_id: lessonId,
                    is_completed: true,
                    progress: 100,
                    completed_at: new Date(),
                    xp_earned: xp,
                    updated_at: new Date()
                }
            });

            // Award XP
            if (xp > 0) {
                await tx.users.update({
                    where: { id: userId },
                    data: { total_xp: { increment: xp } }
                });

                // Record transaction
                await tx.xp_transactions.create({
                    data: {
                        user_id: userId,
                        xp_amount: xp,
                        source: 'lessons',
                        reference_id: lessonId,
                        description: `Completed lesson: ${lesson.title}`,
                        created_at: new Date()
                    }
                });
            }
        });

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
        const progress = await prisma.lesson_progress.findMany({
            where: { user_id: userId, is_completed: true },
            select: { lesson_id: true }
        });
        res.json({ success: true, completedLessons: progress.map(p => p.lesson_id) });
    } catch (error) {
        console.error('Error fetching completed lessons:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch completed lessons' });
    }
};

const submitQuiz = async (req, res) => {
    try {
        const { lesson_id, score, total_questions, passed, answers } = req.body;
        const userId = req.user.id;
        const lessonId = parseInt(lesson_id);

        if (!lessonId || score === undefined || !total_questions) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await prisma.$transaction(async (tx) => {
            // 1. Record the quiz result
            await tx.quiz_results.create({
                data: {
                    user_id: userId,
                    lesson_id: lessonId,
                    score,
                    total_questions,
                    passed: !!passed,
                    answers: JSON.stringify(answers || []),
                    completed_at: new Date()
                }
            });

            // 2. If passed, complete the lesson
            if (passed) {
                const lesson = await tx.lessons.findUnique({
                    where: { id: lessonId },
                    select: { xp_reward: true }
                });
                const xpReward = lesson?.xp_reward || 0;

                await tx.lesson_progress.upsert({
                    where: {
                        user_id_lesson_id: {
                            user_id: userId,
                            lesson_id: lessonId
                        }
                    },
                    update: {
                        is_completed: true,
                        progress: 100,
                        completed_at: new Date(),
                        xp_earned: { increment: 0 }, // Should ideally handle max(xp_earned, xpReward)
                        updated_at: new Date()
                    },
                    create: {
                        user_id: userId,
                        lesson_id: lessonId,
                        is_completed: true,
                        progress: 100,
                        completed_at: new Date(),
                        xp_earned: xpReward,
                        updated_at: new Date()
                    }
                });

                // Also update user XP if passed
                if (xpReward > 0) {
                    await tx.users.update({
                        where: { id: userId },
                        data: { total_xp: { increment: xpReward } }
                    });
                }
            }
        });

        res.json({ success: true, message: 'Quiz submitted' });
    } catch (error) {
        console.error('Quiz submission error:', error);
        res.status(500).json({ error: 'Failed to save quiz result' });
    }
};

const submitFlag = async (req, res) => {
    try {
        const { lesson_id, flag } = req.body;
        const userId = req.user.id;
        const lId = parseInt(lesson_id);

        if (!lId || !flag) {
            return res.status(400).json({ error: 'Lesson ID and Flag are required' });
        }

        const lesson = await prisma.lessons.findUnique({
            where: { id: lId },
            select: { flag: true, xp_reward: true, title: true }
        });

        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        if (!lesson.flag) {
            return res.status(400).json({ error: 'This lesson does not require a flag' });
        }

        if (flag.trim() === lesson.flag) {
            const xpReward = lesson.xp_reward || 10;

            const alreadyCompleted = await prisma.lesson_progress.findFirst({
                where: { user_id: userId, lesson_id: lId, is_completed: true }
            });

            if (alreadyCompleted) {
                return res.json({ success: true, message: 'Flag correct, but lesson already completed.', xpAwarded: 0 });
            }

            await prisma.$transaction(async (tx) => {
                await tx.lesson_progress.upsert({
                    where: {
                        user_id_lesson_id: {
                            user_id: userId,
                            lesson_id: lId
                        }
                    },
                    update: {
                        is_completed: true,
                        progress: 100,
                        completed_at: new Date(),
                        xp_earned: xpReward,
                        updated_at: new Date()
                    },
                    create: {
                        user_id: userId,
                        lesson_id: lId,
                        is_completed: true,
                        progress: 100,
                        completed_at: new Date(),
                        xp_earned: xpReward,
                        updated_at: new Date()
                    }
                });

                await tx.users.update({
                    where: { id: userId },
                    data: { total_xp: { increment: xpReward } }
                });

                await tx.xp_transactions.create({
                    data: {
                        user_id: userId,
                        xp_amount: xpReward,
                        source: 'lessons',
                        reference_id: lId,
                        description: `Flag Correct: ${lesson.title}`,
                        created_at: new Date()
                    }
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
    try {
        const tracks = await prisma.tracks.findMany({
            include: {
                courses: {
                    orderBy: { sort_order: 'asc' },
                    include: {
                        units: {
                            orderBy: { sort_order: 'asc' },
                            include: {
                                lessons: {
                                    orderBy: { sort_order: 'asc' }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: { id: 'asc' }
        });

        // Transform to match the nested format expected by frontend if needed
        const syllabus = tracks.map(track => ({
            id: track.id,
            title: track.title,
            icon: track.icon,
            description: track.description,
            courses: track.courses.map(course => ({
                id: course.id,
                title: course.title,
                units: course.units.map(unit => ({
                    id: unit.id,
                    title: unit.title,
                    lessons: unit.lessons.map(lesson => ({
                        id: lesson.id,
                        title: lesson.title,
                        xp_reward: lesson.xp_reward,
                        is_interactive: lesson.is_interactive,
                        next_lesson_id: lesson.next_lesson_id,
                        sort_order: lesson.sort_order,
                        content: lesson.content,
                        video_url: lesson.video_url,
                        quiz_config: lesson.quiz_config,
                        terminal_config: lesson.terminal_config
                    }))
                }))
            }))
        }));

        res.json(syllabus);
    } catch (error) {
        console.error('Error fetching syllabus:', error);
        res.status(500).json({ error: error.message });
    }
};

const getLatestKnowledge = async (req, res) => {
    try {
        const [latestTrack, latestRecordedCourse, latestArticle] = await Promise.all([
            prisma.tracks.findFirst({ orderBy: { created_at: 'desc' } }),
            prisma.recorded_courses.findFirst({ orderBy: { created_at: 'desc' } }),
            prisma.articles.findFirst({ orderBy: { created_at: 'desc' } })
        ]);

        const latestItems = [
            latestTrack && { id: latestTrack.id, title: latestTrack.title, description: latestTrack.description, image: latestTrack.icon, type: 'track', created_at: latestTrack.created_at },
            latestRecordedCourse && { id: latestRecordedCourse.id, title: latestRecordedCourse.title, description: latestRecordedCourse.description, image: latestRecordedCourse.thumbnail_url, type: 'course', created_at: latestRecordedCourse.created_at },
            latestArticle && { id: latestArticle.id, title: latestArticle.title, description: latestArticle.description, image: latestArticle.cover_image, type: 'article', created_at: latestArticle.created_at }
        ].filter(Boolean);

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
