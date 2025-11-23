const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const { authMiddleware } = require('../utils/helpers');

// Public routes (for display screens)
router.get('/current/:studioId', lessonController.getCurrentLesson);
router.get('/next/:studioId', lessonController.getNextLesson);
router.get('/today/:studioId', lessonController.getTodayLessons);

// Admin routes (require auth)
router.get('/', authMiddleware, lessonController.getAllLessons);
router.get('/:id', authMiddleware, lessonController.getLesson);
router.post('/', authMiddleware, lessonController.createLesson);
router.put('/:id', authMiddleware, lessonController.updateLesson);
router.delete('/:id', authMiddleware, lessonController.deleteLesson);

module.exports = router;
