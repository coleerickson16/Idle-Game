/**
 * MapUI.js
 * Renders the visual world map with location nodes
 */

import { locationSystem } from '../systems/LocationSystem.js';
import { LOCATIONS } from '../data/GameData.js';

class MapUI {
    constructor() {
        this.mapContainer = null;
    }

    init() {
        this.mapContainer = document.getElementById('world-map');
        if (!this.mapContainer) {
            console.error('World map container not found!');
            return;
        }
        this.render();
    }

    /**
     * Render the world map
     */
    render() {
        if (!this.mapContainer) return;

        const currentLocation = locationSystem.getCurrentLocation();
        const connectedLocations = locationSystem.getConnectedLocations();

        // Clear existing map
        this.mapContainer.innerHTML = '';

        // Create map title
        const currentLocationData = locationSystem.getCurrentLocationData();
        const mapTitle = document.createElement('div');
        mapTitle.className = 'map-title';
        mapTitle.innerHTML = `
            <span class="text-sm text-gray-300">Current Location:</span>
            <span class="text-lg font-bold text-white">${currentLocationData.emoji} ${currentLocationData.name}</span>
        `;
        this.mapContainer.appendChild(mapTitle);

        // Create map nodes container
        const nodesContainer = document.createElement('div');
        nodesContainer.className = 'map-nodes';

        // Define layout positions for each location
        const layout = this.getMapLayout();

        // Render all locations based on layout
        Object.keys(layout).forEach(locationId => {
            const location = LOCATIONS[locationId];
            const position = layout[locationId];

            const node = this.createLocationNode(
                location,
                locationId === currentLocation,
                connectedLocations.includes(locationId)
            );

            // Apply position styling
            node.style.gridColumn = position.col;
            node.style.gridRow = position.row;

            nodesContainer.appendChild(node);
        });

        this.mapContainer.appendChild(nodesContainer);

        // Add location description
        const description = document.createElement('div');
        description.className = 'map-description';
        description.textContent = currentLocationData.description;
        this.mapContainer.appendChild(description);
    }

    /**
     * Define the visual layout of the map
     * Returns grid positions for each location
     */
    getMapLayout() {
        return {
            // Top row - connected to town
            'Mine': { row: 1, col: 1 },
            'Forest': { row: 1, col: 2 },
            'Lake': { row: 1, col: 3 },
            'Kitchen': { row: 1, col: 4 },
            'Smithy': { row: 1, col: 5 },

            // Middle row - Town (center)
            'Town': { row: 2, col: 3 },

            // Bottom row - accessible from Forest
            'Wilderness': { row: 3, col: 2 },
        };
    }

    /**
     * Create a location node element
     */
    createLocationNode(location, isCurrent, isConnected) {
        const node = document.createElement('div');
        const isUnlocked = locationSystem.isLocationUnlocked(location.id);

        // Base classes
        let classes = ['map-node'];

        // State classes
        if (isCurrent) {
            classes.push('map-node-current');
        } else if (isConnected && isUnlocked) {
            classes.push('map-node-connected');
            node.style.cursor = 'pointer';
            node.onclick = () => this.handleNodeClick(location.id);
        } else if (!isUnlocked) {
            classes.push('map-node-locked');
        } else {
            classes.push('map-node-distant');
        }

        node.className = classes.join(' ');

        // Node content
        node.innerHTML = `
            <div class="map-node-emoji">${location.emoji}</div>
            <div class="map-node-name">${location.name}</div>
            ${isCurrent ? '<div class="map-node-marker">📍</div>' : ''}
        `;

        return node;
    }

    /**
     * Handle clicking on a location node
     */
    handleNodeClick(locationId) {
        const canTravel = locationSystem.canTravelTo(locationId);

        if (canTravel.success) {
            locationSystem.travelTo(locationId);
        }
    }
}

// Export singleton instance
export const mapUI = new MapUI();
