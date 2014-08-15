CQ.SNS = {
    Message: {
        MAIN_PAGE: '私と一緒に遊びましょ。',
        GAME_PAGE: 'この画像知ってる？'
    },

    share: function(message, image) {
        CQ.Page.openLoading();

        // parameters: message, subject, file, url, successCallback, errorCallback
        if (image) {
            window.plugins.socialsharing.share(message, null, image, CQ.URL.Web.INDEX, CQ.SNS.shareImageFinish, CQ.SNS.shareImageError);
        } else {
            window.plugins.socialsharing.share(message, null, null, CQ.URL.Web.INDEX, CQ.SNS.shareFinish, CQ.SNS.shareError);
        }
    },

    shareFinish: function(isSuccess) {
        console.log('Share link finished, result: ' + isSuccess);
        CQ.Page.closeLoading();

        if (isSuccess) {
            var today = new Date().format("yyyy-mm-dd"), lastShareDate = CQ.Datastore.Currency.getLastShareDate();

            if (lastShareDate && (lastShareDate == today)) {
                CQ.Page.openPrompt('Already get share coin today: {0}'.format(today));
            } else {
                CQ.Datastore.Currency.setLastShareDate(today);
                CQ.Currency.earn(CQ.Currency.Earn.Share);
                CQ.Page.refreshCurrency();
                CQ.Page.openPrompt('Get 10 share coin', 500);
            }

            CQ.GA.track(CQ.GA.Share.Success);
        } else {
            CQ.GA.track(CQ.GA.Share.Fail);
        }
    },

    shareError: function(error) {
        console.error('Share link failed, error: ' + error);
        CQ.Page.closeLoading();

        CQ.Page.openPrompt('シェアに失敗しました');
        CQ.GA.track(CQ.GA.Share.Error);
    },

    shareImageFinish: function(isSuccess) {
        console.log('Share image finished, result: ' + isSuccess);
        CQ.Page.closeLoading();

        if (isSuccess) {
            if (CQ.Datastore.Picture.isPictureShared(CQ.Page.Game.album.id, CQ.Page.Game.picture.id)) {
                CQ.Page.openPrompt('Already get share coin for this picture');
            } else {
                CQ.Datastore.Picture.setPictureShared(CQ.Page.Game.album.id, CQ.Page.Game.picture.id);
                CQ.Currency.earn(CQ.Currency.Earn.Share);
                CQ.Page.refreshCurrency();
                CQ.Page.openPrompt('Get 10 share coin', 500);
            }

            CQ.GA.track(CQ.GA.Share.Success, CQ.GA.Share.Success.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
        } else {
            CQ.GA.track(CQ.GA.Share.Fail, CQ.GA.Share.Fail.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
        }
    },

    shareImageError: function(error) {
        console.error('Share image failed, error: ' + error);
        CQ.Page.closeLoading();

        CQ.Page.openPrompt('シェアに失敗しました');
        CQ.GA.track(CQ.GA.Share.Error, CQ.GA.Share.Error.label.format(CQ.Page.Game.album.id, CQ.Page.Game.picture.id));
    }
};

CQ.SNS.Facebook = {
    share: function(message, image) {
        CQ.Page.openLoading();

        // parameters: message, image, url, successCallback, errorCallback
        if (image) {
            window.plugins.socialsharing.shareViaFacebook(message, image, CQ.URL.Web.INDEX, CQ.SNS.shareImageFinish, CQ.SNS.shareImageError);
        } else {
            window.plugins.socialsharing.shareViaFacebook(message, null, CQ.URL.Web.INDEX, CQ.SNS.shareFinish, CQ.SNS.shareError);
        }
    }
};

CQ.SNS.Twitter = {
    share: function(message, image) {
        CQ.Page.openLoading();

        // parameters: message, image, url, successCallback, errorCallback
        if (image) {
            window.plugins.socialsharing.shareViaTwitter(message, image, CQ.URL.Web.INDEX, CQ.SNS.shareImageFinish, CQ.SNS.shareImageError);
        } else {
            window.plugins.socialsharing.shareViaTwitter(message, null, CQ.URL.Web.INDEX, CQ.SNS.shareFinish, CQ.SNS.shareError);
        }
    }
};

CQ.SNS.Line = {
    share: function(message, subject, image) {
        CQ.Page.openLoading();

        // parameters: via, message, subject, image, url, successCallback, errorCallback
        if (image) {
            window.plugins.socialsharing.shareVia('line', message, subject, image, CQ.URL.Web.INDEX, CQ.SNS.shareImageFinish, CQ.SNS.shareImageError);
        } else {
            window.plugins.socialsharing.shareVia('line', message, subject, null, CQ.URL.Web.INDEX, CQ.SNS.shareFinish, CQ.SNS.shareError);
        }
    }
};