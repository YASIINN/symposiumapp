jQuery.sap.require("symposiumapp.AllRequest.AllRequest");
var PluginService = {
    getPlugin: function (json) {
        var deferred = new Promise(function (resolve, reject) {
            AllRequest.POST(json).then(function (res) {
                resolve(res);
            })
        })
        return deferred;
    }
}