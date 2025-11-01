/**
 * InventoryUI.js
 * Renders the inventory panel
 */

import { inventorySystem } from '../systems/InventorySystem.js';
import { equipmentSystem } from '../systems/EquipmentSystem.js';
import { getItemEmoji, getItemSlot } from '../data/GameData.js';

class InventoryUI {
    constructor() {
        this.inventoryPanel = null;
        this.inventoryContainer = null;
        this.equipmentContainer = null;
        this.tabInventory = null;
        this.tabEquipment = null;
    }

    initialize(inventoryPanelId, inventoryContainerId, equipmentContainerId, tabInventoryId, tabEquipmentId) {
        this.inventoryPanel = document.getElementById(inventoryPanelId);
        this.inventoryContainer = document.getElementById(inventoryContainerId);
        this.equipmentContainer = document.getElementById(equipmentContainerId);
        this.tabInventory = document.getElementById(tabInventoryId);
        this.tabEquipment = document.getElementById(tabEquipmentId);

        // Set up tab listeners
        if (this.tabInventory) {
            this.tabInventory.addEventListener('click', () => this.switchTab('inventory'));
        }
        if (this.tabEquipment) {
            this.tabEquipment.addEventListener('click', () => this.switchTab('equipment'));
        }
    }

    switchTab(tabName) {
        if (tabName === 'inventory') {
            this.inventoryContainer?.classList.remove('hidden');
            this.equipmentContainer?.classList.add('hidden');
            this.tabInventory?.classList.add('border-green-500');
            this.tabInventory?.classList.remove('text-gray-400');
            this.tabEquipment?.classList.remove('border-green-500', 'text-white');
            this.tabEquipment?.classList.add('text-gray-400');
            this.render();
        } else if (tabName === 'equipment') {
            this.equipmentContainer?.classList.remove('hidden');
            this.inventoryContainer?.classList.add('hidden');
            this.tabEquipment?.classList.add('border-green-500');
            this.tabEquipment?.classList.remove('text-gray-400');
            this.tabInventory?.classList.remove('border-green-500', 'text-white');
            this.tabInventory?.classList.add('text-gray-400');
            // Trigger equipment render through event
            window.dispatchEvent(new CustomEvent('equipmentTabOpened'));
        }
    }

    render() {
        if (!this.inventoryPanel) return;

        this.inventoryPanel.innerHTML = '';

        const items = inventorySystem.getNonEmptyItems();

        if (items.length === 0) {
            this.inventoryPanel.innerHTML = '<p class="text-gray-400 italic text-sm">Your backpack is empty. Start gathering!</p>';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-2 gap-2';

        items.forEach(({ name, count }) => {
            const itemDiv = this.createItemElement(name, count);
            grid.appendChild(itemDiv);
        });

        this.inventoryPanel.appendChild(grid);
    }

    createItemElement(itemName, count) {
        const emoji = getItemEmoji(itemName);
        const slot = getItemSlot(itemName);

        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex flex-col items-center justify-center p-2 bg-gray-600 rounded-lg shadow';
        itemDiv.innerHTML = `
            <span class="text-xl" role="img" aria-label="${itemName}">${emoji}</span>
            <span class="text-xs font-semibold text-white mt-0.5 text-center">${itemName}</span>
            <span class="text-base font-bold text-yellow-300">${count}</span>
        `;

        // Add equip button if item is equipable
        if (slot) {
            const equipButton = document.createElement('button');
            equipButton.textContent = 'Equip';
            equipButton.className = 'mt-1 text-xs bg-indigo-500 hover:bg-indigo-600 text-white py-0.5 px-2 rounded-md transition-colors';
            equipButton.onclick = () => {
                equipmentSystem.equipItem(itemName);
            };
            itemDiv.appendChild(equipButton);
        }

        return itemDiv;
    }
}

export const inventoryUI = new InventoryUI();
