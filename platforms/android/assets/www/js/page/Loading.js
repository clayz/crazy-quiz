CQ.Page.Loading = {
    name: 'loading',

    init: function() {
        console.info('Initial loading page');

        setTimeout(function() {
            var name = CQ.User.getName();

            if (name) {
                // user already registered
                CQ.Page.open(CQ.Page.Main, { transition: "fade" });
                CQ.API.startup();
            } else {
                // first time startup
                CQ.Page.open(CQ.Page.Index, { transition: "fade" });
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