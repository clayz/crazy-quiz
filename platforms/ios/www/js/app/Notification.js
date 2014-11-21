CQ.Notification = {
    GCM_SENDER_ID: '314883138635',

    init: function() {
        CQ.Log.debug('Initial notification module');
        var pushNotification = window.plugins.pushNotification;

        if (CQ.App.android()) {
            pushNotification.register(
                this.successHandler,
                this.errorHandler,
                {
                    "senderID": this.GCM_SENDER_ID,
                    "ecb": "CQ.Notification.onNotification"
                });
        } else {
            pushNotification.register(
                this.tokenHandler,
                this.errorHandler,
                {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true",
                    "ecb": "CQ.Notification.onNotificationAPN"
                });
        }
    },

    successHandler: function(result) {
        CQ.Log.debug('Push notification initialize success: {0}'.format(result));
    },

    errorHandler: function(error) {
        if (!CQ.dev)
            CQ.Log.error('Push notification initialize failed: {0}'.format(error));
    },

    tokenHandler: function(result) {
        CQ.Log.debug('APNS token handler result: {0}'.format(CQ.Utils.toString(result)));
        CQ.Session.PUSH_TOKEN = result;
        CQ.API.registerNotification();
    },

    // Android and Amazon Fire OS
    onNotification: function(event) {
        CQ.Log.debug('onNotification: {0}'.format(CQ.Utils.toString(event)));
        CQ.Session.PUSH_TOKEN = event.regid;
        CQ.API.registerNotification();
    },

    // iOS
    onNotificationAPN: function(event) {
        CQ.Log.debug('onNotificationAPN: {0}'.format(CQ.Utils.toString(event)));
    }
};

CQ.App.register(CQ.Notification);