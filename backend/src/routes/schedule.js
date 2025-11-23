const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authMiddleware } = require('../utils/helpers');

// All routes require auth
router.use(authMiddleware);

router.get('/override', scheduleController.getAllOverrides);
router.get('/override/:id', scheduleController.getOverride);
router.post('/override', scheduleController.createOverride);
router.post('/override/bulk', scheduleController.createBulkOverrides);
router.put('/override/:id', scheduleController.updateOverride);
router.delete('/override/:id', scheduleController.deleteOverride);

module.exports = router;
