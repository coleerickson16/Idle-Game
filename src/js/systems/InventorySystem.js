/**
 * InventorySystem.js
 * Manages inventory operations
 */

import { gameState } from '../core/GameState.js';
import { collectionLogSystem } from './CollectionLogSystem.js';

class InventorySystem {
    constructor() {
        this.MAX_INVENTORY_SLOTS = 20; // Maximum unique item types
    }

    /**
     * Add item to inventory
     */
    addItem(itemName, amount = 1) {
        const currentCount = gameState.getInventoryItem(itemName);

        // If this is a new item (count is 0), check if inventory is full
        if (currentCount === 0) {
            const uniqueItemCount = this.getUniqueItemCount();
            if (uniqueItemCount >= this.MAX_INVENTORY_SLOTS) {
                this.dispatchInventoryError(`Inventory full! Maximum ${this.MAX_INVENTORY_SLOTS} item types. Store items in the bank.`);
                return false;
            }
        }

        gameState.addInventoryItem(itemName, amount);

        // Track item in collection log
        collectionLogSystem.discoverItem(itemName);

        this.dispatchInventoryUpdate();
        return true;
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

    /**
     * Get count of unique items (non-zero)
     */
    getUniqueItemCount() {
        return this.getNonEmptyItems().length;
    }

    /**
     * Get inventory capacity info
     */
    getInventoryCapacity() {
        return {
            used: this.getUniqueItemCount(),
            max: this.MAX_INVENTORY_SLOTS,
            isFull: this.getUniqueItemCount() >= this.MAX_INVENTORY_SLOTS
        };
    }

    // Event dispatching
    dispatchInventoryUpdate() {
        window.dispatchEvent(new CustomEvent('inventoryUpdated'));
    }

    dispatchInventoryError(message) {
        window.dispatchEvent(new CustomEvent('inventoryError', {
            detail: { message }
        }));
    }
}

export const inventorySystem = new InventorySystem();
