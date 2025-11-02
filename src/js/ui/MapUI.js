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
        const currentLocationData = locationSystem.getCurrentLocationData();
        const connectedLocations = locationSystem.getConnectedLocations();

        // Clear existing map
        this.mapContainer.innerHTML = '';

        // Create map title
        const mapTitle = document.createElement('div');
        mapTitle.className = 'map-title';
        mapTitle.innerHTML = `
            <span class="text-sm text-gray-300">Current Location:</span>
            <span class="text-lg font-bold text-white">${currentLocationData.emoji} ${currentLocationData.name}</span>
        `;
        this.mapContainer.appendChild(mapTitle);

        // Create map visual container (holds SVG + nodes)
        const mapVisual = document.createElement('div');
        mapVisual.className = 'map-visual';
        mapVisual.style.position = 'relative';

        // Create SVG for connection lines
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'map-connections');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        svg.style.zIndex = '0';
        mapVisual.appendChild(svg);

        // Create map nodes container
        const nodesContainer = document.createElement('div');
        nodesContainer.className = 'map-nodes';
        nodesContainer.style.position = 'relative';
        nodesContainer.style.zIndex = '1';

        // Define layout positions for each location
        const layout = this.getMapLayout();

        // Render all main locations (not nested ones)
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
            node.setAttribute('data-location', locationId);

            nodesContainer.appendChild(node);
        });

        mapVisual.appendChild(nodesContainer);

        // Draw connection lines after nodes are rendered
        setTimeout(() => {
            this.drawConnectionLines(svg, layout, connectedLocations, currentLocation);
        }, 0);

        this.mapContainer.appendChild(mapVisual);

        // Show sub-locations if at a parent location
        if (currentLocationData.subLocations && currentLocationData.subLocations.length > 0) {
            const subLocationsContainer = document.createElement('div');
            subLocationsContainer.className = 'sub-locations';
            subLocationsContainer.innerHTML = '<div class="text-sm text-gray-400 mb-2">Buildings in Town:</div>';

            const subGrid = document.createElement('div');
            subGrid.className = 'sub-locations-grid';

            currentLocationData.subLocations.forEach(subLocId => {
                const subLoc = LOCATIONS[subLocId];
                const subNode = this.createLocationNode(
                    subLoc,
                    false,
                    true // Always clickable when shown
                );
                subGrid.appendChild(subNode);
            });

            subLocationsContainer.appendChild(subGrid);
            this.mapContainer.appendChild(subLocationsContainer);
        }

        // Add location description
        const description = document.createElement('div');
        description.className = 'map-description';
        description.textContent = currentLocationData.description;
        this.mapContainer.appendChild(description);
    }

    /**
     * Define the visual layout of the map
     * Returns grid positions for each location (only main world locations)
     */
    getMapLayout() {
        return {
            // Top row - outer locations
            'Mine': { row: 1, col: 1 },
            'Lake': { row: 1, col: 2 },
            'Forest': { row: 1, col: 3 },

            // Middle row - Town (center)
            'Town': { row: 2, col: 2 },

            // Bottom row - accessible from Forest
            'Wilderness': { row: 3, col: 3 },
        };
    }

    /**
     * Draw SVG lines connecting locations
     */
    drawConnectionLines(svg, layout, connectedLocations, currentLocation) {
        // Get all location node elements
        const nodes = {};
        Object.keys(layout).forEach(locationId => {
            const element = document.querySelector(`[data-location="${locationId}"]`);
            if (element) {
                const rect = element.getBoundingClientRect();
                const containerRect = svg.parentElement.getBoundingClientRect();
                nodes[locationId] = {
                    x: rect.left + rect.width / 2 - containerRect.left,
                    y: rect.top + rect.height / 2 - containerRect.top
                };
            }
        });

        // Define connections to draw
        const connections = [
            ['Town', 'Mine'],
            ['Town', 'Lake'],
            ['Town', 'Forest'],
            ['Forest', 'Wilderness'],
        ];

        // Draw lines
        connections.forEach(([loc1, loc2]) => {
            if (nodes[loc1] && nodes[loc2]) {
                const isConnected = (
                    (currentLocation === loc1 && connectedLocations.includes(loc2)) ||
                    (currentLocation === loc2 && connectedLocations.includes(loc1))
                );

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', nodes[loc1].x);
                line.setAttribute('y1', nodes[loc1].y);
                line.setAttribute('x2', nodes[loc2].x);
                line.setAttribute('y2', nodes[loc2].y);
                line.setAttribute('stroke', isConnected ? '#3b82f6' : '#4b5563');
                line.setAttribute('stroke-width', isConnected ? '3' : '2');
                line.setAttribute('stroke-dasharray', isConnected ? '0' : '5,5');
                line.setAttribute('opacity', isConnected ? '0.8' : '0.3');

                svg.appendChild(line);
            }
        });
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
