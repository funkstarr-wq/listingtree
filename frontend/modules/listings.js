// frontend/modules/listings.js
import { API_BASE_URL, ELEMENT_IDS } from '../config.js';
import { showError, getElement, setButtonLoading, formatCurrency, formatDate } from './utils.js';
import { showModal, hideAllModals } from './modals.js';

// Load User Listings
async function loadUserListings() {
    const token = localStorage.getItem('token');
    const dashboardContent = getElement(ELEMENT_IDS.DASHBOARD_CONTENT);
    
    if (!token || !dashboardContent) {
        if (dashboardContent) {
            dashboardContent.innerHTML = '<p>Please log in to view your service listings.</p>';
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
            dashboardContent.innerHTML = '<p>Error loading your service listings. Please try again.</p>';
        }
    } catch (error) {
        console.error('Error loading listings:', error);
        dashboardContent.innerHTML = '<p>Error loading your service listings. Please try again.</p>';
    }
}

// Display Listings
function displayListings(listings) {
    const dashboardContent = getElement(ELEMENT_IDS.DASHBOARD_CONTENT);
    if (!dashboardContent) return;
    
    if (listings.length === 0) {
        dashboardContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-clipboard-list" style="font-size: 60px; color: #ddd; margin-bottom: 20px;"></i>
                <h3>No Service Listings Yet</h3>
                <p>Get started by adding your first service listing!</p>
                <button class="btn btn-primary" id="addFirstListingBtn">Add Your First Service</button>
            </div>
        `;
        
        const addFirstListingBtn = getElement('addFirstListingBtn');
        if (addFirstListingBtn) {
            addFirstListingBtn.addEventListener('click', function() {
                showModal(ELEMENT_IDS.ADD_LISTING_MODAL);
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
                        <span class="listing-price">${formatCurrency(listing.price)}/hour</span>
                    </div>
                    <div class="listing-category">${listing.category}</div>
                    <p class="listing-description">${listing.description}</p>
                    <div class="listing-footer">
                        <span class="listing-date">Posted: ${formatDate(listing.createdAt)}</span>
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
        btn.addEventListener('click', function(e) {
            const id = e.target.dataset.id;
            editListing(id);
        });
    });
    
    document.querySelectorAll('.delete-listing-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const id = e.target.dataset.id;
            deleteListing(id);
        });
    });
}

// Handle add listing
async function handleAddListing(e) {
    if (e) e.preventDefault();
    
    const title = getElement('listingTitle').value;
    const category = getElement('listingCategory').value;
    const description = getElement('listingDescription').value;
    const price = getElement('listingPrice').value;
    
    const token = localStorage.getItem('token');
    
    if (!token) {
        showError(ELEMENT_IDS.LISTING_ERROR, 'Please log in to create listings');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('#addListingForm button[type="submit"]');
    setButtonLoading(submitBtn, true);
    
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
            getElement(ELEMENT_IDS.ADD_LISTING_FORM).reset();
            hideAllModals();
            
            // Reload listings
            loadUserListings();
            
           
