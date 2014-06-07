CQ.Page.Main = {
    name: 'main',

    init: function() {
        console.info('Initial main page');
        this.initCommon();

        $(CQ.Id.Main.$LEVEL_1).tap(function() {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 1 });
        });
        $(CQ.Id.Main.$LEVEL_2).tap(function() {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 2 });
        });
        $(CQ.Id.Main.$LEVEL_3).tap(function() {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 3 });
        });
        $(CQ.Id.Main.$LEVEL_4).tap(function() {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 4 });
        });
        $(CQ.Id.Main.$LEVEL_5).tap(function() {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 5 });
        });
        $(CQ.Id.Main.$LEVEL_6).tap(function() {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 6 });
        });

        $(CQ.Id.Main.$CLEAR_HISTORY).tap(function() {
            CQ.Datastore.clear();
            CQ.Page.Game.picture = null;
            CQ.Currency.init();
            alert("Cleared data in storage.");
        });

        $(CQ.Id.Main.$POPUP_EXIT).bind(this.popupEvents);
        $(CQ.Id.Main.$POPUP_EXIT_YES).tap(function() {
            navigator.app.exitApp();
        });

        // footer buttons
        $(CQ.Id.Main.$RATING).tap(function() {
            window.open("market://details?id=com.cyberagent.jra");
        });

        $(CQ.Id.Main.$OTHER).tap(function() {
            CQ.Page.open(CQ.Page.Help);
        });

        // share buttons
        $(CQ.Id.$SHARE_FB.format(this.name)).tap(function() {
            CQ.SNS.Facebook.share(CQ.SNS.Message.MAIN_PAGE, null);
        });

        $(CQ.Id.$SHARE_TW.format(this.name)).tap(function() {
            CQ.SNS.Twitter.share(CQ.SNS.Message.MAIN_PAGE);
        });

        $(CQ.Id.$SHARE_LINE.format(this.name)).tap(function() {
            CQ.SNS.Line.share(CQ.SNS.Message.MAIN_PAGE, 'this is subject');
        });

        $(CQ.Id.$SHARE_OTHER.format(this.name)).tap(function() {
            CQ.SNS.share(CQ.SNS.Message.MAIN_PAGE);
        });
    },

    load: function() {
        this.refreshCurrency();
    }
};

CQ.App.inherits(CQ.Page.Main, CQ.Page);
CQ.App.register(CQ.Page.Main);