// frontend/script.js (Main entry point)
import { ELEMENT_IDS } from './config.js';
import { getElement } from './modules/utils.js';
import { initModals, showModal } from './modules/modals.js';
import { checkAuthStatus, handleLogin, handleRegister, handleLogout } from './modules/auth.js';
import { handleAddListing, handleEditListing } from './modules/listings.js';

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('ServiceHub initialized');
    initApp();
});

// Initialize the application
function initApp() {
    // Setup event listeners
    setupEventListeners();
    
    // Initialize modals
    initModals();
    
    // Check if user is already logged in
    checkAuthStatus();
}

// Setup all event listeners
function setupEventListeners() {
    // Login button
    const loginBtn = getElement(ELEMENT_IDS.LOGIN_BTN);
    if (loginBtn) {
        loginBtn.addEventListener('click', () => showModal(ELEMENT_IDS.LOGIN_MODAL));
    }
    
    // Register button
    const registerBtn = getElement(ELEMENT_IDS.REGISTER_BTN);
    if (registerBtn) {
        registerBtn.addEventListener('click', () => showModal(ELEMENT_IDS.REGISTER_MODAL));
    }
    
    // Add listing button
    const addListingBtn = getElement(ELEMENT_IDS.ADD_LISTING_BTN);
    if (addListingBtn) {
        addListingBtn.addEventListener('click', () => showModal(ELEMENT_IDS.ADD_LISTING_MODAL));
    }
    
    // Switch to register link
    const switchToRegister = getElement(ELEMENT_IDS.SWITCH_TO_REGISTER);
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            showModal(ELEMENT_IDS.REGISTER_MODAL);
        });
    }
    
    // Switch to login link
    const switchToLogin = getElement(ELEMENT_IDS.SWITCH_TO_LOGIN);
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            showModal(ELEMENT_IDS.LOGIN_MODAL);
        });
    }
    
    // Logout button
    const logoutBtn = getElement(ELEMENT_IDS.LOGOUT_BTN);
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Hero button
    const heroBtn = getElement(ELEMENT_IDS.HERO_BTN);
    if (heroBtn) {
        heroBtn.addEventListener('click', () => showModal(ELEMENT_IDS.REGISTER_MODAL));
    }
    
    // Form submissions
    const loginForm = getElement(ELEMENT_IDS.LOGIN_FORM);
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = getElement(ELEMENT_IDS.REGISTER_FORM);
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    const addListingForm = getElement(ELEMENT_IDS.ADD_LISTING_FORM);
    if (addListingForm) {
        addListingForm.addEventListener('submit', handleAddListing);
    }
    
    const editListingForm = getElement(ELEMENT_IDS.EDIT_LISTING_FORM);
    if (editListingForm) {
        editListingForm.addEventListener('submit', handleEditListing);
    }
    
    console.log('Event listeners setup complete');
}
