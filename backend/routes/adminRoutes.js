const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticate } = require('../controllers/authController');
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
router.get('/stats', authenticate, requireAdmin, adminController.getStats);
router.get('/users', authenticate, requireAdmin, adminController.getAllUsers);
router.put('/users/:id', authenticate, requireAdmin, adminController.updateUser);
router.delete('/users/:id', authenticate, requireAdmin, adminController.deleteUser);
router.put('/users/:id/ban', authenticate, requireAdmin, adminController.toggleUserBan);
router.post('/reset-password', authenticate, requireAdmin, adminController.resetUserPassword);
router.get('/logs', authenticate, requireAdmin, adminController.getSystemLogs);
router.put('/users/:id/role', authenticate, requireAdmin, adminController.updateUserRole);

// Content Management
router.get('/content', authenticate, requireEditor, contentController.getAllContent);
router.post('/content', authenticate, requireEditor, upload.single('image'), contentController.createContent);
router.put('/content/:id', authenticate, requireEditor, upload.single('image'), contentController.updateContent);
router.delete('/content/:id', authenticate, requireEditor, contentController.deleteContent);

// Simulators Management
router.get('/simulators', authenticate, requireEditor, contentController.getAllSimulators);
router.post('/simulators', authenticate, requireEditor, contentController.createSimulator);
router.put('/simulators/:id', authenticate, requireEditor, contentController.updateSimulator);
router.delete('/simulators/:id', authenticate, requireEditor, contentController.deleteSimulator);

// Scenario Management (New)
router.get('/scenarios', authenticate, requireEditor, contentController.getAllScenarios);
router.post('/scenarios', authenticate, requireEditor, contentController.createScenario);
router.put('/scenarios/:id', authenticate, requireEditor, contentController.updateScenario);
router.delete('/scenarios/:id', authenticate, requireEditor, contentController.deleteScenario);

// Setup Route
router.get('/setup/make-me-admin/:email', adminController.makeMeAdmin);

module.exports = router;


