var AllRequest = {
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
                type: "POST",
                url: "/symposiumapp/Mailservice/ServiceReq.php",
                datatype: 'application/json',
                data: json,
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
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
    }
}