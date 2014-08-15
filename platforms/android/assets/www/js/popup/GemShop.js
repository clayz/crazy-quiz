CQ.Popup.GemShop = function(page) {
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_SHOP_GEM, page);

    for (var i = 1; i <= 5; i++) {
        $(CQ.Id.CSS.$POPUP_SHOP_GEM_GOODS.format(page, i)).click({ 'id': i, 'shop': this }, function(event) {
            event.data.shop.buy(CQ.Currency.Purchase['Goods' + event.data.id]);
        }).bind('touchstart', function() {
            $(this).removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_TAP);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT_TAP);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO_TAP);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_MONEY))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_MONEY).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_MONEY_TAP);
        }).bind('touchend', function() {
            $(this).removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_TAP).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT_TAP))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT_TAP).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT_TAP))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT_TAP).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO_TAP))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO_TAP).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO);
            $(this).find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_MONEY_TAP))
                .removeClass(CQ.Id.CSS.POPUP_SHOP_GOODS_MONEY_TAP).addClass(CQ.Id.CSS.POPUP_SHOP_GOODS_MONEY);
        });
    }

    this.refresh();
};

CQ.Popup.GemShop.prototype.buy = function(goods) {
    console.log('Start transaction, goods id: ' + goods.id);
    CQ.GA.track(CQ.GA.Shop.Click, CQ.GA.Shop.Click.label.format('Purchase', goods.id));

    if (CQ.App.iOS) {
        if (CQ.dev) {
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
        } else {
            CQ.AppStorePurchase.buy(goods.productId);
        }
    } else if (CQ.App.android) {
        // CQ.PlayBilling.buy('v1_gem_001');
        // CQ.Currency.purchase(goods);
    }
};

CQ.Popup.GemShop.prototype.refresh = function() {
    for (var i = 1; i <= 5; i++) {
        var $goodsBtn = $(CQ.Id.CSS.$POPUP_SHOP_GEM_GOODS.format(this.popup.page, i));
        $goodsBtn.find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT)).text(CQ.Currency.Purchase['Goods' + i].title);
        $goodsBtn.find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO)).text(CQ.Currency.Purchase['Goods' + i].description);
        $goodsBtn.find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_MONEY)).text((CQ.dev ? '¥{0}' : '{0}').format(CQ.Currency.Purchase['Goods' + i].cost));
    }
};