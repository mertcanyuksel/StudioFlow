const mockDataService = require('../services/mockDataService');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getAllMedia = async (req, res) => {
    try {
        const media = await mockDataService.getAllMedia();
        return successResponse(res, media);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.getMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await mockDataService.getMedia(id);

        if (!media) {
            return errorResponse(res, 'Media not found', 404);
        }

        return successResponse(res, media);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.uploadMedia = async (req, res) => {
    try {
        if (!req.file) {
            return errorResponse(res, 'No file uploaded', 400);
        }

        const { title } = req.body;
        const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

        // Video duration'ı almak için ffprobe kullanılabilir, şimdilik manuel girelim
        const duration = req.body.duration ? parseInt(req.body.duration) : null;

        const mediaPath = `/media/${req.file.filename}`;
        const thumbnailPath = mediaType === 'video'
            ? `/media/thumbnails/${req.file.filename}.jpg`
            : mediaPath;

        const mediaData = {
            MediaType: mediaType,
            Title: title || req.file.originalname,
            MediaPath: mediaPath,
            Duration: duration,
            Thumbnail: thumbnailPath
        };

        const media = await mockDataService.createMedia(mediaData);

        return successResponse(res, media, 'Media uploaded successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.updateMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const media = await mockDataService.updateMedia(id, req.body);

        if (!media) {
            return errorResponse(res, 'Media not found', 404);
        }

        return successResponse(res, media, 'Media updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.deleteMedia = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await mockDataService.deleteMedia(id);

        if (!success) {
            return errorResponse(res, 'Media not found', 404);
        }

        return successResponse(res, null, 'Media deleted successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
