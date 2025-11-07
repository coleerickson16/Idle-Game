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
 * Location/Zone definitions - World map structure
 */
/**
 * Region metadata for visual theming and organization
 */
export const REGIONS = {
    LumbridgeValley: {
        id: 'LumbridgeValley',
        name: 'Lumbridge Valley',
        description: 'A peaceful starting region with green fields and gentle rivers',
        tier: 1,
        suggestedLevel: '1-10',
        theme: {
            primary: '#10b981',      // Green
            secondary: '#34d399',
            gradient: 'linear-gradient(135deg, #10b981, #34d399)',
            atmosphere: 'bright'
        }
    },
    MistwoodForest: {
        id: 'MistwoodForest',
        name: 'Mistwood Forest',
        description: 'A dark, mysterious forest shrouded in mist',
        tier: 2,
        suggestedLevel: '10-25',
        theme: {
            primary: '#6b21a8',      // Purple
            secondary: '#4c1d95',
            gradient: 'linear-gradient(135deg, #064e3b, #6b21a8)',
            atmosphere: 'mysterious'
        }
    },
    IronpeakMountains: {
        id: 'IronpeakMountains',
        name: 'Ironpeak Mountains',
        description: 'Towering peaks rich with mineral deposits',
        tier: 3,
        suggestedLevel: '15-35',
        theme: {
            primary: '#78716c',      // Gray-brown
            secondary: '#57534e',
            gradient: 'linear-gradient(135deg, #57534e, #a8a29e)',
            atmosphere: 'rugged'
        }
    },
    AzureCoast: {
        id: 'AzureCoast',
        name: 'Azure Coast',
        description: 'Crystal-clear waters and sandy shores',
        tier: 4,
        suggestedLevel: '20-40',
        theme: {
            primary: '#0ea5e9',      // Blue
            secondary: '#06b6d4',
            gradient: 'linear-gradient(135deg, #0284c7, #06b6d4)',
            atmosphere: 'oceanic'
        }
    },
    ScorchedDesert: {
        id: 'ScorchedDesert',
        name: 'Scorched Desert',
        description: 'Endless golden sands and ancient secrets',
        tier: 5,
        suggestedLevel: '30-50',
        theme: {
            primary: '#f59e0b',      // Orange-gold
            secondary: '#fbbf24',
            gradient: 'linear-gradient(135deg, #dc2626, #f59e0b)',
            atmosphere: 'harsh'
        }
    },
    DarkwoodSwamp: {
        id: 'DarkwoodSwamp',
        name: 'Darkwood Swamp',
        description: 'A treacherous swamp filled with danger',
        tier: 6,
        suggestedLevel: '35-60',
        theme: {
            primary: '#065f46',      // Dark green-brown
            secondary: '#14532d',
            gradient: 'linear-gradient(135deg, #14532d, #1c1917)',
            atmosphere: 'ominous'
        }
    }
};

/**
 * All locations in the game world
 */
