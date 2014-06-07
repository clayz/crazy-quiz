CQ.GA = {
    trackingId: 'UA-50843267-1',
    gaPlugin: null,

    Album: {
        Pass: { category: 'Album', action: 'Pass' },
        Unlock: { category: 'Album', action: 'Unlock' }
    },

    Level: {
        Play: { category: 'Level', action: 'Play', label: 'Album {0} - Level {1}' },
        Back: { category: 'Level', action: 'Back' },
        Pass: { category: 'Level', action: 'Pass' },
        Unlock: { category: 'Level', action: 'Unlock' }
    },

    Picture: {
        Play: { category: 'Picture', action: 'Play', label: 'Picture: {0}' },
        Back: { category: 'Picture', action: 'Back', label: 'Picture: {0}' },
        Pass: { category: 'Picture', action: 'Pass', label: 'Picture: {0}' }
    },

    Share: {
        Click: { category: 'Share', action: 'Click' },
        FB: { category: 'Share', action: 'Facebook' },
        TW: { category: 'Share', action: 'Twitter' },
        Line: { category: 'Share', action: 'Line' },
        Other: { category: 'Share', action: 'Other' }
    },

    Shop: {
        Click: { category: 'Shop', action: 'Click' },
        Buy: { category: 'Shop', action: 'Buy' },
        Exchange: { category: 'Shop', action: 'Exchange' }
    },

    Props: {
        Getchar: { category: 'Props', action: 'Getchar', label: 'Picture: {0}' },
        Cutdown: { category: 'Props', action: 'Cutdown', label: 'Picture: {0}' },
        Prompt: { category: 'Props', action: 'Prompt', label: 'Picture: {0}' }
    },

    init: function() {
        this.gaPlugin = window.plugins.gaPlugin;
        this.gaPlugin.init(CQ.GA.successHandler, CQ.GA.errorHandler, CQ.GA.trackingId, 10);
    },

    trackPage: function(page) {
        if (!this.gaPlugin) {
            console.error('Google analytics instance is not initialized.');
            return;
        }

        console.info('Tracking page: {0}'.format(page));
        this.gaPlugin.trackPage(this.nativePluginResultHandler, this.nativePluginErrorHandler, CQ.Utils.getCapitalName(page));
    },

    track: function(action, label, value) {
        this.trackEvent(action.category, action.action, label, value);
    },

    trackEvent: function(category, action, label, value) {
        if (!this.gaPlugin) {
            console.error('Google analytics instance is not initialized.');
            return;
        }

        if (!label) label = '';
        if (!value) value = 1;

        console.info('Tracking event, category: {0}, action: {1}, label: {2}, value: {3}'.format(category, action, label, value));
        this.gaPlugin.trackEvent(this.nativePluginResultHandler, this.nativePluginErrorHandler, category, action, label, value);
    },

    successHandler: function() {
        console.info('Google analytics initial success');
    },

    errorHandler: function() {
        console.error('Google analytics initial failed');
    },

    nativePluginResultHandler: function() {
        console.info('Send GA tracking info success');
    },

    nativePluginErrorHandler: function() {
        console.error('Send GA tracking info failed');
    }
};

CQ.App.register(CQ.GA);