const express = require('express');
const multer = require('multer');
const path = require('path');
const newsController = require('../controllers/newsController');
const { authenticate } = require('../controllers/authController');
const { requireEditor, requireAdmin } = require('../middleware/rbacMiddleware');

const router = express.Router();

// Configure Multer
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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only images are allowed'));
    }
});

// Public Routes
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);

// Protected Routes
router.post('/', authenticate, requireEditor, upload.single('image'), newsController.createNews);
router.put('/:id', authenticate, requireEditor, upload.single('image'), newsController.updateNews);
router.delete('/:id', authenticate, requireAdmin, newsController.deleteNews);

module.exports = router;
