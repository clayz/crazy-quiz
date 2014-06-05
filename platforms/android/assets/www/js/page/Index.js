CQ.Page.Index = {
    name: 'index',

    init: function () {
        console.info('Initial index page');

        setTimeout(function () {
            CQ.App.open('main');
        }, 3000);
    },

    load: function () {
    },

    back: function () {
        navigator.app.exitApp();
    }
};