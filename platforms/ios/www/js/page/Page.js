CQ.Page = {
    params: {},

    // popups
    gemShop: null,
    coinShop: null,
    gemNotEnough: null,
    coinNotEnough: null,
    share: null,
    prompt: null,

    popupEvents: {
        popupafteropen: function() {
            CQ.Session.CURRENT_OPEN_POPUP = '#' + $(this).attr('id');
        },
        popupafterclose: function() {
            CQ.Session.CURRENT_OPEN_POPUP = null;
        }
    },

    initCommon: function(config) {
        var page = this, name = this.name;

        // add common page header
        if (config && config.header) {
            $('#' + name).prepend($('{0} {1}'.format(CQ.Id.$SCRATCH, CQ.Id.CSS.$HEADER)).clone());

            // header buttons
            if (config && config.back) {
                this.bindClickButton('#{0} {1}'.format(name, CQ.Id.CSS.$HEADER_BACK), function() {
                    CQ.Audio.Button.play();
                    page.back();
                }, CQ.Id.Image.HEADER_BACK_TAP, CQ.Id.Image.HEADER_BACK);
            } else {
                $('#{0} {1}'.format(name, CQ.Id.CSS.$HEADER_BACK)).hide();
            }

            // add shop popups and events
            this.gemShop = new CQ.Popup.GemShop(name);
            this.coinShop = new CQ.Popup.CoinShop(name);

            this.bindClickButton('#{0} {1}'.format(name, CQ.Id.CSS.$HEADER_GEM_PURCHASE), function() {
                CQ.Audio.Button.play();
                page.gemShop.popup.open();
            }, CQ.Id.Image.CURRENCY_ADD_TAP, CQ.Id.Image.CURRENCY_ADD);

            this.bindClickButton('#{0} {1}'.format(name, CQ.Id.CSS.$HEADER_COIN_EXCHANGE), function() {
                CQ.Audio.Button.play();
                page.coinShop.popup.open();
            }, CQ.Id.Image.CURRENCY_ADD_TAP, CQ.Id.Image.CURRENCY_ADD);
        }

        // add share popup and events
        if (config && config.share) {
            var $shareBtn = $(CQ.Id.$SHARE.format(name));
            if ($shareBtn.length) {
                var sharePopup = new CQ.Popup.Share(name);
                this.share = sharePopup;

                $shareBtn.click(function() {
                    CQ.Audio.Button.play();
                    sharePopup.popup.open();
                    CQ.GA.track(CQ.GA.Share.Click, CQ.Utils.getCapitalName(name));
                });
            }
        }

        // add other common popups
        this.prompt = new CQ.Popup.Prompt(name);
        this.gemNotEnough = new CQ.Popup.GemNotEnough(name);
        this.coinNotEnough = new CQ.Popup.CoinNotEnough(name);
    },

    get: function(name) {
        return CQ.Page[CQ.Utils.getCapitalName(name)];
    },

    getCurrentPage: function() {
        return CQ.Page[CQ.Utils.getCapitalName(CQ.Session.CURRENT_PAGE)];
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

    refreshCurrency: function() {
        $(CQ.Id.CSS.$HEADER_GEM_CURRENT).text(CQ.Currency.account.gem);
        $(CQ.Id.CSS.$HEADER_COIN_CURRENT).text(CQ.Currency.account.coin);
    },

    refreshShops: function() {
        $.each(CQ.App.registerPages, function(index, value) {
            value.gemShop.refresh();
        });
    },

    openPopup: function(popup) {
        if (CQ.Session.CURRENT_OPEN_POPUP) {
            $(CQ.Session.CURRENT_OPEN_POPUP).popup('close');
            CQ.Session.CURRENT_OPEN_POPUP = null;

            setTimeout(function() {
                popup.popup.open();
            }, 100);
        } else {
            popup.popup.open();
        }
    },

    openGemShop: function() {
        this.openPopup(this.getCurrentPage().gemShop);
    },

    openCoinShop: function() {
        this.openPopup(this.getCurrentPage().coinShop);
    },

    openGemNotEnough: function() {
        this.openPopup(this.getCurrentPage().gemNotEnough);
    },

    openCoinNotEnough: function() {
        this.openPopup(this.getCurrentPage().coinNotEnough);
    },

    openPrompt: function(msg) {
        if (CQ.Session.CURRENT_OPEN_POPUP) {
            $(CQ.Session.CURRENT_OPEN_POPUP).popup('close');
            CQ.Session.CURRENT_OPEN_POPUP = null;

            setTimeout(function() {
                CQ.Page.getCurrentPage().prompt.open(msg);
            }, 100);
        } else {
            CQ.Page.getCurrentPage().prompt.open(msg);
        }
    },

    closePopup: function() {
        if (CQ.Session.CURRENT_OPEN_POPUP) {
            $(CQ.Session.CURRENT_OPEN_POPUP).popup('close');
            CQ.Session.CURRENT_OPEN_POPUP = null;
        }
    },

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