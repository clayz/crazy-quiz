CQ.Page = {
    params: {},

    get: function(name) {
        return CQ.Page[CQ.Utils.getCapitalName(name)];
    },

    open: function(page, params) {
        var pageName = page.name, wrappedParams = params || {};

        if (this.name == pageName) {
            // open same page
            wrappedParams.from = this.params.from;
        } else if (((this === CQ.Page.Purchase) && (page === CQ.Page.Exchange)) || ((this === CQ.Page.Exchange) && (page === CQ.Page.Purchase))) {
            // this is used to avoid cycle back between this two page
            wrappedParams.from = this.params.from || CQ.Page.Main.name;
        } else {
            wrappedParams.from = this.name;
        }

        console.log('Open page: {0}, params: {1}'.format(pageName, CQ.Utils.toString(wrappedParams)));
        var result = page.load(wrappedParams);
        CQ.Session.CURRENT_PAGE = pageName;

        if (result && result.redirect) {
            this.open(result.redirect);
        } else {
            if (params && params.transition) $.mobile.changePage('#' + pageName, { transition: params.transition });
            else $.mobile.changePage('#' + pageName);

            CQ.GA.trackPage((result && result.gaPageName) ? result.gaPageName : pageName);
        }
    },

    back: function() {
        CQ.Audio.Button.play();

        if (CQ.Session.CURRENT_OPEN_POPUP) {
            $(CQ.Session.CURRENT_OPEN_POPUP).popup('close');
            CQ.Session.CURRENT_OPEN_POPUP = null;
        } else if ((CQ.Page.Loading.name == this.name) || (CQ.Page.Index.name == this.name)) {
            navigator.app.exitApp();
        } else if (CQ.Page.Main.name == this.name) {
            $(CQ.Id.Main.$POPUP_EXIT).popup('open');
            CQ.Session.CURRENT_OPEN_POPUP = CQ.Id.Main.$POPUP_EXIT;
        } else {
            var from = (this.params && this.params.from) ? this.params.from : CQ.Page.Main.name;
            console.log('Back to page: {0}'.format(from));

            CQ.Session.CURRENT_PAGE = from;
            $.mobile.changePage('#' + from);
            CQ.GA.trackPage(from);
        }
    },

    initCommon: function(config) {
        var page = this, name = this.name;

        // add common page header
        if (config && config.header) {
            $('#' + name).prepend($('{0} {1}'.format(CQ.Id.$SCRATCH, CQ.Id.CSS.$HEADER)).clone());

            if (config.back) {
                // add back buttons and events
                this.bindClickButton('#{0} {1}'.format(name, CQ.Id.CSS.$HEADER_BACK), function() {
                    CQ.Audio.Button.play();
                    page.back();
                }, CQ.Id.Image.HEADER_BACK_TAP, CQ.Id.Image.HEADER_BACK);
            } else {
                $('#{0} {1}'.format(name, CQ.Id.CSS.$HEADER_BACK)).hide();
            }

            // add popups and events
            var purchasePopup = new CQ.Popup.Purchase(name);
            var exchangePopup = new CQ.Popup.Exchange(name);
            this.purchasePopup = purchasePopup;
            this.exchangePopup = exchangePopup;

            this.bindClickButton('#{0} {1}'.format(name, CQ.Id.CSS.$HEADER_GEM_PURCHASE), function() {
                CQ.Audio.Button.play();
                purchasePopup.popup.open();
            }, CQ.Id.Image.CURRENCY_ADD_TAP, CQ.Id.Image.CURRENCY_ADD);

            this.bindClickButton('#{0} {1}'.format(name, CQ.Id.CSS.$HEADER_COIN_EXCHANGE), function() {
                CQ.Audio.Button.play();
                exchangePopup.popup.open();
            }, CQ.Id.Image.CURRENCY_ADD_TAP, CQ.Id.Image.CURRENCY_ADD);
        }

        // add share popup and events
        if (config && config.share) {
            var $shareBtn = $(CQ.Id.$SHARE.format(name));
            if ($shareBtn.length) {
                var sharePopup = new CQ.Popup.Share(name);
                this.sharePopup = sharePopup;

                $shareBtn.click(function() {
                    CQ.Audio.Button.play();
                    sharePopup.popup.open();
                    CQ.GA.track(CQ.GA.Share.Click, CQ.Utils.getCapitalName(name));
                });
            }
        }

//        var sharePopupId = CQ.Id.$POPUP_SHARE.format(name);
//
//        $(sharePopupId).bind(this.popupEvents);
//        $('{0} {1}'.format(sharePopupId, CQ.Id.CSS.$POPUP_BTN_CLOSE)).click(this.back);
//        $(CQ.Id.$SHARE.format(name)).click(function() {
//            CQ.Audio.Button.play();
//            page.showShare();
//            CQ.GA.track(CQ.GA.Share.Click, CQ.Utils.getCapitalName(name));
//        });

        // coin not enough popup and buttons
//        var coinNotEnoughPopupId = CQ.Id.$POPUP_COIN_NOT_ENOUGH.format(name);

//        $(coinNotEnoughPopupId).bind(this.popupEvents);
//        $('{0} {1}'.format(coinNotEnoughPopupId, CQ.Id.CSS.$POPUP_BTN_CLOSE)).click(this.back);
//        $(CQ.Id.$POPUP_COIN_NOT_ENOUGH_YES.format(name)).click(function() {
//            page.open(CQ.Page.Exchange);
//        });
//        $(CQ.Id.$POPUP_COIN_NOT_ENOUGH_NO.format(name)).click(function() {
//            $(CQ.Id.$POPUP_COIN_NOT_ENOUGH.format(name)).popup('close');
//        });
//
//        // gem not enough popup and buttons
//        var gemNotEnoughPopupId = CQ.Id.$POPUP_GEM_NOT_ENOUGH.format(name);
//
////        $(gemNotEnoughPopupId).bind(this.popupEvents);
//        $('{0} {1}'.format(gemNotEnoughPopupId, CQ.Id.CSS.$POPUP_BTN_CLOSE)).click(this.back);
//        $(CQ.Id.$POPUP_GEM_NOT_ENOUGH_YES.format(name)).click(function() {
//            page.open(CQ.Page.Purchase);
//        });
//        $(CQ.Id.$POPUP_GEM_NOT_ENOUGH_NO.format(name)).click(function() {
//            $(CQ.Id.$POPUP_GEM_NOT_ENOUGH.format(name)).popup('close');
//        });
    },

    refreshCurrency: function() {
        $(CQ.Id.CSS.$HEADER_GEM_CURRENT).text(CQ.Currency.account.gem);
        $(CQ.Id.CSS.$HEADER_COIN_CURRENT).text(CQ.Currency.account.coin);
    },

    showCoinNotEnough: function() {
        $(CQ.Id.$POPUP_COIN_NOT_ENOUGH.format(this.name)).popup('open');
    },

    showGemNotEnough: function() {
        $(CQ.Id.$POPUP_GEM_NOT_ENOUGH.format(this.name)).popup('open');
    },

//    showShare: function() {
//        $(CQ.Id.$POPUP_SHARE.format(this.name)).popup('open');
//    },

    bindClickButton: function(id, onClick, touchstartImg, touchendImg, imageId) {
        this.bindTouchImage($(id).click(onClick), touchstartImg, touchendImg, imageId);
    },

    bindTapButton: function(id, onTap, touchstartImg, touchendImg, imageId) {
        this.bindTouchImage($(id).tap(onTap), touchstartImg, touchendImg, imageId);
    },

    bindTouchImage: function(element, touchstartImg, touchendImg, imageId) {
        element.bind('touchstart', function() {
            $(imageId ? imageId : this).attr('src', touchstartImg);
        }).bind('touchend', function() {
            $(imageId ? imageId : this).attr('src', touchendImg);
        });
    },

    bindTouchBackground: function(element, touchstartImg, touchendImg) {
        element.bind('touchstart', function() {
            $(this).css('background', 'url(../www/{0}) no-repeat'.format(touchstartImg));
            $(this).css('background-size', '100%');
        }).bind('touchend', function() {
            $(this).css('background', 'url(../www/{0}) no-repeat'.format(touchendImg));
            $(this).css('background-size', '100%');
        });
    }
};