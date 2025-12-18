// js/community.js - Community Hub JavaScript
const COMMUNITY_DATA = 'skillspring_community_data';
const LIKED_POSTS = 'community_liked_posts';

// Initialize community data
function initializeCommunityData() {
    if (!localStorage.getItem(COMMUNITY_DATA)) {
        const initialData = {
            posts: [],
            groups: [],
            onlineUsers: [],
            trendingTopics: [],
            events: [],
            userJoinedGroups: {}
        };
        localStorage.setItem(COMMUNITY_DATA, JSON.stringify(initialData));
    }
}

// Get community data
function getCommunityData() {
    initializeCommunityData();
    return JSON.parse(localStorage.getItem(COMMUNITY_DATA));
}

// Save community data
function saveCommunityData(data) {
    localStorage.setItem(COMMUNITY_DATA, JSON.stringify(data));
}

// Get liked posts
function getLikedPosts() {
    const liked = localStorage.getItem(LIKED_POSTS);
    return liked ? JSON.parse(liked) : [];
}

// Save liked posts
function saveLikedPosts(likedPosts) {
    localStorage.setItem(LIKED_POSTS, JSON.stringify(likedPosts));
}

// Get current user
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

// Generate sample posts
function generateSamplePosts() {
    const samplePosts = [
        {
            id: 'post_1',
            author: 'Alex Smith',
            avatar: 'AS',
            time: '2 hours ago',
            group: 'Web Development Group',
            content: 'Just finished building my first React application! It\'s a task management app with drag-and-drop functionality. The learning curve was steep but absolutely worth it. Anyone else working on React projects?',
            tags: ['React', 'JavaScript', 'WebDev'],
            likes: 24,
            comments: 8,
            shares: 2
        },
        {
            id: 'post_2',
            author: 'Maria Johnson',
            avatar: 'MJ',
            time: '5 hours ago',
            group: 'Data Science Group',
            content: 'Struggling with data visualization in Python. Which library would you recommend for interactive dashboards: Plotly or Bokeh? Looking for something beginner-friendly but powerful enough for complex datasets.',
            tags: ['Python', 'DataScience', 'DataViz'],
            likes: 18,
            comments: 14,
            shares: 3
        },
        {
            id: 'post_3',
            author: 'Tech Prodigy',
            avatar: 'TP',
            time: '1 day ago',
            group: 'General Discussion',
            content: 'Sharing some resources that helped me learn JavaScript:\n1. MDN Web Docs - Best documentation\n2. freeCodeCamp - Great interactive exercises\n3. JavaScript.info - In-depth tutorials\n\nWhat are your favorite learning resources?',
            tags: ['Resources', 'JavaScript', 'Learning'],
            likes: 42,
            comments: 21,
            shares: 7
        }
    ];

    const sampleGroups = [
        {
            id: 'group_1',
            name: 'Web Development',
            icon: 'fas fa-code',
            color: 'linear-gradient(135deg, var(--primary), var(--accent))',
            members: 324,
            description: 'Discuss HTML, CSS, JavaScript, frameworks, and web development best practices.',
            category: 'web'
        },
        {
            id: 'group_2',
            name: 'Data Science',
            icon: 'fas fa-chart-line',
            color: 'linear-gradient(135deg, #059669, #10b981)',
            members: 187,
            description: 'Python, machine learning, data analysis, and visualization discussions.',
            category: 'data'
        },
        {
            id: 'group_3',
            name: 'UI/UX Design',
            icon: 'fas fa-palette',
            color: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
            members: 156,
            description: 'Design principles, tools, user research, and portfolio reviews.',
            category: 'design'
        }
    ];

    const sampleOnlineUsers = [
        { name: 'Alex Smith', avatar: 'AS', status: 'Learning React' },
        { name: 'Maria Johnson', avatar: 'MJ', status: 'Data Science' },
        { name: 'Rahul Kumar', avatar: 'RK', status: 'Web Development' },
        { name: 'Lisa Chen', avatar: 'LC', status: 'UI/UX Design' }
    ];

    const sampleTopics = [
        { tag: 'React Hooks', posts: 42 },
        { tag: 'Python ML', posts: 38 },
        { tag: 'CSS Grid', posts: 31 },
        { tag: 'Portfolio Tips', posts: 27 },
        { tag: 'Job Interview', posts: 24 }
    ];

    const sampleEvents = [
        {
            title: 'Live Q&A: React Best Practices',
            time: 'Tomorrow, 6:00 PM EST'
        },
        {
            title: 'Python Workshop: Data Analysis',
            time: 'Friday, 3:00 PM EST'
        }
    ];

    const data = getCommunityData();
    
    // Only add sample data if empty
    if (data.posts.length === 0) {
        data.posts = samplePosts;
        data.groups = sampleGroups;
        data.onlineUsers = sampleOnlineUsers;
        data.trendingTopics = sampleTopics;
        data.events = sampleEvents;
        saveCommunityData(data);
    }

    return data;
}

