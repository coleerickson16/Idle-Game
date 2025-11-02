/**
 * ActionsUI.js
 * Renders action buttons for skills
 */

import { gameState } from '../core/GameState.js';
import { activitySystem } from '../systems/ActivitySystem.js';
import { locationSystem } from '../systems/LocationSystem.js';
import { ACTIONS, ENEMY_TEMPLATES } from '../data/GameData.js';

class ActionsUI {
    constructor() {
        this.actionPanels = {};
        this.stopActionContainer = null;
    }

    initialize(panelIds, stopContainerId) {
        this.actionPanels = panelIds;
        this.stopActionContainer = document.getElementById(stopContainerId);
    }

    render() {
        // Get activities available at current location
        const availableActivities = locationSystem.getAvailableActivities();

        // Clear all panels first
        this.clearAllPanels();

        // Hide all sections by default
        this.hideAllSections();

        // Only render activities available at current location
        if (availableActivities.includes('woodcutting')) this.renderWoodcutting();
        if (availableActivities.includes('mining')) this.renderMining();
        if (availableActivities.includes('fishing')) this.renderFishing();
        if (availableActivities.includes('firemaking')) this.renderFiremaking();
        if (availableActivities.includes('smithing')) this.renderSmithing();
        if (availableActivities.includes('fletching')) this.renderFletching();
        if (availableActivities.includes('cooking')) this.renderCooking();
        if (availableActivities.includes('combat')) this.renderCombat();

        this.renderStopButton();
    }

    clearAllPanels() {
        // Clear all action panels
        Object.keys(this.actionPanels).forEach(panelKey => {
            const panel = document.getElementById(this.actionPanels[panelKey]);
            if (panel) panel.innerHTML = '';
        });
    }

    hideAllSections() {
        // Hide all section containers
        const sections = ['woodcutting', 'mining', 'fishing', 'firemaking', 'smithing', 'fletching', 'cooking', 'combat'];
        sections.forEach(sectionName => {
            const section = document.getElementById(`${sectionName}-section`);
            if (section) section.style.display = 'none';
        });
    }

    showSection(sectionName) {
        const section = document.getElementById(`${sectionName}-section`);
        if (section) section.style.display = 'block';
    }

    renderWoodcutting() {
        const panel = document.getElementById(this.actionPanels.woodcutting);
        if (!panel) return;

        this.showSection('woodcutting');
        panel.innerHTML = '';
        ACTIONS.woodcutting.forEach(action => {
            const button = this.createGatheringButton(
                action.id,
                action.name,
                'Woodcutting',
                action.levelReq,
                action.item,
                action.xp
            );
            panel.appendChild(button);
        });
    }

    renderMining() {
        const panel = document.getElementById(this.actionPanels.mining);
        if (!panel) return;

        this.showSection('mining');
        panel.innerHTML = '';
        ACTIONS.mining.forEach(action => {
            const button = this.createGatheringButton(
                action.id,
                action.name,
                'Mining',
                action.levelReq,
                action.item,
                action.xp
            );
            panel.appendChild(button);
        });
    }

    renderFishing() {
        const panel = document.getElementById(this.actionPanels.fishing);
        if (!panel) return;

        this.showSection('fishing');
        panel.innerHTML = '';
        ACTIONS.fishing.forEach(action => {
            const button = this.createGatheringButton(
                action.id,
                action.name,
                'Fishing',
                action.levelReq,
                action.item,
                action.xp
            );
            panel.appendChild(button);
        });
    }

    renderFiremaking() {
        const panel = document.getElementById(this.actionPanels.firemaking);
        if (!panel) return;

        this.showSection('firemaking');
        panel.innerHTML = '';
        ACTIONS.firemaking.forEach(action => {
            const button = this.createFiremakingButton(
                action.id,
                action.name,
                action.levelReq,
                action.cost,
                action.costAmount,
                action.xp
            );
            panel.appendChild(button);
        });
    }

