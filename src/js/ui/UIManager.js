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
import { hotbarUI } from './HotbarUI.js';
import { combatUI } from './CombatUI.js';
import { bankUI } from './BankUI.js';
import { merchantUI } from './MerchantUI.js';
import { collectionLogUI } from './CollectionLogUI.js';
import { locationSystem } from '../systems/LocationSystem.js';
import { notificationSystem } from '../systems/NotificationSystem.js';
import { activitySystem } from '../systems/ActivitySystem.js';
import { gameState } from '../core/GameState.js';

class UIManager {
    initialize() {
        // Initialize location system first
        locationSystem.init();

        // Initialize all UI components
        logUI.initialize('log');
        skillsUI.initialize('skills-panel', 'activity-status');
        inventoryUI.initialize('inventory-panel');
        equipmentUI.initialize('equipment-panel');
        collectionLogUI.init('collection-panel');
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
        hotbarUI.init();
        combatUI.init();
        notificationSystem.init();

        // Set up event listeners
        this.setupEventListeners();
        this.setupModalListeners();

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
        window.addEventListener('inventoryError', (e) => this.handleInventoryError(e));

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

        // Hotbar events
        window.addEventListener('hotbar-update', () => {
            hotbarUI.render();
            // Also update combat UI hotbar if combat is active
            if (combatUI.getCurrentEnemy()) {
                combatUI.render();
            }
        });
        window.addEventListener('hotbar-error', (e) => logUI.log(e.detail.message, 'error'));

        // Bank events
        window.addEventListener('bankUpdated', (e) => this.handleBankUpdate(e));
        window.addEventListener('bankError', (e) => this.handleBankError(e));

        // Merchant events
        window.addEventListener('merchantTransaction', (e) => this.handleMerchantTransaction(e));
        window.addEventListener('merchantError', (e) => this.handleMerchantError(e));

        // Collection log events
        window.addEventListener('itemDiscovered', (e) => this.handleItemDiscovered(e));

        // Tile map events
        window.addEventListener('tileMapEntered', (e) => this.handleTileMapEntered(e));
        window.addEventListener('tileMapExited', (e) => this.handleTileMapExited(e));
        window.addEventListener('playerMoved', (e) => this.handlePlayerMoved(e));
        window.addEventListener('regionTransition', (e) => this.handleRegionTransition(e));
        window.addEventListener('tileResourceInteract', (e) => this.handleTileResourceInteract(e));
        window.addEventListener('tileLocationEnter', (e) => this.handleTileLocationEnter(e));
    }

    setupModalListeners() {
        // Character panel toggles
        const btnShowSkills = document.getElementById('btn-show-skills');
        const btnShowInventory = document.getElementById('btn-show-inventory');
        const btnShowEquipment = document.getElementById('btn-show-equipment');
        const btnShowCollection = document.getElementById('btn-show-collection');

        const skillsPanel = document.getElementById('skills-panel-inline');
        const inventoryPanel = document.getElementById('inventory-panel-inline');
        const equipmentPanel = document.getElementById('equipment-panel-inline');
        const collectionPanel = document.getElementById('collection-panel-inline');

        // Helper to show a specific panel and hide others
        const showPanel = (panelToShow) => {
            [skillsPanel, inventoryPanel, equipmentPanel, collectionPanel].forEach(panel => {
                if (panel) {
                    panel.classList.add('hidden');
                }
            });

            if (panelToShow) {
                panelToShow.classList.remove('hidden');

                // Render the appropriate UI
                if (panelToShow === skillsPanel) {
                    skillsUI.render();
                } else if (panelToShow === inventoryPanel) {
                    inventoryUI.render();
                } else if (panelToShow === equipmentPanel) {
                    equipmentUI.render();
                } else if (panelToShow === collectionPanel) {
                    collectionLogUI.render();
                }
            }
        };

        // Skills button
        if (btnShowSkills) {
            btnShowSkills.addEventListener('click', () => {
                showPanel(skillsPanel);
            });
        }

        // Inventory button
        if (btnShowInventory) {
            btnShowInventory.addEventListener('click', () => {
                showPanel(inventoryPanel);
            });
        }

        // Equipment button
        if (btnShowEquipment) {
            btnShowEquipment.addEventListener('click', () => {
                showPanel(equipmentPanel);
            });
        }

        // Collection button
        if (btnShowCollection) {
            btnShowCollection.addEventListener('click', () => {
                showPanel(collectionPanel);
            });
        }
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
        hotbarUI.render();
        // Also update combat UI hotbar if combat is active
        if (combatUI.getCurrentEnemy()) {
            combatUI.render();
        }
    }

    handleInventoryError(e) {
        const { message } = e.detail;
        logUI.log(message, 'error');
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

        // Show combat panel if starting combat
        if (activityName.includes('Goblin')) {
            // Get enemy from current activity
            const currentActivity = gameState.getCurrentActivity();
            const enemy = currentActivity.target;
            if (enemy) {
                combatUI.showCombatPanel(enemy);
            }
        }
    }

