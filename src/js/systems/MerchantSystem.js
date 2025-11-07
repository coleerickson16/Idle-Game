/**
 * MerchantSystem.js
 * Manages buying and selling items with the merchant
 */

import { inventorySystem } from './InventorySystem.js';
import { SHOP_ITEMS } from '../data/GameData.js';

class MerchantSystem {
    /**
     * Buy an item from the merchant
     */
    buyItem(itemName, quantity = 1) {
        const shopItem = SHOP_ITEMS[itemName];

        if (!shopItem) {
            this.dispatchMerchantError(`${itemName} is not available for purchase.`);
            return false;
        }

        const totalCost = shopItem.buyPrice * quantity;
        const currentCoins = inventorySystem.getItemCount('Coins');

        if (currentCoins < totalCost) {
            this.dispatchMerchantError(`Not enough coins! Need ${totalCost}, have ${currentCoins}.`);
            return false;
        }

        // Remove coins and add item
        inventorySystem.removeItem('Coins', totalCost);
        inventorySystem.addItem(itemName, quantity);

        this.dispatchMerchantUpdate('buy', itemName, quantity, totalCost);
        return true;
    }

    /**
     * Sell an item to the merchant
     */
    sellItem(itemName, quantity = 1) {
        if (!inventorySystem.hasItem(itemName, quantity)) {
            this.dispatchMerchantError(`You don't have ${quantity}x ${itemName} to sell.`);
            return false;
        }

        const sellPrice = this.getSellPrice(itemName);

        if (sellPrice === 0) {
            this.dispatchMerchantError(`${itemName} cannot be sold.`);
            return false;
        }

        const totalValue = sellPrice * quantity;

        // Remove item and add coins
        inventorySystem.removeItem(itemName, quantity);
        inventorySystem.addItem('Coins', totalValue);

        this.dispatchMerchantUpdate('sell', itemName, quantity, totalValue);
        return true;
    }

    /**
     * Get buy price for an item
     */
    getBuyPrice(itemName) {
        const shopItem = SHOP_ITEMS[itemName];
        return shopItem ? shopItem.buyPrice : null;
    }

    /**
     * Get sell price for an item (50% of buy price, or custom)
     */
    getSellPrice(itemName) {
        const shopItem = SHOP_ITEMS[itemName];
        if (shopItem && shopItem.sellPrice !== undefined) {
            return shopItem.sellPrice;
        }
        // Default: sell for 50% of buy price if item is in shop
        if (shopItem) {
            return Math.floor(shopItem.buyPrice * 0.5);
        }
        // Not in shop, check if it's a resource - generic sell price
        return this.getGenericSellPrice(itemName);
    }

    /**
     * Get generic sell price for items not in shop
     */
    getGenericSellPrice(itemName) {
        // Define base sell prices for common items
        const genericPrices = {
            // Logs
            'Logs': 2,
            'OakLogs': 4,
            'WillowLogs': 8,
            'MapleLogs': 15,
            'YewLogs': 30,
            'MagicLogs': 60,

            // Ores
            'CopperOre': 3,
            'IronOre': 8,
            'MithrilOre': 20,
            'AdamantOre': 50,
            'RuneOre': 100,

            // Bars
            'BronzeBar': 15,
            'IronBar': 30,
            'MithrilBar': 75,
            'AdamantBar': 180,
            'RuneBar': 400,

            // Fish
            'RawShrimp': 2,
            'RawTrout': 5,
            'RawSalmon': 10,
            'RawLobster': 25,
            'RawSwordfish': 50,

            // Cooked Fish
            'CookedShrimp': 4,
            'CookedTrout': 10,
            'CookedSalmon': 20,
            'CookedLobster': 50,
            'CookedSwordfish': 100,

            // Other
            'Bones': 1,
        };

        return genericPrices[itemName] || 0;
    }

    /**
     * Get all items available in shop
     */
    getShopItems() {
        return SHOP_ITEMS;
    }

    // Event dispatching
    dispatchMerchantUpdate(action, itemName, quantity, value) {
        window.dispatchEvent(new CustomEvent('merchantTransaction', {
            detail: { action, itemName, quantity, value }
        }));
    }

    dispatchMerchantError(message) {
        window.dispatchEvent(new CustomEvent('merchantError', {
            detail: { message }
        }));
    }
}

export const merchantSystem = new MerchantSystem();
