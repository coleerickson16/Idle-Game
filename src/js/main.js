/**
 * main.js
 * Entry point for the Adventure Idle game
 * Initializes all game systems and UI
 */

import { uiManager } from './ui/UIManager.js';

/**
 * Initialize the game when DOM is ready
 */
function initializeGame() {
    console.log('Initializing Adventure Idle...');

    // Initialize UI Manager (which initializes all other UI components)
    uiManager.initialize();

    console.log('Adventure Idle initialized successfully!');
}

// Start the game when the window loads
window.addEventListener('DOMContentLoaded', initializeGame);
