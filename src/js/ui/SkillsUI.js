/**
 * SkillsUI.js
 * Renders the skills panel
 */

import { gameState } from '../core/GameState.js';
import { skillSystem } from '../systems/SkillSystem.js';
import { ALL_SKILLS } from '../data/GameData.js';

class SkillsUI {
    constructor() {
        this.skillsPanel = null;
        this.activityStatus = null;
    }

    initialize(skillsPanelId, activityStatusId) {
        this.skillsPanel = document.getElementById(skillsPanelId);
        this.activityStatus = document.getElementById(activityStatusId);
    }

    render() {
        if (!this.skillsPanel) return;

        this.skillsPanel.innerHTML = '';

        ALL_SKILLS.forEach(skill => {
            const skillDiv = this.createSkillElement(skill);
            this.skillsPanel.appendChild(skillDiv);
        });
    }

    createSkillElement(skill) {
        const baseLevel = gameState.getLevel(skill);
        const currentXp = gameState.getXP(skill);

        const xpForCurrentLevel = skillSystem.getXpForLevel(baseLevel);
        const xpForNextLevel = skillSystem.getNextLevelXp(skill);

        const segmentTotal = xpForNextLevel - xpForCurrentLevel;
        const segmentProgress = currentXp - xpForCurrentLevel;
        const xpRemaining = Math.max(0, segmentTotal - segmentProgress);

        let progressPercentage = 0;
        if (skill !== 'Hitpoints') {
            if (segmentTotal > 0) {
                progressPercentage = (segmentProgress / segmentTotal) * 100;
            }
            progressPercentage = Math.max(0, Math.min(100, progressPercentage));
        }

        const levelDisplayHTML = this.getLevelDisplayHTML(skill, baseLevel);
        const progressHTML = this.getProgressHTML(skill, xpRemaining, baseLevel, progressPercentage);

        const skillDiv = document.createElement('div');
        skillDiv.className = 'flex flex-col space-y-1 p-2 bg-gray-600 rounded-lg shadow';
        skillDiv.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="text-sm font-semibold text-white">${skill}</span>
                ${levelDisplayHTML}
            </div>
            ${progressHTML}
        `;

        return skillDiv;
    }

    getLevelDisplayHTML(skill, baseLevel) {
        if (skill === 'Hitpoints') {
            const maxHp = skillSystem.getMaxHealth();
            const currentHp = gameState.getCurrentHealth();
            return `<span class="text-lg font-bold text-red-400">${currentHp}/${maxHp}</span>`;
        }

        if (skill === 'Attack' || skill === 'Defense') {
            const bonus = skillSystem.getTotalEquipmentBonus(skill);
            if (bonus > 0) {
                return `<span class="text-lg font-bold text-green-400">${baseLevel}
                    <span class="text-indigo-400 text-xs">(+${bonus})</span></span>`;
            }
        }

        return `<span class="text-lg font-bold text-green-400">${baseLevel}</span>`;
    }

    getProgressHTML(skill, xpRemaining, baseLevel, progressPercentage) {
        return `
            <div class="text-xs text-gray-400 flex justify-between">
                <span class="font-mono">${xpRemaining.toFixed(0)} to Lvl ${baseLevel + 1}</span>
            </div>
            <div class="w-full bg-gray-500 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full transition-all duration-300"
                     style="width: ${progressPercentage}%"></div>
            </div>
        `;
    }

    updateActivityStatus(activityName) {
        if (this.activityStatus) {
            if (activityName === 'Idle') {
                this.activityStatus.textContent = 'Idle. Ready for adventure!';
            } else {
                this.activityStatus.textContent = `Activity: ${activityName}`;
            }
        }
    }
}

export const skillsUI = new SkillsUI();
