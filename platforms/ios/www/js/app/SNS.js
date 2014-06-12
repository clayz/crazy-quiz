CQ.SNS = {
    Message: {
        MAIN_PAGE: 'Join crazy quiz, come to play with me.'
    },

    PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.clay.crazyquiz',

    share: function(message) {
        // parameters: message, subject, file, url, successCallback, errorCallback
        window.plugins.socialsharing.share(message, null, null, this.PLAY_STORE_URL, CQ.SNS.shareFinish, CQ.SNS.shareError);
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
        window.plugins.socialsharing.shareViaFacebook(message, image, CQ.SNS.PLAY_STORE_URL, CQ.SNS.shareFinish, CQ.SNS.shareError);
    }
};

CQ.SNS.Twitter = {
    share: function(message, image) {
        // parameters: message, image, url, successCallback, errorCallback
        window.plugins.socialsharing.shareViaTwitter(message, image, CQ.SNS.PLAY_STORE_URL, CQ.SNS.shareFinish, CQ.SNS.shareError);
    }
};

CQ.SNS.Line = {
    share: function(message, subject, image) {
        // parameters: via, message, subject, image, url, successCallback, errorCallback
        window.plugins.socialsharing.shareVia('line', message, subject, image, CQ.SNS.PLAY_STORE_URL, CQ.SNS.shareFinish, CQ.SNS.shareError);
    }
};