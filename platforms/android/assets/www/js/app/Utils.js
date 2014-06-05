if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

CQ.Utils = {
    getCapitalName: function (name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    },

    toString: function (obj) {
        return JSON.stringify(obj);
    }
}