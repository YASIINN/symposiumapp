jQuery.sap.require("symposiumapp.Application.ManagementPanel.ManageAllSettings.GeneralsettingsService.generalsettings");
sap.ui.define(['sap/ui/core/mvc/Controller', "sap/ui/model/resource/ResourceModel", 'sap/m/MessageBox'], function(Controller, ResourceModel, MessageBox) {
    "use strict";
    var myControl = Controller.extend("symposiumapp.MasterApp", {
        onInit: function() {
                generalsettings.gsettingreq({ MN: "GETGSETTİNGS", SN: "GeneralSettings" }).then(function (res) {
                    res.forEach(element => {
                        element.gsabsfoldertemp = element.gsabsfoldertemp
                        element.gsftxtfoldertemp = element.gsftxtfoldertemp
                    });
                    oModel.setProperty("/generalsettings", res);
                    CreateComponent.hideBusyIndicator()
                })
            var i18nModel = new ResourceModel({
                bundleName: "symposiumapp.i18n.i18n"
            });
            this.getView().setModel(i18nModel, "i18n");
            sap.ui.getCore().setModel(i18nModel, "i18n");

        },
        
    });
    return myControl;
});