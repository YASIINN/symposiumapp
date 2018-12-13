<?php
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class Login extends database
{
    public $result = array();
    public function LG($unm, $upass)
    {
        $userRows = $this->getrows("SELECT  * FROM usertable u INNER JoIN authoritytable a
            on u.uauth=a.atid 
                where ulgnname=?", array($unm));
        if (count($userRows) == 0) {
            $this->result = array("status" => "None");
             $this->result;
        } else {
            $uid = $userRows[0]['usid'];
            $passRow =$this->getrows("SELECT  * FROM passtable where uid=?", array($uid));
            if (count($passRow) != 0 && $passRow[0]['pass'] != $upass) {
                $this->result = array("status" => "None");
                 $this->result;
            } else {
                for ($i = 0; $i < count($userRows); $i++) {
                    session_start();
                    $this->result[] = array("status" => "Okey", "usid" => $userRows[$i]['usid'], "usname" => $userRows[$i]['usname'], "uslname" => $userRows[$i]["uslname"], "atname" => $userRows[$i]["atname"], "atid" => $userRows[$i]["atid"], "uniorinst" => $userRows[$i]["uniorinst"], "ulgnname" => $userRows[$i]["ulgnname"], "userLT" => time(), );
                }
                $_SESSION["UNM"] = $this->result;
                 $this->result;
            }
        }
        return $this->result;
    }
} ?>