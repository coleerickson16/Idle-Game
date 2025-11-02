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
        const xpText = skill === 'Hitpoints' ? '' : `${xpRemaining.toFixed(0)} to ${baseLevel + 1}`;

        const skillDiv = document.createElement('div');
        skillDiv.className = 'skill-card';
        skillDiv.innerHTML = `
            <div class="skill-card-header">
                <div class="skill-card-name">${skill}</div>
                ${levelDisplayHTML}
            </div>
            <div class="skill-card-progress">
                <div class="skill-card-progress-bar" style="width: ${progressPercentage}%"></div>
            </div>
            <div class="skill-card-xp">${xpText}</div>
        `;

        return skillDiv;
    }

    getLevelDisplayHTML(skill, baseLevel) {
        if (skill === 'Hitpoints') {
            const maxHp = skillSystem.getMaxHealth();
            const currentHp = gameState.getCurrentHealth();
            return `<div class="skill-card-level" style="color: #ef4444;">${currentHp}/${maxHp}</div>`;
        }

        if (skill === 'Attack' || skill === 'Defense') {
            const bonus = skillSystem.getTotalEquipmentBonus(skill);
            if (bonus > 0) {
                return `<div class="skill-card-level">${baseLevel}<span style="color: #818cf8; font-size: 0.625rem;"> +${bonus}</span></div>`;
            }
        }

        return `<div class="skill-card-level">${baseLevel}</div>`;
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
