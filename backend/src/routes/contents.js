const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const contentController = require('../controllers/contentController');
const { authMiddleware } = require('../utils/helpers');

// Multer configuration for content files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = file.mimetype.startsWith('video') ? 'uploads/videos/' : 'uploads/images/';
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'content-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 104857600 }, // 100MB default
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|mp4|avi|mov|wmv/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = file.mimetype.startsWith('image') || file.mimetype.startsWith('video');

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image and video files are allowed'));
        }
    }
});

// All routes require auth
router.use(authMiddleware);

router.get('/', contentController.getAllContents);
router.get('/:id', contentController.getContent);
router.post('/', upload.single('file'), contentController.uploadContent);
router.put('/:id', contentController.updateContent);
router.delete('/:id', contentController.deleteContent);

module.exports = router;
