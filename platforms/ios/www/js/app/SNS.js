CQ.SNS = {
    Message: {
        MAIN_PAGE: '私と一緒に遊びましょ。',
        GAME_PAGE: 'この画像知ってる？'
    },

    share: function(message, file) {
        // parameters: message, subject, file, url, successCallback, errorCallback
        window.plugins.socialsharing.share(message, null, file, CQ.URL.PLAY_STORE, CQ.SNS.shareFinish, CQ.SNS.shareError);
    },

    shareFinish: function(isSuccess) {
        console.log('Share finished, result: ' + isSuccess);
        CQ.Currency.earn(CQ.Currency.Earn.Share);
        CQ.Page.refreshCurrency();
    },

    shareError: function(error) {
        console.error('Share failed, error: ' + error);
        CQ.Currency.earn(CQ.Currency.Earn.Share);
        CQ.Page.refreshCurrency();
    }
};

CQ.SNS.Facebook = {
    share: function(message, image) {
        // parameters: message, image, url, successCallback, errorCallback
        window.plugins.socialsharing.shareViaFacebook(message, image, CQ.URL.Web.INDEX, CQ.SNS.shareFinish, CQ.SNS.shareError);
    }
};

CQ.SNS.Twitter = {
    share: function(message, image) {
        // parameters: message, image, url, successCallback, errorCallback
        window.plugins.socialsharing.shareViaTwitter(message, image, CQ.URL.Web.INDEX, CQ.SNS.shareFinish, CQ.SNS.shareError);
    }
};

CQ.SNS.Line = {
    share: function(message, subject, image) {
        // parameters: via, message, subject, image, url, successCallback, errorCallback
        window.plugins.socialsharing.shareVia('line', message, subject, image, CQ.URL.PLAY_STORE, CQ.SNS.shareFinish, CQ.SNS.shareError);
    }
};