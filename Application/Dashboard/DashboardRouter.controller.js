sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
    "use strict";
    var PageController = Controller.extend("symposiumapp.Application.Dashboard.DashboardRouter", {
        onInit: function (oEvent) {
            var _this = this
            _this.getView().setModel(oModel);
            _this.getView().addEventDelegate({
                onBeforeShow: jQuery.proxy(function (evt) {
                    _this.onBeforeShow(_this);
                }, _this)
            });
            UseronLogin.onLogin().then(function (res) {
                oModel.oData.UserModel[0].uauth == "2" ? _this.byId("manage").setVisible(false) : _this.byId("manage").setVisible(true);
              
            })
        },
        onBeforeShow: function (argument) {
            var _this = this
            var selectView = _this.getOwnerComponent().getRouter();
            selectView = selectView._oRouter._prevMatchedRequest
            selectView = selectView.split("?")[0]
            var IconTabFilter = _this.getView().byId("dashboardtab");
            IconTabFilter.setSelectedKey(selectView);
        },
        onClose: function (oEvent) {
            var UserModel = {
                name: "",
                pass: ""
            }
            oModel.setProperty("/UserModel", UserModel);
            window.location.reload();
            UseronLogin.outLogin();
        },
        goHomePage: function (oEvent) {
            if (oEvent.oSource.getSelectedKey() == "Dashboard/MyArticles") {
                window.open("#/Dashboard/MyArticles", "_self");
            } else {
                window.open("#/Dashboard/Home", "_self");
            }
        },
        gomanage: function () {
            window.open("#/ManagementPanel/ManageAllSettings", "_blank");
        },
    });
    return PageController;
});