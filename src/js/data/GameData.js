/**
 * GameData.js
 * Central repository for all game constants, templates, and configuration data
 */

export const GAME_CONFIG = {
    LOG_CAPACITY: 100,
    GATHERING_INTERVAL: 2000,    // 2 seconds
    PRODUCTION_INTERVAL: 3000,   // 3 seconds
    COMBAT_INTERVAL: 1000,       // 1 second
};

export const SKILLS = {
    COMBAT: ['Attack', 'Strength', 'Defense', 'Hitpoints'],
    GATHERING: ['Woodcutting', 'Mining', 'Fishing'],
    PRODUCTION: ['Smithing', 'Fletching', 'Firemaking', 'Cooking'],
};

export const ALL_SKILLS = [
    ...SKILLS.COMBAT,
    ...SKILLS.GATHERING,
    ...SKILLS.PRODUCTION,
];

export const ENEMY_TEMPLATES = {
    Goblin: {
        name: 'Goblin',
        level: 1,
        maxHealth: 10,
        attack: 3,
        defense: 1,
    },
};

export const EQUIPMENT_STATS = {
    // Bronze Tier
    BronzeHelmet: { attackBonus: 0, defenseBonus: 2 },
    BronzePlatelegs: { attackBonus: 0, defenseBonus: 3 },
    BronzePlatebody: { attackBonus: 0, defenseBonus: 5 },

    // Iron Tier
    IronHelmet: { attackBonus: 0, defenseBonus: 4 },
    IronPlatelegs: { attackBonus: 0, defenseBonus: 6 },
    IronPlatebody: { attackBonus: 0, defenseBonus: 10 },

    // Mithril Tier
    MithrilHelmet: { attackBonus: 0, defenseBonus: 6 },
    MithrilPlatelegs: { attackBonus: 0, defenseBonus: 9 },
    MithrilPlatebody: { attackBonus: 0, defenseBonus: 15 },

    // Adamant Tier
    AdamantHelmet: { attackBonus: 0, defenseBonus: 8 },
    AdamantPlatelegs: { attackBonus: 0, defenseBonus: 12 },
    AdamantPlatebody: { attackBonus: 0, defenseBonus: 20 },

    // Rune Tier
    RuneHelmet: { attackBonus: 0, defenseBonus: 10 },
    RunePlatelegs: { attackBonus: 0, defenseBonus: 15 },
    RunePlatebody: { attackBonus: 0, defenseBonus: 25 },

    // Weapons
    GoblinDagger: { attackBonus: 3, defenseBonus: 0 },

    // Tools
    BronzeAxe: { attackBonus: 0, defenseBonus: 0 },
};

export const EQUIPMENT_SLOTS = {
    Helmet: 'Helmet',
    Body: 'Body',
    Legs: 'Legs',
    Weapon: 'Weapon',
    Boots: 'Boots',
    Gloves: 'Gloves',
    Necklace: 'Necklace',
    Ring: 'Ring',
    Cape: 'Cape',
};

export const ITEM_EMOJIS = {
    // Logs
    Logs: '🌲',
    OakLogs: '🪵',
    WillowLogs: '🌿',
    MapleLogs: '🍁',
    YewLogs: '🌳',
    MagicLogs: '✨',

    // Ores
    CopperOre: '🥉',
    IronOre: '🔩',
    MithrilOre: '💎',
    AdamantOre: '🛡️',
    RuneOre: '🔮',

    // Bars
    BronzeBar: '🪙',
    IronBar: '⛓️',
    MithrilBar: '✨🪙',
    AdamantBar: '💠🪙',
    RuneBar: '⚛️🪙',

    // Combat Drops
    Bones: '🦴',
    Coins: '💰',
    GoblinDagger: '🗡️',

    // Tools
    BronzeAxe: '🪓',

    // Arrow Shafts
    ArrowShafts: '🏹',
    OakArrowShafts: '🏹',
    WillowArrowShafts: '🏹',
    MapleArrowShafts: '🏹',
    YewArrowShafts: '🏹',
    MagicArrowShafts: '🏹',

    // Fishing - Raw Fish
    RawShrimp: '🦐',
    RawTrout: '🐟',
    RawSalmon: '🐟',
    RawTuna: '🐟',
    RawLobster: '🦞',
    RawSwordfish: '🗡️🐟',
    RawShark: '🦈',
    RawAnglerfish: '🐡',

    // Food - Cooked Fish
    Shrimp: '🍤',
    Trout: '🐟',
    Salmon: '🍣',
    Tuna: '🍣',
    Lobster: '🦞',
    Swordfish: '🐟',
    Shark: '🦈',
    Anglerfish: '🐡',

    // Armor - dynamically handled based on name
};

