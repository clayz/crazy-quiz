CQ.Page.Exchange = {
    name: 'exchange',

    init: function() {
        console.info('Initial exchange page');
        this.initCommon();

        var goods1 = CQ.Currency.Exchange.Goods1,
            goods2 = CQ.Currency.Exchange.Goods2,
            goods3 = CQ.Currency.Exchange.Goods3,
            goods4 = CQ.Currency.Exchange.Goods4,
            goods5 = CQ.Currency.Exchange.Goods5;

        $(CQ.Id.Exchange.$EXCHANGE.format(goods1.id)).text('{0} gem, {1} coin'.format(goods1.gem, goods1.coin)).tap({goods: goods1}, this.exchange);
        $(CQ.Id.Exchange.$EXCHANGE.format(goods2.id)).text('{0} gem, {1} coin'.format(goods2.gem, goods2.coin)).tap({goods: goods2}, this.exchange);
        $(CQ.Id.Exchange.$EXCHANGE.format(goods3.id)).text('{0} gem, {1} coin'.format(goods3.gem, goods3.coin)).tap({goods: goods3}, this.exchange);
        $(CQ.Id.Exchange.$EXCHANGE.format(goods4.id)).text('{0} gem, {1} coin'.format(goods4.gem, goods4.coin)).tap({goods: goods4}, this.exchange);
        $(CQ.Id.Exchange.$EXCHANGE.format(goods5.id)).text('{0} gem, {1} coin'.format(goods5.gem, goods5.coin)).tap({goods: goods5}, this.exchange);
    },

    load: function(params) {
        this.params = params;
    },

    exchange: function(event) {
        var goods = event.data.goods;
        console.log('Start coin exchange, goods id: ' + goods.id);

        if (CQ.Currency.checkGem(goods)) {
            CQ.Currency.exchange(goods);
            CQ.Page.refreshCurrency();
            $(CQ.Id.Exchange.$POPUP_SUCCESS).popup('open');
        } else {
            CQ.Page.Exchange.showGemNotEnough();
        }
    }
};

CQ.App.inherits(CQ.Page.Exchange, CQ.Page);
CQ.App.register(CQ.Page.Exchange);