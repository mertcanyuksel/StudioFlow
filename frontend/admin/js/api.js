class ApiClient {
    constructor() {
        this.baseURL = CONFIG.API_URL;
        this.token = localStorage.getItem('auth_token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('auth_token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('auth_token');
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    async put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    async uploadFile(endpoint, formData) {
        const headers = {};

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers,
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

            return data;
        } catch (error) {
            console.error('Upload Error:', error);
            throw error;
        }
    }

    // Auth
    async login(username, password) {
        return this.post('/api/auth/login', { username, password });
    }

    async verifyToken() {
        return this.get('/api/auth/verify');
    }

    // Lessons
    async getAllLessons() {
        return this.get('/api/lessons');
    }

    async getLesson(id) {
        return this.get(`/api/lessons/${id}`);
    }

    async getCurrentLesson(studioId) {
        return this.get(`/api/lessons/current/${studioId}`);
    }

    async getNextLesson(studioId) {
        return this.get(`/api/lessons/next/${studioId}`);
    }

    async getTodayLessons(studioId) {
        return this.get(`/api/lessons/today/${studioId}`);
    }

    async createLesson(lesson) {
        return this.post('/api/lessons', lesson);
    }

    async updateLesson(id, lesson) {
        return this.put(`/api/lessons/${id}`, lesson);
    }

    async deleteLesson(id) {
        return this.delete(`/api/lessons/${id}`);
    }

    // Instructors
    async getAllInstructors() {
        return this.get('/api/instructors');
    }

    async getInstructor(id) {
        return this.get(`/api/instructors/${id}`);
    }

    async createInstructor(instructor) {
        return this.post('/api/instructors', instructor);
    }

    async updateInstructor(id, instructor) {
        return this.put(`/api/instructors/${id}`, instructor);
    }

    async deleteInstructor(id) {
        return this.delete(`/api/instructors/${id}`);
    }

    async uploadInstructorPhoto(id, formData) {
        return this.uploadFile(`/api/instructors/${id}/photo`, formData);
    }

    // Contents
    async getAllContents() {
        return this.get('/api/contents');
    }

    async uploadContent(formData) {
        return this.uploadFile('/api/contents', formData);
    }

    async deleteContent(id) {
        return this.delete(`/api/contents/${id}`);
    }

    // Screens
    async getAllScreens() {
        return this.get('/api/screens');
    }

    // Settings
    async getAllSettings() {
        return this.get('/api/settings');
    }

    async updateSetting(key, value) {
        return this.put(`/api/settings/${key}`, { value });
    }

    // Emergency
    async sendEmergency(message) {
        return this.post('/api/emergency', { message });
    }
}

// Create global API instance
const api = new ApiClient();
