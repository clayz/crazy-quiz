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

            CQ.Currency.Purchase.Goods1.title = products[0].title;
            CQ.Currency.Purchase.Goods1.productId = products[0].id;
            CQ.Currency.Purchase.Goods1.cost = products[0].price;
//            CQ.Currency.Purchase.Goods1.description = products[0].description;
            CQ.Currency.Purchase.Goods2.title = products[1].title;
            CQ.Currency.Purchase.Goods2.productId = products[1].id;
            CQ.Currency.Purchase.Goods2.cost = products[1].price;
//            CQ.Currency.Purchase.Goods2.description = products[1].description;
            CQ.Currency.Purchase.Goods3.title = products[2].title;
            CQ.Currency.Purchase.Goods3.productId = products[2].id;
            CQ.Currency.Purchase.Goods3.cost = products[2].price;
//            CQ.Currency.Purchase.Goods3.description = products[2].description;
            CQ.Currency.Purchase.Goods4.title = products[3].title;
            CQ.Currency.Purchase.Goods4.productId = products[3].id;
            CQ.Currency.Purchase.Goods4.cost = products[3].price;
//            CQ.Currency.Purchase.Goods4.description = products[3].description;
            CQ.Currency.Purchase.Goods5.title = products[4].title;
            CQ.Currency.Purchase.Goods5.productId = products[4].id;
            CQ.Currency.Purchase.Goods5.cost = products[4].price;
//            CQ.Currency.Purchase.Goods5.description = products[4].description;
            CQ.Page.Game.gemShop.initGem();
            for (var i = 0; i < invalidIds.length; ++i) {
                console.log("Error: could not load " + invalidIds[i]);
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
        
        alert("Purchase success!");
        
        CQ.Page.Game.gemShop.close();
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
}

if (CQ.App.iOS()) {
    CQ.App.register(CQ.AppStorePurchase);
}