    handleActivityStopped(e) {
        const { activityName } = e.detail;
        logUI.log(`Activity: ${activityName} has ceased.`, 'info');
        skillsUI.updateActivityStatus('Idle');
        actionsUI.render();

        // Hide combat panel if stopping combat
        if (activityName.includes('Goblin')) {
            combatUI.hideCombatPanel();
        }
    }

    handleActivityError(e) {
        const { message } = e.detail;
        logUI.log(message, 'error');
    }

    handleGatheringTick(e) {
        const { skill, itemName, xpGain } = e.detail;
        logUI.log(`You successfully gathered 1x ${itemName}. (+${xpGain} ${skill} XP)`, 'item');
        // Show floating notification
        notificationSystem.showResourceGain(itemName, 1);
        // Ensure stop button stays visible during activity
        actionsUI.renderStopButton();
    }

    handleProductionTick(e) {
        const { skill, itemName, costItem, costAmount, producedItem, producedAmount, xpGain } = e.detail;
        logUI.log(`You successfully made ${producedAmount}x ${itemName}. (-${costAmount} ${costItem}, +${xpGain} ${skill} XP)`, 'item');
        // Show floating notification for produced item
        notificationSystem.showResourceGain(producedItem, producedAmount);
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

        // Update combat UI
        combatUI.recordPlayerDamage(damage);
        this.createFloatingDamage(damage, true);

        actionsUI.render();
        skillsUI.render();
    }

    handleEnemyAttack(e) {
        const { enemy, damage } = e.detail;
        const currentHp = e.detail.enemy.currentHealth; // Use currentHealth from game state
        logUI.log(`The ${enemy.name} hits you back for ${damage} damage.`, 'combat');

        // Update combat UI
        combatUI.recordEnemyDamage(damage);
        this.createFloatingDamage(damage, false);

        skillsUI.render();
    }

    handleCombatVictory(e) {
        const { enemy, loot } = e.detail;

        // Get combat stats before hiding panel
        const stats = combatUI.getCombatStats();
        const avgDamageDealt = stats.hitsLanded > 0 ? (stats.totalDamageDealt / stats.hitsLanded).toFixed(1) : 0;
        const avgDamageTaken = stats.hitsTaken > 0 ? (stats.totalDamageTaken / stats.hitsTaken).toFixed(1) : 0;

        logUI.log(`⚔️ You defeated the ${enemy.name}!`, 'success');

        loot.forEach(({ item, amount, rarity }) => {
            if (rarity === 'rare') {
                logUI.log(`✨ RARE DROP: ${amount}x ${item}!`, 'success');
            } else {
                logUI.log(`💀 Received: ${amount}x ${item}`, 'item');
            }
        });

        // Log combat summary
        logUI.log(`📊 Combat Summary: ${stats.totalDamageDealt} damage dealt (${avgDamageDealt} avg), ${stats.totalDamageTaken} taken (${avgDamageTaken} avg), ${stats.turnCount} turns`, 'info');
        logUI.log(`Your health has been restored.`, 'success');

        // Hide combat panel after a short delay
        setTimeout(() => {
            combatUI.hideCombatPanel();
        }, 2000);

        skillsUI.render();
        inventoryUI.render();
        actionsUI.render();
    }

    handleCombatDefeat(e) {
        const { enemy, lostItems } = e.detail;

        // Get combat stats before hiding panel
        const stats = combatUI.getCombatStats();
        const avgDamageDealt = stats.hitsLanded > 0 ? (stats.totalDamageDealt / stats.hitsLanded).toFixed(1) : 0;
        const avgDamageTaken = stats.hitsTaken > 0 ? (stats.totalDamageTaken / stats.hitsTaken).toFixed(1) : 0;

        logUI.log(`💀 You have been defeated by the ${enemy.name}.`, 'error');

        // Log lost items
        if (lostItems && lostItems.length > 0) {
            lostItems.forEach(({ name, count }) => {
                logUI.log(`💔 You lost ${count}x ${name}!`, 'error');
            });
            logUI.log(`⚠️ Items in the bank are safe from death penalties.`, 'info');
        }

        // Log combat summary
        logUI.log(`📊 Combat Summary: ${stats.totalDamageDealt} damage dealt (${avgDamageDealt} avg), ${stats.totalDamageTaken} taken (${avgDamageTaken} avg), ${stats.turnCount} turns`, 'info');
        logUI.log(`You respawn with full health.`, 'info');

        // Hide combat panel after a short delay
        setTimeout(() => {
            combatUI.hideCombatPanel();
        }, 2000);

        skillsUI.render();
        actionsUI.render();
    }

