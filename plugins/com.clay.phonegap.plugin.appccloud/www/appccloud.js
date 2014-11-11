var appccloud = {
    listView: function(success, failure) {
        cordova.exec(
            success,
            failure,
            'AppCCloud',
            'listView',
            []);
    }
};

module.exports = appccloud;