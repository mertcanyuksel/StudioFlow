// Global state
let currentStudioId = null;
let mediaLibrary = [];
let scheduleOverrides = [];
let lessons = [];
let contextMenuData = null;
let selectedDate = null;
let weekDates = [];

// Initialize page
window.addEventListener('DOMContentLoaded', async () => {
    await loadStudios();
    await loadMediaLibrary();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Studio selector
    document.getElementById('studio-selector').addEventListener('change', async (e) => {
        currentStudioId = e.target.value;
        if (currentStudioId) {
            await loadSchedule();
        } else {
            document.getElementById('day-selector').innerHTML = '<div class="loading">Stüdyo seçiniz...</div>';
            document.getElementById('timeline-container').innerHTML = '<div class="loading">Stüdyo seçiniz...</div>';
        }
    });

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', async () => {
        if (currentStudioId) await loadSchedule();
        await loadMediaLibrary();
    });

    // Add media button
    document.getElementById('add-media-btn').addEventListener('click', showMediaUploadModal);

    // Media search
    document.getElementById('media-search').addEventListener('input', (e) => {
        filterMediaLibrary(e.target.value);
    });

    // Media upload form
    document.getElementById('media-upload-form').addEventListener('submit', handleMediaUpload);

    // File input change
    document.getElementById('media-file').addEventListener('change', handleFilePreview);

    // Multiply form
    document.getElementById('multiply-form').addEventListener('submit', handleMultiply);

    // Multiply type change
    document.querySelectorAll('input[name="multiply-type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('interval-options').style.display =
                e.target.value === 'interval' ? 'block' : 'none';
        });
    });

    // Close context menu when clicking outside
    document.addEventListener('click', () => {
        document.getElementById('context-menu').style.display = 'none';
    });
}

