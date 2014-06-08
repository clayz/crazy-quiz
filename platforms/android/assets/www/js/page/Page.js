CQ.Page = {
    params: null,

    popupEvents: {
        popupafteropen: function() {
            CQ.Session.CURRENT_OPEN_POPUP = '#' + $(this).attr('id');
        },
        popupafterclose: function() {
            CQ.Session.CURRENT_OPEN_POPUP = null;
        }
    },

    get: function(name) {
        return CQ.Page[CQ.Utils.getCapitalName(name)];
    },

    open: function(page, params) {
        var pageName = page.name, wrappedParams = params || {};
        wrappedParams.from = this.name;
        console.log('Open page: {0}, params: {1}'.format(pageName, CQ.Utils.toString(wrappedParams)));

        var result = page.load(wrappedParams);
        CQ.Session.CURRENT_PAGE = pageName;

        if (!result || !result.terminate) {
            $.mobile.changePage('#' + pageName);
            CQ.GA.trackPage((result && result.gaPageName) ? result.gaPageName : pageName);
        }
    },

    back: function() {
        if (CQ.Session.CURRENT_OPEN_POPUP) {
            $(CQ.Session.CURRENT_OPEN_POPUP).popup('close');
            CQ.Session.CURRENT_OPEN_POPUP = null;
        } else if ((CQ.Page.Loading.name == this.name) || (CQ.Page.Index.name == this.name)) {
            navigator.app.exitApp();
        } else if (CQ.Page.Main.name == this.name) {
            $(CQ.Id.Main.$POPUP_EXIT).popup('open');
            CQ.Session.CURRENT_OPEN_POPUP = CQ.Id.Main.$POPUP_EXIT;
        } else {
            var from = (this.params && this.params.from) ? this.params.from : 'main';
            console.log('Back to page: {0}'.format(from));

            CQ.Session.CURRENT_PAGE = from;
            $.mobile.changePage('#' + from);
            CQ.GA.trackPage(from);
        }
    },

    initCommon: function() {
        var page = this, name = this.name;

        // header buttons
        $(CQ.Id.$HEADER_BACK.format(name)).click(function() {
            page.back();
        }).bind('touchstart', function() {
            $(this).attr('src', CQ.Id.Image.HEADER_BACK_TAP);
        }).bind('touchend', function() {
            $(this).attr('src', CQ.Id.Image.HEADER_BACK);
        });

        $(CQ.Id.$HEADER_GEM_PURCHASE.format(name)).click(function() {
            page.open(CQ.Page.Purchase);
        }).bind('touchstart', function() {
            $(this).attr('src', CQ.Id.Image.CURRENCY_ADD_TAP);
        }).bind('touchend', function() {
            $(this).attr('src', CQ.Id.Image.CURRENCY_ADD);
        });

        $(CQ.Id.$HEADER_COIN_EXCHANGE.format(name)).click(function() {
            page.open(CQ.Page.Exchange);
        }).bind('touchstart', function() {
            $(this).attr('src', CQ.Id.Image.CURRENCY_ADD_TAP);
        }).bind('touchend', function() {
            $(this).attr('src', CQ.Id.Image.CURRENCY_ADD);
        });

        // common popup and buttons
        $(CQ.Id.$POPUP_SHARE.format(name)).bind(this.popupEvents);
        $(CQ.Id.$SHARE.format(name)).click(function() {
            page.showShare();
            CQ.GA.track(CQ.GA.Share.Click, CQ.Utils.getCapitalName(name));
        });

        $(CQ.Id.$POPUP_COIN_NOT_ENOUGH.format(name)).bind(this.popupEvents);
        $(CQ.Id.$POPUP_COIN_EXCHANGE.format(name)).tap(function() {
            page.open(CQ.Page.Exchange);
        });

        $(CQ.Id.$POPUP_GEM_NOT_ENOUGH.format(name)).bind(this.popupEvents);
        $(CQ.Id.$POPUP_GEM_BUY.format(name)).tap(function() {
            page.open(CQ.Page.Purchase);
        });
    },

    refreshCurrency: function() {
        $(CQ.Id.CSS.$HEADER_CURRENT_GEM).text(CQ.Currency.account.gem);
        $(CQ.Id.CSS.$HEADER_CURRENT_COIN).text(CQ.Currency.account.coin);
    },

    showCoinNotEnough: function() {
        $(CQ.Id.$POPUP_COIN_NOT_ENOUGH.format(this.name)).popup('open');
    },

    showGemNotEnough: function() {
        $(CQ.Id.$POPUP_GEM_NOT_ENOUGH.format(this.name)).popup('open');
    },

    showShare: function() {
        $(CQ.Id.$POPUP_SHARE.format(this.name)).popup('open');
    }
};