CQ.Page.Main = {
    name: 'main',
    selectedUnlockAlbum: null,
    selectedUnlockLevel: null,

    init: function() {
        console.info('Initial main page');
        this.initCommon({ header: true });
        var pageName = CQ.Utils.getCapitalName(this.name);

        for (var i = 1; i <= CQ.Album.TOTAL_LEVEL_PER_ALBUM; i++) {
            (function(level) {
                $(CQ.Id.Main['$LEVEL_' + level]).click(function() {
                    var lastLevel = CQ.Datastore.getLastLevel(CQ.Album.Default.id) || 1;

                    if (level <= lastLevel) {
                        CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: level });
                        CQ.GA.track(CQ.GA.Level.Play, CQ.GA.Level.Play.label.format(CQ.Album.Default.id, level));
                    } else if (level == (lastLevel + 1)) {
                        if (CQ.Currency.account.gem > 0) {
                            $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK).popup('open');
                            CQ.Page.Main.selectedUnlockLevel = {
                                album: CQ.Album.Default,
                                level: level
                            };
                        } else {
                            $(CQ.Id.Main.$POPUP_LEVEL_PURCHASE).popup('open');
                        }
                    } else {
                        $(CQ.Id.Main.$POPUP_LEVEL_CANNOT_UNLOCK).popup('open');
                    }
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

        // level popup buttons
        $(CQ.Id.Main.$POPUP_LEVEL_UNLOCK_YES).click(function() {
            if (CQ.Page.Main.selectedUnlockLevel) {
                CQ.Album.unlockLevel(CQ.Page.Main.selectedUnlockLevel.album, CQ.Page.Main.selectedUnlockLevel.level);
                CQ.Page.Main.selectedUnlockLevel = null;
            }
        });

        $(CQ.Id.Main.$POPUP_LEVEL_PURCHASE_YES).click(function() {
            CQ.Page.Main.open(CQ.Page.Purchase);
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