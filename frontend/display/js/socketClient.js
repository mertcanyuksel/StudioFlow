class SocketClient {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectDelay = 3000;
    }

    connect() {
        console.log('Connecting to Socket.IO server...');

        this.socket = io(CONFIG.SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: this.reconnectDelay,
            reconnectionAttempts: this.maxReconnectAttempts
        });

        this.socket.on('connect', () => {
            console.log('Socket.IO connected');
            this.connected = true;
            this.reconnectAttempts = 0;
            this.updateStatus(true);

            // Join studio room
            this.socket.emit('join-studio', CONFIG.STUDIO_ID);

            // Notify server that screen is online
            this.socket.emit('screen-online', CONFIG.DEVICE_TOKEN);

            // Request initial lesson data
            this.socket.emit('refresh-lesson', CONFIG.STUDIO_ID);
        });

        this.socket.on('disconnect', () => {
            console.log('Socket.IO disconnected');
            this.connected = false;
            this.updateStatus(false);
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            this.reconnectAttempts++;
            this.updateStatus(false);
        });

        this.socket.on('lesson-update', (data) => {
            console.log('Lesson update received:', data);
            if (window.displayManager) {
                window.displayManager.updateLesson(data);
            }
        });

        this.socket.on('show-content', (content) => {
            console.log('Content received:', content);
            if (window.displayManager) {
                window.displayManager.showContent(content);
            }
        });

        this.socket.on('emergency', (data) => {
            console.log('Emergency message received:', data);
            if (window.displayManager) {
                window.displayManager.showEmergency(data.message);
            }
        });

        // Start heartbeat
        this.startHeartbeat();
    }

    startHeartbeat() {
        setInterval(() => {
            if (this.connected) {
                this.socket.emit('heartbeat', CONFIG.DEVICE_TOKEN);
            }
        }, CONFIG.HEARTBEAT_INTERVAL);
    }

    updateStatus(online) {
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');

        if (online) {
            statusIndicator.classList.remove('offline');
            statusIndicator.classList.add('online');
            statusText.textContent = 'Connected';
        } else {
            statusIndicator.classList.remove('online');
            statusIndicator.classList.add('offline');
            statusText.textContent = 'Disconnected';
        }
    }

    refreshLesson() {
        if (this.connected) {
            this.socket.emit('refresh-lesson', CONFIG.STUDIO_ID);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
        }
    }
}
