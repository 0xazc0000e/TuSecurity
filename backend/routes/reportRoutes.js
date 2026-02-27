const express = require('express');
const { requireAuth, requireManager } = require('../middleware/rbacMiddleware');
const reportController = require('../controllers/reportController');

const router = express.Router();

// Publicly accessible to any authenticated user
router.post('/', requireAuth, reportController.submitReport);

// Accessible to Managers and higher
router.get('/', requireAuth, requireManager, reportController.getAllReports);
router.put('/:id/status', requireAuth, requireManager, reportController.updateReportStatus);

module.exports = router;
