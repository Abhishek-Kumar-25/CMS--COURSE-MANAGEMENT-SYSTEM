const SKILLSPROUT_USERS = 'skillspring_users_permanent';
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000;
const REMEMBER_ME_DURATION = 30 * 24 * 60 * 60 * 1000;

// ================= DATABASE =================
function initializeUserDatabase() {
    if (!localStorage.getItem(SKILLSPROUT_USERS)) {
        localStorage.setItem(SKILLSPROUT_USERS, JSON.stringify([]));
    }
}

function getAllRegisteredUsers() {
    initializeUserDatabase();
    return JSON.parse(localStorage.getItem(SKILLSPROUT_USERS)) || [];
}

function findUserByUsernameOrEmail(value) {
    const users = getAllRegisteredUsers();
    value = value.toLowerCase().trim();
    return users.find(u => u.username === value || u.email === value);
}

// ================= UI =================
function showMessage(text, type = 'info') {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = `message ${type}`;
    msg.style.display = 'block';
}

function setLoading(state) {
    const btn = document.getElementById('loginBtn');
    btn.disabled = state;
    btn.querySelector('.spinner').style.display = state ? 'inline-block' : 'none';
}

// ================= LOGIN =================
document.addEventListener('DOMContentLoaded', () => {

    initializeUserDatabase();

    const loginForm = document.getElementById('loginForm');
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    document.getElementById('togglePassword').onclick = () => {
        password.type = password.type === 'password' ? 'text' : 'password';
    };

    loginForm.addEventListener('submit', async e => {
        e.preventDefault();

        if (!username.value || !password.value) {
            showMessage('All fields are required', 'error');
            return;
        }

        setLoading(true);

        await new Promise(r => setTimeout(r, 800));

        const user = findUserByUsernameOrEmail(username.value);

        if (!user || user.password !== password.value) {
            showMessage('Invalid credentials', 'error');
            setLoading(false);
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        showMessage('Login successful! Redirecting...', 'success');

        setTimeout(() => window.location.href = 'dashboard.html', 1500);
    });
});
