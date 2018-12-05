sap.ui.define(["sap/ui/core/mvc/Controller"], function (e) {
    "use strict";
    return e.extend("symposiumapp.Application.Dashboard.Home.controller.Home", {
        onInit: function () {
            var _this = this
            var e = this;
            e.getView().setModel(oModel),
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("Dashboard/Home").attachPatternMatched(e.onBeforeShow, e)
        },
      
        onBeforeShow: function () {
            var _this = this
            debugger
            console.log("denme");
            UseronLogin.onLogin().then(function (e) {
                debugger
            })
        }
    })
});