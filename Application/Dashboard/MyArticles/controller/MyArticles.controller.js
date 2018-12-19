jQuery.sap.require("symposiumapp.Application.Dashboard.Home.broadcastservice.broadcast");
jQuery.sap.require("symposiumapp.Servicejs.PluginsService");
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.folderservice.folder");
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.autbrorelation.autbrorelation");
jQuery.sap.require("symposiumapp.ApiRequest.ApiRequset");
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
                            _this.deluserauthors(data);
                        }
                    }
                }
            );
        },
        deluserauthors: function (data) {
            CreateComponent.showBusyIndicator();
            var _this = this
            var pdata = data
            broadcastService.broadcastreq({
                MN: "GET", SN: "Broadcast", "where": "u.mainaut=? AND b.btid=?", param: ["0", pdata.btid]
            }).then(function (res) {
                if (res != "None") {
                    var users = _.groupBy(res, "usid");
                    var usid = Object.keys(users);
                    var wheres = ""; var param = ""
                    for (let index = 0; index < usid.length; index++) {
                        if (index == usid.length - 1) {
                            param += "'" + usid[index] + "'"
                        } else {
                            param += "'" + usid[index] + "'" + ","
                        }
                    }
                    wheres = "usid IN(" + param + ")";
                    RelationService.relationreq({ MN: "GETW", SN: "Relation", where: wheres }).then(function (res) {
                        if (res != "None") {
                            var delrecod = res.filter(function (x) {
                                return x.cusid == "1"
                            });
                            param = ""
                            for (let index = 0; index < delrecod.length; index++) {
                                if (index == delrecod.length - 1) {
                                    param += "'" + delrecod[index].usid + "'"
                                } else {
                                    param += "'" + delrecod[index].usid + "'" + ","
                                }
                            }
                            wheres = "";
                            wheres = "usid IN(" + param + ")";
                            UserService.userReq({ MN: "DEL", SN: "User", where: wheres }).then(function (res) {
                                if (res == "SuccesDel") {
                                    CreateComponent.hideBusyIndicator()
                                    _this.delbroadcastsystem(data);
                                } else {
                                    CreateComponent.hideBusyIndicator()
                                    sap.m.MessageToast.show("an unexpected error has occurred please try again later");
                                }
                            })
                        } else {
                            CreateComponent.hideBusyIndicator()
                        }
                    })
                } else if (res == "None") {
                    CreateComponent.hideBusyIndicator()
                    _this.delbroadcastsystem(data);

                } else {
                    CreateComponent.hideBusyIndicator()
                }
            })
        },
        delbroadcastsystem: function (data) {
            CreateComponent.showBusyIndicator()
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
            var usersetdata = [{
                usname: oModel.oData.UserModel[0].usname,
                uslname: oModel.oData.UserModel[0].uslname,
                uauth: oModel.oData.UserModel[0].uauth,
                uniorinst: oModel.oData.UserModel[0].uniorinst,
                ulgnname: oModel.oData.UserModel[0].ulgnname,
                country: oModel.oData.UserModel[0].country,
                tid: oModel.oData.UserModel[0].tid,
                adress: oModel.oData.UserModel[0].adress,
                ftextquota: oModel.oData.UserModel[0].ftextquota,
                absquota: oModel.oData.UserModel[0].absquota,
                mainaut: oModel.oData.UserModel[0].mainaut
            }]
            UserService.userReq({ MN: "SET", SN: "User", where: "usid=?", userdata: usersetdata, param: oModel.oData.UserModel[0].usid }).then(function (res) {
                if (res == "SuccedUpdate") {
                    sap.m.MessageToast.show("deletion took place successfully");
                    _this.getMyArticles();

                } else {
                    CreateComponent.hideBusyIndicator()
                    sap.m.MessageToast.show("an unexpected error has occurred please try again later");
                }
            })
        },
        gettopics: function () {
            PluginService.getPlugin({ SN: "Topics", MN: "GETTOPİC" }).then(function (res) {
                oModel.setProperty("/topics", res)
            })
        },
        BroadcastType: function () {
            PluginService.getPlugin({ SN: "BroadcastType", MN: "GETTYPE" }).then(function (res) {
                oModel.setProperty("/btype", res)
            })
        },
        articleset: function (oEvent) {
            var _this = this
            var otable = _this.byId("idProductsTable")
            if (otable.getSelectedItems().length != "1") {
                sap.m.MessageToast.show("Selected record not found please select a record");
            } else {
                _this.gettopics();
                _this.BroadcastType();
                var sdata = oModel.getProperty(otable.getSelectedContextPaths()[0])
                var editpaneldialog = new sap.m.Dialog(
                    {
                        contentWidth: "50%",
                        contentHeight: "30%",
                        stretchOnPhone: true,
                        showCloseButton: true,
                        beforeClose: function () {
                            if (sap.ui.getCore().byId("subjectall")) {
                                sap.ui.getCore().byId("subjectall").destroy();

                            }
                            if (sap.ui.getCore().byId("postitle")) {
                                sap.ui.getCore().byId("postitle").destroy();

                            }
                            if (sap.ui.getCore().byId("countryall")) {
                                sap.ui.getCore().byId("countryall").destroy();

                            }
                            if (sap.ui.getCore().byId("postitle")) {
                                sap.ui.getCore().byId("postitle").destroy();

                            }
                            if (sap.ui.getCore().byId("aname")) {
                                sap.ui.getCore().byId("aname").destroy()
                            }
                            _this.getMyArticles();
                        }
                    }).addStyleClass("dialogHasFooter sapUiNoMargin  sapUiSizeCompact sapUiResponsiveContentPadding")
                var bar = new sap.m.Bar({});
                var oSelect = new sap.m.Select("postitle", {
                    forceSelection: false, width: "100%",
                    selectedKey: sdata.abtype,
                });
                oSelect.bindItems("/btype",
                    new sap.ui.core.Item({
                        key: "{absid}",
                        text: "{abstxt}"
                    })
                );
                var oSelect2 = new sap.m.Select("countryall", {
                    forceSelection: false, width: "100%",
                    selectedKey: sdata.absid,
                    items: [
                        new sap.ui.core.Item({
                            key: "1",
                            text: "ORAL"
                        }),
                        new sap.ui.core.Item({
                            key: "2",
                            text: "POSTER",
                        })
                    ]
                });
                var oSelect3 = new sap.m.Select("subjectall", {
                    forceSelection: false, width: "100%",
                    selectedKey: sdata.brdsubject,
                });
                oSelect3.bindItems("/topics",
                    new sap.ui.core.Item({
                        key: "{tptxt}",
                        text: "{tptxt}"
                    })
                );
                bar.addContentMiddle(new sap.m.HBox({
                    alignItems: sap.m.FlexAlignItems.Center,
                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                    items: [
                        new sap.m.Text(
                            {
                                text: "EDİT ARTİCLES",
                                width: "150px"
                            }).addStyleClass("sapUiSmallMarginBegin")
                    ]
                }).addStyleClass("sapUiNoMargin"))
                bar.addContentRight(
                    new sap.m.Button({
                        icon: "sap-icon://sys-cancel",
                        text: "Kapat",
                        type: "Transparent",
                        press: function () {
                            editpaneldialog.close();
                        }
                    }).addStyleClass("sapUiNoMargin"))
                var panelarea = new sap.m.HBox({
                    width: "100%",
                    height: "100%",
                    alignItems: sap.m.FlexAlignItems.Stretch,
                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                    items: [
                        new sap.m.VBox({
                            width: "100%",
                            height: "100%",
                            alignItems: sap.m.FlexAlignItems.Stretch,
                            justifyContent: sap.m.FlexJustifyContent.Stretch,
                            items: [
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Article Name",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            alignItems: sap.m.FlexAlignItems.Stretch,
                                            justifyContent: sap.m.FlexJustifyContent.Stretch,
                                            items: [
                                                new sap.m.Input("aname", {
                                                    width: "100%",
                                                    value: sdata.brdcastname
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Subject",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            items: [
                                                oSelect3
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Article Type",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            alignItems: sap.m.FlexAlignItems.Stretch,
                                            justifyContent: sap.m.FlexJustifyContent.Stretch,
                                            items: [
                                                oSelect
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Presentation Type",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            items: [
                                                oSelect2
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Result",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            alignItems: sap.m.FlexAlignItems.Stretch,
                                            justifyContent: sap.m.FlexJustifyContent.Center,
                                            items: [
                                                new sap.m.Button({
                                                    text: "Save Changes",
                                                    press: function () {
                                                        debugger
                                                        if (sap.ui.getCore().byId("aname").getValue().trim() == "") {
                                                            sap.m.MessageToast.show("Please fill article name field")
                                                        } else {
                                                            var updatedata = [{
                                                                brdcastname: sap.ui.getCore().byId("aname").getValue(),
                                                                brdsubject: sap.ui.getCore().byId("subjectall").getSelectedKey(),
                                                                brdcasttype: sap.ui.getCore().byId("countryall").getSelectedKey(),
                                                                abtype: sap.ui.getCore().byId("postitle").getSelectedKey(),
                                                                fileid: sdata.fileid
                                                            }]

                                                            //user güncellenecek
                                                            broadcastService.broadcastreq({
                                                                MN: "SET", SN: "Broadcast", data: updatedata, where: "btid=?", param: sdata.btid
                                                            }).then(function (res) {
                                                                if (res == "SuccedUpdate") {
                                                                    editpaneldialog.close();
                                                                    // _this.addauthorsuser(res[0].btid);
                                                                } else {
                                                                    editpaneldialog.close();
                                                                    CreateComponent.hideBusyIndicator()
                                                                }
                                                            })



                                                        }

                                                    }
                                                })

                                            ]
                                        })
                                    ]
                                }),
                            ]
                        }),
                    ]
                });
                editpaneldialog.addContent(panelarea);
                editpaneldialog.setCustomHeader(bar);
                editpaneldialog.open(_this);
            }
        },
        getupdateauthors: function (param) {
            /*
            var id = param.btid
            broadcastService.broadcastreq({
                MN: "GET", SN: "Broadcast", "where": "u.mainaut=? AND b.btid=?", param: ["0", id]
            }).then(function (res) {
                if (res == "None") {
                    oModel.setProperty("/updateauth", []);
                    CreateComponent.hideBusyIndicator()
                } else {
                    oModel.setProperty("/updateauth", res);
                    CreateComponent.hideBusyIndicator()
                }
            })*/
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
        getPosition: function () {
            PluginService.getPlugin({ SN: "Title", MN: "GETTİTLE" }).then(function (res) {
                oModel.setProperty("/title", res)
            })
        },
        authorset: function (oEvent) {
            /*
            var _this = this
            var otable = _this.byId("idProductsTable")
            if (otable.getSelectedItems().length != "1") {
                sap.m.MessageToast.show("Selected record not found please select a record");
            } else {
                _this.getcountry();
                _this.getPosition();
                var sdata = oModel.getProperty(otable.getSelectedContextPaths()[0])
                _this.getupdateauthors(sdata)
                if (sap.ui.getCore().byId("subjectall")) {
                    sap.ui.getCore().byId("subjectall").destroy()
                }
                if (sap.ui.getCore().byId("postitle")) {
                    sap.ui.getCore().byId("postitle").destroy();
                }
                if (sap.ui.getCore().byId("countryall")) {
                    sap.ui.getCore().byId("countryall").destroy();
                }
                if (sap.ui.getCore().byId("pnmbr")) {
                    sap.ui.getCore().byId("pnmbr").destroy();

                }
                if (sap.ui.getCore().byId("suname")) {
                    sap.ui.getCore().byId("suname").destroy();
                }
                if (sap.ui.getCore().byId("ulname")) {
                    sap.ui.getCore().byId("ulname").destroy();
                }
                if (sap.ui.getCore().byId("suni")) {
                    sap.ui.getCore().byId("suni").destroy();
                }
                if (sap.ui.getCore().byId("semail")) {
                    sap.ui.getCore().byId("semail").destroy();
                }
                if (sap.ui.getCore().byId("sadres")) {
                    sap.ui.getCore().byId("sadres").destroy();
                }
                var editpaneldialog = new sap.m.Dialog(
                    {
                        contentWidth: "50%",
                        contentHeight: "70%",
                        stretchOnPhone: true,
                        showCloseButton: true,
                        beforeClose: function () {
                            if (sap.ui.getCore().byId("subjectall")) {
                                sap.ui.getCore().byId("subjectall").destroy()
                            }
                            if (sap.ui.getCore().byId("postitle")) {
                                sap.ui.getCore().byId("postitle").setSelectedKey("")
                                sap.ui.getCore().byId("postitle").destroy();
                            }
                            if (sap.ui.getCore().byId("countryall")) {
                                sap.ui.getCore().byId("countryall").setSelectedKey("")
                                sap.ui.getCore().byId("countryall").destroy();
                            }
                            if (sap.ui.getCore().byId("pnmbr")) {
                                sap.ui.getCore().byId("pnmbr").setValue("")
                                sap.ui.getCore().byId("pnmbr").destroy();
                            }
                            if (sap.ui.getCore().byId("suname")) {
                                sap.ui.getCore().byId("suname").setValue("")
                                sap.ui.getCore().byId("suname").destroy();
                            }
                            if (sap.ui.getCore().byId("ulname")) {
                                sap.ui.getCore().byId("ulname").setValue("")
                                sap.ui.getCore().byId("ulname").destroy();
                            }
                            if (sap.ui.getCore().byId("suni")) {
                                sap.ui.getCore().byId("suni").setValue("")
                                sap.ui.getCore().byId("suni").destroy();
                            }
                            if (sap.ui.getCore().byId("semail")) {
                                sap.ui.getCore().byId("semail").setValue("")
                                sap.ui.getCore().byId("semail").destroy();
                            }
                            if (sap.ui.getCore().byId("sadres")) {
                                sap.ui.getCore().byId("sadres").setValue("")
                                sap.ui.getCore().byId("sadres").destroy();
                            }
                        }
                    }).addStyleClass("dialogHasFooter sapUiNoMargin  sapUiSizeCompact sapUiResponsiveContentPadding")
                var bar = new sap.m.Bar({});
                var oSelect = new sap.m.Select("postitle", { forceSelection: false, width: "100%" });
                oSelect.bindItems("/title",
                    new sap.ui.core.Item({
                        key: "{tid}",
                        text: "{titletxt}"
                    })
                );
                var oSelect2 = new sap.m.Select("countryall", {
                    forceSelection: false, width: "100%", showSecondaryValues: true,
                    selectedKey: oModel.oData.setuser == undefined ? "" : oModel.oData.setuser.country
                });
                oSelect2.bindItems("/AllCountry",
                    new sap.ui.core.ListItem({
                        additionalText: "{key}",
                        key: "{key}",
                        text: "{name}"
                    })
                );
                var oSelect3 = new sap.m.Select("subjectall", {
                    forceSelection: false, width: "100%",
                    change: function (oEvent) {
                        var data = oEvent.getParameters("binding").selectedItem.mBindingInfos.text.binding.oContext.sPath;
                        oModel.setProperty("/setuser", oModel.getProperty(data));
                        sap.ui.getCore().byId("suname").setValue(oModel.oData.setuser.usname)
                        sap.ui.getCore().byId("ulname").setValue(oModel.oData.setuser.uslname)
                        sap.ui.getCore().byId("suni").setValue(oModel.oData.setuser.uniorinst)
                        sap.ui.getCore().byId("semail").setValue(oModel.oData.setuser.ulgnname)
                        sap.ui.getCore().byId("pnmbr").setValue(oModel.oData.setuser.pnmbr)
                        sap.ui.getCore().byId("sadres").setValue(oModel.oData.setuser.adress)
                        sap.ui.getCore().byId("postitle").setSelectedKey(oModel.oData.setuser.tid)
                        sap.ui.getCore().byId("countryall").setSelectedKey(oModel.oData.setuser.country)
                    }
                });
                oSelect3.bindItems("/updateauth",
                    new sap.ui.core.Item({
                        key: "{usid}",
                        text: "{ulgnname}"
                    })
                );
                bar.addContentMiddle(new sap.m.HBox({
                    alignItems: sap.m.FlexAlignItems.Center,
                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                    items: [
                        new sap.m.Text(
                            {
                                text: "EDİT ARTİCLES AUTHOR'S",
                                width: "150px"
                            }).addStyleClass("sapUiSmallMarginBegin")
                    ]
                }).addStyleClass("sapUiNoMargin"))
                bar.addContentRight(
                    new sap.m.Button({
                        icon: "sap-icon://sys-cancel",
                        text: "Kapat",
                        type: "Transparent",
                        press: function () {
                            editpaneldialog.close();
                        }
                    }).addStyleClass("sapUiNoMargin"))
                var panelarea = new sap.m.HBox({
                    width: "100%",
                    height: "100%",
                    alignItems: sap.m.FlexAlignItems.Stretch,
                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                    items: [
                        new sap.m.VBox({
                            width: "100%",
                            height: "100%",
                            alignItems: sap.m.FlexAlignItems.Stretch,
                            justifyContent: sap.m.FlexJustifyContent.Stretch,
                            items: [
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Select Author",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            items: [
                                                oSelect3
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "User Name",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            alignItems: sap.m.FlexAlignItems.Stretch,
                                            justifyContent: sap.m.FlexJustifyContent.Stretch,
                                            items: [
                                                new sap.m.Input("suname", {
                                                    value: oModel.oData.setuser == undefined ? "" : oModel.oData.setuser.usname,
                                                    width: "100%"
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "User LastName",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            items: [
                                                new sap.m.Input("ulname", {
                                                    value: oModel.oData.setuser == undefined ? "" : oModel.oData.setuser.uslname,
                                                    width: "100%"
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Unıversity/Inst.",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            items: [
                                                new sap.m.Input("suni", {
                                                    value: oModel.oData.setuser == undefined ? "" : oModel.oData.setuser.uniorinst,
                                                    width: "100%"
                                                })
                                            ]
                                        })
                                    ]
                                }),

                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "E-mail",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            items: [
                                                new sap.m.Input("semail", {
                                                    value: oModel.oData.setuser == undefined ? "" : oModel.oData.setuser.ulgnname,
                                                    width: "100%"
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Phone",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            items: [
                                                new sap.m.MaskInput("pnmbr", {
                                                    mask: "+CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
                                                    rules: new sap.m.MaskInputRule({
                                                        maskFormatSymbol: "C",
                                                        regex: "[A-Z0-9]"
                                                    }),
                                                    placeholder: "Enter Phone number",
                                                    width: "100%"
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Address",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            items: [
                                                new sap.m.TextArea("sadres", {
                                                    value: oModel.oData.setuser == undefined ? "" : oModel.oData.setuser.adress,
                                                    rows: 4,
                                                    width: "100%"
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Position / Title",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            items: [
                                                oSelect
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Country",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            items: [
                                                oSelect2
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Result",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            alignItems: sap.m.FlexAlignItems.Stretch,
                                            justifyContent: sap.m.FlexJustifyContent.Center,
                                            items: [
                                                new sap.m.Button({
                                                    text: "Save Change's",
                                                    press: function () {
                                                        if (sap.ui.getCore().byId("suname").getValue().trim() == "" || sap.ui.getCore().byId("suname").getValue().length < 3) {
                                                            sap.m.MessageToast.show("Please fill in the name field")
                                                        } else if (sap.ui.getCore().byId("ulname").getValue().trim() == "" || sap.ui.getCore().byId("ulname").getValue().length < 3) {
                                                            sap.m.MessageToast.show("Please fill in the surname field")
                                                        } else if (sap.ui.getCore().byId("suni").getValue().trim() == "") {
                                                            sap.m.MessageToast.show("fill the university institute area")
                                                        } else if (!CreateComponent.validateemail(sap.ui.getCore().byId("semail").getValue().trim())) {
                                                            sap.m.MessageToast.show("invalid email address")
                                                        } else if (sap.ui.getCore().byId("pnmbr").getValue().trim() == "") {
                                                            sap.m.MessageToast.show("fill in the phone number field")
                                                        } else if (sap.ui.getCore().byId("sadres").getValue().trim() == "") {
                                                            sap.m.MessageToast.show("fill in the address field")
                                                        } else {
                                                            CreateComponent.showBusyIndicator()
                                                            var userdata = [{
                                                                "usname": sap.ui.getCore().byId("suname").getValue(),
                                                                "uslname": sap.ui.getCore().byId("ulname").getValue(),
                                                                "uauth": oModel.oData.setuser.uauth,
                                                                "uniorinst": sap.ui.getCore().byId("suni").getValue(),
                                                                "ulgnname": sap.ui.getCore().byId("semail").getValue(),
                                                                "country": sap.ui.getCore().byId("countryall").getSelectedKey(),
                                                                "tid": sap.ui.getCore().byId("postitle").getSelectedKey() == "" ? "1" : sap.ui.getCore().byId("postitle").getSelectedKey(),
                                                                "adress": sap.ui.getCore().byId("sadres").getValue(),
                                                                "ftextquota": oModel.oData.setuser.ftextquota,
                                                                "absquota": oModel.oData.setuser.absquota,
                                                                "mainaut": oModel.oData.setuser.mainaut,
                                                            }]
                                                            UserService.userReq({ MN: "SET", SN: "User", where: "usid=?", userdata: userdata, param: oModel.oData.setuser.usid }).then(function (res) {
                                                                if (res == "SuccedUpdate") {
                                                                    var maildata = [{
                                                                        "mail": sap.ui.getCore().byId("semail").getValue(),
                                                                        "uid": oModel.oData.setuser.usid
                                                                    }]
                                                                    PluginService.getPlugin({ SN: "UserMail", MN: "SETMAİL", data: maildata, where: "uid=?", param: oModel.oData.setuser.usid }).then(function (res) {
                                                                        oModel.setProperty("/topics", res)
                                                                        if (res == "SuccedUpdate") {
                                                                            var phonedata = [{
                                                                                pnmbr: sap.ui.getCore().byId("pnmbr").getValue(),
                                                                                uid: oModel.oData.setuser.usid
                                                                            }]
                                                                            PluginService.getPlugin({ SN: "Phone", MN: "SET", data: phonedata, where: "uid=?", param: oModel.oData.setuser.usid }).then(function (res) {
                                                                                if (res == "SuccedUpdate") {
                                                                                    CreateComponent.hideBusyIndicator()
                                                                                    sap.ui.getCore().byId("suname").setValue("")
                                                                                    sap.ui.getCore().byId("ulname").setValue("")
                                                                                    sap.ui.getCore().byId("suni").setValue("")
                                                                                    sap.ui.getCore().byId("semail").setValue("")
                                                                                    sap.ui.getCore().byId("pnmbr").setValue("")
                                                                                    sap.ui.getCore().byId("sadres").setValue("")
                                                                                    sap.ui.getCore().byId("postitle").setSelectedKey("")
                                                                                    sap.ui.getCore().byId("countryall").setSelectedKey("")
                                                                                    sap.ui.getCore().byId("subjectall").setSelectedKey("")
                                                                                    sap.m.MessageToast.show("Your update has been successfully completed")
                                                                                    _this.getupdateauthors(sdata)
                                                                                } else {
                                                                                    CreateComponent.hideBusyIndicator()
                                                                                    sap.m.MessageToast.show("an unexpected error has occurred please try again later")
                                                                                }
                                                                            })
                                                                        } else {
                                                                            CreateComponent.hideBusyIndicator()
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
                                                })

                                            ]
                                        })
                                    ]
                                }),

                            ]
                        }),
                    ]
                });
                editpaneldialog.addContent(panelarea);
                editpaneldialog.setCustomHeader(bar);
                editpaneldialog.open(_this);
            }*/
        },
        fileset: function (oEvent) {
            var _this = this
            var otable = _this.byId("idProductsTable")
            if (otable.getSelectedItems().length != "1") {
                sap.m.MessageToast.show("Selected record not found please select a record");
            } else {
                var sdata = oModel.getProperty(otable.getSelectedContextPaths()[0])
                var editfiledialog = new sap.m.Dialog(
                    {
                        contentWidth: "38%",
                        contentHeight: "20%",
                        stretchOnPhone: true,
                        showCloseButton: true,
                        beforeClose: function () {
                            _this.getMyArticles();
                            if (sap.ui.getCore().byId("nfile")) {
                                sap.ui.getCore().byId("nfile").destroy();
                            }
                            delete oModel.oData.nfdata;
                        }
                    }).addStyleClass("dialogHasFooter sapUiNoMargin  sapUiSizeCompact sapUiResponsiveContentPadding")
                var bar = new sap.m.Bar({});
                bar.addContentMiddle(new sap.m.HBox({
                    alignItems: sap.m.FlexAlignItems.Center,
                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                    items: [
                        new sap.m.Text(
                            {
                                text: "EDİT ARTİCLE FİLES",
                                width: "150px"
                            }).addStyleClass("sapUiSmallMarginBegin")
                    ]
                }).addStyleClass("sapUiNoMargin"))
                bar.addContentRight(
                    new sap.m.Button({
                        icon: "sap-icon://sys-cancel",
                        text: "Kapat",
                        type: "Transparent",
                        press: function () {
                            editfiledialog.close();
                        }
                    }).addStyleClass("sapUiNoMargin"))
                var panelarea = new sap.m.HBox({
                    width: "100%",
                    height: "100%",
                    alignItems: sap.m.FlexAlignItems.Stretch,
                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                    items: [
                        new sap.m.VBox({
                            width: "100%",
                            height: "100%",
                            alignItems: sap.m.FlexAlignItems.Stretch,
                            justifyContent: sap.m.FlexJustifyContent.Stretch,
                            items: [
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Your File",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            alignItems: sap.m.FlexAlignItems.Stretch,
                                            justifyContent: sap.m.FlexJustifyContent.Stretch,
                                            items: [
                                                new sap.m.Link({
                                                    text: sdata.bcfname,
                                                    href: "/symposiumapp" + sdata.bcfpath,
                                                    target: sdata.fileid
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "File",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            items: [
                                                new sap.m.HBox({
                                                    width: "100%",
                                                    items: [
                                                        new sap.ui.unified.FileUploader("nfile", {
                                                            change: function (oEvent) {
                                                                oModel.setProperty("/nfdata", oEvent.getParameter("files")[0]);
                                                            },
                                                            fileType: "docx,doc"

                                                        }),

                                                    ]
                                                })

                                            ]
                                        })
                                    ]
                                }),
                                new sap.m.HBox({
                                    width: "100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Label({
                                            text: "Result",
                                            width: "130px"
                                        }),
                                        new sap.m.Label({
                                            text: ":",
                                            width: "10px"
                                        }),
                                        new sap.m.VBox({
                                            width: "100%",
                                            alignItems: sap.m.FlexAlignItems.Stretch,
                                            justifyContent: sap.m.FlexJustifyContent.Center,
                                            items: [
                                                new sap.m.Button({
                                                    text: "Save New Files",
                                                    press: function () {
                                                        CreateComponent.showBusyIndicator();
                                                        if (oModel.oData.nfdata == undefined) {
                                                            sap.m.MessageToast.show("your update has been successful");
                                                            editfiledialog.close();
                                                        } else {
                                                            var form_data = new FormData();
                                                            form_data.append('usid', oModel.oData.UserModel[0].usid);
                                                            form_data.append('file', oModel.oData.nfdata);
                                                            form_data.append('SN', "File");
                                                            form_data.append('MN', "SET");
                                                            form_data.append('size', oModel.oData.nfdata["size"]);
                                                            form_data.append('fileext', oModel.oData.nfdata["name"].split(".")[1]);
                                                            form_data.append('type', oModel.oData.nfdata["type"]);
                                                            form_data.append("bcext", oModel.oData.nfdata.name.slice(oModel.oData.nfdata.name.lastIndexOf(".")));
                                                            form_data.append("delfile", sdata.bcfname + sdata.bcext);
                                                            form_data.append("where", "bcfid=?");
                                                            form_data.append("param", sdata.bcfid);
                                                            folderservice.folderreq(form_data).then(function (res) {
                                                                if (res == "SuccedUpdate") {
                                                                    sap.m.MessageToast.show("your update has been successful");
                                                                    CreateComponent.hideBusyIndicator();
                                                                    editfiledialog.close();

                                                                } else {
                                                                    sap.m.MessageToast.show("an unexpected error please try again later");
                                                                    CreateComponent.hideBusyIndicator()
                                                                    editfiledialog.close();
                                                                }
                                                            })
                                                        }
                                                    }
                                                })

                                            ]
                                        })
                                    ]
                                }),

                            ]
                        }),
                    ]
                });
                editfiledialog.addContent(panelarea);
                editfiledialog.setCustomHeader(bar);
                editfiledialog.open(_this);
            }
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
            /*
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
            })*/
        },
        onBeforeShow: function () {
            var _this = this
            UseronLogin.onLogin().then(function (e) {
                _this.byId("artcancel").setVisible(false);
                _this.byId("artaut").setVisible(false);
                _this.byId("idProductsTable").removeSelections(true);
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