CQ.Page.LevelPass = {
    name: 'levelPass',

    init: function() {
        console.info('Initial level pass page');
        this.initCommon({ header: true });
    },

    load: function() {
    }
};

CQ.App.inherits(CQ.Page.LevelPass, CQ.Page);
CQ.App.register(CQ.Page.LevelPass);