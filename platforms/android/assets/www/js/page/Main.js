CQ.Page.Main = {
    name: 'main',

    init: function () {
        console.info('Initial main page');

        $('#main-level1-btn').click(function () {
            CQ.App.open(CQ.Page.Game.name, { album: CQ.Album.Default.id, level: 1 });
        });
        $('#main-level2-btn').click(function () {
            CQ.App.open(CQ.Page.Game.name, { album: CQ.Album.Default.id, level: 2 });
        });
        $('#main-level3-btn').click(function () {
            CQ.App.open(CQ.Page.Game.name, { album: CQ.Album.Default.id, level: 3 });
        });
        $('#main-level4-btn').click(function () {
            CQ.App.open(CQ.Page.Game.name, { album: CQ.Album.Default.id, level: 4 });
        });
        $('#main-level5-btn').click(function () {
            CQ.App.open(CQ.Page.Game.name, { album: CQ.Album.Default.id, level: 5 });
        });
        $('#main-level6-btn').click(function () {
            CQ.App.open(CQ.Page.Game.name, { album: CQ.Album.Default.id, level: 6 });
        });

        $('#main-buy-btn').click(function () {
            CQ.App.open('purchase');
        });

        $('#main-exchange-btn').click(function () {
            CQ.App.open('exchange');
        });

        $('#main-clear-btn').click(function () {
            CQ.Datastore.clear();
            CQ.Page.Game.picture = null;
            CQ.Currency.init();
            alert("Cleared data in storage.");
        });

        $('#dialog-exit-yes').click(function () {
            navigator.app.exitApp();
        });

        $('#dialog-exit-no').click(function () {
            CQ.App.open('main');
        });

        $('#main-share-btn').click(CQ.SNS.share);
        $('#main-share-fb-btn').click(CQ.SNS.Facebook.share);
        $('#main-share-tw-btn').click(CQ.SNS.Twitter.share);
        $('#main-share-line-btn').click(CQ.SNS.Line.share);
    },

    load: function () {
    }
};