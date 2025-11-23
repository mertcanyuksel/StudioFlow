// Dashboard functionality
let dashboardData = {
    lessons: [],
    instructors: [],
    screens: [],
    contents: []
};

async function loadDashboard() {
    try {
        // Load all data
        const [lessons, instructors, screens, contents] = await Promise.all([
            api.getAllLessons(),
            api.getAllInstructors(),
            api.getAllScreens(),
            api.getAllContents()
        ]);

        dashboardData.lessons = lessons.data || [];
        dashboardData.instructors = instructors.data || [];
        dashboardData.screens = screens.data || [];
        dashboardData.contents = contents.data || [];

        updateStats();
        await loadScreensStatus();
        await loadTodaySchedule();
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function updateStats() {
    document.getElementById('total-lessons').textContent = dashboardData.lessons.length;
    document.getElementById('total-instructors').textContent = dashboardData.instructors.length;
    document.getElementById('total-contents').textContent = dashboardData.contents.length;

    const onlineScreens = dashboardData.screens.filter(s => s.IsOnline).length;
    document.getElementById('online-screens').textContent = `${onlineScreens}/${dashboardData.screens.length}`;
}

async function loadScreensStatus() {
    const container = document.getElementById('screens-status');

    if (dashboardData.screens.length === 0) {
        container.innerHTML = '<p>No screens configured</p>';
        return;
    }

    container.innerHTML = dashboardData.screens.map(screen => `
        <div class="screen-card ${screen.IsOnline ? 'online' : 'offline'}">
            <h3>${screen.ScreenName}</h3>
            <p><strong>Studio:</strong> ${screen.StudioName}</p>
            <p><strong>Status:</strong> ${screen.IsOnline ? 'Online' : 'Offline'}</p>
            <p><strong>Last Connected:</strong> ${screen.LastConnected ? new Date(screen.LastConnected).toLocaleString() : 'Never'}</p>
        </div>
    `).join('');
}

async function loadTodaySchedule() {
    try {
        const [studio1, studio2] = await Promise.all([
            api.getTodayLessons(1),
            api.getTodayLessons(2)
        ]);

        displaySchedule('studio-a-schedule', studio1.data || []);
        displaySchedule('studio-b-schedule', studio2.data || []);
    } catch (error) {
        console.error('Error loading schedule:', error);
    }
}

function displaySchedule(containerId, lessons) {
    const container = document.getElementById(containerId);

    if (lessons.length === 0) {
        container.innerHTML = '<p>No lessons scheduled for today</p>';
        return;
    }

    container.innerHTML = lessons.map(lesson => `
        <div class="schedule-item">
            <div>
                <h4>${lesson.LessonName}</h4>
                <p>${lesson.InstructorName}</p>
            </div>
            <div>
                <strong>${lesson.StartTime} - ${lesson.EndTime}</strong>
                <p>${lesson.CurrentEnrollment}/${lesson.Capacity} enrolled</p>
            </div>
        </div>
    `).join('');
}

// Emergency form
document.getElementById('emergency-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const message = document.getElementById('emergency-message').value;

    if (confirm(`Send emergency broadcast: "${message}"?`)) {
        try {
            await api.sendEmergency(message);
            alert('Emergency broadcast sent!');
            document.getElementById('emergency-message').value = '';
        } catch (error) {
            alert('Failed to send emergency broadcast: ' + error.message);
        }
    }
});

// Load dashboard on page load
window.addEventListener('DOMContentLoaded', loadDashboard);

// Auto-refresh every 30 seconds
setInterval(loadDashboard, 30000);
