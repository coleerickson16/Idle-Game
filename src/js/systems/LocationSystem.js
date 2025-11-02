/**
 * LocationSystem.js
 * Manages player location, zone travel, and location-based features
 */

import { LOCATIONS } from '../data/GameData.js';
import { gameState } from '../core/GameState.js';

class LocationSystem {
    constructor() {
        this.currentLocation = 'Town'; // Start in Town
    }

    /**
     * Initialize the location system
     */
    init() {
        // Load saved location from game state
        const savedLocation = gameState.getCurrentLocation();
        if (savedLocation && LOCATIONS[savedLocation]) {
            this.currentLocation = savedLocation;
        } else {
            this.currentLocation = 'Town';
            gameState.setCurrentLocation('Town');
        }
    }

    /**
     * Get the current location ID
     */
    getCurrentLocation() {
        return this.currentLocation;
    }

    /**
     * Get the current location data object
     */
    getCurrentLocationData() {
        return LOCATIONS[this.currentLocation];
    }

    /**
     * Get all location data
     */
    getAllLocations() {
        return LOCATIONS;
    }

    /**
     * Check if a location is unlocked for the player
     */
    isLocationUnlocked(locationId) {
        const location = LOCATIONS[locationId];
        if (!location) return false;

        // Check if location is unlocked by default
        if (location.unlocked === false) return false;

        // Check level requirements if any
        if (location.levelRequirement) {
            const { skill, level } = location.levelRequirement;
            const playerLevel = gameState.getLevel(skill);
            if (playerLevel < level) return false;
        }

        return true;
    }

    /**
     * Check if the player can travel to a location
     */
    canTravelTo(locationId) {
        const targetLocation = LOCATIONS[locationId];
        if (!targetLocation) {
            return { success: false, reason: 'Location does not exist.' };
        }

        // Check if already at this location
        if (this.currentLocation === locationId) {
            return { success: false, reason: 'You are already at this location.' };
        }

        const currentLocationData = LOCATIONS[this.currentLocation];
        const targetLocationData = LOCATIONS[locationId];

        // Check if navigating within parent/sub-location hierarchy
        // Can travel from parent to sub-location
        if (currentLocationData.subLocations && currentLocationData.subLocations.includes(locationId)) {
            return { success: true };
        }

        // Can travel from sub-location back to parent
        if (currentLocationData.parent && currentLocationData.parent === locationId) {
            return { success: true };
        }

        // Check if locations are connected normally
        if (!currentLocationData.connections.includes(locationId)) {
            return { success: false, reason: 'You cannot travel there from here.' };
        }

        // Check if location is unlocked
        if (!this.isLocationUnlocked(locationId)) {
            return { success: false, reason: 'This location is locked.' };
        }

        return { success: true };
    }

    /**
     * Travel to a new location
     */
    travelTo(locationId) {
        const canTravel = this.canTravelTo(locationId);

        if (!canTravel.success) {
            this.dispatchTravelError(canTravel.reason);
            return false;
        }

        const oldLocation = this.currentLocation;
        this.currentLocation = locationId;
        gameState.setCurrentLocation(locationId);

        this.dispatchLocationChange(oldLocation, locationId);
        return true;
    }

    /**
     * Get activities available at current location
     */
    getAvailableActivities() {
        const locationData = this.getCurrentLocationData();
        return locationData.activities || [];
    }

    /**
     * Get activities available at a specific location
     */
    getActivitiesAtLocation(locationId) {
        const location = LOCATIONS[locationId];
        return location ? location.activities || [] : [];
    }

    /**
     * Get connected locations from current location
     * Includes normal connections, sub-locations, and parent location
     */
    getConnectedLocations() {
        const locationData = this.getCurrentLocationData();
        const connected = [...(locationData.connections || [])];

        // Add sub-locations if any
        if (locationData.subLocations) {
            connected.push(...locationData.subLocations);
        }

        // Add parent location if this is a sub-location
        if (locationData.parent) {
            connected.push(locationData.parent);
        }

        return connected;
    }

    // ==================== Event Dispatching ====================

    /**
     * Dispatch location change event
     */
    dispatchLocationChange(oldLocation, newLocation) {
        const event = new CustomEvent('location-change', {
            detail: {
                oldLocation,
                newLocation,
                locationData: LOCATIONS[newLocation]
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * Dispatch travel error event
     */
    dispatchTravelError(reason) {
        const event = new CustomEvent('travel-error', {
            detail: { reason }
        });
        window.dispatchEvent(event);
    }
}

// Export singleton instance
export const locationSystem = new LocationSystem();
