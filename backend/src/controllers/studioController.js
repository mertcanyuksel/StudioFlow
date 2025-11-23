const mockDataService = require('../services/mockDataService');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.getAllStudios = async (req, res) => {
    try {
        const studios = await mockDataService.getAllStudios();
        return successResponse(res, studios);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.getStudio = async (req, res) => {
    try {
        const { id } = req.params;
        const studio = await mockDataService.getStudio(id);

        if (!studio) {
            return errorResponse(res, 'Studio not found', 404);
        }

        return successResponse(res, studio);
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};
