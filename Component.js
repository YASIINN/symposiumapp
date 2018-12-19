'use strict'
jQuery.sap.require("symposiumapp.Component");
jQuery.sap.require("symposiumapp.MyRouter");
var version = "1.0.0";
sap.ui.define(
  [
    'sap/ui/core/UIComponent',
    'sap/ui/model/json/JSONModel'
  ],
  function (UIComponent, JSONModel) {
    return UIComponent.extend('symposiumapp.Component', {
      metadata: {
        name: "symposiumapp",
        version: "1.0.0",
        i18n: "i18n/i18n.properties",
        includes: [],
        dependencies: {
          libs: ["sap.m", "sap.ui.layout"],
          components: []
        },
        config: {
          resourceBundle: "i18n/messageBundle.properties",
        },
        routing: {
          config: {
            routerClass: sap.ui.demo.app.MyRouter,
            viewType: "XML",
            targetAggregation: "pages",
            clearTarget: false
          },
          routes: [
            {
              pattern: "",
              viewPath: "symposiumapp.Application.Dashboard",
              name: "Dashboard",
              view: "DashboardRouterApp",
              targetControl: "masterView",
              transition: "show",
              cache: {
                keys: [version]
              },
              subroutes: [
                {
                  pattern: "Dashboard/Home",
                  viewPath: "symposiumapp.Application.Dashboard.Home.view",
                  name: "Dashboard/Home",
                  view: "Home",
                  targetControl: "DashboardRouterId",
                  transition: "show",
                  cache: {
                    keys: [version]
                  },
                },
                {
                  pattern: "Dashboard/MyArticles",
                  viewPath: "symposiumapp.Application.Dashboard.MyArticles.view",
                  name: "Dashboard/MyArticles",
                  view: "MyArticles",
                  targetControl: "DashboardRouterId",
                  transition: "show",
                  cache: {
                    keys: [version]
                  },
                },
                ]
            },
            {
              pattern: "Forget",
              viewPath: "symposiumapp.Application.Forget.view",
              name: "Forget",
              view: "Forget",
              targetControl: "masterView",
              transition: "show",
              cache: {
                keys: [version]
              },
            },
            {
              pattern: "Register",
              viewPath: "symposiumapp.Application.Register.view",
              name: "Register",
              view: "Register",
              targetControl: "masterView",
              transition: "show",
              cache: {
                keys: [version]
              },
            },
            {
              pattern: "RegisterCheck?{param}",
              viewPath: "symposiumapp.Application.RegisterCheck.view",
              name: "RegisterCheck",
              view: "RegisterCheck",
              targetControl: "masterView",
              transition: "show",
              cache: {
                keys: [version]
              },
            },
            {
              pattern: "ManagementPanel",
              viewPath: "symposiumapp.Application.ManagementPanel",
              name: "ManagementPanel",
              view: "ManagementPanelRouterApp",
              targetControl: "masterView",
              transition: "show",
              cache: {
                keys: [version]
              },
              subroutes: [{
                pattern: "ManagementPanel/ManageAllSettings",
                viewPath: "symposiumapp.Application.ManagementPanel.ManageAllSettings.view",
                name: "ManagementPanel/ManageAllSettings",
                view: "ManageAllSettings",
                targetControl: "ManagementRouterId",
                transition: "show",
                cache: {
                  keys: [version]
                },
              },
              ]
            },
            {
              pattern: "Login",
              viewPath: "symposiumapp.Application.Login.view",
              name: "Login",
              view: "Login",
              targetControl: "masterView",
              transition: "show",
              cache: {
                keys: [version]
              },
            },
          ]
        },
      },
      init: function () {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
        var mConfig = this.getMetadata().getConfig();
        this.getRouter().initialize();
      },
      createContent: function () {
        var oViewData = {
          component: this
        }
        return sap.ui.view({
          viewName: "symposiumapp.MasterApp",
          type: sap.ui.core.mvc.ViewType.XML,
          id: "MasterAppid",
          viewData: oViewData,
        })
      }
    })
  }
)