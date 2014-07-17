CQ.AppStorePurchase = {
    productIds: ["com.czquiz.gem1",
                 "com.czquiz.gem2",
                 "com.czquiz.gem3",
                 "com.czquiz.gem4",
                 "com.czquiz.gem5"],

    init:function(){
        if(!window.storekit){
            console.log("In-App Purchases not available.")
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

    onReady: function(){
        // Once setup is done, load all product data.
        storekit.load(CQ.AppStorePurchase.productIds, function (products, invalidIds) {
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

    onPurchase: function (transactionId, productId, receipt) {

        if (productId === 'com.czquiz.gem1') {
            CQ.Currency.purchase(CQ.Currency.Purchase.Goods1);
        } else if (productId === 'com.czquiz.gem2'){
            CQ.Currency.purchase(CQ.Currency.Purchase.Goods2);
        } else if (productId === 'com.czquiz.gem3'){
            CQ.Currency.purchase(CQ.Currency.Purchase.Goods3);
        } else if (productId === 'com.czquiz.gem4'){
            CQ.Currency.purchase(CQ.Currency.Purchase.Goods4);
        } else {
            CQ.Currency.purchase(CQ.Currency.Purchase.Goods5);
        }

        CQ.Page.refreshCurrency();
        CQ.Page.closePopup();

        alert("Purchase success!");
    },

    onRestore: function (transactionId, productId, transactionReceipt) {
        // Pseudo code that unlocks the full version.
        if (productId === 'cc.fovea.unlockfullversion') {
            FeatureManager.unlockEverything();
        }
    },

    onError: function (errorCode, errorMessage) {
        alert('Error: ' + errorMessage);
    },

    buy: function(productId){
        storekit.purchase(productId);
    },

    restore: function(){
        storekit.restore();
    }
};

if (CQ.App.iOS()) {
    CQ.App.register(CQ.AppStorePurchase);
}