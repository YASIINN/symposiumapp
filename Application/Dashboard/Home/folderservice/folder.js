var folderservice = {
    folderreq: function (form_data) {
        var deferred = new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "/symposiumapp/AllService/ServiceReq.php",
                processData: false,
                contentType: false,
                data: form_data,
                success: function (data, status, xhr) {
                        resolve(data);
                },
                error: function (data, status, xhr) {
                    resolve("")
                }
            });
        })
        return deferred
    }
}