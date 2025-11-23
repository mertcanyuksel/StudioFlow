const mockDataService = require('../services/mockDataService');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getAllOverrides = async (req, res) => {
    try {
        const { studioId, startDate, endDate } = req.query;
        const overrides = await mockDataService.getAllOverrides(studioId, startDate, endDate);
        return successResponse(res, overrides);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.getOverride = async (req, res) => {
    try {
        const { id } = req.params;
        const override = await mockDataService.getOverride(id);

        if (!override) {
            return errorResponse(res, 'Override not found', 404);
        }

        return successResponse(res, override);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.createOverride = async (req, res) => {
    try {
        const override = await mockDataService.createOverride(req.body);

        // Broadcast to display screens
        const scheduler = req.app.get('scheduler');
        if (scheduler && scheduler.broadcastLessonUpdate) {
            await scheduler.broadcastLessonUpdate(req.body.StudioID);
        }

        return successResponse(res, override, 'Override created successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.createBulkOverrides = async (req, res) => {
    try {
        const { pattern } = req.body;

        if (!pattern) {
            return errorResponse(res, 'Pattern is required', 400);
        }

        const { mediaId, studioId, type, startDate, endDate, timeStart, timeEnd, intervalMinutes, duration } = pattern;

        if (!mediaId || !studioId || !type) {
            return errorResponse(res, 'Missing required fields: mediaId, studioId, type', 400);
        }

        const overrides = [];

        if (type === 'interval') {
            // Örnek: Her 30 dakikada bir, 09:00-18:00 arası, bugün
            const start = new Date(startDate);
            const end = new Date(endDate);

            // Günler arası loop
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const [startHour, startMin] = timeStart.split(':').map(Number);
                const [endHour, endMin] = timeEnd.split(':').map(Number);

                // Saat aralığı içinde interval'lar oluştur
                for (let hour = startHour; hour <= endHour; hour++) {
                    for (let min = 0; min < 60; min += intervalMinutes) {
                        // Son saat kontrolü
                        if (hour === endHour && min > endMin) break;
                        if (hour === startHour && min < startMin) continue;

                        const startDateTime = new Date(d);
                        startDateTime.setHours(hour, min, 0, 0);

                        const endDateTime = new Date(startDateTime);
                        endDateTime.setSeconds(endDateTime.getSeconds() + duration);

                        // Bitiş saatini geçmemeli
                        const maxEnd = new Date(d);
                        maxEnd.setHours(endHour, endMin, 0, 0);
                        if (endDateTime > maxEnd) break;

                        overrides.push({
                            StudioID: studioId,
                            MediaID: mediaId,
                            StartDateTime: startDateTime.toISOString().replace('T', ' ').substring(0, 19),
                            EndDateTime: endDateTime.toISOString().replace('T', ' ').substring(0, 19)
                        });
                    }
                }
            }
        } else if (type === 'sametime_alldays') {
            // Aynı saatte tüm günlere kopyala
            const start = new Date(startDate);
            const end = new Date(endDate);
            const [hour, min] = timeStart.split(':').map(Number);

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const startDateTime = new Date(d);
                startDateTime.setHours(hour, min, 0, 0);

                const endDateTime = new Date(startDateTime);
                endDateTime.setSeconds(endDateTime.getSeconds() + duration);

                overrides.push({
                    StudioID: studioId,
                    MediaID: mediaId,
                    StartDateTime: startDateTime.toISOString().replace('T', ' ').substring(0, 19),
                    EndDateTime: endDateTime.toISOString().replace('T', ' ').substring(0, 19)
                });
            }
        }

        if (overrides.length === 0) {
            return errorResponse(res, 'No overrides generated from pattern', 400);
        }

        const results = await mockDataService.createBulkOverrides(overrides);

        // Broadcast to display screens
        const scheduler = req.app.get('scheduler');
        if (scheduler && scheduler.broadcastLessonUpdate) {
            await scheduler.broadcastLessonUpdate(studioId);
        }

        return successResponse(res, results, `${results.length} overrides created successfully`);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.updateOverride = async (req, res) => {
    try {
        const { id } = req.params;
        const override = await mockDataService.updateOverride(id, req.body);

        if (!override) {
            return errorResponse(res, 'Override not found', 404);
        }

        // Broadcast to display screens
        const scheduler = req.app.get('scheduler');
        if (scheduler && scheduler.broadcastLessonUpdate) {
            await scheduler.broadcastLessonUpdate(override.StudioID);
        }

        return successResponse(res, override, 'Override updated successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.deleteOverride = async (req, res) => {
    try {
        const { id } = req.params;
        const override = await mockDataService.getOverride(id);

        if (!override) {
            return errorResponse(res, 'Override not found', 404);
        }

        const studioId = override.StudioID;
        const success = await mockDataService.deleteOverride(id);

        if (!success) {
            return errorResponse(res, 'Failed to delete override', 500);
        }

        // Broadcast to display screens
        const scheduler = req.app.get('scheduler');
        if (scheduler && scheduler.broadcastLessonUpdate) {
            await scheduler.broadcastLessonUpdate(studioId);
        }

        return successResponse(res, null, 'Override deleted successfully');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
