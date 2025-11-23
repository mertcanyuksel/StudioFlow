const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const instructorController = require('../controllers/instructorController');
const { authMiddleware } = require('../utils/helpers');

// Multer configuration for instructor photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/instructors/');
    },
    filename: (req, file, cb) => {
        // ID ile kaydet - req.params.id kullan
        const instructorId = req.params.id;
        const ext = path.extname(file.originalname);
        cb(null, `instructor-${instructorId}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 }, // 10MB default
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// All routes require auth
router.use(authMiddleware);

router.get('/', instructorController.getAllInstructors);
router.get('/:id', instructorController.getInstructor);
router.post('/', instructorController.createInstructor);
router.put('/:id', instructorController.updateInstructor);
router.delete('/:id', instructorController.deleteInstructor);
router.post('/:id/photo', upload.single('photo'), instructorController.uploadPhoto);

module.exports = router;
