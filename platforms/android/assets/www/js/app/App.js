if (typeof(CQ) == 'undefined' || !CQ) {
    var CQ = {};
}

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
        $.extend(CQ.Page.Loading, CQ.Page);
        $.extend(CQ.Page.Index, CQ.Page);
        $.extend(CQ.Page.Main, CQ.Page);
        $.extend(CQ.Page.Game, CQ.Page);
        $.extend(CQ.Page.Purchase, CQ.Page);
        $.extend(CQ.Page.Exchange, CQ.Page);

        // initialize all modules and pages
        CQ.Currency.init();
        CQ.PlayBilling.init();
        CQ.GA.init();
        CQ.Page.Loading.init();
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
    CURRENT_PAGE: 'loading',
    CURRENT_OPEN_POPUP: null,

    USERNAME: ''
};