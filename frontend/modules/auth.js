// frontend/modules/auth.js
import { API_BASE_URL, ELEMENT_IDS } from '../config.js';
import { showError, getElement, setButtonLoading } from './utils.js';
import { showModal, hideAllModals } from './modals.js';
import { loadUserListings } from './listings.js';

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
    const userWelcome = getElement(ELEMENT_IDS.USER_WELCOME);
    const userName = getElement(ELEMENT_IDS.USER_NAME);
    const authButtons = getElement(ELEMENT_IDS.AUTH_BUTTONS);
    const dashboardSection = getElement(ELEMENT_IDS.DASHBOARD_SECTION);
    
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
    const userWelcome = getElement(ELEMENT_IDS.USER_WELCOME);
    const authButtons = getElement(ELEMENT_IDS.AUTH_BUTTONS);
    const dashboardSection = getElement(ELEMENT_IDS.DASHBOARD_SECTION);
    
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
    
    const email = getElement('loginEmail').value;
    const password = getElement('loginPassword').value;
    
    console.log('Login attempt with:', { email: email.substring(0, 3) + '...' });
    
    // Show loading state
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    setButtonLoading(submitBtn, true);
    
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
            getElement(ELEMENT_IDS.LOGIN_FORM).reset();
            
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
            showError(ELEMENT_IDS.LOGIN_ERROR, errorData.message || `Server error: ${response.status}`);
        }
    } catch (error) {
        console.error('Login error:', error);
        showError(ELEMENT_IDS.LOGIN_ERROR, 'Login error. Please try again.');
        
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
        setButtonLoading(submitBtn, false);
    }
}

// Handle registration
async function handleRegister(e) {
    if (e) e.preventDefault();
    
    const firstName = getElement('registerFirstName').value;
    const lastName = getElement('registerLastName').value;
    const company = getElement('registerCompany').value;
    const email = getElement('registerEmail').value;
    const phone = getElement('registerPhone').value;
    const password = getElement('registerPassword').value;
    const userType = getElement('registerUserType').value;
    const location = getElement('registerLocation').value;
    
    console.log('Registration attempt with:', { email: email.substring(0, 3) + '...' });
    
    // Validate location was selected
    if (!location) {
        showError(ELEMENT_IDS.REGISTER_ERROR, 'Please select a location from the suggestions');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    setButtonLoading(submitBtn, true);
    
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
            getElement(ELEMENT_IDS.REGISTER_FORM).reset();
            
            // Show success message
            alert('Registration successful! Welcome to ServiceHub.');
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
            showError(ELEMENT_IDS.REGISTER_ERROR, errorData.message || `Server error: ${response.status}`);
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError(ELEMENT_IDS.REGISTER_ERROR, 'Registration error. Please try again.');
        
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
        setButtonLoading(submitBtn, false);
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    showUnauthenticatedUI();
    alert('You have been logged out successfully.');
}

export { checkAuthStatus, showAuthenticatedUI, showUnauthenticatedUI, handleLogin, handleRegister, handleLogout };
