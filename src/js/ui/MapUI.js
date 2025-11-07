/**
 * MapUI.js
 * Renders the visual world map with region-based organization
 * Manages switching between world view and tile exploration view
 */

import { locationSystem } from '../systems/LocationSystem.js';
import { LOCATIONS, REGIONS } from '../data/GameData.js';
import { tileMapSystem } from '../systems/TileMapSystem.js';
import { tileMapUI } from './TileMapUI.js';

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

        // Initialize tile map UI
        tileMapUI.init('world-map'); // Uses same container

        this.render();
    }

    /**
     * Render the world map with regions OR tile exploration view
     */
    render() {
        if (!this.mapContainer) return;

        // If in tile exploration mode, render tile map instead
        if (tileMapSystem.isInExploration()) {
            tileMapUI.render();
            return;
        }

        // Otherwise render world map
        this.renderWorldMap();
    }

    /**
     * Render the traditional world map with regions
     */
    renderWorldMap() {
        const currentLocation = locationSystem.getCurrentLocation();
        const currentLocationData = locationSystem.getCurrentLocationData();
        const connectedLocations = locationSystem.getConnectedLocations();

        // Clear existing map
        this.mapContainer.innerHTML = '';

        // Create map header with current location
        const mapHeader = document.createElement('div');
        mapHeader.className = 'map-header';
        mapHeader.innerHTML = `
            <div class="text-xs text-gray-400">Current Location</div>
            <div class="text-lg font-bold text-white">${currentLocationData.emoji} ${currentLocationData.name}</div>
            <div class="text-xs text-gray-400 italic">${currentLocationData.description}</div>
        `;
        this.mapContainer.appendChild(mapHeader);

        // Group locations by region
        const locationsByRegion = this.groupLocationsByRegion();

        // Render each region
        Object.keys(REGIONS).forEach(regionId => {
            const region = REGIONS[regionId];
            const locations = locationsByRegion[regionId] || [];

            if (locations.length === 0) return; // Skip regions with no locations

            // Check if any location in this region is current or connected
            const hasCurrentLocation = locations.some(loc => loc.id === currentLocation);
            const hasConnectedLocation = locations.some(loc => connectedLocations.includes(loc.id));
            const isRelevant = hasCurrentLocation || hasConnectedLocation;

            const regionElement = this.createRegionElement(
                region,
                locations,
                currentLocation,
                connectedLocations,
                isRelevant
            );

            this.mapContainer.appendChild(regionElement);
        });

        // Show sub-locations if at a parent location
        if (currentLocationData.subLocations && currentLocationData.subLocations.length > 0) {
            const subLocationsContainer = document.createElement('div');
            subLocationsContainer.className = 'sub-locations-panel';
            subLocationsContainer.innerHTML = `
                <div class="sub-locations-title">📍 Buildings in ${currentLocationData.name}:</div>
            `;

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
    }

    /**
     * Group locations by their region
     */
    groupLocationsByRegion() {
        const grouped = {};

        Object.values(LOCATIONS).forEach(location => {
            // Skip sub-locations (they have a parent)
            if (location.parent) return;

            const regionId = location.region;
            if (!grouped[regionId]) {
                grouped[regionId] = [];
            }
            grouped[regionId].push(location);
        });

        return grouped;
    }

    /**
     * Create a region element with all its locations
     */
    createRegionElement(region, locations, currentLocation, connectedLocations, isRelevant) {
        const regionDiv = document.createElement('details');
        regionDiv.className = 'map-region';
        regionDiv.setAttribute('data-region', region.id);

        // Open the region if it's relevant to current location
        if (isRelevant) {
            regionDiv.setAttribute('open', '');
        }

        // Apply region theme styling
        regionDiv.style.borderLeftColor = region.theme.primary;

        // Region header
        const summary = document.createElement('summary');
        summary.className = 'region-header';
        summary.style.background = region.theme.gradient;
        summary.innerHTML = `
            <div class="region-header-content">
                <div class="region-info">
                    <div class="region-name">${region.name}</div>
                    <div class="region-tier">Tier ${region.tier} • Levels ${region.suggestedLevel}</div>
                </div>
                <button class="region-explore-btn" data-region="${region.id}">
                    🗺️ Explore
                </button>
            </div>
        `;
        regionDiv.appendChild(summary);

        // Add click handler for explore button (prevent summary toggle)
        const exploreBtn = summary.querySelector('.region-explore-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Don't toggle the details
                this.handleExploreRegion(region.id);
            });
        }

        // Region description
        const regionDesc = document.createElement('div');
        regionDesc.className = 'region-description';
        regionDesc.textContent = region.description;
        regionDiv.appendChild(regionDesc);

        // Locations grid
        const locationsGrid = document.createElement('div');
        locationsGrid.className = 'region-locations-grid';

        locations.forEach(location => {
            const isCurrent = location.id === currentLocation;
            const isConnected = connectedLocations.includes(location.id);

            const node = this.createLocationNode(location, isCurrent, isConnected);
            locationsGrid.appendChild(node);
        });

        regionDiv.appendChild(locationsGrid);

        return regionDiv;
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

    /**
     * Handle exploring a region (enter tile map mode)
     */
    handleExploreRegion(regionId) {
        const success = tileMapSystem.enterRegion(regionId);
        if (success) {
            this.render(); // Re-render to show tile map
        }
    }
}

// Export singleton instance
export const mapUI = new MapUI();
