const mockDataService = require('../services/mockDataService');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getAllContents = async (req, res) => {
    try {
        const contents = await mockDataService.getAllContents();
        return successResponse(res, contents);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.getContent = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await mockDataService.getContent(id);

        if (!content) {
            return errorResponse(res, 'Content not found', 404);
        }

        return successResponse(res, content);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.uploadContent = async (req, res) => {
    try {
        if (!req.file) {
            return errorResponse(res, 'No file uploaded');
        }

        const { title, duration, priority, contentType } = req.body;
        const filePath = `/${req.file.destination.replace('./uploads/', '')}/${req.file.filename}`;

        const content = await mockDataService.createContent({
            ContentType: contentType || (req.file.mimetype.startsWith('video') ? 'video' : 'image'),
            Title: title || req.file.originalname,
            FilePath: filePath,
            Duration: parseInt(duration) || 30,
            Priority: parseInt(priority) || 1
        });

        return successResponse(res, content, 'Content uploaded');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.updateContent = async (req, res) => {
    try {
        const { id } = req.params;
        const content = await mockDataService.updateContent(id, req.body);

        if (!content) {
            return errorResponse(res, 'Content not found', 404);
        }

        return successResponse(res, content, 'Content updated');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.deleteContent = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await mockDataService.deleteContent(id);

        if (!success) {
            return errorResponse(res, 'Content not found', 404);
        }

        return successResponse(res, null, 'Content deleted');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
