CQ.PlayBilling = {
    inAppBillingPlugin: null,
    productIds: [
        "com.crazyquiz.gem1",
        "com.crazyquiz.gem2",
        "com.crazyquiz.gem3",
        "com.crazyquiz.gem4",
        "com.crazyquiz.gem5"],

    /**
     * Initialize the billing plugin.
     */
    init: function() {
        console.info('Initial play billing module');
        this.inAppBillingPlugin = window.plugins.inappbilling;
        this.inAppBillingPlugin.init(CQ.PlayBilling.successHandler, CQ.PlayBilling.errorHandler, { showLog: true }, this.productIds);

        for (var i = 0; i < 5; i++) {
            CQ.Currency.Purchase['Goods' + (i + 1)].productId = this.productIds[i];
        }
    },

    /**
     * Purchase an item. You cannot buy an item that you already own.
     */
    buy: function(productId) {
        this.inAppBillingPlugin.buy(function(result) {
            console.info("Buy success, productId: {0}".format(productId));
            CQ.PlayBilling.successHandler(result);
            CQ.PlayBilling.consumePurchase(result.productId);
        }, this.errorHandler, productId);
    },

    /**
     * Consume an item. You can consume an item that you own.
     * Once an item is consumed, it is not owned anymore.
     */
    consumePurchase: function(productId) {
        this.inAppBillingPlugin.consumePurchase(function(result) {
            console.info("Consume success, productId: {0}".format(productId));
            CQ.PlayBilling.successHandler(result);
            var goods = null;

            if (productId == 'com.crazyquiz.gem1') {
                goods = CQ.Currency.Purchase.Goods1;
            } else if (productId == 'com.crazyquiz.gem2') {
                goods = CQ.Currency.Purchase.Goods2;
            } else if (productId == 'com.crazyquiz.gem3') {
                goods = CQ.Currency.Purchase.Goods3;
            } else if (productId == 'com.crazyquiz.gem4') {
                goods = CQ.Currency.Purchase.Goods4;
            } else if (productId == 'com.crazyquiz.gem5') {
                goods = CQ.Currency.Purchase.Goods5;
            } else {
                throw 'Unknown productId: {0}'.format(productId);
            }

            CQ.Currency.purchase(goods);

            // get more 10 gem for first time purchase
            if (CQ.Currency.history.purchase.length == 1) {
                CQ.Currency.earn(CQ.Currency.Earn.FirstPurchase);
                CQ.Page.openPrompt('{0}個宝石を購入しました。<br/>10個宝石ギフトをもらった。'.format(goods.gem));
                CQ.GA.track(CQ.GA.Gift.FirstPurchase, CQ.GA.Gift.FirstPurchase.label.format(goods.id));
            } else {
                CQ.Page.openPrompt('{0}個宝石を購入しました。'.format(goods.gem));
            }

            CQ.Page.refreshCurrency();
        }, this.errorHandler, productId);
    },

    /**
     * The list of owned products are retrieved from the local database.
     */
    ownedProducts: function() {
        this.inAppBillingPlugin.getPurchases(this.successHandler, this.errorHandler);
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
        console.info('Result data: {0}'.format(resultText));
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