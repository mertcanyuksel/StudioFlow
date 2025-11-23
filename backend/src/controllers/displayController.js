const mockDataService = require('../services/mockDataService');
const logger = require('../utils/logger');
const { successResponse, errorResponse } = require('../utils/helpers');

/**
 * Get current content to display for a screen
 * Returns either: current lesson, next lesson, override media, or idle state
 */
exports.getCurrentContent = async (req, res) => {
    try {
        const { screenId } = req.params;

        // Get screen info to find studio - try both token and ID
        let screen = await mockDataService.getScreenByToken(screenId);

        // If not found by token, try by ID (for numeric screenIds)
        if (!screen && !isNaN(screenId)) {
            screen = await mockDataService.getScreen(parseInt(screenId));
        }

        if (!screen) {
            return errorResponse(res, 'Screen not found', 404);
        }

        const studioId = screen.StudioID;

        // PRIORITY 1: Check for active override
        const activeOverride = await mockDataService.getActiveOverride(studioId);
        if (activeOverride) {
            const nextLesson = await mockDataService.getNextLesson(studioId);
            return successResponse(res, {
                type: 'media',
                mediaUrl: activeOverride.MediaPath,
                mediaType: activeOverride.MediaType,
                title: activeOverride.MediaTitle,
                endDateTime: activeOverride.EndDateTime,
                nextLesson: nextLesson
            });
        }

        // PRIORITY 2: Check for current lesson
        const currentLesson = await mockDataService.getCurrentLesson(studioId);
        if (currentLesson) {
            const nextLesson = await mockDataService.getNextLesson(studioId);
            return successResponse(res, {
                type: 'lesson',
                lesson: currentLesson,
                nextLesson: nextLesson
            });
        }

        // PRIORITY 3: Show next lesson
        const nextLesson = await mockDataService.getNextLesson(studioId);
        if (nextLesson) {
            return successResponse(res, {
                type: 'next-lesson',
                nextLesson: nextLesson
            });
        }

        // PRIORITY 4: Idle state
        return successResponse(res, {
            type: 'idle'
        });

    } catch (error) {
        logger.error('Error getting current content:', error);
        return errorResponse(res, 'Failed to get current content', 500);
    }
};
