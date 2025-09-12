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
    
    // Initialize location search
    initLocationSearch();
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
            // In a real application, you would use a service like Google Places API or Postcodes.io
            const mockLocations = [
                { id: 1, name: `London (${postcode})`, lat: 51.5074, lng: -0.1278 },
                { id: 2, name: `Manchester (${postcode})`, lat: 53.4808, lng: -2.2426 },
                { id: 3, name: `Birmingham (${postcode})`, lat: 52.4862, lng: -1.8904 },
                { id: 4, name: `Glasgow (${postcode})`, lat: 55.8642, lng: -4.2518 },
                { id: 5, name: `Leeds (${postcode})`, lat: 53.8008, lng: -1.5491 }
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
                    postcodeInput.value = location.name; // Show selected location in postcode field
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
    if (userWelcome && userName && authButtons) {
        userName.textContent = `${user.firstName} ${user.lastName}`;
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
    
    console.log('Login attempt with:', { email: email.substring(0, 3) + '...' });
    
    // Show loading state
    const submitBtn = loginForm.querySelector('button[type="submit"]');
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
        
        // Check if response is OK
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        
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
        loginForm.reset();
        
    } catch (error) {
        console.error('Login error:', error);
        showError(loginError, error.message || 'Login error. Please try again.');
        
        // Fallback: If API is down, simulate login for demo
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
            console.log('API might be down, using demo mode');
            // Create a demo user for testing
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
    e.preventDefault();
    
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
        showError(registerError, 'Please select a location from the suggestions');
        return;
    }
    
    // Show loading state
    const submitBtn = registerForm.querySelector('button[type="submit"]');
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
        
        // Check if response is OK
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        
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
        registerForm.reset();
        
        // Show success message
        alert('Registration successful! Welcome to ServiceHub.');
    } catch (error) {
        console.error('Registration error:', error);
        
        // Handle validation errors
        if (error.message.includes('User already exists')) {
            showError(registerError, 'An account with this email already exists');
        } else {
            showError(registerError, error.message || 'Registration error. Please try again.');
        }
        
        // Fallback: If API is down, simulate registration for demo
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
            console.log('API might be down, using demo mode');
            // Create a demo user for testing
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
    
    // Show loading state
    const submitBtn = addListingForm.querySelector('button[type="submit"]');
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
        
        // Check if response is OK
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Error creating listing' }));
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Clear form and close modal
        addListingForm.reset();
        hideAllModals();
        
        // Reload listings
        loadUserListings();
        
        // Show success message
        alert('Service listing created successfully!');
    } catch (error) {
        console.error('Error creating listing:', error);
        showError(listingError, error.message || 'Error creating service listing. Please try again.');
        
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
    e.preventDefault();
    
    const id = document.getElementById('editListingId').value;
    const title = document.getElementById('editListingTitle').value;
    const category = document.getElementById('editListingCategory').value;
    const description = document.getElementById('editListingDescription').value;
    const price = document.getElementById('editListingPrice').value;
    
    const token = localStorage.getItem('token');
    
    // Show loading state
    const submitBtn = editListingForm.querySelector('button[type="submit"]');
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
        
        // Check if response is OK
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Error updating listing' }));
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Close modal and reload listings
        hideAllModals();
        loadUserListings();
        
        // Show success message
        alert('Service listing updated successfully!');
    } catch (error) {
        console.error('Error updating listing:', error);
        showError(editListingError, error.message || 'Error updating service listing. Please try again.');
        
        // Fallback: If API is down, simulate listing update for demo
        if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
            console.log('API might be down, using demo mode');
            alert('Demo mode: Listing update simulated (backend might be down)');
