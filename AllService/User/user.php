<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class User extends database
{
    public $result = array();
    public function GET($where, $param)
    {
        $fparam = array();
        for ($index = 0; $index < count($param); $index++) {
            array_push($fparam, $param[$index]);
        }
        $getRegisterRows = $this->getrows("SELECT * FROM usertable u 
        INNER JOIN  titletable t ON u.tid=t.tid 
        INNER JOIN authoritytable a ON u.uauth=a.atid
        INNER JOIN phonetable p ON p.uid=u.usid
        INNER JOIN passtable pa ON pa.uid=u.usid
         WHERE $where
        ", $fparam);
        //  $this->select("usertable", $where, $fparam);
        if (count($getRegisterRows) == 0) {
            $this->result = array("status" => "None");
            return $this->result;
        } else {
            for ($i = 0; $i < count($getRegisterRows); $i++) {
                $this->result[] = array(
                    "status" => "Okey", "usid" =>
                        $getRegisterRows[$i]['usid'],
                    "usname" => $getRegisterRows[$i]['usname'],
                    "uslname" => $getRegisterRows[$i]["uslname"],
                    "ulgnname" => $getRegisterRows[$i]['ulgnname'],
                    "uniorinst" => $getRegisterRows[$i]['uniorinst'],
                    "country" => $getRegisterRows[$i]['country'],
                    "tid" => $getRegisterRows[$i]['tid'],
                    "uauth" => $getRegisterRows[$i]['uauth'],
                    "atname" => $getRegisterRows[$i]['atname'],
                    "titletxt" => $getRegisterRows[$i]['titletxt'],
                    "adress" => $getRegisterRows[$i]['adress'],
                    "ftextquota" => $getRegisterRows[$i]['ftextquota'],
                    "absquota" => $getRegisterRows[$i]['absquota'],
                    "pnmbr" => $getRegisterRows[$i]['pnmbr'],
                    "axp" => $getRegisterRows[$i]['pass'],
                );
            }
            return $this->result;
        }
    }
    public function ADD($userdata)
    {
        for ($i = 0; $i < count($userdata); $i++) {
            $data = array(
                "usname" => $userdata[$i]['usname'],
                "uslname" => $userdata[$i]['uslname'],
                "uauth" => $userdata[$i]['uauth'],
                "uniorinst" => $userdata[$i]['uniorinst'],
                "ulgnname" => $userdata[$i]['ulgnname'],
                "country" => $userdata[$i]['country'],
                "tid" => $userdata[$i]['tid'],
                "adress" => $userdata[$i]['adress'],
                "ftextquota" => $userdata[$i]['ftextquota'],
                "absquota" => $userdata[$i]['absquota'],
                "mainaut" => $userdata[$i]['mainaut'],
            );
            $addRows = $this->insert('usertable', $data);
            $userRows = $this->getrows("SELECT  * FROM usertable  where ulgnname=?", array($userdata[$i]['ulgnname']));
            $uid = $userRows[0]['usid'];

            if ($addRows) {
                $data = array(
                    "pass" => $userdata[$i]['upass'],
                    "uid" => $uid
                );
                $addpassRows = $this->insert('passtable', $data);
                if ($addpassRows) {
                    $data = array(
                        "mail" => $userdata[$i]['mail'],
                        "uid" => $uid
                    );
                    $addmailRows = $this->insert('mailtable', $data);
                    if ($addmailRows) {
                        if (isset($userdata[0]['pnmbr'])) {
                            $data = array(
                                "pnmbr" => $userdata[$i]['pnmbr'],
                                "uid" => $uid
                            );
                            $addphoneRows = $this->insert("phonetable", $data);
                            if ($addphoneRows) {
                                    $this->result[] = array("status" => "SuccesAdd", "usid" => $userRows);
                            } else {
                                $this->result = array("status" => "None");
                            }
                        } else {
                            $this->result = array("status" => "SuccesAdd", "usid" => $uid);
                        }
                    } else {
                        $this->result = array("status" => "None");
                    }
                } else {
                    $this->result = array("status" => "None");
                }
            } else {
                $this->result = array("status" => "None");
            }


        }
        return $this->result;

    }
    public function SET($userdata, $where, $param)
    {
        if (isset($_SESSION["UNM"])) {
            for ($index = 0; $index < count($userdata); $index++) {
                $data = array(
                    "country" => $userdata[$index]['country'],
                    "tid" => $userdata[$index]['tid'],
                    "adress" => $userdata[$index]['adress'],
                );
                $upP = $this->update("usertable", $data, $where, array($param));
            }
            if ($upP) {
                $this->result = array("status" => "SuccedUpdate");
                return $this->result;
            } else {
                $this->result = array("status" => "None");
                return $this->result;
            }
        }
    }




    public function GAUW($uwhere, $uparam, $mwhere, $mparam, $pwhere, $pparam)
    {
        if (isset($_SESSION["UNM"])) {
            $userWhereRows = $this->getrows("SELECT  * FROM user WHERE $uwhere", array($uparam));
            {
                if (count($userWhereRows) == 0) {
                    $mailWhereRows = $this->getrows("SELECT  * FROM mail WHERE $mwhere", array($mparam));
                    if (count($mailWhereRows) == 0) {
                        $phoneWhereRows = $this->getrows("SELECT  * FROM phone WHERE $pwhere", array($pparam));
                        if (count($phoneWhereRows) == 0) {
                            $this->result = array("status" => "None");
                            return $this->result;
                        } else {
                            $this->result = array("status" => "haveP");
                            return $this->result;
                        }
                    } else {
                        $this->result = array("status" => "haveM");
                        return $this->result;
                    }
                } else {
                    $this->result = array("status" => "haveUNM");
                    return $this->result;
                }
            }
        }
    }
    public function SETQUOTA($param, $where, $userdata)
    {
        if (isset($_SESSION["UNM"])) {
            for ($index = 0; $index < count($userdata); $index++) {
                $data = array(
                    "quotaremain" => $userdata[$index]['quotaremain']
                );
            }
            $updatequota = $this->update("user", $data, $where, array($param));
            if ($updatequota) {
                $this->result = array("status" => "SuccedUpdate");
                return $this->result;
            } else {
                $this->result = array("status" => "None");
                return $this->result;
            }
        }
    }
}
?>