jQuery.sap.require("symposiumapp.Application.Dashboard.Home.folderservice.folder");
jQuery.sap.require("symposiumapp.Servicejs.PluginsService");
jQuery.sap.require("symposiumapp.Application.ManagementPanel.ManageAllSettings.GeneralSetFolderService.generalsetfolder");
jQuery.sap.require("symposiumapp.Application.ManagementPanel.ManageAllSettings.GeneralsettingsService.generalsettings");
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
        delfile: function (oEvent) {
            var _this = this
            var event = oEvent.oSource._getBindingContext().sPath
            // const tindex = oEvent.oSource._getBindingContext().sPath.split("/")[2]
            // if(oModel.oData.titleset[tindex].tid=="1"){
            //     sap.m.MessageToast.show("this record cannot be deleted");
            // }else{
            // PluginService.getPlugin({ SN: "Title", MN: "DELTİTLE", where: "tid=?", param: oModel.oData.titleset[tindex].tid }).then(function (res) {
            //     CreateComponent.showBusyIndicator()
            //     _this.getalltitles();
            // })
            // }
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
        setfilevisible: function (oEvent) {

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
            }
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
            if (oModel.getProperty(oEvent.oSource._getBindingContext().sPath).gsfname == "") {
                sap.m.MessageToast.show("please enter the file name")
            } else {    
                CreateComponent.showBusyIndicator();
                var id = oModel.getProperty(oEvent.oSource._getBindingContext().sPath).gsfid
                var filedata = [{
                    "gsfname": oModel.getProperty(oEvent.oSource._getBindingContext().sPath).gsfname,
                    "gsftemppath": "/sysword/" + oModel.oData.gsetfolder[0].gsfname + oModel.oData.gsetfolder[0].gsftype,
                    "gsftype": oModel.getProperty(oEvent.oSource._getBindingContext().sPath).gsftype,
                    "gsfabstype": oModel.getProperty(oEvent.oSource._getBindingContext().sPath).gsfabstype,
                }]
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
