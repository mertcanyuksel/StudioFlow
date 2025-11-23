let currentStudio = 1;
let schedule = [];
let lessons = [];
let contents = [];
let draggedElement = null;
let resizingElement = null;
let startY = 0;
let startTop = 0;
let startHeight = 0;

// Initialize
window.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    generateTimeLabels();
    renderCalendar();
});

async function loadData() {
    try {
        const [lessonsRes, contentsRes, scheduleRes] = await Promise.all([
            api.getAllLessons(),
            api.getAllContents(),
            api.getTodayLessons(currentStudio)
        ]);

        lessons = lessonsRes.data || [];
        contents = contentsRes.data || [];
        schedule = scheduleRes.data || [];

        // Populate lesson select
        const lessonSelect = document.getElementById('lesson-select');
        lessonSelect.innerHTML = '<option value="">Ders Seçin</option>' +
            lessons.map(l => `<option value="${l.LessonID}">${l.LessonName}</option>`).join('');

        // Populate content select
        const contentSelect = document.getElementById('ad-content');
        contentSelect.innerHTML = '<option value="">İçerik Seçin</option>' +
            contents.map(c => `<option value="${c.ContentID}">${c.Title}</option>`).join('');

    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function generateTimeLabels() {
    const container = document.querySelector('.time-labels');
    container.innerHTML = '';

    for (let hour = 0; hour < 24; hour++) {
        const label = document.createElement('div');
        label.className = 'time-label';
        label.textContent = `${hour.toString().padStart(2, '0')}:00`;
        container.appendChild(label);
    }
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    if (schedule.length === 0) {
        grid.innerHTML = `
            <div class="empty-calendar">
                <div class="empty-calendar-icon">📅</div>
                <h3>Henüz ders eklenmemiş</h3>
                <p>"Ders Ekle" butonuna tıklayarak başlayın</p>
            </div>
        `;
        return;
    }

    schedule.forEach(item => {
        const slot = createSlotElement(item);
        grid.appendChild(slot);
    });
}

function createSlotElement(item) {
    const lesson = lessons.find(l => l.LessonID === item.LessonID);
    if (!lesson) return null;

    const slot = document.createElement('div');
    slot.className = 'schedule-slot';
    slot.dataset.scheduleId = item.ScheduleID;
    slot.draggable = true;

    // Calculate position and height
    const [startHour, startMin] = item.StartTime.split(':').map(Number);
    const [endHour, endMin] = item.EndTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const duration = endMinutes - startMinutes;

    const top = (startMinutes / 1440) * 100; // 1440 = 24 * 60
    const height = (duration / 1440) * 100;

    slot.style.top = `${top}%`;
    slot.style.height = `${height}%`;
    slot.style.background = `linear-gradient(135deg, ${lesson.DisplayColor} 0%, ${adjustColor(lesson.DisplayColor, -20)} 100%)`;

    slot.innerHTML = `
        <div class="slot-header">
            <span class="slot-title">${lesson.LessonName}</span>
            <span class="slot-time">${item.StartTime} - ${item.EndTime}</span>
        </div>
        <div class="slot-instructor">${item.InstructorName || ''}</div>
        <div class="slot-description">${lesson.Description || ''}</div>
        <div class="resize-handle"></div>
    `;

    // Drag & Drop
    slot.addEventListener('dragstart', handleDragStart);
    slot.addEventListener('dragend', handleDragEnd);
    slot.addEventListener('click', () => editSlot(item));

    // Resize
    const resizeHandle = slot.querySelector('.resize-handle');
    resizeHandle.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        startResize(e, slot, item);
    });

    return slot;
}

// Drag & Drop Handlers
function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');

    const grid = document.getElementById('calendar-grid');
    const rect = grid.getBoundingClientRect();
    const y = e.clientY - rect.top;

    // Calculate new start time
    const percentY = (y / rect.height) * 100;
    const minutes = Math.round((percentY / 100) * 1440);
    const roundedMinutes = Math.round(minutes / 15) * 15; // Round to 15 min

    const hours = Math.floor(roundedMinutes / 60);
    const mins = roundedMinutes % 60;
    const newStartTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;

    // Update schedule
    const scheduleId = parseInt(e.target.dataset.scheduleId);
    updateSlotTime(scheduleId, newStartTime);

    draggedElement = null;
}

// Resize Handlers
function startResize(e, slot, item) {
    e.preventDefault();
    resizingElement = slot;
    startY = e.clientY;
    startTop = slot.offsetTop;
    startHeight = slot.offsetHeight;

    slot.classList.add('resizing');

    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
}

function handleResize(e) {
    if (!resizingElement) return;

    const deltaY = e.clientY - startY;
    const newHeight = Math.max(30, startHeight + deltaY); // Min 30px

    resizingElement.style.height = newHeight + 'px';
}

function stopResize(e) {
    if (!resizingElement) return;

    const grid = document.getElementById('calendar-grid');
    const gridHeight = grid.offsetHeight;
    const slotHeight = resizingElement.offsetHeight;

    // Calculate new duration
    const percentHeight = (slotHeight / gridHeight) * 100;
    const newDuration = Math.round((percentHeight / 100) * 1440);
    const roundedDuration = Math.round(newDuration / 15) * 15; // Round to 15 min

    const scheduleId = parseInt(resizingElement.dataset.scheduleId);
    const item = schedule.find(s => s.ScheduleID === scheduleId);

    if (item) {
        const [startHour, startMin] = item.StartTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = startMinutes + roundedDuration;

        const endHour = Math.floor(endMinutes / 60);
        const endMin = endMinutes % 60;
        const newEndTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

        updateSlotDuration(scheduleId, item.StartTime, newEndTime);
    }

    resizingElement.classList.remove('resizing');
    resizingElement = null;

    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
}

