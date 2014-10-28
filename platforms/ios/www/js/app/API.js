CQ.API = {
    Route: {
        // user
        startup: '/api/user/startup/',
        register: '/api/user/register/',
        register_notification: '/api/user/notification/',

        // audit
        purchase: '/api/audit/purchase/',
        exchange: '/api/audit/exchange/',
        earn: '/api/audit/earn/',
        consume: '/api/audit/consume/'
    },

    startup: function(callback) {
        this.post(this.Route.startup, { device: this.getDevice() }, callback);
    },

    register: function() {
        this.post(this.Route.register, { name: CQ.User.name });
    },

    register_notification: function() {
        this.post(this.Route.register_notification, { push_token: CQ.Session.PUSH_TOKEN });
    },

    purchase: function(goods, date) {
        this.post(this.Route.purchase, {
            goods_id: goods.id,
            product_id: goods.productId,
            gem: goods.gem,
            cost: goods.cost,
            date: date
        });
    },

    exchange: function(goods, date) {
        this.post(this.Route.exchange, {
            goods_id: goods.id,
            gem: goods.gem,
            coin: goods.coin,
            date: date
        });
    },

    earn: function(type, date) {
        this.post(this.Route.earn, {
            type_id: type.id,
            gem: type.gem,
            coin: type.coin,
            date: date
        });
    },

    consume: function(type, date, album, level, picture) {
        var data = {
            type_id: type.id,
            date: date
        };

        if (type.gem) data.gem = type.gem;
        if (type.coin) data.coin = type.coin;
        if (album) data.album = album;
        if (level) data.level = level;
        if (picture) data.picture = picture;

        this.post(this.Route.consume, data);
    },

    post: function(url, data, success) {
        data.uuid = CQ.Session.UUID;
        data.version = CQ.Session.VERSION;

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