<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class User extends database
{
    public $result = array();
    public function GETUL($tid)
    {
        if (isset($_SESSION["UNM"])) {
            $userLayoutRows = $this->getrows("SELECT  * FROM layout
                    where tid=?", array($tid));
            if (count($userLayoutRows) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($userLayoutRows); $i++) {
                    $this->result[] = array("status" => "Okey", "lid" => $userLayoutRows[$i]['lid'], "lynm" => $userLayoutRows[$i]['lynm'], "lyrouter" => $userLayoutRows[$i]["lyrouter"], "tid" => $userLayoutRows[$i]["tid"], );
                }
                return $this->result;
            }
        }
    }
    public function GET($where, $param)
    {
        $fparam = array();
        for ($index = 0; $index < count($param); $index++) {
            array_push($fparam, $param[$index]);
        }
        $getRegisterRows = $this->select("usertable", $where, $fparam);
        if (count($getRegisterRows) == 0) {
            $this->result = array("status" => "None");
            return $this->result;
        } else {
            for ($i = 0; $i < count($getRegisterRows); $i++) {
                $this->result[] = array("status" => "Okey", "usid" => $getRegisterRows[$i]['usid'], "usname" => $getRegisterRows[$i]['usname'], "uslname" => $getRegisterRows[$i]["uslname"]  ,"ulgnname" =>$getRegisterRows[$i]['ulgnname']);
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
            );
            $addRows = $this->insert('usertable', $data);
        }
        if ($addRows) {
            $userRows = $this->getrows("SELECT  * FROM usertable  where ulgnname=?", array($userdata[0]['ulgnname']));
            $uid = $userRows[0]['usid'];
            $data = array(
                "pass" => $userdata[0]['upass'],
                "uid" => $uid
            );
            $addpassRows = $this->insert('passtable', $data);
            if ($addpassRows) {
                $data = array(
                    "mail" => $userdata[0]['mail'],
                    "uid" => $uid
                );
                $addmailRows = $this->insert('mailtable', $data);
                if ($addmailRows) {
                    $this->result = array("status" => "SuccesAdd", "usid" => $uid);
                    return $this->result;
                } else {
                    $this->result = array("status" => "None");
                    return $this->result;
                }
            } else {
                $this->result = array("status" => "None");
                return $this->result;
            }
        } else {
            $this->result = array("status" => "None");
            return $this->result;
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
    public function GETPU($pass)
    {
        if (isset($_SESSION["UNM"])) {
            $upassrows = $this->getrows("SELECT  * FROM pass p
            INNER JOIN user u on p.uid=u.uid
             WHERE  pass=?", array($pass));
            if (count($upassrows) == 0) {
                $this->result = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($upassrows); $i++) {
                    $this->result[] = array("Status" => "Okey", "uid" => $upassrows[$i]['uid'], "ufnm" => $upassrows[$i]['ufnm'], "ulnm" => $upassrows[$i]["ulnm"], "unm" => $upassrows[$i]["unm"], "upnt" => $upassrows[$i]["upnt"], "usno" => $upassrows[$i]["usno"], "tid" => $upassrows[$i]["tid"], "uauthr" => $upassrows[$i]["uauthr"]);
                }
                return $this->result;
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