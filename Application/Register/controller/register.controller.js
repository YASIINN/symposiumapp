sap.ui.define(['sap/m/MessageBox', 'sap/ui/core/mvc/Controller'], function (MessageBox, Controller) {
    "use strict";
    var PageController = Controller.extend("symposiumapp.Application.Register.controller.Register", {
        onInit: function () {
            var _this = this;
            _this.getView().setModel(oModel);
            var RegisterData = {
                ufname: "",
                uniorinst: "",
                email: "",
                cemail: "",
                pass: "",
                cpass: ""
            }
            _this.RefreshCaptcha();
            oModel.setProperty("/RegisterModel", RegisterData)
        },
        submitRegister: function () {
            var _this = this
            if (!_this.validateData()) {
                CreateComponent.hideBusyIndicator();
            } else {

            }
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
            if (!CreateComponent.validateemail(oModel.oData.RegisterModel.email) || !CreateComponent.validateemail(oModel.oData.RegisterModel.cemail)) {
                sap.m.MessageToast.show("Invalid e-mail address");
            } else
                if (oModel.oData.RegisterModel.email != oModel.oData.RegisterModel.cemail) {
                    sap.m.MessageToast.show("email addresses do not match");
                } else
                    if (oModel.oData.RegisterModel.pass.trim().length < 8 || oModel.oData.RegisterModel.cpass.trim().length < 8) {
                        sap.m.MessageToast.show("Please enter at least 8 characters");
                    } else
                        if (oModel.oData.RegisterModel.pass.trim() != oModel.oData.RegisterModel.cpass.trim()) {
                            sap.m.MessageToast.show("passwords do not match");
                        } 
                             else if (_this.byId("cpt").getValue().trim() == "") {
                                sap.m.MessageToast.show(" please enter the verification code")
                                oModel.setProperty("/Captcha", _this.makeid());
                            } else if (oModel.oData.Captcha != "" || _this.byId("cpt").getValue()) {
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
            RegisterService.RegisterReq({ "MN": "GET", where: "rtsno=? OR rttcno=?", param: [parseInt(oModel.oData.RegisterModel.ogrno), oModel.oData.RegisterModel.tcno], SN: "Register" }).then(function (res) {
                if (res == "None") {
                    _this.onRegister();
                } else {
                    sap.m.MessageToast.show("Öğreni Numarası Veya Tc Kimlik No Geçersiz")
                }
            })
        },
        onRegister: function () {
            CreateComponent.showBusyIndicator();
            var _this = this
            if (!_this.validateData()) {
                CreateComponent.hideBusyIndicator();
            } else {
                //     var oRouter = sap.ui.core.UIComponent.getRouterFor(_this);
                //     oModel.oData.RegisterModel.sid = _this.byId("sections").getSelectedKey();
                //     oModel.oData.RegisterModel.ogrno = parseInt(oModel.oData.RegisterModel.ogrno)
                //     RegisterService.RegisterReq({ MN: "ADD", SN: "Register", registerdata: [oModel.oData.RegisterModel] }).then(function (res) {
                //         RegisterService.RegisterReq({ "where": 'rtrcode=?', param: [res[0].activationkey], "MN": "GET", "SN": "Register" }).then(function (res) {
                //             oModel.setProperty("/userRegister", res);
                //             oModel.setProperty("/RegisterModel", [])
                //             var msg = "Aktivitasyon kodu :" + oModel.oData.userRegister[0].rtrcode + "Kaydınız Onaylandıktan Sonra Size Mail İle Bildirim Yapılacaktır.";
                //             MailService.AddMail({ "maildata": [{ "mail": oModel.oData.userRegister[0].rtemail, "messega": msg }] }).then(function (res) {
                //                 if (res == "None") {
                //                     resolve(false);
                //                     sap.m.MessageToast.show("Mail Gönderilirken Bir Hata Oluştu");
                //                 } else {
                //                     CreateComponent.hideBusyIndicator();
                //                     oRouter.navTo("RegisterCheck")
                //                 }
                //             })
                //         })
                //     })
                // }
            }
        }

    });
    return PageController;
});