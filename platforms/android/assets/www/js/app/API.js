CQ.API = {
    Route: {
        // user
        startup: '/api/user/startup/',

        // audit
        purchase: '/api/audit/purchase/',
        exchange: '/api/audit/exchange/'
    },

    startup: function(callback) {
        this.post(this.Route.startup, {
            uuid: CQ.Session.UUID,
            version: CQ.Session.VERSION,
            device: this.getDevice()
        }, callback);
    },

    post: function(url, data, success) {
        $.post(CQ.URL.Web.API + url, data, function(data) {
            console.log('Send request success: {0}, {1}'.format(url, CQ.Utils.toString(data)));
            if (success) success(data);
        }).fail(function() {
            console.error('Send request failed: {0}, {1}'.format(url, CQ.Utils.toString(data)));
        });
    },

    getDevice: function() {
        if (CQ.App.iPhone()) return 1;
        else if (CQ.App.iPad()) return 2;
        else if (CQ.App.android()) return 3;
        else return 0;
    }
};

CQ.App.register(CQ.API);