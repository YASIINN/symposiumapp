var authorpaneldialog = ""
var authorarray = [];
var authorpanel = {
    open: function (_this) {
        debugger
        if (authorpaneldialog) {
            authorpaneldialog.open(_this);
            return
        }
        var authorpaneldialog = new sap.m.Dialog(
            {
                contentWidth: "50%",
                contentHeight: "55%",
                stretchOnPhone: true,
                showCloseButton: true,
                beforeClose: function () {
                    sap.ui.getCore().byId("postitle").destroy();
                    sap.ui.getCore().byId("countryall").destroy();
                    sap.ui.getCore().byId("pnmbr").destroy();
                }
            }).addStyleClass("dialogHasFooter sapUiNoMargin  sapUiSizeCompact sapUiResponsiveContentPadding")
        var bar = new sap.m.Bar({});
        var oSelect = new sap.m.Select("postitle", { forceSelection: false, width: "100%" });
        oSelect.bindItems("/title",
            new sap.ui.core.Item({
                key: "{tid}",
                text: "{titletxt}"
            })
        );
        var oSelect2 = new sap.m.Select("countryall", { forceSelection: false, width: "100%", showSecondaryValues: true });
        oSelect2.bindItems("/AllCountry",
            new sap.ui.core.ListItem({
                additionalText: "{key}",
                key: "{key}",
                text: "{name}"
            })
        );
        bar.addContentMiddle(new sap.m.HBox({
            alignItems: sap.m.FlexAlignItems.Center,
            justifyContent: sap.m.FlexJustifyContent.Stretch,
            items: [
                new sap.m.Text(
                    {
                        text: "CORRESSPONDING AUTHOR",
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
                    authorpaneldialog.close();
                }
            }).addStyleClass("sapUiNoMargin"))
        var panelarea = new sap.m.HBox({
            width:"100%",
            height:"100%",
            alignItems: sap.m.FlexAlignItems.Stretch,
            justifyContent: sap.m.FlexJustifyContent.Stretch,
            items: [
                new sap.m.VBox({
                    width:"100%",
                    height:"100%",
                    alignItems: sap.m.FlexAlignItems.Stretch,
                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                    items: [
                        new sap.m.HBox({
                            width:"100%",
                            alignItems: sap.m.FlexAlignItems.Stretch,
                            justifyContent: sap.m.FlexJustifyContent.Stretch,
                            items: [
                                new sap.m.Label({
                                    text: "Name Surname",
                                    width: "130px"
                                }),
                                new sap.m.Label({
                                    text: ":",
                                    width: "10px"
                                }),
                                new sap.m.VBox({
                                    width:"100%",
                                    alignItems: sap.m.FlexAlignItems.Stretch,
                                    justifyContent: sap.m.FlexJustifyContent.Stretch,
                                    items: [
                                        new sap.m.Input({
                                            width:"100%",
                                            value: "{/author/ufname}",
                                            placeholder: "Please write the corresponding author's Name SURNAME here"
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
                                    text: "Position / Title",
                                    width: "130px"
                                }),
                                new sap.m.Label({
                                    text: ":",
                                    width: "10px"
                                }),
                                new sap.m.VBox({
                                    width: "100%",
                                    items: [
                                        oSelect
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
                                    text: "University/Inst.",
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
                                        new sap.m.Input({
                                            value: "{/author/uniorinst}",
                                            width: "100%",
                                            placeholder: "Please write the name of your University or Institute or Organisation here"
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
                                    text: "Country",
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
                                    text: "Address",
                                    width: "130px"
                                }),
                                new sap.m.Label({
                                    text: ":",
                                    width: "10px"
                                }),
                                new sap.m.VBox({
                                    width: "100%",
                                    items: [
                                        new sap.m.TextArea({
                                            value: "{/author/addres}",
                                            placeholder: "Please write the Corresponding Address of the corresponding author here",
                                            rows: 4,
                                            width: "100%"
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
                                    text: "E-mail",
                                    width: "130px"
                                }),
                                new sap.m.Label({
                                    text: ":",
                                    width: "10px"
                                }),
                                new sap.m.VBox({
                                    width: "100%",
                                    items: [
                                        new sap.m.Input({
                                            value: "{/author/email}",
                                            placeholder: "Please write the e-mail of the corresponding author here",
                                            width: "100%"
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
                                    text: "Phone",
                                    width: "130px"
                                }),
                                new sap.m.Label({
                                    text: ":",
                                    width: "10px"
                                }),
                                new sap.m.VBox({
                                    width: "100%",
                                    items: [
                                        new sap.m.MaskInput("pnmbr", {
                                            mask: "+CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC",
                                            rules: new sap.m.MaskInputRule({
                                                maskFormatSymbol: "C",
                                                regex: "[A-Z0-9]"
                                            }),
                                            placeholder: "Enter Phone number",
                                            width: "100%"
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
                                            text: "Save Author's",
                                            press: function () {
                                                authorpanel.validtefield(_this);
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
        authorpaneldialog.addContent(panelarea);
        authorpaneldialog.setCustomHeader(bar);
        authorpaneldialog.open(_this);

    },
    validtefield: function (_this) {
        if (oModel.oData.author.ufname.trim() == "") {
            sap.m.MessageToast.show("please fill in the first and last name fields");
        } else if (oModel.oData.author.ufname.split(" ")[0].length < 3) {
            sap.m.MessageToast.show("your name cannot be less than 3 characters");
        } else if (oModel.oData.author.ufname.split(" ")[1] == undefined) {
            sap.m.MessageToast.show("please enter a name after your name and enter your last name");
        } else if (oModel.oData.author.ufname.split(" ")[1].length < 3) {
            sap.m.MessageToast.show("your last name cannot be less than 3 characters");
        }
        else if (oModel.oData.author.uniorinst.trim() == "") {
            sap.m.MessageToast.show("Please fill the field of university or institute");
        } else if (sap.ui.getCore().byId("countryall").getSelectedKey().trim() == "") {
            sap.m.MessageToast.show("please fill in the country field");
        } else if (oModel.oData.author.addres.trim() == "") {
            sap.m.MessageToast.show("please fill in the Address field");
        }
        else if (!CreateComponent.validateemail(oModel.oData.author.email)) {
            sap.m.MessageToast.show("Invalid e-mail address");
        } else if (sap.ui.getCore().byId("pnmbr").getValue().split("_")[0].trim() == "") {
            sap.m.MessageToast.show("please fill in the phone field");
        } else {
            authorpanel.createauthors(_this);
        }
    },
    createauthors: function (_this) {
        if (authorarray.length) {
            debugger
            var result = authorarray.filter(function (x) {
                if (x.mail != oModel.oData.author.email) {
                    return 0;
                } else {
                    return x;
                }
            })
            if (!result.length) {
                authorarray.push({
                    usname: oModel.oData.author.ufname.split(" ")[0],
                    uslname: oModel.oData.author.ufname.split(" ")[1],
                    uauth: 2,
                    uniorinst: oModel.oData.author.uniorinst,
                    ulgnname: oModel.oData.author.email,
                    upass: atob(oModel.oData.UserModel[0].axp),
                    mail: oModel.oData.author.email,
                    country: sap.ui.getCore().byId("countryall").getSelectedKey(),
                    tid: sap.ui.getCore().byId("postitle").getSelectedKey() == "" ? "1" : sap.ui.getCore().byId("postitle").getSelectedKey(),
                    adress: oModel.oData.author.addres,
                    ftextquota: "0",
                    absquota: "0",
                    mainaut: "0",
                    pnmbr: sap.ui.getCore().byId("pnmbr").getValue()
                })
                oModel.setProperty("/authorsuser", authorarray);
                authorpanel.setauthormodel();
            } else {
                sap.m.MessageToast.show("email address has already been added");
            }
        } else {
            authorarray.push({
                usname: oModel.oData.author.ufname.split(" ")[0],
                uslname: oModel.oData.author.ufname.split(" ")[1],
                uauth: 2,
                uniorinst: oModel.oData.author.uniorinst,
                ulgnname: oModel.oData.author.email,
                upass: atob(oModel.oData.UserModel[0].axp),
                mail: oModel.oData.author.email,
                country: sap.ui.getCore().byId("countryall").getSelectedKey(),
                tid: sap.ui.getCore().byId("postitle").getSelectedKey() == "" ? "1" : sap.ui.getCore().byId("postitle").getSelectedKey(),
                adress: oModel.oData.author.addres,
                ftextquota: "0",
                absquota: "0",
                mainaut: "0",
                pnmbr: sap.ui.getCore().byId("pnmbr").getValue()
            })
            oModel.setProperty("/authorsuser", authorarray);
            authorpanel.setauthormodel();
        }
    },
    setauthormodel: function () {
        oModel.setProperty("/author", {
            ufname: "",
            uniorinst: "",
            country: "",
            addres: "",
            email: "",
            phone: ""
        })
        sap.ui.getCore().byId("postitle").setSelectedKey(null)
        sap.ui.getCore().byId("countryall").setSelectedKey(null)
        sap.ui.getCore().byId("pnmbr").setValue("")
    }
};
