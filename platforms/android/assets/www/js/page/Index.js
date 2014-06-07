CQ.Page.Index = {
    name: 'index',

    init: function() {
        $(CQ.Id.Index.$START).click(function() {
            var username = $(CQ.Id.Index.$NAME_INPUT).val();

            if (username && (username.trim() != '')) {
                CQ.Datastore.setUsername(username);
                CQ.Page.open(CQ.Page.Main);
            }
        });
    },

    load: function() {
    }
};

CQ.App.inherits(CQ.Page.Index, CQ.Page);
CQ.App.register(CQ.Page.Index);