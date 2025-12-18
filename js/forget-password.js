// DOM Elements
const forgotForm = document.getElementById('forgotForm');
const emailForm = document.getElementById('emailForm');
const supportForm = document.getElementById('supportForm');
const emailInput = document.getElementById('email');
const supportEmailInput = document.getElementById('supportEmail');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const supportSubmitBtn = document.getElementById('supportSubmitBtn');
const btnText = document.getElementById('btnText');
const supportBtnText = document.getElementById('supportBtnText');
const spinner = document.getElementById('spinner');
const supportSpinner = document.getElementById('supportSpinner');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const successState = document.getElementById('successState');
const supportSuccessState = document.getElementById('supportSuccessState');
const sentEmail = document.getElementById('sentEmail');
const supportContactEmail = document.getElementById('supportContactEmail');
const resendTimer = document.getElementById('resendTimer');
const timerDisplay = document.getElementById('timer');
const resendBtn = document.getElementById('resendBtn');
const backToLoginBtn = document.getElementById('backToLoginBtn');
const backToLoginBtn2 = document.getElementById('backToLoginBtn2');
const newTicketBtn = document.getElementById('newTicketBtn');
const errorText = document.getElementById('errorText');
const successText = document.getElementById('successText');
const emailTab = document.getElementById('emailTab');
const supportTab = document.getElementById('supportTab');
const ticketId = document.getElementById('ticketId');
const submitTime = document.getElementById('submitTime');
const successTitle = document.getElementById('successTitle');
const successMessageText = document.getElementById('successMessageText');
const successInstructions = document.getElementById('successInstructions');

// State variables
let timer = 120; // 2 minutes in seconds
let timerInterval = null;
let canResend = false;
let currentTab = 'email';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tab Switching
emailTab.addEventListener('click', () => switchTab('email'));
supportTab.addEventListener('click', () => switchTab('support'));

function switchTab(tab) {
    currentTab = tab;
    
    // Update active tab
    emailTab.classList.toggle('active', tab === 'email');
    supportTab.classList.toggle('active', tab === 'support');
    
    // Show/hide forms
    emailForm.classList.toggle('active', tab === 'email');
    supportForm.classList.toggle('active', tab === 'support');
    
    // Clear messages
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');
    
    // Reset focus
    if (tab === 'email') {
        emailInput.focus();
    } else {
        supportEmailInput.focus();
    }
}

// Email Form submission handler
emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    // Validate email
    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    // Start loading state
    setLoading(true, 'email');
    
    // Simulate API call
    setTimeout(() => {
        handleResetRequest(email);
    }, 1500);
});

// Support Form submission handler
supportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = supportEmailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();
    
    // Validate inputs
    if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
    }
    
    if (!subject) {
        showError('Please enter a subject for your support request');
        return;
    }
    
    if (!message || message.length < 10) {
        showError('Please provide a detailed message (at least 10 characters)');
        return;
    }
    
    // Start loading state
    setLoading(true, 'support');
    
    // Simulate API call
    setTimeout(() => {
        handleSupportRequest(email, subject, message);
    }, 1500);
});

// Email validation function
function validateEmail(email) {
    if (!email) {
        showError('Email address is required');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showError('Please enter a valid email address (e.g., name@example.com)');
        return false;
    }
    
    return true;
}

// Handle reset request
function handleResetRequest(email) {
    // In a real app, you would make an API call here
    const isSuccess = Math.random() > 0.1;
    
    setLoading(false, 'email');
    
    if (isSuccess) {
        // Show success state
        showSuccessState(email);
        
        // Start resend timer
        startResendTimer();
    } else {
        // Show error
        showError('Failed to send reset link. Please try again later or contact support.');
    }
}

// Handle support request
function handleSupportRequest(email, subject, message) {
    // In a real app, you would make an API call here
    const isSuccess = Math.random() > 0.05;
    
    setLoading(false, 'support');
    
    if (isSuccess) {
        // Show support success state
        showSupportSuccessState(email);
    } else {
        // Show error
        showError('Failed to submit support request. Please try again or call our support hotline.');
    }
}

// Show error message
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.add('show');
    successMessage.classList.remove('show');
    
    // Scroll to error message
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove error after 5 seconds
    setTimeout(() => {
        errorMessage.classList.remove('show');
    }, 5000);
}

