jQuery.sap.require("symposiumapp.Application.ManagementPanel.ManageAllSettings.GeneralSetFolderService.generalsetfolder");
jQuery.sap.require("symposiumapp.Application.ManagementPanel.ManageAllSettings.GeneralsettingsService.generalsettings");
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
            this.getView().byId('fileuploadftext').oBrowse.mProperties.text = "Browse"
            this.getView().byId('fileUploader').oBrowse.mProperties.text = "Browse"
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
            folderservice.folderreq(form_data).then(function (res) {
                if (res.status == "SuccesAdd") {
                    _this.addbroadcast(res.fid, _this.byId("absid").getSelectedKey());
                } else {
                    CreateComponent.hideBusyIndicator()
                }
            })
        },
        addbroadcast: function (file, key) {
            var _this = this
            if (key == "2") {
                broadcastService.broadcastreq({
                    MN: "ADD", SN: "Broadcast", broadcastdata: [{
                        brdcastname: _this.byId("titleid").getValue(),
                        brdsubject: _this.byId("topicid").getSelectedItem().mProperties.text,
                        abtype: key,
                        brdcasttype: _this.byId("oralid").getSelected() == true ? "1" : "2",
                        fileid: file
                    }]
                }).then(function (res) {
                    if (res[0].status == "SuccesAdd") {
                        _this.addauthorsuser(res[0].btid);
                    } else {
                        CreateComponent.hideBusyIndicator()
                    }
                })
            } else if (key == "1") {
                broadcastService.broadcastreq({
                    MN: "ADD", SN: "Broadcast", broadcastdata: [{
                        brdcastname: _this.byId("fttid").getValue(),
                        brdsubject: _this.byId("fttopicid").getSelectedItem().mProperties.text,
                        abtype: key,
                        brdcasttype: _this.byId("ftoid").getSelected() == true ? "1" : "2",
                        fileid: file
                    }]
                }).then(function (res) {
                    if (res[0].status == "SuccesAdd") {
                        _this.addauthorsuser(res[0].btid);
                    } else {
                        CreateComponent.hideBusyIndicator()
                    }
                })
            }
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
                    if (res[0].status == "Okey") {
                        for (let index = 0; index < authors.length; index++) {
                            for (let j = 0; j < res.length; j++) {
                                if (authors[index].mail == res[j].mail) {
                                    authors.splice(index, 1);
                                }
                            }

                        }
                        UserService.userReq({ MN: "ADD", SN: "User", userdata: authors }).then(function (res) {
                            if (res[0].status == "SuccesAdd") {
                                _this.onRelationAuthorsBroadcast(true, btid, param);
                            } else {
                                CreateComponent.hideBusyIndicator()
                            }
                        })
                    }
                    else {
                        authors = oModel.oData.authorsuser
                        UserService.userReq({ MN: "ADD", SN: "User", userdata: authors }).then(function (res) {
                            if (res[0].status == "SuccesAdd") {
                                _this.onRelationAuthorsBroadcast(true, btid, param);
                            } else {
                                CreateComponent.hideBusyIndicator()
                            }
                        })
                    }
                })
            } else {
                _this.onRelationAuthorsBroadcast(false, btid);
            }
        },
        onRelationAuthorsBroadcast: function (result, btid, param) {
            var _this = this
            if (result) {
                var relation;
                UserService.userReq({ MN: "GET", SN: "User", "where": "ulgnname IN" + "(" + param + ")" }).then(function (res) {
                    if (res[0].status == "Okey") {
                        relation = res.map(function (x) {
                            return { usid: x.usid, btid: btid }
                        })
                        relation.push({
                            usid: oModel.oData.UserModel[0].usid,
                            btid: btid
                        })
                        RelationService.relationreq({ MN: "ADD", SN: "Relation", data: relation }).then(function (res) {
                            if (res == "SuccesAdd") {
                                switch (_this.byId("absid").getSelectedKey()) {
                                    case "1":
                                        oModel.oData.UserModel[0].ftextquota = (parseInt(oModel.oData.UserModel[0].ftextquota) + 1).toString()
                                        _this.onsetinfo("quota");
                                        break;

                                    case "2":
                                        oModel.oData.UserModel[0].absquota = (parseInt(oModel.oData.UserModel[0].absquota) + 1).toString()
                                        _this.onsetinfo("quota");
                                        break;
                                }
                            } else {
                                CreateComponent.hideBusyIndicator()
                            }

                        })
                    } else {
                        CreateComponent.hideBusyIndicator()
                    }
                })
            } else {
                RelationService.relationreq({
                    MN: "ADD", SN: "Relation", data: [{
                        usid: oModel.oData.UserModel[0].usid,
                        btid: btid
                    }]
                }).then(function (res) {
                    if (res == "SuccesAdd") {
                        switch (_this.byId("absid").getSelectedKey()) {
                            case "1":
                                oModel.oData.UserModel[0].ftextquota = (parseInt(oModel.oData.UserModel[0].ftextquota) + 1).toString()
                                _this.onsetinfo("quota");
                                break;

                            case "2":
                                oModel.oData.UserModel[0].absquota = (parseInt(oModel.oData.UserModel[0].absquota) + 1).toString()
                                _this.onsetinfo("quota");
                                break;
                        }
                    } else {
                        CreateComponent.hideBusyIndicator()
                    }
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
        onsetinfo: function (qouta) {
            CreateComponent.showBusyIndicator()
            var _this = this
            var userdata = [{
                usname: oModel.oData.UserModel[0].usname,
                uslname: oModel.oData.UserModel[0].uslname,
                uauth: oModel.oData.UserModel[0].uauth,
                uniorinst: oModel.oData.UserModel[0].uniorinst,
                ulgnname: oModel.oData.UserModel[0].ulgnname,
                country: oModel.oData.UserModel[0].country == "" ? _this.byId("countryallset").getSelectedKey() : oModel.oData.UserModel[0].country,
                tid: oModel.oData.UserModel[0].tid == "" ? _this.byId("settitle").getSelectedKey() == "" ? "1" : _this.byId("settitle").getSelectedKey() : oModel.oData.UserModel[0].tid,
                adress: oModel.oData.author.addres,
                ftextquota: oModel.oData.UserModel[0].ftextquota,
                absquota: oModel.oData.UserModel[0].absquota,
                mainaut: oModel.oData.UserModel[0].mainaut
            }]
            if (qouta) {
                UserService.userReq({ MN: "SET", SN: "User", where: "usid=?", userdata: userdata, param: oModel.oData.UserModel[0].usid }).then(function (res) {
                    if (res == "SuccedUpdate") {
                        sap.m.MessageToast.show("Your Transaction Took Place With Success");
                        delete oModel.oData.authorsuser
                        oModel.setProperty("/fdata",[])
                        _this.byId("titleid").setValue("");
                        _this.byId("oralid").setSelected(false)
                        _this.byId("posterid").setSelected(false)
                        _this.byId("topicid").setSelectedKey("");
                        _this.byId("fileUploader").setValue(' ');
                        oModel.setProperty("/authorsuser", []);
                        CreateComponent.hideBusyIndicator()
                    } else {
                        CreateComponent.hideBusyIndicator()
                        sap.m.MessageToast.show("an unexpected error has occurred please try again later")
                    }
                })

            } else {
                if (!_this.byId("countryallset").getSelectedKey()) {
                    sap.m.MessageToast.show("please fill in the country field");
                }
                else if (oModel.oData.author.addres.trim() == "") {
                    sap.m.MessageToast.show("please fill in the Address field");
                } else if (_this.byId("pnmbrset").getValue().trim() == "") {
                    sap.m.MessageToast.show("please fill in the Phone field");
                } else {
                    UserService.userReq({ MN: "SET", SN: "User", where: "usid=?", userdata: userdata, param: oModel.oData.UserModel[0].usid }).then(function (res) {
                        if (res == "SuccedUpdate") {
                            PluginService.getPlugin({
                                SN: "Phone", MN: "ADD", pdata: [{
                                    pnmbr: oModel.oData.UserModel[0].pnmbr == "" ? _this.byId("pnmbrset").getValue() : oModel.oData.UserModel[0].pnmbr,
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
                            CreateComponent.hideBusyIndicator()
                            sap.m.MessageToast.show("an unexpected error has occurred please try again later")
                        }
                    })
                }



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
            CreateComponent.showBusyIndicator()
            var _this = this
            if (_this.byId("titleid").getValue().trim() == "") {
                CreateComponent.hideBusyIndicator()
                sap.m.MessageToast.show("please fill in the Title field");
            } else if (_this.byId("oralid").getSelected() == false && _this.byId("posterid").getSelected() == false) {
                CreateComponent.hideBusyIndicator()
                sap.m.MessageToast.show("please fill in the  Presentation Type field");
            } else if (_this.byId("topicid").getSelectedKey() == "") {
                CreateComponent.hideBusyIndicator()
                sap.m.MessageToast.show("please fill in the Topic field");
            }
            else {
                _this.addfile();
            }
        },
        fulltextvalidate: function () {
            CreateComponent.showBusyIndicator()
            var _this = this
            if (_this.byId("fttid").getValue().trim() == "") {
                CreateComponent.hideBusyIndicator()
                sap.m.MessageToast.show("please fill in the Title field");
            } else if (_this.byId("ftoid").getSelected() == false && _this.byId("ftpstrid").getSelected() == false) {
                CreateComponent.hideBusyIndicator()
                sap.m.MessageToast.show("please fill in the  Presentation Type field");
            } else if (_this.byId("fttopicid").getSelectedKey() == "") {
                CreateComponent.hideBusyIndicator()
                sap.m.MessageToast.show("please fill in the Topic field");
            }
            else {
                _this.addfile();
            }
        },
        changetype: function (oEvent) {
            var _this = this
            switch (oEvent.oSource.getSelectedKey()) {
                case "2":
                    _this.byId("fileuploadftext").setValue(' ');
                    delete oModel.oData.authorsuser
                    delete oModel.oData.fdata
                    oModel.refresh();
                    _this.byId("panel3").setVisible(false)
                    _this.byId("panel2").setVisible(true)
                    _this.byId("footerinfo").setVisible(false)
                    _this.getgeneralsettingsfolder("2");
                    break;
                case "1":
                    _this.byId("fileUploader").setValue(' ');
                    delete oModel.oData.authorsuser
                    delete oModel.oData.fdata
                    oModel.refresh();
                    _this.byId("panel2").setVisible(false)
                    _this.byId("panel3").setVisible(true)
                    _this.byId("footerinfo").setVisible(true)
                    _this.getgeneralsettingsfolder("1");
                    break;
            }
        },
        addauthors: function () {
            var _this = this
            jQuery.sap.require("symposiumapp.Application.Dashboard.authorspanel.controller.authorspanel");
            authorpanel.open(this)
        },
        BroadcastType: function () {
            PluginService.getPlugin({ SN: "BroadcastType", MN: "GETTYPE" }).then(function (res) {
                oModel.setProperty("/btype", res)
            })
        },
        gettopics: function () {
            PluginService.getPlugin({ SN: "Topics", MN: "GETTOPİC" }).then(function (res) {
                oModel.setProperty("/topics", res)
            })
        },
        getgeneralsettings: function (oEvent) {
            generalsettings.gsettingreq({ MN: "GETGSETTİNGS", SN: "GeneralSettings" }).then(function (res) {
                res.forEach(element => {
                    element.gsabsfoldertemp = element.gsabsfoldertemp
                    element.gsftxtfoldertemp = element.gsftxtfoldertemp
                });
                oModel.setProperty("/generalsettings", res);

                CreateComponent.hideBusyIndicator()
            })
        },
        getgeneralsettingsfolder: function (data) {
            gsetfolder.gsetfolderreq({ MN: "GETWHERE", SN: "GeneralSetFolder", where: "gsfabstype=?", param: data }).then(function (res) {
                oModel.setProperty("/gtfolder", res);
            })
        },
        onBeforeShow: function () {
            var _this = this
            UseronLogin.onLogin().then(function (e) {
                _this.gettopics();
                _this.checkfirslogin();
                _this.getcountry();
                _this.getPosition();
                _this.BroadcastType();
                _this.getgeneralsettings();
            })
        }
    })
});