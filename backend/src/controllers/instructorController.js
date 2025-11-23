const mockDataService = require('../services/mockDataService');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getAllInstructors = async (req, res) => {
    try {
        const instructors = await mockDataService.getAllInstructors();
        return successResponse(res, instructors);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.getInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const instructor = await mockDataService.getInstructor(id);

        if (!instructor) {
            return errorResponse(res, 'Instructor not found', 404);
        }

        return successResponse(res, instructor);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.createInstructor = async (req, res) => {
    try {
        const instructor = await mockDataService.createInstructor(req.body);
        return successResponse(res, instructor, 'Instructor created');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.updateInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const instructor = await mockDataService.updateInstructor(id, req.body);

        if (!instructor) {
            return errorResponse(res, 'Instructor not found', 404);
        }

        return successResponse(res, instructor, 'Instructor updated');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await mockDataService.deleteInstructor(id);

        if (!success) {
            return errorResponse(res, 'Instructor not found', 404);
        }

        return successResponse(res, null, 'Instructor deleted');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.uploadPhoto = async (req, res) => {
    try {
        const { id } = req.params;

        if (!req.file) {
            return errorResponse(res, 'No file uploaded');
        }

        const photoPath = `/instructors/${req.file.filename}`;
        const instructor = await mockDataService.updateInstructor(id, { PhotoPath: photoPath });

        if (!instructor) {
            return errorResponse(res, 'Instructor not found', 404);
        }

        // Display ekranlarına anında broadcast et
        const scheduler = req.app.get('scheduler');
        if (scheduler && scheduler.broadcastLessonUpdate) {
            await scheduler.broadcastLessonUpdate();
        }

        return successResponse(res, { PhotoPath: photoPath }, 'Photo uploaded');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
