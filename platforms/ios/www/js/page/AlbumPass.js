CQ.Page.AlbumPass = {
    name: 'albumPass',

    init: function() {
        console.info('Initial album pass page');
        this.initCommon({ header: true, back: true });
    },

    load: function() {
    }
};

CQ.App.inherits(CQ.Page.AlbumPass, CQ.Page);
CQ.App.register(CQ.Page.AlbumPass);