// API Updates
async function updateSlotTime(scheduleId, newStartTime) {
    const item = schedule.find(s => s.ScheduleID === scheduleId);
    if (!item) return;

    const [startHour, startMin] = item.StartTime.split(':').map(Number);
    const [endHour, endMin] = item.EndTime.split(':').map(Number);

    const oldDuration = (endHour * 60 + endMin) - (startHour * 60 + startMin);

    const [newStartHour, newStartMin] = newStartTime.split(':').map(Number);
    const newEndMinutes = newStartHour * 60 + newStartMin + oldDuration;
    const newEndHour = Math.floor(newEndMinutes / 60);
    const newEndMin = newEndMinutes % 60;
    const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMin.toString().padStart(2, '0')}`;

    try {
        // In real app, this would be: await api.updateSchedule(scheduleId, {...})
        // For mock, just update locally
        item.StartTime = newStartTime;
        item.EndTime = newEndTime;
        renderCalendar();
        console.log('Updated slot time:', scheduleId, newStartTime, newEndTime);
    } catch (error) {
        console.error('Error updating slot:', error);
        alert('Slot güncellenirken hata oluştu');
    }
}

async function updateSlotDuration(scheduleId, startTime, endTime) {
    const item = schedule.find(s => s.ScheduleID === scheduleId);
    if (!item) return;

    try {
        item.EndTime = endTime;
        renderCalendar();
        console.log('Updated slot duration:', scheduleId, startTime, endTime);
    } catch (error) {
        console.error('Error updating duration:', error);
        alert('Süre güncellenirken hata oluştu');
    }
}

// Switch Studio
function switchStudio(studioId) {
    currentStudio = studioId;

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    loadData().then(() => renderCalendar());
}

// Modal Functions
function showAddLessonModal() {
    document.getElementById('lesson-modal').style.display = 'flex';
}

function closeLessonModal() {
    document.getElementById('lesson-modal').style.display = 'none';
}

function showAddAdModal() {
    document.getElementById('ad-modal').style.display = 'flex';
}

function closeAdModal() {
    document.getElementById('ad-modal').style.display = 'none';
}

function editSlot(item) {
    document.getElementById('edit-schedule-id').value = item.ScheduleID;
    document.getElementById('edit-start-time').value = item.StartTime;

    const [startHour, startMin] = item.StartTime.split(':').map(Number);
    const [endHour, endMin] = item.EndTime.split(':').map(Number);
    const duration = (endHour * 60 + endMin) - (startHour * 60 + startMin);
    document.getElementById('edit-duration').value = duration;

    document.getElementById('edit-modal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('edit-modal').style.display = 'none';
}

async function deleteSlot() {
    if (!confirm('Bu slotu silmek istediğinizden emin misiniz?')) return;

    const scheduleId = parseInt(document.getElementById('edit-schedule-id').value);

    try {
        // In real app: await api.deleteSchedule(scheduleId);
        schedule = schedule.filter(s => s.ScheduleID !== scheduleId);
        renderCalendar();
        closeEditModal();
        alert('Slot silindi');
    } catch (error) {
        console.error('Error deleting slot:', error);
        alert('Slot silinirken hata oluştu');
    }
}

// Form Submissions
document.getElementById('add-lesson-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const lessonId = parseInt(document.getElementById('lesson-select').value);
    const startTime = document.getElementById('start-time').value;
    const duration = parseInt(document.getElementById('duration').value);

    const [hours, mins] = startTime.split(':').map(Number);
    const endMinutes = hours * 60 + mins + duration;
    const endHour = Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

    const lesson = lessons.find(l => l.LessonID === lessonId);
    const newSchedule = {
        ScheduleID: Math.max(...schedule.map(s => s.ScheduleID), 0) + 1,
        StudioID: currentStudio,
        LessonID: lessonId,
        StartTime: startTime,
        EndTime: endTime,
        LessonName: lesson.LessonName,
        InstructorName: lesson.InstructorName,
        Description: lesson.Description,
        DisplayColor: lesson.DisplayColor
    };

    schedule.push(newSchedule);
    renderCalendar();
    closeLessonModal();
    e.target.reset();
});

document.getElementById('edit-slot-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const scheduleId = parseInt(document.getElementById('edit-schedule-id').value);
    const startTime = document.getElementById('edit-start-time').value;
    const duration = parseInt(document.getElementById('edit-duration').value);

    const [hours, mins] = startTime.split(':').map(Number);
    const endMinutes = hours * 60 + mins + duration;
    const endHour = Math.floor(endMinutes / 60);
    const endMin = endMinutes % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;

    const item = schedule.find(s => s.ScheduleID === scheduleId);
    if (item) {
        item.StartTime = startTime;
        item.EndTime = endTime;
        renderCalendar();
        closeEditModal();
    }
});

// Helper
function adjustColor(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
