const express = require('express');
const multer = require('multer');
const path = require('path');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin, requireEditor } = require('../middleware/rbacMiddleware');
const adminController = require('../controllers/adminController');
const contentController = require('../controllers/contentController');

const router = express.Router();

// Configure Multer for file uploads
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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Admin Dashboard & User Management
router.get('/stats', requireAuth, requireAdmin, adminController.getStats);
router.get('/users', requireAuth, requireAdmin, adminController.getAllUsers);
router.put('/users/:id', requireAuth, requireAdmin, adminController.updateUser);
router.delete('/users/:id', requireAuth, requireAdmin, adminController.deleteUser);
router.put('/users/:id/ban', requireAuth, requireAdmin, adminController.toggleUserBan);
router.post('/reset-password', requireAuth, requireAdmin, adminController.resetUserPassword);
router.get('/logs', requireAuth, requireAdmin, adminController.getSystemLogs);
router.put('/users/:id/role', requireAuth, requireAdmin, adminController.updateUserRole);

// Content Management
router.get('/content', requireAuth, requireEditor, contentController.getAllContent);
router.post('/content', requireAuth, requireEditor, upload.single('image'), contentController.createContent);
router.put('/content/:id', requireAuth, requireEditor, upload.single('image'), contentController.updateContent);
router.delete('/content/:id', requireAuth, requireEditor, contentController.deleteContent);

// Simulators Management
router.get('/simulators', requireAuth, requireEditor, contentController.getAllSimulators);
router.post('/simulators', requireAuth, requireEditor, contentController.createSimulator);
router.put('/simulators/:id', requireAuth, requireEditor, contentController.updateSimulator);
router.delete('/simulators/:id', requireAuth, requireEditor, contentController.deleteSimulator);

// Scenario Management (New)
router.get('/scenarios', requireAuth, requireEditor, contentController.getAllScenarios);
router.post('/scenarios', requireAuth, requireEditor, contentController.createScenario);
router.put('/scenarios/:id', requireAuth, requireEditor, contentController.updateScenario);
router.delete('/scenarios/:id', requireAuth, requireEditor, contentController.deleteScenario);

// Setup Route
router.get('/setup/make-me-admin/:email', adminController.makeMeAdmin);

module.exports = router;


