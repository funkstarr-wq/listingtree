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
        console.error('Error:', error);
    }
}

// Load User Listings
async function loadUserListings() {
    const token = localStorage.getItem('token');
    
    if (!token || !dashboardContent) {
        if (dashboardContent) {
            dashboardContent.innerHTML = '<p>Please log in to view your listings.</p>';
        }
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/listings/user/my-listings`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const listings = await response.json();
            displayListings(listings);
        } else {
            dashboardContent.innerHTML = '<p>Error loading your listings. Please try again.</p>';
        }
    } catch (error) {
        console.error('Error loading listings:', error);
        dashboardContent.innerHTML = '<p>Error loading your listings. Please try again.</p>';
    }
}

// Display Listings
function displayListings(listings) {
    if (!dashboardContent) return;
    
    if (listings.length === 0) {
        dashboardContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-clipboard-list" style="font-size: 60px; color: #ddd; margin-bottom: 20px;"></i>
                <h3>No Listings Yet</h3>
                <p>Get started by adding your first service listing!</p>
                <button class="btn btn-primary" id="addFirstListingBtn">Add Your First Listing</button>
            </div>
        `;
        
        const addFirstListingBtn = document.getElementById('addFirstListingBtn');
        if (addFirstListingBtn) {
            addFirstListingBtn.addEventListener('click', () => {
                showModal(addListingModal);
            });
        }
        
        return;
    }
    
    dashboardContent.innerHTML = `
        <div class="listings-grid">
            ${listings.map(listing => `
                <div class="listing-card" data-id="${listing._id}">
                    <div class="listing-header">
                        <h3>${listing.title}</h3>
                        <span class="listing-price">£${listing.price}</span>
                    </div>
                    <div class="listing-category">${listing.category}</div>
                    <p class="listing-description">${listing.description}</p>
                    <div class="listing-footer">
                        <span class="listing-date">Posted: ${new Date(listing.createdAt).toLocaleDateString()}</span>
                        <div class="listing-actions">
                            <button class="btn btn-outline edit-listing-btn" data-id="${listing._id}">Edit</button>
                            <button class="btn btn-danger delete-listing-btn" data-id="${listing._id}">Delete</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add event listeners to action buttons
    document.querySelectorAll('.edit-listing-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            editListing(id);
        });
    });
    
    document.querySelectorAll('.delete-listing-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            deleteListing(id);
        });
    });
}

// Edit Listing
async function editListing(id) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const listing = await response.json();
            
            // Populate edit form
            document.getElementById('editListingId').value = listing._id;
            document.getElementById('editListingTitle').value = listing.title;
            document.getElementById('editListingCategory').value = listing.category;
            document.getElementById('editListingDescription').value = listing.description;
            document.getElementById('editListingPrice').value = listing.price;
            
            // Show edit modal
            showModal(editListingModal);
        } else {
            alert('Error loading listing details');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading listing details');
    }
}

// Delete Listing
async function deleteListing(id) {
    if (!confirm('Are you sure you want to delete this listing?')) {
        return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            // Reload listings
            loadUserListings();
            alert('Listing deleted successfully!');
        } else {
            const data = await response.json();
            alert(data.message || 'Error deleting listing');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting listing');
    }
}

// Show Error Message
function showError(element, message) {
    if (!element) return;
    
    element.textContent = message;
    element.style.display = 'block';
    
    // Hide error after 5 seconds
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
