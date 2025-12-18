document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        location.href = 'login.html';
        return;
    }

    document.getElementById('userAvatar').textContent =
        currentUser.username.charAt(0).toUpperCase();

    updateUserStats();
    generateStreakCalendar();
    setupGoals();
    setupContinueButtons();
});

function updateUserStats() {
    const stats = {
        streak: 7,
        lessonsCompleted: 24,
        totalHours: 18.5,
        achievements: 8
    };

    document.getElementById('currentStreak').textContent = stats.streak;
    document.getElementById('lessonsCompleted').textContent = stats.lessonsCompleted;
    document.getElementById('totalHours').textContent = stats.totalHours;
    document.getElementById('achievementsCount').textContent = stats.achievements;
}

function generateStreakCalendar() {
    const calendar = document.getElementById('streakCalendar');
    const today = new Date();

    for (let i = 20; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);

        const div = document.createElement('div');
        div.className = 'calendar-day';

        if (date.toDateString() === today.toDateString()) {
            div.classList.add('current');
        } else if (Math.random() > 0.5) {
            div.classList.add('learned');
        }

        div.textContent = date.getDate();
        calendar.appendChild(div);
    }
}

function setupGoals() {
    document.querySelectorAll('.goal-checkbox').forEach(box => {
        box.addEventListener('click', () => {
            box.classList.toggle('checked');
            const title = box.closest('.goal-item').querySelector('.goal-title');
            title.classList.toggle('completed');
            box.innerHTML = box.classList.contains('checked') ? '✔' : '';
        });
    });
}

function setupContinueButtons() {
    document.querySelectorAll('.continue-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            location.href = 'lesson.html';
        });
    });
}

/* Simulated live update */
setInterval(() => {
    const el = document.getElementById('totalHours');
    if (el) el.textContent = (parseFloat(el.textContent) + 0.1).toFixed(1);
}, 60000);
