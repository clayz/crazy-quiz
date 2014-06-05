CQ.Page.Index = {
    name: 'index',

    init: function () {
        console.info('Initial index page');

        setTimeout(function () {
            CQ.Page.open(CQ.Page.Main);
        }, 3000);
    },

    load: function () {
    },

    back: function () {
        navigator.app.exitApp();
    }
};