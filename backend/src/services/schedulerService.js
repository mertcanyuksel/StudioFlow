const mockDataService = require('./mockDataService');
const logger = require('../utils/logger');

module.exports = function(io) {
    logger.info('Starting mock scheduler service...');

    // Check lessons every 10 seconds
    const lessonCheckInterval = setInterval(async () => {
        try {
            // Check Studio 1
            const studio1Current = await mockDataService.getCurrentLesson(1);
            const studio1Next = await mockDataService.getNextLesson(1);

            io.to('studio-1').emit('lesson-update', {
                current: studio1Current,
                next: studio1Next
            });

            // Check Studio 2
            const studio2Current = await mockDataService.getCurrentLesson(2);
            const studio2Next = await mockDataService.getNextLesson(2);

            io.to('studio-2').emit('lesson-update', {
                current: studio2Current,
                next: studio2Next
            });

            logger.info('Lesson updates broadcasted');
        } catch (error) {
            logger.error('Scheduler error:', error);
        }
    }, 10000); // 10 seconds

    // Simulate ad content every 5 minutes
    const adInterval = setInterval(async () => {
        try {
            const contents = await mockDataService.getAllContents();
            const activeContents = contents.filter(c => c.IsActive);

            if (activeContents.length > 0) {
                // Sort by priority
                activeContents.sort((a, b) => a.Priority - b.Priority);
                const content = activeContents[0];

                io.emit('show-content', {
                    type: content.ContentType,
                    url: content.FilePath,
                    duration: content.Duration,
                    title: content.Title
                });

                logger.info('Ad content broadcasted:', content.Title);
            }
        } catch (error) {
            logger.error('Ad scheduler error:', error);
        }
    }, 300000); // 5 minutes

    // Cleanup on shutdown
    process.on('SIGTERM', () => {
        clearInterval(lessonCheckInterval);
        clearInterval(adInterval);
        logger.info('Scheduler stopped');
    });

    // Manuel broadcast fonksiyonu (ders güncellendiğinde hemen göndermek için)
    async function broadcastLessonUpdate(studioId = null) {
        try {
            if (studioId) {
                // Belirli bir stüdyo için broadcast
                const current = await mockDataService.getCurrentLesson(studioId);
                const next = await mockDataService.getNextLesson(studioId);
                io.to(`studio-${studioId}`).emit('lesson-update', {
                    current: current,
                    next: next
                });
                logger.info(`Lesson update broadcasted to studio-${studioId}`);
            } else {
                // Tüm stüdyolar için broadcast
                const studio1Current = await mockDataService.getCurrentLesson(1);
                const studio1Next = await mockDataService.getNextLesson(1);
                io.to('studio-1').emit('lesson-update', {
                    current: studio1Current,
                    next: studio1Next
                });

                const studio2Current = await mockDataService.getCurrentLesson(2);
                const studio2Next = await mockDataService.getNextLesson(2);
                io.to('studio-2').emit('lesson-update', {
                    current: studio2Current,
                    next: studio2Next
                });

                logger.info('Lesson updates broadcasted to all studios');
            }
        } catch (error) {
            logger.error('Broadcast error:', error);
        }
    }

    return {
        lessonCheckInterval,
        adInterval,
        broadcastLessonUpdate
    };
};
