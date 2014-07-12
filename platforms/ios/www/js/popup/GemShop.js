CQ.Popup.GemShop = function(page) {
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_SHOP_GEM, page);

    for (var i = 0; i <= 5; i++) {
        $(CQ.Id.CSS.$POPUP_SHOP_GEM_GOODS.format(page, i)).click({ 'id': i, 'shop': this }, function(event) {
            event.data.shop.buy(CQ.Currency.Purchase['Goods' + event.data.id]);
        }).bind('touchstart', function() {
            $(this).removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_TAP);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT_TAP);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO_TAP);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_COST))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_COST).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_COST_TAP);
        }).bind('touchend', function() {
            $(this).removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_TAP).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT_TAP))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT_TAP).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT_TAP))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT_TAP).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO_TAP))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO_TAP).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_COST_TAP))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_COST_TAP).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_COST);
        });
    }
};

CQ.Popup.GemShop.prototype.buy = function(goods) {
    console.log('Start transaction, goods id: ' + goods.id);
    CQ.GA.track(CQ.GA.Shop.Click, CQ.GA.Shop.Click.label.format('Purchase', goods.id));

    if (CQ.App.iOS) {
        CQ.Currency.purchase(goods);
    } else if (CQ.App.android) {
        CQ.PlayBilling.buy('v1_gem_001');
        CQ.Currency.purchase(goods);
    }

    CQ.Page.refreshCurrency();

    // TODO display pay result popup
};