/**
 * Get emoji for an item (with fallback logic for armor)
 */
export function getItemEmoji(itemName) {
    if (ITEM_EMOJIS[itemName]) {
        return ITEM_EMOJIS[itemName];
    }

    // Handle armor pieces
    if (itemName.includes('Helmet')) {
        const tier = getTierEmoji(itemName);
        return tier + '🪖';
    }
    if (itemName.includes('Platelegs')) {
        const tier = getTierEmoji(itemName);
        return tier + '👖';
    }
    if (itemName.includes('Platebody')) {
        const tier = getTierEmoji(itemName);
        return tier + '👕';
    }

    return '❓';
}

function getTierEmoji(itemName) {
    if (itemName.includes('Bronze')) return '🥉';
    if (itemName.includes('Iron')) return '🔩';
    if (itemName.includes('Mithril')) return '💎';
    if (itemName.includes('Adamant')) return '🛡️';
    if (itemName.includes('Rune')) return '🔮';
    return '';
}

/**
 * Determines equipment slot for an item
 */
export function getItemSlot(itemName) {
    if (itemName.includes('Helmet')) return 'Helmet';
    if (itemName.includes('Platebody')) return 'Body';
    if (itemName.includes('Platelegs')) return 'Legs';
    if (itemName.includes('Dagger')) return 'Weapon';
    return null;
}

/**
 * Food definitions - items that can be consumed to restore HP
 */
export const FOOD_DATA = {
    Shrimp: { healsHP: 3 },
    Trout: { healsHP: 4 },
    Salmon: { healsHP: 5 },
    Tuna: { healsHP: 6 },
    Lobster: { healsHP: 7 },
    Swordfish: { healsHP: 8 },
    Shark: { healsHP: 9 },
    Anglerfish: { healsHP: 10 },
};

/**
 * Action definitions for all skills
 */
