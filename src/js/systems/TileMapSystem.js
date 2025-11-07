/**
 * TileMapSystem.js
 * Manages tile-based exploration, player position, and movement
 */

import { gameState } from '../core/GameState.js';
import { TILE_MAPS } from '../data/TileMaps.js';

class TileMapSystem {
    constructor() {
        this.currentMap = null;
        this.playerPosition = { x: 0, y: 0 };
        this.isExploring = false; // Track if in exploration mode
    }

    /**
     * Enter a region's tile map
     */
    enterRegion(regionId) {
        const map = TILE_MAPS[regionId];

        if (!map) {
            console.error(`Tile map not found for region: ${regionId}`);
            return false;
        }

        this.currentMap = map;
        this.playerPosition = { ...map.startPosition };
        this.isExploring = true;

        this.dispatchMapEntered(regionId);
        return true;
    }

    /**
     * Exit exploration mode (return to world map)
     */
    exitExploration() {
        this.isExploring = false;
        this.currentMap = null;
        this.dispatchMapExited();
    }

    /**
     * Move player to a new position
     */
    movePlayer(newX, newY) {
        if (!this.currentMap) return false;

        // Check bounds
        if (newX < 0 || newX >= this.currentMap.width ||
            newY < 0 || newY >= this.currentMap.height) {
            return false;
        }

        // Check if tile is walkable
        const tileType = this.getTileAt(newX, newY);
        if (this.isBlocked(tileType)) {
            return false;
        }

        // Update position
        const oldPosition = { ...this.playerPosition };
        this.playerPosition = { x: newX, y: newY };

        this.dispatchPlayerMoved(oldPosition, this.playerPosition);

        // Check for tile actions
        this.handleTileAction(newX, newY, tileType);

        return true;
    }

    /**
     * Move player in a direction
     */
    move(direction) {
        let newX = this.playerPosition.x;
        let newY = this.playerPosition.y;

        switch(direction) {
            case 'up':
            case 'north':
                newY--;
                break;
            case 'down':
            case 'south':
                newY++;
                break;
            case 'left':
            case 'west':
                newX--;
                break;
            case 'right':
            case 'east':
                newX++;
                break;
            default:
                return false;
        }

        return this.movePlayer(newX, newY);
    }

    /**
     * Get tile type at position
     */
    getTileAt(x, y) {
        if (!this.currentMap) return null;
        if (y < 0 || y >= this.currentMap.tiles.length) return null;
        if (x < 0 || x >= this.currentMap.tiles[y].length) return null;

        return this.currentMap.tiles[y][x];
    }

    /**
     * Check if tile is blocked
     */
    isBlocked(tileType) {
        if (!this.currentMap) return true;
        return this.currentMap.blockedTiles.includes(tileType);
    }

    /**
     * Handle actions when stepping on special tiles
     */
    handleTileAction(x, y, tileType) {
        if (!this.currentMap || !this.currentMap.tileActions[tileType]) {
            return;
        }

        const action = this.currentMap.tileActions[tileType];

        switch(action.type) {
            case 'region-transition':
                this.dispatchRegionTransition(action.targetRegion);
                break;
            case 'enter-location':
                this.dispatchLocationEnter(action.locationId);
                break;
            // Resource nodes are handled by clicking, not stepping
        }
    }

    /**
     * Interact with tile (click/activate)
     */
    interactWithTile(x, y) {
        const tileType = this.getTileAt(x, y);
        if (!tileType) return false;

        // Check if adjacent to player
        if (!this.isAdjacent(x, y)) {
            return { success: false, reason: 'Too far away. Move closer first.' };
        }

        const action = this.currentMap?.tileActions[tileType];
        if (!action) {
            return { success: false, reason: 'Nothing to interact with here.' };
        }

        switch(action.type) {
            case 'resource':
                return this.handleResourceInteraction(action);
            case 'enter-location':
                return this.handleLocationInteraction(action);
            default:
                return { success: false, reason: 'Cannot interact with this.' };
        }
    }

    /**
     * Check if tile is adjacent to player
     */
    isAdjacent(x, y) {
        const dx = Math.abs(x - this.playerPosition.x);
        const dy = Math.abs(y - this.playerPosition.y);
        return (dx <= 1 && dy <= 1) && !(dx === 0 && dy === 0);
    }

    /**
     * Handle resource gathering
     */
    handleResourceInteraction(action) {
        // This will trigger the activity system
        this.dispatchResourceInteract(action.activity, action.item);
        return { success: true, action };
    }

    /**
     * Handle entering a location (building)
     */
    handleLocationInteraction(action) {
        this.dispatchLocationEnter(action.locationId);
        return { success: true, action };
    }

    /**
     * Get current map data
     */
    getCurrentMap() {
        return this.currentMap;
    }

    /**
     * Get player position
     */
    getPlayerPosition() {
        return { ...this.playerPosition };
    }

    /**
     * Check if in exploration mode
     */
    isInExploration() {
        return this.isExploring;
    }

    // Event dispatching
    dispatchMapEntered(regionId) {
        window.dispatchEvent(new CustomEvent('tileMapEntered', {
            detail: { regionId, map: this.currentMap }
        }));
    }

    dispatchMapExited() {
        window.dispatchEvent(new CustomEvent('tileMapExited'));
    }

    dispatchPlayerMoved(oldPos, newPos) {
        window.dispatchEvent(new CustomEvent('playerMoved', {
            detail: { oldPosition: oldPos, newPosition: newPos }
        }));
    }

    dispatchRegionTransition(targetRegion) {
        window.dispatchEvent(new CustomEvent('regionTransition', {
            detail: { targetRegion }
        }));
    }

    dispatchLocationEnter(locationId) {
        window.dispatchEvent(new CustomEvent('tileLocationEnter', {
            detail: { locationId }
        }));
    }

    dispatchResourceInteract(activity, item) {
        window.dispatchEvent(new CustomEvent('tileResourceInteract', {
            detail: { activity, item }
        }));
    }
}

export const tileMapSystem = new TileMapSystem();
