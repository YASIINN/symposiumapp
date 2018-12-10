<?php
header("Content-Type: application/json; charset=UTF-8");
$SN = $_POST['SN'];
$MN = $_POST['MN'];
$result = "";
if ($SN == "Authority") {
    include("/Authority/authority.php");
    $authority = new $SN();
    $result = $authority->$MN();
    echo json_encode($result);
}
if($SN=="BroadcastType"){
    include("/BroadcastType/broadcasttype.php");
    $broadcasttype = new $SN();
    $result = $broadcasttype->$MN();
    echo json_encode($result);
}
if ($SN == "Session") {
    include("/Session/session.php");
    $session = new $SN();
    if ($MN == "DELS") {
        $result = $session->$MN();
    } else {
        $result = $session->$MN();
    }
    echo json_encode($result);
}
if ($SN == "User") {
    include("/User/user.php");
    $user = new $SN();
    if ($MN == "GET") {
        $result = $user->$MN($_POST['where'], $_POST['param']);
    } else if ($MN == "ADD") {
        $result = $user->$MN($_POST['userdata']);
    } else if ($MN == "GAUW") {
        $result = $user->$MN($_POST['uwhere'], $_POST['uparam'], $_POST['mwhere'], $_POST['mparam'], $_POST['pwhere'], $_POST['pparam']);
    } else if ($MN == "ADDRU") {
        $result = $user->$MN($_POST['userdata']);
    } else if ($MN == "GETPU") {
        $result = $user->$MN($_POST['pass']);
    } else if ($MN == "SETQUOTA") {
        if (isset($_POST['param'])) {
            $issetparam = $_POST['param'];
        } else {
            $issetparam = "";
        }
        $result = $user->$MN($issetparam, $_POST['where'], $_POST['userdata']);
    }
    echo json_encode($result);
}
if ($SN == "Login") {
    include("/Login/login.php");
    $login = new $SN();
    $result = $login->$MN($_POST['name'], $_POST['pass']);
    echo json_encode($result);
}
if ($SN == "Title") {
    include("/Title/title.php");
    $title = new $SN();
    $result = $title->$MN();
    echo json_encode($result);
}
if($SN=="File"){
    include("/File/file.php");
    $title = new $SN();
    $result = $title->$MN();
    echo json_encode($result);
}
if ($SN == "Register") {
    include("/Register/register.php");
    $register = new $SN();
    if ($MN == "ADD") {
        $result = $register->$MN($_POST['registerdata']);
    } else if ($MN == "GET") {
        $result = $register->$MN($_POST['where'], $_POST['param']);
    } else if ($MN == "DEL") {
        $issetparam = "";
        if (isset($_POST['param'])) {
            $issetparam = $_POST['param'];
        } else {
            $issetparam = "";
        }
        $result = $register->$MN($_POST['where'], $issetparam);
    } else if ($MN == "DELALL") {
        $result = $register->$MN();
    }
    echo json_encode($result);
}
if ($SN == "SystemSettings") {
    include("/SystemSettings/systemsettings.php");
    $settings = new $SN();
    if ($MN == "SETSYS") {
        $result = $settings->$MN($_POST['param']);
    } else if ($MN == "GETSYS") {
        $result = $settings->$MN();
    }
    echo json_encode($result);
}

?>