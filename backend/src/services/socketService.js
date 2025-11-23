const mockDataService = require('./mockDataService');
const logger = require('../utils/logger');

module.exports = function(io) {
    io.on('connection', (socket) => {
        logger.info('Client connected:', socket.id);

        // Join studio room
        socket.on('join-studio', async (studioId) => {
            const roomName = `studio-${studioId}`;
            socket.join(roomName);
            logger.info(`Socket ${socket.id} joined ${roomName}`);

            // Send current lesson immediately
            try {
                const currentLesson = await mockDataService.getCurrentLesson(studioId);
                const nextLesson = await mockDataService.getNextLesson(studioId);

                socket.emit('lesson-update', {
                    current: currentLesson,
                    next: nextLesson
                });
            } catch (error) {
                logger.error('Error sending lesson update:', error);
            }
        });

        // Update screen status
        socket.on('screen-online', async (deviceToken) => {
            try {
                await mockDataService.updateScreenStatus(deviceToken, true);
                logger.info(`Screen ${deviceToken} is online`);
            } catch (error) {
                logger.error('Error updating screen status:', error);
            }
        });

        // Handle heartbeat
        socket.on('heartbeat', async (deviceToken) => {
            try {
                await mockDataService.updateScreenStatus(deviceToken, true);
            } catch (error) {
                logger.error('Error handling heartbeat:', error);
            }
        });

        // Request lesson refresh
        socket.on('refresh-lesson', async (studioId) => {
            try {
                const currentLesson = await mockDataService.getCurrentLesson(studioId);
                const nextLesson = await mockDataService.getNextLesson(studioId);

                socket.emit('lesson-update', {
                    current: currentLesson,
                    next: nextLesson
                });
            } catch (error) {
                logger.error('Error refreshing lesson:', error);
            }
        });

        socket.on('disconnect', () => {
            logger.info('Client disconnected:', socket.id);
        });
    });

    // Emergency broadcast
    io.broadcastEmergency = (message) => {
        io.emit('emergency', { message, timestamp: new Date() });
        logger.info('Emergency broadcast:', message);
    };

    // Content broadcast
    io.broadcastContent = (content) => {
        io.emit('show-content', content);
        logger.info('Content broadcast:', content.title);
    };

    // Lesson update broadcast to specific studio
    io.updateStudioLesson = async (studioId) => {
        try {
            const currentLesson = await mockDataService.getCurrentLesson(studioId);
            const nextLesson = await mockDataService.getNextLesson(studioId);

            io.to(`studio-${studioId}`).emit('lesson-update', {
                current: currentLesson,
                next: nextLesson
            });
        } catch (error) {
            logger.error('Error broadcasting lesson update:', error);
        }
    };

    return io;
};
