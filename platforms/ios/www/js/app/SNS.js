CQ.SNS = {
    OAUTH_IO_PUBLIC_KEY: '0bqiaeolMpLpbRhpa05K0xs0868',

    ShareType: {
        FACEBOOK: 1,
        TWITTER: 2
    },

    Message: {
        MAIN_PAGE: '私と一緒に熱狂クイズを楽しもう！',
        GAME_PAGE: 'この画像知ってる？答えを教えて！'
    },

    init: function() {
        OAuth.initialize(this.OAUTH_IO_PUBLIC_KEY);
    },

    shareSuccess: function(response) {
        CQ.Page.closeLoading();

        if (CQ.API.isSuccess(response)) {
            var today = new Date().format("yyyy-mm-dd"), lastShareDate = CQ.Datastore.Currency.getLastShareDate();

            if (lastShareDate && (lastShareDate == today)) {
                CQ.Log.debug('Already get share coin today: {0}'.format(today));
                CQ.Page.openPrompt('シェアが完了しました。');
            } else {
                CQ.Datastore.Currency.setLastShareDate(today);
                CQ.Currency.earn(CQ.Currency.Earn.Share);
                CQ.Page.refreshCurrency();
                CQ.Page.openPrompt('シェアが完了しました。10コインをGET！');
            }

            CQ.GA.track(CQ.GA.Share.Success);
        } else {
            CQ.Log.error('Share link failed, response: {0}'.format(CQ.Utils.toString(response)));
            CQ.Page.openPrompt('シェア失敗しました、後ほど再度お試しください。');
            CQ.GA.track(CQ.GA.Share.Error);
        }
    },

    sharePictureSuccess: function(response) {
        CQ.Page.closeLoading();

        if (CQ.API.isSuccess(response)) {
            if (CQ.Datastore.Picture.isPictureShared(CQ.Page.Game.album.id, CQ.Page.Game.picture.id)) {
                CQ.Log.debug('Already get share coin for this picture');
                CQ.Page.openPrompt('シェアが完了しました。');
            } else {
                CQ.Datastore.Picture.setPictureShared(CQ.Page.Game.album.id, CQ.Page.Game.picture.id);
                CQ.Currency.earn(CQ.Currency.Earn.Share);
                CQ.Page.refreshCurrency();
                CQ.Page.openPrompt('シェアが完了しました。10コインをGET！');
            }

            CQ.GA.track(CQ.GA.Share.Success, CQ.GA.Share.Success.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
        } else {
            CQ.Log.error('Share link failed, response: {0}'.format(CQ.Utils.toString(response)));
            CQ.Page.openPrompt('シェア失敗しました、後ほど再度お試しください。');
            CQ.GA.track(CQ.GA.Share.Error, CQ.GA.Share.Error.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
        }
    },

    fail: function() {
        CQ.Page.closeLoading();
        CQ.Page.openPrompt('シェア失敗しました、後ほど再度お試しください。');
        CQ.GA.track(CQ.GA.Share.Fail);
    }
};

CQ.SNS.Facebook = {
    login: function(success) {
        OAuth.popup('facebook', {
            cache: true,
            state: CQ.Session.UUID
        }).done(function(result) {
            CQ.Log.debug(CQ.Utils.toString(result));
            CQ.API.authFacebook(result.access_token, result.expires_in, result.code, function() {
                CQ.Session.FACEBOOK_AUTH = true;
            });

            if (success) success();
        }).fail(function(err) {
            if (err != 'Error: The popup was closed')
                CQ.Log.error('Facebook oauth error: {0}'.format(err));
        });
    },

    share: function(message, album, picture) {
        CQ.Page.openLoading();

        if (album && picture) {
            CQ.API.shareFacebook(message, album, picture, CQ.SNS.sharePictureSuccess, CQ.SNS.fail);
            CQ.GA.track(CQ.GA.Share.FB, CQ.GA.Share.FB.label.format(album, picture));
        } else {
            CQ.API.shareFacebook(message, album, picture, CQ.SNS.shareSuccess, CQ.SNS.fail);
            CQ.GA.track(CQ.GA.Share.FB, CQ.Utils.getCapitalName(CQ.Session.CURRENT_PAGE));
        }
    }
};

CQ.SNS.Twitter = {
    login: function(success) {
        OAuth.popup('twitter', {
            cache: true,
            state: CQ.Session.UUID
        }).done(function(result) {
            CQ.Log.debug(CQ.Utils.toString(result));
            CQ.API.authTwitter(result.oauth_token, result.oauth_token_secret, result.code, function() {
                CQ.Session.TWITTER_AUTH = true;
            });

            if (success) success();
        }).fail(function(err) {
            if (err != 'Error: The popup was closed')
                CQ.Log.error('Twitter oauth error: {0}'.format(err));
        });
    },

    share: function(message, album, picture) {
        CQ.Page.openLoading();

        if (album && picture) {
            CQ.API.shareTwitter(message, album, picture, CQ.SNS.sharePictureSuccess, CQ.SNS.fail);
            CQ.GA.track(CQ.GA.Share.TW, CQ.GA.Share.TW.label.format(album, picture));
        } else {
            CQ.API.shareTwitter(message, album, picture, CQ.SNS.shareSuccess, CQ.SNS.fail);
            CQ.GA.track(CQ.GA.Share.TW, CQ.Utils.getCapitalName(CQ.Session.CURRENT_PAGE));
        }
    }
};

CQ.App.register(CQ.SNS);