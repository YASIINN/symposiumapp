jQuery.sap.require("symposiumapp.ApiRequest.ApiRequset");
jQuery.sap.require("symposiumapp.Servicejs.PluginsService");
sap.ui.define(["sap/ui/core/mvc/Controller"], function (e) {
    "use strict";
    return e.extend("symposiumapp.Application.Dashboard.Home.controller.Home", {
        onInit: function () {
            var _this = this
            var e = this;
            _this.setauthormodel();
            e.getView().setModel(oModel),
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("Dashboard/Home").attachPatternMatched(e.onBeforeShow, e)
        },
        getulke: function () {
            if (localStorage.getItem("country") == null) {
                ApiReq.GET().then(function (res) {
                    oModel.setProperty("/AllCountry", res.map(function (x) {
                        return { name: x.name, key: x.alpha3Code }
                    }))
                    localStorage.setItem("country", JSON.stringify(oModel.oData.AllCountry));
                })
            } else {
                oModel.setProperty("/AllCountry", JSON.parse(localStorage.getItem("country")));
            }
        },
        setauthormodel: function () {
            oModel.setProperty("/author", {
                ufname: "",
                uniorinst: "",
                country: "",
                addres: "",
                email: "",
                phone: ""
            })
        },
        changefile: function (oEvent) {
            oModel.setProperty("/fdata", oEvent.getParameter("files")[0]);
        },
        allResult: function () {
            debugger
            var form_data=new FormData();
            form_data.append('id',"yasin");//id - text'den gönder
            form_data.append('file',oModel.oData.fdata);//d

            $.ajax({
                type: "POST",
                url: "/symposiumapp/MailService/tesst.php",
                processData: false,
                contentType: false,
                data:form_data,
                success: function (data, status, xhr) {
                    if (!data.length) {
                        resolve(data.status);
                    } else {
                        resolve(data);
                    }
                },
                error: function (data, status, xhr) {
                    resolve("")
                }
            });
        },
        uservalidate: function () {
            var _this = this
            _this.byId("pnmbr").getValue()
            if (oModel.oData.author.ufname.trim() == "") {
                sap.m.MessageToast.show("please fill in the first and last name fields");
            } else if (oModel.oData.author.ufname.split(" ")[0].length < 3) {
                sap.m.MessageToast.show("your name cannot be less than 3 characters");
            } else if (oModel.oData.author.ufname.split(" ")[1] == undefined) {
                sap.m.MessageToast.show("please enter a name after your name and enter your last name");
            } else if (oModel.oData.author.ufname.split(" ")[1].length < 3) {
                sap.m.MessageToast.show("your last name cannot be less than 3 characters");
            }
            else if (oModel.oData.author.uniorinst.trim() == "") {
                sap.m.MessageToast.show("Please fill the field of university or institute");
            } else if (_this.byId("countryall").getSelectedKey().trim() == "") {
                sap.m.MessageToast.show("please fill in the country field");
            } else if (oModel.oData.author.addres.trim() == "") {
                sap.m.MessageToast.show("please fill in the Address field");
            }
            else if (!CreateComponent.validateemail(oModel.oData.author.email)) {
                sap.m.MessageToast.show("Invalid e-mail address");
            } else if (_this.byId("pnmbr").getValue().split("_")[0].trim() == "") {
                sap.m.MessageToast.show("please fill in the phone field");
            } else {
                _this.getuser();
            }
        },
        getuser: function () {
            debugger
            UserService.userReq({ MN: "GET", SN: "User", "where": "ulgnname=?", param: [oModel.oData.author.email] }).then(function (res) {
                if (res == "None") {
                    _this.adduser();
                } else {
                    _this.setuser();
                }
            })
        },
        setuser: function () {

        },
        adduser: function () {

        },
        getPosition: function () {
            PluginService.getPlugin({ SN: "Title", MN: "GETTİTLE" }).then(function (res) {
                oModel.setProperty("/title", res)
            })
        },
        onBeforeShow: function () {
            var _this = this
            UseronLogin.onLogin().then(function (e) {
                _this.getulke();
                _this.getPosition();
            })
        }
    })
});