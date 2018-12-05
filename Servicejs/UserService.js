jQuery.sap.require("symposiumapp.AllRequest.AllRequest");
var UserService = {
    userReq: function (json) {
        var deferred = new Promise(function (resolve, reject) {
            AllRequest.POST(json).then(function (res) {
                resolve(res);
            })
        })
        return deferred;
    }
}