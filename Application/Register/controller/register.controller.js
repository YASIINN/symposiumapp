jQuery.sap.require("symposiumapp.Servicejs.PluginsService");
jQuery.sap.require("symposiumapp.Application.Register.RegisterServicejs.RegisterService");
jQuery.sap.require("symposiumapp.Servicejs.MailService");
sap.ui.define(['sap/m/MessageBox', 'sap/ui/core/mvc/Controller'], function (MessageBox, Controller) {
    "use strict";
    var PageController = Controller.extend("symposiumapp.Application.Register.controller.Register", {
        onInit: function () {
            var _this = this;
            _this.getView().setModel(oModel);
            _this.registermodel();
            _this.RefreshCaptcha();
            _this.getmailhead();

        },
        getmailhead:function(){
            PluginService.getPlugin({ SN: "MailHeaderSet", MN: "GET" }).then(function (res) {
                oModel.setProperty("/mhead", res)
                CreateComponent.hideBusyIndicator()
            })
        },
        submitRegister: function () {
            var _this = this
            if (!_this.validateData()) {
                CreateComponent.hideBusyIndicator();
            } else {
                _this.getAllRegister();
            }
        },
        registermodel: function () {
            var _this = this
            var RegisterData = {
                ufname: "",
                ulname:"",
                uniorinst: "",
                email: "",
                cemail: "",
                pass: "",
                cpass: ""
            }
            oModel.setProperty("/RegisterModel", RegisterData)
            _this.byId("cpt").setValue("");
            _this.byId("pnmbrset").setValue("")
        },
        makeid: function () {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        },
        RefreshCaptcha: function () {
            var _this = this
            oModel.setProperty("/Captcha", _this.makeid());
        },
        validateData: function () {
            var _this = this
            var result = false
            if (oModel.oData.RegisterModel.ufname.trim() == "") {
                sap.m.MessageToast.show("please fill in the first and last name fields");
            } else if (oModel.oData.RegisterModel.ufname.trim()=="") {
                sap.m.MessageToast.show("your name cannot be less than 3 characters");
            } else if(oModel.oData.RegisterModel.ulname.trim()==""){
                sap.m.MessageToast.show("your surname cannot be less than 3 characters");
            }
            else if (oModel.oData.RegisterModel.uniorinst.trim() == "") {
                sap.m.MessageToast.show("Please fill the field of university or institute");
            }
            else if (!CreateComponent.validateemail(oModel.oData.RegisterModel.email) || !CreateComponent.validateemail(oModel.oData.RegisterModel.cemail)) {
                sap.m.MessageToast.show("Invalid e-mail address");
            } else
                if (oModel.oData.RegisterModel.email != oModel.oData.RegisterModel.cemail) {
                    sap.m.MessageToast.show("email addresses do not match");
                }
                else if (_this.byId("pnmbrset").getValue().trim() == "") {
                    sap.m.MessageToast.show("please fill in the Phone field");
                }
                else
                    if (oModel.oData.RegisterModel.pass.trim().length < 8 || oModel.oData.RegisterModel.cpass.trim().length < 8) {
                        sap.m.MessageToast.show("Please enter at least 8 characters");
                    } else
                        if (oModel.oData.RegisterModel.pass.trim() != oModel.oData.RegisterModel.cpass.trim()) {
                            sap.m.MessageToast.show("passwords do not match");
                        }
                        else if (_this.byId("cpt").getValue().trim() == "") {
                            sap.m.MessageToast.show(" please enter the verification code")
                            oModel.setProperty("/Captcha", _this.makeid());
                        } else if (oModel.oData.Captcha != _this.byId("cpt").getValue()) {
                            sap.m.MessageToast.show("validation code is invalid")
                            oModel.setProperty("/Captcha", _this.makeid());
                            _this.byId("cpt").setValue("")
                        } else {
                            result = true
                        }
            return result;
        },
        getAllRegister: function () {
            var _this = this
            RegisterService.RegisterReq({ MN: "GET", SN: "Register", where: "rtemail=?", param: [oModel.oData.RegisterModel.cemail] }).then(function (res) {
                if (res == "None") {
                    UserService.userReq({ MN: "GET", SN: "User", "where": "ulgnname=?", param: [oModel.oData.RegisterModel.cemail] }).then(function (res) {
                        if (res == "None") {
                            _this.onRegister();
                        } else {
                            sap.m.MessageToast.show("this email address is available")
                        }
                    })
                } else {
                    sap.m.MessageToast.show("this email address is available")
                }
            })
        },
        onRegister: function () {
            CreateComponent.showBusyIndicator();
            var _this = this
            var lcode = md5(_this.makeid())+"%"+ new Date().toLocaleDateString().split(".")[0] + new Date().toLocaleDateString().split(".")[1] + new Date().toLocaleDateString().split(".")[2];
            RegisterService.RegisterReq({
                MN: "ADD", SN: "Register", registerdata: [
                    {
                        rtname: oModel.oData.RegisterModel.ufname.toUpperCase(),
                        rtlname: oModel.oData.RegisterModel.ulname.toUpperCase(),
                        rtemail: oModel.oData.RegisterModel.cemail,
                        rtuniinst: oModel.oData.RegisterModel.uniorinst ,
                        rtpass: oModel.oData.RegisterModel.cpass,
                        rtlcode: lcode,
                        rauth: "2",
                        rphone: _this.byId("pnmbrset").getValue()
                    }
                ]
            }).then(function (res) {
                if (res[0].status == "SuccesAdd") {
                    var host="http://www.worldmcaus.org/symposiumapp/#/Registercheck?";
                    RegisterService.RegisterReq({ MN: "GET", SN: "Register", where: "rtemail=?", param: [oModel.oData.RegisterModel.cemail] }).then(function (res) {
                        if (res[0].rtlcode) {
                            var msgg="<html><body>";
                            msgg+="<b>Thank you for registering for the</b>"+oModel.oData.mhead[0].mhstxt;
                            msgg+="<br>";
                            msgg+="<b>Here is a link to a activate your account.</b>";
                            msgg+="<br>";
                            msgg+=host+res[0].rtlcode ;
                            msgg+="<br>";
                            msgg+="<b>Thank you and looking forward to you</b>";
                            msgg+="<br>";
                            msgg+="<b>WMCAUS.</b>";
                            msgg+="<br>";
                            msgg+="<b>P.S.:Please do not reply.This is an automated-email</b>";
                            msgg+="<br>";
                            msgg+="<hr>";
                            msgg+="<br>";
                            msgg+="<b>In compliance with data protection regulations,please contact the editoral office.if you would like to have your personal information removed from the database.</b>";
                            msgg+="</body></html>";
                            PluginService.getPlugin({MN:"sendmail",
                                SN:"MailService",
                                hostname:oModel.oData.generalmail[0].gshostname,
                                mailname:oModel.oData.generalmail[0].gsmname,
                                mpassword:oModel.oData.generalmail[0].gsmpass,
                                subjectm:"Activation Verification",
                                messagem:msgg,
                                maildata: res[0].rtemail
                            }).then(function (res) {
                                if (res == "None") {
                                    CreateComponent.hideBusyIndicator();
                                    sap.m.MessageToast.show("sorry there was a mistake when sending mail");
                                } else {
                                    CreateComponent.hideBusyIndicator();
                                    _this.registermodel();
                                    sap.m.MessageToast.show("register successful please check your email address");
                                }
                            })
                        } else {
                            CreateComponent.hideBusyIndicator();
                        }
                    })
                } else {
                    sap.m.MessageToast.show("Sorry, there is an error please try again later")
                }
            });
        }

    });
    return PageController;
});