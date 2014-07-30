CQ.Popup.CoinShop = function(page) {
    this.popup = new CQ.Popup(CQ.Id.CSS.$POPUP_SHOP_COIN, page);

    for (var i = 0; i <= 5; i++) {
        $(CQ.Id.CSS.$POPUP_SHOP_COIN_GOODS.format(page, i)).click({ 'id': i, 'shop': this }, function(event) {
            event.data.shop.exchange(CQ.Currency.Exchange['Goods' + event.data.id]);
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

    this.refresh();
};

CQ.Popup.CoinShop.prototype.exchange = function(goods) {
    console.log('Start coin exchange, goods id: ' + goods.id);
    CQ.GA.track(CQ.GA.Shop.Click, CQ.GA.Shop.Click.label.format('Exchange', goods.id));

    if (CQ.Currency.checkGem(goods)) {
        CQ.Page.openConfirm('确认要兑换 {0} 金币吗？'.format(goods.coin), function() {
            CQ.Currency.exchange(goods);
            CQ.Page.refreshCurrency();
            CQ.Page.openPrompt('兑换金币成功，当前宝石数：{0}，当前金币数：{1}'.format(CQ.Currency.account.gem, CQ.Currency.account.coin));

            CQ.GA.track(CQ.GA.Shop.Exchange, CQ.GA.Shop.Exchange.label.format(goods.id));
        });
    } else {
        CQ.Page.openGemNotEnough();
    }
};

CQ.Popup.CoinShop.prototype.refresh = function() {
    for (var i = 1; i <= 5; i++) {
        var $goodsBtn = $(CQ.Id.CSS.$POPUP_SHOP_COIN_GOODS.format(this.popup.page, i));
        $goodsBtn.find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_AMOUNT)).text(CQ.Currency.Exchange['Goods' + i].coin);
        $goodsBtn.find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_INFO)).text(CQ.Currency.Exchange['Goods' + i].description);
        $goodsBtn.find('.{0}'.format(CQ.Id.CSS.POPUP_SHOP_GOODS_COST)).text(CQ.Currency.Exchange['Goods' + i].gem);
    }
};