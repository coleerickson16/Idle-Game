/**
 * UIManager.js
 * Coordinates all UI components and handles game events
 */

import { logUI } from './LogUI.js';
import { skillsUI } from './SkillsUI.js';
import { inventoryUI } from './InventoryUI.js';
import { equipmentUI } from './EquipmentUI.js';
import { actionsUI } from './ActionsUI.js';
import { mapUI } from './MapUI.js';
import { locationSystem } from '../systems/LocationSystem.js';

class UIManager {
    initialize() {
        // Initialize location system first
        locationSystem.init();

        // Initialize all UI components
        logUI.initialize('log');
        skillsUI.initialize('skills-panel', 'activity-status');
        inventoryUI.initialize('inventory-panel');
        equipmentUI.initialize('equipment-panel');
        actionsUI.initialize({
            woodcutting: 'woodcutting-actions',
            mining: 'mining-actions',
            fishing: 'fishing-actions',
            firemaking: 'firemaking-actions',
            smithing: 'smithing-actions',
            fletching: 'fletching-actions',
            cooking: 'cooking-actions',
            combat: 'combat-actions',
        }, 'stop-action-container');
        mapUI.init();

        // Set up event listeners
        this.setupEventListeners();

        // Initial render
        this.renderAll();

        logUI.log('Game initialized. Welcome, adventurer!', 'success');
        logUI.log('Game is ready. Start by exploring the world!', 'info');
    }

    renderAll() {
        mapUI.render();
        skillsUI.render();
        inventoryUI.render();
        equipmentUI.render();
        actionsUI.render();
    }

    setupEventListeners() {
        // Skill events
        window.addEventListener('skillLevelUp', (e) => this.handleSkillLevelUp(e));
        window.addEventListener('skillXpGain', (e) => this.handleSkillXpGain(e));
        window.addEventListener('healthUpdated', (e) => this.handleHealthUpdate(e));

        // Inventory events
        window.addEventListener('inventoryUpdated', () => this.handleInventoryUpdate());

        // Equipment events
        window.addEventListener('itemEquipped', (e) => this.handleItemEquipped(e));
        window.addEventListener('itemUnequipped', (e) => this.handleItemUnequipped(e));
        window.addEventListener('equipError', (e) => this.handleEquipError(e));

        // Activity events
        window.addEventListener('activityStarted', (e) => this.handleActivityStarted(e));
        window.addEventListener('activityStopped', (e) => this.handleActivityStopped(e));
        window.addEventListener('activityError', (e) => this.handleActivityError(e));
        window.addEventListener('gatheringTick', (e) => this.handleGatheringTick(e));
        window.addEventListener('productionTick', (e) => this.handleProductionTick(e));
        window.addEventListener('firemakingSuccess', (e) => this.handleFiremakingSuccess(e));

        // Combat events
        window.addEventListener('playerAttack', (e) => this.handlePlayerAttack(e));
        window.addEventListener('enemyAttack', (e) => this.handleEnemyAttack(e));
        window.addEventListener('combatVictory', (e) => this.handleCombatVictory(e));
        window.addEventListener('combatDefeat', (e) => this.handleCombatDefeat(e));

        // Food events
        window.addEventListener('foodEaten', (e) => this.handleFoodEaten(e));
        window.addEventListener('eatError', (e) => this.handleEatError(e));

        // Location events
        window.addEventListener('location-change', (e) => this.handleLocationChange(e));
        window.addEventListener('travel-error', (e) => this.handleTravelError(e));
    }

    // Event handlers
    handleSkillLevelUp(e) {
        const { skill, newLevel } = e.detail;
        logUI.log(`🎉 Your ${skill} skill is now Level ${newLevel}!`, 'level');
        skillsUI.render();
        actionsUI.render();
    }

    handleSkillXpGain(e) {
        skillsUI.render();
    }

    handleHealthUpdate(e) {
        const { newMaxHp } = e.detail;
        logUI.log(`Your max Health increased to ${newMaxHp}! HP fully restored.`, 'success');
        skillsUI.render();
    }

    handleInventoryUpdate() {
        inventoryUI.render();
    }

