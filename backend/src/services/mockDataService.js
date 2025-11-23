const { mockData, getCurrentLesson, getNextLesson, getTodayLessons } = require('../data/mockData');

class MockDataService {
    // Lessons
    async getCurrentLesson(studioId) {
        return getCurrentLesson(parseInt(studioId));
    }

    async getNextLesson(studioId) {
        return getNextLesson(parseInt(studioId));
    }

    async getTodayLessons(studioId) {
        return getTodayLessons(parseInt(studioId));
    }

    async getAllLessons() {
        return mockData.lessons.map(lesson => {
            const instructor = mockData.instructors.find(i => i.InstructorID === lesson.InstructorID);
            return {
                ...lesson,
                InstructorName: instructor?.InstructorName
            };
        });
    }

    async getLesson(id) {
        const lesson = mockData.lessons.find(l => l.LessonID === parseInt(id));
        if (!lesson) return null;

        const instructor = mockData.instructors.find(i => i.InstructorID === lesson.InstructorID);
        return {
            ...lesson,
            InstructorName: instructor?.InstructorName
        };
    }

    async updateLesson(id, data) {
        const index = mockData.lessons.findIndex(l => l.LessonID === parseInt(id));
        if (index === -1) return null;

        mockData.lessons[index] = {
            ...mockData.lessons[index],
            ...data,
            UpdatedAt: new Date()
        };

        return mockData.lessons[index];
    }

    async createLesson(data) {
        const newId = Math.max(...mockData.lessons.map(l => l.LessonID)) + 1;
        const newLesson = {
            LessonID: newId,
            ...data,
            IsActive: true,
            CreatedAt: new Date()
        };
        mockData.lessons.push(newLesson);
        return newLesson;
    }

    async deleteLesson(id) {
        const index = mockData.lessons.findIndex(l => l.LessonID === parseInt(id));
        if (index === -1) return false;

        mockData.lessons.splice(index, 1);
        return true;
    }

    // Instructors
    async getAllInstructors() {
        return mockData.instructors;
    }

    async getInstructor(id) {
        return mockData.instructors.find(i => i.InstructorID === parseInt(id));
    }

    async createInstructor(data) {
        const newId = Math.max(...mockData.instructors.map(i => i.InstructorID)) + 1;
        const newInstructor = {
            InstructorID: newId,
            ...data,
            IsActive: true,
            CreatedAt: new Date()
        };
        mockData.instructors.push(newInstructor);
        return newInstructor;
    }

    async updateInstructor(id, data) {
        const index = mockData.instructors.findIndex(i => i.InstructorID === parseInt(id));
        if (index === -1) return null;

        mockData.instructors[index] = {
            ...mockData.instructors[index],
            ...data,
            UpdatedAt: new Date()
        };

        return mockData.instructors[index];
    }

    async deleteInstructor(id) {
        const index = mockData.instructors.findIndex(i => i.InstructorID === parseInt(id));
        if (index === -1) return false;

        mockData.instructors.splice(index, 1);
        return true;
    }

    // Studios
    async getAllStudios() {
        return mockData.studios;
    }

    async getStudio(id) {
        return mockData.studios.find(s => s.StudioID === parseInt(id));
    }

    // Screens
    async getAllScreens() {
        return mockData.screens.map(screen => {
            const studio = mockData.studios.find(s => s.StudioID === screen.StudioID);
            return {
                ...screen,
                StudioName: studio?.StudioName
            };
        });
    }

    async getScreen(id) {
        const screen = mockData.screens.find(s => s.ScreenID === parseInt(id));
        if (!screen) return null;

        const studio = mockData.studios.find(s => s.StudioID === screen.StudioID);
        return {
            ...screen,
            StudioName: studio?.StudioName
        };
    }

    async updateScreenStatus(deviceToken, isOnline) {
        const screen = mockData.screens.find(s => s.DeviceToken === deviceToken);
        if (screen) {
            screen.IsOnline = isOnline;
            screen.LastConnected = new Date();
            return screen;
        }
        return null;
    }

    async getScreenByToken(deviceToken) {
        return mockData.screens.find(s => s.DeviceToken === deviceToken);
    }

    // Contents
    async getAllContents() {
        return mockData.contents;
    }

    async getContent(id) {
        return mockData.contents.find(c => c.ContentID === parseInt(id));
    }

    async createContent(data) {
        const newId = Math.max(...mockData.contents.map(c => c.ContentID)) + 1;
        const newContent = {
            ContentID: newId,
            ...data,
            IsActive: true,
            CreatedAt: new Date()
        };
        mockData.contents.push(newContent);
        return newContent;
    }

    async updateContent(id, data) {
        const index = mockData.contents.findIndex(c => c.ContentID === parseInt(id));
        if (index === -1) return null;

        mockData.contents[index] = {
            ...mockData.contents[index],
            ...data,
            UpdatedAt: new Date()
        };

        return mockData.contents[index];
    }

    async deleteContent(id) {
        const index = mockData.contents.findIndex(c => c.ContentID === parseInt(id));
        if (index === -1) return false;

        mockData.contents.splice(index, 1);
        return true;
    }

    // Settings
    async getAllSettings() {
        return Object.entries(mockData.settings).map(([key, value]) => ({
            SettingKey: key,
            SettingValue: value
        }));
    }

    async getSetting(key) {
        return mockData.settings[key];
    }

    async updateSetting(key, value) {
        mockData.settings[key] = value;
        return { SettingKey: key, SettingValue: value };
    }

