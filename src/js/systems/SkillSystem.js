/**
 * SkillSystem.js
 * Handles XP gains, level ups, and skill calculations
 */

import { gameState } from '../core/GameState.js';
import { EQUIPMENT_STATS } from '../data/GameData.js';

class SkillSystem {
    /**
     * Calculates total XP required to reach a specific level
     */
    getXpForLevel(level) {
        if (level <= 1) return 0;
        const totalXp = 10 * level * level + 53 * level - 63;
        return Math.floor(totalXp);
    }

    /**
     * Gets XP required for next level
     */
    getNextLevelXp(skill) {
        const nextLevel = gameState.getLevel(skill) + 1;
        return this.getXpForLevel(nextLevel);
    }

    /**
     * Gets the player's maximum health based on Hitpoints level
     */
    getMaxHealth() {
        return gameState.getLevel('Hitpoints') * 10;
    }

    /**
     * Calculates total equipment bonus for a stat type
     */
    getTotalEquipmentBonus(statType) {
        let bonus = 0;
        const bonusKey = `${statType.toLowerCase()}Bonus`;

        Object.keys(gameState.player.equipment).forEach(slot => {
            const itemName = gameState.getEquipment(slot);
            if (itemName && EQUIPMENT_STATS[itemName]) {
                bonus += EQUIPMENT_STATS[itemName][bonusKey] || 0;
            }
        });

        return bonus;
    }

    /**
     * Gets effective stat (base + equipment bonuses)
     */
    getEffectiveStat(statName) {
        const baseValue = gameState.getLevel(statName);

        if (statName === 'Attack' || statName === 'Defense') {
            return baseValue + this.getTotalEquipmentBonus(statName);
        }

        return baseValue;
    }

    /**
     * Checks if player leveled up and handles level up
     * Returns true if leveled up
     */
    checkLevelUp(skill) {
        let leveledUp = false;
        let currentLevel = gameState.getLevel(skill);
        let xpNeeded = this.getXpForLevel(currentLevel + 1);

        while (gameState.getXP(skill) >= xpNeeded) {
            currentLevel++;
            gameState.setLevel(skill, currentLevel);
            xpNeeded = this.getXpForLevel(currentLevel + 1);
            leveledUp = true;

            // Dispatch level up event
            this.dispatchLevelUp(skill, currentLevel);

            // Special handling for Hitpoints
            if (skill === 'Hitpoints') {
                const newMaxHp = this.getMaxHealth();
                gameState.setCurrentHealth(newMaxHp);
                this.dispatchHealthUpdate(newMaxHp);
            }
        }

        return leveledUp;
    }

    /**
     * Awards XP to a skill and checks for level ups
     */
    gainXp(skill, amount) {
        gameState.addXP(skill, amount);
        const leveledUp = this.checkLevelUp(skill);

        // Dispatch XP gain event
        this.dispatchXpGain(skill, amount, leveledUp);

        return leveledUp;
    }

    // Event dispatching (for UI updates)
    dispatchLevelUp(skill, newLevel) {
        window.dispatchEvent(new CustomEvent('skillLevelUp', {
            detail: { skill, newLevel }
        }));
    }

    dispatchXpGain(skill, amount, leveledUp) {
        window.dispatchEvent(new CustomEvent('skillXpGain', {
            detail: { skill, amount, leveledUp }
        }));
    }

    dispatchHealthUpdate(newMaxHp) {
        window.dispatchEvent(new CustomEvent('healthUpdated', {
            detail: { newMaxHp }
        }));
    }
}

export const skillSystem = new SkillSystem();
