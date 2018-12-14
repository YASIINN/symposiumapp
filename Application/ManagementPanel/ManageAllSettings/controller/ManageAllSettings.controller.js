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
            oRouter.getRoute("ManagementPanel/ManageAllSettings").attachPatternMatched(_this.onBeforeShow, _this);
        },
        getalltopic: function () {
            PluginService.getPlugin({ SN: "Topics", MN: "GETTOPİC" }).then(function (res) {
                oModel.setProperty("/edittopics", res)
                CreateComponent.hideBusyIndicator()
            })
        },
        delfile: function (oEvent) {
            var _this = this
            var event = oEvent.oSource._getBindingContext().sPath
            MessageBox.warning(
                "Are you sure you want to delete this file.",
                {
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
        addfile:function(){

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
            PluginService.getPlugin({ SN: "Title", MN: "DELTİTLE", where: "tid=?", param: oModel.oData.titleset[tindex].tid }).then(function (res) {
                CreateComponent.showBusyIndicator()
                _this.getalltitles();
            })
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

                PluginService.getPlugin({ SN: "Title", MN: "EDİTTİTLE", where: "tpid=?", param: oModel.oData.titleset[tindex].tid, tdata: [{ titletxt: oModel.oData.titleset[tindex].titletxt }] }).then(function (res) {
                    CreateComponent.showBusyIndicator()
                    _this.getalltopic();
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
