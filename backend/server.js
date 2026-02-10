const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initializeDatabase, seedDatabase } = require('./models/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const simulatorRoutes = require('./routes/simulatorRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Initialize database and seed data
async function startServer() {
    try {
        await initializeDatabase();
        await seedDatabase();
        console.log('Database initialized and seeded successfully');
    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/simulators', simulatorRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API root endpoint
app.get('/api', (req, res) => {
    res.json({
        name: 'TU Cyber Security Club API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            content: '/api/content',
            simulators: '/api/simulators',
            admin: '/api/admin',
            health: '/api/health'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message 
    });
});

// Start server
startServer().then(() => {
    app.listen(PORT, () => {
        console.log(`=================================`);
        console.log(`TUCC Backend Server Running`);
        console.log(`=================================`);
        console.log(`Port: ${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`API Base: http://localhost:${PORT}/api`);
        console.log(`=================================`);
    });
});

module.exports = app;
