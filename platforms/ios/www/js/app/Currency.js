CQ.Currency = {
    account: { gem: 3, coin: 100 },
    history: { earn: [], consume: [], purchase: [], exchange: [] },

    Earn: {
        Login: { id: 1, coin: 5 },
        Share: { id: 2, coin: 10 },
        Rating: { id: 3, coin: 100 },
        Quiz: { id: 4, coin: 5 }, // correct answer
        Level: { id: 5, coin: 100 }, // finish level
        Album: { id: 6, coin: 300 } // finish album
    },

    Consume: {
        // coin
        CutDown: { id: 1, coin: 50 },
        GetChar: { id: 2, coin: 90 },
        Prompt: { id: 3, coin: 30 },

        // gem
        UnlockLevel: { id: 101, gem: 3 },
        UnlockAlbum: { id: 102, gem: 10 }
    },

    Purchase: {
        Goods1: { id: 1, gem: 10, cost: 100, productId: "", title: "10", description: "ボナースなし" },
        Goods2: { id: 2, gem: 55, cost: 500, productId: "", title: "55", description: "10% ボナース！" },
        Goods3: { id: 3, gem: 120, cost: 1000, productId: "", title: "120", description: "20% ボナース！" },
        Goods4: { id: 4, gem: 260, cost: 2000, productId: "", title: "260", description: "30% ボナース！" },
        Goods5: { id: 5, gem: 420, cost: 3000, productId: "", title: "420", description: "40% ボナースト！" }
    },

    Exchange: {
        Goods1: { id: 1, gem: 1, coin: 100, description: "ボナースなし" },
        Goods2: { id: 2, gem: 5, coin: 515, description: "3% ボナース！" },
        Goods3: { id: 3, gem: 10, coin: 1050, description: "5% ボナース！" },
        Goods4: { id: 4, gem: 50, coin: 5400, description: "8% ボナース！" },
        Goods5: { id: 5, gem: 100, coin: 11000, description: "10% ボナースト！" }
    },

    init: function() {
        console.info('Initial currency module');

        var account = CQ.Datastore.Currency.getAccount();
        if (account) this.account = account;
        else CQ.Datastore.Currency.setAccount(this.account);

        var history = CQ.Datastore.Currency.getHistory();
        if (history) this.history = history;
        else CQ.Datastore.Currency.setHistory(this.history);
    },

    updateAccount: function(gem, coin) {
        console.info('Update account, gem: {0}, coin: {1}'.format(gem, coin));
        this.account.gem += gem;
        this.account.coin += coin;
        CQ.Datastore.Currency.setAccount(this.account);
    },

    checkCoin: function(goods) {
        return this.account.coin >= goods.coin;
    },

    checkGem: function(goods) {
        return this.account.gem >= goods.gem;
    },

    earn: function(type) {
        console.info('Earn coin, type: {0}'.format(type.id));

        // update account and save into data store
        this.updateAccount(0, type.coin);

        // save operation history
        this.history.earn.push({
            type: type.id,
            coin: type.coin,
            date: new Date().getTime()
        });

        CQ.Datastore.Currency.setEarnHistory(this.history.earn);
        return true;
    },

    consume: function(type, album, level, picture) {
        console.info('Consume {0}'.format(CQ.Utils.toString(type)));

        if (type.coin) {
            if (this.account.coin >= type.coin) {
                this.updateAccount(0, -type.coin);

                // save operation history
                this.history.consume.push({
                    type: type.id,
                    coin: type.coin,
                    album: album,
                    level: level,
                    picture: picture,
                    date: new Date().getTime()
                });

                CQ.Datastore.Currency.setConsumeHistory(this.history.consume);
                return true;
            } else {
                console.info('No enough coin, current coin: {0}'.format(this.account.coin));
                return false;
            }
        } else if (type.gem) {
            if (this.account.gem >= type.gem) {
                this.updateAccount(-type.gem, 0);

                // save operation history
                this.history.consume.push({
                    type: type.id,
                    gem: type.gem,
                    album: album,
                    level: level,
                    picture: picture,
                    date: new Date().getTime()
                });

                CQ.Datastore.Currency.setConsumeHistory(this.history.consume);
                return true;
            } else {
                console.info('No enough gem, current gem: {0}'.format(this.account.gem));
                return false;
            }
        } else {
            throw 'Unknown consume type {0}'.format(CQ.Utils.toString(type));
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

        CQ.Datastore.Currency.setPurchaseHistory(this.history.purchase);
        return true;
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

            CQ.Datastore.Currency.setExchangeHistory(this.history.exchange);
            return true;
        } else {
            console.info('No enough gem, current gem: {0}'.format(this.account.gem));
            return false;
        }
    }
};

CQ.App.register(CQ.Currency);