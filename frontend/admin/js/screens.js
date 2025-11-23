let screens = [];

async function loadScreens() {
    try {
        const response = await api.getAllScreens();
        screens = response.data || [];
        displayScreens();
    } catch (error) {
        console.error('Error loading screens:', error);
        document.getElementById('screens-list').innerHTML = '<p class="error-message">Failed to load screens</p>';
    }
}

function displayScreens() {
    const container = document.getElementById('screens-list');

    if (screens.length === 0) {
        container.innerHTML = '<p>No screens configured.</p>';
        return;
    }

    container.innerHTML = `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:1.5rem;">
            ${screens.map(screen => `
                <div class="screen-card ${screen.IsOnline ? 'online' : 'offline'}">
                    <h3>${screen.ScreenName}</h3>
                    <p><strong>Studio:</strong> ${screen.StudioName}</p>
                    <p><strong>Device Token:</strong> ${screen.DeviceToken}</p>
                    <p><strong>Status:</strong> <span style="color:${screen.IsOnline ? '#27ae60' : '#e74c3c'};font-weight:bold;">${screen.IsOnline ? 'ONLINE' : 'OFFLINE'}</span></p>
                    <p><strong>Last Connected:</strong> ${screen.LastConnected ? new Date(screen.LastConnected).toLocaleString() : 'Never'}</p>
                    <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid #e1e8ed;">
                        <a href="../display/index.html?studio=${screen.StudioID}&token=${screen.DeviceToken}" target="_blank" class="btn btn-primary">Open Display</a>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Load data on page load
window.addEventListener('DOMContentLoaded', loadScreens);

// Auto-refresh every 10 seconds
setInterval(loadScreens, 10000);
