CQ.GA = {
    trackingId: 'UA-50843267-1',

    Page: {
        Picture: 'Album {0} - Picture {1}'
    },

    Album: {
        Pass: { category: 'Album', action: 'Pass', label: 'Album {0}' },
        Unlock: { category: 'Album', action: 'Unlock', label: 'Album {0}' },
        UnlockPurchase: { category: 'Album', action: 'Unlock Purchase', label: 'Album {0}' }
    },

    Level: {
        Play: { category: 'Level', action: 'Play', label: 'Album {0} - Level {1}' },
        Pass: { category: 'Level', action: 'Pass', label: 'Album {0} - Level {1}' },
        Unlock: { category: 'Level', action: 'Unlock', label: 'Album {0} - Level {1}' },
        UnlockPurchase: { category: 'Level', action: 'Unlock Purchase', label: 'Album {0} - Level {1}' }
    },

    Picture: {
        Play: { category: 'Picture', action: 'Play', label: 'Album {0} - Picture {1}' },
        Pass: { category: 'Picture', action: 'Pass', label: 'Album {0} - Picture {1}' }
    },

    Share: {
        Click: { category: 'Share', action: 'Click' },
        FB: { category: 'Share', action: 'Facebook', label: 'Album {0} - Picture {1}' },
        TW: { category: 'Share', action: 'Twitter', label: 'Album {0} - Picture {1}' },
        Line: { category: 'Share', action: 'Line', label: 'Album {0} - Picture {1}' },
        Other: { category: 'Share', action: 'Other', label: 'Album {0} - Picture {1}' },
        Success: { category: 'Share', action: 'Success', label: 'Album {0} - Picture {1}' },
        Fail: { category: 'Share', action: 'Fail', label: 'Album {0} - Picture {1}' },
        Error: { category: 'Share', action: 'Error', label: 'Album {0} - Picture {1}' }
    },

    Shop: {
        Click: { category: 'Shop', action: 'Click', label: '{0} - Goods {1}' },
        Purchase: { category: 'Shop', action: 'Purchase', label: 'Goods {0}' },
        Exchange: { category: 'Shop', action: 'Exchange', label: 'Goods {0}' }
    },

    Props: {
        Getchar: { category: 'Props', action: 'Getchar', label: 'Album {0} - Picture {1}' },
        Cutdown: { category: 'Props', action: 'Cutdown', label: 'Album {0} - Picture {1}' },
        Prompt: { category: 'Props', action: 'Prompt', label: 'Album {0} - Picture {1}' }
    },

    init: function() {
        analytics.startTrackerWithId(this.trackingId);
    },

    trackPage: function(page) {
        console.info('Tracking page: {0}'.format(page));
        analytics.trackView(CQ.Utils.getCapitalName(page));
    },

    track: function(action, label, value) {
        this.trackEvent(action.category, action.action, label, value);
    },

    trackEvent: function(category, action, label, value) {
        if (!label) label = '';
        if (!value) value = 1;
        console.info('Tracking event, category: {0}, action: {1}, label: {2}, value: {3}'.format(category, action, label, value));
        analytics.trackEvent(category, action, label, value);
    }
};

CQ.App.register(CQ.GA);