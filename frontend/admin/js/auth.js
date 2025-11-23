// Check if user is authenticated
async function checkAuth() {
    const token = localStorage.getItem('auth_token');
    const path = window.location.pathname;
    const isLoginPage = path.endsWith('index.html') || path.endsWith('/admin/') || path.endsWith('/admin') || path === '/';

    if (!token) {
        if (!isLoginPage) {
            window.location.href = '/admin/';
        }
        return false;
    }

    try {
        await api.verifyToken();
        return true;
    } catch (error) {
        localStorage.removeItem('auth_token');
        if (!isLoginPage) {
            window.location.href = '/admin/';
        }
        return false;
    }
}

// Login form handler
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('error-message');

        try {
            const response = await api.login(username, password);

            if (response.success) {
                api.setToken(response.data.token);
                window.location.href = 'dashboard';
            } else {
                errorMessage.textContent = response.error || 'Login failed';
                errorMessage.style.display = 'block';
            }
        } catch (error) {
            errorMessage.textContent = error.message || 'Login failed';
            errorMessage.style.display = 'block';
        }
    });
}

// Logout handler
if (document.getElementById('logout-btn')) {
    document.getElementById('logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        api.clearToken();
        window.location.href = '/admin/';
    });
}

// Check auth on protected pages
const path = window.location.pathname;
const isLoginPage = path.endsWith('index.html') || path.endsWith('/admin/') || path.endsWith('/admin') || path === '/';
if (!isLoginPage) {
    checkAuth();
}
