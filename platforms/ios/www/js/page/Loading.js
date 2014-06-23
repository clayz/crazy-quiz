CQ.Page.Loading = {
    name: 'loading',

    init: function() {
        console.info('Initial loading page');

        setTimeout(function() {
            if (CQ.Datastore.getUsername()) {
                CQ.Page.open(CQ.Page.Main);
            } else {
                CQ.Page.open(CQ.Page.Index);
            }
        }, 1000);
    },

    load: function() {
    },

    back: function() {
        if (CQ.App.isAndroid())
            navigator.app.exitApp();
    }
};

CQ.App.inherits(CQ.Page.Loading, CQ.Page);
CQ.App.register(CQ.Page.Loading);