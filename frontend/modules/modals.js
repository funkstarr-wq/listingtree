// frontend/modules/modals.js
import { getElement } from './utils.js';
import { ELEMENT_IDS } from '../config.js';

// Show modal function
function showModal(modalId) {
    hideAllModals();
    const modal = getElement(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        console.log('Modal displayed:', modalId);
    } else {
        console.error('Modal not found:', modalId);
    }
}

// Hide all modals
function hideAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Initialize modal event listeners
function initModals() {
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
    
    console.log('Modals initialized');
}

export { showModal, hideAllModals, initModals };
