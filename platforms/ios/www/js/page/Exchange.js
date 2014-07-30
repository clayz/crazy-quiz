CQ.Page.Exchange = {
    name: 'exchange',
    selected: null,

    init: function() {
        console.info('Initial exchange page');

        this.initCommon({ header: true, back: true });
        $(CQ.Id.Exchange.$POPUP_CONFIRM).bind(this.popupEvents);
        $(CQ.Id.Exchange.$POPUP_CONFIRM_YES).click(this.exchange);

        var goods1 = CQ.Currency.Exchange.Goods1,
            goods2 = CQ.Currency.Exchange.Goods2,
            goods3 = CQ.Currency.Exchange.Goods3,
            goods4 = CQ.Currency.Exchange.Goods4,
            goods5 = CQ.Currency.Exchange.Goods5;

        $(CQ.Id.Exchange.$EXCHANGE.format(goods1.id)).text('{0} gem, {1} coin'.format(goods1.gem, goods1.coin)).click({goods: goods1}, this.click);
        $(CQ.Id.Exchange.$EXCHANGE.format(goods2.id)).text('{0} gem, {1} coin'.format(goods2.gem, goods2.coin)).click({goods: goods2}, this.click);
        $(CQ.Id.Exchange.$EXCHANGE.format(goods3.id)).text('{0} gem, {1} coin'.format(goods3.gem, goods3.coin)).click({goods: goods3}, this.click);
        $(CQ.Id.Exchange.$EXCHANGE.format(goods4.id)).text('{0} gem, {1} coin'.format(goods4.gem, goods4.coin)).click({goods: goods4}, this.click);
        $(CQ.Id.Exchange.$EXCHANGE.format(goods5.id)).text('{0} gem, {1} coin'.format(goods5.gem, goods5.coin)).click({goods: goods5}, this.click);
    },

    load: function(params) {
        this.params = params;
    },

    click: function(event) {
        CQ.Page.Exchange.selected = event.data.goods;
        CQ.GA.track(CQ.GA.Shop.Click, CQ.GA.Shop.Click.label.format('Exchange', CQ.Page.Exchange.selected.id));

        if (CQ.Currency.checkGem(CQ.Page.Exchange.selected)) {
            $(CQ.Id.Exchange.$POPUP_CONFIRM).popup('open');
        } else {
            CQ.Page.Exchange.openGemNotEnough();
        }
    },

    exchange: function() {
        var goods = CQ.Page.Exchange.selected;
        $(CQ.Id.Exchange.$POPUP_CONFIRM).popup('close');
        console.log('Start coin exchange, goods id: ' + goods.id);

        if (CQ.Currency.checkGem(goods)) {
            CQ.Currency.exchange(goods);
            CQ.Page.Exchange.onSuccess();
            CQ.GA.track(CQ.GA.Shop.Exchange, CQ.GA.Shop.Exchange.label.format(goods.id));
        } else {
            CQ.Page.Exchange.onFailed();
        }
    },

    onSuccess: function() {
        // use timeout here because jQuery Mobile does not support chaining popups.
        // we cannot open new popup if there already has opened popup.
        setTimeout(function() {
            CQ.Page.refreshCurrency();
            $(CQ.Id.Exchange.$POPUP_SUCCESS).popup('open');
        }, 1000);
    },

    onFailed: function() {
        // use timeout here because jQuery Mobile does not support chaining popups.
        // we cannot open new popup if there already has opened popup.
        setTimeout(function() {
            CQ.Page.Exchange.openGemNotEnough();
        }, 1000);
    }
};

CQ.App.inherits(CQ.Page.Exchange, CQ.Page);
CQ.App.register(CQ.Page.Exchange);