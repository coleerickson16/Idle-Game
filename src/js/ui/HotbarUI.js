/**
 * HotbarUI.js
 * Renders the hotbar UI with 9 quick slots
 */

import { hotbarSystem } from '../systems/HotbarSystem.js';
import { inventorySystem } from '../systems/InventorySystem.js';
import { getItemEmoji, FOOD_DATA } from '../data/GameData.js';

class HotbarUI {
    constructor() {
        this.hotbarContainer = null;
    }

    init() {
        this.hotbarContainer = document.getElementById('hotbar');
        if (!this.hotbarContainer) {
            console.error('Hotbar container not found!');
            return;
        }
        this.render();
        this.setupKeyboardShortcuts();
    }

    render() {
        if (!this.hotbarContainer) return;

        this.hotbarContainer.innerHTML = '';

        const hotbar = hotbarSystem.getHotbar();

        hotbar.forEach((itemName, index) => {
            const slot = this.createSlot(index, itemName);
            this.hotbarContainer.appendChild(slot);
        });
    }

    createSlot(index, itemName) {
        const slot = document.createElement('div');
        slot.className = 'hotbar-slot';
        slot.dataset.slotIndex = index;

        // Keyboard number (1-9)
        const keyLabel = document.createElement('div');
        keyLabel.className = 'hotbar-key';
        keyLabel.textContent = index + 1;
        slot.appendChild(keyLabel);

        // Allow dropping items onto slot
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('hotbar-slot-dragover');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('hotbar-slot-dragover');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('hotbar-slot-dragover');

            const draggedItemName = e.dataTransfer.getData('text/plain');
            if (draggedItemName) {
                hotbarSystem.assignToSlot(index, draggedItemName);
            }
        });

        if (itemName) {
            // Has an item assigned
            const count = inventorySystem.getItemCount(itemName);

            if (count > 0) {
                const emoji = getItemEmoji(itemName);

                const itemIcon = document.createElement('div');
                itemIcon.className = 'hotbar-item';
                itemIcon.innerHTML = `
                    <span class="text-2xl">${emoji}</span>
                    <span class="hotbar-count">${count}</span>
                `;

                // Click to use
                itemIcon.addEventListener('click', (e) => {
                    e.stopPropagation();
                    hotbarSystem.useSlot(index);
                });

                // Right-click to remove from hotbar
                itemIcon.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    hotbarSystem.clearSlot(index);
                });

                slot.appendChild(itemIcon);
            } else {
                // Item is in hotbar but no longer in inventory
                const emptyLabel = document.createElement('div');
                emptyLabel.className = 'hotbar-empty';
                emptyLabel.textContent = 'Empty';

                // Auto-clear when item runs out
                hotbarSystem.clearSlot(index);

                slot.appendChild(emptyLabel);
            }
        } else {
            // Empty slot
            const emptyLabel = document.createElement('div');
            emptyLabel.className = 'hotbar-empty';
            emptyLabel.textContent = '+';
            slot.appendChild(emptyLabel);
        }

        return slot;
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Check if numbers 1-9 are pressed
            if (e.key >= '1' && e.key <= '9') {
                // Don't trigger if typing in an input field
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }

                const slotIndex = parseInt(e.key) - 1;
                hotbarSystem.useSlot(slotIndex);
                e.preventDefault();
            }
        });
    }
}

// Export singleton instance
export const hotbarUI = new HotbarUI();
