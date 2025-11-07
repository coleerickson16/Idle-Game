/**
 * TileMaps.js
 * Defines explorable tile-based maps for each region
 */

/**
 * Tile Types:
 * - 'grass', 'path', 'stone', 'water', 'bridge'
 * - 'tree', 'oak-tree', 'willow-tree' (resource nodes)
 * - 'copper-ore', 'iron-ore', 'mithril-ore' (resource nodes)
 * - 'fish-spot' (fishing)
 * - 'building-bank', 'building-merchant', 'building-kitchen', 'building-smithy'
 * - 'enemy-goblin' (spawns enemy)
 * - 'exit-north', 'exit-south', 'exit-east', 'exit-west' (region transitions)
 * - 'blocked' (impassable)
 */

export const TILE_MAPS = {
    LumbridgeValley: {
        regionId: 'LumbridgeValley',
        name: 'Lumbridge Valley',
        width: 30,
        height: 20,
        startPosition: { x: 15, y: 10 }, // Where player spawns
        tiles: [
            // Row 0
            ['grass', 'grass', 'grass', 'grass', 'grass', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'grass', 'grass', 'exit-north'],
            // Row 1 - Town area
            ['grass', 'grass', 'grass', 'path', 'path', 'path', 'building-bank', 'path', 'path', 'tree', 'tree', 'oak-tree', 'oak-tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'grass', 'exit-north'],
            ['grass', 'grass', 'grass', 'path', 'grass', 'path', 'building-merchant', 'path', 'path', 'tree', 'tree', 'oak-tree', 'oak-tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'grass', 'exit-north'],
            ['grass', 'grass', 'grass', 'path', 'grass', 'path', 'path', 'path', 'path', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'grass', 'exit-north'],
            ['grass', 'grass', 'grass', 'path', 'grass', 'building-kitchen', 'grass', 'building-smithy', 'path', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'grass', 'grass', 'exit-north'],
            // Row 5
            ['grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'grass', 'grass', 'grass', 'grass'],
            ['grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'grass', 'grass', 'grass', 'grass', 'grass'],
            ['grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'tree', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
            ['grass', 'grass', 'grass', 'path', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
            ['grass', 'grass', 'grass', 'grass', 'path', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
            // Row 10 - Farm fields area
            ['grass', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
            ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'path', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
            ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'path', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
            ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'path', 'path', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
            // Row 14 - River area
            ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'bridge', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
            ['water', 'water', 'water', 'fish-spot', 'water', 'water', 'water', 'water', 'water', 'water', 'bridge', 'water', 'water', 'water', 'fish-spot', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
            ['water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'bridge', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water', 'water'],
            ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
            ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
            ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'exit-south'],
        ],
        // Define what happens at special tiles
        tileActions: {
            'building-bank': { type: 'enter-location', locationId: 'Bank' },
            'building-merchant': { type: 'enter-location', locationId: 'Merchant' },
            'building-kitchen': { type: 'enter-location', locationId: 'Kitchen' },
            'building-smithy': { type: 'enter-location', locationId: 'Smithy' },
            'tree': { type: 'resource', skill: 'Woodcutting', item: 'Logs', xp: 15, levelReq: 1 },
            'oak-tree': { type: 'resource', skill: 'Woodcutting', item: 'OakLogs', xp: 30, levelReq: 5 },
            'fish-spot': { type: 'resource', skill: 'Fishing', item: 'RawShrimp', xp: 20, levelReq: 1 },
            'exit-north': { type: 'region-transition', targetRegion: 'MistwoodForest' },
            'exit-south': { type: 'region-transition', targetRegion: 'AzureCoast' },
        },
        // Tiles you can't walk through
        blockedTiles: ['water', 'building-bank', 'building-merchant', 'building-kitchen', 'building-smithy']
    },

    MistwoodForest: {
        regionId: 'MistwoodForest',
        name: 'Mistwood Forest',
        width: 30,
        height: 20,
        startPosition: { x: 15, y: 19 }, // Enter from south
        tiles: [
            // Placeholder for now - will expand later
            // This would be a dense forest with willow trees, fairy circle, goblin camp
        ],
        tileActions: {},
        blockedTiles: ['water']
    },

    // Add other regions later...
};

/**
 * Tile rendering info (emoji/color for each tile type)
 */
export const TILE_DISPLAY = {
    'grass': { emoji: '🌾', color: '#10b981' },
    'path': { emoji: '🟫', color: '#92400e' },
    'stone': { emoji: '🪨', color: '#78716c' },
    'water': { emoji: '🌊', color: '#0ea5e9' },
    'bridge': { emoji: '🌉', color: '#78716c' },
    'tree': { emoji: '🌲', color: '#065f46' },
    'oak-tree': { emoji: '🌳', color: '#15803d' },
    'willow-tree': { emoji: '🍃', color: '#22c55e' },
    'copper-ore': { emoji: '🪨', color: '#ea580c' },
    'iron-ore': { emoji: '⛏️', color: '#737373' },
    'fish-spot': { emoji: '🎣', color: '#06b6d4' },
    'building-bank': { emoji: '🏦', color: '#facc15' },
    'building-merchant': { emoji: '🛒', color: '#fbbf24' },
    'building-kitchen': { emoji: '🍳', color: '#f59e0b' },
    'building-smithy': { emoji: '⚒️', color: '#ef4444' },
    'enemy-goblin': { emoji: '👹', color: '#dc2626' },
    'exit-north': { emoji: '⬆️', color: '#8b5cf6' },
    'exit-south': { emoji: '⬇️', color: '#8b5cf6' },
    'exit-east': { emoji: '➡️', color: '#8b5cf6' },
    'exit-west': { emoji: '⬅️', color: '#8b5cf6' },
    'blocked': { emoji: '⛔', color: '#7f1d1d' },
};
