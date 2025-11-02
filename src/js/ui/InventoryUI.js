/**
 * InventoryUI.js
 * Renders the inventory panel
 */

import { inventorySystem } from '../systems/InventorySystem.js';
import { equipmentSystem } from '../systems/EquipmentSystem.js';
import { foodSystem } from '../systems/FoodSystem.js';
import { getItemEmoji, getItemSlot, FOOD_DATA } from '../data/GameData.js';

class InventoryUI {
    constructor() {
        this.inventoryPanel = null;
    }

    initialize(inventoryPanelId) {
        this.inventoryPanel = document.getElementById(inventoryPanelId);
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
        itemDiv.className = 'flex flex-col items-center justify-center p-2 bg-gray-700 rounded-lg shadow cursor-move';
        itemDiv.draggable = true;
        itemDiv.dataset.itemName = itemName;

        itemDiv.innerHTML = `
            <span class="text-xl" role="img" aria-label="${itemName}">${emoji}</span>
            <span class="text-xs font-semibold text-white mt-0.5 text-center">${itemName}</span>
            <span class="text-base font-bold text-yellow-300">${count}</span>
        `;

        // Drag-and-drop handlers
        itemDiv.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', itemName);
            itemDiv.classList.add('opacity-50');
        });

        itemDiv.addEventListener('dragend', (e) => {
            itemDiv.classList.remove('opacity-50');
        });

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

        // Add eat button if item is food
        if (FOOD_DATA[itemName]) {
            const eatButton = document.createElement('button');
            const healAmount = FOOD_DATA[itemName].healsHP;
            eatButton.textContent = `Eat (${healAmount} HP)`;
            eatButton.className = 'mt-1 text-xs bg-green-500 hover:bg-green-600 text-white py-0.5 px-2 rounded-md transition-colors';
            eatButton.onclick = () => {
                foodSystem.eatFood(itemName);
            };
            itemDiv.appendChild(eatButton);
        }

        return itemDiv;
    }
}

export const inventoryUI = new InventoryUI();
