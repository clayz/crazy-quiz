CQ.Page.Main = {
    name: 'main',

    init: function() {
        console.info('Initial main page');
        this.initCommon();
        var pageName = CQ.Utils.getCapitalName(this.name);

        for (var i = 1; i <= 6; i++) {
            (function(level) {
                $(CQ.Id.Main['$LEVEL_' + level]).tap(function() {
                    CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: level });
                    CQ.GA.track(CQ.GA.Level.Play, CQ.GA.Level.Play.label.format(CQ.Album.Default.id, level));
                })
            })(i);
        }

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
            CQ.GA.trackPage('PlayStore');
            window.open("market://details?id=com.cyberagent.jra");
        });

        $(CQ.Id.Main.$OTHER).tap(function() {
            CQ.Page.open(CQ.Page.Help);
        });

        // share buttons
        $(CQ.Id.$SHARE_FB.format(this.name)).tap(function() {
            CQ.SNS.Facebook.share(CQ.SNS.Message.MAIN_PAGE, null);
            CQ.GA.track(CQ.GA.Share.FB, pageName);
        });

        $(CQ.Id.$SHARE_TW.format(this.name)).tap(function() {
            CQ.SNS.Twitter.share(CQ.SNS.Message.MAIN_PAGE);
            CQ.GA.track(CQ.GA.Share.TW, pageName);
        });

        $(CQ.Id.$SHARE_LINE.format(this.name)).tap(function() {
            CQ.SNS.Line.share(CQ.SNS.Message.MAIN_PAGE, 'this is subject');
            CQ.GA.track(CQ.GA.Share.Line, pageName);
        });

        $(CQ.Id.$SHARE_OTHER.format(this.name)).tap(function() {
            CQ.SNS.share(CQ.SNS.Message.MAIN_PAGE);
            CQ.GA.track(CQ.GA.Share.Other, pageName);
        });
    },

    load: function() {
        this.refreshCurrency();
    }
};

CQ.App.inherits(CQ.Page.Main, CQ.Page);
CQ.App.register(CQ.Page.Main);