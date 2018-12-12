jQuery.sap.require("symposiumapp.Application.Register.RegisterServicejs.RegisterService");
sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/m/Dialog', 'sap/m/MessageToast', 'sap/m/Button', 'sap/m/Text', 'sap/m/MessageBox'], function (Controller, JSONModel, Dialog, MessageToast, Button, Text, MessageBox) {
    "use strict";
    var myControl = Controller.extend("symposiumapp.Application.RegisterCheck.controller.RegisterCheck", {
        onInit: function () {
            var _this = this;
            _this.getView().setModel(oModel);
            _this.getControl();
        },
        getControl: function () {
            var _this = this;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(_this);
            var day = window.location.hash.split("?")[1].split("_")[1][0] + window.location.hash.split("?")[1].split("_")[1][1];
            if (parseInt(day) + 2 == parseInt(new Date().toLocaleDateString().split(".")[0])) {
                RegisterService.RegisterReq({ MN: "GET", SN: "Register", where: "rtlcode=?", param: [window.location.hash.split("?")[1]] }).then(function (res) {
                    _this.delTemp(res[0].rtlcode);
                })
                setTimeout(function () {
                    MessageBox.warning("sorry this link is now invalid", {
                        icon: MessageBox.Icon.WARNING,
                        title: "Info",
                        actions: [sap.m.MessageBox.Action.OK],
                        styleClass: "sapUiSizeCompact",
                        initialFocus: MessageBox.Action.OK,
                        onClose: function (oAction) {
                            oRouter.navTo("Login")
                        }
                    });
                }, 2000);
            } else {
                RegisterService.RegisterReq({ MN: "GET", SN: "Register", where: "rtlcode=?", param: [window.location.hash.split("?")[1]] }).then(function (res) {
                    if (res[0].rtlcode) {
                        _this.adduser(res);
                    }
                    else {
                        setTimeout(function () {
                            MessageBox.warning("sorry this link is now invalid", {
                                icon: MessageBox.Icon.WARNING,
                                title: "Info",
                                actions: [sap.m.MessageBox.Action.OK],
                                styleClass: "sapUiSizeCompact",
                                initialFocus: MessageBox.Action.OK,
                                onClose: function (oAction) {
                                    oRouter.navTo("Login")
                                }
                            });
                        }, 2000);
                    }
                })
            }
        },
        delTemp: function (param) {
            var _this = this
            var oRouter = sap.ui.core.UIComponent.getRouterFor(_this);
            RegisterService.RegisterReq({ MN: "DEL", SN: "Register", where: "rtlcode=?", param: param }).then(function (res) {
                if (res == "SuccesDel") {
                    oRouter.navTo("Login")
                } else {
                    sap.m.MessageToast.show("Sorry, there is an error please try again later")
                }
            })
        },
        adduser: function (param) {
            var _this = this
            var userData = {
                usname: param[0].rtname,
                uslname: param[0].rtlname,
                uauth: parseInt(param[0].rauth),
                uniorinst: param[0].rtuniinst,
                ulgnname: param[0].rtemail,
                upass: param[0].rtpass,
                mail: param[0].rtemail,
                country: "",
                tid: "1",
                adress: "",
                ftextquota: "0",
                absquota: "0",
                mainaut: "1",
            }
            UserService.userReq({ userdata: [userData], MN: "ADD", SN: "User" }).then(function (res) {
                if (res == "SuccesAdd") {
                    sap.m.MessageToast.show("Registration Successful")
                    _this.delTemp(param[0].rtlcode);
                } else {
                    sap.m.MessageToast.show("Sorry, there is an error please try again later")
                }
            })
        }
    });
    return myControl;
});