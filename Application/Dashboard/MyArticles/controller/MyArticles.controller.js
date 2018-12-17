jQuery.sap.require("symposiumapp.Servicejs.PluginsService");
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
                            // _this.delbroadcastsystem(data);
                            _this.deluserauthors(data);
                        }
                    }
                }
            );
        },
        editbroad: function (oEvent) {
            debugger
            var _this = this
            var data = oEvent.oSource._getBindingContext().sPath;

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
                                    // sap.m.MessageToast.show("deletion took place successfully");
                                    // _this.getMyArticles();
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
                            // editarray = [];
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
                            // sap.ui.getCore().byId("pnmbr").destroy();
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
                var oSelect3 = new sap.m.Select("subjectall", { forceSelection: false, width: "100%",  
            selectedKey:sdata.brdsubject,
            });
                oSelect3.bindItems("/topics",
                    new sap.ui.core.ListItem({
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
                                                new sap.m.Input({
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
        authorset: function (oEvent) {
            var _this = this
            var otable = _this.byId("idProductsTable")
            if (otable.getSelectedItems().length != "1") {
                sap.m.MessageToast.show("Selected record not found please select a record");
            } else {
                var editpaneldialog = new sap.m.Dialog(
                    {
                        contentWidth: "50%",
                        contentHeight: "55%",
                        stretchOnPhone: true,
                        showCloseButton: true,
                        beforeClose: function () {
                            // editarray = [];
                            sap.ui.getCore().byId("subjectall").destroy();
                            sap.ui.getCore().byId("postitle").destroy();
                            sap.ui.getCore().byId("countryall").destroy();
                            sap.ui.getCore().byId("pnmbr").destroy();
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
                var oSelect2 = new sap.m.Select("countryall", { forceSelection: false, width: "100%", showSecondaryValues: true });
                oSelect2.bindItems("/AllCountry",
                    new sap.ui.core.ListItem({
                        additionalText: "{key}",
                        key: "{key}",
                        text: "{name}"
                    })
                );
                var oSelect3 = new sap.m.Select("subjectall", { forceSelection: false, width: "100%", showSecondaryValues: true });
                oSelect3.bindItems("/AllCountry",
                    new sap.ui.core.ListItem({
                        additionalText: "{key}",
                        key: "{key}",
                        text: "{name}"
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
                                                new sap.m.Input({
                                                    width: "100%",
                                                    value: "{/author/ufname}",
                                                    placeholder: "Please write the corresponding author's Name SURNAME here"
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
                                                        new sap.ui.unified.FileUploader({}),
                                                        new sap.m.Link({
                                                            text: "asdsadsd"

                                                        })
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
                                                new sap.m.Input({
                                                    value: "{/author/email}",
                                                    placeholder: "Please write the e-mail of the corresponding author here",
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
                                                    text: "Save Author's",
                                                    press: function () {

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
                            // editarray = [];
                            // sap.ui.getCore().byId("subjectall").destroy();
                            // sap.ui.getCore().byId("postitle").destroy();
                            // sap.ui.getCore().byId("countryall").destroy();
                            // sap.ui.getCore().byId("pnmbr").destroy();
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
                                                    href:"/symposiumapp"+sdata.bcfpath,
                                                    target:sdata.fileid
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
                                                        new sap.ui.unified.FileUploader({}),

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