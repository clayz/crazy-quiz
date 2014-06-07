CQ.Page.Purchase = {
    name: 'purchase',

    init: function() {
        console.info('Initial purchase page');
        this.initCommon();

        var goods1 = CQ.Currency.Purchase.Goods1,
            goods2 = CQ.Currency.Purchase.Goods2,
            goods3 = CQ.Currency.Purchase.Goods3,
            goods4 = CQ.Currency.Purchase.Goods4,
            goods5 = CQ.Currency.Purchase.Goods5;

        $(CQ.Id.Purchase.$PURCHASE.format(goods1.id)).text('{0} gem, ¥{1}'.format(goods1.gem, goods1.cost)).click({goods: goods1}, this.buy);
        $(CQ.Id.Purchase.$PURCHASE.format(goods2.id)).text('{0} gem, ¥{1}'.format(goods2.gem, goods2.cost)).click({goods: goods2}, this.buy);
        $(CQ.Id.Purchase.$PURCHASE.format(goods3.id)).text('{0} gem, ¥{1}'.format(goods3.gem, goods3.cost)).click({goods: goods3}, this.buy);
        $(CQ.Id.Purchase.$PURCHASE.format(goods4.id)).text('{0} gem, ¥{1}'.format(goods4.gem, goods4.cost)).click({goods: goods4}, this.buy);
        $(CQ.Id.Purchase.$PURCHASE.format(goods5.id)).text('{0} gem, ¥{1}'.format(goods5.gem, goods5.cost)).click({goods: goods5}, this.buy);

        $('#purchase-products-btn').click(function() {
            CQ.PlayBilling.getAvailable();
        });

        $('#purchase-owned-btn').click(function() {
            CQ.PlayBilling.ownedProducts();
        });
    },

    load: function(params) {
        this.params = params;
    },

    buy: function(event) {
        var goods = event.data.goods;
        console.log('Start transaction, goods id: ' + goods.id);

        CQ.Currency.purchase(goods);
        CQ.Page.refreshCurrency();
        CQ.PlayBilling.buy('v1_gem_001');

        $(CQ.Id.Purchase.$POPUP_SUCCESS).popup('open');
    }
};

CQ.App.inherits(CQ.Page.Purchase, CQ.Page);
CQ.App.register(CQ.Page.Purchase);