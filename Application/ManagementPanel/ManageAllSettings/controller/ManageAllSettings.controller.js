jQuery.sap.require("symposiumapp.Application.Dashboard.Home.folderservice.folder");
jQuery.sap.require("symposiumapp.Servicejs.PluginsService");
jQuery.sap.require("symposiumapp.Application.ManagementPanel.ManageAllSettings.GeneralSetFolderService.generalsetfolder");
jQuery.sap.require("symposiumapp.Application.ManagementPanel.ManageAllSettings.GeneralsettingsService.generalsettings");
jQuery.sap.require("symposiumapp.Application.ManagementPanel.ManageAllSettings.Generalsettingsmail.Generalsettingsmail");
sap.ui.define(["sap/ui/core/mvc/Controller", 'sap/m/MessageBox', 'sap/ui/model/Filter'], function (Controller, MessageBox, Filter) {
    "use strict";
    return Controller.extend("symposiumapp.Application.ManagementPanel.ManageAllSettings.controller.ManageAllSettings", {
        onInit: function () {
            var _this = this;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            _this.getgeneralsettings();
            oRouter.getRoute("ManagementPanel/ManageAllSettings").attachPatternMatched(_this.onBeforeShow, _this);
        },
        getalltopic: function () {
            PluginService.getPlugin({ SN: "Topics", MN: "GETTOPİC" }).then(function (res) {
                oModel.setProperty("/edittopics", res)
                CreateComponent.hideBusyIndicator()
            })
        },
        datecontrol: function (oEvent) {
            var _this = this
            var oDP = oEvent.oSource;
            var sValue = oEvent.getParameter("value");
            var bValid = oEvent.getParameter("valid");
            this._iEvent++;
            if (bValid) oDP.setValueState(sap.ui.core.ValueState.None);
            else oDP.setValueState(sap.ui.core.ValueState.Error);

        },
        setdateenb: function () {
            var _this = this
            _this.byId("savedate").setVisible(!_this.byId("savedate").getVisible())
            _this.byId("DP4").setEnabled(!_this.byId("DP4").getEnabled())
            _this.byId("DP5").setEnabled(!_this.byId("DP5").getEnabled())
        },
        setsysdate: function () {
            var _this = this
            CreateComponent.showBusyIndicator();
            var datedate = [{
                gsbegdt: oModel.oData.generalsettings[0].gsbegdt,
                gsenddt: oModel.oData.generalsettings[0].gsenddt
            }]
            generalsettings.gsettingreq({ MN: "SET", SN: "GeneralSettings", data: datedate, "where": "gsid=?", param: "1" }).then(function (res) {
                if (res == "SuccedUpdate") {
                    sap.m.MessageToast.show("the update process took place successfully")
                    _this.setdateenb();
                    _this.getgeneralsettings();
                    CreateComponent.hideBusyIndicator();
                } else {
                    sap.m.MessageToast.show("an unexpected error has occurred please try again later");
                    CreateComponent.hideBusyIndicator();
                }
            })
        },
        savemailset: function (oEvent) {
            var _this = this
            if (!CreateComponent.validateemail(oModel.oData.mailsett[0].gsmname)) {
                sap.m.MessageToast.show("Invalid e-mail address");
            } else if (oModel.oData.mailsett[0].gsmpass.trim() == "") {
                sap.m.MessageToast.show("password field is invalid");
            } else if (oModel.oData.mailsett[0].gsmpass.trim().length < 8) {
                sap.m.MessageToast.show("password field cannot be less than 8 characters");
            }
            else {
                CreateComponent.showBusyIndicator();
                var maildata = [{
                    gsmname: oModel.oData.mailsett[0].gsmname,
                    gsmpass: oModel.oData.mailsett[0].gsmpass
                }]
                gsetmail.gsetmailreq({ SN: "Generalsetmail", MN: "SET", where: "gsmid=?", data: maildata, param: oModel.oData.mailsett[0].gsmid }).then(function (res) {
                    if (res == "SuccedUpdate") {
                        CreateComponent.hideBusyIndicator();
                        sap.m.MessageToast.show("the update process took place successfully");
                        _this.setidvis();
                        _this.getmail();
                    } else {
                        CreateComponent.hideBusyIndicator();
                    }
                })

            }
        },
        setidvis: function (oEvent) {
            var _this = this
            _this.byId("setidvis").setVisible(!_this.byId("setidvis").getVisible());
        },
        editpasvisible: function (oEvent) {
            var _this = this

        },
        /*
        bu fonksiyon sonra istenilirse yapılacak
        showpas: function (oEvent) {
            var _this = this
            if (_this.byId("mailpasid").getType() == "Text") {
                _this.byId("showid").setIcon("sap-icon://show");
                _this.byId("mailpasid").setType("Password");
            } else {
                _this.byId("showid").setIcon("sap-icon://hide");
                _this.byId("mailpasid").setType("Text");
            }
        },*/
        getmail: function () {
            CreateComponent.showBusyIndicator();
            gsetmail.gsetmailreq({ SN: "Generalsetmail", MN: "GET" }).then(function (res) {
                if (res != "None") {
                    oModel.setProperty("/mailsett", res);
                    CreateComponent.hideBusyIndicator();
                } else {
                    CreateComponent.hideBusyIndicator();
                }
            })
        },
        delfile: function (oEvent) {
            var _this = this
            var event = oEvent.oSource._getBindingContext().sPath
            /*
            const tindex = oEvent.oSource._getBindingContext().sPath.split("/")[2]
            if(oModel.oData.titleset[tindex].tid=="1"){
                sap.m.MessageToast.show("this record cannot be deleted");
            }else{
            PluginService.getPlugin({ SN: "Title", MN: "DELTİTLE", where: "tid=?", param: oModel.oData.titleset[tindex].tid }).then(function (res) {
                CreateComponent.showBusyIndicator()
                _this.getalltitles();
            })
            }*/
            MessageBox.warning(
                "Are you sure you want to delete this file.",
                {
                    title: "Information",
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    styleClass: "sapUiSizeCompact",
                    initialFocus: MessageBox.Action.CANCEL,
                    onClose: function (sAction) {
                        if (sAction == "OK") {
                            _this.delfilesys(event);
                        }
                    }
                }
            );
        },
        delfilesys: function (data) {
            var _this = this
            CreateComponent.showBusyIndicator();
            const lastindex = oModel.getProperty(data).gsftemppath.lastIndexOf("/");
            const foldername = oModel.getProperty(data).gsftemppath.slice(lastindex).split("/")[1]
            gsetfolder.gsetfolderreq({ MN: "DEL", SN: "GeneralSetFolder", where: "gsfid=?", param: oModel.getProperty(data).gsfid, fname: foldername }).then(function (res) {
                if (res == "SuccesDel") {
                    sap.m.MessageToast.show("Deletion took place successfully")
                    _this.getgeneralsettingsfolder();
                } else {
                    sap.m.MessageToast.show("file not found or an error occurred please try again later");
                    CreateComponent.hideBusyIndicator();
                }
            })
        },
        edittopic: function (oEvent) {
            var _this = this
            const tindex = oEvent.oSource._getBindingContext().sPath.split("/")[2]
            oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].setEnabled(false)
            oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].setVisible(false)
            oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[1].setVisible(false)
            if (oModel.oData.edittopics[tindex].tpid == undefined) {
                if (oModel.oData.edittopics[tindex].tptxt.trim() == "") {
                    sap.m.MessageToast.show("please enter the subject name")
                } else {
                    PluginService.getPlugin({ SN: "Topics", MN: "ADDTOPİC", tdata: [{ tptxt: oModel.oData.edittopics[tindex].tptxt }] }).then(function (res) {
                        oModel.setProperty("/edittopics", res)
                        CreateComponent.showBusyIndicator()
                        _this.getalltopic();
                    })
                }
            } else {
                PluginService.getPlugin({ SN: "Topics", MN: "EDİTTOPİC", where: "tpid=?", param: oModel.oData.edittopics[tindex].tpid, tdata: [{ tptxt: oModel.oData.edittopics[tindex].tptxt }] }).then(function (res) {
                    CreateComponent.showBusyIndicator()
                    _this.getalltopic();
                })
            }
        },
        addtopic: function (oEvent) {
            var _this = this
            oModel.oData.edittopics.push({
                tptxt: ""
            })
            oModel.refresh();
            _this.byId("topicstable").getItems()[oModel.oData.edittopics.length - 1].mAggregations.cells[2].getItems()[0].setEnabled(true)
            _this.byId("topicstable").getItems()[oModel.oData.edittopics.length - 1].mAggregations.cells[2].getItems()[0].setVisible(true)
            _this.byId("topicstable").getItems()[oModel.oData.edittopics.length - 1].mAggregations.cells[2].getItems()[1].setVisible(true)
        },
        deletetopic: function (oEvent) {
            var _this = this
            debugger
            const tindex = oEvent.oSource._getBindingContext().sPath.split("/")[2]
            PluginService.getPlugin({ SN: "Topics", MN: "DELTOPİC", where: "tpid=?", param: oModel.oData.edittopics[tindex].tpid }).then(function (res) {
                CreateComponent.showBusyIndicator()
                _this.getalltopic();
            })
        },
        setvisible: function (oEvent) {
            var tindex = oEvent.oSource._getBindingContext().sPath.split("/")[2]
            if (oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].getEnabled()) {
                oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].setEnabled(false)
                oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].setVisible(false)
                oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[1].setVisible(false)
            } else {
                oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].setEnabled(true)
                oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].setVisible(true)
                oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[1].setVisible(true)
            }
        },
        changekey: function (oEvent) {
            var _this = this
            switch (oEvent.oSource.getSelectedKey()) {
                case "topics":
                    CreateComponent.showBusyIndicator()
                    _this.getalltopic();
                    break;
                case "titles":
                    CreateComponent.showBusyIndicator()
                    _this.getalltitles();
                    break;
                case "general":
                    CreateComponent.showBusyIndicator()
                    _this.getgeneralsettings();
                    break;
                case "files":
                    CreateComponent.showBusyIndicator()
                    _this.getgeneralsettingsfolder();
                    break;
                case "mails":
                    _this.getmail();
                    break;
                case "fees":
                    _this.getfee();
                    break;
                case "payments":
                    _this.getpayments();
                    break;
            }
        },
        getpayments: function () {
            PluginService.getPlugin({ SN: "Payments", MN: "GET" }).then(function (res) {
                oModel.setProperty("/paymentset", res)
            })
        },
        getfee: function (oEvent) {
            PluginService.getPlugin({ SN: "FeeSettings", MN: "GET" }).then(function (res) {
                res.forEach(function (x, i) {
                    if (i == 0) {
                        x.enb = false
                        x.total = x.fsprice
                    } else {
                        x.total = 0
                        x.enb = true;
                    }
                })
                oModel.setProperty("/fesett", res)
            })
        },
        addfee: function (oEvent) {

        },
        delfee: function (oEvent) {
            var _this = this
            const data = oModel.getProperty(oEvent.oSource._getBindingContext().sPath);
            MessageBox.warning(
                "Are you sure you want to delete this fee.",
                {
                    title: "Information",
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    styleClass: "sapUiSizeCompact",
                    initialFocus: MessageBox.Action.CANCEL,
                    onClose: function (sAction) {
                        if (sAction == "OK") {
                            _this.delfeeset(data);
                        }
                    }
                }
            );
        },
        delfeeset: function (data) {
            CreateComponent.showBusyIndicator();
            var _this = this
            if (data.fsid == "1") {
                sap.m.MessageToast.show("sorry this record cannot be deleted");
                CreateComponent.hideBusyIndicator();
            } else {
                PluginService.getPlugin({ SN: "FeeSettings", MN: "DEL", where: "fsid=?", param: data.fsid }).then(function (res) {
                    if (res == "SuccesDel") {
                        CreateComponent.hideBusyIndicator();
                        sap.m.MessageToast.show("your deletion took place successfully");
                        _this.getfee();
                    } else {
                        CreateComponent.hideBusyIndicator();
                    }
                })
            }
        },
        getcurrency: function () {
            PluginService.getPlugin({ SN: "Currency", MN: "GET" }).then(function (res) {
                oModel.setProperty("/currency", res)
            })
        },
        editfee: function (oEvent) {
            var _this = this
            _this.getcurrency();
            var setdata;
            var data = ""
            var result = false
            if (oEvent.oSource._getBindingContext() == undefined) {
                result = false
                data = ""
            } else {
                result = true
                data = oModel.getProperty(oEvent.oSource._getBindingContext().sPath);
            }
            var editpaneldialog = new sap.m.Dialog(
                {
                    contentWidth: "50%",
                    contentHeight: "50%",
                    stretchOnPhone: true,
                    showCloseButton: true,
                    beforeClose: function () {
                        if (sap.ui.getCore().byId("bname")) {
                            sap.ui.getCore().byId("bname").destroy();

                        }
                        if (sap.ui.getCore().byId("postitle")) {
                            sap.ui.getCore().byId("postitle").destroy();

                        }
                        if (sap.ui.getCore().byId("vnamee")) {
                            sap.ui.getCore().byId("vnamee").destroy();

                        }
                        if (sap.ui.getCore().byId("vname")) {
                            sap.ui.getCore().byId("vname").destroy();

                        }
                        if (sap.ui.getCore().byId("aname")) {
                            sap.ui.getCore().byId("aname").destroy()
                        }
                        if (sap.ui.getCore().byId("currencys")) {
                            sap.ui.getCore().byId("currencys").destroy()
                        }
                    }
                }).addStyleClass("dialogHasFooter sapUiNoMargin  sapUiSizeCompact sapUiResponsiveContentPadding")
            var bar = new sap.m.Bar({});
            var oSelect2 = new sap.m.Select("currencys", {
                forceSelection: false, width: "100%",
                selectedKey: data.fbtpid == undefined ? data : data.fbtpid
            });
            oSelect2.bindItems("/currency",
                new sap.ui.core.ListItem({
                    key: "{fbtpid}",
                    text: "{fbtxt}"
                })
            );
            bar.addContentMiddle(new sap.m.HBox({
                alignItems: sap.m.FlexAlignItems.Center,
                justifyContent: sap.m.FlexJustifyContent.Stretch,
                items: [
                    new sap.m.Text(
                        {
                            text: "EDİT FEES",
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
                                        text: "Description",
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
                                                value: data.fstxt == undefined ? data : data.fstxt
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
                                        text: "Unit Price",
                                        width: "130px"
                                    }),
                                    new sap.m.Label({
                                        text: ":",
                                        width: "10px"
                                    }),
                                    new sap.m.VBox({
                                        width: "100%",
                                        items: [
                                            new sap.m.Input("bname", {
                                                width: "100%",
                                                value: data.fsprice == undefined ? data : data.fsprice
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
                                        text: "VAT%",
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
                                            new sap.m.Input("vname", {
                                                width: "100%",
                                                value: data.vaty == undefined ? data : data.vaty

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
                                        text: "VAT",
                                        width: "130px"
                                    }),
                                    new sap.m.Label({
                                        text: ":",
                                        width: "10px"
                                    }),
                                    new sap.m.VBox({
                                        width: "100%",
                                        items: [
                                            new sap.m.Input("vnamee", {
                                                width: "100%",
                                                value: data.vat == undefined ? data : data.vat
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
                                        text: "Currency",
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
                                                        sap.m.MessageToast.show("Please fill Description field")
                                                    } else if (sap.ui.getCore().byId("bname").getValue().trim() == "" || isNaN(sap.ui.getCore().byId("bname").getValue()) == true) {
                                                        sap.m.MessageToast.show("Please fill Unit Price only number")
                                                    } else if (sap.ui.getCore().byId("vname").getValue().trim() == "" || isNaN(sap.ui.getCore().byId("vname").getValue()) == true) {
                                                        sap.m.MessageToast.show("Please fill VAT% only number")
                                                    }
                                                    else if (sap.ui.getCore().byId("vnamee").getValue().trim() == "" || isNaN(sap.ui.getCore().byId("vnamee").getValue()) == true) {
                                                        sap.m.MessageToast.show("Please fill VAT only number")
                                                    } else if (sap.ui.getCore().byId("currencys").getSelectedKey() == "") {
                                                        sap.m.MessageToast.show("Please fill Currency field")
                                                    }
                                                    else {
                                                        CreateComponent.showBusyIndicator();
                                                        if (result) {
                                                            setdata = [{
                                                                fstxt: sap.ui.getCore().byId("aname").getValue(),
                                                                fsprice: sap.ui.getCore().byId("bname").getValue(),
                                                                fptype: sap.ui.getCore().byId("currencys").getSelectedKey(),
                                                                fsquota: data.fsquota,
                                                                vaty: sap.ui.getCore().byId("vname").getValue(),
                                                                vat: sap.ui.getCore().byId("vnamee").getValue(),
                                                            }]
                                                            PluginService.getPlugin({ SN: "FeeSettings", MN: "SET", data: setdata, where: "fsid=?", param: data.fsid }).then(function (res) {
                                                                if (res == "SuccedUpdate") {
                                                                    CreateComponent.hideBusyIndicator();
                                                                    sap.m.MessageToast.show("your update has been successful");
                                                                    editpaneldialog.close();
                                                                    _this.getfee();
                                                                } else {
                                                                    CreateComponent.hideBusyIndicator();
                                                                    sap.m.MessageToast.show("an unexpected error has occurred please try again later");
                                                                }

                                                            })
                                                        } else {
                                                            setdata = [{
                                                                fstxt: sap.ui.getCore().byId("aname").getValue(),
                                                                fsprice: sap.ui.getCore().byId("bname").getValue(),
                                                                fptype: sap.ui.getCore().byId("currencys").getSelectedKey(),
                                                                fsquota: "0",
                                                                vaty: sap.ui.getCore().byId("vname").getValue(),
                                                                vat: sap.ui.getCore().byId("vnamee").getValue(),
                                                            }]
                                                            PluginService.getPlugin({ SN: "FeeSettings", MN: "ADD", data: setdata }).then(function (res) {
                                                                if (res == "SuccesAdd") {
                                                                    CreateComponent.hideBusyIndicator();
                                                                    sap.m.MessageToast.show("transaction successful");
                                                                    editpaneldialog.close();
                                                                    _this.getfee();
                                                                } else {
                                                                    CreateComponent.hideBusyIndicator();
                                                                    sap.m.MessageToast.show("an unexpected error has occurred please try again later");
                                                                }

                                                            })

                                                        }

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

        },
        delpayment: function (oEvent) {
            var _this = this
            const data = oModel.getProperty(oEvent.oSource._getBindingContext().sPath);
            MessageBox.warning(
                "Are you sure you want to delete this Payment Way.",
                {
                    title: "Information",
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    styleClass: "sapUiSizeCompact",
                    initialFocus: MessageBox.Action.CANCEL,
                    onClose: function (sAction) {
                        if (sAction == "OK") {
                            _this.delpaymentse(data);
                        }
                    }
                }
            );
        },
        editpayment: function (oEvent) {
            var _this = this
            // var data = oModel.getProperty(oEvent.oSource._getBindingContext().sPath);
            var pwid;
            var pwdata;
            var data = ""
            var result = false
            if (oEvent.oSource._getBindingContext() == undefined) {
                result = false
                data = ""
            } else {
                result = true
                data = oModel.getProperty(oEvent.oSource._getBindingContext().sPath);
                pwid = data.pwid;
            }
            var editpaneldialog = new sap.m.Dialog(
                {
                    contentWidth: "30%",
                    contentHeight: "20%",
                    stretchOnPhone: true,
                    showCloseButton: true,
                    beforeClose: function () {
                        if (sap.ui.getCore().byId("aname")) {
                            sap.ui.getCore().byId("aname").destroy();
                        }
                    }
                }).addStyleClass("dialogHasFooter sapUiNoMargin  sapUiSizeCompact sapUiResponsiveContentPadding")
            var bar = new sap.m.Bar({});
            bar.addContentMiddle(new sap.m.HBox({
                alignItems: sap.m.FlexAlignItems.Center,
                justifyContent: sap.m.FlexJustifyContent.Stretch,
                items: [
                    new sap.m.Text(
                        {
                            text: "EDİT PAYMENT WAY",
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
                                        text: "Payment Way Name",
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
                                                value: data.pwtxt == undefined ? data : data.pwtxt
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
                                                text: "Save Changes",
                                                press: function () {
                                                    if (sap.ui.getCore().byId("aname").getValue().trim() == "") {
                                                        sap.m.MessageToast.show("Please fill Payment Way field")
                                                    }
                                                    else {
                                                        CreateComponent.showBusyIndicator();

                                                        if (result) {
                                                            pwdata = [{
                                                                pwtxt: sap.ui.getCore().byId("aname").getValue()
                                                            }]
                                                            PluginService.getPlugin({ SN: "Payments", MN: "SET", data: pwdata, where: "pwid=?", param: pwid }).then(function (res) {
                                                                if (res == "SuccedUpdate") {
                                                                    CreateComponent.hideBusyIndicator();
                                                                    sap.m.MessageToast.show("transaction successful");
                                                                    editpaneldialog.close();
                                                                    _this.getpayments();
                                                                } else {
                                                                    CreateComponent.hideBusyIndicator();
                                                                    sap.m.MessageToast.show("an unexpected error has occurred please try again later");
                                                                }

                                                            })
                                                        } else {
                                                            pwdata = [{
                                                                pwtxt: sap.ui.getCore().byId("aname").getValue()
                                                            }]
                                                            PluginService.getPlugin({ SN: "Payments", MN: "ADD", data: pwdata }).then(function (res) {
                                                                if (res == "SuccesAdd") {
                                                                    CreateComponent.hideBusyIndicator();
                                                                    sap.m.MessageToast.show("transaction successful");
                                                                    editpaneldialog.close();
                                                                    _this.getpayments();
                                                                } else {
                                                                    CreateComponent.hideBusyIndicator();
                                                                    sap.m.MessageToast.show("an unexpected error has occurred please try again later");
                                                                }

                                                            })

                                                        }
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
        },
        delpaymentse: function (data) {
            CreateComponent.showBusyIndicator();
            var _this = this
            PluginService.getPlugin({ SN: "Payments", MN: "DEL", where: "pwid=?", param: data.pwid }).then(function (res) {
                if (res == "SuccesDel") {
                    CreateComponent.hideBusyIndicator();
                    sap.m.MessageToast.show("your deletion took place successfully");
                    _this.getpayments();
                } else {
                    CreateComponent.hideBusyIndicator();
                }
            })
        },
        getgeneralsettingsfolder: function (oEvent) {
            gsetfolder.gsetfolderreq({ MN: "GET", SN: "GeneralSetFolder" }).then(function (res) {
                oModel.setProperty("/gsetfolder", res);
                CreateComponent.hideBusyIndicator()
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
        addtitle: function (oEvent) {
            var _this = this
            oModel.oData.titleset.push({
                titletxt: ""
            })
            oModel.refresh();
            _this.byId("titlestable").getItems()[oModel.oData.titleset.length - 1].mAggregations.cells[2].getItems()[0].setEnabled(true)
            _this.byId("titlestable").getItems()[oModel.oData.titleset.length - 1].mAggregations.cells[2].getItems()[0].setVisible(true)
            _this.byId("titlestable").getItems()[oModel.oData.titleset.length - 1].mAggregations.cells[2].getItems()[1].setVisible(true)
        },
        deltitle: function (oEvent) {
            var _this = this
            const tindex = oEvent.oSource._getBindingContext().sPath.split("/")[2]
            if (oModel.oData.titleset[tindex].tid == "1") {
                sap.m.MessageToast.show("this record cannot be deleted");
            } else {
                PluginService.getPlugin({ SN: "Title", MN: "DELTİTLE", where: "tid=?", param: oModel.oData.titleset[tindex].tid }).then(function (res) {
                    CreateComponent.showBusyIndicator()
                    _this.getalltitles();
                })
            }
        },
        edittitle: function (oEvent) {
            var _this = this
            const tindex = oEvent.oSource._getBindingContext().sPath.split("/")[2]
            oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].setEnabled(false)
            oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].setVisible(false)
            oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[1].setVisible(false)
            if (oModel.oData.titleset[tindex].tid == undefined) {
                if (oModel.oData.titleset[tindex].titletxt.trim() == "") {
                    sap.m.MessageToast.show("please enter the subject name")
                } else {
                    PluginService.getPlugin({ SN: "Title", MN: "ADDTİTLE", tdata: [{ titletxt: oModel.oData.titleset[tindex].titletxt }] }).then(function (res) {
                        CreateComponent.showBusyIndicator()
                        _this.getalltitles();
                    })
                }
            } else {
                PluginService.getPlugin({ SN: "Title", MN: "EDİTTİTLE", where: "tid=?", param: oModel.oData.titleset[tindex].tid, tdata: [{ titletxt: oModel.oData.titleset[tindex].titletxt }] }).then(function (res) {
                    CreateComponent.showBusyIndicator()
                    _this.getalltopic();
                })
            }
        },
        editfilevisible: function (oEvent) {
            var _this = this
            var tindex = oEvent.oSource._getBindingContext().sPath.split("/")[2]
            oModel.setProperty("/prevname", JSON.parse(JSON.stringify(oModel.getProperty(oEvent.oSource._getBindingContext().sPath).gsfname)));
            if (oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].getEnabled()) {
                oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].setEnabled(false)
                oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].setVisible(false)
                oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[1].setVisible(false)
            } else {
                oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].setEnabled(true)
                oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[0].setVisible(true)
                oEvent.oSource.oParent.oParent.oParent.getItems()[tindex].getCells()[2].getItems()[1].setVisible(true)
            }
        },
        editfile: function (oEvent) {
            var filedata = [];
            if (oModel.getProperty(oEvent.oSource._getBindingContext().sPath).gsfname == "") {
                sap.m.MessageToast.show("please enter the file name")
            } else {
                debugger
                CreateComponent.showBusyIndicator();
                var id = oModel.getProperty(oEvent.oSource._getBindingContext().sPath).gsfid
                filedata.push({
                    "gsfname": oModel.getProperty(oEvent.oSource._getBindingContext().sPath).gsfname,
                    "gsftemppath": "/sysword/" + oModel.getProperty(oEvent.oSource._getBindingContext().sPath).gsfname + oModel.getProperty(oEvent.oSource._getBindingContext().sPath).gsftype,
                    "gsftype": oModel.getProperty(oEvent.oSource._getBindingContext().sPath).gsftype,
                    "gsfabstype": oModel.getProperty(oEvent.oSource._getBindingContext().sPath).gsfabstype,
                })
                gsetfolder.gsetfolderreq({ MN: "SET", SN: "GeneralSetFolder", data: filedata, where: "gsfid=?", param: id, prevname: oModel.oData.prevname }).then(function (res) {
                    if (res == "SuccedUpdate") {
                        sap.m.MessageToast.show("Your update has been successfully completed")
                        CreateComponent.hideBusyIndicator();
                        _this.getgeneralsettingsfolder();
                    } else {
                        sap.m.MessageToast.show("an unexpected error has occurred please try again later");
                        CreateComponent.hideBusyIndicator();
                    }
                })
            }
        },
        getalltitles: function (oEvent) {
            PluginService.getPlugin({ SN: "Title", MN: "GETTİTLE" }).then(function (res) {
                oModel.setProperty("/titleset", res)
                CreateComponent.hideBusyIndicator();
            })
        },
        onBeforeShow: function (argument) {
            var _this = this;
            UseronLogin.onLogin().then(function (res) {
                _this.getgeneralsettings();
            })
        },
    });
});
