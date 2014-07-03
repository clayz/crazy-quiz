CQ.Datastore = {
    /**
     * HTML5 Key-Value data store operations.
     */
    get: function(key) {
        return window.localStorage.getItem(key);
    },

    getBoolean: function(key) {
        var value = this.get(key);
        return value && (value == 'true');
    },

    getObject: function(key) {
        var value = this.get(key);
        return value && JSON.parse(value);
    },

    set: function(key, value) {
        window.localStorage.setItem(key, value);
    },

    setBoolean: function(key, value) {
        this.set(key, value ? 'true' : 'false');
    },

    setObject: function(key, value) {
        this.set(key, JSON.stringify(value));
    },

    remove: function(key) {
        window.localStorage.removeItem(key);
    },

    clear: function() {
        window.localStorage.clear();
    }
};

/**
 * User and setting module data storage.
 */
CQ.Datastore.User = {
    Key: {
        USERNAME: 'USERNAME',
        AUDIO_ENABLED: 'AUDIO_ENABLED'
    },

    getUsername: function() {
        return this.get(this.Key.USERNAME);
    },

    setUsername: function(username) {
        this.set(this.Key.USERNAME, username);
    },

    isAudioEnabled: function() {
        this.getBoolean(this.Key.AUDIO_ENABLED);
    },

    setAudioEnabled: function(isEnabled) {
        this.setBoolean(this.Key.AUDIO_ENABLED, isEnabled);
    }
};

/**
 * Album and picture module data storage.
 */
CQ.Datastore.Picture = {
    Key: {
        LAST_ALBUM: 'ALBUM',
        LAST_LEVEL: 'LEVEL_{0}',
        LAST_PICTURE: 'PICTURE_{0}_{1}',
        LAST_SHARE_DATE: 'LAST_SHARE_DATE'
    },

    getLastAlbumId: function() {
        return parseInt(this.get(this.Key.LAST_ALBUM)) || 1;
    },

    setLastAlbumId: function(albumId) {
        this.set(this.Key.LAST_ALBUM, albumId);
    },

    getLastLevel: function(albumId) {
        return parseInt(this.get(this.Key.LAST_LEVEL.format(albumId))) || 1;
    },

    setLastLevel: function(albumId, level) {
        this.set(this.Key.LAST_LEVEL.format(albumId), level);
    },

    getLastPictureId: function(albumId, level) {
        return parseInt(this.get(this.Key.LAST_PICTURE.format(albumId, level)));
    },

    setLastPictureId: function(albumId, level, pictureId) {
        this.set(this.Key.LAST_PICTURE.format(albumId, level), pictureId);
    }
};

/**
 * Currency module data storage.
 */
CQ.Datastore.Currency = {
    Key: {
        ACCOUNT: 'ACCOUNT',
        EARN_HISTORY: 'EARN_HISTORY',
        CONSUME_HISTORY: 'CONSUME_HISTORY',
        PURCHASE_HISTORY: 'PURCHASE_HISTORY',
        EXCHANGE_HISTORY: 'EXCHANGE_HISTORY'
    },

    getAccount: function() {
        return this.getObject(this.Key.ACCOUNT);
    },

    setAccount: function(account) {
        this.setObject(this.Key.ACCOUNT, account);
    },

    getHistory: function() {
        var earn = this.getObject(this.Key.EARN_HISTORY),
            consume = this.getObject(this.Key.CONSUME_HISTORY),
            purchase = this.getObject(this.Key.PURCHASE_HISTORY),
            exchange = this.getObject(this.Key.EXCHANGE_HISTORY);

        return earn && consume && purchase && exchange ? {
            earn: earn,
            consume: consume,
            purchase: purchase,
            exchange: exchange
        } : null;
    },

    setHistory: function(history) {
        if (history.earn) this.setObject(this.Key.EARN_HISTORY, history.earn);
        if (history.consume) this.setObject(this.Key.CONSUME_HISTORY, history.consume);
        if (history.purchase) this.setObject(this.Key.PURCHASE_HISTORY, history.purchase);
        if (history.exchange) this.setObject(this.Key.EXCHANGE_HISTORY, history.exchange);
    },

    setEarnHistory: function(history) {
        this.setObject(this.Key.EARN_HISTORY, history);
    },

    setConsumeHistory: function(history) {
        this.setObject(this.Key.CONSUME_HISTORY, history);
    },

    setPurchaseHistory: function(history) {
        this.setObject(this.Key.PURCHASE_HISTORY, history);
    },

    setExchangeHistory: function(history) {
        this.setObject(this.Key.EXCHANGE_HISTORY, history);
    },

    getLastShareDate: function() {
        return this.get(this.Key.LAST_SHARE_DATE);
    },

    setLastShareDate: function(date) {
        this.set(this.Key.LAST_SHARE_DATE, date);
    }
};

CQ.App.inherits(CQ.Datastore.User, CQ.Datastore);
CQ.App.inherits(CQ.Datastore.Picture, CQ.Datastore);
CQ.App.inherits(CQ.Datastore.Currency, CQ.Datastore);