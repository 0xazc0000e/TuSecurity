const express = require('express');
const simulatorController = require('../controllers/simulatorController');
const { authenticate } = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/', simulatorController.getAllSimulators);
router.get('/latest', simulatorController.getLatestSimulators);
router.get('/progress', authenticate, simulatorController.getUserProgress);

// Protected routes (require authentication)
router.post('/start/:id', authenticate, simulatorController.startSimulator);
router.post('/progress/update', authenticate, simulatorController.updateSimulatorProgress);
router.get('/:id', authenticate, simulatorController.getSimulatorById);
router.post('/progress/bash', authenticate, simulatorController.saveBashProgress);
router.post('/progress/attack', authenticate, simulatorController.saveAttackProgress);
router.post('/validate', authenticate, simulatorController.validateMission);

module.exports = router;
