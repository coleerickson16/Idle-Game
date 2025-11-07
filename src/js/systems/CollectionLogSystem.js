/**
 * CollectionLogSystem.js
 * Tracks all items discovered/obtained by the player
 */

import { gameState } from '../core/GameState.js';
import { ITEM_EMOJIS } from '../data/GameData.js';

class CollectionLogSystem {
    /**
     * Record an item as discovered
     */
    discoverItem(itemName) {
        // Check if item exists in ITEM_EMOJIS data
        if (!ITEM_EMOJIS[itemName]) {
            return false;
        }

        const collectionLog = gameState.getCollectionLog();

        // If already discovered, don't dispatch event
        if (collectionLog[itemName]) {
            return false;
        }

        // Mark as discovered
        gameState.addToCollectionLog(itemName);

        // Dispatch discovery event
        this.dispatchItemDiscovered(itemName);

        return true;
    }

    /**
     * Check if an item has been discovered
     */
    hasDiscovered(itemName) {
        const collectionLog = gameState.getCollectionLog();
        return !!collectionLog[itemName];
    }

    /**
     * Get all discovered items
     */
    getDiscoveredItems() {
        return gameState.getCollectionLog();
    }

    /**
     * Get discovery statistics by category
     */
    getStatsByCategory() {
        const discovered = this.getDiscoveredItems();
        const stats = {};

        // Count all items and discovered items by category
        Object.keys(ITEM_EMOJIS).forEach(itemName => {
            const category = this.getItemCategory(itemName);

            if (!stats[category]) {
                stats[category] = {
                    total: 0,
                    discovered: 0,
                    items: []
                };
            }

            stats[category].total++;

            if (discovered[itemName]) {
                stats[category].discovered++;
                stats[category].items.push(itemName);
            }
        });

        return stats;
    }

    /**
     * Determine item category based on name
     */
    getItemCategory(itemName) {
        if (itemName.includes('Logs') || itemName.includes('Shafts')) return 'resource';
        if (itemName.includes('Ore')) return 'ore';
        if (itemName.includes('Bar')) return 'bar';
        if (itemName.includes('Raw')) return 'raw-fish';
        if (itemName.includes('Shrimp') || itemName.includes('Trout') || itemName.includes('Salmon') ||
            itemName.includes('Tuna') || itemName.includes('Lobster') || itemName.includes('Swordfish') ||
            itemName.includes('Shark') || itemName.includes('Anglerfish')) return 'food';
        if (itemName.includes('Helmet') || itemName.includes('Platelegs') || itemName.includes('Platebody') ||
            itemName.includes('Dagger')) return 'equipment';
        if (itemName.includes('Axe')) return 'tool';
        if (itemName === 'Bones') return 'drops';
        if (itemName === 'Coins') return 'currency';
        return 'other';
    }

    /**
     * Get overall completion percentage
     */
    getCompletionPercentage() {
        const totalItems = Object.keys(ITEM_EMOJIS).length;
        const discoveredItems = Object.keys(this.getDiscoveredItems()).length;

        if (totalItems === 0) return 0;

        return Math.floor((discoveredItems / totalItems) * 100);
    }

    /**
     * Get total counts
     */
    getTotalCounts() {
        return {
            total: Object.keys(ITEM_EMOJIS).length,
            discovered: Object.keys(this.getDiscoveredItems()).length
        };
    }

    /**
     * Get missing items by category
     */
    getMissingItemsByCategory() {
        const discovered = this.getDiscoveredItems();
        const missing = {};

        Object.keys(ITEM_EMOJIS).forEach(itemName => {
            if (!discovered[itemName]) {
                const category = this.getItemCategory(itemName);

                if (!missing[category]) {
                    missing[category] = [];
                }

                missing[category].push(itemName);
            }
        });

        return missing;
    }

    // Event dispatching
    dispatchItemDiscovered(itemName) {
        const counts = this.getTotalCounts();
        const percentage = this.getCompletionPercentage();

        window.dispatchEvent(new CustomEvent('itemDiscovered', {
            detail: {
                itemName,
                totalDiscovered: counts.discovered,
                totalItems: counts.total,
                percentage
            }
        }));
    }
}

export const collectionLogSystem = new CollectionLogSystem();
