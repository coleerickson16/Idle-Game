/**
 * BankSystem.js
 * Manages player bank storage
 */

import { gameState } from '../core/GameState.js';
import { inventorySystem } from './InventorySystem.js';

class BankSystem {
    /**
     * Deposit item from inventory to bank
     */
    deposit(itemName, amount = 1) {
        if (!inventorySystem.hasItem(itemName, amount)) {
            this.dispatchBankError(`You don't have ${amount}x ${itemName} to deposit.`);
            return false;
        }

        inventorySystem.removeItem(itemName, amount);
        gameState.addBankItem(itemName, amount);

        this.dispatchBankUpdate('deposit', itemName, amount);
        return true;
    }

    /**
     * Withdraw item from bank to inventory
     */
    withdraw(itemName, amount = 1) {
        if (!this.hasItem(itemName, amount)) {
            this.dispatchBankError(`You don't have ${amount}x ${itemName} in your bank.`);
            return false;
        }

        gameState.removeBankItem(itemName, amount);
        inventorySystem.addItem(itemName, amount);

        this.dispatchBankUpdate('withdraw', itemName, amount);
        return true;
    }

    /**
     * Deposit all of an item from inventory
     */
    depositAll(itemName) {
        const amount = inventorySystem.getItemCount(itemName);
        if (amount <= 0) {
            this.dispatchBankError(`You don't have any ${itemName} to deposit.`);
            return false;
        }

        return this.deposit(itemName, amount);
    }

    /**
     * Check if bank has item
     */
    hasItem(itemName, amount = 1) {
        return this.getItemCount(itemName) >= amount;
    }

    /**
     * Get count of item in bank
     */
    getItemCount(itemName) {
        return gameState.getBankItem(itemName) || 0;
    }

    /**
     * Get all bank items
     */
    getAllItems() {
        return gameState.getAllBankItems();
    }

    /**
     * Get items with count > 0
     */
    getNonEmptyItems() {
        const allItems = this.getAllItems();
        const nonEmpty = {};

        Object.keys(allItems).forEach(itemName => {
            if (allItems[itemName] > 0) {
                nonEmpty[itemName] = allItems[itemName];
            }
        });

        return nonEmpty;
    }

    /**
     * Get total items in bank
     */
    getTotalItems() {
        const items = this.getAllItems();
        return Object.values(items).reduce((sum, count) => sum + count, 0);
    }

    // Event dispatching
    dispatchBankUpdate(action, itemName, amount) {
        window.dispatchEvent(new CustomEvent('bankUpdated', {
            detail: { action, itemName, amount }
        }));
    }

    dispatchBankError(message) {
        window.dispatchEvent(new CustomEvent('bankError', {
            detail: { message }
        }));
    }
}

export const bankSystem = new BankSystem();