export const ACTIONS = {
    woodcutting: [
        { id: 'chop-wood', name: 'Chop Regular Logs', levelReq: 1, item: 'Logs', xp: 15 },
        { id: 'chop-oak', name: 'Chop Oak Logs', levelReq: 5, item: 'OakLogs', xp: 30 },
        { id: 'chop-willow', name: 'Chop Willow Logs', levelReq: 10, item: 'WillowLogs', xp: 45 },
        { id: 'chop-maple', name: 'Chop Maple Logs', levelReq: 15, item: 'MapleLogs', xp: 60 },
        { id: 'chop-yew', name: 'Chop Yew Logs', levelReq: 20, item: 'YewLogs', xp: 75 },
        { id: 'chop-magic', name: 'Chop Magic Logs', levelReq: 25, item: 'MagicLogs', xp: 90 },
    ],
    mining: [
        { id: 'mine-copper', name: 'Mine Copper', levelReq: 1, item: 'CopperOre', xp: 20 },
        { id: 'mine-iron', name: 'Mine Iron', levelReq: 5, item: 'IronOre', xp: 30 },
        { id: 'mine-mithril', name: 'Mine Mithril', levelReq: 10, item: 'MithrilOre', xp: 40 },
        { id: 'mine-adamant', name: 'Mine Adamant', levelReq: 15, item: 'AdamantOre', xp: 50 },
        { id: 'mine-rune', name: 'Mine Rune', levelReq: 20, item: 'RuneOre', xp: 60 },
    ],
    firemaking: [
        { id: 'fire-log', name: 'Light Log Fire', levelReq: 1, cost: 'Logs', costAmount: 1, xp: 40 },
        { id: 'fire-oak', name: 'Light Oak Log Fire', levelReq: 15, cost: 'OakLogs', costAmount: 1, xp: 60 },
        { id: 'fire-willow', name: 'Light Willow Log Fire', levelReq: 25, cost: 'WillowLogs', costAmount: 1, xp: 100 },
        { id: 'fire-maple', name: 'Light Maple Log Fire', levelReq: 35, cost: 'MapleLogs', costAmount: 1, xp: 120 },
        { id: 'fire-yew', name: 'Light Yew Log Fire', levelReq: 45, cost: 'YewLogs', costAmount: 1, xp: 140 },
        { id: 'fire-magic', name: 'Light Magic Log Fire', levelReq: 55, cost: 'MagicLogs', costAmount: 1, xp: 160 },
    ],
    smithing: [
        // Bronze
        { id: 'smelt-bronze', name: 'Smelt Bronze Bar', levelReq: 1, cost: 'CopperOre', costAmount: 1, produces: 'BronzeBar', producesAmount: 1, xp: 50 },
        { id: 'smith-bronze-helm', name: 'Smith Bronze Helmet', levelReq: 3, cost: 'BronzeBar', costAmount: 2, produces: 'BronzeHelmet', producesAmount: 1, xp: 70 },
        { id: 'smith-bronze-legs', name: 'Smith Bronze Platelegs', levelReq: 5, cost: 'BronzeBar', costAmount: 3, produces: 'BronzePlatelegs', producesAmount: 1, xp: 90 },
        { id: 'smith-bronze-body', name: 'Smith Bronze Platebody', levelReq: 7, cost: 'BronzeBar', costAmount: 5, produces: 'BronzePlatebody', producesAmount: 1, xp: 120 },
        { id: 'smith-axe', name: 'Smith Bronze Axe', levelReq: 5, cost: 'BronzeBar', costAmount: 1, produces: 'BronzeAxe', producesAmount: 1, xp: 100 },

        // Iron
        { id: 'smelt-iron', name: 'Smelt Iron Bar', levelReq: 5, cost: 'IronOre', costAmount: 1, produces: 'IronBar', producesAmount: 1, xp: 70 },
        { id: 'smith-iron-helm', name: 'Smith Iron Helmet', levelReq: 8, cost: 'IronBar', costAmount: 2, produces: 'IronHelmet', producesAmount: 1, xp: 100 },
        { id: 'smith-iron-legs', name: 'Smith Iron Platelegs', levelReq: 11, cost: 'IronBar', costAmount: 3, produces: 'IronPlatelegs', producesAmount: 1, xp: 130 },
        { id: 'smith-iron-body', name: 'Smith Iron Platebody', levelReq: 14, cost: 'IronBar', costAmount: 5, produces: 'IronPlatebody', producesAmount: 1, xp: 170 },

        // Mithril
        { id: 'smelt-mithril', name: 'Smelt Mithril Bar', levelReq: 10, cost: 'MithrilOre', costAmount: 1, produces: 'MithrilBar', producesAmount: 1, xp: 90 },
        { id: 'smith-mithril-helm', name: 'Smith Mithril Helmet', levelReq: 13, cost: 'MithrilBar', costAmount: 2, produces: 'MithrilHelmet', producesAmount: 1, xp: 130 },
        { id: 'smith-mithril-legs', name: 'Smith Mithril Platelegs', levelReq: 16, cost: 'MithrilBar', costAmount: 3, produces: 'MithrilPlatelegs', producesAmount: 1, xp: 170 },
        { id: 'smith-mithril-body', name: 'Smith Mithril Platebody', levelReq: 19, cost: 'MithrilBar', costAmount: 5, produces: 'MithrilPlatebody', producesAmount: 1, xp: 220 },

        // Adamant
        { id: 'smelt-adamant', name: 'Smelt Adamant Bar', levelReq: 15, cost: 'AdamantOre', costAmount: 1, produces: 'AdamantBar', producesAmount: 1, xp: 110 },
        { id: 'smith-adamant-helm', name: 'Smith Adamant Helmet', levelReq: 18, cost: 'AdamantBar', costAmount: 2, produces: 'AdamantHelmet', producesAmount: 1, xp: 160 },
        { id: 'smith-adamant-legs', name: 'Smith Adamant Platelegs', levelReq: 21, cost: 'AdamantBar', costAmount: 3, produces: 'AdamantPlatelegs', producesAmount: 1, xp: 210 },
        { id: 'smith-adamant-body', name: 'Smith Adamant Platebody', levelReq: 24, cost: 'AdamantBar', costAmount: 5, produces: 'AdamantPlatebody', producesAmount: 1, xp: 270 },

        // Rune
        { id: 'smelt-rune', name: 'Smelt Rune Bar', levelReq: 20, cost: 'RuneOre', costAmount: 1, produces: 'RuneBar', producesAmount: 1, xp: 130 },
        { id: 'smith-rune-helm', name: 'Smith Rune Helmet', levelReq: 23, cost: 'RuneBar', costAmount: 2, produces: 'RuneHelmet', producesAmount: 1, xp: 190 },
        { id: 'smith-rune-legs', name: 'Smith Rune Platelegs', levelReq: 26, cost: 'RuneBar', costAmount: 3, produces: 'RunePlatelegs', producesAmount: 1, xp: 250 },
        { id: 'smith-rune-body', name: 'Smith Rune Platebody', levelReq: 29, cost: 'RuneBar', costAmount: 5, produces: 'RunePlatebody', producesAmount: 1, xp: 330 },
    ],
    fletching: [
        { id: 'fletch-shafts', name: 'Fletch Arrow Shafts', levelReq: 1, cost: 'Logs', costAmount: 1, produces: 'ArrowShafts', producesAmount: 10, xp: 20 },
        { id: 'fletch-oak-shafts', name: 'Fletch Oak Shafts', levelReq: 15, cost: 'OakLogs', costAmount: 1, produces: 'OakArrowShafts', producesAmount: 10, xp: 40 },
        { id: 'fletch-willow-shafts', name: 'Fletch Willow Shafts', levelReq: 20, cost: 'WillowLogs', costAmount: 1, produces: 'WillowArrowShafts', producesAmount: 10, xp: 60 },
        { id: 'fletch-maple-shafts', name: 'Fletch Maple Shafts', levelReq: 30, cost: 'MapleLogs', costAmount: 1, produces: 'MapleArrowShafts', producesAmount: 10, xp: 80 },
        { id: 'fletch-yew-shafts', name: 'Fletch Yew Shafts', levelReq: 40, cost: 'YewLogs', costAmount: 1, produces: 'YewArrowShafts', producesAmount: 10, xp: 100 },
        { id: 'fletch-magic-shafts', name: 'Fletch Magic Shafts', levelReq: 50, cost: 'MagicLogs', costAmount: 1, produces: 'MagicArrowShafts', producesAmount: 10, xp: 120 },
    ],
    fishing: [
        { id: 'catch-shrimp', name: 'Catch Raw Shrimp', levelReq: 1, item: 'RawShrimp', xp: 20 },
        { id: 'catch-trout', name: 'Catch Raw Trout', levelReq: 5, item: 'RawTrout', xp: 30 },
        { id: 'catch-salmon', name: 'Catch Raw Salmon', levelReq: 10, item: 'RawSalmon', xp: 40 },
        { id: 'catch-tuna', name: 'Catch Raw Tuna', levelReq: 15, item: 'RawTuna', xp: 50 },
        { id: 'catch-lobster', name: 'Catch Raw Lobster', levelReq: 20, item: 'RawLobster', xp: 60 },
        { id: 'catch-swordfish', name: 'Catch Raw Swordfish', levelReq: 25, item: 'RawSwordfish', xp: 70 },
        { id: 'catch-shark', name: 'Catch Raw Shark', levelReq: 30, item: 'RawShark', xp: 80 },
        { id: 'catch-anglerfish', name: 'Catch Raw Anglerfish', levelReq: 35, item: 'RawAnglerfish', xp: 90 },
    ],
    cooking: [
        { id: 'cook-shrimp', name: 'Cook Shrimp', levelReq: 1, cost: 'RawShrimp', costAmount: 1, produces: 'Shrimp', producesAmount: 1, xp: 30 },
        { id: 'cook-trout', name: 'Cook Trout', levelReq: 5, cost: 'RawTrout', costAmount: 1, produces: 'Trout', producesAmount: 1, xp: 40 },
        { id: 'cook-salmon', name: 'Cook Salmon', levelReq: 10, cost: 'RawSalmon', costAmount: 1, produces: 'Salmon', producesAmount: 1, xp: 50 },
        { id: 'cook-tuna', name: 'Cook Tuna', levelReq: 15, cost: 'RawTuna', costAmount: 1, produces: 'Tuna', producesAmount: 1, xp: 60 },
        { id: 'cook-lobster', name: 'Cook Lobster', levelReq: 20, cost: 'RawLobster', costAmount: 1, produces: 'Lobster', producesAmount: 1, xp: 70 },
        { id: 'cook-swordfish', name: 'Cook Swordfish', levelReq: 25, cost: 'RawSwordfish', costAmount: 1, produces: 'Swordfish', producesAmount: 1, xp: 80 },
        { id: 'cook-shark', name: 'Cook Shark', levelReq: 30, cost: 'RawShark', costAmount: 1, produces: 'Shark', producesAmount: 1, xp: 90 },
        { id: 'cook-anglerfish', name: 'Cook Anglerfish', levelReq: 35, cost: 'RawAnglerfish', costAmount: 1, produces: 'Anglerfish', producesAmount: 1, xp: 100 },
    ],
    combat: [
        { id: 'fight-goblin', name: 'Fight Goblin', levelReq: 1, enemy: 'Goblin' },
    ],
};
