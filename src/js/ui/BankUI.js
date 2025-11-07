/**
 * BankUI.js
 * Renders the bank interface for item storage
 */

import { bankSystem } from '../systems/BankSystem.js';
import { inventorySystem } from '../systems/InventorySystem.js';
import { getItemEmoji } from '../data/GameData.js';

class BankUI {
    constructor() {
        this.container = null;
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Bank container '${containerId}' not found!`);
            return;
        }
    }

    /**
     * Render the bank interface
     */
    render() {
        if (!this.container) return;

        const bankItems = bankSystem.getNonEmptyItems();
        const inventoryItemsArray = inventorySystem.getNonEmptyItems();

        // Convert inventory array to object format
        const inventoryItems = {};
        inventoryItemsArray.forEach(item => {
            inventoryItems[item.name] = item.count;
        });

        const totalBankItems = bankSystem.getTotalItems();

        this.container.innerHTML = `
            <div class="bank-interface">
                <div class="bank-header">
                    <h3 class="text-lg font-semibold text-white">Bank Storage</h3>
                    <div class="text-sm text-gray-400">Items stored: ${totalBankItems}</div>
                </div>

                <div class="bank-sections">
                    <!-- Bank Items -->
                    <div class="bank-section">
                        <h4 class="text-sm font-semibold text-gray-300 mb-2">🏦 In Bank</h4>
                        <div class="bank-items-grid">
                            ${this.renderBankItems(bankItems)}
                        </div>
                    </div>

                    <!-- Inventory Items -->
                    <div class="bank-section">
                        <h4 class="text-sm font-semibold text-gray-300 mb-2">🎒 Inventory</h4>
                        <div class="bank-items-grid">
                            ${this.renderInventoryItems(inventoryItems)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    /**
     * Render bank items
     */
    renderBankItems(items) {
        const itemsArray = Object.entries(items);

        if (itemsArray.length === 0) {
            return '<div class="text-gray-500 text-sm">Bank is empty</div>';
        }

        return itemsArray.map(([itemName, count]) => {
            const emoji = getItemEmoji(itemName);
            return `
                <div class="bank-item">
                    <div class="bank-item-icon">${emoji}</div>
                    <div class="bank-item-info">
                        <div class="bank-item-name">${itemName}</div>
                        <div class="bank-item-count">${count}</div>
                    </div>
                    <div class="bank-item-actions">
                        <button class="bank-btn bank-btn-withdraw" data-item="${itemName}" data-amount="1">
                            ← 1
                        </button>
                        <button class="bank-btn bank-btn-withdraw" data-item="${itemName}" data-amount="all">
                            ← All
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Render inventory items
     */
    renderInventoryItems(items) {
        const itemsArray = Object.entries(items);

        if (itemsArray.length === 0) {
            return '<div class="text-gray-500 text-sm">Inventory is empty</div>';
        }

        return itemsArray.map(([itemName, count]) => {
            const emoji = getItemEmoji(itemName);
            return `
                <div class="bank-item">
                    <div class="bank-item-icon">${emoji}</div>
                    <div class="bank-item-info">
                        <div class="bank-item-name">${itemName}</div>
                        <div class="bank-item-count">${count}</div>
                    </div>
                    <div class="bank-item-actions">
                        <button class="bank-btn bank-btn-deposit" data-item="${itemName}" data-amount="1">
                            1 →
                        </button>
                        <button class="bank-btn bank-btn-deposit" data-item="${itemName}" data-amount="all">
                            All →
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Attach event listeners to buttons
     */
    attachEventListeners() {
        // Deposit buttons
        const depositButtons = this.container.querySelectorAll('.bank-btn-deposit');
        depositButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemName = button.dataset.item;
                const amount = button.dataset.amount;

                if (amount === 'all') {
                    bankSystem.depositAll(itemName);
                } else {
                    bankSystem.deposit(itemName, parseInt(amount));
                }
            });
        });

        // Withdraw buttons
        const withdrawButtons = this.container.querySelectorAll('.bank-btn-withdraw');
        withdrawButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemName = button.dataset.item;
                const amount = button.dataset.amount;

                if (amount === 'all') {
                    const count = bankSystem.getItemCount(itemName);
                    bankSystem.withdraw(itemName, count);
                } else {
                    bankSystem.withdraw(itemName, parseInt(amount));
                }
            });
        });
    }
}

export const bankUI = new BankUI();
