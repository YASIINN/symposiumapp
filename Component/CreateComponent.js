CreateComponent = {
    showBusyIndicator: function (_this, createId, iDelay) {
        iDelay = iDelay == null ? 0 : iDelay;
        if (createId) {
            var multiInput = sap.ui.getCore().byId(createId);
            if (_this) {
                multiInput = _this.getView().byId(createId);
            }
            multiInput.setBusyIndicatorDelay(iDelay);
            multiInput.setBusy(true);
        } else sap.ui.core.BusyIndicator.show(iDelay);
    },
    hideBusyIndicator: function (_this, createId) {
        if (createId) {
            var multiInput = sap.ui.getCore().byId(createId);
            if (_this) {
                multiInput = _this.getView().byId(createId);
            }
            multiInput.setBusy(false);
        } else sap.ui.core.BusyIndicator.hide();
    },
    validateemail: function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    urlParse: function(value, type) {
        var dizi = [];
        var param = value.split('&');
        param.forEach(function(row, index) {
            if (row.indexOf("=") > 0) {
                var value = row.split('=');
     
                    dizi.push({
                        PropertyName: value[0],
                        Operation: value[1].split(",").length > 1 ? "IN" : "EQ",
                        PropertyValue: value[1]
                    })
                
            } else if (row.indexOf("<") > 0) {
                var value = row.split('<');
                dizi.push({
                    PropertyName: value[0],
                    Operation: "LT",
                    PropertyValue: value[1]
                })
            } else if (row.indexOf(">") > 0) {
                var value = row.split('>');
                dizi.push({
                    PropertyName: value[0],
                    Operation: "GT",
                    PropertyValue: value[1]
                })
            } else if (row.indexOf("%") > 0) {
                var value = row.split('%');
                dizi.push({
                    PropertyName: value[0],
                    Operation: "CT",
                    PropertyValue: value[1]
                })
            } else if (row.indexOf("!") > 0) {
                var value = row.split('!');
                if (type == "N") {
                    value[1] = parseFloat(value[1])
                }
            }
        })
        return dizi;
    }
}