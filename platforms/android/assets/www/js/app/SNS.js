CQ.SNS = {
    share: function () {
        window.plugins.socialsharing.share('Message, image and link', null, 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl');
    }
};

CQ.SNS.Facebook = {
    share: function () {
        // shareViaFacebook parameters: message, image, url, successCallback, errorCallback
        window.plugins.socialsharing.shareViaFacebook(
            'Message and link via Facebook',
            'www/img/album/default/1.jpg',
            'https://play.google.com/store/apps/details?id=com.cyberagent.jra',
            function (isSuccess) {
                console.log('Facebook share success: ' + isSuccess);
            },
            function (error) {
                console.error('Facebook share failed: ' + error);
            });
    }
};

CQ.SNS.Twitter = {
    share: function () {
        // shareViaFacebook parameters: message, image, url, successCallback, errorCallback
        window.plugins.socialsharing.shareViaTwitter(
            'Message and link via Twitter',
            'www/img/album/default/1.jpg',
            'https://play.google.com/store/apps/details?id=com.cyberagent.jra',
            function (isSuccess) {
                console.log('Twitter share success: ' + isSuccess);
            },
            function (error) {
                console.error('Twitter share failed: ' + error);
            });
    }
};

CQ.SNS.Line = {
    share: function () {
        // shareVia parameters: via, message, subject, image, url, successCallback, errorCallback
        window.plugins.socialsharing.shareVia(
            'line',
            'Message and link via Line',
            'this is subject',
            'www/img/album/default/1.jpg',
            'https://play.google.com/store/apps/details?id=com.cyberagent.jra',
            function (isSuccess) {
                console.log('Line share success: ' + isSuccess);
            },
            function (error) {
                console.error('Line share failed: ' + error);
            });
    }
};