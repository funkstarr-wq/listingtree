// API Base URL
const API_BASE_URL = window.location.origin;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('ServiceHub initialized');
    initApp();
});

// Initialize the application
function initApp() {
    // Setup event listeners
    setupEventListeners();
    
    // Check if user is already logged in
    checkAuthStatus();
}

// Setup all event listeners
function setupEventListeners() {
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            console.log('Login button clicked');
            showModal('loginModal');
        });
    }
    
    // Register button
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            console.log('Register button clicked');
            showModal('registerModal');
        });
    }
    
    // Add listing button
    const addListingBtn = document.getElementById('addListingBtn');
    if (addListingBtn) {
        addListingBtn.addEventListener('click', function() {
            console.log('Add listing button clicked');
            showModal('addListingModal');
        });
    }
    
    // Switch to register link
    const switchToRegister = document.getElementById('switchToRegister');
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Switch to register clicked');
            hideAllModals();
            showModal('registerModal');
        });
    }
    
    // Switch to login link
    const switchToLogin = document.getElementById('switchToLogin');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Switch to login clicked');
            hideAllModals();
            showModal('loginModal');
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Hero button
    const heroBtn = document.getElementById('heroBtn');
    if (heroBtn) {
        heroBtn.addEventListener('click', function() {
            console.log('Hero button clicked');
            showModal('registerModal');
        });
    }
    
    // Form submissions
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    const addListingForm = document.getElementById('addListingForm');
    if (addListingForm) {
        addListingForm.addEventListener('submit', handleAddListing);
    }
    
    //