    handleItemEquipped(e) {
        const { itemName, slot } = e.detail;
        logUI.log(`Equipped ${itemName} in the ${slot} slot!`, 'success');
        inventoryUI.render();
        equipmentUI.render();
        skillsUI.render();
    }

    handleItemUnequipped(e) {
        const { itemName, slot } = e.detail;
        logUI.log(`Unequipped ${itemName} from ${slot} slot.`, 'item');
        inventoryUI.render();
        equipmentUI.render();
        skillsUI.render();
    }

    handleEquipError(e) {
        const { message } = e.detail;
        logUI.log(message, 'error');
    }

    handleActivityStarted(e) {
        const { activityName } = e.detail;
        skillsUI.updateActivityStatus(activityName);
        actionsUI.render();
    }

    handleActivityStopped(e) {
        const { activityName } = e.detail;
        logUI.log(`Activity: ${activityName} has ceased.`, 'info');
        skillsUI.updateActivityStatus('Idle');
        actionsUI.render();
    }

    handleActivityError(e) {
        const { message } = e.detail;
        logUI.log(message, 'error');
    }

    handleGatheringTick(e) {
        const { skill, itemName, xpGain } = e.detail;
        logUI.log(`You successfully gathered 1x ${itemName}. (+${xpGain} ${skill} XP)`, 'item');
        // Ensure stop button stays visible during activity
        actionsUI.renderStopButton();
    }

    handleProductionTick(e) {
        const { skill, itemName, costItem, costAmount, producedItem, producedAmount, xpGain } = e.detail;
        logUI.log(`You successfully made ${producedAmount}x ${itemName}. (-${costAmount} ${costItem}, +${xpGain} ${skill} XP)`, 'item');
        // Ensure stop button stays visible during activity
        actionsUI.renderStopButton();
    }

    handleFiremakingSuccess(e) {
        const { itemName, xpGain } = e.detail;
        logUI.log(`🔥 You successfully lit a ${itemName} fire!`, 'success');
    }

    handlePlayerAttack(e) {
        const { enemy, damage } = e.detail;
        logUI.log(`You strike the ${enemy.name} for ${damage} damage.`, 'combat');
        actionsUI.render();
        skillsUI.render();
    }

    handleEnemyAttack(e) {
        const { enemy, damage } = e.detail;
        const currentHp = e.detail.enemy.currentHealth; // Use currentHealth from game state
        logUI.log(`The ${enemy.name} hits you back for ${damage} damage.`, 'combat');
        skillsUI.render();
    }

    handleCombatVictory(e) {
        const { enemy, loot } = e.detail;
        logUI.log(`⚔️ You defeated the ${enemy.name}!`, 'success');

        loot.forEach(({ item, amount, rarity }) => {
            if (rarity === 'rare') {
                logUI.log(`✨ RARE DROP: ${amount}x ${item}!`, 'success');
            } else {
                logUI.log(`💀 Received: ${amount}x ${item}`, 'item');
            }
        });

        const maxHp = e.detail.enemy.maxHealth; // Use from detail if needed
        logUI.log(`Your health has been restored.`, 'success');

        skillsUI.render();
        inventoryUI.render();
        actionsUI.render();
    }

    handleCombatDefeat(e) {
        const { enemy } = e.detail;
        logUI.log(`💀 You have been defeated by the ${enemy.name}.`, 'error');
        logUI.log(`You respawn with full health.`, 'info');
        skillsUI.render();
        actionsUI.render();
    }

    handleFoodEaten(e) {
        const { itemName, healAmount, newHP, maxHP } = e.detail;
        logUI.log(`🍴 You ate ${itemName} and restored ${healAmount} HP! (${newHP}/${maxHP})`, 'success');
        skillsUI.render();
        inventoryUI.render();
    }

    handleEatError(e) {
        const { message } = e.detail;
        logUI.log(message, 'error');
    }

    handleLocationChange(e) {
        const { oldLocation, newLocation, locationData } = e.detail;
        logUI.log(`🗺️ You travelled to ${locationData.emoji} ${locationData.name}`, 'success');
        mapUI.render();
        actionsUI.render();
    }

    handleTravelError(e) {
        const { reason } = e.detail;
        logUI.log(`Cannot travel: ${reason}`, 'error');
    }
}

export const uiManager = new UIManager();
