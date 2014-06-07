CQ.Page.Main = {
    name: 'main',

    init: function () {
        console.info('Initial main page');
        this.initCommon(this);

        $('#main-level1-btn').tap(function () {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 1 });
        });
        $('#main-level2-btn').tap(function () {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 2 });
        });
        $('#main-level3-btn').tap(function () {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 3 });
        });
        $('#main-level4-btn').tap(function () {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 4 });
        });
        $('#main-level5-btn').tap(function () {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 5 });
        });
        $('#main-level6-btn').tap(function () {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 6 });
        });

        $('#main-clear-btn').tap(function () {
            CQ.Datastore.clear();
            CQ.Page.Game.picture = null;
            CQ.Currency.init();
            alert("Cleared data in storage.");
        });

        $('#main-popup-exit-yes').tap(function () {
            navigator.app.exitApp();
        });

        // footer buttons
        $('#main-rating-btn').tap(function () {
            window.open("market://details?id=com.cyberagent.jra");
        });

        $('#main-other-btn').tap(function () {
            CQ.Page.open(CQ.Page.Help);
        });

        // share buttons
        $('#main-share-fb-btn').tap(function () {
            CQ.SNS.Facebook.share(CQ.SNS.Message.MAIN_PAGE, null);
        });

        $('#main-share-tw-btn').tap(function () {
            CQ.SNS.Twitter.share(CQ.SNS.Message.MAIN_PAGE);
        });

        $('#main-share-line-btn').tap(function () {
            CQ.SNS.Line.share(CQ.SNS.Message.MAIN_PAGE, 'this is subject');
        });

        $('#main-share-other-btn').tap(function () {
            CQ.SNS.share(CQ.SNS.Message.MAIN_PAGE);
        });
    },

    load: function () {
        this.refreshCurrency();
    }
};

CQ.App.inherits(CQ.Page.Main, CQ.Page);
CQ.App.register(CQ.Page.Main);