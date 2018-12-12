jQuery.sap.require("symposiumapp.ApiRequest.ApiRequset");
jQuery.sap.require("symposiumapp.Servicejs.PluginsService");
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.folderservice.folder");
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.broadcastservice.broadcast");
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.autbrorelation.autbrorelation");
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
        getcountry: function () {
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
        addfile: function () {
            var _this = this
            var form_data = new FormData();
            form_data.append('usid', oModel.oData.UserModel[0].usid);
            form_data.append('file', oModel.oData.fdata);
            form_data.append('SN', "File");
            form_data.append('MN', "ADD");
            form_data.append('size', oModel.oData.fdata["size"]);
            form_data.append('fileext', oModel.oData.fdata["name"].split(".")[1]);
            form_data.append('type', oModel.oData.fdata["type"]);
            debugger
            folderservice.folderreq(form_data).then(function (res) {
                if (res.status == "SuccesAdd") {
                    _this.addbroadcast(res.fid);
                } else {

                }
            })
        },
        addbroadcast: function (file) {
            var _this = this
            broadcastService.broadcastreq({
                MN: "ADD", SN: "Broadcast", broadcastdata: [{
                    brdcastname: _this.byId("titleid").getValue(),
                    brdsubject: _this.byId("topicid").getSelectedKey(),
                    abtype: _this.byId("absid").getSelectedKey(),
                    brdcasttype: _this.byId("oralid").getSelected() == true ? "1" : "2",
                    fileid: file
                }]
            }).then(function (res) {
                if (res[0].status == "SuccesAdd") {
                    _this.addauthorsuser(res[0].btid);
                } else {

                }
            })
        },
        addauthorsuser: function (btid) {
            var _this = this
            var param = "";
            if (oModel.oData.authorsuser && oModel.oData.authorsuser.length) {
                var authors = JSON.parse(JSON.stringify(oModel.oData.authorsuser));
                for (let index = 0; index < oModel.oData.authorsuser.length; index++) {
                    if (index == oModel.oData.authorsuser.length - 1) {
                        param += "'" + oModel.oData.authorsuser[index].mail + "'"
                    } else {
                        param += "'" + oModel.oData.authorsuser[index].mail + "'" + ","
                    }
                }
                PluginService.getPlugin({ MN: "GETMAİL", SN: "UserMail", where: "mail IN" + "(" + param + ")" }).then(function (res) {
                    if (res.length) {
                        for (let index = 0; index < authors.length; index++) {
                            for (let j = 0; j < res.length; j++) {
                                if (authors[index].mail == res[j].mail) {
                                    authors.splice(index, 1);
                                }
                            }

                        }
                        UserService.userReq({ MN: "ADD", SN: "User", userdata: authors }).then(function (res) {
                            if (res[0].status == "SuccesAdd") {
                                _this.onRelationAuthorsBroadcast(true, btid);
                            } else {

                            }
                        })
                    }
                    else {
                        authors = oModel.oData.authorsuser
                        UserService.userReq({ MN: "ADD", SN: "User", userdata: authors }).then(function (res) {
                            if (res[0].status == "SuccesAdd") {
                                _this.onRelationAuthorsBroadcast(true, btid);
                            } else {

                            }
                        })
                    }
                })

            } else {
                _this.onRelationAuthorsBroadcast(false, btid);
            }
        },
        onRelationAuthorsBroadcast: function (result, btid) {
            if (result) {
                RelationService.relationreq().then(function (res) {
                    debugger
                })

            } else {
                debugger
                RelationService.relationreq({
                    MN: "ADD", SN: "Relation", data: [{
                        usid: oModel.oData.UserModel[0].usid,
                        btid: btid
                    }]
                }).then(function (res) {
                    debugger
                })
            }

        },
        getuser: function () {
            UserService.userReq({ MN: "GET", SN: "User", "where": "ulgnname=?", param: [oModel.oData.author.email] }).then(function (res) {
                if (res == "None") {
                    _this.adduser();
                } else {
                    _this.setuser();
                }
            })
        },
        onsetinfo: function () {
            var _this = this
            if (!_this.byId("countryallset").getSelectedKey()) {
                sap.m.MessageToast.show("please fill in the country field");
            }
            else if (oModel.oData.author.addres.trim() == "") {
                sap.m.MessageToast.show("please fill in the Address field");
            } else if (_this.byId("pnmbrset").getValue().trim() == "") {
                sap.m.MessageToast.show("please fill in the Phone field");
            }
            else {
                var userdata = [{
                    country: _this.byId("countryallset").getSelectedKey(),
                    tid: _this.byId("settitle").getSelectedKey() == "" ? "1" : _this.byId("settitle").getSelectedKey(),
                    adress: oModel.oData.author.addres
                }]
                UserService.userReq({ MN: "SET", SN: "User", where: "usid=?", userdata: userdata, param: oModel.oData.UserModel[0].usid }).then(function (res) {
                    if (res == "SuccedUpdate") {
                        PluginService.getPlugin({
                            SN: "Phone", MN: "ADD", pdata: [{
                                pnmbr: _this.byId("pnmbrset").getValue(),
                                uid: oModel.oData.UserModel[0].usid
                            }]
                        }).then(function (res) {
                            if (res == "SuccesAdd") {
                                _this.byId("panel0").setVisible(false)
                                _this.byId("panel1").setVisible(true)
                                _this.byId("panel2").setVisible(true)
                                _this.byId("panel3").setVisible(true)
                                _this.byId("footerinfo").setVisible(true)
                                sap.m.MessageToast.show("Thank you created your information")
                            } else {
                                sap.m.MessageToast.show("an unexpected error has occurred please try again later")
                            }
                        })
                    } else {
                        sap.m.MessageToast.show("an unexpected error has occurred please try again later")
                    }
                })
            }
        },
        getPosition: function () {
            PluginService.getPlugin({ SN: "Title", MN: "GETTİTLE" }).then(function (res) {
                oModel.setProperty("/title", res)
            })
        },
        checkfirslogin: function () {
            if (oModel.oData.UserModel[0].country.trim() == "") {
                this.byId("panel0").setVisible(true)
                this.byId("panel1").setVisible(false)
                this.byId("panel2").setVisible(false)
                this.byId("panel3").setVisible(false)
                this.byId("footerinfo").setVisible(false)
            } else {
                this.byId("panel0").setVisible(false)
                this.byId("panel1").setVisible(true)
                this.byId("panel2").setVisible(false)
                this.byId("panel3").setVisible(false)
                this.byId("footerinfo").setVisible(false)
            }
        },
        onRemoveAuthors: function (oEvent) {
            if (oEvent.getParameters("type").type == "removed") {
                oModel.oData.authorsuser.splice(oEvent.getParameters("type").removedTokens[0]._getBindingContext().sPath.split("/")[2], 1)
                oModel.setProperty("/authorsuser", oModel.oData.authorsuser);
            }
        },
        abstractvalidate: function () {
            var _this = this
            if (_this.byId("titleid").getValue().trim() == "") {
                sap.m.MessageToast.show("please fill in the Title field");
            } else if (_this.byId("oralid").getSelected() == false && _this.byId("posterid").getSelected() == false) {
                sap.m.MessageToast.show("please fill in the  Presentation Type field");
            } else if (_this.byId("topicid").getSelectedKey() == "") {
                sap.m.MessageToast.show("please fill in the Topic field");
            }
            else {
                _this.addfile();
            }
        },
        onsaveabstract: function () {
            // titleid oralid posterid topicid specificid
        },
        changetype: function (oEvent) {
            var _this = this
            switch (oEvent.oSource.getSelectedKey()) {
                case "2":
                    _this.byId("panel3").setVisible(false)
                    _this.byId("panel2").setVisible(true)
                    _this.byId("footerinfo").setVisible(true)
                    break;
                case "1":
                    _this.byId("panel2").setVisible(false)
                    _this.byId("panel3").setVisible(true)
                    _this.byId("footerinfo").setVisible(true)
                    break;
            }
        },
        addauthors: function () {
            var _this = this
            debugger
            jQuery.sap.require("symposiumapp.Application.Dashboard.authorspanel.controller.authorspanel");
            authorpanel.open(this)
        },
        BroadcastType: function () {
            PluginService.getPlugin({ SN: "BroadcastType", MN: "GETTYPE" }).then(function (res) {
                oModel.setProperty("/btype", res)
            })
        },
        onBeforeShow: function () {
            var _this = this
            UseronLogin.onLogin().then(function (e) {
                _this.checkfirslogin();
                _this.getcountry();
                _this.getPosition();
                _this.BroadcastType();
            })
        }
    })
});