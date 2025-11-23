const express = require('express');
const router = express.Router();
const screenController = require('../controllers/screenController');
const { authMiddleware } = require('../utils/helpers');

// Public routes (for display screens)
router.post('/heartbeat', screenController.heartbeat);

// Admin routes (require auth)
router.get('/', authMiddleware, screenController.getAllScreens);
router.get('/:id', authMiddleware, screenController.getScreen);

module.exports = router;
