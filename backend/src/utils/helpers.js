const jwt = require('jsonwebtoken');

// JWT middleware
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// Error handler
function errorHandler(err, req, res, next) {
    console.error(err.stack);

    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

// Success response
function successResponse(res, data, message = 'Success') {
    return res.json({
        success: true,
        message,
        data
    });
}

// Error response
function errorResponse(res, message, status = 400) {
    return res.status(status).json({
        success: false,
        error: message
    });
}

module.exports = {
    authMiddleware,
    errorHandler,
    successResponse,
    errorResponse
};
