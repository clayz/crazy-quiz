CQ.GA = {
    trackingId: 'UA-50843267-1',
    gaPlugin: null,

    Category: {
        Index: CQ.Utils.getCapitalName(CQ.Page.Loading.name),
        Main: CQ.Utils.getCapitalName(CQ.Page.Main.name),
        Game: CQ.Utils.getCapitalName(CQ.Page.Game.name),
        Purchase: CQ.Utils.getCapitalName(CQ.Page.Purchase.name)
    },

    Action: {
        View: 'View'
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

    trackEvent: function(category, action, label, value) {
        if (!this.gaPlugin) {
            console.error('Google analytics instance is not initialized.');
            return;
        }

        console.info('Tracking event, category: {0}, action: {1}, label: {2}, value: {3}'.format(category, action, label, value));
        this.gaPlugin.trackEvent(this.nativePluginResultHandler, this.nativePluginErrorHandler, category, action, label, value);
    },

    successHandler: function() {
        console.info('Google analytics initial success.');
    },

    errorHandler: function() {
        console.error('Google analytics initial failed.');
    },

    nativePluginResultHandler: function() {
        console.info('Send GA tracking info success.');
    },

    nativePluginErrorHandler: function() {
        console.error('Send GA tracking info failed.');
    }
};

CQ.App.register(CQ.GA);