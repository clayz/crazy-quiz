CQ.GA = {
    trackingId: 'UA-50843267-1',
    gaPlugin: null,

    Page: {
        Picture: 'Album {0} - Picture {1}'
    },

    Album: {
        Pass: { category: 'Album', action: 'Pass', label: 'Album {0}' },
        Unlock: { category: 'Album', action: 'Unlock', label: 'Album {0}' }
    },

    Level: {
        Play: { category: 'Level', action: 'Play', label: 'Album {0} - Level {1}' },
        Pass: { category: 'Level', action: 'Pass', label: 'Album {0} - Level {1}' },
        Unlock: { category: 'Level', action: 'Unlock', label: 'Album {0} - Level {1}' }
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
        Other: { category: 'Share', action: 'Other', label: 'Album {0} - Picture {1}' }
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