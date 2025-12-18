// js/dashboard.js - Dashboard JavaScript

// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Navigation Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = document.getElementById('scrollTop');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        scrollTop.classList.add('show');
    } else {
        navbar.classList.remove('scrolled');
        scrollTop.classList.remove('show');
    }
});

// Load user data
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (currentUser) {
        updateDashboardUI(currentUser);
        initializeDashboardFeatures();
        loadUserGoals();
        setupEventListeners();
    } else {
        window.location.href = 'login.html';
    }
});

// Update Dashboard UI with User Data
function updateDashboardUI(user) {
    // Update welcome message
    const welcomeMessage = document.getElementById('welcomeMessage');
    const avatarText = document.getElementById('avatarText');
    
    welcomeMessage.textContent = `Welcome back, ${user.username || 'Learner'}! 👋`;
    avatarText.textContent = (user.username || 'U').charAt(0).toUpperCase();
    
    // Update companion based on user's choice
    updateCompanionUI(user.companionType || 'tree');
    
    // Update stats from user progress
    if (user.progress) {
        document.getElementById('learningTime').textContent = formatLearningTime(user.progress.totalHours || 0.75);
        document.getElementById('lessonsCompleted').textContent = user.progress.lessons || 12;
        document.getElementById('achievementsCount').textContent = user.progress.achievements || 5;
        document.getElementById('progressPercentage').textContent = calculateProgress(user.progress) + '%';
        
        // Calculate streak
        const streak = calculateStreak(user.joined);
        document.getElementById('streakDays').textContent = streak;
        
        // Update companion progress
        const companionProgress = calculateCompanionProgress(user.progress);
        document.getElementById('companionProgress').textContent = companionProgress + '%';
    }
}

// Format learning time
function formatLearningTime(hours) {
    const minutes = Math.round(hours * 60);
    if (minutes < 60) {
        return minutes + ' min';
    } else {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
    }
}

// Calculate progress percentage
function calculateProgress(progress) {
    const lessons = progress.lessons || 0;
    const courses = progress.courses || 0;
    const achievements = progress.achievements || 0;
    
    // Weighted average calculation
    const total = (lessons * 0.4) + (courses * 0.4) + (achievements * 0.2);
    return Math.min(Math.round(total * 85 / 12), 100);
}

// Calculate streak
function calculateStreak(joinDate) {
    const join = new Date(joinDate);
    const today = new Date();
    const diffTime = Math.abs(today - join);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.min(diffDays, 7); // Cap at 7 for demo
}

// Calculate companion progress
function calculateCompanionProgress(progress) {
    const totalXP = progress.xp || 0;
    const level = progress.level || 1;
    
    // Each level needs 500 XP
    const currentLevelXP = totalXP - ((level - 1) * 500);
    const progressPercent = Math.min(Math.round((currentLevelXP / 500) * 100), 100);
    return progressPercent;
}

// Update companion UI
function updateCompanionUI(companionType) {
    const companions = {
        'tree': { 
            emoji: '🌳', 
            name: 'Growth Guardian', 
            message: '"Every lesson learned helps me grow stronger. Keep going!"',
            level: 2
        },
        'dragon': { 
            emoji: '🐉', 
            name: 'Dragon Scholar', 
            message: '"Let\'s conquer new knowledge together! Your progress fuels my fire!"',
            level: 3
        },
        'spirit': { 
            emoji: '✨', 
            name: 'Wisdom Spirit', 
            message: '"Your creativity fuels my magic! Keep learning and shining!"',
            level: 1
        }
    };
    
    const companion = companions[companionType] || companions.tree;
    
    document.getElementById('companionAvatar').textContent = companion.emoji;
    document.getElementById('companionName').textContent = companion.name;
    document.getElementById('companionMessage').textContent = companion.message;
    document.getElementById('companionLevel').textContent = companion.level;
}

// Initialize dashboard features
function initializeDashboardFeatures() {
    // Toggle dropdown menu
    const userAvatar = document.getElementById('userAvatar');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (userAvatar && dropdownMenu) {
        userAvatar.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userAvatar.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
            }
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
    }

    // Simulate learning time
    simulateLearningTime();
}

// Setup event listeners
function setupEventListeners() {
    // Goal checkboxes
    document.querySelectorAll('.goal-item').forEach(item => {
        item.addEventListener('click', function() {
            toggleGoal(this);
        });
    });

    // Stat cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', function() {
            const statType = this.querySelector('.stat-info p').textContent.toLowerCase();
            handleStatClick(statType);
        });
    });

    // Course cards
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', function() {
            const courseTitle = this.querySelector('.course-title').textContent;
            handleCourseClick(courseTitle);
        });
    });

    // Action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const action = this.querySelector('.action-text').textContent;
            handleActionClick(action, e);
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl + P for profile
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            goToProfile();
        }
        // Ctrl + D for dashboard (refresh)
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            window.location.reload();
        }
        // Escape to close dropdown
        if (e.key === 'Escape') {
            document.getElementById('dropdownMenu').classList.remove('show');
        }
    });

    // Click animations
    document.addEventListener('click', function(e) {
        if (e.target.closest('.stat-card, .course-card, .action-btn')) {
            const element = e.target.closest('.stat-card, .course-card, .action-btn');
            element.style.transform = 'scale(0.98)';
            setTimeout(() => {
                element.style.transform = '';
            }, 150);
        }
    });

    // Offline detection
    window.addEventListener('online', function() {
        showToast('🎉 You\'re back online!');
    });

    window.addEventListener('offline', function() {
        showToast('⚠️ You\'re offline. Some features may be limited.');
    });
}

