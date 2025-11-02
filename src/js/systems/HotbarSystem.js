/**
 * HotbarSystem.js
 * Manages the hotbar - quick access slots for items
 */

import { gameState } from '../core/GameState.js';
import { inventorySystem } from './InventorySystem.js';
import { foodSystem } from './FoodSystem.js';
import { FOOD_DATA } from '../data/GameData.js';

class HotbarSystem {
    constructor() {
        // Keyboard shortcuts 1-9 map to hotbar slots 0-8
    }

    /**
     * Assign an item to a hotbar slot
     */
    assignToSlot(slotIndex, itemName) {
        // Check if player has the item
        if (!inventorySystem.hasItem(itemName, 1)) {
            this.dispatchHotbarError('You don\'t have that item.');
            return false;
        }

        gameState.setHotbarSlot(slotIndex, itemName);
        this.dispatchHotbarUpdate();
        return true;
    }

    /**
     * Remove an item from a hotbar slot
     */
    clearSlot(slotIndex) {
        gameState.clearHotbarSlot(slotIndex);
        this.dispatchHotbarUpdate();
    }

    /**
     * Use the item in a hotbar slot
     */
    useSlot(slotIndex) {
        const itemName = gameState.getHotbarSlot(slotIndex);

        if (!itemName) {
            return false; // Empty slot
        }

        // Check if player still has the item
        if (!inventorySystem.hasItem(itemName, 1)) {
            this.dispatchHotbarError(`You don't have any ${itemName}.`);
            // Clear the slot since item is gone
            this.clearSlot(slotIndex);
            return false;
        }

        // Check if item is food
        if (FOOD_DATA[itemName]) {
            const success = foodSystem.eatFood(itemName);
            if (success) {
                this.dispatchHotbarUpdate();
            }
            return success;
        }

        // Add other item types here (potions, scrolls, etc.)

        this.dispatchHotbarError(`Cannot use ${itemName} from hotbar.`);
        return false;
    }

    /**
     * Get hotbar state
     */
    getHotbar() {
        return gameState.getHotbar();
    }

    // ==================== Event Dispatching ====================

    dispatchHotbarUpdate() {
        const event = new CustomEvent('hotbar-update', {
            detail: { hotbar: this.getHotbar() }
        });
        window.dispatchEvent(event);
    }

    dispatchHotbarError(message) {
        const event = new CustomEvent('hotbar-error', {
            detail: { message }
        });
        window.dispatchEvent(event);
    }
}

// Export singleton instance
export const hotbarSystem = new HotbarSystem();