    // Auth
    async authenticateUser(username, password) {
        const user = mockData.adminUsers.find(u => u.Username === username);
        if (!user) return null;

        // In mock mode, just check if password is 'admin123'
        if (password === 'admin123') {
            return {
                UserID: user.UserID,
                Username: user.Username,
                FullName: user.FullName
            };
        }

        return null;
    }

    async getUserById(id) {
        const user = mockData.adminUsers.find(u => u.UserID === parseInt(id));
        if (!user) return null;

        return {
            UserID: user.UserID,
            Username: user.Username,
            FullName: user.FullName
        };
    }

    // Media Library
    async getAllMedia() {
        return mockData.mediaLibrary;
    }

    async getMedia(id) {
        return mockData.mediaLibrary.find(m => m.MediaID === parseInt(id));
    }

    async createMedia(data) {
        const newId = Math.max(...mockData.mediaLibrary.map(m => m.MediaID), 0) + 1;
        const newMedia = {
            MediaID: newId,
            ...data,
            IsActive: true,
            CreatedAt: new Date().toISOString()
        };
        mockData.mediaLibrary.push(newMedia);
        return newMedia;
    }

    async updateMedia(id, data) {
        const index = mockData.mediaLibrary.findIndex(m => m.MediaID === parseInt(id));
        if (index === -1) return null;

        mockData.mediaLibrary[index] = {
            ...mockData.mediaLibrary[index],
            ...data,
            UpdatedAt: new Date().toISOString()
        };

        return mockData.mediaLibrary[index];
    }

    async deleteMedia(id) {
        const index = mockData.mediaLibrary.findIndex(m => m.MediaID === parseInt(id));
        if (index === -1) return false;

        mockData.mediaLibrary.splice(index, 1);
        return true;
    }

    // Schedule Overrides
    async getAllOverrides(studioId = null, startDate = null, endDate = null) {
        let overrides = mockData.scheduleOverrides;

        if (studioId) {
            overrides = overrides.filter(o => o.StudioID === parseInt(studioId));
        }

        if (startDate && endDate) {
            overrides = overrides.filter(o => {
                const oStart = new Date(o.StartDateTime);
                const oEnd = new Date(o.EndDateTime);
                const rangeStart = new Date(startDate);
                const rangeEnd = new Date(endDate);
                // Override overlaps if it starts before range ends AND ends after range starts
                return oStart < rangeEnd && oEnd > rangeStart;
            });
        }

        // Join with media info
        return overrides.map(override => {
            const media = mockData.mediaLibrary.find(m => m.MediaID === override.MediaID);
            return {
                ...override,
                MediaTitle: media?.Title,
                MediaType: media?.MediaType,
                MediaPath: media?.MediaPath,
                MediaDuration: media?.Duration
            };
        });
    }

    async getOverride(id) {
        const override = mockData.scheduleOverrides.find(o => o.OverrideID === parseInt(id));
        if (!override) return null;

        const media = mockData.mediaLibrary.find(m => m.MediaID === override.MediaID);
        return {
            ...override,
            MediaTitle: media?.Title,
            MediaType: media?.MediaType,
            MediaPath: media?.MediaPath,
            MediaDuration: media?.Duration
        };
    }

    async createOverride(data) {
        const newId = Math.max(...mockData.scheduleOverrides.map(o => o.OverrideID), 0) + 1;
        const newOverride = {
            OverrideID: newId,
            ...data,
            IsActive: true,
            CreatedAt: new Date().toISOString()
        };
        mockData.scheduleOverrides.push(newOverride);
        return newOverride;
    }

    async createBulkOverrides(overrides) {
        const results = [];
        for (const override of overrides) {
            const newId = Math.max(...mockData.scheduleOverrides.map(o => o.OverrideID), 0) + 1;
            const newOverride = {
                OverrideID: newId,
                ...override,
                IsActive: true,
                CreatedAt: new Date().toISOString()
            };
            mockData.scheduleOverrides.push(newOverride);
            results.push(newOverride);
        }
        return results;
    }

    async updateOverride(id, data) {
        const index = mockData.scheduleOverrides.findIndex(o => o.OverrideID === parseInt(id));
        if (index === -1) return null;

        mockData.scheduleOverrides[index] = {
            ...mockData.scheduleOverrides[index],
            ...data,
            UpdatedAt: new Date().toISOString()
        };

        return mockData.scheduleOverrides[index];
    }

    async deleteOverride(id) {
        const index = mockData.scheduleOverrides.findIndex(o => o.OverrideID === parseInt(id));
        if (index === -1) return false;

        mockData.scheduleOverrides.splice(index, 1);
        return true;
    }

    // Get active override for a specific studio at a specific time
    async getActiveOverride(studioId, datetime = null) {
        const checkTime = datetime ? new Date(datetime) : new Date();

        const override = mockData.scheduleOverrides.find(o => {
            if (o.StudioID !== parseInt(studioId) || !o.IsActive) return false;

            const start = new Date(o.StartDateTime);
            const end = new Date(o.EndDateTime);

            return checkTime >= start && checkTime <= end;
        });

        if (!override) return null;

        const media = mockData.mediaLibrary.find(m => m.MediaID === override.MediaID);
        return {
            ...override,
            MediaTitle: media?.Title,
            MediaType: media?.MediaType,
            MediaPath: media?.MediaPath,
            MediaDuration: media?.Duration
        };
    }
}

module.exports = new MockDataService();
