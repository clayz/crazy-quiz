CQ.User = {
    name: '',

    init: function() {
        this.name = CQ.Datastore.User.getUsername();
    },

    getName: function() {
        return this.name;
    },

    setName: function(name) {
        CQ.Datastore.User.setUsername(name);
        this.name = name;
    }
};

CQ.App.register(CQ.User);