cordova.define("com.clay.phonegap.plugin.appccloud.AppCCloud", function(require, exports, module) { var appccloud = {
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
});