    renderSmithing() {
        const panel = document.getElementById(this.actionPanels.smithing);
        if (!panel) return;

        this.showSection('smithing');
        panel.innerHTML = '';
        ACTIONS.smithing.forEach(action => {
            const button = this.createProductionButton(
                action.id,
                action.name,
                'Smithing',
                action.levelReq,
                action.cost,
                action.costAmount,
                action.produces,
                action.producesAmount,
                action.xp
            );
            panel.appendChild(button);
        });
    }

    renderFletching() {
        const panel = document.getElementById(this.actionPanels.fletching);
        if (!panel) return;

        this.showSection('fletching');
        panel.innerHTML = '';
        ACTIONS.fletching.forEach(action => {
            const button = this.createProductionButton(
                action.id,
                action.name,
                'Fletching',
                action.levelReq,
                action.cost,
                action.costAmount,
                action.produces,
                action.producesAmount,
                action.xp
            );
            panel.appendChild(button);
        });
    }

    renderCooking() {
        const panel = document.getElementById(this.actionPanels.cooking);
        if (!panel) return;

        this.showSection('cooking');
        panel.innerHTML = '';
        ACTIONS.cooking.forEach(action => {
            const button = this.createProductionButton(
                action.id,
                action.name,
                'Cooking',
                action.levelReq,
                action.cost,
                action.costAmount,
                action.produces,
                action.producesAmount,
                action.xp
            );
            panel.appendChild(button);
        });
    }

    renderCombat() {
        const panel = document.getElementById(this.actionPanels.combat);
        if (!panel) return;

        this.showSection('combat');
        const currentEnemy = gameState.getCurrentActivity().target;

        if (currentEnemy) {
            panel.innerHTML = this.renderEnemyHealthBar(currentEnemy);
        } else {
            // Show static enemy info
            const goblinTemplate = ENEMY_TEMPLATES.Goblin;
            panel.innerHTML = `
                <div class="p-2 bg-gray-800 rounded-lg mb-2">
                    <h4 class="text-base font-bold text-white mb-1">Goblin Info</h4>
                    <ul class="text-xs text-gray-300 space-y-0.5">
                        <li>Level: <span class="text-yellow-300">${goblinTemplate.level}</span></li>
                        <li>Health: <span class="text-red-300">${goblinTemplate.maxHealth}</span></li>
                        <li>Attack: <span class="text-red-300">${goblinTemplate.attack}</span></li>
                        <li>Defense: <span class="text-blue-300">${goblinTemplate.defense}</span></li>
                    </ul>
                </div>
            `;
        }

        // Add combat buttons
        ACTIONS.combat.forEach(action => {
            const button = this.createCombatButton(
                action.id,
                action.name,
                action.levelReq,
                action.enemy
            );
            panel.appendChild(button);
        });
    }

    renderEnemyHealthBar(enemy) {
        const healthPercent = (enemy.currentHealth / enemy.maxHealth) * 100;
        return `
            <div class="p-2 bg-gray-800 rounded-lg mb-2 text-center">
                <h4 class="text-base font-bold text-red-400">${enemy.name} (Lvl ${enemy.level})</h4>
                <div class="text-xs text-gray-300 mb-1">
                    HP: ${enemy.currentHealth}/${enemy.maxHealth}
                </div>
                <div class="w-full bg-gray-600 rounded-full h-3">
                    <div class="bg-red-500 h-3 rounded-full transition-all duration-300 ease-linear"
                        style="width: ${healthPercent}%;"></div>
                </div>
                <div class="mt-1 text-xs text-gray-400">
                    <span class="text-red-300">A:${enemy.attack}</span> |
                    <span class="text-blue-300">D:${enemy.defense}</span>
                </div>
            </div>
        `;
    }

    renderStopButton() {
        if (!this.stopActionContainer) {
            console.error('Stop action container not found!');
            return;
        }

        this.stopActionContainer.innerHTML = '';

        if (activitySystem.isActivityRunning()) {
            const stopBtn = document.createElement('button');
            stopBtn.textContent = 'Stop Activity';
            stopBtn.className = `w-full text-white py-2 px-2 rounded-lg shadow-md font-semibold text-xs transition-all duration-200
                                bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800`;
            stopBtn.onclick = () => {
                activitySystem.stopActivity(true);
            };

            this.stopActionContainer.appendChild(stopBtn);
        }
    }

