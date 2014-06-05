CQ.Page.Exchange = {
    name: 'exchange',

    init: function () {
        console.info('Initial exchange page');

        var goods1 = CQ.Currency.Exchange.Goods1,
            goods2 = CQ.Currency.Exchange.Goods2,
            goods3 = CQ.Currency.Exchange.Goods3,
            goods4 = CQ.Currency.Exchange.Goods4,
            goods5 = CQ.Currency.Exchange.Goods5;

        $('#exchange-btn-' + goods1.id).text('{0} gem, {1} coin'.format(goods1.gem, goods1.coin)).click({goods: goods1}, this.exchange);
        $('#exchange-btn-' + goods2.id).text('{0} gem, {1} coin'.format(goods2.gem, goods2.coin)).click({goods: goods2}, this.exchange);
        $('#exchange-btn-' + goods3.id).text('{0} gem, {1} coin'.format(goods3.gem, goods3.coin)).click({goods: goods3}, this.exchange);
        $('#exchange-btn-' + goods4.id).text('{0} gem, {1} coin'.format(goods4.gem, goods4.coin)).click({goods: goods4}, this.exchange);
        $('#exchange-btn-' + goods5.id).text('{0} gem, {1} coin'.format(goods5.gem, goods5.coin)).click({goods: goods5}, this.exchange);
    },

    load: function (params) {
        this.params = params;
    },

    exchange: function (event) {
        var goods = event.data.goods;
        console.log('Start coin exchange, goods id: ' + goods.id);

        if (CQ.Currency.checkGem(goods)) {
            CQ.Currency.exchange(goods);
            CQ.Page.Game.refreshCurrency();
            alert('Exchange success, add coin: ' + goods.coin);
        } else {
            // CQ.Page.Exchange.showGemNotEnough();
            $('#exchange-gem-not-enough').popup('open');
        }
    }
};