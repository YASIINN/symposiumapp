jQuery.sap.require("symposiumapp.Application.Dashboard.Home.autbrorelation.autbrorelation");
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.broadcastservice.broadcast");
sap.ui.define(["sap/ui/core/mvc/Controller"], function (e) {
    "use strict";
    return e.extend("symposiumapp.Application.Dashboard.MyArticles.controller.MyArticles", {
        onInit: function () {
            var e = this;
            e.getView().setModel(oModel),
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("Dashboard/MyArticles").attachPatternMatched(e.onBeforeShow, e)
        },
        getMyArticles: function () {
            CreateComponent.showBusyIndicator()
            broadcastService.broadcastreq({
                MN: "GET", SN: "Broadcast", "where": "u.usid=? AND u.mainaut=?", param: [oModel.oData.UserModel[0].usid, "1"]
            }).then(function (res) {
                if (res == "None") {
                    oModel.setProperty("/myarticles", []);
                    CreateComponent.hideBusyIndicator()
                } else {
                    oModel.setProperty("/myarticles", res);
                    CreateComponent.hideBusyIndicator()
                }
            })
        },
        closevisible: function () {
            var _this = this
            _this.byId("artaut").setVisible(false);
            _this.byId("artcancel").setVisible(false);
        },
        removeauthor: function (oEvent) {
            var _this = this
            CreateComponent.showBusyIndicator(_this, "artaut")
            RelationService.relationreq({ MN: "DEL", SN: "Relation", where: "usid=?", param: oModel.getProperty(oEvent.oSource._getBindingContext().sPath).usid }).then(function (res) {
                if (res == "SuccesDel") {
                    sap.m.MessageToast.show("deletion took place successfully");
                    CreateComponent.hideBusyIndicator(_this, "artaut")
                } else {
                    CreateComponent.hideBusyIndicator(_this, "artaut")
                }

            })
        },
        showauthors: function (oEvent) {
            var _this = this
            CreateComponent.showBusyIndicator(_this, "artaut")
            _this.byId("artcancel").setVisible(true);
            _this.byId("artaut").setVisible(true);
            var oindex = oEvent.oSource._getBindingContext().sPath
            broadcastService.broadcastreq({
                MN: "GET", SN: "Broadcast", "where": "u.mainaut=? AND b.btid=?", param: ["0", oModel.getProperty(oindex).btid]
            }).then(function (res) {
                if (res == "None") {
                    oModel.setProperty("/artauthors", []);
                    CreateComponent.hideBusyIndicator(_this, "artaut")
                } else {
                    oModel.setProperty("/artauthors", res);
                    CreateComponent.hideBusyIndicator(_this, "artaut")
                }
            })
        },
        onBeforeShow: function () {
            var _this = this
            UseronLogin.onLogin().then(function (e) {
                var startdate = new Date(moment(oModel.oData.generalsettings[0].gsbegdt, "DD-MM-YYYY"))
                var enddate = new Date(moment(oModel.oData.generalsettings[0].gsenddt, "DD-MM-YYYY"))
                var nowdate = new Date();
                if (startdate < nowdate && startdate < enddate) {
                    _this.getMyArticles();
                }
                else {

                    
                }
            })
        }
    })
});