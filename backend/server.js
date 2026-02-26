const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// تم إزالة استدعاء قاعدة بيانات SQLite القديمة من هنا

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
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

const isDev = process.env.NODE_ENV !== 'production';
const devOrigins = isDev ? ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'] : [];

app.use(helmet({
    contentSecurityPolicy: false, // لعدم التعارض مع بعض مسارات الـ API
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5500',
        'http://localhost:5500',
        'https://tusecurity.netlify.app',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'تم تجاوز الحد المسموح من الطلبات. الرجاء المحاولة لاحقاً.' }
});
app.use(generalLimiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { error: 'تم تجاوز عدد محاولات تسجيل الدخول المسموحة. الرجاء المحاولة بعد ساعة.' }
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

const passport = require('./config/socialAuth');
app.use(passport.initialize());

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// API Routes Construction
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/lms', lmsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/simulators', simulatorRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/interactions', interactionRoutes);

const dashboardRoutes = require('./routes/dashboardRoutes');
app.use('/api/dashboard', dashboardRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);
const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);
const savedItemsRoutes = require('./routes/savedItemsRoutes');
app.use('/api/user/saved', savedItemsRoutes);
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/notifications', notificationRoutes);
const badgeRoutes = require('./routes/badgeRoutes');
app.use('/api/badges', badgeRoutes);
const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);
const distinguishedRoutes = require('./routes/distinguishedRoutes');
app.use('/api/distinguished', distinguishedRoutes);

// مسار رئيسي للتأكد من عمل الخادم بدون محاولة استدعاء React
app.get('/', (req, res) => {
    res.send('TUCC Backend API is running successfully on Render!');
});

app.get('/api', (req, res) => {
    res.json({
        name: 'TU Cyber Security Club API',
        version: '2.0.0',
        status: 'running'
    });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================`);
    console.log(`TUCC Backend Server Running`);
    console.log(`=================================`);
    console.log(`Port: ${PORT}`);
    console.log(`=================================`);
});

module.exports = app;