CQ.Currency = {
    account: {
        gem: 1, coin: 100
    },

    history: {
        earn: [], consume: [], purchase: [], exchange: []
    },

    Earn: {
        Login: { id: 1, coin: 1 },
        Share: { id: 2, coin: 3 },
        Rating: { id: 3, coin: 100 },
        Quiz: { id: 4, coin: 3 },
        Level: {id: 5, coin: 50},
        Album: { id: 6, coin: 100 }
    },

    Consume: {
        // coin
        CutDown: { id: 1, coin: 30 },
        GetChar: { id: 2, coin: 50 },
        Prompt: { id: 3, coin: 10 },

        // gem
        UnlockLevel: { id: 101, gem: 1 },
        UnlockAlbum: { id: 102, gem: 3 }
    },

    Purchase: {
        Goods1: { id: 1, gem: 10, cost: 100 },
        Goods2: { id: 2, gem: 22, cost: 200 },
        Goods3: { id: 3, gem: 60, cost: 500 },
        Goods4: { id: 4, gem: 130, cost: 1000 },
        Goods5: { id: 5, gem: 300, cost: 2000 }
    },

    Exchange: {
        Goods1: { id: 1, gem: 10, coin: 1000 },
        Goods2: { id: 2, gem: 20, coin: 2100 },
        Goods3: { id: 3, gem: 50, coin: 6000 },
        Goods4: { id: 4, gem: 100, coin: 13000 },
        Goods5: { id: 5, gem: 200, coin: 28000 }
    },

    init: function() {
        console.info('Initial currency module');

        var account = CQ.Datastore.getAccount();
        if (account) this.account = account;
        else CQ.Datastore.setAccount(this.account);

        var history = CQ.Datastore.getHistory();
        if (history) this.history = history;
        else CQ.Datastore.setHistory(this.history);

        // TODO only used for development, remove it later
        console.info('Earn history: {0}'.format(CQ.Utils.toString(this.history.earn)));
        console.info('Consume history: {0}'.format(CQ.Utils.toString(this.history.consume)));
        console.info('Purchase history: {0}'.format(CQ.Utils.toString(this.history.purchase)));
        console.info('Exchange history: {0}'.format(CQ.Utils.toString(this.history.exchange)));
    },

    updateAccount: function(gem, coin) {
        console.info('Update account, gem: {0}, coin: {1}'.format(gem, coin));
        this.account.gem += gem;
        this.account.coin += coin;
        CQ.Datastore.setAccount(this.account);
    },

    checkCoin: function(goods) {
        return this.account.coin >= goods.coin;
    },

    checkGem: function(goods) {
        return this.account.gem >= goods.gem;
    },

    earn: function(type) {
        console.info('Earn coin, type: {0}'.format(type.id));

        // validation
        if (type.id == this.Earn.Share.id) {
            var today = new Date().format("yyyy-mm-dd"), lastShareDate = CQ.Datastore.getLastShareDate();

            if (lastShareDate && (lastShareDate == today)) {
                console.info('Already get share coin today: {0}'.format(today));
                return false;
            } else {
                CQ.Datastore.setLastShareDate(today);
            }
        }

        // update account and save into data store
        this.updateAccount(0, type.coin);

        // save operation history
        this.history.earn.push({
            type: type.id,
            coin: type.coin,
            date: new Date().getTime()
        });

        CQ.Datastore.setObject(CQ.Datastore.Key.EARN_HISTORY, this.history.earn);
    },

    consume: function(type, album, picture) {
        console.info('Consume coin, type: {0}'.format(type.id));

        if (this.account.coin >= type.coin) {
            this.updateAccount(0, -type.coin);

            // save operation history
            this.history.consume.push({
                type: type.id,
                coin: type.coin,
                album: album,
                picture: picture,
                date: new Date().getTime()
            });

            CQ.Datastore.setObject(CQ.Datastore.Key.CONSUME_HISTORY, this.history.consume);
            return true;
        } else {
            console.info('No enough coin, current coin: {0}'.format(this.account.coin));
            return false;
        }
    },

    purchase: function(goods) {
        console.info('Purchase gem, goods: {0}'.format(goods.id));
        this.updateAccount(goods.gem, 0);

        // save operation history
        this.history.purchase.push({
            goods: goods.id,
            gem: goods.gem,
            cost: goods.cost,
            date: new Date().getTime()
        });

        CQ.Datastore.setObject(CQ.Datastore.Key.PURCHASE_HISTORY, this.history.purchase);
    },

    exchange: function(goods) {
        console.info('Exchange coin, goods: {0}'.format(goods.id));

        if (this.account.gem >= goods.gem) {
            this.updateAccount(-goods.gem, goods.coin);

            // save operation history
            this.history.exchange.push({
                goods: goods.id,
                gem: goods.gem,
                coin: goods.coin,
                date: new Date().getTime()
            });

            CQ.Datastore.setObject(CQ.Datastore.Key.EXCHANGE_HISTORY, this.history.exchange);
            return true;
        } else {
            console.info('No enough gem, current gem: {0}'.format(this.account.gem));
            return false;
        }
    }
};

CQ.App.register(CQ.Currency);