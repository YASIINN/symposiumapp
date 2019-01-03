jQuery.sap.require("symposiumapp.Servicejs.MailService");
jQuery.sap.require("symposiumapp.Application.Register.RegisterServicejs.RegisterService");
sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/m/Dialog', 'sap/m/MessageToast', 'sap/m/Button', 'sap/m/Text', 'sap/m/MessageBox'], function (Controller, JSONModel, Dialog, MessageToast, Button, Text, MessageBox) {
    "use strict";
    var myControl = Controller.extend("symposiumapp.Application.Forget.controller.Forget", {
        onInit: function () {
            var _this = this;
            _this.getView().setModel(oModel);
        },
        sendpass: function () {
            var _this = this
            if (_this.byId("emailinp").getValue().trim() == "") {
                sap.m.MessageToast.show("Please fill in your email address");
            } else if (!CreateComponent.validateemail(_this.byId("emailinp").getValue())) {
                sap.m.MessageToast.show("Invalid email address");
            }
            else {
                CreateComponent.showBusyIndicator()
                UserService.userReq({ MN: "GET", SN: "User", "where": "ulgnname=?", param: [_this.byId("emailinp").getValue()] }).then(function (res) {
                    if (res[0].status == "Okey") {
                        var msgg = "<html><body>";
                        msgg += "<b>Your Password</b>";
                        msgg += "<br>";
                        msgg += res[0].axp;
                        msgg += "<br>";
                        msgg += "<b>Your User Name</b>";
                        msgg += "<br>";
                        msgg += res[0].ulgnname;
                        msgg += "</body></html>";
                        PluginService.getPlugin({MN:"sendmail",
                            SN:"MailService",
                            hostname:oModel.oData.generalmail[0].gshostname,
                            mailname:oModel.oData.generalmail[0].gsmname,
                            mpassword:oModel.oData.generalmail[0].gsmpass,
                            subjectm:"Forget Password",
                            messagem:msgg,
                            maildata:_this.byId("emailinp").getValue()
                        }).then(function (res) {
                            if (res == "None") {
                                CreateComponent.hideBusyIndicator();
                                sap.m.MessageToast.show("sorry there was a mistake when sending mail");
                            } else {
                                CreateComponent.hideBusyIndicator();
                                sap.m.MessageToast.show("your password has been sent to your email address, please check your email address");
                                _this.byId("emailinp").setValue()
                                window.open("#/Login" + "", "_self");
                            }
                        })
                   /*     MailService.AddMail({ systemcheck: [], "maildata": [{ "mail": _this.byId("emailinp").getValue(), "messega": msgg, subject: "Forget Password" }] }).then(function (res) {
                            if (res == "None") {
                                CreateComponent.hideBusyIndicator();
                                sap.m.MessageToast.show("sorry there was a mistake when sending mail");
                            } else {
                                CreateComponent.hideBusyIndicator();
                                sap.m.MessageToast.show("your password has been sent to your email address, please check your email address");
                                _this.byId("emailinp").setValue()
                                window.open("#/Login" + "", "_self");
                            }
                        })*/
                    } else {
                        CreateComponent.hideBusyIndicator();
                        sap.m.MessageToast.show("User not found")
                    }
                })
            }
        }
    });
    return myControl;
});