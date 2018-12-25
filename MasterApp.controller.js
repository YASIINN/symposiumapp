jQuery.sap.require("symposiumapp.Servicejs.PluginsService");
jQuery.sap.require("symposiumapp.Application.ManagementPanel.ManageAllSettings.GeneralsettingsService.generalsettings");
sap.ui.define(['sap/ui/core/mvc/Controller', "sap/ui/model/resource/ResourceModel", 'sap/m/MessageBox'], function (Controller, ResourceModel, MessageBox) {
    "use strict";
    var myControl = Controller.extend("symposiumapp.MasterApp", {
        onInit: function () {
            PluginService.getPlugin({ SN: "HeaderSettings", MN: "GET" }).then(function (res) {
                oModel.setProperty("/headerset", res)
            })
            PluginService.getPlugin({MN:"GET",SN:"ProformaImg"}).then(function (res) {
                oModel.setProperty("/pimages",res);
            })
            generalsettings.gsettingreq({ MN: "GETGSETTİNGS", SN: "GeneralSettings" }).then(function (res) {
                res.forEach(element => {
                    element.gsabsfoldertemp = element.gsabsfoldertemp
                    element.gsftxtfoldertemp = element.gsftxtfoldertemp
                });
                oModel.setProperty("/generalsettings", res);
                CreateComponent.hideBusyIndicator()
            })
            oModel.setProperty("/dvisible",true);
            var i18nModel = new ResourceModel({
                bundleName: "symposiumapp.i18n.i18n"
            });
            this.getView().setModel(i18nModel, "i18n");
            sap.ui.getCore().setModel(i18nModel, "i18n");

        },

    });
    return myControl;
});