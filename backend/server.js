const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();

const { initializeDatabase, seedDatabase } = require('./models/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const lmsRoutes = require('./routes/lmsRoutes');
const newsRoutes = require('./routes/newsRoutes');
const simulatorRoutes = require('./routes/simulatorRoutes');
const contentRoutes = require('./routes/contentRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const interactionRoutes = require('./routes/interactionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware - Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "http:", "https:"],
            connectSrc: ["'self'", "http://localhost:5173"],
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS middleware - Restricted to known origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting for general API
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'تم تجاوز الحد المسموح من الطلبات. الرجاء المحاولة لاحقاً.'
    }
});
app.use(generalLimiter);

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes window
    max: 100, // start blocking after 100 requests (relaxed from 50 hard limit)
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful logins
    message: {
        error: 'تم تجاوز عدد محاولات تسجيل الدخول المسموحة. الرجاء المحاولة بعد ساعة.'
    }
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Passport
const passport = require('./config/socialAuth');
app.use(passport.initialize());

// Request logging to debug 404s
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// Uploads Directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}
app.use('/uploads', express.static(uploadsDir));

// Database Init
async function startServer() {
    try {
        await initializeDatabase();
        // await seedDatabase(); // Removed to prevent data loss on restart
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

// API Routes Construction
// Apply strict rate limiting to auth routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admin', adminRoutes);

// LMS Routes (The Engine for Tracks/Modules/Lessons)
app.use('/api/lms', lmsRoutes);

// News Routes (For News/Articles)
app.use('/api/news', newsRoutes);

// Legacy Content Routes (Mapped to avoid 404s if legacy calls exist)
app.use('/api/content', contentRoutes);

// Simulator Routes
app.use('/api/simulators', simulatorRoutes);

// Upload Routes (Lesson Images)
app.use('/api/upload', uploadRoutes);

// Events/Surveys/Announcements Routes
app.use('/api/events', eventsRoutes);

// Interaction Routes (Likes/Bookmarks/XP)
app.use('/api/interactions', interactionRoutes);

// Dashboard Routes (Aggregated Stats)
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);

// User Routes (XP Stats, Learning Progress, Profile Data)
const userRoutes = require('./routes/userRoutes-real');
app.use('/api/user', userRoutes);

// Profile Routes (Comprehensive, for Profile.jsx)
const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);

// Saved Items Routes (Bookmarks, Likes, Reading List, Folders)
const savedItemsRoutes = require('./routes/savedItemsRoutes-real');
app.use('/api/user/saved', savedItemsRoutes);

// Notification Routes
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);

// Badge Routes
const badgeRoutes = require('./routes/badgeRoutes');
app.use('/api/badges', badgeRoutes);

// Report Routes (Admin only)
const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

// Distinguished Members Routes
const distinguishedRoutes = require('./routes/distinguishedRoutes');
app.use('/api/distinguished', distinguishedRoutes);

// Base Route
app.get('/api', (req, res) => {
    res.json({
        name: 'TU Cyber Security Club API',
        version: '2.0.0',
        status: 'running',
        documentation: '/api/docs',
        endpoints: {
            auth: {
                base: '/api/auth',
                routes: ['POST /register', 'POST /login', 'POST /verify-email', 'GET /profile']
            },
            user: {
                base: '/api/user',
                routes: [
                    'GET /xp-stats', 'GET /xp-detailed-stats',
                    'GET /learning-progress', 'GET /learning-stats',
                    'POST /lesson-access', 'POST /complete-lesson',
                    'GET /streak'
                ]
            },
            saved: {
                base: '/api/user/saved',
                routes: ['GET /items', 'POST /bookmarks', 'DELETE /bookmarks/:id']
            },
            profile: {
                base: '/api/profile',
                routes: ['GET /', 'PUT /update', 'PUT /avatar']
            },
            badges: {
                base: '/api/badges',
                routes: ['GET /', 'GET /my-badges', 'GET /progress', 'POST /check', 'POST / (admin)']
            },
            reports: {
                base: '/api/reports',
                routes: ['GET /dashboard', 'GET /activity', 'GET /top-users', 'GET /content-performance', 'GET /engagement', 'GET /system-health', 'GET /full']
            },
            notifications: {
                base: '/api/notifications',
                routes: ['GET /', 'PUT /:id/read', 'PUT /read-all', 'DELETE /:id']
            },
            lms: {
                base: '/api/lms',
                routes: ['GET /tracks', 'GET /courses/:trackId', 'GET /units/:courseId', 'GET /lessons/:unitId']
            },
            simulators: {
                base: '/api/simulators',
                routes: ['GET /', 'GET /:id', 'POST /:id/complete']
            },
            events: {
                base: '/api/events',
                routes: ['GET /', 'POST /:id/register']
            },
            interactions: {
                base: '/api/interactions',
                routes: ['POST /like', 'POST /bookmark', 'DELETE /like', 'DELETE /bookmark']
            },
            admin: {
                base: '/api/admin',
                routes: ['GET /dashboard', 'GET /users', 'GET /stats']
            },
            uploads: {
                base: '/api/upload',
                routes: ['POST /image', 'POST /avatar']
            }
        }
    });
});

// 404 Handler
app.use((req, res) => {
    console.log(`404 Not Found: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start Server
startServer().then(() => {
    app.listen(PORT, () => {
        console.log(`=================================`);
        console.log(`TUCC Backend Server Running`);
        console.log(`=================================`);
        console.log(`Port: ${PORT}`);
        console.log(`API Base: http://localhost:${PORT}/api`);
        console.log(`=================================`);
    });
});

module.exports = app;