export const LOCATIONS = {
    // ========== LUMBRIDGE VALLEY (Tier 1: Levels 1-10) ==========
    Town: {
        id: 'Town',
        name: 'Lumbridge Town',
        emoji: '🏘️',
        description: 'The heart of Lumbridge Valley. A bustling town square where new adventurers begin their journey.',
        region: 'LumbridgeValley',
        connections: ['FarmFields', 'RiverLum', 'LumbridgeForest', 'ForestEdge', 'MountainBase'],
        subLocations: ['Bank', 'Merchant', 'Kitchen', 'Smithy'],
        activities: [],
        unlocked: true,
        parent: null,
    },
    FarmFields: {
        id: 'FarmFields',
        name: 'Farm Fields',
        emoji: '🌾',
        description: 'Rolling fields of wheat and barley. Farmers till the soil under the warm sun.',
        region: 'LumbridgeValley',
        connections: ['Town'],
        activities: [],  // Future: farming skill
        unlocked: true,
        parent: null,
    },
    RiverLum: {
        id: 'RiverLum',
        name: 'River Lum',
        emoji: '🎣',
        description: 'A gentle river flowing through the valley. Perfect for beginner fishermen.',
        region: 'LumbridgeValley',
        connections: ['Town', 'FishingDocks'],
        activities: ['fishing'],
        unlocked: true,
        parent: null,
    },
    LumbridgeForest: {
        id: 'LumbridgeForest',
        name: 'Lumbridge Forest',
        emoji: '🌲',
        description: 'A sparse woodland on the edge of town. Young trees sway in the breeze.',
        region: 'LumbridgeValley',
        connections: ['Town', 'ForestEdge'],
        activities: ['woodcutting', 'firemaking'],
        unlocked: true,
        parent: null,
    },

    // ========== MISTWOOD FOREST (Tier 2: Levels 10-25) ==========
    ForestEdge: {
        id: 'ForestEdge',
        name: 'Mistwood Edge',
        emoji: '🌳',
        description: 'The boundary between Lumbridge and the mysterious Mistwood. Mist creeps through the trees.',
        region: 'MistwoodForest',
        connections: ['Town', 'LumbridgeForest', 'DeepMistwood', 'GoblinCamp'],
        activities: ['woodcutting', 'fletching'],
        unlocked: true,
        parent: null,
    },
    DeepMistwood: {
        id: 'DeepMistwood',
        name: 'Deep Mistwood',
        emoji: '🌲',
        description: 'Thick fog obscures ancient trees. Strange whispers echo through the gloom.',
        region: 'MistwoodForest',
        connections: ['ForestEdge', 'AncientGrove', 'FairyCircle'],
        activities: ['woodcutting', 'fletching'],
        unlocked: true,
        parent: null,
    },
    AncientGrove: {
        id: 'AncientGrove',
        name: 'Ancient Grove',
        emoji: '🍃',
        description: 'Massive oak and willow trees tower above. An aura of ancient magic lingers here.',
        region: 'MistwoodForest',
        connections: ['DeepMistwood'],
        activities: ['woodcutting'],
        unlocked: true,
        parent: null,
    },
    FairyCircle: {
        id: 'FairyCircle',
        name: 'Fairy Circle',
        emoji: '🍄',
        description: 'A ring of glowing mushrooms pulses with ethereal light. The air shimmers with magic.',
        region: 'MistwoodForest',
        connections: ['DeepMistwood'],
        activities: [],  // Future: magic/enchanting
        unlocked: true,
        parent: null,
    },
    GoblinCamp: {
        id: 'GoblinCamp',
        name: 'Goblin Camp',
        emoji: '⚔️',
        description: 'Crude huts and campfires mark goblin territory. The stench is overwhelming.',
        region: 'MistwoodForest',
        connections: ['ForestEdge'],
        activities: ['combat'],
        unlocked: true,
        parent: null,
    },

    // ========== IRONPEAK MOUNTAINS (Tier 3: Levels 15-35) ==========
    MountainBase: {
        id: 'MountainBase',
        name: 'Mountain Base',
        emoji: '⛰️',
        description: 'The foot of the Ironpeak range. Rocky slopes stretch upward into the clouds.',
        region: 'IronpeakMountains',
        connections: ['Town', 'MineTunnels', 'MountainPath'],
        activities: ['mining'],
        unlocked: true,
        parent: null,
    },
    MineTunnels: {
        id: 'MineTunnels',
        name: 'Mine Tunnels',
        emoji: '⛏️',
        description: 'Torch-lit tunnels carved deep into the mountain. Pickaxe strikes echo off the walls.',
        region: 'IronpeakMountains',
        connections: ['MountainBase', 'DeepMines'],
        activities: ['mining'],
        unlocked: true,
        parent: null,
    },
    DeepMines: {
        id: 'DeepMines',
        name: 'Deep Mines',
        emoji: '💎',
        description: 'The deepest shafts of the mine. Rare ores glint in the darkness.',
        region: 'IronpeakMountains',
        connections: ['MineTunnels', 'CrystalCaverns'],
        activities: ['mining'],
        unlocked: true,
        parent: null,
    },
    CrystalCaverns: {
        id: 'CrystalCaverns',
        name: 'Crystal Caverns',
        emoji: '💠',
        description: 'Enormous crystals jut from the walls, casting rainbow light across the cavern.',
        region: 'IronpeakMountains',
        connections: ['DeepMines'],
        activities: ['mining'],
        unlocked: true,
        parent: null,
    },
    MountainPath: {
        id: 'MountainPath',
        name: 'Mountain Path',
        emoji: '🏔️',
        description: 'A winding trail up the mountainside. The air grows thin and cold.',
        region: 'IronpeakMountains',
        connections: ['MountainBase', 'MountainPeak'],
        activities: [],
        unlocked: true,
        parent: null,
    },
    MountainPeak: {
        id: 'MountainPeak',
        name: 'Mountain Peak',
        emoji: '🗻',
        description: 'The summit of Ironpeak. Snow whips around you as you stand among the clouds.',
        region: 'IronpeakMountains',
        connections: ['MountainPath'],
        activities: [],
        unlocked: true,
        parent: null,
    },
    DwarfOutpost: {
        id: 'DwarfOutpost',
        name: 'Dwarf Outpost',
        emoji: '🏰',
        description: 'A sturdy stone fortress built into the mountain. Dwarven smiths work tirelessly.',
        region: 'IronpeakMountains',
        connections: ['MountainPath'],
        activities: ['smithing'],
        unlocked: true,
        parent: null,
    },

    // ========== AZURE COAST (Tier 4: Levels 20-40) ==========
    SandyBeach: {
        id: 'SandyBeach',
        name: 'Sandy Beach',
        emoji: '🏖️',
        description: 'Warm golden sand meets crystal-blue waters. Waves lap gently at the shore.',
        region: 'AzureCoast',
        connections: ['RiverLum', 'FishingDocks', 'CoralReef'],
        activities: [],
        unlocked: true,
        parent: null,
    },
    FishingDocks: {
        id: 'FishingDocks',
        name: 'Fishing Docks',
        emoji: '⚓',
        description: 'Wooden piers stretch into the harbor. Fishermen haul in their catches.',
        region: 'AzureCoast',
        connections: ['SandyBeach', 'Lighthouse'],
        activities: ['fishing', 'cooking'],
        unlocked: true,
        parent: null,
    },
    CoralReef: {
        id: 'CoralReef',
        name: 'Coral Reef',
        emoji: '🐠',
        description: 'Vibrant coral formations teem with exotic fish. The water is remarkably clear.',
        region: 'AzureCoast',
        connections: ['SandyBeach', 'ShipwreckCove'],
        activities: ['fishing'],
        unlocked: true,
        parent: null,
    },
    ShipwreckCove: {
        id: 'ShipwreckCove',
        name: 'Shipwreck Cove',
        emoji: '🚢',
        description: 'The skeletal remains of a merchant vessel rest in shallow waters. What treasures lie within?',
        region: 'AzureCoast',
        connections: ['CoralReef'],
        activities: [],  // Future: treasure hunting
        unlocked: true,
        parent: null,
    },
    Lighthouse: {
        id: 'Lighthouse',
        name: 'Lighthouse',
        emoji: '🗼',
        description: 'A tall stone tower guides ships safely to harbor. The view from the top is breathtaking.',
        region: 'AzureCoast',
        connections: ['FishingDocks'],
        activities: [],
        unlocked: true,
        parent: null,
    },

    // ========== SCORCHED DESERT (Tier 5: Levels 30-50) ==========
    DesertOasis: {
        id: 'DesertOasis',
        name: 'Desert Oasis',
        emoji: '🌴',
        description: 'A paradise in the wasteland. Palm trees shade a crystal-clear spring.',
        region: 'ScorchedDesert',
        connections: ['SandDunes', 'NomadCamp'],
        activities: ['fishing'],
        unlocked: true,
        parent: null,
    },
    SandDunes: {
        id: 'SandDunes',
        name: 'Endless Dunes',
        emoji: '🏜️',
        description: 'Rolling sand stretches to the horizon. The sun beats down mercilessly.',
        region: 'ScorchedDesert',
        connections: ['DesertOasis', 'SandstoneQuarry', 'AncientRuins'],
        activities: [],
        unlocked: true,
        parent: null,
    },
    SandstoneQuarry: {
        id: 'SandstoneQuarry',
        name: 'Sandstone Quarry',
        emoji: '🪨',
        description: 'Ancient workers carved massive blocks from these cliffs. The work continues today.',
        region: 'ScorchedDesert',
        connections: ['SandDunes'],
        activities: ['mining'],
        unlocked: true,
        parent: null,
    },
    AncientRuins: {
        id: 'AncientRuins',
        name: 'Ancient Ruins',
        emoji: '🏛️',
        description: 'Crumbling pillars and weathered statues hint at a forgotten civilization.',
        region: 'ScorchedDesert',
        connections: ['SandDunes', 'BuriedTemple'],
        activities: [],  // Future: archaeology
        unlocked: true,
        parent: null,
    },
    BuriedTemple: {
        id: 'BuriedTemple',
        name: 'Buried Temple',
        emoji: '⚱️',
        description: 'Half-buried in sand, this ancient temple radiates an ominous energy.',
        region: 'ScorchedDesert',
        connections: ['AncientRuins'],
        activities: ['combat'],  // Future: dungeon
        unlocked: true,
        parent: null,
    },
    NomadCamp: {
        id: 'NomadCamp',
        name: 'Nomad Camp',
        emoji: '⛺',
        description: 'Desert travelers rest here between journeys. Exotic goods are traded around the fire.',
        region: 'ScorchedDesert',
        connections: ['DesertOasis'],
        activities: [],  // Future: trading
        unlocked: true,
        parent: null,
    },

    // ========== DARKWOOD SWAMP (Tier 6: Levels 35-60) ==========
    SwampEdge: {
        id: 'SwampEdge',
        name: 'Swamp Edge',
        emoji: '🌿',
        description: 'The ground grows soft and waterlogged. Twisted trees loom ahead in the fog.',
        region: 'DarkwoodSwamp',
        connections: ['DeepMistwood', 'MurkyBog'],
        activities: ['woodcutting'],
        unlocked: true,
        parent: null,
    },
    MurkyBog: {
        id: 'MurkyBog',
        name: 'Murky Bog',
        emoji: '☠️',
        description: 'Dark water bubbles ominously. The stench of decay hangs heavy in the air.',
        region: 'DarkwoodSwamp',
        connections: ['SwampEdge', 'WitchHut', 'MushroomGrove'],
        activities: ['fishing', 'combat'],
        unlocked: true,
        parent: null,
    },
    WitchHut: {
        id: 'WitchHut',
        name: "Witch's Hut",
        emoji: '🔮',
        description: 'A crooked hut on stilts. Smoke rises from the chimney, carrying strange scents.',
        region: 'DarkwoodSwamp',
        connections: ['MurkyBog'],
        activities: [],  // Future: potions/alchemy
        unlocked: true,
        parent: null,
    },
    MushroomGrove: {
        id: 'MushroomGrove',
        name: 'Mushroom Grove',
        emoji: '🍄',
        description: 'Massive fungi tower overhead. Their caps glow with bioluminescent light.',
        region: 'DarkwoodSwamp',
        connections: ['MurkyBog', 'DarkTemple'],
        activities: [],  // Future: foraging
        unlocked: true,
        parent: null,
    },
    DarkTemple: {
        id: 'DarkTemple',
        name: 'Dark Temple',
        emoji: '🗿',
        description: 'A foreboding structure rises from the swamp. Ancient evil stirs within.',
        region: 'DarkwoodSwamp',
        connections: ['MushroomGrove'],
        activities: ['combat'],  // Endgame dungeon
        unlocked: true,
        parent: null,
    },

    // ========== SUB-LOCATIONS (Not on main map) ==========
    Bank: {
        id: 'Bank',
        name: 'Bank',
        emoji: '🏦',
        description: 'Store your items safely here',
        region: 'LumbridgeValley',
        connections: [],
        activities: ['banking'],
        unlocked: true,
        parent: 'Town',
    },
    Merchant: {
        id: 'Merchant',
        name: 'Merchant',
        emoji: '🛒',
        description: 'Buy and sell items with the merchant',
        region: 'LumbridgeValley',
        connections: [],
        activities: ['shopping'],
        unlocked: true,
        parent: 'Town',
    },
    Kitchen: {
        id: 'Kitchen',
        name: 'Kitchen',
        emoji: '🍳',
        description: 'A warm kitchen perfect for cooking',
        region: 'LumbridgeValley',
        connections: [],
        activities: ['cooking'],
        unlocked: true,
        parent: 'Town',
    },
    Smithy: {
        id: 'Smithy',
        name: 'Smithy',
        emoji: '⚒️',
        description: 'A hot forge for smithing equipment',
        region: 'LumbridgeValley',
        connections: [],
        activities: ['smithing'],
        unlocked: true,
        parent: 'Town',
    },
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

/**
 * Shop Items - Items available for purchase at the merchant
 */
export const SHOP_ITEMS = {
    // Basic Food
    'Shrimp': { buyPrice: 10, sellPrice: 5, category: 'food' },
    'Trout': { buyPrice: 25, sellPrice: 12, category: 'food' },
    'Salmon': { buyPrice: 50, sellPrice: 25, category: 'food' },

    // Basic Equipment
    'BronzeAxe': { buyPrice: 50, sellPrice: 25, category: 'tool' },
    'BronzeHelmet': { buyPrice: 100, sellPrice: 50, category: 'equipment' },
    'BronzePlatelegs': { buyPrice: 150, sellPrice: 75, category: 'equipment' },
    'BronzePlatebody': { buyPrice: 200, sellPrice: 100, category: 'equipment' },

    // Raw Materials (can be bought at higher price than sell)
    'Logs': { buyPrice: 5, sellPrice: 2, category: 'resource' },
    'CopperOre': { buyPrice: 8, sellPrice: 3, category: 'resource' },
};
