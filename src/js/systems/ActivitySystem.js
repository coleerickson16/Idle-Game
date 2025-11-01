/**
 * ActivitySystem.js
 * Manages player activities (gathering, production, combat)
 */

import { gameState } from '../core/GameState.js';
import { skillSystem } from './SkillSystem.js';
import { inventorySystem } from './InventorySystem.js';
import { combatSystem } from './CombatSystem.js';
import { GAME_CONFIG } from '../data/GameData.js';

class ActivitySystem {
    /**
     * Start a gathering activity (woodcutting, mining)
     */
    startGathering(skill, itemName, xpGain, levelReq) {
        this.stopActivity();

        if (gameState.getLevel(skill) < levelReq) {
            this.dispatchActivityError(`You need ${skill} Level ${levelReq}.`);
            return false;
        }

        const interval = setInterval(() => {
            if (gameState.getLevel(skill) < levelReq) {
                this.dispatchActivityError(`You no longer meet the level requirement for ${itemName}.`);
                this.stopActivity();
                return;
            }

            skillSystem.gainXp(skill, xpGain);
            inventorySystem.addItem(itemName, 1);

            this.dispatchGatheringTick(skill, itemName, xpGain);
        }, GAME_CONFIG.GATHERING_INTERVAL);

        gameState.setActivity({
            name: `Gathering ${itemName}`,
            interval,
            skill,
        });

        this.dispatchActivityStart(`Gathering ${itemName}`);
        return true;
    }

    /**
     * Start a production activity (smithing, fletching, firemaking)
     */
    startProduction(skill, itemName, xpGain, levelReq, costItem, costAmount, producedItem, producedAmount) {
        this.stopActivity();

        if (gameState.getLevel(skill) < levelReq) {
            this.dispatchActivityError(`You need ${skill} Level ${levelReq} to make ${itemName}.`);
            return false;
        }

        if (!inventorySystem.hasItem(costItem, costAmount)) {
            this.dispatchActivityError(`You need ${costAmount}x ${costItem}.`);
            return false;
        }

        const interval = setInterval(() => {
            if (!inventorySystem.hasItem(costItem, costAmount)) {
                this.dispatchActivityError(`You ran out of ${costItem}!`);
                this.stopActivity();
                return;
            }

            inventorySystem.removeItem(costItem, costAmount);
            if (producedItem) {
                inventorySystem.addItem(producedItem, producedAmount);
            }
            skillSystem.gainXp(skill, xpGain);

            this.dispatchProductionTick(skill, itemName, costItem, costAmount, producedItem, producedAmount, xpGain);
        }, GAME_CONFIG.PRODUCTION_INTERVAL);

        gameState.setActivity({
            name: `${skill} ${itemName}`,
            interval,
            skill,
        });

        this.dispatchActivityStart(`${skill} ${itemName}`);
        return true;
    }

    /**
     * Start firemaking (one-time action)
     */
    startFiremaking(itemName, xpGain, levelReq, costItem, costAmount) {
        if (!inventorySystem.hasItem(costItem, costAmount)) {
            this.dispatchActivityError(`You need ${costAmount}x ${costItem} to light a fire.`);
            return false;
        }

        if (gameState.getLevel('Firemaking') < levelReq) {
            this.dispatchActivityError(`You need Firemaking Level ${levelReq}.`);
            return false;
        }

        inventorySystem.removeItem(costItem, costAmount);
        skillSystem.gainXp('Firemaking', xpGain);

        this.dispatchFiremakingSuccess(itemName, xpGain);

        return true;
    }

    /**
     * Start combat
     */
    startCombat(enemyName) {
        this.stopActivity();

        const enemy = combatSystem.createEnemy(enemyName);
        gameState.setActivity({
            name: `Fighting ${enemyName}`,
            target: enemy,
        });

        const interval = setInterval(() => {
            // Player attacks
            combatSystem.playerAttack(enemy);

            // Check if enemy defeated
            const checkResult = combatSystem.checkCombatEnd(enemy);
            if (checkResult.ended) {
                clearInterval(interval);
                gameState.clearActivity();

                if (checkResult.result === 'victory') {
                    combatSystem.handleVictory(enemy);
                }

                this.dispatchActivityStop('Combat');
                return;
            }

            // Enemy attacks
            combatSystem.enemyAttack(enemy);

            // Check if player defeated
            const playerCheckResult = combatSystem.checkCombatEnd(enemy);
            if (playerCheckResult.ended && playerCheckResult.result === 'defeat') {
                clearInterval(interval);
                gameState.clearActivity();
                combatSystem.handleDefeat(enemy);
                this.dispatchActivityStop('Combat');
                return;
            }

        }, GAME_CONFIG.COMBAT_INTERVAL);

        gameState.player.currentActivity.interval = interval;

        this.dispatchActivityStart(`Fighting ${enemyName}`);
        return true;
    }

    /**
     * Stop current activity
     */
    stopActivity(logCessation = true) {
        const activityName = gameState.getCurrentActivity().name;

        if (gameState.getCurrentActivity().interval) {
            clearInterval(gameState.getCurrentActivity().interval);
        }

        gameState.clearActivity();

        if (logCessation && activityName !== 'Idle') {
            this.dispatchActivityStop(activityName);
        }
    }

    /**
     * Check if an activity is running
     */
    isActivityRunning() {
        return gameState.getCurrentActivity().interval !== null;
    }

    /**
     * Get current activity name
     */
    getCurrentActivityName() {
        return gameState.getCurrentActivity().name;
    }

    // Event dispatching
    dispatchActivityStart(activityName) {
        window.dispatchEvent(new CustomEvent('activityStarted', {
            detail: { activityName }
        }));
    }

    dispatchActivityStop(activityName) {
        window.dispatchEvent(new CustomEvent('activityStopped', {
            detail: { activityName }
        }));
    }

    dispatchActivityError(message) {
        window.dispatchEvent(new CustomEvent('activityError', {
            detail: { message }
        }));
    }

    dispatchGatheringTick(skill, itemName, xpGain) {
        window.dispatchEvent(new CustomEvent('gatheringTick', {
            detail: { skill, itemName, xpGain }
        }));
    }

    dispatchProductionTick(skill, itemName, costItem, costAmount, producedItem, producedAmount, xpGain) {
        window.dispatchEvent(new CustomEvent('productionTick', {
            detail: { skill, itemName, costItem, costAmount, producedItem, producedAmount, xpGain }
        }));
    }

    dispatchFiremakingSuccess(itemName, xpGain) {
        window.dispatchEvent(new CustomEvent('firemakingSuccess', {
            detail: { itemName, xpGain }
        }));
    }
}

export const activitySystem = new ActivitySystem();
