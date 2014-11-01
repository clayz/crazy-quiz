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

        $.ajax({
            type: 'POST',
            url: CQ.URL.Web.API + this.Route.sync,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(history)
        }).done(function(response) {
            console.log('Send sync history request success, response: {0}'.format(CQ.Utils.toString(response)));

            var purchaseTimestamp = response.data.purchase,
                exchangeTimestamp = response.data.exchange,
                earnTimestamp = response.data.earn,
                consumeTimestamp = response.data.consume,
                history = CQ.Currency.history;

            if (purchaseTimestamp)
                for (var i = 0; i < history.purchase.length; i++)
                    if (CQ.API.getTimestamp(history.purchase[i].date) <= purchaseTimestamp)
                        history.purchase.splice(i, 1);

            if (exchangeTimestamp)
                for (var j = 0; j < history.exchange.length; j++)
                    if (CQ.API.getTimestamp(history.exchange[j].date) <= exchangeTimestamp)
                        history.exchange.splice(j, 1);

            if (earnTimestamp)
                for (var k = 0; k < history.earn.length; k++)
                    if (CQ.API.getTimestamp(history.earn[k].date) <= earnTimestamp)
                        history.earn.splice(k, 1);

            if (consumeTimestamp)
                for (var l = 0; l < history.consume.length; l++)
                    if (CQ.API.getTimestamp(history.consume[l].date) <= consumeTimestamp)
                        history.consume.splice(l, 1);

            CQ.Datastore.Currency.setHistory(history);
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