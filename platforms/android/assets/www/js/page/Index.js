CQ.Page.Index = {
    name: 'index',

    init: function () {
        $('#index-start-btn').click(function () {
            var username = $('#index-name-input').val();

            if (username && (username.trim() != '')) {
                CQ.Datastore.setUsername(username);
                CQ.Page.open(CQ.Page.Main);
            }
        });
    },

    load: function () {
    }
};