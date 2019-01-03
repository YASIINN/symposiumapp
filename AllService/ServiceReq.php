<?php
header("Content-Type: application/json; charset=UTF-8");
$SN = $_POST['SN'];
$MN = $_POST['MN'];
$result = "";
if ($SN == "Authority") {
    include("Authority/authority.php");
    $authority = new $SN();
    $result = $authority->$MN();
    echo json_encode($result);
}
if($SN=="MailService"){
   include ("MailService/sendmail.php");
    $mailsend = new $SN();
 /*   $hostname,$mailname,$mpassword,$subjectm,$messagem,$maildata*/
    $result = $mailsend->$MN($_POST['hostname'],$_POST['mailname'],$_POST['mpassword'],$_POST['subjectm'],$_POST['messagem'],$_POST['maildata']);
    echo json_encode($result);
}
if($SN=="ProformaImg"){
    include("ProformaImg/proformaimg.php");
    $pimage= new $SN();
    if($MN=="GET"){
        $result = $pimage->$MN();
    }else if($MN=="SET"){
        $result = $pimage->$MN($_POST['data']);
    }else if($MN=="DEL"){
        $result = $pimage->$MN($_POST['where'],$_POST['param']);
    }
    echo json_encode($result);
}
if($SN=="Company"){
    include("Company/company.php");
    $company = new $SN();
    if($MN=="GET"){
        $result = $company->$MN();
    }else if($MN=="SET"){
        $result = $company->$MN($_POST['data'],$_POST['where'],$_POST['param']);
    }
    echo json_encode($result);
}
if($SN=="MailHeaderSet"){
    include("MailHeaderSet/mailheaderset.php");
    $mhset = new $SN();
    if($MN=="GET"){
        $result = $mhset->$MN();
    }else if($MN=="SET"){
        $result = $mhset->$MN($_POST['data'],$_POST['where'],$_POST['param']);
    }
    echo json_encode($result);
}
if ($SN == "BroadcastType") {
    include("BroadcastType/broadcasttype.php");
    $broadcasttype = new $SN();
    $result = $broadcasttype->$MN();
    echo json_encode($result);
}
if ($SN == "Broadcast") {
    include("Broadcast/broadcast.php");
    $broadcast = new $SN();
    if ($MN == "ADD") {
        $result = $broadcast->$MN($_POST['broadcastdata']);
    }else if($MN=="GET"){
        $result;
        if (isset($_POST['param'])) {
            $result = $_POST['param'];
        } else {
            $result = "not";
        }
        $result = $broadcast->$MN($_POST['where'],$result);
    }else if($MN=="SET"){
        $result = $broadcast->$MN($_POST['data'],$_POST['where'],$_POST['param']);
    }
    echo json_encode($result);
}
if ($SN == "Phone") {
    include("Phone/phone.php");
    $phone = new $SN();
    if($MN=="ADD"){
        $result = $phone->$MN($_POST['pdata']);

    }else if($MN=="SET"){
        $result = $phone->$MN($_POST['data'],$_POST['where'],$_POST['param']);
    }
    echo json_encode($result);
}
if ($SN == "Session") {
    include("Session/session.php");
    $session = new $SN();
    if ($MN == "DELS") {
        $result = $session->$MN();
    } else {
        $result = $session->$MN();
    }
    echo json_encode($result);
}
if($SN=="FeeSettings"){
    include("FeeSettings/feesettings.php");
    $feeset = new $SN();
    if($MN=="GET"){
        $result = $feeset->$MN();
    }else if($MN=="DEL"){
        $result = $feeset->$MN($_POST['where'],$_POST['param']);
    }else if($MN=="SET"){
        $result = $feeset->$MN($_POST['data'],$_POST['where'],$_POST['param']);
    }else if($MN=="ADD"){
        $result = $feeset->$MN($_POST['data']);
    }
    echo json_encode($result);
}
if($SN=="Currency"){
    include("Currency/currency.php");
    $currency = new $SN();
    if($MN=="GET"){
        $result = $currency->$MN();
    }else if($MN=="DEL"){
        $result = $currency->$MN($_POST['where'],$_POST['param']);
    }else if($MN=="SET"){
        $result = $currency->$MN($_POST['data'],$_POST['where'],$_POST['param']);
    }else if($MN=="ADD"){
        $result = $currency->$MN($_POST['data']);
    }
    echo json_encode($result);
}
if($SN=="Payments"){
    include("Payments/payments.php");
    $payments = new $SN();
    if($MN=="GET"){
        $result = $payments->$MN();
    }else if($MN=="DEL"){
        $result = $payments->$MN($_POST['where'],$_POST['param']);
    }else if($MN=="SET"){
        $result = $payments->$MN($_POST['data'],$_POST['where'],$_POST['param']);
    }else if($MN=="ADD"){
        $result = $payments->$MN($_POST['data']);
    }
    echo json_encode($result);
}
if($SN=="HeaderSettings"){
    include("HeaderSettings/headersettings.php");
    $hsetting = new $SN();
    if($MN=="GET"){
        $result = $hsetting->$MN();
    }else if($MN=="SET"){
        $result = $hsetting->$MN($_POST['data']);
    }
    else if($MN=="DEL"){
        $result = $hsetting->$MN($_POST['where'],$_POST['param']);
    }
    echo json_encode($result);
}
if ($SN == "UserMail") {
    include("UserMail/usermail.php");
    $usmail = new $SN();
    if($MN=="SETMAİL"){
        $result = $usmail->$MN($_POST['data'],$_POST['where'],$_POST['param']);
    }else if($MN=="GETMAİL"){
    $result = $usmail->$MN($_POST['where']);
    }
    echo json_encode($result);
}
if ($SN == "Topics") {
    include("Topics/topics.php");
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
    include("User/user.php");
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
        $result;
        if (isset($_POST['param'])) {
            $result = $_POST['param'];
        } else {
            $result = "not";
        }
        $result = $user->$MN($_POST['where'], $result);
    }
    echo json_encode($result);
}
if($SN=="GeneralSettings"){
    include("GeneralSettings/generalsettings.php");
    $gsettings = new $SN();
    if($MN=="GETGSETTİNGS"){
        $result = $gsettings->$MN();
    }else if($MN=="SET"){
        $result = $gsettings->$MN($_POST['data'],$_POST['where'],$_POST['param']);
    }
    echo json_encode($result);
}
if ($SN == "Login") {
    include("Login/login.php");
    $login = new $SN();
    $result = $login->$MN($_POST['name'], $_POST['pass']);
    echo json_encode($result);
}
if($SN=="ArticleMail"){
    include("ArticleMail/articlemail.php");
    $artmail = new $SN();
    if ($MN == "GET") {
        $result = $artmail->$MN();
    }else if($MN=="SET"){
        $result = $artmail->$MN($_POST['data'],$_POST['where'],$_POST['param']);
    }
    echo json_encode($result);

}
if ($SN == "Title") {
    include("Title/title.php");
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
    include("File/file.php");
    $file = new $SN();   
   if($MN=="ADD"){
        $result = $file->$MN($_FILES, $_POST['usid'], $_POST['fileext'], $_POST['size'], $_POST['type'],$_POST['bcext'],$_POST['abstype']);
    }else if($MN=="DEL"){
        $result=$file->$MN($_POST['where'],$_POST['param'],$_POST['fname']);
    }else if($MN=="SET"){
        $result = $file->$MN($_FILES, $_POST['usid'], $_POST['fileext'], $_POST['size'], $_POST['type'],$_POST['bcext'],$_POST['delfile'],$_POST['where'],$_POST['param'],$_POST['abstype']);
    }
    echo json_encode($result);
}
if($SN=="GeneralSetFolder"){
    include("GeneralSetFolder/generalsetfolder.php");
    $gsfolder = new $SN();
    if($MN=="GET"){
        $result = $gsfolder->$MN();
    }else if($MN=="SET"){
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
if($SN=="Generalsetmail"){
    include("Generalsetmail/generalsetmail.php");
    $gsmail = new $SN();
    if ($MN == "GET") {
        $result = $gsmail->$MN();
    }else if($MN=="SET"){
        $result = $gsmail->$MN($_POST['data'],$_POST['where'],$_POST['param']);
    }
    echo json_encode($result);
}
if ($SN == "Register") {
    include("Register/register.php");
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
    include("Relation/relation.php");
    $relation = new $SN();
    if ($MN == "ADD") {
        $result = $relation->$MN($_POST['data']);
    }else if($MN=="DEL"){
        $result = $relation->$MN($_POST['where'],$_POST['param']);
    }else if($MN=="GET"){
        $result = $relation->$MN($_POST['where'],$_POST['param']);
    }else if($MN=="GETW"){
        $result = $relation->$MN($_POST['where']);
    }
    echo json_encode($result);

}


?>