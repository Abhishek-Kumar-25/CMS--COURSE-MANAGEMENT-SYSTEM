// js/admin.js - Admin Panel JavaScript
const SKILLSPROUT_USERS = 'skillspring_users_permanent';
let currentUserDetails = null;
let allUsers = [];
let filteredUsers = [];
let currentPage = 1;
const usersPerPage = 10;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.getElementById('loadingOverlay').style.display = 'none';
        loadUsers();
        setupEventListeners();
    }, 1000);
});

function setupEventListeners() {
    // Search input with debounce
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            filterUsers();
        }, 300);
    });

    // Filter changes
    document.getElementById('companionFilter').addEventListener('change', filterUsers);
    document.getElementById('statusFilter').addEventListener('change', filterUsers);
    document.getElementById('sortFilter').addEventListener('change', filterUsers);

    // Pagination
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));
}

// Get all users from permanent database
function getAllUsers() {
    const usersData = localStorage.getItem(SKILLSPROUT_USERS);
    return usersData ? JSON.parse(usersData) : [];
}

// Load and display users
function loadUsers() {
    allUsers = getAllUsers();
    
    // Get current session for online status
    const currentSession = JSON.parse(localStorage.getItem('currentUser'));
    
    // Update users with online status
    allUsers = allUsers.map(user => {
        const isOnline = currentSession && currentSession.username === user.username;
        const isLocked = user.lockedUntil && new Date(user.lockedUntil) > new Date();
        
        return {
            ...user,
            isOnline,
            isLocked,
            status: isLocked ? 'locked' : (isOnline ? 'active' : 'inactive'),
            lastActive: isOnline ? new Date().toISOString() : user.lastLogin
        };
    });

    updateStats(allUsers);
    filterUsers();
    showToast(`Loaded ${allUsers.length} users from database`, 'success');
}

// Update statistics
function updateStats(users) {
    const stats = {
        total: users.length,
        active: users.filter(u => u.isOnline).length,
        tree: users.filter(u => u.companionType === 'tree').length,
        dragon: users.filter(u => u.companionType === 'dragon').length,
        spirit: users.filter(u => u.companionType === 'spirit').length,
        locked: users.filter(u => u.isLocked).length,
        today: users.filter(u => {
            const joinDate = new Date(u.joined);
            const today = new Date();
            return joinDate.toDateString() === today.toDateString();
        }).length,
        month: users.filter(u => {
            const joinDate = new Date(u.joined);
            const today = new Date();
            return joinDate.getMonth() === today.getMonth() && 
                   joinDate.getFullYear() === today.getFullYear();
        }).length
    };

    const statsHTML = `
        <div class="stat-card">
            <div class="stat-header">
                <div class="stat-icon">
                    <i class="fas fa-users"></i>
                </div>
                <span class="stat-trend trend-up">
                    <i class="fas fa-arrow-up"></i> ${stats.month} this month
                </span>
            </div>
            <div class="stat-value">${stats.total}</div>
            <div class="stat-label">Total Registered Users</div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div class="stat-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                    <i class="fas fa-user-check"></i>
                </div>
                <span class="stat-trend ${stats.active > 0 ? 'trend-up' : 'trend-neutral'}">
                    ${stats.active > 0 ? '<i class="fas fa-arrow-up"></i>' : ''}
                    ${stats.active} online
                </span>
            </div>
            <div class="stat-value">${stats.active}</div>
            <div class="stat-label">Currently Active</div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div class="stat-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                    <i class="fas fa-paw"></i>
                </div>
                <span class="stat-trend trend-neutral">
                    <i class="fas fa-balance-scale"></i>
                </span>
            </div>
            <div class="stat-value">${stats.tree}/${stats.dragon}/${stats.spirit}</div>
            <div class="stat-label">Companion Distribution</div>
        </div>
        <div class="stat-card">
            <div class="stat-header">
                <div class="stat-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                    <i class="fas fa-lock"></i>
                </div>
                <span class="stat-trend ${stats.locked > 0 ? 'trend-down' : 'trend-neutral'}">
                    ${stats.locked > 0 ? '<i class="fas fa-exclamation-triangle"></i>' : ''}
                    ${stats.locked} locked
                </span>
            </div>
            <div class="stat-value">${stats.locked}</div>
            <div class="stat-label">Locked Accounts</div>
        </div>
    `;

    document.getElementById('statsCards').innerHTML = statsHTML;
}

