/**
 * EquipmentUI.js
 * Renders the equipment panel
 */

import { equipmentSystem } from '../systems/EquipmentSystem.js';
import { getItemEmoji, EQUIPMENT_STATS } from '../data/GameData.js';

class EquipmentUI {
    constructor() {
        this.equipmentPanel = null;
    }

    initialize(equipmentPanelId) {
        this.equipmentPanel = document.getElementById(equipmentPanelId);
    }

    render() {
        if (!this.equipmentPanel) return;

        this.equipmentPanel.innerHTML = '';

        const slots = ['Helmet', 'Body', 'Legs', 'Weapon', 'Gloves', 'Boots', 'Cape', 'Necklace', 'Ring'];

        slots.forEach(slotName => {
            const slotDiv = this.createSlotElement(slotName);
            this.equipmentPanel.appendChild(slotDiv);
        });
    }

    createSlotElement(slotName) {
        const item = equipmentSystem.getEquippedItem(slotName);

        const slotDiv = document.createElement('div');
        slotDiv.className = 'flex flex-col items-center justify-center p-2 h-20 rounded-lg shadow transition-all duration-200 cursor-pointer';

        if (item) {
            const emoji = getItemEmoji(item);
            const stats = EQUIPMENT_STATS[item] || { attackBonus: 0, defenseBonus: 0 };

            let statHTML = '';
            if (stats.attackBonus > 0) {
                statHTML += `<span class="text-xs text-red-300">A+${stats.attackBonus}</span>`;
            }
            if (stats.defenseBonus > 0) {
                if (statHTML) statHTML += ' | ';
                statHTML += `<span class="text-xs text-blue-300">D+${stats.defenseBonus}</span>`;
            }

            slotDiv.classList.add('bg-gray-600', 'border-2', 'border-indigo-400');
            slotDiv.innerHTML = `
                <span class="text-xl" role="img">${emoji}</span>
                <span class="text-xs font-semibold text-white mt-0.5 text-center">${item}</span>
                <div class="mt-0.5">${statHTML}</div>
            `;

            const unequipButton = document.createElement('button');
            unequipButton.textContent = 'Unequip';
            unequipButton.className = 'mt-0.5 text-xs bg-red-500 hover:bg-red-600 text-white py-0.5 px-1.5 rounded-md transition-colors';
            unequipButton.onclick = () => {
                equipmentSystem.unequipItem(slotName);
            };
            slotDiv.appendChild(unequipButton);
        } else {
            slotDiv.classList.add('bg-gray-800', 'border-2', 'border-dashed', 'border-gray-600');
            slotDiv.innerHTML = `
                <span class="text-xs font-semibold text-gray-400">${slotName}</span>
                <span class="text-xs text-gray-500 italic">Empty</span>
            `;
        }

        return slotDiv;
    }
}

export const equipmentUI = new EquipmentUI();
