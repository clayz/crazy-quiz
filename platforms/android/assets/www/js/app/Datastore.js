CQ.Datastore = {
    /**
     * HTML5 Key-Value data store operations.
     */
    get: function(key) {
        return window.localStorage.getItem(key);
    },

    getObject: function(key) {
        var value = this.get(key);
        return value && JSON.parse(value);
    },

    set: function(key, value) {
        window.localStorage.setItem(key, value);
    },

    setObject: function(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value));
    },

    remove: function(key) {
        window.localStorage.removeItem(key);
    },

    clear: function() {
        window.localStorage.clear();
    },

    Key: {
        USERNAME: 'USERNAME',

        LAST_PICTURE: 'PICTURE_{0}_{1}',

        ACCOUNT: 'ACCOUNT',
        EARN_HISTORY: 'EARN_HISTORY',
        CONSUME_HISTORY: 'CONSUME_HISTORY',
        PURCHASE_HISTORY: 'PURCHASE_HISTORY',
        EXCHANGE_HISTORY: 'EXCHANGE_HISTORY',

        LAST_SHARE_DATE: 'LAST_SHARE_DATE'
    },

    /**
     * User module data storage.
     */
    getUsername: function() {
        return this.get(this.Key.USERNAME);
    },

    setUsername: function(username) {
        this.set(this.Key.USERNAME, username);
    },

    /**
     * Picture module data storage.
     */
    getLastPictureId: function(albumId, level) {
        return this.get(this.Key.LAST_PICTURE.format(albumId, level));
    },

    setLastPictureId: function(albumId, level, pictureId) {
        this.set(this.Key.LAST_PICTURE.format(albumId, level), pictureId);
    },

    /**
     * Currency module data storage.
     */
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

    getLastShareDate: function() {
        return this.get(this.Key.LAST_SHARE_DATE);
    },

    setLastShareDate: function(date) {
        this.set(this.Key.LAST_SHARE_DATE, date);
    }
};