/**
 * CombatUI.js
 * Dedicated combat interface with visual feedback
 */

import { gameState } from '../core/GameState.js';
import { skillSystem } from '../systems/SkillSystem.js';
import { ENEMY_TEMPLATES } from '../data/GameData.js';

class CombatUI {
    constructor() {
        this.combatPanel = null;
        this.currentEnemy = null;
        this.combatStats = {
            totalDamageDealt: 0,
            totalDamageTaken: 0,
            hitsLanded: 0,
            hitsTaken: 0,
            turnCount: 0
        };
    }

    init() {
        this.combatPanel = document.getElementById('combat-panel-overlay');
        if (!this.combatPanel) {
            console.error('Combat panel overlay not found!');
            return;
        }
    }

    /**
     * Show combat panel and initialize combat
     */
    showCombatPanel(enemy) {
        if (!this.combatPanel) return;

        this.currentEnemy = enemy;
        this.resetStats();
        this.combatPanel.classList.remove('hidden');
        this.render();
    }

    /**
     * Hide combat panel
     */
    hideCombatPanel() {
        if (!this.combatPanel) return;
        this.combatPanel.classList.add('hidden');
        this.currentEnemy = null;
        this.resetStats();
    }

    /**
     * Reset combat statistics
     */
    resetStats() {
        this.combatStats = {
            totalDamageDealt: 0,
            totalDamageTaken: 0,
            hitsLanded: 0,
            hitsTaken: 0,
            turnCount: 0
        };
    }

    /**
     * Update combat stats when damage is dealt
     */
    recordPlayerDamage(damage) {
        this.combatStats.totalDamageDealt += damage;
        this.combatStats.hitsLanded += 1;
        this.render();
    }

    /**
     * Update combat stats when damage is taken
     */
    recordEnemyDamage(damage) {
        this.combatStats.totalDamageTaken += damage;
        this.combatStats.hitsTaken += 1;
        this.combatStats.turnCount += 1;
        this.render();
    }

    /**
     * Render the combat panel
     */
    render() {
        if (!this.combatPanel || !this.currentEnemy) return;

        const playerHp = gameState.getCurrentHealth();
        const playerMaxHp = skillSystem.getMaxHealth();
        const playerHpPercent = (playerHp / playerMaxHp) * 100;

        const enemyHpPercent = (this.currentEnemy.currentHealth / this.currentEnemy.maxHealth) * 100;

        const avgDamageDealt = this.combatStats.hitsLanded > 0
            ? (this.combatStats.totalDamageDealt / this.combatStats.hitsLanded).toFixed(1)
            : 0;

        const avgDamageTaken = this.combatStats.hitsTaken > 0
            ? (this.combatStats.totalDamageTaken / this.combatStats.hitsTaken).toFixed(1)
            : 0;

        this.combatPanel.innerHTML = `
            <div class="combat-panel-content">
                <div class="combat-header">
                    <h3 class="text-xl font-bold text-white">⚔️ Combat</h3>
                    <button id="close-combat-panel" class="combat-close">&times;</button>
                </div>

                <div class="combat-fighters">
                    <!-- Player Section -->
                    <div class="combat-fighter">
                        <div class="fighter-label">You</div>
                        <div class="fighter-emoji">🧙</div>
                        <div class="fighter-hp-bar">
                            <div class="hp-bar-label">
                                <span>HP</span>
                                <span>${playerHp}/${playerMaxHp}</span>
                            </div>
                            <div class="hp-bar-container">
                                <div class="hp-bar hp-bar-player" style="width: ${playerHpPercent}%"></div>
                            </div>
                        </div>
                        <div class="fighter-stats">
                            <div class="stat-item">
                                <span class="stat-label">Atk</span>
                                <span class="stat-value">${skillSystem.getEffectiveStat('Attack')}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Def</span>
                                <span class="stat-value">${skillSystem.getEffectiveStat('Defense')}</span>
                            </div>
                        </div>
                    </div>

                    <!-- VS Divider -->
                    <div class="combat-vs">VS</div>

                    <!-- Enemy Section -->
                    <div class="combat-fighter">
                        <div class="fighter-label">${this.currentEnemy.name}</div>
                        <div class="fighter-emoji">👹</div>
                        <div class="fighter-hp-bar">
                            <div class="hp-bar-label">
                                <span>HP</span>
                                <span>${this.currentEnemy.currentHealth}/${this.currentEnemy.maxHealth}</span>
                            </div>
                            <div class="hp-bar-container">
                                <div class="hp-bar hp-bar-enemy" style="width: ${enemyHpPercent}%"></div>
                            </div>
                        </div>
                        <div class="fighter-stats">
                            <div class="stat-item">
                                <span class="stat-label">Atk</span>
                                <span class="stat-value">${this.currentEnemy.attack}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Def</span>
                                <span class="stat-value">${this.currentEnemy.defense}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Combat Stats Summary -->
                <div class="combat-stats-summary">
                    <h4 class="text-sm font-semibold text-gray-300 mb-2">Combat Statistics</h4>
                    <div class="stats-grid">
                        <div class="stat-box stat-box-green">
                            <div class="stat-box-label">Damage Dealt</div>
                            <div class="stat-box-value">${this.combatStats.totalDamageDealt}</div>
                            <div class="stat-box-sub">${avgDamageDealt} avg</div>
                        </div>
                        <div class="stat-box stat-box-red">
                            <div class="stat-box-label">Damage Taken</div>
                            <div class="stat-box-value">${this.combatStats.totalDamageTaken}</div>
                            <div class="stat-box-sub">${avgDamageTaken} avg</div>
                        </div>
                        <div class="stat-box stat-box-blue">
                            <div class="stat-box-label">Hits Landed</div>
                            <div class="stat-box-value">${this.combatStats.hitsLanded}</div>
                        </div>
                        <div class="stat-box stat-box-purple">
                            <div class="stat-box-label">Turns</div>
                            <div class="stat-box-value">${this.combatStats.turnCount}</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add close button listener
        const closeBtn = document.getElementById('close-combat-panel');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideCombatPanel());
        }
    }

    /**
     * Create floating damage number
     */
    createFloatingDamage(damage, isPlayerDamage) {
        if (!this.combatPanel) return;

        const damageEl = document.createElement('div');
        damageEl.className = `floating-damage ${isPlayerDamage ? 'damage-dealt' : 'damage-taken'}`;
        damageEl.textContent = isPlayerDamage ? `-${damage}` : `+${damage}`;

        // Position it in the combat panel
        const panel = this.combatPanel.querySelector('.combat-panel-content');
        if (panel) {
            panel.appendChild(damageEl);

            // Remove after animation
            setTimeout(() => {
                damageEl.remove();
            }, 2000);
        }
    }

    /**
     * Get current enemy
     */
    getCurrentEnemy() {
        return this.currentEnemy;
    }
}

export const combatUI = new CombatUI();