// Toggle theme
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.querySelector('#themeToggle i');
    
    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        themeIcon.className = 'fas fa-moon';
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        localStorage.setItem('theme', 'light');
        showToast('Switched to light mode');
    } else {
        body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        localStorage.setItem('theme', 'dark');
        showToast('Switched to dark mode');
    }
}

// Load user goals from localStorage
function loadUserGoals() {
    const savedGoals = JSON.parse(localStorage.getItem('dashboard_goals')) || [
        { text: 'Complete 1 lesson', completed: true },
        { text: 'Spend 30 minutes learning', completed: true },
        { text: 'Practice coding exercise', completed: false },
        { text: 'Review flashcards', completed: false },
        { text: 'Join a study group', completed: false }
    ];
    
    const goalItems = document.querySelectorAll('.goal-item');
    goalItems.forEach((item, index) => {
        const goal = savedGoals[index];
        if (goal) {
            const checkbox = item.querySelector('.goal-checkbox');
            const text = item.querySelector('.goal-text');
            
            if (goal.completed) {
                checkbox.classList.add('checked');
                checkbox.innerHTML = '<i class="fas fa-check"></i>';
                text.classList.add('completed');
            } else {
                checkbox.classList.remove('checked');
                checkbox.innerHTML = '';
                text.classList.remove('completed');
            }
            text.textContent = goal.text;
        }
    });
}

// Toggle goal completion
function toggleGoal(element) {
    const checkbox = element.querySelector('.goal-checkbox');
    const text = element.querySelector('.goal-text');
    const goalText = text.textContent;
    
    if (checkbox.classList.contains('checked')) {
        checkbox.classList.remove('checked');
        checkbox.innerHTML = '';
        text.classList.remove('completed');
        showToast('Goal unchecked');
    } else {
        checkbox.classList.add('checked');
        checkbox.innerHTML = '<i class="fas fa-check"></i>';
        text.classList.add('completed');
        
        // Show celebration for completing goal
        const xpEarned = Math.floor(Math.random() * 20) + 10;
        showToast(`🎉 Goal completed! +${xpEarned} XP earned!`);
        
        // Update user XP
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            user.progress = user.progress || {};
            user.progress.xp = (user.progress.xp || 0) + xpEarned;
            localStorage.setItem('currentUser', JSON.stringify(user));
            updateDashboardUI(user);
        }
    }
    
    // Save goals to localStorage
    saveGoals();
}

// Save goals to localStorage
function saveGoals() {
    const goals = [];
    document.querySelectorAll('.goal-item').forEach(item => {
        const text = item.querySelector('.goal-text').textContent;
        const completed = item.querySelector('.goal-checkbox').classList.contains('checked');
        goals.push({ text, completed });
    });
    localStorage.setItem('dashboard_goals', JSON.stringify(goals));
}

// Simulate learning time
function simulateLearningTime() {
    let minutes = 45;
    const timeElement = document.getElementById('learningTime');
    
    // Only run simulation if element exists
    if (!timeElement) return;
    
    setInterval(() => {
        minutes++;
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user) {
            user.progress = user.progress || {};
            user.progress.totalHours = (user.progress.totalHours || 0) + (1/60); // Add 1 minute
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
        
        timeElement.textContent = formatLearningTime(minutes / 60);
        
        // Every 30 minutes, show encouragement
        if (minutes % 30 === 0) {
            showToast('🎯 You\'re doing great! Keep learning!');
        }
    }, 60000); // Update every minute
}

// Handle stat card clicks
function handleStatClick(statType) {
    switch(statType) {
        case 'time learned today':
            goToProgress();
            break;
        case 'lessons completed':
            goToCourses();
            break;
        case 'achievements unlocked':
            goToAchievements();
            break;
        case 'overall progress':
            goToProgress();
            break;
    }
}

// Handle course card clicks
function handleCourseClick(courseTitle) {
    // Save selected course to localStorage
    localStorage.setItem('selectedCourse', courseTitle);
    
    // Navigate to lesson page
    window.location.href = 'lesson.html';
}

// Handle action button clicks
function handleActionClick(action, e) {
    e.preventDefault();
    switch(action) {
        case 'Browse Courses':
            goToCourses();
            break;
        case 'View Progress':
            goToProgress();
            break;
        case 'Achievements':
            window.location.href = 'achievements.html';
            break;
        case 'My Profile':
            goToProfile();
            break;
    }
}

// Navigation functions
function goToProfile() {
    window.location.href = 'profile.html';
}

function goToSettings() {
    window.location.href = 'settings.html';
}

function goToHelp() {
    window.location.href = 'help.html';
}

function goToProgress() {
    window.location.href = 'progress.html';
}

function goToCourses() {
    window.location.href = 'courses.html';
}

function goToAchievements() {
    window.location.href = 'achievements.html';
}

function continueCourse(courseId) {
    window.location.href = `lesson.html?course=${courseId}`;
}

function startCourse(courseId) {
    window.location.href = `courses.html?enroll=${courseId}`;
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberToken');
        showToast('Successfully logged out!');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Performance optimization: Lazy load images
function lazyLoadImages() {
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img').forEach(img => {
            img.loading = 'lazy';
        });
    }
}

// Initialize lazy loading
lazyLoadImages();