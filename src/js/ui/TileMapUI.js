/**
 * TileMapUI.js
 * Renders the tile-based exploration view
 */

import { tileMapSystem } from '../systems/TileMapSystem.js';
import { TILE_DISPLAY } from '../data/TileMaps.js';

class TileMapUI {
    constructor() {
        this.container = null;
        this.viewport = { width: 25, height: 15 }; // Show much more of the map
        this.keyHandlerBound = null; // Store bound handler to remove/add only once
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Tile map container '${containerId}' not found!`);
            return;
        }

        // Bind keyboard handler once
        this.keyHandlerBound = this.handleKeyPress.bind(this);
    }

    /**
     * Render the tile map
     */
    render() {
        if (!this.container) return;
        if (!tileMapSystem.isInExploration()) {
            this.container.innerHTML = '';
            return;
        }

        const map = tileMapSystem.getCurrentMap();
        const playerPos = tileMapSystem.getPlayerPosition();

        this.container.innerHTML = '';

        // Create header with region name and exit button
        const header = document.createElement('div');
        header.className = 'tilemap-header';
        header.innerHTML = `
            <div class="tilemap-title">${map.name}</div>
            <button class="tilemap-exit-btn" id="exit-tilemap">← World Map</button>
        `;
        this.container.appendChild(header);

        // Calculate viewport bounds (center on player)
        const bounds = this.calculateViewport(playerPos, map);

        // Create grid container with ACTUAL rendered dimensions
        const gridContainer = document.createElement('div');
        gridContainer.className = 'tilemap-grid';
        const actualWidth = bounds.maxX - bounds.minX;
        const actualHeight = bounds.maxY - bounds.minY;
        gridContainer.style.gridTemplateColumns = `repeat(${actualWidth}, 1fr)`;
        gridContainer.style.gridTemplateRows = `repeat(${actualHeight}, 1fr)`;

        // Render visible tiles
        for (let y = bounds.minY; y < bounds.maxY; y++) {
            for (let x = bounds.minX; x < bounds.maxX; x++) {
                const tile = this.createTileElement(x, y, playerPos, map);
                gridContainer.appendChild(tile);
            }
        }

        this.container.appendChild(gridContainer);

        // Add movement instructions
        const instructions = document.createElement('div');
        instructions.className = 'tilemap-instructions';
        instructions.innerHTML = `
            <div>🎮 Use WASD or Arrow Keys to move</div>
            <div>🖱️ Click adjacent tiles to interact with resources</div>
        `;
        this.container.appendChild(instructions);

        // Attach event listeners
        this.attachEventListeners();
    }

    /**
     * Calculate which tiles should be visible
     * Shows a fixed viewport of the map - doesn't constantly recenter
     */
    calculateViewport(playerPos, map) {
        // If map is smaller than viewport, show the whole map
        if (map.width <= this.viewport.width && map.height <= this.viewport.height) {
            return {
                minX: 0,
                maxX: map.width,
                minY: 0,
                maxY: map.height
            };
        }

        // Show a larger fixed area - only pan when player gets near edges
        const halfW = Math.floor(this.viewport.width / 2);
        const halfH = Math.floor(this.viewport.height / 2);

        // Calculate center of viewport
        let centerX = playerPos.x;
        let centerY = playerPos.y;

        // Clamp center to ensure viewport doesn't go out of bounds
        centerX = Math.max(halfW, Math.min(map.width - halfW, centerX));
        centerY = Math.max(halfH, Math.min(map.height - halfH, centerY));

        let minX = centerX - halfW;
        let maxX = centerX + halfW;
        let minY = centerY - halfH;
        let maxY = centerY + halfH;

        // Final clamp to map bounds
        minX = Math.max(0, minX);
        minY = Math.max(0, minY);
        maxX = Math.min(map.width, maxX);
        maxY = Math.min(map.height, maxY);

        return { minX, maxX, minY, maxY };
    }

    /**
     * Create a single tile element
     */
    createTileElement(x, y, playerPos, map) {
        const tileDiv = document.createElement('div');
        tileDiv.className = 'tile';
        tileDiv.setAttribute('data-x', x);
        tileDiv.setAttribute('data-y', y);

        // Get tile type
        const tileType = tileMapSystem.getTileAt(x, y) || 'grass';
        const tileDisplay = TILE_DISPLAY[tileType] || TILE_DISPLAY['grass'];

        // Check if player is on this tile
        const isPlayer = (x === playerPos.x && y === playerPos.y);

        if (isPlayer) {
            tileDiv.classList.add('tile-player');
            tileDiv.innerHTML = `<div class="tile-emoji player-avatar">🧙</div>`;
        } else {
            tileDiv.classList.add(`tile-${tileType}`);
            tileDiv.style.backgroundColor = tileDisplay.color + '40'; // Add transparency
            tileDiv.innerHTML = `<div class="tile-emoji">${tileDisplay.emoji}</div>`;

            // Check if this is an interactable tile
            const action = map.tileActions?.[tileType];
            if (action && action.type === 'resource') {
                tileDiv.classList.add('tile-interactable');
            }
            if (action && action.type === 'enter-location') {
                tileDiv.classList.add('tile-building');
            }
            if (action && action.type === 'region-transition') {
                tileDiv.classList.add('tile-exit');
            }
        }

        // Add click handler
        tileDiv.addEventListener('click', () => this.handleTileClick(x, y));

        return tileDiv;
    }

    /**
     * Handle tile click
     */
    handleTileClick(x, y) {
        const playerPos = tileMapSystem.getPlayerPosition();

        // If clicking current tile, do nothing
        if (x === playerPos.x && y === playerPos.y) {
            return;
        }

        // Check if adjacent
        const dx = Math.abs(x - playerPos.x);
        const dy = Math.abs(y - playerPos.y);

        if (dx <= 1 && dy <= 1) {
            // Adjacent tile - try to interact or move
            const tileType = tileMapSystem.getTileAt(x, y);
            const map = tileMapSystem.getCurrentMap();
            const action = map?.tileActions?.[tileType];

            if (action) {
                // Interactable tile - try interaction
                const result = tileMapSystem.interactWithTile(x, y);
                if (!result.success && !tileMapSystem.isBlocked(tileType)) {
                    // If interaction failed but tile is walkable, move there
                    tileMapSystem.movePlayer(x, y);
                }
            } else if (!tileMapSystem.isBlocked(tileType)) {
                // Empty walkable tile - move there
                tileMapSystem.movePlayer(x, y);
            }
        }
        // For non-adjacent tiles, could implement pathfinding later
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Exit button
        const exitBtn = document.getElementById('exit-tilemap');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                this.cleanup();
                tileMapSystem.exitExploration();
            });
        }

        // Keyboard movement (WASD and Arrow keys) - add only once
        if (this.keyHandlerBound) {
            // Remove existing listener first to avoid duplicates
            document.removeEventListener('keydown', this.keyHandlerBound);
            // Add the listener
            document.addEventListener('keydown', this.keyHandlerBound);
        }
    }

    /**
     * Clean up event listeners when exiting tile mode
     */
    cleanup() {
        if (this.keyHandlerBound) {
            document.removeEventListener('keydown', this.keyHandlerBound);
        }
    }

    /**
     * Handle keyboard input for movement
     */
    handleKeyPress(event) {
        if (!tileMapSystem.isInExploration()) return;

        const key = event.key.toLowerCase();

        // Only handle movement keys
        const movementKeys = ['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'];
        if (!movementKeys.includes(key)) return;

        // Prevent default browser behavior and stop event propagation
        event.preventDefault();
        event.stopPropagation();

        // Process movement
        switch(key) {
            case 'w':
            case 'arrowup':
                tileMapSystem.move('up');
                break;
            case 's':
            case 'arrowdown':
                tileMapSystem.move('down');
                break;
            case 'a':
            case 'arrowleft':
                tileMapSystem.move('left');
                break;
            case 'd':
            case 'arrowright':
                tileMapSystem.move('right');
                break;
        }
    }
}

export const tileMapUI = new TileMapUI();
