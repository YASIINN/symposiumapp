sap.ui.define(['sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/m/Dialog', 'sap/m/MessageToast', 'sap/m/Button', 'sap/m/Text', 'sap/m/GroupHeaderListItem', 'sap/viz/ui5/core/BaseChart'], function (Controller, JSONModel, Dialog, MessageToast, Button, Text, GroupHeaderListItem, BaseChart) {
    "use strict";
    var myControl = Controller.extend("symposiumapp.Application.Login.controller.Login", {
        onInit: function () {
            var _this = this;
            oModel.setProperty("/dvisible",true);
            _this.getView().setModel(oModel);
            var UserModel = {
                name: "",
                pass: ""
            }
            oModel.setProperty("/UserModel", UserModel);
        },
        gowm:function(){
            window.open(oModel.oData.headerset[0].hslink)
            },
        onPress: function () {
            var _this = this;
            if (_this.checkValidate()[0] == false && _this.checkValidate()[1] == "blank") {
                sap.m.MessageToast.show("User Name or Password Field cannot be blank");
            }
            else if (_this.checkValidate()[0] == false && _this.checkValidate()[1] == "length") {
                sap.m.MessageToast.show("User Name or Password field cannot be less than 3 characters.");
            }
            else {
                var data = {
                    name: oModel.oData.UserModel.name,
                    pass:oModel.oData.UserModel.pass,
                    MN: "LG",
                    SN: "Login"
                }
                UseronLogin.onLoginControl(data).then(function (res) {
                    if (res == true) {
                        _this.onLogin();
                    }
                })
            }
        },
        checkValidate: function () {
            var result = [false, ""]
            if (oModel.oData.UserModel.pass.trim() == "" || oModel.oData.UserModel.name.trim() == "") {
                result = [false, "blank"];
            } else if (oModel.oData.UserModel.pass.length < 3 || oModel.oData.UserModel.name.trim().length < 3) {
                result = [false, "length"];
            }
            else {
                result = [true, "validate"]
            }
            return result;
        },
        onLogin: function () {
            var _this = this
            if (oModel.oData.UserModel) {
                window.location.reload();
            window.open("#/Dashboard/Home" + "", "_self");
            }
        },
        goforget:function(){
            window.open("#/Forget" + "", "_blank");
        },
        createaccount: function (oEvent) {
            var url = oEvent.getSource().data("url");
            if (url) {
                window.open("#/" + url)
            } else {
                window.open(" ");
            }
        }

    });
    return myControl;
});