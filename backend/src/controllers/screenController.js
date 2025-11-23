const mockDataService = require('../services/mockDataService');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getAllScreens = async (req, res) => {
    try {
        const screens = await mockDataService.getAllScreens();
        return successResponse(res, screens);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.getScreen = async (req, res) => {
    try {
        const { id } = req.params;
        const screen = await mockDataService.getScreen(id);

        if (!screen) {
            return errorResponse(res, 'Screen not found', 404);
        }

        return successResponse(res, screen);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.heartbeat = async (req, res) => {
    try {
        const { deviceToken } = req.body;

        if (!deviceToken) {
            return errorResponse(res, 'Device token required');
        }

        const screen = await mockDataService.updateScreenStatus(deviceToken, true);

        if (!screen) {
            return errorResponse(res, 'Screen not found', 404);
        }

        return successResponse(res, { lastConnected: screen.LastConnected }, 'Heartbeat received');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
