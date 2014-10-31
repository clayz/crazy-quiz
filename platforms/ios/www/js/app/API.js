CQ.API = {
    Route: {
        // user
        startup: '/api/user/startup/',
        register: '/api/user/register/',
        register_notification: '/api/user/notification/',

        // audit
        sync: '/api/audit/sync/',
        purchase: '/api/audit/purchase/',
        exchange: '/api/audit/exchange/',
        earn: '/api/audit/earn/',
        consume: '/api/audit/consume/'
    },

    startup: function(callback) {
        this.post(this.Route.startup, {
            name: CQ.User.name,
            device: this.getDevice()
        }, callback);
    },

    register: function() {
        this.post(this.Route.register, { name: CQ.User.name });
    },

    register_notification: function() {
        this.post(this.Route.register_notification, { push_token: CQ.Session.PUSH_TOKEN });
    },

    sync_history: function(history) {
        history.uuid = CQ.Session.UUID;
        history.version = CQ.Session.VERSION;

        $.post(CQ.URL.Web.API + this.Route.sync, JSON.stringify(history), function(response) {
            console.log('Send sync history request success, response: {0}'.format(response));
        }, 'json').fail(function() {
            console.error('Send sync history request failed.');
        });
    },

    purchase: function(goods, date) {
        this.post(this.Route.purchase, {
            goods_id: goods.id,
            date: this.getTimestamp(date)
        });
    },

    exchange: function(goods, date) {
        this.post(this.Route.exchange, {
            goods_id: goods.id,
            date: this.getTimestamp(date)
        });
    },

    earn: function(type, date) {
        this.post(this.Route.earn, {
            type_id: type.id,
            date: this.getTimestamp(date)
        });
    },

    consume: function(type, date, album, level, picture) {
        var data = {
            type_id: type.id,
            date: this.getTimestamp(date)
        };

        if (album) data.album = album;
        if (level) data.level = level;
        if (picture) data.picture = picture;

        this.post(this.Route.consume, data);
    },

    post: function(url, data, success) {
        data.uuid = CQ.Session.UUID;
        data.version = CQ.Session.VERSION;

        $.post(CQ.URL.Web.API + url, data, function(response) {
            console.log('Send request success: {0}, {1}, response: {2}'.format(url, CQ.Utils.toString(data), response));
            if (success) success(response);
        }).fail(function() {
            console.error('Send request failed: {0}, {1}'.format(url, CQ.Utils.toString(data)));
        });
    },

    getDevice: function() {
        if (CQ.App.iPhone()) return 1;
        else if (CQ.App.iPad()) return 2;
        else if (CQ.App.android()) return 3;
        else return 0;
    },

    getTimestamp: function(date) {
        return parseInt((date % 1 === 0 ? date : date.getTime()) / 1000);
    }
};

CQ.App.register(CQ.API);