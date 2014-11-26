CQ.API = {
    Route: {
        // user
        Startup: '/api/user/startup/',
        Register: '/api/user/register/',
        RegisterNotification: '/api/user/notification/',

        // audit
        Sync: '/api/audit/sync/',
        Purchase: '/api/audit/purchase/',
        Exchange: '/api/audit/exchange/',
        Earn: '/api/audit/earn/',
        Consume: '/api/audit/consume/',

        // sns
        AuthFacebook: '/api/auth/facebook',
        AuthTwitter: '/api/auth/twitter',
        AuthInstagram: '/api/auth/instagram'
    },

    startup: function(callback) {
        this.post(this.Route.Startup, {
            name: CQ.User.name,
            device: this.getDevice()
        }, callback);
    },

    register: function() {
        this.post(this.Route.Register, { name: CQ.User.name });
    },

    registerNotification: function() {
        this.post(this.Route.RegisterNotification, { push_token: CQ.Session.PUSH_TOKEN });
    },

    syncHistory: function() {
        $.ajax({
            type: 'POST',
            url: CQ.URL.Web.API + this.Route.Sync,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                uuid: CQ.Session.UUID,
                version: CQ.Session.VERSION,
                history: CQ.Currency.history
            })
        }).done(function(response) {
            CQ.Log.debug('Send sync history request success, response: {0}'.format(CQ.Utils.toString(response)));

            var purchaseTimestamp = response.data.purchase,
                exchangeTimestamp = response.data.exchange,
                earnTimestamp = response.data.earn,
                consumeTimestamp = response.data.consume,
                history = CQ.Currency.history,
                newHistory = { earn: [], consume: [], purchase: [], exchange: [] };

            if (purchaseTimestamp)
                for (var i = 0; i < history.purchase.length; i++)
                    if (CQ.API.getTimestamp(history.purchase[i].date) > purchaseTimestamp)
                        newHistory.purchase.push(history.purchase[i]);

            if (exchangeTimestamp)
                for (var j = 0; j < history.exchange.length; j++)
                    if (CQ.API.getTimestamp(history.exchange[j].date) > exchangeTimestamp)
                        newHistory.exchange.push(history.exchange[j]);

            if (earnTimestamp)
                for (var k = 0; k < history.earn.length; k++)
                    if (CQ.API.getTimestamp(history.earn[k].date) > earnTimestamp)
                        newHistory.earn.push(history.earn[k]);

            if (consumeTimestamp)
                for (var l = 0; l < history.consume.length; l++)
                    if (CQ.API.getTimestamp(history.consume[l].date) > consumeTimestamp)
                        newHistory.consume.push(history.consume[l]);

            CQ.Currency.history = newHistory;
            CQ.Datastore.Currency.setHistory(newHistory);
            CQ.Log.debug('Currency history after sync: {0}'.format(CQ.Utils.toString(CQ.Currency.history)));
        });
    },

    purchase: function(goods, date) {
        this.post(this.Route.Purchase, {
            goods_id: goods.id,
            date: this.getTimestamp(date)
        });
    },

    exchange: function(goods, date) {
        this.post(this.Route.Exchange, {
            goods_id: goods.id,
            date: this.getTimestamp(date)
        });
    },

    earn: function(type, date) {
        this.post(this.Route.Earn, {
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

        this.post(this.Route.Consume, data);
    },

    authFacebook: function(accessToken, expires, code) {
        this.post(this.Route.AuthFacebook, {
            access_token: accessToken,
            expires: expires,
            code: code
        });
    },

    authTwitter: function(token, tokenSecret, code) {
        this.post(this.Route.AuthTwitter, {
            token: token,
            token_secret: tokenSecret,
            code: code
        });
    },

    authInstagram: function(accessToken, code) {
        this.post(this.Route.AuthInstagram, {
            access_token: accessToken,
            code: code
        });
    },

    post: function(url, data, success, fail) {
        data.uuid = CQ.Session.UUID;
        data.version = CQ.Session.VERSION;

        $.post(CQ.URL.Web.API + url, data, function(response) {
            CQ.Log.debug('Send request success: {0}, {1}, response: {2}'.format(url, CQ.Utils.toString(data), CQ.Utils.toString(response)));
            if (success) success(response);
        }).fail(function(error) {
            CQ.Log.error('Send request failed: {0}, {1}, error: {2}'.format(url, CQ.Utils.toString(data), CQ.Utils.toString(error)));
            if (fail) fail(error);
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