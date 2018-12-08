jQuery.sap.require("symposiumapp.ApiRequest.ApiRequset");
jQuery.sap.require("symposiumapp.Servicejs.PluginsService");
sap.ui.define(["sap/ui/core/mvc/Controller"], function (e) {
    "use strict";
    return e.extend("symposiumapp.Application.Dashboard.Home.controller.Home", {
        onInit: function () {
            var _this = this
            var e = this;
            e.getView().setModel(oModel),
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("Dashboard/Home").attachPatternMatched(e.onBeforeShow, e)
        },
        getulke:function(){
            if(localStorage.getItem("country")==null){
          ApiReq.GET().then(function(res){
                       oModel.setProperty("/AllCountry", res.map(function(x){
                    return {name:x.name,key:x.alpha3Code}
                    }))
           localStorage.setItem("country",JSON.stringify(oModel.oData.AllCountry));
          })
      }else{
          oModel.setProperty("/AllCountry",JSON.parse(localStorage.getItem("country")));
      }
        },
        getPosition:function(){
               PluginService.getPlugin({ SN: "Title", MN: "GETTİTLE" }).then(function (res) {
                    oModel.setProperty("/title", res)
                })
        },
        onBeforeShow: function () {
            var _this = this
            UseronLogin.onLogin().then(function (e) {
            _this.getulke();
            _this.getPosition();
            })
        }
    })
});