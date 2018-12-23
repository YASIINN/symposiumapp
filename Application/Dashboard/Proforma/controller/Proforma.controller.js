jQuery.sap.require("symposiumapp.Application.ManagementPanel.ManageAllSettings.companyservice.companyservice")
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.broadcastservice.broadcast");
jQuery.sap.require("symposiumapp.Servicejs.PluginsService");
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.folderservice.folder");
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.autbrorelation.autbrorelation");
jQuery.sap.require("symposiumapp.ApiRequest.ApiRequset");
sap.ui.define(["sap/ui/core/mvc/Controller", 'sap/m/MessageBox'], function (e, MessageBox) {
    "use strict";
    return e.extend("symposiumapp.Application.Dashboard.MyArticles.controller.MyArticles", {
        onInit: function () {
            var e = this;
            this.getCompany()
            oModel.setProperty("/dvisible",false);
            e.getView().setModel(oModel),
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("Dashboard/MyArticles").attachPatternMatched(e.onBeforeShow, e)

        },
        getCompany:function(){
            company.companyreq({SN:"Company",MN:"GET"}).then(function (res) {
                CreateComponent.hideBusyIndicator()
                oModel.setProperty("/company",res);
            })
        },
        onBeforeShow: function () {
            var _this = this
            oModel.setProperty("/dvisible",false);
            UseronLogin.onLogin().then(function (e) {
                _this.getCompany()
            })
        }
    })
});