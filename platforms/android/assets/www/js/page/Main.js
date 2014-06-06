CQ.Page.Main = {
    name: 'main',

    init: function () {
        console.info('Initial main page');
        this.initCommon(this);

        $('#main-level1-btn').click(function () {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 1 });
        });
        $('#main-level2-btn').click(function () {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 2 });
        });
        $('#main-level3-btn').click(function () {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 3 });
        });
        $('#main-level4-btn').click(function () {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 4 });
        });
        $('#main-level5-btn').click(function () {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 5 });
        });
        $('#main-level6-btn').click(function () {
            CQ.Page.open(CQ.Page.Game, { album: CQ.Album.Default.id, level: 6 });
        });

        $('#main-clear-btn').click(function () {
            CQ.Datastore.clear();
            CQ.Page.Game.picture = null;
            CQ.Currency.init();
            alert("Cleared data in storage.");
        });

        $('#main-popup-exit-yes').click(function () {
            navigator.app.exitApp();
        });

        // footer buttons
        $('#main-rating-btn').click(function () {
            alert('go to play store.');
        });

        $('#main-other-btn').click(function () {
            alert('open other info page.');
        });

        // share buttons
        $('#main-share-fb-btn').click(function () {
            CQ.SNS.Facebook.share(CQ.SNS.Message.MAIN_PAGE, null);
        });

        $('#main-share-tw-btn').click(function () {
            CQ.SNS.Twitter.share(CQ.SNS.Message.MAIN_PAGE);
        });

        $('#main-share-line-btn').click(function () {
            CQ.SNS.Line.share(CQ.SNS.Message.MAIN_PAGE, 'this is subject');
        });

        $('#main-share-other-btn').click(function () {
            CQ.SNS.share(CQ.SNS.Message.MAIN_PAGE);
        });
    },

    load: function () {
        this.refreshCurrency();
    }
};