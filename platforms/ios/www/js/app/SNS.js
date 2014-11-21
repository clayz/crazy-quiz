CQ.SNS = {
    OAUTH_IO_PUBLIC_KEY: '0bqiaeolMpLpbRhpa05K0xs0868',

    Message: {
        MAIN_PAGE: '私と一緒に熱狂クイズを楽しもう！',
        GAME_PAGE: 'この画像知ってる？答えを教えて！'
    },

    init: function() {
        OAuth.initialize(this.OAUTH_IO_PUBLIC_KEY);
    },

    share: function(message, image) {
        CQ.Page.openLoading();

        // parameters: message, subject, file, url, successCallback, errorCallback
        if (image) {
            window.plugins.socialsharing.share(message, null, image, CQ.URL.FACEBOOK, CQ.SNS.shareImageFinish, CQ.SNS.shareImageError);
        } else {
            window.plugins.socialsharing.share(message, null, null, CQ.URL.FACEBOOK, CQ.SNS.shareFinish, CQ.SNS.shareError);
        }
    },

    shareFinish: function(isSuccess) {
        CQ.Log.debug('Share link finished, result: ' + isSuccess);
        CQ.Page.closeLoading();

        if (isSuccess || CQ.App.android()) {
            var today = new Date().format("yyyy-mm-dd"), lastShareDate = CQ.Datastore.Currency.getLastShareDate();

            if (lastShareDate && (lastShareDate == today)) {
                CQ.Log.debug('Already get share coin today: {0}'.format(today));
            } else {
                CQ.Datastore.Currency.setLastShareDate(today);
                CQ.Currency.earn(CQ.Currency.Earn.Share);
                CQ.Page.refreshCurrency();
                CQ.Page.openPrompt('シェアが完了しました。<br/>10コインをGET！');
            }

            CQ.GA.track(CQ.GA.Share.Success);
        } else {
            CQ.GA.track(CQ.GA.Share.Fail);
        }
    },

    shareError: function(error) {
        CQ.Log.error('Share link failed, error: ' + error);
        CQ.Page.closeLoading();

        CQ.Page.openPrompt('シェア失敗しました。');
        CQ.GA.track(CQ.GA.Share.Error);
    },

    shareImageFinish: function(isSuccess) {
        CQ.Log.debug('Share image finished, result: ' + isSuccess);
        CQ.Page.closeLoading();

        if (isSuccess || CQ.App.android()) {
            if (CQ.Datastore.Picture.isPictureShared(CQ.Page.Game.album.id, CQ.Page.Game.picture.id)) {
                CQ.Log.debug('Already get share coin for this picture');
            } else {
                CQ.Datastore.Picture.setPictureShared(CQ.Page.Game.album.id, CQ.Page.Game.picture.id);
                CQ.Currency.earn(CQ.Currency.Earn.Share);
                CQ.Page.refreshCurrency();
                CQ.Page.openPrompt('シェアが完了しました。<br/>10コインをGET！');
            }

            CQ.GA.track(CQ.GA.Share.Success, CQ.GA.Share.Success.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
        } else {
            CQ.GA.track(CQ.GA.Share.Fail, CQ.GA.Share.Fail.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
        }
    },

    shareImageError: function(error) {
        CQ.Log.error('Share image failed, error: ' + error);
        CQ.Page.closeLoading();

        CQ.Page.openPrompt('シェア失敗しました。');
        CQ.GA.track(CQ.GA.Share.Error, CQ.GA.Share.Error.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
    }
};

CQ.SNS.Facebook = {
    login: function() {
        OAuth.popup('facebook')
            .done(function(result) {
                alert(CQ.Utils.toString(result));
            }).fail(function(err) {
                alert(err);
            });
    },

    share: function(message, image) {
        CQ.Page.openLoading();

        // parameters: message, image, url, successCallback, errorCallback
        if (image) {
            window.plugins.socialsharing.shareViaFacebook(message, image, CQ.URL.FACEBOOK, CQ.SNS.shareImageFinish, CQ.SNS.shareImageError);
        } else {
            window.plugins.socialsharing.shareViaFacebook(message, null, CQ.URL.FACEBOOK, CQ.SNS.shareFinish, CQ.SNS.shareError);
        }
    }
};

CQ.SNS.Twitter = {
    login: function() {
        OAuth.popup('twitter')
            .done(function(result) {
                alert(CQ.Utils.toString(result));
            }).fail(function(err) {
                alert(err);
            });
    },

    share: function(message, image) {
        CQ.Page.openLoading();

        // parameters: message, image, url, successCallback, errorCallback
        if (image) {
            window.plugins.socialsharing.shareViaTwitter(message, image, CQ.URL.FACEBOOK, CQ.SNS.shareImageFinish, CQ.SNS.shareImageError);
        } else {
            window.plugins.socialsharing.shareViaTwitter(message, null, CQ.URL.FACEBOOK, CQ.SNS.shareFinish, CQ.SNS.shareError);
        }
    }
};

CQ.SNS.Instagram = {
    login: function() {
        OAuth.popup('instagram')
            .done(function(result) {
                alert(CQ.Utils.toString(result));
            }).fail(function(err) {
                alert(err);
            });
    }
};

CQ.SNS.Line = {
    share: function(message, subject, image) {
        CQ.Page.openLoading();

        // parameters: via, message, subject, image, url, successCallback, errorCallback
        if (image) {
            window.plugins.socialsharing.shareVia('line', message, subject, image, CQ.URL.FACEBOOK, CQ.SNS.shareImageFinish, CQ.SNS.shareImageError);
        } else {
            window.plugins.socialsharing.shareVia('line', message, subject, null, CQ.URL.FACEBOOK, CQ.SNS.shareFinish, CQ.SNS.shareError);
        }
    }
};

CQ.App.register(CQ.SNS);