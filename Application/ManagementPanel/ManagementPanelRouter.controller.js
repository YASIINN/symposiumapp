sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
    "use strict";
    var PageController = Controller.extend("symposiumapp.Application.ManagementPanel.ManagementPanelRouter", {
        onInit: function (oEvent) {
            var _this = this
            _this.getView().setModel(oModel);
            UseronLogin.onLogin().then(function (res) {
            })
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("ManagementPanel/ManageAllSettings").attachPatternMatched(_this.onBeforeShow, _this);
            _this.getView().addEventDelegate({
                onBeforeShow: jQuery.proxy(function (evt) {
                    _this.onBeforeShow(_this);
                }, _this)
            });
        },
        onBeforeShow: function (argument) {
            var _this = this
            var selectView = _this.getOwnerComponent().getRouter();
            selectView = selectView._oRouter._prevMatchedRequest
            selectView = selectView.split("?")[0];
            var IconTabFilter = _this.getView().byId("managetab");
            IconTabFilter.setSelectedKey(selectView);
        },
        ManageRouterEvent: function (oEvent) {
            var _this = this
            var key = oEvent.getSource().getSelectedKey();
            var oRouter = sap.ui.core.UIComponent.getRouterFor(_this);
            oRouter.navTo(key, {
                param: window.location.hash.split("?")[1]
            })
        },
        onClose: function (argument) {
            UseronLogin.outLogin();
            window.location.reload();
        },
        onGoHome: function (argument) {
            var _this = this
            _this.getOwnerComponent().getRouter().navTo("Dashboard/Home");
        },
    });
    return PageController;
});