// Load studios
async function loadStudios() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/lessons`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        });
        const data = await response.json();

        // Get unique studios from lessons
        const studios = [
            { StudioID: 1, StudioName: 'Studio A' },
            { StudioID: 2, StudioName: 'Studio B' }
        ];

        const select = document.getElementById('studio-selector');
        select.innerHTML = '<option value="">Stüdyo seçiniz...</option>';
        studios.forEach(studio => {
            select.innerHTML += `<option value="${studio.StudioID}">${studio.StudioName}</option>`;
        });
    } catch (error) {
        console.error('Error loading studios:', error);
    }
}

// Load media library
async function loadMediaLibrary() {
    try {
        const response = await api.request('/api/media', 'GET');
        mediaLibrary = response.data || [];
        displayMediaLibrary();
    } catch (error) {
        console.error('Error loading media:', error);
        document.getElementById('media-list').innerHTML = '<p class="error-message">Medya yüklenemedi</p>';
    }
}

// Display media library
function displayMediaLibrary(filter = '') {
    const container = document.getElementById('media-list');

    const filtered = mediaLibrary.filter(m =>
        m.Title.toLowerCase().includes(filter.toLowerCase())
    );

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#9ca3af;">Medya bulunamadı</p>';
        return;
    }

    container.innerHTML = filtered.map(media => `
        <div class="media-item" draggable="true" data-media-id="${media.MediaID}"
             ondragstart="handleDragStart(event, ${media.MediaID})">
            <img src="${CONFIG.API_URL}/uploads${media.Thumbnail}"
                 class="media-thumbnail"
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22%3E%3Crect fill=%22%23e5e7eb%22 width=%2250%22 height=%2250%22/%3E%3C/svg%3E'">
            <div class="media-info">
                <div class="title">${media.Title}</div>
                <div class="meta">
                    <span class="media-type-badge ${media.MediaType}">${media.MediaType === 'video' ? '🎬 Video' : '🖼️ Foto'}</span>
                    ${media.Duration ? `<span>${media.Duration}s</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function filterMediaLibrary(query) {
    displayMediaLibrary(query);
}

// Load schedule
async function loadSchedule() {
    try {
        document.getElementById('day-selector').innerHTML = '<div class="loading">Yükleniyor...</div>';
        document.getElementById('timeline-container').innerHTML = '<div class="loading">Yükleniyor...</div>';

        // Get week dates (today + next 6 days)
        const today = new Date();
        weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            weekDates.push(date);
        }

        // Set selected date to today by default
        if (!selectedDate) {
            selectedDate = weekDates[0];
        }

        // Load lessons and overrides
        const [lessonsRes, overridesRes] = await Promise.all([
            api.request(`/api/lessons`, 'GET'),
            api.request(`/api/schedule/override?studioId=${currentStudioId}`, 'GET')
        ]);

        lessons = lessonsRes.data || [];
        scheduleOverrides = overridesRes.data || [];

        displayDaySelector();
        displayTimeline();
    } catch (error) {
        console.error('Error loading schedule:', error);
        document.getElementById('timeline-container').innerHTML = '<p class="error-message">Program yüklenemedi</p>';
    }
}

// Display day selector
function displayDaySelector() {
    const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const container = document.getElementById('day-selector');

    container.innerHTML = weekDates.map((date, index) => {
        const dayName = dayNames[date.getDay()];
        const dateStr = date.toISOString().split('T')[0];
        const isActive = selectedDate && selectedDate.toISOString().split('T')[0] === dateStr;

        return `
            <button class="day-btn ${isActive ? 'active' : ''}" onclick="selectDay(${index})">
                <span class="day-name">${dayName}</span>
                <span class="day-date">${date.getDate()}/${date.getMonth() + 1}</span>
            </button>
        `;
    }).join('');
}

// Select day handler
function selectDay(index) {
    selectedDate = weekDates[index];
    displayDaySelector();
    displayTimeline();
}

// Display timeline for selected day
function displayTimeline() {
    const container = document.getElementById('timeline-container');
    const dateStr = selectedDate.toISOString().split('T')[0];

    // Generate 24 hours (00:00 - 23:00)
    const hours = [];
    for (let h = 0; h < 24; h++) {
        hours.push(h);
    }

    container.innerHTML = `
        <div class="timeline">
            <!-- Time Column -->
            <div class="time-column">
                <div class="header">Saat</div>
                ${hours.map(h => `
                    <div class="time-slot">${String(h).padStart(2, '0')}:00</div>
                `).join('')}
            </div>

            <!-- Column 1: Auto -->
            <div class="schedule-column">
                <div class="column-header auto">📅 Sütun 1: Otomatik Program</div>
                ${hours.map(h => renderAutoSlot(h, dateStr)).join('')}
            </div>

            <!-- Column 2: Manual -->
            <div class="schedule-column">
                <div class="column-header manual">🎬 Sütun 2: Manuel İçerik</div>
                ${hours.map(h => renderManualSlot(h, dateStr)).join('')}
            </div>
        </div>
    `;
}

// Render auto slot for a specific hour
function renderAutoSlot(hour, dateStr) {
    // Mock: Show sample lessons at specific hours
    if (hour === 9) {
        return `
            <div class="schedule-slot has-content lesson">
                <div class="slot-content">
                    <div class="slot-time">09:00 - 10:00</div>
                    <div class="slot-title">Morning Yoga</div>
                    <div class="slot-meta">Eğitmen: Ayşe Yılmaz</div>
                </div>
            </div>
        `;
    } else if (hour === 10) {
        return `
            <div class="schedule-slot has-content next-lesson">
                <div class="slot-content">
                    <div class="slot-time">10:00 - 10:05</div>
                    <div class="slot-title">Sıradaki: Power Pilates</div>
                    <div class="slot-meta">11:00'de başlayacak</div>
                </div>
            </div>
        `;
    } else if (hour === 11) {
        return `
            <div class="schedule-slot has-content lesson">
                <div class="slot-content">
                    <div class="slot-time">11:00 - 12:00</div>
                    <div class="slot-title">Power Pilates</div>
                    <div class="slot-meta">Eğitmen: Mehmet Demir</div>
                </div>
            </div>
        `;
    }

    return `<div class="schedule-slot"></div>`;
}

// Render manual slot for a specific hour
function renderManualSlot(hour, dateStr) {
    // Find overrides that overlap with this hour
    const hourStart = `${dateStr} ${String(hour).padStart(2, '0')}:00:00`;
    const hourEnd = `${dateStr} ${String(hour).padStart(2, '0')}:59:59`;

    const hourOverrides = scheduleOverrides.filter(o => {
        // Check if override overlaps with this hour
        return o.StartDateTime >= hourStart && o.StartDateTime <= hourEnd;
    });

    // Render all overrides in this hour + empty space
    let slotContent = '';

    if (hourOverrides.length > 0) {
        hourOverrides.forEach(override => {
            slotContent += `
                <div class="schedule-item override-item"
                     oncontextmenu="showContextMenu(event, ${override.OverrideID})">
                    <div class="slot-time">${override.StartDateTime.substr(11, 5)} - ${override.EndDateTime.substr(11, 5)}</div>
                    <div class="slot-title">${override.MediaTitle}</div>
                    <div class="slot-meta">
                        <span class="media-type-badge ${override.MediaType}">${override.MediaType}</span>
                        ${override.MediaDuration ? `${override.MediaDuration}s` : ''}
                    </div>
                </div>
            `;
        });
    }

    // Always include drop zone
    slotContent += `
        <div class="drop-zone-small"
             ondragover="handleDragOver(event)"
             ondragleave="handleDragLeave(event)"
             ondrop="handleDrop(event, '${dateStr}', ${hour})">
            +
        </div>
    `;

    return `<div class="schedule-slot-container">${slotContent}</div>`;
}

// Drag & Drop handlers
function handleDragStart(event, mediaId) {
    event.dataTransfer.setData('mediaId', mediaId);
    event.target.classList.add('dragging');
}

function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

async function handleDrop(event, dateStr, hour) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    const mediaId = event.dataTransfer.getData('mediaId');
    const media = mediaLibrary.find(m => m.MediaID == mediaId);

    if (!media) return;

    // Ask for time (default to the hour of the slot)
    const defaultTime = `${String(hour).padStart(2, '0')}:00`;
    const timeStr = prompt('Başlangıç saati (HH:MM):', defaultTime);
    if (!timeStr) return;

    const duration = media.Duration || parseInt(prompt('Süre (saniye):', '60'));
    if (!duration) return;

    try {
        const startDateTime = `${dateStr} ${timeStr}:00`;
        const endDate = new Date(startDateTime);
        endDate.setSeconds(endDate.getSeconds() + duration);
        const endDateTime = endDate.toISOString().replace('T', ' ').substring(0, 19);

        await api.request('/api/schedule/override', 'POST', {
            StudioID: parseInt(currentStudioId),
            MediaID: parseInt(mediaId),
            StartDateTime: startDateTime,
            EndDateTime: endDateTime
        });

        alert('İçerik eklendi!');
        await loadSchedule();
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

// Context menu
function showContextMenu(event, overrideId) {
    event.preventDefault();

    contextMenuData = scheduleOverrides.find(o => o.OverrideID === overrideId);

    const menu = document.getElementById('context-menu');
    menu.style.display = 'block';
    menu.style.left = event.pageX + 'px';
    menu.style.top = event.pageY + 'px';
}

function editOverride() {
    alert('Edit özelliği yakında eklenecek');
    document.getElementById('context-menu').style.display = 'none';
}

function showMultiplyModal() {
    if (!contextMenuData) return;

    document.getElementById('multiply-override-id').value = contextMenuData.OverrideID;
    document.getElementById('multiply-media-id').value = contextMenuData.MediaID;
    document.getElementById('multiply-duration').value = contextMenuData.MediaDuration || 60;

    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('multiply-start-date').value = today;
    document.getElementById('multiply-end-date').value = today;

    document.getElementById('multiply-modal').style.display = 'flex';
    document.getElementById('context-menu').style.display = 'none';
}

function closeMultiplyModal() {
    document.getElementById('multiply-modal').style.display = 'none';
}

async function handleMultiply(e) {
    e.preventDefault();

    const type = document.querySelector('input[name="multiply-type"]:checked').value;
    const mediaId = parseInt(document.getElementById('multiply-media-id').value);
    const startDate = document.getElementById('multiply-start-date').value;
    const endDate = document.getElementById('multiply-end-date').value;
    const duration = parseInt(document.getElementById('multiply-duration').value);

    const pattern = {
        mediaId,
        studioId: parseInt(currentStudioId),
        type,
        startDate,
        endDate,
        duration
    };

    if (type === 'interval') {
        pattern.timeStart = document.getElementById('multiply-time-start').value;
        pattern.timeEnd = document.getElementById('multiply-time-end').value;
        pattern.intervalMinutes = parseInt(document.getElementById('multiply-interval').value);
    } else {
        // sametime_alldays - use override's original time
        const originalTime = contextMenuData.StartDateTime.substr(11, 5);
        pattern.timeStart = originalTime;
    }

    try {
        const response = await api.request('/api/schedule/override/bulk', 'POST', { pattern });
        alert(response.message || 'İçerik çoğaltıldı!');
        closeMultiplyModal();
        await loadSchedule();
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

async function deleteOverride() {
    if (!contextMenuData) return;

    if (!confirm('Bu içeriği silmek istediğinize emin misiniz?')) return;

    try {
        await api.request(`/api/schedule/override/${contextMenuData.OverrideID}`, 'DELETE');
        alert('İçerik silindi!');
        document.getElementById('context-menu').style.display = 'none';
        await loadSchedule();
    } catch (error) {
        alert('Hata: ' + error.message);
    }
}

// Media upload modal
function showMediaUploadModal() {
    document.getElementById('media-upload-form').reset();
    document.getElementById('file-preview').innerHTML = '';
    document.getElementById('media-upload-modal').style.display = 'flex';
}

function closeMediaUploadModal() {
    document.getElementById('media-upload-modal').style.display = 'none';
}

function handleFilePreview(e) {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    document.getElementById('duration-group').style.display = isVideo ? 'block' : 'none';

    const preview = document.getElementById('file-preview');
    if (file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" style="max-width:200px;border-radius:6px;">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = `<p>📹 ${file.name}</p>`;
    }
}

async function handleMediaUpload(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('file', document.getElementById('media-file').files[0]);
    formData.append('title', document.getElementById('media-title').value);

    const duration = document.getElementById('media-duration').value;
    if (duration) formData.append('duration', duration);

    try {
        const response = await fetch(`${CONFIG.API_URL}/api/media`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: formData
        });

        const data = await response.json();
        if (data.success) {
            alert('Medya yüklendi!');
            closeMediaUploadModal();
            await loadMediaLibrary();
        } else {
            alert('Hata: ' + data.error);
        }
    } catch (error) {
        alert('Yükleme hatası: ' + error.message);
    }
}