// Show success state for email reset
function showSuccessState(email) {
    // Hide forms and show success state
    emailForm.style.display = 'none';
    supportForm.style.display = 'none';
    document.querySelector('.option-selector').style.display = 'none';
    successState.classList.add('show');
    supportSuccessState.classList.remove('show');
    sentEmail.textContent = email;
    
    // Update success text
    successTitle.textContent = 'Check Your Email!';
    successMessageText.textContent = "We've sent password reset instructions to:";
    successInstructions.textContent = 'The link will expire in 30 minutes. If you don\'t see the email, check your spam folder.';
    
    // Show success message briefly
    successText.textContent = 'Reset link sent successfully!';
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Show success state for support request
function showSupportSuccessState(email) {
    // Hide forms and show success state
    emailForm.style.display = 'none';
    supportForm.style.display = 'none';
    document.querySelector('.option-selector').style.display = 'none';
    supportSuccessState.classList.add('show');
    successState.classList.remove('show');
    supportContactEmail.textContent = email;
    
    // Generate ticket ID and timestamp
    const ticketNumber = 'LRN-' + new Date().getFullYear() + '-' + 
        Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    ticketId.textContent = ticketNumber;
    submitTime.textContent = 'Just now';
    
    // Show success message briefly
    successText.textContent = 'Support ticket created successfully!';
    successMessage.classList.add('show');
    
    setTimeout(() => {
        successMessage.classList.remove('show');
    }, 3000);
}

// Set loading state
function setLoading(isLoading, formType) {
    if (formType === 'email') {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            spinner.style.display = 'block';
            emailInput.disabled = true;
        } else {
            submitBtn.disabled = false;
            btnText.textContent = 'Send Reset Link';
            spinner.style.display = 'none';
            emailInput.disabled = false;
        }
    } else {
        if (isLoading) {
            supportSubmitBtn.disabled = true;
            supportBtnText.textContent = 'Submitting...';
            supportSpinner.style.display = 'block';
            supportEmailInput.disabled = true;
            subjectInput.disabled = true;
            messageInput.disabled = true;
        } else {
            supportSubmitBtn.disabled = false;
            supportBtnText.textContent = 'Contact Support';
            supportSpinner.style.display = 'none';
            supportEmailInput.disabled = false;
            subjectInput.disabled = false;
            messageInput.disabled = false;
        }
    }
}

// Start resend timer
function startResendTimer() {
    timer = 120; // Reset to 2 minutes
    updateTimerDisplay();
    resendBtn.disabled = true;
    canResend = false;
    
    // Clear existing interval
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Start new interval
    timerInterval = setInterval(() => {
        timer--;
        updateTimerDisplay();
        
        if (timer <= 0) {
            clearInterval(timerInterval);
            resendBtn.disabled = false;
            canResend = true;
            resendBtn.innerHTML = '<i class="fas fa-redo"></i> Resend Email';
            resendTimer.innerHTML = '<div class="timer-text">You can now resend the email</div>';
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Resend button handler
resendBtn.addEventListener('click', () => {
    if (!canResend) return;
    
    const email = sentEmail.textContent;
    resendBtn.disabled = true;
    resendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Resending...';
    
    // Simulate resend request
    setTimeout(() => {
        startResendTimer();
        
        // Show success message
        successText.textContent = 'Reset link resent successfully!';
        successMessage.classList.add('show');
        
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    }, 1000);
});

// Back to login buttons
backToLoginBtn.addEventListener('click', () => {
    window.location.href = 'login.html';
});

backToLoginBtn2.addEventListener('click', () => {
    window.location.href = 'login.html';
});

// New ticket button
newTicketBtn.addEventListener('click', () => {
    // Reset to support form
    supportSuccessState.classList.remove('show');
    document.querySelector('.option-selector').style.display = 'block';
    supportForm.style.display = 'block';
    emailForm.style.display = 'none';
    
    // Switch to support tab
    switchTab('support');
    
    // Clear form
    supportForm.reset();
});

// Email input validation on blur
emailInput.addEventListener('blur', () => {
    if (emailInput.value.trim()) {
        validateEmail(emailInput.value.trim());
    }
});

supportEmailInput.addEventListener('blur', () => {
    if (supportEmailInput.value.trim()) {
        validateEmail(supportEmailInput.value.trim());
    }
});

// Clear error on input
const inputs = [emailInput, supportEmailInput, subjectInput, messageInput];
inputs.forEach(input => {
    input.addEventListener('input', () => {
        errorMessage.classList.remove('show');
    });
});

// Demo email suggestions (for testing)
emailInput.addEventListener('focus', () => {
    if (!emailInput.value) {
        emailInput.placeholder = 'e.g., alex@example.com';
    }
});

supportEmailInput.addEventListener('focus', () => {
    if (!supportEmailInput.value) {
        supportEmailInput.placeholder = 'e.g., alex@example.com';
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+Enter to submit current form
    if (e.ctrlKey && e.key === 'Enter') {
        if (currentTab === 'email') {
            emailForm.requestSubmit();
        } else {
            supportForm.requestSubmit();
        }
    }
    
    // Escape to clear
    if (e.key === 'Escape') {
        if (currentTab === 'email') {
            emailInput.value = '';
        } else {
            supportForm.reset();
        }
        errorMessage.classList.remove('show');
    }
    
    // Tab switching with numbers
    if (e.key === '1' && e.ctrlKey) {
        switchTab('email');
        e.preventDefault();
    }
    if (e.key === '2' && e.ctrlKey) {
        switchTab('support');
        e.preventDefault();
    }
});

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    // Check if email is passed via URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const demoEmail = urlParams.get('demoEmail');
    
    if (demoEmail) {
        emailInput.value = demoEmail;
        supportEmailInput.value = demoEmail;
    }
    
    // Focus email input
    emailInput.focus();
    
    // Set initial tab as active
    switchTab('email');
});

// Generate random ticket ID for demo
function generateTicketId() {
    const prefix = 'LRN';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${year}-${random}`;
}