/**
 * MerchantUI.js
 * Renders the merchant/shop interface
 */

import { merchantSystem } from '../systems/MerchantSystem.js';
import { inventorySystem } from '../systems/InventorySystem.js';
import { getItemEmoji } from '../data/GameData.js';

class MerchantUI {
    constructor() {
        this.container = null;
    }

    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Merchant container '${containerId}' not found!`);
            return;
        }
    }

    /**
     * Render the merchant interface
     */
    render() {
        if (!this.container) return;

        const shopItems = merchantSystem.getShopItems();
        const playerCoins = inventorySystem.getItemCount('Coins');
        const playerItems = inventorySystem.getNonEmptyItems();

        this.container.innerHTML = `
            <div class="merchant-interface">
                <div class="merchant-header">
                    <h3 class="text-lg font-semibold text-white">Merchant Shop</h3>
                    <div class="merchant-coins">
                        <span class="text-yellow-400 font-bold">💰 ${playerCoins} Coins</span>
                    </div>
                </div>

                <div class="merchant-tabs">
                    <button class="merchant-tab active" data-tab="buy">Buy</button>
                    <button class="merchant-tab" data-tab="sell">Sell</button>
                </div>

                <div class="merchant-content">
                    <div class="merchant-panel active" id="buy-panel">
                        ${this.renderBuyPanel(shopItems, playerCoins)}
                    </div>
                    <div class="merchant-panel hidden" id="sell-panel">
                        ${this.renderSellPanel(playerItems)}
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    /**
     * Render buy panel
     */
    renderBuyPanel(shopItems, playerCoins) {
        const itemsArray = Object.entries(shopItems);

        return `
            <div class="shop-items-grid">
                ${itemsArray.map(([itemName, itemData]) => {
                    const emoji = getItemEmoji(itemName);
                    const canAfford = playerCoins >= itemData.buyPrice;

                    return `
                        <div class="shop-item ${!canAfford ? 'shop-item-disabled' : ''}">
                            <div class="shop-item-icon">${emoji}</div>
                            <div class="shop-item-info">
                                <div class="shop-item-name">${itemName}</div>
                                <div class="shop-item-price">💰 ${itemData.buyPrice}</div>
                            </div>
                            <div class="shop-item-actions">
                                <button class="shop-btn shop-btn-buy"
                                        data-item="${itemName}"
                                        data-amount="1"
                                        ${!canAfford ? 'disabled' : ''}>
                                    Buy 1
                                </button>
                                <button class="shop-btn shop-btn-buy"
                                        data-item="${itemName}"
                                        data-amount="5"
                                        ${playerCoins < (itemData.buyPrice * 5) ? 'disabled' : ''}>
                                    Buy 5
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Render sell panel
     */
    renderSellPanel(playerItems) {
        // Filter out coins from selling
        const sellableItems = Object.entries(playerItems).filter(([name]) => name !== 'Coins');

        if (sellableItems.length === 0) {
            return '<div class="text-gray-500 text-sm p-4">You have no items to sell</div>';
        }

        return `
            <div class="shop-items-grid">
                ${sellableItems.map(([itemName, count]) => {
                    const emoji = getItemEmoji(itemName);
                    const sellPrice = merchantSystem.getSellPrice(itemName);

                    if (sellPrice === 0) return ''; // Can't sell this item

                    return `
                        <div class="shop-item">
                            <div class="shop-item-icon">${emoji}</div>
                            <div class="shop-item-info">
                                <div class="shop-item-name">${itemName}</div>
                                <div class="shop-item-count">Own: ${count}</div>
                                <div class="shop-item-price">💰 ${sellPrice} ea</div>
                            </div>
                            <div class="shop-item-actions">
                                <button class="shop-btn shop-btn-sell"
                                        data-item="${itemName}"
                                        data-amount="1">
                                    Sell 1
                                </button>
                                <button class="shop-btn shop-btn-sell"
                                        data-item="${itemName}"
                                        data-amount="all">
                                    Sell All
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Tab switching
        const tabs = this.container.querySelectorAll('.merchant-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Buy buttons
        const buyButtons = this.container.querySelectorAll('.shop-btn-buy');
        buyButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemName = button.dataset.item;
                const amount = parseInt(button.dataset.amount);
                merchantSystem.buyItem(itemName, amount);
            });
        });

        // Sell buttons
        const sellButtons = this.container.querySelectorAll('.shop-btn-sell');
        sellButtons.forEach(button => {
            button.addEventListener('click', () => {
                const itemName = button.dataset.item;
                const amount = button.dataset.amount;

                if (amount === 'all') {
                    const count = inventorySystem.getItemCount(itemName);
                    merchantSystem.sellItem(itemName, count);
                } else {
                    merchantSystem.sellItem(itemName, parseInt(amount));
                }
            });
        });
    }

    /**
     * Switch between buy/sell tabs
     */
    switchTab(tabName) {
        // Update tab buttons
        const tabs = this.container.querySelectorAll('.merchant-tab');
        tabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update panels
        const buyPanel = this.container.querySelector('#buy-panel');
        const sellPanel = this.container.querySelector('#sell-panel');

        if (tabName === 'buy') {
            buyPanel.classList.remove('hidden');
            buyPanel.classList.add('active');
            sellPanel.classList.add('hidden');
            sellPanel.classList.remove('active');
        } else {
            sellPanel.classList.remove('hidden');
            sellPanel.classList.add('active');
            buyPanel.classList.add('hidden');
            buyPanel.classList.remove('active');
        }
    }
}

export const merchantUI = new MerchantUI();
