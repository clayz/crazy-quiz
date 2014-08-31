CQ.PlayBilling = {
    inAppBillingPlugin: null,

    /**
     * Initialize the billing plugin.
     */
    init: function() {
        console.info('Initial play billing module');

        this.inAppBillingPlugin = window.plugins.inappbilling;
        this.inAppBillingPlugin.init(CQ.PlayBilling.successHandler, CQ.PlayBilling.errorHandler, { showLog: true }, [
            CQ.Currency.Purchase.Goods1.productId,
            CQ.Currency.Purchase.Goods2.productId,
            CQ.Currency.Purchase.Goods3.productId,
            CQ.Currency.Purchase.Goods4.productId,
            CQ.Currency.Purchase.Goods5.productId
        ]);
    },

    /**
     * Purchase an item. You cannot buy an item that you already own.
     */
    buy: function(productId) {
        this.inAppBillingPlugin.buy(this.successHandler, this.errorHandler, productId);
    },

    /**
     * The list of owned products are retrieved from the local database.
     */
    ownedProducts: function() {
        this.inAppBillingPlugin.getPurchases(this.successHandler, this.errorHandler);
    },

    /**
     * Consume an item. You can consume an item that you own.
     * Once an item is consumed, it is not owned anymore.
     */
    consumePurchase: function(productId) {
        this.inAppBillingPlugin.consumePurchase(this.successHandler, this.errorHandler, productId);
    },

    /**
     * Subscribe to an item.
     */
    subscribe: function(subscriptionId) {
        this.inAppBillingPlugin.subscribe(this.successHandler, this.errorHandler, subscriptionId);
    },

    /**
     * Load the available product(s) to inventory.
     * Not needed if you use the init(success, error, options, skus) method.
     * Can be used to update inventory if you need to add more skus.
     */
    getDetails: function(skus) {
        this.inAppBillingPlugin.getProductDetails(this.successHandler, this.errorHandler, skus);
    },

    /**
     * The list of the available product(s) in inventory.
     */
    getAvailable: function() {
        this.inAppBillingPlugin.getAvailableProducts(this.successHandler, this.errorHandler);
    },

    successHandler: function(result) {
        CQ.Page.closeLoading();
        var resultText = typeof result === 'object' ? JSON.stringify(result) : result;
        console.info('Billing success, result: {0}'.format(resultText));
    },

    errorHandler: function(error) {
        CQ.Page.closeLoading();
        console.error('Billing failed, error: {0}'.format(error));
        CQ.GA.track(CQ.GA.Shop.PlayStoreError, error);
    }
};

if (CQ.App.android()) {
    CQ.App.register(CQ.PlayBilling);
}