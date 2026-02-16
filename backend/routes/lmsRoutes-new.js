const express = require('express');
const lmsController = require('../controllers/lmsController');
const { authenticate } = require('../controllers/authController');
const { requireAdmin, requireEditor } = require('../middleware/rbacMiddleware');

const router = express.Router();

// --- Tracks ---
router.get('/tracks', authenticate, lmsController.getTracks);
router.post('/tracks', authenticate, requireAdmin, (req, res, next) => {
    console.log('POST /tracks body:', req.body);
    next();
}, lmsController.createTrack);
router.delete('/tracks/:id', authenticate, requireAdmin, lmsController.deleteTrack);

// --- Courses ---
router.get('/tracks/:trackId/courses', authenticate, lmsController.getCourses);
router.post('/courses', authenticate, requireEditor, (req, res, next) => {
    console.log('POST /courses body:', req.body);
    if (!req.body.track_id) return res.status(400).json({ error: 'Missing track_id' });
    next();
}, lmsController.createCourse);
router.delete('/courses/:id', authenticate, requireEditor, lmsController.deleteCourse);

// --- Units ---
router.get('/courses/:courseId/units', authenticate, lmsController.getUnits);
router.post('/units', authenticate, requireEditor, (req, res, next) => {
    console.log('POST /units body:', req.body);
    if (!req.body.course_id) return res.status(400).json({ error: 'Missing course_id' });
    next();
}, lmsController.createUnit);
router.delete('/units/:id', authenticate, requireEditor, lmsController.deleteUnit);

// --- Lessons ---
router.get('/units/:unitId/lessons', authenticate, lmsController.getLessons);
router.post('/lessons', authenticate, requireEditor, (req, res, next) => {
    console.log('POST /lessons body:', req.body);
    if (!req.body.unit_id) return res.status(400).json({ error: 'Missing unit_id' });
    next();
}, lmsController.createLesson);
router.put('/lessons/:id', authenticate, requireEditor, lmsController.updateLesson);
router.delete('/lessons/:id', authenticate, requireEditor, lmsController.deleteLesson);

// --- Full Syllabus Tree - ROBUST "Fetch All & Map" Strategy ---
router.get('/syllabus', authenticate, async (req, res) => {
    try {
        const db = require('../models/database').db;

        console.log('🔄 Fetching syllabus data...');
        
        // Step 1: Fetch all data separately (Most Reliable)
        const tracks = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM tracks ORDER BY sort_order ASC", [], (err, rows) => {
                if (err) {
                    console.error('❌ Error fetching tracks:', err);
                    reject(err);
                } else {
                    console.log(`✅ Fetched ${rows.length} tracks`);
                    resolve(rows);
                }
            });
        });

        const courses = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM courses ORDER BY sort_order ASC", [], (err, rows) => {
                if (err) {
                    console.error('❌ Error fetching courses:', err);
                    reject(err);
                } else {
                    console.log(`✅ Fetched ${rows.length} courses`);
                    resolve(rows);
                }
            });
        });

        const units = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM units ORDER BY sort_order ASC", [], (err, rows) => {
                if (err) {
                    console.error('❌ Error fetching units:', err);
                    reject(err);
                } else {
                    console.log(`✅ Fetched ${rows.length} units`);
                    resolve(rows);
                }
            });
        });

        const lessons = await new Promise((resolve, reject) => {
            db.all("SELECT * FROM lessons ORDER BY sort_order ASC", [], (err, rows) => {
                if (err) {
                    console.error('❌ Error fetching lessons:', err);
                    reject(err);
                } else {
                    console.log(`✅ Fetched ${rows.length} lessons`);
                    resolve(rows);
                }
            });
        });

        // Step 2: Create maps for efficient lookup
        console.log('🔧 Building nested structure...');
        
        // Create track map
        const trackMap = {};
        tracks.forEach(track => {
            trackMap[track.id] = {
                ...track,
                courses: []
            };
        });

        // Create course map
        const courseMap = {};
        courses.forEach(course => {
            courseMap[course.id] = {
                ...course,
                units: []
            };
        });

        // Create unit map
        const unitMap = {};
        units.forEach(unit => {
            unitMap[unit.id] = {
                ...unit,
                lessons: []
            };
        });

        // Step 3: Build relationships
        // Attach courses to tracks
        courses.forEach(course => {
            if (trackMap[course.track_id]) {
                trackMap[course.track_id].courses.push(courseMap[course.id]);
            } else {
                console.warn(`⚠️ Course ${course.id} has invalid track_id ${course.track_id}`);
            }
        });

        // Attach units to courses
        units.forEach(unit => {
            if (courseMap[unit.course_id]) {
                courseMap[unit.course_id].units.push(unitMap[unit.id]);
            } else {
                console.warn(`⚠️ Unit ${unit.id} has invalid course_id ${unit.course_id}`);
            }
        });

        // Attach lessons to units
        lessons.forEach(lesson => {
            if (unitMap[lesson.unit_id]) {
                unitMap[lesson.unit_id].lessons.push(lesson);
            } else {
                console.warn(`⚠️ Lesson ${lesson.id} has invalid unit_id ${lesson.unit_id}`);
            }
        });

        // Step 4: Convert back to array and validate
        const syllabus = Object.values(trackMap);
        
        console.log(`📊 Final syllabus structure:`);
        console.log(`   - Tracks: ${syllabus.length}`);
        console.log(`   - Total Courses: ${courses.length}`);
        console.log(`   - Total Units: ${units.length}`);
        console.log(`   - Total Lessons: ${lessons.length}`);
        
        // Validate structure
        let totalCourses = 0;
        let totalUnits = 0;
        let totalLessons = 0;
        
        syllabus.forEach(track => {
            totalCourses += track.courses.length;
            track.courses.forEach(course => {
                totalUnits += course.units.length;
                course.units.forEach(unit => {
                    totalLessons += unit.lessons.length;
                });
            });
        });
        
        console.log(`✅ Validation - Nested counts:`);
        console.log(`   - Nested Courses: ${totalCourses} (Expected: ${courses.length})`);
        console.log(`   - Nested Units: ${totalUnits} (Expected: ${units.length})`);
        console.log(`   - Nested Lessons: ${totalLessons} (Expected: ${lessons.length})`);
        
        // Send response
        res.json({
            success: true,
            data: syllabus,
            stats: {
                tracks: syllabus.length,
                courses: totalCourses,
                units: totalUnits,
                lessons: totalLessons
            }
        });
        
    } catch (error) {
        console.error('❌ Critical error in syllabus endpoint:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch syllabus',
            details: error.message 
        });
    }
});

module.exports = router;
