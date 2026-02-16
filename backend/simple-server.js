const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Simple database connection
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./cyberclub.db');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Backend is running',
        timestamp: new Date().toISOString()
    });
});

// API test endpoint
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'API endpoint working',
        timestamp: new Date().toISOString()
    });
});

// Mock authentication endpoints
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    if (email === 'admin@tu.edu.sa' && password === 'admin123') {
        res.json({
            success: true,
            token: 'mock-jwt-token-' + Date.now(),
            user: {
                id: 1,
                username: 'admin',
                email: 'admin@tu.edu.sa',
                role: 'admin'
            }
        });
    } else {
        res.status(401).json({
            success: false,
            error: 'Invalid credentials'
        });
    }
});

app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;
    
    res.json({
        success: true,
        message: 'User registered successfully',
        user: {
            id: Date.now(),
            username,
            email,
            role: 'student'
        }
    });
});

// Mock LMS syllabus endpoint
app.get('/api/lms/syllabus', (req, res) => {
    const mockSyllabus = [
        {
            id: 1,
            title: 'مسار اختبار الاختراق',
            description: 'تعلم أساسيات اختبار الاختراق الأخلاقي',
            sort_order: 1,
            courses: [
                {
                    id: 1,
                    track_id: 1,
                    title: 'الشبكات الهجومية',
                    description: 'فهم الشبكات من منظور الهجوم',
                    sort_order: 1,
                    units: [
                        {
                            id: 1,
                            course_id: 1,
                            title: 'مقدمة في الشبكات',
                            sort_order: 1,
                            lessons: [
                                {
                                    id: 1,
                                    unit_id: 1,
                                    title: 'مقدمة في TCP/IP',
                                    content: '# مقدمة في TCP/IP\n\nTCP/IP هو بروتوكول الاتصال الأساسي في الإنترنت...',
                                    duration: 15,
                                    xp_reward: 50,
                                    sort_order: 1,
                                    is_interactive: false
                                },
                                {
                                    id: 2,
                                    unit_id: 1,
                                    title: 'فهم الـ IP Addresses',
                                    content: '# فهم عناوين IP\n\nعناوين IP هي معرفات فريدة للأجهزة...',
                                    duration: 20,
                                    xp_reward: 75,
                                    sort_order: 2,
                                    is_interactive: true
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            id: 2,
            title: 'مسار التحقيق الجنائي الرقمي',
            description: 'تعلم تقنيات التحقيق في الأدلة الرقمية',
            sort_order: 2,
            courses: [
                {
                    id: 2,
                    track_id: 2,
                    title: 'أساسيات التحقيق',
                    description: 'مبادئ التحقيق الجنائي الرقمي',
                    sort_order: 1,
                    units: [
                        {
                            id: 2,
                            course_id: 2,
                            title: 'جمع الأدلة',
                            sort_order: 1,
                            lessons: [
                                {
                                    id: 3,
                                    unit_id: 2,
                                    title: 'سلاسة الأدلة الرقمية',
                                    content: '# سلاسة الأدلة الرقمية\n\nسلاسة الأدلة هي عملية توثيق...',
                                    duration: 25,
                                    xp_reward: 100,
                                    sort_order: 1,
                                    is_interactive: false
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];
    
    res.json({
        success: true,
        data: mockSyllabus,
        stats: {
            tracks: mockSyllabus.length,
            courses: mockSyllabus.reduce((acc, track) => acc + track.courses.length, 0),
            units: mockSyllabus.reduce((acc, track) => 
                acc + track.courses.reduce((acc2, course) => acc2 + course.units.length, 0), 0),
            lessons: mockSyllabus.reduce((acc, track) => 
                acc + track.courses.reduce((acc2, course) => 
                    acc2 + course.units.reduce((acc3, unit) => acc3 + unit.lessons.length, 0), 0), 0)
        }
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`📡 Available endpoints:`);
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log(`   GET  http://localhost:${PORT}/api/test`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   GET  http://localhost:${PORT}/api/lms/syllabus`);
    console.log(`\n🔧 Test credentials:`);
    console.log(`   Email:    admin@tu.edu.sa`);
    console.log(`   Password: admin123`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🔄 Shutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed.');
        }
        process.exit(0);
    });
});
