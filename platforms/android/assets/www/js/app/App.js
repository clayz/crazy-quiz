if (typeof(CQ) == 'undefined' || !CQ) {
    var CQ = {};
}

CQ.Page = {
    params: null,

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
        if (this.name == CQ.Page.Main.name) {
            $('#dialog-exit-link').click();
        } else {
            var from = (this.params && this.params.from) ? this.params.from : 'main';
            console.log('Back to page: {0}'.format(from));
            CQ.Session.CURRENT_PAGE = from;
            $.mobile.changePage('#' + from);

            CQ.GA.trackPage(from);
        }
    },

    showCoinNotEnough: function () {
        var page = this.name;

        $('#' + page + '-popup-coin-not-enough').popup('open');
        $('#' + page + '-popup-coin-exchange-btn').on('vclick', function () {
            CQ.Page.get(page).open(CQ.Page.Exchange);
        });
    },

    showGemNotEnough: function () {
        var page = this.name;

        $('#' + page + '-popup-gem-not-enough').popup('open');
        $('#' + page + '-popup-gem-buy-btn').on('vclick', function () {
            CQ.Page.get(page).open(CQ.Page.Purchase);
        });
    }
};

CQ.App = {
    init: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        document.addEventListener('deviceready', this.ready, false);
    },

    ready: function () {
        // implement classes inherit
        $.extend(CQ.Album.Default, CQ.Album);
        $.extend(CQ.Page.Index, CQ.Page);
        $.extend(CQ.Page.Main, CQ.Page);
        $.extend(CQ.Page.Game, CQ.Page);
        $.extend(CQ.Page.Purchase, CQ.Page);
        $.extend(CQ.Page.Exchange, CQ.Page);

        // initialize all modules and pages
        CQ.Currency.init();
        CQ.PlayBilling.init();
        CQ.GA.init();
        CQ.Page.Index.init();
        CQ.Page.Main.init();
        CQ.Page.Game.init();
        CQ.Page.Purchase.init();
        CQ.Page.Exchange.init();

        // modify jQuery default settings
        $.mobile.defaultPageTransition = 'none';
        $.mobile.defaultDialogTransition = 'none';
        $.mobile.buttonMarkup.hoverDelay = 0;

        document.addEventListener('backbutton', CQ.App.back, false);
    },

    back: function () {
        CQ.Page.get(CQ.Session.CURRENT_PAGE).back();
    }
};

CQ.Session = {
    CURRENT_PAGE: 'index'
};