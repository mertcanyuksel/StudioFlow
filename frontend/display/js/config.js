const CONFIG = {
    API_URL: 'http://localhost:4141',
    SOCKET_URL: 'http://localhost:4141',
    UPLOADS_URL: 'http://localhost:4141/uploads',

    // For production, update these:
    // API_URL: 'https://api.yourdomain.com',
    // SOCKET_URL: 'https://api.yourdomain.com',
    // UPLOADS_URL: 'https://api.yourdomain.com/uploads'

    // Device token for this screen (get from URL or set manually)
    DEVICE_TOKEN: null,

    // Studio ID (get from URL parameter)
    STUDIO_ID: null,

    // Refresh intervals
    REFRESH_INTERVAL: 10000, // 10 seconds
    HEARTBEAT_INTERVAL: 30000, // 30 seconds

    // Countdown warning threshold
    WARNING_MINUTES: 5
};

// Get studio ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
CONFIG.STUDIO_ID = urlParams.get('studio') || '1';
CONFIG.DEVICE_TOKEN = urlParams.get('token') || `token-studio-${CONFIG.STUDIO_ID === '1' ? 'a' : 'b'}`;
