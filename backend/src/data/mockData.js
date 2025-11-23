// Mock database
const mockData = {
    studios: [
        { StudioID: 1, StudioName: 'Studio A', Location: 'Ground Floor', IsActive: true },
        { StudioID: 2, StudioName: 'Studio B', Location: 'First Floor', IsActive: true }
    ],

    instructors: [
        {
            InstructorID: 1,
            InstructorName: 'Ayşe Yılmaz',
            PhotoPath: '/instructors/instructor-1.jpg',
            Bio: 'Yoga instructor with 10 years experience',
            Phone: '555-0001',
            Email: 'ayse@gym.com',
            IsActive: true
        },
        {
            InstructorID: 2,
            InstructorName: 'Mehmet Demir',
            PhotoPath: '/instructors/instructor-2.jpg',
            Bio: 'Pilates and fitness expert',
            Phone: '555-0002',
            Email: 'mehmet@gym.com',
            IsActive: true
        },
        {
            InstructorID: 3,
            InstructorName: 'Zeynep Kaya',
            PhotoPath: '/instructors/instructor-3.jpg',
            Bio: 'Spinning and cardio specialist',
            Phone: '555-0003',
            Email: 'zeynep@gym.com',
            IsActive: true
        },
        {
            InstructorID: 4,
            InstructorName: 'Can Özkan',
            PhotoPath: '/instructors/instructor-4.jpg',
            Bio: 'Meditation and mindfulness expert',
            Phone: '555-0004',
            Email: 'can@gym.com',
            IsActive: true
        },
        {
            InstructorID: 5,
            InstructorName: 'Deniz Akar',
            PhotoPath: '/instructors/instructor-5.jpg',
            Bio: 'CrossFit and HIIT specialist',
            Phone: '555-0005',
            Email: 'deniz@gym.com',
            IsActive: true
        }
    ],

    lessons: [
        {
            LessonID: 1,
            LessonName: 'Morning Yoga',
            InstructorID: 1,
            Description: 'Start your day with energizing yoga poses',
            QRCodeData: 'https://yourgym.com/lesson/1',
            QRCodeImagePath: '/qrcodes/lesson-1.png',
            DisplayColor: '#10b981',
            IsActive: true
        },
        {
            LessonID: 2,
            LessonName: 'Power Pilates',
            InstructorID: 2,
            Description: 'Core strengthening pilates workout',
            QRCodeData: 'https://yourgym.com/lesson/2',
            QRCodeImagePath: '/qrcodes/lesson-2.png',
            DisplayColor: '#3b82f6',
            IsActive: true
        },
        {
            LessonID: 3,
            LessonName: 'Spinning Class',
            InstructorID: 3,
            Description: 'High intensity indoor cycling',
            QRCodeData: 'https://yourgym.com/lesson/3',
            QRCodeImagePath: '/qrcodes/lesson-3.png',
            DisplayColor: '#ef4444',
            IsActive: true
        },
        {
            LessonID: 4,
            LessonName: 'Evening Yoga',
            InstructorID: 1,
            Description: 'Relaxing yoga for end of day',
            QRCodeData: 'https://yourgym.com/lesson/4',
            QRCodeImagePath: '/qrcodes/lesson-4.png',
            DisplayColor: '#8b5cf6',
            IsActive: true
        },
        {
            LessonID: 5,
            LessonName: 'Gece Meditasyon',
            InstructorID: 4,
            Description: 'Günün stresini atan derin meditasyon seansı',
            QRCodeData: 'https://yourgym.com/lesson/5',
            QRCodeImagePath: '/qrcodes/lesson-5.png',
            DisplayColor: '#6366f1',
            IsActive: true
        },
        {
            LessonID: 6,
            LessonName: 'HIIT Training',
            InstructorID: 5,
            Description: 'Yüksek yoğunluklu interval antrenman',
            QRCodeData: 'https://yourgym.com/lesson/6',
            QRCodeImagePath: '/qrcodes/lesson-6.png',
            DisplayColor: '#f59e0b',
            IsActive: true
        },
        {
            LessonID: 7,
            LessonName: 'Sabah Stretching',
            InstructorID: 2,
            Description: 'Güne esnek başlayın',
            QRCodeData: 'https://yourgym.com/lesson/7',
            QRCodeImagePath: '/qrcodes/lesson-7.png',
            DisplayColor: '#14b8a6',
            IsActive: true
        }
    ],

    // Today's schedule - no capacity tracking needed
    todaySchedule: [
        {
            ScheduleID: 1,
            StudioID: 1,
            LessonID: 6,
            StartTime: '01:00',
            EndTime: '02:00'
        },
        {
            ScheduleID: 2,
            StudioID: 2,
            LessonID: 3,
            StartTime: '01:00',
            EndTime: '02:00'
        },
        {
            ScheduleID: 3,
            StudioID: 1,
            LessonID: 5,
            StartTime: '02:00',
            EndTime: '03:00'
        },
        {
            ScheduleID: 4,
            StudioID: 2,
            LessonID: 1,
            StartTime: '02:30',
            EndTime: '03:30'
        },
        {
            ScheduleID: 5,
            StudioID: 1,
            LessonID: 7,
            StartTime: '07:00',
            EndTime: '08:00'
        },
        {
            ScheduleID: 6,
            StudioID: 1,
            LessonID: 1,
            StartTime: '09:00',
            EndTime: '10:00'
        },
        {
            ScheduleID: 7,
            StudioID: 2,
            LessonID: 2,
            StartTime: '09:30',
            EndTime: '10:30'
        },
        {
            ScheduleID: 8,
            StudioID: 1,
            LessonID: 3,
            StartTime: '11:00',
            EndTime: '12:00'
        },
        {
            ScheduleID: 9,
            StudioID: 2,
            LessonID: 1,
            StartTime: '14:00',
            EndTime: '15:00'
        },
        {
            ScheduleID: 10,
            StudioID: 1,
            LessonID: 4,
            StartTime: '18:00',
            EndTime: '19:00'
        },
        {
            ScheduleID: 11,
            StudioID: 2,
            LessonID: 6,
            StartTime: '19:30',
            EndTime: '20:30'
        },
        {
            ScheduleID: 12,
            StudioID: 1,
            LessonID: 5,
            StartTime: '23:00',
            EndTime: '23:59'
        },
        {
            ScheduleID: 13,
            StudioID: 2,
            LessonID: 5,
            StartTime: '23:00',
            EndTime: '23:59'
        }
    ],

    screens: [
        {
            ScreenID: 1,
            StudioID: 1,
            ScreenName: 'Studio A Door Display',
            DeviceToken: 'token-studio-a',
            IsOnline: false,
            LastConnected: null
        },
        {
            ScreenID: 2,
            StudioID: 2,
            ScreenName: 'Studio B Door Display',
            DeviceToken: 'token-studio-b',
            IsOnline: false,
            LastConnected: null
        }
    ],

    contents: [
        {
            ContentID: 1,
            ContentType: 'video',
            Title: 'Summer Promotion',
            FilePath: '/videos/summer-promo.mp4',
            Duration: 30,
            Priority: 1,
            IsActive: true
        },
        {
            ContentID: 2,
            ContentType: 'image',
            Title: 'New Class Announcement',
            FilePath: '/images/new-class.jpg',
            Duration: 15,
            Priority: 2,
            IsActive: true
        }
    ],

    // Media Library - Kullanıcının yüklediği medya dosyaları
    mediaLibrary: [
        {
            MediaID: 1,
            MediaType: 'video',
            Title: '🎬 Tanıtım Videosu (3 dk)',
            MediaPath: '/media/promo.mp4',
            Duration: 180, // 3 dakika - saniye cinsinden
            Thumbnail: '/media/thumbnails/promo.jpg',
            IsActive: true,
            CreatedAt: '2025-01-20T10:00:00'
        },
        {
            MediaID: 2,
            MediaType: 'video',
            Title: '🎬 Ders Tanıtımı (1 dk)',
            MediaPath: '/media/intro.mp4',
            Duration: 60, // 1 dakika
            Thumbnail: '/media/thumbnails/intro.jpg',
            IsActive: true,
            CreatedAt: '2025-01-20T11:00:00'
        },
        {
            MediaID: 3,
            MediaType: 'video',
            Title: '🎬 Kısa Reklam (30 sn)',
            MediaPath: '/media/ad-short.mp4',
            Duration: 30, // 30 saniye
            Thumbnail: '/media/thumbnails/ad-short.jpg',
            IsActive: true,
            CreatedAt: '2025-01-20T11:30:00'
        },
        {
            MediaID: 4,
            MediaType: 'video',
            Title: '🎬 Uzun Video (5 dk)',
            MediaPath: '/media/long-video.mp4',
            Duration: 300, // 5 dakika
            Thumbnail: '/media/thumbnails/long-video.jpg',
            IsActive: true,
            CreatedAt: '2025-01-20T12:00:00'
        },
        {
            MediaID: 5,
            MediaType: 'image',
            Title: '📷 Kampanya Afişi',
            MediaPath: '/media/campaign-poster.jpg',
            Duration: null, // Fotoğraf - süre yok
            Thumbnail: '/media/campaign-poster.jpg',
            IsActive: true,
            CreatedAt: '2025-01-20T12:30:00'
        },
        {
            MediaID: 6,
            MediaType: 'image',
            Title: '📷 Yeni Ders Duyurusu',
            MediaPath: '/media/new-class.jpg',
            Duration: null,
            Thumbnail: '/media/new-class.jpg',
            IsActive: true,
            CreatedAt: '2025-01-20T13:00:00'
        },
        {
            MediaID: 7,
            MediaType: 'image',
            Title: '📷 Üyelik İndirimi',
            MediaPath: '/media/discount.jpg',
            Duration: null,
            Thumbnail: '/media/discount.jpg',
            IsActive: true,
            CreatedAt: '2025-01-20T13:30:00'
        }
    ],

    // Schedule Overrides - Manuel olarak eklenen içerikler
    scheduleOverrides: [
        // ========== 5 DAKİKALIK TEST SENARYOSU (Studio A) - YENİ ==========
        // 1. Video (30 saniye) - Kısa Reklam x3 tekrar = 1.5 dk
        {
            OverrideID: 101,
            StudioID: 1,
            MediaID: 3, // Kısa Reklam 30 sn
            StartDateTime: '2025-11-23T02:37:00',
            EndDateTime: '2025-11-23T02:38:30', // 30sn x 3 = 1.5dk
            IsActive: true,
            CreatedAt: '2025-11-23T02:36:00'
        },
        // 2. Fotoğraf (1 dakika) - Kampanya Afişi
        {
            OverrideID: 102,
            StudioID: 1,
            MediaID: 5, // Kampanya Afişi
            StartDateTime: '2025-11-23T02:38:30',
            EndDateTime: '2025-11-23T02:39:30', // 1 dakika
            IsActive: true,
            CreatedAt: '2025-11-23T02:36:00'
        },
        // 3. Video (1 dakika) - Ders Tanıtımı
        {
            OverrideID: 103,
            StudioID: 1,
            MediaID: 2, // Ders Tanıtımı 1dk
            StartDateTime: '2025-11-23T02:39:30',
            EndDateTime: '2025-11-23T02:40:30', // 1 dakika
            IsActive: true,
            CreatedAt: '2025-11-23T02:36:00'
        },
        // 4. Fotoğraf (30 saniye) - Yeni Ders Duyurusu
        {
            OverrideID: 104,
            StudioID: 1,
            MediaID: 6, // Yeni Ders Duyurusu
            StartDateTime: '2025-11-23T02:40:30',
            EndDateTime: '2025-11-23T02:41:00', // 30 saniye
            IsActive: true,
            CreatedAt: '2025-11-23T02:36:00'
        },
        // 5. Video (1 dakika) - Uzun Video (ilk 1 dakikası)
        {
            OverrideID: 105,
            StudioID: 1,
            MediaID: 4, // Uzun Video 5dk (ama sadece 1 dk göster)
            StartDateTime: '2025-11-23T02:41:00',
            EndDateTime: '2025-11-23T02:42:00', // 1 dakika
            IsActive: true,
            CreatedAt: '2025-11-23T02:36:00'
        }
        // Toplam: 1.5 + 1 + 1 + 0.5 + 1 = 5 dakika
        // Başlangıç: 02:37:00, Bitiş: 02:42:00
    ],

    settings: {
        ShowAdsWhenClassActive: 'true',
        AdIntervalMinutes: '5',
        AdDurationSeconds: '30',
        CountdownWarningMinutes: '5',
        RefreshIntervalSeconds: '10',
        QRCodeSize: '200',
        ShowInstructorPhoto: 'true'
    },

    adminUsers: [
        {
            UserID: 1,
            Username: 'admin',
            // Password: 'admin123' (in plain text for mock mode)
            PasswordHash: '$2a$10$EXAMPLE',
            FullName: 'Admin User',
            IsActive: true
        }
    ]
};

