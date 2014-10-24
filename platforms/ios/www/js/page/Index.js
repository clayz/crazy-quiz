CQ.Page.Index = {
    name: 'index',

    init: function() {
        console.info('Initial index page');
        this.initCommon({ header: false });
        this.bindClickButton(CQ.Id.Index.$START, this.clickStart, CQ.Id.Image.INDEX_START_TAP, CQ.Id.Image.INDEX_START);
    },

    load: function() {
    },

    clickStart: function() {
        var name = $(CQ.Id.Index.$NAME_INPUT).val().trim();

        if (name && (name != '')) {
            CQ.User.setName(name);
            CQ.Page.open(CQ.Page.Main);
            CQ.API.startup();
        }
    }
};

CQ.App.inherits(CQ.Page.Index, CQ.Page);
CQ.App.register(CQ.Page.Index);