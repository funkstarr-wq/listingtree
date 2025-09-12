// API Base URL
const API_BASE_URL = window.location.origin;

// DOM Elements
let loginModal, registerModal, addListingModal, editListingModal;
let loginForm, registerForm, addListingForm, editListingForm;
let loginBtn, registerBtn, addListingBtn;
let dashboardSection, dashboardContent;
let loginError, registerError, listingError, editListingError;
let switchToRegister, switchToLogin, logoutBtn;
let userWelcome, userName, authButtons, heroBtn;

// Initialize the application
function initApp() {
    // Get DOM elements
    loginModal = document.getElementById('loginModal');
    registerModal = document.getElementById('registerModal');
    addListingModal = document.getElementById('addListingModal');
    editListingModal = document.getElementById('editListingModal');
    loginForm = document.getElementById('loginForm');
    registerForm = document.getElementById('registerForm');
    addListingForm = document.getElementById('addListingForm');
    editListingForm = document.getElementById('editListingForm');
    loginBtn = document.getElementById('loginBtn');
    registerBtn = document.getElementById('registerBtn');
    addListingBtn = document.getElementById('addListingBtn');
    dashboardSection = document.getElementById('dashboardSection');
    dashboardContent = document.getElementById('dashboardContent');
    loginError = document.getElementById('loginError');
    registerError = document.getElementById('registerError');
    listingError = document.getElementById('listingError');
    editListingError = document.getElementById('editListingError');
    switchToRegister = document.getElementById('switchToRegister');
    switchToLogin = document.getElementById('switchToLogin');
    logoutBtn = document.getElementById('logoutBtn');
    userWelcome = document.getElementById('userWelcome');
    userName = document.getElementById('userName');
    authButtons = document.getElementById('authButtons');
    heroBtn = document.getElementById('heroBtn');

    // Check if user is already logged in
    checkAuthStatus();
    
    // Add event listeners to buttons
    if (loginBtn) loginBtn.addEventListener('click', () => showModal(loginModal));
    if (registerBtn) registerBtn.addEventListener('click', () => showModal(registerModal));
    if (addListingBtn) addListingBtn.addEventListener('click', () => showModal(addListingModal));
    if (switchToRegister) switchToRegister.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllModals();
        showModal(registerModal);
    });
    if (switchToLogin) switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllModals();
        showModal(loginModal);
    });
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (heroBtn) heroBtn.addEventListener('click', () => showModal(registerModal));
    
    // Form submissions
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    if (addListingForm) addListingForm.addEventListener('submit', handleAddListing);
    if (editListingForm) editListingForm.addEventListener('submit', handleEditListing);
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideAllModals();
            }
        });
    });
    
    // Close modals with close button
    document.querySelectorAll('.close-modal').forEach(button => {
        button.addEventListener('click', hideAllModals);
    });
}

// Functions
function showModal(modal) {
    hideAllModals();
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function hideAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Check authentication status
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
        try {
            const user = JSON.parse(userData);
            showAuthenticatedUI(user);
        } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('token');
            localStorage.removeItem('userData');
            showUnauthenticatedUI();
        }
    } else {
        showUnauthenticatedUI();
    }
}

// Show UI for authenticated users
function showAuthenticatedUI(user) {
    if (userWelcome && userName && authButtons) {
        userName.textContent = user.name;
        userWelcome.style.display = 'flex';
        authButtons.style.display = 'none';
    }
    if (dashboardSection) {
        dashboardSection.style.display = 'block';
        loadUserListings();
    }
}

// Show UI for unauthenticated users
function showUnauthenticatedUI() {
    if (userWelcome && authButtons) {
        userWelcome.style.display = 'none';
        authButtons.style.display = 'flex';
    }
    if (dashboardSection) {
        dashboardSection.style.display = 'none';
    }
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify({
                id: data._id,
                name: data.name,
                email: data.email,
                userType: data.userType
            }));
            
            // Update UI
            showAuthenticatedUI(data);
            
            // Hide modal and clear form
            hideAllModals();
            loginForm.reset();
        } else {
            showError(loginError, data.message || 'Login failed');
        }
    } catch (error) {
        showError(loginError, 'Login error. Please try again.');
        console.error('Login error:', error);
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.getElementById('registerUserType').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, userType })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify({
                id: data._id,
                name: data.name,
                email: data.email,
                userType: data.userType
            }));
            
            // Update UI
            showAuthenticatedUI(data);
            
            // Hide modal and clear form
            hideAllModals();
            registerForm.reset();
            
            // Show success message
            alert('Registration successful! Welcome to ServiceHub.');
        } else {
            // Handle validation errors
            if (data.errors) {
                const errorMsg = data.errors.map(error => error.msg).join(', ');
                showError(registerError, errorMsg);
            } else {
                showError(registerError, data.message || 'Registration failed');
            }
        }
    } catch (error) {
        showError(registerError, 'Registration error. Please try again.');
        console.error('Registration error:', error);
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    showUnauthenticatedUI();
    alert('You have been logged out successfully.');
}

// Handle add listing
async function handleAddListing(e) {
    e.preventDefault();
    
    const title = document.getElementById('listingTitle').value;
    const category = document.getElementById('listingCategory').value;
    const description = document.getElementById('listingDescription').value;
    const price = document.getElementById('listingPrice').value;
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        showError(listingError, 'Please log in to create listings');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/listings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, category, description, price })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Clear form and close modal
            addListingForm.reset();
            hideAllModals();
            
            // Reload listings
            loadUserListings();
            
            // Show success message
            alert('Listing created successfully!');
        } else {
            showError(listingError, data.message || 'Error creating listing');
        }
    } catch (error) {
        showError(listingError, 'Error creating listing. Please try again.');
        console.error('Error:', error);
    }
}

// Handle edit listing
async function handleEditListing(e) {
    e.preventDefault();
    
    const id = document.getElementById('editListingId').value;
    const title = document.getElementById('editListingTitle').value;
    const category = document.getElementById('editListingCategory').value;
    const description = document.getElementById('editListingDescription').value;
    const price = document.getElementById('editListingPrice').value;
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, category, description, price })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Close modal and reload listings
            hideAllModals();
            loadUserListings();
            
            // Show success message
            alert('Listing updated successfully!');
        } else {
            showError(editListingError, data.message || 'Error updating listing');
        }
    } catch (error) {
        showError(editListingError, 'Error updating listing. Please try again.');
