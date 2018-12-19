<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class UserMail extends database
{
    public $result = array();
    public function GETMAİL($where)
    {
        if (isset($_SESSION["UNM"])) {
            $mailrows = $this->select("mailtable",$where,array());
            if (count($mailrows) == 0) {
                $this->result[] = array("status" => "None");
                return $this->result;
            } else {
                for ($i = 0; $i < count($mailrows); $i++) {
                    $this->result[] = array("status" => "Okey", "mid" => $mailrows[$i]['mid'], "mail" => $mailrows[$i]['mail'], );
                }
                return $this->result;
            }
        }
    }
    public function SETMAİL($data,$where,$param)
    {
        if (isset($_SESSION["UNM"])) {
            for ($index = 0; $index < count($data); $index++) {
                $sdata = array(
                    "mail"=>$data[$index]['mail'],
                    "uid"=>$data[$index]['uid'],
                );
                $upP = $this->update("mailtable", $sdata, $where, array($param));
            }
            if ($upP) {
                $this->result = array("status" => "SuccedUpdate");
            } else {
                $this->result = array("status" => "None");
            }
        }
        return $this->result;
    }
} ?>