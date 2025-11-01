/**
 * InventorySystem.js
 * Manages inventory operations
 */

import { gameState } from '../core/GameState.js';

class InventorySystem {
    /**
     * Add item to inventory
     */
    addItem(itemName, amount = 1) {
        gameState.addInventoryItem(itemName, amount);
        this.dispatchInventoryUpdate();
    }

    /**
     * Remove item from inventory
     */
    removeItem(itemName, amount = 1) {
        gameState.removeInventoryItem(itemName, amount);
        this.dispatchInventoryUpdate();
    }

    /**
     * Check if player has enough of an item
     */
    hasItem(itemName, amount = 1) {
        return gameState.getInventoryItem(itemName) >= amount;
    }

    /**
     * Get item count
     */
    getItemCount(itemName) {
        return gameState.getInventoryItem(itemName);
    }

    /**
     * Get all items with non-zero quantities
     */
    getNonEmptyItems() {
        const items = [];
        const inventory = gameState.player.inventory;

        Object.keys(inventory).forEach(itemName => {
            if (inventory[itemName] > 0) {
                items.push({
                    name: itemName,
                    count: inventory[itemName]
                });
            }
        });

        return items;
    }

    // Event dispatching
    dispatchInventoryUpdate() {
        window.dispatchEvent(new CustomEvent('inventoryUpdated'));
    }
}

export const inventorySystem = new InventorySystem();
