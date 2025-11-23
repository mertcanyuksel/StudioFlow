let lessons = [];
let instructors = [];
let editingLessonId = null;

async function loadLessons() {
    try {
        const response = await api.getAllLessons();
        lessons = response.data || [];
        displayLessons();
    } catch (error) {
        console.error('Error loading lessons:', error);
        document.getElementById('lessons-table').innerHTML = '<p class="error-message">Failed to load lessons</p>';
    }
}

async function loadInstructors() {
    try {
        const response = await api.getAllInstructors();
        instructors = response.data || [];
        populateInstructorSelect();
    } catch (error) {
        console.error('Error loading instructors:', error);
    }
}

function displayLessons() {
    const container = document.getElementById('lessons-table');

    if (lessons.length === 0) {
        container.innerHTML = '<p>No lessons found. Create your first lesson!</p>';
        return;
    }

    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Lesson Name</th>
                    <th>Instructor</th>
                    <th>Description</th>
                    <th>Color</th>
                    <th>Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${lessons.map(lesson => `
                    <tr>
                        <td><strong>${lesson.LessonName}</strong></td>
                        <td>${lesson.InstructorName || 'N/A'}</td>
                        <td>${lesson.Description || '-'}</td>
                        <td><span style="display:inline-block;width:30px;height:30px;background:${lesson.DisplayColor};border-radius:4px;"></span></td>
                        <td>${lesson.IsActive ? '✓' : '✗'}</td>
                        <td>
                            <button class="btn btn-secondary" onclick="editLesson(${lesson.LessonID})">Edit</button>
                            <button class="btn btn-danger" onclick="deleteLesson(${lesson.LessonID})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function populateInstructorSelect() {
    const select = document.getElementById('instructor-id');
    select.innerHTML = '<option value="">Select Instructor</option>' +
        instructors.map(inst => `<option value="${inst.InstructorID}">${inst.InstructorName}</option>`).join('');
}

window.showAddLessonModal = function() {
    editingLessonId = null;
    document.getElementById('modal-title').textContent = 'Add Lesson';
    document.getElementById('lesson-form').reset();
    document.getElementById('lesson-id').value = '';
    document.getElementById('lesson-modal').style.display = 'flex';
}

window.editLesson = function(id) {
    console.log('editLesson called with id:', id);
    const lesson = lessons.find(l => l.LessonID === id);
    if (!lesson) {
        console.error('Lesson not found:', id);
        return;
    }

    console.log('Found lesson:', lesson);
    editingLessonId = id;
    document.getElementById('modal-title').textContent = 'Edit Lesson';
    document.getElementById('lesson-id').value = lesson.LessonID;
    document.getElementById('lesson-name').value = lesson.LessonName;
    document.getElementById('instructor-id').value = lesson.InstructorID;
    document.getElementById('description').value = lesson.Description || '';
    document.getElementById('display-color').value = lesson.DisplayColor || '#3b82f6';
    document.getElementById('qr-code-data').value = lesson.QRCodeData || '';

    document.getElementById('lesson-modal').style.display = 'flex';
    console.log('Modal displayed');
}

window.deleteLesson = async function(id) {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
        await api.deleteLesson(id);
        await loadLessons();
        alert('Lesson deleted successfully!');
    } catch (error) {
        alert('Failed to delete lesson: ' + error.message);
    }
}

window.closeLessonModal = function() {
    document.getElementById('lesson-modal').style.display = 'none';
}

document.getElementById('lesson-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const lessonData = {
        LessonName: document.getElementById('lesson-name').value,
        InstructorID: parseInt(document.getElementById('instructor-id').value),
        Description: document.getElementById('description').value,
        DisplayColor: document.getElementById('display-color').value,
        QRCodeData: document.getElementById('qr-code-data').value
    };

    try {
        if (editingLessonId) {
            await api.updateLesson(editingLessonId, lessonData);
            alert('Lesson updated successfully!');
        } else {
            await api.createLesson(lessonData);
            alert('Lesson created successfully!');
        }

        closeLessonModal();
        await loadLessons();
    } catch (error) {
        alert('Failed to save lesson: ' + error.message);
    }
});

// Load data on page load
window.addEventListener('DOMContentLoaded', () => {
    loadLessons();
    loadInstructors();
});
