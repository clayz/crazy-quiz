CQ.Page = {
    params: null,

    initCommon: function (page) {
        var pageName = page.name;

        // header buttons
        $('#' + pageName + '-back-btn').click({page: pageName}, function (event) {
            CQ.Page.get(event.data.page).back();
        });

        $('#' + pageName + '-gem-purchase-btn').click({page: pageName}, function (event) {
            CQ.Page.get(event.data.page).open(CQ.Page.Purchase);
        });

        $('#' + pageName + '-coin-exchange-btn').click({page: pageName}, function (event) {
            CQ.Page.get(event.data.page).open(CQ.Page.Exchange);
        });

        // common popup and buttons
        $('#' + pageName + '-share-btn').click({page: pageName}, function (event) {
            CQ.Page.get(event.data.page).showShare();
        });
    },

    refreshCurrency: function () {
        $('.header-current-gem').text(CQ.Currency.account.gem);
        $('.header-current-coin').text(CQ.Currency.account.coin);
    },

    get: function (name) {
        return CQ.Page[CQ.Utils.getCapitalName(name)];
    },

    open: function (page, params) {
        var pageName = page.name, wrappedParams = params || {};
        wrappedParams.from = this.name;
        console.log('Open page: {0}, params: {1}'.format(pageName, CQ.Utils.toString(wrappedParams)));

        page.load(wrappedParams);
        CQ.Session.CURRENT_PAGE = pageName;
        $.mobile.changePage('#' + pageName);

        CQ.GA.trackPage(pageName);
    },

    back: function () {
        if (CQ.Session.CURRENT_OPEN_POPUP) {
            $('#' + CQ.Session.CURRENT_OPEN_POPUP).popup('close');
            CQ.Session.CURRENT_OPEN_POPUP = null;
        } else if (this.name == CQ.Page.Main.name) {
            $('#main-popup-exit').popup('open');
        } else {
            var from = (this.params && this.params.from) ? this.params.from : 'main';
            console.log('Back to page: {0}'.format(from));
            CQ.Session.CURRENT_PAGE = from;
            $.mobile.changePage('#' + from);

            CQ.GA.trackPage(from);
        }
    },

    showLoader: function () {
        $.mobile.loading('show');
    },

    hideLoader: function () {
        $.mobile.loading('hide');
    },

    showCoinNotEnough: function () {
        var page = this.name, id = '{0}-popup-coin-not-enough'.format(page);
        CQ.Session.CURRENT_OPEN_POPUP = id;

        $('#' + id).popup('open');
        $('#' + page + '-popup-coin-exchange-btn').on('vclick', function () {
            CQ.Page.get(page).open(CQ.Page.Exchange);
        });
    },

    showGemNotEnough: function () {
        var page = this.name, id = '{0}-popup-gem-not-enough'.format(page);
        CQ.Session.CURRENT_OPEN_POPUP = id;

        $('#' + id).popup('open');
        $('#' + page + '-popup-gem-buy-btn').on('vclick', function () {
            CQ.Page.get(page).open(CQ.Page.Purchase);
        });
    },

    showShare: function () {
        var id = '{0}-popup-share'.format(this.name);
        CQ.Session.CURRENT_OPEN_POPUP = id;
        $('#' + id).popup('open');
    },

    closeShare: function () {
        CQ.Session.CURRENT_OPEN_POPUP = null;
        $('#{0}-popup-share'.format(CQ.Session.CURRENT_PAGE)).popup('close');
    }
};