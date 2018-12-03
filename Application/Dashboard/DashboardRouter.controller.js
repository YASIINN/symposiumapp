sap.ui.define(['sap/ui/core/mvc/Controller'], function (Controller) {
    "use strict";
    var PageController = Controller.extend("symposiumapp.Application.Dashboard.DashboardRouter", {
        onInit: function (oEvent) {
            var _this = this
            _this.getView().setModel(oModel);
        },
        onClose: function (oEvent) {
            var UserModel = {
                name: "",
                pass: ""
            }
            oModel.setProperty("/UserModel", UserModel);
            oModel.setProperty("/userLayout", []);
            window.location.reload();
        },
        goHomePage:function(){
            window.open("#/Dashboard/Home", "_self");
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