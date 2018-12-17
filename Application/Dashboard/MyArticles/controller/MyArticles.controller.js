jQuery.sap.require("symposiumapp.Application.Dashboard.Home.folderservice.folder");
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.autbrorelation.autbrorelation");
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.broadcastservice.broadcast");
sap.ui.define(["sap/ui/core/mvc/Controller", 'sap/m/MessageBox'], function (e, MessageBox) {
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
            const usid = oModel.getProperty(oEvent.oSource._getBindingContext().sPath).usid;
            CreateComponent.showBusyIndicator(_this, "artaut")
            RelationService.relationreq({ MN: "GET", SN: "Relation", where: "usid=?", param: oModel.getProperty(oEvent.oSource._getBindingContext().sPath).usid }).then(function (res) {
                if (res.length < 2) {
                    _this.deluser(usid)
                } else {
                    _this.delauthor(usid)
                }
            })
        },
        delbroadcast: function (oEvent) {
            var _this = this
            const data = oModel.getProperty(oEvent.oSource._getBindingContext().sPath);
            MessageBox.warning(
                "Are you sure you want to delete this article.",
                {
                    title: "Information",
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    styleClass: "sapUiSizeCompact",
                    initialFocus: MessageBox.Action.CANCEL,
                    onClose: function (sAction) {
                        if (sAction == "OK") {
                            _this.delbroadcastsystem(data);
                        }
                    }
                }
            );
        },
        delbroadcastsystem: function (data) {
            var _this = this
            var form_data = new FormData();
            form_data.append('SN', "File");
            form_data.append('MN', "DEL");
            form_data.append('fname', data.bcfname + data.bcext);
            form_data.append('where', "bcfid=?");
            form_data.append('param', data.bcfid);
            folderservice.folderreq(form_data).then(function (res) {
                if (res.status == "SuccesDel") {
                    _this.dousertransaction(data);
                } else {
                    CreateComponent.hideBusyIndicator()
                }
            })
        },
        dousertransaction: function (data) {
            var _this = this
            if (data.abtype == "2") {
                oModel.oData.UserModel[0].absquota = (parseInt(oModel.oData.UserModel[0].absquota) - 1).toString()
            } else {
                oModel.oData.UserModel[0].ftextquota = (parseInt(oModel.oData.UserModel[0].ftextquota) - 1).toString()
            }
            var userdata = [{
                usname: oModel.oData.UserModel[0].usname,
                uslname: oModel.oData.UserModel[0].uslname,
                uauth: oModel.oData.UserModel[0].uauth,
                uniorinst: oModel.oData.UserModel[0].uniorinst,
                ulgnname: oModel.oData.UserModel[0].ulgnname,
                country: oModel.oData.UserModel[0].country,
                tid: oModel.oData.UserModel[0].tid,
                adress: oModel.oData.author.addres,
                ftextquota: oModel.oData.UserModel[0].ftextquota,
                absquota: oModel.oData.UserModel[0].absquota,
                mainaut: oModel.oData.UserModel[0].mainaut
            }]
            UserService.userReq({ MN: "SET", SN: "User", where: "usid=?", userdata: userdata, param: oModel.oData.UserModel[0].usid }).then(function (res) {
                if (res == "SuccedUpdate") {
                    _this.deluserauthors(data);

                } else {
                    sap.m.MessageToast.show("an unexpected error has occurred please try again later");
                }
            })
        },
        deluserauthors: function (oEvent) {
            var _this = this

            debugger
            broadcastService.broadcastreq({
                MN: "GET", SN: "Broadcast", "where": "u.mainaut=? AND b.btid=?", param: ["0", oModel.getProperty(oEvent.oSource._getBindingContext().sPath).btid]
            }).then(function (res) {
                if (res == "None") {
                 
                } else {
                    debugger
                }
            })
        },
        delauthor: function (usid) {
            var _this = this
            RelationService.relationreq({ MN: "DEL", SN: "Relation", where: "usid=?", param: usid }).then(function (res) {
                if (res == "SuccesDel") {
                    sap.m.MessageToast.show("deletion took place successfully");
                    CreateComponent.hideBusyIndicator(_this, "artaut")
                } else {
                    CreateComponent.hideBusyIndicator(_this, "artaut")
                }
            })
        },
        deluser: function (usid) {
            var _this = this
            UserService.userReq({ MN: "DEL", SN: "User", where: "usid=?", param: usid }).then(function (res) {
                if (res == "SuccesDel") {
                    _this.delauthor(usid);
                } else {
                    sap.m.MessageToast.show("an unexpected error has occurred please try again later");
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
                var startdate = new Date(moment(oModel.oData.generalsettings[0].gsbegdt, "DD.MM.YYYY"))
                var enddate = new Date(moment(oModel.oData.generalsettings[0].gsenddt, "DD.MM.YYYY"))
                var nowdate = new Date();
                if (startdate < nowdate && startdate < enddate) {
                    _this.getMyArticles();
                    _this.byId("delautid").setVisible(true);
                }
                else {
                    _this.getMyArticles();
                    _this.byId("delautid").setVisible(false);
                }
            })
        }
    })
});