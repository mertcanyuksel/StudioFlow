let instructors = [];
let editingInstructorId = null;

async function loadInstructors() {
    try {
        const response = await api.getAllInstructors();
        instructors = response.data || [];
        displayInstructors();
    } catch (error) {
        console.error('Error loading instructors:', error);
        document.getElementById('instructors-grid').innerHTML = '<p class="error-message">Failed to load instructors</p>';
    }
}

function displayInstructors() {
    const container = document.getElementById('instructors-grid');

    if (instructors.length === 0) {
        container.innerHTML = '<p>No instructors found. Add your first instructor!</p>';
        return;
    }

    container.innerHTML = instructors.map(instructor => {
        const photoUrl = instructor.PhotoPath
            ? `${CONFIG.API_URL}/uploads${instructor.PhotoPath}`
            : `${CONFIG.API_URL}/uploads/instructors/default-instructor.jpg`;

        return `
            <div class="instructor-card">
                <img src="${photoUrl}"
                     alt="${instructor.InstructorName}"
                     class="instructor-photo"
                     onerror="this.src='${CONFIG.API_URL}/uploads/instructors/default-instructor.jpg'">
                <h3>${instructor.InstructorName}</h3>
                <p><strong>Email:</strong> ${instructor.Email}</p>
                <p><strong>Phone:</strong> ${instructor.Phone || 'N/A'}</p>
                <p>${instructor.Bio || ''}</p>
                <div style="margin-top:1rem;display:flex;gap:0.5rem;">
                    <button class="btn btn-secondary" onclick="editInstructor(${instructor.InstructorID})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteInstructor(${instructor.InstructorID})">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

function showAddInstructorModal() {
    editingInstructorId = null;
    document.getElementById('modal-title').textContent = 'Add Instructor';
    document.getElementById('instructor-form').reset();
    document.getElementById('instructor-id').value = '';
    document.getElementById('photo-preview').innerHTML = '';
    document.getElementById('instructor-modal').style.display = 'flex';
}

function editInstructor(id) {
    const instructor = instructors.find(i => i.InstructorID === id);
    if (!instructor) return;

    editingInstructorId = id;
    document.getElementById('modal-title').textContent = 'Edit Instructor';
    document.getElementById('instructor-id').value = instructor.InstructorID;
    document.getElementById('instructor-name').value = instructor.InstructorName;
    document.getElementById('email').value = instructor.Email;
    document.getElementById('phone').value = instructor.Phone || '';
    document.getElementById('bio').value = instructor.Bio || '';

    const preview = document.getElementById('photo-preview');
    if (instructor.PhotoPath) {
        preview.innerHTML = `<img src="${CONFIG.API_URL}/uploads${instructor.PhotoPath}" style="max-width:200px;border-radius:8px;" onerror="this.src='${CONFIG.API_URL}/uploads/instructors/default-instructor.jpg'">`;
    } else {
        preview.innerHTML = `<img src="${CONFIG.API_URL}/uploads/instructors/default-instructor.jpg" style="max-width:200px;border-radius:8px;">`;
    }

    document.getElementById('instructor-modal').style.display = 'flex';
}

async function deleteInstructor(id) {
    if (!confirm('Are you sure you want to delete this instructor?')) return;

    try {
        await api.deleteInstructor(id);
        await loadInstructors();
        alert('Instructor deleted successfully!');
    } catch (error) {
        alert('Failed to delete instructor: ' + error.message);
    }
}

function closeInstructorModal() {
    document.getElementById('instructor-modal').style.display = 'none';
}

document.getElementById('instructor-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const instructorData = {
        InstructorName: document.getElementById('instructor-name').value,
        Email: document.getElementById('email').value,
        Phone: document.getElementById('phone').value,
        Bio: document.getElementById('bio').value
    };

    try {
        let instructorId = editingInstructorId;

        if (editingInstructorId) {
            await api.updateInstructor(editingInstructorId, instructorData);
        } else {
            const response = await api.createInstructor(instructorData);
            instructorId = response.data.InstructorID;
        }

        // Upload photo if selected
        const photoInput = document.getElementById('photo');
        if (photoInput.files.length > 0) {
            const formData = new FormData();
            formData.append('photo', photoInput.files[0]);
            await api.uploadInstructorPhoto(instructorId, formData);
        }

        alert(editingInstructorId ? 'Instructor updated successfully!' : 'Instructor created successfully!');
        closeInstructorModal();
        await loadInstructors();
    } catch (error) {
        alert('Failed to save instructor: ' + error.message);
    }
});

// Photo preview
document.getElementById('photo').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('photo-preview').innerHTML =
                `<img src="${e.target.result}" style="max-width:200px;border-radius:8px;">`;
        };
        reader.readAsDataURL(file);
    }
});

// Load data on page load
window.addEventListener('DOMContentLoaded', loadInstructors);
