cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/nl.x-services.plugins.socialsharing/www/SocialSharing.js",
        "id": "nl.x-services.plugins.socialsharing.SocialSharing",
        "clobbers": [
            "window.plugins.socialsharing"
        ]
    },
    {
        "file": "plugins/com.adobe.plugins.GAPlugin/www/GAPlugin.js",
        "id": "com.adobe.plugins.GAPlugin.GAPlugin",
        "clobbers": [
            "GAPlugin"
        ]
    },
    {
        "file": "plugins/com.smartmobilesoftware.inappbilling/www/inappbilling.js",
        "id": "com.smartmobilesoftware.inappbilling.InAppBillingPlugin",
        "clobbers": [
            "inappbilling"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "nl.x-services.plugins.socialsharing": "4.0.8",
    "com.adobe.plugins.GAPlugin": "2.3.1",
    "com.smartmobilesoftware.inappbilling": "3.0.0"
}
// BOTTOM OF METADATA
});