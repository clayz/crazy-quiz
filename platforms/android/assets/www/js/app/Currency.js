CQ.Currency = {
    account: { gem: 5, coin: 100 },
    history: { earn: [], consume: [], purchase: [], exchange: [] },

    Earn: {
        // coin
        Login: { id: 1, coin: 5 },
        Share: { id: 2, coin: 10 },
        Rating: { id: 3, coin: 100 },
        Quiz: { id: 4, coin: 5 }, // correct answer
        Level: { id: 5, coin: 100 }, // finish level
        Album: { id: 6, coin: 300 }, // finish album

        // gem
        FirstPurchase: { id: 101, gem: 10 }
    },

    Consume: {
        // coin
        CutDown: { id: 1, coin: 50 },
        GetChar: { id: 2, coin: 90 },
        Prompt: { id: 3, coin: 30 },

        // gem
        UnlockLevel: { id: 101, gem: 10 },
        UnlockAlbum: { id: 102, gem: 30 }
    },

    Purchase: {
        Goods1: { id: 1, gem: 10, cost: 100, productId: "", title: "10個", description: "ボーナスなし" },
        Goods2: { id: 2, gem: 35, cost: 300, productId: "", title: "35個", description: "5個ボーナス！" },
        Goods3: { id: 3, gem: 75, cost: 600, productId: "", title: "75個", description: "15個ボーナス！" },
        Goods4: { id: 4, gem: 130, cost: 1000, productId: "", title: "130個", description: "30個ボーナス！" },
        Goods5: { id: 5, gem: 400, cost: 3000, productId: "", title: "400個", description: "100個ボーナス！" }
    },

    Exchange: {
        Goods1: { id: 1, gem: 1, coin: 30, description: "ボーナスなし" },
        Goods2: { id: 2, gem: 10, coin: 310, description: "3%ボーナス！" },
        Goods3: { id: 3, gem: 50, coin: 1580, description: "5%ボーナス！" },
        Goods4: { id: 4, gem: 100, coin: 3250, description: "8%ボーナス！" },
        Goods5: { id: 5, gem: 200, coin: 6600, description: "10%ボーナス！" }
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
        console.info('Earn type: {0}'.format(type.id));

        // update account and save history
        this.updateAccount(type.gem || 0, type.coin || 0);
        var date = new Date().getTime();

        this.history.earn.push({
            type: type.id,
            gem: type.gem,
            coin: type.coin,
            date: date
        });

        CQ.Datastore.Currency.setEarnHistory(this.history.earn);
        CQ.API.earn(type, date);

        return true;
    },

    consume: function(type, album, level, picture) {
        console.info('Consume {0}'.format(CQ.Utils.toString(type)));
        var date = new Date().getTime();

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
                    date: date
                });

                CQ.Datastore.Currency.setConsumeHistory(this.history.consume);
                CQ.API.consume(type, date, album, level, picture);

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
                    date: date
                });

                CQ.Datastore.Currency.setConsumeHistory(this.history.consume);
                CQ.API.consume(type, date, album, level, picture);

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
        var date = new Date().getTime();

        // save operation history
        this.history.purchase.push({
            goods: goods.id,
            gem: goods.gem,
            cost: goods.cost,
            date: date
        });

        CQ.Datastore.Currency.setPurchaseHistory(this.history.purchase);
        CQ.API.purchase(goods, date);
        CQ.GA.track(CQ.GA.Shop.Purchase, CQ.GA.Shop.Purchase.label.format(goods.id));

        return true;
    },

    exchange: function(goods) {
        console.info('Exchange coin, goods: {0}'.format(goods.id));

        if (this.account.gem >= goods.gem) {
            this.updateAccount(-goods.gem, goods.coin);
            var date = new Date().getTime();

            // save operation history
            this.history.exchange.push({
                goods: goods.id,
                gem: goods.gem,
                coin: goods.coin,
                date: date
            });

            CQ.Datastore.Currency.setExchangeHistory(this.history.exchange);
            CQ.API.exchange(goods, date);
            CQ.GA.track(CQ.GA.Shop.Exchange, CQ.GA.Shop.Exchange.label.format(goods.id));

            return true;
        } else {
            console.info('No enough gem, current gem: {0}'.format(this.account.gem));
            return false;
        }
    }
};

CQ.App.register(CQ.Currency);