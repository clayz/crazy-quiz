CQ.Notification = {
    GCM_SENDER_ID: '314883138635',

    init: function() {
        console.info('Initial notification module');
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
        console.info('Push notification initialize success: {0}'.format(result));
    },

    errorHandler: function(error) {
        console.error('Push notification initialize failed: {0}'.format(error));
    },

    tokenHandler: function(result) {
        console.info('APNS token handler result: {0}'.format(CQ.Utils.toString(result)));
        CQ.Session.PUSH_TOKEN = result;
    },

    // Android and Amazon Fire OS
    onNotification: function(event) {
        console.info('onNotification: {0}'.format(CQ.Utils.toString(event)));
        CQ.Session.PUSH_TOKEN = event.regid;
    },

    // iOS
    onNotificationAPN: function(event) {
        console.info('onNotificationAPN: {0}'.format(CQ.Utils.toString(event)));
    }
};

CQ.App.register(CQ.Notification);