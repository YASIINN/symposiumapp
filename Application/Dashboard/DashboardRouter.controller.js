sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
    "use strict";
    var PageController = Controller.extend("symposiumapp.Application.Dashboard.DashboardRouter", {
        onInit: function (oEvent) {
            var _this = this
            _this.getView().setModel(oModel);
              UseronLogin.onLogin().then(function (res) { 

                oModel.oData.UserModel[0].uauth=="2"?_this.byId("manage").setVisible(false):_this.byId("manage").setVisible(true);
                  _this.getView().addEventDelegate({
                    onBeforeShow: jQuery.proxy(function (evt) {
                        _this.onBeforeShow(_this);
                    }, _this)
                });
              })
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
        goHomePage:function(){
            window.open("#/Dashboard/Home", "_self");
        },
        gomanage:function(){
            debugger
            window.open("#/ManagementPanel/ManageAllSettings", "_blank");
        },
        DashboardrouterEvent: function (oEvent) {
            var _this = this
            var url = oEvent.getSource().data("url");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(_this);
            oRouter.navTo("Dashboard/"+url)
        },
    });
    return PageController;
});