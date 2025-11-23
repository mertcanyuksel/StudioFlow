let settings = {};

async function loadSettings() {
    try {
        const response = await api.getAllSettings();
        const settingsArray = response.data || [];

        settings = {};
        settingsArray.forEach(setting => {
            settings[setting.SettingKey] = setting.SettingValue;
        });

        populateSettingsForm();
    } catch (error) {
        console.error('Error loading settings:', error);
        alert('Failed to load settings');
    }
}

function populateSettingsForm() {
    // Display Settings
    document.getElementById('ShowInstructorPhoto').value = settings.ShowInstructorPhoto || 'true';
    document.getElementById('QRCodeSize').value = settings.QRCodeSize || '200';
    document.getElementById('CountdownWarningMinutes').value = settings.CountdownWarningMinutes || '5';

    // Content Settings
    document.getElementById('ShowAdsWhenClassActive').value = settings.ShowAdsWhenClassActive || 'true';
    document.getElementById('AdIntervalMinutes').value = settings.AdIntervalMinutes || '5';
    document.getElementById('AdDurationSeconds').value = settings.AdDurationSeconds || '30';

    // System Settings
    document.getElementById('RefreshIntervalSeconds').value = settings.RefreshIntervalSeconds || '10';
}

document.getElementById('settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedSettings = {
        ShowInstructorPhoto: document.getElementById('ShowInstructorPhoto').value,
        QRCodeSize: document.getElementById('QRCodeSize').value,
        CountdownWarningMinutes: document.getElementById('CountdownWarningMinutes').value,
        ShowAdsWhenClassActive: document.getElementById('ShowAdsWhenClassActive').value,
        AdIntervalMinutes: document.getElementById('AdIntervalMinutes').value,
        AdDurationSeconds: document.getElementById('AdDurationSeconds').value,
        RefreshIntervalSeconds: document.getElementById('RefreshIntervalSeconds').value
    };

    try {
        // Update each setting
        for (const [key, value] of Object.entries(updatedSettings)) {
            await api.updateSetting(key, value);
        }

        alert('Settings saved successfully!');
        await loadSettings();
    } catch (error) {
        alert('Failed to save settings: ' + error.message);
    }
});

// Load settings on page load
window.addEventListener('DOMContentLoaded', loadSettings);
