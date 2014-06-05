if (typeof(CQ) == 'undefined' || !CQ) {
    var CQ = {};
}

CQ.Page = {
    params: null,

    showCoinNotEnough: function () {
        $('#popup-gem-not-enough').popup('open');
    },

    showGemNotEnough: function () {
        $('#popup-gem-not-enough').popup('open');
    },

    back: function () {
        if (this.name == CQ.Page.Main.name)
            $('#dialog-exit-link').click();
        else
            CQ.App.open((this.params && this.params.from) ? this.params.from : 'main');
    }
};

CQ.App = {
    currentPage: 'index',

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

    open: function (name, params) {
        console.log('Open page: {0}, params: {1}'.format(name, params));

        this.currentPage = name;
        var page = CQ.Page[name.charAt(0).toUpperCase() + name.slice(1)];
        if (page.load) page.load(params);

        $.mobile.changePage('#' + name);
        CQ.GA.trackPage(name);
    },

    back: function () {
        CQ.Page[CQ.Utils.getCapitalName(CQ.App.currentPage)].back();
    }
};