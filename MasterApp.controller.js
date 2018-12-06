sap.ui.define(['sap/ui/core/mvc/Controller', "sap/ui/model/resource/ResourceModel", 'sap/m/MessageBox'], function(Controller, ResourceModel, MessageBox) {
    "use strict";
    var myControl = Controller.extend("symposiumapp.MasterApp", {
        onInit: function() {
            var i18nModel = new ResourceModel({
                bundleName: "symposiumapp.i18n.i18n"
            });
            this.getView().setModel(i18nModel, "i18n");
            sap.ui.getCore().setModel(i18nModel, "i18n");

        },
        
    });
    return myControl;
});