<?php
session_start();
require_once('../dbclas/pdocls.php');
header("Content-Type: application/json; charset=UTF-8");
class Phone extends database
{
    public $result = array();
    public function ADD($pdata)
    {
        if (isset($_SESSION["UNM"])) {
            for ($i = 0; $i < count($pdata); $i++) {
                $data = array(
                    "pnmbr" => $pdata[$i]['pnmbr'],
                    "uid" => $pdata[$i]['uid']
                );
                if(null !==$this->beginTransaction()){
                    $this->beginTransaction();
                }
                $addRows = $this->insert('phonetable', $data);
            }
            if ($addRows) {
                $this->result = array("status" => "SuccesAdd");
                $this->result;
                $this->DoOrDie(true);
            } else {
                $this->result = array("status" => "None");
                $this->result;
                $this->DoOrDie(false);
            }

        }
        return $this->result;
    }
    public function SET($data,$where,$param){
        if (isset($_SESSION["UNM"])) {
            for ($index = 0; $index < count($data); $index++) {
                $sdata = array(
                    "pnmbr"=>$data[$index]['pnmbr'],
                    "uid"=>$data[$index]['uid'],
                );
                $upP = $this->update("phonetable", $sdata, $where, array($param));
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