// Helper functions
function getCurrentLesson(studioId) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const schedule = mockData.todaySchedule.find(s =>
        s.StudioID === studioId &&
        s.StartTime <= currentTime &&
        s.EndTime > currentTime
    );

    if (!schedule) return null;

    const lesson = mockData.lessons.find(l => l.LessonID === schedule.LessonID);
    const instructor = mockData.instructors.find(i => i.InstructorID === lesson.InstructorID);

    // Calculate remaining minutes
    const endParts = schedule.EndTime.split(':');
    const endDate = new Date();
    endDate.setHours(parseInt(endParts[0]), parseInt(endParts[1]), 0);
    const remainingMinutes = Math.floor((endDate - now) / 60000);

    return {
        ...lesson,
        ...schedule,
        InstructorName: instructor.InstructorName,
        InstructorPhoto: instructor.PhotoPath,
        RemainingMinutes: remainingMinutes,
        EndTime: schedule.EndTime
    };
}

function getNextLesson(studioId) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const schedule = mockData.todaySchedule
        .filter(s => s.StudioID === studioId && s.StartTime > currentTime)
        .sort((a, b) => a.StartTime.localeCompare(b.StartTime))[0];

    if (!schedule) return null;

    const lesson = mockData.lessons.find(l => l.LessonID === schedule.LessonID);
    const instructor = mockData.instructors.find(i => i.InstructorID === lesson.InstructorID);

    return {
        ...lesson,
        ...schedule,
        InstructorName: instructor.InstructorName,
        InstructorPhoto: instructor.PhotoPath
    };
}

function getTodayLessons(studioId) {
    return mockData.todaySchedule
        .filter(s => s.StudioID === studioId)
        .map(schedule => {
            const lesson = mockData.lessons.find(l => l.LessonID === schedule.LessonID);
            const instructor = mockData.instructors.find(i => i.InstructorID === lesson.InstructorID);
            return {
                ...lesson,
                ...schedule,
                InstructorName: instructor.InstructorName
            };
        })
        .sort((a, b) => a.StartTime.localeCompare(b.StartTime));
}

module.exports = {
    mockData,
    getCurrentLesson,
    getNextLesson,
    getTodayLessons
};