    handleFoodEaten(e) {
        const { itemName, healAmount, newHP, maxHP } = e.detail;
        logUI.log(`🍴 You ate ${itemName} and restored ${healAmount} HP! (${newHP}/${maxHP})`, 'success');
        skillsUI.render();
        inventoryUI.render();
        // Also update combat UI if combat is active
        if (combatUI.getCurrentEnemy()) {
            combatUI.render();
        }
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

    handleBankUpdate(e) {
        const { action, itemName, amount } = e.detail;
        if (action === 'deposit') {
            logUI.log(`🏦 Deposited ${amount}x ${itemName} to the bank.`, 'success');
        } else if (action === 'withdraw') {
            logUI.log(`🏦 Withdrew ${amount}x ${itemName} from the bank.`, 'success');
        }
        // Re-render both inventory and bank UI
        inventoryUI.render();
        actionsUI.render(); // This will re-render the bank UI if we're at the bank
    }

    handleBankError(e) {
        const { message } = e.detail;
        logUI.log(message, 'error');
    }

    handleMerchantTransaction(e) {
        const { action, itemName, quantity, value } = e.detail;
        if (action === 'buy') {
            logUI.log(`🛒 Bought ${quantity}x ${itemName} for ${value} coins.`, 'success');
        } else if (action === 'sell') {
            logUI.log(`💰 Sold ${quantity}x ${itemName} for ${value} coins.`, 'success');
        }
        // Re-render both inventory and merchant UI
        inventoryUI.render();
        actionsUI.render(); // This will re-render the merchant UI if we're at the merchant
    }

    handleMerchantError(e) {
        const { message } = e.detail;
        logUI.log(message, 'error');
    }

    handleItemDiscovered(e) {
        const { itemName, totalDiscovered, totalItems, percentage } = e.detail;
        logUI.log(`📚 New discovery! ${itemName} added to collection log (${totalDiscovered}/${totalItems} - ${percentage}%)`, 'success');
        // Update collection log UI if it's currently visible
        const collectionPanel = document.getElementById('collection-panel-inline');
        if (collectionPanel && !collectionPanel.classList.contains('hidden')) {
            collectionLogUI.render();
        }
    }

    // Tile map event handlers
    handleTileMapEntered(e) {
        const { regionId, regionName } = e.detail;
        logUI.log(`🗺️ Entering ${regionName} exploration mode...`, 'info');
        mapUI.render(); // Re-render to show tile map
    }

    handleTileMapExited(e) {
        const { regionId, regionName } = e.detail;
        logUI.log(`🌍 Returned to world map from ${regionName}`, 'info');
        mapUI.render(); // Re-render to show world map
    }

    handlePlayerMoved(e) {
        const { oldPosition, newPosition } = e.detail;
        // Render tile map to update player position
        mapUI.render();
    }

    handleRegionTransition(e) {
        const { fromRegion, toRegion } = e.detail;
        logUI.log(`🚪 Transitioning to ${toRegion}...`, 'info');
        mapUI.render();
    }

    handleTileResourceInteract(e) {
        const { action } = e.detail;
        // Start the gathering activity using the activity system
        if (action.type === 'resource') {
            const success = activitySystem.startGathering(
                action.skill,
                action.item,
                action.xp,
                action.levelReq
            );
            if (success) {
                logUI.log(`⛏️ You start gathering ${action.item}...`, 'info');
            }
        }
    }

    handleTileLocationEnter(e) {
        const { locationId } = e.detail;
        // Travel to the building/location
        const canTravel = locationSystem.canTravelTo(locationId);
        if (canTravel.success) {
            locationSystem.travelTo(locationId);
        } else {
            logUI.log(`Cannot enter: ${canTravel.reason}`, 'error');
        }
    }

    /**
     * Create floating damage number animation
     * Player damage appears on right side (enemy taking damage)
     * Enemy damage appears on left side (player taking damage)
     */
    createFloatingDamage(damage, isPlayerDamage) {
        const container = document.getElementById('floating-damage-container');
        if (!container) return;

        const damageEl = document.createElement('div');
        damageEl.className = `floating-damage ${isPlayerDamage ? 'damage-dealt' : 'damage-taken'}`;
        damageEl.textContent = isPlayerDamage ? `-${damage}` : `-${damage}`;

        // Position consistently based on who dealt damage
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Consistent positioning: player damage on right, enemy damage on left
        let baseX, baseY;

        if (isPlayerDamage) {
            // Player damage dealt - appears on right side (enemy side)
            baseX = screenWidth * 0.65;
        } else {
            // Enemy damage dealt - appears on left side (player side)
            baseX = screenWidth * 0.35;
        }

        baseY = screenHeight * 0.4;

        // Small random variance for stacking
        const offsetX = (Math.random() - 0.5) * 60;
        const offsetY = (Math.random() - 0.5) * 40;

        damageEl.style.left = `${baseX + offsetX}px`;
        damageEl.style.top = `${baseY + offsetY}px`;

        container.appendChild(damageEl);

        // Remove after animation
        setTimeout(() => {
            damageEl.remove();
        }, 2000);
    }
}

export const uiManager = new UIManager();
