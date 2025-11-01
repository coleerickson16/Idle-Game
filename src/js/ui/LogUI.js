/**
 * LogUI.js
 * Manages the game log display
 */

import { GAME_CONFIG } from '../data/GameData.js';

class LogUI {
    constructor() {
        this.logElement = null;
    }

    initialize(logElementId) {
        this.logElement = document.getElementById(logElementId);
        if (!this.logElement) {
            console.error(`Log element not found: ${logElementId}`);
        }
    }

    /**
     * Add a message to the game log
     */
    log(message, type = 'info') {
        if (!this.logElement) return;

        const p = document.createElement('p');
        p.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

        const colorClass = this.getColorClass(type);
        p.className = `text-sm ${colorClass}`;

        // Enforce capacity limit
        if (this.logElement.children.length >= GAME_CONFIG.LOG_CAPACITY) {
            this.logElement.removeChild(this.logElement.lastChild);
        }

        this.logElement.prepend(p);
        this.logElement.scrollTop = 0;
    }

    getColorClass(type) {
        const colorMap = {
            'info': 'text-blue-300',
            'level': 'text-green-400 font-bold',
            'item': 'text-yellow-300',
            'error': 'text-red-400',
            'combat': 'text-red-200',
            'success': 'text-lime-300 font-medium',
        };

        return colorMap[type] || 'text-gray-400';
    }

    clear() {
        if (this.logElement) {
            this.logElement.innerHTML = '';
        }
    }
}

export const logUI = new LogUI();
