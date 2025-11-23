require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const { errorHandler } = require('./utils/helpers');

const app = express();
const server = http.createServer(app);

// Rate limiting
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 1000 // limit each IP to 1000 requests per windowMs (development mode)
});

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false  // Disable CSP for development to allow images
}));
app.use(compression());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', limiter);

// Static files - serve uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/instructors', require('./routes/instructors'));
app.use('/api/contents', require('./routes/contents'));
app.use('/api/screens', require('./routes/screens'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/media', require('./routes/media'));
app.use('/api/schedule', require('./routes/schedule'));
app.use('/api/display', require('./routes/display'));
app.use('/api/studios', require('./routes/studios'));

// Emergency broadcast endpoint
app.post('/api/emergency', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message required' });
    }

    if (io && io.broadcastEmergency) {
        io.broadcastEmergency(message);
        return res.json({ success: true, message: 'Emergency broadcast sent' });
    }

    return res.status(500).json({ error: 'Socket.IO not initialized' });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        mode: process.env.DB_MODE || 'mock',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

// Socket.IO setup
const io = socketIO(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:4040',
        methods: ['GET', 'POST']
    }
});

// Initialize Socket.IO service
require('./services/socketService')(io);

// Start scheduler if in mock mode
let scheduler = null;
if (process.env.DB_MODE === 'mock' || !process.env.DB_MODE) {
    scheduler = require('./services/schedulerService')(io);
}

// Scheduler'ı global olarak erişilebilir yap (controller'lardan broadcast için)
app.set('scheduler', scheduler);

// Start server
const PORT = process.env.PORT || 4141;
server.listen(PORT, () => {
    logger.info(`Backend API running on port ${PORT}`);
    logger.info(`Database mode: ${process.env.DB_MODE || 'mock'}`);
    logger.info(`CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:4040'}`);
    console.log(`
╔═══════════════════════════════════════════════════╗
║   Studio Display Backend API                      ║
║   Port: ${PORT}                                    ║
║   Mode: ${process.env.DB_MODE || 'mock'}                                       ║
║   Status: Running ✓                               ║
╚═══════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger.info('HTTP server closed');
    });
});

module.exports = { app, server, io };
