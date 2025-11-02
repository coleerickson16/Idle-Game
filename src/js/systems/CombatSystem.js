/**
 * CombatSystem.js
 * Handles combat mechanics, damage calculation, and loot
 */

import { gameState } from '../core/GameState.js';
import { skillSystem } from './SkillSystem.js';
import { inventorySystem } from './InventorySystem.js';
import { ENEMY_TEMPLATES } from '../data/GameData.js';

class CombatSystem {
    /**
     * Calculate damage for an attack - SIMPLIFIED SYSTEM
     *
     * Damage Formula:
     * 1. Max Hit = Attacker's offensive power (Attack + Strength for player, or enemy attack stat)
     * 2. Roll random damage from 1 to Max Hit
     * 3. Defender reduces damage by Defense/2 (rounded down)
     * 4. Minimum damage is always 1
     *
     * This makes every stat level meaningful and easy to understand!
     */
    rollHit(maxHit, defenderDefense) {
        // Roll damage from 1 to max hit
        const rawDamage = Math.floor(Math.random() * maxHit) + 1;

        // Defense reduces damage by Defense/2 (flat reduction)
        const defenseReduction = Math.floor(defenderDefense / 2);
        const finalDamage = Math.max(1, rawDamage - defenseReduction);

        return finalDamage;
    }

    /**
     * Roll for loot drops from a defeated enemy
     */
    rollLoot(enemyName) {
        const loot = [];

        if (enemyName === 'Goblin') {
            // Always drop bones
            inventorySystem.addItem('Bones', 1);
            loot.push({ item: 'Bones', amount: 1, rarity: 'common' });

            // Roll for additional loot
            const roll = Math.random();

            if (roll < 1/12) {
                // Rare drop: Goblin Dagger (~8.33% chance)
                inventorySystem.addItem('GoblinDagger', 1);
                loot.push({ item: 'GoblinDagger', amount: 1, rarity: 'rare' });
            } else if (roll < 0.5) {
                // Common drop: Coins (50% chance after dagger roll)
                inventorySystem.addItem('Coins', 5);
                loot.push({ item: 'Coins', amount: 5, rarity: 'common' });
            }
        }

        return loot;
    }

    /**
     * Create an enemy instance from a template
     */
    createEnemy(enemyName) {
        const template = ENEMY_TEMPLATES[enemyName];
        if (!template) {
            throw new Error(`Enemy template not found: ${enemyName}`);
        }

        return {
            name: template.name,
            level: template.level,
            maxHealth: template.maxHealth,
            currentHealth: template.maxHealth,
            attack: template.attack,
            defense: template.defense,
        };
    }

    /**
     * Process player attack on enemy
     *
     * Your Max Hit = (Attack level + weapon bonus) + (Strength level)
     * Example: Attack 5 + Dagger (+3) + Strength 5 = Max Hit 13
     * You can deal 1-13 damage before enemy defense
     */
    playerAttack(enemy) {
        // Calculate your offensive power (Attack + Strength)
        const playerAttack = skillSystem.getEffectiveStat('Attack'); // Includes equipment
        const playerStrength = gameState.getLevel('Strength');
        const maxHit = playerAttack + playerStrength;

        // Roll damage and apply enemy defense
        const damage = this.rollHit(maxHit, enemy.defense);

        enemy.currentHealth -= damage;
        enemy.currentHealth = Math.max(0, enemy.currentHealth);

        // Grant XP (2 XP per damage dealt)
        const xpGained = Math.max(2, damage * 2);
        skillSystem.gainXp('Attack', xpGained);
        skillSystem.gainXp('Strength', xpGained);

        this.dispatchPlayerAttack(enemy, damage, xpGained);

        return damage;
    }

    /**
     * Process enemy attack on player
     *
     * Enemy Max Hit = Enemy's attack stat
     * Your Defense = Defense level + armor bonus
     * Defense reduces damage by Defense/2
     */
    enemyAttack(enemy) {
        // Enemy's max hit is their attack stat
        const enemyMaxHit = enemy.attack;

        // Your defense (includes armor bonuses)
        const playerDefense = skillSystem.getEffectiveStat('Defense');

        // Roll damage and apply your defense
        const damage = this.rollHit(enemyMaxHit, playerDefense);

        gameState.modifyHealth(-damage);

        // Grant Defense XP (1.5 XP per damage taken)
        const defenseXpGained = Math.max(2, Math.floor(damage * 1.5));
        skillSystem.gainXp('Defense', defenseXpGained);

        this.dispatchEnemyAttack(enemy, damage, defenseXpGained);

        return damage;
    }

    /**
     * Check if combat should end (victory or defeat)
     */
    checkCombatEnd(enemy) {
        const playerHealth = gameState.getCurrentHealth();

        if (enemy.currentHealth <= 0) {
            return { ended: true, result: 'victory', enemy };
        }

        if (playerHealth <= 0) {
            return { ended: true, result: 'defeat', enemy };
        }

        return { ended: false };
    }

    /**
     * Handle player victory
     */
    handleVictory(enemy) {
        const loot = this.rollLoot(enemy.name);

        // Award Hitpoints XP based on enemy's max HP (2x enemy HP)
        const hitpointsXp = enemy.maxHealth * 2;
        skillSystem.gainXp('Hitpoints', hitpointsXp);

        // Restore health
        const maxHp = skillSystem.getMaxHealth();
        gameState.setCurrentHealth(maxHp);

        this.dispatchVictory(enemy, loot);

        return loot;
    }

    /**
     * Handle player defeat
     */
    handleDefeat(enemy) {
        // Restore health
        const maxHp = skillSystem.getMaxHealth();
        gameState.setCurrentHealth(maxHp);

        this.dispatchDefeat(enemy);
    }

    // Event dispatching
    dispatchPlayerAttack(enemy, damage, xpGained) {
        window.dispatchEvent(new CustomEvent('playerAttack', {
            detail: { enemy, damage, xpGained }
        }));
    }

    dispatchEnemyAttack(enemy, damage, xpGained) {
        window.dispatchEvent(new CustomEvent('enemyAttack', {
            detail: { enemy, damage, xpGained }
        }));
    }

    dispatchVictory(enemy, loot) {
        window.dispatchEvent(new CustomEvent('combatVictory', {
            detail: { enemy, loot }
        }));
    }

    dispatchDefeat(enemy) {
        window.dispatchEvent(new CustomEvent('combatDefeat', {
            detail: { enemy }
        }));
    }
}

export const combatSystem = new CombatSystem();
