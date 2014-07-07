CQ.Page.Loading = {
    name: 'loading',

    init: function() {
        console.info('Initial loading page');

        setTimeout(function() {
            CQ.Audio.Button.play();

            if (CQ.User.getName()) {
                CQ.Page.open(CQ.Page.Main);
            } else {
                CQ.Page.open(CQ.Page.Index);
            }
        }, 3000);
    },

    load: function() {
    },

    back: function() {
        if (CQ.App.android())
            navigator.app.exitApp();
    }
};

CQ.App.inherits(CQ.Page.Loading, CQ.Page);
CQ.App.register(CQ.Page.Loading);