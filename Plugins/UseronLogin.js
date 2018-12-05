jQuery.sap.require("symposiumapp.Application.Login.LoginServicejs.LoginService");
jQuery.sap.require("symposiumapp.Servicejs.SessionService");
var UseronLogin = {
    onLogin: function () {
        debugger
        var deferred = new Promise(function (resolve, reject) {
            var st = sessionStorage.getItem("UNM");
            var ls = localStorage.getItem("UNM")
            if (st && ls) {
                if (st == ls) {
                    UseronLogin.onUserControl(base64.objectDecode(localStorage.getItem("UNM"))).then(function (res) {
                        if (res == false) {
                            UseronLogin.outLogin()
                        } else {
                            UseronLogin.CheckSession().then(function (res) {
                                if (res) {
                                    resolve(res)
                                } else {
                                    UseronLogin.outLogin()
                                }
                            })
                        }
                    })
                }
            } else {
                UseronLogin.outLogin()
            }
        })
        return deferred;
    },
    onUserControl: function (param) {
        debugger
        var deferred = new Promise(function (resolve, reject) {
            // $where, $param
            UserService.userReq({ where:"ulgnname=?" ,"param":[ param.ulgnname], "MN": "GET", 'SN': 'User' }).then(function (res) {
                if (res == "None") {
                    resolve(false);
                    sap.m.MessageToast.show("username or password is incorrect");
                } else {
                    res.forEach(element => {
                        element.fullname = element.usname + " " + element.uslname;
                    });
                    oModel.setProperty("/UserModel", res);
                    localStorage.setItem("UNM", base64.objectEncode(res));
                    sessionStorage.setItem("UNM", base64.objectEncode(res))
                    resolve(true);
                }
                resolve(false)
            })
        })
        return deferred;
    },
    CheckSession: function () {
        debugger
        var deferred = new Promise(function (resolve, reject) {
            SessionService.getSession({ SN: "Session", MN: "GETS" }).then(function (res) {
                if (res) {
                    resolve(true)
                } else {
                    sap.m.MessageToast.show("Oturumunuz Düştü !");
                    resolve(false)
                }
            })
        })
        return deferred;
    },
    outLogin: function () {
        debugger
        SessionService.getSession({ SN: "Session", MN: "DELS" }).then(function (res) {
        })
        CreateComponent.hideBusyIndicator();
        localStorage.clear();
        sessionStorage.clear();
        window.open("/symposiumapp/#/Login", "_self");
    },
    onPass: function (param) {
        debugger
        var deferred = new Promise(function (resolve, reject) {
            loginService.getUserData(param).then(function (res) {
                if (res == "None") {
                    resolve(false)
                    sap.m.MessageToast.show("Şifreniz Onaylanmadı");
                } else {
                    resolve(true);
                }
                resolve(false)
            })
        })
        return deferred;
    },
    onLoginControl: function (param) {
        localStorage.clear();
        sessionStorage.clear();
        var deferred = new Promise(function (resolve, reject) {
            loginService.getUserData(param).then(function (res) {
                if (res == "None") {
                    sap.m.MessageToast.show("username or password is incorrect");
                } else {
                    res.forEach(element => {
                        element.fullname = element.usname + " " + element.uslname;
                    });
                    oModel.setProperty("/UserModel", res);
                    localStorage.setItem("UNM", base64.objectEncode(res));
                    sessionStorage.setItem("UNM", base64.objectEncode(res));
                    resolve(true);
                }
                resolve(false)
            })
        })
        return deferred;
    }
}