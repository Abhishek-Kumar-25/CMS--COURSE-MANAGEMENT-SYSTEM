const SKILLSPROUT_USERS = 'skillspring_users_permanent';

function initializeUserDatabase() {
    if (!localStorage.getItem(SKILLSPROUT_USERS)) {
        localStorage.setItem(SKILLSPROUT_USERS, JSON.stringify([]));
    }
}

function getAllRegisteredUsers() {
    initializeUserDatabase();
    return JSON.parse(localStorage.getItem(SKILLSPROUT_USERS)) || [];
}

function isUsernameAvailable(username) {
    return !getAllRegisteredUsers().some(
        u => u.username.toLowerCase() === username.toLowerCase()
    );
}

function isEmailAvailable(email) {
    return !getAllRegisteredUsers().some(
        u => u.email.toLowerCase() === email.toLowerCase()
    );
}

function showMessage(text, type) {
    const msg = document.getElementById('message');
    msg.textContent = text;
    msg.className = `message ${type}`;
    msg.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    initializeUserDatabase();

    const form = document.getElementById('registerForm');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const companionInput = document.getElementById('companionType');
    const usernameStatus = document.getElementById('usernameStatus');

    let selectedCompanion = '';

    document.querySelectorAll('.companion-option').forEach(opt => {
        opt.onclick = () => {
            document.querySelectorAll('.companion-option')
                .forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedCompanion = opt.dataset.value;
            companionInput.value = selectedCompanion;
        };
    });

    username.oninput = () => {
        if (username.value.length < 3) return;
        const ok = isUsernameAvailable(username.value);
        usernameStatus.textContent = ok ? 'Username available' : 'Username taken';
        usernameStatus.className = `username-status ${ok ? 'available' : 'taken'}`;
    };

    password.oninput = () => {
        document.getElementById('lengthReq').classList.toggle('met', password.value.length >= 8);
        document.getElementById('numberReq').classList.toggle('met', /\d/.test(password.value));
    };

    form.onsubmit = e => {
        e.preventDefault();

        if (!isUsernameAvailable(username.value)) {
            showMessage('Username already exists', 'error');
            return;
        }

        const user = {
            id: Date.now(),
            username: username.value,
            email: email.value,
            password: password.value,
            companion: selectedCompanion
        };

        const users = getAllRegisteredUsers();
        users.push(user);
        localStorage.setItem(SKILLSPROUT_USERS, JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(user));

        showMessage('Account created successfully!', 'success');

        setTimeout(() => location.href = 'dashboard.html', 1500);
    };
});
