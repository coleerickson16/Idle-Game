/**
 * CollectionLogUI.js
 * Renders the collection log interface
 */

import { collectionLogSystem } from '../systems/CollectionLogSystem.js';
import { getItemEmoji } from '../data/GameData.js';

class CollectionLogUI {
    constructor() {
        this.container = null;
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Collection log container '${containerId}' not found!`);
            return;
        }
    }

    render() {
        if (!this.container) return;

        const stats = collectionLogSystem.getStatsByCategory();
        const counts = collectionLogSystem.getTotalCounts();
        const percentage = collectionLogSystem.getCompletionPercentage();

        this.container.innerHTML = `
            <div class="collection-log-interface">
                <!-- Overall Progress -->
                <div class="collection-header">
                    <h3 class="text-lg font-semibold text-white">Collection Log</h3>
                    <div class="text-sm text-gray-300">
                        ${counts.discovered}/${counts.total} items discovered (${percentage}%)
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${percentage}%"></div>
                    </div>
                </div>

                <!-- Categories -->
                <div class="collection-categories">
                    ${this.renderCategories(stats)}
                </div>
            </div>
        `;
    }

    renderCategories(stats) {
        const categoryNames = Object.keys(stats).sort();

        if (categoryNames.length === 0) {
            return '<div class="text-gray-500 text-sm">No items available</div>';
        }

        return categoryNames.map(category => {
            const catStats = stats[category];
            const percentage = Math.floor((catStats.discovered / catStats.total) * 100);
            const isComplete = catStats.discovered === catStats.total;

            return `
                <div class="collection-category">
                    <div class="category-header">
                        <div class="category-title">
                            <span class="text-base font-semibold ${isComplete ? 'text-yellow-400' : 'text-white'}">${this.getCategoryEmoji(category)} ${this.formatCategoryName(category)}</span>
                            ${isComplete ? '<span class="text-yellow-400 text-sm ml-2">✓ Complete</span>' : ''}
                        </div>
                        <div class="category-stats text-sm text-gray-400">
                            ${catStats.discovered}/${catStats.total} (${percentage}%)
                        </div>
                    </div>
                    <div class="category-progress-bar">
                        <div class="category-progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    ${catStats.items.length > 0 ? `
                        <div class="category-items">
                            ${this.renderDiscoveredItems(catStats.items)}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    }

    renderDiscoveredItems(items) {
        return items.map(itemName => {
            const emoji = getItemEmoji(itemName);
            return `
                <div class="collection-item" title="${itemName}">
                    <span class="text-2xl">${emoji}</span>
                    <span class="text-xs text-gray-300 mt-1">${itemName}</span>
                </div>
            `;
        }).join('');
    }

    getCategoryEmoji(category) {
        const emojiMap = {
            'resource': '🪵',
            'ore': '⛏️',
            'fish': '🐟',
            'food': '🍖',
            'equipment': '⚔️',
            'tool': '🔨',
            'other': '📦'
        };
        return emojiMap[category] || '📦';
    }

    formatCategoryName(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
}

export const collectionLogUI = new CollectionLogUI();