// Filter and sort users
function filterUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const companionFilter = document.getElementById('companionFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    filteredUsers = allUsers.filter(user => {
        const matchesSearch = !searchTerm || 
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            (user.displayName && user.displayName.toLowerCase().includes(searchTerm));

        const matchesCompanion = !companionFilter || user.companionType === companionFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;

        return matchesSearch && matchesCompanion && matchesStatus;
    });

    // Sort users
    switch(sortBy) {
        case 'newest':
            filteredUsers.sort((a, b) => new Date(b.joined) - new Date(a.joined));
            break;
        case 'oldest':
            filteredUsers.sort((a, b) => new Date(a.joined) - new Date(b.joined));
            break;
        case 'name':
            filteredUsers.sort((a, b) => a.username.localeCompare(b.username));
            break;
        case 'email':
            filteredUsers.sort((a, b) => a.email.localeCompare(b.email));
            break;
    }

    currentPage = 1;
    displayUsers();
}

// Display users with pagination
function displayUsers() {
    const usersList = document.getElementById('usersList');
    const noUsersMessage = document.getElementById('noUsersMessage');
    const pagination = document.getElementById('pagination');
    const showingCount = document.getElementById('showingCount');
    const totalCount = document.getElementById('totalCount');

    totalCount.textContent = filteredUsers.length;

    if (filteredUsers.length === 0) {
        usersList.innerHTML = '';
        noUsersMessage.style.display = 'block';
        pagination.style.display = 'none';
        showingCount.textContent = '0';
        return;
    }

    noUsersMessage.style.display = 'none';

    // Pagination logic
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = Math.min(startIndex + usersPerPage, filteredUsers.length);
    const pageUsers = filteredUsers.slice(startIndex, endIndex);

    showingCount.textContent = `${startIndex + 1}-${endIndex}`;

    // Generate users HTML
    let html = '';
    pageUsers.forEach((user, index) => {
        const joinDate = new Date(user.joined);
        const formattedDate = joinDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const lastActive = user.lastActive ? 
            new Date(user.lastActive).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : 'Never';

        html += `
            <tr>
                <td>
                    <div class="user-avatar">
                        <div class="avatar-img ${user.isOnline ? 'online' : 'offline'}">
                            ${user.username.charAt(0).toUpperCase()}
                        </div>
                        <div class="user-info">
                            <h4>${user.username}</h4>
                            <small>Last active: ${lastActive}</small>
                        </div>
                    </div>
                </td>
                <td>${user.email}</td>
                <td>
                    <span class="companion-badge">
                        ${getCompanionEmoji(user.companionType)} ${user.companionType}
                    </span>
                </td>
                <td>
                    <span class="status-badge status-${user.status}">
                        ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                </td>
                <td>${formattedDate}</td>
                <td>
                    <div class="actions">
                        <button class="btn btn-view" onclick="viewUserDetails('${user.username}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-edit" onclick="editUserPrompt('${user.username}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-delete" onclick="deleteUserPrompt('${user.username}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    usersList.innerHTML = html;

    // Update pagination
    if (totalPages > 1) {
        pagination.style.display = 'flex';
        document.getElementById('prevPage').disabled = currentPage === 1;
        document.getElementById('nextPage').disabled = currentPage === totalPages;

        let pageNumbersHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            pageNumbersHTML += `
                <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                    ${i}
                </button>
            `;
        }
        document.getElementById('pageNumbers').innerHTML = pageNumbersHTML;
    } else {
        pagination.style.display = 'none';
    }
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        displayUsers();
    }
}

function goToPage(page) {
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        displayUsers();
    }
}

// View user details in modal
function viewUserDetails(username) {
    const user = allUsers.find(u => u.username === username);
    if (!user) {
        showToast('User not found!', 'error');
        return;
    }

    currentUserDetails = user;

    const detailsHTML = `
        <div class="detail-item">
            <div class="detail-label">Username</div>
            <div class="detail-value">${user.username}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Email</div>
            <div class="detail-value">${user.email}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Display Name</div>
            <div class="detail-value">${user.displayName || user.username}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Learning Companion</div>
            <div class="detail-value">
                ${getCompanionEmoji(user.companionType)} ${user.companionType}
            </div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Account Status</div>
            <div class="detail-value">
                <span class="status-badge status-${user.status}">
                    ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
            </div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Joined Date</div>
            <div class="detail-value">
                ${new Date(user.joined).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Last Login</div>
            <div class="detail-value">
                ${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : 'Never'}
            </div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Account Locked Until</div>
            <div class="detail-value">
                ${user.lockedUntil ? new Date(user.lockedUntil).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }) : 'Not locked'}
            </div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Learning Progress</div>
            <div class="detail-value">
                ${user.progress ? `
                    ${user.progress.courses || 0} courses •
                    ${user.progress.lessons || 0} lessons •
                    ${user.progress.streak || 0} day streak
                ` : 'No progress data'}
            </div>
        </div>
    `;

    document.getElementById('modalTitle').textContent = `User: ${user.username}`;
    document.getElementById('userDetails').innerHTML = detailsHTML;
    document.getElementById('userModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
    currentUserDetails = null;
}

// Edit user
function editUserPrompt(username) {
    const user = allUsers.find(u => u.username === username);
    if (!user) {
        showToast('User not found!', 'error');
        return;
    }

    const newName = prompt('Edit display name (leave empty to keep current):', user.displayName || user.username);
    if (newName === null) return; // User cancelled
    
    if (newName.trim() !== '') {
        // Update user in database
        const users = getAllUsers();
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].displayName = newName.trim();
            localStorage.setItem(SKILLSPROUT_USERS, JSON.stringify(users));
            showToast(`Display name updated for ${user.username}`, 'success');
            loadUsers(); // Refresh
        }
    }
}

// Delete user
function deleteUserPrompt(username) {
    const user = allUsers.find(u => u.username === username);
    if (!user) {
        showToast('User not found!', 'error');
        return;
    }

    if (!confirm(`Are you sure you want to delete user "${username}"?\n\nThis action cannot be undone!`)) {
        return;
    }

    // Remove user from database
    const users = getAllUsers();
    const filtered = users.filter(u => u.id !== user.id);
    localStorage.setItem(SKILLSPROUT_USERS, JSON.stringify(filtered));

    // If this user is currently logged in, clear their session
    const currentSession = JSON.parse(localStorage.getItem('currentUser'));
    if (currentSession && currentSession.username === username) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberToken');
    }

    showToast(`User "${username}" has been deleted`, 'success');
    loadUsers(); // Refresh
}

function editUser() {
    if (!currentUserDetails) return;
    editUserPrompt(currentUserDetails.username);
    closeModal();
}

function deleteUser() {
    if (!currentUserDetails) return;
    deleteUserPrompt(currentUserDetails.username);
    closeModal();
}

// Export users data
function exportUsers() {
    const data = {
        exportDate: new Date().toISOString(),
        totalUsers: allUsers.length,
        users: allUsers
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `skillspring_users_export_${new Date().toISOString().split('T')[0]}.json`);
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${allUsers.length} users to JSON file`, 'success');
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('companionFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('sortFilter').value = 'newest';
    filterUsers();
}

// Utility functions
function getCompanionEmoji(type) {
    const emojis = {
        'tree': '🌳',
        'dragon': '🐉',
        'spirit': '✨'
    };
    return emojis[type] || '👤';
}

// Toast notifications
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toastId = 'toast-' + Date.now();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.id = toastId;
    toast.innerHTML = `
        <div class="toast-icon">
            ${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        const toastElement = document.getElementById(toastId);
        if (toastElement) {
            toastElement.remove();
        }
    }, 5000);
}

// Auto-refresh every 30 seconds
setInterval(() => {
    if (!document.hidden) {
        loadUsers();
    }
}, 30000);