var ApiReq = {
    POST: function (json) {
        var deferred = new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/symposiumapp/AllService/ServiceReq.php",
                datatype: 'application/json',
                data: json,
                success: function (data, status, xhr) {
                    if (!data.length) {
                        resolve(data.status);
                    } else {
                        resolve(data);
                    }
                },
                error: function (data, status, xhr) {
                    resolve("")
                }
            });
        });
        return deferred;
    },
    GET: function (json) {
        var deferred = new Promise(function (resolve, reject) {
            $.ajax({
                 type: "GET",
                     url: "http://restcountries.eu/rest/v2/all",
                success: function (data, status, xhr) {
                    resolve(data)
                },
                error: function (data, status, xhr) {
                    resolve("")
                }
            });
        });
        return deferred;
    }
}