/**
 * FoodSystem.js
 * Handles food consumption and healing
 */

import { gameState } from '../core/GameState.js';
import { skillSystem } from './SkillSystem.js';
import { inventorySystem } from './InventorySystem.js';
import { FOOD_DATA } from '../data/GameData.js';

class FoodSystem {
    /**
     * Check if an item is food
     */
    isFood(itemName) {
        return FOOD_DATA[itemName] !== undefined;
    }

    /**
     * Get healing amount for a food item
     */
    getHealAmount(itemName) {
        const foodData = FOOD_DATA[itemName];
        return foodData ? foodData.healsHP : 0;
    }

    /**
     * Eat a food item to restore HP
     */
    eatFood(itemName) {
        // Check if item exists in inventory
        if (!inventorySystem.hasItem(itemName, 1)) {
            this.dispatchEatError(`You don't have any ${itemName} to eat.`);
            return false;
        }

        // Check if item is food
        if (!this.isFood(itemName)) {
            this.dispatchEatError(`${itemName} is not edible.`);
            return false;
        }

        // Get current and max HP
        const currentHP = gameState.getCurrentHealth();
        const maxHP = skillSystem.getMaxHealth();

        // Check if already at full health
        if (currentHP >= maxHP) {
            this.dispatchEatError(`You are already at full health.`);
            return false;
        }

        // Get heal amount
        const healAmount = this.getHealAmount(itemName);

        // Remove food from inventory
        inventorySystem.removeItem(itemName, 1);

        // Heal player (capped at max HP)
        const newHP = Math.min(currentHP + healAmount, maxHP);
        const actualHealed = newHP - currentHP;
        gameState.setCurrentHealth(newHP);

        // Dispatch success event
        this.dispatchEatSuccess(itemName, actualHealed, newHP, maxHP);

        return true;
    }

    // Event dispatching
    dispatchEatSuccess(itemName, healAmount, newHP, maxHP) {
        window.dispatchEvent(new CustomEvent('foodEaten', {
            detail: { itemName, healAmount, newHP, maxHP }
        }));
    }

    dispatchEatError(message) {
        window.dispatchEvent(new CustomEvent('eatError', {
            detail: { message }
        }));
    }
}

export const foodSystem = new FoodSystem();