    createGatheringButton(id, text, skill, levelReq, item, xp) {
        const button = document.createElement('button');
        button.id = `action-${id}`;
        button.textContent = text;
        button.className = 'w-full text-white py-2 px-2 rounded-lg shadow-md transition-all duration-200 font-semibold text-xs';

        const isAvailable = gameState.getLevel(skill) >= levelReq;
        const isActive = activitySystem.isActivityRunning();

        if (isAvailable) {
            button.disabled = isActive;
            button.onclick = () => activitySystem.startGathering(skill, item, xp, levelReq);

            if (button.disabled) {
                button.classList.add('bg-gray-500', 'cursor-not-allowed', 'opacity-60');
            } else {
                button.classList.add('bg-green-600', 'hover:bg-green-700', 'active:bg-green-800');
            }
        } else {
            button.disabled = true;
            button.classList.add('bg-gray-500', 'cursor-not-allowed', 'opacity-50');
            button.textContent = `${text} (Req: Lvl ${levelReq} ${skill})`;
        }

        return button;
    }

    createProductionButton(id, text, skill, levelReq, costItem, costAmount, producedItem, producedAmount, xp) {
        const button = document.createElement('button');
        button.id = `action-${id}`;
        button.textContent = text;
        button.className = 'w-full text-white py-2 px-2 rounded-lg shadow-md transition-all duration-200 font-semibold text-xs';

        const isAvailable = gameState.getLevel(skill) >= levelReq;
        const isActive = activitySystem.isActivityRunning();

        if (isAvailable) {
            button.disabled = isActive;
            button.onclick = () => activitySystem.startProduction(skill, text, xp, levelReq, costItem, costAmount, producedItem, producedAmount);

            if (button.disabled) {
                button.classList.add('bg-gray-500', 'cursor-not-allowed', 'opacity-60');
            } else {
                button.classList.add('bg-blue-600', 'hover:bg-blue-700', 'active:bg-blue-800');
            }
        } else {
            button.disabled = true;
            button.classList.add('bg-gray-500', 'cursor-not-allowed', 'opacity-50');
            button.textContent = `${text} (Req: Lvl ${levelReq} ${skill})`;
        }

        return button;
    }

    createFiremakingButton(id, text, levelReq, costItem, costAmount, xp) {
        const button = document.createElement('button');
        button.id = `action-${id}`;
        button.textContent = text;
        button.className = 'w-full text-white py-2 px-2 rounded-lg shadow-md transition-all duration-200 font-semibold text-xs';

        const isAvailable = gameState.getLevel('Firemaking') >= levelReq;

        if (isAvailable) {
            button.onclick = () => activitySystem.startFiremaking(text, xp, levelReq, costItem, costAmount);
            button.classList.add('bg-blue-600', 'hover:bg-blue-700', 'active:bg-blue-800');
        } else {
            button.disabled = true;
            button.classList.add('bg-gray-500', 'cursor-not-allowed', 'opacity-50');
            button.textContent = `${text} (Req: Lvl ${levelReq} Firemaking)`;
        }

        return button;
    }

    createCombatButton(id, text, levelReq, enemy) {
        const button = document.createElement('button');
        button.id = `action-${id}`;
        button.textContent = text;
        button.className = 'w-full text-white py-2 px-2 rounded-lg shadow-md transition-all duration-200 font-semibold text-xs';

        const isAvailable = gameState.getLevel('Attack') >= levelReq;
        const isActive = activitySystem.isActivityRunning();

        if (isAvailable) {
            button.disabled = isActive;
            button.onclick = () => activitySystem.startCombat(enemy);

            if (button.disabled) {
                button.classList.add('bg-gray-500', 'cursor-not-allowed', 'opacity-60');
            } else {
                button.classList.add('bg-red-600', 'hover:bg-red-700', 'active:bg-red-800');
            }
        } else {
            button.disabled = true;
            button.classList.add('bg-gray-500', 'cursor-not-allowed', 'opacity-50');
            button.textContent = `${text} (Req: Lvl ${levelReq} Attack)`;
        }

        return button;
    }
}

export const actionsUI = new ActionsUI();
