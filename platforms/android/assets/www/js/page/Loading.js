CQ.Page.Loading = {
    name: 'loading',

    init: function () {
        console.info('Initial loading page');

        setTimeout(function () {
            if (CQ.Datastore.getUsername()) {
                this.open(CQ.Page.Main);
            } else {
                this.open(CQ.Page.Index);
            }
        }, 3000);
    },

    load: function () {
    },

    back: function () {
        navigator.app.exitApp();
    }
};