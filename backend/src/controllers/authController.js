const jwt = require('jsonwebtoken');
const mockDataService = require('../services/mockDataService');
const { successResponse, errorResponse } = require('../utils/helpers');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return errorResponse(res, 'Username and password required');
        }

        const user = await mockDataService.authenticateUser(username, password);

        if (!user) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        const token = jwt.sign(
            { userId: user.UserID, username: user.Username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return successResponse(res, {
            token,
            user: {
                id: user.UserID,
                username: user.Username,
                fullName: user.FullName
            }
        }, 'Login successful');
    } catch (error) {
        return errorResponse(res, error.message, 500);
    }
};

exports.verify = async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return errorResponse(res, 'No token provided', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await mockDataService.getUserById(decoded.userId);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        return successResponse(res, {
            user: {
                id: user.UserID,
                username: user.Username,
                fullName: user.FullName
            }
        }, 'Token valid');
    } catch (error) {
        return errorResponse(res, 'Invalid token', 401);
    }
};
