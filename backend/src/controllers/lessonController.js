const mockDataService = require('../services/mockDataService');
const qrcodeService = require('../services/qrcodeService');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getCurrentLesson = async (req, res) => {
    try {
        const { studioId } = req.params;
        const lesson = await mockDataService.getCurrentLesson(studioId);

        if (!lesson) {
            return successResponse(res, null, 'No current lesson');
        }

        return successResponse(res, lesson);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.getNextLesson = async (req, res) => {
    try {
        const { studioId } = req.params;
        const lesson = await mockDataService.getNextLesson(studioId);

        if (!lesson) {
            return successResponse(res, null, 'No upcoming lesson');
        }

        return successResponse(res, lesson);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.getTodayLessons = async (req, res) => {
    try {
        const { studioId } = req.params;
        const lessons = await mockDataService.getTodayLessons(studioId);

        return successResponse(res, lessons);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.getAllLessons = async (req, res) => {
    try {
        const lessons = await mockDataService.getAllLessons();
        return successResponse(res, lessons);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.getLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await mockDataService.getLesson(id);

        if (!lesson) {
            return errorResponse(res, 'Lesson not found', 404);
        }

        return successResponse(res, lesson);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.createLesson = async (req, res) => {
    try {
        const lesson = await mockDataService.createLesson(req.body);

        // Eğer QRCodeData (URL) varsa, QR kod oluştur
        if (lesson.QRCodeData) {
            const qrPath = await qrcodeService.generateLessonQRCode(lesson.LessonID, lesson.QRCodeData);
            lesson.QRCodeImagePath = qrPath;
            await mockDataService.updateLesson(lesson.LessonID, { QRCodeImagePath: qrPath });
        }

        // Display ekranlarına anında broadcast et
        const scheduler = req.app.get('scheduler');
        if (scheduler && scheduler.broadcastLessonUpdate) {
            await scheduler.broadcastLessonUpdate(); // Tüm stüdyolara gönder
        }

        return successResponse(res, lesson, 'Lesson created');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.updateLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await mockDataService.updateLesson(id, req.body);

        if (!lesson) {
            return errorResponse(res, 'Lesson not found', 404);
        }

        // Eğer QRCodeData (URL) güncellenmiş ise, QR kodu yeniden oluştur
        if (req.body.QRCodeData) {
            const qrPath = await qrcodeService.generateLessonQRCode(lesson.LessonID, req.body.QRCodeData);
            lesson.QRCodeImagePath = qrPath;
            await mockDataService.updateLesson(lesson.LessonID, { QRCodeImagePath: qrPath });
        }

        // Display ekranlarına anında broadcast et
        const scheduler = req.app.get('scheduler');
        if (scheduler && scheduler.broadcastLessonUpdate) {
            await scheduler.broadcastLessonUpdate(); // Tüm stüdyolara gönder
        }

        return successResponse(res, lesson, 'Lesson updated');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const success = await mockDataService.deleteLesson(id);

        if (!success) {
            return errorResponse(res, 'Lesson not found', 404);
        }

        return successResponse(res, null, 'Lesson deleted');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
