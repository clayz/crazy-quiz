CQ.Datastore = {
    /**
     * HTML5 Key-Value data store operations.
     */
    get: function(key) {
        return window.localStorage.getItem(key);
    },

    getBoolean: function(key, defaultValue) {
        var value = this.get(key);
        return value ? value == 'true' : defaultValue;
    },

    getInt: function(key) {
        var value = this.get(key);
        return value ? parseInt(value) : 0;
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
        AUDIO_ENABLED: 'AUDIO_ENABLED',
        START_TIMES: 'START_TIMES',
        RATED: 'RATED',
        CONTINUE_DAILY_COUNT: "CONTINUE_DAILY_COUNT",
        LAST_DAILY_TIME: "LAST_DAILY_TIME"
    },

    getUsername: function() {
        return this.get(this.Key.USERNAME);
    },

    setUsername: function(username) {
        this.set(this.Key.USERNAME, username);
    },

    isAudioEnabled: function() {
        return this.getBoolean(this.Key.AUDIO_ENABLED, true);
    },

    setAudioEnabled: function(isEnabled) {
        this.setBoolean(this.Key.AUDIO_ENABLED, isEnabled);
    },

    getStartTimes: function() {
        return this.getInt(this.Key.START_TIMES);
    },

    addStartTimes: function() {
        this.set(this.Key.START_TIMES, this.getInt(this.Key.START_TIMES) + 1);
    },

    isRated: function() {
        return this.getBoolean(this.Key.RATED);
    },

    setRated: function() {
        this.setBoolean(this.Key.RATED, true);
    },

    getContinueDailyCount: function() {
        return this.getInt(this.Key.CONTINUE_DAILY_COUNT);
    },

    setContinueDailyCount: function(count) {
        this.set(this.Key.CONTINUE_DAILY_COUNT, count);
    },

    getLastDailyTime: function() {
        return this.getInt(this.Key.LAST_DAILY_TIME);
    },

    setLastDailyTime: function(timestamp) {
        this.set(this.Key.LAST_DAILY_TIME, timestamp);
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
        LAST_SHARE_DATE: 'LAST_SHARE_DATE',

        FINISHED_ALBUM: 'FINISHED_ALBUM_{0}',
        FINISHED_LEVEL: 'FINISHED_LEVEL_{0}_{1}',
        FINISHED_PICTURE: 'FINISHED_PICTURE_{0}_{1}',

        SHARED_PICTURE: 'SHARED_PICTURE_{0}_{1}'
    },

    getLastAlbumId: function() {
        return parseInt(this.get(this.Key.LAST_ALBUM)) || 1;
    },

    setLastAlbumId: function(albumId) {
        this.set(this.Key.LAST_ALBUM, albumId);
    },

    getLastLevel: function(albumId) {
        return parseInt(this.get(this.Key.LAST_LEVEL.format(albumId))) || (albumId == 1 ? 1 : 0);
    },

    setLastLevel: function(albumId, level) {
        this.set(this.Key.LAST_LEVEL.format(albumId), level);
    },

    getLastPictureId: function(albumId, level) {
        return parseInt(this.get(this.Key.LAST_PICTURE.format(albumId, level)));
    },

    setLastPictureId: function(albumId, level, pictureId) {
        this.set(this.Key.LAST_PICTURE.format(albumId, level), pictureId);
    },

    isAlbumFinished: function(albumId) {
        return this.getBoolean(this.Key.FINISHED_ALBUM.format(albumId));
    },

    setAlbumFinished: function(albumId) {
        this.setBoolean(this.Key.FINISHED_ALBUM.format(albumId), 'true');
    },

    isLevelFinished: function(albumId, level) {
        return this.getBoolean(this.Key.FINISHED_LEVEL.format(albumId, level));
    },

    setLevelFinished: function(albumId, level) {
        this.setBoolean(this.Key.FINISHED_LEVEL.format(albumId, level), 'true');
    },

    isPictureFinished: function(albumId, pictureId) {
        return this.getBoolean(this.Key.FINISHED_PICTURE.format(albumId, pictureId));
    },

    setPictureFinished: function(albumId, pictureId) {
        this.setBoolean(this.Key.FINISHED_PICTURE.format(albumId, pictureId), 'true');
    },

    isPictureShared: function(albumId, pictureId) {
        return this.getBoolean(this.Key.SHARED_PICTURE.format(albumId, pictureId));
    },

    setPictureShared: function(albumId, pictureId) {
        this.setBoolean(this.Key.SHARED_PICTURE.format(albumId, pictureId), 'true');
    }
};

/**
 * Currency module data storage.
 */
CQ.Datastore.Currency = {
    Key: {
        ACCOUNT: 'ACCOUNT',
        IS_EARNED_FIRST_PURCHASE: 'IS_EARNED_FIRST_PURCHASE',
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
    },

    setEarnedFirstPurchase: function() {
        this.setBoolean(this.Key.IS_EARNED_FIRST_PURCHASE, 'true');
    },

    isEarnedFirstPurchase: function() {
        return this.getBoolean(this.Key.IS_EARNED_FIRST_PURCHASE, false);
    }
};

CQ.App.inherits(CQ.Datastore.User, CQ.Datastore);
CQ.App.inherits(CQ.Datastore.Picture, CQ.Datastore);
CQ.App.inherits(CQ.Datastore.Currency, CQ.Datastore);