let contents = [];

async function loadContents() {
    try {
        const response = await api.getAllContents();
        contents = response.data || [];
        displayContents();
    } catch (error) {
        console.error('Error loading contents:', error);
        document.getElementById('contents-grid').innerHTML = '<p class="error-message">Failed to load contents</p>';
    }
}

function displayContents() {
    const container = document.getElementById('contents-grid');

    if (contents.length === 0) {
        container.innerHTML = '<p>No content found. Upload your first content!</p>';
        return;
    }

    container.innerHTML = contents.map(content => `
        <div class="content-card">
            ${content.ContentType === 'image' ?
                `<img src="${CONFIG.UPLOADS_URL + content.FilePath}" style="width:100%;height:200px;object-fit:cover;border-radius:8px;margin-bottom:1rem;" onerror="this.src='../assets/images/placeholder.jpg'">` :
                `<div style="width:100%;height:200px;background:#333;border-radius:8px;margin-bottom:1rem;display:flex;align-items:center;justify-content:center;color:white;font-size:3rem;">🎥</div>`
            }
            <h3>${content.Title}</h3>
            <p><strong>Type:</strong> ${content.ContentType}</p>
            <p><strong>Duration:</strong> ${content.Duration}s</p>
            <p><strong>Priority:</strong> ${content.Priority}</p>
            <p><strong>Status:</strong> ${content.IsActive ? 'Active' : 'Inactive'}</p>
            <div style="margin-top:1rem;">
                <button class="btn btn-danger" onclick="deleteContent(${content.ContentID})">Delete</button>
            </div>
        </div>
    `).join('');
}

function showUploadContentModal() {
    document.getElementById('content-form').reset();
    document.getElementById('content-modal').style.display = 'flex';
}

async function deleteContent(id) {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
        await api.deleteContent(id);
        await loadContents();
        alert('Content deleted successfully!');
    } catch (error) {
        alert('Failed to delete content: ' + error.message);
    }
}

function closeContentModal() {
    document.getElementById('content-modal').style.display = 'none';
}

document.getElementById('content-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('content-file');
    if (!fileInput.files.length) {
        alert('Please select a file');
        return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('title', document.getElementById('content-title').value);
    formData.append('duration', document.getElementById('duration').value);
    formData.append('priority', document.getElementById('priority').value);

    try {
        await api.uploadContent(formData);
        alert('Content uploaded successfully!');
        closeContentModal();
        await loadContents();
    } catch (error) {
        alert('Failed to upload content: ' + error.message);
    }
});

// Load data on page load
window.addEventListener('DOMContentLoaded', loadContents);
