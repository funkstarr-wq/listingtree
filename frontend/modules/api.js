// frontend/modules/api.js
import { API_BASE_URL } from '../config.js';
import { showError, setButtonLoading } from './utils.js';

// Generic API request function
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...defaultOptions,
            ...options
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ 
                message: `Server error: ${response.status}` 
            }));
            throw new Error(errorData.message || 'Request failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// Auth API functions
async function login(email, password) {
    return apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
}

async function register(userData) {
    return apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    });
}

async function getProfile() {
    return apiRequest('/api/auth/profile');
}

// Listings API functions
async function getListings(page = 1, limit = 10) {
    return apiRequest(`/api/listings?page=${page}&limit=${limit}`);
}

async function getUserListings() {
    return apiRequest('/api/listings/user/my-listings');
}

async function getListing(id) {
    return apiRequest(`/api/listings/${id}`);
}

async function createListing(listingData) {
    return apiRequest('/api/listings', {
        method: 'POST',
        body: JSON.stringify(listingData)
    });
}

async function updateListing(id, listingData) {
    return apiRequest(`/api/listings/${id}`, {
        method: 'PUT',
        body: JSON.stringify(listingData)
    });
}

async function deleteListing(id) {
    return apiRequest(`/api/listings/${id}`, {
        method: 'DELETE'
    });
}

// Health check
async function healthCheck() {
    return apiRequest('/api/health');
}

export { 
    apiRequest, 
    login, 
    register, 
    getProfile, 
    getListings, 
    getUserListings, 
    getListing, 
    createListing, 
    updateListing, 
    deleteListing, 
    healthCheck 
};
