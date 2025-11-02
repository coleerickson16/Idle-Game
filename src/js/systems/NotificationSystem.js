/**
 * NotificationSystem.js
 * Manages floating notifications for resource gains and other events
 */

import { getItemEmoji } from '../data/GameData.js';

class NotificationSystem {
    constructor() {
        this.notificationsContainer = null;
        this.notificationQueue = [];
        this.maxVisible = 5; // Max notifications visible at once
    }

    init() {
        // Create notifications container if it doesn't exist
        this.notificationsContainer = document.getElementById('notifications');
        if (!this.notificationsContainer) {
            this.notificationsContainer = document.createElement('div');
            this.notificationsContainer.id = 'notifications';
            this.notificationsContainer.className = 'notifications-container';
            document.body.appendChild(this.notificationsContainer);
        }
    }

    /**
     * Show a resource gain notification
     */
    showResourceGain(itemName, amount) {
        const emoji = getItemEmoji(itemName);
        this.show(`+${amount} ${itemName} ${emoji}`, 'resource');
    }

    /**
     * Show a generic notification
     */
    show(message, type = 'info') {
        if (!this.notificationsContainer) {
            this.init();
        }

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add to container
        this.notificationsContainer.appendChild(notification);

        // Trigger animation
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 10);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('notification-show');
            notification.classList.add('notification-hide');

            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);

        // Limit number of visible notifications
        this.pruneNotifications();
    }

    /**
     * Remove oldest notifications if too many
     */
    pruneNotifications() {
        const notifications = this.notificationsContainer.querySelectorAll('.notification');
        if (notifications.length > this.maxVisible) {
            const toRemove = notifications.length - this.maxVisible;
            for (let i = 0; i < toRemove; i++) {
                notifications[i].remove();
            }
        }
    }
}

// Export singleton instance
export const notificationSystem = new NotificationSystem();
