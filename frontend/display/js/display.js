class DisplayManager {
    constructor() {
        this.currentLesson = null;
        this.nextLesson = null;
        this.countdownInterval = null;
        this.contentTimeout = null;

        // DOM elements
        this.lessonDisplay = document.getElementById('lesson-display');
        this.noLessonDisplay = document.getElementById('no-lesson-display');
        this.contentDisplay = document.getElementById('content-display');
        this.emergencyOverlay = document.getElementById('emergency-overlay');

        // Initialize
        this.init();
    }

    init() {
        // Set studio name
        const studioNames = { '1': 'Studio A', '2': 'Studio B' };
        document.getElementById('studio-name').textContent = studioNames[CONFIG.STUDIO_ID] || `Studio ${CONFIG.STUDIO_ID}`;

        // Start periodic refresh from API as backup
        setInterval(() => {
            this.fetchLessonData();
        }, CONFIG.REFRESH_INTERVAL);
    }

    async fetchLessonData() {
        try {
            // KRITIK: Önce override kontrolü yap!
            const overrideResponse = await fetch(`${CONFIG.API_URL}/api/schedule/override?studioId=${CONFIG.STUDIO_ID}`);
            const overrideResult = await overrideResponse.json();

            if (overrideResult.success && overrideResult.data) {
                // Şu anki zamana denk gelen aktif override var mı?
                const now = new Date();
                const activeOverride = overrideResult.data.find(o => {
                    const start = new Date(o.StartDateTime);
                    const end = new Date(o.EndDateTime);
                    return now >= start && now <= end && o.IsActive;
                });

                if (activeOverride) {
                    // OVERRIDE VAR! Sütun 2'yi göster
                    this.showOverride(activeOverride);
                    return;
                }
            }

            // Override yoksa normal ders programını göster (Sütun 1)
            const response = await fetch(`${CONFIG.API_URL}/api/lessons/current/${CONFIG.STUDIO_ID}`);
            const result = await response.json();

            if (result.success && result.data) {
                this.updateLesson({ current: result.data });
            } else {
                // No current lesson, fetch next
                const nextResponse = await fetch(`${CONFIG.API_URL}/api/lessons/next/${CONFIG.STUDIO_ID}`);
                const nextResult = await nextResponse.json();

                this.updateLesson({
                    current: null,
                    next: nextResult.success ? nextResult.data : null
                });
            }
        } catch (error) {
            console.error('Error fetching lesson data:', error);
        }
    }

    updateLesson(data) {
        this.currentLesson = data.current;
        this.nextLesson = data.next;

        if (this.currentLesson) {
            this.showCurrentLesson();
        } else {
            this.showNoLesson();
        }
    }

    showCurrentLesson() {
        // Hide other displays
        this.noLessonDisplay.style.display = 'none';
        this.contentDisplay.style.display = 'none';
        this.lessonDisplay.style.display = 'block';

        const lesson = this.currentLesson;

        // Update lesson info
        document.getElementById('lesson-name').textContent = lesson.LessonName;
        document.getElementById('lesson-description').textContent = lesson.Description || '';

        // Update instructor
        document.getElementById('instructor-name').textContent = lesson.InstructorName || 'TBA';
        const instructorPhoto = document.getElementById('instructor-photo');

        // Use placeholder image if no photo available
        const photoUrl = lesson.InstructorPhoto
            ? `${CONFIG.API_URL}/uploads${lesson.InstructorPhoto}`
            : `${CONFIG.API_URL}/uploads/instructors/default-instructor.jpg`;

        instructorPhoto.src = photoUrl;
        instructorPhoto.onerror = () => {
            instructorPhoto.src = `${CONFIG.API_URL}/uploads/instructors/default-instructor.jpg`;
        };

        // Update times
        document.getElementById('start-time').textContent = lesson.StartTime;
        document.getElementById('end-time').textContent = lesson.EndTime;

        // Show QR code from backend
        this.showQRCode(lesson.QRCodeImagePath);

        // Start countdown
        this.startCountdown(lesson.EndTime, lesson.RemainingMinutes);
    }

    showNoLesson() {
        // Hide other displays
        this.lessonDisplay.style.display = 'none';
        this.contentDisplay.style.display = 'none';
        this.noLessonDisplay.style.display = 'flex';

        // Stop countdown
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        // Show next lesson info if available
        const nextInfo = document.getElementById('next-lesson-info');
        const noUpcoming = document.getElementById('no-upcoming-message');

        if (this.nextLesson && nextInfo) {
            nextInfo.style.display = 'block';
            if (noUpcoming) noUpcoming.style.display = 'none';

            const nextLessonName = document.getElementById('next-lesson-name');
            const nextLessonTime = document.getElementById('next-lesson-time');
            const nextLessonInstructor = document.getElementById('next-lesson-instructor');

            if (nextLessonName) nextLessonName.textContent = this.nextLesson.LessonName;
            if (nextLessonTime) nextLessonTime.textContent = `Starts at ${this.nextLesson.StartTime}`;
            if (nextLessonInstructor) nextLessonInstructor.textContent = `with ${this.nextLesson.InstructorName}`;
        } else {
            if (nextInfo) nextInfo.style.display = 'none';
            if (noUpcoming) noUpcoming.style.display = 'block';
        }
    }

    startCountdown(endTime, remainingMinutes) {
        // Clear existing countdown
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        const updateCountdown = () => {
            const now = new Date();
            const [hours, minutes] = endTime.split(':');
            const end = new Date();
            end.setHours(parseInt(hours), parseInt(minutes), 0);

            const diff = end - now;

            if (diff <= 0) {
                document.getElementById('countdown-timer').textContent = '00:00';
                clearInterval(this.countdownInterval);
                // Refresh to get next lesson
                setTimeout(() => {
                    if (window.socketClient) {
                        window.socketClient.refreshLesson();
                    }
                }, 2000);
                return;
            }

            const mins = Math.floor(diff / 60000);
            const secs = Math.floor((diff % 60000) / 1000);

            const countdownText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            const countdownElement = document.getElementById('countdown-timer');
            countdownElement.textContent = countdownText;

            // Warning state
            if (mins < CONFIG.WARNING_MINUTES) {
                countdownElement.classList.add('warning');
            } else {
                countdownElement.classList.remove('warning');
            }
        };

        updateCountdown();
        this.countdownInterval = setInterval(updateCountdown, 1000);
    }

    showQRCode(qrImagePath) {
        const qrImg = document.getElementById('qr-code');

        console.log('showQRCode called with:', qrImagePath);

        if (qrImagePath) {
            // Backend'den gelen QR kod fotoğrafını göster
            const fullUrl = `${CONFIG.API_URL}/uploads${qrImagePath}`;
            console.log('Loading QR from:', fullUrl);
            qrImg.src = fullUrl;
            qrImg.style.display = 'block';

            // Başarı durumunda log
            qrImg.onload = () => {
                console.log('QR code loaded successfully!');
            };

            // Hata durumunda placeholder göster
            qrImg.onerror = () => {
                console.error('QR code image not found:', qrImagePath);
                console.error('Full URL was:', fullUrl);
                qrImg.style.display = 'none';
            };
        } else {
            console.log('No QR code path provided');
            qrImg.style.display = 'none';
        }
    }

    showContent(content) {
        // Only show content if enabled in settings
        // For now, we'll show it

        this.contentDisplay.style.display = 'flex';
        this.lessonDisplay.style.display = 'none';
        this.noLessonDisplay.style.display = 'none';

        const video = document.getElementById('content-video');
        const image = document.getElementById('content-image');

        if (content.type === 'video') {
            video.style.display = 'block';
            image.style.display = 'none';
            video.src = `${CONFIG.UPLOADS_URL}${content.url}`;
            video.play();

            video.onended = () => {
                this.hideContent();
            };
        } else {
            image.style.display = 'block';
            video.style.display = 'none';
            image.src = `${CONFIG.UPLOADS_URL}${content.url}`;

            // Auto hide after duration
            this.contentTimeout = setTimeout(() => {
                this.hideContent();
            }, (content.duration || 15) * 1000);
        }
    }

    hideContent() {
        if (this.contentTimeout) {
            clearTimeout(this.contentTimeout);
        }

        this.contentDisplay.style.display = 'none';

        // Show lesson or no-lesson display
        if (this.currentLesson) {
            this.showCurrentLesson();
        } else {
            this.showNoLesson();
        }
    }

    // YENI: Override içeriğini göster (Manuel içerik - Sütun 2)
    showOverride(override) {
        console.log('Showing override:', override);

        // Tüm ekranları gizle
        this.lessonDisplay.style.display = 'none';
        this.noLessonDisplay.style.display = 'none';
        this.contentDisplay.style.display = 'flex';

        const video = document.getElementById('content-video');
        const image = document.getElementById('content-image');

        if (override.MediaType === 'video') {
            video.style.display = 'block';
            image.style.display = 'none';
            video.src = `${CONFIG.API_URL}/uploads${override.MediaPath}`;
            video.loop = true; // Video bitince tekrar başlat
            video.play();
        } else {
            image.style.display = 'block';
            video.style.display = 'none';
            image.src = `${CONFIG.API_URL}/uploads${override.MediaPath}`;
        }

        // Override bittiğinde normal programa dön
        const end = new Date(override.EndDateTime);
        const now = new Date();
        const remaining = end - now;

        if (remaining > 0) {
            this.contentTimeout = setTimeout(() => {
                this.fetchLessonData(); // Normal programa geri dön
            }, remaining);
        }
    }

    showEmergency(message) {
        this.emergencyOverlay.style.display = 'flex';
        document.getElementById('emergency-message').textContent = message;

        // Auto-hide after 30 seconds
        setTimeout(() => {
            this.hideEmergency();
        }, 30000);
    }

    hideEmergency() {
        this.emergencyOverlay.style.display = 'none';
    }

    adjustColor(color, amount) {
        // Simple color adjustment for gradient
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Initialize display manager
    window.displayManager = new DisplayManager();

    // Initialize socket client
    window.socketClient = new SocketClient();
    window.socketClient.connect();

    // Initial data fetch
    window.displayManager.fetchLessonData();
});
