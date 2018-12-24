jQuery.sap.require("symposiumapp.Application.ManagementPanel.ManageAllSettings.GeneralSetFolderService.generalsetfolder");
jQuery.sap.require("symposiumapp.Application.ManagementPanel.ManageAllSettings.GeneralsettingsService.generalsettings");
jQuery.sap.require("symposiumapp.ApiRequest.ApiRequset");
jQuery.sap.require("symposiumapp.Servicejs.MailService");
jQuery.sap.require("symposiumapp.Servicejs.PluginsService");
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.folderservice.folder");
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.broadcastservice.broadcast");
jQuery.sap.require("symposiumapp.Application.Dashboard.Home.autbrorelation.autbrorelation");
sap.ui.define(["sap/ui/core/mvc/Controller"], function (e) {
    "use strict";
    return e.extend("symposiumapp.Application.Dashboard.Home.controller.Home", {
        onInit: function () {
            var _this=this
            oModel.setProperty("/dvisible",true);
            oModel.refresh()
            var e = this;
            _this.setauthormodel();
        _this.setcustomermodel();
            e.getView().setModel(oModel),
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("Dashboard/Home").attachPatternMatched(e.onBeforeShow, e)
            this.getView().byId('fileuploadftext').oBrowse.mProperties.text = "Browse"
            this.getView().byId('fileUploader').oBrowse.mProperties.text = "Browse"
        },
        setcustomermodel:function(){
            oModel.setProperty("/customer",[{
                payment:"",
                invto:"",
                adres:"",
                vatno:"",
                tradeno:""
            }])
        },
        getcountry: function () {
            if (localStorage.getItem("country") == null) {
                ApiReq.GET().then(function (res) {
                    oModel.setProperty("/AllCountry", res.map(function (x) {
                        return { name: x.name, key: x.alpha3Code }
                    }))
                    localStorage.setItem("country", JSON.stringify(oModel.oData.AllCountry));
                })
            } else {
                oModel.setProperty("/AllCountry", JSON.parse(localStorage.getItem("country")));
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
        },
        changefile: function (oEvent) {
            oModel.setProperty("/fdata", oEvent.getParameter("files")[0]);
        },
        gowm:function(){
            window.open(oModel.oData.headerset[0].hslink)
        },
        addfile: function () {
            var _this = this
            var form_data = new FormData();
            form_data.append('usid', oModel.oData.UserModel[0].usid);
            form_data.append('file', oModel.oData.fdata);
            form_data.append('SN', "File");
            form_data.append('MN', "ADD");
            form_data.append('size', oModel.oData.fdata["size"]);
            form_data.append('fileext', oModel.oData.fdata["name"].split(".")[1]);
            form_data.append('type', oModel.oData.fdata["type"]);
            form_data.append("bcext", oModel.oData.fdata.name.slice(oModel.oData.fdata.name.lastIndexOf(".")));

            if(_this.byId("absid").getSelectedKey()=="1"){
                form_data.append("abstype","ftxt");

            }else{
                form_data.append("abstype","abs");
            }
            debugger
            debugger
            folderservice.folderreq(form_data).then(function (res) {
                if (res.status == "SuccesAdd") {
                    _this.addbroadcast(res.fid, _this.byId("absid").getSelectedKey());
                } else {
                    CreateComponent.hideBusyIndicator()
                }
            })
        },
        addbroadcast: function (file, key) {
            var _this = this
            if (key == "2") {
                var nm = _this.byId("titleid").getValue().toUpperCase()
                broadcastService.broadcastreq({ MN: "GET", SN: "Broadcast", where: "brdcastname=?", param: [nm] }).then(function (res) {
                    if (typeof res == "string") {
                        broadcastService.broadcastreq({
                            MN: "ADD", SN: "Broadcast", broadcastdata: [{
                                brdcastname: _this.byId("titleid").getValue().toUpperCase(),
                                brdsubject: _this.byId("topicid").getSelectedItem().mProperties.text.toUpperCase(),
                                abtype: key,
                                brdcasttype: _this.byId("oralid").getSelected() == true ? "1" : "2",
                                fileid: file
                            }]
                        }).then(function (res) {
                            if (res[0].status == "SuccesAdd") {
                                _this.addauthorsuser(res[0].btid);
                            } else {
                                CreateComponent.hideBusyIndicator()
                            }
                        })
                    } else if (typeof res == "object") {
                        sap.m.MessageToast.show("this article was used before")
                    }
                })

            } else if (key == "1") {
                var nm = _this.byId("titleid").getValue().toUpperCase()
                broadcastService.broadcastreq({ MN: "GET", SN: "Broadcast", where: "brdcastname=?", param: [nm] }).then(function (res) {
                    if (typeof res == "string") {
                        broadcastService.broadcastreq({
                            MN: "ADD", SN: "Broadcast", broadcastdata: [{
                                brdcastname: _this.byId("fttid").getValue().toUpperCase(),
                                brdsubject: _this.byId("fttopicid").getSelectedItem().mProperties.text.toUpperCase(),
                                abtype: key,
                                brdcasttype: _this.byId("ftoid").getSelected() == true ? "1" : "2",
                                fileid: file
                            }]
                        }).then(function (res) {
                            if (res[0].status == "SuccesAdd") {
                                _this.addauthorsuser(res[0].btid);
                            } else {
                                CreateComponent.hideBusyIndicator()
                            }
                        })
                    } else if (typeof res == "object") {
                        sap.m.MessageToast.show("this article was used before")
                    }
                })
            }
        },
        addauthorsuser: function (btid) {
            var _this = this
            var param = "";
            /*  if (oModel.oData.authorsuser && oModel.oData.authorsuser.length) {
                  var authors = JSON.parse(JSON.stringify(oModel.oData.authorsuser));
                  for (let index = 0; index < oModel.oData.authorsuser.length; index++) {
                      if (index == oModel.oData.authorsuser.length - 1) {
                          param += "'" + oModel.oData.authorsuser[index].mail + "'"
                      } else {
                          param += "'" + oModel.oData.authorsuser[index].mail + "'" + ","
                      }
                  }
                  PluginService.getPlugin({ MN: "GETMAİL", SN: "UserMail", where: "mail IN" + "(" + param + ")" }).then(function (res) {
                      if (res[0].status == "Okey") {
                          for (let index = 0; index < authors.length; index++) {
                              for (let j = 0; j < res.length; j++) {
                                  if (authors[index].mail == res[j].mail) {
                                      authors.splice(index, 1);
                                  }
                              }
                          }
                          UserService.userReq({ MN: "ADD", SN: "User", userdata: authors }).then(function (res) {
                              if (res[0].status == "SuccesAdd") {
                                  _this.onRelationAuthorsBroadcast(true, btid, param);
                              } else {
                                  CreateComponent.hideBusyIndicator()
                              }
                          })
                      }
                      else {
                          authors = oModel.oData.authorsuser
                          UserService.userReq({ MN: "ADD", SN: "User", userdata: authors }).then(function (res) {
                              if (res[0].status == "SuccesAdd") {
                                  _this.onRelationAuthorsBroadcast(true, btid, param);
                              } else {
                                  CreateComponent.hideBusyIndicator()
                              }
                          })
                      }
                  })
              } else {
                  _this.onRelationAuthorsBroadcast(false, btid);
              }*/
            _this.onRelationAuthorsBroadcast(false, btid);
        },
        onRelationAuthorsBroadcast: function (result, btid, param) {
            var _this = this
            if (result) {
                /*
                var relation;
                UserService.userReq({ MN: "GET", SN: "User", "where": "ulgnname IN" + "(" + param + ")" }).then(function (res) {
                    if (res[0].status == "Okey") {
                        relation = res.map(function (x) {
                            return { usid: x.usid, btid: btid }
                        })
                        relation.push({
                            usid: oModel.oData.UserModel[0].usid,
                            btid: btid
                        })
                        RelationService.relationreq({ MN: "ADD", SN: "Relation", data: relation }).then(function (res) {
                            if (res == "SuccesAdd") {
                                switch (_this.byId("absid").getSelectedKey()) {
                                    case "1":
                                        oModel.oData.UserModel[0].ftextquota = (parseInt(oModel.oData.UserModel[0].ftextquota) + 1).toString()
                                        _this.onsetinfo("quota");
                                        break;

                                    case "2":
                                        oModel.oData.UserModel[0].absquota = (parseInt(oModel.oData.UserModel[0].absquota) + 1).toString()
                                        _this.onsetinfo("quota");
                                        break;
                                }
                            } else {
                                CreateComponent.hideBusyIndicator()
                            }

                        })
                    } else {
                        CreateComponent.hideBusyIndicator()
                    }
                })
                */
            } else {
                RelationService.relationreq({
                    MN: "ADD", SN: "Relation", data: [{
                        usid: oModel.oData.UserModel[0].usid,
                        btid: btid
                    }]
                }).then(function (res) {
                    if (res == "SuccesAdd") {
                        switch (_this.byId("absid").getSelectedKey()) {
                            case "1":
                                oModel.oData.UserModel[0].ftextquota = (parseInt(oModel.oData.UserModel[0].ftextquota) + 1).toString()
                                _this.onsetinfo("quota");
                                break;

                            case "2":
                                oModel.oData.UserModel[0].absquota = (parseInt(oModel.oData.UserModel[0].absquota) + 1).toString()
                                _this.onsetinfo("quota");
                                break;
                        }
                    } else {
                        CreateComponent.hideBusyIndicator()
                    }
                })
            }
        },
        //on set infodan önceki adım
        getBroad:function(){
          broadcastService.broadcastreq({MN:"GET"}).then(function (res) {
              return res
          })
        },
        onsetinfo: function (qouta) {
            CreateComponent.showBusyIndicator()
            var _this = this
            var tid = "";
            var adres = ""
            if (oModel.oData.UserModel[0].tid == "") {
                if (_this.byId("settitle").getSelectedKey() == "") {
                    tid = "1"
                } else {
                    tid = "1"
                }
            } else if (oModel.oData.UserModel[0].tid == "1") {
                tid = _this.byId("settitle").getSelectedKey()
            } else {
                tid = oModel.oData.UserModel[0].tid
            }
            if (oModel.oData.UserModel[0].adress == "") {
                adres = oModel.oData.author.addres
            } else {
                adres = oModel.oData.UserModel[0].adress
            }
            var userdata = [{
                usname: oModel.oData.UserModel[0].usname.toUpperCase(),
                uslname: oModel.oData.UserModel[0].uslname.toUpperCase(),
                uauth: oModel.oData.UserModel[0].uauth,
                uniorinst: oModel.oData.UserModel[0].uniorinst.toUpperCase(),
                ulgnname: oModel.oData.UserModel[0].ulgnname,
                country: oModel.oData.UserModel[0].country == "" ? _this.byId("countryallset").getSelectedKey() : oModel.oData.UserModel[0].country,
                tid: tid,
                adress: adres.toUpperCase(),
                ftextquota: oModel.oData.UserModel[0].ftextquota,
                absquota: oModel.oData.UserModel[0].absquota,
                mainaut: oModel.oData.UserModel[0].mainaut
            }]
            if (qouta == "quota") {
                var subj;
                UserService.userReq({ MN: "SET", SN: "User", where: "usid=?", userdata: userdata, param: oModel.oData.UserModel[0].usid }).then(function (res) {
                    if (res == "SuccedUpdate") {
                        var msgg;
                        sap.m.MessageToast.show("Your Transaction Took Place With Success");
                        if(_this.byId("absid").getSelectedKey()=="1"){
                            msgg = "<html><body>";
                            msgg += "<b>Dear</b>"+" "+oModel.oData.UserModel[0].fullnametit;
                            msgg+="<br>";
                            msgg+="<p>Thank you for your interest in</p>"+" "+oModel.oData.mhead[0].mhstxt;
                            msgg+="<br>";
                            msgg+="Your fulltext entitled"+ " "+ _this.byId("fttid").getValue().toUpperCase()+" "+"with the reference number"+" "+ "123123"+" "+"has just been"
                            msgg+="<br>"
                            msgg+="successfully uploaded and safely reveived by the editorial office."
                            msgg+="<br>"
                            msgg+="<br>"
                            msgg+="You will be informed after the completion of the review process."
                            msgg+="<br>"
                            msgg+="Sincerely yours,"
                            msgg+="<br>"
                            msgg+="Editorial Office"
                            msgg+="<br>"
                            msgg+="P.S.:Please do not reply.This is an automated e-mail"
                            msgg+="<br>"
                            msgg+="<hr>"
                            msgg+="In compliance with data protection regulations,please contact the editorial office if you would like to"
                            msgg+="<br>"
                            msgg+="have your personal information removed from the database"
                            msgg += "</body></html>";
                            subj="FullText Upload Info"
                        }else if(_this.byId("absid").getSelectedKey()=="2"){
                            msgg = "<html><body>";
                            msgg += "<b>Dear</b>"+" "+oModel.oData.UserModel[0].fullnametit;
                            msgg+="<br>";
                            msgg+="<p>Thank you for your interest in</p>"+" "+oModel.oData.mhead[0].mhstxt;
                            msgg+="<br>";
                            msgg+="Your abstract entitled"+ " "+ _this.byId("titleid").getValue().toUpperCase()+" "+"with the reference number"+" "+ "123123"+" "+"has just been"
                            msgg+="<br>"
                            msgg+="successfully uploaded and safely reveived by the editorial office."
                            msgg+="<br>"
                            msgg+="<br>"
                            msgg+="You will be informed after the completion of the review process."
                            msgg+="<br>"
                            msgg+="Sincerely yours,"
                            msgg+="<br>"
                            msgg+="Editorial Office"
                            msgg+="<br>"
                            msgg+="P.S.:Please do not reply.This is an automated e-mail"
                            msgg+="<br>"
                            msgg+="<hr>"
                            msgg+="In compliance with data protection regulations,please contact the editorial office if you would like to"
                            msgg+="<br>"
                            msgg+="have your personal information removed from the database"
                            msgg += "</body></html>";
                            subj="Abstract  Info"
                        }
                        oModel.setProperty("/fdata", [])
                        _this.byId("fileuploadftext").setValue(' ')
                        _this.byId("fttid").setValue("")
                        _this.byId("titleid").setValue("");
                        _this.byId("ftoid").setSelected(false)
                        _this.byId("ftpstrid").setSelected(false)
                        _this.byId("fttopicid").setSelectedKey("")
                        _this.byId("oralid").setSelected(false)
                        _this.byId("posterid").setSelected(false)
                        _this.byId("topicid").setSelectedKey("");
                        _this.byId("fileUploader").setValue(' ');
                        oModel.setProperty("/authorsuser", []);

                        MailService.AddMail({ systemcheck: [], "maildata": [{ "mail": oModel.oData.UserModel[0].ulgnname, "messega": msgg, subject: subj }] }).then(function (res) {
                            if (res == "None") {
                                CreateComponent.hideBusyIndicator();
                                sap.m.MessageToast.show("sorry there was a mistake when sending mail");
                            } else {
                                CreateComponent.hideBusyIndicator();
                            }
                        })
                        CreateComponent.hideBusyIndicator()
                    } else {
                        CreateComponent.hideBusyIndicator()
                        sap.m.MessageToast.show("an unexpected error has occurred please try again later")
                    }
                })
            } else {
                if (!_this.byId("countryallset").getSelectedKey()) {
                    sap.m.MessageToast.show("please fill in the country field");
                }
                else if (oModel.oData.author.addres.trim() == "") {
                    sap.m.MessageToast.show("please fill in the Address field");
                } else {
                    UserService.userReq({ MN: "SET", SN: "User", where: "usid=?", userdata: userdata, param: oModel.oData.UserModel[0].usid }).then(function (res) {
                        if (res == "SuccedUpdate") {
                            _this.byId("panel0").setVisible(false)
                            _this.byId("panel1").setVisible(true)
                            /*
                            _this.byId("panel2").setVisible(true)
                            _this.byId("panel3").setVisible(true)
                            _this.byId("footerinfo").setVisible(true)*/
                            sap.m.MessageToast.show("Thank you created your information")
                            CreateComponent.hideBusyIndicator()
                        }
                        else {
                            CreateComponent.hideBusyIndicator()
                            sap.m.MessageToast.show("an unexpected error has occurred please try again later")
                        }
                    })
                }
            }
        },
        getPosition: function () {
            PluginService.getPlugin({ SN: "Title", MN: "GETTİTLE" }).then(function (res) {
                oModel.setProperty("/title", res)
            })
        },
        checkfirslogin: function () {
            if (oModel.oData.UserModel[0].country.trim() == "") {
                this.byId("panel0").setVisible(true)
                this.byId("panel1").setVisible(false)
                this.byId("panel2").setVisible(false)
                this.byId("panel3").setVisible(false)
                this.byId("footerinfo").setVisible(false)
            } else {
                this.byId("panel0").setVisible(false)
                this.byId("panel1").setVisible(true)
                this.byId("panel2").setVisible(false)
                this.byId("panel3").setVisible(false)
                this.byId("footerinfo").setVisible(false)
            }
        },
        onRemoveAuthors: function (oEvent) {
            if (oEvent.getParameters("type").type == "removed") {
                oModel.oData.authorsuser.splice(oEvent.getParameters("type").removedTokens[0]._getBindingContext().sPath.split("/")[2], 1)
                oModel.setProperty("/authorsuser", oModel.oData.authorsuser);
            }
        },
        abstractvalidate: function () {
            CreateComponent.showBusyIndicator()
            var _this = this
            if (_this.byId("titleid").getValue().trim() == "") {
                CreateComponent.hideBusyIndicator()
                sap.m.MessageToast.show("please fill in the Title field");
            } else if (_this.byId("oralid").getSelected() == false && _this.byId("posterid").getSelected() == false) {
                CreateComponent.hideBusyIndicator()
                sap.m.MessageToast.show("please fill in the  Presentation Type field");
            } else if (_this.byId("topicid").getSelectedKey() == "") {
                CreateComponent.hideBusyIndicator()
                sap.m.MessageToast.show("please fill in the Topic field");
            }
            else {
                _this.addfile();
            }
        },
        fulltextvalidate: function () {
            CreateComponent.showBusyIndicator()
            var _this = this
            if (_this.byId("fttid").getValue().trim() == "") {
                CreateComponent.hideBusyIndicator()
                sap.m.MessageToast.show("please fill in the Title field");
            } else if (_this.byId("ftoid").getSelected() == false && _this.byId("ftpstrid").getSelected() == false) {
                CreateComponent.hideBusyIndicator()
                sap.m.MessageToast.show("please fill in the  Presentation Type field");
            } else if (_this.byId("fttopicid").getSelectedKey() == "") {
                CreateComponent.hideBusyIndicator()
                sap.m.MessageToast.show("please fill in the Topic field");
            }
            else {
                _this.addfile();
            }
        },
        changetype: function (oEvent) {
            var _this = this
            switch (oEvent.oSource.getSelectedKey()) {
                case "2":
                    _this.byId("fileuploadftext").setValue(' ');
                    delete oModel.oData.authorsuser
                    delete oModel.oData.fdata
                    oModel.refresh();
                    _this.byId("panel3").setVisible(false)
                    _this.byId("panel2").setVisible(true)
                    _this.byId("footerinfo").setVisible(false)
                    _this.getgeneralsettingsfolder("2");
                    break;
                case "1":
                    _this.byId("fileUploader").setValue(' ');
                    delete oModel.oData.authorsuser
                    delete oModel.oData.fdata
                    oModel.refresh();
                    _this.byId("panel2").setVisible(false)
                    _this.byId("panel3").setVisible(true)
                    _this.byId("footerinfo").setVisible(true)
                    _this.getgeneralsettingsfolder("1");
                    break;
            }
        },
        changecount: function (oEvent) {
            var setmodel = oModel.getProperty(oEvent.oSource._getBindingContext().sPath)
            var count = oEvent.oSource.getValue()
            var price = parseFloat(setmodel.fsprice);
            var ltotal = price * count;
            var vato = (ltotal * parseInt(setmodel.vaty)) / 100;
            var vat = vato;
            var totls = ltotal + vat;
            setmodel.total = totls;
            setmodel.total=  setmodel.total.toFixed(2)
            setmodel.vat = vat;
            setmodel.vat=  setmodel.vat.toFixed(2)

            oModel.refresh()
            var totalc = 0;
            var totalvat=0;
            oModel.oData.fees.forEach(function (x) {
                totalvat += parseFloat(x.vat);
            })
            oModel.oData.fees.forEach(function (x) {
                totalc += parseFloat(x.total);
            })
            totalc =  totalc.toFixed(2)
            totalvat=totalvat.toFixed(2)

            oModel.setProperty("/totals", totalc)
            oModel.setProperty("/totalvat", totalvat)
            const total=parseFloat(oModel.oData.totals)
            const vattotal=parseFloat(oModel.oData.totalvat)
            var result=(total-vattotal);
            result =  result.toFixed(2)
            oModel.setProperty("/subtotal",result);
        },
        exportpdf: function () {

            var _this = this
            if (_this.byId("paymentselect").getSelectedKey() == "") {
                sap.m.MessageToast.show("Invalid form of payment");
            } else if (_this.byId("invto").getValue().trim() == "") {
                sap.m.MessageToast.show("Invalid Invoiced");
            } else if (_this.byId("invadres").getValue().trim() == "") {
                sap.m.MessageToast.show("Invalid Invoice Address");
            }
            else if (_this.byId("tno").getValue().trim() == "") {
                sap.m.MessageToast.show("Invalid Trade No");
            }
            else if (_this.byId("vno").getValue().trim() == "") {
                sap.m.MessageToast.show("Invalid VAT No");
            } else {
                oModel.oData.dvisible=false
                oModel.refresh();
                CreateComponent.showBusyIndicator()
                var newmodel=oModel.oData.fees.filter(function(x){
                    return   x.fsquota>0
                })
                oModel.setProperty("/proforma",newmodel);
                window.open("#/Dashboard/Proforma" + "", "_self");
            }
        },
        getpayments: function () {
            PluginService.getPlugin({ SN: "Payments", MN: "GET" }).then(function (res) {
                oModel.setProperty("/payments", res)
            })
        },
        getfee: function (oEvent) {
            PluginService.getPlugin({ SN: "FeeSettings", MN: "GET" }).then(function (res) {
                res.forEach(function (x, i) {
                    if (i == 0) {
                        x.enb = false
                        x.vat = (x.fsprice * x.vaty) / 100;
                        x.vat= x.vat.toFixed(2)
                        x.total = parseFloat(x.fsprice) + parseFloat(x.vat);
                        x.total =  x.total.toFixed(2)
                    } else {
                        x.total = 0
                        x.enb = true;
                    }
                })


                oModel.setProperty("/fees", res)
                oModel.setProperty("/totalvat",oModel.oData.fees[0].vat )
                oModel.setProperty("/totals", oModel.oData.fees[0].total)
                const total=parseFloat(oModel.oData.totals)
                const vattotal=parseFloat(oModel.oData.totalvat)
                var result=(total-vattotal);
                result =  result.toFixed(2)
                oModel.setProperty("/subtotal",result);
            })
        },
        BroadcastType: function () {
            PluginService.getPlugin({ SN: "BroadcastType", MN: "GETTYPE" }).then(function (res) {
                oModel.setProperty("/btype", res)
            })
        },
        gettopics: function () {
            PluginService.getPlugin({ SN: "Topics", MN: "GETTOPİC" }).then(function (res) {
                oModel.setProperty("/topics", res)
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
        getgeneralsettingsfolder: function (data) {
            gsetfolder.gsetfolderreq({ MN: "GETWHERE", SN: "GeneralSetFolder", where: "gsfabstype=?", param: data }).then(function (res) {
                oModel.setProperty("/gtfolder", res);
            })
        },
        getmailhead:function(){
            PluginService.getPlugin({ SN: "MailHeaderSet", MN: "GET" }).then(function (res) {
                oModel.setProperty("/mhead", res)
                CreateComponent.hideBusyIndicator()
            })
        },

        onBeforeShow: function () {
            var _this = this
            UseronLogin.onLogin().then(function (e) {
                _this.setcustomermodel();
                _this.byId("absid").setSelectedKey("");
                var startdate = new Date(moment(oModel.oData.generalsettings[0].gsbegdt, "DD.MM.YYYY"))
                var enddate = new Date(moment(oModel.oData.generalsettings[0].gsenddt, "DD.MM.YYYY"))
                var nowdate = new Date();
                if (oModel.oData.UserModel[0].mainaut == "0") {
                    _this.byId("panel0").setVisible(false)
                } else {
                    _this.byId("panel0").setVisible(true)
                }
                if (startdate < nowdate && startdate < enddate) {

                    _this.gettopics();
                    _this.checkfirslogin();
                    _this.getcountry();
                    _this.getPosition();
                    _this.BroadcastType();
                    _this.getgeneralsettings();
                    _this.getfee();
                    _this.getmailhead();
                    _this.getpayments();
                }
                else {
                    _this.byId("panel0").setVisible(false)
                    _this.byId("panel1").setVisible(false)
                    _this.byId("panel2").setVisible(false)
                    _this.byId("panel3").setVisible(false)
                    _this.byId("footerinfo").setVisible(false)
                    _this.byId("panel00").setVisible(true);
                }
            })
        }
    })
});