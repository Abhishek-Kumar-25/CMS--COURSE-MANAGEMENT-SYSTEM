const PROFILE_DATA = 'skillspring_profile_data';

function initializeProfileData() {
    if (!localStorage.getItem(PROFILE_DATA)) {
        const user = JSON.parse(localStorage.getItem('currentUser')) || {};
        localStorage.setItem(PROFILE_DATA, JSON.stringify({
            user: {
                id: user.id || Date.now(),
                displayName: user.username || 'User',
                email: user.email || '',
                avatarInitials: (user.username || 'U')[0].toUpperCase()
            },
            achievements: [],
            activities: [],
            skills: []
        }));
    }
}

function getProfileData() {
    initializeProfileData();
    return JSON.parse(localStorage.getItem(PROFILE_DATA));
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return location.href = 'login.html';

    const data = getProfileData();
    document.getElementById('profileName').textContent = data.user.displayName;
    document.getElementById('profileEmail').textContent = data.user.email;
    document.getElementById('profileAvatar').textContent = data.user.avatarInitials;
    document.getElementById('userAvatar').textContent = data.user.avatarInitials;

    loadActivities();
    loadAchievements();
    loadSkills();
    loadCompanionInfo();
});

/* === FUNCTIONS BELOW SAME AS YOUR ORIGINAL SCRIPT === */
/* loadActivities(), loadAchievements(), loadSkills(), 
   openEditModal(), closeEditModal(), shareProfile(),
   exportData(), logout(), showToast() — paste them here unchanged */
