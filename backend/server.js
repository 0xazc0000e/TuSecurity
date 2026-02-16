const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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

// Middleware
app.use(cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging to debug 404s
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
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
        await initializeDatabase();
        // await seedDatabase(); // Removed to prevent data loss on restart
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

// API Routes Construction
app.use('/api/auth', authRoutes);
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

// User Routes (XP Stats, Learning Progress, Profile Data)
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);

// Saved Items Routes (Bookmarks, Likes, Reading List, Folders)
const savedItemsRoutes = require('./routes/savedItemsRoutes');
app.use('/api/user', savedItemsRoutes);

// Distinguished Members Routes
const distinguishedRoutes = require('./routes/distinguishedRoutes');
app.use('/api/distinguished', distinguishedRoutes);

// Base Route
app.get('/api', (req, res) => {
    res.json({
        name: 'TU Cyber Security Club API',
        version: '2.0.0',
        endpoints: {
            auth: '/api/auth',
            admin: '/api/admin',
            lms: '/api/lms',
            news: '/api/news',
            content: '/api/content',
            simulators: '/api/simulators',
            events: '/api/events',
            interactions: '/api/interactions'
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
