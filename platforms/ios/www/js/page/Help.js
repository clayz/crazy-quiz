CQ.Page.Help = {
    name: 'help',

    init: function() {
        console.info('Initial help page');
        this.initCommon({ header: true, back: true });
    },

    load: function() {
    }
};

CQ.App.inherits(CQ.Page.Help, CQ.Page);
CQ.App.register(CQ.Page.Help);