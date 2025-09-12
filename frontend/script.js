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
        loginBtn.addEventListener('click', () => showModal('loginModal'));
    }
    
    // Register button
    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => showModal('registerModal'));
    }
    
    // Add listing button
    const addListingBtn = document.getElementById('addListingBtn');
    if (addListingBtn) {
        addListingBtn.addEventListener('click', () => showModal('addListingModal'));
    }
    
    // Switch to register link
    const switchToRegister = document.getElementById('switchToRegister');
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllModals();
            showModal('registerModal');
        });
    }
    
    // Switch to login link
    const switchToLogin = document.getElementById('switchToLogin');
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
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
        heroBtn.addEventListener('click', () => showModal('registerModal'));
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
    
    const editListingForm = document.getElementById('editListingForm');
    if (editListingForm) {
        editListingForm.addEventListener('submit', handleEditListing);
    }
    
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
    
    // Initialize location search
    initLocationSearch();
}

// Show modal function
function showModal(modalId) {
    hideAllModals();
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

// Hide all modals
function hideAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Location search functionality
function initLocationSearch() {
    const postcodeInput = document.getElementById('registerPostcode');
    const locationResults = document.getElementById('locationResults');
    const locationResultsContainer = document.getElementById('locationResultsContainer');
    const locationInput = document.getElementById('registerLocation');
    
    if (postcodeInput && locationResults && locationResultsContainer && locationInput) {
        // Debounce the postcode search
        let debounceTimer;
        postcodeInput.addEventListener('input', function(e) {
            clearTimeout(debounceTimer);
            const postcode = e.target.value.trim();
            
            if (postcode.length > 4) {
                debounceTimer = setTimeout(() => {
                    searchLocations(postcode);
                }, 500);
            } else {
                locationResultsContainer.style.display = 'none';
            }
        });
        
        function searchLocations(postcode) {
            // Simulate API call to postcode lookup service
            const mockLocations = [
                { id: 1, name: `London (${postcode})` },
                { id: 2, name: `Manchester (${postcode})` },
                { id: 3, name: `Birmingham (${postcode})` },
                { id: 4, name: `Glasgow (${postcode})` },
                { id: 5, name: `Leeds (${postcode})` }
            ];
            
            displayLocationResults(mockLocations);
        }
        
        function displayLocationResults(locations) {
            locationResults.innerHTML = '';
            
            if (locations.length === 0) {
                locationResultsContainer.style.display = 'none';
                return;
            }
            
            locations.forEach(location => {
                const div = document.createElement('div');
                div.className = 'location-result';
                div.textContent = location.name;
                div.addEventListener('click', () => {
                    locationInput.value = location.name;
                    postcodeInput.value = location.name;
                    locationResultsContainer.style.display = 'none';
                });
                locationResults.appendChild(div);
            });
            
            locationResultsContainer.style.display = 'block';
        }
        
        // Hide results when clicking outside
        document.addEventListener('click', function(e) {
            if (!postcodeInput.contains(e.target) && !locationResultsContainer.contains(e.target)) {
                locationResultsContainer.style.display = 'none';
            }
        });
    }
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
    const userWelcome = document.getElementById('userWelcome');
    const userName = document.getElementById('userName');
    const authButtons = document.getElementById('authButtons');
    const dashboardSection = document.getElementById('dashboardSection');
    
    if (userWelcome && userName && authButtons) {
        userName.textContent = `${user.firstName || user.name || 'User'}`;
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
    const userWelcome = document.getElementById('userWelcome');
    const authButtons = document.getElementById('authButtons');
    const dashboardSection = document.getElementById('dashboardSection');
    
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
    if (e) e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log('Login attempt with:', { email: email.substring(0, 3) + '...' });
    
    // Show loading state
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Logging in...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify({
                id: data._id,
                firstName: data.firstName,
                lastName: data.lastName,
                company: data.company,
                email: data.email,
                phone: data.phone,
                userType: data.userType,
                location: data.location
            }));
            
            // Update UI
            showAuthenticatedUI(data);
            
            // Hide modal and clear form
            hideAllModals();
            document.getElementById('loginForm').reset();
            
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
            showError('loginError', errorData.message || `Server error: ${response.status}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('loginError', 'Login error. Please try again.');
        
        // Fallback: If API is down, simulate login for demo
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
            console.log('API might be down, using demo mode');
            const demoUser = {
                _id: 'demo123',
                firstName: 'Demo',
                lastName: 'User',
                email: email,
                userType: 'professional',
                token: 'demo-token-' + Date.now()
            };
            
            localStorage.setItem('token', demoUser.token);
            localStorage.setItem('userData', JSON.stringify(demoUser));
            showAuthenticatedUI(demoUser);
            hideAllModals();
            alert('Demo mode: Using simulated login (backend might be down)');
        }
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Handle registration
async function handleRegister(e) {
    if (e) e.preventDefault();
    
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const company = document.getElementById('registerCompany').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.getElementById('registerUserType').value;
    const location = document.getElementById('registerLocation').value;
    
    console.log('Registration attempt with:', { email: email.substring(0, 3) + '...' });
    
    // Validate location was selected
    if (!location) {
        showError('registerError', 'Please select a location from the suggestions');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating account...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                firstName, 
                lastName, 
                company, 
                email, 
                phone, 
                password, 
                userType, 
                location 
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Save token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('userData', JSON.stringify({
                id: data._id,
                firstName: data.firstName,
                lastName: data.lastName,
                company: data.company,
                email: data.email,
                phone: data.phone,
                userType: data.userType,
                location: data.location
            }));
            
            // Update UI
            showAuthenticatedUI(data);
            
            // Hide modal and clear form
            hideAllModals();
            document.getElementById('registerForm').reset();
            
            // Show success message
            alert('Registration successful! Welcome to ServiceHub.');
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
            showError('registerError', errorData.message || `Server error: ${response.status}`);
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('registerError', 'Registration error. Please try again.');
        
        // Fallback: If API is down, simulate registration for demo
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
            console.log('API might be down, using demo mode');
            const demoUser = {
                _id: 'demo-' + Date.now(),
                firstName: firstName,
                lastName: lastName,
                company: company,
                email: email,
                phone: phone,
                userType: userType,
                location: location,
                token: 'demo-token-' + Date.now()
            };
            
            localStorage.setItem('token', demoUser.token);
            localStorage.setItem('userData', JSON.stringify(demoUser));
            showAuthenticatedUI(demoUser);
            hideAllModals();
            alert('Demo mode: Using simulated registration (backend might be down)');
        }
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
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
    if (e) e.preventDefault();
    
    const title = document.getElementById('listingTitle').value;
    const category = document.getElementById('listingCategory').value;
    const description = document.getElementById('listingDescription').value;
    const price = document.getElementById('listingPrice').value;
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        showError('listingError', 'Please log in to create listings');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#addListingForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/listings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, category, description, price })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Clear form and close modal
            document.getElementById('addListingForm').reset();
            hideAllModals();
            
            // Reload listings
            loadUserListings();
            
            // Show success message
            alert('Service listing created successfully!');
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Error creating listing' }));
            showError('listingError', errorData.message || `Server error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error creating listing:', error);
        showError('listingError', 'Error creating service listing. Please try again.');
        
        // Fallback: If API is down, simulate listing creation for demo
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
            console.log('API might be down, using demo mode');
            alert('Demo mode: Listing creation simulated (backend might be down)');
            hideAllModals();
            loadUserListings();
        }
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Handle edit listing
async function handleEditListing(e) {
    if (e) e.preventDefault();
    
    const id = document.getElementById('editListingId').value;
    const title = document.getElementById('editListingTitle').value;
    const category = document.getElementById('editListingCategory').value;
    const description = document.getElementById('editListingDescription').value;
    const price = document.getElementById('editListingPrice').value;
    
    const token = localStorage.getItem('token');
    
    // Show loading state
    const submitBtn = document.querySelector('#editListingForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Updating...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/listings/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, category, description, price })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Close modal and reload listings
            hideAllModals();
            loadUserListings();
            
            // Show success message
            alert('Service listing updated successfully!');
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Error updating listing' }));
            showError('editListingError', errorData.message || `Server error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error updating listing:', error);
        showError('editListingError', 'Error updating service listing. Please try again.');
        
        // Fallback: If API is down, simulate listing update for demo
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
            console.log('API might be down, using demo mode');
            alert('Demo mode: Listing update simulated (backend might be down)');
            hideAllModals();
            loadUserListings();
        }
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Load User Listings
async function loadUserListings() {
    const token = localStorage.getItem('token');
    const dashboardContent = document.getElementById('dashboardContent');
    
    if (!
