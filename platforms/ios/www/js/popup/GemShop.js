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
        CQ.AppStorePurchase.buy(goods.productId);
    } else if (CQ.App.android) {
        CQ.PlayBilling.buy('v1_gem_001');
        CQ.Currency.purchase(goods);
    }

    CQ.Page.refreshCurrency();

    // TODO display pay result popup
};

CQ.Popup.GemShop.prototype.initGem = function() {
    var goods1 = CQ.Currency.Purchase.Goods1,
        goods2 = CQ.Currency.Purchase.Goods2,
        goods3 = CQ.Currency.Purchase.Goods3,
        goods4 = CQ.Currency.Purchase.Goods4,
        goods5 = CQ.Currency.Purchase.Goods5;
    $(CQ.Id.Purchase.$PURCHASE_TITLE.format(goods1.id)).text('{0}'.format(goods1.title));
    $(CQ.Id.Purchase.$PURCHASE_DES.format(goods1.id)).text('{0}'.format(goods1.description));
    $(CQ.Id.Purchase.$PURCHASE_COST.format(goods1.id)).text('{0}'.format(goods1.cost));
    
    $(CQ.Id.Purchase.$PURCHASE_TITLE.format(goods2.id)).text('{0}'.format(goods2.title));
    $(CQ.Id.Purchase.$PURCHASE_DES.format(goods2.id)).text('{0}'.format(goods2.description));
    $(CQ.Id.Purchase.$PURCHASE_COST.format(goods2.id)).text('{0}'.format(goods2.cost));
    
    $(CQ.Id.Purchase.$PURCHASE_TITLE.format(goods3.id)).text('{0}'.format(goods3.title));
    $(CQ.Id.Purchase.$PURCHASE_DES.format(goods3.id)).text('{0}'.format(goods3.description));
    $(CQ.Id.Purchase.$PURCHASE_COST.format(goods3.id)).text('{0}'.format(goods3.cost));
    
    $(CQ.Id.Purchase.$PURCHASE_TITLE.format(goods4.id)).text('{0}'.format(goods4.title));
    $(CQ.Id.Purchase.$PURCHASE_DES.format(goods4.id)).text('{0}'.format(goods4.description));
    $(CQ.Id.Purchase.$PURCHASE_COST.format(goods4.id)).text('{0}'.format(goods4.cost));
    
    $(CQ.Id.Purchase.$PURCHASE_TITLE.format(goods5.id)).text('{0}'.format(goods5.title));
    $(CQ.Id.Purchase.$PURCHASE_DES.format(goods5.id)).text('{0}'.format(goods5.description));
    $(CQ.Id.Purchase.$PURCHASE_COST.format(goods5.id)).text('{0}'.format(goods5.cost));
};