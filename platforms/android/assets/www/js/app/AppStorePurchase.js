CQ.AppStorePurchase = {
    productIds: ["com.czquiz.gem1",
                 "com.czquiz.gem2",
                 "com.czquiz.gem3",
                 "com.czquiz.gem4",
                 "com.czquiz.gem5"],

    init: function() {
        if (CQ.dev) return;

        if (!window.storekit) {
            console.log("In-App Purchases not available.");
            return;
        }

        storekit.init({
            debug: true,
            ready: CQ.AppStorePurchase.onReady,
            purchase: CQ.AppStorePurchase.onPurchase,
            restore: CQ.AppStorePurchase.onRestore,
            error: CQ.AppStorePurchase.onError
        });
    },

    onReady: function() {
        // Once setup is done, load all product data.
        storekit.load(CQ.AppStorePurchase.productIds, function(products, invalidIds) {
            CQ.AppStorePurchase.products = products;
            CQ.AppStorePurchase.loaded = true;

            for (var i = 0; i < 5; i++) {
                CQ.Currency.Purchase['Goods' + (i + 1)].title = products[i].title;
                CQ.Currency.Purchase['Goods' + (i + 1)].productId = products[i].id;
                CQ.Currency.Purchase['Goods' + (i + 1)].cost = products[i].price;
                // CQ.Currency.Purchase['Goods' + (i + 1)].description = products[i].description;
            }

            CQ.Page.refreshShops();

            for (var i = 0; i < invalidIds.length; ++i) {
                console.error("Could not load " + invalidIds[i]);
            }
        });
    },

    onPurchase: function(transactionId, productId, receipt) {
        var goods = null;

        if (productId === 'com.czquiz.gem1') {
            goods = CQ.Currency.Purchase.Goods1;
        } else if (productId === 'com.czquiz.gem2') {
            goods = CQ.Currency.Purchase.Goods2;
        } else if (productId === 'com.czquiz.gem3') {
            goods = CQ.Currency.Purchase.Goods3;
        } else if (productId === 'com.czquiz.gem4') {
            goods = CQ.Currency.Purchase.Goods4;
        } else if (productId === 'com.czquiz.gem5') {
            goods = CQ.Currency.Purchase.Goods5;
        } else {
            throw 'Unknown productId: {0}, transactionId: {1}'.format(productId, transactionId);
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
    },

    onRestore: function(transactionId, productId, transactionReceipt) {
        // Pseudo code that unlocks the full version.
        if (productId === 'cc.fovea.unlockfullversion') {
            FeatureManager.unlockEverything();
        }
    },

    onError: function(errorCode, errorMessage) {
        console.error('Error: ' + errorMessage);
        CQ.GA.track(CQ.GA.Shop.AppStoreError, errorCode);
    },

    buy: function(productId) {
        storekit.purchase(productId);
    },

    restore: function() {
        storekit.restore();
    }
};

if (CQ.App.iOS()) {
    CQ.App.register(CQ.AppStorePurchase);
}