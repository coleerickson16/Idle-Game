/**
 * EquipmentSystem.js
 * Manages equipment operations
 */

import { gameState } from '../core/GameState.js';
import { inventorySystem } from './InventorySystem.js';
import { getItemSlot } from '../data/GameData.js';

class EquipmentSystem {
    /**
     * Equip an item from inventory
     */
    equipItem(itemName) {
        const slot = getItemSlot(itemName);

        if (!slot) {
            this.dispatchEquipError(`Cannot equip ${itemName}: No matching slot found.`);
            return false;
        }

        if (!inventorySystem.hasItem(itemName, 1)) {
            this.dispatchEquipError(`Cannot equip ${itemName}: Item not found in inventory.`);
            return false;
        }

        // Remove from inventory
        inventorySystem.removeItem(itemName, 1);

        // Unequip old item if present
        const oldItem = gameState.getEquipment(slot);
        if (oldItem) {
            inventorySystem.addItem(oldItem, 1);
            this.dispatchUnequip(oldItem, slot);
        }

        // Equip new item
        gameState.setEquipment(slot, itemName);
        this.dispatchEquip(itemName, slot);

        return true;
    }

    /**
     * Unequip an item and return to inventory
     */
    unequipItem(slotName) {
        const itemName = gameState.getEquipment(slotName);

        if (!itemName) {
            return false;
        }

        // Return to inventory
        inventorySystem.addItem(itemName, 1);

        // Clear slot
        gameState.setEquipment(slotName, null);

        this.dispatchUnequip(itemName, slotName);

        return true;
    }

    /**
     * Get equipped item in a slot
     */
    getEquippedItem(slot) {
        return gameState.getEquipment(slot);
    }

    /**
     * Get all equipped items
     */
    getAllEquipped() {
        const equipped = {};
        Object.keys(gameState.player.equipment).forEach(slot => {
            const item = gameState.getEquipment(slot);
            if (item) {
                equipped[slot] = item;
            }
        });
        return equipped;
    }

    // Event dispatching
    dispatchEquip(itemName, slot) {
        window.dispatchEvent(new CustomEvent('itemEquipped', {
            detail: { itemName, slot }
        }));
    }

    dispatchUnequip(itemName, slot) {
        window.dispatchEvent(new CustomEvent('itemUnequipped', {
            detail: { itemName, slot }
        }));
    }

    dispatchEquipError(message) {
        window.dispatchEvent(new CustomEvent('equipError', {
            detail: { message }
        }));
    }
}

export const equipmentSystem = new EquipmentSystem();
