/**
 * GameState.js
 * Manages the core player state and provides access to game data
 */

import { ALL_SKILLS, EQUIPMENT_SLOTS } from '../data/GameData.js';

class GameState {
    constructor() {
        this.player = this.initializePlayer();
    }

    initializePlayer() {
        const levels = {};
        const xp = {};

        ALL_SKILLS.forEach(skill => {
            levels[skill] = 1;
            xp[skill] = 0;
        });

        return {
            levels,
            xp,
            currentHealth: 10,
            currentLocation: 'Town', // Starting location
            inventory: this.initializeInventory(),
            equipment: this.initializeEquipment(),
            hotbar: this.initializeHotbar(),
            bank: this.initializeInventory(), // Bank uses same item structure as inventory
            collectionLog: {}, // Tracks discovered items { itemName: true }
            currentActivity: {
                name: 'Idle',
                interval: null,
                xpPerTick: 0,
                skill: null,
                targetLevel: 0,
                target: null, // Holds enemy instance during combat
            }
        };
    }

    initializeHotbar() {
        // 9 slots for hotbar (indexed 0-8, keys 1-9)
        return Array(9).fill(null);
    }

    initializeInventory() {
        return {
            // Logs
            Logs: 0,
            OakLogs: 0,
            WillowLogs: 0,
            MapleLogs: 0,
            YewLogs: 0,
            MagicLogs: 0,

            // Ores
            CopperOre: 0,
            IronOre: 0,
            MithrilOre: 0,
            AdamantOre: 0,
            RuneOre: 0,

            // Bars
            BronzeBar: 0,
            IronBar: 0,
            MithrilBar: 0,
            AdamantBar: 0,
            RuneBar: 0,

            // Arrow Shafts
            ArrowShafts: 0,
            OakArrowShafts: 0,
            WillowArrowShafts: 0,
            MapleArrowShafts: 0,
            YewArrowShafts: 0,
            MagicArrowShafts: 0,

            // Tools
            BronzeAxe: 0,

            // Armor - Bronze
            BronzeHelmet: 0,
            BronzePlatelegs: 0,
            BronzePlatebody: 0,

            // Armor - Iron
            IronHelmet: 0,
            IronPlatelegs: 0,
            IronPlatebody: 0,

            // Armor - Mithril
            MithrilHelmet: 0,
            MithrilPlatelegs: 0,
            MithrilPlatebody: 0,

            // Armor - Adamant
            AdamantHelmet: 0,
            AdamantPlatelegs: 0,
            AdamantPlatebody: 0,

            // Armor - Rune
            RuneHelmet: 0,
            RunePlatelegs: 0,
            RunePlatebody: 0,

            // Fishing - Raw Fish
            RawShrimp: 0,
            RawTrout: 0,
            RawSalmon: 0,
            RawTuna: 0,
            RawLobster: 0,
            RawSwordfish: 0,
            RawShark: 0,
            RawAnglerfish: 0,

            // Food - Cooked Fish
            Shrimp: 0,
            Trout: 0,
            Salmon: 0,
            Tuna: 0,
            Lobster: 0,
            Swordfish: 0,
            Shark: 0,
            Anglerfish: 0,

            // Combat drops
            Bones: 0,
            Coins: 0,
            GoblinDagger: 0,
        };
    }

    initializeEquipment() {
        const equipment = {};
        Object.keys(EQUIPMENT_SLOTS).forEach(slot => {
            equipment[slot] = null;
        });
        return equipment;
    }

    getLevel(skill) {
        return this.player.levels[skill] || 1;
    }

    getXP(skill) {
        return this.player.xp[skill] || 0;
    }

    setLevel(skill, level) {
        this.player.levels[skill] = level;
    }

    setXP(skill, xp) {
        this.player.xp[skill] = xp;
    }

    addXP(skill, amount) {
        this.player.xp[skill] += amount;
    }

    getInventoryItem(itemName) {
        return this.player.inventory[itemName] || 0;
    }

    setInventoryItem(itemName, amount) {
        this.player.inventory[itemName] = amount;
    }

    addInventoryItem(itemName, amount = 1) {
        this.player.inventory[itemName] = (this.player.inventory[itemName] || 0) + amount;
    }

    removeInventoryItem(itemName, amount = 1) {
        this.player.inventory[itemName] = Math.max(0, (this.player.inventory[itemName] || 0) - amount);
    }

    getEquipment(slot) {
        return this.player.equipment[slot];
    }

    setEquipment(slot, itemName) {
        this.player.equipment[slot] = itemName;
    }

    getCurrentHealth() {
        return this.player.currentHealth;
    }

    setCurrentHealth(health) {
        this.player.currentHealth = health;
    }

    modifyHealth(amount) {
        this.player.currentHealth += amount;
    }

    getCurrentLocation() {
        return this.player.currentLocation;
    }

    setCurrentLocation(locationId) {
        this.player.currentLocation = locationId;
    }

    getCurrentActivity() {
        return this.player.currentActivity;
    }

    setActivity(activityData) {
        Object.assign(this.player.currentActivity, activityData);
    }

    clearActivity() {
        if (this.player.currentActivity.interval) {
            clearInterval(this.player.currentActivity.interval);
        }
        this.player.currentActivity = {
            name: 'Idle',
            interval: null,
            xpPerTick: 0,
            skill: null,
            targetLevel: 0,
            target: null,
        };
    }

    getHotbar() {
        return this.player.hotbar;
    }

    getHotbarSlot(index) {
        return this.player.hotbar[index];
    }

    setHotbarSlot(index, itemName) {
        if (index >= 0 && index < 9) {
            this.player.hotbar[index] = itemName;
        }
    }

    clearHotbarSlot(index) {
        if (index >= 0 && index < 9) {
            this.player.hotbar[index] = null;
        }
    }

    // Bank methods
    getAllBankItems() {
        return this.player.bank;
    }

    getBankItem(itemName) {
        return this.player.bank[itemName] || 0;
    }

    addBankItem(itemName, amount = 1) {
        if (this.player.bank[itemName] !== undefined) {
            this.player.bank[itemName] += amount;
        }
    }

    removeBankItem(itemName, amount = 1) {
        if (this.player.bank[itemName] !== undefined) {
            this.player.bank[itemName] = Math.max(0, this.player.bank[itemName] - amount);
        }
    }

    // Collection Log methods
    getCollectionLog() {
        return this.player.collectionLog;
    }

    addToCollectionLog(itemName) {
        this.player.collectionLog[itemName] = true;
    }

    hasInCollectionLog(itemName) {
        return !!this.player.collectionLog[itemName];
    }
}

// Export singleton instance
export const gameState = new GameState();
