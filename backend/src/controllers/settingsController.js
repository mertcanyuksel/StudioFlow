const mockDataService = require('../services/mockDataService');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getAllSettings = async (req, res) => {
    try {
        const settings = await mockDataService.getAllSettings();
        return successResponse(res, settings);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.getSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const value = await mockDataService.getSetting(key);

        if (value === undefined) {
            return errorResponse(res, 'Setting not found', 404);
        }

        return successResponse(res, { SettingKey: key, SettingValue: value });
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.updateSetting = async (req, res) => {
    try {
        const { key } = req.params;
        const { value } = req.body;

        if (value === undefined) {
            return errorResponse(res, 'Value required');
        }

        const setting = await mockDataService.updateSetting(key, value);
        return successResponse(res, setting, 'Setting updated');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
