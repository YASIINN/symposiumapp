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
if ($SN == "BroadcastType") {
    include("/BroadcastType/broadcasttype.php");
    $broadcasttype = new $SN();
    $result = $broadcasttype->$MN();
    echo json_encode($result);
}
if ($SN == "Broadcast") {
    include("/Broadcast/broadcast.php");
    $broadcast = new $SN();
    if ($MN == "ADD") {
        $result = $broadcast->$MN($_POST['broadcastdata']);
    }else if($MN=="GET"){
        $result = $broadcast->$MN($_POST['where'],$_POST['param']);
    }
    echo json_encode($result);
}
if ($SN == "Phone") {
    include("/Phone/phone.php");
    $phone = new $SN();
    $result = $phone->$MN($_POST['pdata']);
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
if ($SN == "UserMail") {
    include("/UserMail/usermail.php");
    $usmail = new $SN();
    $result = $usmail->$MN($_POST['where']);
    echo json_encode($result);
}
if ($SN == "Topics") {
    include("/Topics/topics.php");
    $topics = new $SN();
    if ($MN == "DELTOPİC") {
        $result = $topics->$MN($_POST['where'], $_POST['param']);
    } else if ($MN == "GETTOPİC") {
        $result = $topics->$MN();
    } else if ($MN == "EDİTTOPİC") {
        $result = $topics->$MN($_POST['tdata'], $_POST['where'], $_POST['param']);
    } else if ($MN == "ADDTOPİC") {
        $result = $topics->$MN($_POST['tdata']);
    }
    echo json_encode($result);
}
if ($SN == "User") {
    include("/User/user.php");
    $user = new $SN();
    if ($MN == "GET") {
        $result;
        if (isset($_POST['param'])) {
            $result = $_POST['param'];
        } else {
            $result = "not";
        }
        $result = $user->$MN($_POST['where'], $result);
    } else if ($MN == "ADD") {
        $result = $user->$MN($_POST['userdata']);
    }   else if ($MN == "SET") {
        $result = $user->$MN($_POST['userdata'], $_POST['where'], $_POST['param']);
    }else if($MN=="DEL"){
        $result = $user->$MN($_POST['where'], $_POST['param']);
    }
    echo json_encode($result);
}
if($SN=="GeneralSettings"){
    include("/GeneralSettings/generalsettings.php");
    $gsettings = new $SN();
    if($MN=="GETGSETTİNGS"){
        $result = $gsettings->$MN();
    }else if($MN=="SET"){
        $result = $gsettings->$MN($_POST['data'],$_POST['where'],$_POST['param']);
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
    if ($MN == "DELTİTLE") {
        $result = $title->$MN($_POST['where'], $_POST['param']);
    } else if ($MN == "GETTİTLE") {
        $result = $title->$MN();
    }else if($MN=="EDİTTİTLE"){
        $result = $title->$MN($_POST['tdata'], $_POST['where'], $_POST['param']);
    } else if($MN=="ADDTİTLE"){
        $result = $title->$MN($_POST['tdata']);
    }
    echo json_encode($result);
}
if ($SN == "File") {
    include("/File/file.php");
    $file = new $SN();   
   if($MN=="ADD"){
        $result = $file->$MN($_FILES, $_POST['usid'], $_POST['fileext'], $_POST['size'], $_POST['type'],$_POST['bcext']);
    }else if($MN=="DEL"){
        $result=$file->$MN($_POST['where'],$_POST['param'],$_POST['fname']);
    }
    echo json_encode($result);
}
if($SN=="GeneralSetFolder"){
    include("/GeneralSetFolder/generalsetfolder.php");
    $gsfolder = new $SN();
    if($MN=="GET"){
        $result = $gsfolder->$MN();
    }else if($MN=="SET"){
        // data,$where,$param,$prevname){
            $result = $gsfolder->$MN($_POST['data'],$_POST['where'],$_POST['param'],$_POST['prevname']);
    }
    else if($MN=="GETWHERE")
    {
        $result = $gsfolder->$MN($_POST['where'],$_POST['param']);
    } else if($MN=="DEL"){
        $result = $gsfolder->$MN($_POST['where'],$_POST['param'],$_POST['fname']);
    }
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
if ($SN == "Relation") {
    include("/Relation/relation.php");
    $relation = new $SN();
    if ($MN == "ADD") {
        $result = $relation->$MN($_POST['data']);
    }else if($MN=="DEL"){
        $result = $relation->$MN($_POST['where'],$_POST['param']);
    }else if($MN=="GET"){
        $result = $relation->$MN($_POST['where'],$_POST['param']);
    }
    echo json_encode($result);

}

?>