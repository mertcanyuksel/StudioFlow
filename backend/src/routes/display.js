const express = require('express');
const router = express.Router();
const displayController = require('../controllers/displayController');

// Public routes (for display screens)
router.get('/:screenId/current', displayController.getCurrentContent);

module.exports = router;
