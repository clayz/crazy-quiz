CQ.Page.Index = {
    name: 'index',

    init: function() {
        CQ.Log.debug('Initial index page');
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
            CQ.API.register();
        }
    }
};

CQ.App.inherits(CQ.Page.Index, CQ.Page);
CQ.App.register(CQ.Page.Index);