// Load community page
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Set user avatar
    document.getElementById('userAvatar').textContent = currentUser.username.charAt(0).toUpperCase();

    // Load community data
    const communityData = generateSamplePosts();
    loadPosts(communityData.posts);
    loadGroups(communityData.groups);
    loadOnlineMembers(communityData.onlineUsers);
    loadTrendingTopics(communityData.trendingTopics);
    loadUpcomingEvents(communityData.events);

    // New post button functionality
    document.getElementById('newPostBtn').addEventListener('click', function() {
        const postCreate = document.getElementById('postCreate');
        postCreate.style.display = postCreate.style.display === 'none' ? 'block' : 'none';
        
        if (postCreate.style.display === 'block') {
            document.querySelector('.post-input').focus();
        }
    });

    // Post submission
    document.getElementById('submitPost').addEventListener('click', createNewPost);

    // Create group button
    document.getElementById('createGroupBtn').addEventListener('click', function() {
        document.getElementById('createGroupModal').style.display = 'flex';
    });

    // Handle Enter key for post submission
    const postInput = document.querySelector('.post-input');
    if (postInput) {
        postInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && e.ctrlKey) {
                createNewPost();
            }
        });
    }
});

// Load posts
function loadPosts(posts) {
    const postsList = document.getElementById('postsList');
    const likedPosts = getLikedPosts();
    
    if (!postsList) return;
    
    let html = '';

    posts.forEach(post => {
        const isLiked = likedPosts.includes(post.id);
        
        html += `
            <div class="post-card" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-avatar">${post.avatar}</div>
                    <div class="post-author">
                        <div class="author-name">${post.author}</div>
                        <div class="post-time">${post.time} • ${post.group}</div>
                    </div>
                </div>
                
                <div class="post-content">${formatPostContent(post.content)}</div>
                
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="post-tag">#${tag}</span>`).join('')}
                </div>
                
                <div class="post-footer">
                    <div class="post-stats">
                        <div class="post-stat" onclick="handleLike('${post.id}')">
                            <i class="${isLiked ? 'fas' : 'far'} fa-heart" style="${isLiked ? 'color: #ef4444;' : ''}"></i>
                            <span class="like-count">${post.likes}</span>
                        </div>
                        <div class="post-stat">
                            <i class="far fa-comment"></i>
                            ${post.comments}
                        </div>
                        <div class="post-stat">
                            <i class="fas fa-share"></i>
                            ${post.shares}
                        </div>
                    </div>
                    <button class="post-actions-btn">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                </div>
            </div>
        `;
    });

    postsList.innerHTML = html;
}

// Format post content with line breaks
function formatPostContent(content) {
    return content.replace(/\n/g, '<br>');
}

// Load groups
function loadGroups(groups) {
    const groupsGrid = document.getElementById('groupsGrid');
    if (!groupsGrid) return;
    
    const currentUser = getCurrentUser();
    const communityData = getCommunityData();
    const userJoinedGroups = communityData.userJoinedGroups[currentUser.username] || [];

    let html = '';
    
    groups.forEach(group => {
        const isJoined = userJoinedGroups.includes(group.id);
        
        html += `
            <div class="group-card">
                <div class="group-icon" style="background: ${group.color};">
                    <i class="${group.icon}"></i>
                </div>
                <div class="group-name">${group.name}</div>
                <div class="group-members">
                    <i class="fas fa-users"></i>
                    ${group.members} members
                </div>
                <div class="group-description">
                    ${group.description}
                </div>
                <button class="join-btn ${isJoined ? 'joined' : ''}" onclick="toggleGroupJoin('${group.id}')">
                    <i class="fas fa-${isJoined ? 'check' : 'plus'}"></i>
                    ${isJoined ? 'Joined' : 'Join Group'}
                </button>
            </div>
        `;
    });

    groupsGrid.innerHTML = html;
}

// Load online members
function loadOnlineMembers(members) {
    const onlineMembers = document.getElementById('onlineMembers');
    if (!onlineMembers) return;
    
    let html = '';
    
    members.forEach(member => {
        html += `
            <div class="member-item">
                <div class="member-avatar online">${member.avatar}</div>
                <div class="member-info">
                    <div class="member-name">${member.name}</div>
                    <div class="member-status">${member.status}</div>
                </div>
            </div>
        `;
    });

    onlineMembers.innerHTML = html;
}

// Load trending topics
function loadTrendingTopics(topics) {
    const trendingTopics = document.getElementById('trendingTopics');
    if (!trendingTopics) return;
    
    let html = '';
    
    topics.forEach(topic => {
        html += `
            <div class="topic-item" onclick="searchTopic('${topic.tag}')">
                <div class="topic-tag">${topic.tag}</div>
                <div class="topic-stats">${topic.posts} posts</div>
            </div>
        `;
    });

    trendingTopics.innerHTML = html;
}

// Load upcoming events
function loadUpcomingEvents(events) {
    const upcomingEvents = document.getElementById('upcomingEvents');
    if (!upcomingEvents) return;
    
    let html = '';
    
    events.forEach(event => {
        html += `
            <div class="event-item">
                <div class="event-title">${event.title}</div>
                <div class="event-details">
                    <i class="far fa-clock"></i> ${event.time}
                </div>
                <button class="event-join" onclick="rsvpEvent('${event.title}')">RSVP</button>
            </div>
        `;
    });

    upcomingEvents.innerHTML = html;
}

// Create new post
function createNewPost() {
    const postInput = document.querySelector('.post-input');
    if (!postInput) return;
    
    const content = postInput.value.trim();
    
    if (!content) {
        showNotification('Please enter some content for your post!', 'warning');
        return;
    }

    const currentUser = getCurrentUser();
    const communityData = getCommunityData();
    
    const newPost = {
        id: 'post_' + Date.now(),
        author: currentUser.username,
        avatar: currentUser.username.charAt(0).toUpperCase(),
        time: 'Just now',
        group: 'General Discussion',
        content: content,
        tags: extractTags(content),
        likes: 0,
        comments: 0,
        shares: 0
    };

    communityData.posts.unshift(newPost);
    saveCommunityData(communityData);
    
    // Add new post to the top of the feed
    const postsList = document.getElementById('postsList');
    const newPostHTML = `
        <div class="post-card" data-post-id="${newPost.id}">
            <div class="post-header">
                <div class="post-avatar">${newPost.avatar}</div>
                <div class="post-author">
                    <div class="author-name">${newPost.author}</div>
                    <div class="post-time">${newPost.time} • ${newPost.group}</div>
                </div>
            </div>
            
            <div class="post-content">${formatPostContent(newPost.content)}</div>
            
            <div class="post-tags">
                ${newPost.tags.map(tag => `<span class="post-tag">#${tag}</span>`).join('')}
            </div>
            
            <div class="post-footer">
                <div class="post-stats">
                    <div class="post-stat" onclick="handleLike('${newPost.id}')">
                        <i class="far fa-heart"></i>
                        <span class="like-count">${newPost.likes}</span>
                    </div>
                    <div class="post-stat">
                        <i class="far fa-comment"></i>
                        ${newPost.comments}
                    </div>
                    <div class="post-stat">
                        <i class="fas fa-share"></i>
                        ${newPost.shares}
                    </div>
                </div>
                <button class="post-actions-btn">
                    <i class="fas fa-ellipsis-h"></i>
                </button>
            </div>
        </div>
    `;

    postsList.insertAdjacentHTML('afterbegin', newPostHTML);
    postInput.value = '';
    document.getElementById('postCreate').style.display = 'none';
    
    // Show success message
    showNotification('Post published successfully!', 'success');
}

// Extract hashtags from content
function extractTags(content) {
    const hashtags = content.match(/#\w+/g) || [];
    return hashtags.map(tag => tag.substring(1)).slice(0, 3); // Max 3 tags
}

// Handle like functionality
function handleLike(postId) {
    const communityData = getCommunityData();
    const postIndex = communityData.posts.findIndex(post => post.id === postId);
    
    if (postIndex === -1) return;
    
    const likedPosts = getLikedPosts();
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    const likeCountElement = postElement?.querySelector('.like-count');
    const heartIcon = postElement?.querySelector('.fa-heart');
    
    if (!likeCountElement || !heartIcon) return;
    
    if (likedPosts.includes(postId)) {
        // Unlike
        communityData.posts[postIndex].likes -= 1;
        const index = likedPosts.indexOf(postId);
        likedPosts.splice(index, 1);
        heartIcon.classList.remove('fas');
        heartIcon.classList.add('far');
        heartIcon.style.color = '';
    } else {
        // Like
        communityData.posts[postIndex].likes += 1;
        likedPosts.push(postId);
        heartIcon.classList.remove('far');
        heartIcon.classList.add('fas');
        heartIcon.style.color = '#ef4444';
    }
    
    saveCommunityData(communityData);
    saveLikedPosts(likedPosts);
    likeCountElement.textContent = communityData.posts[postIndex].likes;
}

// Toggle group join
function toggleGroupJoin(groupId) {
    const currentUser = getCurrentUser();
    const communityData = getCommunityData();
    const userJoinedGroups = communityData.userJoinedGroups[currentUser.username] || [];
    const groupIndex = userJoinedGroups.indexOf(groupId);
    
    if (groupIndex === -1) {
        // Join group
        userJoinedGroups.push(groupId);
        showNotification('Successfully joined the group!', 'success');
    } else {
        // Leave group
        userJoinedGroups.splice(groupIndex, 1);
        showNotification('Left the group.', 'info');
    }
    
    communityData.userJoinedGroups[currentUser.username] = userJoinedGroups;
    saveCommunityData(communityData);
    
    // Update groups display
    loadGroups(communityData.groups);
}

// Create new group
function createNewGroup() {
    const name = document.getElementById('groupName')?.value.trim();
    const description = document.getElementById('groupDescription')?.value.trim();
    const category = document.getElementById('groupCategory')?.value;
    
    if (!name || !description || !category) {
        alert('Please fill in all fields!');
        return;
    }

    const categoryInfo = {
        web: { icon: 'fas fa-code', color: 'linear-gradient(135deg, var(--primary), var(--accent))' },
        data: { icon: 'fas fa-chart-line', color: 'linear-gradient(135deg, #059669, #10b981)' },
        design: { icon: 'fas fa-palette', color: 'linear-gradient(135deg, #7c3aed, #8b5cf6)' },
        mobile: { icon: 'fas fa-mobile-alt', color: 'linear-gradient(135deg, #f59e0b, #fbbf24)' }
    };

    const newGroup = {
        id: 'group_' + Date.now(),
        name: name,
        icon: categoryInfo[category]?.icon || 'fas fa-users',
        color: categoryInfo[category]?.color || 'linear-gradient(135deg, var(--primary), var(--accent))',
        members: 1, // Creator is the first member
        description: description,
        category: category
    };

    const communityData = getCommunityData();
    communityData.groups.unshift(newGroup);
    saveCommunityData(communityData);
    
    // Close modal and refresh groups
    const modal = document.getElementById('createGroupModal');
    if (modal) modal.style.display = 'none';
    
    document.getElementById('groupName').value = '';
    document.getElementById('groupDescription').value = '';
    document.getElementById('groupCategory').value = '';
    
    loadGroups(communityData.groups);
    showNotification('Study group created successfully!', 'success');
}

// Search topic
function searchTopic(tag) {
    const postInput = document.querySelector('.post-input');
    if (postInput) {
        postInput.value = `#${tag} `;
        document.getElementById('postCreate').style.display = 'block';
        postInput.focus();
    }
}

// RSVP event
function rsvpEvent(eventTitle) {
    const currentUser = getCurrentUser();
    showNotification(`You have RSVP'd for "${eventTitle}"`, 'success');
}

// Show notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(notificationStyle);